// ───────── СТРОГО ИЗПИТВАНЕ + ДНЕШНО ОБУЧЕНИЕ ─────────
// Всеки въпрос носи: mode (rec | recall | use — колко силно доказва знание), exk (вид упражнение), errCat (категория на грешката).
// Проверката на писане минава през CK.checkDe (check.js) — приема друг правилен словоред и малки правописни грешки, разпознава вида на грешката.

// всяко упражнение знае своя вид (за статистиката по теми)
// без повторения: помни последните ~600 въпроса (и между сесиите) и генерира нов, ако този вече е бил
const QSEEN = (() => { let a; try { a = JSON.parse(localStorage.getItem("dl:qseen") || "[]"); } catch (e) { a = []; } return { set: new Set(a), list: a }; })();
const qKey = (q) => (q.exk || "") + "|" + String(q.full || (q.sentences && q.sentences.join(" ")) || q.answer || "").slice(0, 160) + "|" + String(q.prompt || q.task || "").replace(/<[^>]+>/g, "").slice(0, 80);
function qRemember(q) { const k = qKey(q); if (QSEEN.set.has(k)) return; QSEEN.set.add(k); QSEEN.list.push(k); if (QSEEN.list.length > 600) QSEEN.set.delete(QSEEN.list.shift()); try { localStorage.setItem("dl:qseen", JSON.stringify(QSEEN.list)); } catch (e) {} }
const sessSeen = new Set(); // в рамките на една сесия — никога същия въпрос
function wrapGens() { EX_TYPES.forEach((t) => { const g = t.gen; if (g && !g._w) { t.gen = (...a) => {
  let q, best = null;
  for (let n = 0; n < 10; n++) { q = g(...a); if (!q) return q; if (!q.exk) q.exk = t.k; const k = qKey(q); if (!sessSeen.has(k) && !QSEEN.set.has(k)) break; if (!best && !sessSeen.has(k)) best = q; q = null; }
  q = q || best || g(...a); if (q) { if (!q.exk) q.exk = t.k; sessSeen.add(qKey(q)); qRemember(q); } return q; }; t.gen._w = 1; } }); }
wrapGens();

const LEARN_TYPES = ["noun", "verb", "adj", "adv", "word", "phrase", "q"];
const isLearned = (it) => !!((typeof MEM !== "undefined" && MEM.get(it.id) && MEM.get(it.id).last) || (S.srs[it.id]));
const learnedItems = () => ITEMS.filter((it) => LEARN_TYPES.includes(it.type) && it.bg && isLearned(it) && !/\s–\s/.test(it.de));
const firstBg = (bg) => String(bg).split(/[;(]/)[0].trim();
const exOk = (de) => de && de.split(" ").length <= 10 && !/[«»]/.test(de);
const shortExplainNoun = (it) => `${deHTML(it)}${it.pl ? ` · мн.ч. die ${esc(it.pl)}` : ""}. ${typeof genderHint === "function" ? genderHint(it) : ""}`;

// Тип 1: активно припомняне (бг → нем., членът е задължителен)
function qRecall(it) {
  const noun = it.type === "noun" && ["der", "die", "das", "pl"].includes(it.art), ans = deFull(it);
  return { kind: "type", mode: "recall", exk: "t1", task: noun ? "Напиши на немски — <b>с члена</b>" : "Напиши на немски", prompt: `<div class="exw" style="font-size:24px">${esc(it.bg)}</div>${it.type === "verb" ? `<div class="meta">(инфинитив)</div>` : ""}`,
    answer: ans, noun, hint: noun ? "der/die/das …" : "…", item: it, say: ans, check: (v) => CK.checkDe(v, ans, { noun }),
    explain: noun ? shortExplainNoun(it) : `${deHTML(it)} = ${esc(it.bg)}${it.note ? `<br>💡 ${esc(it.note)}` : ""}` };
}
// множествено число (писане)
function qPlural(it) {
  return { kind: "type", mode: "recall", exk: "t1pl", errCat: "plural", task: "Множествено число", prompt: `<div class="exw">${deHTML(it)} → die ___</div><div class="meta">${esc(it.bg)}</div>`, answer: it.pl, item: it, say: "die " + it.pl,
    check: (v) => { const r = CK.checkDe(v.replace(/^die\s+/i, ""), it.pl); if (!r.ok) r.cat = "plural"; return r; }, explain: `die <b>${esc(it.pl)}</b> — ${typeof pluralRule === "function" ? pluralRule(it.de, it.pl) : ""}.` };
}
// Тип 2: превод нем. → бг (проверява разбирането)
function qDeBg(it) {
  return { kind: "type", mode: "rec", exk: "t2", task: "Преведи на български", prompt: `<div class="exw" style="font-size:24px">${sayBtn(deFull(it))} ${deHTML(it)}</div>`, autoSay: deFull(it), answer: it.bg, hint: "на български…", item: it, say: deFull(it), bgAns: true,
    check: (v) => CK.checkBg(v, it.bg), explain: `${deHTML(it)} = <b>${esc(it.bg)}</b>` };
}
// Тип 3: попълни липсващата дума (пише сам, в изречение)
function qCloze(it) {
  const forms = itemForms(it), exs = shuffle(examplesFor(it).filter(([de]) => exOk(de)));
  for (const [de, bg] of exs) {
    const w = (de.match(WORD_RE) || []).find((x) => forms.has(x.toLowerCase()) && x.length > 2); if (!w) continue;
    const shown = de.replace(new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${w}(?=[^A-Za-zÄÖÜäöüß]|$)`), `$1___`);
    if (shown === de) continue;
    return { kind: "type", mode: "use", exk: "t3", task: "Попълни липсващата дума", prompt: `<div class="exs">${esc(shown)}</div><div class="meta">${esc(bg)}</div>`, answer: w, item: it, say: de, full: de, bg,
      check: (v) => CK.checkDe(v, w), explain: `${deHTML(it)} = ${esc(it.bg)}. В изречението формата е <b>${esc(w)}</b>.` };
  }
  return null;
}
// Тип 8: превод на цяло изречение бг → нем.
function qTrans(it) {
  const exs = shuffle(examplesFor(it).filter(([de, bg]) => exOk(de) && bg && de.split(" ").length >= 3));
  if (!exs.length) return null;
  const [de, bg] = exs[0];
  return { kind: "type", mode: "use", exk: "t8", task: "Преведи на немски", prompt: `<div class="exw" style="font-size:20px">${esc(bg)}</div><div class="meta">ключова дума: ${esc(deFull(it))}</div>`, answer: de, item: it, say: de, full: de, bg, long: true, override: true,
    check: (v) => CK.checkDe(v, de), explain: "Цъкни думите в изречението за „Защо?“ — род, падеж, място на глагола." };
}
// Тип 5: преобразуване Präsens → Perfekt / Präteritum (пише цялото изречение)
function qTransform(to) {
  const z = rnd(Z3), r = z3(z), [, , inf] = z; to = to || rnd(["perf", "perf", "praet"]);
  const v = ITEMS.find((x) => x.type === "verb" && x.de === inf), ans = r[to];
  return { kind: "type", mode: "use", exk: "t5", task: `Кажи го в <b>${to === "perf" ? "Perfekt" : "Präteritum"}</b>`, prompt: `<div class="exs">${esc(r.pres)}</div><div class="meta">${esc(z[4])} → ${esc(z[5])}</div>`, answer: ans, item: v, say: ans, full: ans, bg: z[5], long: true,
    check: (x) => CK.checkDe(x, ans), explain: to === "perf" ? `<b>${esc(r.aux)}</b> на 2-ро място + <b>${esc(r.part)}</b> в края. ${PERF_AUX[V3[inf][1]]}.` : `Präteritum: един глагол — <b>${esc(r.tv)}</b>. ${praetWhy(inf)}` };
}
// Тип 7: открий и поправи грешката (пише поправеното изречение)
function qFix() {
  const z = rnd(Z3), r = z3(z), [s0, i, inf] = z, other = V3[inf][1] === "h" ? "s" : "h", v = ITEMS.find((x) => x.type === "verb" && x.de === inf);
  const bads = [[r.perf.replace(new RegExp(`(^|\\s)${r.aux}(\\s)`), `$1${AUXF[other][i]}$2`), r.perf, "hs"], [r.praet.replace(r.tv, praetF(inf, (i + 1) % 6).split(" ")[0]), r.praet, "conj"],
    [r.pres.replace(r.pv, presF(inf, (i + 2) % 6).split(" ")[0]), r.pres, "conj"]];
  if (z[3]) bads.push([join3([s0, r.aux, r.part, z[3]]) + ".", r.perf, "order"]);
  const sig = z3(z, "Gestern"); if (!PRON3.has(s0) || true) bads.push([`Gestern ${s0 === "Ich" ? "ich" : PRON3.has(s0) ? s0.toLowerCase() : s0} ${r.tv} ${join3([z[3], r.sep])}.`.replace(/\s+\./, "."), sig.praet, "verbpos"]);
  const [bad, good, cat] = rnd(bads.filter(([b, g]) => b !== g));
  return { kind: "type", mode: "use", exk: "t7", errCat: cat, task: "Има грешка. Напиши изречението <b>правилно</b>", prompt: `<div class="exs" style="text-decoration:underline wavy var(--bad) 1px">${esc(bad)}</div>`, answer: good, item: v, say: good, full: good, long: true,
    check: (x) => { const res = CK.checkDe(x, good); if (!res.ok && CK.toks(x).join(" ").toLowerCase() === CK.toks(bad).join(" ").toLowerCase()) res.msg = "Това е същото грешно изречение — потърси грешката."; return res; },
    explain: { hs: "Грешката е в помощния глагол: " + PERF_AUX[V3[inf][1]] + ".", conj: "Грешката е в окончанието на глагола — провери кое лице е подлогът.", order: "Partizip II отива в самия край.", verbpos: "След Gestern глаголът е на 2-ро място, подлогът идва след него." }[cat] };
}
// Тип 4: съставяне на изречение (свободно, с локални проверки + самооценка)
function qBuild(it) {
  const ex = examplesFor(it)[0];
  return { kind: "write", mode: "use", exk: "t4", task: "Състави свое изречение с думата", prompt: `<div class="exw">${deHTML(it)} <span class="muted">= ${esc(it.bg)}</span></div>`, item: it, answer: ex ? ex[0] : deFull(it), model: ex, rows: 2,
    analyze: (v) => analyzeWriting(v, { must: it }) };
}
// Тип 9: свободно писане
const WRITE_TASKS = [
  { id: "gestern", min: 14, t: "Опиши вчерашния си ден (Perfekt): кога стана, какво прави, кога си легна. 5–7 изречения.", need: "perf",
    model: "Gestern bin ich um sieben Uhr aufgestanden. Ich habe schnell gefrühstückt. Dann bin ich mit dem Bus zur Arbeit gefahren. Ich habe viele E-Mails geschrieben. Am Abend habe ich gekocht und ferngesehen. Um elf Uhr bin ich ins Bett gegangen." },
  { id: "arbeitstag", min: 14, t: "Разкажи за работния си ден в сегашно време: какво трябва да правиш (müssen), какво правиш на компютъра. 5 изречения.", need: "pres",
    model: "Ich stehe um sieben Uhr auf. Um neun Uhr fange ich mit der Arbeit an. Ich muss viele E-Mails beantworten. Ich schreibe Texte und speichere sie. Um 18 Uhr habe ich Feierabend." },
  { id: "absage", min: 14, t: "Напиши имейл до г-жа Кьорнер: отменяш срещата на 13 април и предлагаш нова дата (20 април).", need: "mail",
    model: "Liebe Frau Körner, ich muss den Termin am 13. April leider absagen. Herr Krause muss Gäste vom Flughafen abholen. Haben Sie am 20. April Zeit? Mit besten Grüßen" },
  { id: "schlecht", min: 15, t: "Лош ден: опиши какво се обърка вчера (war, hatte + Perfekt). 5 изречения.", need: "past",
    model: "Gestern war ein schrecklicher Tag. Ich hatte kein Benzin. Ich bin zur Tankstelle gelaufen. Der Computer ist kaputt gegangen. Ich habe den Text nicht gespeichert." },
  { id: "termin", min: 14, t: "Обаждаш се на сервиз: принтерът ти е счупен. Уговори час за ремонт (Telefon). 4–6 реплики.", need: "pres",
    model: "Guten Tag, hier ist Anna Petrova. Ich habe ein Problem: Mein Drucker funktioniert nicht. Ich möchte gern einen Termin für die Reparatur vereinbaren. Geht es am Dienstag um zehn Uhr? Gut, dann erwarte ich den Monteur am Dienstag. Auf Wiederhören." },
  { id: "restaurant", min: 13, t: "Опиши последното си посещение в ресторант: какво поръча, как беше. 4–6 изречения.", need: "past",
    model: "Am Samstag war ich im Restaurant. Ich habe eine Suppe und Fisch bestellt. Der Fisch hat mir gut geschmeckt. Die Rechnung war nicht teuer." },
];
function qWrite(task) {
  const lastL = Math.max(...LESSONS.map((l) => l.id));
  task = task || rnd(WRITE_TASKS.filter((w) => w.min <= lastL));
  return { kind: "write", mode: "use", exk: "t9", task: "Свободно писане", prompt: `<div class="exw" style="font-size:17px;line-height:1.5">${esc(task.t)}</div>`, answer: task.model, model: [task.model, ""], rows: 7, wtask: task.id,
    analyze: (v) => analyzeWriting(v, { need: task.need }) };
}
// локален анализ на написан текст: дава конкретни забележки, без да претендира за пълна граматическа присъда
function analyzeWriting(text, o = {}) {
  const sents = String(text).replace(/\s+/g, " ").trim().split(/(?<=[^\d\s][.!?])\s+|\n/).filter((s) => s.length > 1);
  const FRAME = /^(Liebe|Lieber|Sehr|Mit|Viele|Herzliche|Beste|Liebe|Hallo|Auf)\b/; // обръщение/поздрав в писмо
  const notes = [], good = []; let bad = 0, known = 0, total = 0;
  const KNOWN = (w) => { const l = w.toLowerCase(); return ITEM_BY_FORM.has(l) || (typeof LEX !== "undefined" && LEX[l]) || (typeof PRAETF !== "undefined" && PRAETF[l]) || (typeof PERF !== "undefined" && PERF[w]) || /^\d/.test(w) || /^[A-ZÄÖÜ]/.test(w) && w.length > 2 || ["ich", "du", "er", "sie", "es", "wir", "ihr", "und", "aber", "oder", "nicht", "kein", "keine", "mein", "meine", "dann", "danach", "zuerst", "uhr"].includes(l); };
  sents.forEach((s, si) => {
    const T = (s.match(/[A-Za-zÄÖÜäöüß]+|\d+/g) || []); if (!T.length) return;
    let issue = null;
    if (FRAME.test(s) && (T.length <= 5 || /,$/.test(s))) { good.push(si + 1); return; }
    if (!/[.!?]$/.test(s)) issue = "липсва точка/въпросителна в края";
    if (/^[a-zäöü]/.test(s)) issue = "изречението започва с малка буква";
    T.forEach((w, k) => { if (w.length > 3 && (/^[a-zäöüß]/.test(w) || k > 0)) { total++; const l = w.toLowerCase(); if (/^[a-zäöüß]/.test(w) ? KNOWN(w) : ITEM_BY_FORM.has(l) || (typeof LEX !== "undefined" && LEX[l])) known++; else notes.push(`„${w}“ — непозната за приложението дума: провери правописа`); } });
    // нещо отпред + подлог-местоимение + глагол → глаголът не е 2-ри (Am Abend ich habe …)
    const PRN = /^(ich|du|er|sie|es|wir|ihr)$/i, FIN = /^(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid|war|warst|waren|hatte|hattest|hatten|muss|musst|müssen|kann|kannst|können|will|möchte|möchten)$/i;
    for (let k = 2; k < T.length; k++) if (FIN.test(T[k]) && PRN.test(T[k - 1]) && !/[,]/.test(s.split(T[k - 1])[0]) && !/^(und|aber|oder|denn)$/i.test(T[0])) { issue = issue || `спрегнатият глагол <b>${T[k]}</b> трябва да е на 2-ро място: ${T.slice(0, k - 1).join(" ")} <b>${T[k]}</b> ${T[k - 1]} …`; break; }
    // Perfekt: haben/sein според глагола
    const last = T[T.length - 1], P = typeof PERF !== "undefined" ? PERF[last] : null;
    const auxI = T.findIndex((w) => /^(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)$/i.test(w));
    if (P && auxI >= 0) { const isS = /^(bin|bist|ist|sind|seid)$/i.test(T[auxI]); if (isS !== (P[1] === "s")) issue = `<b>${last}</b> се образува с <b>${P[1] === "s" ? "sein" : "haben"}</b>, не с „${T[auxI]}“`; }
    // партицип не в края
    T.forEach((w, k) => { const nx = T[k + 1]; if (k < T.length - 1 && PERF[w] && auxI >= 0 && auxI < k && !issue && !/^(und|oder|aber)$/i.test(nx) && !PERF[T[T.length - 1]]) issue = `Partizip II <b>${w}</b> трябва да е в края на изречението`; });
    // място на спрегнатия глагол (за съобщителни изречения)
    if (!issue && typeof XP !== "undefined" && !/\?$/.test(s) && T.length >= 3) {
      try { const a = XP.analyze(s); const vi = a.roles.indexOf("v"); if (vi < 0 && !s.includes(",") && !FRAME.test(s) && T.length > 3) issue = "не намирам спрегнат глагол — провери изречението";
        else if (vi > 3) issue = "спрегнатият глагол трябва да е на 2-ро място"; } catch (e) {}
    }
    if (issue) { bad++; notes.unshift(`Изречение ${si + 1}: ${issue}`); } else good.push(si + 1);
  });
  if (o.must) { const f = itemForms(o.must); if (!(text.match(WORD_RE) || []).some((w) => f.has(w.toLowerCase()))) notes.unshift(`Не използва думата <b>${esc(deFull(o.must))}</b>`), bad++; }
  if (o.need === "perf" && !/\b(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\b[^.]*\b(ge\w+|\w+iert|\w+(ge)\w+)\b/i.test(text)) notes.push("Задачата е в Perfekt — използвай haben/sein + Partizip II");
  if (o.need === "mail" && !/^(Liebe|Lieber|Sehr geehrte)/.test(text.trim())) notes.push("Имейлът започва с обръщение: Liebe Frau …, / Sehr geehrte Frau …,");
  if (o.need === "mail" && !/(Grüßen|Grüße)/.test(text)) notes.push("В края — поздрав: Mit besten Grüßen / Viele Grüße");
  const n = Math.max(1, sents.length), score = Math.round(((n - Math.min(bad, n)) / n) * 100);
  return { sents: n, bad, score, notes: [...new Set(notes)].slice(0, 8), known, total };
}
// Тип 6: граматика — от упражненията на минатите уроци
function qGrammar() {
  const lastSeen = LESSONS.filter((l) => ITEMS.some((i) => inLesson(i, l.id) && isLearned(i))).map((l) => l.id);
  const ks = [...new Set(lastSeen.flatMap((id) => (UNIT_MAP[id] || {}).ex || []))].filter((k) => exByK(k));
  for (let n = 0; n < 6; n++) { const k = rnd(ks.length ? ks : ["perfhs"]); try { const q = exByK(k).gen(); if (q && q.kind !== "intro" && q.kind !== "bank") { q.mode = q.mode || (q.kind === "type" ? "use" : "rec"); return q; } } catch (e) {} }
  return null;
}

// ── Kapitel 5 (Begegnungen A1): допълнителни упражнения от Teil A/C/D ──
// C13: темпорални предлози
const TEMP = [["Marcus steht ___ 8.00 Uhr auf.", "um", "час → um"], ["Der Unterricht ist ___ 18.30 bis 21.00 Uhr.", "von", "от … до → von … bis"], ["Haben Sie ___ Freitag Zeit?", "am", "ден → am"],
  ["Ich habe ___ 13.00 Uhr einen Termin.", "um", "час → um"], ["Das Flugzeug landet kurz ___ 16.00 Uhr. (15.55)", "vor", "преди → vor"], ["Die Besprechung geht ___ 15.00 Uhr. (до)", "bis", "до → bis"],
  ["Wir besuchen ___ Sonntag das Museum.", "am", "ден → am"], ["Er war schon um 8.55 Uhr, also fünf Minuten ___ 9.00 Uhr im Büro.", "vor", "8.55 = 5 минути преди 9 → vor"],
  ["Der Monteur kommt ___ 3. März um 15.00 Uhr.", "am", "дата → am"], ["Es ist 19.05, also fünf Minuten ___ 19.00 Uhr.", "nach", "след → nach"], ["___ Montag habe ich Urlaub. (от понеделник нататък)", "Ab", "от … нататък → ab"],
  ["Ich arbeite ___ neun ___ fünf Uhr.", "von|bis", "от … до → von … bis"], ["___ Juli fahren wir nach Italien.", "Im", "месец → im"], ["___ Abend sehe ich fern.", "Am", "част от деня → am (но: in der Nacht)"],
  ["___ Wochenende besuche ich meine Eltern.", "Am", "am Wochenende"], ["Der Film beginnt ___ 20.15 Uhr.", "um", "час → um"], ["___ 2020 wohne ich in Sofia.", "Seit", "от (досега) → seit"]];
function genTemp() {
  const [s, a, why] = rnd(TEMP), parts = a.split("|"); let full = s; parts.forEach((p) => (full = full.replace("___", p)));
  full = full.replace(/\s*\([^)]*\)/, "");
  const opts = shuffle([...new Set(["um", "am", "im", "von", "bis", "vor", "nach", "ab", "seit"].filter((x) => !parts.map((p) => p.toLowerCase()).includes(x)))]).slice(0, 3);
  if (parts.length > 1) return { kind: "type", mode: "use", errCat: "prep", task: "Попълни двата предлога (раздели с интервал)", prompt: `<div class="exs">${esc(s)}</div>`, answer: parts.join(" "), say: full, full, check: (v) => CK.checkDe(v, parts.join(" ")), explain: `${why}.` };
  const ans = parts[0], low = ans.toLowerCase(), cap0 = /^___/.test(s);
  return { kind: "mc", errCat: "prep", task: "Wann? Кой предлог?", prompt: `<div class="exs">${esc(s)}</div>`, options: shuffle([ans, ...opts.map((o) => (cap0 ? cap(o) : o))]), answer: ans, say: full, full, keys: true,
    explain: `${why}.<br><b>um</b> + час · <b>am</b> + ден/дата/част от деня · <b>im</b> + месец/сезон · <b>von … bis</b> · <b>vor/nach</b> + час · <b>ab</b> = от … нататък.${low === "seit" ? " <b>seit</b> = от някога досега (още продължава)." : ""}` };
}
// A26/A27: дати и поредни числа
const ORD = ["", "erste", "zweite", "dritte", "vierte", "fünfte", "sechste", "siebte", "achte", "neunte", "zehnte", "elfte", "zwölfte", "dreizehnte", "vierzehnte", "fünfzehnte", "sechzehnte", "siebzehnte", "achtzehnte", "neunzehnte", "zwanzigste",
  "einundzwanzigste", "zweiundzwanzigste", "dreiundzwanzigste", "vierundzwanzigste", "fünfundzwanzigste", "sechsundzwanzigste", "siebenundzwanzigste", "achtundzwanzigste", "neunundzwanzigste", "dreißigste", "einunddreißigste"];
const MON = ["", "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
function genDatum() {
  const d = 1 + ((Math.random() * 28) | 0), m = 1 + ((Math.random() * 12) | 0), am = Math.random() < 0.5;
  const ans = am ? `am ${ORD[d]}n ${ORD[m]}n` : `der ${ORD[d]} ${ORD[m]}`, shown = am ? `Ich habe am ${d}.${m}. Zeit.` : `Heute ist der ${d}.${m}.`;
  const full = am ? `Ich habe am ${ORD[d]}n ${cap(ORD[m])}n Zeit.` : `Heute ist der ${ORD[d]} ${cap(ORD[m])}.`;
  const why = `Поредно число: 1–19 → <b>-te</b> (erste, dritte, siebte — неправилни!), от 20 → <b>-ste</b> (zwanzigste). ${am ? "След <b>am</b> (an dem = Dativ) окончанието е <b>-ten</b>: am neunten Vierten." : "Heute ist <b>der</b> … (Nominativ) → -te."} Месецът може и с име: ${am ? "am " + ORD[d] + "n " + MON[m] : "der " + ORD[d] + " " + MON[m]}.`;
  if (Math.random() < 0.5) return { kind: "type", mode: "use", errCat: "word", task: "Кажи датата с думи", prompt: `<div class="exs">${esc(shown)}</div><div class="meta">напиши само: ${am ? "am … …" : "der … …"}</div>`, answer: ans, say: full, full,
    check: (v) => CK.checkDe(v, ans, { alts: [am ? `am ${ORD[d]}n ${MON[m]}` : `der ${ORD[d]} ${MON[m]}`] }), explain: why };
  const wrong = am ? [`am ${ORD[d]} ${ORD[m]}`, `am ${d === 1 ? "einsten" : ORD[d].replace(/e$/, "") + "en"} ${ORD[m]}n`, `am ${ORD[d]}s ${ORD[m]}s`] : [`der ${ORD[d]}n ${ORD[m]}n`, `der ${d === 3 ? "dreite" : d === 7 ? "siebente" : d === 1 ? "einste" : ORD[d].replace(/te$/, "ste")} ${ORD[m]}`, `die ${ORD[d]} ${ORD[m]}`];
  return { kind: "mc", errCat: "word", task: "Как се казва датата?", prompt: `<div class="exs">${esc(shown)}</div>`, options: shuffle([...new Set([ans, ...wrong])].slice(0, 4)), answer: ans, say: full, full, keys: true, explain: why };
}
// C10: една фраза в три вида — Präsens / с модален глагол / Perfekt
const C10 = [["Ich", 0, "absagen", "den Termin", "Отменям срещата."], ["Wir", 3, "anschließen", "den Drucker", "Свързваме принтера."], ["Er", 2, "einschalten", "den Bildschirm", "Той включва екрана."],
  ["Du", 1, "einfügen", "den Text", "Поставяш текста."], ["Sie", 2, "weiterleiten", "die E-Mail", "Тя препраща имейла."], ["Ich", 0, "einkaufen", "im Supermarkt", "Пазарувам в супермаркета."],
  ["Wir", 3, "anrufen", "den Kundenservice", "Обаждаме се на клиентския сервиз."], ["Ich", 0, "anfangen", "mit der Arbeit", "Започвам работа."], ["Herr Kolle", 2, "aufstehen", "um 6.00 Uhr", "Г-н Коле става в 6."],
  ["Wir", 3, "ankommen", "pünktlich", "Пристигаме навреме."], ["Er", 2, "ausschalten", "das Licht", "Той изключва лампата."]];
const MODF = ["muss", "musst", "muss", "müssen", "müsst", "müssen"];
function genC10() {
  const [s, i, inf, mid, bg] = rnd(C10), [pv, pp] = presF(inf, i).split(" "), kind = rnd(["pres", "mod", "perf"]);
  const forms = { pres: `${s} ${pv} ${mid} ${pp}.`, mod: `${s} ${MODF[i]} ${mid} ${inf}.`, perf: `${s} ${AUXF[V3[inf][1]][i]} ${mid} ${V3[inf][2]}.` };
  const name = { pres: "Präsens", mod: "с müssen", perf: "Perfekt" }[kind], ans = forms[kind];
  return { kind: "type", mode: "use", exk: "c10", item: ITEMS.find((x) => x.type === "verb" && x.de === inf), task: `Напиши изречението — <b>${name}</b>`, prompt: `<div class="exs">${esc(s)} · ${esc(mid)} · ${esc(inf)}</div><div class="meta">${esc(bg)}</div>`, answer: ans, say: ans, full: ans, long: true,
    check: (v) => CK.checkDe(v, ans), explain: `Разделим глагол в три вида:<br>Präsens: <b>${esc(forms.pres)}</b> (представката в края)<br>Модален: <b>${esc(forms.mod)}</b> (инфинитивът цял в края)<br>Perfekt: <b>${esc(forms.perf)}</b> (ge в средата: ${esc(V3[inf][2])})` };
}
// C12: денят на Хана → Perfekt
const HANNA = [["Hanna steht um 8.00 Uhr auf.", "Hanna ist um 8.00 Uhr aufgestanden."], ["Danach frühstückt sie.", "Danach hat sie gefrühstückt."], ["Um 9.00 Uhr fährt sie mit dem Auto zur Arbeit.", "Um 9.00 Uhr ist sie mit dem Auto zur Arbeit gefahren."],
  ["Zuerst liest sie ihre E-Mails.", "Zuerst hat sie ihre E-Mails gelesen."], ["Um 10.00 Uhr trinkt sie mit Frau Müller einen Kaffee.", "Um 10.00 Uhr hat sie mit Frau Müller einen Kaffee getrunken."],
  ["Sie vereinbart zwei Termine.", "Sie hat zwei Termine vereinbart."], ["Sie isst in der Kantine Fleisch mit Gemüse.", "Sie hat in der Kantine Fleisch mit Gemüse gegessen."], ["Am Nachmittag bucht sie einen Flug nach Rom.", "Am Nachmittag hat sie einen Flug nach Rom gebucht."],
  ["Sie kopiert viele Dokumente.", "Sie hat viele Dokumente kopiert."], ["Um 16.00 Uhr begrüßt sie die Gäste.", "Um 16.00 Uhr hat sie die Gäste begrüßt."], ["Von 16.30 bis 17.30 Uhr schreibt sie wieder E-Mails.", "Von 16.30 bis 17.30 Uhr hat sie wieder E-Mails geschrieben."],
  ["Um 17.30 Uhr hat Hanna Feierabend.", "Um 17.30 Uhr hatte Hanna Feierabend."]];
Object.assign(PERF, { gebucht: PERF.gebucht || ["buchen", "h", "w"] });
function genHanna() {
  const [pres, perf] = rnd(HANNA);
  return { kind: "type", mode: "use", exk: "hanna", task: "Денят на Хана — напиши го в <b>Perfekt</b>", prompt: `<div class="exs">${esc(pres)}</div>`, answer: perf, say: perf, full: perf, long: true,
    check: (v) => CK.checkDe(v, perf), explain: /hatte/.test(perf) ? "haben в минало → в говора се казва <b>hatte</b> (Präteritum), не „hat gehabt“." : "Помощният глагол е на 2-ро място, Partizip II — в края. Времето/наречието отпред остава отпред." };
}
// A25/A29/A30: телефон и уговорка (практически диалог)
const TELEFON = [
  { title: "Обаждане за ремонт", parts: ["IPRO, guten Tag. Was {kann} ich für Sie tun?", "Guten Tag, Paul Frisch {hier}. Ich {habe} ein Problem: Mein Drucker {funktioniert} nicht mehr.", "Ich möchte gern einen Termin für die Reparatur {vereinbaren}.", "Der Monteur {kann} am Freitag kommen.", "Am Freitag {bin} ich nicht im Büro. {Geht} es am Donnerstag?", "Ja, am Donnerstag um 17.30 Uhr {geht} es.", "Gut, dann {erwarte} ich den Monteur am Donnerstag. Auf {Wiederhören}."] },
  { title: "В офиса по телефона", parts: ["Firma ANA, guten Tag.", "Guten Tag, hier {ist} Anna Berg. {Kann} ich bitte Frau Müller {sprechen}?", "Einen Moment, bitte. Ich {verbinde} Sie.", "Müller.", "Guten Tag, Frau Müller. Wann {haben} Sie Zeit?", "Am {dritten} März habe ich leider keine Zeit, aber am vierten {geht} es.", "{Vielen} Dank für Ihren Anruf. Auf Wiederhören."] },
  { title: "Имейл: отменям срещата (A32)", parts: ["{Liebe} Frau Körner,", "ich {muss} den Termin am 22. März leider {absagen}.", "Herr Krause {ist} noch in London.", "{Können} wir einen neuen Termin {vereinbaren}?", "{Haben} Sie am 24. März Zeit?", "Mit besten {Grüßen}", "Sabine Sauer"] },
];
let telIdx = 0;
function genTelefon() {
  const t = TELEFON[telIdx++ % TELEFON.length], blanks = [], sentences = [];
  t.parts.forEach((p) => { sentences.push(p.replace(/[{}]/g, "")); (p.match(/\{([^}]+)\}/g) || []).forEach((m) => blanks.push(m.slice(1, -1))); });
  return { kind: "bank", mode: "use", task: `Диалог: <b>${esc(t.title)}</b>`, parts: t.parts, blanks, bank: shuffle(blanks), sentences, answer: blanks.join(" · "),
    explain: "Изрази за телефон: <i>Guten Tag, (име) hier.</i> · <i>Kann ich bitte … sprechen?</i> · <i>Ich verbinde Sie.</i> · <i>Geht es am … um …?</i> · <i>Auf Wiederhören</i> (по телефона — не Auf Wiedersehen)." };
}
// A25/A29: уговорка за ремонт — уред, фирма, ден, час се сменят → стотици варианти
const DEV = [["der Drucker", "Mein Drucker", "funktioniert"], ["der Computer", "Mein Computer", "funktioniert"], ["die Waschmaschine", "Meine Waschmaschine", "funktioniert"], ["der Fernseher", "Mein Fernseher", "geht"],
  ["der Kühlschrank", "Mein Kühlschrank", "funktioniert"], ["der Bildschirm", "Mein Bildschirm", "geht"], ["die Tastatur", "Meine Tastatur", "funktioniert"]];
const FIRMA = ["Compifix", "HELP", "IPRO", "Telemobil", "Küche & Co.", "Technik Schmidt"], WTAG = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"], NAMEN = ["Paul Frisch", "Anna Berg", "Martin Kühne", "Susanne Müller", "Otto Klein", "Maria Weber"];
function genTermin() {
  const [, poss, verb] = rnd(DEV), f = rnd(FIRMA), nm = rnd(NAMEN), [d1, d2] = shuffle(WTAG), h1 = 8 + ((Math.random() * 9) | 0), h2 = 8 + ((Math.random() * 9) | 0), mm = rnd(["00", "15", "30", "45"]);
  const lines = [`${f}, guten Tag. Was {kann} ich für Sie tun?`, `Guten Tag, ${nm} {hier}. Ich {habe} ein Problem: ${poss} {${verb}} nicht mehr.`,
    rnd([`Ich {möchte} gern einen Termin für die Reparatur {vereinbaren}.`, `Wann {kann} der Monteur {kommen}?`]), `Der Monteur {kann} am ${d1} um ${h1}.${mm} Uhr kommen.`,
    rnd([`Am ${d1} {bin} ich leider nicht da. {Geht} es am ${d2}?`, `Am ${d1} {habe} ich keine Zeit. {Geht} es auch am ${d2}?`]), `Moment mal … Ja, am ${d2} um ${h2}.00 Uhr {geht} es.`,
    `Gut, dann {erwarte} ich den Monteur am ${d2} um ${h2}.00 Uhr. Auf {Wiederhören}.`];
  const blanks = [], sentences = []; lines.forEach((p) => { sentences.push(p.replace(/[{}]/g, "")); (p.match(/\{([^}]+)\}/g) || []).forEach((m) => blanks.push(m.slice(1, -1))); });
  return { kind: "bank", mode: "use", task: `Диалог по телефона: <b>${esc(f)}</b>`, parts: lines, blanks, bank: shuffle(blanks), sentences, answer: blanks.join(" · "),
    explain: "Модалният глагол (kann, möchte) е на 2-ро място, инфинитивът (kommen, vereinbaren) — в края. Geht es am …? = Удобно ли е в …? · По телефона: <b>Auf Wiederhören</b>." };
}
// попълни реплика в диалог (избор) — от всички диалози в приложението
function genDlgLine() {
  const D = rnd(DIALOGS.filter((d) => d.lines && d.lines.length > 2)), i = 1 + ((Math.random() * (D.lines.length - 1)) | 0), ans = D.lines[i][1];
  const wrong = shuffle(DIALOGS.flatMap((d) => (d.lines || []).map((l) => l[1])).filter((x) => x !== ans && x.length < 90)).slice(0, 3);
  return { kind: "mc", mode: "use", task: `Диалог: <b>${esc(D.title || "")}</b> — коя реплика пасва?`, prompt: `<div class="dlg">${D.lines.slice(Math.max(0, i - 2), i).map((l) => `<p><b>${esc(l[0])}:</b> ${esc(l[1])}</p>`).join("")}<p><b>${esc(D.lines[i][0])}:</b> ___</p></div>`,
    options: shuffle([ans, ...wrong]), answer: ans, say: ans, full: ans, explain: `Отговорът продължава разговора логично. Целият диалог:<br>${D.lines.map((l) => `<b>${esc(l[0])}:</b> ${esc(l[1])}`).join("<br>")}` };
}
EX_TYPES.push(
  { k: "dlgline", skill: "Четене", ic: "💬", t: "Диалози: коя реплика пасва?", d: "всички диалози от уроците", gen: genDlgLine },
  { k: "termin", skill: "Четене", ic: "☎️", t: "Уговорка за ремонт (безброй варианти)", d: "Geht es am Dienstag um 10 Uhr?", gen: genTermin },
  { k: "temp", skill: "Граматика", ic: "🗓️", t: "um, am, im, von … bis (Wann?)", d: "Haben Sie ___ Freitag Zeit? → am", gen: genTemp },
  { k: "datum", skill: "Думи", ic: "📅", t: "Датата: am neunten Vierten", d: "Heute ist der 14.5. → der vierzehnte Fünfte", gen: genDatum },
  { k: "c10", skill: "Глаголи и словоред", ic: "🔀", t: "Разделим глагол в 3 вида (C10)", d: "Licht/ausschalten → Er hat das Licht ausgeschaltet.", gen: genC10 },
  { k: "hanna", skill: "Глаголи и словоред", ic: "👩‍💼", t: "Денят на Хана → Perfekt (C12)", d: "Hanna steht um 8 auf. → … ist … aufgestanden.", gen: genHanna },
  { k: "telefon", skill: "Четене", ic: "📞", t: "Телефон и уговорка (A25, A30, A32)", d: "Kann ich bitte … sprechen?", gen: genTelefon },
  { k: "t5", skill: "Глаголи и словоред", ic: "✍️", t: "Напиши цялото изречение в минало", d: "Ich kaufe Brot. → Ich habe Brot gekauft.", gen: () => qTransform() },
  { k: "t7", skill: "Глаголи и словоред", ic: "🩹", t: "Поправи грешното изречение", d: "Ich habe nach Berlin gefahren. → bin", gen: qFix },
);
Object.assign(G2EX, { zeiten: [...(G2EX.zeiten || []), "t5", "t7", "hanna"], praeteritum: G2EX.praeteritum || [], uhrzeit: [...(G2EX.uhrzeit || []), "temp", "datum"], trennbar: [...(G2EX.trennbar || []), "c10"] });
UNIT_MAP[14] && (UNIT_MAP[14].ex = [...new Set([...UNIT_MAP[14].ex, "temp", "datum", "hanna", "telefon", "termin"])]);
UNIT_MAP[15] && (UNIT_MAP[15].ex = [...new Set([...UNIT_MAP[15].ex, "c10", "t5", "t7"])]);
UNITS.forEach((U) => { U.ex = ((UNIT_MAP[U.id] || {}).ex || []).filter(exByK); });
function exKap5Texts() {
  const out = [];
  TEMP.forEach(([s, a]) => { let f = s; a.split("|").forEach((p) => (f = f.replace("___", p))); out.push(f.replace(/\s*\([^)]*\)/, "")); });
  C10.forEach(([s, i, inf, mid]) => { const [pv, pp] = presF(inf, i).split(" "); out.push(`${s} ${pv} ${mid} ${pp}.`, `${s} ${MODF[i]} ${mid} ${inf}.`, `${s} ${AUXF[V3[inf][1]][i]} ${mid} ${V3[inf][2]}.`); });
  HANNA.forEach(([a, b]) => out.push(a, b)); TELEFON.forEach((t) => t.parts.forEach((p) => out.push(p.replace(/[{}]/g, ""))));
  WRITE_TASKS.forEach((w) => w.model.split(/(?<=[.!?])\s+/).forEach((s) => out.push(s)));
  return out;
}

// ── ДНЕШНО ОБУЧЕНИЕ: системата сама избира какво е нужно днес ──
function qForItem(it, mode) {
  if (mode === "rec") { const w = shuffle(genWordTraining(it).filter((q) => q.kind === "mc")); const q = w[0]; if (q) { q.mode = "rec"; return q; } }
  if (mode === "use") { const q = Math.random() < 0.5 ? qCloze(it) : qTrans(it) || qCloze(it); if (q) return q; }
  if (it.type === "noun" && it.pl && it.pl !== it.de && Math.random() < 0.2) return qPlural(it);
  return ["phrase", "q"].includes(it.type) && Math.random() < 0.5 ? qDeBg(it) : qRecall(it);
}
function weakDrill(n = 3) {
  const prof = ERRS.profile(); const out = [];
  for (const p of prof.slice(0, 2)) {
    const ks = (CAT_EX[p.cat] || []).filter((k) => exByK(k)); if (!ks.length) continue;
    for (let i = 0; i < n && out.length < n * 2; i++) { try { const q = exByK(rnd(ks)).gen(); if (q && q.kind !== "intro") { q.weak = p.cat; out.push(q); } } catch (e) {} }
  }
  return out;
}
function dailyPlan() {
  const L = learnedItems(), ids = L.map((i) => i.id), now = Date.now();
  const due = MEM.due(ids, now), unsure = L.filter((i) => MEM.state(i.id) === "unsure");
  const units = typeof UNITS !== "undefined" ? UNITS.filter((U) => U.id > 0) : [];
  const open = (U) => unitState(U).steps.some((x) => !x.done);
  // учещият следва курса: най-новият незавършен урок (старите пропуски се хващат от повторенията); новак → от началото
  const unitNext = L.length ? [...units].reverse().find((U) => open(U) && unitWords(U.id).some(isLearned)) || [...units].reverse().find(open) : units.find(open);
  const newWords = unitNext ? unitWords(unitNext.id).filter((i) => !isLearned(i)).length : 0;
  return { due, unsure, prof: ERRS.profile(), unitNext, newWords, learned: L.length };
}
function startDaily() {
  const P = dailyPlan(), qs = [], used = new Set();
  const pick = P.due.slice(0, 14).map((id) => ITEM_BY_ID.get(id)).filter(Boolean);
  // добави несигурни, които не са дошли за повторение
  P.unsure.forEach((it) => { if (pick.length < 16 && !pick.includes(it)) pick.push(it); });
  let nRec = 0;
  for (const it of pick) {
    if (used.has(it.id)) continue; used.add(it.id);
    // строго: най-много ~1/3 разпознаване — вече виждана дума се проверява с писане
    let md = MEM.nextMode(it.id); if (md === "rec" && nRec >= Math.ceil(pick.length / 3) && MEM.get(it.id)) md = "recall"; if (md === "rec") nRec++;
    try { const q = qForItem(it, md); if (q) qs.push(q); } catch (e) {}
  }
  const weak = weakDrill(3);
  // натрупване: по малко от старото (смесено)
  const old = shuffle(learnedItems().filter((i) => !used.has(i.id) && MEM.state(i.id) !== "new")).slice(0, qs.length < 6 ? 6 : 2);
  old.forEach((it) => { const q = qForItem(it, MEM.nextMode(it.id)); if (q) qs.push(q); });
  if (Math.random() < 0.7 || qs.length < 8) { const t = qTransform(); if (t) qs.push(t); }
  const all = interleave(qs, weak);
  if (!all.length) { if (P.unitNext) return startUnitStep(P.unitNext, "learn"); toast("Няма какво за преговор днес — започни нов урок"); return; }
  startEx("custom", { qs: all, title: "Днешно обучение", tab: "heute", back: () => go("heute"), again: () => go("heute"), againLabel: "Към Heute", daily: true });
}
const interleave = (a, b) => { const out = [], A = shuffle(a), B = [...b]; const step = B.length ? Math.max(2, Math.floor(A.length / (B.length + 1))) : 1e9; A.forEach((q, i) => { out.push(q); if ((i + 1) % step === 0 && B.length) out.push(B.shift()); }); return out.concat(B); };
function startUnitStep(U, k) { return runStep(U.id, k); }

// ── ИЗПИТИ ──
const EXAMS = [
  { k: "recall", ic: "🧠", t: "Активно припомняне", d: "български → немски, членът е задължителен", n: 15, make: () => shuffle(learnedItems()).slice(0, 15).map((it) => (it.type === "noun" && it.pl && Math.random() < 0.15 ? qPlural(it) : qRecall(it))) },
  { k: "debg", ic: "🔁", t: "Немски → български", d: "проверява разбирането", n: 15, make: () => shuffle(learnedItems()).slice(0, 15).map(qDeBg) },
  { k: "cloze", ic: "🧩", t: "Липсващата дума", d: "пишеш думата в изречение", n: 12, make: () => shuffle(learnedItems()).map(qCloze).filter(Boolean).slice(0, 12) },
  { k: "trans", ic: "🌍", t: "Превод на изречения", d: "български → немски, цели изречения", n: 10, make: () => shuffle(learnedItems()).map(qTrans).filter(Boolean).slice(0, 10) },
  { k: "transform", ic: "🔄", t: "Преобразуване", d: "Präsens → Perfekt / Präteritum", n: 10, make: () => [...Array(10)].map(() => qTransform()) },
  { k: "fix", ic: "🩹", t: "Открий и поправи грешката", d: "пишеш поправеното изречение", n: 10, make: () => [...Array(10)].map(qFix) },
  { k: "grammar", ic: "📐", t: "Граматически изпит", d: "членове, падежи, спрежение, Perfekt…", n: 15, make: () => [...Array(15)].map(qGrammar).filter(Boolean) },
  { k: "build", ic: "🏗️", t: "Състави изречение", d: "свое изречение с дадена дума", n: 5, make: () => shuffle(learnedItems().filter((i) => ["verb", "noun", "adj"].includes(i.type))).slice(0, 5).map(qBuild) },
  { k: "write", ic: "📝", t: "Свободно писане", d: "кратък текст по задача", n: 1, make: () => [qWrite()] },
  { k: "mixed", ic: "🎯", t: "Смесен изпит", d: "всичко изучено, 20 въпроса, обяснения накрая", n: 20, exam: true, make: () => {
    const L = shuffle(learnedItems()), q = [];
    L.slice(0, 5).forEach((it) => q.push(qRecall(it))); L.slice(5, 7).forEach((it) => q.push(qDeBg(it)));
    L.slice(7, 20).map(qCloze).filter(Boolean).slice(0, 3).forEach((x) => q.push(x)); L.slice(20, 40).map(qTrans).filter(Boolean).slice(0, 3).forEach((x) => q.push(x));
    for (let i = 0; i < 3; i++) q.push(qTransform()); for (let i = 0; i < 2; i++) q.push(qFix()); for (let i = 0; i < 2; i++) { const g = qGrammar(); if (g) q.push(g); }
    return shuffle(q.filter(Boolean)); } },
  { k: "kap5", ic: "📗", t: "Rückblick: Kapitel 5", d: "тест върху цялата глава (уроци 14–15)", n: 20, exam: true, make: () => {
    const L = shuffle(ITEMS.filter((i) => (inLesson(i, 14) || inLesson(i, 15)) && LEARN_TYPES.includes(i.type) && !/\s–\s/.test(i.de))), q = [];
    L.slice(0, 5).forEach((it) => q.push(qRecall(it))); L.slice(5, 15).map(qCloze).filter(Boolean).slice(0, 3).forEach((x) => q.push(x));
    q.push(qTransform("perf"), qTransform("perf"), qTransform("praet"), qFix(), qFix(), genC10(), genHanna(), genTemp(), genTemp(), genDatum());
    ["perfhs", "partizip", "musssoll", "michmir"].forEach((k) => exByK(k) && q.push(exByK(k).gen()));
    return shuffle(q.filter(Boolean)); } },
];
function startExam(k) {
  const E = EXAMS.find((x) => x.k === k); if (!E) return;
  if (!learnedItems().length && !["transform", "fix", "kap5", "write"].includes(k)) { toast("Първо научи няколко думи — после изпитите имат смисъл"); return; }
  const qs = E.make().filter(Boolean); if (!qs.length) { toast("Няма достатъчно материал за този изпит още"); return; }
  const t0 = Date.now();
  startEx("custom", { qs, title: E.t, tab: "lernen", exam: !!E.exam, back: () => go("lernen"), again: () => startExam(k), againLabel: "Пак",
    onDone: (pct, s) => { saveExam(k, pct, s, Date.now() - t0); } });
}
function saveExam(k, pct, s, ms) {
  const cats = {}; s.wrong.forEach(({ q }) => { const c = q.errCat || EX_CAT[q.exk] || "word"; cats[c] = (cats[c] || 0) + 1; });
  const a = store.get("exams", []); a.push({ t: Date.now(), k, pct, n: s.qs.length, ms, cats }); if (a.length > 300) a.splice(0, a.length - 300); store.set("exams", a);
}

// ───────── урок 16: ремонт/телефон, противоположности (C1), dürfen, смесени глаголи ─────────
Object.assign(V3, {
  bringen: ["brachte", "h", "gebracht", "нося"], rennen: ["rannte", "s", "gerannt", "тичам"], nennen: ["nannte", "h", "genannt", "наричам"], singen: ["sang", "h", "gesungen", "пея"],
  wohnen: ["wohnte", "h", "gewohnt", "живея"], aufmachen: ["machte auf", "h", "aufgemacht", "отварям"], zumachen: ["machte zu", "h", "zugemacht", "затварям"], anmachen: ["machte an", "h", "angemacht", "светвам"],
  ausmachen: ["machte aus", "h", "ausgemacht", "изгасям"], aufwachen: ["wachte auf", "s", "aufgewacht", "събуждам се"], aufhören: ["hörte auf", "h", "aufgehört", "спирам"], abfahren: ["fuhr ab", "s", "abgefahren", "тръгвам"],
  vorbeikommen: ["kam vorbei", "s", "vorbeigekommen", "отбивам се"], umziehen: ["zog um", "s", "umgezogen", "местя се"], erwarten: ["erwartete", "h", "erwartet", "очаквам"], verbinden: ["verband", "h", "verbunden", "свързвам"],
  vergleichen: ["verglich", "h", "verglichen", "сравнявам"], verstehen: ["verstand", "h", "verstanden", "разбирам"], empfehlen: ["empfahl", "h", "empfohlen", "препоръчвам"], besprechen: ["besprach", "h", "besprochen", "обсъждам"],
  reparieren: ["reparierte", "h", "repariert", "поправям"], einschlafen: V3.einschlafen,
});
Object.assign(PERF, { gebracht: ["bringen", "h", "s"], gerannt: ["rennen", "s", "s"], genannt: ["nennen", "h", "s"], aufgemacht: ["aufmachen", "h", "sep"], zugemacht: ["zumachen", "h", "sep"], angemacht: ["anmachen", "h", "sep"],
  ausgemacht: ["ausmachen", "h", "sep"], aufgewacht: ["aufwachen", "s", "sep"], aufgehört: ["aufhören", "h", "sep"], abgefahren: ["abfahren", "s", "sep"], vorbeigekommen: ["vorbeikommen", "s", "sep"], umgezogen: ["umziehen", "s", "sep"],
  erwartet: ["erwarten", "h", "ins"], verbunden: ["verbinden", "h", "ins"], verglichen: ["vergleichen", "h", "ins"], verstanden: ["verstehen", "h", "ins"], empfohlen: ["empfehlen", "h", "ins"], besprochen: ["besprechen", "h", "ins"],
  gesandt: ["senden", "h", "s"] });
Object.assign(SEP_PRE14, { vorbei: 1, um: 1 });
Object.keys(PRAETF).forEach((k) => delete PRAETF[k]);
Object.keys(V3).forEach((inf) => PERS.forEach((p, i) => { const f = praetF(inf, i).split(" ")[0].toLowerCase(), L = (PRAETF[f] = PRAETF[f] || []); let e = L.find((x) => x.inf === inf); if (!e) L.push((e = { inf, sep: V3[inf][0].split(" ")[1], p: [] })); if (!e.p.includes(p)) e.p.push(p); }));
const Z16 = [
  ["Maria", 2, "aufmachen", "die Tür", "Мария отваря вратата.", "Мария отвори вратата."], ["Heinz", 2, "zumachen", "die Tür", "Хайнц затваря вратата.", "Хайнц затвори вратата."],
  ["Ich", 0, "anmachen", "das Licht", "Светвам лампата.", "Светнах лампата."], ["Du", 1, "ausmachen", "den Fernseher", "Изключваш телевизора.", "Изключи телевизора."],
  ["Wir", 3, "aufwachen", "um sechs Uhr", "Събуждаме се в шест.", "Събудихме се в шест."], ["Die Arbeit", 2, "aufhören", "um 17 Uhr", "Работата свършва в 17 ч.", "Работата свърши в 17 ч."],
  ["Der Zug", 2, "abfahren", "um acht Uhr", "Влакът тръгва в осем.", "Влакът тръгна в осем."], ["Ich", 0, "vorbeikommen", "morgen", "Минавам утре.", "Минах (вчера)."],
  ["Die Praxis", 2, "umziehen", "im August", "Кабинетът се мести през август.", "Кабинетът се премести през август."], ["Wir", 3, "erwarten", "den Monteur", "Очакваме техника.", "Очаквахме техника."],
  ["Der Monteur", 2, "reparieren", "die Waschmaschine", "Техникът поправя пералнята.", "Техникът поправи пералнята."], ["Ich", 0, "bringen", "dir einen Kaffee", "Нося ти кафе.", "Донесох ти кафе."],
  ["Er", 2, "rennen", "zum Bus", "Той тича към автобуса.", "Той тичаше към автобуса."], ["Wir", 3, "nennen", "den Hund Max", "Наричаме кучето Макс.", "Нарекохме кучето Макс."],
  ["Der Chor", 2, "singen", "schöne Lieder", "Хорът пее хубави песни.", "Хорът пя хубави песни."], ["Anton", 2, "wohnen", "in Frankfurt", "Антон живее във Франкфурт.", "Антон живееше във Франкфурт."],
  ["Ich", 0, "verstehen", "die Frage nicht", "Не разбирам въпроса.", "Не разбрах въпроса."], ["Der Kellner", 2, "empfehlen", "den Fisch", "Сервитьорът препоръчва рибата.", "Сервитьорът препоръча рибата."],
  ["Wir", 3, "besprechen", "das Problem", "Обсъждаме проблема.", "Обсъдихме проблема."], ["Ihr", 4, "vergleichen", "die Preise", "Сравнявате цените.", "Сравнихте цените."],
  ["Einen Moment, ich", 0, "verbinden", "Sie", "Един момент, свързвам Ви.", "Свързах Ви."],
];
Z16.forEach((z) => { if (!z[0].includes(",") && presF(z[2], z[1])) { Z3.push(z); const r = z3(z); if (PERF[r.part]) PERF_S.push([r.perf, z[5]]); } });
// C1: противоположности
const GEGEN = [["aufmachen", "zumachen", "die Tür"], ["anmachen", "ausmachen", "das Licht"], ["einschalten", "ausschalten", "den Fernseher"], ["einschlafen", "aufwachen", "um 5.00 Uhr"], ["anfangen", "aufhören", "um 15.00 Uhr"], ["ankommen", "abfahren", "um acht Uhr"]];
const GEGEN_S = [["Maria", 2], ["Heinz", 2], ["Ich", 0], ["Wir", 3], ["Du", 1]];
function genGegen() {
  const [a, b, mid] = rnd(GEGEN), dir = Math.random() < 0.5, [x, y] = dir ? [a, b] : [b, a], [s, i] = rnd(GEGEN_S);
  const subj = mid.startsWith("um") ? (x === "anfangen" || x === "aufhören" ? ["Die Arbeit", 2] : [s, i]) : [s, i];
  const fx = presF(x, subj[1]), fy = presF(y, subj[1]), sx = `${subj[0]} ${fx.split(" ")[0]} ${mid} ${fx.split(" ")[1]}.`, sy = `${subj[0]} ${fy.split(" ")[0]} ${mid} ${fy.split(" ")[1]}.`;
  const wrong = shuffle(GEGEN.flatMap((g) => g).filter((v) => v !== y && v !== x)).slice(0, 3);
  return { kind: "mc", mode: "use", exk: "gegen", task: "Кое е противоположното?", prompt: `<div class="exs">${esc(sx)}</div><div class="meta">Противоположното: ${esc(subj[0])} … ${esc(mid)} …</div>`, options: shuffle([y, ...wrong]), answer: y,
    say: sy, full: sy, item: ITEMS.find((v) => v.type === "verb" && v.de === y), keys: true, explain: `<b>${esc(x)}</b> ≠ <b>${esc(y)}</b>. В изречение: ${esc(sy)} — представката (${esc(fy.split(" ")[1])}) отива в края.` };
}
// dürfen: молба за разрешение / забрана
const DUERF = [["___ ich dich später anrufen?", 0, "Darf", "Може ли да ти се обадя по-късно?"], ["Hier ___ man nicht rauchen.", 2, "darf", "Тук не се пуши."], ["___ ich das Fenster aufmachen?", 0, "Darf", "Може ли да отворя прозореца?"],
  ["Du ___ heute nicht fernsehen.", 1, "darfst", "Днес не бива да гледаш телевизия."], ["Die Kinder ___ im Park spielen.", 5, "dürfen", "Децата могат (им е позволено) да играят в парка."], ["___ wir hier parken?", 3, "Dürfen", "Може ли да паркираме тук?"],
  ["Ihr ___ jetzt nach Hause gehen.", 4, "dürft", "Можете вече да си тръгнете."], ["Im Kino ___ man nicht telefonieren.", 2, "darf", "В киното не се говори по телефона."]];
const DF = ["darf", "darfst", "darf", "dürfen", "dürft", "dürfen"];
function genDuerfen() {
  const [s, i, ans, bg] = rnd(DUERF), cap0 = s.startsWith("___"), full = s.replace("___", ans);
  const opts = [...new Set([...DF, "kann", "muss"].map((x) => (cap0 ? cap(x) : x)))].filter((x) => x !== ans);
  return { kind: "mc", exk: "duerfen", errCat: "conj", task: "dürfen: коя форма?", prompt: `<div class="exs">${esc(s)}</div>`, options: shuffle([ans, ...shuffle(opts).slice(0, 3)]), answer: ans, say: full, full, bg, keys: true,
    explain: `dürfen = позволено е: ich <b>darf</b>, du <b>darfst</b>, er <b>darf</b> (без -t!), wir <b>dürfen</b>, ihr <b>dürft</b>, sie <b>dürfen</b>. <b>nicht dürfen</b> = забранено е. <b>Darf ich …?</b> = учтива молба. Вторият глагол е цял в края.` };
}
// смесени глаголи: bringen – brachte – gebracht (сменят корена като силните, но имат -te/-t като слабите)
const MIXED = [["bringen", "brachte", "hat gebracht"], ["denken", "dachte", "hat gedacht"], ["kennen", "kannte", "hat gekannt"], ["nennen", "nannte", "hat genannt"], ["rennen", "rannte", "ist gerannt"], ["wissen", "wusste", "hat gewusst"], ["senden", "sandte", "hat gesandt"]];
function genMixed() {
  const [inf, p, pp] = rnd(MIXED), slot = rnd([1, 2]), ans = slot === 1 ? p : pp, line = slot === 1 ? `${inf} – ___ – ${pp}` : `${inf} – ${p} – ___`;
  return { kind: "type", mode: "recall", exk: "mixed", errCat: "vform", task: "Смесен глагол: напиши липсващата форма", prompt: `<div class="exs">${esc(line)}</div>`, answer: ans, say: `${inf} – ${p} – ${pp}`, full: `${inf} – ${p} – ${pp}`,
    check: (v) => CK.checkDe(v, ans, { alts: inf === "senden" ? [slot === 1 ? "sendete" : "hat gesendet"] : [] }),
    explain: `<b>Смесени глаголи</b> (bringen, denken, kennen, nennen, rennen, wissen): сменят корена като силните (<i>bring → brach</i>), но имат окончанията на слабите: <b>-te</b> в Präteritum и <b>ge-…-t</b> в Perfekt. ${esc(inf)} – ${esc(p)} – ${esc(pp)}.` };
}
const TERM16 = [["Kann ich bitte Frau Klein ___? (sprechen)", "sprechen"], ["Einen Moment, bitte. Ich ___ Sie. (verbinden)", "verbinde"], ["Morgen? Nein, das ist leider nicht ___.", "möglich"], ["Gut, dann ___ ich den Monteur am Freitag. (erwarten)", "erwarte"],
  ["Vielen Dank für Ihren ___.", "Anruf"], ["Ich habe Ihre ___ gelesen.", "Anzeige"], ["Was kann ich für Sie ___?", "tun"], ["___ es am Mittwoch? – Nein, am Mittwoch ___ es leider nicht.", "Geht geht"], ["Ich möchte einen Termin für die ___ vereinbaren.", "Reparatur"], ["Welches ___ haben wir heute?", "Datum"]];
function genTerm16() {
  const [s, a] = rnd(TERM16); let full = s; a.split(" ").forEach((p) => (full = full.replace("___", p))); full = full.replace(/\s*\([^)]*\)/, "");
  return { kind: "type", mode: "use", exk: "term16", task: "Попълни (телефон, ремонт)", prompt: `<div class="exs">${esc(s)}</div>`, answer: a, say: full, full, check: (v) => CK.checkDe(v, a), explain: `${esc(full)}` };
}
EX_TYPES.push(
  { k: "gegen", skill: "Думи", ic: "↔️", t: "Противоположности: aufmachen ≠ zumachen (C1)", d: "Maria macht die Tür auf. → zu", gen: genGegen },
  { k: "duerfen", skill: "Глаголи и словоред", ic: "🙋", t: "dürfen: Darf ich …?", d: "___ ich dich später anrufen? → Darf", gen: genDuerfen },
  { k: "mixed", skill: "Глаголи и словоред", ic: "🔀", t: "Смесени глаголи: bringen – brachte – gebracht", d: "rennen – ___ – ist gerannt", gen: genMixed },
  { k: "term16", skill: "Четене", ic: "📞", t: "Телефон и ремонт: попълни думата", d: "Ich ___ Sie. → verbinde", gen: genTerm16 },
);
wrapGens(); // и за всички упражнения, добавени по-горе в този файл
UNIT_MAP[16] = { g: ["perfektbildung", "trennbar", "modal"], ex: ["gegen", "duerfen", "mixed", "term16", "termin", "c10", "stamm", "praet", "perfhs", "partizip", "t5"] };
G2EX.modal = [...new Set([...(G2EX.modal || []), "duerfen"])];
UNITS.forEach((U) => { U.g = ((UNIT_MAP[U.id] || {}).g || []).filter((id) => GRAMMAR.some((x) => x.id === id)); U.ex = ((UNIT_MAP[U.id] || {}).ex || []).filter(exByK); });
function ex16Texts() {
  const out = [];
  Z16.forEach((z) => { if (z[0].includes(",") || !presF(z[2], z[1])) return; const r = z3(z); out.push(r.pres, r.praet, r.perf); });
  GEGEN.forEach(([a, b, mid]) => GEGEN_S.concat([["Die Arbeit", 2]]).forEach(([s, i]) => [a, b].forEach((v) => { const f = presF(v, i); out.push(`${s} ${f.split(" ")[0]} ${mid} ${f.split(" ")[1]}.`); })));
  DUERF.forEach(([s, , a]) => out.push(s.replace("___", a))); MIXED.forEach(([a, b, c]) => out.push(`${a} – ${b} – ${c}`));
  TERM16.forEach(([s, a]) => { let f = s; a.split(" ").forEach((p) => (f = f.replace("___", p))); out.push(f.replace(/\s*\([^)]*\)/, "")); });
  return out;
}

// ───────── урок 17: времето, denn, wohin?, багаж и дрехи, lassen, Dativ-глаголи ─────────
const WPAIR = [["die Sonne", "sonnig", "Es ist sonnig.", "☀️"], ["der Regen", "regnen", "Es regnet.", "🌧️"], ["der Schnee", "schneien", "Es schneit.", "❄️"], ["die Wolke", "bewölkt", "Es ist bewölkt.", "☁️"], ["der Nebel", "neblig", "Es ist neblig.", "🌫️"],
  ["der Sturm", "stürmisch", "Es ist stürmisch.", "🌬️"], ["die Kälte", "kalt", "Es ist kalt.", "🥶"], ["die Hitze", "heiß", "Es ist heiß.", "🥵"], ["die Wärme", "warm", "Es ist warm.", "🌤️"], ["das Gewitter", "—", "Es gibt ein Gewitter.", "⛈️"]];
function genWetterPaar() {
  const P = WPAIR.filter((p) => p[1] !== "—"), [n, a, s] = rnd(P), dir = Math.random() < 0.5;
  const ans = dir ? a : n, opts = shuffle(P.filter((p) => p[0] !== n).map((p) => (dir ? p[1] : p[0]))).slice(0, 3);
  return { kind: "mc", mode: "rec", task: dir ? "Съществително → прилагателно/глагол" : "Прилагателно/глагол → съществително", prompt: `<div class="exw">${esc(dir ? n : a)} → ___</div>`, options: shuffle([ans, ...opts]), answer: ans, say: `${n} – ${a}`, full: s, keys: true,
    explain: `<b>${esc(n)}</b> ↔ <b>${esc(a)}</b> → <i>${esc(s)}</i>. Окончания: <b>-ig</b> (sonnig, neblig), <b>-isch</b> (stürmisch); kalt → die K<b>ä</b>lte, warm → die W<b>ä</b>rme (умлаут); глаголи: es regnet, es schneit (винаги с <b>es</b>).` };
}
const WCITY = [["Athen", "Атина"], ["Berlin", "Берлин"], ["Sofia", "София"], ["Rom", "Рим"], ["Wien", "Виена"], ["Paris", "Париж"], ["Hamburg", "Хамбург"], ["München", "Мюнхен"], ["Oslo", "Осло"], ["Madrid", "Мадрид"]];
function genWetterBild() {
  const [n, , s, ic] = rnd(WPAIR), [c, cbg] = rnd(WCITY), t = ic === "🥶" || ic === "❄️" ? -((Math.random() * 8) | 0) - 1 : ic === "🥵" ? 32 + ((Math.random() * 6) | 0) : 8 + ((Math.random() * 18) | 0);
  const ans = `In ${c} ${s.replace(/^Es (ist|regnet|schneit|gibt)/, (m, v) => (v === "ist" ? "ist es" : v === "gibt" ? "gibt es" : v + " es"))}`;
  if (Math.random() < 0.5) return { kind: "mc", mode: "rec", task: `Wie ist das Wetter in ${esc(c)}?`, prompt: `<div style="font-size:64px;text-align:center">${ic}</div><div class="meta" style="text-align:center">${t} Grad</div>`, options: shuffle([s, ...shuffle(WPAIR.filter((p) => p[2] !== s).map((p) => p[2])).slice(0, 3)]), answer: s, say: s, full: s, keys: true,
    explain: `${ic} = <b>${esc(s)}</b> (${esc(n)}). Времето винаги с <b>es</b>: Es ist + прилагателно · Es regnet / Es schneit · Es gibt ein Gewitter. Температура: <i>Die Temperaturen liegen bei ${t} Grad.</i>` };
  return { kind: "type", mode: "use", task: `Wie ist das Wetter in ${esc(c)}? Напиши цяло изречение`, prompt: `<div style="font-size:56px;text-align:center">${ic}</div><div class="meta" style="text-align:center">${esc(cbg)}</div>`, answer: ans, say: ans, full: ans, long: true, hint: `In ${c} …`,
    check: (v) => CK.checkDe(v, ans, { alts: [`${s.replace(/\.$/, "")} in ${c}.`] }), explain: `След <b>In ${esc(c)}</b> (1-во място) глаголът е 2-ри, а <b>es</b> минава след него: In ${esc(c)} <b>ist es</b> sonnig / <b>regnet es</b>.` };
}
const JZ = [["Im ___ schneit es oft.", "Winter"], ["Im ___ ist es heiß.", "Sommer"], ["Im ___ blühen die Blumen.", "Frühling"], ["Im ___ ist es stürmisch und neblig.", "Herbst"], ["Im ___ fahren wir an den Strand.", "Sommer"], ["Im ___ fahren wir Ski.", "Winter"], ["Im ___ fallen die Blätter.", "Herbst"], ["Im ___ wird es wieder warm.", "Frühling"]];
function genJahreszeit() {
  const [s, a] = rnd(JZ), full = s.replace("___", a);
  return { kind: "mc", mode: "rec", task: "Кой сезон?", prompt: `<div class="exs">${esc(s)}</div>`, options: ["Frühling", "Sommer", "Herbst", "Winter"], answer: a, say: full, full, keys: true,
    explain: `Сезоните са <b>der</b>: der Frühling (= das Frühjahr), der Sommer, der Herbst, der Winter. Кога? → <b>im</b> (in dem) Winter.` };
}
// wohin? (Akk) / wo? (Dat) — дестинации
const ZIEL = [["Italien", "nach Italien", "in Italien", "държава без член → <b>nach</b> (накъде) / <b>in</b> (къде)"], ["Berlin", "nach Berlin", "in Berlin", "град → <b>nach</b> / <b>in</b>"], ["die Schweiz", "in die Schweiz", "in der Schweiz", "държава с член → <b>in die</b> (Akk) / <b>in der</b> (Dat)"],
  ["die Türkei", "in die Türkei", "in der Türkei", "държава с член → in die / in der"], ["die USA", "in die USA", "in den USA", "мн.ч. → in die (Akk) / in den (Dat)"], ["die Nordsee", "an die Nordsee", "an der Nordsee", "море, бряг → <b>an</b>"],
  ["die Ostsee", "an die Ostsee", "an der Ostsee", "море → an"], ["das Meer", "ans Meer", "am Meer", "море → an: ans (an das) / am (an dem)"], ["der Strand", "an den Strand", "am Strand", "плаж → an: an den / am"],
  ["eine Insel", "auf eine Insel", "auf einer Insel", "остров → <b>auf</b>"], ["die Berge", "in die Berge", "in den Bergen", "планина → in die Berge / in den Bergen (+n в Dat. мн.ч.)"], ["der Arzt", "zum Arzt", "beim Arzt", "човек → <b>zu</b> (накъде) / <b>bei</b> (къде)"]];
function genWohin() {
  const [z, wohin, wo, why] = rnd(ZIEL), q = Math.random() < 0.6;
  const s = q ? `Im Sommer fahren wir ___. (${z})` : `Wir sind im Urlaub ___. (${z})`, ans = q ? wohin : wo, full = s.replace("___", ans).replace(/\s*\([^)]*\)/, "");
  const opts = [...new Set([wohin, wo, ...shuffle(ZIEL.filter((x) => x[0] !== z)).slice(0, 2).map((x) => (q ? x[1] : x[2]).replace(x[0].replace(/^(der|die|das|eine) /, ""), z.replace(/^(der|die|das|eine) /, "")))])];
  return { kind: "mc", mode: "use", errCat: "prep", task: q ? "Wohin? (накъде — Akkusativ)" : "Wo? (къде — Dativ)", prompt: `<div class="exs">${esc(s)}</div>`, options: shuffle(opts.slice(0, 4)), answer: ans, say: full, full, keys: true,
    explain: `${why}. <b>Wohin?</b> (движение) → <b>${esc(wohin)}</b> · <b>Wo?</b> (място) → <b>${esc(wo)}</b>.` };
}
// куфарът: Akkusativ с ein
const PACK17 = ["Badehose", "Anzug", "Hemd", "T-Shirt", "Regenjacke", "Schlafanzug", "Bikini", "Rock", "Bluse", "Pullover", "Strumpfhose", "Nachthemd", "Kleid", "Hose", "Mantel", "Sonnencreme", "Fotoapparat", "Regenschirm", "Strickjacke", "Sonnenbrille", "Rucksack", "Koffer", "Pass"];
function genKoffer() {
  const it = ITEMS.find((i) => i.type === "noun" && i.de === rnd(PACK17) && ["der", "die", "das"].includes(i.art)); if (!it) return genWohin();
  const a = { der: "einen", die: "eine", das: "ein" }[it.art], full = `Ich packe ${a} ${it.de} ein.`;
  return { kind: "mc", mode: "use", errCat: "case", item: it, task: "Какво слагаш в куфара? (Akkusativ)", prompt: `<div class="exs">Ich packe ___ ${esc(it.de)} ein.</div><div class="meta">${esc(it.bg)}</div>`, options: ["einen", "eine", "ein", "einem"], answer: a, say: full, full, keys: true,
    explain: `einpacken + <b>Akkusativ</b> (какво?). ${it.art} ${esc(it.de)} → <b>${a}</b>${it.art === "der" ? " — само мъжкият род се променя: ein → einen" : " — не се променя"}.` };
}
// denn (нормален ред) / weil (глаголът в края)
const DW = [["Ich fahre nicht ans Meer", "ich", "hasse", "die Hitze", "Не ходя на море, защото мразя жегата."], ["Wir bleiben zu Hause", "es", "regnet", "heute", "Оставаме вкъщи, защото днес вали."], ["Ich nehme einen Regenschirm mit", "es", "gibt", "heute Regenschauer", "Вземам чадър, защото днес има превалявания."],
  ["Er trägt einen Mantel", "es", "ist", "sehr kalt", "Той носи палто, защото е много студено."], ["Wir fahren in die Berge", "wir", "lieben", "den Schnee", "Отиваме в планината, защото обичаме снега."], ["Sie bleibt im Bett", "sie", "ist", "krank", "Тя остава в леглото, защото е болна."],
  ["Ich kaufe Sonnencreme", "die Sonne", "scheint", "sehr stark", "Купувам слънцезащитен крем, защото слънцето грее силно."], ["Ich mag den Herbst nicht", "es", "ist", "oft neblig", "Не обичам есента, защото често е мъгливо."]];
function genDenn() {
  const [m, s, v, r, bg] = rnd(DW), useDenn = Math.random() < 0.5, ans = useDenn ? `${m}, denn ${s} ${v} ${r}.` : `${m}, weil ${s} ${r} ${v}.`;
  const wrong = useDenn ? [`${m}, denn ${s} ${r} ${v}.`, `${m}, denn ${v} ${s} ${r}.`] : [`${m}, weil ${s} ${v} ${r}.`, `${m}, weil ${v} ${s} ${r}.`];
  return { kind: "mc", mode: "use", errCat: "verbpos", task: `Свържи с <b>${useDenn ? "denn" : "weil"}</b> — кой ред е правилен?`, prompt: `<div class="meta" style="font-size:16px">${esc(bg)}</div>`, options: shuffle([ans, ...wrong]), answer: ans, say: ans, full: ans, bg,
    explain: useDenn ? "<b>denn</b> е на позиция 0 — не заема място, след него <b>нормален ред</b>: подлог → глагол (… denn ich hasse …)." : "<b>weil</b> праща спрегнатия глагол <b>в края</b> (… weil ich die Hitze hasse). Смисълът е същият като denn." };
}
// lassen
const LASS = [["Ich ___ mir die Haare schneiden.", 0, "lasse"], ["Du ___ das Auto reparieren.", 1, "lässt"], ["Er ___ den Koffer im Hotel.", 2, "lässt"], ["Wir ___ die Kinder bei Oma.", 3, "lassen"], ["Ihr ___ mich nie in Ruhe!", 4, "lasst"], ["Sie ___ das Handy zu Hause.", 5, "lassen"]];
const LASSF = ["lasse", "lässt", "lässt", "lassen", "lasst", "lassen"];
function genLassen() {
  if (Math.random() < 0.3) { const [d, ans] = rnd([["du", "Lass"], ["ihr", "Lasst"], ["Sie", "Lassen Sie"]]); const full = `${ans} mich in Ruhe!`;
    return { kind: "mc", task: `Imperativ (${d}): ___ mich in Ruhe!`, prompt: `<div class="exs">___ mich in Ruhe! (${d})</div>`, options: ["Lass", "Lasst", "Lassen Sie", "Lässt"], answer: ans, say: full, full, keys: true, explain: "Imperativ: du lässt → <b>Lass!</b> (без умлаут и без -st) · ihr → <b>Lasst!</b> · Sie → <b>Lassen Sie!</b>" }; }
  const [s, i, ans] = rnd(LASS), full = s.replace("___", ans);
  return { kind: "mc", errCat: "conj", task: "lassen: коя форма?", prompt: `<div class="exs">${esc(s)}</div>`, options: [...new Set(LASSF)], answer: ans, say: full, full, keys: true,
    explain: `lassen: ich lasse, du <b>lässt</b>, er <b>lässt</b> (a → ä), wir lassen, ihr lasst, sie lassen. <b>lassen + инфинитив</b> = някой друг го прави за мен: Ich lasse mir die Haare schneiden.` };
}
// Dativ-глаголи с хора: helfen, gratulieren, danken, antworten
const DPERS = [["der", "Mann", "Männern"], ["die", "Frau", "Frauen"], ["das", "Kind", "Kindern"], ["die", "Schwester", "Schwestern"], ["der", "Bruder", "Brüdern"], ["die", "Mutter", "Müttern"], ["der", "Vater", "Vätern"], ["die", "Lehrerin", "Lehrerinnen"], ["der", "Freund", "Freunden"], ["die", "Freundin", "Freundinnen"], ["das", "Geburtstagskind", "Geburtstagskindern"]];
const DVERB = [["Ich helfe ___.", "Помагам на", "helfen"], ["Wir gratulieren ___.", "Честитим на", "gratulieren"], ["Ich danke ___.", "Благодаря на", "danken"], ["Das Kleid gefällt ___.", "Роклята харесва на", "gefallen"], ["Der Kuchen schmeckt ___.", "Тортата е вкусна на", "schmecken"], ["Das Fahrrad gehört ___.", "Колелото е на", "gehören"]];
function genDativVerb() {
  const [g, n, pl] = rnd(DPERS), [s, , v] = rnd(DVERB), typ = rnd(["def", "indef", "poss", "pl"]);
  const D = { der: ["dem", "einem", "meinem"], das: ["dem", "einem", "meinem"], die: ["der", "einer", "meiner"] };
  const np = typ === "pl" ? `den ${pl}` : `${D[g][{ def: 0, indef: 1, poss: 2 }[typ]]} ${n}`, ans = np.split(" ")[0], full = s.replace("___", np);
  const shown = typ === "pl" ? s.replace("___", `___ ${pl}`) : s.replace("___", `___ ${n}`);
  const pool = typ === "pl" ? ["den", "die", "dem", "der"] : typ === "def" ? ["dem", "der", "den", "die"] : typ === "indef" ? ["einem", "einer", "einen", "eine"] : ["meinem", "meiner", "meinen", "meine"];
  const why = `<b>${esc(v)}</b> + <b>Dativ</b> (на кого? → wem?). ${typ === "pl" ? "Мн.ч. Dativ: <b>den</b> + съществителното с <b>-n</b>: den Kinder<b>n</b>." : g === "die" ? "Женски род в Dativ: der / einer / keiner / meiner." : "Мъжки и среден род в Dativ: dem / einem / keinem / meinem."}`;
  return { kind: "mc", mode: "use", errCat: "case", task: "Dativ: попълни члена", prompt: `<div class="exs">${esc(shown)}</div><div class="meta">${typ === "pl" ? "мн.ч." : g + " " + n}</div>`, options: shuffle(pool), answer: ans, say: full, full, keys: true, explain: why };
}
// дрехи + gefallen/passen: глаголът се съгласува с дрехата!
const KLEID = [["Der Rock", "s"], ["Die Bluse", "s"], ["Das Kleid", "s"], ["Der Mantel", "s"], ["Die Jeans", "p"], ["Die Schuhe", "p"], ["Die Turnschuhe", "p"], ["Das Hemd", "s"], ["Die Hose", "s"], ["Die Socken", "p"]];
function genKleidVerb() {
  const [k, n] = rnd(KLEID), [pr, pbg] = rnd([["mir", "ми"], ["dir", "ти"], ["ihm", "му"], ["ihr", "ѝ"], ["uns", "ни"], ["Ihnen", "Ви"]]), v = rnd(["gefallen", "passen"]);
  const ans = v === "gefallen" ? (n === "s" ? "gefällt" : "gefallen") : n === "s" ? "passt" : "passen", full = `${k} ${ans} ${pr} nicht.`;
  return { kind: "mc", mode: "use", errCat: "conj", task: `${v}: коя форма?`, prompt: `<div class="exs">${esc(k)} ___ ${esc(pr)} nicht.</div>`, options: v === "gefallen" ? ["gefällt", "gefallen", "gefalle", "gefallt"] : ["passt", "passen", "passe", "passst"].slice(0, 3), answer: ans, say: full, full, keys: true,
    explain: `Подлогът е <b>дрехата</b> (${esc(k)}${n === "p" ? " — мн.ч." : ""}), не човекът! Човекът е в <b>Dativ</b> (${esc(pr)} = ${pbg}). ${n === "s" ? "ед.ч. → gefällt / passt" : "мн.ч. → gefallen / passen"}.` };
}
EX_TYPES.push(
  { k: "wetterpaar", skill: "Думи", ic: "🌦️", t: "die Sonne → sonnig (времето)", d: "der Nebel → neblig", gen: genWetterPaar },
  { k: "wetterbild", skill: "Думи", ic: "☀️", t: "Wie ist das Wetter?", d: "☁️ → Es ist bewölkt.", gen: genWetterBild },
  { k: "jahreszeit", skill: "Думи", ic: "🍂", t: "Сезоните: im Winter …", d: "Im ___ schneit es. → Winter", gen: genJahreszeit },
  { k: "wohin", skill: "Граматика", ic: "🧳", t: "Wohin? nach / in die / an die / auf", d: "Wir fahren ___. (die Schweiz) → in die Schweiz", gen: genWohin },
  { k: "koffer", skill: "Граматика", ic: "🎒", t: "Куфарът: Ich packe einen/eine/ein …", d: "Ich packe ___ Mantel ein. → einen", gen: genKoffer },
  { k: "denn", skill: "Глаголи и словоред", ic: "🔗", t: "denn или weil? (словоред)", d: "…, denn ich hasse die Hitze.", gen: genDenn },
  { k: "lassen", skill: "Глаголи и словоред", ic: "✂️", t: "lassen: ich lasse, du lässt, Lass!", d: "Ich ___ mir die Haare schneiden.", gen: genLassen },
  { k: "dativverb", skill: "Граматика", ic: "🎁", t: "Dativ: Ich helfe dem Mann / meiner Schwester", d: "Ich gratuliere ___ Kind. → dem", gen: genDativVerb },
  { k: "kleidverb", skill: "Граматика", ic: "👗", t: "Die Hose passt mir / Die Schuhe gefallen mir", d: "Die Jeans ___ mir nicht. → passen", gen: genKleidVerb },
);
Object.assign(EX_CAT, { wohin: "prep", koffer: "case", denn: "verbpos", lassen: "conj", dativverb: "case", kleidverb: "conj" });
Object.assign(CAT_EX, { case: [...CAT_EX.case, "dativverb", "koffer"], prep: [...CAT_EX.prep, "wohin"], verbpos: [...CAT_EX.verbpos, "denn"] });
wrapGens();
function ex17Texts() {
  const out = [];
  WPAIR.forEach(([n, a, s]) => { out.push(s, `${n} – ${a}`); WCITY.forEach(([c]) => out.push(`In ${c} ${s.replace(/^Es (ist|regnet|schneit|gibt)/, (m, v) => (v === "ist" ? "ist es" : v === "gibt" ? "gibt es" : v + " es"))}`)); });
  JZ.forEach(([s, a]) => out.push(s.replace("___", a)));
  ZIEL.forEach(([, wohin, wo]) => out.push(`Im Sommer fahren wir ${wohin}.`, `Wir sind im Urlaub ${wo}.`));
  PACK17.forEach((d) => { const it = ITEMS.find((i) => i.type === "noun" && i.de === d && i.art); if (it) out.push(`Ich packe ${{ der: "einen", die: "eine", das: "ein" }[it.art]} ${d} ein.`); });
  DW.forEach(([m, s, v, r]) => out.push(`${m}, denn ${s} ${v} ${r}.`, `${m}, weil ${s} ${r} ${v}.`));
  LASS.forEach(([s, , a]) => out.push(s.replace("___", a))); ["Lass", "Lasst", "Lassen Sie"].forEach((x) => out.push(`${x} mich in Ruhe!`));
  return out;
}
UNIT_MAP[17] = { g: ["wetter", "denn", "wohin", "dativ", "lassen"], ex: ["wetterpaar", "wetterbild", "jahreszeit", "wohin", "koffer", "denn", "lassen", "dativverb", "kleidverb", "modal", "dativart"] };
G2EX.wetter = ["wetterpaar", "wetterbild", "jahreszeit"]; G2EX.denn = ["denn"]; G2EX.wohin = ["wohin", "koffer"]; G2EX.lassen = ["lassen"]; G2EX.dativ = [...new Set([...(G2EX.dativ || []), "dativverb", "kleidverb"])];
UNITS.forEach((U) => { U.g = ((UNIT_MAP[U.id] || {}).g || []).filter((id) => GRAMMAR.some((x) => x.id === id)); U.ex = ((UNIT_MAP[U.id] || {}).ex || []).filter(exByK); });
