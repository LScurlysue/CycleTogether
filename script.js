const STORAGE_KEY = "cycleSyncData";

const DEFAULT_PHASE_NOTES = {
  menstrualEarly: {
    label: "Period (early)",
    icon: "🌧️",
    colorClass: "menstrual",
    text: "Flow and cramps tend to be at their strongest now. Energy is often low — comfort, warmth, and rest help.",
    tags: ["Heavy flow", "Cramps", "Low energy", "Rest"],
    support: "It's okay to slow down and do less today. Resting through cramps and fatigue isn't laziness — it's what your body needs right now.",
  },
  menstrualLate: {
    label: "Period (tapering off)",
    icon: "🌦️",
    colorClass: "menstrual",
    text: "Flow is usually lighter now and energy starts to return. Many feel relief as symptoms ease off.",
    tags: ["Lighter flow", "Energy returning", "Relief"],
    support: "If you're still feeling tired or low, that's normal — there's no need to rush back to full speed.",
  },
  follicularEarly: {
    label: "Early follicular",
    icon: "🌱",
    colorClass: "follicular",
    text: "Body and mind are recovering. Energy is gradually building and you may feel calmer or more reflective.",
    tags: ["Recovering", "Calm", "Steady"],
    support: "It's fine if your energy isn't back to 100% yet — it tends to build gradually over the next few days.",
  },
  follicularLate: {
    label: "Late follicular",
    icon: "🌼",
    colorClass: "follicular",
    text: "Energy, confidence and mood are climbing toward their peak. Motivation, sociability and drive often increase.",
    tags: ["Rising energy", "Motivated", "Social", "Optimistic"],
    support: "Enjoy the extra energy if it shows up — but it's still okay to rest if that's what you need today.",
  },
  ovulation: {
    label: "Ovulation",
    icon: "🌟",
    colorClass: "ovulation",
    text: "Often the highest-energy, most confident phase. Expect more sociability, talkativeness, and laughter than usual.",
    tags: ["High energy", "Confident", "Social", "More laughter"],
    support: "Even on a 'high energy' day, it's okay to take things slowly if that's what feels right.",
  },
  lutealEarly: {
    label: "Early luteal",
    icon: "🍃",
    colorClass: "luteal",
    text: "Energy is steady but starting to settle. Many feel focused, productive, and good at organizing or wrapping up tasks.",
    tags: ["Focused", "Productive", "Steady", "Nesting"],
    support: "If you're craving more quiet time than usual, that's a normal part of this phase — listen to it.",
  },
  lutealLate: {
    label: "Late luteal",
    icon: "🍂",
    colorClass: "luteal",
    text: "Progesterone is starting to ease off and the first subtle shifts can creep in — slightly lower energy, a touch less patience by evening, or a pull toward familiar routines.",
    tags: ["Settling", "Lower energy", "Nesting", "Quieter"],
    support: "If you're winding down earlier than usual or craving more quiet time, that's a normal early signal — not a sign anything's wrong.",
  },
  pms: {
    label: "PMS (pre-period)",
    icon: "⛈️",
    colorClass: "pms",
    text: "Mood swings, irritability, sadness, or crying spells are common now. Cravings, bloating, and lower tolerance for stress often increase.",
    tags: ["Irritable", "Mood swings", "Crying spells", "Sensitive", "Cravings"],
    support: "If you feel like crying today, that's completely normal. Your hormones are shifting and your feelings are valid — be gentle with yourself, this will pass.",
  },
};

const AFFIRMATIONS = {
  menstrualEarly: [
    "I am so grateful for this body and the quiet work it's doing right now.",
    "I am held and supported, even on my softest days.",
    "I am allowed to rest — I am grateful for every moment of stillness.",
    "I am healing, I am safe, and I believe good things are still coming for me.",
    "I am grateful for my own gentleness. It's a kind of strength.",
    "I have faith that this hard moment is making space for something better.",
    "I am so grateful to be taken care of by myself, today and always.",
    "I believe in myself even when I'm moving slowly. I am still becoming.",
  ],
  menstrualLate: [
    "I am so grateful to feel myself coming back, little by little.",
    "I am a magnet for miracles, even on the days I'm still healing.",
    "I believe brighter days are already on their way to me.",
    "I am grateful for my body's wisdom — it always knows how to restore me.",
    "I am proud of myself for getting through the hardest days with grace.",
    "I have faith that ease is returning, and I welcome it fully.",
    "I am grateful for progress, even the kind no one else can see.",
    "I believe in my own resilience. I always find my way back to myself.",
  ],
  follicularEarly: [
    "I am so grateful for this fresh, clear-headed energy rising in me.",
    "I am a magnet for new ideas and good opportunities.",
    "I believe in the quiet seeds I'm planting today.",
    "I am grateful for my patience and my clarity — they are gifts.",
    "I have faith that small steps today are building something real.",
    "I am open, I am hopeful, and I trust the timing of my life.",
    "I am grateful for the calm before the momentum.",
    "I believe in myself enough to begin again, today.",
  ],
  follicularLate: [
    "I am so grateful for this rising energy and the confidence it brings.",
    "I am a magnet for miracles, and I am ready to receive them.",
    "I believe in my ideas, and I trust myself to follow through.",
    "I am grateful for my courage to say yes to what excites me.",
    "I have faith that I am exactly where I need to be, moving forward.",
    "I am grateful for my own momentum — I am building something good.",
    "I believe good things come to me when I show up boldly.",
    "I am so grateful for this drive. I trust where it's taking me.",
  ],
  ovulation: [
    "I am so grateful for this confidence and the way I shine right now.",
    "I am a magnet for miracles, love, and good fortune.",
    "I believe in my own magnetism — I don't need to shrink for anyone.",
    "I am grateful for my voice, and I trust it's worth being heard.",
    "I have faith in my instincts; they have always guided me well.",
    "I am grateful for the people I bring together and the joy we share.",
    "I believe this is my moment, and I receive it with gratitude.",
    "I am so grateful to feel this alive, this capable, this whole.",
  ],
  lutealEarly: [
    "I am so grateful for this steady focus and quiet determination.",
    "I am a magnet for follow-through — what I start, I finish.",
    "I believe my consistency today is building tomorrow's miracles.",
    "I am grateful for my own discipline; it is a quiet superpower.",
    "I have faith that the things I'm tending to now will pay off.",
    "I am grateful for productive, peaceful days like this one.",
    "I believe in the value of my quiet effort, even when no one's watching.",
    "I am so grateful for the order and calm I'm creating for myself.",
  ],
  lutealLate: [
    "I am so grateful for permission to slow down and protect my peace.",
    "I am a magnet for miracles even in my quietest, most tender moments.",
    "I believe choosing rest tonight is an act of faith in myself.",
    "I am grateful for comfort, familiarity, and the people who feel like home.",
    "I have faith that my softer days still count, fully and completely.",
    "I am grateful for my own honesty about what I need right now.",
    "I believe in myself, even when my energy is low. I am still enough.",
    "I am so grateful for this gentler pace — it's exactly what I need.",
  ],
  pms: [
    "I am so grateful for myself, especially in this hard moment.",
    "I am a magnet for miracles, even when everything feels heavy right now.",
    "I believe this feeling is temporary, and I have faith it will pass.",
    "I am grateful for my own depth of feeling — it makes me human, not weak.",
    "I have faith in myself, even on the days that feel impossible.",
    "I am grateful for grace, especially the grace I give myself today.",
    "I believe I am loved and supported, even in my hardest moments.",
    "I am so grateful that tomorrow will feel lighter. I just need to be gentle today.",
  ],
};

// A few rewordings of each phase's "what to expect" description so it doesn't
// read identically for every day of a multi-day phase.
const PHASE_TEXT_VARIANTS = {
  menstrualEarly: [
    "Flow and cramps tend to be at their strongest now. Energy is often low — comfort, warmth, and rest help.",
    "These are usually the most intense days — heavier flow and stronger cramps are common. Lean into rest and warmth.",
    "Your body is working hard right now. Expect the flow to be at its heaviest, with energy dipping lower than usual.",
  ],
  menstrualLate: [
    "Flow is usually lighter now and energy starts to return. Many feel relief as symptoms ease off.",
    "Things are easing up — flow tends to lighten and cramps fade, with energy slowly climbing back.",
    "As your period winds down, expect lighter flow and a gradual return of energy and normal mood.",
  ],
  follicularEarly: [
    "Body and mind are recovering. Energy is gradually building and you may feel calmer or more reflective.",
    "This is a recovery stretch — energy builds slowly and a sense of calm or clarity often settles in.",
    "Your body is quietly recharging. Expect a gentle rise in energy and a more even, reflective mood.",
  ],
  follicularLate: [
    "Energy, confidence and mood are climbing toward their peak. Motivation, sociability and drive often increase.",
    "Things are ramping up — expect rising energy, sharper focus, and a more social, upbeat mood.",
    "You're heading toward a high point. Motivation and confidence tend to build noticeably these days.",
  ],
  ovulation: [
    "Often the highest-energy, most confident phase. Expect more sociability, talkativeness, and laughter than usual.",
    "This is typically your peak — energy, confidence, and sociability are often at their highest.",
    "Expect to feel especially outgoing and energized. Many notice more laughter, charm, and self-assurance now.",
  ],
  lutealEarly: [
    "Energy is steady but starting to settle. Many feel focused, productive, and good at organizing or wrapping up tasks.",
    "Energy holds steady while focus sharpens — a good stretch for productivity and getting organized.",
    "Expect a calm, capable mood. Many feel drawn to tidy up loose ends and tackle practical tasks.",
  ],
  lutealLate: [
    "Progesterone is starting to ease off and the first subtle shifts can creep in — slightly lower energy, a touch less patience by evening, or a pull toward familiar routines.",
    "Energy begins to taper and patience may run a little thinner by evening. A pull toward familiar comforts is common.",
    "Expect a gentle slowdown — slightly less energy, a quieter mood, and a preference for routine over new plans.",
  ],
  pms: [
    "Mood swings, irritability, sadness, or crying spells are common now. Cravings, bloating, and lower tolerance for stress often increase.",
    "Expect heightened emotions — irritability, tearfulness, or mood swings are common, along with cravings and bloating.",
    "This stretch often brings stronger emotional reactions, lower stress tolerance, cravings, and physical discomfort like bloating.",
  ],
};

const PARTNER_ALERTS = {
  menstrualEarly: "Her period just started and energy is low. Maybe handle dinner, grab a heating pad, and keep things low-key tonight.",
  menstrualLate: "Period's tapering off — she may have a bit more energy back, but no need to push plans either way.",
  follicularEarly: "She's likely feeling calmer and more recovered today. A good day for easy plans together.",
  follicularLate: "Energy and mood are on the rise — a great window for that date, trip, or big conversation you've been holding onto.",
  ovulation: "Peak energy and confidence day. She's likely feeling great — good day for something fun together.",
  lutealEarly: "She may want more quiet time than usual. Don't take it personally if she's a bit more focused or low-key.",
  lutealLate: "Energy may be starting to dip a bit earlier in the evening, and she may be leaning toward familiar routines over new plans. Nothing to worry about — just go with the slower pace.",
  pms: "PMS phase has started — bring snacks, give extra patience, and maybe don't pick fights today. Small kindnesses go a long way right now.",
};

const MOOD_LABELS = {
  happy: "😄 Happy",
  calm: "😌 Calm",
  tired: "😴 Tired",
  irritable: "😠 Irritable",
  sad: "😢 Sad / Crying",
  anxious: "😰 Anxious",
};

let state = loadState();

function defaultState() {
  return {
    periodHistory: [],
    cycleLength: 28,
    periodLength: 5,
    phaseNotes: JSON.parse(JSON.stringify(DEFAULT_PHASE_NOTES)),
    moodLog: {},
    partnerMode: false,
    isPartnerDevice: false,
    partnerPremium: false,
    lastPartnerAlertDate: null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const fresh = defaultState();
    const mergedPhaseNotes = { ...fresh.phaseNotes };
    Object.keys(mergedPhaseNotes).forEach((key) => {
      if (parsed.phaseNotes && parsed.phaseNotes[key]) {
        mergedPhaseNotes[key] = { ...mergedPhaseNotes[key], ...parsed.phaseNotes[key] };
      }
    });
    return {
      ...fresh,
      ...parsed,
      phaseNotes: mergedPhaseNotes,
    };
  } catch (e) {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---------- Date helpers ----------
function toDateOnly(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseISO(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function diffDays(a, b) {
  return Math.round((toDateOnly(a) - toDateOnly(b)) / 86400000);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// ---------- Cycle logic ----------
function getMostRecentStart(forDate) {
  if (!state.periodHistory.length) return null;
  const sorted = [...state.periodHistory].map(parseISO).sort((a, b) => b - a);
  let best = sorted.find((d) => d <= forDate);
  if (!best) best = sorted[sorted.length - 1];
  return best;
}

function getCycleInfo(forDate) {
  const lastStart = getMostRecentStart(forDate);
  if (!lastStart) return null;
  const cycleLength = Number(state.cycleLength) || 28;
  const periodLength = Number(state.periodLength) || 5;
  let diff = diffDays(forDate, lastStart);
  let cycleDay = ((diff % cycleLength) + cycleLength) % cycleLength + 1;

  // How many full cycles have passed since the earliest logged period —
  // used to rotate daily-insight wording so it varies month to month.
  const earliestStart = [...state.periodHistory].map(parseISO).sort((a, b) => a - b)[0];
  const cycleNumber = Math.floor(diffDays(forDate, earliestStart) / cycleLength);

  const ovulationDay = Math.max(cycleLength - 14, periodLength + 1);
  const ovulationStart = Math.max(ovulationDay - 1, 1);
  const ovulationEnd = ovulationDay + 1;
  const pmsStart = cycleLength - 4;

  let phaseKey;
  if (cycleDay <= periodLength) {
    const menstrualMid = Math.max(1, Math.floor(periodLength / 2));
    phaseKey = cycleDay <= menstrualMid ? "menstrualEarly" : "menstrualLate";
  } else if (cycleDay >= ovulationStart && cycleDay <= ovulationEnd) {
    phaseKey = "ovulation";
  } else if (cycleDay < ovulationStart) {
    const follicularMid = Math.floor((periodLength + 1 + (ovulationStart - 1)) / 2);
    phaseKey = cycleDay <= follicularMid ? "follicularEarly" : "follicularLate";
  } else if (cycleDay >= pmsStart) {
    phaseKey = "pms";
  } else {
    const lutealMid = Math.floor((ovulationEnd + 1 + (pmsStart - 1)) / 2);
    phaseKey = cycleDay <= lutealMid ? "lutealEarly" : "lutealLate";
  }

  return {
    cycleDay,
    cycleLength,
    periodLength,
    ovulationDay,
    ovulationStart,
    ovulationEnd,
    pmsStart,
    phaseKey,
    lastStart,
    cycleNumber,
  };
}

// Picks a phase-appropriate affirmation, rotating by cycle day and number so it
// varies day to day and doesn't repeat identically every month.
function getAffirmation(info) {
  const pool = AFFIRMATIONS[info.phaseKey];
  const index = ((info.cycleNumber + info.cycleDay) % pool.length + pool.length) % pool.length;
  return pool[index];
}

// Picks a reworded variant of the phase's "what to expect" text so consecutive
// days within the same phase don't show identical wording.
function getPhaseText(info) {
  const variants = PHASE_TEXT_VARIANTS[info.phaseKey];
  const index = ((info.cycleNumber + info.cycleDay) % variants.length + variants.length) % variants.length;
  return variants[index];
}

// ---------- Daily insights (28-day lookup, scaled to actual cycle length) ----------
// Picks one of several variants per day, rotating by cycle number so the wording
// doesn't repeat identically every month.
// Maps the current cycle day onto the 1-28 insight scale, segment by segment,
// so the insight phase (menstrual/follicular/ovulation/luteal) always matches
// the phase shown on the phase card — even for cycles longer or shorter than 28 days.
function mapToInsightDay(info) {
  const { cycleDay, cycleLength, periodLength, ovulationStart, ovulationEnd } = info;

  function scaleWithin(day, srcStart, srcEnd, dstStart, dstEnd) {
    if (srcEnd <= srcStart) return dstStart;
    const ratio = (day - srcStart) / (srcEnd - srcStart);
    const result = Math.round(dstStart + ratio * (dstEnd - dstStart));
    return Math.min(dstEnd, Math.max(dstStart, result));
  }

  if (cycleDay <= periodLength) {
    return scaleWithin(cycleDay, 1, periodLength, 1, 5);
  }
  if (cycleDay < ovulationStart) {
    return scaleWithin(cycleDay, periodLength + 1, ovulationStart - 1, 6, 13);
  }
  if (cycleDay <= ovulationEnd) {
    return scaleWithin(cycleDay, ovulationStart, ovulationEnd, 14, 15);
  }
  return scaleWithin(cycleDay, ovulationEnd + 1, cycleLength, 16, 28);
}

// Insight headlines are written as "Day N: Title" against the 28-day template,
// but N doesn't match the user's actual cycle day, so we drop it to avoid confusion.
function insightTitle(headline) {
  return headline.replace(/^Day \d+:\s*/, "");
}

function getDailyInsight(info) {
  const day = mapToInsightDay(info);
  const variants = DAILY_INSIGHTS[`day_${day}`];
  const variantIndex = ((info.cycleNumber % variants.length) + variants.length) % variants.length;
  const headline = variants[variantIndex].headline;

  if (state.partnerMode) {
    return { ...PARTNER_INSIGHTS[`day_${day}`], headline };
  }

  return variants[variantIndex];
}

function applyInsightLabels() {
  const labels = state.partnerMode
    ? { expect: "What's going on", be: "How to support her", advice: "Quick tip" }
    : { expect: "What to expect", be: "How to be with yourself", advice: "Today's tip" };

  document.querySelectorAll("[data-insight-label='expect']").forEach((el) => (el.textContent = labels.expect));
  document.querySelectorAll("[data-insight-label='be']").forEach((el) => (el.textContent = labels.be));
  document.querySelectorAll("[data-insight-label='advice']").forEach((el) => (el.textContent = labels.advice));

  document.querySelectorAll("[data-insight-tab='expect']").forEach((el) => (el.textContent = labels.expect));
  document.querySelectorAll("[data-insight-tab='be']").forEach((el) => (el.textContent = labels.be));
  document.querySelectorAll("[data-insight-tab='advice']").forEach((el) => (el.textContent = labels.advice));
}

document.querySelectorAll(".insight-tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".tabbed-insight");
    const target = btn.dataset.insightTab;
    card.querySelectorAll(".insight-tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
    card.querySelectorAll(".insight-tab-panel").forEach((p) => p.classList.toggle("active", p.dataset.insightPanel === target));
  });
});

// ---------- Rendering: Today tab ----------
function renderToday() {
  const today = toDateOnly(new Date());
  const info = getCycleInfo(today);
  const noData = document.getElementById("noDataMessage");
  const content = document.getElementById("todayContent");

  if (!info) {
    noData.classList.remove("hidden");
    content.classList.add("hidden");
    return;
  }
  noData.classList.add("hidden");
  content.classList.remove("hidden");

  const phase = state.phaseNotes[info.phaseKey];
  document.getElementById("phaseIcon").textContent = phase.icon;
  document.getElementById("phaseName").textContent = phase.label;
  document.getElementById("cycleDay").textContent = `Day ${info.cycleDay} of ${info.cycleLength}-day cycle`;
  document.getElementById("phaseText").textContent = getPhaseText(info);

  document.getElementById("supportText").textContent = getAffirmation(info);

  const tagsEl = document.getElementById("moodTags");
  tagsEl.innerHTML = "";
  (phase.tags || []).forEach((tag) => {
    const span = document.createElement("span");
    span.textContent = tag;
    tagsEl.appendChild(span);
  });

  const insight = getDailyInsight(info);
  document.getElementById("insightHeadline").textContent = insightTitle(insight.headline);
  document.getElementById("insightExpect").textContent = insight.what_to_expect;
  document.getElementById("insightBe").textContent = insight.how_to_be;
  document.getElementById("insightAdvice").textContent = insight.daily_advice;

  renderMoodButtons(today);
  renderUpcoming(today, info);
}

// Mood log entries may be a single mood string (legacy) or an array of moods.
function getLoggedMoods(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function renderMoodButtons(today) {
  const key = formatISO(today);
  const logged = getLoggedMoods(state.moodLog[key]);
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.classList.toggle("selected", logged.includes(btn.dataset.mood));
  });
  document.getElementById("moodLoggedMsg").classList.toggle("hidden", !logged.length);
}

function renderUpcoming(today, info) {
  const list = document.getElementById("upcomingList");
  list.innerHTML = "";

  const items = [];
  const ovulationStartDate = addDays(today, daysUntilCycleDay(info, info.ovulationStart));
  const pmsStartDate = addDays(today, daysUntilCycleDay(info, info.pmsStart));
  const nextPeriodDate = addDays(today, daysUntilCycleDay(info, 1, true));

  if (info.phaseKey !== "ovulation") {
    items.push({ label: "Ovulation window starts", date: ovulationStartDate });
  }
  if (info.phaseKey !== "pms") {
    items.push({ label: "PMS phase starts", date: pmsStartDate });
  }
  items.push({ label: "Next period expected", date: nextPeriodDate });

  items
    .filter((item) => item.date > today)
    .sort((a, b) => a.date - b.date)
    .forEach((item) => {
      const li = document.createElement("li");
      const days = diffDays(item.date, today);
      li.innerHTML = `<span>${item.label}</span><span>${days === 1 ? "tomorrow" : `in ${days} days`}</span>`;
      list.appendChild(li);
    });
}

// ---------- History tab ----------
function renderHistory() {
  const list = document.getElementById("moodHistoryList");
  list.innerHTML = "";

  const entries = Object.entries(state.moodLog).sort((a, b) => (a[0] < b[0] ? 1 : -1));

  if (!entries.length) {
    const li = document.createElement("li");
    li.textContent = "No moods logged yet. Log how you're feeling on the Today tab.";
    list.appendChild(li);
    return;
  }

  entries.forEach(([iso, value]) => {
    const date = parseISO(iso);
    const info = getCycleInfo(date);
    const phase = info ? state.phaseNotes[info.phaseKey] : null;
    const moods = getLoggedMoods(value);

    const li = document.createElement("li");

    const top = document.createElement("div");
    top.className = "mood-history-top";
    const dateSpan = document.createElement("span");
    dateSpan.className = "mood-history-date";
    dateSpan.textContent = date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    const moodSpan = document.createElement("span");
    moodSpan.textContent = moods.map((mood) => MOOD_LABELS[mood] || mood).join(", ");
    top.appendChild(dateSpan);
    top.appendChild(moodSpan);
    li.appendChild(top);

    if (phase) {
      const phaseSpan = document.createElement("div");
      phaseSpan.className = "mood-history-phase";
      phaseSpan.textContent = `${phase.icon} ${phase.label} · Day ${info.cycleDay} of ${info.cycleLength}`;
      li.appendChild(phaseSpan);
    }

    list.appendChild(li);
  });
}

// Returns number of days from today until cycleDay `targetDay` next occurs.
// If forceNextCycle is true and today already is that day, jumps to the next cycle.
function daysUntilCycleDay(info, targetDay, forceNextCycle = false) {
  let delta = ((targetDay - info.cycleDay) % info.cycleLength + info.cycleLength) % info.cycleLength;
  if (delta === 0 && forceNextCycle) delta = info.cycleLength;
  return delta;
}

// ---------- Mood logging ----------
function setupMoodButtons() {
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const today = formatISO(toDateOnly(new Date()));
      const mood = btn.dataset.mood;
      const logged = getLoggedMoods(state.moodLog[today]);
      const idx = logged.indexOf(mood);
      if (idx >= 0) {
        logged.splice(idx, 1);
      } else {
        logged.push(mood);
      }
      if (logged.length) {
        state.moodLog[today] = logged;
      } else {
        delete state.moodLog[today];
      }
      saveState();
      renderMoodButtons(toDateOnly(new Date()));
    });
  });
}

// ---------- Calendar tab ----------
let calendarMonth = new Date().getMonth();
let calendarYear = new Date().getFullYear();

function renderCalendar() {
  const title = document.getElementById("calendarTitle");
  const grid = document.getElementById("calendarGrid");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  title.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;

  grid.innerHTML = "";
  ["S", "M", "T", "W", "T", "F", "S"].forEach((d) => {
    const el = document.createElement("div");
    el.className = "weekday";
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const today = toDateOnly(new Date());

  for (let i = 0; i < startOffset; i++) {
    const el = document.createElement("div");
    el.className = "day empty";
    grid.appendChild(el);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(calendarYear, calendarMonth, day);
    const el = document.createElement("div");
    el.className = "day";

    const info = getCycleInfo(date);
    if (info) {
      el.classList.add(state.phaseNotes[info.phaseKey].colorClass);
    }
    if (diffDays(date, today) === 0) {
      el.classList.add("today");
    }
    const dateNum = document.createElement("span");
    dateNum.className = "day-date";
    dateNum.textContent = day;
    el.appendChild(dateNum);

    if (info) {
      const cycleNum = document.createElement("span");
      cycleNum.className = "day-cycle";
      cycleNum.textContent = info.cycleDay;
      el.appendChild(cycleNum);
    }

    if (selectedDay && diffDays(date, selectedDay) === 0) {
      el.classList.add("selected");
    }
    el.addEventListener("click", () => showDayDetail(date));
    grid.appendChild(el);
  }
}

let selectedDay = null;

function showDayDetail(date) {
  selectedDay = date;
  const info = getCycleInfo(date);
  const card = document.getElementById("dayDetailCard");
  if (!info) {
    card.classList.add("hidden");
    return;
  }
  card.classList.remove("hidden");

  const phase = state.phaseNotes[info.phaseKey];
  document.getElementById("dayDetailIcon").textContent = phase.icon;
  document.getElementById("dayDetailPhase").textContent = phase.label;
  document.getElementById("dayDetailDate").textContent =
    `${date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} · Day ${info.cycleDay} of ${info.cycleLength}`;
  document.getElementById("dayDetailText").textContent = getPhaseText(info);

  const tagsEl = document.getElementById("dayDetailTags");
  tagsEl.innerHTML = "";
  (phase.tags || []).forEach((tag) => {
    const span = document.createElement("span");
    span.textContent = tag;
    tagsEl.appendChild(span);
  });

  document.getElementById("dayDetailAffirmation").textContent = getAffirmation(info);

  const insight = getDailyInsight(info);
  document.getElementById("dayDetailInsightHeadline").textContent = insightTitle(insight.headline);
  document.getElementById("dayDetailInsightExpect").textContent = insight.what_to_expect;
  document.getElementById("dayDetailInsightBe").textContent = insight.how_to_be;
  document.getElementById("dayDetailInsightAdvice").textContent = insight.daily_advice;

  const iso = formatISO(date);
  const isPeriodStart = state.periodHistory.includes(iso);
  const periodBtn = document.getElementById("dayDetailPeriodBtn");
  periodBtn.textContent = isPeriodStart ? "Unmark as period start" : "Mark as period start";
  periodBtn.onclick = () => togglePeriodStart(date);

  renderCalendar();
}

function togglePeriodStart(date) {
  const iso = formatISO(date);
  const idx = state.periodHistory.indexOf(iso);
  if (idx >= 0) {
    state.periodHistory.splice(idx, 1);
  } else {
    state.periodHistory.push(iso);
  }
  saveState();
  renderAll();
  showDayDetail(date);
}

document.getElementById("prevMonth").addEventListener("click", () => {
  calendarMonth--;
  if (calendarMonth < 0) {
    calendarMonth = 11;
    calendarYear--;
  }
  renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  calendarMonth++;
  if (calendarMonth > 11) {
    calendarMonth = 0;
    calendarYear++;
  }
  renderCalendar();
});

// ---------- Settings tab ----------
function renderSettings() {
  const sorted = [...state.periodHistory].sort((a, b) => parseISO(b) - parseISO(a));
  document.getElementById("lastPeriodDate").value = sorted[0] || "";
  document.getElementById("cycleLength").value = state.cycleLength;
  document.getElementById("periodLength").value = state.periodLength;

  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  if (!sorted.length) {
    const li = document.createElement("li");
    li.textContent = "No entries yet.";
    historyList.appendChild(li);
  } else {
    sorted.forEach((iso) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = parseISO(iso).toLocaleDateString();
      const btn = document.createElement("button");
      btn.textContent = "Remove";
      btn.addEventListener("click", () => {
        state.periodHistory = state.periodHistory.filter((d) => d !== iso);
        saveState();
        renderAll();
      });
      li.appendChild(span);
      li.appendChild(btn);
      historyList.appendChild(li);
    });
  }

  renderPartnerSync();
}

document.getElementById("saveSettings").addEventListener("click", () => {
  const dateVal = document.getElementById("lastPeriodDate").value;
  const cycleLength = Number(document.getElementById("cycleLength").value);
  const periodLength = Number(document.getElementById("periodLength").value);

  if (dateVal && !state.periodHistory.includes(dateVal)) {
    state.periodHistory.push(dateVal);
  }
  state.cycleLength = cycleLength;
  state.periodLength = periodLength;
  saveState();

  const msg = document.getElementById("savedMsg");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 2000);

  renderAll();
});

// ---------- Share / import with partner ----------
function encodeShareCode(data) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

function decodeShareCode(code) {
  return JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
}

document.getElementById("generateShareCode").addEventListener("click", () => {
  const sorted = [...state.periodHistory].sort((a, b) => parseISO(b) - parseISO(a));
  const data = {
    type: "cyclesync-share",
    cycleLength: state.cycleLength,
    periodLength: state.periodLength,
    lastPeriodDate: sorted[0] || null,
    phaseNotes: state.phaseNotes,
  };

  const code = encodeShareCode(data);
  const textarea = document.getElementById("shareCode");
  textarea.value = code;
  textarea.classList.remove("hidden");
  document.getElementById("copyShareCode").classList.remove("hidden");
});

document.getElementById("copyShareCode").addEventListener("click", () => {
  const textarea = document.getElementById("shareCode");
  navigator.clipboard.writeText(textarea.value).then(() => {
    const msg = document.getElementById("copyMsg");
    msg.classList.remove("hidden");
    setTimeout(() => msg.classList.add("hidden"), 2000);
  });
});

document.getElementById("importCodeBtn").addEventListener("click", () => {
  const msg = document.getElementById("importMsg");
  const input = document.getElementById("importCode").value;

  let data;
  try {
    data = decodeShareCode(input);
    if (data.type !== "cyclesync-share") throw new Error("invalid");
  } catch (e) {
    msg.textContent = "That code doesn't look right. Ask your partner to generate a new one.";
    msg.classList.remove("hidden");
    return;
  }

  state.cycleLength = data.cycleLength;
  state.periodLength = data.periodLength;
  state.periodHistory = data.lastPeriodDate ? [data.lastPeriodDate] : [];
  if (data.phaseNotes) {
    Object.keys(state.phaseNotes).forEach((key) => {
      if (data.phaseNotes[key]) {
        state.phaseNotes[key] = { ...state.phaseNotes[key], ...data.phaseNotes[key] };
      }
    });
  }
  state.partnerMode = true;
  state.isPartnerDevice = true;
  saveState();

  document.getElementById("importCode").value = "";
  msg.textContent = "Imported ✓ — this device is now set up as the partner view.";
  msg.classList.remove("hidden");

  renderAll();
});

document.getElementById("undoPartnerDevice").addEventListener("click", () => {
  state.isPartnerDevice = false;
  state.partnerMode = false;
  saveState();
  renderAll();
});

// ---------- Partner Sync Premium ----------
function renderPartnerSync() {
  const toggleBtn = document.getElementById("togglePartnerPremium");
  const enableBtn = document.getElementById("enableNotifications");
  const testBtn = document.getElementById("sendTestAlert");
  const status = document.getElementById("premiumStatus");
  const preview = document.getElementById("partnerAlertPreview");

  const today = toDateOnly(new Date());
  const info = getCycleInfo(today);
  preview.textContent = info
    ? `Today's alert would say: "${PARTNER_ALERTS[info.phaseKey]}"`
    : "Import a partner code to start getting daily alerts.";

  if (state.partnerPremium) {
    toggleBtn.textContent = "Unsubscribe";
    toggleBtn.classList.remove("primary-btn");
    toggleBtn.classList.add("secondary-btn");
    enableBtn.classList.remove("hidden");
    testBtn.classList.remove("hidden");

    if (!("Notification" in window)) {
      status.textContent = "Notifications aren't supported in this browser.";
    } else if (Notification.permission === "granted") {
      status.textContent = "Subscribed ✓ — you'll get a daily alert about her cycle phase.";
      enableBtn.classList.add("hidden");
    } else if (Notification.permission === "denied") {
      status.textContent = "Notifications are blocked in your browser settings. Enable them to receive alerts.";
      enableBtn.classList.add("hidden");
    } else {
      status.textContent = "Subscribed ✓ — turn on notifications to start receiving daily alerts.";
    }
  } else {
    toggleBtn.textContent = "Subscribe ($3/month)";
    toggleBtn.classList.remove("secondary-btn");
    toggleBtn.classList.add("primary-btn");
    enableBtn.classList.add("hidden");
    testBtn.classList.add("hidden");
    status.textContent = "";
  }
}

document.getElementById("togglePartnerPremium").addEventListener("click", () => {
  state.partnerPremium = !state.partnerPremium;
  saveState();
  renderPartnerSync();
  if (state.partnerPremium) checkPartnerAlert();
});

document.getElementById("enableNotifications").addEventListener("click", () => {
  if (!("Notification" in window)) return;
  Notification.requestPermission().then(() => {
    renderPartnerSync();
    checkPartnerAlert();
  });
});

document.getElementById("sendTestAlert").addEventListener("click", () => {
  const today = toDateOnly(new Date());
  const info = getCycleInfo(today);
  if (!info) return;
  showPartnerNotification(info);
});

function showPartnerNotification(info) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const phase = state.phaseNotes[info.phaseKey];
  new Notification("CycleTogether — Partner Sync", {
    body: PARTNER_ALERTS[info.phaseKey] || phase.text,
    icon: "icons/icon-192.png",
  });
}

// Checks once per day whether a partner alert should be sent.
function checkPartnerAlert() {
  if (!state.partnerPremium || !state.isPartnerDevice) return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const today = formatISO(toDateOnly(new Date()));
  if (state.lastPartnerAlertDate === today) return;

  const info = getCycleInfo(toDateOnly(new Date()));
  if (!info) return;

  showPartnerNotification(info);
  state.lastPartnerAlertDate = today;
  saveState();
}

// ---------- Tabs ----------
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    if (btn.dataset.tab === "calendar") renderCalendar();
    if (btn.dataset.tab === "history") renderHistory();
  });
});

// ---------- Partner mode ----------
const modeToggle = document.getElementById("modeToggle");
function applyPartnerMode() {
  document.body.classList.toggle("partner-mode", state.partnerMode);
  applyInsightLabels();
  modeToggle.classList.toggle("active", state.partnerMode);
  modeToggle.textContent = state.partnerMode ? "My view" : "Partner view";
  modeToggle.classList.toggle("hidden", state.isPartnerDevice);

  document.getElementById("undoPartnerDevice").classList.toggle("hidden", !state.isPartnerDevice);
  document.getElementById("importHint").textContent = state.isPartnerDevice
    ? "Paste an updated code here if your partner's cycle info changes."
    : "Important: only paste a code here on your partner's phone, not your own — doing so will switch this device permanently into Partner view.";
}

modeToggle.addEventListener("click", () => {
  state.partnerMode = !state.partnerMode;
  saveState();
  renderAll();
  if (selectedDay) showDayDetail(selectedDay);
});

// ---------- Init ----------
function renderAll() {
  renderToday();
  renderSettings();
  if (document.getElementById("tab-calendar").classList.contains("active")) {
    renderCalendar();
  }
  if (document.getElementById("tab-history").classList.contains("active")) {
    renderHistory();
  }
  applyPartnerMode();
}

setupMoodButtons();
renderAll();
checkPartnerAlert();
