// notifications.js — PeakPhase Notification Manager
// Loaded after script.js and dailyInsights.js; uses their globals directly.

const NOTIF_PREF_KEY   = 'peakphase_notifPrefs';
const NOTIF_CHECK_KEY  = 'peakphase_lastOwnerNotifCheck';

window.NotifManager = {

  /* ─────────────────────────────────────────────
     Preferences
  ───────────────────────────────────────────── */
  defaultPrefs() {
    return {
      periodReminder:    true,   // 3 days + 1 day before period
      ovulationReminder: true,   // 1 day before + day-of ovulation window
      pmsHeadsUp:        true,   // 2 days + 1 day before PMS
    };
  },

  loadPrefs() {
    try {
      const raw = localStorage.getItem(NOTIF_PREF_KEY);
      if (!raw) return this.defaultPrefs();
      return { ...this.defaultPrefs(), ...JSON.parse(raw) };
    } catch {
      return this.defaultPrefs();
    }
  },

  savePrefs(prefs) {
    localStorage.setItem(NOTIF_PREF_KEY, JSON.stringify(prefs));
  },

  /* ─────────────────────────────────────────────
     Service Worker registration
  ───────────────────────────────────────────── */
  async registerSW() {
    if (!('serviceWorker' in navigator)) return null;
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      return reg;
    } catch (e) {
      console.warn('[PeakPhase] SW registration failed:', e);
      return null;
    }
  },

  /* ─────────────────────────────────────────────
     Core: show a notification via SW (supports
     action buttons) with a plain Notification fallback
  ───────────────────────────────────────────── */
  async show(title, body, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const notifOptions = {
      body,
      icon:             './icons/icon-192.png',
      badge:            './icons/icon-192.png',
      requireInteraction: false,
      ...options,
    };

    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, notifOptions);
        return;
      }
    } catch {}

    // Fallback: basic browser Notification (no action buttons)
    new Notification(title, {
      body,
      icon: './icons/icon-192.png',
      tag:  options.tag || 'peakphase',
    });
  },

  /* ─────────────────────────────────────────────
     PARTNER DAILY NOTIFICATION
     Body = "How to support her" from PARTNER_INSIGHTS
     Action button opens the full in-app Today view
  ───────────────────────────────────────────── */
  async checkPartnerDailyNotification() {
    if (typeof state === 'undefined') return;
    if (!state.isPartnerDevice || !state.partnerPremium) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const todayISO = formatISO(toDateOnly(new Date()));
    if (state.lastPartnerAlertDate === todayISO) return;

    const today = toDateOnly(new Date());
    const info  = getCycleInfo(today);
    if (!info) return;

    const lang  = (typeof LANG !== 'undefined') ? LANG : 'en';
    const isEN  = lang !== 'uk';
    const phase = getPhaseNote(info.phaseKey);
    const dict  = (typeof UI_STRINGS !== 'undefined') ? (UI_STRINGS[lang] || UI_STRINGS.en) : {};

    // Pull rich partner insight for today's cycle day
    const day         = mapToInsightDay(info);
    const langInsights = (typeof PARTNER_INSIGHTS !== 'undefined')
      ? (PARTNER_INSIGHTS[lang] || PARTNER_INSIGHTS.en || {})
      : {};
    const dayData     = langInsights[`day_${day}`] || {};

    // "How to support" is the most actionable body for a push notification
    const howToSupport = dayData.how_to_be
      || (typeof PARTNER_ALERTS !== 'undefined' ? (PARTNER_ALERTS[lang] || PARTNER_ALERTS.en || {})[info.phaseKey] : '')
      || '';

    // Headline: phase icon + label + cycle day
    const cycleDayStr = (typeof dict.cycleDayTemplate === 'function')
      ? dict.cycleDayTemplate(info.cycleDay, info.cycleLength)
      : `Day ${info.cycleDay} of ${info.cycleLength}`;

    const title = `PeakPhase ${phase.icon}  ${phase.label}`;
    const body  = `${cycleDayStr}\n\n${howToSupport}`;

    await this.show(title, body, {
      tag: 'partner-daily',
      actions: [
        {
          action: 'open',
          title:  isEN ? "See today's full insight →" : 'Повний інсайт дня →',
        },
      ],
    });

    state.lastPartnerAlertDate = todayISO;
    saveState();
  },

  /* ─────────────────────────────────────────────
     OWNER REMINDERS
     Period (3d + 1d) · Ovulation (1d + day-of) · PMS (2d + 1d)
  ───────────────────────────────────────────── */
  async checkOwnerReminders() {
    if (typeof state === 'undefined' || state.isPartnerDevice) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const todayISO  = formatISO(toDateOnly(new Date()));
    const lastCheck = localStorage.getItem(NOTIF_CHECK_KEY);
    if (lastCheck === todayISO) return;
    localStorage.setItem(NOTIF_CHECK_KEY, todayISO);

    const prefs = this.loadPrefs();
    const today = toDateOnly(new Date());
    const info  = getCycleInfo(today);
    if (!info) return;

    const isEN = (typeof LANG === 'undefined') || LANG !== 'uk';

    // ── Period reminder ──
    if (prefs.periodReminder) {
      const daysToP = daysUntilCycleDay(info, 1, true);
      if (daysToP === 3) {
        await this.show(
          isEN ? 'PeakPhase 🩸  Period in 3 days' : 'PeakPhase 🩸  Місячні через 3 дні',
          isEN
            ? 'Your period is expected in 3 days. A good time to stock up on supplies and plan for some rest.'
            : 'Місячні очікуються через 3 дні. Час поповнити запаси і запланувати відпочинок.',
          { tag: 'period-3d' }
        );
      } else if (daysToP === 1) {
        await this.show(
          isEN ? 'PeakPhase 🩸  Period tomorrow' : 'PeakPhase 🩸  Місячні завтра',
          isEN
            ? 'Your period starts tomorrow. Prepare your supplies and be gentle with yourself today.'
            : 'Завтра починаються місячні. Підготуй все необхідне і будь лагідна до себе.',
          { tag: 'period-1d' }
        );
      }
    }

    // ── Ovulation reminder ──
    if (prefs.ovulationReminder) {
      const daysToOv = daysUntilCycleDay(info, info.ovulationStart, false);
      if (daysToOv === 1) {
        await this.show(
          isEN ? 'PeakPhase 🌟  Ovulation window tomorrow' : 'PeakPhase 🌟  Вікно овуляції завтра',
          isEN
            ? 'Your ovulation window opens tomorrow — expect peak energy, confidence, and sociability!'
            : 'Завтра починається вікно овуляції — очікуй пікової енергії, впевненості й товариськості!',
          { tag: 'ovulation-1d' }
        );
      } else if (daysToOv === 0 && info.cycleDay === info.ovulationStart) {
        await this.show(
          isEN ? 'PeakPhase 🌟  Ovulation window starts today' : 'PeakPhase 🌟  Вікно овуляції починається сьогодні',
          isEN
            ? "Ovulation window opens today — you're at your peak! High energy, confidence, and magnetism. ✨"
            : 'Вікно овуляції починається сьогодні — ти на піку! Багато енергії, впевненості й магнетизму. ✨',
          { tag: 'ovulation-today' }
        );
      }
    }

    // ── PMS heads-up ──
    if (prefs.pmsHeadsUp) {
      const daysToPms = daysUntilCycleDay(info, info.pmsStart, false);
      if (daysToPms === 2) {
        await this.show(
          isEN ? 'PeakPhase 💛  PMS in 2 days' : 'PeakPhase 💛  ПМС через 2 дні',
          isEN
            ? 'PMS phase starts in 2 days. Be extra gentle with yourself and plan some downtime this week.'
            : 'Через 2 дні починається фаза ПМС. Будь особливо лагідна до себе і запланируй відпочинок.',
          { tag: 'pms-2d' }
        );
      } else if (daysToPms === 1) {
        await this.show(
          isEN ? 'PeakPhase 💛  PMS phase tomorrow' : 'PeakPhase 💛  ПМС починається завтра',
          isEN
            ? 'PMS phase starts tomorrow. Stock up on comfort food and clear your schedule where you can.'
            : 'Завтра починається фаза ПМС. Підготуй улюблені смаколики і звільни розклад де можеш.',
          { tag: 'pms-1d' }
        );
      }
    }
  },

  /* ─────────────────────────────────────────────
     Permission helpers
  ───────────────────────────────────────────── */
  getPermissionStatus() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission; // 'default' | 'granted' | 'denied'
  },

  /* ─────────────────────────────────────────────
     Render the Reminders card in Settings
  ───────────────────────────────────────────── */
  renderReminders() {
    const card = document.getElementById('remindersCard');
    if (!card) return;

    const status = this.getPermissionStatus();
    const prefs  = this.loadPrefs();
    const lang   = (typeof LANG !== 'undefined') ? LANG : 'en';
    const dict   = (typeof UI_STRINGS !== 'undefined') ? (UI_STRINGS[lang] || UI_STRINGS.en) : {};

    const permSection  = document.getElementById('notifPermSection');
    const togglesSection = document.getElementById('notifToggles');
    const enableBtn    = document.getElementById('enableRemindersBtn');
    const permStatusEl = document.getElementById('notifPermStatus');

    if (!permSection) return;

    const hide = (el) => el && el.classList.add('hidden');
    const show = (el) => el && el.classList.remove('hidden');

    if (status === 'unsupported') {
      if (permStatusEl) permStatusEl.textContent = dict.notifUnsupportedMsg || 'Notifications are not supported in this browser.';
      show(permSection); hide(enableBtn); hide(togglesSection);
      return;
    }

    if (status === 'denied') {
      if (permStatusEl) permStatusEl.textContent = dict.notifDeniedMsg || 'Notifications are blocked. Open your browser or system settings to allow them.';
      show(permSection); hide(enableBtn); hide(togglesSection);
      return;
    }

    if (status === 'default') {
      if (permStatusEl) permStatusEl.textContent = '';
      show(permSection); show(enableBtn); hide(togglesSection);
      return;
    }

    // Granted — show toggles, hide permission prompt
    hide(permSection);
    show(togglesSection);

    const periodCb    = document.getElementById('notifPeriodReminder');
    const ovulationCb = document.getElementById('notifOvulationReminder');
    const pmsCb       = document.getElementById('notifPmsHeadsUp');

    if (periodCb)    periodCb.checked    = prefs.periodReminder;
    if (ovulationCb) ovulationCb.checked = prefs.ovulationReminder;
    if (pmsCb)       pmsCb.checked       = prefs.pmsHeadsUp;
  },

  /* ─────────────────────────────────────────────
     Wire up DOM listeners (called once on init)
  ───────────────────────────────────────────── */
  setupListeners() {
    // "Enable notifications" button
    const enableBtn = document.getElementById('enableRemindersBtn');
    if (enableBtn) {
      enableBtn.addEventListener('click', async () => {
        if (!('Notification' in window)) return;
        await Notification.requestPermission();
        this.renderReminders();
        this.checkOwnerReminders();
        this.checkPartnerDailyNotification();
      });
    }

    // Preference toggles
    const periodCb    = document.getElementById('notifPeriodReminder');
    const ovulationCb = document.getElementById('notifOvulationReminder');
    const pmsCb       = document.getElementById('notifPmsHeadsUp');

    const persist = () => this.savePrefs({
      periodReminder:    periodCb    ? periodCb.checked    : true,
      ovulationReminder: ovulationCb ? ovulationCb.checked : true,
      pmsHeadsUp:        pmsCb       ? pmsCb.checked       : true,
    });

    if (periodCb)    periodCb.addEventListener('change',    persist);
    if (ovulationCb) ovulationCb.addEventListener('change', persist);
    if (pmsCb)       pmsCb.addEventListener('change',       persist);

    // Test notification button
    const testBtn = document.getElementById('notifTestBtn');
    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        const isEN = (typeof LANG === 'undefined') || LANG !== 'uk';
        await this.show(
          isEN ? 'PeakPhase 🌸  Reminders are on!' : 'PeakPhase 🌸  Нагадування увімкнено!',
          isEN
            ? "You'll be notified about upcoming period, ovulation, and PMS. You're all set ✓"
            : 'Ти отримуватимеш нагадування про місячні, овуляцію та ПМС. Все налаштовано ✓',
          { tag: 'test' }
        );
      });
    }
  },

  /* ─────────────────────────────────────────────
     FCM — Firebase Cloud Messaging
     Gives partner devices true background push
     (works even when browser / PWA is closed).

     Flow:
       1. Load Firebase compat SDK from CDN
       2. getToken() → FCM registration token
       3. POST token + cycle data to backend
       4. Backend cron job sends push daily at 9am

     Only runs on partner devices with partnerPremium
     enabled, and only if firebase-config.js contains
     real (non-placeholder) credentials.
  ───────────────────────────────────────────── */

  /** True when firebase-config.js has been filled in. */
  _isFCMReady() {
    return !!(
      window.FIREBASE_CONFIG &&
      window.FIREBASE_CONFIG.apiKey &&
      window.FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY' &&
      window.BACKEND_URL &&
      window.BACKEND_URL !== 'http://localhost:3000'
    );
  },

  /** Dynamically inject a <script> tag and resolve when loaded. */
  _loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s    = document.createElement('script');
      s.src      = src;
      s.onload   = resolve;
      s.onerror  = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  },

  /**
   * Load the Firebase compat SDK, initialise the app, and return an FCM token.
   * Returns null if Firebase is not configured or token retrieval fails.
   */
  async initFCM() {
    if (!this._isFCMReady()) return null;
    if (!('serviceWorker' in navigator)) return null;

    const config = window.FIREBASE_CONFIG;
    try {
      // Load Firebase compat SDK from CDN (sequential — messaging depends on app)
      await this._loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
      await this._loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

      // Initialise once
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp({
          apiKey:            config.apiKey,
          authDomain:        config.authDomain,
          projectId:         config.projectId,
          storageBucket:     config.storageBucket,
          messagingSenderId: config.messagingSenderId,
          appId:             config.appId,
        });
      }

      const messaging = window.firebase.messaging();

      // Request an FCM registration token.
      // Firebase will automatically use firebase-messaging-sw.js for background delivery.
      const token = await messaging.getToken({ vapidKey: config.vapidKey });
      if (!token) throw new Error('getToken returned empty');

      // Refresh token if Firebase rotates it
      messaging.onTokenRefresh(async () => {
        const fresh = await messaging.getToken({ vapidKey: config.vapidKey }).catch(() => null);
        if (fresh) await this.registerWithBackend(fresh);
      });

      console.log('[PeakPhase] FCM token obtained');
      return token;

    } catch (err) {
      console.warn('[PeakPhase] FCM init failed:', err.message);
      return null;
    }
  },

  /**
   * POST the FCM token + partner cycle data to the backend so it can
   * send the daily push notification at the scheduled time.
   */
  async registerWithBackend(fcmToken) {
    const backendUrl = window.BACKEND_URL;
    if (!backendUrl || !fcmToken) return;

    if (typeof state === 'undefined') return;

    const sorted = [...(state.periodHistory || [])].sort((a, b) => (a < b ? 1 : -1));
    const lang   = (typeof LANG !== 'undefined') ? LANG : 'en';

    // Convert the partner's chosen local time (e.g. "09:00") to a UTC hour,
    // since the backend cron job runs in UTC and has no notion of the
    // partner's timezone otherwise.
    const [localH, localM] = (state.partnerNotifyHour || '09:00').split(':').map(Number);
    const localTime = new Date();
    localTime.setHours(localH, localM || 0, 0, 0);
    const notifyHour = localTime.getUTCHours();

    const payload = {
      fcmToken,
      lastPeriodDate: sorted[0] || null,
      cycleLength:    state.cycleLength  || 28,
      periodLength:   state.periodLength || 5,
      lang,
      notifyHour,
    };

    try {
      const res = await fetch(`${backendUrl}/register-token`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log('[PeakPhase] FCM token registered with backend ✓');
    } catch (err) {
      console.warn('[PeakPhase] Backend registration failed:', err.message);
    }
  },

  /**
   * Unregister token from backend (call when user unsubscribes from partner premium).
   */
  async unregisterFromBackend(fcmToken) {
    const backendUrl = window.BACKEND_URL;
    if (!backendUrl || !fcmToken) return;
    try {
      await fetch(`${backendUrl}/unregister-token`, {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ fcmToken }),
      });
    } catch {}
  },

  /* ─────────────────────────────────────────────
     Upgrade window.showPartnerNotification so
     the existing "Send test alert" button also
     uses SW notifications + action button
  ───────────────────────────────────────────── */
  _upgradePartnerNotification() {
    if (typeof window.showPartnerNotification !== 'function') return;
    const mgr = this;

    window.showPartnerNotification = async function(info) {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const lang  = (typeof LANG !== 'undefined') ? LANG : 'en';
      const isEN  = lang !== 'uk';
      const phase = getPhaseNote(info.phaseKey);
      const dict  = (typeof UI_STRINGS !== 'undefined') ? (UI_STRINGS[lang] || UI_STRINGS.en) : {};

      const day          = mapToInsightDay(info);
      const langInsights = (typeof PARTNER_INSIGHTS !== 'undefined')
        ? (PARTNER_INSIGHTS[lang] || PARTNER_INSIGHTS.en || {})
        : {};
      const dayData      = langInsights[`day_${day}`] || {};
      const howToSupport = dayData.how_to_be
        || (typeof PARTNER_ALERTS !== 'undefined' ? (PARTNER_ALERTS[lang] || PARTNER_ALERTS.en || {})[info.phaseKey] : '')
        || '';

      const cycleDayStr = (typeof dict.cycleDayTemplate === 'function')
        ? dict.cycleDayTemplate(info.cycleDay, info.cycleLength)
        : `Day ${info.cycleDay} of ${info.cycleLength}`;

      const title = `PeakPhase ${phase.icon}  ${phase.label}`;
      const body  = `${cycleDayStr}\n\n${howToSupport}`;

      await mgr.show(title, body, {
        tag: 'partner-daily',
        actions: [{
          action: 'open',
          title: isEN ? "See today's full insight →" : 'Повний інсайт дня →',
        }],
      });
    };
  },

  /* ─────────────────────────────────────────────
     Init — call once after DOM is ready
  ───────────────────────────────────────────── */
  async init() {
    await this.registerSW();
    this.setupListeners();
    this.renderReminders();
    this._upgradePartnerNotification();

    // Defer checks so they don't block the initial paint
    setTimeout(async () => {
      this.checkOwnerReminders();
      this.checkPartnerDailyNotification();

      // FCM: register partner devices for true background push
      // Only runs when firebase-config.js is filled in and this is a subscribed partner device
      if (
        typeof state !== 'undefined' &&
        state.isPartnerDevice &&
        state.partnerPremium &&
        Notification.permission === 'granted' &&
        this._isFCMReady()
      ) {
        const fcmToken = await this.initFCM();
        if (fcmToken) {
          state.fcmToken = fcmToken;
          if (typeof saveState === 'function') saveState();
          await this.registerWithBackend(fcmToken);
        }
      }
    }, 800);
  },
};

// Auto-init as soon as the DOM (and script.js globals) are ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.NotifManager.init());
} else {
  window.NotifManager.init();
}
