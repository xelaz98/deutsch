// Схеми, нарисувани в кода (SVG), за думи без ясна рисунка: дни, месеци, части на деня, „вчера/днес/утре“, посоки.
// Стилът следва пиктограмите: бял фон, дебел черен контур, плоски цветове, без текст (текстът би издал отговора).
const SCHEMES = (() => {
  const HL = "#f97316", OFF = "#e5e7eb", INK = "#111";
  const wrap = (body, bg = "#fff") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${bg}"/>${body}</svg>`;
  // седмица: календарна лента от 7 дни (пон. е първото квадратче)
  const week = (on) => wrap(`<rect x="5" y="30" width="90" height="8" rx="2" fill="${INK}"/>`
    + [...Array(7)].map((_, i) => `<rect x="${6 + i * 12.6}" y="41" width="10.6" height="26" rx="2" fill="${on.includes(i) ? HL : OFF}" stroke="${INK}" stroke-width="1.6"/>`).join(""));
  // година: 12 месеца в 3 реда по 4 (януари горе вляво); бледият цвят = сезонът (зима синьо, пролет зелено, лято жълто, есен оранжево)
  const SEASON = ["#bfdbfe", "#bfdbfe", "#bbf7d0", "#bbf7d0", "#bbf7d0", "#fef08a", "#fef08a", "#fef08a", "#fed7aa", "#fed7aa", "#fed7aa", "#bfdbfe"];
  const year = (on) => wrap(`<rect x="8" y="12" width="84" height="9" rx="2" fill="${INK}"/>`
    + [30, 50, 70].map((x) => `<rect x="${x - 2}" y="7" width="4" height="10" rx="2" fill="#9ca3af" stroke="${INK}" stroke-width="1.2"/>`).join("")
    + [...Array(12)].map((_, i) => `<rect x="${8 + (i % 4) * 21.5}" y="${25 + ((i / 4) | 0) * 23}" width="18" height="19" rx="2" fill="${on.length === 1 && on[0] === i ? "#dc2626" : on.length > 1 ? HL : SEASON[i]}" stroke="${INK}" stroke-width="${on.length === 1 && on[0] === i ? 3 : 1.6}"/>`).join(""));
  // части на деня: небе + слънце по дъгата (стрелка нагоре = изгрев, надолу = залез), нощ = луна и звезди
  const arrow = (x, y, up) => `<path d="M${x} ${y + (up ? 6 : -6)} L${x} ${y + (up ? -6 : 6)} M${x - 4} ${y + (up ? -2 : 2)} L${x} ${y + (up ? -6 : 6)} L${x + 4} ${y + (up ? -2 : 2)}" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const sun = (x, y, c = "#facc15") => `<circle cx="${x}" cy="${y}" r="10" fill="${c}" stroke="${INK}" stroke-width="2.4"/>`
    + [...Array(8)].map((_, k) => { const a = (k * Math.PI) / 4, r1 = 14, r2 = 19; return `<line x1="${(x + r1 * Math.cos(a)).toFixed(1)}" y1="${(y + r1 * Math.sin(a)).toFixed(1)}" x2="${(x + r2 * Math.cos(a)).toFixed(1)}" y2="${(y + r2 * Math.sin(a)).toFixed(1)}" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`; }).join("");
  const land = `<rect x="0" y="76" width="100" height="24" fill="#86efac" stroke="${INK}" stroke-width="2.4"/>`;
  const sky = (bg, body) => wrap(`<path d="M12 76 Q50 -4 88 76" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3 3" opacity=".45"/>${body}${land}`, bg);
  const night = wrap(`<path d="M62 18 a20 20 0 1 0 14 30 a16 16 0 1 1 -14 -30 z" fill="#fde68a" stroke="${INK}" stroke-width="2.4"/>`
    + [[20, 22], [34, 40], [18, 52], [44, 16]].map(([x, y]) => `<path d="M${x} ${y - 5} L${x + 1.5} ${y - 1.5} L${x + 5} ${y} L${x + 1.5} ${y + 1.5} L${x} ${y + 5} L${x - 1.5} ${y + 1.5} L${x - 5} ${y} L${x - 1.5} ${y - 1.5} Z" fill="#fff"/>`).join("")
    + `<rect x="0" y="76" width="100" height="24" fill="#14532d" stroke="${INK}" stroke-width="2.4"/>`, "#1e3a8a");
  // вчера/днес/утре: 5 дни, днешният (по средата) е отбелязан с триъгълник отдолу
  const rel = (i) => wrap(`<rect x="5" y="30" width="90" height="8" rx="2" fill="${INK}"/>`
    + [...Array(5)].map((_, k) => `<rect x="${7 + k * 17.6}" y="41" width="15" height="24" rx="2" fill="${k === i ? HL : OFF}" stroke="${INK}" stroke-width="1.6"/>`).join("")
    + `<path d="M50 70 L44 80 L56 80 Z" fill="${INK}"/>`);
  // посоки: компас, север е горе (черната стрелка); оранжевата точка показва посоката
  const DIRS = { Norden: [0, -1], Nordosten: [0.71, -0.71], Osten: [1, 0], Südosten: [0.71, 0.71], Süden: [0, 1], Südwesten: [-0.71, 0.71], Westen: [-1, 0], Nordwesten: [-0.71, -0.71], Mitte: [0, 0] };
  const compass = (d) => wrap(`<circle cx="50" cy="54" r="36" fill="#f9fafb" stroke="${INK}" stroke-width="2.4"/>`
    + `<line x1="50" y1="22" x2="50" y2="86" stroke="#9ca3af" stroke-width="1.4"/><line x1="18" y1="54" x2="82" y2="54" stroke="#9ca3af" stroke-width="1.4"/>`
    + `<path d="M50 3 L43 15 L57 15 Z" fill="${INK}"/>`
    + Object.entries(DIRS).map(([k, [dx, dy]]) => `<circle cx="${(50 + dx * 26).toFixed(1)}" cy="${(54 + dy * 26).toFixed(1)}" r="${k === d ? 9 : 3.5}" fill="${k === d ? HL : "#9ca3af"}" stroke="${k === d ? INK : "none"}" stroke-width="2"/>`).join(""));
  const S = {
    Montag: week([0]), Dienstag: week([1]), Mittwoch: week([2]), Donnerstag: week([3]), Freitag: week([4]), Samstag: week([5]), Sonnabend: week([5]), Sonntag: week([6]),
    Wochenende: week([5, 6]), Woche: week([0, 1, 2, 3, 4, 5, 6]), Jahr: year([...Array(12).keys()]),
    Morgen: sky("#fde68a", sun(22, 62, "#fb923c") + arrow(47, 50, true)), Vormittag: sky("#bae6fd", sun(30, 38)), Mittag: sky("#7dd3fc", sun(50, 24)),
    Nachmittag: sky("#93c5fd", sun(70, 38)), Abend: sky("#fdba74", sun(78, 62, "#ef4444") + arrow(53, 50, false)), Nacht: night,
    hellblau: wrap(`<circle cx="50" cy="50" r="38" fill="#93c5fd" stroke="${INK}" stroke-width="2.4"/>`), dunkelblau: wrap(`<circle cx="50" cy="50" r="38" fill="#1e3a8a" stroke="${INK}" stroke-width="2.4"/>`),
    Komma: wrap(`<rect x="10" y="62" width="22" height="6" rx="3" fill="#9ca3af"/><rect x="68" y="62" width="22" height="6" rx="3" fill="#9ca3af"/><circle cx="50" cy="52" r="9" fill="${HL}" stroke="${INK}" stroke-width="2.4"/><path d="M57 54 Q58 70 44 80" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M57 54 Q58 70 44 80" fill="none" stroke="${HL}" stroke-width="2"/>`),
    vorgestern: rel(0), gestern: rel(1), heute: rel(2), morgen: rel(3), übermorgen: rel(4),
  };
  ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"].forEach((m, i) => (S[m] = year([i])));
  Object.keys(DIRS).forEach((d) => (S[d] = compass(d)));
  return S;
})();
// семейство на схемата — в задачите „картинка ↔ дума“ грешните варианти са от същото семейство (ден ↔ ден, месец ↔ месец)
const SCHEME_GROUP = {};
["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonnabend", "Sonntag", "Wochenende", "Woche"].forEach((k) => (SCHEME_GROUP[k] = "week"));
["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", "Jahr"].forEach((k) => (SCHEME_GROUP[k] = "year"));
["Morgen", "Vormittag", "Mittag", "Nachmittag", "Abend", "Nacht"].forEach((k) => (SCHEME_GROUP[k] = "sky"));
["vorgestern", "gestern", "heute", "morgen", "übermorgen"].forEach((k) => (SCHEME_GROUP[k] = "rel"));
["Norden", "Nordosten", "Osten", "Südosten", "Süden", "Südwesten", "Westen", "Nordwesten", "Mitte"].forEach((k) => (SCHEME_GROUP[k] = "dir"));
