// ───────── НОВИТЕ ЕКРАНИ: HEUTE · LERNEN · WORTSCHATZ · FORTSCHRITT ─────────
// + миграция на старите данни (6 кутии → памет с умения), дневни снимки на напредъка, статистика по упражнения.

// ── миграция (еднократна, без да трие нищо старо)
(function migrate() {
  const v = LSget("schema", 2);
  if (v < 3) {
    const n = MEM.migrate(LSget("srs", {}));
    LSset("schema", 3); LSset("migratedAt", { t: Date.now(), words: n });
    if (LSget("tab", "home") === "home") LSset("tab", "heute");
  }
})();
// ── статистика по вид упражнение: k → [верни, общо, последно, последните 20 като низ от 0/1]
const exstat = () => LSget("exstat", {});
function exstatAdd(k, ok) { if (!k) return; const s = exstat(), v = s[k] || [0, 0, 0, ""]; v[0] += ok ? 1 : 0; v[1]++; v[2] = Date.now(); v[3] = (v[3] + (ok ? "1" : "0")).slice(-20); s[k] = v; LSset("exstat", s); }
const exAcc = (k) => { const v = exstat()[k]; if (!v || !v[3]) return null; return { acc: [...v[3]].filter((c) => c === "1").length / v[3].length, n: v[1] }; };
// ── запис на всеки отговор (вика се от сесията на упражненията)
function recordAnswer(q, ok, given) {
  const mode = q.mode || (q.kind === "type" ? (q.long || q.full ? "use" : "recall") : ["order", "bank", "write"].includes(q.kind) ? "use" : "rec");
  if (q.item && q.item.id) MEM.record(q.item.id, mode, ok, { spellErr: !!(q.res && q.res.level === "typo") });
  const cat = q.errCat || (q.res && q.res.cat) || EX_CAT[q.exk] || (q.item ? "word" : null);
  if (!ok && cat) ERRS.add({ cat, id: q.item ? q.item.id : null, k: q.exk || null, g: String(given || "").slice(0, 120), e: String(q.answer || "").replace(/<[^>]+>/g, "").slice(0, 120) });
  else if (ok && cat && cat !== "word") ERRS.good(cat);
  if (q.res && q.res.level === "typo") ERRS.add({ cat: "spell", id: q.item ? q.item.id : null, k: q.exk, g: String(given || "").slice(0, 120), e: String(q.answer || "").slice(0, 120) });
  exstatAdd(q.exk, ok);
}
// ── дневна снимка (за графиката в Fortschritt)
function snapshot() {
  const h = LSget("hist", {}), d = today(), c = counts(); h[d] = [c.recall, c.stable, c.unsure, c.seen]; LSset("hist", h);
}
function counts() {
  const all = MEM.all(), now = Date.now(); let recall = 0, stable = 0, unsure = 0, seen = 0;
  for (const it of ITEMS) {
    const m = all[it.id]; if (!m || !m.last) continue; seen++;
    const st = MEM.state(it.id, now), rc = MEM.ev(m, "recall")[0] + MEM.ev(m, "use")[0];
    if (rc && MEM.R(m, now) > 0.7 && st !== "unsure") recall++;
    if (st === "mastered" || st === "review" && m.s >= 21) stable++;
    if (st === "unsure") unsure++;
  }
  return { recall, stable, unsure, seen };
}
const stDot = (id) => ({ new: "st-new", learning: "st-learn", review: "st-learn", unsure: "st-bad", mastered: "st-ok" })[MEM.state(id)] || "st-new";
const ST_TXT = { new: "нова", learning: "учиш я", review: "за повторение", unsure: "несигурна", mastered: "усвоена" };
const pct = (x) => (x == null ? "—" : Math.round(x * 100) + "%");
const curKapitel = () => { const last = Math.max(...LESSONS.filter((l) => ITEMS.some((i) => inLesson(i, l.id) && isLearned(i))).map((l) => l.id), 0); return last >= 14 ? 5 : last >= 11 ? 4 : last >= 7 ? 3 : last >= 4 ? 2 : 1; };

// ═════════ HEUTE ═════════
function renderHeute() {
  snapshot();
  const P = dailyPlan(), C = counts(), now = new Date();
  const wd = now.toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long" });
  const nDue = P.due.length, nUns = P.unsure.length, weak = P.prof.slice(0, 3);
  const est = Math.max(3, Math.round((Math.min(nDue, 14) + Math.min(nUns, 4) + 6) * 0.35));
  const U = P.unitNext, ust = U ? unitState(U) : null, step = ust ? ust.steps.find((x) => !x.done) : null;
  const days = [...Array(7)].map((_, i) => today(6 - i)).map((d) => `<i class="${S.log[d] ? "on" : ""}" title="${d}"></i>`).join("");
  const lines = [];
  if (nDue) lines.push(`<li><b>${nDue}</b> ${nDue === 1 ? "дума идва" : "думи идват"} за повторение — точно преди да ги забравиш</li>`);
  if (nUns) lines.push(`<li><b>${nUns}</b> несигурни думи — ще ги видиш пак</li>`);
  if (weak[0]) lines.push(`<li>Целева тренировка: <b>${ERR_CAT[weak[0].cat][0]}</b> <span class="muted">(${weak[0].n} грешки напоследък)</span></li>`);
  lines.push(`<li>Смесено старо + ново и едно изречение за преобразуване</li>`);
  view.innerHTML = `<div class="hx">
    <div class="hx-date">${esc(wd)}</div>
    <h1 class="hx-h1">Какво учим днес</h1>
    <section class="hx-main">
      <div class="hx-k">${P.learned ? "Днешно обучение" : "Първа стъпка"}</div>
      ${P.learned ? `<ul class="hx-list">${lines.join("")}</ul>
      <button class="hx-go" id="hgo">Започни обучението <span>≈ ${est} мин</span></button>`
      : `<p class="muted">Още нямаш научени думи. Започни с урока — после системата сама ще планира повторенията ти.</p><button class="hx-go" id="hfirst">Започни урок ${U ? U.id : 1} →</button>`}
    </section>
    ${typeof hwHTML === "function" ? hwHTML() : ""}
    ${U && step ? `<section class="hx-card hx-row" data-step="${step.k}"><div><div class="hx-k">Урокът ти</div><b>${esc(lessonName(U))}: ${esc(short(U.title))}</b><div class="muted">Следва: ${esc(step.ic)} ${esc(step.t)} · ${esc(step.d)}${P.newWords ? ` · ${P.newWords} нови думи` : ""}</div></div><button class="btn">Продължи →</button></section>` : ""}
    ${weak.length ? `<section class="hx-card"><div class="hx-k">Къде грешиш</div>${weak.map((w) => `<div class="hx-weak"><span class="hx-wdot"></span><div><b>${ERR_CAT[w.cat][0]}</b><div class="muted">${esc(ERR_CAT[w.cat][1])} · ${w.n} ${w.n === 1 ? "грешка" : "грешки"} за 3 седмици</div></div>${(CAT_EX[w.cat] || []).some((k) => exByK(k)) ? `<button class="btn" data-weak="${w.cat}">Тренирай</button>` : `<button class="btn" data-weakw="${w.cat}">Думите</button>`}</div>`).join("")}</section>` : ""}
    <section class="hx-card hx-stats">
      <div><b>${C.recall}</b><span>думи пишеш сам</span></div><div><b>${C.stable}</b><span>стабилно запомнени</span></div><div><b class="${C.unsure ? "bad" : ""}">${C.unsure}</b><span>бъркаш</span></div>
      <div class="hx-level"><span>A1 · Kapitel ${curKapitel()}</span><span class="hx-week" title="Последните 7 дни">${days}</span><span class="muted">${streak()} ${streak() === 1 ? "ден" : "дни"} поред</span></div>
    </section>
  </div>`;
  if (typeof bindHW === "function") bindHW();
  $("#hgo") && ($("#hgo").onclick = startDaily);
  $("#hfirst") && ($("#hfirst").onclick = () => (U ? runStep(U.id, "learn") : go("home")));
  view.onclick = (e) => {
    const s = e.target.closest("[data-step]"); if (s && U) return runStep(U.id, s.dataset.step);
    const w = e.target.closest("[data-weak]"); if (w) return startWeak(w.dataset.weak);
    const ww = e.target.closest("[data-weakw]"); if (ww) { wortState = "unsure"; go("dict"); }
  };
  keyHandler = (e) => { if (e.key === "Enter" && $("#hgo")) { e.preventDefault(); startDaily(); } };
}
function startWeak(cat) {
  const ks = (CAT_EX[cat] || []).filter((k) => exByK(k)); if (!ks.length) return;
  const qs = []; for (let i = 0; i < 10; i++) { try { const q = exByK(ks[i % ks.length]).gen(); if (q && q.kind !== "intro") qs.push(q); } catch (e) {} }
  const tip = { art: "Учи съществителното винаги С члена. Окончанията -ung, -heit, -keit, -ion → die; -chen → das.", hs: "sein = движение от А до Б или промяна (gehen, fahren, aufstehen, einschlafen) + sein, bleiben. Всичко друго → haben.",
    conj: "ich -e · du -st · er -t · wir -en · ihr -t · sie -en. Модалните: ich muss = er muss.", case: "Кой? → Nominativ · Кого/какво? → Akkusativ (der → den) · На кого? / след mit, bei, zu, von → Dativ (dem, der, dem).",
    verbpos: "Спрегнатият глагол е ВИНАГИ на 2-ро място. Ако нещо друго е отпред (Gestern, Um 8 Uhr), подлогът минава след глагола.", vform: "Partizip II: ge-…-t (слаби), ge-…-en (силни), без ge- при be-/ver-/er-/über- и -ieren; разделими: an-ge-rufen.",
    order: "Втората част (Partizip, инфинитив, представка) отива в самия край.", prep: "um + час · am + ден · im + месец · von … bis · mit/zu/bei + Dativ.", plural: "Учи мн.ч. заедно с думата.", spell: "ä ö ü ß; съществителните с главна." }[cat];
  startEx("custom", { qs: shuffle(qs), title: "Тренировка: " + ERR_CAT[cat][0], tab: "heute", back: () => go("heute"), again: () => startWeak(cat), intro: tip });
  if (tip) toast("💡 " + tip.replace(/<[^>]+>/g, ""));
}

// ═════════ LERNEN ═════════
function renderLernen() {
  const P = dailyPlan(), last = (k) => { const a = store.get("exams", []).filter((x) => x.k === k); return a.length ? a[a.length - 1].pct : null; };
  const U = P.unitNext;
  view.innerHTML = `<div class="hx">
    <h1 class="hx-h1">Lernen</h1>
    <section class="hx-card hx-row" data-go="home"><div><div class="hx-k">Пътят по уроци</div><b>${U ? esc(lessonName(U) + ": " + short(U.title)) : "Всички уроци"}</b><div class="muted">нови думи → граматика → упражнения → проверка (80%)</div></div><button class="btn">Отвори →</button></section>
    <div class="hx-grid" style="margin-bottom:8px">
      <button class="hx-tile" data-act="ws"><b>📝 Работни листове</b><span>като в учебника: C6, C7, C8, A19… и нови всеки път</span></button>
      <button class="hx-tile" data-act="search"><b>⌕ Търси</b><span>тема, упражнение, дума — Ctrl+K</span></button>
    </div>
    <div class="hx-k hx-sec">Повторение</div>
    <div class="hx-grid">
      <button class="hx-tile" data-act="daily"><b>🗓️ Днешно обучение</b><span>${P.due.length} за повторение · ${P.unsure.length} несигурни</span></button>
      <button class="hx-tile" data-go="review"><b>🔁 Преговор и грешки</b><span>интервали, грешките ми, смесена граматика</span></button>
      <button class="hx-tile" data-go="cards"><b>🃏 Карти</b><span>бързо прелистване</span></button>
    </div>
    <div class="hx-k hx-sec">Изпити <span class="muted">— пишеш сам, без подсказки</span></div>
    <div class="hx-grid">${EXAMS.map((E) => { const p = last(E.k); return `<button class="hx-tile" data-exam="${E.k}"><b>${E.ic} ${esc(E.t)}</b><span>${esc(E.d)}</span>${p != null ? `<em class="${p >= 80 ? "ok" : p >= 60 ? "mid" : "bad"}">последно ${p}%</em>` : ""}</button>`; }).join("")}</div>
    <div class="hx-k hx-sec">Kapitel 5 · Alltag (Begegnungen A1)</div>
    <div class="hx-kap">${KAP5.map(([teil, items]) => `<div><div class="hx-teil">${esc(teil)}</div>${items.map(([k, t]) => `<button class="link" data-ex="${k}">${esc(t)}</button>`).join("")}</div>`).join("")}</div>
    <div class="hx-k hx-sec">Още</div>
    <div class="hx-grid">
      <button class="hx-tile" data-go="games"><b>🎮 Игри</b><span>мемори, светкавица, der/die/das, бесеница</span></button>
      <button class="hx-tile" data-go="ex"><b>🏋️ Всички упражнения</b><span>библиотека по уроци</span></button>
      <button class="hx-tile" data-go="basics"><b>🔤 Основи</b><span>азбука, звуци, числа</span></button>
      <button class="hx-tile" data-go="verbs"><b>⚙️ Глаголи</b><span>спрежения</span></button>
    </div></div>`;
  view.onclick = (e) => {
    const g = e.target.closest("[data-go]"); if (g) return go(g.dataset.go);
    const x = e.target.closest("[data-exam]"); if (x) return startExam(x.dataset.exam);
    const k = e.target.closest("[data-ex]"); if (k) return startEx(k.dataset.ex, { tab: "lernen", back: () => go("lernen") });
    if (e.target.closest("[data-act=daily]")) startDaily();
    if (e.target.closest("[data-act=ws]")) renderWSList();
    if (e.target.closest("[data-act=search]")) openSearch();
  };
}
const KAP5 = [
  ["Teil A · Tagesablauf, Uhrzeit", [["tag14", "Денят на Мартин"], ["uhr", "Колко е часът?"], ["dauer", "Колко време трае?"], ["temp", "um / am / von … bis"]]],
  ["Teil A · Perfekt, минало", [["perfhs", "haben или sein?"], ["partizip", "Partizip II"], ["zeitum", "Сегашно → минало"], ["hanna", "Денят на Хана (C12)"]]],
  ["Teil A · Am Computer", [["comp", "Глаголи за компютъра"], ["fail", "Какво се обърка? (A23)"], ["c10", "Три вида изречения (C10)"]]],
  ["Teil A · Termine, Telefon", [["telefon", "Телефон, уговорка, имейл"], ["termin", "Уговорка за ремонт (варианти)"], ["dlgline", "Диалози: коя реплика пасва?"], ["datum", "Датата (A26–A27)"], ["musssoll", "müssen / sollen"]]],
  ["Teil C · Grammatik", [["trennbar", "Разделими глаголи"], ["praet", "Präteritum"], ["stamm", "Трите форми"], ["t7", "Поправи грешката"]]],
];

// ═════════ WORTSCHATZ ═════════
let wortQ = "", wortG = "all", wortState = "all", wortL = "all";
function renderWort() {
  const L = [...LESSONS].reverse();
  view.innerHTML = `<div class="hx">
    <h1 class="hx-h1">Wortschatz</h1>
    <input class="search" id="wq" placeholder="Търси на немски или български…  ( / )" value="${esc(wortQ)}">
    <div class="hx-filters">
      <select id="wl"><option value="all">Всички уроци</option>${L.map((l) => `<option value="${l.id}" ${String(wortL) === String(l.id) ? "selected" : ""}>${esc(lessonName(l))} · ${esc(short(l.title))}</option>`).join("")}</select>
      <select id="ws">${[["all", "Всички състояния"], ["new", "Нови"], ["learning", "Учиш ги"], ["unsure", "Несигурни / бъркаш"], ["mastered", "Усвоени"], ["review", "За повторение"]].map(([k, t]) => `<option value="${k}" ${wortState === k ? "selected" : ""}>${t}</option>`).join("")}</select>
      <select id="wg">${TYPE_GROUPS.map(([k, l]) => `<option value="${k}" ${wortG === k ? "selected" : ""}>${l}</option>`).join("")}</select>
    </div>
    <div class="hx-legend"><span><i class="dot st-ok"></i>усвоена</span><span><i class="dot st-learn"></i>учиш я</span><span><i class="dot st-bad"></i>бъркаш</span><span><i class="dot st-new"></i>нова</span></div>
    <div id="wl2"></div></div>`;
  const q = $("#wq");
  q.oninput = () => { wortQ = q.value; drawWort(); };
  $("#wl").onchange = (e) => { wortL = e.target.value; drawWort(); };
  $("#ws").onchange = (e) => { wortState = e.target.value; drawWort(); };
  $("#wg").onchange = (e) => { wortG = e.target.value; drawWort(); };
  keyHandler = (e) => { if (e.key === "/" && document.activeElement !== q) { e.preventDefault(); q.focus(); } if (e.key === "Escape") q.blur(); };
  drawWort();
}
function drawWort() {
  const term = canon(wortQ);
  const items = ITEMS.filter((it) => inGroup(it, wortG) && (wortL === "all" || inLesson(it, +wortL)) && (wortState === "all" || MEM.state(it.id) === wortState)
    && (!term || canon(deFull(it) + " " + it.bg + " " + (it.pl || "")).includes(term)));
  const lessons = wortL === "all" ? [...LESSONS].reverse() : LESSONS.filter((l) => String(l.id) === String(wortL));
  let html = `<div class="muted hx-count">${items.length} думи</div>`, shown = new Set();
  for (const l of lessons) {
    const li = items.filter((i) => inLesson(i, l.id) && !shown.has(i.id)); if (!li.length) continue;
    li.forEach((i) => shown.add(i.id));
    html += `<div class="lesson-h"><b>${lessonName(l)}</b><span>${l.date ? l.date + " · " : ""}${esc(l.title)} · ${li.length}</span></div><div class="list">${li.slice(0, 400).map(rowHTML).join("")}</div>`;
  }
  $("#wl2").innerHTML = items.length ? html : `<p class="hint" style="margin-top:30px">Няма думи с тези филтри.</p>`;
}
// история на думата (в картата на думата)
function wordHistoryHTML(it) {
  const m = MEM.get(it.id), sk = MEM.skills(it.id), st = MEM.state(it.id);
  const bar = (l, v) => `<div class="sk"><span>${l}</span><i><b style="width:${v == null ? 0 : Math.round(v * 100)}%" class="${v == null ? "" : v >= 0.8 ? "ok" : v >= 0.5 ? "mid" : "bad"}"></b></i><em>${pct(v)}</em></div>`;
  const hist = m && m.h.length ? m.h.slice(-12).map(([t, md, r]) => `<span class="hh ${r === 0 ? "bad" : r === 2 ? "mid" : "ok"}" title="${new Date(t).toLocaleDateString("bg-BG")} · ${{ r: "разпознаване", u: "употреба", w: "писане" }[md]}">${{ r: "◦", u: "■" }[md] || "●"}</span>`).join("") : "";
  const errs = ERRS.all().filter((e) => e.id === it.id).slice(-3);
  return `<h4>Как я знаеш <span class="muted">— ${ST_TXT[st]}${m && m.last ? ` · следващо повторение ${m.due <= Date.now() ? "днес" : new Date(m.due).toLocaleDateString("bg-BG", { day: "numeric", month: "short" })}` : ""}</span></h4>
    <div class="skills">${bar("Разпознаване", sk.rec)}${bar("Сам я пиша", sk.recall)}${bar("Правопис", sk.spell)}${bar("В изречение", sk.use)}</div>
    ${hist ? `<div class="hhist">${hist}<small class="muted"> ◦ избор · ● писане · ■ изречение</small></div>` : ""}
    ${errs.length ? `<div class="muted" style="margin-top:6px">Последни грешки: ${errs.map((e) => `<s>${esc(e.g)}</s> → ${esc(e.e)}`).join(" · ")}</div>` : ""}`;
}

// ═════════ FORTSCHRITT ═════════
function renderFort() {
  snapshot();
  const C = counts(), all = MEM.all(); let ev = { rec: [0, 0], recall: [0, 0], spell: [0, 0], use: [0, 0] };
  Object.values(all).forEach((m) => ["rec", "recall", "spell", "use"].forEach((k) => { const v = MEM.ev(m, k); ev[k][0] += v[0]; ev[k][1] += v[1]; }));
  const r = (k) => (ev[k][1] ? ev[k][0] / ev[k][1] : null);
  const bar = (l, v, n) => `<div class="sk"><span>${l}</span><i><b style="width:${v == null ? 0 : Math.round(v * 100)}%" class="${v == null ? "" : v >= 0.8 ? "ok" : v >= 0.6 ? "mid" : "bad"}"></b></i><em>${pct(v)}<small> · ${n}</small></em></div>`;
  // граматика: точност в упражненията на всяка тема (последните 20 отговора)
  const gram = GRAMMAR.map((g) => { const ks = (G2EX[g.id] || (UNITS.find((u) => u.g.includes(g.id)) || {}).ex || []); const a = ks.map(exAcc).filter(Boolean); if (!a.length) return null; const n = a.reduce((s, x) => s + x.n, 0); return { g, acc: a.reduce((s, x) => s + x.acc, 0) / a.length, n }; }).filter((x) => x && x.n >= 3);
  const good = gram.filter((x) => x.acc >= 0.85).sort((a, b) => b.acc - a.acc), badG = gram.filter((x) => x.acc < 0.7).sort((a, b) => a.acc - b.acc);
  const confused = ITEMS.filter((i) => all[i.id] && all[i.id].lapses >= 2).sort((a, b) => all[b.id].lapses - all[a.id].lapses).slice(0, 12);
  const ex = store.get("exams", []), lastOf = (k) => ex.filter((x) => x.k === k).slice(-5);
  const H = LSget("hist", {}), days = [...Array(30)].map((_, i) => today(29 - i));
  const maxA = Math.max(5, ...days.map((d) => S.log[d] || 0)), maxR = Math.max(5, ...days.map((d) => (H[d] || [0])[0]));
  const chart = `<svg viewBox="0 0 300 90" class="hx-chart" preserveAspectRatio="none">${days.map((d, i) => { const h = ((S.log[d] || 0) / maxA) * 70; return `<rect x="${i * 10 + 1}" y="${80 - h}" width="8" height="${h}" rx="2" class="cb"><title>${d}: ${S.log[d] || 0} отговора</title></rect>`; }).join("")}
    <polyline fill="none" class="cl" stroke-width="2" points="${days.map((d, i) => H[d] ? `${i * 10 + 5},${80 - (H[d][0] / maxR) * 70}` : "").filter(Boolean).join(" ")}"/></svg>`;
  const prof = ERRS.profile(30);
  view.innerHTML = `<div class="hx">
    <h1 class="hx-h1">Fortschritt</h1>
    <section class="hx-card hx-stats"><div><b>${C.recall}</b><span>думи пишеш сам</span></div><div><b>${C.stable}</b><span>стабилно (3+ седмици)</span></div><div><b class="${C.unsure ? "bad" : ""}">${C.unsure}</b><span>бъркаш</span></div><div><b>${C.seen}</b><span>срещнати</span></div></section>
    <section class="hx-card"><div class="hx-k">Умения — всички отговори</div>
      ${bar("Разпознаване (избор)", r("rec"), ev.rec[1])}${bar("Припомняне (пишеш сам)", r("recall"), ev.recall[1])}${bar("Правопис", r("spell"), ev.spell[1])}${bar("Употреба в изречение", r("use"), ev.use[1])}
      <p class="muted" style="margin:8px 0 0">Разпознаването е най-лесно — дума, която само разпознаваш, не се брои за усвоена.</p></section>
    <section class="hx-card"><div class="hx-k">30 дни <span class="muted">· стълбчета: отговори на ден · линия: думи, които пишеш сам</span></div>${chart}</section>
    <section class="hx-card"><div class="hx-k">Граматика</div>
      ${good.length ? `<div class="hx-gl"><b class="ok">Владееш</b>${good.map((x) => `<span class="pill ok" data-gt="${x.g.id}">${x.g.icon} ${esc(short(x.g.title))} ${pct(x.acc)}</span>`).join("")}</div>` : ""}
      ${badG.length ? `<div class="hx-gl"><b class="bad">Създава проблеми</b>${badG.map((x) => `<span class="pill bad" data-gt="${x.g.id}">${x.g.icon} ${esc(short(x.g.title))} ${pct(x.acc)}</span>`).join("")}</div>` : ""}
      ${!good.length && !badG.length ? `<p class="muted">Още няма достатъчно отговори (поне 3 на тема).</p>` : ""}
      ${gram.filter((x) => x.acc >= 0.7 && x.acc < 0.85).length ? `<div class="hx-gl"><b class="mid">Почти</b>${gram.filter((x) => x.acc >= 0.7 && x.acc < 0.85).map((x) => `<span class="pill mid" data-gt="${x.g.id}">${x.g.icon} ${esc(short(x.g.title))} ${pct(x.acc)}</span>`).join("")}</div>` : ""}</section>
    <section class="hx-card"><div class="hx-k">Видове грешки (30 дни)</div>${prof.length ? prof.map((p) => `<div class="hx-weak"><span class="hx-wdot"></span><div><b>${ERR_CAT[p.cat][0]}</b> <span class="muted">· ${p.n}</span></div>${(CAT_EX[p.cat] || []).some((k) => exByK(k)) ? `<button class="btn" data-weak="${p.cat}">Тренирай</button>` : ""}</div>`).join("") : `<p class="muted">Няма записани грешки.</p>`}</section>
    <section class="hx-card"><div class="hx-k">Изпити</div>${["trans", "write", "mixed", "kap5", "recall", "transform", "fix"].map((k) => { const a = lastOf(k), E = EXAMS.find((x) => x.k === k); return a.length ? `<div class="hx-ex"><span>${E.ic} ${esc(E.t)}</span><span>${a.map((x) => `<b class="${x.pct >= 80 ? "ok" : x.pct >= 60 ? "mid" : "bad"}">${x.pct}%</b>`).join(" ")}</span></div>` : ""; }).join("") || `<p class="muted">Още няма изпити. Lernen → Изпити.</p>`}</section>
    ${confused.length ? `<section class="hx-card"><div class="hx-k">Думи, които бъркаш най-често</div><div class="learned">${confused.map((it) => `<button class="pill" data-open="${esc(it.id)}">${deHTML(it)} — ${esc(firstBg(it.bg))} <small class="bad">×${all[it.id].lapses}</small></button>`).join("")}</div></section>` : ""}
    <section class="hx-card"><div class="hx-k">Данни</div><p class="muted">Целият прогрес е само в този браузър. Направи копие от време на време.</p>
      <div class="hx-row" style="gap:8px;justify-content:flex-start"><button class="btn" id="fexp">⬇ Свали копие</button><button class="btn" id="fimp">⬆ Възстанови от копие</button><input type="file" id="fimpf" accept=".json,application/json" hidden></div></section>
  </div>`;
  view.onclick = (e) => {
    const g = e.target.closest("[data-gt]"); if (g) { gTopic = g.dataset.gt; store.set("gTopic", gTopic); return go("grammar"); }
    const w = e.target.closest("[data-weak]"); if (w) return startWeak(w.dataset.weak);
  };
  $("#fexp").onclick = () => { const blob = new Blob([JSON.stringify(exportAll())], { type: "application/json" }), a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `deutsch-kopie-${today()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  $("#fimp").onclick = () => $("#fimpf").click();
  $("#fimpf").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const obj = JSON.parse(await f.text()); if (!confirm("Това ще замени целия текущ прогрес с копието. Продължаваш ли?")) return; const n = importAll(obj); toast(`✓ Възстановени ${n} записа`); setTimeout(() => location.reload(), 500); }
    catch (err) { toast("Грешка: " + err.message); }
  };
}
