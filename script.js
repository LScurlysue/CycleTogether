const STORAGE_KEY = "cycleSyncData";
const LANG_STORAGE_KEY = "language";
let LANG = localStorage.getItem(LANG_STORAGE_KEY) || "en";

// Returns the active-language version of a bilingual { en: ..., uk: ... } object.
function L(obj) {
  return obj[LANG] || obj.en;
}

const DEFAULT_PHASE_NOTES = {
  menstrualEarly: {
    icon: "🌧️",
    colorClass: "menstrual",
    en: {
      label: "Period (early)",
      text: "Flow and cramps tend to be at their strongest now. Energy is often low — comfort, warmth, and rest help.",
      tags: ["Heavy flow", "Cramps", "Low energy", "Rest"],
      support: "It's okay to slow down and do less today. Resting through cramps and fatigue isn't laziness — it's what your body needs right now.",
    },
    uk: {
      label: "Місячні (початок)",
      text: "Виділення і спазми зараз зазвичай найсильніші. Енергії часто мало — допоможуть тепло, комфорт і відпочинок.",
      tags: ["Сильні виділення", "Спазми", "Мало енергії", "Відпочинок"],
      support: "Сьогодні можна сповільнитися і робити менше. Відпочивати під час спазмів і втоми — це не лінь, а те, що твоєму тілу справді потрібно зараз.",
    },
  },
  menstrualLate: {
    icon: "🌦️",
    colorClass: "menstrual",
    en: {
      label: "Period (tapering off)",
      text: "Flow is usually lighter now and energy starts to return. Many feel relief as symptoms ease off.",
      tags: ["Lighter flow", "Energy returning", "Relief"],
      support: "If you're still feeling tired or low, that's normal — there's no need to rush back to full speed.",
    },
    uk: {
      label: "Місячні (закінчуються)",
      text: "Виділення зазвичай уже слабшають, і енергія потроху повертається. Багато хто відчуває полегшення, коли симптоми відступають.",
      tags: ["Слабші виділення", "Енергія повертається", "Полегшення"],
      support: "Якщо ти ще відчуваєш втому чи млявість — це нормально. Немає потреби одразу повертатися на повну швидкість.",
    },
  },
  follicularEarly: {
    icon: "🌱",
    colorClass: "follicular",
    en: {
      label: "Early follicular",
      text: "Body and mind are recovering. Energy is gradually building and you may feel calmer or more reflective.",
      tags: ["Recovering", "Calm", "Steady"],
      support: "It's fine if your energy isn't back to 100% yet — it tends to build gradually over the next few days.",
    },
    uk: {
      label: "Рання фолікулярна фаза",
      text: "Тіло й розум відновлюються. Енергія поступово зростає, і ти можеш почувати себе спокійніше або більш заглиблено в думки.",
      tags: ["Відновлення", "Спокій", "Стабільність"],
      support: "Це нормально, якщо енергії ще не на 100% — вона зазвичай наростає поступово протягом наступних кількох днів.",
    },
  },
  follicularLate: {
    icon: "🌼",
    colorClass: "follicular",
    en: {
      label: "Late follicular",
      text: "Energy, confidence and mood are climbing toward their peak. Motivation, sociability and drive often increase.",
      tags: ["Rising energy", "Motivated", "Social", "Optimistic"],
      support: "Enjoy the extra energy if it shows up — but it's still okay to rest if that's what you need today.",
    },
    uk: {
      label: "Пізня фолікулярна фаза",
      text: "Енергія, впевненість і настрій наближаються до свого піку. Мотивація, бажання спілкуватися й запал часто зростають.",
      tags: ["Зростання енергії", "Мотивація", "Спілкування", "Оптимізм"],
      support: "Насолоджуйся додатковою енергією, якщо вона з'явилася — але якщо сьогодні потрібен відпочинок, це теж цілком нормально.",
    },
  },
  ovulation: {
    icon: "🌟",
    colorClass: "ovulation",
    en: {
      label: "Ovulation",
      text: "Often the highest-energy, most confident phase. Expect more sociability, talkativeness, and laughter than usual.",
      tags: ["High energy", "Confident", "Social", "More laughter"],
      support: "Even on a 'high energy' day, it's okay to take things slowly if that's what feels right.",
    },
    uk: {
      label: "Овуляція",
      text: "Часто найенергійніша і найвпевненіша фаза. Очікуй більше бажання спілкуватися, балакучості й сміху, ніж зазвичай.",
      tags: ["Багато енергії", "Впевненість", "Спілкування", "Більше сміху"],
      support: "Навіть у день 'високої енергії' цілком нормально не поспішати, якщо так підказує тіло.",
    },
  },
  lutealEarly: {
    icon: "🍃",
    colorClass: "luteal",
    en: {
      label: "Early luteal",
      text: "Energy is steady but starting to settle. Many feel focused, productive, and good at organizing or wrapping up tasks.",
      tags: ["Focused", "Productive", "Steady", "Nesting"],
      support: "If you're craving more quiet time than usual, that's a normal part of this phase — listen to it.",
    },
    uk: {
      label: "Рання лютеїнова фаза",
      text: "Енергія стабільна, але вже потроху вщухає. Багато хто почуває себе зосередженим, продуктивним і добре впорядковує справи.",
      tags: ["Зосередженість", "Продуктивність", "Стабільність", "Облаштування"],
      support: "Якщо хочеться більше тиші й спокою, ніж зазвичай — це нормальна частина цієї фази. Послухай себе.",
    },
  },
  lutealLate: {
    icon: "🍂",
    colorClass: "luteal",
    en: {
      label: "Late luteal",
      text: "Progesterone is starting to ease off and the first subtle shifts can creep in — slightly lower energy, a touch less patience by evening, or a pull toward familiar routines.",
      tags: ["Settling", "Lower energy", "Nesting", "Quieter"],
      support: "If you're winding down earlier than usual or craving more quiet time, that's a normal early signal — not a sign anything's wrong.",
    },
    uk: {
      label: "Пізня лютеїнова фаза",
      text: "Прогестерон починає знижуватися, і можуть з'явитися перші ледь помітні зміни — трохи менше енергії, менше терпіння до вечора або тяжіння до звичних речей.",
      tags: ["Заспокоєння", "Менше енергії", "Облаштування", "Тихіше"],
      support: "Якщо ти втомлюєшся раніше, ніж звично, або хочеш більше тиші — це нормальний ранній сигнал, а не привід тривожитися.",
    },
  },
  pms: {
    icon: "⛈️",
    colorClass: "pms",
    en: {
      label: "PMS (pre-period)",
      text: "Mood swings, irritability, sadness, or crying spells are common now. Cravings, bloating, and lower tolerance for stress often increase.",
      tags: ["Irritable", "Mood swings", "Crying spells", "Sensitive", "Cravings"],
      support: "If you feel like crying today, that's completely normal. Your hormones are shifting and your feelings are valid — be gentle with yourself, this will pass.",
    },
    uk: {
      label: "ПМС (перед місячними)",
      text: "Зараз часто трапляються перепади настрою, дратівливість, смуток або сльози. Тяга до їжі, набряклість і нижча стійкість до стресу теж зазвичай зростають.",
      tags: ["Дратівливість", "Перепади настрою", "Сльози", "Чутливість", "Тяга до їжі"],
      support: "Якщо сьогодні хочеться плакати — це цілком нормально. Твої гормони змінюються, і твої почуття мають значення — будь до себе доброю, це минеться.",
    },
  },
};

const AFFIRMATIONS = {
  en: {
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
  },
  uk: {
    menstrualEarly: [
      "Я така вдячна цьому тілу і тихій роботі, яку воно зараз виконує.",
      "Мене підтримують і про мене дбають, навіть у мої найвразливіші дні.",
      "Мені дозволено відпочивати — я вдячна за кожну хвилину спокою.",
      "Я зцілююся, я в безпеці, і я вірю, що добрі речі все ще чекають на мене.",
      "Я вдячна за власну м'якість. Це теж сила.",
      "Я вірю, що ця важка хвилина звільняє місце для чогось кращого.",
      "Я так вдячна, що сама дбаю про себе, сьогодні і завжди.",
      "Я вірю в себе, навіть коли рухаюся повільно. Я все ще стаю собою.",
    ],
    menstrualLate: [
      "Я так вдячна, що поступово відчуваю, як повертаюся до себе.",
      "Я притягую чудеса, навіть у дні, коли ще одужую.",
      "Я вірю, що світліші дні вже в дорозі до мене.",
      "Я вдячна мудрості свого тіла — воно завжди знає, як мене відновити.",
      "Я пишаюся собою за те, що пройшла найважчі дні з гідністю.",
      "Я вірю, що легкість повертається, і я приймаю її повністю.",
      "Я вдячна за прогрес, навіть той, який ніхто інший не бачить.",
      "Я вірю у власну стійкість. Я завжди знаходжу шлях назад до себе.",
    ],
    follicularEarly: [
      "Я так вдячна цій свіжій, ясній енергії, що зростає в мені.",
      "Я притягую нові ідеї та хороші можливості.",
      "Я вірю в тихі зерна, які сьогодні саджу.",
      "Я вдячна за своє терпіння і ясність — це справжні дари.",
      "Я вірю, що маленькі кроки сьогодні будують щось справжнє.",
      "Я відкрита, я повна надії, і я довіряю часу свого життя.",
      "Я вдячна за спокій перед розгоном.",
      "Я вірю в себе настільки, щоб почати знову, сьогодні.",
    ],
    follicularLate: [
      "Я так вдячна цій зростаючій енергії і впевненості, яку вона приносить.",
      "Я притягую чудеса, і я готова їх прийняти.",
      "Я вірю у свої ідеї і довіряю собі довести справу до кінця.",
      "Я вдячна за свою сміливість казати 'так' тому, що мене захоплює.",
      "Я вірю, що перебуваю саме там, де маю бути, рухаючись вперед.",
      "Я вдячна за власний імпульс — я будую щось хороше.",
      "Я вірю, що добрі речі приходять до мене, коли я сміливо заявляю про себе.",
      "Я так вдячна цьому запалу. Я довіряю тому, куди він мене веде.",
    ],
    ovulation: [
      "Я так вдячна цій впевненості і тому, як я зараз сяю.",
      "Я притягую чудеса, любов і добру долю.",
      "Я вірю у власну магнетичність — мені не треба применшувати себе ні для кого.",
      "Я вдячна за свій голос і довіряю, що його варто почути.",
      "Я довіряю своїй інтуїції; вона завжди вела мене правильно.",
      "Я вдячна за людей, яких я об'єдную, і радість, яку ми поділяємо.",
      "Я вірю, що це мій момент, і приймаю його з вдячністю.",
      "Я так вдячна, що почуваюся настільки живою, здатною і цілісною.",
    ],
    lutealEarly: [
      "Я так вдячна цій стабільній зосередженості і тихій наполегливості.",
      "Я притягую завершеність — що я починаю, я доводжу до кінця.",
      "Я вірю, що моя послідовність сьогодні будує завтрашні чудеса.",
      "Я вдячна за власну дисципліну; це моя тиха суперсила.",
      "Я вірю, що речі, якими я дбаю зараз, окупляться.",
      "Я вдячна за продуктивні, спокійні дні, як цей.",
      "Я вірю в цінність своєї тихої праці, навіть коли ніхто не дивиться.",
      "Я так вдячна за порядок і спокій, які я створюю для себе.",
    ],
    lutealLate: [
      "Я так вдячна за дозвіл сповільнитися і захистити свій спокій.",
      "Я притягую чудеса навіть у найтихіші, найделікатніші моменти.",
      "Я вірю, що вибрати відпочинок цього вечора — це акт довіри до себе.",
      "Я вдячна за комфорт, звичність і людей, які відчуваються як дім.",
      "Я вірю, що мої м'якші дні теж мають значення, повністю і безумовно.",
      "Я вдячна за власну чесність щодо того, що мені зараз потрібно.",
      "Я вірю в себе, навіть коли моєї енергії мало. Я все ще достатня.",
      "Я так вдячна цьому м'якшому темпу — це саме те, що мені потрібно.",
    ],
    pms: [
      "Я так вдячна собі, особливо в цю важку хвилину.",
      "Я притягую чудеса, навіть коли все зараз здається важким.",
      "Я вірю, що це почуття тимчасове, і вірю, що воно мине.",
      "Я вдячна за глибину своїх почуттів — це робить мене людиною, а не слабкою.",
      "Я вірю в себе, навіть у дні, які здаються неможливими.",
      "Я вдячна за милість, особливо ту, яку дарую собі сьогодні.",
      "Я вірю, що мене люблять і підтримують, навіть у найважчі моменти.",
      "Я так вдячна, що завтра буде легше. Сьогодні мені просто треба бути доброю до себе.",
    ],
  },
};

// A few rewordings of each phase's "what to expect" description so it doesn't
// read identically for every day of a multi-day phase.
const PHASE_TEXT_VARIANTS = {
  en: {
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
  },
  uk: {
    menstrualEarly: [
      "Виділення і спазми зараз зазвичай найсильніші. Енергії часто мало — допоможуть комфорт, тепло і відпочинок.",
      "Це зазвичай найважчі дні — типові сильніші виділення і спазми. Дозволь собі відпочинок і тепло.",
      "Твоє тіло зараз багато працює. Очікуй найсильніших виділень, а енергія може бути нижчою, ніж звично.",
    ],
    menstrualLate: [
      "Виділення зазвичай уже слабші, і енергія починає повертатися. Багато хто відчуває полегшення, коли симптоми відступають.",
      "Стає легше — виділення слабшають, спазми відступають, а енергія потроху повертається.",
      "Коли місячні закінчуються, очікуй слабших виділень і поступового повернення енергії та звичного настрою.",
    ],
    follicularEarly: [
      "Тіло й розум відновлюються. Енергія поступово наростає, і ти можеш почувати себе спокійніше або заглибленіше в думки.",
      "Це період відновлення — енергія наростає повільно, і часто з'являється відчуття спокою чи ясності.",
      "Твоє тіло тихо відновлює сили. Очікуй м'якого зростання енергії і рівномірнішого, заглибленого настрою.",
    ],
    follicularLate: [
      "Енергія, впевненість і настрій наближаються до свого піку. Мотивація, бажання спілкуватися й запал часто зростають.",
      "Все набирає обертів — очікуй зростання енергії, гострішого фокусу і товариськішого, бадьорішого настрою.",
      "Ти наближаєшся до піку. Мотивація і впевненість зазвичай помітно зростають у ці дні.",
    ],
    ovulation: [
      "Часто найенергійніша і найвпевненіша фаза. Очікуй більше бажання спілкуватися, балакучості й сміху, ніж зазвичай.",
      "Зазвичай це твій пік — енергія, впевненість і товариськість часто на найвищому рівні.",
      "Очікуй відчуття особливої відкритості й енергійності. Багато хто помічає більше сміху, шарму і самовпевненості саме зараз.",
    ],
    lutealEarly: [
      "Енергія стабільна, але вже потроху вщухає. Багато хто почувається зосередженим, продуктивним і добре впорядковує справи.",
      "Енергія тримається стабільно, а фокус загострюється — гарний період для продуктивності й організації справ.",
      "Очікуй спокійного, дієвого настрою. Багатьох тягне впорядкувати незавершені справи й зайнятися практичними завданнями.",
    ],
    lutealLate: [
      "Прогестерон починає знижуватися, і можуть з'явитися перші ледь помітні зміни — трохи менше енергії, менше терпіння до вечора або тяжіння до звичних речей.",
      "Енергія потроху спадає, а терпіння до вечора може стати тоншим. Тяжіння до звичних і комфортних речей — звична справа.",
      "Очікуй м'якого сповільнення — трохи менше енергії, тихіший настрій і бажання дотримуватися звичного, а не нового.",
    ],
    pms: [
      "Зараз часто трапляються перепади настрою, дратівливість, смуток або сльози. Тяга до їжі, набряклість і нижча стійкість до стресу теж зазвичай зростають.",
      "Очікуй посилених емоцій — дратівливість, сльозливість або перепади настрою трапляються часто, разом із тягою до їжі та набряклістю.",
      "Цей період часто приносить сильніші емоційні реакції, нижчу стійкість до стресу, тягу до їжі та фізичний дискомфорт, як набряклість.",
    ],
  },
};

const PARTNER_ALERTS = {
  en: {
    menstrualEarly: "Her period just started and energy is low. Maybe handle dinner, grab a heating pad, and keep things low-key tonight.",
    menstrualLate: "Period's tapering off — she may have a bit more energy back, but no need to push plans either way.",
    follicularEarly: "She's likely feeling calmer and more recovered today. A good day for easy plans together.",
    follicularLate: "Energy and mood are on the rise — a great window for that date, trip, or big conversation you've been holding onto.",
    ovulation: "Peak energy and confidence day. She's likely feeling great — good day for something fun together.",
    lutealEarly: "She may want more quiet time than usual. Don't take it personally if she's a bit more focused or low-key.",
    lutealLate: "Energy may be starting to dip a bit earlier in the evening, and she may be leaning toward familiar routines over new plans. Nothing to worry about — just go with the slower pace.",
    pms: "PMS phase has started — bring snacks, give extra patience, and maybe don't pick fights today. Small kindnesses go a long way right now.",
  },
  uk: {
    menstrualEarly: "У неї щойно почалися місячні, і енергії мало. Можливо, варто взяти на себе вечерю, знайти грілку і провести вечір спокійно.",
    menstrualLate: "Місячні вже закінчуються — енергії може бути трохи більше, але не варто наполягати на планах у будь-який бік.",
    follicularEarly: "Сьогодні вона, ймовірно, почувається спокійнішою і відновленою. Гарний день для легких спільних планів.",
    follicularLate: "Енергія і настрій ростуть — чудовий момент для того побачення, поїздки чи важливої розмови, яку ти відкладав.",
    ovulation: "День пікової енергії й впевненості. Їй, ймовірно, дуже добре — хороший день для чогось веселого разом.",
    lutealEarly: "Можливо, їй захочеться більше тиші, ніж звично. Не сприймай це особисто, якщо вона стане трохи зосередженішою чи спокійнішою.",
    lutealLate: "Енергія може почати спадати трохи раніше ввечері, і її може тягнути до звичних речей замість нових планів. Нічого тривожного — просто підлаштуйся до повільнішого темпу.",
    pms: "Почалася фаза ПМС — захопи смаколики, май більше терпіння і, можливо, не варто провокувати конфлікти сьогодні. Маленькі прояви турботи зараз дуже важать.",
  },
};

const MOOD_LABELS = {
  en: {
    happy: "😄 Happy",
    calm: "😌 Calm",
    tired: "😴 Tired",
    irritable: "😠 Irritable",
    sad: "😢 Sad / Crying",
    anxious: "😰 Anxious",
  },
  uk: {
    happy: "😄 Щасливо",
    calm: "😌 Спокійно",
    tired: "😴 Втомлено",
    irritable: "😠 Дратівливо",
    sad: "😢 Сумно / Плач",
    anxious: "😰 Тривожно",
  },
};

// Returns the active-language phase note (icon/colorClass shared, label/text/tags/support translated).
function getPhaseNote(phaseKey) {
  const note = state.phaseNotes[phaseKey];
  const langData = note[LANG] || note.en;
  return { icon: note.icon, colorClass: note.colorClass, ...langData };
}

const UI_STRINGS = {
  en: {
    pageTitle: "CycleTogether",
    appTitle: "CycleTogether",
    modeTogglePartner: "Partner view",
    modeToggleMy: "My view",
    noDataMessage1: "No cycle data yet. Go to",
    settingsWord: "Settings",
    noDataMessage2: "and enter the start date of the last period to get started.",
    todaysTheme: "Today's theme",
    todaysInsight: "Today's insight",
    affirmationTab: "Affirmation",
    howAreYouFeeling: "How are you feeling?",
    moodHint: "Log how you're feeling today — pick as many as fit. You can review this later in History.",
    moodHappy: "😄 Happy",
    moodCalm: "😌 Calm",
    moodTired: "😴 Tired",
    moodIrritable: "😠 Irritable",
    moodSad: "😢 Sad / Crying",
    moodAnxious: "😰 Anxious",
    loggedForToday: "Logged for today ✓",
    comingUp: "Coming up",
    legendMenstrual: "Menstrual",
    legendFollicular: "Follicular",
    legendOvulation: "Ovulation",
    legendLuteal: "Luteal",
    legendPms: "PMS",
    tapDayHint: "Tap a day to see what to expect.",
    theme: "Theme",
    markAsPeriodStart: "Mark as period start",
    unmarkAsPeriodStart: "Unmark as period start",
    moodHistory: "Mood history",
    moodHistoryHint: "Your logged moods, most recent first, with the cycle phase for that day.",
    noMoodsLoggedYet: "No moods logged yet. Log how you're feeling on the Today tab.",
    cycleInfo: "Cycle info",
    lastPeriodStartLabel: "Start date of last period",
    avgCycleLengthLabel: "Average cycle length (days)",
    avgPeriodLengthLabel: "Average period length (days)",
    saveBtn: "Save",
    savedMsg: "Saved ✓",
    periodHistory: "Period history",
    periodHistoryHint: "Past start dates, most recent first.",
    noEntriesYet: "No entries yet.",
    removeBtn: "Remove",
    settingsManagedMsg: "Settings are managed by the person tracking their cycle. Switch to \"My view\" to edit.",
    partnerSync: "Partner Sync",
    premiumBadge: "Premium",
    partnerSyncHint: "Get a daily heads-up alert about her cycle phase — what to expect and how to be supportive. $3/month.",
    subscribeBtn: "Subscribe ($3/month)",
    unsubscribeBtn: "Unsubscribe",
    enableNotificationsBtn: "Enable notifications",
    sendTestAlertBtn: "Send test alert",
    shareWithPartner: "Share with partner",
    shareWithPartnerHint: "Generate a code with your cycle settings (no mood logs or history) for your partner to enter on their own phone. Their app will then show predictions independently — no need to hand over your phone.",
    generateCodeBtn: "Generate code",
    copyCodeBtn: "Copy code",
    copiedMsg: "Copied ✓",
    importPartnerCode: "Import partner code",
    pasteCodePlaceholder: "Paste code here",
    importBtn: "Import",
    undoPartnerDeviceBtn: "This is actually my device — undo",
    yourData: "Your data & privacy",
    yourDataHint: "Everything you enter — dates, settings, mood logs — is saved only on this device, in this browser. Nothing is sent to a server and no account is needed. If you clear your browser data, switch phones, or reinstall, that data will be lost unless you back it up below.",
    exportBackupBtn: "Download backup",
    importBackupBtn: "Restore from backup",
    backupExportedMsg: "Backup downloaded ✓",
    backupRestoredMsg: "Backup restored ✓",
    backupInvalidMsg: "That file doesn't look like a valid CycleTogether backup.",
    about: "About",
    aboutHint: "This app gives general predictions based on average cycle lengths. Real cycles vary — use it as a gentle guide, not a guarantee.",
    tabToday: "Today",
    tabCalendar: "Calendar",
    tabHistory: "History",
    tabSettings: "Settings",
    importHintNormal: "Important: only paste a code here on your partner's phone, not your own — doing so will switch this device permanently into Partner view.",
    importHintPartnerDevice: "Paste an updated code here if your partner's cycle info changes.",
    insightExpect: "What to expect",
    insightBe: "How to be with yourself",
    insightAdvice: "Today's tip",
    insightExpectPartner: "What's going on",
    insightBePartner: "How to support her",
    insightAdvicePartner: "Quick tip",
    upcomingOvulationStart: "Ovulation window starts",
    upcomingPmsStart: "PMS phase starts",
    upcomingNextPeriod: "Next period expected",
    tomorrow: "tomorrow",
    inNDays: (n) => `in ${n} days`,
    cycleDayTemplate: (day, len) => `Day ${day} of ${len}-day cycle`,
    dayDetailDateTemplate: (dateStr, day, len) => `${dateStr} · Day ${day} of ${len}`,
    invalidCodeMsg: "That code doesn't look right. Ask your partner to generate a new one.",
    importedMsg: "Imported ✓ — this device is now set up as the partner view.",
    notificationsNotSupported: "Notifications aren't supported in this browser.",
    subscribedEnabled: "Subscribed ✓ — you'll get a daily alert about her cycle phase.",
    notificationsBlocked: "Notifications are blocked in your browser settings. Enable them to receive alerts.",
    subscribedNeedsEnable: "Subscribed ✓ — turn on notifications to start receiving daily alerts.",
    partnerAlertPreview: (text) => `Today's alert would say: "${text}"`,
    partnerAlertNoData: "Import a partner code to start getting daily alerts.",
  },
  uk: {
    pageTitle: "CycleTogether",
    appTitle: "CycleTogether",
    modeTogglePartner: "Вигляд партнера",
    modeToggleMy: "Мій вигляд",
    noDataMessage1: "Поки немає даних про цикл. Перейди в",
    settingsWord: "Налаштування",
    noDataMessage2: "і введи дату початку останніх місячних, щоб почати.",
    todaysTheme: "Тема дня",
    todaysInsight: "Інсайт дня",
    affirmationTab: "Афірмація",
    howAreYouFeeling: "Як ти почуваєшся?",
    moodHint: "Запиши, як ти почуваєшся сьогодні — обери стільки варіантів, скільки підходить. Переглянути це можна пізніше в Історії.",
    moodHappy: "😄 Щасливо",
    moodCalm: "😌 Спокійно",
    moodTired: "😴 Втомлено",
    moodIrritable: "😠 Дратівливо",
    moodSad: "😢 Сумно / Плач",
    moodAnxious: "😰 Тривожно",
    loggedForToday: "Записано на сьогодні ✓",
    comingUp: "Незабаром",
    legendMenstrual: "Місячні",
    legendFollicular: "Фолікулярна",
    legendOvulation: "Овуляція",
    legendLuteal: "Лютеїнова",
    legendPms: "ПМС",
    tapDayHint: "Натисни на день, щоб побачити, чого очікувати.",
    theme: "Тема",
    markAsPeriodStart: "Позначити як початок місячних",
    unmarkAsPeriodStart: "Скасувати позначку початку місячних",
    moodHistory: "Історія настрою",
    moodHistoryHint: "Твої записані настрої, від найновіших, з фазою циклу для кожного дня.",
    noMoodsLoggedYet: "Настрій ще не записано. Запиши, як почуваєшся, на вкладці Сьогодні.",
    cycleInfo: "Інформація про цикл",
    lastPeriodStartLabel: "Дата початку останніх місячних",
    avgCycleLengthLabel: "Середня довжина циклу (днів)",
    avgPeriodLengthLabel: "Середня тривалість місячних (днів)",
    saveBtn: "Зберегти",
    savedMsg: "Збережено ✓",
    periodHistory: "Історія місячних",
    periodHistoryHint: "Минулі дати початку, від найновіших.",
    noEntriesYet: "Записів ще немає.",
    removeBtn: "Видалити",
    settingsManagedMsg: "Налаштування керує людина, яка відстежує свій цикл. Переключися на \"Мій вигляд\", щоб редагувати.",
    partnerSync: "Синхронізація з партнером",
    premiumBadge: "Преміум",
    partnerSyncHint: "Отримуй щоденне сповіщення про її фазу циклу — чого очікувати і як підтримати. $3/місяць.",
    subscribeBtn: "Підписатися ($3/місяць)",
    unsubscribeBtn: "Скасувати підписку",
    enableNotificationsBtn: "Увімкнути сповіщення",
    sendTestAlertBtn: "Надіслати тестове сповіщення",
    shareWithPartner: "Поділитися з партнером",
    shareWithPartnerHint: "Створи код із налаштуваннями свого циклу (без записів настрою чи історії), щоб партнер ввів його на своєму телефоні. Його застосунок показуватиме прогнози самостійно — не потрібно передавати телефон.",
    generateCodeBtn: "Створити код",
    copyCodeBtn: "Скопіювати код",
    copiedMsg: "Скопійовано ✓",
    importPartnerCode: "Імпортувати код партнера",
    pasteCodePlaceholder: "Вставити код тут",
    importBtn: "Імпортувати",
    undoPartnerDeviceBtn: "Це насправді мій пристрій — скасувати",
    yourData: "Твої дані та приватність",
    yourDataHint: "Усе, що ти вводиш — дати, налаштування, записи настрою — зберігається лише на цьому пристрої, у цьому браузері. Нічого не надсилається на сервер, і акаунт не потрібен. Якщо ти очистиш дані браузера, поміняєш телефон або перевстановиш застосунок, ці дані буде втрачено, якщо не зробити резервну копію нижче.",
    exportBackupBtn: "Завантажити резервну копію",
    importBackupBtn: "Відновити з резервної копії",
    backupExportedMsg: "Резервну копію завантажено ✓",
    backupRestoredMsg: "Резервну копію відновлено ✓",
    backupInvalidMsg: "Цей файл не схожий на дійсну резервну копію CycleTogether.",
    about: "Про застосунок",
    aboutHint: "Цей застосунок надає загальні прогнози на основі середньої довжини циклу. Реальні цикли відрізняються — використовуй це як м'який орієнтир, а не гарантію.",
    tabToday: "Сьогодні",
    tabCalendar: "Календар",
    tabHistory: "Історія",
    tabSettings: "Налаштування",
    importHintNormal: "Важливо: вставляй код тут лише на телефоні партнера, не своєму — інакше цей пристрій назавжди переключиться у вигляд партнера.",
    importHintPartnerDevice: "Встав оновлений код тут, якщо дані циклу партнера зміняться.",
    insightExpect: "Чого очікувати",
    insightBe: "Як бути з собою",
    insightAdvice: "Порада дня",
    insightExpectPartner: "Що відбувається",
    insightBePartner: "Як підтримати її",
    insightAdvicePartner: "Швидка порада",
    upcomingOvulationStart: "Початок вікна овуляції",
    upcomingPmsStart: "Початок фази ПМС",
    upcomingNextPeriod: "Очікувані наступні місячні",
    tomorrow: "завтра",
    inNDays: (n) => `через ${n} ${n === 1 ? "день" : n >= 2 && n <= 4 ? "дні" : "днів"}`,
    cycleDayTemplate: (day, len) => `День ${day} з ${len}-денного циклу`,
    dayDetailDateTemplate: (dateStr, day, len) => `${dateStr} · День ${day} з ${len}`,
    invalidCodeMsg: "Цей код виглядає некоректним. Попроси партнера створити новий.",
    importedMsg: "Імпортовано ✓ — цей пристрій налаштовано як вигляд партнера.",
    notificationsNotSupported: "Цей браузер не підтримує сповіщення.",
    subscribedEnabled: "Підписано ✓ — ти отримуватимеш щоденне сповіщення про її фазу циклу.",
    notificationsBlocked: "Сповіщення блоковані в налаштуваннях твого браузера. Увімкни їх, щоб отримувати сповіщення.",
    subscribedNeedsEnable: "Підписано ✓ — увімкни сповіщення, щоб почати отримувати щоденні сповіщення.",
    partnerAlertPreview: (text) => `Сьогоднішнє сповіщення скаже: "${text}"`,
    partnerAlertNoData: "Імпортуй код партнера, щоб почати отримувати щоденні сповіщення.",
  },
};

function applyUIStrings() {
  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  document.title = dict.pageTitle;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined && typeof dict[key] === "string") {
      el.textContent = dict[key];
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) {
      el.placeholder = dict[key];
    }
  });
}

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
      const incoming = parsed.phaseNotes && parsed.phaseNotes[key];
      if (!incoming) return;
      mergedPhaseNotes[key] = {
        icon: incoming.icon || mergedPhaseNotes[key].icon,
        colorClass: incoming.colorClass || mergedPhaseNotes[key].colorClass,
        en: { ...mergedPhaseNotes[key].en, ...(incoming.en || {}) },
        uk: { ...mergedPhaseNotes[key].uk, ...(incoming.uk || {}) },
      };
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
  const pool = L(AFFIRMATIONS)[info.phaseKey];
  const index = ((info.cycleNumber + info.cycleDay) % pool.length + pool.length) % pool.length;
  return pool[index];
}

// Picks a reworded variant of the phase's "what to expect" text so consecutive
// days within the same phase don't show identical wording.
function getPhaseText(info) {
  const variants = L(PHASE_TEXT_VARIANTS)[info.phaseKey];
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
  const variants = L(DAILY_INSIGHTS)[`day_${day}`];
  const variantIndex = ((info.cycleNumber % variants.length) + variants.length) % variants.length;
  const headline = variants[variantIndex].headline;

  if (state.partnerMode) {
    return { ...L(PARTNER_INSIGHTS)[`day_${day}`], headline };
  }

  return variants[variantIndex];
}

function applyInsightLabels() {
  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  const labels = state.partnerMode
    ? { expect: dict.insightExpectPartner, be: dict.insightBePartner, advice: dict.insightAdvicePartner }
    : { expect: dict.insightExpect, be: dict.insightBe, advice: dict.insightAdvice };

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

  const phase = getPhaseNote(info.phaseKey);
  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  document.getElementById("phaseIcon").textContent = phase.icon;
  document.getElementById("phaseName").textContent = phase.label;
  document.getElementById("cycleDay").textContent = dict.cycleDayTemplate(info.cycleDay, info.cycleLength);
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

  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  const items = [];
  const ovulationStartDate = addDays(today, daysUntilCycleDay(info, info.ovulationStart));
  const pmsStartDate = addDays(today, daysUntilCycleDay(info, info.pmsStart));
  const nextPeriodDate = addDays(today, daysUntilCycleDay(info, 1, true));

  if (info.phaseKey !== "ovulation") {
    items.push({ label: dict.upcomingOvulationStart, date: ovulationStartDate });
  }
  if (info.phaseKey !== "pms") {
    items.push({ label: dict.upcomingPmsStart, date: pmsStartDate });
  }
  items.push({ label: dict.upcomingNextPeriod, date: nextPeriodDate });

  items
    .filter((item) => item.date > today)
    .sort((a, b) => a.date - b.date)
    .forEach((item) => {
      const li = document.createElement("li");
      const days = diffDays(item.date, today);
      const labelSpan = document.createElement("span");
      labelSpan.textContent = item.label;
      const valueSpan = document.createElement("span");
      valueSpan.textContent = days === 1 ? dict.tomorrow : dict.inNDays(days);
      li.appendChild(labelSpan);
      li.appendChild(valueSpan);
      list.appendChild(li);
    });
}

// ---------- History tab ----------
function renderHistory() {
  const list = document.getElementById("moodHistoryList");
  list.innerHTML = "";

  const entries = Object.entries(state.moodLog).sort((a, b) => (a[0] < b[0] ? 1 : -1));

  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  const dateLocale = LANG === "uk" ? "uk-UA" : undefined;

  if (!entries.length) {
    const li = document.createElement("li");
    li.textContent = dict.noMoodsLoggedYet;
    list.appendChild(li);
    return;
  }

  entries.forEach(([iso, value]) => {
    const date = parseISO(iso);
    const info = getCycleInfo(date);
    const phase = info ? getPhaseNote(info.phaseKey) : null;
    const moods = getLoggedMoods(value);

    const li = document.createElement("li");

    const top = document.createElement("div");
    top.className = "mood-history-top";
    const dateSpan = document.createElement("span");
    dateSpan.className = "mood-history-date";
    dateSpan.textContent = date.toLocaleDateString(dateLocale, { weekday: "short", month: "short", day: "numeric" });
    const moodSpan = document.createElement("span");
    moodSpan.textContent = moods.map((mood) => L(MOOD_LABELS)[mood] || mood).join(", ");
    top.appendChild(dateSpan);
    top.appendChild(moodSpan);
    li.appendChild(top);

    if (phase) {
      const phaseSpan = document.createElement("div");
      phaseSpan.className = "mood-history-phase";
      phaseSpan.textContent = `${phase.icon} ${phase.label} · ${dict.cycleDayTemplate(info.cycleDay, info.cycleLength)}`;
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

const MONTH_NAMES = {
  en: ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"],
  uk: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
    "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
};

const WEEKDAY_ABBR = {
  en: ["S", "M", "T", "W", "T", "F", "S"],
  uk: ["Н", "П", "В", "С", "Ч", "П", "С"],
};

function renderCalendar() {
  const title = document.getElementById("calendarTitle");
  const grid = document.getElementById("calendarGrid");
  const monthNames = L(MONTH_NAMES);
  title.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;

  grid.innerHTML = "";
  L(WEEKDAY_ABBR).forEach((d) => {
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

  const phase = getPhaseNote(info.phaseKey);
  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  const dateLocale = LANG === "uk" ? "uk-UA" : undefined;
  document.getElementById("dayDetailIcon").textContent = phase.icon;
  document.getElementById("dayDetailPhase").textContent = phase.label;
  document.getElementById("dayDetailDate").textContent = dict.dayDetailDateTemplate(
    date.toLocaleDateString(dateLocale, { weekday: "long", month: "long", day: "numeric" }),
    info.cycleDay,
    info.cycleLength
  );
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
  periodBtn.textContent = isPeriodStart ? dict.unmarkAsPeriodStart : dict.markAsPeriodStart;
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
  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  const dateLocale = LANG === "uk" ? "uk-UA" : undefined;
  const sorted = [...state.periodHistory].sort((a, b) => parseISO(b) - parseISO(a));
  document.getElementById("lastPeriodDate").value = sorted[0] || "";
  document.getElementById("cycleLength").value = state.cycleLength;
  document.getElementById("periodLength").value = state.periodLength;

  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  if (!sorted.length) {
    const li = document.createElement("li");
    li.textContent = dict.noEntriesYet;
    historyList.appendChild(li);
  } else {
    sorted.forEach((iso) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = parseISO(iso).toLocaleDateString(dateLocale);
      const btn = document.createElement("button");
      btn.textContent = dict.removeBtn;
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

  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  let data;
  try {
    data = decodeShareCode(input);
    if (data.type !== "cyclesync-share") throw new Error("invalid");
  } catch (e) {
    msg.textContent = dict.invalidCodeMsg;
    msg.classList.remove("hidden");
    return;
  }

  state.cycleLength = data.cycleLength;
  state.periodLength = data.periodLength;
  state.periodHistory = data.lastPeriodDate ? [data.lastPeriodDate] : [];
  if (data.phaseNotes) {
    Object.keys(state.phaseNotes).forEach((key) => {
      const incoming = data.phaseNotes[key];
      if (!incoming) return;
      state.phaseNotes[key] = {
        icon: incoming.icon || state.phaseNotes[key].icon,
        colorClass: incoming.colorClass || state.phaseNotes[key].colorClass,
        en: { ...state.phaseNotes[key].en, ...(incoming.en || {}) },
        uk: { ...state.phaseNotes[key].uk, ...(incoming.uk || {}) },
      };
    });
  }
  state.partnerMode = true;
  state.isPartnerDevice = true;
  saveState();

  document.getElementById("importCode").value = "";
  msg.textContent = dict.importedMsg;
  msg.classList.remove("hidden");

  renderAll();
});

document.getElementById("undoPartnerDevice").addEventListener("click", () => {
  state.isPartnerDevice = false;
  state.partnerMode = false;
  saveState();
  renderAll();
});

// ---------- Full data backup (export/import) ----------
document.getElementById("exportBackup").addEventListener("click", () => {
  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  const blob = new Blob([JSON.stringify({ type: "cycletogether-backup", state }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `cycletogether-backup-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);

  const msg = document.getElementById("backupMsg");
  msg.textContent = dict.backupExportedMsg;
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 2500);
});

document.getElementById("importBackupFile").addEventListener("change", (e) => {
  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  const msg = document.getElementById("backupMsg");
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (parsed.type !== "cycletogether-backup" || !parsed.state) throw new Error("invalid");
      state = parsed.state;
      saveState();
      msg.textContent = dict.backupRestoredMsg;
      msg.classList.remove("hidden");
      renderAll();
    } catch (err) {
      msg.textContent = dict.backupInvalidMsg;
      msg.classList.remove("hidden");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

// ---------- Partner Sync Premium ----------
function renderPartnerSync() {
  const toggleBtn = document.getElementById("togglePartnerPremium");
  const enableBtn = document.getElementById("enableNotifications");
  const testBtn = document.getElementById("sendTestAlert");
  const status = document.getElementById("premiumStatus");
  const preview = document.getElementById("partnerAlertPreview");

  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  const today = toDateOnly(new Date());
  const info = getCycleInfo(today);
  preview.textContent = info
    ? dict.partnerAlertPreview(L(PARTNER_ALERTS)[info.phaseKey])
    : dict.partnerAlertNoData;

  if (state.partnerPremium) {
    toggleBtn.textContent = dict.unsubscribeBtn;
    toggleBtn.classList.remove("primary-btn");
    toggleBtn.classList.add("secondary-btn");
    enableBtn.classList.remove("hidden");
    testBtn.classList.remove("hidden");

    if (!("Notification" in window)) {
      status.textContent = dict.notificationsNotSupported;
    } else if (Notification.permission === "granted") {
      status.textContent = dict.subscribedEnabled;
      enableBtn.classList.add("hidden");
    } else if (Notification.permission === "denied") {
      status.textContent = dict.notificationsBlocked;
      enableBtn.classList.add("hidden");
    } else {
      status.textContent = dict.subscribedNeedsEnable;
    }
  } else {
    toggleBtn.textContent = dict.subscribeBtn;
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
  const phase = getPhaseNote(info.phaseKey);
  new Notification("CycleTogether — Partner Sync", {
    body: L(PARTNER_ALERTS)[info.phaseKey] || phase.text,
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
  const dict = UI_STRINGS[LANG] || UI_STRINGS.en;
  document.body.classList.toggle("partner-mode", state.partnerMode);
  applyInsightLabels();
  modeToggle.classList.toggle("active", state.partnerMode);
  modeToggle.textContent = state.partnerMode ? dict.modeToggleMy : dict.modeTogglePartner;
  modeToggle.classList.toggle("hidden", state.isPartnerDevice);

  document.getElementById("undoPartnerDevice").classList.toggle("hidden", !state.isPartnerDevice);
  document.getElementById("importHint").textContent = state.isPartnerDevice
    ? dict.importHintPartnerDevice
    : dict.importHintNormal;
}

modeToggle.addEventListener("click", () => {
  state.partnerMode = !state.partnerMode;
  saveState();
  renderAll();
  if (selectedDay) showDayDetail(selectedDay);
});

// ---------- Language ----------
const langToggle = document.getElementById("langToggle");
function applyLangToggleButton() {
  langToggle.classList.toggle("active", LANG === "uk");
  langToggle.textContent = LANG === "uk" ? "EN" : "UA";
}

langToggle.addEventListener("click", () => {
  LANG = LANG === "uk" ? "en" : "uk";
  localStorage.setItem(LANG_STORAGE_KEY, LANG);
  applyLangToggleButton();
  applyUIStrings();
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
applyLangToggleButton();
applyUIStrings();
renderAll();
checkPartnerAlert();
