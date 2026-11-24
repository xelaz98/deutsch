// ───────── ПАМЕТ: интервално повторение по модела на FSRS (опростен) ─────────
// Всяка дума има: стабилност s (дни, след които я помним с ~90% вероятност), трудност d (1–10),
// следваща дата due, брой успехи/провали и ОТДЕЛНИ умения:
//   rec    — разпознаване (избор от варианти, свързване)        — слабо доказателство
//   recall — самостоятелно припомняне (пише думата сама)          — силно
//   spell  — правопис при писане
//   use    — употреба в изречение (превод, попълване, преобразуване) — най-силно
// Правило: позната дума само чрез избор от варианти НЕ може да стане „усвоена“.
const MEM = (() => {
  const DAYMS = 864e5, KEY = "dl:mem";
  const MODE_GAIN = { rec: 0.45, recall: 1, use: 1.25 }; // колко „тежи“ верният отговор
  const FIRST_S = { rec: 0.25, recall: 1, use: 2 }; // начална стабилност (дни)
  const REC_CAP = 3; // само с разпознаване стабилността не надхвърля 3 дни
  let M = null;
  const load = () => { if (M) return M; try { M = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { M = {}; } return M; };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(M)); } catch (e) {} };
  const get = (id) => load()[id] || null;
  const R = (m, now = Date.now()) => (m && m.last ? Math.exp((Math.log(0.9) * (now - m.last)) / (Math.max(m.s, 0.05) * DAYMS)) : 0); // вероятност да я помниш сега
  const ev = (m, k) => (m.ev && m.ev[k]) || [0, 0]; // [верни, общо]
  // запис на един отговор; mode: rec | recall | use; ok: true/false; spellErr: правописна грешка при иначе верен отговор
  function record(id, mode, ok, opt = {}) {
    load(); const now = opt.now || Date.now();
    const m = M[id] || (M[id] = { s: 0, d: 5, due: 0, last: 0, reps: 0, lapses: 0, ev: {}, h: [] });
    const r = R(m, now), e = (m.ev[mode] = m.ev[mode] || [0, 0]); e[1]++;
    if (ok) {
      e[0]++;
      const w = MODE_GAIN[mode] || 1;
      if (!m.s) m.s = FIRST_S[mode] || 1;
      else if (now - m.last > 6 * 36e5 || mode !== "rec") {
        // растеж: по-голям, когато думата е била почти забравена (r малко) и е лесна (d малко)
        const grow = 1 + w * Math.exp(0.9) * ((11 - m.d) / 10) * Math.pow(m.s, -0.15) * (Math.exp((1 - r) * 1.6) - 0.55);
        m.s = Math.max(m.s * Math.max(grow, 1.05), m.s + 0.2 * w);
      }
      m.d = Math.max(1, m.d - 0.15 * w);
      if (opt.spellErr) { const sp = (m.ev.spell = m.ev.spell || [0, 0]); sp[1]++; }
      else if (mode !== "rec") { const sp = (m.ev.spell = m.ev.spell || [0, 0]); sp[0]++; sp[1]++; }
      m.reps++;
    } else {
      m.lapses++; m.d = Math.min(10, m.d + (mode === "rec" ? 0.8 : 1.3));
      m.s = Math.max(0.1, (m.s || 0.25) * (mode === "rec" ? 0.35 : 0.45));
    }
    // разпознаване без самостоятелно припомняне → таван
    if (ev(m, "recall")[0] + ev(m, "use")[0] === 0) m.s = Math.min(m.s, REC_CAP);
    m.last = now; m.due = now + (ok ? m.s * DAYMS : Math.min(m.s * 0.2, 1) * DAYMS); // грешка → пак до ден
    m.h.push([now, { rec: "r", recall: "w", use: "u" }[mode] || "w", ok ? (opt.spellErr ? 2 : 1) : 0]); if (m.h.length > 30) m.h.splice(0, m.h.length - 30);
    save(); return m;
  }
  // състояние: new | learning | unsure | mastered | review (зрялa, но дошла за повторение)
  function state(id, now = Date.now()) {
    const m = get(id); if (!m || !m.last) return "new";
    const lastFail = m.h.length && m.h[m.h.length - 1][2] === 0;
    if (lastFail || (m.lapses >= 2 && m.s < 7) || m.d >= 7.5) return "unsure";
    if (m.s >= 21 && ev(m, "recall")[0] + ev(m, "use")[0] >= 2 && ev(m, "use")[0] >= 1) return m.due <= now ? "review" : "mastered";
    if (m.s < 2 || m.reps < 2) return "learning";
    return m.due <= now ? "review" : "learning";
  }
  // показатели по умения (0–1 или null, ако няма данни)
  function skills(id) {
    const m = get(id); if (!m) return { rec: null, recall: null, spell: null, use: null };
    const f = (k) => { const [a, n] = ev(m, k); return n ? a / n : null; };
    return { rec: f("rec"), recall: f("recall"), spell: f("spell"), use: f("use") };
  }
  // какъв тип въпрос заслужава думата сега (постепенно: разпознаване → припомняне → употреба)
  function nextMode(id) {
    const m = get(id); if (!m || !m.last) return "rec";
    const rc = ev(m, "recall"), us = ev(m, "use");
    if (m.h.length && m.h[m.h.length - 1][2] === 0) return rc[0] ? "recall" : "rec"; // след грешка — стъпка назад
    if (!rc[0] || m.s < 1) return m.reps >= 1 ? "recall" : "rec";
    if (!us[0] || m.s >= 4) return "use";
    return Math.random() < 0.5 ? "recall" : "use";
  }
  const due = (ids, now = Date.now()) => ids.filter((id) => { const m = get(id); return m && m.last && m.due <= now; })
    .sort((a, b) => R(get(a), now) - R(get(b), now)); // най-забравените първо
  // миграция от старите 6 кутии (dl:srs): старите отговори бяха предимно избор от варианти → само „разпознаване“
  function migrate(srs) {
    load(); let n = 0; const S0 = [0.2, 0.5, 1, 2, 3, 3];
    for (const [id, v] of Object.entries(srs || {})) {
      if (M[id]) continue;
      const b = Math.max(0, Math.min(5, v.box | 0));
      M[id] = { s: S0[b], d: 5.5 - b * 0.4, due: v.due || 0, last: (v.due || Date.now()) - S0[b] * DAYMS, reps: b, lapses: 0, ev: { rec: [b, b] }, h: [], mig: 1 }; n++;
    }
    save(); return n;
  }
  const reset = () => { M = null; };
  return { record, state, skills, nextMode, due, migrate, get, R, all: load, reset, ev };
})();
if (typeof module !== "undefined") module.exports = { MEM };
