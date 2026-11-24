// ───────── ПРОВЕРКА НА ОТГОВОРИ + АНАЛИЗ НА ГРЕШКИТЕ ─────────
// checkDe(дадено, очаквано) → { ok, level: exact|typo|variant|wrong, cat, msg }
//   exact   — същото (без значение главни/пунктуация)
//   typo    — правилно, но с малка правописна грешка (броим за вярно, но пишем „правопис“)
//   variant — друг правилен словоред (Gestern bin ich … = Ich bin gestern …)
//   wrong   — грешно; cat = категория на грешката, msg = кратко обяснение на български
// Работи изцяло локално — без AI.
const CK = (() => {
  const ART = { der: 1, die: 1, das: 1, den: 1, dem: 1, des: 1, ein: 1, eine: 1, einen: 1, einem: 1, einer: 1, eines: 1, kein: 1, keine: 1, keinen: 1, keinem: 1, keiner: 1 };
  const NOM_G = { der: "der", die: "die", das: "das", ein: "der/das", eine: "die", kein: "der/das", keine: "die" }; // за грешен род
  const HABEN = ["habe", "hast", "hat", "haben", "habt"], SEIN = ["bin", "bist", "ist", "sind", "seid"];
  const HS_PAST = ["hatte", "hattest", "hatten", "hattet", "war", "warst", "waren", "wart"];
  const PREPS = ["in", "im", "ins", "an", "am", "ans", "auf", "mit", "nach", "zu", "zum", "zur", "von", "vom", "bei", "beim", "aus", "für", "um", "ohne", "gegen", "durch", "vor", "seit", "ab", "bis", "über", "unter", "neben", "hinter", "zwischen"];
  const strip = (s) => String(s || "").replace(/[„“"«»‚‘’]/g, "").replace(/\s+/g, " ").trim();
  const low = (s) => s.toLowerCase();
  const fold = (s) => low(s).replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
  const toks = (s) => strip(s).replace(/[.,!?;:()–]/g, " ").split(" ").filter(Boolean);
  function lev(a, b) {
    if (a === b) return 0; if (!a.length) return b.length; if (!b.length) return a.length;
    let p = [...Array(b.length + 1).keys()];
    for (let i = 1; i <= a.length; i++) { const c = [i]; for (let j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; }
    return p[b.length];
  }
  const tolerance = (w) => (w.length <= 3 ? 0 : w.length <= 7 ? 1 : 2);
  // крайното спрегнато място: първият помощен/модален/известен глагол
  function finiteIdx(T) {
    if (typeof XP !== "undefined") { try { const a = XP.analyze(T.join(" ") + "."); const i = a.tokens.findIndex((_, k) => a.roles[k] === "v"); if (i >= 0 && i < T.length) return i; } catch (e) {} }
    return T.findIndex((w) => HABEN.includes(low(w)) || SEIN.includes(low(w)) || HS_PAST.includes(low(w)));
  }
  // друг допустим словоред: една група е изнесена пред глагола, останалото е в същия ред
  function sameOrderVariant(G, E) {
    const g = G.map(low), e = E.map(low);
    if (g.length !== e.length || [...g].sort().join() !== [...e].sort().join()) return false;
    if (g[g.length - 1] !== e[e.length - 1]) return false; // краят (Partizip/инфинитив/представка) не мърда
    const vi = finiteIdx(E); if (vi < 1) return false;
    const v = e[vi], gi = g.indexOf(v); if (gi < 1) return false;
    const pre = g.slice(0, gi), at = e.findIndex((_, k) => k !== vi && e.slice(k, k + pre.length).join(" ") === pre.join(" "));
    if (at < 0 || (at <= vi && vi < at + pre.length)) return false; // групата пред глагола трябва да е цяла група от очакваното
    const eNo = e.filter((_, k) => k !== vi && !(k >= at && k < at + pre.length));
    return g.slice(gi + 1).join(" ") === eNo.join(" ");
  }
  function diffCat(G, E) {
    // само една различна дума → какъв тип е разликата
    if (G.length === E.length) {
      const d = G.map((w, i) => [w, E[i]]).filter(([a, b]) => low(a) !== low(b));
      if (d.length === 1) {
        const [g, e] = d[0], gl = low(g), el = low(e);
        if (HABEN.includes(el) && SEIN.includes(gl) || SEIN.includes(el) && HABEN.includes(gl)) {
          return { cat: "hs", msg: SEIN.includes(el) ? `Тук е <b>sein</b> (${esc0(e)}), не haben: глаголът изразява движение от А до Б или промяна на състоянието.` : `Тук е <b>haben</b> (${esc0(e)}), не sein: няма движение от А до Б или промяна на състоянието.` };
        }
        if (ART[gl] && ART[el]) {
          const sameBase = gl.replace(/(er|en|em|es|e|n|m|r|s)$/, "") === el.replace(/(er|en|em|es|e|n|m|r|s)$/, "") || (["der", "die", "das", "den", "dem", "des"].includes(gl) && ["der", "die", "das", "den", "dem", "des"].includes(el));
          const genderOnly = NOM_G[gl] && NOM_G[el] && NOM_G[gl] !== NOM_G[el];
          return genderOnly ? { cat: "art", msg: `Грешен член/род: правилно е <b>${esc0(e)}</b>, не „${esc0(g)}“.` } : { cat: "case", msg: `Грешен падеж/окончание на члена: правилно е <b>${esc0(e)}</b>, не „${esc0(g)}“.${sameBase ? " Провери: кой? (Nominativ), кого/какво? (Akkusativ), на кого?/след предлог (Dativ)." : ""}` };
        }
        if (PREPS.includes(gl) && PREPS.includes(el)) return { cat: "prep", msg: `Грешен предлог: правилно е <b>${esc0(e)}</b>, не „${esc0(g)}“.` };
        if (lev(fold(g), fold(e)) === 1 && gl.slice(0, 3) === el.slice(0, 3) && gl.slice(-1) === el.slice(-1) && e.length > 5 && !(HABEN.concat(SEIN).includes(gl)) && (/^[A-ZÄÖÜ]/.test(e) || [...el].findIndex((ch, k) => ch !== gl[k]) < el.length - 3 || /^ge/.test(el))) return { cat: "spell", msg: `Правописна грешка: <b>${esc0(e)}</b>, не „${esc0(g)}“.` };
        if (lev(fold(g), fold(e)) <= tolerance(e) && fold(g) !== fold(e)) {
          // окончание на глагол (mache/machst/macht) → спрежение
          const st = Math.min(g.length, e.length) - 2;
          if (st >= 2 && low(g).slice(0, st) === low(e).slice(0, st) && /(e|st|t|en|n|te|test|ten|tet)$/.test(gl) && /(e|st|t|en|n|te|test|ten|tet)$/.test(el) && /^[a-zäöüß]/.test(e) && !/^ge/.test(el)) return { cat: "conj", msg: `Грешно окончание на глагола: правилно е <b>${esc0(e)}</b>, не „${esc0(g)}“. Провери кое лице е подлогът.` };
          if (/^ge|t$|en$/.test(el) && /^ge|t$|en$/.test(gl) && (el.startsWith("ge") || gl.startsWith("ge") || el.includes("ge"))) return { cat: "vform", msg: `Грешна форма на Partizip II: правилно е <b>${esc0(e)}</b>, не „${esc0(g)}“.` };
          return { cat: "spell", msg: `Правописна грешка: <b>${esc0(e)}</b>, не „${esc0(g)}“.` };
        }
        if (low(g).slice(0, 3) === low(e).slice(0, 3) && /^[a-zäöüß]/.test(e)) return { cat: /^ge/.test(el) || /^ge/.test(gl) ? "vform" : "conj", msg: `Грешна форма на думата: правилно е <b>${esc0(e)}</b>, не „${esc0(g)}“.` };
        return { cat: "word", msg: `Грешна дума: <b>${esc0(e)}</b> вместо „${esc0(g)}“.` };
      }
    }
    // същите думи, друг ред → словоред
    if (G.length === E.length && [...G.map(low)].sort().join() === [...E.map(low)].sort().join()) {
      const vi = finiteIdx(E), v = vi >= 0 ? low(E[vi]) : null, gi = v ? G.map(low).indexOf(v) : -1;
      if (v && gi !== vi && gi !== 1) return { cat: "verbpos", msg: `Мястото на глагола: <b>${esc0(E[vi])}</b> трябва да е на <b>2-ро място</b> в изречението.` };
      if (low(G[G.length - 1]) !== low(E[E.length - 1])) return { cat: "order", msg: `Словоред: <b>${esc0(E[E.length - 1])}</b> трябва да е в <b>края</b> на изречението (Partizip II / инфинитив / представка).` };
      return { cat: "order", msg: "Словоредът не е правилен — думите са верни, но редът не е." };
    }
    // липсва/излишна дума
    if (Math.abs(G.length - E.length) === 1) {
      const [L, S] = G.length > E.length ? [G, E] : [E, G];
      for (let i = 0; i < L.length; i++) { const t = [...L]; const x = t.splice(i, 1)[0]; if (t.map(low).join(" ") === S.map(low).join(" ")) {
        const miss = G.length < E.length;
        if (ART[low(x)]) return { cat: "art", msg: miss ? `Липсва членът <b>${esc0(x)}</b> — при съществителните членът е задължителен.` : `Излишен член „${esc0(x)}“.` };
        if (HABEN.includes(low(x)) || SEIN.includes(low(x))) return { cat: "vform", msg: `Липсва помощният глагол <b>${esc0(x)}</b> — Perfekt = haben/sein + Partizip II.` };
        return { cat: "word", msg: miss ? `Липсва думата <b>${esc0(x)}</b>.` : `Излишна дума „${esc0(x)}“.` };
      } }
    }
    return { cat: "word", msg: "Отговорът се различава съществено от правилния." };
  }
  const esc0 = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // основната проверка за немски
  function checkDe(given, expected, opts = {}) {
    const exps = [expected, ...(opts.alts || [])];
    let best = null;
    for (const exp of exps) {
      const r = check1(given, exp, opts);
      if (r.ok && r.level === "exact") return r;
      if (!best || (r.ok && !best.ok) || (r.ok === best.ok && r.level === "variant")) best = r;
    }
    return best;
  }
  function check1(given, expected, opts) {
    const G = toks(given), E = toks(expected);
    if (!G.length) return { ok: false, level: "wrong", cat: "empty", msg: "Няма отговор." };
    const gs = G.join(" "), es = E.join(" ");
    if (gs === es) return { ok: true, level: "exact" };
    if (low(gs) === low(es)) {
      // главна буква на съществително — в немския е правило, но не грешка в знанието на думата
      const caps = G.some((w, i) => w !== E[i] && /^[A-ZÄÖÜ]/.test(E[i]) && i > 0);
      return caps ? { ok: true, level: "typo", cat: "spell", msg: "Съществителните в немския се пишат с <b>главна</b> буква." } : { ok: true, level: "exact" };
    }
    if (fold(gs) === fold(es)) return { ok: true, level: "typo", cat: "spell", msg: "Пиши с ä, ö, ü, ß (ae/oe/ue/ss също се приема, но не е обичайно)." };
    // член задължителен при съществителни
    if (opts.noun && E.length === 2 && G.length === 1 && low(G[0]) === low(E[1])) return { ok: false, level: "wrong", cat: "art", msg: `Членът е задължителен: <b>${esc0(es)}</b>.` };
    if (sameOrderVariant(G, E)) return { ok: true, level: "variant", msg: "Правилно — и този словоред е верен." };
    const d = diffCat(G, E);
    // една малка правописна грешка в иначе вярно изречение/дума → вярно, с бележка
    if (d.cat === "spell") return { ok: true, level: "typo", cat: "spell", msg: d.msg };
    return { ok: false, level: "wrong", ...d };
  }
  // български отговор (превод от немски): приемаме всяко от значенията, с малки грешки
  function checkBg(given, bg) {
    const n = (s) => low(String(s)).replace(/\([^)]*\)/g, " ").replace(/[^а-яёѝa-z0-9 ]/gi, " ").replace(/\s+/g, " ").trim();
    const g = n(given); if (!g) return { ok: false, level: "wrong", cat: "empty", msg: "Няма отговор." };
    const opts = String(bg).replace(/\([^)]*\)/g, "").split(/[,;/]|\bили\b/).map(n).filter(Boolean);
    const drop = (s) => (" " + s + " ").replace(/\s(се|си|да|го|ги|ми|ти|ме|те)(?=\s)/g, " ").replace(/\s+/g, " ").trim();
    // изредени няколко значения (виждам, гледам) → вярно, ако всяко е от списъка
    const parts = String(given).split(/[,;/]/).map(n).filter(Boolean);
    if (parts.length > 1 && parts.every((p) => opts.some((o) => o === p || lev(p, o) <= 1))) return { ok: true, level: "exact" };
    for (const o of opts) {
      if (g === o || drop(g) === drop(o)) return { ok: true, level: "exact" };
      if (lev(g, o) <= (o.length <= 4 ? 0 : o.length <= 8 ? 1 : 2)) return { ok: true, level: "typo", cat: "spell", msg: `Правилно: „${esc0(o)}“.` };
      if (o.split(" ").length > 1 && drop(o).split(" ").every((w) => w.length < 3 || drop(g).includes(w))) return { ok: true, level: "variant" };
    }
    return { ok: false, level: "unsure", cat: "meaning", msg: `Очаквано: <b>${esc0(bg)}</b>. Ако твоят превод казва същото с други думи — маркирай го като верен.` };
  }
  return { checkDe, checkBg, lev, toks, fold };
})();

// ───────── ДНЕВНИК НА ГРЕШКИТЕ + ПРОФИЛ НА СЛАБОСТИТЕ ─────────
const ERR_CAT = {
  art: ["Член / род", "der · die · das"], plural: ["Множествено число", "die Tische"], conj: ["Спрежение", "ich mache, du machst"], case: ["Падеж", "Akkusativ · Dativ"],
  verbpos: ["Място на глагола", "глаголът е 2-ри"], vform: ["Глаголна форма", "Partizip II · Präteritum"], hs: ["haben или sein", "ist gefahren · hat gemacht"],
  order: ["Словоред", "краят на изречението"], prep: ["Предлози", "in · an · mit · zu"], spell: ["Правопис", "ä ö ü ß, главни букви"], word: ["Речник / смисъл", "грешна дума"], meaning: ["Превод", "значение на думата"],
};
// упражнения за всяка слабост (ключове от EX_TYPES)
const CAT_EX = { art: ["art", "eindef", "artgame"], plural: ["plural"], conj: ["conj", "konj", "praetkonj", "tun", "musssoll"], case: ["akk", "dativart", "michmir", "verbakk", "pronakk"],
  verbpos: ["pos2", "perforder", "praetorder", "tag14"], vform: ["partizip", "praet", "stamm", "perftype"], hs: ["perfhs", "zeitfehler", "perfright"], order: ["perforder", "praetorder", "trennbar"],
  prep: ["praep", "praepakk", "wann"], spell: [], word: [], meaning: [] };
// категория по вида упражнение (за грешки при избор от варианти)
const EX_CAT = { art: "art", eindef: "art", einkein: "art", plural: "plural", conj: "conj", konj: "conj", praetkonj: "conj", tun: "conj", musssoll: "conj", modal: "conj", warhatte: "conj",
  akk: "case", dativart: "case", dativpron: "case", michmir: "case", mmakk: "case", mmdat: "case", verbakk: "case", pronakk: "case", possakk: "case", adjend: "case",
  pos2: "verbpos", perforder: "order", praetorder: "order", trennbar: "order", bau: "order", tag14: "order", partizip: "vform", praet: "vform", stamm: "vform", perftype: "vform", zeitum: "vform",
  perfhs: "hs", perfright: "hs", zeitfehler: "hs", praep: "prep", praepakk: "prep", wann: "prep", temp: "prep", picde: "word", debg: "word", listenpic: "word", comp: "word", fail: "vform", signal: "vform", zeitwas: "vform" };
const ERRS = {
  all() { try { return JSON.parse(localStorage.getItem("dl:errs") || "[]"); } catch (e) { return []; } },
  add(e) { const a = ERRS.all(); a.push({ t: Date.now(), ...e }); if (a.length > 3000) a.splice(0, a.length - 3000); try { localStorage.setItem("dl:errs", JSON.stringify(a)); } catch (x) {} },
  // профил: категория → тегло (по-новите грешки тежат повече; верните отговори в същата категория го намаляват)
  profile(days = 21) {
    const now = Date.now(), P = {}, ok = (() => { try { return JSON.parse(localStorage.getItem("dl:catok") || "{}"); } catch (e) { return {}; } })();
    for (const e of ERRS.all()) { const age = (now - e.t) / 864e5; if (age > days || !ERR_CAT[e.cat]) continue; P[e.cat] = (P[e.cat] || 0) + Math.exp(-age / 7); }
    return Object.entries(P).map(([c, w]) => { const o = ok[c] || [0, 0]; return { cat: c, w: w / (1 + (o[0] || 0) * 0.15), n: ERRS.all().filter((x) => x.cat === c && now - x.t < days * 864e5).length }; })
      .filter((x) => x.w > 0.3).sort((a, b) => b.w - a.w);
  },
  good(cat) { if (!cat) return; let o; try { o = JSON.parse(localStorage.getItem("dl:catok") || "{}"); } catch (e) { o = {}; } const v = o[cat] || [0, 0]; v[0] = Math.min(40, v[0] + 1); v[1] = Date.now(); o[cat] = v; try { localStorage.setItem("dl:catok", JSON.stringify(o)); } catch (e) {} },
};
if (typeof module !== "undefined") module.exports = { CK, ERRS, ERR_CAT, CAT_EX, EX_CAT };
