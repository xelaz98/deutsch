// ───────── състояние ─────────
const $ = (s, el = document) => el.querySelector(s);
const view = $("#view");
const store = {
  get(k, d) { try { const v = localStorage.getItem("dl:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("dl:" + k, JSON.stringify(v)); } catch {} },
};
const S = {
  tab: store.get("tab", "home"),
  lessons: new Set(store.get("lessons", [1, 2, 3])),
  srs: store.get("srs", {}), // id → {box, due}
  auto: store.get("auto", true), // автоматично произнасяне
  log: store.get("log", {}), // "YYYY-MM-DD" → брой отговори
  goal: store.get("goal", 40),
  showTr: store.get("showTr", true), // транскрипция на кирилица
  visited: store.get("visited", {}), // посетени секции от „Основи“
};
if (!store.get("v2", false)) { S.lessons.add(0); store.set("lessons", [...S.lessons]); store.set("v2", true); }
{ // нов урок → включи го автоматично във филтъра
  const known = store.get("knownLessons", [0, 1, 2, 3]);
  LESSONS.forEach((l) => { if (!known.includes(l.id)) S.lessons.add(l.id); });
  store.set("lessons", [...S.lessons]); store.set("knownLessons", LESSONS.map((l) => l.id));
}
const DAY = 864e5;
const INTERVALS = [0, 0.5, 1, 3, 7, 16]; // дни за кутия 0..5
let keyHandler = null;
let activeQuiz = null; // текущата тест-сесия (за отложените преходи)

const TYPE_LABEL = { noun: "Съществителни", verb: "Глаголи", adj: "Прилагателни", adv: "Наречия", word: "Думи", phrase: "Изрази", q: "Въпроси" };
const TYPE_GROUPS = [
  ["all", "Всички"], ["noun", "Съществителни"], ["verb", "Глаголи"],
  ["adjadv", "Прил. / наречия"], ["phrase", "Изрази и въпроси"], ["word", "Други"],
];
const inGroup = (it, g) => g === "all" || (g === "adjadv" ? ["adj", "adv"].includes(it.type)
  : g === "phrase" ? ["phrase", "q"].includes(it.type) : it.type === g);

// ───────── помощни ─────────
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const artWord = (it) => (it.art === "pl" ? "die" : it.art);
const artCls = (it) => (it.art === "pl" ? "pl" : it.art || "none");
const deFull = (it) => (it.type === "noun" && it.art ? artWord(it) + " " + it.de : it.de);
const plText = (it) => it.art === "pl" ? "само мн.ч." : it.pl ? "die " + it.pl : it.type === "noun" && it.art ? "без мн.ч." : "";
const deHTML = (it) => {
  if (it.type !== "noun") return esc(it.de);
  const a = it.art ? `<span class="art ${artCls(it)}">${artWord(it)}</span> ` : "";
  return `${a}<span class="c-${artCls(it)}">${esc(it.de)}</span>`;
};
const trHTML = (t) => (S.showTr ? `<span class="tr">[${esc(translit(t))}]</span>` : "");
// ───────── примерни изречения с превод при посочване ─────────
const LEXM = (() => {
  const m = {}, add = (w, g) => { w = w.toLowerCase(); if (!(w in m)) m[w] = g; };
  ITEMS.forEach((it) => {
    if (it.type === "noun") { add(it.de, it.bg + (it.art && it.art !== "pl" ? ` (${it.art} ${it.de})` : "")); if (it.pl) add(it.pl, it.bg + " — мн.ч."); }
    else if (it.type === "verb") { add(it.de, it.bg); it.forms.forEach((f) => add(f.split(" ")[0], `${it.bg} (${it.de})`)); }
    else if (!/\s/.test(it.de)) add(it.de.replace(/[.!?]/g, ""), it.bg);
  });
  return Object.assign(m, LEX);
})();
const WORD_RE = /[A-Za-zÄÖÜäöüßé]+/g;
function itemForms(it) { // всички форми на думата (за подчертаване и „попълни празното“)
  const f = new Set(it.de.toLowerCase().match(WORD_RE) || []);
  if (it.pl) f.add(it.pl.toLowerCase());
  if (it.forms) it.forms.forEach((x) => f.add(x.split(" ")[0].toLowerCase()));
  ["der", "die", "das", "sich"].forEach((a) => f.delete(a));
  return f;
}
function examplesFor(it) { // всички примери: [[de, bg], …]
  const own = it.type === "phrase" || it.type === "q" ? [[it.de, it.bg]] : [];
  const e = EXAMPLES[it.de], more = (typeof EXAMPLES_MORE !== "undefined" && EXAMPLES_MORE[it.de]) || [];
  const list = e ? (Array.isArray(e[0]) ? e : [e]) : [];
  const out = [...own, ...list, ...more];
  return out.filter((x, i) => out.findIndex((y) => y[0] === x[0]) === i).slice(0, 4);
}
function exampleFor(it) { return examplesFor(it)[0] || null; }
function sentHTML(de, bg, it, opts = {}) {
  const forms = it ? itemForms(it) : new Set();
  const bd = opts.bd && typeof XP !== "undefined" ? XP.roles(de) : null;
  let n = 0;
  const html = esc(de).replace(WORD_RE, (w) => {
    const g = LEXM[w.toLowerCase()];
    const rc = bd ? " rc-" + bd.roles[n] : "";
    return `<span class="w ${forms.has(w.toLowerCase()) ? "hl" : ""}${rc}" data-i="${n++}" data-w="${esc(w)}" data-g="${esc(g || "—")}" data-t="[${esc(translit(w))}]">${w}</span>`;
  });
  if (bd) return `<div class="sent bdsent" data-s="${esc(de)}"><div class="sbtns"><button class="say" data-say="${esc(de)}" title="Чуй изречението">${SPK}</button><button class="anat" title="Разбор: словоред">🔍</button></div>
    <div class="sx"><div class="sde">${html}</div>${breakdownHTML(de, bg, bd, opts.bd === "full")}</div></div>`;
  return `<div class="sent" data-s="${esc(de)}"><div class="sbtns"><button class="say" data-say="${esc(de)}" title="Чуй изречението">${SPK}</button><button class="anat" title="Разбор: кое какво е в изречението">🔍</button></div>
    <div class="sx"><div class="sde">${html}</div><div class="sbg" title="Посочи или цъкни, за да видиш превода">${esc(bg)}</div></div></div>`;
}
const exHTML = (it, mode = "full") => { const e = exampleFor(it); return e ? sentHTML(e[0], e[1], it, { bd: mode }) : ""; };

document.addEventListener("click", (e) => {
  const w = e.target.closest(".sent .w");
  if (w) { e.stopPropagation(); e.preventDefault(); speak(w.dataset.w); showWhy(w); return; }
  const xc = e.target.closest(".xbox [data-xclose]");
  if (xc) { e.stopPropagation(); xc.closest(".xbox").remove(); document.querySelectorAll(".w.sel").forEach((x) => x.classList.remove("sel")); return; }
  const b = e.target.closest(".sbg");
  if (b) { e.stopPropagation(); b.classList.toggle("open"); }
}, true);
const lessonName = (l) => (l.id === 0 ? "Основи" : "Урок " + l.id);
const inLesson = (it, id) => it.lessons.includes(id);
const pool = () => ITEMS.filter((it) => it.lessons.some((l) => S.lessons.has(l)));
const box = (it) => (S.srs[it.id] ? S.srs[it.id].box : -1);
const isDue = (it) => !S.srs[it.id] || S.srs[it.id].due <= Date.now();
function grade(it, q) { // q: 0 не знам, 1 трудно, 2 знам
  const cur = S.srs[it.id] || { box: 0, due: 0 };
  let b = q === 0 ? 0 : q === 1 ? Math.max(1, cur.box) : Math.min(5, cur.box + 1);
  S.srs[it.id] = { box: b, due: Date.now() + INTERVALS[b] * DAY };
  store.set("srs", S.srs);
  const d = today(), before = S.log[d] || 0;
  S.log[d] = before + 1; store.set("log", S.log);
  if (before < S.goal && S.log[d] >= S.goal) setTimeout(() => toast("🎯 Дневната цел е изпълнена!"), 300);
  renderStats();
}
const today = (off = 0) => { const t = new Date(Date.now() - off * DAY); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`; };
function streak() {
  let n = 0, off = S.log[today()] ? 0 : 1; // днес още не е учено → броим от вчера
  while (S.log[today(off + n)]) n++;
  return n;
}
const canon = (s) => s.toLowerCase().trim()
  .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
  .replace(/'/g, "").replace(/[.,!?;:()–\-"„“]/g, " ").replace(/\s+/g, " ").trim();
const sameDe = (a, b) => canon(a) === canon(b);

// ───────── глас ─────────
// Основно: /tts (Google Translate през локалния server.py, кеширано на диска).
// Резерва: вграденият глас на браузъра, ако има немски.
const cleanTTS = (t) => t.replace(/→.*$/, "").replace(/[–—]/g, ",").replace(/\.\.\.|…/g, "").replace(/\s+/g, " ").trim();
const ttsURL = (t) => "/tts?q=" + encodeURIComponent(cleanTTS(t));
// Публичната (статична) версия няма сървър: пуска готовите mp3 от audio/ по същото име, което ползва server.py (sha1[:16]).
const STATIC = !!window.STATIC_BUILD;
async function audioURL(t) {
  if (!STATIC) return ttsURL(t);
  if (!(window.crypto && crypto.subtle)) return null;
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(cleanTTS(t)));
  return "audio/" + [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16) + ".mp3";
}
let curAudio = null, lastSaid = "", lastAt = 0;
function markPlaying(text, on) {
  document.querySelectorAll("[data-say]").forEach((b) => b.classList.toggle("playing", on && b.dataset.say === text));
}
function stopAudio() {
  if (typeof seqToken !== "undefined") seqToken++;
  if (curAudio) { curAudio.pause(); curAudio = null; }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  document.querySelectorAll(".playing").forEach((b) => b.classList.remove("playing"));
}
function speechFallback(text, slow) {
  if (!("speechSynthesis" in window)) return toast("Няма звук — провери интернет връзката");
  const vs = speechSynthesis.getVoices().filter((v) => /^de/i.test(v.lang || ""));
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(cleanTTS(text));
  u.lang = "de-DE"; u.rate = slow ? 0.6 : 0.9; if (vs[0]) u.voice = vs[0];
  u.onend = () => markPlaying(text, false);
  speechSynthesis.speak(u);
}
function speak(text, opts = {}) {
  if (!text || !cleanTTS(text)) return;
  // второ цъкване на същата дума до 4 сек → бавно
  const slow = opts.slow ?? (text === lastSaid && Date.now() - lastAt < 4000 && !opts.auto);
  lastSaid = text; lastAt = slow ? 0 : Date.now();
  if (curAudio) { curAudio.pause(); curAudio = null; }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  const a = new Audio();
  a.preservesPitch = true;
  a.playbackRate = slow ? 0.7 : 1;
  curAudio = a;
  markPlaying(text, true);
  a.onended = () => markPlaying(text, false);
  a.onerror = () => { if (curAudio === a) speechFallback(text, slow); };
  audioURL(text).then((src) => {
    if (curAudio !== a) return;
    if (!src) return speechFallback(text, slow);
    a.src = src; a.playbackRate = slow ? 0.7 : 1;
    a.play().catch((err) => { if (err.name !== "AbortError" && curAudio === a) speechFallback(text, slow); });
  });
  if (slow && !opts.auto) toast("🐢 бавно");
}
// Предварително сваляне на звуците (по един, за да не товари Google) — после всичко е мигновено и офлайн.
function audioTexts() {
  const texts = new Set();
  ITEMS.forEach((it) => {
    texts.add(deFull(it));
    if (it.pl) texts.add("die " + it.pl);
    if (it.forms) it.forms.forEach((f, i) => texts.add(sayPron(i) + " " + f));
  });
  ITEMS.forEach((it) => examplesFor(it).forEach(([de]) => texts.add(de)));
  ALPHABET.forEach((a) => { texts.add(a.say); texts.add(a.ex); texts.add(a.ch + " wie " + a.spell); });
  if (typeof DIALOGS !== "undefined") DIALOGS.forEach((d) => d.lines.forEach((l) => texts.add(l[1])));
  SOUNDS.forEach(([, list]) => list.forEach(([, , , ex]) => ex.forEach((w) => texts.add(w))));
  [...Array(21).keys(), 30, 40, 50, 60, 70, 80, 90, 100, 1000].forEach((n) => texts.add(num2de(n)));
  return texts;
}
async function warmAudio() {
  if (STATIC) return;
  for (const t of audioTexts()) {
    try { await fetch(ttsURL(t)); } catch { return; }
    await new Promise((r) => setTimeout(r, 120));
  }
}
const sayPron = (i) => PRONOUNS[i].split("/")[0];
const SPK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path class="w1" d="M15.5 8.5a5 5 0 0 1 0 7"/><path class="w2" d="M19 5a10 10 0 0 1 0 14"/></svg>`;
const sayBtn = (text, cls = "") => `<button class="say ${cls}" title="Чуй (цъкни пак за бавно)" data-say="${esc(text)}">${SPK}</button>`;
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-say]");
  if (b) { e.stopPropagation(); speak(b.dataset.say); }
});
// ── Цветен превод: немски ↔ български по части
const ROLE_SHORT = { subj: "кой? (подлог)", v: "глагол", obj: "какво/кого? (Akkusativ)", dat: "на кого? (Dativ)", pp: "къде/с какво/кога?", end: "край: 2-ри глагол / представка", neg: "отрицание", conj: "съюз", q: "въпрос", other: "" };
const firstGloss = (g) => (g || "").replace(/\([^)]*\)/g, "").split(/[;,/]/)[0].trim();
function chunksOf(de, A) {
  const T = A.tokens, out = [];
  T.forEach((t, i) => {
    const r = A.roles[i], last = out[out.length - 1];
    if (last && last.role === r && r !== "other" && r !== "v") last.idx.push(i); else out.push({ role: r, idx: [i] });
  });
  return out.map((c) => {
    const a = T[c.idx[0]], b = T[c.idx[c.idx.length - 1]];
    const text = de.slice(a.at, b.at + b.w.length);
    let note = "";
    const gl = c.idx.map((i) => {
      const r = A.res[i] || {}, w = T[i].w, lw = w.toLowerCase();
      if (r.kind === "art") { if (/^(der|die|das|den|dem)$/i.test(w)) note = "-ът/-та/-то"; else if (/^ein/i.test(w)) note = "един/една"; else if (/^kein/i.test(w)) return "никакъв/не"; else return firstGloss(LEXM[lw]) || ""; return ""; }
      if (r.kind === "verb" && r.item && i === A.vIdx) return firstGloss(r.item.bg);
      return firstGloss(LEXM[lw]) || (r.item ? firstGloss(r.item.bg) : "");
    }).filter(Boolean).join(" ");
    return { ...c, text, gloss: gl, note };
  });
}
function colorBG(bg, chunks) {
  if (!bg) return "";
  const toks = bg.split(/(\s+|[.,!?;:–—„“"()])/);
  const used = new Array(toks.length).fill(null);
  for (const c of chunks) {
    if (c.role === "other" && !c.gloss) continue;
    const stems = c.gloss.toLowerCase().split(/\s+/).filter((w) => w.length >= 2).map((w) => w.slice(0, w.length > 5 ? w.length - 2 : Math.max(2, w.length - 1)));
    toks.forEach((t, k) => {
      if (used[k] || !/[а-яА-Я]/.test(t)) return;
      const lt = t.toLowerCase();
      if (stems.some((st) => lt.startsWith(st) || (lt.length >= 3 && st.startsWith(lt.slice(0, Math.max(3, lt.length - 2)))))) used[k] = c.role;
    });
  }
  return toks.map((t, k) => (used[k] ? `<span class="bgc rc-${used[k]}">${esc(t)}</span>` : esc(t))).join("");
}
function breakdownHTML(de, bg, A, full) {
  const ch = chunksOf(de, A);
  const rows = ch.filter((c) => c.role !== "other" || c.gloss).map((c) => `<div class="bdr"><span class="ana r-${c.role}">${esc(c.text)}</span><span class="bdg">${esc(c.gloss || "—")}${c.note ? ` <small>(${c.note})</small>` : ""}</span>${ROLE_SHORT[c.role] ? `<small class="bdl">${ROLE_SHORT[c.role]}</small>` : ""}</div>`).join("");
  return `<div class="bdbg">${bg ? colorBG(bg, ch) : `<span class="muted">${esc(ch.map((c) => c.gloss).filter(Boolean).join(" "))}</span>`}</div>
    ${full ? `<details class="bdd" open><summary>Как е построено — част по част</summary><div class="bdrows">${rows}</div><div class="muted bdhint">👆 Цъкни немска дума за пълното „Защо?“ · цветовете съвпадат с превода</div></details>` : ""}`;
}
// „Разбор“: изречението по части + словоред
const ROLE = { subj: ["Подлог", "кой/какво? — Nominativ"], v: ["Глагол", "спрегнат — 2-ро място"], obj: ["Допълнение", "какво?/кого? — Akkusativ"], dat: ["Dativ", "на кого?"],
  pp: ["С предлог", "къде? с какво? кога?"], end: ["Край", "2-ри глагол / представка / zu"], neg: ["Отрицание", "nicht"], conj: ["Съюз", "свързва"], q: ["Въпрос", "въпросителна дума"], other: ["Друго", "кога, как, колко…"] };
function anatomyHTML(de) {
  const { tokens: T, roles, vIdx } = XP.roles(de);
  const chip = (i) => `<span class="ana r-${roles[i]}">${esc(T[i].w)}</span>`;
  const present = [...new Set(roles)].filter((r) => r !== "other" || roles.filter((x) => x === "other").length);
  const words = (r) => T.filter((_, i) => roles[i] === r).map((t) => t.w).join(" ");
  const parts = [];
  if (vIdx >= 0) parts.push(vIdx === 0 ? `Глаголът <b>${esc(T[0].w)}</b> е <b>най-отпред</b> — ${/\?\s*$/.test(de) ? "въпрос с отговор „да/не“" : "молба/заповед"}.` : `Глаголът <b>${esc(T[vIdx].w)}</b> е на <b>2-ро място</b>.`);
  if (roles.includes("subj")) parts.push(`Кой/какво? → <b>${esc(words("subj"))}</b> (подлог).`);
  if (roles.includes("obj")) parts.push(`Какво/кого? → <b>${esc(words("obj"))}</b> (Akkusativ).`);
  if (roles.includes("dat")) parts.push(`На кого? → <b>${esc(words("dat"))}</b> (Dativ).`);
  if (roles.includes("end")) parts.push(`В края: <b>${esc(words("end"))}</b>.`);
  // словоред I | II | средата | край
  let lastEnd = T.length; while (lastEnd > 0 && roles[lastEnd - 1] === "end") lastEnd--;
  const cols = vIdx > 0 ? [["I", T.slice(0, vIdx).map((_, i) => i)], ["II · глагол", [vIdx]], ["средата", T.slice(vIdx + 1, lastEnd).map((_, k) => vIdx + 1 + k)], ["край", T.slice(lastEnd).map((_, k) => lastEnd + k)]]
    : vIdx === 0 ? [["I · глагол", [0]], ["средата", T.slice(1, lastEnd).map((_, k) => 1 + k)], ["край", T.slice(lastEnd).map((_, k) => lastEnd + k)]] : null;
  return `<div class="anabox"><div class="analine">${T.map((_, i) => chip(i)).join(" ")}</div>
    <div class="analeg">${present.map((r) => `<span><i class="r-${r}"></i><b>${ROLE[r][0]}</b> ${ROLE[r][1]}</span>`).join("")}</div>
    ${parts.length ? `<div class="anasum">${parts.join(" ")}</div>` : ""}
    ${cols ? `<div class="anacols">${cols.map(([h, ix]) => `<div><small>${h}</small><div>${ix.map(chip).join(" ") || "—"}</div></div>`).join("")}</div>` : ""}
    <div class="muted" style="font-size:12.5px;margin-top:6px">👆 Цъкни дума в изречението за подробното „Защо?“</div></div>`;
}
document.addEventListener("click", (e) => {
  const a = e.target.closest(".anat"); if (!a) return;
  e.stopPropagation();
  const sent = a.closest(".sent"), box = sent.querySelector(".anabox");
  if (box) { box.remove(); a.classList.remove("on"); return; }
  a.classList.add("on");
  sent.querySelector(".sx").insertAdjacentHTML("afterend", anatomyHTML(sent.dataset.s));
}, true);
// „Защо?“ панел под изречението
function showWhy(wEl) {
  const sent = wEl.closest(".sent"), de = sent.dataset.s, i = +wEl.dataset.i;
  document.querySelectorAll(".xbox").forEach((x) => x.remove());
  document.querySelectorAll(".w.sel").forEach((x) => x.classList.remove("sel"));
  wEl.classList.add("sel");
  const w = wEl.dataset.w, r = (typeof XP !== "undefined" && XP.explain(de, i)) || {};
  const item = r.item || ITEM_BY_FORM.get(w.toLowerCase());
  const gl = wEl.dataset.g !== "—" ? wEl.dataset.g : item ? item.bg : "";
  const box = document.createElement("div");
  box.className = "xbox";
  box.innerHTML = `<div class="xh"><button class="say" data-say="${esc(w)}">${SPK}</button><div><b class="xw">${esc(w)}</b> <span class="tr" style="display:inline">${esc(wEl.dataset.t)}</span><div class="xg">${esc(gl)}</div></div><button class="xclose" data-xclose="1" title="Затвори">✕</button></div>
    <div class="xb">${r.html ? `<div class="xq">Защо?</div>${r.html}` : `<div class="muted">Тук няма специално граматично правило — думата значи „${esc(gl || "—")}“.</div>`}</div>
    ${item ? `<div class="xf">${openBtn(item)} <button class="link" data-train="${esc(item.id)}">🏋️ Тренирай думата</button></div>` : ""}`;
  sent.appendChild(box);
}
let toastT;
function toast(msg) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 1400);
}


// ───────── КАРТИЧКА НА ДУМАТА (отваря се отвсякъде) ─────────
const ITEM_BY_ID = new Map(ITEMS.map((it) => [it.id, it]));
const ITEM_BY_FORM = (() => {
  const m = new Map();
  ITEMS.filter((it) => !["phrase", "q"].includes(it.type)).forEach((it) => itemForms(it).forEach((f) => { if (!m.has(f)) m.set(f, it); }));
  return m;
})();
const GENDER = { der: "мъжки род", die: "женски род", das: "среден род" };
const OPPOSITE = { teuer: "billig", billig: "teuer", hell: "dunkel", dunkel: "hell", bequem: "unbequem", unbequem: "bequem", schön: "hässlich", hässlich: "schön",
  groß: "klein", klein: "groß", laut: "leise", leise: "laut", alt: "neu", neu: "alt", langweilig: "interessant", hoch: "niedrig", oben: "unten", hier: "dort", dort: "hier", ja: "nein", nein: "ja", richtig: "falsch" };
const MODALS = ["können", "dürfen", "wollen", "möchten", "sollen", "müssen"];
const deUml = (x) => x.replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/Ä/g, "A").replace(/Ö/g, "O").replace(/Ü/g, "U");
function pluralRule(de, pl) {
  if (pl === de) return "същата дума, сменя се само членът";
  const a = deUml(de), b = deUml(pl);
  let uml = "";
  for (let i = 0; i < Math.min(de.length, pl.length); i++) if (de[i] !== pl[i]) { if (deUml(pl[i]) === de[i]) uml = `${de[i]} → ${pl[i]}`; break; }
  if (!b.startsWith(a)) return "неправилно — научи го наизуст";
  const suf = b.slice(a.length);
  return (suf ? `добавя <b>-${esc(suf)}</b>` : "без окончание") + (uml ? ` и получава умлаут <b>${uml}</b>` : "");
}
function genderHint(it) {
  const d = it.de.toLowerCase();
  const rules = [[/ung$/, "die", "-ung"], [/(heit|keit)$/, "die", "-heit/-keit"], [/tion$/, "die", "-tion"], [/tät$/, "die", "-tät"], [/ei$/, "die", "-ei"], [/(ik)$/, "die", "-ik"], [/in$/, "die", "-in (женска професия)"], [/(chen|lein)$/, "das", "-chen/-lein"]];
  for (const [re, art, end] of rules) if (re.test(d) && art === it.art) return `Думите на <b>${end}</b> са (почти) винаги <span class="art ${art}">${art}</span>.`;
  const part = ITEMS.filter((o) => o.type === "noun" && ["der", "die", "das"].includes(o.art) && o !== it && o.de.length >= 3 && d.endsWith(o.de.toLowerCase()) && d !== o.de.toLowerCase())
    .sort((x, y) => y.de.length - x.de.length)[0];
  if (part) return `Сложна дума: <b>${esc(it.de.slice(0, it.de.length - part.de.length))}</b> + <b>${esc(part.de)}</b>. Родът идва от <b>последната</b> част: <span class="art ${part.art}">${part.art}</span> ${esc(part.de)}.`;
  return "";
}
function verbKind(it) {
  const reg = regularForms(it.de), f = it.forms, st = it.de.replace(/e?n$/, "");
  if (MODALS.includes(it.de)) return `<b>Модален глагол</b> — помага на друг глагол. Другият глагол отива <b>в края</b> и не се променя: <i>Ich ${f[0]} Deutsch sprechen.</i> Внимание: <b>ich</b> и <b>er</b> са еднакви и без окончание (ich ${f[0]}, er ${f[2]}).`;
  if (["sein", "haben", "wissen"].includes(it.de)) return "<b>Неправилен глагол</b> — не следва правилата. Научи формите наизуст (те са най-важните в езика).";
  if (it.de.startsWith("sich ")) return `<b>Възвратен глагол</b> — винаги със „себе си“: ich … <b>mich</b>, du … <b>dich</b>, er … <b>sich</b>. Като българското „представям <b>се</b>“.`;
  if (f[0].includes(" ")) { const pre = f[0].split(" ").pop(); return `<b>Разделим глагол</b> — представката <b>${pre}</b> се откъсва и отива <b>в края</b> на изречението: <i>Ich ${f[0].split(" ")[0]} … ${pre}.</i>`; }
  if (f[2] === st + "et" && reg[2] !== f[2]) return `<b>Почти правилен</b> — основата <b>${st}-</b> свършва на -t/-d, затова се добавя <b>e</b> за по-лесно изговаряне: du ${f[1]}, er ${f[2]}.`;
  if (f[1] === st + "t" && reg[1] !== f[1]) return `<b>Почти правилен</b> — основата свършва на s/ß/z, затова при <b>du</b> е само <b>-t</b>: du ${f[1]}.`;
  if (f[0] !== reg[0] && /eln$/.test(it.de)) return `<b>Почти правилен</b> — глаголите на -eln губят e при ich: <b>ich ${f[0]}</b>.`;
  if (f[2] !== reg[2]) return `<b>Сменя гласната</b> само при <b>du</b> и <b>er/sie/es</b>: ${esc(it.de)} → du <b>${f[1]}</b>, er <b>${f[2]}</b>. Останалите лица са нормални.`;
  return `<b>Правилен глагол</b> 👍 — следва схемата. Махаш -en → основа <b>${st}-</b> и добавяш: -e, -st, -t, -en, -t, -en.`;
}
function explainHTML(it) {
  const L = [], pat = [];
  const say = (t) => `<button class="pat" data-say="${esc(t)}">${SPK}<span>${esc(t)}</span></button>`;
  if (it.type === "noun") {
    if (["der", "die", "das"].includes(it.art)) {
      const a = it.art, ein = a === "die" ? "eine" : "ein", kein = a === "die" ? "keine" : "kein", mein = a === "die" ? "meine" : "mein";
      L.push(`<b>Какво е:</b> съществително (предмет, човек, място, понятие). В немския винаги се пише с <b>главна</b> буква.`);
      L.push(`<b>Род:</b> <span class="art ${a}">${a}</span> = ${GENDER[a]}. Учи я <b>винаги с члена</b>: „${a} ${esc(it.de)}“ — родът в немския често не съвпада с българския.`);
      const gh = genderHint(it); if (gh) L.push("💡 " + gh);
      L.push(`<b>Един / никакъв:</b> ${ein} ${esc(it.de)} · ${kein} ${esc(it.de)}  <span class="muted">(${a === "die" ? "при die: eine / keine" : "при der и das: ein / kein"})</span>`);
      if (it.pl) L.push(`<b>Много (мн.ч.):</b> <span class="art pl">die</span> ${esc(it.pl)} — ${pluralRule(it.de, it.pl)}. В мн.ч. членът е <b>винаги die</b>.`);
      else L.push(`<b>Мн.ч.:</b> обикновено не се използва (не се брои).`);
      L.push(`<b>Мой / моя:</b> ${mein} ${esc(it.de)}`);
      pat.push(`Das ist ${ein} ${it.de}.`, `Das ist ${kein} ${it.de}.`);
      if (it.pl) pat.push(`Das sind ${it.pl}.`);
    } else if (it.art === "pl") {
      L.push(`<b>Само мн.ч.:</b> <span class="art pl">die</span> ${esc(it.de)}. Няма единствено число — глаголът също е в мн.ч.: <i>Die ${esc(it.de)} sind …</i>`);
      pat.push(`Das sind meine ${it.de}.`);
    } else {
      L.push(`<b>Име</b> (на държава/град) — <b>без член</b>: <i>aus ${esc(it.de)}</i> (от), <i>in ${esc(it.de)}</i> (в).`);
      pat.push(`Ich komme aus ${it.de}.`, `Ich wohne in ${it.de}.`);
    }
  } else if (it.type === "verb") {
    L.push(`<b>Какво е:</b> глагол (действие). В речника стои с <b>-en</b> накрая: „${esc(it.de)}“ = „${esc(it.bg)}“.`);
    L.push(verbKind(it));
    L.push(`📌 В изречението глаголът стои <b>на 2-ро място</b>: <i>Heute ${esc(it.forms[0].split(" ")[0])} ich …</i> Във въпрос „да/не“ — на 1-во: <i>${esc(it.forms[1].split(" ")[0][0].toUpperCase() + it.forms[1].split(" ")[0].slice(1))} du …?</i>`);
  } else if (it.type === "adj") {
    L.push(`<b>Какво е:</b> прилагателно — описва <b>какво е</b> нещо. След <b>ist / sind</b> не се променя: <i>Das ist ${esc(it.de)}.</i>`);
    if (OPPOSITE[it.de]) L.push(`<b>Обратното:</b> <button class="pat inl" data-say="${OPPOSITE[it.de]}">${esc(OPPOSITE[it.de])}</button>`);
    pat.push(`Das ist ${it.de}.`, `Das ist nicht ${it.de}.`);
  } else if (it.type === "adv") {
    L.push(`<b>Какво е:</b> наречие — казва <b>как, кога или къде</b>. Никога не се променя.`);
    if (OPPOSITE[it.de]) L.push(`<b>Обратното:</b> ${esc(OPPOSITE[it.de])}`);
  } else if (it.type === "phrase" || it.type === "q") {
    L.push(`<b>Готов израз</b> — научи го цял, като една „дума“. Посочи всяка дума отдолу, за да видиш какво значи.`);
  } else {
    L.push(`<b>Малка служебна дума</b> — най-лесно се учи от примерите отдолу.`);
  }
  return `<ul class="expl">${L.map((x) => `<li>${x}</li>`).join("")}</ul>` + (pat.length ? `<div class="pats"><span class="muted">Шаблони:</span> ${pat.map(say).join("")}</div>` : "");
}
let sheetPrevKeys = null;
function openWord(id) {
  const it = typeof id === "string" ? ITEM_BY_ID.get(id) : id;
  if (!it) return;
  closeSheet(true);
  const exs = examplesFor(it);
  const b = box(it);
  const el = document.createElement("div");
  el.id = "sheet";
  el.innerHTML = `<div class="sh-bg"></div><aside class="sh" role="dialog" aria-label="Думата ${esc(it.de)}">
    <button class="sh-x" title="Затвори (Esc)">✕</button>
    <div class="sh-head ${it.type === "noun" ? "g-" + artCls(it) : ""}">
      <div class="sh-meta">${esc(TYPE_LABEL[it.type] || "")} · ${it.lessons.map((l) => (l ? "урок " + l : "основи")).join(", ")}</div>
      ${emojiOf(it) ? `<div class="sh-emo">${emojiOf(it)}</div>` : ""}<div class="sh-word">${sayBtn(deFull(it))}<span>${deHTML(it)}</span></div>
      <div class="tr" style="font-size:16px">[${esc(translit(deFull(it)))}]</div>
      <div class="sh-bgw">${esc(it.bg)}</div>
      ${it.type === "noun" && plText(it) ? `<div class="sh-pl">мн.ч.: ${it.pl ? `<button class="pat inl" data-say="${esc("die " + it.pl)}">die ${esc(it.pl)}</button>` : esc(plText(it))}</div>` : ""}
      ${it.note ? `<div class="sh-note">💡 ${esc(it.note)}</div>` : ""}
    </div>
    <h4>Обяснено просто</h4>${explainHTML(it)}
    ${it.type === "verb" ? `<h4>Спрежение — сегашно време <span class="muted">(цъкни ред, за да го чуеш)</span></h4><div class="sh-cj">${conjTable(it)}</div>` : ""}
    ${exs.length ? `<h4>Как се използва <span class="muted">(цветовете показват кое на кое отговаря · цъкни дума за „Защо?“)</span></h4>${exs.map(([d, g], k) => sentHTML(d, g, it, { bd: k === 0 ? "full" : "lite" })).join("")}` : ""}
    <div class="sh-foot"><span class="muted">${b < 0 ? "Нова дума" : "Ниво " + b + "/5"}</span>
      <button class="btn" data-train="${esc(it.id)}">🏋️ Тренирай</button><button class="btn bad" data-gr="0">Не я знам</button><button class="btn ok" data-gr="2">Знам я ✓</button></div>
  </aside>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("on"));
  el.querySelector(".sh-bg").onclick = () => closeSheet();
  el.querySelector(".sh-x").onclick = () => closeSheet();
  el.querySelector(".sh-foot").onclick = (e) => { const g = e.target.closest("[data-gr]"); if (g) { grade(it, +g.dataset.gr); toast(g.dataset.gr === "2" ? "✓ Отбелязана като научена" : "Ще я повтаряш по-често"); closeSheet(); } };
  sheetPrevKeys = keyHandler;
  keyHandler = (e) => { if (e.key === "Escape") { e.preventDefault(); closeSheet(); } };
  speak(deFull(it), { auto: true });
}
function closeSheet(instant) {
  const el = $("#sheet"); if (!el) return;
  keyHandler = sheetPrevKeys; sheetPrevKeys = null;
  if (instant) return el.remove();
  el.classList.remove("on"); setTimeout(() => el.remove(), 200);
}
const openBtn = (it, label = "📖 Всичко за думата") => `<button class="link openw" data-open="${esc(it.id)}">${label}</button>`;
document.addEventListener("click", (e) => {
  const o = e.target.closest("[data-open]");
  if (o && !e.target.closest("[data-say]") && !e.target.closest(".sent .w")) { e.stopPropagation(); e.preventDefault(); openWord(o.dataset.open); }
});
document.addEventListener("dblclick", (e) => {
  const w = e.target.closest(".sent .w"); if (!w) return;
  const it = ITEM_BY_FORM.get(w.dataset.w.toLowerCase()); if (it) openWord(it);
});

// ───────── рамка ─────────
const TABS = [["home", "🏠", "Днес"], ["cards", "🃏", "Учи"], ["ex", "🏋️", "Упражнения"], ["dict", "📖", "Речник"], ["grammar", "📐", "Граматика"], ["basics", "🔤", "Основи"], ["verbs", "⚙️", "Глаголи"], ["quiz", "✍️", "Бърз тест"]];
const TOP_MAIN = ["home", "cards", "ex", "dict", "grammar"], BOTTOM_MAIN = ["home", "cards", "ex", "dict"];
const tabInfo = (k) => TABS.find((t) => t[0] === k);
if (!tabInfo(S.tab)) S.tab = "home";
function renderNav() {
  const btn = (k) => { const [, ic, l] = tabInfo(k); return `<button data-tab="${k}" class="${S.tab === k ? "on" : ""}"><span class="ni">${ic}</span><span class="nl">${l}</span></button>`; };
  const inMore = !TOP_MAIN.includes(S.tab), inMoreB = !BOTTOM_MAIN.includes(S.tab);
  $("#nav").innerHTML = TOP_MAIN.map(btn).join("") + `<button data-more="1" class="${inMore ? "on" : ""}"><span class="ni">☰</span><span class="nl">${inMore ? tabInfo(S.tab)[2] : "Още"}</span></button>`;
  fitNav();
  $("#tabbar").innerHTML = BOTTOM_MAIN.map(btn).join("") + `<button data-more="1" class="${inMoreB ? "on" : ""}"><span class="ni">☰</span><span class="nl">${inMoreB ? tabInfo(S.tab)[2] : "Още"}</span></button>`;
  const h = (e) => { const b = e.target.closest("[data-tab]"); if (b) return go(b.dataset.tab); if (e.target.closest("[data-more]")) openMore(); };
  $("#nav").onclick = h; $("#tabbar").onclick = h;
  $(".brand").onclick = () => go("home");
}
const LESSON_TABS = ["cards", "ex", "dict", "quiz", "verbs"];
function lessonLabel() {
  const n = S.lessons.size;
  if (n === LESSONS.length) return "Всички уроци";
  if (n === 1) return lessonName(LESSONS.find((l) => S.lessons.has(l.id)));
  return `${n} урока`;
}
function renderSub() {
  fitNav();
  const b = $("#lessonBtn");
  b.hidden = !LESSON_TABS.includes(S.tab);
  b.innerHTML = `📚 <span>${esc(lessonLabel())}</span> <span class="caret">▾</span>`;
  b.onclick = openLessons;
}
function renderStats() {
  fitNav();
  const st = streak(), xp = store.get("xp", 0), lvl = Math.floor(xp / 300) + 1;
  $("#stats").innerHTML = `<span title="Поредни дни с учене">🔥 ${st}</span> <span class="xpchip" title="Точки: ${xp} · ниво ${lvl}">⭐ ${xp}<i class="lv"> · Lv ${lvl}</i></span>`;
}
function addXP(n) { const xp = store.get("xp", 0) + n; store.set("xp", xp); renderStats(); return xp; }
function confetti() {
  const el = document.createElement("div"); el.className = "confetti";
  el.innerHTML = [...Array(60)].map((_, i) => `<i style="left:${Math.random() * 100}%;background:hsl(${Math.random() * 360},90%,60%);animation-delay:${Math.random() * 0.6}s;transform:rotate(${Math.random() * 360}deg)"></i>`).join("");
  document.body.appendChild(el); setTimeout(() => el.remove(), 3200);
}
// ── панел (долу на телефон, вдясно на компютър)
function openPanel(title, html, onClick) {
  closePanel();
  const el = document.createElement("div");
  el.id = "panel";
  el.innerHTML = `<div class="pn-bg"></div><div class="pn"><div class="pn-h"><b>${title}</b><button class="sh-x" data-pclose="1">✕</button></div><div class="pn-b">${html}</div></div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("on"));
  el.onclick = (e) => { if (e.target.classList.contains("pn-bg") || e.target.closest("[data-pclose]")) return closePanel(); onClick && onClick(e); };
}
function closePanel() { const el = $("#panel"); if (!el) return; el.classList.remove("on"); setTimeout(() => el.remove(), 180); }
// горното меню никога не реже текст: при липса на място скрива второстепенното, стъпка по стъпка
let fitQ = false;
function fitNav() {
  if (fitQ) return; fitQ = true;
  queueMicrotask(() => { // след като хедърът е пренарисуван в същата стъпка
    fitQ = false;
    const hr = $(".hrow"), nav = $("#nav"); if (!hr || !nav || !nav.offsetParent) return;
    hr.classList.remove("c1", "c2", "c3");
    for (const c of ["c1", "c2", "c3"]) { if (nav.scrollWidth <= nav.clientWidth + 1) break; hr.classList.add(c); }
  });
}
addEventListener("resize", fitNav);
function openMore() {
  const rows = TABS.filter(([k]) => !BOTTOM_MAIN.includes(k)).map(([k, ic, l]) => `<button class="mrow ${S.tab === k ? "on" : ""}" data-go="${k}"><span class="ni">${ic}</span><span><b>${l}</b><small>${{ grammar: "Всички правила, обяснени просто", basics: "Азбука, звуци, четене, числа", verbs: "Таблици на всички глаголи", quiz: "Бързи тестове: превод, род, диктовка…" }[k] || ""}</small></span></button>`).join("");
  openPanel("Още", `<div class="mlist">${rows}</div><h4 class="pn-sec">Настройки</h4>${settingsHTML()}`, (e) => {
    const g = e.target.closest("[data-go]"); if (g) { closePanel(); go(g.dataset.go); return; }
    settingsClick(e);
  });
}
function settingsHTML() {
  return `<div class="mlist">
    <button class="mrow" data-set="tr"><span class="ni">аб</span><span><b>Транскрипция на кирилица</b><small>[дер штул] под всяка дума</small></span><span class="tgl ${S.showTr ? "on" : ""}"></span></button>
    <button class="mrow" data-set="auto"><span class="ni">🔊</span><span><b>Автоматичен звук в картите</b><small>изговаря думата, щом се покаже</small></span><span class="tgl ${S.auto ? "on" : ""}"></span></button>
  </div>
  <div class="legend2 pn-legend"><span class="art der">der</span> мъжки <span class="art die">die</span> женски <span class="art das">das</span> среден <span class="art pl">die</span> мн.ч.</div>`;
}
function settingsClick(e) {
  const t = e.target.closest("[data-set]"); if (!t) return;
  if (t.dataset.set === "tr") { S.showTr = !S.showTr; store.set("showTr", S.showTr); }
  if (t.dataset.set === "auto") { S.auto = !S.auto; store.set("auto", S.auto); }
  t.querySelector(".tgl").classList.toggle("on");
  if (t.dataset.set === "tr") render();
}
function openLessons() {
  const counts = (id) => ITEMS.filter((i) => inLesson(i, id)).length;
  const last = LESSONS[LESSONS.length - 1];
  const draw = () => `<div class="lq"><button class="btn" data-l="all">Всички</button><button class="btn" data-l="last">Само последния (${esc(lessonName(last))})</button></div>
    <div class="mlist">${[...LESSONS].reverse().map((l) => `<button class="mrow lrow ${S.lessons.has(l.id) ? "on" : ""}" data-l="${l.id}"><span class="lck">${S.lessons.has(l.id) ? "✓" : ""}</span>
      <span><b>${esc(lessonName(l))}${l.date ? " · " + l.date.slice(0, 5) : ""}</b><small>${esc(l.title)} · ${counts(l.id)} думи</small></span></button>`).join("")}</div>`;
  openPanel("Кои уроци учиш?", draw(), (e) => {
    const b = e.target.closest("[data-l]"); if (!b) return;
    if (b.dataset.l === "all") S.lessons = new Set(LESSONS.map((l) => l.id));
    else if (b.dataset.l === "last") S.lessons = new Set([last.id]);
    else { const id = +b.dataset.l; S.lessons.has(id) ? S.lessons.delete(id) : S.lessons.add(id); if (!S.lessons.size) S.lessons.add(id); }
    store.set("lessons", [...S.lessons]);
    $("#panel .pn-b").innerHTML = draw();
    renderSub(); renderStats(); render();
  });
}
// горната лента се скрива при скрол надолу и се показва при скрол нагоре
{
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY, top = $("#top");
    if (!top) return;
    if (y > lastY + 6 && y > 70) top.classList.add("hide");
    else if (y < lastY - 6 || y < 70) top.classList.remove("hide");
    lastY = y;
  }, { passive: true });
}
function go(tab) { if (!tabInfo(tab)) tab = "home"; S.tab = tab; store.set("tab", tab); closePanel(); closeSheet(true); renderNav(); renderSub(); render(); window.scrollTo(0, 0); $("#top")?.classList.remove("hide"); }
function render() {
  stopAudio();
  keyHandler = null; view.onclick = null; activeQuiz = null;
  ({ home: renderHome, basics: renderBasics, ex: renderExercises, dict: renderDict, cards: renderCardsHome, quiz: renderQuizHome, verbs: renderVerbs, grammar: renderGrammar })[S.tab]();
}
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (keyHandler) keyHandler(e);
});

// ───────── спрежение ─────────
function regularForms(inf) {
  const st = inf.replace(/e?n$/, "");
  return [st + "e", st + "st", st + "t", inf, st + "t", inf];
}
function conjTable(it) {
  const reg = it.de.includes(" ") ? it.forms : regularForms(it.de);
  return `<table class="cj">${PRONOUNS.map((p, i) => {
    const f = it.forms[i], irr = f !== reg[i];
    return `<tr data-say="${esc(sayPron(i) + " " + f)}" title="Чуй"><td>${p}</td><td class="${irr ? "irr" : ""}">${esc(f)}</td>${S.showTr ? `<td class="tr">${esc(translit(f))}</td>` : ""}</tr>`;
  }).join("")}</table>`;
}
const isSpecial = (it) => !it.de.includes(" ") && it.forms.some((f, i) => f !== regularForms(it.de)[i]);

// ───────── РЕЧНИК ─────────
let dictQ = "", dictG = "all";
function renderDict() {
  view.innerHTML = `
    <div class="toolbar">
      <input class="search" id="q" placeholder="Търси на немски или български…  ( / )" value="${esc(dictQ)}">
    </div>
    <div class="toolbar" id="tg">${TYPE_GROUPS.map(([k, l]) => `<button class="chip ${dictG === k ? "on" : ""}" data-g="${k}">${l}</button>`).join("")}</div>
    <div id="dl"></div>`;
  const q = $("#q");
  q.oninput = () => { dictQ = q.value; drawList(); };
  $("#tg").onclick = (e) => { const b = e.target.closest("[data-g]"); if (b) { dictG = b.dataset.g; renderDict(); } };
  keyHandler = (e) => { if (e.key === "/" && document.activeElement !== q) { e.preventDefault(); q.focus(); } if (e.key === "Escape") q.blur(); };
  drawList();
}
function drawList() {
  const term = canon(dictQ);
  const items = pool().filter((it) => inGroup(it, dictG) && (!term || canon(deFull(it) + " " + it.bg + " " + (it.pl || "")).includes(term)));
  let html = "";
  for (const l of LESSONS) {
    const li = items.filter((i) => inLesson(i, l.id));
    if (!li.length) continue;
    html += `<div class="lesson-h"><b>${lessonName(l)}</b><span>${l.date ? l.date + " · " : ""}${esc(l.title)} · ${li.length} думи</span></div>`;
    const tags = [...new Set(li.map((i) => i.tags[l.id]))];
    for (const t of tags) {
      html += `<h3>${esc(t)}</h3><div class="list">` + li.filter((i) => i.tags[l.id] === t).map(rowHTML).join("") + `</div>`;
    }
  }
  $("#dl").innerHTML = html || `<p class="hint" style="margin-top:30px">Няма резултати.</p>`;

}
function rowHTML(it) {
  const b = box(it);
  const pl = it.type === "noun" && plText(it) ? `<span class="pl">${esc(plText(it))}</span>` : "";
  const tag = it.type === "verb" ? `<span class="tag">глагол</span>` : it.type === "q" ? `<span class="tag">въпрос</span>` : "";
  return `<div class="row ${it.type === "verb" ? "verb" : ""}" data-word="${esc(deFull(it))}" data-open="${esc(it.id)}" title="Цъкни: всичко за думата">
    ${sayBtn(deFull(it))}
    <div class="de">${emojiOf(it) ? `<span class="emo">${emojiOf(it)}</span>` : ""}${deHTML(it)}${pl}${tag}${trHTML(deFull(it))}</div>
    <div class="bg">${esc(it.bg)}</div>
    <span class="dot ${b >= 0 ? "b" + b : ""}" title="${b < 0 ? "ново" : "ниво " + b + "/5"}"></span>
    <span class="chev">›</span>
    ${it.note ? `<div class="note">💡 ${esc(it.note)}</div>` : ""}
  </div>`;
}

// ───────── КАРТИ (spaced repetition) ─────────
let cardOpt = store.get("cardOpt", { dir: "de", group: "all" });
function renderCardsHome() {
  const p = pool().filter((it) => inGroup(it, cardOpt.group));
  const due = p.filter((i) => S.srs[i.id] && isDue(i)).length, fresh = p.filter((i) => !S.srs[i.id]).length;
  view.innerHTML = `
    <h2>Карти</h2>
    <p class="hint">Виж думата → спомни си → обърни (Space) → оцени се честно. Картите, които не знаеш, се връщат по-често; научените — все по-рядко.</p>
    <div class="toolbar"><span class="lbl">Посока</span>
      <button class="chip ${cardOpt.dir === "de" ? "on" : ""}" data-dir="de">Немски → Български</button>
      <button class="chip ${cardOpt.dir === "bg" ? "on" : ""}" data-dir="bg">Български → Немски</button></div>
    <div class="toolbar"><span class="lbl">Какво</span>${TYPE_GROUPS.map(([k, l]) => `<button class="chip ${cardOpt.group === k ? "on" : ""}" data-grp="${k}">${l}</button>`).join("")}</div>
    <div class="toolbar"><span class="lbl">Звук</span><button class="chip ${S.auto ? "on" : ""}" id="auto">автоматично произнасяне ${S.auto ? "вкл." : "изкл."}</button></div>
    <div class="modes">
      <button class="mode" data-go="due"><span class="ic">🔁</span><b>Учи (${Math.min(20, due + fresh)})</b><span>${due} за преговор + ${fresh} нови · по 20 на сесия</span></button>
      <button class="mode" data-go="all"><span class="ic">🎲</span><b>Всички разбъркани (${p.length})</b><span>Цялата селекция в случаен ред</span></button>
      <button class="mode" data-go="weak"><span class="ic">🎯</span><b>Слабите (${p.filter((i) => S.srs[i.id] && box(i) <= 1).length})</b><span>Само думите, които си сгрешил</span></button>
    </div>
    <div class="keys" style="margin-top:20px"><button class="chip" id="reset">Нулирай прогреса</button></div>`;
  view.onclick = (e) => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.dir) { cardOpt.dir = t.dataset.dir; store.set("cardOpt", cardOpt); renderCardsHome(); }
    if (t.dataset.grp) { cardOpt.group = t.dataset.grp; store.set("cardOpt", cardOpt); renderCardsHome(); }
    if (t.id === "auto") { S.auto = !S.auto; store.set("auto", S.auto); renderCardsHome(); }
    if (t.id === "reset" && confirm("Да изтрия ли целия прогрес?")) { S.srs = {}; store.set("srs", {}); renderStats(); renderCardsHome(); }
    if (t.dataset.go) startCards(t.dataset.go, p);
  };
  keyHandler = (e) => { if (e.key === "Enter") startCards("due", p); };
}
function startCards(kind, p) {
  let q;
  if (kind === "due") {
    const due = shuffle(p.filter((i) => S.srs[i.id] && isDue(i))).sort((a, b) => box(a) - box(b));
    const fresh = p.filter((i) => !S.srs[i.id]); // в реда на курса
    q = [...due, ...fresh].slice(0, 20);
  } else if (kind === "weak") q = shuffle(p.filter((i) => S.srs[i.id] && box(i) <= 1));
  else q = shuffle(p);
  if (!q.length) { toast("Няма карти тук — избери друг режим или повече уроци"); return; }
  const sess = { q, i: 0, flipped: false, total: q.length, know: 0, again: 0, seen: new Set() };
  view.onclick = null;
  drawCard(sess);
}
function cardFace(it, side) { // side: "front" | "back"
  const dir = cardOpt.dir;
  const deSide = `<div class="big">${it.type === "noun" && it.art ? `<span class="a c-${artCls(it)}">${artWord(it)}</span> ` : ""}<span class="${it.type === "noun" ? "c-" + artCls(it) : ""}">${esc(it.de)}</span></div>${trHTML(deFull(it))}
    ${it.type === "noun" && plText(it) ? `<div class="meta">мн.ч.: ${it.pl ? `<span class="pl-say" data-say="${esc("die " + it.pl)}">${esc(plText(it))} 🔊</span>` : esc(plText(it))}</div>` : ""}`;
  const bgSide = `${emojiOf(it) ? `<div class="cemo">${emojiOf(it)}</div>` : ""}<div class="mid">${esc(it.bg)}</div>`;
  if (side === "front") return dir === "de" ? deSide : bgSide + `<div class="meta">${TYPE_LABEL[it.type]}${it.type === "noun" ? " · с член!" : ""}</div>`;
  let extra = it.type === "verb" ? `<div style="display:flex;justify-content:center;margin-top:10px">${conjTable(it)}</div>` : "";
  if (it.note) extra += `<div class="meta">💡 ${esc(it.note)}</div>`;
  if (exampleFor(it) && !(["phrase", "q"].includes(it.type))) extra += `<div class="cex">${exHTML(it)}</div>`;
  return `<div class="back reveal">${dir === "de" ? bgSide : deSide}${extra}<div style="margin-top:8px">${openBtn(it, "📖 Всичко за думата (I)")}</div></div>`;
}
function drawCard(s) {
  if (s.i >= s.q.length) return cardsDone(s);
  if (!s.flipped) stopAudio();
  const it = s.q[s.i];
  const g = it.type === "noun" ? "g-" + artCls(it) : "";
  view.innerHTML = `<div class="stage">
    <div class="pinfo"><span>${s.seen.size} / ${s.total}</span><span>✓ ${s.know} · ↺ ${s.again}</span></div>
    <div class="prog"><i style="width:${(s.seen.size / s.total) * 100}%"></i></div>
    <div class="card ${g} ${s.flipped ? "" : "enter"}" id="card">
      <span class="corner">${it.lesson ? "Урок " + it.lessons.join(", ") : "Основи"} · ${esc(it.tag)}</span>
      ${sayBtn(deFull(it))}
      ${cardFace(it, "front")}
      ${s.flipped ? cardFace(it, "back") : ""}
    </div>
    ${s.flipped
      ? `<div class="btns"><button class="btn bad" data-q="0">Не знам<kbd>1</kbd></button><button class="btn" data-q="1">Трудно<kbd>2</kbd></button><button class="btn ok" data-q="2">Знам<kbd>3</kbd></button></div>`
      : `<div class="btns" style="grid-template-columns:1fr"><button class="btn primary" id="flip">Покажи отговора<kbd style="color:inherit;border-color:currentColor">Space</kbd></button></div>`}
    <div class="keys">Space – обърни · 1/2/3 – оценка · S – чуй · I – всичко за думата · Esc – изход</div>
  </div>`;
  if (S.auto && (cardOpt.dir === "de" ? !s.flipped : s.flipped)) speak(deFull(it), { auto: true });
  const flip = () => { if (!s.flipped) { s.flipped = true; drawCard(s); } };
  const rate = (q) => {
    if (!s.flipped) return;
    grade(it, q); s.seen.add(it.id);
    if (q === 0) { s.again++; s.q.splice(Math.min(s.i + 4, s.q.length), 0, it); }
    else if (q === 1) { s.q.splice(Math.min(s.i + 9, s.q.length), 0, it); }
    else s.know++;
    s.i++; s.flipped = false; drawCard(s);
  };
  $("#card").onclick = (e) => { if (!e.target.closest("[data-say]") && !e.target.closest(".sent")) flip(); };
  view.querySelector(".btns").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; b.id === "flip" ? flip() : rate(+b.dataset.q); };
  keyHandler = (e) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); s.flipped ? rate(2) : flip(); }
    else if (["1", "2", "3"].includes(e.key)) rate(+e.key - 1);
    else if (e.key.toLowerCase() === "s") speak(deFull(it));
    else if (e.key.toLowerCase() === "i" && s.flipped) openWord(it);
    else if (e.key === "Escape") renderCardsHome();
  };
}
function cardsDone(s) {
  view.innerHTML = `<div class="stage"><div class="card done" style="cursor:default">
    <div class="score">🎉 ${s.know}/${s.total}</div>
    <p class="meta">Знаеше ${s.know} от ${s.total} от първия път · ${s.again} повторения</p>
    <div class="btns" style="grid-template-columns:1fr 1fr;width:100%"><button class="btn" id="back">Назад</button><button class="btn primary" id="more">Още 20 <kbd style="color:inherit">Enter</kbd></button></div>
  </div></div>`;
  $("#back").onclick = renderCardsHome;
  const more = () => startCards("due", pool().filter((it) => inGroup(it, cardOpt.group)));
  $("#more").onclick = more;
  keyHandler = (e) => { if (e.key === "Enter") more(); if (e.key === "Escape") renderCardsHome(); };
}

// ───────── ТЕСТ ─────────
const QUIZ_MODES = [
  { k: "mc", ic: "🔤", t: "Избери превода", d: "4 отговора, немски ↔ български" },
  { k: "type", ic: "⌨️", t: "Напиши на немски", d: "Виждаш българската дума — пишеш немската (съществителни с член)" },
  { k: "gender", ic: "🎨", t: "der · die · das", d: "Само родът — най-бързият начин да го запомниш" },
  { k: "conj", ic: "⚙️", t: "Спрежение", d: "Глагол + лице → напиши формата" },
  { k: "plural", ic: "👥", t: "Множествено число", d: "Напиши мн.ч. на съществителното" },
  { k: "cloze", ic: "🕳️", t: "Попълни празното", d: "Изречение с липсваща дума — избери правилната форма" },
  { k: "order", ic: "🧩", t: "Подреди изречението", d: "Подреди думите в правилния немски словоред" },
  { k: "listenmc", ic: "👂", t: "Чуй и разбери", d: "Чуваш думата — избираш превода", ear: 1 },
  { k: "listen", ic: "🎧", t: "Диктовка", d: "Чуваш думата — пишеш я на немски", ear: 1 },
  { k: "letters", ic: "🔡", t: "Букви на слух", d: "Чуваш името на буква — пишеш буквата", ear: 1 },
  { k: "numbers", ic: "🔢", t: "Числа на слух", d: "Чуваш число — пишеш го с цифри", ear: 1 },
];
function renderQuizHome() {
  view.innerHTML = `<h2>Тест</h2><p class="hint">10–20 бързи въпроса. Грешките отиват автоматично в „Слабите“ карти.</p>
    <h3>Думи и граматика</h3><div class="modes" style="margin-top:0">${QUIZ_MODES.filter((m) => !m.ear).map(modeBtn).join("")}</div>
    <h3>На слух 🎧</h3><div class="modes" style="margin-top:0">${QUIZ_MODES.filter((m) => m.ear).map(modeBtn).join("")}</div>`;
  view.onclick = (e) => { const b = e.target.closest("[data-m]"); if (b) startQuiz(b.dataset.m); };
}
const modeBtn = (m) => `<button class="mode" data-m="${m.k}"><span class="ic">${m.ic}</span><b>${m.t}</b><span>${m.d}</span></button>`;
function buildQuiz(mode) {
  const p = pool();
  if (mode === "cloze") {
    const cands = p.map((it) => {
      const f = itemForms(it);
      const opts = shuffle(examplesFor(it).filter((e) => e[0] !== it.de)).map((ex) => ({ ex, target: (ex[0].match(WORD_RE) || []).find((t) => f.has(t.toLowerCase())) })).filter((o) => o.target);
      return opts.length ? { it, ...opts[0] } : null;
    }).filter(Boolean);
    return shuffle(cands).slice(0, 15).map((c) => {
      const pool2 = shuffle(cands.filter((o) => o.it.type === c.it.type && o.target.toLowerCase() !== c.target.toLowerCase()));
      const others = [...new Set(pool2.map((o) => o.target))].slice(0, 3);
      return { ...c, opts: shuffle([c.target, ...others]) };
    });
  }
  if (mode === "order") {
    const cands = p.map((it) => ({ it, ex: shuffle(examplesFor(it))[0] })).filter((c) => c.ex && !/[–„]/.test(c.ex[0]) && /^\S+(\s+\S+){2,7}$/.test(c.ex[0].trim()));
    return shuffle(cands).slice(0, 10).map((c) => {
      const toks = c.ex[0].trim().split(/\s+/);
      let sh = shuffle(toks); for (let n = 0; n < 5 && sh.join(" ") === toks.join(" "); n++) sh = shuffle(toks);
      return { ...c, toks, sh };
    });
  }
  if (mode === "letters") return shuffle(ALPHABET.filter((a) => !a.extra)).slice(0, 15).map((letter) => ({ letter }));
  if (mode === "numbers") {
    const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    return [...[...Array(5)].map(() => r(0, 20)), ...[...Array(6)].map(() => r(21, 99)), ...[...Array(4)].map(() => r(100, 2030))].map((num) => ({ num }));
  }
  if (mode === "listen") return shuffle(p.filter((i) => i.de.length < 30 && !i.de.includes("–") && !/\d/.test(i.de))).slice(0, 15).map((it) => ({ it }));
  const nouns = p.filter((i) => i.type === "noun");
  if (mode === "gender") return shuffle(nouns.filter((i) => ["der", "die", "das"].includes(i.art))).slice(0, 20).map((it) => ({ it }));
  if (mode === "plural") return shuffle(nouns.filter((i) => i.pl && i.art !== "pl")).slice(0, 15).map((it) => ({ it }));
  if (mode === "conj") {
    const verbs = verbPool();
    const out = [];
    for (let n = 0; n < 15 && verbs.length; n++) {
      const it = verbs[(Math.random() * verbs.length) | 0];
      let pi = (Math.random() * 6) | 0;
      if (isSpecial(it) && Math.random() < 0.6) pi = [1, 2, 0][(Math.random() * 3) | 0]; // фокус върху особените форми
      out.push({ it, pi });
    }
    return out;
  }
  if (mode === "type") return shuffle(p.filter((i) => i.type !== "phrase" && i.de.length < 30 && !i.de.includes("–"))).slice(0, 15).map((it) => ({ it }));
  // mc / listenmc
  return shuffle(p).slice(0, mode === "listenmc" ? 15 : 20).map((it) => {
    const rev = mode === "mc" && Math.random() < 0.4, hidden = mode === "listenmc";
    const same = shuffle(p.filter((o) => o !== it && o.type === it.type && o.bg !== it.bg));
    const others = same.length >= 3 ? same : shuffle(p.filter((o) => o !== it && o.bg !== it.bg));
    const opts = shuffle([it, ...others.slice(0, 3)]);
    return { it, rev, hidden, opts };
  });
}
function startQuiz(mode) {
  const qs = buildQuiz(mode);
  if (!qs.length) { toast("Няма подходящи думи в избраните уроци — избери друг урок от 📚"); return; }
  view.onclick = null;
  activeQuiz = { mode, qs, i: 0, score: 0, wrong: [] };
  drawQ(activeQuiz);
}
function qHead(s) {
  return `<div class="pinfo"><span>Въпрос ${s.i + 1} / ${s.qs.length}</span><span>✓ ${s.score}</span></div>
    <div class="prog"><i style="width:${(s.i / s.qs.length) * 100}%"></i></div>`;
}
function next(s, ok, it) {
  if (!it) { if (ok) s.score++; return; }
  if (ok) { s.score++; if (box(it) <= 0) grade(it, 1); } else { s.wrong.push(it); grade(it, 0); }
}
function drawQ(s) {
  if (s.i >= s.qs.length) return quizDone(s);
  const Q = s.qs[s.i], it = Q.it;
  let answered = false;
  stopAudio();
  const advance = () => { s.i++; drawQ(s); window.scrollTo(0, 0); };
  const showNext = () => {
    if ($("#qnext")) return;
    view.querySelector(".stage").insertAdjacentHTML("beforeend", `<button class="btn primary nextbtn" id="qnext">Напред →</button>`);
    $("#qnext").onclick = advance;
  };

  if (s.mode === "mc" || s.mode === "listenmc") {
    const prompt = Q.hidden ? `<button class="bigplay" data-say="${esc(deFull(it))}">${SPK}<span>чуй пак</span></button><div class="big" id="reveal" hidden>${deHTML(it)}</div>`
      : Q.rev ? `<div class="mid">${esc(it.bg)}</div>` : `<div class="big">${deHTML(it)}</div>${trHTML(deFull(it))}`;
    view.innerHTML = `<div class="stage">${qHead(s)}<div class="card" style="cursor:default;min-height:170px">${prompt}</div>
      <div class="opts">${Q.opts.map((o, n) => `<button class="opt" data-n="${n}"><kbd>${n + 1}</kbd>${Q.rev ? deHTML(o) : esc(o.bg)}</button>`).join("")}</div>
      <div class="keys">1–4 – отговор · Enter – напред</div></div>`;
    if (Q.hidden) speak(deFull(it), { auto: true }); // само при упражнение на слух
    const pick = (n) => {
      if (answered) return advance();
      answered = true; showNext();
      const ok = Q.opts[n] === it;
      view.querySelectorAll(".opt").forEach((b, k) => { if (Q.opts[k] === it) b.classList.add("right"); else if (k === n) b.classList.add("wrong"); });
      next(s, ok, it);
      if (Q.hidden) { $("#reveal").hidden = false; } else speak(deFull(it), { auto: true });
      view.querySelector(".opts").insertAdjacentHTML("afterend", `<div class="fb">${exHTML(it)}${openBtn(it)}</div>`);
      if (ok) setTimeout(() => { if (activeQuiz === s && s.qs[s.i] === Q && !document.querySelector(".fb:hover") && !$("#sheet")) advance(); }, 1600);
    };
    view.querySelector(".opts").onclick = (e) => { const b = e.target.closest("[data-n]"); if (b) pick(+b.dataset.n); };
    keyHandler = (e) => { if (/^[1-4]$/.test(e.key) && +e.key <= Q.opts.length) pick(+e.key - 1); else if (e.key === "Enter" && answered) advance(); else if (e.key === "Escape") renderQuizHome(); };
    return;
  }

  if (s.mode === "cloze") {
    const blank = esc(Q.ex[0]).replace(new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${Q.target}(?![A-Za-zÄÖÜäöüß])`), "$1<span class=\"blank\">_____</span>");
    view.innerHTML = `<div class="stage">${qHead(s)}<div class="card" id="cc" style="cursor:default;min-height:170px">
        <div class="mid" style="font-size:22px;line-height:1.5">${blank}</div><div class="meta">${esc(Q.ex[1])}</div></div>
      <div class="opts">${Q.opts.map((o, n) => `<button class="opt" data-n="${n}"><kbd>${n + 1}</kbd>${esc(o)}</button>`).join("")}</div>
      <div class="keys">1–4 – отговор · Enter – напред</div></div>`;
    const pick = (n) => {
      if (answered) return advance();
      answered = true; showNext();
      const ok = Q.opts[n] === Q.target;
      view.querySelectorAll(".opt").forEach((b, k) => { if (Q.opts[k] === Q.target) b.classList.add("right"); else if (k === n) b.classList.add("wrong"); });
      $("#cc").innerHTML = sentHTML(Q.ex[0], Q.ex[1], it) + `<div class="meta">${deHTML(it)} — ${esc(it.bg)}</div>` + openBtn(it);
      $("#cc .sbg").classList.add("open");
      next(s, ok, it); speak(Q.ex[0], { auto: true });
    };
    view.querySelector(".opts").onclick = (e) => { const b = e.target.closest("[data-n]"); if (b) pick(+b.dataset.n); };
    keyHandler = (e) => { if (/^[1-4]$/.test(e.key) && +e.key <= Q.opts.length) pick(+e.key - 1); else if (e.key === "Enter" && answered) advance(); else if (e.key === "Escape") renderQuizHome(); };
    return;
  }

  if (s.mode === "order") {
    const placed = [], free = Q.sh.map((t, i) => ({ t, i }));
    view.innerHTML = `<div class="stage">${qHead(s)}<div class="card" style="cursor:default;min-height:120px">
        <div class="mid" style="font-size:20px">${esc(Q.ex[1])}</div><div class="meta">подреди думите на немски</div></div>
      <div class="oline" id="ol"></div><div class="opool" id="op"></div><div class="fb" id="fb"></div>
      <div class="keys">цъкни думите поред · Backspace – махни последната · Enter – напред</div></div>`;
    const draw = () => {
      $("#ol").innerHTML = placed.map((c, k) => `<button class="chipw" data-k="${k}">${esc(c.t)}</button>`).join("") || `<span class="meta">…</span>`;
      $("#op").innerHTML = free.map((c, k) => `<button class="chipw" data-f="${k}">${esc(c.t)}</button>`).join("");
    };
    const check = () => {
      answered = true; showNext();
      const ok = placed.map((c) => c.t).join(" ") === Q.toks.join(" ");
      $("#ol").classList.add(ok ? "right" : "wrong");
      $("#fb").className = "fb " + (ok ? "ok" : "bad");
      $("#fb").innerHTML = (ok ? "Правилно!" : "Правилният ред:") + sentHTML(Q.ex[0], Q.ex[1], it) + openBtn(it);
      next(s, ok, it); speak(Q.ex[0], { auto: true });
    };
    draw();
    view.querySelector(".stage").onclick = (e) => {
      if (answered) return;
      const b = e.target.closest(".chipw"); if (!b) return;
      if (b.dataset.f !== undefined) placed.push(free.splice(+b.dataset.f, 1)[0]);
      else free.push(placed.splice(+b.dataset.k, 1)[0]);
      draw();
      if (!free.length) check();
    };
    keyHandler = (e) => {
      if (e.key === "Enter" && answered) advance();
      else if (e.key === "Backspace" && !answered && placed.length) { free.push(placed.pop()); draw(); }
      else if (e.key === "Escape") renderQuizHome();
    };
    return;
  }

  if (s.mode === "gender") {
    view.innerHTML = `<div class="stage">${qHead(s)}<div class="card" id="gc" style="cursor:default;min-height:200px">
      <div class="big">___ ${esc(it.de)}</div>${trHTML(it.de)}<div class="meta">${esc(it.bg)}</div><div class="meta" id="gpl"></div></div>
      <div class="btns"><button class="btn der" data-a="der">der<kbd>1</kbd></button><button class="btn die" data-a="die">die<kbd>2</kbd></button><button class="btn das" data-a="das">das<kbd>3</kbd></button></div>
      <div class="fb" id="fb"></div><div class="keys">1 der · 2 die · 3 das · Enter – напред</div></div>`;
    const pick = (a) => {
      if (answered) return advance();
      answered = true; showNext();
      const ok = a === it.art;
      $("#gc").className = "card g-" + it.art;
      $("#gc .big").innerHTML = deHTML(it);
      if (it.pl) $("#gpl").textContent = "мн.ч.: die " + it.pl;
      $("#fb").className = "fb " + (ok ? "ok" : "bad");
      $("#fb").innerHTML = ok ? "Правилно!" : `Не — <span class="art ${it.art}">${it.art}</span> ${esc(it.de)}`;
      if (it.note && !ok) $("#fb").innerHTML += `<span class="sol" style="font-size:14px;font-weight:500">💡 ${esc(it.note)}</span>`;
      $("#fb").innerHTML += exHTML(it) + openBtn(it);
      next(s, ok, it); speak(deFull(it), { auto: true });
      if (ok) setTimeout(() => { if (activeQuiz === s && s.qs[s.i] === Q && !document.querySelector("#fb:hover") && !$("#sheet")) advance(); }, 1600); // при грешка — чака Enter, за да прочетеш
    };
    view.querySelector(".btns").onclick = (e) => { const b = e.target.closest("[data-a]"); if (b) pick(b.dataset.a); };
    keyHandler = (e) => { const m = { 1: "der", 2: "die", 3: "das" }[e.key]; if (m) pick(m); else if (e.key === "Enter" && answered) advance(); else if (e.key === "Escape") renderQuizHome(); };
    return;
  }

  // режими с писане
  let prompt, sol, accept, hint = "";
  let say = null; // текст за „чуй пак“
  if (s.mode === "listen") {
    say = deFull(it);
    prompt = `<button class="bigplay" data-say="${esc(say)}">${SPK}<span>чуй пак</span></button><div class="meta">напиши каквото чуваш${it.type === "noun" && it.art ? " (членът не е задължителен)" : ""}</div>`;
    sol = say;
    accept = (v) => sameDe(v, sol) || sameDe(v, it.de);
  } else if (s.mode === "letters") {
    say = Q.letter.say;
    prompt = `<button class="bigplay" data-say="${esc(say)}">${SPK}<span>чуй пак</span></button><div class="meta">коя буква е това?</div>`;
    sol = Q.letter.ch;
    accept = (v) => v.trim().toLowerCase() === sol.toLowerCase() || (sol === "ß" && v.trim().toLowerCase() === "ss");
    hint = "една буква";
  } else if (s.mode === "numbers") {
    say = num2de(Q.num, Q.num >= 1100 && Q.num < 2000);
    prompt = `<button class="bigplay" data-say="${esc(say)}">${SPK}<span>чуй пак</span></button><div class="meta">напиши числото с цифри</div>`;
    sol = String(Q.num);
    accept = (v) => v.replace(/\D/g, "") === sol;
    hint = "напр. 35";
  } else if (s.mode === "type") {
    prompt = `<div class="mid">${esc(it.bg)}</div><div class="meta">${TYPE_LABEL[it.type]}${it.type === "noun" && it.art && it.art !== "pl" ? " · напиши и члена" : ""}</div>`;
    sol = deFull(it);
    accept = (v) => sameDe(v, sol) || (it.type === "verb" && sameDe(v, it.de)) || (it.type === "noun" && !it.art && sameDe(v, it.de));
  } else if (s.mode === "plural") {
    prompt = `<div class="big">${deHTML(it)}</div><div class="meta">${esc(it.bg)} · напиши множественото число</div>`;
    sol = "die " + it.pl;
    accept = (v) => sameDe(v, sol) || sameDe(v, it.pl);
    hint = "без член е ок";
  } else {
    const pr = PRONOUNS[Q.pi];
    prompt = `<div class="meta">${esc(it.de)} — ${esc(it.bg)}</div><div class="big">${esc(pr)} ___</div>`;
    sol = it.forms[Q.pi];
    accept = (v) => sameDe(v, sol) || sameDe(v, pr.split("/").pop() + " " + sol) || PRONOUNS[Q.pi].split("/").some((x) => sameDe(v, x + " " + sol));
  }
  view.innerHTML = `<div class="stage">${qHead(s)}<div class="card" style="cursor:default;min-height:170px">${prompt}</div>
    <input class="answer" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${hint || "напиши тук…"}">
    <div class="uml">${["ä", "ö", "ü", "ß"].map((c) => `<button data-c="${c}" tabindex="-1">${c}</button>`).join("")}</div>
    <div class="fb" id="fb"></div>
    <div class="keys">Enter – провери / напред${say ? " (празно Enter = чуй пак)" : ""} · Esc – изход · ae/oe/ue/ss също се приемат</div></div>`;
  const inp = $("#ans"); inp.focus();
  if (say) setTimeout(() => speak(say, { auto: true }), 150);
  view.querySelector(".uml").onclick = (e) => {
    const b = e.target.closest("[data-c]"); if (!b) return;
    const [a, z] = [inp.selectionStart, inp.selectionEnd];
    inp.value = inp.value.slice(0, a) + b.dataset.c + inp.value.slice(z); inp.focus(); inp.setSelectionRange(a + 1, a + 1);
  };
  const check = () => {
    if (answered) return advance();
    if (!inp.value.trim()) { if (say) speak(say, { auto: true }); return; }
    answered = true; showNext();
    const ok = accept(inp.value);
    inp.classList.add(ok ? "right" : "wrong"); inp.readOnly = true;
    $("#fb").className = "fb " + (ok ? "ok" : "bad");
    const solHTML = s.mode === "letters" ? `${esc(sol)} <span style="font-weight:500">— „${esc(Q.letter.name)}“</span>`
      : s.mode === "numbers" ? `${sol} <span style="font-weight:500">— ${esc(say)}</span>${trHTML(say)}`
      : s.mode === "conj" ? esc(PRONOUNS[Q.pi] + " " + sol) + trHTML(sayPron(Q.pi) + " " + sol)
      : s.mode === "plural" ? `<span class="art pl">die</span> ${esc(it.pl)}${trHTML(sol)}` : deHTML(it) + trHTML(deFull(it)) + (s.mode === "listen" ? `<span class="meta" style="display:block;font-weight:500">${esc(it.bg)}</span>` : "");
    $("#fb").innerHTML = (ok ? "Правилно! " : "Правилно е:") + `<span class="sol">${solHTML}</span>` + (it && !["phrase", "q"].includes(it.type) ? exHTML(it) : "") + (it ? openBtn(it) : "");
    next(s, ok, it); if (!say) speak(s.mode === "conj" ? sayPron(Q.pi) + " " + sol : sol, { auto: true });
  };
  keyHandler = (e) => { if (e.key === "Enter") { e.preventDefault(); check(); } else if (e.key === "Escape") renderQuizHome(); };
}
function quizDone(s) {
  const pct = Math.round((s.score / s.qs.length) * 100);
  const uniq = [...new Set(s.wrong)];
  view.innerHTML = `<div class="stage"><div class="card done" style="cursor:default">
    <div class="score">${pct >= 90 ? "🏆" : pct >= 70 ? "💪" : "📚"} ${s.score}/${s.qs.length}</div>
    <p class="meta">${pct}% верни</p>
    ${uniq.length ? `<div style="text-align:left;width:100%;margin-top:10px"><h3>За повторение</h3><div class="list">${uniq.map(rowHTML).join("")}</div></div>` : ""}
    <div class="btns" style="grid-template-columns:1fr 1fr;width:100%"><button class="btn" id="back">Други тестове</button><button class="btn primary" id="again">Пак <kbd style="color:inherit">Enter</kbd></button></div>
  </div></div>`;
  $("#back").onclick = renderQuizHome;
  $("#again").onclick = () => startQuiz(s.mode);
  keyHandler = (e) => { if (e.key === "Enter") startQuiz(s.mode); if (e.key === "Escape") renderQuizHome(); };
}

// ───────── ГЛАГОЛИ ─────────
let verbOnlySpecial = false;
// ако в избраните уроци няма глаголи (напр. „Основи“) — показвай всички, вместо празна страница
const verbPool = () => { const v = pool().filter((i) => i.type === "verb"); return v.length ? v : ITEMS.filter((i) => i.type === "verb"); };
function renderVerbs() {
  const allV = verbPool(), fallback = !pool().some((i) => i.type === "verb");
  const vs = allV.filter((i) => !verbOnlySpecial || isSpecial(i) || i.de.includes(" "));
  view.innerHTML = `<h2>Глаголи</h2>
    <p class="hint"><b style="color:var(--accent)">Оранжево</b> = форма, която се отклонява от правилото -e, -st, -t, -en, -t, -en. Виж „Граматика → Глаголи“.</p>
    ${fallback ? `<p class="hint">ℹ️ В избраните уроци няма глаголи, затова виждаш глаголите от всички уроци.</p>` : ""}
    <div class="toolbar"><button class="chip ${!verbOnlySpecial ? "on" : ""}" data-s="0">Всички (${allV.length})</button>
      <button class="chip ${verbOnlySpecial ? "on" : ""}" data-s="1">Само особените</button>
      <button class="chip" id="vq">⚙️ Тест по спрежение →</button></div>
    <div class="vgrid">${vs.map((it) => `<div class="vcard" data-open="${esc(it.id)}" title="Цъкни: всичко за глагола">
      <div class="vh">${sayBtn(it.de)}<b>${esc(it.de)}</b>${isSpecial(it) ? `<span class="badge">особен</span>` : ""}</div>
      <div class="vbg">${trHTML(it.de)} ${esc(it.bg)} · урок ${it.lessons.join(", ")}</div>
      ${conjTable(it)}
      ${it.note ? `<div class="note">💡 ${esc(it.note)}</div>` : ""}</div>`).join("")}</div>`;
  view.onclick = (e) => {
    const b = e.target.closest("button"); if (!b || b.dataset.say) return;
    if (b.dataset.s) { verbOnlySpecial = b.dataset.s === "1"; renderVerbs(); }
    if (b.id === "vq") { go("quiz"); startQuiz("conj"); }
  };
}

// ───────── ГРАМАТИКА ─────────
let gTopic = store.get("gTopic", GRAMMAR[0].id);
function renderGrammar() {
  const g = GRAMMAR.find((x) => x.id === gTopic) || GRAMMAR[0];
  view.innerHTML = `<div class="gwrap">
    <div class="gnav">${GRAMMAR.map((x) => `<button data-g="${x.id}" class="${x.id === g.id ? "on" : ""}">${x.icon}&nbsp; ${x.title}</button>`).join("")}</div>
    <article class="gbody"><h2>${g.title}</h2>${g.html}</article></div>`;
  view.onclick = (e) => {
    const b = e.target.closest("[data-g]");
    if (b) { gTopic = b.dataset.g; store.set("gTopic", gTopic); renderGrammar(); return; }
    const cell = e.target.closest(".spk");
    if (cell) speak(cell.textContent.replace(/\(.*?\)/g, "").replace(/[\u0400-\u04FF]+/g, "").replace(/[→=+−]/g, ","));
  };
  view.querySelectorAll("table.g td, .gbody i").forEach((el) => { if (/[a-zäöüß]{2}/i.test(el.textContent.replace(/[\u0400-\u04FF]+/g, ""))) el.classList.add("spk"); });
  keyHandler = (e) => {
    const i = GRAMMAR.findIndex((x) => x.id === g.id);
    if (e.key === "ArrowDown" || e.key === "j") { gTopic = GRAMMAR[Math.min(GRAMMAR.length - 1, i + 1)].id; renderGrammar(); }
    if (e.key === "ArrowUp" || e.key === "k") { gTopic = GRAMMAR[Math.max(0, i - 1)].id; renderGrammar(); }
  };
}


// ───────── ДНЕС (начален екран) ─────────
function renderHome() {
  const all = ITEMS;
  const due = all.filter((i) => S.srs[i.id] && isDue(i)).length;
  const fresh = all.filter((i) => !S.srs[i.id]).length;
  const weak = all.filter((i) => S.srs[i.id] && box(i) <= 1).length;
  const td = S.log[today()] || 0, pct = Math.min(1, td / S.goal), st = streak();
  const h = new Date().getHours();
  const hello = h < 11 ? "Guten Morgen" : h < 18 ? "Guten Tag" : "Guten Abend";
  const R = 34, C = 2 * Math.PI * R;
  const wotd = (() => { const n = all.filter((i) => i.type === "noun" && i.art && i.art !== "pl"); return n[Math.floor(Date.now() / DAY) % n.length]; })();
  const week = [...Array(7)].map((_, k) => { const off = 6 - k, d = today(off); return { d, n: S.log[d] || 0, lbl: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][new Date(Date.now() - off * DAY).getDay()] }; });
  const wmax = Math.max(S.goal, ...week.map((w) => w.n));
  const rm = roadmap();
  view.innerHTML = `
  <section class="hero">
    <div>
      <div class="hello" data-say="${hello}!">${hello}! 👋</div>
      <p class="hint" style="margin:4px 0 16px">${due ? `<b>${due}</b> думи чакат преговор` : "Нищо за преговор"} · <b>${fresh}</b> нови · 🔥 серия <b>${st}</b> ${st === 1 ? "ден" : "дни"}</p>
      <div class="ctas"><button class="cta" id="go-lesson">▶&nbsp; Продължи урока <span>5 нови думи с картинки и упражнения</span></button>
      <button class="cta cta2" id="go-learn">🃏&nbsp; Преговор <span>${due ? due + " чакат" : Math.min(20, due + fresh) + " карти"}</span></button>
      <button class="cta cta2" id="go-ex">🏋️&nbsp; Упражнения <span>${EX_TYPES.length} вида задачи</span></button></div>
    </div>
    <div class="ring" title="Днес: ${td} от ${S.goal}">
      <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="${R}" class="rb"/><circle cx="40" cy="40" r="${R}" class="rf" style="stroke-dasharray:${C};stroke-dashoffset:${C * (1 - pct)}"/></svg>
      <div><b>${td}</b><small>от ${S.goal}</small></div>
    </div>
  </section>

  ${(() => { const L = LESSONS[LESSONS.length - 1], li = ITEMS.filter((i) => inLesson(i, L.id)), k = li.filter((i) => box(i) >= 3).length;
    return `<section class="latest"><div class="lt-l"><span class="muted">Последен урок · ${esc(L.date)}</span><b>${esc(lessonName(L))}: ${esc(L.title)}</b>
      <div class="bar"><i class="k" style="width:${(k / li.length) * 100}%"></i></div><small class="muted">${k} от ${li.length} думи научени</small></div>
      <div class="lt-b"><button class="btn primary" data-lesson="${L.id}">🃏 Учи думите</button><button class="btn" data-lex="${L.id}">🏋️ Упражнения</button><button class="btn" data-ldict="${L.id}">📖 Думите</button></div></section>`; })()}
  ${store.get("howtoHidden", true) ? `<p class="keys" style="text-align:left;margin-top:14px"><button class="link" id="howto-show">❓ Как да уча с това приложение</button></p>` : `
  <section class="howto">
    <div class="howto-h"><b>❓ Как да учиш тук — 4 стъпки</b><button class="link" id="howto-hide">скрий</button></div>
    <ol>
      <li><b>Започни от нулата:</b> „🔤 Основи“ → азбука и звуци. Така ще можеш да четеш всяка дума.</li>
      <li><b>Всеки ден натисни „▶ Учи сега“.</b> Виждаш дума → опитваш да си спомниш → Space → казваш честно „знам“ или „не знам“. Приложението само решава кога да ти я покаже пак.</li>
      <li><b>Цъкни върху всяка дума</b> (в речника, на картата, след отговор) → отваря се <b>„картичка“</b>: превод, как се чете, просто обяснение, спрежение и примерни изречения. Посочи дума в изречението → виждаш превода ѝ.</li>
      <li><b>Провери се в „✍️ Тест“.</b> Там звукът е изключен, за да не ти подсказва. Грешките отиват автоматично в „Слабите“ за повторение.</li>
    </ol>
    <p class="muted" style="margin:6px 0 0">Цветовете навсякъде: <span class="art der">der</span> = мъжки, <span class="art die">die</span> = женски, <span class="art das">das</span> = среден, <span class="art pl">die</span> = мн.ч.</p>
  </section>`}
  <details class="roadd"><summary>Пътят от А до Я · <span class="muted">${rm.steps.filter((x) => x.done).length} от ${rm.steps.length} стъпки</span></summary>
  <div class="road">${rm.steps.map((st, i) => `<button class="step ${st.done ? "done" : ""} ${i === rm.nextI ? "next" : ""}" data-step="${i}">
    <span class="si">${st.done ? "✓" : st.ic}</span><b>${esc(st.t)}</b><small>${esc(st.d)}</small>
    ${st.p !== undefined ? `<span class="sp"><i style="width:${Math.round(st.p * 100)}%"></i></span>` : ""}
    ${i === rm.nextI ? `<em>следваща стъпка</em>` : ""}</button>`).join("")}</div></details>

  <div class="quick">
    <button class="qk" data-act="gender"><span>🎨</span><b>der · die · das</b><small>тренирай рода</small></button>
    <button class="qk" data-act="mc"><span>🔤</span><b>Бърз тест</b><small>избери превода</small></button>
    <button class="qk" data-act="conj"><span>⚙️</span><b>Спрежение</b><small>ich, du, er…</small></button>
    <button class="qk" data-act="weak"><span>🎯</span><b>Слабите</b><small>${weak} думи</small></button>
  </div>

  <div class="two">
    <div class="panel">
      <h3 style="margin-top:0">Уроци</h3>
      ${LESSONS.map((l) => {
        const li = all.filter((i) => inLesson(i, l.id)), n = li.length;
        const k = li.filter((i) => box(i) >= 3).length, w = li.filter((i) => box(i) >= 0 && box(i) < 3).length;
        return `<div class="lp">
          <div class="lp-h"><b>${lessonName(l)}</b><span>${esc(l.title)}</span><em>${Math.round((k / n) * 100)}%</em></div>
          <div class="bar"><i class="k" style="width:${(k / n) * 100}%"></i><i class="w" style="width:${(w / n) * 100}%"></i></div>
          <div class="lp-f"><small>${l.date ? l.date + " · " : ""}${k} научени · ${w} в процес · ${n - k - w} нови</small><button class="link" data-lesson="${l.id}">Учи урока →</button></div>
        </div>`;
      }).join("")}
      <div class="legend2"><span><i class="k"></i>научени</span><span><i class="w"></i>в процес</span><span><i></i>нови</span></div>
    </div>
    <div class="panel">
      <h3 style="margin-top:0">Дума на деня</h3>
      <div class="wotd g-${wotd.art}" data-open="${esc(wotd.id)}">
        <div class="big">${deHTML(wotd)}</div>${trHTML(deFull(wotd))}
        <div>${esc(wotd.bg)}${wotd.pl ? ` · мн.ч. die ${esc(wotd.pl)}` : ""}</div>
        <small>цъкни за всичко за думата 📖</small>
      </div>
      <h3>Последните 7 дни</h3>
      <div class="week">${week.map((w) => `<div class="wd ${w.d === today() ? "now" : ""}" title="${w.n} отговора"><div class="wb"><i style="height:${(w.n / wmax) * 100}%" class="${w.n >= S.goal ? "full" : ""}"></i></div><small>${w.lbl}</small></div>`).join("")}</div>
      <div class="toolbar" style="margin-top:12px"><span class="lbl">Дневна цел</span>${[20, 40, 60, 100].map((g) => `<button class="chip ${S.goal === g ? "on" : ""}" data-goal="${g}">${g}</button>`).join("")}</div>
    </div>
  </div>
  <p class="keys" style="margin-top:22px">💡 Цъкни върху всяка немска дума, за да я чуеш. Цъкни пак — ще я чуеш бавно.</p>`;
  const learnAll = () => { S.lessons = new Set(LESSONS.map((l) => l.id)); store.set("lessons", [...S.lessons]); cardOpt.group = "all"; S.tab = "cards"; renderNav(); renderSub(); render(); startCards("due", pool()); };
  view.onclick = (e) => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.id === "go-learn") learnAll();
    if (t.id === "go-ex") { go("ex"); return; }
    if (t.id === "go-lesson") { startEx("learn"); return; }
    if (t.dataset.lex) { S.lessons = new Set([+t.dataset.lex]); store.set("lessons", [...S.lessons]); renderSub(); startEx("mix"); return; }
    if (t.dataset.ldict) { S.lessons = new Set([+t.dataset.ldict]); store.set("lessons", [...S.lessons]); go("dict"); return; }
    if (t.id === "howto-hide") { store.set("howtoHidden", true); renderHome(); }
    if (t.id === "howto-show") { store.set("howtoHidden", false); renderHome(); }
    if (t.dataset.step) rm.steps[+t.dataset.step].go();
    if (t.dataset.goal) { S.goal = +t.dataset.goal; store.set("goal", S.goal); renderStats(); renderHome(); }
    if (t.dataset.lesson) { S.lessons = new Set([+t.dataset.lesson]); store.set("lessons", [...S.lessons]); cardOpt.group = "all"; S.tab = "cards"; renderNav(); renderSub(); renderStats(); render(); startCards("due", pool()); }
    if (t.dataset.act === "weak") { S.tab = "cards"; renderNav(); renderSub(); render(); startCards("weak", pool()); }
    else if (t.dataset.act) { S.tab = "quiz"; renderNav(); renderSub(); render(); startQuiz(t.dataset.act); }
  };
  keyHandler = (e) => { if (e.key === "Enter") learnAll(); };
}


// ───────── ОСНОВИ (азбука, звуци, четене, спелуване, числа) ─────────
const BASICS = [
  ["alphabet", "🔤", "Азбука"], ["sounds", "🗣", "Звуци"], ["rules", "📏", "Правила за четене"],
  ["spell", "📞", "Спелуване"], ["numbers", "🔢", "Числа"],
];
let bTopic = store.get("bTopic", "alphabet");
let seqToken = 0;
async function playSequence(texts, onStep, gap = 250) { // изговаря поред; onStep(i) за подсветка
  const my = ++seqToken;
  for (let i = 0; i < texts.length; i++) {
    if (my !== seqToken) return;
    onStep && onStep(i);
    const src = await audioURL(texts[i]);
    if (my !== seqToken) return;
    await new Promise((res) => {
      if (curAudio) curAudio.pause();
      const a = new Audio(src || ""); curAudio = a;
      a.onended = a.onerror = () => setTimeout(res, gap);
      a.play().catch(() => res());
    });
  }
  if (my === seqToken) onStep && onStep(-1);
}
function visit(k) { if (!S.visited[k]) { S.visited[k] = Date.now(); store.set("visited", S.visited); } }
function renderBasics() {
  keyHandler = null;
  const t = BASICS.find((b) => b[0] === bTopic) || BASICS[0];
  visit(t[0]);
  view.innerHTML = `<div class="gwrap">
    <div class="gnav">${BASICS.map(([k, ic, n]) => `<button data-b="${k}" class="${k === t[0] ? "on" : ""}">${ic}&nbsp; ${n}</button>`).join("")}</div>
    <article id="bb"></article></div>`;
  ({ alphabet: bAlphabet, sounds: bSounds, rules: bRules, spell: bSpell, numbers: bNumbers })[t[0]]($("#bb"));
  $(".gnav").onclick = (e) => { const b = e.target.closest("[data-b]"); if (b) { seqToken++; bTopic = b.dataset.b; store.set("bTopic", bTopic); renderBasics(); window.scrollTo(0, 0); } };
}
function bAlphabet(el) {
  const tile = (a, i) => `
      <div class="lt" data-i="${i}">
        <div class="lt-top"><span class="L">${a.ch}${a.ch === "ß" ? "" : `<small>${a.ch.toLowerCase()}</small>`}</span>
          <span class="nm">[${esc(a.name)}]<i>/${esc(a.ipa)}/</i></span></div>
        <div class="snd">звук: <b>${esc(a.sound)}</b></div>
        <button class="ex" data-say="${esc(a.ex)}">${SPK}<span><b>${esc(a.ex)}</b> <em>[${esc(translit(a.ex))}]</em><br><small>${esc(a.exBg)}</small></span></button>
        <div class="spl">${a.ch} wie <b>${esc(a.spell)}</b></div>
        ${a.note ? `<div class="lnote">💡 ${esc(a.note)}</div>` : ""}
      </div>`;
  const base = ALPHABET.filter((a) => !a.extra), ext = ALPHABET.filter((a) => a.extra);
  el.innerHTML = `
    <div class="bhead"><div><h2 style="margin-top:0">Азбуката — 26 букви</h2>
      <p class="hint">Същите 26 латински букви като в английския, но се казват по немски. Цъкни буква, за да чуеш името ѝ; цъкни примера, за да чуеш думата.</p></div>
      <div class="bact"><button class="btn primary" id="playall">▶ Цялата азбука</button><button class="btn" id="lt">🔡 Тест на слух</button></div></div>
    <div class="abc">${base.map((a) => tile(a, ALPHABET.indexOf(a))).join("")}</div>
    <h3>+ 4 специални знака</h3>
    <p class="hint">Ä, Ö, Ü (умлаути) и ß (есцет) <b>не са отделни букви в азбуката</b> — в речниците стоят при A, O, U и S. Но се срещат постоянно, затова ги научи веднага.</p>
    <div class="abc">${ext.map((a) => tile(a, ALPHABET.indexOf(a))).join("")}</div>`;
  const tiles = el.querySelectorAll(".lt");
  const byIdx = (i) => el.querySelector(`.lt[data-i="${i}"]`);
  el.onclick = (e) => {
    if (e.target.closest("[data-say]")) return;
    const tl = e.target.closest(".lt");
    if (tl) { seqToken++; const a = ALPHABET[+tl.dataset.i]; speak(a.say); tiles.forEach((x) => x.classList.toggle("on", x === tl)); }
    if (e.target.id === "playall") playSequence(base.map((a) => a.say), (i) => { tiles.forEach((x) => x.classList.remove("on")); if (i >= 0) byIdx(ALPHABET.indexOf(base[i])).classList.add("on"); }, 150);
    if (e.target.id === "lt") { go("quiz"); startQuiz("letters"); }
  };
}
function bSounds(el) {
  el.innerHTML = `<h2 style="margin-top:0">Звуци и буквосъчетания</h2>
    <p class="hint">Това е „ключът“ към четенето. Цъкни всеки пример, за да го чуеш. Научи ги веднъж — и ще четеш всяка немска дума.</p>
    ${SOUNDS.map(([grp, list]) => `<h3>${esc(grp)}</h3><div class="snds">${list.map(([k, tr, ipa, ex, note]) => `
      <div class="sc"><div class="sc-h"><b>${esc(k)}</b><span>→ ${esc(tr)}</span><i>/${esc(ipa)}/</i></div>
        <div class="sc-ex">${ex.map((w) => `<button class="pill" data-say="${esc(w)}">${esc(w)} <em>[${esc(translit(w))}]</em></button>`).join("")}</div>
        ${note ? `<div class="lnote">💡 ${esc(note)}</div>` : ""}</div>`).join("")}</div>`).join("")}`;
}
function bRules(el) {
  const words = shuffle(ITEMS.filter((i) => i.de.length < 22 && !/[–\d]/.test(i.de)));
  let wi = 0;
  el.innerHTML = `<h2 style="margin-top:0">Правила за четене</h2>
    ${READING_RULES.map(([h, b], n) => `<div class="rule"><span class="rn">${n + 1}</span><div><b>${h}</b><p>${b}</p></div></div>`).join("")}
    <h3>Упражнение: прочети на глас</h3>
    <div class="panel read">
      <p class="hint" style="margin:0">Прочети думата сам, после провери с транскрипцията и звука.</p>
      <div class="rw" id="rw"></div>
      <div class="btns" style="grid-template-columns:1fr 1fr"><button class="btn" id="rshow">Провери <kbd>Space</kbd></button><button class="btn primary" id="rnext">Следваща <kbd style="color:inherit">→</kbd></button></div>
    </div>`;
  const draw = (show) => {
    const it = words[wi % words.length];
    $("#rw").innerHTML = `<div class="big">${deHTML(it)}</div>${show ? `<div class="tr" style="font-size:20px">[${esc(translit(deFull(it)))}]</div><div class="meta">${esc(it.bg)}</div>` : `<div class="meta">&nbsp;</div>`}`;
    if (show) speak(deFull(it), { auto: true });
  };
  draw(false);
  $("#rshow").onclick = () => draw(true);
  $("#rnext").onclick = () => { wi++; draw(false); };
  keyHandler = (e) => { if (e.key === " ") { e.preventDefault(); draw(true); } if (e.key === "ArrowRight") { wi++; draw(false); } };
}
function bSpell(el) {
  const val = store.get("spellWord", "Sofia");
  el.innerHTML = `<h2 style="margin-top:0">Спелуване <span class="tag">Buchstabieren</span></h2>
    <p class="hint">По телефона, в хотел, на гише: <i>„Wie schreibt man das?“</i> Напиши името си и чуй как се спелува.</p>
    <div class="toolbar"><input class="search" id="sw" value="${esc(val)}" placeholder="напр. името ти"><button class="btn primary" id="sp">▶ Спелувай</button></div>
    <div class="spellrow" id="sr"></div>
    <h3>Телефонна азбука (традиционна)</h3>
    <p class="hint">За да няма грешка: <i>„M wie Martha, A wie Anton…“</i>. Цъкни, за да чуеш.</p>
    <div class="snds">${ALPHABET.map((a) => `<button class="pill" data-say="${esc(a.ch + " wie " + a.spell)}"><b>${a.ch}</b> wie ${esc(a.spell)}</button>`).join("")}</div>`;
  const letters = () => [...$("#sw").value].map((c) => ALPHABET.find((a) => a.ch === c.toUpperCase() || a.ch === c)).filter(Boolean);
  const draw = () => {
    store.set("spellWord", $("#sw").value);
    $("#sr").innerHTML = letters().map((a) => `<div class="sl"><b>${a.ch}</b><small>${esc(a.name)}</small></div>`).join("");
  };
  draw();
  $("#sw").oninput = draw;
  const play = () => { const ls = letters(); const nodes = $("#sr").children; playSequence(ls.map((a) => a.say), (i) => [...nodes].forEach((n, k) => n.classList.toggle("on", k === i)), 200); };
  $("#sp").onclick = play;
  $("#sw").onkeydown = (e) => { if (e.key === "Enter") play(); };
}
function bNumbers(el) {
  const n0 = store.get("numVal", 35);
  el.innerHTML = `<div class="bhead"><div><h2 style="margin-top:0">Числа</h2>
    <p class="hint">Напиши число и виж/чуй как се казва. 21–99 се казват <b>обратно</b>: 35 = fünf<b>und</b>dreißig („пет и трийсет“).</p></div>
    <div class="bact"><button class="btn" id="nq">🔢 Тест на слух</button></div></div>
    <div class="panel numc">
      <input class="answer" id="nv" inputmode="numeric" value="${n0}" style="margin:0">
      <label class="hint" style="display:flex;gap:6px;align-items:center;justify-content:center;margin:8px 0 0"><input type="checkbox" id="ny"> като година (1871 = achtzehnhundert…)</label>
      <div id="nout"></div>
    </div>
    <h3>Основните — цъкни, за да чуеш</h3>
    <div class="numgrid">${[...Array(21).keys(), 30, 40, 50, 60, 70, 80, 90, 100, 1000].map((n) => `<button class="pill nb" data-say="${num2de(n)}"><b>${n}</b> ${num2de(n)}</button>`).join("")}</div>
    <p class="hint" style="margin-top:12px">⚠️ Капани: <b>sech</b>zehn/<b>sech</b>zig (без s), <b>sieb</b>zehn/<b>sieb</b>zig (без en), drei<b>ß</b>ig (с ß), 21 = <b>ein</b>undzwanzig (не eins).</p>`;
  const draw = () => {
    const raw = $("#nv").value.replace(/\D/g, "");
    store.set("numVal", raw);
    if (!raw) { $("#nout").innerHTML = ""; return; }
    const n = +raw, w = num2de(n, $("#ny").checked);
    $("#nout").innerHTML = `<button class="numw" data-say="${esc(w)}">${SPK}<span>${esc(w)}</span></button><div class="tr" style="font-size:18px">[${esc(translit(w))}]</div>`;
  };
  draw();
  $("#nv").oninput = draw; $("#ny").onchange = draw;
  $("#nv").onkeydown = (e) => { if (e.key === "Enter") { const b = $("#nout [data-say]"); if (b) speak(b.dataset.say); } };
  $("#nq").onclick = () => { go("quiz"); startQuiz("numbers"); };
}

// ───────── пътна карта ─────────
function roadmap() {
  const pct = (id) => { const li = ITEMS.filter((i) => inLesson(i, id)); return li.filter((i) => box(i) >= 3).length / li.length; };
  const steps = [
    { ic: "🔤", t: "Азбука", d: "26 букви + ä ö ü ß", done: !!S.visited.alphabet, go: () => { bTopic = "alphabet"; go("basics"); } },
    { ic: "🗣", t: "Звуци и четене", d: "ei, ie, sch, ch…", done: !!(S.visited.sounds && S.visited.rules), go: () => { bTopic = S.visited.sounds ? "rules" : "sounds"; go("basics"); } },
    { ic: "👋", t: "Първи фрази", d: "поздрави, учтивост, дни", p: pct(0), go: () => lessonCards(0) },
    { ic: "🔢", t: "Числа", d: "0 – 1000 на слух", done: !!S.visited.numbers, go: () => { bTopic = "numbers"; go("basics"); } },
    ...LESSONS.filter((l) => l.id > 0).map((l) => ({ ic: "📘", t: "Урок " + l.id, d: l.title, p: pct(l.id), go: () => lessonCards(l.id) })),
  ];
  steps.forEach((s) => { if (s.p !== undefined) s.done = s.p >= 0.6; });
  const nextI = steps.findIndex((s) => !s.done);
  return { steps, nextI };
}
function lessonCards(id) {
  S.lessons = new Set([id]); store.set("lessons", [...S.lessons]); cardOpt.group = "all";
  S.tab = "cards"; renderNav(); renderSub(); renderStats(); render(); startCards("due", pool());
}

// ───────── старт ─────────
renderNav(); renderSub(); renderStats(); render();
setTimeout(warmAudio, 1500);
