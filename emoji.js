// Картинки (емоджи) за упражненията „картинка ↔ дума“ и за запомняне.
// Правило: САМО предмети/неща, които картинката показва недвусмислено, и всяка картинка — за една-единствена дума.
// Без дни, месеци, абстрактни думи, глаголи и прилагателни (освен цветовете) — там картинката може да се разбере по няколко начина.
const EMOJI = {
  // храна и напитки
  Kaffee: "☕", Tee: "🍵", Milch: "🥛", Bier: "🍺", Wein: "🍷", Limonade: "🍋",
  Tomate: "🍅", Gurke: "🥒", Apfel: "🍎", Banane: "🍌", Orange: "🍊", Birne: "🍐", Weintrauben: "🍇", Butter: "🧈", Honig: "🍯", Schokolade: "🍫", Besteck: "🍴", Brot: "🍞", Ei: "🥚", Wurst: "🌭", Käse: "🧀", Salat: "🥗",
  Steak: "🥩", Suppe: "🍲", Kuchen: "🍰", Pizza: "🍕", Eis: "🍦", Kartoffel: "🥔", Zigarette: "🚬",
  // дрехи и лични вещи
  Hose: "👖", Jacke: "🧥", Schuh: "👟", Hut: "👒", Tasche: "👜", Schirm: "☂️", Brille: "👓", Kamera: "📷", Geschenk: "🎁",
  Schlüssel: "🔑", Kreditkarte: "💳", Münze: "🪙", Uhr: "⌚", Wecker: "⏰",
  // вкъщи и в офиса
  Buch: "📖", Zeitung: "📰", Brief: "✉️", Bleistift: "✏️", Kugelschreiber: "🖊️", Laptop: "💻", Drucker: "🖨️",
  Telefon: "☎️", Fernseher: "📺", Radio: "📻", Lampe: "💡", Stuhl: "🪑", Bett: "🛏️", Dusche: "🚿", Spiegel: "🪞",
  Fenster: "🪟", Tür: "🚪", Toilettenpapier: "🧻", Papierkorb: "🗑️", Teller: "🍽️", Puppe: "🪆", Stofftier: "🧸", CD: "💿",
  // музика, спорт, игри
  Gitarre: "🎸", Klavier: "🎹", Trompete: "🎺", Saxofon: "🎷", Geige: "🎻", Violine: "🎻",
  Fußball: "⚽", Tennis: "🎾", Tischtennis: "🏓", Golf: "⛳", Ski: "🎿", Volleyball: "🏐", Schach: "♟️",
  // превоз
  Auto: "🚗", Fahrrad: "🚲", Motorrad: "🏍️", Zug: "🚆", Flugzeug: "✈️", Schiff: "🚢", Segelschiff: "⛵",
  // сгради
  Haus: "🏠", Hotel: "🏨", Schule: "🏫", Bank: "🏦",
  // животни и природа
  Maus: "🐭", Papagei: "🦜", Faultier: "🦥", Muschel: "🐚", Stein: "🪨", Baum: "🌳", Stern: "⭐", Herz: "❤️", Hand: "✋", Fuß: "🦶",
  // хора — само там, където няма как да се сбърка
  Baby: "👶", Großvater: "👴", Koch: "👨‍🍳", Polizist: "👮", Feuerwehrmann: "👨‍🚒", Roboter: "🤖",
  // държави (знамена)
  Bulgarien: "🇧🇬", Österreich: "🇦🇹", Schweiz: "🇨🇭", Türkei: "🇹🇷", Ukraine: "🇺🇦", USA: "🇺🇸", Niederlande: "🇳🇱",
  "Polen – Polnisch": "🇵🇱", "Tschechien – Tschechisch": "🇨🇿", "Frankreich – Französisch": "🇫🇷", "Deutschland – Deutsch": "🇩🇪", "Italien – italienisch": "🇮🇹",
  europäisch: "🇪🇺",
  // смятане
  plus: "➕", minus: "➖", "ist gleich": "🟰",
  // цветове
  rot: "🔴", gelb: "🟡", grün: "🟢", blau: "🔵", lila: "🟣", violett: "🟣", orange: "🟠", braun: "🟤", schwarz: "⚫", weiß: "⚪",
};
const SCHEME_IMG = {};
// Връща HTML за картинката на думата: схема (schemes.js), емоджи или пиктограма (pics.js); null, ако няма ясна картинка.
const emojiOf = (it) => {
  if (!it) return null;
  if (typeof SCHEMES !== "undefined" && SCHEMES[it.de]) return (SCHEME_IMG[it.de] ||= `<img class="pic" src="data:image/svg+xml,${encodeURIComponent(SCHEMES[it.de])}" alt="" draggable="false">`);
  if (EMOJI[it.de]) return EMOJI[it.de];
  const id = typeof PICS !== "undefined" && PICS[it.de];
  return id ? `<img class="pic" src="pic/${id}.webp" alt="" loading="lazy" draggable="false">` : null;
};
