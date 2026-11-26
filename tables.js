// ───────── TABELLEN: всички таблици за A1–A2, по категории ─────────
// Всяка таблица: {cat, id, lvl: "A1"|"A2", t: заглавие, why: кога/защо, html: таблица, tip: капан}. Немските клетки се чуват с цъкане.
const e_ = (x) => `<b class="m-end">${x}</b>`, g_ = (x) => `<b class="m-ge">${x}</b>`, p_ = (x) => `<b class="m-pre">${x}</b>`, v_ = (x) => `<b class="m-vow">${x}</b>`;
const tb = (head, rows, cls = "") => `<table class="g tbx ${cls}"><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<td class="rh">${c}</td>` : `<td>${c}</td>`)).join("")}</tr>`).join("")}</table>`;
const P6 = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
// спрежение: [инфинитив, [6 форми с маркировка]]
const conjT = (cols) => tb(["", ...cols.map((c) => c[0])], P6.map((p, i) => [p, ...cols.map((c) => c[1][i])]));
const end6 = (st, ends) => ends.map((x) => st + e_(x));
const CAT = [["artikel", "Членове и съществителни", "der"], ["pron", "Местоимения", "ich"], ["adj", "Прилагателни", "gut"], ["verb", "Глаголи: сегашно", "⚙"], ["vergangen", "Глаголи: минало", "⏮"],
  ["modi", "Модални, повелително, бъдеще, Konjunktiv", "≈"], ["praep", "Предлози", "→"], ["satz", "Словоред и изречения", "¶"], ["zeit", "Числа, дати, час", "#"], ["wort", "Словообразуване и род", "-ung"]];
const TABLES = [
// ═════ ЧЛЕНОВЕ ═════
{ cat: "artikel", id: "art-def", lvl: "A1", t: "Определителен член по падежи (der, die, das)",
  why: "Членът показва <b>рода</b> и <b>падежа</b>. Nominativ = кой/какво? (подлог) · Akkusativ = кого/какво? (пряко допълнение) · Dativ = на кого? и след mit, bei, zu… · Genitiv = чий? (A2, в говора рядко).",
  html: tb(["", "мъжки", "женски", "среден", "мн.ч."], [["Nominativ", "de" + e_("r") + " Mann", "di" + e_("e") + " Frau", "da" + e_("s") + " Kind", "di" + e_("e") + " Kinder"], ["Akkusativ", "de" + e_("n") + " Mann", "di" + e_("e") + " Frau", "da" + e_("s") + " Kind", "di" + e_("e") + " Kinder"],
    ["Dativ", "de" + e_("m") + " Mann", "de" + e_("r") + " Frau", "de" + e_("m") + " Kind", "de" + e_("n") + " Kinder" + e_("n")], ["Genitiv (A2)", "de" + e_("s") + " Mann" + e_("es"), "de" + e_("r") + " Frau", "de" + e_("s") + " Kind" + e_("es"), "de" + e_("r") + " Kinder"]]),
  tip: "Само <b>мъжкият род</b> се променя в Akkusativ (der → den). В Dativ мн.ч. съществителното получава <b>-n</b>: mit den Kinder<b>n</b>." },
{ cat: "artikel", id: "art-indef", lvl: "A1", t: "Неопределителен член и kein",
  why: "ein = един/някакъв (неопределено, ново нещо) · kein = никакъв (отрицание на ein). kein има същите окончания като ein, но има и мн.ч.",
  html: tb(["", "мъжки", "женски", "среден", "мн.ч."], [["Nominativ", "ein · kein", "ein" + e_("e") + " · kein" + e_("e"), "ein · kein", "— · kein" + e_("e")], ["Akkusativ", "ein" + e_("en") + " · kein" + e_("en"), "ein" + e_("e") + " · kein" + e_("e"), "ein · kein", "— · kein" + e_("e")],
    ["Dativ", "ein" + e_("em") + " · kein" + e_("em"), "ein" + e_("er") + " · kein" + e_("er"), "ein" + e_("em") + " · kein" + e_("em"), "— · kein" + e_("en")], ["Genitiv (A2)", "ein" + e_("es") + " · kein" + e_("es"), "ein" + e_("er") + " · kein" + e_("er"), "ein" + e_("es") + " · kein" + e_("es"), "— · kein" + e_("er")]]),
  tip: "nicht или kein? Пред съществително с ein или без член → <b>kein</b> (Ich habe <b>kein</b> Auto). Всичко друго → <b>nicht</b> (Ich komme <b>nicht</b>)." },
{ cat: "artikel", id: "art-dies", lvl: "A2", t: "dieser, jeder, welcher (като der)",
  why: "Тези думи имат окончанията на определителния член: <b>der → dies<u>er</u></b>, <b>die → dies<u>e</u></b>, <b>das → dies<u>es</u></b>.",
  html: tb(["", "мъжки", "женски", "среден", "мн.ч."], [["Nominativ", "dies" + e_("er"), "dies" + e_("e"), "dies" + e_("es"), "dies" + e_("e")], ["Akkusativ", "dies" + e_("en"), "dies" + e_("e"), "dies" + e_("es"), "dies" + e_("e")], ["Dativ", "dies" + e_("em"), "dies" + e_("er"), "dies" + e_("em"), "dies" + e_("en")], ["Genitiv", "dies" + e_("es"), "dies" + e_("er"), "dies" + e_("es"), "dies" + e_("er")]]),
  tip: "Същото: jed<b>er</b> (всеки, само ед.ч.), welch<b>er</b>? (кой?): Welch<b>es</b> Datum haben wir heute?" },
{ cat: "artikel", id: "plural", lvl: "A1", t: "Множествено число: 7 типа",
  why: "Мн.ч. е непредвидимо — учи го заедно с думата. Но има чести модели по род и окончание. Членът в мн.ч. е винаги <b>die</b>.",
  html: tb(["тип", "пример", "кога най-често"], [["-e", "der Tisch → die Tisch" + e_("e"), "мъжки и среден, едносрични"], ["¨-e", "der Stuhl → die St" + v_("ü") + "hl" + e_("e"), "мъжки, едносрични"], ["-er", "das Kind → die Kind" + e_("er"), "среден род"], ["¨-er", "das Buch → die B" + v_("ü") + "ch" + e_("er"), "среден род, едносрични"],
    ["-(e)n", "die Frau → die Frau" + e_("en") + " · die Lampe → die Lampe" + e_("n"), "почти всички женски (-e, -ung, -heit, -keit, -ion)"], ["-s", "das Auto → die Auto" + e_("s"), "чуждици, думи на -a, -o, -i"], ["— / ¨", "der Lehrer → die Lehrer · die Mutter → die M" + v_("ü") + "tter", "мъжки и среден на -er, -el, -en; -chen"]]),
  tip: "Думите на -in правят <b>-nen</b>: die Lehrerin → die Lehrerin<b>nen</b>." },
{ cat: "artikel", id: "ndekl", lvl: "A2", t: "n-деклинация (der Junge → den Junge-n)",
  why: "Някои мъжки съществителни получават <b>-n/-en</b> във всички падежи освен Nominativ. Това са главно мъжки на -e (хора/животни) и някои чуждици.",
  html: tb(["", "der Junge", "der Kollege", "der Student", "der Herr"], [["Nom.", "der Junge", "der Kollege", "der Student", "der Herr"], ["Akk.", "den Junge" + e_("n"), "den Kollege" + e_("n"), "den Student" + e_("en"), "den Herr" + e_("n")], ["Dat.", "dem Junge" + e_("n"), "dem Kollege" + e_("n"), "dem Student" + e_("en"), "dem Herr" + e_("n")], ["Gen.", "des Junge" + e_("n"), "des Kollege" + e_("n"), "des Student" + e_("en"), "des Herr" + e_("n")]]),
  tip: "Затова в писмо: Sehr geehrter <b>Herr</b> Müller, но: Ich kenne <b>Herrn</b> Müller." },
// ═════ МЕСТОИМЕНИЯ ═════
{ cat: "pron", id: "perspron", lvl: "A1", t: "Лични местоимения по падежи",
  why: "Nominativ — кой върши действието · Akkusativ — кого? (sehen, besuchen, anrufen, für, ohne) · Dativ — на кого? (helfen, danken, gefallen, gehören, mit, bei, zu).",
  html: tb(["Nominativ", "Akkusativ", "Dativ", "български"], [["ich", "mi" + e_("ch"), "mi" + e_("r"), "аз · ме · ми"], ["du", "di" + e_("ch"), "di" + e_("r"), "ти · те · ти"], ["er", "ih" + e_("n"), "ih" + e_("m"), "той · го · му"], ["sie", "sie", "ih" + e_("r"), "тя · я · ѝ"], ["es", "es", "ih" + e_("m"), "то · го · му"],
    ["wir", "uns", "uns", "ние · ни · ни"], ["ihr", "euch", "euch", "вие · ви · ви"], ["sie", "sie", "ihn" + e_("en"), "те · ги · им"], ["Sie", "Sie", "Ihn" + e_("en"), "Вие · Ви · Ви"]]),
  tip: "Трик: <b>-ch</b> = Akkusativ (mich, dich), <b>-r</b> = Dativ (mir, dir). Капан: <i>Ich rufe <b>dich</b> an</i> (не dir!), но <i>Ich helfe <b>dir</b></i>." },
{ cat: "pron", id: "poss", lvl: "A1", t: "Притежателни: mein, dein, sein, ihr…",
  why: "Първо избираш <b>чий</b> е (mein, dein, sein…), после окончанието според <b>рода и падежа на нещото</b> — окончанията са като на ein/kein.",
  html: tb(["лице", "притежателно", "пример"], [["ich", "mein", "mein Vater, mein" + e_("e") + " Mutter"], ["du", "dein", "dein Auto"], ["er / es", "sein", "sein Hund"], ["sie (тя)", "ihr", "ihr Mann"], ["wir", "unser", "unser" + e_("e") + " Wohnung"], ["ihr", "euer", "eu" + e_("re") + " Kinder (e изпада)"], ["sie (те)", "ihr", "ihr Haus"], ["Sie", "Ihr", "Ihr Name"]]) +
    tb(["", "мъжки", "женски", "среден", "мн.ч."], [["Nominativ", "mein", "mein" + e_("e"), "mein", "mein" + e_("e")], ["Akkusativ", "mein" + e_("en"), "mein" + e_("e"), "mein", "mein" + e_("e")], ["Dativ", "mein" + e_("em"), "mein" + e_("er"), "mein" + e_("em"), "mein" + e_("en")], ["Genitiv", "mein" + e_("es"), "mein" + e_("er"), "mein" + e_("es"), "mein" + e_("er")]]),
  tip: "<b>ihr</b> = нейният и техният; <b>Ihr</b> (с главна) = Вашият. Родът на <b>притежателя</b> избира думата (sein/ihr), родът на <b>нещото</b> — окончанието: <i>Sie liebt ihr<b>en</b> Hund</i>." },
{ cat: "pron", id: "refl", lvl: "A2", t: "Възвратни местоимения (sich)",
  why: "Когато действието се връща към подлога (мия се, радвам се). Повечето възвратни глаголи искат Akkusativ; с допълнение (sich die Hände waschen) — Dativ.",
  html: tb(["", "Akkusativ", "Dativ", "пример"], [["ich", "mich", "mir", "Ich freue <b>mich</b>. · Ich wasche <b>mir</b> die Hände."], ["du", "dich", "dir", "Du setzt <b>dich</b>."], ["er/sie/es", e_("sich"), e_("sich"), "Er interessiert <b>sich</b> für Sport."], ["wir", "uns", "uns", "Wir treffen <b>uns</b>."], ["ihr", "euch", "euch", "Ihr beeilt <b>euch</b>."], ["sie/Sie", e_("sich"), e_("sich"), "Sie ziehen <b>sich</b> an."]]),
  tip: "<b>sich</b> е само за 3-то лице и Sie — за ich/du/wir/ihr се ползват обикновените mich, dich, uns, euch." },
{ cat: "pron", id: "fragew", lvl: "A1", t: "Въпросителни думи (W-Fragen)",
  why: "Въпросителната дума е на <b>1-во</b> място, глаголът на <b>2-ро</b>: <i>Wann kommst du?</i>",
  html: tb(["дума", "значение", "пример"], [["wer? · wen? · wem? · wessen?", "кой? · кого? · на кого? · чий?", "Wer kommt? Wen siehst du? Wem hilfst du?"], ["was?", "какво?", "Was machst du?"], ["wo? · wohin? · woher?", "къде? · накъде? · откъде?", "Wo wohnst du? Wohin fährst du? Woher kommst du?"], ["wann?", "кога?", "Wann beginnt der Kurs?"],
    ["wie? · wie lange? · wie oft? · wie viel(e)?", "как? · колко време? · колко често? · колко?", "Wie lange dauert das? Wie viele Kinder hast du?"], ["warum?", "защо?", "Warum lernst du Deutsch? – Weil …"], ["welcher/welche/welches?", "кой (от няколко)?", "Welches Datum haben wir heute?"], ["was für ein?", "какъв (вид)?", "Was für ein Auto hast du?"]]),
  tip: "<b>wo</b> = къде (Dativ: Ich bin <b>im</b> Kino) · <b>wohin</b> = накъде (Akkusativ: Ich gehe <b>ins</b> Kino)." },
{ cat: "pron", id: "relativ", lvl: "A2", t: "Относителни местоимения (der, die, das — „който“)",
  why: "Въвеждат подчинено изречение „който/която/което“. Родът и числото — от думата, за която се отнасят; падежът — от ролята в подчиненото изречение. Глаголът — в края.",
  html: tb(["", "мъжки", "женски", "среден", "мн.ч."], [["Nominativ", "der", "die", "das", "die"], ["Akkusativ", e_("den"), "die", "das", "die"], ["Dativ", e_("dem"), e_("der"), e_("dem"), e_("denen")], ["Genitiv", e_("dessen"), e_("deren"), e_("dessen"), e_("deren")]]),
  tip: "<i>Der Mann, <b>der</b> dort steht, ist mein Chef.</i> (той стои → Nom.) · <i>Der Mann, <b>den</b> ich kenne, …</i> (кого познавам → Akk.) · Различно от члена само в Dativ мн.ч. (<b>denen</b>) и Genitiv." },
// ═════ ПРИЛАГАТЕЛНИ ═════
{ cat: "adj", id: "adj-def", lvl: "A2", t: "Прилагателни след der/die/das (слабо склонение)",
  why: "Членът вече показва падежа, затова прилагателното има само <b>-e</b> или <b>-en</b>. Правило: 5 пъти -e (Nom. ед.ч. + Akk. женски/среден), навсякъде другаде -en.",
  html: tb(["", "мъжки", "женски", "среден", "мн.ч."], [["Nom.", "der gut" + e_("e") + " Wein", "die gut" + e_("e") + " Milch", "das gut" + e_("e") + " Brot", "die gut" + e_("en") + " Äpfel"], ["Akk.", "den gut" + e_("en") + " Wein", "die gut" + e_("e") + " Milch", "das gut" + e_("e") + " Brot", "die gut" + e_("en") + " Äpfel"],
    ["Dat.", "dem gut" + e_("en") + " Wein", "der gut" + e_("en") + " Milch", "dem gut" + e_("en") + " Brot", "den gut" + e_("en") + " Äpfeln"], ["Gen.", "des gut" + e_("en") + " Weines", "der gut" + e_("en") + " Milch", "des gut" + e_("en") + " Brotes", "der gut" + e_("en") + " Äpfel"]]),
  tip: "Същите окончания след dieser, jeder, welcher и в мн.ч. след keine, meine: <i>meine gut<b>en</b> Freunde</i>." },
{ cat: "adj", id: "adj-indef", lvl: "A1", t: "Прилагателни след ein/kein/mein (смесено склонение)",
  why: "Където ein „не казва“ рода (мъжки и среден Nominativ, среден Akkusativ), прилагателното го казва: ein gut<b>er</b> Wein, ein gut<b>es</b> Brot. Иначе — като след der.",
  html: tb(["", "мъжки", "женски", "среден", "мн.ч. (keine)"], [["Nom.", "ein gut" + e_("er") + " Wein", "eine gut" + e_("e") + " Milch", "ein gut" + e_("es") + " Brot", "keine gut" + e_("en") + " Äpfel"], ["Akk.", "einen gut" + e_("en") + " Wein", "eine gut" + e_("e") + " Milch", "ein gut" + e_("es") + " Brot", "keine gut" + e_("en") + " Äpfel"],
    ["Dat.", "einem gut" + e_("en") + " Wein", "einer gut" + e_("en") + " Milch", "einem gut" + e_("en") + " Brot", "keinen gut" + e_("en") + " Äpfeln"], ["Gen.", "eines gut" + e_("en") + " Weines", "einer gut" + e_("en") + " Milch", "eines gut" + e_("en") + " Brotes", "keiner gut" + e_("en") + " Äpfel"]]),
  tip: "Ако прилагателното е след глагола (Der Wein ist <b>gut</b>), то <b>няма окончание</b>." },
{ cat: "adj", id: "adj-null", lvl: "A2", t: "Прилагателни без член (силно склонение)",
  why: "Няма член → прилагателното поема окончанието на члена: der → gut<b>er</b>, die → gut<b>e</b>, das → gut<b>es</b>, dem → gut<b>em</b>. Изключение: Genitiv мъжки/среден → -en.",
  html: tb(["", "мъжки", "женски", "среден", "мн.ч."], [["Nom.", "gut" + e_("er") + " Wein", "gut" + e_("e") + " Milch", "gut" + e_("es") + " Brot", "gut" + e_("e") + " Äpfel"], ["Akk.", "gut" + e_("en") + " Wein", "gut" + e_("e") + " Milch", "gut" + e_("es") + " Brot", "gut" + e_("e") + " Äpfel"],
    ["Dat.", "gut" + e_("em") + " Wein", "gut" + e_("er") + " Milch", "gut" + e_("em") + " Brot", "gut" + e_("en") + " Äpfeln"], ["Gen.", "gut" + e_("en") + " Weines", "gut" + e_("er") + " Milch", "gut" + e_("en") + " Brotes", "gut" + e_("er") + " Äpfel"]]),
  tip: "Често в менюта и обяви: <i>frisch<b>er</b> Fisch, kalt<b>es</b> Bier, mit frisch<b>em</b> Brot</i>." },
{ cat: "adj", id: "kompar", lvl: "A1", t: "Сравнение: groß – größer – am größten",
  why: "Сравнителна степен = <b>-er</b> (+ als): <i>Er ist größer <b>als</b> ich.</i> Превъзходна = <b>am …-sten</b> или <b>der/die/das …-ste</b>. Еднакво: <b>so … wie</b>.",
  html: tb(["", "основна", "сравнителна", "превъзходна"], [["правилни", "klein", "klein" + e_("er"), "am klein" + e_("sten")], ["с умлаут", "alt · groß · jung · kalt · warm", v_("ä") + "lt" + e_("er") + " · gr" + v_("ö") + "ß" + e_("er") + " · j" + v_("ü") + "ng" + e_("er"), "am " + v_("ä") + "lt" + e_("esten") + " · am gr" + v_("ö") + e_("ßten") + " · am j" + v_("ü") + "ng" + e_("sten")],
    ["на -t, -d, -s, -z", "alt · heiß · kurz", "älter · heißer · kürzer", "am ält" + e_("esten") + " · am heiß" + e_("esten") + " · am kürz" + e_("esten")], ["неправилни", "gut · viel · gern · hoch · nah", "besser · mehr · lieber · höher · näher", "am besten · am meisten · am liebsten · am höchsten · am nächsten"]]),
  tip: "<i>Ich trinke <b>gern</b> Tee, <b>lieber</b> Kaffee und <b>am liebsten</b> Wasser.</i>" },
// ═════ ГЛАГОЛИ: СЕГАШНО ═════
{ cat: "verb", id: "praesens", lvl: "A1", t: "Präsens: правилни глаголи + особености",
  why: "Корен (инфинитив без -en) + окончание. Ако коренът свършва на <b>-t/-d</b> → вмъква се e (du arbeit<b>e</b>st). Ако свършва на <b>-s/-ß/-z</b> → du само <b>-t</b> (du heißt).",
  html: conjT([["machen", end6("mach", ["e", "st", "t", "en", "t", "en"])], ["arbeiten", end6("arbeit", ["e", "est", "et", "en", "et", "en"])], ["heißen", end6("heiß", ["e", "t", "t", "en", "t", "en"])], ["wandern", ["wand" + e_("re"), "wander" + e_("st"), "wander" + e_("t"), "wander" + e_("n"), "wander" + e_("t"), "wander" + e_("n")]]]),
  tip: "Окончанията: <b>-e, -st, -t, -en, -t, -en</b>. er и ihr имат еднакво окончание (-t), wir и sie — също (-en)." },
{ cat: "verb", id: "vokal", lvl: "A1", t: "Глаголи със смяна на гласната (du, er)",
  why: "Някои силни глаголи сменят гласната <b>само при du и er/sie/es</b>. ich, wir, ihr, sie остават като инфинитива.",
  html: conjT([["sprechen (e→i)", ["spreche", "spr" + v_("i") + "chst", "spr" + v_("i") + "cht", "sprechen", "sprecht", "sprechen"]], ["lesen (e→ie)", ["lese", "l" + v_("ie") + "st", "l" + v_("ie") + "st", "lesen", "lest", "lesen"]], ["fahren (a→ä)", ["fahre", "f" + v_("ä") + "hrst", "f" + v_("ä") + "hrt", "fahren", "fahrt", "fahren"]], ["laufen (au→äu)", ["laufe", "l" + v_("äu") + "fst", "l" + v_("äu") + "ft", "laufen", "lauft", "laufen"]]]) +
    tb(["смяна", "глаголи"], [["e → i", "essen (isst), geben, helfen, nehmen (nimmst!), sprechen, treffen (triffst), vergessen, sterben"], ["e → ie", "lesen, sehen, empfehlen (empfiehlst), stehlen"], ["a → ä", "fahren, schlafen, tragen, waschen, fallen, halten (hältst, hält), lassen"], ["au → äu", "laufen"]]),
  tip: "Повелителното при e→i/ie също сменя: <i>Sprich! Lies! Nimm! Iss!</i> (но a→ä не: <i>Fahr!</i>)." },
{ cat: "verb", id: "seinhaben", lvl: "A1", t: "sein, haben, werden — сегашно и минало",
  why: "Трите най-важни неправилни глагола: sein (съм), haben (имам), werden (ставам; за бъдеще и пасив). В говора минало на sein/haben е Präteritum: war, hatte.",
  html: conjT([["sein", ["bin", "bist", "ist", "sind", "seid", "sind"]], ["haben", ["habe", "hast", "hat", "haben", "habt", "haben"]], ["werden", ["werde", "wirst", "wird", "werden", "werdet", "werden"]], ["war (минало)", end6("war", ["", "st", "", "en", "t", "en"])], ["hatte (минало)", end6("hatte", ["", "st", "", "n", "t", "n"])], ["wurde (минало)", end6("wurde", ["", "st", "", "n", "t", "n"])]]),
  tip: "Perfekt: ist gewesen · hat gehabt · ist geworden — но в разговор почти винаги war / hatte." },
{ cat: "verb", id: "trennbar", lvl: "A1", t: "Разделими и неразделими представки",
  why: "Разделимите представки (ударени) отиват <b>в края</b> на изречението. Неразделимите (неударени) остават до глагола и нямат ge- в Perfekt.",
  html: tb(["", "представки", "Präsens", "Perfekt"], [["разделими", "ab, an, auf, aus, ein, mit, nach, vor, weg, zu, zurück, fern, vorbei, weiter", "Ich " + "stehe um 7 Uhr " + p_("auf") + ".", "Ich bin " + p_("auf") + g_("ge") + "standen."], ["неразделими", "be, emp, ent, er, ge, miss, ver, zer", "Ich " + "bezahle die Rechnung.", "Ich habe bezahl" + e_("t") + ". (без ge-)"], ["и двете (A2)", "über, unter, um, wieder, durch", "übersetzen (неразд.) · umziehen (разд.)", "hat übersetzt · ist " + p_("um") + g_("ge") + "zogen"]]) +
    tb(["", "Präsens", "с модален глагол", "Perfekt", "zu + инф."], [["aufstehen", "Er steht früh " + p_("auf") + ".", "Er muss früh " + p_("auf") + "stehen.", "Er ist früh " + p_("auf") + g_("ge") + "standen.", "früh " + p_("auf") + g_("zu") + "stehen"]]),
  tip: "Как да разбереш? Ударението: <b>AN</b>rufen (разделим), be<b>ZAH</b>len (неразделим)." },
{ cat: "verb", id: "reflverb", lvl: "A2", t: "Глаголи с предлог (warten auf, sich freuen über…)",
  why: "Много глаголи вървят с определен предлог и падеж — учи ги като едно цяло. Въпрос за неща: <b>wo(r) + предлог</b> (Worauf wartest du?), за хора: предлог + wen/wem (Auf wen wartest du?).",
  html: tb(["глагол", "падеж", "пример"], [["warten auf", "Akk", "Ich warte auf den Bus."], ["sich freuen auf (бъдеще)", "Akk", "Ich freue mich auf den Urlaub."], ["sich freuen über (сега/минало)", "Akk", "Ich freue mich über das Geschenk."], ["denken an", "Akk", "Ich denke an dich."], ["sich interessieren für", "Akk", "Er interessiert sich für Sport."],
    ["sich kümmern um", "Akk", "Sie kümmert sich um die Kinder."], ["sprechen über", "Akk", "Wir sprechen über das Problem."], ["fragen nach", "Dat", "Er fragt nach dem Weg."], ["telefonieren mit", "Dat", "Ich telefoniere mit meiner Mutter."], ["teilnehmen an", "Dat", "Ich nehme an dem Kurs teil."], ["Angst haben vor", "Dat", "Sie hat Angst vor dem Hund."], ["träumen von", "Dat", "Ich träume von einem Haus."]]),
  tip: "<i>Worauf wartest du? – Darauf, dass …</i> (wo/da + r + гласна: wo<b>r</b>auf, da<b>r</b>über)." },
// ═════ МИНАЛО ═════
{ cat: "vergangen", id: "zeiten3", lvl: "A1", t: "Трите времена: кога кое",
  why: "Präteritum и Perfekt означават <b>едно и също</b> минало. Разликата е стилова: говор → Perfekt, писмен разказ → Präteritum. sein, haben и модалните — и в говора Präteritum.",
  html: tb(["време", "строеж", "пример", "кога"], [["Präsens", "1 глагол", "Ich <b>gehe</b> einkaufen.", "сега, всеки ден, бъдеще"], ["Präteritum", "1 глагол в минала форма", "Ich <b>ging</b> einkaufen.", "книги, новини, разказ · war, hatte, musste"], ["Perfekt", "haben/sein + Partizip II", "Ich <b>bin</b> einkaufen <b>gegangen</b>.", "разговор"], ["Plusquamperfekt", "hatte/war + Partizip II", "Vorher <b>hatte</b> ich <b>gefrühstückt</b>.", "минало преди миналото"], ["Futur I", "werden + инфинитив", "Ich <b>werde</b> einkaufen <b>gehen</b>.", "бъдеще, предположение"]]) },
{ cat: "vergangen", id: "perfekt-t", lvl: "A1", t: "Perfekt: Partizip II по видове",
  why: "Partizip II никога не се променя. Пет случая — виж колоната „правило“.",
  html: tb(["вид", "правило", "примери"], [["слаб глагол", g_("ge") + " + корен + " + e_("t"), g_("ge") + "mach" + e_("t") + ", " + g_("ge") + "kauf" + e_("t") + ", " + g_("ge") + "wohn" + e_("t")], ["корен на -t/-d", g_("ge") + " + корен + " + e_("et"), g_("ge") + "arbeit" + e_("et") + ", " + g_("ge") + "land" + e_("et")], ["силен глагол", g_("ge") + " + (нова гласна) + " + e_("en"), g_("ge") + "schr" + v_("ie") + "b" + e_("en") + ", " + g_("ge") + "tr" + v_("u") + "nk" + e_("en") + ", " + g_("ge") + "fahr" + e_("en")],
    ["смесен глагол", g_("ge") + " + нов корен + " + e_("t"), g_("ge") + "br" + v_("ach") + e_("t") + ", " + g_("ge") + "d" + v_("ach") + e_("t") + ", " + g_("ge") + "k" + v_("a") + "nn" + e_("t") + ", " + g_("ge") + "r" + v_("a") + "nn" + e_("t")], ["разделим", "представка + " + g_("ge") + " + …", p_("ein") + g_("ge") + "kauf" + e_("t") + ", " + p_("an") + g_("ge") + "ruf" + e_("en")], ["неразделим / -ieren", "<b>без ge-</b>", "bezahl" + e_("t") + ", vereinbar" + e_("t") + ", studier" + e_("t") + ", verg" + v_("e") + "ss" + e_("en")]]),
  tip: "haben или sein? sein = движение от А до Б, промяна на състоянието, sein, bleiben. Всичко друго — haben." },
{ cat: "vergangen", id: "praet-t", lvl: "A2", t: "Präteritum: окончания",
  why: "Слабите глаголи вмъкват <b>-te-</b>; силните сменят гласната. ich и er са <b>еднакви</b> и без окончание.",
  html: conjT([["machen (слаб)", ["mach" + g_("te"), "mach" + g_("te") + e_("st"), "mach" + g_("te"), "mach" + g_("te") + e_("n"), "mach" + g_("te") + e_("t"), "mach" + g_("te") + e_("n")]], ["arbeiten", ["arbeit" + g_("ete"), "arbeit" + g_("ete") + e_("st"), "arbeit" + g_("ete"), "arbeit" + g_("ete") + e_("n"), "arbeit" + g_("ete") + e_("t"), "arbeit" + g_("ete") + e_("n")]], ["gehen (силен)", [v_("ging"), v_("ging") + e_("st"), v_("ging"), v_("ging") + e_("en"), v_("ging") + e_("t"), v_("ging") + e_("en")]], ["bringen (смесен)", ["br" + v_("ach") + g_("te"), "br" + v_("ach") + g_("te") + e_("st"), "br" + v_("ach") + g_("te"), "br" + v_("ach") + g_("te") + e_("n"), "br" + v_("ach") + g_("te") + e_("t"), "br" + v_("ach") + g_("te") + e_("n")]]]) },
{ cat: "vergangen", id: "unregel", lvl: "A1", t: "Неправилни глаголи A1–A2 (трите форми)",
  why: "Учи ги наизуст по три. <b>ist</b> = Perfekt със sein. Смесените (bringen, denken, kennen, nennen, rennen, wissen) имат -te и -t като слабите.",
  get html() { const L = [["beginnen", "begann", "hat begonnen"], ["bitten", "bat", "hat gebeten"], ["bleiben", "blieb", "ist geblieben"], ["bringen", "brachte", "hat gebracht"], ["denken", "dachte", "hat gedacht"], ["dürfen", "durfte", "hat gedurft"], ["empfehlen", "empfahl", "hat empfohlen"], ["essen", "aß", "hat gegessen"], ["fahren", "fuhr", "ist gefahren"], ["fallen", "fiel", "ist gefallen"],
    ["finden", "fand", "hat gefunden"], ["fliegen", "flog", "ist geflogen"], ["geben", "gab", "hat gegeben"], ["gefallen", "gefiel", "hat gefallen"], ["gehen", "ging", "ist gegangen"], ["gewinnen", "gewann", "hat gewonnen"], ["haben", "hatte", "hat gehabt"], ["halten", "hielt", "hat gehalten"], ["heißen", "hieß", "hat geheißen"], ["helfen", "half", "hat geholfen"],
    ["kennen", "kannte", "hat gekannt"], ["kommen", "kam", "ist gekommen"], ["können", "konnte", "hat gekonnt"], ["laufen", "lief", "ist gelaufen"], ["lesen", "las", "hat gelesen"], ["liegen", "lag", "hat gelegen"], ["mögen", "mochte", "hat gemocht"], ["müssen", "musste", "hat gemusst"], ["nehmen", "nahm", "hat genommen"], ["nennen", "nannte", "hat genannt"],
    ["rennen", "rannte", "ist gerannt"], ["rufen", "rief", "hat gerufen"], ["schlafen", "schlief", "hat geschlafen"], ["schließen", "schloss", "hat geschlossen"], ["schneiden", "schnitt", "hat geschnitten"], ["schreiben", "schrieb", "hat geschrieben"], ["schwimmen", "schwamm", "ist geschwommen"], ["sehen", "sah", "hat gesehen"], ["sein", "war", "ist gewesen"], ["senden", "sandte / sendete", "hat gesandt / gesendet"],
    ["singen", "sang", "hat gesungen"], ["sitzen", "saß", "hat gesessen"], ["sprechen", "sprach", "hat gesprochen"], ["stehen", "stand", "hat gestanden"], ["sterben", "starb", "ist gestorben"], ["tragen", "trug", "hat getragen"], ["treffen", "traf", "hat getroffen"], ["trinken", "trank", "hat getrunken"], ["tun", "tat", "hat getan"], ["vergessen", "vergaß", "hat vergessen"],
    ["verlieren", "verlor", "hat verloren"], ["verstehen", "verstand", "hat verstanden"], ["waschen", "wusch", "hat gewaschen"], ["werden", "wurde", "ist geworden"], ["wissen", "wusste", "hat gewusst"], ["ziehen", "zog", "hat gezogen"]];
    return tb(["инфинитив", "Präteritum", "Perfekt"], L.map(([a, b, c]) => [a, b, c.replace(/^ist/, "<b class='bad'>ist</b>")]), "long"); } },
// ═════ МОДАЛНИ И ДР. ═════
{ cat: "modi", id: "modal", lvl: "A1", t: "Модални глаголи",
  why: "Модалният глагол е спрегнат на 2-ро място, вторият глагол — <b>инфинитив в края</b>. ich и er са еднакви и <b>без -t</b>. Гласната се сменя в ед.ч.",
  html: conjT([["können", ["kann", "kannst", "kann", "können", "könnt", "können"]], ["müssen", ["muss", "musst", "muss", "müssen", "müsst", "müssen"]], ["dürfen", ["darf", "darfst", "darf", "dürfen", "dürft", "dürfen"]], ["wollen", ["will", "willst", "will", "wollen", "wollt", "wollen"]], ["sollen", ["soll", "sollst", "soll", "sollen", "sollt", "sollen"]], ["mögen", ["mag", "magst", "mag", "mögen", "mögt", "mögen"]], ["möchten", ["möchte", "möchtest", "möchte", "möchten", "möchtet", "möchten"]]]) +
    tb(["глагол", "значение", "пример", "Präteritum"], [["können", "мога, умея", "Ich kann schwimmen.", "konnte"], ["müssen", "трябва (необходимо)", "Ich muss arbeiten.", "musste"], ["dürfen", "може (позволено)", "Darf ich rauchen?", "durfte"], ["wollen", "искам (твърдо)", "Ich will Arzt werden.", "wollte"], ["sollen", "трябва (някой казва)", "Der Arzt sagt, ich soll …", "sollte"], ["mögen / möchten", "харесвам / бих искал", "Ich möchte einen Kaffee.", "mochte / wollte"]]),
  tip: "<b>nicht müssen</b> = не е нужно (Du musst nicht kommen) · <b>nicht dürfen</b> = забранено (Du darfst nicht rauchen)." },
{ cat: "modi", id: "imperativ", lvl: "A1", t: "Повелително наклонение (Imperativ)",
  why: "du-форма: du-формата без du и без -st (du kommst → Komm!). ihr-форма = ihr kommt → Kommt! Sie-форма: Kommen Sie!",
  html: tb(["", "du", "ihr", "Sie"], [["kommen", "Komm!", "Kommt!", "Kommen Sie!"], ["arbeiten", "Arbeit" + e_("e") + "!", "Arbeitet!", "Arbeiten Sie!"], ["sprechen (e→i)", "Spr" + v_("i") + "ch!", "Sprecht!", "Sprechen Sie!"], ["lesen (e→ie)", "L" + v_("ie") + "s!", "Lest!", "Lesen Sie!"], ["fahren (a→ä)", "Fahr! (без ä)", "Fahrt!", "Fahren Sie!"], ["aufstehen", "Steh " + p_("auf") + "!", "Steht " + p_("auf") + "!", "Stehen Sie " + p_("auf") + "!"], ["sein", "Sei ruhig!", "Seid ruhig!", "Seien Sie ruhig!"], ["haben", "Hab keine Angst!", "Habt …!", "Haben Sie …!"]]),
  tip: "Учтиво: добави <b>bitte</b>: <i>Komm bitte!</i>" },
{ cat: "modi", id: "futur", lvl: "A2", t: "Бъдеще време (Futur I) и пасив (Passiv)",
  why: "Futur I = <b>werden</b> + инфинитив (в края). В говора бъдеще често се казва с Präsens + време (Morgen fahre ich). Passiv = <b>werden</b> + Partizip II — важно е действието, не кой го прави.",
  html: tb(["", "строеж", "пример"], [["Futur I", "werden + инфинитив", "Ich <b>werde</b> morgen <b>arbeiten</b>."], ["предположение", "werden + wohl + инф.", "Er <b>wird</b> wohl krank <b>sein</b>."], ["Passiv Präsens", "werden + Partizip II", "Das Auto <b>wird</b> <b>repariert</b>."], ["Passiv Präteritum", "wurde + Partizip II", "Das Haus <b>wurde</b> 1900 <b>gebaut</b>."], ["кой го прави", "von + Dativ", "Der Brief wird <b>von</b> der Sekretärin geschrieben."]]) },
{ cat: "modi", id: "konj2", lvl: "A2", t: "Konjunktiv II: würde, hätte, wäre, könnte",
  why: "За <b>желания</b> (Ich hätte gern …), <b>учтивост</b> (Könnten Sie …?), <b>съвети</b> (Du solltest …) и нереални неща (Wenn ich Zeit hätte, …).",
  html: conjT([["würde", end6("würde", ["", "st", "", "n", "t", "n"])], ["hätte", end6("hätte", ["", "st", "", "n", "t", "n"])], ["wäre", ["wäre", "wär" + e_("st"), "wäre", "wäre" + e_("n"), "wär" + e_("t"), "wäre" + e_("n")]], ["könnte", end6("könnte", ["", "st", "", "n", "t", "n"])], ["sollte", end6("sollte", ["", "st", "", "n", "t", "n"])]]) +
    tb(["цел", "пример"], [["желание", "Ich <b>hätte</b> gern einen Kaffee. · Ich <b>würde</b> gern reisen."], ["учтива молба", "<b>Könnten</b> Sie mir helfen? · <b>Würden</b> Sie das Fenster aufmachen?"], ["съвет", "Du <b>solltest</b> mehr schlafen."], ["нереално", "Wenn ich reich <b>wäre</b>, <b>würde</b> ich ein Haus kaufen."]]) },
// ═════ ПРЕДЛОЗИ ═════
{ cat: "praep", id: "praep-akk", lvl: "A1", t: "Предлози с Akkusativ и с Dativ",
  why: "Тези предлози <b>винаги</b> искат един и същ падеж. Научи ги като стихче: <b>durch, für, gegen, ohne, um</b> (Akk) · <b>aus, bei, mit, nach, seit, von, zu</b> (Dat).",
  html: tb(["Akkusativ", "значение", "пример"], [["durch", "през", "durch den Park"], ["für", "за", "für meinen Vater"], ["gegen", "срещу; към (час)", "gegen den Wind · gegen 8 Uhr"], ["ohne", "без", "ohne mich"], ["um", "около; в (час)", "um den Tisch · um 8 Uhr"], ["bis", "до", "bis Montag"]]) +
    tb(["Dativ", "значение", "пример"], [["aus", "от (вътре); родом от", "aus dem Haus · aus Bulgarien"], ["bei", "при, у", "beim Arzt · bei meiner Oma"], ["mit", "с", "mit dem Bus · mit mir"], ["nach", "след; към (град/държава); вкъщи", "nach dem Essen · nach Berlin · nach Hause"], ["seit", "от (досега)", "seit einem Jahr"], ["von", "от", "von der Arbeit · von Montag bis Freitag"], ["zu", "към, до (човек/място)", "zum Arzt · zur Arbeit · zu Hause"], ["gegenüber", "срещу", "gegenüber dem Bahnhof"]]) },
{ cat: "praep", id: "wechsel", lvl: "A1", t: "Предлози с два падежа: wo? (Dat) / wohin? (Akk)",
  why: "<b>an, auf, hinter, in, neben, über, unter, vor, zwischen</b>: <b>wo?</b> (място, покой) → Dativ · <b>wohin?</b> (посока, движение към) → Akkusativ.",
  html: tb(["", "wohin? → Akkusativ", "wo? → Dativ"], [["in", "Ich gehe in <b>den</b> Park / <b>ins</b> Kino.", "Ich bin in <b>dem</b> (im) Park / <b>im</b> Kino."], ["auf", "Ich lege das Buch auf <b>den</b> Tisch.", "Das Buch liegt auf <b>dem</b> Tisch."], ["an", "Ich hänge das Bild an <b>die</b> Wand.", "Das Bild hängt an <b>der</b> Wand."], ["unter", "Die Katze läuft unter <b>das</b> Bett.", "Die Katze schläft unter <b>dem</b> Bett."], ["zwischen", "Ich stelle den Stuhl zwischen <b>die</b> Tische.", "Der Stuhl steht zwischen <b>den</b> Tischen."]]) +
    tb(["движение (Akk) — слаб глагол", "резултат (Dat) — силен глагол"], [["stellen — слагам изправено", "stehen — стои"], ["legen — слагам легнало", "liegen — лежи"], ["setzen — слагам седнало", "sitzen — седи"], ["hängen (hängte)", "hängen (hing)"]]),
  tip: "Двойката: <i>Ich <b>stelle</b> die Flasche auf den Tisch. → Die Flasche <b>steht</b> auf dem Tisch.</i>" },
{ cat: "praep", id: "kontrakt", lvl: "A1", t: "Слети форми: am, im, ins, zum, zur…",
  why: "Предлог + член се сливат в говора и писмото.",
  html: tb(["слято", "=", "пример"], [["am", "an dem", "am Montag, am Bahnhof"], ["ans", "an das", "ans Meer"], ["im", "in dem", "im Kino, im Mai"], ["ins", "in das", "ins Kino"], ["beim", "bei dem", "beim Arzt"], ["vom", "von dem", "vom Bahnhof"], ["zum", "zu dem", "zum Arzt"], ["zur", "zu der", "zur Arbeit, zur Post"]]) },
{ cat: "praep", id: "temporal", lvl: "A1", t: "Предлози за време (Wann? Wie lange?)",
  why: "Кога? и колко дълго? — всеки вид време има свой предлог.",
  html: tb(["предлог", "с какво", "пример"], [["um", "час", "um 8 Uhr"], ["am", "ден, дата, част от деня", "am Montag, am 3. März, am Abend (но: in der Nacht)"], ["im", "месец, сезон", "im Mai, im Winter"], ["— / im Jahr", "година", "2026 · im Jahr 2026 (не „in 2026“)"], ["von … bis", "от … до", "von 9 bis 17 Uhr"], ["ab", "от … нататък", "ab Montag"], ["seit + Dat", "от (миналото досега)", "seit zwei Jahren"], ["vor + Dat", "преди", "vor dem Essen · vor einer Woche"], ["nach + Dat", "след", "nach der Arbeit"], ["in + Dat", "след (бъдеще)", "in 5 Minuten"], ["gegen", "около (час)", "gegen 8 Uhr"], ["bis", "до", "bis morgen"]]) },
{ cat: "praep", id: "genitiv", lvl: "A2", t: "Предлози с Genitiv (A2)",
  why: "В писмен език: wegen (заради), trotz (въпреки), während (по време на), statt (вместо). В говора често с Dativ.",
  html: tb(["предлог", "значение", "пример"], [["wegen", "заради", "wegen des Wetters"], ["trotz", "въпреки", "trotz des Regens"], ["während", "по време на", "während der Arbeit"], ["statt", "вместо", "statt eines Autos"]]) },
// ═════ СЛОВОРЕД ═════
{ cat: "satz", id: "v2", lvl: "A1", t: "Главно изречение: глаголът е на 2-ро място",
  why: "Спрегнатият глагол е <b>винаги</b> на 2-ро място. На 1-во може да е подлогът или нещо друго — тогава подлогът минава веднага след глагола.",
  html: tb(["1-во място", "2-ро: глагол", "…", "край"], [["Ich", "<b>fahre</b>", "morgen nach Berlin.", ""], ["Morgen", "<b>fahre</b>", "ich nach Berlin.", ""], ["Ich", "<b>muss</b>", "morgen nach Berlin", "<b>fahren</b>."], ["Ich", "<b>bin</b>", "gestern nach Berlin", "<b>gefahren</b>."], ["Ich", "<b>stehe</b>", "um 7 Uhr", "<b>auf</b>."], ["Wann", "<b>fährst</b>", "du nach Berlin?", ""], ["—", "<b>Fährst</b> (1-во!)", "du nach Berlin?", ""]]),
  tip: "„Скобата“ (Satzklammer): модален / haben-sein / разделим глагол на 2-ро място — втората част в края." },
{ cat: "satz", id: "neben", lvl: "A2", t: "Подчинени изречения: weil, dass, wenn, ob, als",
  why: "След тези съюзи спрегнатият глагол отива <b>в самия край</b>. Ако подчиненото е първо, главното започва с глагола.",
  html: tb(["съюз", "значение", "пример"], [["weil", "защото", "Ich bleibe zu Hause, weil ich krank <b>bin</b>."], ["dass", "че", "Ich glaube, dass er morgen <b>kommt</b>."], ["wenn", "ако; когато (всеки път / бъдеще)", "Wenn ich Zeit <b>habe</b>, <b>komme</b> ich."], ["als", "когато (веднъж в миналото)", "Als ich Kind <b>war</b>, …"], ["ob", "дали", "Ich weiß nicht, ob er <b>kommt</b>."], ["obwohl", "въпреки че", "Er arbeitet, obwohl er krank <b>ist</b>."], ["damit", "за да", "Ich lerne, damit ich die Prüfung <b>bestehe</b>."], ["W-дума", "непряк въпрос", "Weißt du, wann der Zug <b>kommt</b>?"]]),
  tip: "С Perfekt и модални: …, weil ich krank <b>gewesen bin</b> · …, dass ich kommen <b>kann</b> — спрегнатият е най-последен." },
{ cat: "satz", id: "konnekt", lvl: "A1", t: "Съюзи на позиция 0 и наречия, които обръщат реда",
  why: "<b>und, aber, oder, denn, sondern</b> не заемат място — след тях нормален ред. <b>deshalb, trotzdem, dann, danach, zuerst</b> заемат 1-во място — глаголът е веднага след тях.",
  html: tb(["позиция 0 (нормален ред)", "позиция 1 (глаголът след тях)"], [["…, <b>und</b> ich komme.", "…, <b>dann</b> komme ich."], ["…, <b>aber</b> ich habe keine Zeit.", "…, <b>trotzdem</b> komme ich."], ["…, <b>denn</b> ich bin krank.", "…, <b>deshalb</b> bleibe ich zu Hause."], ["…, <b>oder</b> wir gehen ins Kino.", "<b>Zuerst</b> frühstücke ich, <b>danach</b> gehe ich."]]),
  tip: "<b>denn</b> (защото, нормален ред) ≠ <b>weil</b> (защото, глаголът в края)." },
{ cat: "satz", id: "neg", lvl: "A1", t: "Отрицание: nicht или kein",
  why: "<b>kein</b> — пред съществително с ein или без член. <b>nicht</b> — всичко останало: глагол, прилагателно, наречие, съществително с der/die/das, име.",
  html: tb(["", "отрицание", "пример"], [["ein Auto", "kein", "Ich habe <b>kein</b> Auto."], ["Zeit (без член)", "kein", "Ich habe <b>keine</b> Zeit."], ["глагол", "nicht", "Ich komme <b>nicht</b>."], ["das Auto", "nicht", "Das ist <b>nicht</b> das Auto von Peter."], ["прилагателно", "nicht", "Das ist <b>nicht</b> teuer."], ["място/посока", "nicht (преди тях)", "Ich fahre <b>nicht</b> nach Berlin."]]),
  tip: "nicht стои <b>преди</b> втората част в края: Ich kann <b>nicht</b> kommen · Ich rufe dich <b>nicht</b> an." },
{ cat: "satz", id: "tekamolo", lvl: "A2", t: "Редът в средата: TeKaMoLo",
  why: "Когато има няколко пояснения, обичайният ред е: <b>Te</b>mporal (кога) → <b>Ka</b>usal (защо) → <b>Mo</b>dal (как) → <b>Lo</b>kal (къде).",
  html: tb(["кога?", "защо?", "как?", "къде?"], [["Ich fahre <b>morgen</b>", "<b>wegen der Arbeit</b>", "<b>mit dem Zug</b>", "<b>nach Berlin</b>."]]),
  tip: "Местоименията са преди съществителните: Ich gebe <b>es dir</b> · Ich gebe <b>dir das Buch</b>." },
// ═════ ЧИСЛА, ДАТИ, ЧАС ═════
{ cat: "zeit", id: "zahlen", lvl: "A1", t: "Числа",
  why: "От 21 до 99: <b>единици + und + десетици</b> в една дума (einundzwanzig = 1 и 20).",
  html: tb(["", "", "", ""], [["0 null", "10 zehn", "20 zwanzig", "100 (ein)hundert"], ["1 eins", "11 elf", "21 einundzwanzig", "101 hunderteins"], ["2 zwei", "12 zwölf", "30 dreißig (ß!)", "200 zweihundert"], ["3 drei", "13 dreizehn", "40 vierzig", "1 000 (ein)tausend"], ["4 vier", "14 vierzehn", "50 fünfzig", "10 000 zehntausend"], ["5 fünf", "15 fünfzehn", "60 sechzig (без s)", "1 000 000 eine Million"], ["6 sechs", "16 sechzehn (без s)", "70 siebzig (без en)", "1999 neunzehnhundertneunundneunzig"], ["7 sieben", "17 siebzehn (без en)", "80 achtzig", "2026 zweitausendsechsundzwanzig"], ["8 acht", "18 achtzehn", "90 neunzig", "3,5 drei Komma fünf"], ["9 neun", "19 neunzehn", "99 neunundneunzig", ""]]),
  tip: "Годините до 1999 се казват в стотици (neunzehnhundert…), от 2000 — в хиляди (zweitausend…)." },
{ cat: "zeit", id: "ordinal", lvl: "A1", t: "Поредни числа и дата",
  why: "1–19: число + <b>-te</b> · от 20: число + <b>-ste</b>. Неправилни: der <b>erste</b>, <b>dritte</b>, <b>siebte</b>, <b>achte</b>. След am / в Dativ: <b>-ten</b>.",
  html: tb(["", "der … (Nom.)", "am … (Dat.)", "пише се"], [["1", "der erste", "am ersten", "1."], ["2", "der zweite", "am zweiten", "2."], ["3", "der dritte", "am dritten", "3."], ["7", "der siebte", "am siebten", "7."], ["8", "der achte", "am achten", "8."], ["19", "der neunzehnte", "am neunzehnten", "19."], ["20", "der zwanzigste", "am zwanzigsten", "20."], ["31", "der einunddreißigste", "am einunddreißigsten", "31."]]) +
    tb(["въпрос", "отговор"], [["Welches Datum haben wir heute? / Der Wievielte ist heute?", "Heute ist der vierundzwanzigste Elfte (24.11.)."], ["Wann hast du Geburtstag?", "Am dritten März. / Am dritten Dritten."], ["Писмо", "Sofia, den 24.11.2026 (Akkusativ: den)"]]) },
{ cat: "zeit", id: "uhr-t", lvl: "A1", t: "Часът: официално и разговорно",
  why: "Официално (гари, радио): часът + минутите (14.30 = vierzehn Uhr dreißig). Разговорно: 12-часово, с nach/vor/Viertel/halb.",
  html: tb(["час", "официално", "разговорно"], [["8.00", "acht Uhr", "acht (Uhr)"], ["8.05", "acht Uhr fünf", "fünf nach acht"], ["8.15", "acht Uhr fünfzehn", "Viertel nach acht"], ["8.30", "acht Uhr dreißig", "<b>halb neun</b> (!)"], ["8.40", "acht Uhr vierzig", "zwanzig vor neun"], ["8.45", "acht Uhr fünfundvierzig", "Viertel vor neun"], ["8.25", "acht Uhr fünfundzwanzig", "fünf vor halb neun"], ["20.00", "zwanzig Uhr", "acht (Uhr abends)"]]),
  tip: "⚠️ <b>halb neun = 8:30</b> — „половината към девет“, не 9:30." },
{ cat: "zeit", id: "tage", lvl: "A1", t: "Дни, месеци, сезони, части от деня, честота",
  why: "Всички дни, месеци, сезони и части от деня са от <b>мъжки род</b> (der Montag, der Mai, der Winter, der Morgen) — освен <b>die Nacht</b>.",
  html: tb(["дни (am …)", "месеци (im …)", "сезони (im …)", "части от деня", "колко често?"], [["Montag", "Januar · Juli", "Frühling", "am Morgen · morgens", "immer (винаги)"], ["Dienstag", "Februar · August", "Sommer", "am Vormittag · vormittags", "meistens (обикновено)"], ["Mittwoch", "März · September", "Herbst", "am Mittag · mittags", "oft (често)"], ["Donnerstag", "April · Oktober", "Winter", "am Nachmittag · nachmittags", "manchmal (понякога)"], ["Freitag", "Mai · November", "", "am Abend · abends", "selten (рядко)"], ["Samstag", "Juni · Dezember", "", "in der Nacht · nachts", "nie (никога)"], ["Sonntag", "", "", "", "jeden Tag · einmal pro Woche"]]),
  tip: "<b>am Montag</b> = в (този) понеделник · <b>montags</b> = всеки понеделник (с малка буква и -s)." },
{ cat: "praep", id: "wohin-t", lvl: "A1", t: "Накъде? / Къде? — държави, море, острови, планини",
  why: "Предлогът зависи от вида на мястото. <b>Wohin?</b> → Akkusativ (движение) · <b>Wo?</b> → Dativ (място).",
  html: tb(["място", "Wohin? (Akk)", "Wo? (Dat)", "Woher?"], [["държава/град без член", "<b>nach</b> Italien", "<b>in</b> Italien", "<b>aus</b> Italien"], ["държава с член", "<b>in die</b> Schweiz / <b>in die</b> USA", "<b>in der</b> Schweiz / <b>in den</b> USA", "<b>aus der</b> Schweiz / aus den USA"],
    ["море, бряг, езеро", "<b>an die</b> Nordsee · <b>ans</b> Meer", "<b>an der</b> Nordsee · <b>am</b> Meer", "<b>von der</b> Nordsee"], ["плаж", "<b>an den</b> Strand", "<b>am</b> Strand", "vom Strand"], ["остров", "<b>auf</b> eine Insel", "<b>auf</b> einer Insel", "von der Insel"],
    ["планина", "<b>in die</b> Berge", "<b>in den</b> Berge<b>n</b>", "aus den Bergen"], ["човек", "<b>zu</b> meiner Oma · <b>zum</b> Arzt", "<b>bei</b> meiner Oma · <b>beim</b> Arzt", "<b>von</b> meiner Oma · vom Arzt"], ["вкъщи", "<b>nach</b> Hause", "<b>zu</b> Hause", "von zu Hause"]]),
  tip: "Държави с член: <b>die</b> Schweiz, <b>die</b> Türkei, <b>die</b> Ukraine, <b>die</b> USA, <b>die</b> Niederlande, <b>der</b> Iran, <b>der</b> Irak." },
{ cat: "zeit", id: "wetter-t", lvl: "A1", t: "Времето: съществително → прилагателно / глагол",
  why: "За времето подлогът винаги е <b>es</b>: Es ist kalt. Es regnet. Es gibt ein Gewitter.",
  html: tb(["съществително", "прилагателно / глагол", "изречение"], [["die Sonne", "sonn" + e_("ig"), "Es ist sonnig. / Die Sonne scheint."], ["die Wolke", g_("be") + "wölk" + e_("t"), "Es ist bewölkt."], ["der Nebel", "nebl" + e_("ig"), "Es ist neblig."], ["der Wind", "wind" + e_("ig"), "Es ist windig."], ["der Sturm", "stürm" + e_("isch"), "Es ist stürmisch."],
    ["der Regen", "regn" + e_("en"), "Es regnet."], ["der Schnee", "schnei" + e_("en"), "Es schneit."], ["die K" + v_("ä") + "lte", "kalt", "Es ist kalt."], ["die W" + v_("ä") + "rme", "warm", "Es ist warm."], ["die Hitze", "heiß", "Es ist heiß."], ["das Gewitter", "—", "Es gibt ein Gewitter."]]),
  tip: "Пред глагола друго → es след него: <i>Heute <b>regnet es</b>. In Athen <b>ist es</b> heiß.</i> · Температура: <i>Die Temperaturen liegen bei 20 Grad.</i>" },
// ═════ СЛОВООБРАЗУВАНЕ ═════
{ cat: "wort", id: "genus", lvl: "A1", t: "Род по окончание и значение",
  why: "Родът често се познава по края на думата. Тези правила са почти без изключения.",
  html: tb(["der", "die", "das"], [["-er (хора, уреди): der Lehrer, der Drucker", "-ung: die Zeitung, die Werbung", "-chen, -lein: das Mädchen, das Brötchen"], ["-ling: der Frühling", "-heit, -keit: die Freiheit, die Möglichkeit", "-ment, -um: das Dokument, das Datum"], ["-ismus: der Tourismus", "-ion: die Information", "инфинитив като дума: das Essen, das Leben"], ["-eur, -ist: der Monteur, der Polizist", "-schaft: die Weltmeisterschaft", "Ge-…: das Gespräch, das Gemüse (често)"], ["дни, месеци, сезони, посоки", "-tät, -ur, -ik: die Universität, die Tastatur, die Musik", "-o (чуждици): das Auto, das Kino"], ["алкохол: der Wein (но das Bier)", "-in (жени): die Lehrerin", "метали, цветове: das Gold, das Rot"]]),
  tip: "Сложни думи вземат рода на <b>последната</b> дума: das Haus + <b>die</b> Tür → <b>die</b> Haustür." },
{ cat: "wort", id: "bildung", lvl: "A2", t: "Как се правят нови думи",
  why: "С няколко окончания и представки удвояваш речника си.",
  html: tb(["модел", "значение", "примери"], [["глагол + -ung → die", "действието", "wohnen → die Wohnung · bestellen → die Bestellung · werben → die Werbung"], ["прилаг. + -heit/-keit → die", "качество", "frei → die Freiheit · möglich → die Möglichkeit"], ["глагол + -er → der", "който го прави / уред", "lehren → der Lehrer · drucken → der Drucker · senden → der Sender"], ["+ -in → die", "жена", "der Lehrer → die Lehrerin · der Arzt → die Ärztin"], ["+ -chen → das (+ умлаут)", "умалително", "das Brot → das Brötchen · die Katze → das Kätzchen"], ["un- + прилаг.", "противоположно", "bequem → unbequem · pünktlich → unpünktlich"], ["прилаг. + -lich/-ig/-bar", "прилагателни от думи", "der Freund → freundlich · die Sonne → sonnig · die Furcht → furchtbar"], ["съществително + съществително", "сложна дума", "der Kühlschrank (kühl + der Schrank) · die Waschmaschine"]]) },
];
// ═════ ЕКРАН ═════
let tabCat = LSget("tabCat", "artikel"), tabLvl = "all", tabQ = "";
function renderTabellen() {
  const list = TABLES.filter((x) => (tabLvl === "all" || x.lvl === tabLvl) && (tabQ ? canon(x.t + " " + (x.why || "") + " " + String(x.html).replace(/<[^>]+>/g, " ")).includes(canon(tabQ)) : x.cat === tabCat));
  view.innerHTML = `<div class="tbw">
    <aside class="tbnav">${CAT.map(([k, t, ic]) => { const n = TABLES.filter((x) => x.cat === k && (tabLvl === "all" || x.lvl === tabLvl)).length; return `<button data-cat="${k}" class="${!tabQ && tabCat === k ? "on" : ""}"><span class="tbic">${ic}</span><span>${t}</span><em>${n}</em></button>`; }).join("")}</aside>
    <main class="tbmain">
      <div class="tbtop"><h1 class="hx-h1" style="margin:0">Tabellen</h1>
        <div class="tblvl">${["all", "A1", "A2"].map((l) => `<button data-lvl="${l}" class="${tabLvl === l ? "on" : ""}">${l === "all" ? "A1 + A2" : l}</button>`).join("")}</div></div>
      <input class="search" id="tq" placeholder="Търси в таблиците (напр. Dativ, weil, halb, -ung)…" value="${esc(tabQ)}">
      <div class="tbjump">${list.map((x) => `<a href="#tb-${x.id}" data-jump="${x.id}">${esc(x.t.split(/[:(]/)[0])}</a>`).join("")}</div>
      ${list.map((x) => `<section class="tbcard" id="tb-${x.id}"><div class="tbh"><h2>${esc(x.t)}</h2><span class="lvl ${x.lvl}">${x.lvl}</span></div>
        ${x.why ? `<p class="tbwhy">${x.why}</p>` : ""}<div class="tbscroll">${x.html}</div>${x.tip ? `<p class="tbtip">💡 ${x.tip}</p>` : ""}</section>`).join("") || `<p class="muted">Нищо не намерих.</p>`}
      <p class="muted tbleg"><b class="m-end">зелено</b> окончание · <b class="m-ge">синьо</b> ge-/-te- · <b class="m-pre">лилаво</b> представка · <b class="m-vow">жълто</b> сменена гласна · цъкни немска клетка, за да я чуеш</p>
    </main></div>`;
  const q = $("#tq"); q.oninput = () => { tabQ = q.value; const p = q.selectionStart; renderTabellen(); const n = $("#tq"); n.focus(); n.setSelectionRange(p, p); };
  view.onclick = (e) => {
    const c = e.target.closest("[data-cat]"); if (c) { tabCat = c.dataset.cat; tabQ = ""; LSset("tabCat", tabCat); renderTabellen(); window.scrollTo(0, 0); return; }
    const l = e.target.closest("[data-lvl]"); if (l) { tabLvl = l.dataset.lvl; renderTabellen(); return; }
    const j = e.target.closest("[data-jump]"); if (j) { e.preventDefault(); document.getElementById("tb-" + j.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    const td = e.target.closest(".tbx td:not(.rh)"); if (td) { const t = td.textContent.replace(/\([^)]*\)/g, "").replace(/[Ѐ-ӿ]+[^·,]*/g, "").replace(/[→=·]/g, ",").trim(); if (/[a-zäöüß]{2}/i.test(t)) speak(t); }
  };
}
