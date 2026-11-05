// ───────── УПРАЖНЕНИЯ ─────────
// Генератори, вдъхновени от Begegnungen A1 (Kapitel 2): сглобяват нови изречения от речника → безкрайно много примери.
// Всеки въпрос: { kind: "mc"|"type"|"order", task, prompt, options?, answer, accept?, toks?, full?, bg?, explain, item?, say? }

const rnd = (a) => a[(Math.random() * a.length) | 0];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const BLANK = `<span class="blank">_____</span>`;
const noun = (de) => ITEMS.find((i) => i.type === "noun" && i.de === de && ["der", "die", "das"].includes(i.art));
const verb = (de) => ITEMS.find((i) => i.type === "verb" && i.de === de);
const artTag = (a) => `<span class="art ${a}">${a}</span>`;
const GENDER_BG = { der: "мъжки род", die: "женски род", das: "среден род" };
const FORMS = {
  der: { def: "der", acc: "den", ind: "ein", indAcc: "einen", neg: "kein", negAcc: "keinen", poss: "mein", possAcc: "meinen" },
  die: { def: "die", acc: "die", ind: "eine", indAcc: "eine", neg: "keine", negAcc: "keine", poss: "meine", possAcc: "meine" },
  das: { def: "das", acc: "das", ind: "ein", indAcc: "ein", neg: "kein", negAcc: "kein", poss: "mein", possAcc: "mein" },
};
// подлози: [немски, индекс на формата, български]
const SUBJ = [["ich", 0, "аз"], ["du", 1, "ти"], ["er", 2, "той"], ["sie", 2, "тя"], ["wir", 3, "ние"], ["ihr", 4, "вие"], ["Sie", 5, "Вие"]];
const PEOPLE = [["Anna", 2], ["Peter", 2], ["Herr Meier", 2], ["Frau Herzberg", 2], ["mein Bruder", 2], ["meine Eltern", 5], ["die Studenten", 5], ["wir", 3], ["ich", 0], ["du", 1]];
const exPool = (pred) => { const p = pool().filter(pred); return p.length >= 6 ? p : ITEMS.filter(pred); };
const countable = (i) => i.type === "noun" && ["der", "die", "das"].includes(i.art) && i.pl && !/\s/.test(i.de);
const conjugate = (v, idx) => v.forms[idx];
// конкретни предмети — за изречения с „Im Büro ist …“, прилагателни, er/sie/es
const OFFICE = ["Computer", "Drucker", "Telefon", "Lampe", "Schreibtisch", "Stuhl", "Regal", "Schrank", "Bildschirm", "Laptop", "Kaffeemaschine", "Kugelschreiber", "Bleistift",
  "Wörterbuch", "Kalender", "Terminkalender", "Faxgerät", "Kopiergerät", "Scanner", "Papierkorb", "Bürostuhl", "Bürolampe", "Computertisch", "Bücherregal", "Maus"];
const THINGS = [...OFFICE, "Buch", "Brille", "Uhr", "Tisch", "Auto", "Fahrrad", "Motorrad", "Radio", "Glas", "Teller", "Bild", "Foto", "Zimmer", "Büro", "Wohnung", "Haus", "Garten"];
const objPool = (names) => names.map(noun).filter((i) => i && i.pl);

// ── 1. Членове
function genArt() {
  const it = rnd(exPool(countable));
  const gh = genderHint(it);
  return { kind: "mc", task: "Кой е членът?", prompt: `<div class="exw">${BLANK} ${esc(it.de)}</div><div class="meta">${esc(it.bg)}</div>`,
    options: ["der", "die", "das"], answer: it.art, item: it, say: deFull(it), keys: true,
    explain: `<b>${it.art} ${esc(it.de)}</b> — ${GENDER_BG[it.art]}. ${gh || "Няма сигурно правило за тази дума — учи я винаги с члена и с цвета."} Мн.ч.: die ${esc(it.pl)}.` };
}

// ── 2. ein / eine / kein / keine (A5)
function genEinKein() {
  const it = rnd(objPool(Math.random() < 0.7 ? OFFICE : THINGS)), f = FORMS[it.art];
  const t = rnd([
    () => ({ s: `Im Büro ist ${BLANK} ${it.de}.`, full: `Im Büro ist ${f.ind} ${it.de}.`, ans: f.ind, why: "има → ein/eine" }),
    () => ({ s: `Im Büro ist ${BLANK} ${it.de}. <span class="muted">(няма)</span>`, full: `Im Büro ist ${f.neg} ${it.de}.`, ans: f.neg, why: "няма → kein/keine" }),
    () => ({ s: `Das ist ${BLANK} ${it.de}.`, full: `Das ist ${f.ind} ${it.de}.`, ans: f.ind, why: "Това е … → ein/eine" }),
    () => ({ s: `Das ist ${BLANK} ${it.de}. <span class="muted">(не е)</span>`, full: `Das ist ${f.neg} ${it.de}.`, ans: f.neg, why: "Това не е … → kein/keine" }),
    () => ({ s: `Das sind ${BLANK} ${it.pl}. <span class="muted">(не са)</span>`, full: `Das sind keine ${it.pl}.`, ans: "keine", why: "мн.ч. + отрицание → винаги keine", pl: true }),
  ])();
  return { kind: "mc", task: "ein, eine, kein или keine?", prompt: `<div class="exs">${t.s}</div><div class="meta">${esc(it.bg)}</div>`,
    options: ["ein", "eine", "kein", "keine"], answer: t.ans, item: it, say: t.full, full: t.full, keys: true,
    explain: t.pl ? `За много (мн.ч.) няма „ein“. Отрицанието е <b>keine</b>: <i>Das sind keine ${esc(it.pl)}.</i>`
      : `${artTag(it.art)} ${esc(it.de)} е ${GENDER_BG[it.art]} → ${it.art === "die" ? "<b>eine / keine</b> (с -e)" : "<b>ein / kein</b> (без -e)"}. Тук: ${t.why}.` };
}

// ── 3. Akkusativ (+ Nominativ за контраст)
const AKK_FRAMES = [
  ["trinken", ["Kaffee", "Kakao", "Milch", "Bier"]],
  ["lesen", ["Roman", "Zeitung", "Buch", "Krimi", "Brief", "Gedicht", "Dialog"]],
  ["suchen", ["Brille", "Kugelschreiber", "Bleistift", "Wörterbuch", "Terminkalender", "Lampe", "Drucker"]],
  ["brauchen", ["Computer", "Drucker", "Laptop", "Tisch", "Schreibtisch", "Lampe", "Regal", "Wörterbuch", "Briefmarke", "Stuhl"]],
  ["haben", ["Bruder", "Schwester", "Sohn", "Tochter", "Auto", "Fahrrad", "Garten", "Computer", "Problem"]],
  ["bezahlen", ["Rechnung", "Sprachkurs", "Kaffee"]],
  ["besuchen", ["Sprachkurs", "Freund", "Bibliothek"]],
  ["sehen", ["Bild", "Garten", "Drucker", "Lampe"]],
  ["schreiben", ["Brief", "Gedicht", "Programm", "Satz"]],
];
function genAkk() {
  if (Math.random() < 0.3) { // Nominativ — контраст
    const it = rnd(objPool(THINGS)), f = FORMS[it.art];
    const adj = rnd(["neu", "alt", "schön", "teuer", "kaputt", "praktisch"]);
    const kind = rnd(["def", "ind"]);
    const s = kind === "def" ? `${BLANK} ${it.de} ist ${adj}.` : `Das ist ${BLANK} ${it.de}.`;
    const ans = kind === "def" ? cap(f.def) : f.ind, full = kind === "def" ? `${cap(f.def)} ${it.de} ist ${adj}.` : `Das ist ${f.ind} ${it.de}.`;
    const opts = kind === "def" ? ["Der", "Den", "Die", "Das"] : ["ein", "einen", "eine"];
    return { kind: "mc", task: "Nominativ или Akkusativ? Избери формата.", prompt: `<div class="exs">${s}</div><div class="meta">${esc(it.bg)}</div>`,
      options: opts, answer: ans, item: it, say: full, full, keys: true,
      explain: kind === "def" ? `<b>${esc(it.de)}</b> е подлогът (Какво е ${adj}? → ${it.de}) → <b>Nominativ</b> → ${f.def}. Никаква промяна.`
        : `След <b>Das ist / sein</b> винаги е <b>Nominativ</b> → ${f.ind} ${esc(it.de)}. (Никога „einen“ след sein!)` };
  }
  const [vde, nouns] = rnd(AKK_FRAMES), v = verb(vde), it = noun(rnd(nouns)), f = FORMS[it.art];
  const [sp, si] = rnd(SUBJ), vf = conjugate(v, si);
  const kind = rnd(["def", "ind", "neg", "def", "ind"]);
  const ansMap = { def: f.acc, ind: f.indAcc, neg: f.negAcc }, ans = ansMap[kind];
  const opts = { def: ["der", "den", "die", "das"], ind: ["ein", "einen", "eine"], neg: ["kein", "keinen", "keine"] }[kind];
  const full = `${cap(sp)} ${vf} ${ans} ${it.de}.`;
  const masc = it.art === "der";
  return { kind: "mc", task: "Akkusativ: избери правилната форма.", prompt: `<div class="exs">${cap(sp)} ${esc(vf)} ${BLANK} ${esc(it.de)}.${kind === "neg" ? ` <span class="muted">(не)</span>` : ""}</div><div class="meta">${esc(v.de)} = ${esc(v.bg)} · ${artTag(it.art)} ${esc(it.de)} = ${esc(it.bg)}</div>`,
    options: opts, answer: ans, item: it, say: full, full, keys: true,
    explain: `<b>${esc(v.de)}</b> пита „какво?“ → <b>Akkusativ</b>. ${artTag(it.art)} ${esc(it.de)} е ${GENDER_BG[it.art]}. ` +
      (masc ? `Мъжкият род в Akkusativ получава <b>-n</b>: der→den, ein→einen, kein→keinen → <b>${ans}</b>.` : `${cap(GENDER_BG[it.art])} <b>не се променя</b> в Akkusativ → <b>${ans}</b>. (Само der-думите се сменят!)`) };
}

// ── 4. Притежателни (C4/C5)
const POSS = [["ich", "mein", "моя"], ["du", "dein", "твоя"], ["er", "sein", "негов"], ["sie", "ihr", "неин"], ["es", "sein", "негов (на детето)"], ["wir", "unser", "наш"], ["ihr", "euer", "ваш (на вас, приятели)"], ["Sie", "Ihr", "Ваш (учтиво)"]];
const possForm = (root, art) => art === "die" || art === "pl" ? (root === "euer" ? "eure" : root + "e") : root;
function genPoss() {
  const it = rnd(exPool(countable));
  const [pr, root, bg] = rnd(POSS);
  const usePl = Math.random() < 0.25, art = usePl ? "pl" : it.art, nounDe = usePl ? it.pl : it.de;
  const ans = possForm(root, art);
  const frame = rnd(usePl ? [["Sind das", "?"], ["Das sind", "."]] : [["Ist das", "?"], ["Das ist", "."], ["Wo ist", "?"]]);
  const others = [...new Set([possForm(root, art === "der" || art === "das" ? "die" : "der"), ...shuffle(POSS.filter((p) => p[1] !== root)).slice(0, 3).map((p) => possForm(p[1], art))])];
  const opts = shuffle([ans, ...others.filter((o) => o !== ans)].slice(0, 4));
  const full = `${frame[0]} ${ans} ${nounDe}${frame[1]}`;
  return { kind: "mc", task: `Притежание: <b>${pr}</b> → ?`, prompt: `<div class="exs"><span class="muted">${esc(pr)}:</span> ${frame[0]} ${BLANK} ${esc(nounDe)}${frame[1]}</div><div class="meta">${esc(it.bg)}${usePl ? " (мн.ч.)" : ""}</div>`,
    options: opts, answer: ans, item: it, say: full, full, keys: true,
    explain: `<b>${esc(pr)} → ${root}</b> (${bg}). ${usePl ? "Мн.ч." : artTag(it.art) + " " + esc(it.de)} → ${art === "die" || art === "pl" ? `с <b>-e</b>: ${ans}` : `без окончание: ${ans}`}.${root === "euer" && ans === "eure" ? " (euer губи e: eure)" : ""}` };
}

// ── 5. er / sie / es (C6)
function genErSieEs() {
  const it = rnd(objPool(THINGS));
  const pl = Math.random() < 0.2;
  const pron = pl ? "sie" : { der: "er", die: "sie", das: "es" }[it.art];
  const t = pl
    ? { q: `Sind die ${it.pl} neu?`, a: `Nein, ${BLANK} sind alt.`, full: `Nein, sie sind alt.` }
    : rnd([
      { q: `Ist das ${possForm("dein", it.art)} ${it.de}?`, a: `Ja, aber ${BLANK} ist kaputt.`, full: `Ja, aber ${pron} ist kaputt.` },
      { q: `Ist ${FORMS[it.art].def} ${it.de} neu?`, a: `Nein, ${BLANK} ist alt.`, full: `Nein, ${pron} ist alt.` },
      { q: `Wo ist ${FORMS[it.art].def} ${it.de}?`, a: `${BLANK} ist im Büro.`, full: `${cap(pron)} ist im Büro.` },
      { q: `Wie findest du ${FORMS[it.art].acc} ${it.de}?`, a: `${BLANK} ist sehr schön!`, full: `${cap(pron)} ist sehr schön!` },
    ]);
  const ans = /^<span/.test(t.a) ? cap(pron) : pron;
  return { kind: "mc", task: "er, sie или es?", prompt: `<div class="exs">${esc(t.q)}<br>– ${t.a}</div><div class="meta">${esc(it.bg)}</div>`,
    options: /^<span/.test(t.a) ? ["Er", "Sie", "Es"] : ["er", "sie", "es"], answer: ans, item: it, say: t.full, full: t.full, keys: true,
    explain: pl ? "Мн.ч. (die …) → <b>sie</b> (те)." : `${artTag(it.art)} ${esc(it.de)} → <b>${pron}</b>. Правило: der → er, die → sie, das → es — по рода на думата, не по това дали е човек.` };
}

// ── 6. Спрежение (C9/C10)
function genConj() {
  const verbs = exPool((i) => i.type === "verb");
  const v = rnd(verbs);
  const [sp, si] = rnd(SUBJ);
  const ans = v.forms[si];
  const opts = shuffle([...new Set(v.forms)]).filter((f) => f !== ans).slice(0, 3);
  const full = `${cap(sp)} ${ans}`;
  return { kind: "mc", task: `Спрегни: <b>${esc(v.de)}</b> (${esc(v.bg)})`, prompt: `<div class="exw">${cap(esc(sp))} ${BLANK}</div>`,
    options: shuffle([ans, ...opts]), answer: ans, item: v, say: full, full, keys: true,
    explain: `${sp} → <b>${esc(ans)}</b>. ${verbKind(v)}<div class="exconj">${conjTable(v)}</div>` };
}

// ── 7. Словоред с модален глагол (A16) — подреждане
const PLACES = [["In der Bibliothek", "Bücher lesen", "четем книги"], ["In der Cafeteria", "Kaffee trinken", "пием кафе"], ["In der Sporthalle", "Volleyball spielen", "играем волейбол"],
  ["Im Sekretariat", "Informationen bekommen", "получаваме информация"], ["In der Verwaltung", "Rechnungen bezahlen", "плащаме сметки"], ["Im Sprachenzentrum", "Sprachkurse besuchen", "ходим на езикови курсове"],
  ["In der Mensa", "etwas essen", "ядем нещо"], ["Hier", "gut arbeiten", "работим добре"]];
const ACTS = [["gut Salsa", "tanzen", "танцувам салса"], ["Klavier", "spielen", "свиря на пиано"], ["sehr gut Fußball", "spielen", "играя футбол"], ["Auto", "fahren", "карам кола"], ["Ski", "fahren", "карам ски"],
  ["gut Deutsch", "sprechen", "говоря немски"], ["leider nicht", "singen", "пея"], ["heute nicht", "kommen", "идвам"], ["am Wochenende", "wandern", "ходя на поход"], ["Gedichte", "schreiben", "пиша стихотворения"],
  ["Yoga", "machen", "правя йога"], ["schöne Landschaften", "fotografieren", "снимам пейзажи"], ["Briefmarken", "sammeln", "колекционирам марки"], ["heute zu Hause", "bleiben", "оставам вкъщи"]];
const MODALS_BG = { können: "мога", möchten: "бих искал", müssen: "трябва", wollen: "искам", dürfen: "може ли/имам право" };
function genModalOrder() {
  let toks, bg, mod, inf;
  if (Math.random() < 0.4) {
    const [pl, act, actBg] = rnd(PLACES), who = rnd([["man", 2, "се"], ["wir", 3, "ние"], ["die Studenten", 5, "студентите"]]);
    mod = "können"; inf = act.split(" ").pop();
    const mf = verb("können").forms[who[1]];
    toks = [pl, mf, who[0], ...act.split(" ").slice(0, -1), inf + "."];
    bg = `Смисъл: ${esc(pl)} + können + ${esc(who[0])} + ${esc(act)} — „${actBg}“`;
  } else {
    const [obj, inf0, actBg] = rnd(ACTS), m = rnd(["können", "möchten", "müssen", "wollen"]);
    const [sp, si] = rnd(SUBJ.filter((x) => x[0] !== "Sie")), mf = verb(m).forms[si];
    mod = m; inf = inf0;
    const front = Math.random() < 0.35 ? rnd(["Heute", "Am Montag", "Am Wochenende", "Morgen"]) : null;
    toks = front ? [front, mf, sp, ...obj.split(" "), inf + "."] : [cap(sp), mf, ...obj.split(" "), inf + "."];
    bg = `Смисъл: ${front ? esc(front) + " + " : ""}${esc(sp)} + ${m} (${MODALS_BG[m]}) + ${esc(obj)} ${esc(inf)} (${actBg})`;
  }
  const sentence = toks.join(" ");
  let sh = shuffle(toks); for (let n = 0; n < 6 && sh.join(" ") === sentence; n++) sh = shuffle(toks);
  return { kind: "order", task: "Подреди изречението (модален глагол).", prompt: `<div class="meta" style="font-size:15px">${bg}</div>`, toks, sh, answer: sentence,
    item: verb(mod), say: sentence, full: sentence,
    explain: `Модалният глагол (<b>${esc(toks[1])}</b>) стои на <b>2-ро място</b>, а вторият глагол (<b>${esc(inf)}</b>) отива <b>най-накрая</b> — като скоба около изречението.` };
}

// ── 8. Глаголът на 2-ро място (A28)
const POS2_ACTS = [["fahren", "Motorrad"], ["lesen", "Zeitung"], ["fotografieren", "schöne Landschaften"], ["sammeln", "Briefmarken"], ["spielen", "Karten"], ["hören", "Musik"], ["lernen", "Russisch"],
  ["kochen", "gern"], ["tanzen", "Tango"], ["besuchen", "Freunde"], ["schreiben", "Gedichte"], ["machen", "Yoga"], ["spielen", "Golf"], ["wandern", "im Gebirge"], ["trinken", "Kaffee"]];
function genPos2() {
  const [vde, rest] = rnd(POS2_ACTS), v = verb(vde);
  const [who, idx] = rnd(PEOPLE.filter((p) => !["ich", "du", "wir"].includes(p[0]) || true));
  const vf = v.forms[idx];
  const time = rnd(["Am Montag", "Am Dienstag", "Am Mittwoch", "Am Donnerstag", "Am Freitag", "Am Wochenende", "Heute", "Morgen", "Deshalb", "Am Sonntag"]);
  const right = `${time} ${vf} ${who} ${rest}.`;
  const wrong1 = `${time} ${who} ${vf} ${rest}.`;
  const wrong2 = `${time} ${who} ${rest} ${vf}.`;
  return { kind: "mc", task: "Кое изречение е правилно?", prompt: `<div class="meta">${esc(v.de)} = ${esc(v.bg)}</div>`,
    options: shuffle([right, wrong1, wrong2]), answer: right, item: v, say: right, full: right, keys: true,
    explain: `Глаголът е <b>винаги на 2-ро място</b>. „${esc(time)}“ заема 1-во място → глаголът (<b>${esc(vf)}</b>) идва веднага след него, а подлогът (${esc(who)}) минава <b>след</b> глагола.` };
}

// ── 9. nicht или kein (C13)
function genNichtKein() {
  const t = rnd(["nounNom", "nounAkk", "verb", "adj", "verbModal"]);
  if (t === "nounNom" || t === "nounAkk") {
    const it = rnd(objPool(OFFICE)), f = FORMS[it.art];
    const akk = t === "nounAkk", ans = akk ? f.negAcc : f.neg;
    const s = akk ? `Ich habe ${BLANK} ${it.de}.` : `Hier ist ${BLANK} ${it.de}.`, full = s.replace(BLANK, ans);
    return { kind: "mc", task: "nicht, kein, keine или keinen?", prompt: `<div class="exs">${s}</div><div class="meta">${esc(it.bg)}</div>`, options: ["nicht", "kein", "keine", "keinen"], answer: ans, item: it, say: full, full, keys: true,
      explain: `Пред съществително (без der/die/das) → <b>kein</b>. ${artTag(it.art)} ${esc(it.de)}${akk ? " + haben → Akkusativ" : ""} → <b>${ans}</b>.${akk && it.art === "der" ? " Мъжки род в Akkusativ: keinen." : ""}` };
  }
  if (t === "adj") {
    const it = rnd(objPool(THINGS)), adj = rnd(["warm", "teuer", "neu", "modern", "bequem", "praktisch", "schön", "groß"]);
    const s = `${cap(FORMS[it.art].def)} ${it.de} ist ${BLANK} ${adj}.`, full = s.replace(BLANK, "nicht");
    return { kind: "mc", task: "nicht, kein, keine или keinen?", prompt: `<div class="exs">${s}</div>`, options: ["nicht", "kein", "keine", "keinen"], answer: "nicht", item: it, say: full, full, keys: true,
      explain: `Отрицание на <b>прилагателно</b> (${adj}) → винаги <b>nicht</b>. kein е само пред съществително.` };
  }
  const [obj, inf] = rnd(ACTS.filter((a) => !/nicht/.test(a[0])));
  const s = t === "verbModal" ? `Ich kann ${BLANK} ${inf}.` : `Wir ${verb(inf) ? verb(inf).forms[3] : inf} ${BLANK}.`;
  const full = s.replace(BLANK, "nicht");
  return { kind: "mc", task: "nicht, kein, keine или keinen?", prompt: `<div class="exs">${s}</div>`, options: ["nicht", "kein", "keine", "keinen"], answer: "nicht", item: verb(inf), say: full, full, keys: true,
    explain: `Отрицание на <b>глагол</b> → <b>nicht</b>. ${t === "verbModal" ? "С модален глагол: nicht стои преди инфинитива в края." : "nicht обикновено е в края."}` };
}

// ── 10. Предлози: aus, in, nach, bei, an (C14)
const CITIES = ["Marburg", "München", "Berlin", "Wien", "Sofia", "Hamburg", "Köln", "Paris", "Rom", "London"];
const COUNTRIES = ["Italien", "Frankreich", "Bulgarien", "Österreich", "Polen", "Spanien", "England"];
const FIRMS = ["Siemens", "BASF", "Bosch", "BMW", "Lufthansa"];
function genPraep() {
  const p = rnd(["Peter", "Sarah", "Hans", "Susanne", "Herr Meier", "Frau Kalt"]);
  const place = () => (Math.random() < 0.5 ? rnd(CITIES) : rnd(COUNTRIES));
  const t = rnd([
    () => { const x = place(); return { s: `${p} kommt ${BLANK} ${x}.`, a: "aus", why: "Woher? → <b>aus</b> (откъде)" }; },
    () => { const x = place(); return { s: `${p} wohnt ${BLANK} ${x}.`, a: "in", why: "Wo? → <b>in</b> (къде)" }; },
    () => { const x = place(); return { s: `Am Wochenende fährt ${p} ${BLANK} ${x}.`, a: "nach", why: "Wohin? (град/държава) → <b>nach</b>" }; },
    () => { const x = rnd(FIRMS); return { s: `${p} arbeitet ${BLANK} ${x}.`, a: "bei", why: "работя във фирма → <b>bei</b> + фирма" }; },
    () => ({ s: `${p} studiert ${BLANK} der Universität.`, a: "an", why: "университет → <b>an</b> der Universität" }),
    () => { const x = rnd(CITIES); return { s: `${p} studiert an der Universität ${BLANK} ${x}.`, a: "in", why: "в град → <b>in</b>" }; },
    () => { const x = rnd(COUNTRIES); return { s: `${BLANK} ${x} wohnen viele Menschen.`, a: "In", why: "Wo? → <b>in</b>" }; },
  ])();
  const full = t.s.replace(BLANK, t.a);
  const opts = t.a === "In" ? ["Aus", "In", "Nach", "Bei"] : ["aus", "in", "nach", "bei", "an"];
  return { kind: "mc", task: "Кой предлог?", prompt: `<div class="exs">${t.s}</div>`, options: opts, answer: t.a, say: full, full, keys: true,
    explain: `${t.why}. Запомни реда: <b>aus</b> (откъде) → <b>in</b> (къде) → <b>nach</b> (накъде); фирма → <b>bei</b>; университет → <b>an</b>.` };
}

// ── 11. Въпросителни думи (C15)
function genFrage() {
  const c = rnd(CITIES), n = rnd(["Anna", "Peter", "Maria", "Paul"]);
  const t = rnd([
    ["Wie", `heißen Sie? – Ich heiße ${n}.`, "как (се казвате)"], ["Woher", `kommst du? – Aus ${rnd(COUNTRIES)}.`, "откъде"],
    ["Wo", `wohnt er? – In ${c}.`, "къде"], ["Wohin", `fährst du? – Nach ${c}.`, "накъде"], ["Welche", "Sprachen sprichst du? – Deutsch und Englisch.", "кои/какви"],
    ["Was", "sind Sie von Beruf? – Ich bin Lehrerin.", "какво"], ["Wer", `trinkt Kaffee? – ${n}.`, "кой"], ["Wen", "besuchst du? – Meinen Bruder.", "кого (Akkusativ)"],
    ["Wie", "ist Ihre Telefonnummer? – 44 22.", "как (какъв е)"], ["Wie", "alt bist du? – Ich bin dreißig.", "на колко години"], ["Was", "kostet der Stuhl? – Dreißig Euro.", "колко (струва)"],
    ["Was", "machst du am Wochenende? – Ich wandere.", "какво"], ["Wo", "kann man Kaffee trinken? – In der Cafeteria.", "къде"], ["Welches", "Instrument spielen Sie? – Klavier.", "кое (das Instrument)"],
    ["Wie", "finden Sie Marburg? – Schön!", "как (намирате)"], ["Wann", "beginnt der Kurs? – Um neun Uhr.", "кога"],
  ]);
  const opts = shuffle([t[0], ...shuffle(["Wie", "Was", "Wo", "Woher", "Wohin", "Wer", "Wen", "Welche", "Wann"].filter((x) => x !== t[0])).slice(0, 3)]);
  const full = `${t[0]} ${t[1]}`;
  return { kind: "mc", task: "Коя въпросителна дума?", prompt: `<div class="exs">${BLANK} ${esc(t[1])}</div>`, options: opts, answer: t[0], say: full.split(" – ")[0], full, keys: true,
    explain: `<b>${t[0]}</b> = ${t[2]}. Виж отговора — той подсказва въпроса.` };
}

// ── 12. Was passt? глагол + съществително (A17 / C12)
const COLLOC = {
  spielen: ["Fußball", "Klavier", "Schach", "Karten", "Tennis", "Gitarre", "Volleyball", "Golf"],
  lesen: ["Bücher", "Zeitung", "Romane", "Krimis", "Gedichte"],
  bezahlen: ["Rechnungen", "die Rechnung", "einen Sprachkurs"],
  lernen: ["Sprachen", "Englisch", "Deutsch", "Mathematik", "Latein"],
  bekommen: ["Informationen", "einen Brief"],
  besuchen: ["Freunde", "einen Sprachkurs", "die Eltern"],
  trinken: ["Kaffee", "Bier", "Milch", "Kakao"],
  sammeln: ["Briefmarken", "Münzen", "Steine", "Muscheln", "Gartenzwerge"],
  schreiben: ["Computerprogramme", "Briefe", "Gedichte"],
  fahren: ["Auto", "Fahrrad", "Ski", "Motorrad"],
  tanzen: ["Salsa", "Tango", "Walzer"],
  hören: ["Musik", "Jazz", "Rockmusik", "klassische Musik"],
  machen: ["Yoga", "Gymnastik", "Sport", "eine Pause"],
};
function genColloc() {
  const verbs = Object.keys(COLLOC);
  if (Math.random() < 0.6) {
    const v = rnd(verbs), n = rnd(COLLOC[v]);
    const opts = shuffle([v, ...shuffle(verbs.filter((x) => x !== v && !COLLOC[x].includes(n))).slice(0, 3)]);
    return { kind: "mc", task: "Кой глагол пасва?", prompt: `<div class="exw">${esc(n)} ${BLANK}</div>`, options: opts, answer: v, item: verb(v), say: `${n} ${v}`, full: `${n} ${v}`, keys: true,
      explain: `<b>${esc(n)} ${v}</b> (${esc(verb(v)?.bg || "")}). Други с ${v}: ${COLLOC[v].filter((x) => x !== n).slice(0, 4).map(esc).join(", ")}.` };
  }
  const v = rnd(verbs), good = shuffle(COLLOC[v]).slice(0, 3);
  const otherV = rnd(verbs.filter((x) => x !== v)), bad = rnd(COLLOC[otherV].filter((x) => !COLLOC[v].includes(x)));
  const opts = shuffle([...good, bad]);
  return { kind: "mc", task: `Кое <b>не</b> може да се ${esc(verb(v)?.bg || v)}?`, prompt: `<div class="exw">Was kann man nicht ${v}?</div>`, options: opts, answer: bad, item: verb(v),
    say: `${bad} kann man nicht ${v}.`, full: `${bad} kann man nicht ${v}.`, keys: true,
    explain: `<b>${esc(bad)}</b> не се ${v}, а се <b>${otherV}</b>: ${esc(bad)} ${otherV}. Останалите пасват: ${good.map((g) => esc(g) + " " + v).join(", ")}.` };
}

// ── 13. Антоними (A12 / A13)
const ANTO = [["neu", "alt"], ["schön", "hässlich"], ["modern", "unmodern"], ["bequem", "unbequem"], ["klein", "groß"], ["teuer", "billig"], ["praktisch", "unpraktisch"], ["interessant", "langweilig"], ["hell", "dunkel"], ["zufrieden", "unzufrieden"], ["laut", "leise"], ["warm", "kalt"], ["gut", "schlecht"], ["schwer", "leicht"]];
function genAnto() {
  const [a, b] = rnd(ANTO.filter((p) => p[0] !== "zufrieden")), flip = Math.random() < 0.5, x = flip ? b : a, y = flip ? a : b;
  const it = rnd(objPool(THINGS)), pron = { der: "er", die: "sie", das: "es" }[it.art];
  const opts = shuffle([y, ...shuffle(ANTO.flat().filter((w) => w !== x && w !== y)).slice(0, 3)]);
  const full = `${cap(FORMS[it.art].def)} ${it.de} ist nicht ${x}. ${cap(pron)} ist ${y}.`;
  return { kind: "mc", task: "Обратното (антоним)", prompt: `<div class="exs">${cap(FORMS[it.art].def)} ${esc(it.de)} ist nicht ${esc(x)}. ${cap(pron)} ist ${BLANK}.</div>`, options: opts, answer: y, say: full, full, keys: true,
    explain: `<b>${x}</b> ↔ <b>${y}</b>. 💡 <b>un-</b> = не-: bequem → unbequem, praktisch → unpraktisch.` };
}

// ── 14. du / ihr / Sie (A24)
const FORMAL_Q = [["spielen", "Welches Instrument {v} {p}?"], ["finden", "Wie {v} {p} Marburg?"], ["fahren", "{V} {p} nach München?"], ["können", "{V} {p} gut singen?"], ["sprechen", "Welche Sprache {v} {p} zu Hause?"],
  ["lernen", "{V} {p} auch Deutsch?"], ["wohnen", "Wo {v} {p}?"], ["rauchen", "{V} {p}?"], ["machen", "Was {v} {p} am Wochenende?"], ["lesen", "Was {v} {p} gern?"], ["tanzen", "{V} {p} gern Tango?"],
  ["haben", "{V} {p} Geschwister?"], ["trinken", "Was {v} {p}?"], ["kommen", "Woher {v} {p}?"], ["essen", "Was {v} {p} gern?"], ["arbeiten", "Wo {v} {p}?"], ["sammeln", "{V} {p} Briefmarken?"]];
function genFormell() {
  const [vde, tpl] = rnd(FORMAL_Q), v = verb(vde);
  const target = rnd([["du", 1, "един приятел (Sg.)"], ["ihr", 4, "няколко приятели (Pl.)"]]);
  const fill = (vf, p) => tpl.replace("{v}", vf).replace("{V}", cap(vf)).replace("{p}", p);
  const formal = fill(v.forms[5], "Sie"), ans = v.forms[target[1]];
  const fullT = fill(ans, target[0]);
  const shown = tpl.replace("{v}", "§").replace("{V}", "§").replace("{p}", target[0]);
  const opts = shuffle([...new Set([ans, ...shuffle(v.forms.filter((f) => f !== ans))])].slice(0, 4));
  return { kind: "mc", task: `Кажи го на <b>${target[0]}</b> — ${target[2]}`, prompt: `<div class="meta">учтиво: <i>${esc(formal)}</i></div><div class="exs">${esc(shown).replace("§", BLANK)}</div>`,
    options: opts, answer: ans, item: v, say: fullT, full: fullT, keys: true,
    explain: `Sie → <b>-en</b> (${esc(v.forms[5])}); du → <b>-st</b> (${esc(v.forms[1])}); ihr → <b>-t</b> (${esc(v.forms[4])}). ${verbKind(v).includes("Сменя") ? "Внимание: " + verbKind(v) : ""}` };
}

// ── 15. gern / lieber (A20 / A21)
const GERN = [["fahren", "Auto"], ["spielen", "Fußball"], ["lernen", "Fremdsprachen"], ["sammeln", "Briefmarken"], ["lesen", "Romane"], ["hören", "Musik"], ["surfen", "im Internet"], ["trinken", "Bier"], ["tanzen", "Salsa"], ["kochen", ""], ["wandern", "im Gebirge"], ["fotografieren", "Landschaften"], ["machen", "Yoga"]];
function genGern() {
  const [a, b] = shuffle(GERN).slice(0, 2), va = verb(a[0]), vb = verb(b[0]);
  const q = `${cap(va.forms[1])} du gern ${a[1]}?`.replace("  ", " ").replace(" ?", "?");
  const ans = vb.forms[0];
  const full = `Nein, ich ${ans} lieber ${b[1]}.`.replace("  ", " ").replace(" .", ".");
  const opts = shuffle([...new Set([ans, vb.forms[1], vb.forms[2], vb.de])]);
  return { kind: "mc", task: `Отговори: предпочиташ <i>${esc(b[1] + " " + b[0])}</i>`, prompt: `<div class="exs">${esc(q)}<br>– Nein, ich ${BLANK} lieber ${esc(b[1])}.</div>`,
    options: opts, answer: ans, item: vb, say: full, full, keys: true,
    explain: `ich → <b>${esc(ans)}</b>. <b>gern</b> = обичам да; <b>lieber</b> = предпочитам; <b>am liebsten</b> = най-много обичам. Те стоят след глагола: ich ${esc(ans)} lieber …` };
}

// ── 16. Hier kann man … (A15)
const HIER = [["die Bibliothek", "Bücher lesen"], ["die Cafeteria", "Kaffee trinken"], ["die Sporthalle", "Volleyball spielen"], ["das Sekretariat", "Informationen bekommen"],
  ["die Verwaltung", "Rechnungen bezahlen"], ["das Sprachenzentrum", "Sprachkurse besuchen"], ["die Mensa", "etwas essen"], ["die Kantine", "etwas essen"]];
function genHier() {
  const [place, act] = rnd(HIER);
  const opts = shuffle([act, ...shuffle([...new Set(HIER.map((h) => h[1]))].filter((x) => x !== act)).slice(0, 3)]);
  const full = `Das ist ${place}. Hier kann man ${act}.`;
  const pIt = noun(place.split(" ")[1]);
  return { kind: "mc", task: "Какво може да се прави тук?", prompt: `<div class="exs">Das ist ${esc(place)}. Hier kann man ${BLANK}.</div><div class="meta">${esc(pIt?.bg || "")}</div>`,
    options: opts, answer: act, item: pIt, say: full, full, keys: true,
    explain: `<b>${esc(place)}</b> → ${esc(act)}. Шаблон: <i>Hier <b>kann</b> man … <b>инфинитив</b>.</i> (kann на 2-ро място, глаголът накрая)` };
}

// ── 17. Съюзи: denn / weil / aber / sondern (урок 5)
const CONJ = [
  ["Ich bleibe zu Hause", "ich bin müde", "ich müde bin", "оставам вкъщи / уморен съм"],
  ["Ich lerne Deutsch", "ich arbeite in Berlin", "ich in Berlin arbeite", "уча немски / работя в Берлин"],
  ["Er trinkt keinen Kaffee", "er mag Tee", "er Tee mag", "не пие кафе / харесва чай"],
  ["Wir kommen heute nicht", "wir haben keine Zeit", "wir keine Zeit haben", "не идваме / нямаме време"],
  ["Ich kann nicht drucken", "der Drucker ist kaputt", "der Drucker kaputt ist", "не мога да печатам / принтерът е развален"],
  ["Sie spielt Klavier", "sie liebt Musik", "sie Musik liebt", "свири на пиано / обича музика"],
  ["Ich fahre nach München", "ich spiele dort im Orchester", "ich dort im Orchester spiele", "пътувам за Мюнхен / свиря там в оркестър"],
  ["Er sammelt Münzen", "es ist interessant", "es interessant ist", "събира монети / интересно е"],
];
function genConjunctions() {
  const [a, normal, end, bg] = rnd(CONJ);
  const c = rnd(["denn", "weil"]);
  const right = `${a}, ${c} ${c === "denn" ? normal : end}.`, wrong = `${a}, ${c} ${c === "denn" ? end : normal}.`;
  if (Math.random() < 0.25) {
    const pairs = [["Ich trinke nicht Kaffee", "Tee"], ["Er spielt nicht Tennis", "Golf"], ["Das ist kein Auto", "ein Motorrad"], ["Ich lerne nicht Deutsch", "Englisch"]];
    const [x, y] = rnd(pairs), full = `${x}, sondern ${y}.`;
    return { kind: "mc", task: "aber или sondern?", prompt: `<div class="exs">${esc(x)}, ${BLANK} ${esc(y)}.</div>`, options: ["aber", "sondern", "denn", "und"], answer: "sondern", say: full, full, keys: true,
      explain: `След <b>nicht/kein</b> и замяна („не …, а …“) → <b>sondern</b>. aber = „но“ без замяна.` };
  }
  return { kind: "mc", task: `Кое е правилно с <b>${c}</b>?`, prompt: `<div class="meta">${esc(bg)}</div>`, options: shuffle([right, wrong]), answer: right, say: right, full: right, keys: true,
    explain: c === "denn" ? "<b>denn</b> не пипа словореда: подлог → глагол (… denn ich <b>bin</b> müde)." : "<b>weil</b> изпраща глагола <b>най-накрая</b> (… weil ich müde <b>bin</b>)." };
}

// ── 18. Цени на слух (A6)
function genPreis() {
  const PRICES = { Bürostuhl: [30, 149, 299], Drucker: [99, 149, 269], Computer: [599, 691, 1299], Bildschirm: [149, 299, 189], Lampe: [19, 34, 49], Laptop: [599, 899, 1299],
    Schreibtisch: [75, 149, 299], Regal: [49, 75, 99], Kaffeemaschine: [29, 49, 99], Papierkorb: [2, 5, 9], Scanner: [99, 140], Stuhl: [30, 49, 75], Bürolampe: [34, 29], Computertisch: [29, 59], Kugelschreiber: [1, 2, 4] };
  const name = rnd(Object.keys(PRICES)), it = noun(name), eur = rnd(PRICES[name]), ct = rnd([0, 0, 95, 99, 98, 85, 59, 50, 90]);
  const spoken = `${num2de(eur)} Euro${ct ? " " + num2de(ct) : ""}`, shown = `${eur},${String(ct).padStart(2, "0")} €`;
  const full = `${cap(FORMS[it.art].def)} ${it.de} kostet ${spoken}.`;
  return { kind: "type", task: "Чуй цената и я напиши (напр. 49,98)", prompt: `<button class="bigplay" data-say="${esc(full)}">${SPK}<span>чуй пак</span></button><div class="meta">Was kostet ${FORMS[it.art].def} ${esc(it.de)}?</div>`,
    answer: shown, accept: (v) => { const m = v.replace(/[€\s]/g, "").replace(".", ","); const [e, c = "00"] = m.split(","); return +e === eur && +(c.padEnd(2, "0")) === ct; },
    autoSay: full, item: it, say: full, full, hint: "напр. 49,98",
    explain: `<b>${shown}</b> = ${esc(spoken)}. Казва се: <i>евро</i> + <i>центове</i> без „und“ между тях. Числата 21–99: единици + und + десетици (neun<b>und</b>vierzig).` };
}

// ── 19. Ударение (A18)
const STRESS = [["A|bend", 0], ["Bü|cher", 0], ["Lam|pe", 0], ["Na|me", 0], ["Dru|cker", 0], ["Zim|mer", 0], ["Zei|tung", 0], ["se|hen", 0], ["ar|bei|ten", 0], ["fah|ren", 0], ["schrei|ben", 0],
  ["Fuß|ball", 0], ["Brief|mar|ken", 0], ["Fax|ge|rät", 0], ["Wör|ter|buch", 0], ["Schreib|tisch", 0], ["Ku|gel|schrei|ber", 0], ["Blei|stift", 0],
  ["Kaf|fee", 1], ["Bü|ro", 1], ["Stu|dent", 1], ["Do|ku|ment", 2], ["Ter|min", 1], ["U|ni|ver|si|tät", 4], ["Bib|li|o|thek", 3], ["Kaf|fee|ma|schi|ne", 1], ["Bü|ro|stuhl", 1], ["Ter|min|ka|len|der", 1],
  ["stu|die|ren", 1], ["te|le|fo|nie|ren", 3], ["fo|to|gra|fie|ren", 3], ["be|su|chen", 1], ["be|kom|men", 1], ["be|zah|len", 1], ["ver|ste|hen", 1], ["Mu|sik", 1], ["Po|li|zei", 2], ["Fa|mi|lie", 1], ["Ge|schich|te", 1], ["Ma|the|ma|tik", 3]];
function genAkzent() {
  const [w, i] = rnd(STRESS), syl = w.split("|"), word = syl.join("");
  const opts = syl.map((x, k) => syl.map((y, j) => (j === k ? y.toUpperCase() : y.toLowerCase())).join("·"));
  const ans = opts[i];
  const rule = i === 0 ? (word.length > 9 || /ball|buch|tisch|stift|marken|gerät/.test(word) ? "сложна дума → ударението е отляво" : "основно правило → ударението е на първата сричка")
    : /ieren$/.test(word) ? "глаголите на -ieren → ударение на -IE-" : /^(be|ge|ver|er|ent)/.test(word.toLowerCase()) ? "представките be-/ver- не се ударяват" : "чужда дума → ударението е отдясно";
  return { kind: "mc", task: "Къде е ударението? (чуй след отговора)", prompt: `<div class="exw">${esc(word)}</div>`, options: opts, answer: ans, say: word, full: word, keys: true,
    explain: `<b>${esc(ans)}</b> — ${rule}.` };
}

// ── 20. Четене: диалози (вдъхновени от учебника) + вярно/невярно
const DIALOGS = [
  { title: "Първи ден в офиса", lines: [
    ["Frau Berger", "Guten Morgen! Suchen Sie etwas?"], ["Herr Koch", "Ja, mein Büro. Ich bin neu hier. Mein Name ist Koch."], ["Frau Berger", "Herzlich willkommen, Herr Koch! Ich bin Sabine Berger, die Sekretärin."],
    ["Frau Berger", "Kommen Sie, hier ist Ihr Zimmer. Da sind der Schreibtisch, der Computer und das Telefon."], ["Herr Koch", "Das Zimmer ist hell und schön. Aber es gibt keinen Drucker."],
    ["Frau Berger", "Der Drucker steht im Sekretariat. Vielleicht trinken wir später zusammen Kaffee?"], ["Herr Koch", "Gerne! Bis später."]],
    qs: [["Herr Koch ist neu im Büro.", true, 1], ["Frau Berger ist Lehrerin.", false, 2], ["Im Zimmer gibt es einen Computer.", true, 3], ["Das Zimmer ist dunkel.", false, 4], ["Im Zimmer steht ein Drucker.", false, 4], ["Sie trinken später Kaffee.", true, 5]] },
  { title: "Проблем с принтера", lines: [
    ["Frau Lang", "Hallo, Herr Wolf, wie geht es?"], ["Herr Wolf", "Danke, gut. Aber ich habe ein Problem. Mein Drucker geht nicht."], ["Frau Lang", "Was? Das ist doch ein neuer Drucker! Und der Computer?"],
    ["Herr Wolf", "Der Computer funktioniert. Das Telefon auch. Nur der Drucker ist kaputt."], ["Frau Lang", "Und die Lampe? Sie ist sehr alt."], ["Herr Wolf", "Die Lampe funktioniert gut."], ["Frau Lang", "Gut, ich frage gleich den Techniker."]],
    qs: [["Herr Wolf hat ein Problem.", true, 1], ["Der Drucker ist alt.", false, 2], ["Der Computer funktioniert nicht.", false, 3], ["Das Telefon funktioniert.", true, 3], ["Die Lampe ist neu.", false, 4], ["Frau Lang fragt den Techniker.", true, 6]] },
  { title: "В кафетерията", lines: [
    ["Frau Lang", "Was trinken Sie, Herr Wolf?"], ["Herr Wolf", "Einen Tee, bitte. Ich trinke keinen Kaffee."], ["Frau Lang", "Was machen Sie am Wochenende?"],
    ["Herr Wolf", "Ich fahre nach Hamburg. Dort spiele ich Gitarre in einer Band."], ["Frau Lang", "Toll! Ich spiele kein Instrument, aber ich singe gern."], ["Herr Wolf", "Spielen Sie auch Fußball?"],
    ["Frau Lang", "Nein, ich spiele lieber Tennis. Und ich rauche nicht."], ["Herr Wolf", "Ich auch nicht. Ich bin Nichtraucher."]],
    qs: [["Herr Wolf trinkt Kaffee.", false, 1], ["Am Wochenende fährt Herr Wolf nach Hamburg.", true, 3], ["Herr Wolf spielt Klavier.", false, 3], ["Frau Lang singt gern.", true, 4], ["Frau Lang spielt lieber Tennis.", true, 6], ["Herr Wolf raucht.", false, 7]] },
];
let dialogIdx = 0;
function genDialogQ(dlg, k) {
  const [st, ok, line] = dlg.qs[k];
  const html = dlg.lines.map(([who, t], i) => `<div class="dl"><b>${esc(who)}:</b> ${sentHTML(t, "", null).replace('<div class="sbg" title="Посочи или цъкни, за да видиш превода"></div>', "")}</div>`).join("");
  return { kind: "mc", task: `Прочети/чуй диалога: „${esc(dlg.title)}“. Вярно или невярно?`, prompt: `<details class="dlg" open><summary>Диалог (посочи дума за превод · 🔊 за звук)</summary>${html}<button class="btn" data-play-dlg="1" style="margin-top:6px">▶ Пусни целия диалог</button></details><div class="exs" style="margin-top:12px">${esc(st)}</div>`,
    options: ["richtig ✓", "falsch ✗"], answer: ok ? "richtig ✓" : "falsch ✗", say: st, keys: true, dlg,
    explain: `В диалога: <i>„${esc(dlg.lines[line][1])}“</i> → ${ok ? "вярно" : "невярно"}.` };
}

// ── Тренирай думата: поредица задачи за една дума
function genWordTraining(it) {
  const qs = [], exs = examplesFor(it).filter((e) => e[0] !== it.de);
  const sameType = ITEMS.filter((o) => o.type === it.type && o !== it && o.bg !== it.bg);
  // 1. чуй → превод
  qs.push({ kind: "mc", task: "Чуй думата. Какво значи?", prompt: `<button class="bigplay" data-say="${esc(deFull(it))}">${SPK}<span>чуй пак</span></button>`, autoSay: deFull(it),
    options: shuffle([it.bg, ...shuffle(sameType).slice(0, 3).map((o) => o.bg)]), answer: it.bg, item: it, say: deFull(it), keys: true,
    explain: `${deHTML(it)} = <b>${esc(it.bg)}</b>` });
  if (it.type === "noun" && ["der", "die", "das"].includes(it.art)) {
    qs.push({ kind: "mc", task: "Кой е членът?", prompt: `<div class="exw">${BLANK} ${esc(it.de)}</div>`, options: ["der", "die", "das"], answer: it.art, item: it, say: deFull(it), keys: true,
      explain: `${artTag(it.art)} ${esc(it.de)} — ${GENDER_BG[it.art]}. ${genderHint(it)}` });
    if (it.pl && it.pl !== it.de) {
      const fakes = [...new Set([it.de + "e", it.de + "en", it.de + "s", it.de + "er", deUml(it.pl) !== it.pl ? deUml(it.pl) : it.de + "n"])].filter((f) => f !== it.pl);
      qs.push({ kind: "mc", task: "Кое е множественото число?", prompt: `<div class="exw">${deHTML(it)} → die ${BLANK}</div>`, options: shuffle([it.pl, ...shuffle(fakes).slice(0, 3)]), answer: it.pl, item: it, say: "die " + it.pl, keys: true,
        explain: `die <b>${esc(it.pl)}</b> — ${pluralRule(it.de, it.pl)}.` });
    }
    if (it.pl) {
      const f = FORMS[it.art];
      qs.push({ kind: "mc", task: "Избери правилната форма (Akkusativ).", prompt: `<div class="exs">Ich brauche ${BLANK} ${esc(it.de)}.</div>`, options: [...new Set([f.indAcc, "ein", "eine", "einen"])], answer: f.indAcc, item: it,
        say: `Ich brauche ${f.indAcc} ${it.de}.`, full: `Ich brauche ${f.indAcc} ${it.de}.`, keys: true,
        explain: `brauchen → Akkusativ. ${artTag(it.art)} → <b>${f.indAcc}</b>${it.art === "der" ? " (мъжки род: ein → einen)" : " (не се променя)"}.` });
    }
  }
  if (it.type === "verb") {
    shuffle([1, 2, 3, 4, 0, 5]).slice(0, 4).forEach((si) => {
      const sp = ["ich", "du", "er", "wir", "ihr", "sie"][si], ans = it.forms[si];
      qs.push({ kind: "type", task: `Спрегни <b>${esc(it.de)}</b>`, prompt: `<div class="exw">${cap(sp)} ${BLANK}</div><div class="meta">${esc(it.bg)}</div>`, answer: ans, accept: (v) => sameDe(v, ans) || sameDe(v, sp + " " + ans),
        item: it, say: `${sp} ${ans}`, full: `${cap(sp)} ${ans}`, explain: `${sp} → <b>${esc(ans)}</b>. ${verbKind(it)}<div class="exconj">${conjTable(it)}</div>` });
    });
  }
  if (it.type === "adj" && OPPOSITE[it.de]) {
    const opp = OPPOSITE[it.de];
    qs.push({ kind: "mc", task: "Кое е обратното?", prompt: `<div class="exw">${esc(it.de)} ↔ ${BLANK}</div>`, options: shuffle([opp, ...shuffle(ANTO.flat().filter((w) => w !== opp && w !== it.de)).slice(0, 3)]), answer: opp, item: it, say: `${it.de}, ${opp}`, keys: true,
      explain: `<b>${esc(it.de)}</b> ↔ <b>${esc(opp)}</b>` });
  }
  // попълни празното от всеки пример
  const f = itemForms(it);
  exs.forEach(([de, bg]) => {
    const target = (de.match(WORD_RE) || []).find((t) => f.has(t.toLowerCase()));
    if (!target) return;
    const distract = shuffle([...f].filter((x) => x !== target.toLowerCase())).slice(0, 2);
    const others = shuffle(ITEMS.filter((o) => o.type === it.type && o !== it)).slice(0, 4).map((o) => (o.type === "verb" ? o.forms[2] : o.de));
    const opts = shuffle([...new Set([target, ...distract.map((d) => (target[0] === target[0].toUpperCase() ? cap(d) : d)), ...others])].slice(0, 4));
    if (!opts.includes(target)) opts[0] = target;
    const blank = esc(de).replace(new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${target}(?![A-Za-zÄÖÜäöüß])`), `$1${BLANK}`);
    qs.push({ kind: "mc", task: "Попълни изречението", prompt: `<div class="exs">${blank}</div><div class="meta">${esc(bg)}</div>`, options: shuffle(opts), answer: target, item: it, say: de, full: de, bg, keys: true,
      explain: `Правилната форма е <b>${esc(target)}</b>.${it.type === "verb" ? " " + verbKind(it) : ""}` });
  });
  // подреди един пример
  const ord = exs.find(([de]) => de.split(" ").length >= 3 && de.split(" ").length <= 9);
  if (ord) {
    const toks = ord[0].split(/\s+/); let sh = shuffle(toks); for (let n = 0; n < 6 && sh.join(" ") === ord[0]; n++) sh = shuffle(toks);
    qs.push({ kind: "order", task: "Подреди изречението", prompt: `<div class="meta" style="font-size:16px">${esc(ord[1])}</div>`, toks, sh, answer: ord[0], item: it, say: ord[0], full: ord[0], bg: ord[1],
      explain: "Глаголът е на 2-ро място (във въпрос „да/не“ — на 1-во); вторият глагол — накрая." });
  }
  // напиши думата
  qs.push({ kind: "type", task: "Напиши на немски" + (it.type === "noun" && ["der", "die", "das"].includes(it.art) ? " (с члена)" : ""), prompt: `<div class="mid">${esc(it.bg)}</div>`, answer: deFull(it),
    accept: (v) => sameDe(v, deFull(it)) || (it.type !== "noun" && sameDe(v, it.de)), item: it, say: deFull(it), full: deFull(it), explain: `${deHTML(it)} <span class="tr" style="display:inline">[${esc(translit(deFull(it)))}]</span>` });
  return qs;
}

// ── каталог
const EX_TYPES = [
  { k: "art", skill: "Граматика", ic: "🎨", t: "der · die · das", d: "Родът + правила и подсказки защо", gen: genArt },
  { k: "einkein", skill: "Граматика", ic: "🔢", t: "ein / eine / kein / keine", d: "„Im Büro ist ein Computer / kein Drucker“ (A5)", gen: genEinKein },
  { k: "akk", skill: "Граматика", ic: "🎯", t: "Nominativ / Akkusativ", d: "Ich trinke einen Kaffee · der → den", gen: genAkk },
  { k: "poss", skill: "Граматика", ic: "👤", t: "mein, dein, sein, ihr…", d: "Притежание (C4, C5)", gen: genPoss },
  { k: "ersiees", skill: "Граматика", ic: "🔁", t: "er, sie, es за предмети", d: "Ist der Computer neu? – Nein, er ist alt. (C6)", gen: genErSieEs },
  { k: "nichtkein", skill: "Граматика", ic: "🚫", t: "nicht или kein?", d: "Отрицание (C13)", gen: genNichtKein },
  { k: "praep", skill: "Граматика", ic: "📍", t: "aus, in, nach, bei, an", d: "Откъде, къде, накъде (C14)", gen: genPraep },
  { k: "conj", skill: "Глаголи и словоред", ic: "⚙️", t: "Спрежение", d: "Всички глаголи от курса (C9, C10)", gen: genConj },
  { k: "formell", skill: "Глаголи и словоред", ic: "🤝", t: "Sie → du / ihr", d: "Как го казват студентите (A24)", gen: genFormell },
  { k: "gern", skill: "Глаголи и словоред", ic: "❤️", t: "gern / lieber", d: "Fährst du gern Auto? – Nein, ich spiele lieber … (A21)", gen: genGern },
  { k: "modal", skill: "Глаголи и словоред", ic: "🧩", t: "Модален глагол: подреди", d: "Hier kann man Bücher lesen. (A16)", gen: genModalOrder },
  { k: "pos2", skill: "Глаголи и словоред", ic: "2️⃣", t: "Глаголът на 2-ро място", d: "Am Montag fährt Herr Meier Motorrad. (A28)", gen: genPos2 },
  { k: "konj", skill: "Глаголи и словоред", ic: "🔗", t: "denn, weil, sondern", d: "Словоред след съюзите", gen: genConjunctions },
  { k: "colloc", skill: "Думи и употреба", ic: "🧲", t: "Was passt? / Кое не пасва?", d: "Rechnungen bezahlen, Fußball spielen (A17, C12)", gen: genColloc },
  { k: "anto", skill: "Думи и употреба", ic: "↔️", t: "Антоними", d: "Der Computer ist nicht neu. Er ist alt. (A12, A13)", gen: genAnto },
  { k: "hier", skill: "Думи и употреба", ic: "🏛", t: "Hier kann man …", d: "Bibliothek, Mensa, Sekretariat… (A14, A15)", gen: genHier },
  { k: "frage", skill: "Думи и употреба", ic: "❓", t: "Въпросителни думи", d: "wie, was, wo, woher, wohin, wer, wen… (C15)", gen: genFrage },
  { k: "dialog", skill: "Четене и слушане", ic: "💬", t: "Диалози: вярно / невярно", d: "3 диалога в стила на учебника (A1, A8, A22)", gen: null },
  { k: "preis", skill: "Четене и слушане", ic: "💶", t: "Цени на слух", d: "Was kostet der Bürostuhl? (A6)", gen: genPreis },
  { k: "akzent", skill: "Четене и слушане", ic: "🎵", t: "Ударение", d: "Къде е ударението? (A18)", gen: genAkzent },
];


// ═════ Kapitel 3 и урок 7–8 ═════
const whyOf = (full, word) => { const toks = full.match(WORD_RE) || []; const i = toks.findIndex((t) => t === word); return i >= 0 && typeof XP !== "undefined" ? XP.explain(full, i).html || "" : ""; };
const ADJ_EX = [["neu", "нов"], ["alt", "стар"], ["groß", "голям"], ["klein", "малък"], ["schön", "хубав"], ["modern", "модерен"], ["bequem", "удобен"], ["teuer", "скъп"], ["billig", "евтин"], ["praktisch", "практичен"], ["hell", "светъл"], ["weich", "мек"], ["hart", "твърд"], ["dunkel", "тъмен"]];
const adjF = (b, e) => (!e ? b : b === "teuer" ? "teur" + e : b === "dunkel" ? "dunkl" + e : b + e);
const HOTEL = ["Fernseher", "Bett", "Handtuch", "Spiegel", "Sessel", "Wecker", "Haartrockner", "Dusche", "Minibar", "Zimmersafe", "Kopfkissen", "Telefon", "Schreibtisch", "Lampe", "Radio", "Balkon", "Internetanschluss", "Bad", "Doppelbett"];
// ── окончания на прилагателни (A16 / A17)
function genAdjEnd() {
  const it = rnd(objPool([...THINGS, ...HOTEL].filter((x, i, a) => a.indexOf(x) === i))), g = it.art;
  const SPECIAL = { bequem: ["Stuhl", "Sessel", "Bett", "Bürostuhl", "Doppelbett"], weich: ["Bett", "Kopfkissen", "Sessel", "Handtuch"], hart: ["Bett", "Kopfkissen", "Stuhl", "Sessel"],
    hell: ["Lampe", "Zimmer", "Büro", "Wohnung", "Bürolampe"], dunkel: ["Zimmer", "Büro", "Wohnung", "Schrank", "Tisch", "Brille"], praktisch: OFFICE };
  const [ab, abg] = rnd(ADJ_EX.filter(([x]) => !SPECIAL[x] || SPECIAL[x].includes(it.de)));
  const mode = rnd(["nomDef", "akkInd", "akkInd", "nomInd", "akkDef"]);
  const D = { nomDef: [FORMS[g].def, { der: "e", die: "e", das: "e" }[g]], akkDef: [FORMS[g].acc, { der: "en", die: "e", das: "e" }[g]], nomInd: [FORMS[g].ind, { der: "er", die: "e", das: "es" }[g]], akkInd: [FORMS[g].indAcc, { der: "en", die: "e", das: "es" }[g]] }[mode];
  const np = `${D[0]} ${adjF(ab, D[1])} ${it.de}`;
  const frame = { nomDef: [`Ist ___ kaputt?`, (x) => `Ist ${x} kaputt?`], akkDef: [`Ich finde ___ sehr schön.`, (x) => `Ich finde ${x} sehr schön.`], nomInd: [`Das ist ___.`, (x) => `Das ist ${x}.`], akkInd: [`${rnd(["Ich brauche", "Wir möchten", "Er hat", "Sie sucht"])} ___.`, null] }[mode];
  const lead = frame[0].replace(" ___.", "").replace(" ___ ", " ").replace(/\?$/, "");
  const full = frame[1] ? frame[1](np) : frame[0].replace("___", np);
  const arts = mode.endsWith("Def") ? [FORMS[g].def, FORMS[g].acc] : [FORMS[g].ind, FORMS[g].indAcc];
  const variants = new Set([np]);
  for (const a of arts) for (const e of ["e", "en", "er", "es"]) variants.add(`${a} ${adjF(ab, e)} ${it.de}`);
  const opts = shuffle([np, ...shuffle([...variants].filter((v) => v !== np)).slice(0, 3)]);
  return { kind: "mc", task: `Попълни: <b>${ab}</b> (${abg}) + <b>${esc(it.de)}</b>`, prompt: `<div class="exs">${esc(frame[0]).replace("___", BLANK)}</div><div class="meta">${art(it)} ${esc(it.de)} · ${mode.startsWith("nom") ? "Nominativ (кой/какво е?)" : "Akkusativ (какво?)"}</div>`,
    options: opts, answer: np, item: it, say: full, full, keys: true,
    explain: `${whyOf(full, D[0])}<hr>${whyOf(full, adjF(ab, D[1]))}` };
}
const art = (it) => artTag(it.art);
// ── es gibt + Akkusativ, im / in der (A2, A11)
function genGibt() {
  const it = rnd(objPool(HOTEL)), f = FORMS[it.art];
  if (Math.random() < 0.3) {
    const place = rnd([["Zimmer", "im"], ["Bad", "im"], ["Hotel", "im"], ["Dusche", "in der"], ["Sauna", "in der"], ["Tiefgarage", "in der"], ["Schwimmbad", "im"], ["Restaurant", "im"]]);
    const full = `Wir sind ${place[1]} ${place[0]}.`, pi = noun(place[0]);
    return { kind: "mc", task: "im или in der? (къде?)", prompt: `<div class="exs">Wir sind ${BLANK} ${esc(place[0])}.</div><div class="meta">${pi ? art(pi) + " " + esc(pi.de) : ""}</div>`, options: ["im", "in der", "in die", "ins"], answer: place[1], say: full, full, keys: true,
      explain: `<b>Къде?</b> → Dativ. ${pi ? art(pi) : ""} → ${place[1] === "im" ? "der/das → <b>dem</b>, а in + dem = <b>im</b>" : "die → <b>der</b> в Dativ → <b>in der</b>"}. (ins = in das е за „накъде?“)` };
  }
  const neg = Math.random() < 0.4, ans = neg ? f.negAcc : f.indAcc;
  const s = `Im Zimmer gibt es ${BLANK} ${esc(it.de)}.`, full = `Im Zimmer gibt es ${ans} ${it.de}.`;
  return { kind: "mc", task: `es gibt + Akkusativ${neg ? " (няма)" : ""}`, prompt: `<div class="exs">${s}</div><div class="meta">${art(it)} ${esc(it.de)} = ${esc(it.bg)}</div>`,
    options: neg ? ["kein", "keine", "keinen"] : ["ein", "eine", "einen"], answer: ans, item: it, say: full, full, keys: true, explain: whyOf(full, ans) };
}
// ── Ich kann nicht … (A15)
const CANT = [["Meine Kreditkarte ist weg.", "bezahlen"], ["Die Dusche ist kaputt.", "duschen"], ["Der Fernseher geht nicht.", "fernsehen"], ["Das Bett ist zu hart.", "schlafen"], ["Der Sessel ist nicht stabil.", "sitzen"],
  ["Im Zimmer gibt es keinen Schreibtisch.", "arbeiten"], ["Das Telefon funktioniert nicht.", "telefonieren"], ["Die Lampe ist kaputt.", "lesen"], ["Es gibt keine Tiefgarage.", "parken"], ["Ich habe keinen Internetanschluss.", "surfen"], ["Mein Zimmerschlüssel ist weg.", "öffnen"], ["Der Drucker ist kaputt.", "drucken"]];
function genKannNicht() {
  const [sit, v] = rnd(CANT), vi = verb(v);
  const tail = { öffnen: "die Tür nicht", parken: "mein Auto hier nicht", surfen: "nicht im Internet" }[v] || "nicht";
  const full = `${sit} Ich kann ${tail} ${v}.`;
  const shown = `${sit} Ich kann ${tail} ___.`;
  const opts = shuffle([v, ...shuffle(CANT.map((c) => c[1]).filter((x) => x !== v)).slice(0, 3)]);
  return { kind: "mc", task: "Какво не можеш да правиш? (A15)", prompt: `<div class="exs">${esc(shown).replace("___", BLANK)}</div>`, options: opts, answer: v, item: vi, say: full, full, keys: true,
    explain: `${esc(sit)} → не мога да <b>${esc(vi ? vi.bg : v)}</b>.<br>${whyOf(full, v)}` };
}
// ── Was kann man wo? (A18)
const CITY = [["übernachten", "das Hotel"], ["etwas essen", "das Restaurant"], ["sein Auto parken", "der Parkplatz"], ["einen Film sehen", "das Kino"], ["studieren", "die Universität"], ["berühmte Bilder bewundern", "das Museum"],
  ["eine Aspirintablette kaufen", "die Apotheke"], ["eine Oper sehen", "die Oper"], ["eine Tasse Kaffee trinken", "das Café"], ["Geld abheben", "die Bank"], ["Briefmarken kaufen", "die Post"], ["Lebensmittel kaufen", "der Supermarkt"],
  ["Informationen bekommen", "die Touristeninformation"], ["Hier regiert der Bürgermeister", "das Rathaus"], ["Hier halten Züge", "der Bahnhof"]];
function genStadt() {
  const [act, place] = rnd(CITY), opts = shuffle([place, ...shuffle(CITY.map((c) => c[1]).filter((x) => x !== place)).slice(0, 3)]);
  const pi = noun(place.split(" ")[1]);
  const q = /^Hier /.test(act) ? `${act}.` : `Hier kann man ${act}.`;
  return { kind: "mc", task: "Къде е това? (A18)", prompt: `<div class="exs">${esc(q)}</div>`, options: opts, answer: place, item: pi, say: `${q} ${place}`, full: q, keys: true,
    explain: `${esc(place)}${pi ? " = " + esc(pi.bg) : ""}. В града: <i>In der Stadt gibt es ${esc(FORMS[pi?.art || "das"].indAcc)} ${esc(place.split(" ")[1])}.</i> (es gibt + Akkusativ)` };
}
// ── Работно време (A20–A22)
const PLACES_T = [["das Museum", 9, 17, "Montag"], ["die Pinakothek", 10, 18, "Montag"], ["die Bibliothek", 8, 20, "Sonntag"], ["das Kartoffelmuseum", 11, 18, "Montag"], ["die Post", 9, 18, "Sonntag"], ["die Bank", 9, 16, "Samstag"]];
const DAY_DE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
function genZeit() {
  const [p, a, b, closed] = rnd(PLACES_T), P = cap(p);
  const open = { Montag: "Dienstag bis Sonntag", Sonntag: "Montag bis Samstag", Samstag: "Montag bis Freitag" }[closed];
  const card = `<div class="ocard"><b>${esc(P)}</b><div>Öffnungszeiten: ${open}, ${a}.00 bis ${b}.00 Uhr</div><div>${esc(closed)}: geschlossen</div></div>`;
  const t = rnd([
    { q: `Wann öffnet ${p}?`, ans: `Um ${a} Uhr.`, opts: [`Um ${a} Uhr.`, `Um ${b} Uhr.`, `Von ${a} bis ${b} Uhr.`, `Am ${closed}.`], why: "<b>Wann öffnet …?</b> → точен час → <b>um</b> + час." },
    { q: `Wann schließt ${p}?`, ans: `Um ${b} Uhr.`, opts: [`Um ${b} Uhr.`, `Um ${a} Uhr.`, `Von ${a} bis ${b} Uhr.`, `Am ${closed}.`], why: "<b>Wann schließt …?</b> → точен час → <b>um</b> + час." },
    { q: `Wie lange ist ${p} geöffnet?`, ans: `Von ${a} bis ${b} Uhr.`, opts: [`Von ${a} bis ${b} Uhr.`, `Um ${a} Uhr.`, `Um ${b} Uhr.`, `Am ${closed}.`], why: "<b>Wie lange?</b> → период → <b>von … bis</b>." },
    { q: `Wann ist ${p} geschlossen?`, ans: `${closed.toLowerCase()}s (jeden ${closed}).`, opts: [`${closed.toLowerCase()}s (jeden ${closed}).`, `Um ${b} Uhr.`, `Von ${a} bis ${b} Uhr.`, `täglich.`], why: `Всеки ${closed} → <b>${closed.toLowerCase()}s</b> (с малка буква и -s) = jeden ${closed}.` },
  ]);
  return { kind: "mc", task: "Прочети работното време (A20–A22)", prompt: `${card}<div class="exs" style="margin-top:10px">${esc(t.q)}</div>`, options: shuffle([...new Set(t.opts)]), answer: t.ans, say: `${t.q} ${t.ans}`, full: t.q, keys: true,
    explain: `${t.why} <b>um</b> 9 Uhr = точно · <b>gegen</b> 9 Uhr = около · <b>von</b> 9 <b>bis</b> 17 Uhr = период · <b>am</b> Montag = в един понеделник · <b>montags</b> = всеки понеделник.` };
}
// ── Разделими глаголи: подреди
const SEP_T = [["ankommen", "Der Zug", 2, "um zehn Uhr"], ["abfahren", "Der Bus", 2, "um acht Uhr"], ["mitfahren", "Meine Schwester", 2, "morgen"], ["fernsehen", "ich", 0, "am Abend"], ["einladen", "Wir", 3, "unsere Freunde"],
  ["teilnehmen", "Er", 2, "am Wettbewerb"], ["abheben", "Ich", 0, "Geld"], ["ausfüllen", "Sie", 5, "das Formular"], ["nachdenken", "Ich", 0, "noch einmal"], ["einrichten", "Wir", 3, "das Büro"], ["vorlesen", "Die Mutter", 2, "ein Buch"], ["wegfahren", "Wir", 3, "am Wochenende"]];
function genTrennbar() {
  const [vde, subj, si, rest] = rnd(SEP_T), v = verb(vde); if (!v) return genConj();
  const [stem, pre] = v.forms[si].split(" ");
  const front = subj === "ich" ? ["Am Abend", stem, "ich", pre + "."] : null;
  const toks = front || [cap(subj), stem, ...rest.split(" "), pre + "."];
  if (front) toks.splice(0, 4, "Am", "Abend", stem, "ich", pre + ".");
  const sentence = toks.join(" ");
  let sh = shuffle(toks); for (let n = 0; n < 6 && sh.join(" ") === sentence; n++) sh = shuffle(toks);
  return { kind: "order", task: `Разделим глагол: <b>${esc(vde)}</b> (${esc(v.bg)})`, prompt: `<div class="meta" style="font-size:15px">${esc(vde)} = ${esc(pre)} + ${esc(vde.slice(pre.length))}: представката отива накрая</div>`, toks, sh, answer: sentence, item: v, say: sentence, full: sentence,
    explain: `Спрегнатата част (<b>${esc(stem)}</b>) е на <b>2-ро място</b>, а представката (<b>${esc(pre)}</b>) отива <b>в самия край</b>. ${esc(vde)} → ${esc(stem)} … ${esc(pre)}.` };
}
// ── Formulieren Sie Fragen (A3)
const QF = [["haben", "du", 1, "Fernseher"], ["haben", "Sie", 5, "Computer"], ["brauchen", "ihr", 4, "Radio"], ["möchten", "du", 1, "Fahrrad"], ["haben", "ihr", 4, "Auto"], ["möchten", "Sie", 5, "Tasse"],
  ["brauchen", "du", 1, "Stuhl"], ["haben", "Sie", 5, "Saxofon"], ["möchten", "Sie", 5, "Zeitung"], ["brauchen", "Sie", 5, "Schreibtisch"], ["haben", "du", 1, "Kreditkarte"], ["möchten", "Sie", 5, "Doppelzimmer"], ["brauchen", "du", 1, "Wecker"], ["haben", "ihr", 4, "Kalender"]];
function genFragen() {
  const [vde, p, si, nde] = rnd(QF), v = verb(vde), it = noun(nde); if (!v || !it) return genAkk();
  const vf = cap(v.forms[si]), f = FORMS[it.art];
  const right = `${vf} ${p} ${f.indAcc} ${it.de}?`;
  const wrongs = [`${vf} ${p} ${f.ind === f.indAcc ? (it.art === "die" ? "ein" : "eine") : f.ind} ${it.de}?`, `${cap(v.forms[si === 1 ? 2 : 1])} ${p} ${f.indAcc} ${it.de}?`, `${cap(p)} ${v.forms[si]} ${f.indAcc} ${it.de}?`];
  return { kind: "mc", task: `Формулирай въпрос: <b>${esc(vde)} – ${esc(p)} – ${esc(nde)}</b> (A3)`, prompt: `<div class="meta">${art(it)} ${esc(it.de)} = ${esc(it.bg)}</div>`, options: shuffle([...new Set([right, ...wrongs])]), answer: right, item: it, say: right, full: right, keys: true,
    explain: `Въпрос „да/не“ → глаголът <b>отпред</b>: ${esc(vf)} ${esc(p)} …? ${esc(p)} → <b>${esc(v.forms[si])}</b>. ${esc(vde)} иска <b>Akkusativ</b> → ${art(it)} → <b>${f.indAcc}</b>${it.art === "der" ? " (der: ein → einen)" : " (без промяна)"}.` };
}
// ── ein → der (първо споменаване, после известно) (A10)
function genEinDer() {
  const it = rnd(objPool(HOTEL)), f = FORMS[it.art], adj = rnd(["sehr klein", "zu alt", "sehr schön", "kaputt", "sehr modern"]);
  const full = `Im Zimmer gibt es ${f.indAcc} ${it.de}. Ich finde ${f.acc} ${it.de} ${adj}.`;
  return { kind: "mc", task: "ein или der? (A10)", prompt: `<div class="exs">Im Zimmer gibt es ${f.indAcc} ${esc(it.de)}. Ich finde ${BLANK} ${esc(it.de)} ${esc(adj)}.</div>`, options: [...new Set([f.acc, f.indAcc, f.def, f.ind])], answer: f.acc, item: it, say: full, full, keys: true,
    explain: `Първия път, когато споменаваме нещо → <b>неопределен</b> член (${f.indAcc}). После вече е „онзи, за който говорим“ → <b>определителен</b> (${f.acc}).<br>${whyOf(full, f.acc)}` };
}
// ── умалителни
const DIM = [["das Bild", "Bildchen"], ["die Hand", "Händchen"], ["das Haus", "Häuschen"], ["der Tisch", "Tischchen"], ["die Tasse", "Tässchen"], ["der Stuhl", "Stühlchen"], ["die Maus", "Mäuschen"], ["das Buch", "Büchlein"], ["der Brief", "Briefchen"]];
function genDimin() {
  const [base, dim] = rnd(DIM);
  const opts = shuffle(["das " + dim, "der " + dim, "die " + dim, base.split(" ")[0] + " " + dim]).filter((x, i, a) => a.indexOf(x) === i);
  return { kind: "mc", task: "Умалително: малко …", prompt: `<div class="exw">${esc(base)} → ${BLANK}</div>`, options: opts, answer: "das " + dim, say: "das " + dim, full: "das " + dim, keys: true,
    explain: `Умалителните на <b>-chen</b> и <b>-lein</b> са <b>ВИНАГИ das</b> — без значение какъв е родът на основната дума. Често гласната получава умлаут: a → ä, u → ü, o → ö (${esc(base)} → das ${esc(dim)}).` };
}
// ── ö или e? ü или ie? (A14 / A19) — на слух
const PHON = [["können", "k_nnen", "ö", "e"], ["kennen", "k_nnen", "e", "ö"], ["zwölf", "zw_lf", "ö", "e"], ["lesen", "l_sen", "e", "ö"], ["öffnen", "_ffnen", "ö", "e"], ["senden", "s_nden", "e", "ö"], ["elf", "_lf", "e", "ö"], ["schön", "sch_n", "ö", "e"], ["hören", "h_ren", "ö", "e"],
  ["Bücher", "B_cher", "ü", "ie"], ["vier", "v_r", "ie", "ü"], ["Tür", "T_r", "ü", "ie"], ["Zimmer", "Z_mmer", "i", "ü"], ["Glück", "Gl_ck", "ü", "i"], ["fünf", "f_nf", "ü", "i"], ["spielen", "sp_len", "ie", "ü"], ["Frühstück", "Fr_hstück", "ü", "ie"], ["München", "M_nchen", "ü", "i"]];
function genPhon() {
  const [word, mask, a, b] = rnd(PHON);
  return { kind: "mc", task: "Чуй и избери буквата (A14, A19)", prompt: `<button class="bigplay" data-say="${esc(word)}">${SPK}<span>чуй пак</span></button><div class="exw">${esc(mask).replace("_", BLANK)}</div>`, autoSay: word,
    options: shuffle([a, b]), answer: a, say: word, full: word, keys: true,
    explain: `<b>${esc(word)}</b>. 💡 <b>ö</b> = устни като за „о“, а казваш „е“. <b>ü</b> = устни като за „у“, а казваш „и“. Дълго ö/ü (schön, Bücher) или кратко (zwölf, fünf) — пред две съгласни е кратко.` };
}
// ── Избери думата (думи в контекст)
function genPick() {
  for (let tries = 0; tries < 20; tries++) {
    const it = rnd(exPool((i) => ["noun", "verb", "adj", "adv"].includes(i.type)));
    const ex = shuffle(examplesFor(it).filter((e) => e[0] !== it.de));
    const f = itemForms(it);
    for (const [de, bg] of ex) {
      const target = (de.match(WORD_RE) || []).find((t) => f.has(t.toLowerCase()));
      if (!target) continue;
      const others = shuffle(exPool((o) => o.type === it.type && o !== it && !/\s/.test(o.de))).slice(0, 6).map((o) => (o.type === "verb" ? o.forms[[0, 2, 3][(Math.random() * 3) | 0]] : o.de)).filter((x) => x.toLowerCase() !== target.toLowerCase());
      const opts = shuffle([target, ...[...new Set(others)].slice(0, 3)]);
      const blank = esc(de).replace(new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${target}(?![A-Za-zÄÖÜäöüß])`), `$1${BLANK}`);
      return { kind: "mc", task: "Избери думата, която пасва", prompt: `<div class="exs">${blank}</div><div class="meta">${esc(bg)}</div>`, options: opts, answer: target, item: it, say: de, full: de, bg, keys: true,
        explain: `<b>${esc(target)}</b> — ${esc(it.bg)}.<br>${whyOf(de, target)}` };
    }
  }
  return genArt();
}
// ── um … zu / statt … zu / ohne … zu
const UMZU = [["Ich lerne Deutsch, ___ in Deutschland zu arbeiten.", "um", "за да"], ["Er fährt nach München, ___ das Museum zu besuchen.", "um", "за да"], ["Ich brauche ein Auto, ___ zur Arbeit zu fahren.", "um", "за да"],
  ["___ zu lernen, sieht er fern.", "Statt", "вместо да"], ["___ sich vorzubereiten, amüsiert er sich.", "Statt", "вместо да"], ["Er geht, ___ zu bezahlen.", "ohne", "без да"], ["___ viel nachzudenken, antwortet er.", "Ohne", "без да"], ["Sie trinkt Kaffee, ___ wach zu bleiben.", "um", "за да"]];
function genUmZu() {
  const [s, a, bg] = rnd(UMZU), full = s.replace("___", a);
  const opts = /^___/.test(s) ? ["Um", "Statt", "Ohne"] : ["um", "statt", "ohne"];
  return { kind: "mc", task: "um / statt / ohne … zu", prompt: `<div class="exs">${esc(s).replace("___", BLANK)}</div>`, options: opts, answer: a, say: full, full, keys: true,
    explain: `<b>${a} … zu</b> = ${bg}. Втората част завършва със <b>zu + инфинитив</b>. При разделими глаголи zu влиза в средата: vor<b>zu</b>bereiten, nach<b>zu</b>denken.` };
}
// ── банка с думи (A8): попълни текста
const BANK_TEXTS = [
  { title: "На рецепцията (A8)", parts: ["Guten Tag. Ich {möchte} gern ein Zimmer. {Haben} Sie noch Einzelzimmer?", "Ja, wir {haben} noch Einzelzimmer. Wie lange {bleiben} Sie?", "Zwei Nächte. Was {kostet} das Zimmer?", "Achtzig Euro. Der Preis {ist} mit Frühstück.", "Gut, ich {nehme} das Zimmer. Kann ich mit Kreditkarte {zahlen}?"] },
  { title: "Проблеми в стаята (A12)", parts: ["Hier {ist} Herr Klein, Zimmer 210.", "Ich {habe} mehrere Probleme.", "Die Dusche {ist} kaputt, es {gibt} keine Handtücher und der Fernseher {geht} nicht.", "Das {kann} doch nicht sein! Wir {bringen} das sofort in Ordnung."] },
  { title: "Какво има в стаята (Akkusativ)", parts: ["Das Zimmer hat {einen} Fernseher, {eine} Minibar und {ein} Bad.", "Es gibt aber {keinen} Schreibtisch und {keine} Handtücher.", "Ich brauche unbedingt {einen} Wecker."] },
  { title: "В музея (A20–A22)", parts: ["Das Museum {ist} täglich von neun bis siebzehn Uhr geöffnet.", "Montags {haben} wir geschlossen.", "Eine Tageskarte {kostet} sieben Euro.", "Im Museum {kann} man alte Schiffe und Roboter {sehen}."] },
  { title: "Пътуване (разделими глаголи)", parts: ["Morgen {fahre} ich nach München.", "Der Zug {fährt} um acht Uhr {ab} und {kommt} um zwölf Uhr {an}.", "Meine Schwester {fährt} auch {mit}.", "Am Abend {sehen} wir {fern}."] },
  { title: "Моят град (A18)", parts: ["In meiner Stadt {gibt} es ein Rathaus.", "Dort {regiert} der Bürgermeister.", "Im Supermarkt {kann} man Lebensmittel {kaufen}.", "In der Bank {hebt} man Geld {ab}."] },
  { title: "Прилагателни (A16, A17)", parts: ["Ich brauche einen {neuen} Fernseher.", "Das ist ein {schönes} Zimmer.", "Die {alte} Lampe ist kaputt.", "Wir möchten eine {große} Wohnung.", "Der {teure} Stuhl ist bequem."] },
];
let bankIdx = 0;
function genBank() {
  const t = BANK_TEXTS[bankIdx++ % BANK_TEXTS.length];
  const blanks = [], sentences = [];
  t.parts.forEach((p) => { sentences.push(p.replace(/[{}]/g, "")); (p.match(/\{([^}]+)\}/g) || []).forEach((m) => blanks.push(m.slice(1, -1))); });
  return { kind: "bank", task: `Попълни текста: <b>${esc(t.title)}</b>`, parts: t.parts, blanks, bank: shuffle(blanks), sentences, answer: blanks.join(" · "), say: sentences.join(" "),
    explain: "Цъкни всяка дума в текста отгоре за „Защо?“ — защо е тази форма, защо е на това място." };
}
DIALOGS.push(
  { title: "На рецепцията", lines: [["Gast", "Guten Abend! Haben Sie noch ein Zimmer frei?"], ["Rezeption", "Grüß Gott! Möchten Sie ein Einzelzimmer oder ein Doppelzimmer?"], ["Gast", "Ein Einzelzimmer, bitte. Für drei Nächte."],
    ["Rezeption", "Das Zimmer kostet siebzig Euro pro Nacht. Das Frühstück kostet zehn Euro extra."], ["Gast", "Hat das Zimmer einen Fernseher?"], ["Rezeption", "Ja, alle Zimmer haben einen Fernseher und eine Minibar."], ["Gast", "Gut, ich nehme das Zimmer. Ich zahle bar."]],
    qs: [["Der Gast möchte ein Doppelzimmer.", false, 2], ["Er bleibt drei Nächte.", true, 2], ["Das Frühstück ist im Preis.", false, 3], ["Das Zimmer hat einen Fernseher.", true, 5], ["Der Gast zahlt mit Kreditkarte.", false, 6]] },
  { title: "Оплакване", lines: [["Gast", "Hallo, ist dort die Rezeption?"], ["Rezeption", "Ja. Sie wünschen?"], ["Gast", "Hier ist Frau Berg, Zimmer 112. Ich habe mehrere Probleme."], ["Gast", "Die Lampe ist kaputt und es gibt kein Toilettenpapier. Außerdem ist das Bett zu hart."],
    ["Rezeption", "Das kann doch nicht sein! Ich komme sofort."], ["Rezeption", "Wir bringen das gleich in Ordnung."]],
    qs: [["Frau Berg hat nur ein Problem.", false, 2], ["Die Lampe funktioniert nicht.", true, 3], ["Es gibt kein Toilettenpapier.", true, 3], ["Das Bett ist zu weich.", false, 3], ["Die Rezeptionistin kommt sofort.", true, 4]] },
  { title: "Кое музей?", lines: [["Anna", "Was machen wir am Samstag?"], ["Paul", "Wir können das Deutsche Museum besuchen. Es ist täglich von neun bis siebzehn Uhr geöffnet."], ["Anna", "Was kostet der Eintritt?"], ["Paul", "Eine Tageskarte kostet sieben Euro fünfzig."],
    ["Anna", "Und danach machen wir einen Spaziergang im Englischen Garten."], ["Paul", "Gute Idee! Dort ist der Eintritt frei und wir können im Biergarten etwas trinken."]],
    qs: [["Das Museum ist montags geschlossen.", false, 1], ["Das Museum öffnet um neun Uhr.", true, 1], ["Die Tageskarte kostet siebzehn Euro.", false, 3], ["Im Englischen Garten kostet der Eintritt nichts.", true, 5]] },
);
EX_TYPES.push(
  { k: "adjend", skill: "Граматика", ic: "🧱", t: "Прилагателни: eine alte Lampe", d: "Окончанията -e, -er, -es, -en (A16, A17)", gen: genAdjEnd },
  { k: "gibt", skill: "Граматика", ic: "🏨", t: "es gibt + Akkusativ · im / in der", d: "Im Zimmer gibt es einen Fernseher (A2, A11)", gen: genGibt },
  { k: "eindef", skill: "Граматика", ic: "1️⃣", t: "ein → der (после)", d: "Първо споменаване, после познато (A10)", gen: genEinDer },
  { k: "dimin", skill: "Граматика", ic: "🐭", t: "Умалителни -chen, -lein", d: "Винаги das: das Händchen", gen: genDimin },
  { k: "umzu", skill: "Граматика", ic: "🎯", t: "um / statt / ohne … zu", d: "за да, вместо да, без да", gen: genUmZu },
  { k: "trennbar", skill: "Глаголи и словоред", ic: "✂️", t: "Разделими глаголи: подреди", d: "Der Zug kommt um 10 Uhr an.", gen: genTrennbar },
  { k: "fragen", skill: "Глаголи и словоред", ic: "❔", t: "Formulieren Sie Fragen", d: "haben – du – Fernseher → Hast du einen Fernseher? (A3)", gen: genFragen },
  { k: "bank", skill: "Думи и употреба", ic: "📝", t: "Попълни текста (банка с думи)", d: "Като A8: избираш думите и попълваш текст", gen: genBank },
  { k: "pick", skill: "Думи и употреба", ic: "👆", t: "Избери думата", d: "Думи в изречения от всички уроци", gen: genPick },
  { k: "kann", skill: "Думи и употреба", ic: "🚿", t: "Ich kann nicht …", d: "Die Dusche ist kaputt → Ich kann nicht duschen (A15)", gen: genKannNicht },
  { k: "stadt", skill: "Думи и употреба", ic: "🏙", t: "Какво има в града?", d: "Hier kann man Geld abheben → die Bank (A18)", gen: genStadt },
  { k: "zeit", skill: "Четене и слушане", ic: "🕘", t: "Работно време", d: "um, von … bis, montags (A20–A22)", gen: genZeit },
  { k: "phon", skill: "Четене и слушане", ic: "👂", t: "ö/e и ü/ie на слух", d: "Чуй и избери буквата (A14, A19)", gen: genPhon },
);

// ── сесия
let exSess = null;
function startEx(k, opts = {}) {
  let qs;
  if (k === "mix") qs = [...Array(15)].map(() => rnd(EX_TYPES.filter((t) => t.gen)).gen());
  else if (k === "dialog") { const dlg = DIALOGS[dialogIdx++ % DIALOGS.length]; qs = dlg.qs.map((_, i) => genDialogQ(dlg, i)); }
  else if (k === "word") qs = genWordTraining(opts.item);
  else if (k === "weak") {
    const weak = shuffle(ITEMS.filter((i) => S.srs[i.id] && box(i) <= 1)).slice(0, 3);
    if (!weak.length) { toast("Нямаш „слаби“ думи — браво!"); return; }
    qs = weak.flatMap((it) => shuffle(genWordTraining(it)).slice(0, 4));
  } else { const t = EX_TYPES.find((x) => x.k === k); qs = [...Array(k === "bank" ? 4 : 10)].map(() => t.gen()); }
  const t = EX_TYPES.find((x) => x.k === k);
  exSess = { k, title: k === "word" ? `Тренирай: ${opts.item.de}` : k === "mix" ? "Микс от всичко" : k === "weak" ? "Слабите думи" : t.t, qs, i: 0, score: 0, wrong: [], opts };
  if (S.tab !== "ex") { S.tab = "ex"; store.set("tab", "ex"); renderNav(); renderSub(); }
  keyHandler = null; view.onclick = null; activeQuiz = null;
  drawEx();
}
function drawEx() {
  const s = exSess;
  if (s.i >= s.qs.length) return exDone();
  const q = s.qs[s.i];
  let answered = false;
  const next = () => { s.i++; drawEx(); window.scrollTo(0, 0); };
  let body = "";
  if (q.kind === "mc") body = `<div class="opts">${q.options.map((o, n) => `<button class="opt" data-n="${n}"><kbd>${n + 1}</kbd><span>${esc(o)}</span></button>`).join("")}</div>`;
  else if (q.kind === "type") body = `<input class="answer" id="exa" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(q.hint || "напиши тук…")}">
    <div class="uml">${["ä", "ö", "ü", "ß"].map((c) => `<button data-c="${c}" tabindex="-1">${c}</button>`).join("")}</div>`;
  else if (q.kind === "bank") {
    let k = 0;
    body = `<div class="banktxt">${q.parts.map((p) => `<p>${esc(p).replace(/\{([^}]+)\}/g, () => `<button class="bk" data-b="${k++}">&nbsp;</button>`)}</p>`).join("")}</div><div class="opool" id="bp"></div>`;
  }
  else body = `<div class="oline" id="ol"></div><div class="opool" id="op"></div>`;
  view.innerHTML = `<div class="stage exstage">
    <div class="pinfo"><span><button class="link" id="exback">← ${esc(s.title)}</button></span><span>${s.i + 1} / ${s.qs.length} · ✓ ${s.score}</span></div>
    <div class="prog"><i style="width:${(s.i / s.qs.length) * 100}%"></i></div>
    <div class="card excard" style="cursor:default"><div class="extask">${q.task}</div>${q.prompt}</div>
    ${body}<div class="exfb" id="fb"></div>
    <div class="keys">${q.kind === "mc" ? "1–" + q.options.length + " – отговор · " : q.kind === "order" ? "цъкни думите поред · Backspace – махни · " : q.kind === "bank" ? "цъкни празното място, после думата · " : ""}Enter – напред · Esc – назад</div></div>`;
  $("#exback").onclick = renderExercises;
  if (q.autoSay) setTimeout(() => speak(q.autoSay, { auto: true }), 150);
  const pd = view.querySelector("[data-play-dlg]");
  if (pd) pd.onclick = (e) => { e.stopPropagation(); playSequence(q.dlg.lines.map((l) => l[1]), null, 350); };

  const finish = (ok, given) => {
    answered = true;
    if (ok) s.score++; else s.wrong.push({ q, given });
    if (q.item) { if (ok) { if (box(q.item) <= 0) grade(q.item, 1); } else grade(q.item, 0); }
    const full = q.full ? sentHTML(q.full, q.bg || "", q.item || null).replace('<div class="sbg" title="Посочи или цъкни, за да видиш превода"></div>', "") : "";
    $("#fb").className = "exfb on " + (ok ? "ok" : "bad");
    $("#fb").innerHTML = `<div class="exhead">${ok ? "✓ Правилно!" : `✗ Не съвсем. Правилно е: <b>${esc(q.answer)}</b>`}</div>
      ${full}${full ? `<div class="xhint">👆 Цъкни всяка дума в изречението за „Защо?“</div>` : ""}<div class="exwhy"><b>${ok ? "Защо:" : "Защо е така:"}</b> ${q.explain}</div>
      ${q.item ? `<div class="exlinks">${openBtn(q.item)} <button class="link" data-train="${esc(q.item.id)}">🏋️ Тренирай думата</button></div>` : ""}
      <button class="btn primary" id="exnext" style="margin-top:10px;width:100%">Напред <kbd style="color:inherit">Enter</kbd></button>`;
    $("#exnext").onclick = next;
    if (q.say) speak(q.say, { auto: true });
  };
  if (q.kind === "mc") {
    const pick = (n) => {
      if (answered) return;
      const ok = q.options[n] === q.answer;
      view.querySelectorAll(".opt").forEach((b, k) => { if (q.options[k] === q.answer) b.classList.add("right"); else if (k === n) b.classList.add("wrong"); });
      finish(ok, q.options[n]);
    };
    view.querySelector(".opts").onclick = (e) => { const b = e.target.closest("[data-n]"); if (b) pick(+b.dataset.n); };
    keyHandler = (e) => {
      if (!answered && /^[1-9]$/.test(e.key) && +e.key <= q.options.length) pick(+e.key - 1);
      else if (e.key === "Enter" && answered) { e.preventDefault(); next(); }
      else if (e.key === "Escape") renderExercises();
    };
  } else if (q.kind === "type") {
    const inp = $("#exa"); inp.focus();
    view.querySelector(".uml").onclick = (e) => { const b = e.target.closest("[data-c]"); if (!b) return; const [a, z] = [inp.selectionStart, inp.selectionEnd]; inp.value = inp.value.slice(0, a) + b.dataset.c + inp.value.slice(z); inp.focus(); inp.setSelectionRange(a + 1, a + 1); };
    keyHandler = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (answered) return next();
        if (!inp.value.trim()) { if (q.autoSay) speak(q.autoSay, { auto: true }); return; }
        const ok = q.accept ? q.accept(inp.value) : sameDe(inp.value, q.answer);
        inp.classList.add(ok ? "right" : "wrong"); inp.readOnly = true;
        finish(ok, inp.value);
      } else if (e.key === "Escape") renderExercises();
    };
  } else if (q.kind === "bank") {
    const fill = q.blanks.map(() => null); let cur = 0; const pool = q.bank.map((t, i) => ({ t, i, used: false }));
    const draw = () => {
      view.querySelectorAll(".bk").forEach((b, k) => { b.textContent = fill[k] !== null ? pool[fill[k]].t : `${k + 1}`; b.classList.toggle("cur", k === cur && !answered); b.classList.toggle("filled", fill[k] !== null); });
      $("#bp").innerHTML = pool.map((c) => (c.used ? "" : `<button class="chipw" data-p="${c.i}">${esc(c.t)}</button>`)).join("");
    };
    draw();
    const check = () => {
      let ok = true;
      view.querySelectorAll(".bk").forEach((b, k) => { const good = pool[fill[k]].t === q.blanks[k]; if (!good) { ok = false; b.classList.add("wrong"); b.title = "правилно: " + q.blanks[k]; b.innerHTML = `<s>${esc(pool[fill[k]].t)}</s> ${esc(q.blanks[k])}`; } else b.classList.add("right"); });
      finish(ok, fill.map((f) => pool[f].t).join(" · "));
      $("#fb").insertAdjacentHTML("afterbegin", `<div class="banksent">${q.sentences.map((x) => sentHTML(x, "", null).replace('<div class="sbg" title="Посочи или цъкни, за да видиш превода"></div>', "")).join("")}</div>`);
    };
    view.querySelector(".exstage").addEventListener("click", (e) => {
      if (answered) return;
      const bk = e.target.closest(".bk"), ch = e.target.closest("[data-p]");
      if (bk) { const k = +bk.dataset.b; if (fill[k] !== null) { pool[fill[k]].used = false; fill[k] = null; } cur = k; draw(); return; }
      if (ch) {
        const pi = +ch.dataset.p; if (fill[cur] !== null) pool[fill[cur]].used = false;
        fill[cur] = pi; pool[pi].used = true;
        const nx = fill.findIndex((f, k) => f === null && k > cur); cur = nx >= 0 ? nx : fill.findIndex((f) => f === null);
        draw(); if (cur < 0) check();
      }
    });
    keyHandler = (e) => { if (e.key === "Enter" && answered) next(); else if (e.key === "Escape") renderExercises(); };
  } else {
    const placed = [], free = q.sh.map((t) => ({ t }));
    const draw = () => {
      $("#ol").innerHTML = placed.map((c, k) => `<button class="chipw" data-k="${k}">${esc(c.t)}</button>`).join("") || `<span class="meta">цъкни думите отдолу поред…</span>`;
      $("#op").innerHTML = free.map((c, k) => `<button class="chipw" data-f="${k}">${esc(c.t)}</button>`).join("");
    };
    draw();
    const check = () => { const ok = placed.map((c) => c.t).join(" ") === q.toks.join(" "); $("#ol").classList.add(ok ? "right" : "wrong"); finish(ok, placed.map((c) => c.t).join(" ")); };
    view.querySelector(".exstage").addEventListener("click", (e) => {
      if (answered) return;
      const b = e.target.closest(".chipw"); if (!b) return;
      if (b.dataset.f !== undefined) placed.push(free.splice(+b.dataset.f, 1)[0]); else free.push(placed.splice(+b.dataset.k, 1)[0]);
      draw(); if (!free.length) check();
    });
    keyHandler = (e) => {
      if (e.key === "Enter" && answered) next();
      else if (e.key === "Backspace" && !answered && placed.length) { free.push(placed.pop()); draw(); }
      else if (e.key === "Escape") renderExercises();
    };
  }
}
function exDone() {
  const s = exSess, pct = Math.round((s.score / s.qs.length) * 100);
  const best = store.get("exBest", {}); if (s.k !== "word" && (best[s.k] ?? -1) < pct) { best[s.k] = pct; store.set("exBest", best); }
  view.innerHTML = `<div class="stage"><div class="card done" style="cursor:default">
    <div class="score">${pct >= 90 ? "🏆" : pct >= 70 ? "💪" : "📚"} ${s.score}/${s.qs.length}</div><p class="meta">${esc(s.title)} · ${pct}%</p>
    ${s.wrong.length ? `<div class="exmist"><h3>Грешките ти — прочети защо</h3>${s.wrong.map(({ q, given }) => `<div class="exm">
      <div class="extask">${q.task}</div><div>${q.full ? esc(q.full) : esc(q.answer)}</div>
      <div class="muted">ти: <s>${esc(given || "—")}</s> → правилно: <b>${esc(q.answer)}</b></div><div class="exwhy">${q.explain}</div></div>`).join("")}</div>` : "<p>Без нито една грешка! 🎉</p>"}
    <div class="btns" style="grid-template-columns:1fr 1fr;width:100%"><button class="btn" id="exb">← Упражнения</button><button class="btn primary" id="exa2">${s.k === "word" ? "Пак" : "Още 10"} <kbd style="color:inherit">Enter</kbd></button></div>
  </div></div>`;
  $("#exb").onclick = renderExercises;
  const again = () => startEx(s.k, s.opts);
  $("#exa2").onclick = again;
  keyHandler = (e) => { if (e.key === "Enter") again(); if (e.key === "Escape") renderExercises(); };
}
let exFilter = "Всички";
function renderExercises() {
  exSess = null;
  const best = store.get("exBest", {});
  const skills = [...new Set(EX_TYPES.map((t) => t.skill))];
  view.innerHTML = `<h2>Упражнения</h2>
    <p class="hint">Вдъхновени от упражненията в учебника (Begegnungen A1, Kapitel 2), но изреченията се сглобяват наново всеки път — примерите не свършват. След всеки отговор има <b>обяснение защо</b>. Звукът се пуска след отговора.</p>
    <div class="modes" style="margin-top:8px">
      <button class="mode exhero" data-ex="mix"><span class="ic">🎲</span><b>Микс от всичко</b><span>15 разнообразни задачи</span></button>
      <button class="mode" data-ex="weak"><span class="ic">🎯</span><b>Слабите ми думи</b><span>Тренировка на думите, които бъркаш</span></button>
      <div class="mode exsearch"><span class="ic">🏋️</span><b>Тренирай конкретна дума</b><input class="search" id="exw" placeholder="напиши дума (немски или български)…" style="margin-top:6px"><div id="exwl"></div></div>
    </div>
    <div class="exfilter">${["Всички", ...skills].map((sk) => `<button class="chip ${exFilter === sk ? "on" : ""}" data-exf="${esc(sk)}">${esc(sk)}</button>`).join("")}</div>
    ${skills.filter((sk) => exFilter === "Всички" || exFilter === sk).map((sk) => `<h3>${esc(sk)}</h3><div class="modes" style="margin-top:0">${EX_TYPES.filter((t) => t.skill === sk).map((t) => `<button class="mode" data-ex="${t.k}"><span class="ic">${t.ic}</span><b>${esc(t.t)}</b><span>${esc(t.d)}</span>${best[t.k] !== undefined ? `<em class="exbest">най-добро: ${best[t.k]}%</em>` : ""}</button>`).join("")}</div>`).join("")}
    <p class="keys" style="margin-top:20px">💡 Упражненията следват избраните уроци горе (освен ако думите са твърде малко).</p>`;
  view.onclick = (e) => { const f = e.target.closest("[data-exf]"); if (f) { exFilter = f.dataset.exf; renderExercises(); return; } const b = e.target.closest("[data-ex]"); if (b) startEx(b.dataset.ex); };
  const inp = $("#exw");
  inp.oninput = () => {
    const t = canon(inp.value);
    const res = t.length < 2 ? [] : ITEMS.filter((i) => canon(deFull(i) + " " + i.bg).includes(t)).slice(0, 8);
    $("#exwl").innerHTML = res.map((i) => `<button class="pill" data-train="${esc(i.id)}" style="margin:4px 4px 0 0">${deHTML(i)} — ${esc(i.bg)}</button>`).join("");
  };
  keyHandler = (e) => { if (e.key === "Enter" && document.activeElement !== inp) startEx("mix"); };
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-train]"); if (!t) return;
  e.stopPropagation();
  const it = ITEM_BY_ID.get(t.dataset.train); if (!it) return;
  closeSheet(true);
  startEx("word", { item: it });
}, true);
