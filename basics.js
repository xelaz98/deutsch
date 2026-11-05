// Основи от нулата: азбука, звуци, правила за четене, спелуване, числа.

// [буква, как се казва (за аудиото), име на кирилица, IPA, звук в думите, пример, превод, спелуване по телефона, бележка]
const ALPHABET = [
  ["A", "A", "а", "aː", "а", "der Arzt", "лекар", "Anton"],
  ["B", "Be", "бе", "beː", "б (в края → п)", "der Bruder", "брат", "Berta"],
  ["C", "Ce", "це", "tseː", "к; пред e, i → ц", "das Café", "кафене", "Cäsar", "Почти само в ch, ck, sch и чужди думи"],
  ["D", "De", "де", "deː", "д (в края → т)", "der Dialog", "диалог", "Dora"],
  ["E", "E", "е", "eː", "е", "das Ende", "край", "Emil"],
  ["F", "Ef", "еф", "ɛf", "ф", "die Familie", "семейство", "Friedrich"],
  ["G", "Ge", "ге", "ɡeː", "г (в края → к)", "gegen", "срещу", "Gustav"],
  ["H", "Ha", "ха", "haː", "х; след гласна — нем", "das Haus", "къща", "Heinrich", "wohnen — h не се чете, а удължава „о“"],
  ["I", "I", "и", "iː", "и", "ich", "аз", "Ida"],
  ["J", "Jot", "йот", "jɔt", "й", "das Jahr", "година", "Julius", "ja = „я“, Jahr = „яр“"],
  ["K", "Ka", "ка", "kaː", "к", "das Kind", "дете", "Kaufmann"],
  ["L", "El", "ел", "ɛl", "л (меко)", "lachen", "смея се", "Ludwig"],
  ["M", "Em", "ем", "ɛm", "м", "die Mutter", "майка", "Martha"],
  ["N", "En", "ен", "ɛn", "н", "der Name", "име", "Nordpol"],
  ["O", "O", "о", "oː", "о", "oben", "горе", "Otto"],
  ["P", "Pe", "пе", "peː", "п", "der Papagei", "папагал", "Paula"],
  ["Q", "Qu", "ку", "kuː", "винаги qu = кв", "die Quitte", "дюла", "Quelle"],
  ["R", "Er", "ер", "ɛʁ", "гърлено р; в края ≈ „а“", "der Rauch", "дим", "Richard", "Като леко гъргорене. Vater звучи почти „фата“"],
  ["S", "Es", "ес", "ɛs", "з пред гласна, иначе с", "Sie", "Вие", "Samuel", "sp/st в началото = шп/шт: sprechen, Student"],
  ["T", "Te", "те", "teː", "т", "die Tante", "леля", "Theodor"],
  ["U", "U", "у", "uː", "у", "das Ufer", "бряг", "Ulrich"],
  ["V", "Vau", "фау", "faʊ̯", "ф (в чужди думи в)", "der Vater", "баща", "Viktor", "Variante, November — с „в“"],
  ["W", "We", "ве", "veː", "в", "wohnen", "живея", "Wilhelm"],
  ["X", "Ix", "икс", "ɪks", "кс", "der Taxifahrer", "таксиметров шофьор", "Xanthippe"],
  ["Y", "Ypsilon", "юпсилон", "ˈʏpsilɔn", "ю (в английски думи и)", "die Physik", "физика", "Ypsilon"],
  ["Z", "Zett", "цет", "tsɛt", "ц", "die Zahl", "число", "Zacharias"],
  ["Ä", "Ä", "е (а-умлаут)", "ɛː", "е", "die Ärztin", "лекарка", "Ärger", "Без клавиатура: ae"],
  ["Ö", "Ö", "ьо (о-умлаут)", "øː", "ьо", "hören", "слушам", "Ökonom", "Устни като за „о“, език като за „е“. Без клавиатура: oe"],
  ["Ü", "Ü", "ю (у-умлаут)", "yː", "ю", "über", "над; за", "Übermut", "Устни като за „у“, език като за „и“. Без клавиатура: ue"],
  ["ß", "Eszett", "есцет", "ɛsˈtsɛt", "с", "heißen", "казвам се", "Eszett", "Никога в началото на дума. Без клавиатура: ss"],
].map(([ch, say, name, ipa, sound, ex, exBg, spell, note]) => ({ ch, say, name, ipa, sound, ex, exBg, spell, note, extra: "ÄÖÜß".includes(ch) }));

// Звуци и буквосъчетания: [пише се, чете се, IPA, примери, бележка]
const SOUNDS = [
  ["Гласни комбинации", [
    ["ei · ai · ey", "ай", "aɪ̯", ["die Reise", "der Papagei", "der Mai"], "Внимание: ei = ай, а не „ей“!"],
    ["ie", "и (дълго)", "iː", ["die Wiese", "lieben", "vier"], "ie = дълго и, а не „ие“"],
    ["eu · äu", "ой", "ɔʏ̯", ["Deutsch", "heute", "die Häuser"]],
    ["au", "ау", "aʊ̯", ["das Haus", "faul", "die Frau"]],
  ]],
  ["Умлаути", [
    ["ä", "е", "ɛ", ["die Ärztin", "die Länder", "der März"]],
    ["ö", "ьо", "ø", ["hören", "die Höhe", "Österreich"], "Кажи „е“ със закръглени устни"],
    ["ü", "ю", "y", ["über", "die Brüder", "grün"], "Кажи „и“ със закръглени устни"],
  ]],
  ["Съгласни комбинации", [
    ["sch", "ш", "ʃ", ["die Schwester", "schreiben", "schwarz"]],
    ["tsch", "ч", "tʃ", ["Deutsch", "Tschüss"]],
    ["sp · st (в началото)", "шп · шт", "ʃp · ʃt", ["sprechen", "der Student", "die Stadt"], "В средата на думата — нормално: die Schwester (ст)"],
    ["ch след a, o, u, au", "х (твърдо, от гърлото)", "x", ["lachen", "hoch", "der Rauch"]],
    ["ch след e, i, ä, ö, ü, ei, eu, l, n, r", "х (меко, като „хю“)", "ç", ["ich", "die Geschichte", "welche"], "Като когато казваш „хи“ — съскаво, отпред"],
    ["-ig (в края)", "их", "ɪç", ["richtig", "wichtig", "zwanzig"]],
    ["chs", "кс", "ks", ["sechs", "sechstens"]],
    ["ng", "нг (носово)", "ŋ", ["die Wohnung", "singen", "langsam"], "г почти не се чува"],
    ["ph", "ф", "f", ["die Physik", "der Philosoph"]],
    ["qu", "кв", "kv", ["die Quitte"]],
    ["z · tz", "ц", "ts", ["die Zahl", "zehn", "jetzt"]],
    ["ß · ss", "с", "s", ["heißen", "groß", "passen"]],
  ]],
  ["Букви, които се четат различно от българския", [
    ["s + гласна", "з", "z", ["Sie", "sind", "die Reise"]],
    ["v", "ф", "f", ["der Vater", "von", "vier"], "В чужди думи — в: die Variante"],
    ["w", "в", "v", ["wohnen", "die Wiese", "wir"]],
    ["j", "й", "j", ["ja", "das Jahr", "jetzt"]],
    ["h след гласна", "не се чете", "ː", ["wohnen", "die Zahl", "das Jahr"], "Само удължава гласната пред себе си"],
    ["r", "гърлено р", "ʁ", ["rot", "der Rauch", "richtig"]],
  ]],
  ["Окончания", [
    ["-er", "≈ а", "ɐ", ["der Vater", "die Mutter", "der Lehrer"], "Транскрипцията пише „ер“, но звучи почти като „а“"],
    ["-e", "кратко, неясно е", "ə", ["die Tante", "bitte", "danke"]],
    ["-en", "почти само н", "ən / n̩", ["lernen", "haben", "kommen"]],
    ["b · d · g в края", "п · т · к", "p t k", ["das Land", "der Tag", "gelb"], "Звучните стават беззвучни в края — като в българския: „хляб“ → „хляп“"],
  ]],
];

const READING_RULES = [
  ["Пише се, както се чете", "Ако знаеш звуците отгоре, можеш да прочетеш всяка дума — дори без да я знаеш. Няма „тихи“ букви като в английския (освен h след гласна)."],
  ["Ударението е на първата сричка", "<i>Vater, Mutter, Tante, Kinder</i>. Изключения: представките <b>be-, ge-, er-, ver-, zer-, ent-</b> не се ударяват (<i>verstehen, Geschichte</i>); чуждиците — към края (<i>studieren, Student, Musik, Polizei</i>)."],
  ["Дълга или кратка гласна?", "<b>Дълга</b>: пред h (<i>wohnen</i>), двойна (<i>Staat</i>), ie (<i>vier</i>), пред една съгласна (<i>Name</i>).<br><b>Кратка</b>: пред две съгласни (<i>Mutter, Kind, Bett</i>)."],
  ["Всички съществителни с главна буква", "<i>das Haus, die Stadt, der Vater</i> — така веднага разпознаваш съществителното. Учтивото <b>Sie</b> и <b>Ihr</b> също."],
  ["Слято писане", "Немският лепи думи: <i>Feuer + Wehr + Mann = Feuerwehrmann</i>. Чети ги на части. Родът е на последната част."],
];

// Числа → немски думи (0 – 999 999)
const NUM_U = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn"];
const NUM_T = ["", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];
function num2de(n, year = false) {
  n = Math.floor(n);
  if (n < 20) return NUM_U[n];
  if (n < 100) { const u = n % 10, t = (n / 10) | 0; return u ? (u === 1 ? "ein" : NUM_U[u]) + "und" + NUM_T[t] : NUM_T[t]; }
  if (year && n >= 1100 && n < 2000) { const r = n % 100; return num2de((n / 100) | 0) + "hundert" + (r ? num2de(r) : ""); }
  if (n < 1000) { const h = (n / 100) | 0, r = n % 100; return (h === 1 ? "ein" : NUM_U[h]) + "hundert" + (r ? num2de(r) : ""); }
  if (n < 1e6) { const th = (n / 1000) | 0, r = n % 1000; return num2de(th).replace(/eins$/, "ein") + "tausend" + (r ? num2de(r) : ""); }
  return String(n);
}
