// ───────── „ЗАЩО?“ — граматичен анализ на всяка дума в изречение ─────────
// Правилен за изреченията на ниво A1 в приложението. Обяснява членове, падежи, окончания на прилагателни,
// форми на глаголи, словоред, разделими глаголи, предлози, местоимения, отрицание, съюзи и zu + инфинитив.

const XP = (() => {
  const lc = (s) => s.toLowerCase();
  const GEN_BG = { der: "мъжки род", die: "женски род", das: "среден род", pl: "мн.ч." };
  const art = (a) => `<span class="art ${a === "pl" ? "pl" : a}">${a === "pl" ? "die" : a}</span>`;
  const PERS = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
  const SEIN = new Set(["bin", "bist", "ist", "sind", "seid", "war", "waren", "wird", "wirst", "werde", "werden", "werdet", "bleibt", "bleibe", "bleiben", "bleibst"]);
  const DAT_P = { mit: "с", aus: "от (откъде)", bei: "при, във (фирма)", von: "от", zu: "към, до", nach: "след; за (град)", seit: "от (време)" };
  const AKK_P = { für: "за", ohne: "без", gegen: "срещу; около (час)", durch: "през; заради", um: "в (час); около", bis: "до" };
  const WECHSEL = { in: "в", an: "на, до", auf: "на, върху", unter: "под", über: "над", vor: "пред", hinter: "зад", neben: "до", zwischen: "между" };
  const CONTR = {
    im: ["in", "dem", "в (in + dem). Отговаря на „Wo? Къде?“ → Dativ. Използва се за der- и das-думи: im Zimmer, im Park. За die-думи: in der Stadt."],
    am: ["an", "dem", "an + dem. Дни: am Montag (в понеделник). Място: am Bahnhof (до гарата). Също: am meisten, am liebsten."],
    zum: ["zu", "dem", "zu + dem (към/до) — за der- и das-думи: zum Arzt, zum Bahnhof. zu винаги иска Dativ."],
    zur: ["zu", "der", "zu + der (към/до) — за die-думи: zur Apotheke, zur Post, zur Arbeit. zu винаги иска Dativ, а die → der в Dativ."],
    ins: ["in", "das", "in + das (в, накъде?) → Akkusativ, защото има движение: ins Kino, ins Bett. Сравни: im Kino (къде? — вече съм там)."],
    vom: ["von", "dem", "von + dem (от) — за der- и das-думи: vom Bahnhof, vom Hotel."],
    beim: ["bei", "dem", "bei + dem (при) — beim Arzt = при лекаря."],
    durchs: ["durch", "das", "durch + das (през) → Akkusativ: durchs Fenster."],
    fürs: ["für", "das", "für + das (за) → Akkusativ: fürs Kind."],
    ums: ["um", "das", "um + das (около) → Akkusativ: ums Haus."],
  };
  const PRON = {
    ich: ["аз", "Nom"], du: ["ти", "Nom"], er: ["той (или der-нещо: der Computer = er)", "Nom"], wir: ["ние", "Nom"],
    mich: ["мен / себе си (Akkusativ на ich)", "Akk"], dich: ["теб / себе си (Akkusativ на du)", "Akk"], ihn: ["него (Akkusativ на er)", "Akk"],
    uns: ["нас / ни / се (на wir)", "Akk"], euch: ["вас / ви / се (на ihr)", "Akk"], mir: ["на мен, ми (Dativ на ich)", "Dat"], dir: ["на теб, ти (Dativ на du)", "Dat"],
    ihm: ["на него, му (Dativ на er)", "Dat"], ihnen: ["на тях / на Вас", "Dat"], sich: ["се, себе си (за er/sie/es/sie/Sie)", "Akk"], man: ["„човек“, хората — безлично (се)", "Nom"],
  };
  const QW = { wie: "как? (wie alt = на колко години, wie viel = колко)", was: "какво?", wo: "къде? (място — без движение)", woher: "откъде?", wohin: "накъде? (движение)", wann: "кога?",
    wer: "кой? (подлог — Nominativ)", wen: "кого? (пряко допълнение — Akkusativ)", wem: "на кого? (Dativ)", warum: "защо?", welche: "кои/коя? (welch- + окончание като на die)", welcher: "кой? (der-дума)", welches: "кое? (das-дума)" };
  const CONJ0 = { und: "и", oder: "или", aber: "но", denn: "защото", sondern: "а (след отрицание)" };
  const CONJ_END = { weil: "защото", dass: "че", wenn: "ако / когато", ob: "дали" };
  const SEP_PREF = ["an", "ab", "mit", "ein", "aus", "vor", "nach", "fern", "weg", "teil", "auf", "zurück", "zu", "los", "her"];
  const EXTRA_ADJ = ["neu", "alt", "groß", "klein", "gut", "schön", "teuer", "billig", "modern", "praktisch", "bequem", "unbequem", "hell", "dunkel", "kalt", "warm", "weich", "hart", "schnell",
    "langsam", "interessant", "langweilig", "deutsch", "italienisch", "französisch", "englisch", "berühmt", "bedeutend", "naturwissenschaftlich", "technisch", "kühl", "schmal", "leer", "voll", "lang",
    "frei", "heiß", "jung", "wichtig", "unwichtig", "spannend", "historisch", "klassisch", "nett", "sauber", "schmutzig", "gesund", "schwer", "leicht", "schlecht", "preiswert", "hässlich", "beliebt",
    "perfekt", "nächst", "erst", "zweit", "dritt", "letzt", "lieb", "weiß", "schwarz", "rot", "blau", "grün", "gelb", "grau", "braun", "rund", "bulgarisch", "stabil", "fertig", "bereit", "einfach",
    "unbekannt", "riesig", "zwanzigst", "neunzehnt", "einundzwanzigst", "kalt", "spät", "früh", "ganz", "viel", "wenig", "eigen", "toll", "super", "ruhig", "laut", "leise", "zufrieden", "unzufrieden", "dick", "dünn", "schlank", "schwierig", "müde", "frisch", "krank", "süß", "sauer", "fleißig", "falsch", "violett", "lila", "hellblau", "dunkelblau", "orange", "trennbar", "lecker", "kurz", "streng", "schlimm"];
  let NOUNS, ADJS, VERBF, SEPV;
  function build() {
    if (NOUNS) return;
    NOUNS = new Map(); ADJS = new Set(EXTRA_ADJ); VERBF = new Map(); SEPV = new Map();
    const addN = (k, v) => { k = lc(k); if (!NOUNS.has(k)) NOUNS.set(k, []); NOUNS.get(k).push(v); };
    for (const it of ITEMS) {
      if (it.type === "noun" && it.art && !/\s/.test(it.de)) {
        if (it.art === "pl") addN(it.de, { it, g: "pl" });
        else { addN(it.de, { it, g: it.art }); if (it.pl && it.pl !== it.de) addN(it.pl, { it, g: "pl" }); else if (it.pl) addN(it.pl, { it, g: "pl", same: true }); }
      }
      if (it.type === "adj" && !/\s/.test(it.de)) ADJS.add(lc(it.de));
      if (it.type === "verb") {
        const inf = it.de.replace(/^sich /, "");
        it.forms.forEach((f, i) => {
          const parts = f.split(" "), head = lc(parts[0]);
          if (!VERBF.has(head)) VERBF.set(head, []);
          const ex = VERBF.get(head).find((x) => x.it === it); if (ex) ex.idx.push(i); else VERBF.get(head).push({ it, idx: [i] });
          const pre = parts[parts.length - 1];
          if (parts.length > 1 && SEP_PREF.includes(pre) && !["mich", "dich", "sich", "uns", "euch"].includes(pre)) SEPV.set(it.de, pre);
        });
        if (!VERBF.has(lc(inf))) VERBF.set(lc(inf), []);
        const exI = VERBF.get(lc(inf)).find((x) => x.it === it);
        if (exI) exI.inf = true; else VERBF.get(lc(inf)).push({ it, idx: [], inf: true });
      }
    }
  }
  const tokenize = (s) => { const out = []; const re = /[A-Za-zÄÖÜäöüßé]+/g; let m; while ((m = re.exec(s))) out.push({ w: m[0], at: m.index }); return out; };
  // прилагателно с окончание → { base, end }
  function adjSplit(w) {
    const t = lc(w);
    if (ADJS.has(t)) return { base: t, end: "" };
    for (const e of ["en", "em", "er", "es", "e"]) {
      if (!t.endsWith(e) || t.length - e.length < 2) continue;
      const st = t.slice(0, -e.length);
      for (const b of [st, st.replace(/(.)([rl])$/, "$1e$2"), st + "e"]) if (ADJS.has(b)) return { base: b, end: e };
    }
    return null;
  }
  const ARTDEF = { der: 1, die: 1, das: 1, den: 1, dem: 1, des: 1 };
  const EINW = /^(ein|kein|mein|dein|sein|ihr|unser|unsr|euer|eur|jed|dies|welch)(e|en|em|er|es)?$/i;
  const OWNER = { mein: "ich → мой", dein: "du → твой", sein: "er/es → негов", ihr: "sie → неин / техен", unser: "wir → наш", euer: "ihr → ваш", eur: "ihr → ваш", Ihr: "Sie → Ваш (учтиво)" };
  function artParse(w, i) {
    const t = lc(w);
    if (ARTDEF[t]) return { type: "def", root: "der", end: t };
    const m = w.match(EINW);
    if (!m) return null;
    let root = lc(m[1]); const end = lc(m[2] || "");
    if (root === "unsr") root = "unser";
    const type = root === "ein" ? "ind" : root === "kein" ? "neg" : root === "jed" || root === "dies" || root === "welch" ? "dem" : "poss";
    if (type === "dem" && !end) return null;
    return { type, root: type === "poss" && m[1] === "Ihr" && i > 0 ? "Ihr" : root, end };
  }
  // намира съществителното след позиция i (прескача прилагателни)
  function nounAfter(T, i) {
    for (let j = i + 1; j < T.length && j <= i + 4; j++) {
      const w = T[j].w;
      if (adjSplit(w) && w[0] === w[0].toLowerCase()) continue;
      if (/^(sehr|ganz|zu|so)$/i.test(w)) continue;
      if (w[0] === w[0].toUpperCase() && NOUNS.has(lc(w))) return { j, opts: NOUNS.get(lc(w)) };
      if (w[0] === w[0].toUpperCase() && /chen$|lein$/.test(w)) return { j, opts: [{ g: "das", dimin: true }] };
      if (w[0] === w[0].toUpperCase()) return { j, opts: [] };
      return null;
    }
    return null;
  }
  function finiteVerb(T) {
    for (let k = 0; k < T.length; k++) {
      const t = lc(T[k].w);
      if (SEIN.has(t) || t === "gibt") return k;
      const c = VERBF.get(t);
      if (c && c.some((x) => x.idx.length) && !(k === T.length - 1 && T.length > 3 && c.some((x) => x.inf))) return k;
    }
    return -1;
  }
  // възможни окончания на члена по род и падеж
  const DEF_T = { Nom: { der: "der", die: "die", das: "das", pl: "die" }, Akk: { der: "den", die: "die", das: "das", pl: "die" }, Dat: { der: "dem", die: "der", das: "dem", pl: "den" } };
  const EIN_T = { Nom: { der: "", die: "e", das: "", pl: "e" }, Akk: { der: "en", die: "e", das: "", pl: "e" }, Dat: { der: "em", die: "er", das: "em", pl: "en" } };
  function caseOf(T, i, g, a, vIdx) {
    const prev = i > 0 ? lc(T[i - 1].w) : "";
    const formCases = ["Nom", "Akk", "Dat"].filter((c) => (a.type === "def" ? DEF_T[c][g] === a.end : EIN_T[c][g] === a.end));
    if (DAT_P[prev]) return { c: "Dat", why: `след предлога <b>${prev}</b> (${DAT_P[prev]}) винаги идва <b>Dativ</b>` };
    if (AKK_P[prev]) return { c: "Akk", why: `след предлога <b>${prev}</b> (${AKK_P[prev]}) винаги идва <b>Akkusativ</b>` };
    if (WECHSEL[prev]) {
      if (formCases.includes("Dat") && !formCases.includes("Akk")) return { c: "Dat", why: `<b>${prev}</b> + Dativ = къде? (място, без движение)` };
      return { c: "Akk", why: `<b>${prev}</b> + Akkusativ = накъде? (движение)` };
    }
    if (formCases.length === 1) {
      const c = formCases[0];
      return { c, why: c === "Akk" ? "формата е ясна — само в Akkusativ мъжкият род има -n (den / einen / keinen)" : c === "Dat" ? "формата е на Dativ (на кого? / къде?)" : "подлог — кой/какво прави или е?" };
    }
    const vt = vIdx >= 0 ? lc(T[vIdx].w) : "";
    if (vIdx >= 0 && i < vIdx) return { c: "Nom", why: "стои преди глагола — това е <b>подлогът</b> (кой/какво?) → Nominativ" };
    if (SEIN.has(vt)) return { c: "Nom", why: `след <b>${T[vIdx].w}</b> (sein/werden/bleiben) винаги е <b>Nominativ</b> — двете страни са „едно и също“` };
    if (vt === "gibt" && T.some((x) => lc(x.w) === "es")) return { c: "Akk", why: "след <b>es gibt</b> (има) винаги е <b>Akkusativ</b>" };
    const subj = T.slice(0, i).some((x, k) => k !== vIdx && (["ich", "du", "er", "wir", "ihr", "man", "sie", "es"].includes(lc(x.w)) || NOUNS.has(lc(x.w)) && /^[A-ZÄÖÜ]/.test(x.w) && k !== 0));
    if (!subj && vIdx >= 0) return { c: "Nom", why: "това е подлогът на изречението (кой/какво?) → Nominativ" };
    const vb = vIdx >= 0 ? T[vIdx].w : "глагола";
    return { c: "Akk", why: `отговаря на <b>какво?/кого?</b> след <i>${esc(vb)}</i> → пряко допълнение → <b>Akkusativ</b>` };
  }
  function articleRow(type, g, root) {
    const r = type === "def" ? null : root === "Ihr" ? "Ihr" : root === "euer" || root === "eur" ? "eur" : root;
    const f = (c) => (type === "def" ? DEF_T[c][g] : (r === "eur" && !EIN_T[c][g] ? "euer" : (r === "ein" && g === "pl" ? "—" : r + EIN_T[c][g])));
    return `<table class="xt"><tr><th></th><th>Nominativ<br><small>кой?</small></th><th>Akkusativ<br><small>какво?</small></th><th>Dativ<br><small>на кого? къде?</small></th></tr>
      ${["der", "die", "das", "pl"].map((gg) => `<tr class="${gg === g ? "on" : ""}"><td>${art(gg)}</td>${["Nom", "Akk", "Dat"].map((c) => {
        const v = type === "def" ? DEF_T[c][gg] : (r === "eur" && !EIN_T[c][gg] ? "euer" : r === "ein" && gg === "pl" ? "—" : r + EIN_T[c][gg]);
        return `<td>${v}</td>`;
      }).join("")}</tr>`).join("")}</table>`;
  }
  // окончание на прилагателното
  function adjEnding(atype, g, c) {
    if (atype === "def") return c === "Nom" ? (g === "pl" ? "en" : "e") : c === "Akk" ? (g === "der" || g === "pl" ? "en" : "e") : "en";
    if (atype === "ein") return g === "pl" ? "en" : c === "Dat" ? "en" : { der: c === "Nom" ? "er" : "en", die: "e", das: "es" }[g];
    return g === "pl" ? (c === "Dat" ? "en" : "e") : c === "Dat" ? { der: "em", die: "er", das: "em" }[g] : { der: c === "Nom" ? "er" : "en", die: "e", das: "es" }[g];
  }
  const ADJ_RULE = `<div class="xrule"><b>Правилото за окончанията (пред съществително):</b><br>
    • след <b>ein/eine/kein/mein…</b>: der → <b>-er</b> (кой?) / <b>-en</b> (какво?) · die → <b>-e</b> · das → <b>-es</b> · мн.ч. → <b>-en</b><br>
    • след <b>der/die/das</b>: кой? (ед.ч.) → <b>-e</b> · der в Akkusativ → <b>-en</b> · мн.ч. → <b>-en</b><br>
    • без член: прилагателното „показва“ рода вместо члена: kalter Kaffee, kalte Milch, kaltes Bier, alte Autos<br>
    • след <b>ist/sind</b> — без окончание: Die Lampe ist alt.</div>`;

  function analyze(sentence) {
    build();
    const T = tokenize(sentence);
    const vIdx = finiteVerb(T);
    const isQ = /\?\s*$/.test(sentence);
    const res = T.map(() => ({}));
    const npInfo = new Map(); // индекс на съществителното → { g, c, a }
    // 1) членове → род и падеж
    T.forEach((tk, i) => {
      const a = artParse(tk.w, i); if (!a) return;
      const n = nounAfter(T, i);
      if (!n) {
        if (lc(tk.w) === "das") res[i] = { html: `<b>das</b> тук е „<b>това</b>“ (показателно), а не член — след него няма съществително. <i>Das ist …</i> = Това е …`, kind: "pron" };
        else if (lc(tk.w) === "der" || lc(tk.w) === "die") res[i] = { html: `<b>${esc(tk.w)}</b> тук стои вместо съществително („той/тя/онзи“).`, kind: "pron" };
        return;
      }
      let opts = n.opts.length ? n.opts : [];
      const fits = (g) => ["Nom", "Akk", "Dat"].some((c) => (a.type === "def" ? DEF_T[c][g] === a.end : EIN_T[c][g] === a.end));
      let pick = opts.find((o) => !o.same && fits(o.g)) || opts.find((o) => fits(o.g)) || opts[0];
      if (!pick) { res[i] = { html: `<b>${esc(tk.w)}</b> — член пред <b>${esc(T[n.j].w)}</b>.`, kind: "art" }; return; }
      const g = pick.g, cs = caseOf(T, i, g, a, vIdx);
      npInfo.set(n.j, { g, c: cs.c, a, it: pick.it, artW: tk.w, artI: i, why: cs.why });
      for (let k = i + 1; k < n.j; k++) npInfo.set(k, { g, c: cs.c, a, adjOf: n.j, artW: tk.w });
      const nounTxt = pick.it ? `${art(g === "pl" ? "pl" : g)} ${esc(g === "pl" ? pick.it.pl || pick.it.de : pick.it.de)}` : esc(T[n.j].w);
      const kind = { def: "определителен член („-ът/-та/-то“)", ind: "неопределен член („един/една“)", neg: "отрицание <b>kein</b> = „не“ + ein (никакъв)", poss: `притежателно: ${OWNER[a.root] || ""}`, dem: "„всеки / този / кой“ — окончание като на der/die/das" }[a.type];
      const gWhy = g === "pl" ? `<b>${esc(T[n.j].w)}</b> е в <b>множествено число</b>` : `<b>${esc(T[n.j].w)}</b> е ${art(g)} → ${GEN_BG[g]}${pick.dimin ? " (умалителните -chen/-lein са винаги das)" : ""}`;
      let tip = "";
      if (a.type !== "def") {
        if (g === "die") tip = `💡 Ако беше der-дума (der Stuhl): ${a.root === "Ihr" ? "Ihr" : a.root} Stuhl → ${a.root === "Ihr" ? "Ihren" : a.root + "en"} Stuhl (в Akkusativ). Само der-думите се сменят!`;
        else if (g === "der" && cs.c === "Akk") tip = `💡 Защо <b>-en</b>? Само мъжкият род се променя в Akkusativ: ${a.root} → ${a.root}en. В Nominativ би било: Das ist ${a.root === "Ihr" ? "Ihr" : a.root} ${esc(T[n.j].w)}.`;
        else if (g === "der" && cs.c === "Nom") tip = `💡 Ако беше след глагол като haben/brauchen (какво?) → <b>${a.root}en</b> ${esc(T[n.j].w)}.`;
        else if (g === "das") tip = `💡 При das-думите няма промяна между кой? и какво?: ${a.root === "Ihr" ? "Ihr" : a.root} ${esc(T[n.j].w)} и в двата.`;
        else if (g === "pl" && a.type === "ind") tip = "💡 „ein“ няма мн.ч. — просто махаш члена: Bücher.";
      } else if (g === "der" && cs.c === "Akk") tip = `💡 der → <b>den</b>: мъжкият род в Akkusativ (какво?/кого?). Другите родове не се променят.`;
      else if (g === "die" && cs.c === "Dat") tip = "💡 die → <b>der</b> в Dativ (след mit, in (къде?), zu, bei…).";
      res[i] = { kind: "art", html: `<b>${esc(tk.w)}</b> — ${kind}.<br><b>Защо ${esc(tk.w)}?</b> ${gWhy}.<br><b>Падеж: ${cs.c === "Nom" ? "Nominativ" : cs.c === "Akk" ? "Akkusativ" : "Dativ"}</b> — ${cs.why}.${tip ? `<div class="xtip">${tip}</div>` : ""}${articleRow(a.type, g, a.root)}`, item: pick.it };
    });
    // 2) всяка дума
    T.forEach((tk, i) => {
      if (res[i].html) return;
      const w = tk.w, t = lc(w), prev = i > 0 ? lc(T[i - 1].w) : "", np = npInfo.get(i);
      // прилагателно
      const aj = adjSplit(w);
      if (aj && w[0] === w[0].toLowerCase() && !VERBF.has(t)) {
        const baseGl = (typeof LEXM !== "undefined" && LEXM[aj.base]) || "";
        if (!aj.end) {
          res[i] = { kind: "adj", html: `<b>${esc(w)}</b> — прилагателно${baseGl ? ` (${esc(baseGl)})` : ""}. ${vIdx >= 0 && SEIN.has(lc(T[vIdx].w)) ? "Стои след <b>" + esc(T[vIdx].w) + "</b> → <b>без окончание</b> (не се променя по род): Die Lampe ist alt. Der Stuhl ist alt." : "Тук е без окончание, защото не стои пред съществително (или е наречие — „как?“)."}` };
          return;
        }
        let ctx = np || null;
        if (!ctx) { const n = nounAfter(T, i - 1); if (n && n.opts.length) { const o = n.opts[0]; ctx = { g: o.g, c: vIdx >= 0 && i < vIdx ? "Nom" : "Akk", a: null }; } }
        const atype = ctx && ctx.a ? (ctx.a.type === "def" || ctx.a.type === "dem" ? "def" : "ein") : "none";
        const exp = ctx ? adjEnding(atype, ctx.g, ctx.c) : null;
        const ctxTxt = ctx ? `${ctx.artW ? "<i>" + esc(ctx.artW) + "</i> + " : "без член + "}___ + ${art(ctx.g)}-дума, ${ctx.c === "Nom" ? "Nominativ (кой?)" : ctx.c === "Akk" ? "Akkusativ (какво?)" : "Dativ"}` : "";
        const ok = exp === aj.end;
        res[i] = { kind: "adj", html: `<b>${esc(w)}</b> = <b>${esc(aj.base)}</b>${baseGl ? ` (${esc(baseGl)})` : ""} + окончание <b>-${aj.end}</b>.<br>Прилагателното стои <b>пред съществително</b>, затова получава окончание.${ctx && ok ? `<br><b>Защо -${aj.end}?</b> ${ctxTxt} → <b>-${aj.end}</b>.` : ""}${/^(teur|dunkl|sauber)/.test(t) && aj.base !== t ? `<br>⚠️ ${esc(aj.base)} губи e-то: ${aj.base === "teuer" ? "teuer → teure, teurer" : "dunkel → dunkle, dunkler"}.` : ""}${ADJ_RULE}` };
        return;
      }
      if (t === "zu" && T[i + 1] && lc(T[i + 1].w) === "hause") { res[i] = { kind: "prep", html: "<b>zu Hause</b> = вкъщи (<b>къде?</b> — вече съм там). Сравни: <b>nach Hause</b> = към вкъщи (<b>накъде?</b> — прибирам се). „Hause“ е старинна форма с -e, само в тези изрази." }; return; }
      if (t === "hause") { res[i] = { kind: "noun", html: `<b>Hause</b> — само в изразите <b>zu Hause</b> (вкъщи) и <b>nach Hause</b> (към вкъщи). Иначе: das Haus.` }; return; }
      if (t === "gibt") { res[i] = { kind: "verb", html: "<b>gibt</b> — от глагола geben (давам). В израза <b>es gibt</b> = „има“ (съществува). След es gibt винаги идва <b>Akkusativ</b>: Es gibt <b>einen</b> Park, <b>eine</b> Bank, <b>ein</b> Kino." + (vIdx === i && i > 0 && lc(T[0].w) !== "es" ? "<br>Стои на 2-ро място; „es“ минава след него, защото изречението започва с друго: Im Zimmer <b>gibt es</b> …" : "") }; return; }
      // слети предлози
      if (CONTR[t]) { const [p, d, txt] = CONTR[t]; res[i] = { kind: "prep", html: `<b>${esc(w)}</b> = <b>${p} + ${d}</b>. ${txt}` }; return; }
      // предлози
      if (DAT_P[t] && !(t === "zu" && T[i + 1] && VERBF.has(lc(T[i + 1].w)))) { res[i] = { kind: "prep", html: `<b>${esc(w)}</b> = ${DAT_P[t]}. Предлог, след който <b>винаги е Dativ</b>: mit dem Auto, mit der Bahn, aus dem Büro. ${t === "nach" ? "<br>nach + град/държава = накъде: nach Berlin, nach Hause." : t === "aus" ? "<br>aus + град/държава = откъде: aus Bulgarien." : ""}` }; return; }
      if (AKK_P[t] && !(t === "um" && T.slice(i + 1).some((x) => lc(x.w) === "zu"))) { res[i] = { kind: "prep", html: `<b>${esc(w)}</b> = ${AKK_P[t]}. ${t === "um" ? "um + час = точно в: um 9 Uhr. " : ""}Предлог, след който <b>винаги е Akkusativ</b>: für den Chef, ohne den Fernseher.` }; return; }
      if (WECHSEL[t] && !(t === "an" && i === T.length - 1)) { res[i] = { kind: "prep", html: `<b>${esc(w)}</b> = ${WECHSEL[t]}. „Двоен“ предлог: <b>къде?</b> → Dativ (in dem Zimmer = im Zimmer) · <b>накъде?</b> → Akkusativ (in das Kino = ins Kino). ${t === "in" ? "<br>Пред град/държава без член: in Berlin, in Bulgarien." : ""}` }; return; }
      // um … zu / statt / ohne
      if (t === "um" || t === "statt" || (t === "ohne" && T.slice(i + 1).some((x) => lc(x.w) === "zu" || /zu/.test(lc(x.w))))) {
        res[i] = { kind: "conj", html: `<b>${esc(w)} … zu</b> + инфинитив = <b>${t === "um" ? "за да" : t === "statt" ? "вместо да" : "без да"}</b>. Отделя второ изречение със запетая; глаголът отива <b>накрая</b> с „zu“ пред него: <i>…, um Deutsch zu lernen.</i>` }; return;
      }
      if (t === "zu" && T[i + 1] && VERBF.get(lc(T[i + 1].w))?.some((x) => x.inf)) { res[i] = { kind: "conj", html: `<b>zu</b> + инфинитив (${esc(T[i + 1].w)}) = „да …“. Стои точно пред глагола в края. При разделимите глаголи влиза в средата: teil<b>zu</b>nehmen, vor<b>zu</b>bereiten.` }; return; }
      // zu вмъкнато в разделим глагол
      const zm = t.match(/^(an|ab|mit|ein|aus|vor|nach|fern|weg|teil|auf)zu(.+)$/);
      if (zm && VERBF.has(zm[1] + zm[2])) { const v = VERBF.get(zm[1] + zm[2])[0].it; res[i] = { kind: "verb", item: v, html: `<b>${esc(w)}</b> = <b>${zm[1]} + zu + ${zm[2]}</b> — инфинитив с „zu“ от разделимия глагол <b>${esc(v.de)}</b> (${esc(v.bg)}). „zu“ влиза между представката и глагола.` }; return; }
      // разделима представка в края
      if (SEP_PREF.includes(t) && (i === T.length - 1 || /[.?!,]/.test(sentence.slice(tk.at + w.length, tk.at + w.length + 1)))) {
        const fv = vIdx >= 0 ? (VERBF.get(lc(T[vIdx].w)) || []).map((x) => x.it).find((it) => SEPV.get(it.de) === t) : null;
        if (fv) { res[i] = { kind: "verb", item: fv, html: `<b>${esc(w)}</b> — <b>представката</b> на глагола <b>${esc(fv.de)}</b> (${esc(fv.bg)}).<br>При разделимите глаголи тя се <b>откъсва</b> и отива <b>в края</b> на изречението: <i>${esc(T[vIdx].w)} … ${esc(w)}</i>. В речника е слято: ${esc(fv.de)}.` }; return; }
      }
      // възвратни
      if (["mich", "dich", "sich", "uns", "euch"].includes(t)) {
        const rv = ITEMS.find((it) => it.type === "verb" && it.de.startsWith("sich ") && vIdx >= 0 && it.forms.some((f) => lc(f.split(" ")[0]) === lc(T[vIdx].w)));
        if (rv) { res[i] = { kind: "pron", item: rv, html: `<b>${esc(w)}</b> — <b>възвратно</b> местоимение („се“) към <b>${esc(rv.de)}</b> (${esc(rv.bg)}).<br>Сменя се по лицето: ich → <b>mich</b>, du → <b>dich</b>, er/sie/es → <b>sich</b>, wir → <b>uns</b>, ihr → <b>euch</b>, sie/Sie → <b>sich</b>.` }; return; }
      }
      // глаголи
      const vc = VERBF.get(t);
      if (vc && !(w[0] === w[0].toUpperCase() && i > 0)) {
        const lastW = T.length ? lc(T[T.length - 1].w) : "";
        const fin = vc.find((x) => x.idx.length && SEPV.get(x.it.de) === lastW && i !== T.length - 1) || vc.find((x) => x.idx.length) || null, infC = vc.find((x) => x.inf);
        const modal = vIdx >= 0 && vIdx !== i && ["können", "möchten", "müssen", "wollen", "dürfen", "sollen", "mögen"].includes((VERBF.get(lc(T[vIdx].w)) || [])[0]?.it.de);
        if (infC && (i !== vIdx || !fin) && (modal || i === T.length - 1 || i > vIdx + 1)) {
          const v = infC.it;
          res[i] = { kind: "verb", item: v, html: `<b>${esc(w)}</b> — <b>инфинитив</b> (речникова форма) на ${esc(v.de)} = ${esc(v.bg)}.<br>${modal ? `Стои <b>накрая</b>, защото в изречението има модален глагол <b>${esc(T[vIdx].w)}</b>: модалният е на 2-ро място, а вторият глагол — в края без промяна.` : "Стои накрая без промяна — така е, когато в изречението има друг спрегнат глагол (kann, möchte, will…) или „zu“."}` };
          return;
        }
        if (fin) {
          const v = fin.it; let idx = fin.idx;
          if (idx.length > 1) {
            const near = [T[i - 1], T[i + 1]].filter(Boolean).map((x) => x.w);
            const map = { ich: 0, du: 1, er: 2, es: 2, man: 2, wir: 3, ihr: 4 };
            const hit = near.map((x) => (x === "Sie" ? 5 : x === "sie" ? (idx.includes(2) && /t$/.test(w) ? 2 : 5) : map[lc(x)])).find((x) => x !== undefined && idx.includes(x));
            if (hit !== undefined) idx = [hit];
            else {
              const has = (p) => T.some((x) => lc(x.w) === p);
              if (idx.includes(2) && idx.includes(4)) idx = [has("ihr") ? 4 : 2];
              else if (idx.includes(3) && idx.includes(5)) idx = [has("wir") ? 3 : 5];
            }
          }
          const persons = idx.map((k) => PERS[k]).join(" / ");
          const inf0 = v.de.replace(/^sich /, ""), st0 = inf0.replace(/e?n$/, "");
          const reg = /[td]$/.test(st0) || /(chn|ffn|gn|tm|dm)$/.test(st0) ? [st0 + "e", st0 + "est", st0 + "et", inf0, st0 + "et", inf0]
            : /[sßzx]$/.test(st0) ? [st0 + "e", st0 + "t", st0 + "t", inf0, st0 + "t", inf0] : regularForms(inf0);
          const k0 = idx[0], irr = !/\s/.test(v.de) && !/\s/.test(v.forms[k0]) && v.forms[k0] !== reg[k0];
          const wild = ["sein", "haben", "wissen", "werden", "können", "möchten", "müssen", "wollen", "dürfen", "sollen", "mögen"].includes(v.de);
          let pos = "";
          if (i === vIdx) {
            if (i === 0 && isQ) pos = "Стои <b>най-отпред</b>, защото е въпрос с отговор „да/не“.";
            else if (i === 0) pos = "Стои <b>най-отпред</b> — молба/заповед (… Sie!) или въпрос.";
            else if (T.slice(0, i).some((x) => CONJ_END[lc(x.w)])) pos = `Стои <b>накрая</b> заради <b>${esc(T.slice(0, i).find((x) => CONJ_END[lc(x.w)]).w)}</b> — в такова изречение глаголът бяга в края.`;
            else if (i === 1 || (T[0] && /^(Das|Die|Der|Mein|Meine|Dein|Ein|Eine)$/.test(T[0].w) && i === 2)) pos = "Стои на <b>2-ро място</b> — основното правило за немския глагол.";
            else if (/^(ja|nein|doch)$/i.test(T[0].w) && i === 2) pos = `Стои на <b>2-ро място</b>. „${esc(T[0].w)},“ е извън изречението (място 0), затова: ${esc(T[1].w)} → <b>${esc(T[i].w)}</b>.`;
            else pos = `Стои на <b>2-ро място</b>: първото място заема „${esc(T.slice(0, i).map((x) => x.w).join(" "))}“, затова подлогът минава <b>след</b> глагола.`;
          } else if (T.slice(0, i).some((x) => CONJ_END[lc(x.w)])) pos = `Стои <b>накрая</b> заради <b>${esc(T.slice(0, i).find((x) => CONJ_END[lc(x.w)]).w)}</b>.`;
          const sep = SEPV.get(v.de);
          res[i] = { kind: "verb", item: v, html: `<b>${esc(w)}</b> = форма на <b>${esc(v.de)}</b> (${esc(v.bg)}) за <b>${persons}</b>.${irr ? (wild ? `<br>⚠️ ${esc(verbKind(v).replace(/<[^>]+>/g, ""))}` : `<br>⚠️ Не следва общото правило (по правило би било „${esc(reg[k0])}“): ${esc(verbKind(v).replace(/<[^>]+>/g, ""))}`) : ""}${sep ? `<br>Разделим глагол: представката <b>${sep}</b> отива в края.` : ""}${pos ? "<br>" + pos : ""}` };
          return;
        }
      }
      // местоимения
      if (t === "es" && T.some((x) => lc(x.w) === "gibt")) { res[i] = { kind: "pron", html: "<b>es</b> в <b>es gibt</b> = „има“. Безлично — не означава нищо конкретно. След es gibt винаги идва <b>Akkusativ</b>: Es gibt einen Park." }; return; }
      if (t === "es") { res[i] = { kind: "pron", html: "<b>es</b> = то. Замества <b>das-дума</b> (das Buch → es) или е безлично „то“ (Es ist kalt. Es regnet.) — в немския изречението винаги има подлог." }; return; }
      if (w === "Sie" && i > 0) { res[i] = { kind: "pron", html: "<b>Sie</b> с главна буква = <b>Вие</b> (учтиво). Глаголът е като при „те“: Sie komm<b>en</b>, Sie hab<b>en</b>." }; return; }
      if (t === "sie") { const vf = vIdx >= 0 ? lc(T[vIdx].w) : ""; const pl = /en$/.test(vf) || vf === "sind"; res[i] = { kind: "pron", html: `<b>${esc(w)}</b> = ${pl ? "<b>те</b> (мн.ч.) — глаголът е с -en" : "<b>тя</b> — глаголът е с -t (като er)"}. ${i === 0 ? "В началото на изречението може да е и <b>Вие</b> (Sie) — личи от смисъла." : ""} Замества и die-думи: die Lampe → sie.` }; return; }
      if (t === "ihr" && !npInfo.has(i)) { res[i] = { kind: "pron", html: "<b>ihr</b> = <b>вие</b> (няколко приятели). Глаголът е с <b>-t</b>: ihr komm<b>t</b>, ihr hab<b>t</b>." }; return; }
      if (PRON[t]) { const [g, c] = PRON[t]; res[i] = { kind: "pron", html: `<b>${esc(w)}</b> = ${g}.${c === "Akk" && t !== "sich" ? " Форма за <b>Akkusativ</b> (кого?)." : c === "Dat" ? " Форма за <b>Dativ</b> (на кого?)." : ""}${t === "man" ? " Глаголът е като при <b>er</b>: man kann, man isst. На български: „<b>се</b>“ — Hier kann man parken = Тук може да се паркира." : ""}` }; return; }
      // въпросителни, съюзи, отрицание
      if (QW[t]) { res[i] = { kind: "q", html: `<b>${esc(w)}</b> = ${QW[t]}. Въпросителната дума е на 1-во място, глаголът веднага след нея (2-ро място): <i>${esc(w)} ${vIdx === i + 1 ? esc(T[vIdx].w) : "kommst"} …?</i>` }; return; }
      if (CONJ0[t]) { res[i] = { kind: "conj", html: `<b>${esc(w)}</b> = ${CONJ0[t]}. Свързва две части и <b>не променя</b> словореда — след него продължаваш нормално: подлог → глагол.${t === "sondern" ? " Използва се само след nicht/kein: nicht …, sondern … = не …, а …" : ""}` }; return; }
      if (CONJ_END[t]) { res[i] = { kind: "conj", html: `<b>${esc(w)}</b> = ${CONJ_END[t]}. ⚠️ След <b>${esc(w)}</b> спрегнатият глагол отива <b>в края</b>: …, ${esc(w)} ich müde <b>bin</b>.` }; return; }
      if (t === "nicht") { res[i] = { kind: "neg", html: "<b>nicht</b> = не. Отрича <b>глагол, прилагателно или цялото изречение</b>. Пред съществително с ein/без член се използва <b>kein</b>, а не nicht: Ich habe <b>kein</b> Auto. Обикновено стои към края, но преди втория глагол/представката: Ich kann <b>nicht</b> schwimmen. Ich fahre <b>nicht</b> mit." }; return; }
      if (/^(montags|dienstags|mittwochs|donnerstags|freitags|samstags|sonntags|abends|morgens)$/.test(t)) { const DAYS = { montags: "понеделник", dienstags: "вторник", mittwochs: "сряда", donnerstags: "четвъртък", freitags: "петък", samstags: "събота", sonntags: "неделя", abends: "вечер", morgens: "сутрин" };
        res[i] = { kind: "adv", html: `<b>${esc(w)}</b> = всеки/всяка ${DAYS[t]} (по навик, редовно). Пише се с <b>малка</b> буква и <b>-s</b> накрая (в началото на изречението — с главна). Сравни: <i>am ${cap(t.replace(/s$/, ""))}</i> = в (един конкретен) ${DAYS[t]}.` }; return; }
      // съществително
      const no = NOUNS.get(t);
      if (no && w[0] === w[0].toUpperCase()) {
        const o = (np && no.find((x) => x.g === np.g)) || no.find((x) => !x.same) || no[0], it = o.it;
        const pc = T[i - 1] ? lc(T[i - 1].w) : "";
        const c = np ? ` В изречението: <b>${np.c === "Nom" ? "Nominativ" : np.c === "Akk" ? "Akkusativ" : "Dativ"}</b> (виж члена „${esc(np.artW)}“).`
          : CONTR[pc] ? ` Членът е „скрит“ в <b>${esc(T[i - 1].w)}</b> = ${CONTR[pc][0]} + ${CONTR[pc][1]} → ${CONTR[pc][1] === "das" ? "Akkusativ (накъде?)" : "Dativ"}.`
          : (T[i - 1] && !artParse(T[i - 1].w, i - 1) && !adjSplit(T[i - 1].w) ? " Тук е <b>без член</b> — често при мн.ч., неброими неща (Kaffee, Geld), професии, езици и след числа." : "");
        res[i] = { kind: "noun", item: it, html: o.g === "pl" ? `<b>${esc(w)}</b> — множествено число на ${art(it.art === "pl" ? "pl" : it.art)} <b>${esc(it.de)}</b> (${esc(it.bg)}). В мн.ч. членът е винаги <b>die</b>.${c}` : `<b>${esc(w)}</b> — съществително: ${art(o.g)} ${esc(it.de)} = ${esc(it.bg)} (${GEN_BG[o.g]})${it.pl ? `, мн.ч. die ${esc(it.pl)}` : ""}. Пише се с главна буква.${c}` };
        return;
      }
      if (/chen$|lein$/.test(t) && w[0] === w[0].toUpperCase()) { res[i] = { kind: "noun", html: `<b>${esc(w)}</b> — <b>умалително</b> (-chen/-lein = малко). Умалителните са <b>винаги das</b>, често с умлаут: die Hand → das H<b>ä</b>ndchen.` }; return; }
    });
    // роли за „Разбор“: subj · v · obj · dat · pp (предложна група) · end (глагол накрая) · neg · conj · q · other
    const roles = T.map(() => "other");
    const NOMP = ["ich", "du", "er", "sie", "es", "wir", "ihr", "man"];
    const PREPS = new Set([...Object.keys(DAT_P), ...Object.keys(AKK_P), ...Object.keys(WECHSEL), ...Object.keys(CONTR)]);
    T.forEach((tk, i) => {
      const t = lc(tk.w), r = res[i];
      if (i === vIdx) roles[i] = "v";
      else if (r.kind === "verb") roles[i] = "end";
      else if (t === "nicht") roles[i] = "neg";
      else if (CONJ0[t] || CONJ_END[t]) roles[i] = "conj";
      else if (QW[t]) roles[i] = "q";
      else if (PREPS.has(t) && r.kind === "prep") roles[i] = "pp";
    });
    // съществителни групи
    for (const [j, info] of npInfo) {
      if (info.adjOf !== undefined) continue;
      const st = info.artI ?? j;
      const prev = st > 0 ? lc(T[st - 1].w) : "";
      const role = PREPS.has(prev) && roles[st - 1] === "pp" ? "pp" : info.c === "Nom" ? "subj" : info.c === "Akk" ? "obj" : "dat";
      for (let k = st; k <= j; k++) roles[k] = role;
    }
    T.forEach((tk, i) => {
      const t = lc(tk.w);
      if (roles[i] !== "other") return;
      if (res[i].kind === "noun") { const prev = i > 0 ? lc(T[i - 1].w) : ""; roles[i] = PREPS.has(prev) ? "pp" : vIdx >= 0 && i < vIdx ? "subj" : "obj"; return; }
      if (NOMP.includes(t) && !(t === "es" && T.some((x) => lc(x.w) === "gibt"))) { roles[i] = t === "sie" && i > vIdx && T.slice(vIdx + 1, i).some((x) => NOMP.includes(lc(x.w))) ? "obj" : "subj"; return; }
      if (["mich", "dich", "ihn", "uns", "euch", "sich"].includes(t)) { roles[i] = "obj"; return; }
      if (["mir", "dir", "ihm", "ihnen"].includes(t)) { roles[i] = "dat"; return; }
      if (t === "zu" && res[i].kind === "conj") roles[i] = "end";
    });
    return { tokens: T, res, roles, vIdx };
  }
  const cache = new Map();
  return {
    explain(sentence, idx) {
      if (!cache.has(sentence)) cache.set(sentence, analyze(sentence));
      return cache.get(sentence).res[idx] || {};
    },
    analyze,
    roles(sentence) { if (!cache.has(sentence)) cache.set(sentence, analyze(sentence)); return cache.get(sentence); },
  };
})();
