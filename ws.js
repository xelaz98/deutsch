// ───────── ТАБЛИЦИ „КАТО В УЧЕБНИКА“ + РАБОТНИ ЛИСТОВЕ + ТЪРСЕНЕ ─────────
// Цветове: ge-/-te- = синьо, представката = лилаво, окончанието = зелено, сменената гласна = жълто.
Object.assign(PERF, { gesungen: ["singen", "h", "s"], geführt: ["führen", "h", "w"], gesprochen: PERF.gesprochen || ["sprechen", "h", "s"], gefunden: ["finden", "h", "s"], bestellt: ["bestellen", "h", "ins"], geparkt: ["parken", "h", "w"], getanzt: ["tanzen", "h", "w"],
  geraucht: ["rauchen", "h", "w"], gelebt: ["leben", "h", "w"], gelandet: ["landen", "s", "wt"], bekommen: PERF.bekommen || ["bekommen", "h", "ins"], gewohnt: PERF.gewohnt || ["wohnen", "h", "w"] });
const mk = (cls, t) => `<span class="m-${cls}">${esc(t)}</span>`;
const SEPS = ["zurück", "weiter", "schief", "fern", "auf", "aus", "ein", "mit", "an", "ab", "zu", "vor", "nach", "weg", "los", "weh", "spazieren"];
// Partizip II с оцветени части
function partHTML(part) {
  const P = PERF[part], rule = P ? P[2] : /^ge/.test(part) ? "w" : "ins", inf = P ? P[0] : "";
  const endM = part.match(/(et|t|en)$/), end = endM ? endM[1] : "", body = part.slice(0, part.length - end.length);
  if (rule === "sep") { const p = SEPS.find((x) => inf.startsWith(x) && part.startsWith(x)) || ""; const rest = body.slice(p.length); return mk("pre", p) + (rest.startsWith("ge") ? mk("ge", "ge") + esc(rest.slice(2)) : esc(rest)) + mk("end", end); }
  if (rule === "ins" || rule === "ier") return esc(body) + mk("end", end);
  return body.startsWith("ge") ? mk("ge", "ge") + esc(body.slice(2)) + mk("end", end) : esc(body) + mk("end", end);
}
// Präsens: окончанието в зелено (при разделими — представката в синьо)
function presHTML(f) { const [v, p] = f.split(" "); const m = v.match(/^(.*?)(est|st|et|en|e|t|n)$/); const core = m && m[1].length >= 2 ? esc(m[1]) + mk("end", m[2]) : esc(v); return core + (p ? " " + mk("pre", p) : ""); }
function praetHTML(inf, i) { const f = praetF(inf, i), [v, p] = f.split(" "), weak = isWeak3(inf); const s = V3[inf][0].split(" ")[0], rest = v.slice(s.length);
  const stem = weak ? esc(s.replace(/(e?te)$/, "")) + mk("ge", s.match(/(e?te)$/)[1]) : mk("vow", s); return stem + (rest ? mk("end", rest) : "") + (p ? " " + mk("pre", p) : ""); }
const PERS7 = ["ich", "du", "er/sie/es", "wir", "ihr", "sie", "Sie"], IDX7 = [0, 1, 2, 3, 4, 5, 5];
// пълна таблица за един глагол: Präsens · Präteritum · Perfekt + защо
function verbMorphHTML(it) {
  if (!it || it.type !== "verb" || !it.forms) return "";
  const inf = it.de, v3 = typeof V3 !== "undefined" && V3[inf], partE = Object.entries(PERF).find(([, P]) => P[0] === inf), part = v3 ? v3[2] : partE && partE[0];
  const hs = v3 ? v3[1] : partE ? partE[1][1] : null, P = part && PERF[part];
  const rows = PERS7.map((p, k) => { const i = IDX7[k]; return `<tr><td>${p}</td><td>${presHTML(it.forms[i])}</td>${v3 ? `<td>${praetHTML(inf, i)}</td>` : ""}${part ? `<td>${AUXF[hs][i]} ${partHTML(part)}</td>` : ""}</tr>`; }).join("");
  const why = [];
  why.push(`<b>Präsens:</b> корен <b>${esc(inf.replace(/e?n$/, "").replace(new RegExp(`^(${SEPS.join("|")})`), ""))}-</b> + окончание (-e, -st, -t, -en, -t, -en)${it.forms[2] && !/^(.*)(t)$/.test(it.forms[2].split(" ")[0]) ? "" : ""}${it.forms.some((f) => f.includes(" ")) ? ". Разделим глагол — представката отива в края на изречението" : ""}${it.note && /→/.test(it.note) ? `. ${esc(it.note.split("·")[0])}` : ""}.`);
  if (v3) why.push(`<b>Präteritum:</b> ${praetWhy(inf)}`);
  if (P) why.push(`<b>Perfekt:</b> ${PERF_AUX[hs]}; Partizip II = ${PERF_RULE[P[2]]}.`);
  return `<h4>Как се образува <span class="muted">(синьо: ge- и -te- · лилаво: представка · зелено: окончание · жълто: нова гласна)</span></h4>
    <table class="g mt"><tr><th></th><th>Präsens</th>${v3 ? "<th>Präteritum</th>" : ""}${part ? "<th>Perfekt</th>" : ""}</tr>${rows}</table>
    <ul class="mwhy">${why.map((w) => `<li>${w}</li>`).join("")}</ul>`;
}
// таблица като в учебника за няколко глагола в Perfekt
function perfTable(cols) {
  return `<table class="g mt"><tr><th></th>${cols.map(([h]) => `<th>${h}</th>`).join("")}</tr>${PERS7.map((p, k) => `<tr${k === 6 ? ' class="sie"' : ""}><td>${p}</td>${cols.map(([, part]) => `<td>${AUXF[PERF[part][1]][IDX7[k]]} ${partHTML(part)}</td>`).join("")}</tr>`).join("")}</table>`;
}
GRAMMAR.push({
  id: "perfektbildung", title: "Perfekt: как се образува Partizip II (таблици)", icon: "🧮",
  get html() { return `
<p>Perfekt = <b>haben/sein</b> (спрегнато, на 2-ро място) + <b>Partizip II</b> (в края). Помощният глагол се спряга, <b>Partizip II никога не се променя</b> — една форма за всички лица.</p>
<h4>1. Правилни (слаби) глаголи: ${mk("ge", "ge")}…${mk("end", "t")}</h4>
${perfTable([["без представка<br><small>wohnen</small>", "gewohnt"], ["разделима представка<br><small>einkaufen</small>", "eingekauft"], ["неразделима представка<br><small>bezahlen</small>", "bezahlt"]])}
<table class="g"><tr><th>случай</th><th>правило</th><th>примери</th></tr>
<tr><td>без представка</td><td>${mk("ge", "ge")} + корен + ${mk("end", "t")}</td><td>${partHTML("gewohnt")}, ${partHTML("gemacht")}, ${partHTML("gekauft")}, ${partHTML("gelernt")}</td></tr>
<tr><td>корен на -t / -d</td><td>${mk("ge", "ge")} + корен + ${mk("end", "et")} (иначе не се изговаря)</td><td>arbeiten → ${partHTML("gearbeitet")} · landen → ${partHTML("gelandet")} · senden → ${partHTML("gesendet")}</td></tr>
<tr><td>разделим (an-, auf-, ein-, aus-…)</td><td>представка + ${mk("ge", "ge")} + корен + ${mk("end", "t")} — <b>ge е в средата</b></td><td>${partHTML("eingekauft")}, ${partHTML("eingeschaltet")}, ${partHTML("abgesagt")}</td></tr>
<tr><td>неразделим (be-, ver-, er-, über-, ent-, ge-, miss-, zer-)</td><td><b>без ge-</b>: корен + ${mk("end", "t")}</td><td>${partHTML("bezahlt")}, ${partHTML("vereinbart")}, ${partHTML("übersetzt")}, ${partHTML("begrüßt")}</td></tr>
<tr><td>на -ieren</td><td><b>без ge-</b>: корен + ${mk("end", "t")}</td><td>${partHTML("studiert")}, ${partHTML("kopiert")}, ${partHTML("telefoniert")}, ${partHTML("repariert")}</td></tr></table>
<p class="tip">🔎 Защо без ge- при be-/ver-/-ieren? Ударението не е на първата сричка (be<b>zah</b>len, stu<b>die</b>ren) — немският не слага ge- пред неударена сричка.</p>
<h4>2. Неправилни (силни) глаголи: ${mk("ge", "ge")}…${mk("end", "en")}, често с нова гласна</h4>
${perfTable([["без представка<br><small>schlafen</small>", "geschlafen"], ["разделима представка<br><small>anrufen</small>", "angerufen"], ["неразделима представка<br><small>beginnen</small>", "begonnen"]])}
<p class="tip">⚠️ В учебника (стр. 134) в таблицата за schlafen пише „wir/ihr/sie <b>sind</b> geschlafen“ — това е печатна грешка. schlafen е с <b>haben</b> за всички лица: wir <b>haben</b> geschlafen.</p>
<table class="g"><tr><th>инфинитив</th><th>Partizip II</th><th>какво се променя</th></tr>
<tr><td>schreiben</td><td>${partHTML("geschrieben")}</td><td>ei → ie</td></tr><tr><td>trinken</td><td>${partHTML("getrunken")}</td><td>i → u</td></tr><tr><td>finden</td><td>${partHTML("gefunden")}</td><td>i → u</td></tr>
<tr><td>gehen</td><td>${partHTML("gegangen")}</td><td>e → a + ng</td></tr><tr><td>sprechen</td><td>${partHTML("gesprochen")}</td><td>e → o</td></tr><tr><td>lesen, sehen, essen, fahren, schlafen</td><td>${partHTML("gelesen")}, ${partHTML("gesehen")}, ${partHTML("gegessen")}, ${partHTML("gefahren")}, ${partHTML("geschlafen")}</td><td>гласната остава</td></tr>
<tr><td>aufstehen, ankommen</td><td>${partHTML("aufgestanden")}, ${partHTML("angekommen")}</td><td>разделими: ge в средата</td></tr><tr><td>beginnen, vergessen</td><td>${partHTML("begonnen")}, ${partHTML("vergessen")}</td><td>неразделими: без ge-</td></tr></table>
<h4>3. haben или sein? — проверявай в този ред</h4>
<ol><li>Движение от точка А до точка Б? (gehen, fahren, fliegen, laufen, kommen, ankommen) → <b>sein</b></li>
<li>Промяна на състоянието? (aufstehen, einschlafen, aufwachen, sterben, werden) → <b>sein</b></li>
<li>sein и bleiben → <b>sein</b> (ist gewesen, ist geblieben)</li><li>Всичко друго → <b>haben</b> (≈ 90% от глаголите)</li></ol>
<p class="tip">💡 Учи всеки нов глагол с трите форми наведнъж: <i>fahren – fuhr – <b>ist</b> gefahren</i>. Отвори всеки глагол в Речника — там има таблица като тази точно за него.</p>`; },
});
UNIT_MAP[14] && UNIT_MAP[14].g.splice(UNIT_MAP[14].g.indexOf("perfekt") + 1, 0, "perfektbildung");
UNITS.forEach((U) => { U.g = ((UNIT_MAP[U.id] || {}).g || []).filter((id) => GRAMMAR.some((x) => x.id === id)); });
G2EX.perfektbildung = ["ws:c6a", "ws:c6b", "ws:c7", "ws:c8", "partizip", "perfhs", "perftype"];

// ═════════ РАБОТНИ ЛИСТОВЕ (като в учебника: целият списък, проверка накрая) ═════════
// item: [задача, отговор, [други верни отговори]]
const WS = [
  { id: "c6a", src: "C6a", topic: "perfektbildung", title: "Was ist gestern passiert? — без представка", instr: "Състави изречения в Perfekt.", ex: ["wir – die Vokabeln – lernen", "Wir haben die Vokabeln gelernt."], items: [
    ["ich – den ganzen Tag – hart arbeiten", "Ich habe den ganzen Tag hart gearbeitet."], ["ich – keine Hausaufgaben – machen", "Ich habe keine Hausaufgaben gemacht."],
    ["die Sekretärin – ein Hotelzimmer – buchen", "Die Sekretärin hat ein Hotelzimmer gebucht."], ["Hans – das Computerproblem – lösen", "Hans hat das Computerproblem gelöst."],
    ["wir – im Konzert – fantastische Musik – hören", "Wir haben im Konzert fantastische Musik gehört."], ["ich – mein Auto – im Parkverbot – parken", "Ich habe mein Auto im Parkverbot geparkt."],
    ["Frau und Herr Schmalz – die ganze Nacht – Walzer – tanzen", "Frau und Herr Schmalz haben die ganze Nacht Walzer getanzt."],
    ["Herr Klein – E-Mail – um 18.30 Uhr – senden", "Herr Klein hat die E-Mail um 18.30 Uhr gesendet.", ["Herr Klein hat um 18.30 Uhr eine E-Mail gesendet.", "Herr Klein hat eine E-Mail um 18.30 Uhr gesendet.", "Herr Klein hat um 18.30 Uhr die E-Mail gesendet."]],
    ["der Chef – für seine Frau – Blumen – kaufen", "Der Chef hat für seine Frau Blumen gekauft."], ["wir – mit Susanne – ein Gespräch – führen", "Wir haben mit Susanne ein Gespräch geführt."],
    ["sie (мн.ч.) – im Hotel – frühstücken", "Sie haben im Hotel gefrühstückt."], ["Anton – in Frankfurt – wohnen", "Anton hat in Frankfurt gewohnt."],
    ["ich – die E-Mail – gestern – löschen", "Ich habe die E-Mail gestern gelöscht.", ["Ich habe gestern die E-Mail gelöscht."]], ["Klara – 3 Jahre – in Spanien – leben", "Klara hat 3 Jahre in Spanien gelebt.", ["Klara hat drei Jahre in Spanien gelebt."]],
    ["Marianne – früher – 20 Zigaretten am Tag – rauchen", "Marianne hat früher 20 Zigaretten am Tag geraucht."], ["Martin – zum Abendessen – Spaghetti – kochen", "Martin hat zum Abendessen Spaghetti gekocht."]] },
  { id: "c6b", src: "C6b", topic: "perfektbildung", title: "Was ist gestern passiert? — с представка", instr: "Състави изречения в Perfekt. Внимание: разделима или неразделима е представката?", items: [
    ["Herr Krause – seine Rechnung – nicht bezahlen", "Herr Krause hat seine Rechnung nicht bezahlt."], ["ich – einen Termin mit Frau Kümmel – vereinbaren", "Ich habe einen Termin mit Frau Kümmel vereinbart."],
    ["Peter – schon – ein Bier – bestellen", "Peter hat schon ein Bier bestellt."], ["Martin – den Brief – schon – übersetzen", "Martin hat den Brief schon übersetzt.", ["Martin hat schon den Brief übersetzt."]],
    ["Herr Feuerstein – die Gäste – begrüßen", "Herr Feuerstein hat die Gäste begrüßt."], ["Oma – den Fernseher – einschalten", "Oma hat den Fernseher eingeschaltet."], ["Kurt – Fleisch und Gemüse – einkaufen", "Kurt hat Fleisch und Gemüse eingekauft."]] },
  { id: "c7", src: "C7", topic: "perfektbildung", title: "Неправилни глаголи: помощен глагол", instr: "Напиши лицето + помощния глагол + Partizip II.", ex: ["wir – gekommen", "wir sind gekommen"], items: [
    ["er – gelesen", "er hat gelesen"], ["ihr – geschrieben", "ihr habt geschrieben"], ["er – angefangen", "er hat angefangen"], ["wir – gesungen", "wir haben gesungen"], ["sie (тя) – gesprochen", "sie hat gesprochen"],
    ["er – gegessen", "er hat gegessen"], ["er – aufgestanden", "er ist aufgestanden"], ["du – getrunken", "du hast getrunken"], ["du – geschlafen", "du hast geschlafen"], ["sie (те) – gesehen", "sie haben gesehen"],
    ["ihr – angekommen", "ihr seid angekommen"], ["er – gelaufen", "er ist gelaufen"], ["ich – ferngesehen", "ich habe ferngesehen"], ["du – gegangen", "du bist gegangen"], ["wir – begonnen", "wir haben begonnen"]] },
  { id: "c8", src: "C8", topic: "perfektbildung", title: "Помощен глагол + Partizip II", instr: "Напиши двете липсващи думи: помощния глагол и Partizip II.", ex: ["Wir ___ mit dem Bus ___. (fahren)", "sind gefahren"], items: [
    ["Er ___ zum Frühstück nur Joghurt ___. (essen)", "hat gegessen"], ["Wir ___ erst um 24.00 Uhr ins Bett ___. (gehen)", "sind gegangen"], ["Herr Feuerstein ___ abends fünf Bier ___. (trinken)", "hat getrunken"],
    ["Wir ___ im Hotel Monaco nur eine Nacht ___. (bleiben)", "sind geblieben"], ["Ich ___ heute schon 30 E-Mails ___. (schreiben)", "habe geschrieben"], ["___ du meinen Kugelschreiber ___? (finden)", "Hast gefunden"],
    ["Wann ___ die Besprechung ___? (beginnen)", "hat begonnen"], ["Der Chor ___ schöne Lieder ___. (singen)", "hat gesungen"], ["Wie viele Stunden ___ du diese Nacht ___? (schlafen)", "hast geschlafen"],
    ["Wann ___ Paul Feuerstein auf dem Flughafen ___? (ankommen)", "ist angekommen"], ["Das Buch ___ ich schon ___. (lesen)", "habe gelesen"], ["Oma ___ den Film schon zehnmal ___. (sehen)", "hat gesehen"]] },
  { id: "c9", src: "C9", topic: "perfekt", title: "Отговори с цяло изречение", instr: "Отговори в Perfekt с информацията в скобите.", ex: ["Wie lange bist du gefahren? (drei Stunden)", "Ich bin drei Stunden gefahren."], items: [
    ["Wann seid ihr angekommen? (14.55 Uhr)", "Wir sind um 14.55 Uhr angekommen."], ["Wann hast du mich angerufen? (gestern Abend)", "Ich habe dich gestern Abend angerufen."],
    ["Wann haben Sie den Brief erhalten? (am Mittwoch)", "Ich habe den Brief am Mittwoch erhalten."], ["Wie lange sind Sie spazieren gegangen? (30 Minuten)", "Ich bin 30 Minuten spazieren gegangen."],
    ["Wann seid ihr heute aufgestanden? (6.00 Uhr)", "Wir sind heute um 6.00 Uhr aufgestanden."], ["Wann hat das Konzert angefangen? (20.15 Uhr)", "Das Konzert hat um 20.15 Uhr angefangen."],
    ["Wie viel Geld hast du bekommen? (1000 Euro)", "Ich habe 1000 Euro bekommen."], ["Wie viele Meter bist du gelaufen? (2000 Meter)", "Ich bin 2000 Meter gelaufen."]] },
  { id: "a19", src: "A19", topic: "perfekt", title: "Hast du schon …?", instr: "Напиши въпроса в Perfekt.", ex: ["Hat Sabine das Essen schon (kochen)?", "Hat Sabine das Essen schon gekocht?"], items: [
    ["Hast du schon (frühstücken)?", "Hast du schon gefrühstückt?"], ["Hast du die E-Mail schon (schreiben)?", "Hast du die E-Mail schon geschrieben?"], ["Habt ihr die Hausaufgaben schon (machen)?", "Habt ihr die Hausaufgaben schon gemacht?"],
    ["Hast du das Buch schon (lesen)?", "Hast du das Buch schon gelesen?"], ["Hat Susanne die Kollegen in München schon (anrufen)?", "Hat Susanne die Kollegen in München schon angerufen?"],
    ["Ist Paul schon zum Flughafen (fahren)?", "Ist Paul schon zum Flughafen gefahren?"], ["Hast du schon den Termin mit Frau Kümmel (vereinbaren)?", "Hast du schon den Termin mit Frau Kümmel vereinbart?"],
    ["Hat Maria die Briefe aus Portugal schon (übersetzen)?", "Hat Maria die Briefe aus Portugal schon übersetzt?"], ["Hast du für heute Abend schon (einkaufen)?", "Hast du für heute Abend schon eingekauft?"],
    ["Habt ihr den Film schon (sehen)?", "Habt ihr den Film schon gesehen?"], ["Ist Otto schon (aufstehen)?", "Ist Otto schon aufgestanden?"]] },
  { id: "c12", src: "C12", topic: "zeiten", title: "Ein ganz normaler Arbeitstag → Perfekt", instr: "Напиши всяко изречение в Perfekt.", items: HANNA.map(([a, b]) => [a, b]) },
  { id: "c13", src: "C13", topic: "uhrzeit", title: "Temporale Präpositionen", instr: "Напиши предлога (или двата, с интервал).", items: TEMP.map(([s, a]) => [s, a.split("|").join(" ")]) },
  { id: "a23", src: "A23", topic: "computer", title: "Was heute noch schief gegangen ist", instr: "Напиши правилния Partizip II.", ex: ["Der Text ist weg. Du hast ihn nicht ___. (speichern)", "gespeichert"],
    items: FAIL.map(([s1, v, o]) => [`${s1} Er hat ${o} nicht ___. (${v})`, V3[v][2]]) },
  { id: "c10", src: "C10", topic: "trennbar", title: "Präsens · с müssen · Perfekt", instr: "Напиши изречението в посочения вид.", gen: () => shuffle(C10).slice(0, 6).flatMap(([s, i, inf, mid]) => { const [pv, pp] = presF(inf, i).split(" ");
    return [[`a) Präsens: ${s} · ${mid} · ${inf}`, `${s} ${pv} ${mid} ${pp}.`], [`b) müssen: ${s} · ${mid} · ${inf}`, `${s} ${MODF[i]} ${mid} ${inf}.`], [`c) Perfekt: ${s} · ${mid} · ${inf}`, `${s} ${AUXF[V3[inf][1]][i]} ${mid} ${V3[inf][2]}.`]]; }) },
  // урок 17
  { id: "wetter17", src: "∞", topic: "wetter", title: "Нов лист: Wie ist das Wetter?", instr: "Напиши цяло изречение: In … ist es … / regnet es …", gen: () => shuffle(WPAIR).slice(0, 8).map(([, , s, ic]) => { const [c] = rnd(WCITY); const a = `In ${c} ${s.replace(/^Es (ist|regnet|schneit|gibt)/, (m, v) => (v === "ist" ? "ist es" : v === "gibt" ? "gibt es" : v + " es"))}`; return [`${c} ${ic}`, a, [`${s.replace(/\.$/, "")} in ${c}.`]]; }) },
  { id: "wohin17", src: "∞", topic: "wohin", title: "Нов лист: Wohin? / Wo?", instr: "Напиши предлога + мястото.", gen: () => shuffle(ZIEL).slice(0, 10).map(([z, wohin, wo]) => (Math.random() < 0.6 ? [`Im Sommer fahren wir ___. (${z})`, wohin] : [`Wir sind im Urlaub ___. (${z})`, wo])) },
  { id: "dativ17", src: "∞", topic: "dativ", title: "Нов лист: Dativ — dem, der, den …-n", instr: "Напиши члена/притежателното в Dativ.", gen: () => [...Array(10)].map(() => { const [g, n, pl] = rnd(DPERS), [st] = rnd(DVERB), typ = rnd(["def", "indef", "poss", "pl"]);
    const D = { der: ["dem", "einem", "meinem"], das: ["dem", "einem", "meinem"], die: ["der", "einer", "meiner"] }, hint = { def: "der/die/das", indef: "ein", poss: "mein", pl: "мн.ч., die" }[typ];
    return typ === "pl" ? [st.replace("___", `___ ${pl}`) + ` (${hint})`, "den"] : [st.replace("___", `___ ${n}`) + ` (${g} ${n} · ${hint})`, D[g][{ def: 0, indef: 1, poss: 2 }[typ]]]; }) },
  { id: "denn17", src: "∞", topic: "denn", title: "Нов лист: свържи с denn / weil", instr: "Свържи двете изречения с дадения съюз.", gen: () => shuffle(DW).slice(0, 6).flatMap(([m, s, v, r]) => { const d = Math.random() < 0.5; return [[`${m}. + ${cap(s)} ${v} ${r}. (${d ? "denn" : "weil"})`, d ? `${m}, denn ${s} ${v} ${r}.` : `${m}, weil ${s} ${r} ${v}.`]]; }) },
  // генерирани листове — всеки път нови изречения
  { id: "genperf", src: "∞", topic: "perfekt", title: "Нов лист: Perfekt (всеки път други изречения)", instr: "Състави изречението в Perfekt.", gen: () => shuffle(Z3).slice(0, 10).map((z) => { const r = z3(z); return [`${z[0]} – ${z[3] || "…"} – ${z[2]}`.replace(" – … –", " –"), r.perf]; }) },
  { id: "genpraet", src: "∞", topic: "praeteritum", title: "Нов лист: Präteritum", instr: "Напиши изречението в Präteritum.", gen: () => shuffle(Z3).slice(0, 10).map((z) => { const r = z3(z); return [r.pres, r.praet]; }) },
  { id: "genpraes", src: "∞", topic: "zeiten", title: "Нов лист: от минало към сегашно", instr: "Напиши изречението в Präsens.", gen: () => shuffle(Z3).slice(0, 10).map((z) => { const r = z3(z); return [r.perf, r.pres]; }) },
  { id: "gentrans", src: "∞", topic: "zeiten", title: "Нов лист: превод на изречения", instr: "Преведи на немски (в минало — Perfekt).", gen: () => shuffle(Z3).slice(0, 10).map((z) => { const r = z3(z); return [z[5], r.perf, [r.praet]]; }) },
];
let wsCur = null;
function startWS(id) {
  const W = WS.find((x) => x.id === id); if (!W) return;
  wsCur = { W, items: W.gen ? W.gen() : W.items, done: false };
  if (S.tab !== "lernen") { S.tab = "lernen"; store.set("tab", "lernen"); renderNav(); }
  drawWS(); window.scrollTo(0, 0);
}
function drawWS() {
  const { W, items } = wsCur, ws = (W.ex ? [W.ex] : []);
  view.innerHTML = `<div class="hx wsheet">
    <button class="link" id="wsback">← Работни листове</button>
    <div class="ws-h"><span class="ws-src">${esc(W.src)}</span><div><h1 class="hx-h1" style="margin:0">${esc(W.title)}</h1><div class="muted">${esc(W.instr)}${GRAMMAR.find((g) => g.id === W.topic) ? ` · <button class="link" id="wsrule">📐 правилото</button>` : ""}</div></div></div>
    ${ws.map(([p, a]) => `<div class="ws-row ws-ex"><span class="ws-n">•</span><div class="ws-p">${wsPrompt(p)}</div><div class="ws-a"><i>${esc(a)}</i></div></div>`).join("")}
    ${items.map(([p], k) => `<div class="ws-row" data-k="${k}"><span class="ws-n">${k + 1}.</span><div class="ws-p">${wsPrompt(p)}</div><div class="ws-a"><input class="ws-in" data-k="${k}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="…"><div class="ws-fb"></div></div></div>`).join("")}
    <div class="uml ws-uml">${["ä", "ö", "ü", "ß"].map((c) => `<button data-c="${c}" tabindex="-1">${c}</button>`).join("")}</div>
    <div class="ws-btns"><button class="btn" id="wsshow">Покажи отговорите</button><button class="btn primary" id="wscheck">Провери всички</button>${W.gen ? `<button class="btn" id="wsnew">Нов лист ↻</button>` : ""}</div>
    <div id="wsres"></div></div>`;
  let last = null;
  view.querySelectorAll(".ws-in").forEach((inp) => { inp.onfocus = () => (last = inp); inp.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); const nx = view.querySelector(`.ws-in[data-k="${+inp.dataset.k + 1}"]`); nx ? nx.focus() : checkWS(); } }; });
  view.querySelector(".ws-in")?.focus();
  $("#wsback").onclick = () => renderWSList();
  $("#wsrule") && ($("#wsrule").onclick = () => { gTopic = W.topic; store.set("gTopic", gTopic); go("grammar"); });
  $("#wscheck").onclick = checkWS; $("#wsshow").onclick = () => checkWS(true);
  $("#wsnew") && ($("#wsnew").onclick = () => startWS(W.id));
  view.querySelector(".ws-uml").onmousedown = (e) => e.preventDefault();
  view.querySelector(".ws-uml").onclick = (e) => { const b = e.target.closest("[data-c]"); if (!b || !last) return; const [a, z] = [last.selectionStart, last.selectionEnd]; last.value = last.value.slice(0, a) + b.dataset.c + last.value.slice(z); last.focus(); last.setSelectionRange(a + 1, a + 1); };
  keyHandler = (e) => { if (e.key === "Escape") renderWSList(); };
}
// инфинитивите в задачата — оцветени
const wsPrompt = (p) => esc(p).replace(/\(([a-zäöüß]+)\)/g, '(<b class="ws-v">$1</b>)').replace(/ – ([a-zäöüß ]+?)$/, (m, v) => ` – <b class="ws-v">${v}</b>`);
function checkWS(reveal) {
  const { W, items } = wsCur; let ok = 0, filled = 0;
  view.querySelectorAll(".ws-in").forEach((inp) => {
    const k = +inp.dataset.k, [p, ans, alts] = items[k], v = inp.value.trim(), fb = inp.parentElement.querySelector(".ws-fb");
    if (reveal && !v) { fb.innerHTML = `<span class="muted">→ ${esc(ans)}</span>`; return; }
    if (!v) { fb.innerHTML = ""; inp.className = "ws-in"; return; }
    filled++;
    const r = CK.checkDe(v, ans, { alts: alts || [] });
    inp.className = "ws-in " + (r.ok ? (r.level === "typo" ? "typo" : "right") : "wrong");
    const why = wsWhy(ans);
    fb.innerHTML = r.ok ? `<span class="ok">✓</span>${r.level !== "exact" && r.msg ? ` <span class="muted">${r.msg}</span>` : ""}` : `<span class="bad">✗</span> ${esc(ans)}${r.msg ? `<div class="muted">${r.msg}</div>` : ""}${why ? `<div class="muted">${why}</div>` : ""}`;
    if (r.ok) ok++;
    if (!wsCur.done && typeof recordAnswer === "function") { const vi = Object.keys(V3).find((i) => p.includes(i)); recordAnswer({ kind: "type", mode: "use", exk: "ws:" + W.id, item: vi ? ITEMS.find((x) => x.type === "verb" && x.de === vi) : null, answer: ans, res: r, errCat: r.cat }, r.ok, v); }
  });
  if (!reveal && filled) { wsCur.done = true; $("#wsres").innerHTML = `<div class="hx-card"><b class="${ok === items.length ? "ok" : ok / items.length >= 0.7 ? "mid" : "bad"}">${ok} от ${items.length}</b> верни${filled < items.length ? ` · ${items.length - filled} празни` : ""}. ${ok < filled ? "Виж обясненията под грешните редове." : "Браво!"}</div>`; }
}
// кратко „защо“ за Perfekt-отговор: намира Partizip II и казва правилото
function wsWhy(ans) {
  const T = ans.replace(/[.?!]/g, "").split(" "), part = T.find((w) => PERF[w]); if (!part) return "";
  const P = PERF[part]; return `${esc(P[0])} → ${partHTML(part)} · ${PERF_RULE[P[2]]} · ${P[1] === "s" ? "sein" : "haben"}`;
}
function renderWSList() {
  wsCur = null; keyHandler = null;
  const groups = {}; WS.forEach((w) => (groups[w.topic] = groups[w.topic] || []).push(w));
  const best = exstat();
  view.innerHTML = `<div class="hx"><button class="link" id="wsb2">← Lernen</button><h1 class="hx-h1">Работни листове</h1><p class="muted">Като в учебника: целият списък наведнъж, пишеш всички отговори и проверяваш накрая. Листовете с ∞ са нови всеки път.</p>
    ${Object.entries(groups).map(([t, ws]) => { const g = GRAMMAR.find((x) => x.id === t); return `<div class="hx-k hx-sec">${g ? g.icon + " " + esc(short(g.title)) : esc(t)}</div><div class="hx-grid">${ws.map((w) => { const s = best["ws:" + w.id]; return `<button class="hx-tile" data-ws="${w.id}"><b><span class="ws-src sm">${esc(w.src)}</span> ${esc(w.title)}</b><span>${w.gen ? "нови изречения всеки път" : w.items.length + " изречения"}</span>${s ? `<em class="${s[0] / s[1] >= 0.8 ? "ok" : "mid"}">${Math.round((s[0] / s[1]) * 100)}% верни досега</em>` : ""}</button>`; }).join("")}</div>`; }).join("")}</div>`;
  $("#wsb2").onclick = () => go("lernen");
  view.onclick = (e) => { const b = e.target.closest("[data-ws]"); if (b) startWS(b.dataset.ws); };
}
// упражнения в граматиката: „ws:…“ → работен лист
const _exByK = exByK;

// ═════════ ТЪРСЕНЕ (🔍 или „/“ навсякъде) ═════════
function searchIndex() {
  const ix = [];
  TABLES.forEach((x) => ix.push({ t: "Таблица", ic: "▦", l: x.t + " · " + x.lvl, s: (x.t + " " + (x.why || "") + " " + String(x.html).replace(/<[^>]+>/g, " ")).toLowerCase(), go: () => { tabCat = x.cat; tabQ = ""; go("tabellen"); setTimeout(() => document.getElementById("tb-" + x.id)?.scrollIntoView({ block: "start" }), 60); } }));
  GRAMMAR.forEach((g) => ix.push({ t: "Граматика", ic: g.icon, l: g.title, s: (g.title + " " + String(g.html).replace(/<[^>]+>/g, " ").slice(0, 400)).toLowerCase(), go: () => { gTopic = g.id; store.set("gTopic", gTopic); go("grammar"); } }));
  WS.forEach((w) => ix.push({ t: "Работен лист", ic: "📝", l: `${w.src} · ${w.title}`, s: (w.title + " " + w.instr + " " + w.src).toLowerCase(), go: () => startWS(w.id) }));
  EXAMS.forEach((E) => ix.push({ t: "Изпит", ic: E.ic, l: E.t, s: (E.t + " " + E.d).toLowerCase(), go: () => startExam(E.k) }));
  EX_TYPES.filter((x) => x.gen).forEach((x) => ix.push({ t: "Упражнение", ic: x.ic, l: x.t, s: (x.t + " " + (x.d || "")).toLowerCase(), go: () => startEx(x.k, { tab: "lernen", back: () => go("lernen") }) }));
  [["tabellen", "Tabellen — всички таблици A1–A2"], ["heute", "Heute — какво учим днес"], ["lernen", "Lernen"], ["dict", "Wortschatz — речник"], ["grammar", "Grammatik"], ["fort", "Fortschritt — напредък"], ["home", "Път по уроци"], ["review", "Преговор, грешките ми"], ["games", "Игри"], ["cards", "Карти"], ["basics", "Основи: азбука, звуци, числа"]]
    .forEach(([k, l]) => ix.push({ t: "Раздел", ic: "→", l, s: l.toLowerCase(), go: () => go(k) }));
  return ix;
}
function openSearch() {
  const ix = searchIndex();
  openPanel("Търси", `<input class="search" id="sq" placeholder="тема, упражнение, дума… (напр. Perfekt, Dativ, Tisch)" autocomplete="off"><div id="sr2" class="srch"></div>`, () => {});
  const q = $("#sq"); q.focus();
  const draw = () => {
    const t = canon(q.value); if (!t) { $("#sr2").innerHTML = `<p class="muted">Напиши поне 2 букви. Пример: <i>perfekt</i>, <i>haben sein</i>, <i>член</i>, <i>dativ</i>, <i>час</i>, <i>C6</i>.</p>`; return; }
    const words = t.split(" ");
    const hit = ix.filter((x) => words.every((w) => canon(x.s + " " + x.l).includes(w))).sort((a, b) => (canon(a.l).includes(t) ? -1 : 0) - (canon(b.l).includes(t) ? -1 : 0)).slice(0, 24);
    const wd = t.length >= 2 ? ITEMS.filter((it) => canon(deFull(it) + " " + it.bg).includes(t)).sort((a, b) => a.de.length - b.de.length).slice(0, 8) : [];
    const groups = {}; hit.forEach((x) => (groups[x.t] = groups[x.t] || []).push(x));
    $("#sr2").innerHTML = (wd.length ? `<div class="hx-k">Думи</div>${wd.map((it) => `<button class="srow" data-w="${esc(it.id)}"><span>${emojiOf(it) || "·"}</span><span>${deHTML(it)} <span class="muted">— ${esc(it.bg)}</span></span></button>`).join("")}` : "")
      + Object.entries(groups).map(([g, xs]) => `<div class="hx-k">${g}</div>${xs.map((x) => `<button class="srow" data-i="${ix.indexOf(x)}"><span>${x.ic}</span><span>${esc(x.l)}</span></button>`).join("")}`).join("") || `<p class="muted">Нищо не намерих.</p>`;
  };
  q.oninput = draw; draw();
  $("#sr2").onclick = (e) => { const b = e.target.closest("[data-i]"); if (b) { closePanel(); ix[+b.dataset.i].go(); return; } const w = e.target.closest("[data-w]"); if (w) { closePanel(); openWord(w.dataset.w); } };
}
document.addEventListener("keydown", (e) => { if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && S.tab !== "dict")) { e.preventDefault(); openSearch(); } });
