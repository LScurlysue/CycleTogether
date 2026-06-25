// server/server.js — CycleTogether FCM Backend
// ─────────────────────────────────────────────────────────────────────────────
// Stores partner FCM tokens and sends a daily "How to support her" push
// notification to every registered partner device at a scheduled time.
//
// QUICK START
// ───────────
//  1. cp .env.example .env  and fill in your Firebase service-account values
//  2. npm install
//  3. node server.js        (or: npm start)
//
// ENVIRONMENT VARIABLES (see .env.example)
//  FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL,
//  FIREBASE_PRIVATE_KEY_ID, FIREBASE_CLIENT_ID,
//  CRON_SCHEDULE   — cron expression for the daily job  (default "0 9 * * *" = 9 am UTC)
//  PORT            — HTTP port                          (default 3000)
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const cron      = require('node-cron');
const admin     = require('firebase-admin');
const fs        = require('fs');
const path      = require('path');

// ─── Firebase Admin initialisation ──────────────────────────────────────────
// Reads credentials from environment variables set in .env
const serviceAccount = {
  type:                        'service_account',
  project_id:                  process.env.FIREBASE_PROJECT_ID,
  private_key_id:              process.env.FIREBASE_PRIVATE_KEY_ID,
  // .env stores \n as a literal backslash-n — restore real newlines
  private_key:                 (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email:                process.env.FIREBASE_CLIENT_EMAIL,
  client_id:                   process.env.FIREBASE_CLIENT_ID,
  auth_uri:                    'https://accounts.google.com/o/oauth2/auth',
  token_uri:                   'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:        `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL || '')}`,
};

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const messaging = admin.messaging();

// ─── Token store (simple JSON file) ─────────────────────────────────────────
const TOKENS_FILE = path.join(__dirname, 'tokens.json');

function loadTokens() {
  try {
    if (fs.existsSync(TOKENS_FILE)) {
      return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('[tokens] Failed to read tokens.json:', e.message);
  }
  return {};
}

function saveTokens(tokens) {
  try {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
  } catch (e) {
    console.error('[tokens] Failed to write tokens.json:', e.message);
  }
}

// ─── Cycle calculation (ported from frontend script.js) ──────────────────────

function parseISODate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function diffDays(a, b) {
  const ms = new Date(a.getFullYear(), a.getMonth(), a.getDate())
           - new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round(ms / 86400000);
}

/**
 * Compute today's cycle info from stored token data.
 * Returns { cycleDay, cycleLength, phaseKey } or null if data is missing.
 */
function getCycleInfo(tokenData, forDate) {
  const { lastPeriodDate, cycleLength = 28, periodLength = 5 } = tokenData;
  const lastStart = parseISODate(lastPeriodDate);
  if (!lastStart) return null;

  const today = forDate || new Date();
  const cl    = Number(cycleLength) || 28;
  const pl    = Number(periodLength) || 5;

  const diff     = diffDays(today, lastStart);
  const cycleDay = ((diff % cl) + cl) % cl + 1;

  const ovulationDay   = Math.max(cl - 14, pl + 1);
  const ovulationStart = Math.max(ovulationDay - 1, 1);
  const ovulationEnd   = ovulationDay + 1;
  const pmsStart       = cl - 4;

  let phaseKey;
  if (cycleDay <= pl) {
    phaseKey = cycleDay <= Math.max(1, Math.floor(pl / 2)) ? 'menstrualEarly' : 'menstrualLate';
  } else if (cycleDay >= ovulationStart && cycleDay <= ovulationEnd) {
    phaseKey = 'ovulation';
  } else if (cycleDay < ovulationStart) {
    const follicularMid = Math.floor((pl + 1 + (ovulationStart - 1)) / 2);
    phaseKey = cycleDay <= follicularMid ? 'follicularEarly' : 'follicularLate';
  } else if (cycleDay >= pmsStart) {
    phaseKey = 'pms';
  } else {
    const lutealMid = Math.floor((ovulationEnd + 1 + (pmsStart - 1)) / 2);
    phaseKey = cycleDay <= lutealMid ? 'lutealEarly' : 'lutealLate';
  }

  return { cycleDay, cycleLength: cl, phaseKey };
}

// ─── Phase content (icon, label, partner "how to support" messages) ──────────
// Matches the icons and text used in the frontend (script.js / PARTNER_ALERTS).

const PHASE_META = {
  menstrualEarly: { icon: '🌑', en: 'Period (early)',        uk: 'Місячні (початок)' },
  menstrualLate:  { icon: '🌒', en: 'Period (tapering off)', uk: 'Місячні (закінчуються)' },
  follicularEarly:{ icon: '🌱', en: 'Early follicular',      uk: 'Рання фолікулярна' },
  follicularLate: { icon: '🌼', en: 'Late follicular',       uk: 'Пізня фолікулярна' },
  ovulation:      { icon: '🌟', en: 'Ovulation',             uk: 'Овуляція' },
  lutealEarly:    { icon: '🍃', en: 'Early luteal',          uk: 'Рання лютеїнова' },
  lutealLate:     { icon: '🍂', en: 'Late luteal',           uk: 'Пізня лютеїнова' },
  pms:            { icon: '🌀', en: 'PMS (pre-period)',      uk: 'ПМС (перед місячними)' },
};

const PARTNER_MESSAGES = {
  en: {
    menstrualEarly:  "Her period just started and energy is low. Maybe handle dinner, grab a heating pad, and keep things low-key tonight.",
    menstrualLate:   "Period's tapering off — she may have a bit more energy back, but no need to push plans either way.",
    follicularEarly: "She's likely feeling calmer and more recovered today. A good day for easy plans together.",
    follicularLate:  "Energy and mood are on the rise — a great window for that date, trip, or big conversation you've been holding onto.",
    ovulation:       "Peak energy and confidence day. She's likely feeling great — good day for something fun together.",
    lutealEarly:     "She may want more quiet time than usual. Don't take it personally if she's a bit more focused or low-key.",
    lutealLate:      "Energy may be dipping a bit earlier in the evening and she may lean toward familiar routines. Just go with the slower pace.",
    pms:             "PMS phase has started — bring snacks, give extra patience, and maybe don't pick fights today. Small kindnesses go a long way.",
  },
  uk: {
    menstrualEarly:  "У неї щойно почалися місячні, і енергії мало. Можливо, варто взяти на себе вечерю, знайти грілку і провести вечір спокійно.",
    menstrualLate:   "Місячні вже закінчуються — енергії може бути трохи більше, але не варто наполягати на планах.",
    follicularEarly: "Сьогодні вона, ймовірно, почувається спокійнішою і відновленою. Гарний день для легких спільних планів.",
    follicularLate:  "Енергія і настрій ростуть — чудовий момент для побачення, поїздки чи важливої розмови.",
    ovulation:       "День пікової енергії й впевненості. Їй, ймовірно, дуже добре — хороший день для чогось веселого разом.",
    lutealEarly:     "Можливо, їй захочеться більше тиші. Не сприймай це особисто, якщо вона стане трохи зосередженішою чи спокійнішою.",
    lutealLate:      "Енергія може спадати трохи раніше ввечері, і її тягне до звичних речей. Просто підлаштуйся до повільнішого темпу.",
    pms:             "Почалася фаза ПМС — захопи смаколики, май більше терпіння і, можливо, не провокуй конфлікти сьогодні.",
  },
};

// ─── Build FCM message for one token ─────────────────────────────────────────
function buildFCMMessage(token, tokenData) {
  const info = getCycleInfo(tokenData);
  if (!info) return null;

  const { phaseKey, cycleDay, cycleLength } = info;
  const lang  = tokenData.lang === 'uk' ? 'uk' : 'en';
  const meta  = PHASE_META[phaseKey];
  const label = meta ? meta[lang]   : phaseKey;
  const icon  = meta ? meta.icon    : '🌸';
  const body  = (PARTNER_MESSAGES[lang] || PARTNER_MESSAGES.en)[phaseKey] || '';

  const isUk       = lang === 'uk';
  const cycleDayStr = isUk
    ? `День ${cycleDay} з ${cycleLength}-денного циклу`
    : `Day ${cycleDay} of ${cycleLength}-day cycle`;
  const actionTitle = isUk ? 'Повний інсайт дня →' : "See today's full insight →";

  return {
    token,
    notification: {
      title: `CycleTogether ${icon}  ${label}`,
      body:  `${cycleDayStr}\n\n${body}`,
    },
    webpush: {
      headers: { Urgency: 'normal' },
      notification: {
        icon:  '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag:   'partner-daily',
        actions: [{ action: 'open', title: actionTitle }],
      },
      fcmOptions: { link: '/' },
      // Pass structured data so the SW can also reconstruct the notification
      data: {
        title:       `CycleTogether ${icon}  ${label}`,
        body:        `${cycleDayStr}\n\n${body}`,
        tag:         'partner-daily',
        actionTitle,
        openUrl:     '/',
      },
    },
  };
}

// ─── Daily cron job ───────────────────────────────────────────────────────────
// Default: 9:00 am UTC every day. Override with CRON_SCHEDULE env var.
// Examples:
//   "0 7 * * *"  = 7am UTC
//   "0 9 * * *"  = 9am UTC  (default)
//   "0 18 * * *" = 6pm UTC

const cronSchedule = process.env.CRON_SCHEDULE || '0 9 * * *';
console.log(`[cron] Daily partner notifications scheduled: "${cronSchedule}"`);

cron.schedule(cronSchedule, async () => {
  console.log('[cron] Sending daily partner notifications…');
  const tokens = loadTokens();
  const entries = Object.entries(tokens);

  if (!entries.length) {
    console.log('[cron] No registered tokens — nothing to send.');
    return;
  }

  let sent = 0;
  let failed = 0;
  const tokensToRemove = [];

  for (const [token, tokenData] of entries) {
    const message = buildFCMMessage(token, tokenData);
    if (!message) {
      console.warn(`[cron] Skipping token (no cycle data): ${token.slice(0, 12)}…`);
      continue;
    }

    try {
      await messaging.send(message);
      sent++;
    } catch (err) {
      failed++;
      console.error(`[cron] Send failed for ${token.slice(0, 12)}…: ${err.message}`);

      // Remove tokens that are no longer valid
      if (
        err.code === 'messaging/registration-token-not-registered' ||
        err.code === 'messaging/invalid-registration-token'
      ) {
        tokensToRemove.push(token);
      }
    }
  }

  // Clean up expired tokens
  if (tokensToRemove.length) {
    const fresh = loadTokens();
    tokensToRemove.forEach((t) => delete fresh[t]);
    saveTokens(fresh);
    console.log(`[cron] Removed ${tokensToRemove.length} expired token(s).`);
  }

  console.log(`[cron] Done. Sent: ${sent}, failed: ${failed}.`);
});

// ─── Express API ─────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use(cors({
  // Restrict to your app's origin in production, e.g.:
  // origin: 'https://yourapp.github.io'
  origin: '*',
}));

/**
 * POST /register-token
 * Register (or update) a partner device's FCM token and cycle data.
 *
 * Body: {
 *   fcmToken:       string   (required) — FCM registration token from the browser
 *   lastPeriodDate: string   (optional) — ISO date "YYYY-MM-DD"
 *   cycleLength:    number   (optional, default 28)
 *   periodLength:   number   (optional, default 5)
 *   lang:           string   (optional, "en" or "uk")
 * }
 */
app.post('/register-token', (req, res) => {
  const { fcmToken, lastPeriodDate, cycleLength, periodLength, lang } = req.body;

  if (!fcmToken || typeof fcmToken !== 'string') {
    return res.status(400).json({ error: 'fcmToken (string) is required' });
  }

  const tokens = loadTokens();
  tokens[fcmToken] = {
    lastPeriodDate: lastPeriodDate || null,
    cycleLength:    Number(cycleLength)  || 28,
    periodLength:   Number(periodLength) || 5,
    lang:           lang === 'uk' ? 'uk' : 'en',
    registeredAt:   new Date().toISOString(),
  };
  saveTokens(tokens);

  console.log(`[api] Token registered: ${fcmToken.slice(0, 12)}… lang=${lang}`);
  res.json({ ok: true });
});

/**
 * POST /update-cycle
 * Update cycle data for an existing token (e.g. after the partner refreshes their share code).
 * Same body as /register-token — upserts.
 */
app.post('/update-cycle', (req, res) => {
  // Same logic as register — upsert
  req.url = '/register-token';
  app._router.handle(req, res, () => {});
});

/**
 * DELETE /unregister-token
 * Remove a token (e.g. when the partner unsubscribes from notifications).
 * Body: { fcmToken: string }
 */
app.delete('/unregister-token', (req, res) => {
  const { fcmToken } = req.body;
  if (!fcmToken) return res.status(400).json({ error: 'fcmToken required' });

  const tokens = loadTokens();
  if (tokens[fcmToken]) {
    delete tokens[fcmToken];
    saveTokens(tokens);
    console.log(`[api] Token unregistered: ${fcmToken.slice(0, 12)}…`);
  }
  res.json({ ok: true });
});

/**
 * POST /send-test
 * Send an immediate test notification to a specific token.
 * Useful for verifying the setup without waiting for the cron job.
 * Body: { fcmToken: string }
 */
app.post('/send-test', async (req, res) => {
  const { fcmToken } = req.body;
  if (!fcmToken) return res.status(400).json({ error: 'fcmToken required' });

  const tokens = loadTokens();
  const tokenData = tokens[fcmToken];
  if (!tokenData) return res.status(404).json({ error: 'Token not found — register first' });

  const message = buildFCMMessage(fcmToken, tokenData);
  if (!message) return res.status(422).json({ error: 'No cycle data for this token' });

  // Override title for test clarity
  message.notification.title = `[Test] ${message.notification.title}`;

  try {
    await messaging.send(message);
    res.json({ ok: true, sent: true });
  } catch (err) {
    console.error('[api] Test send failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/** GET /health — simple health check */
app.get('/health', (req, res) => {
  const tokens = loadTokens();
  res.json({
    ok:             true,
    registeredTokens: Object.keys(tokens).length,
    cronSchedule,
    time:           new Date().toISOString(),
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CycleTogether server running on http://localhost:${PORT}`);
  console.log(`  GET  /health`);
  console.log(`  POST /register-token`);
  console.log(`  POST /update-cycle`);
  console.log(`  POST /send-test`);
  console.log(`  DELETE /unregister-token`);
});
