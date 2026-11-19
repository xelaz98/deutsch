// ───────── ПЪТ: уроците като стъпки + начален тест + преговор + игри ─────────
// Всеки урок = 4 стъпки: нови думи → граматика → упражнения → проверка (80% = ✓).
// Прогресът по стъпките е в dl:units ({id: {prac, test, placed}}) и dl:gread ({тема: време}).

// кои граматични теми и кои упражнения са към кой урок (по реда на курса)
const UNIT_MAP = {
  0: { g: ["sounds", "numbers"], ex: ["picde", "debg", "listenpic"] },
  1: { g: ["verbs", "formell", "questions", "jobs", "classroom"], ex: ["conj", "formell", "frage"] },
  2: { g: ["numbers", "akzent", "sentence"], ex: ["conj", "preis", "akzent", "pos2"] },
  3: { g: ["pronouns", "compare"], ex: ["poss", "gern", "roles"] },
  4: { g: ["articles", "kein", "modal", "adjectives"], ex: ["art", "einkein", "nichtkein", "modal", "hier", "kann"] },
  5: { g: ["conj"], ex: ["konj", "gern", "pos2", "colloc"] },
  6: { g: ["akk", "ersiees", "praep", "where", "manes"], ex: ["akk", "ersiees", "praep", "fragen"] },
  7: { g: ["hotel", "adjend", "komposita"], ex: ["gibt", "adjend", "eindef", "kompos", "dimin"] },
  8: { g: ["trennbar", "praefix", "zeit"], ex: ["trennbar", "bau", "zeit", "stadt", "oeffnung"] },
  9: { g: ["stark", "akkpron", "possakk", "farben", "sich"], ex: ["stark", "pronakk", "possakk", "verbakk", "farbe", "adjqa"] },
  10: { g: ["tageszeit", "himmel", "praepakk", "neg", "umzu"], ex: ["tageszeit", "tage", "lage", "super", "brauchen", "neg", "doch", "praepakk", "umzu"] },
  11: { g: ["wann", "buefett", "moegen"], ex: ["wann", "stehlieg", "mass"] },
  12: { g: ["imperativ", "wieoft", "einkauf"], ex: ["imperativ", "verpack", "wieoft", "plural"] },
  13: { g: ["dativ", "warhatte", "kapani"], ex: ["dativart", "dativpron", "schmeckt", "warhatte"] },
  14: { g: ["alltag", "uhrzeit", "perfekt", "michmir", "faelle"], ex: ["tag14", "uhr", "dauer", "musssoll", "perfhs", "partizip", "perforder", "perfright", "michmir", "mmakk", "mmdat"] },
};
// упражнения точно за граматична тема (иначе — тези на урока)
const G2EX = { perfekt: ["perfhs", "partizip", "perforder", "perfright"], michmir: ["michmir", "mmakk", "mmdat"], uhrzeit: ["uhr", "dauer"], alltag: ["tag14", "musssoll"],
  faelle: ["michmir", "akk", "dativart", "verbakk"], dativ: ["dativart", "dativpron", "schmeckt"], akkpron: ["pronakk", "mmakk"], akk: ["akk", "verbakk"], articles: ["art"],
  trennbar: ["trennbar", "bau"], imperativ: ["imperativ"], warhatte: ["warhatte"], modal: ["modal", "musssoll"], kein: ["einkein", "nichtkein", "brauchen"], neg: ["neg", "doch"] };
const exByK = (k) => EX_TYPES.find((t) => t.k === k && t.gen);
const UNITS = LESSONS.map((l) => ({ ...l, g: (UNIT_MAP[l.id]?.g || []).filter((id) => GRAMMAR.some((x) => x.id === id)), ex: (UNIT_MAP[l.id]?.ex || []).filter(exByK) }));
const unitOf = (id) => UNITS.find((u) => u.id === id);
const unitWords = (id) => ITEMS.filter((i) => inLesson(i, id) && ["noun", "verb", "adj", "adv", "word"].includes(i.type) && !/\s–\s/.test(i.de));
const unitsSt = () => store.get("units", {});
function saveUnit(id, patch) { const u = unitsSt(); u[id] = { ...(u[id] || {}), ...patch }; store.set("units", u); }
const gRead = () => store.get("gread", {});
const short = (t) => t.split(/[:,(]/)[0].trim();

function unitState(U) {
  const w = unitWords(U.id), seen = w.filter((i) => box(i) >= 0).length, known = w.filter((i) => box(i) >= 3).length, u = unitsSt()[U.id] || {};
  const gr = gRead(), g = U.id === 0 ? ["alphabet", "sounds", "rules", "numbers"] : U.g, gDone = U.id === 0 ? g.filter((k) => S.visited[k]).length : g.filter((x) => gr[x]).length;
  const steps = [
    { k: "learn", ic: "📖", t: "Нови думи", d: `${seen} от ${w.length} думи видени`, p: w.length ? seen / w.length : 1, done: !w.length || seen / w.length >= 0.8 },
    { k: "grammar", ic: U.id === 0 ? "🔤" : "📐", t: U.id === 0 ? "Азбука и звуци" : "Граматика", d: g.length ? `${gDone} от ${g.length} ${U.id === 0 ? "раздела" : "теми"} прочетени` : "няма нова граматика", p: g.length ? gDone / g.length : 1, done: gDone >= g.length },
    { k: "practice", ic: "🏋️", t: "Упражнения", d: u.prac != null ? `най-добро: ${u.prac}% (нужни 70%)` : "12 задачи по урока", p: (u.prac || 0) / 100, done: (u.prac || 0) >= 70 },
    { k: "test", ic: "✅", t: "Проверка", d: u.test != null ? `най-добро: ${u.test}% (нужни 80%)` : "12 въпроса · 80% = урокът е минат", p: (u.test || 0) / 100, done: (u.test || 0) >= 80 },
  ];
  return { steps, passed: !!u.placed || (u.test || 0) >= 80, placed: !!u.placed, known, total: w.length, next: steps.find((s) => !s.done) || steps[3] };
}

// ── стартиране на стъпка
const pathBack = () => go("home");
function useLesson(id) { S.lessons = new Set([id]); store.set("lessons", [...S.lessons]); renderSub(); }
function runStep(id, k) {
  const U = unitOf(id);
  if (k === "learn") { useLesson(id); startEx("learn", { tab: "home", back: pathBack, title: `${lessonName(U)} · нови думи` }); return; }
  if (k === "grammar") {
    if (id === 0) { bTopic = ["alphabet", "sounds", "rules", "numbers"].find((x) => !S.visited[x]) || "alphabet"; go("basics"); return; }
    const gr = gRead(); gTopic = U.g.find((x) => !gr[x]) || U.g[0] || gTopic; store.set("gTopic", gTopic); go("grammar"); return;
  }
  if (k === "practice") return startUnitPractice(id);
  if (k === "test") return startUnitTest(id);
}
function wordQ(it) {
  const g = emojiOf(it) ? [genPicDE, genListenPic, genBGDE, genDEBG, genPicType] : [genBGDE, genDEBG];
  return safeQ(() => rnd(g)(it));
}
function grammarQs(U, n) {
  const ex = U.ex.map(exByK); if (!ex.length) return [];
  const order = shuffle([...Array(n)].map((_, i) => ex[i % ex.length]));
  return order.map((t) => safeQ(() => t.gen())).filter(Boolean);
}
function startUnitPractice(id) {
  const U = unitOf(id); useLesson(id);
  const seen = shuffle(unitWords(id).filter((i) => box(i) >= 0)), words = (seen.length >= 3 ? seen : shuffle(unitWords(id))).slice(0, U.ex.length ? 4 : 12);
  const qs = shuffle([...grammarQs(U, 12 - words.length), ...words.map(wordQ)]).filter(Boolean);
  startEx("custom", { qs, tab: "home", back: pathBack, title: `${lessonName(U)} · упражнения`, againLabel: "Още веднъж",
    again: () => startUnitPractice(id), onDone: (pct) => { const u = unitsSt()[id] || {}; if ((u.prac ?? -1) < pct) saveUnit(id, { prac: pct }); } });
}
function startUnitTest(id) {
  const U = unitOf(id); useLesson(id);
  const words = shuffle(unitWords(id)).slice(0, U.ex.length ? 6 : 12).map((it) => safeQ(() => (Math.random() < 0.5 ? genBGDE(it) : genDEBG(it))));
  const qs = shuffle([...words, ...grammarQs(U, 12 - words.length)]).filter(Boolean).map((q) => ({ ...q, autoSay: q.task === "Какво значи?" ? q.autoSay : undefined }));
  startEx("custom", { qs, tab: "home", back: pathBack, title: `${lessonName(U)} · проверка`, againLabel: "Опитай пак", noGrade: false,
    again: () => startUnitTest(id), onDone: (pct) => { const u = unitsSt()[id] || {}; if ((u.test ?? -1) < pct) saveUnit(id, { test: pct }); if (pct >= 80) toast(`✅ ${lessonName(U)} е минат!`); } });
}

// ── начален тест: урок по урок, по 3 въпроса; спира след 2 неминати урока
function startPlacement() {
  const order = UNITS.filter((u) => u.id > 0), res = {};
  let ui = 0, fails = 0;
  const block = (U) => {
    const w = shuffle(unitWords(U.id)).slice(0, U.ex.length ? 2 : 3).map((it) => safeQ(() => genBGDE(it)));
    return [...w, ...grammarQs(U, 3 - w.length)].filter(Boolean).map((q) => ({ ...q, unit: U.id, task: `${q.task} <span class="muted" style="font-weight:400">· ${esc(lessonName(U))}</span>` }));
  };
  const first = block(order[0]);
  startEx("custom", { qs: first, tab: "home", back: pathBack, title: "Тест на знанията", noGrade: true,
    onNext: (s) => {
      if (s.i < s.qs.length) return;
      const U = order[ui], mine = s.qs.filter((q) => q.unit === U.id), ok = mine.filter((q) => q.ok).length;
      res[U.id] = ok >= Math.ceil(mine.length * 0.66);
      fails = res[U.id] ? 0 : fails + 1;
      ui++;
      if (fails < 2 && ui < order.length) s.qs.push(...block(order[ui]));
    },
    onDone: () => { placementResult(res); return false; } });
}
function placementResult(res) {
  const passed = Object.keys(res).filter((k) => res[k]).map(Number);
  let upto = 0; for (const U of UNITS.filter((u) => u.id > 0)) { if (res[U.id]) upto = U.id; else break; }
  passed.forEach((id) => saveUnit(id, { placed: true }));
  saveUnit(0, { placed: passed.length > 0 || unitsSt()[0]?.placed });
  store.set("placement", { at: Date.now(), passed, upto });
  const start = UNITS.find((u) => u.id > 0 && !unitState(u).passed);
  if (passed.length >= 3) confetti();
  view.innerHTML = `<div class="stage"><div class="card done" style="cursor:default">
    <div class="score">🎯</div><h2 style="margin:6px 0">Резултат от теста</h2>
    <p>${passed.length ? `Знаеш добре <b>${passed.length}</b> ${passed.length === 1 ? "урок" : "урока"}: ${passed.map((id) => lessonName(unitOf(id))).join(", ")}. Те са отбелязани с ✓ на пътя. Можеш да се върнеш към всеки от тях, когато поискаш.` : "Започваш от началото — супер, всичко е подредено стъпка по стъпка."}</p>
    ${start ? `<p>Пътят ти продължава от <b>${esc(lessonName(start))}: ${esc(short(start.title))}</b>.</p>` : "<p>Минал си всичко! 🏆</p>"}
    <div class="btns" style="grid-template-columns:1fr;width:100%"><button class="btn primary" id="plgo">Към пътя →</button></div></div></div>`;
  $("#plgo").onclick = pathBack;
  keyHandler = (e) => { if (e.key === "Enter") pathBack(); };
}

// ── какво да правя сега?
function nextAction() {
  const due = ITEMS.filter((i) => S.srs[i.id] && isDue(i)).length;
  if (due >= 15) return { ic: "🔁", t: "Преговор", d: `${due} думи чакат — първо тях, после продължаваме`, go: startReview };
  for (const U of UNITS) {
    const st = unitState(U); if (st.passed) continue;
    return { ic: st.next.ic, t: `${lessonName(U)} · ${st.next.t}`, d: short(U.title), go: () => runStep(U.id, st.next.k), unit: U.id };
  }
  return { ic: "🔁", t: "Преговор", d: due ? `${due} думи чакат` : "Всички уроци са минати 🎉 — поддържай думите", go: startReview };
}

// ── началният екран: пътят
let openUnit = null;
function renderPath() {
  const na = nextAction(), due = ITEMS.filter((i) => S.srs[i.id] && isDue(i)).length, st = streak();
  const td = S.log[today()] || 0, pct = Math.min(1, td / S.goal), R = 34, C = 2 * Math.PI * R;
  const h = new Date().getHours(), hello = h < 11 ? "Guten Morgen" : h < 18 ? "Guten Tag" : "Guten Abend";
  const pl = store.get("placement", null), anyProgress = Object.keys(S.srs).length > 0;
  const cur = openUnit ?? na.unit ?? UNITS[UNITS.length - 1].id;
  const last = UNITS[UNITS.length - 1], lastSt = unitState(last);
  view.innerHTML = `
  <section class="hero">
    <div>
      <div class="hello" data-say="${hello}!">${hello}! 👋</div>
      <p class="hint" style="margin:4px 0 14px">🔥 серия <b>${st}</b> ${st === 1 ? "ден" : "дни"} · ${due ? `<b>${due}</b> думи за преговор` : "нищо за преговор"}</p>
      <button class="cta pnext" id="pgo"><span class="pi">${na.ic}</span><span><b>Продължи: ${esc(na.t)}</b><small>${esc(na.d)}</small></span><kbd>Enter</kbd></button>
    </div>
    <div class="ring" title="Днес: ${td} от ${S.goal} отговора">
      <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="${R}" class="rb"/><circle cx="40" cy="40" r="${R}" class="rf" style="stroke-dasharray:${C};stroke-dashoffset:${C * (1 - pct)}"/></svg>
      <div><b>${td}</b><small>от ${S.goal}</small></div>
    </div>
  </section>
  ${!pl ? `<section class="ptest"><div><b>🎯 Тест на знанията</b><span>${anyProgress ? "Провери кои уроци вече знаеш — те ще се отбележат с ✓ и ще прескочиш напред." : "5–10 минути. Казва ти от кой урок да започнеш, за да не учиш наново това, което знаеш."}</span></div><button class="btn primary" id="pplace">Започни теста</button></section>` : ""}
  ${!lastSt.passed && na.unit !== last.id ? `<section class="plast"><span>🆕 Последният час (${esc(last.date)}): <b>${esc(lessonName(last))} · ${esc(short(last.title))}</b></span><button class="btn" data-unit-go="${last.id}">Учи го сега →</button></section>` : ""}
  ${hwHTML()}
  <h3 style="margin-top:24px">Пътят ти · ${UNITS.filter((u) => unitState(u).passed).length} от ${UNITS.length} урока ✓</h3>
  <div class="path">${UNITS.map((U) => {
    const s = unitState(U), isCur = U.id === na.unit, open = U.id === cur;
    const p = Math.round((s.steps.filter((x) => x.done).length / 4) * 100);
    return `<div class="unit ${s.passed ? "passed" : ""} ${isCur ? "cur" : ""} ${open ? "open" : ""}">
      <button class="uhead" data-unit="${U.id}"><span class="unode">${s.passed ? "✓" : U.id === 0 ? "🔤" : U.id}</span>
        <span class="ut"><b>${esc(lessonName(U))}${U.date ? ` <i>${esc(U.date.slice(0, 5))}</i>` : ""}</b><small>${esc(U.title)}</small></span>
        <span class="up">${s.placed && s.steps.filter((x) => x.done).length < 4 ? "✓ от теста" : p + "%"}</span></button>
      ${open ? `<div class="usteps">${s.steps.map((x) => `<button class="ustep ${x.done ? "done" : ""} ${x === s.next && !s.passed ? "next" : ""}" data-step="${U.id}:${x.k}">
          <span class="si">${x.done ? "✓" : x.ic}</span><span><b>${x.t}</b><small>${esc(x.d)}</small></span><i class="sp"><i style="width:${Math.round(Math.min(1, x.p) * 100)}%"></i></i></button>`).join("")}
        ${U.g.length ? `<div class="ugr">📐 ${U.g.map((g) => { const G = GRAMMAR.find((x) => x.id === g); return `<button class="link" data-gt="${g}">${gRead()[g] ? "✓ " : ""}${esc(G.title)}</button>`; }).join(" · ")}</div>` : ""}
        <div class="ugr">📖 <button class="link" data-udict="${U.id}">Всички думи (${s.total})</button> · ${s.known} научени</div></div>` : ""}
    </div>`; }).join("")}</div>
  <details class="howto2"><summary>❓ Как работи</summary>
    <ol><li><b>Натискай „Продължи“.</b> Приложението само избира следващата стъпка: нови думи → граматика → упражнения → проверка. Минеш ли проверката с 80%, урокът получава ✓.</li>
    <li><b>Всеки ден — „🔁 Преговор“.</b> Думите се връщат точно когато започваш да ги забравяш (интервално повторение). Грешките се връщат по-често.</li>
    <li><b>Цъкни върху всяка немска дума</b>, за да я чуеш, и върху изречение — за „Защо?“ (падеж, словоред, окончание).</li>
    <li><b>🎮 Игри</b> — за почивка, но пак учиш: мемори, светкавица, der/die/das, бесеница.</li></ol>
    <p class="muted"><span class="art der">der</span> мъжки · <span class="art die">die</span> женски · <span class="art das">das</span> среден · <span class="art pl">die</span> мн.ч.</p></details>`;
  view.onclick = (e) => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.id === "pgo") return na.go();
    if (t.id === "pplace") return startPlacement();
    if (t.dataset.unit) { const id = +t.dataset.unit; openUnit = cur === id ? -1 : id; renderPath(); return; }
    if (t.dataset.unitGo) { openUnit = +t.dataset.unitGo; const s = unitState(unitOf(openUnit)); return runStep(openUnit, s.next.k); }
    if (t.dataset.step) { const [id, k] = t.dataset.step.split(":"); return runStep(+id, k); }
    if (t.dataset.gt) { gTopic = t.dataset.gt; store.set("gTopic", gTopic); go("grammar"); return; }
    if (t.dataset.udict) { useLesson(+t.dataset.udict); go("dict"); }
  };
  keyHandler = (e) => { if (e.key === "Enter") na.go(); };
  bindHW();
}

// ── преговор
function startReview() {
  let items = ITEMS.filter((i) => S.srs[i.id] && isDue(i)).sort((a, b) => box(a) - box(b)).slice(0, 15);
  if (!items.length) items = ITEMS.filter((i) => S.srs[i.id]).sort((a, b) => S.srs[a.id].due - S.srs[b.id].due).slice(0, 10);
  if (!items.length) { toast("Още нямаш научени думи — започни от „Пътят“"); return; }
  const qs = shuffle(items).map((it) => safeQ(() => (emojiOf(it) && Math.random() < 0.5 ? rnd([genPicDE, genPicType, genListenPic]) : rnd([genBGDE, genDEBG, genBGDE]))(it))).filter(Boolean);
  startEx("custom", { qs, srs: true, tab: "review", back: () => go("review"), title: "Преговор на думите", againLabel: "Още преговор", again: startReview });
}
function startMixGrammar() {
  const units = UNITS.filter((u) => u.ex.length && (unitState(u).passed || unitState(u).steps[2].p > 0 || unitWords(u.id).some((i) => box(i) >= 0)));
  const src = units.length ? units : UNITS.filter((u) => u.ex.length);
  const qs = [...Array(12)].map(() => { const U = rnd(src); return safeQ(() => exByK(rnd(U.ex)).gen()); }).filter(Boolean);
  startEx("custom", { qs, tab: "review", back: () => go("review"), title: "Смесена граматика", againLabel: "Още 12", again: startMixGrammar });
}
function renderReview() {
  const due = ITEMS.filter((i) => S.srs[i.id] && isDue(i)).length, weak = ITEMS.filter((i) => S.srs[i.id] && box(i) <= 1).length, learned = Object.keys(S.srs).length;
  const boxes = [0, 1, 2, 3, 4, 5].map((b) => ITEMS.filter((i) => S.srs[i.id] && box(i) === b).length);
  view.innerHTML = `<h2>Преговор</h2>
    <p class="hint">Тук се затвърждава наученото. Думите се връщат <b>точно преди да ги забравиш</b> — всеки правилен отговор отлага следващия преговор (1 → 3 → 7 → 16 дни), грешният го връща веднага.</p>
    <div class="bigmodes">
      <button class="bm main" data-r="words"><span class="ic">🔁</span><b>Преговор на думите</b><span>${due ? `${due} думи чакат днес` : learned ? "нищо не чака — ще преговориш най-старите" : "още нямаш научени думи"}</span></button>
      <button class="bm" data-r="weak"><span class="ic">🎯</span><b>Грешките ми</b><span>${weak} думи, които бъркаш</span></button>
      <button class="bm" data-r="grammar"><span class="ic">🧩</span><b>Смесена граматика</b><span>12 задачи от всички учени уроци, разбъркани</span></button>
      <button class="bm" data-r="cards"><span class="ic">🃏</span><b>Карти</b><span>Класически флашкарти със самооценка</span></button>
    </div>
    ${learned ? `<h3>Къде са думите ти</h3><div class="boxes">${["нови грешки", "ден 1", "ден 3", "седмица", "2 седмици", "научени"].map((l, b) => `<div><b>${boxes[b]}</b><small>${l}</small></div>`).join("")}</div>` : ""}
    <div class="toolbar" style="margin-top:18px"><span class="lbl">Дневна цел</span>${[20, 40, 60, 100].map((g) => `<button class="chip ${S.goal === g ? "on" : ""}" data-goal="${g}">${g} отговора</button>`).join("")}</div>`;
  view.onclick = (e) => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.goal) { S.goal = +t.dataset.goal; store.set("goal", S.goal); renderStats(); renderReview(); return; }
    const r = t.dataset.r;
    if (r === "words") startReview();
    if (r === "weak") startEx("weak", { tab: "review", back: () => go("review") });
    if (r === "grammar") startMixGrammar();
    if (r === "cards") go("cards");
  };
  keyHandler = (e) => { if (e.key === "Enter") startReview(); };
}

// ───────── ИГРИ ─────────
let gameScope = null; // чете се от store при първото отваряне (path.js се зарежда преди app.js)
function gamePool(pred) {
  gameScope ??= store.get("gameScope", "seen");
  const base = ITEMS.filter(pred);
  const seen = base.filter((i) => box(i) >= 0), lastU = base.filter((i) => inLesson(i, UNITS[UNITS.length - 1].id));
  const p = gameScope === "seen" ? seen : gameScope === "last" ? lastU : base;
  return p.length >= 12 ? p : base;
}
const gBest = (k) => store.get("gbest", {})[k];
function setBest(k, v, higher = true) { const b = store.get("gbest", {}); const old = b[k]; if (old == null || (higher ? v > old : v < old)) { b[k] = v; store.set("gbest", b); return true; } return false; }
const GAMES = [
  { k: "memory", ic: "🧠", t: "Мемори", d: "Обръщай карти и намери двойките немски ↔ български", best: (v) => `рекорд: ${v} хода` },
  { k: "flash", ic: "⚡", t: "Светкавица", d: "60 секунди: вярен ли е преводът? ← не · да →", best: (v) => `рекорд: ${v} точки` },
  { k: "artikel", ic: "🎨", t: "der · die · das", d: "60 секунди: колкото може повече членове подред", best: (v) => `рекорд: ${v} точки` },
  { k: "hang", ic: "🪢", t: "Бесеница", d: "Познай немската дума буква по буква (подсказка: превод)", best: (v) => `рекорд: ${v} поред` },
];
function renderGames() {
  stopGame(); gameScope ??= store.get("gameScope", "seen");
  view.innerHTML = `<h2>Игри</h2><p class="hint">Кратки игри за почивка — но пак упражняваш думите.</p>
    <div class="toolbar"><span class="lbl">Думи</span>${[["seen", "моите (видени)"], ["last", "последния урок"], ["all", "всички"]].map(([k, l]) => `<button class="chip ${gameScope === k ? "on" : ""}" data-gs="${k}">${l}</button>`).join("")}</div>
    <div class="bigmodes">${GAMES.map((g) => `<button class="bm" data-game="${g.k}"><span class="ic">${g.ic}</span><b>${g.t}</b><span>${g.d}</span>${gBest(g.k) != null ? `<em class="exbest">${g.best(gBest(g.k))}</em>` : ""}</button>`).join("")}</div>`;
  view.onclick = (e) => {
    const s = e.target.closest("[data-gs]"); if (s) { gameScope = s.dataset.gs; store.set("gameScope", gameScope); renderGames(); return; }
    const g = e.target.closest("[data-game]"); if (g) ({ memory: gameMemory, flash: gameFlash, artikel: gameArtikel, hang: gameHang })[g.dataset.game]();
  };
  keyHandler = null;
}
let gameTimer = null;
function stopGame() { if (gameTimer) { clearInterval(gameTimer); gameTimer = null; } }
function gameShell(title, inner, info = "") {
  view.innerHTML = `<div class="stage game"><div class="pinfo"><span><button class="link" id="gback">← Игри</button> · ${title}</span><span id="ginfo">${info}</span></div>${inner}</div>`;
  $("#gback").onclick = () => go("games");
}
function gameOver(k, title, line, best, again) {
  stopGame(); confetti();
  view.innerHTML = `<div class="stage"><div class="card done" style="cursor:default"><div class="score">🏁</div><h2 style="margin:4px 0">${title}</h2><p>${line}</p>${best ? `<p class="xpgain">🏆 Нов рекорд!</p>` : ""}
    <div class="btns" style="grid-template-columns:1fr 1fr;width:100%"><button class="btn" id="gb">← Игри</button><button class="btn primary" id="ga">Пак <kbd style="color:inherit">Enter</kbd></button></div></div></div>`;
  $("#gb").onclick = () => go("games"); $("#ga").onclick = again;
  keyHandler = (e) => { if (e.key === "Enter") again(); if (e.key === "Escape") go("games"); };
}
// мемори: 6 двойки
function gameMemory() {
  stopGame();
  const its = shuffle(gamePool((i) => ["noun", "verb", "adj", "adv"].includes(i.type) && i.de.length < 18 && i.bg.length < 22)).filter((x, i, a) => a.findIndex((y) => y.bg === x.bg) === i).slice(0, 6);
  const cards = shuffle(its.flatMap((it, n) => [{ n, t: deFull(it), de: true, it }, { n, t: it.bg.split(/[;,(]/)[0].trim(), de: false, it }]));
  let open = [], moves = 0, found = 0, lock = false;
  const t0 = Date.now();
  gameShell("🧠 Мемори", `<div class="mem">${cards.map((c, i) => `<button class="mc" data-i="${i}"><span>${esc(c.t)}</span></button>`).join("")}</div><p class="keys">Обърни две карти: немска дума + нейния превод</p>`, "ходове: 0");
  view.querySelector(".mem").onclick = (e) => {
    const b = e.target.closest(".mc"); if (!b || lock || b.classList.contains("up") || b.classList.contains("ok")) return;
    const c = cards[+b.dataset.i]; b.classList.add("up"); if (c.de) speak(c.t, { auto: true }); open.push([b, c]);
    if (open.length < 2) return;
    moves++; $("#ginfo").textContent = `ходове: ${moves}`;
    const [[b1, c1], [b2, c2]] = open; open = [];
    if (c1.n === c2.n && c1.de !== c2.de) { b1.classList.add("ok"); b2.classList.add("ok"); found++; addXP(5);
      if (found === its.length) setTimeout(() => gameOver("memory", "Мемори", `Всички двойки за <b>${moves}</b> хода и ${Math.round((Date.now() - t0) / 1000)} сек.`, setBest("memory", moves, false), gameMemory), 500); }
    else { lock = true; setTimeout(() => { b1.classList.remove("up"); b2.classList.remove("up"); lock = false; }, 900); }
  };
  keyHandler = (e) => { if (e.key === "Escape") go("games"); };
}
// светкавица: вярно/невярно, 60 s
function gameFlash() {
  stopGame();
  const pool = gamePool((i) => ["noun", "verb", "adj", "adv"].includes(i.type));
  let score = 0, left = 60, cur, wrongs = [];
  const nextQ = () => {
    const it = rnd(pool), truth = Math.random() < 0.5, other = rnd(pool.filter((o) => o.bg !== it.bg && o.type === it.type));
    cur = { it, truth, bg: truth ? it.bg : other.bg };
    $("#fl").innerHTML = `<div class="exw">${deHTML(it)}</div><div class="mid" style="margin-top:10px">= ${esc(cur.bg)} ?</div>`;
  };
  const answer = (yes) => {
    if (!cur) return; const ok = yes === cur.truth;
    if (ok) { score++; addXP(2); } else wrongs.push(cur.it);
    const c = $("#fl").parentElement; c.classList.remove("flok", "flbad"); void c.offsetWidth; c.classList.add(ok ? "flok" : "flbad");
    $("#ginfo").textContent = `⏱ ${left} s · ✓ ${score}`; nextQ();
  };
  gameShell("⚡ Светкавица", `<div class="card excard" style="cursor:default;min-height:200px"><div id="fl"></div></div>
    <div class="btns" style="grid-template-columns:1fr 1fr"><button class="btn" id="fno">✗ Не <kbd>←</kbd></button><button class="btn primary" id="fyes">✓ Да <kbd style="color:inherit">→</kbd></button></div>`, `⏱ 60 s · ✓ 0`);
  $("#fno").onclick = () => answer(false); $("#fyes").onclick = () => answer(true);
  keyHandler = (e) => { if (e.key === "ArrowLeft" || e.key === "1") answer(false); if (e.key === "ArrowRight" || e.key === "2") answer(true); if (e.key === "Escape") go("games"); };
  nextQ();
  gameTimer = setInterval(() => { left--; const gi = $("#ginfo"); if (gi) gi.textContent = `⏱ ${left} s · ✓ ${score}`; if (left <= 0) {
    const w = [...new Set(wrongs)].slice(0, 8);
    gameOver("flash", "Светкавица", `<b>${score}</b> верни отговора за 60 секунди.${w.length ? `<br><small class="muted">Сгреши: ${w.map((i) => `${esc(deFull(i))} = ${esc(i.bg)}`).join(" · ")}</small>` : ""}`, setBest("flash", score), gameFlash); } }, 1000);
}
// der / die / das, 60 s
function gameArtikel() {
  stopGame();
  const pool = gamePool((i) => i.type === "noun" && ["der", "die", "das"].includes(i.art));
  let score = 0, combo = 0, left = 60, it;
  const nextQ = () => { it = rnd(pool); $("#ar").innerHTML = `${emojiOf(it) ? `<div class="cemo">${emojiOf(it)}</div>` : ""}<div class="exw">___ ${esc(it.de)}</div><div class="meta">${esc(it.bg)}</div>`; };
  const pick = (a) => {
    const ok = a === it.art, c = $("#ar").parentElement;
    if (ok) { combo++; score += combo >= 5 ? 2 : 1; addXP(1); } else { combo = 0; toast(`${it.art} ${it.de}`); }
    c.classList.remove("flok", "flbad"); void c.offsetWidth; c.classList.add(ok ? "flok" : "flbad");
    $("#ginfo").textContent = `⏱ ${left} s · ${score} т.${combo >= 5 ? " · 🔥×2" : ""}`; nextQ();
  };
  gameShell("🎨 der · die · das", `<div class="card excard" style="cursor:default;min-height:200px"><div id="ar"></div></div>
    <div class="opts" style="grid-template-columns:1fr 1fr 1fr">${["der", "die", "das"].map((a, i) => `<button class="opt art3 ${a}" data-a="${a}"><kbd>${i + 1}</kbd><span>${a}</span></button>`).join("")}</div><p class="keys">5 верни подред → двойни точки 🔥</p>`, "⏱ 60 s · 0 т.");
  view.querySelector(".opts").onclick = (e) => { const b = e.target.closest("[data-a]"); if (b) pick(b.dataset.a); };
  keyHandler = (e) => { const a = { 1: "der", 2: "die", 3: "das" }[e.key]; if (a) pick(a); if (e.key === "Escape") go("games"); };
  nextQ();
  gameTimer = setInterval(() => { left--; const gi = $("#ginfo"); if (gi) gi.textContent = `⏱ ${left} s · ${score} т.`; if (left <= 0) gameOver("artikel", "der · die · das", `<b>${score}</b> точки за 60 секунди.`, setBest("artikel", score), gameArtikel); }, 1000);
}
// бесеница
let hangRun = 0;
function gameHang(cont) {
  stopGame(); if (!cont) hangRun = 0;
  const it = rnd(gamePool((i) => ["noun", "verb", "adj", "adv"].includes(i.type) && /^[A-Za-zÄÖÜäöüß]{4,11}$/.test(i.de)));
  const word = it.de, up = word.toUpperCase(), guessed = new Set(); let lives = 7;
  const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ".split(""); // ß → в главни е SS
  const draw = () => {
    const shown = [...up].map((ch) => (guessed.has(ch) ? ch : "_")).join(" ");
    $("#hw").innerHTML = `${emojiOf(it) ? `<div class="cemo">${emojiOf(it)}</div>` : ""}<div class="meta">${esc(it.bg)}${it.type === "noun" ? " · съществително" : it.type === "verb" ? " · глагол" : ""}</div><div class="hangw">${shown}</div><div class="lives">${"❤️".repeat(lives)}${"🤍".repeat(7 - lives)}</div>`;
    $("#hk").innerHTML = ABC.map((c) => `<button class="hk ${guessed.has(c) ? (up.includes(c) ? "ok" : "bad") : ""}" data-c="${c}" ${guessed.has(c) ? "disabled" : ""}>${c === "ß" ? "ß" : c}</button>`).join("");
  };
  const end = (win) => {
    if (win) { hangRun++; addXP(10); setBest("hang", hangRun); }
    speak(deFull(it), { auto: true });
    $("#hw").insertAdjacentHTML("beforeend", `<div class="exfb on ${win ? "ok" : "bad"}" style="margin-top:12px"><div class="exhead">${win ? "✓ Позна!" : "✗ Беше:"} ${deHTML(it)} — ${esc(it.bg)}</div><button class="btn primary" id="hnext" style="width:100%;margin-top:8px">${win ? "Следваща дума" : "Нова игра"} <kbd style="color:inherit">Enter</kbd></button></div>`);
    $("#hk").innerHTML = ""; $("#hnext").onclick = () => gameHang(win);
    keyHandler = (e) => { if (e.key === "Enter") gameHang(win); if (e.key === "Escape") go("games"); };
  };
  const guess = (c) => {
    c = c === "ß" ? "ß" : c.toUpperCase(); if (guessed.has(c) || !ABC.includes(c)) return;
    guessed.add(c); if (!up.includes(c)) lives--;
    draw();
    if ([...up].every((ch) => guessed.has(ch))) end(true); else if (lives <= 0) end(false);
  };
  gameShell("🪢 Бесеница", `<div class="card excard" style="cursor:default;min-height:220px"><div id="hw"></div></div><div class="hkeys" id="hk"></div>`, hangRun ? `поред: ${hangRun}` : "");
  $("#hk").onclick = (e) => { const b = e.target.closest("[data-c]"); if (b) guess(b.dataset.c); };
  keyHandler = (e) => { if (e.key.length === 1) guess(e.key); if (e.key === "Escape") go("games"); };
  draw();
}
