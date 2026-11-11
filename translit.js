// Приблизителна транскрипция немски → кирилица по правилата за четене.
// Целта е начинаещият да прочете думата правилно; точният звук — от аудиото.
const TR_WHOLE = {
  ukraine: "украине", usa: "у-ес-а", venedig: "венедих",
  verb: "верп", verben: "вербен", woher: "вохер", wohin: "вохин", chemiker: "хемикер",
  november: "новембер", hiphop: "хипхоп", orchester: "оркестер", klavier: "клавир", e: "и", mail: "мейл", stabil: "стабил", steak: "стейк", steaks: "стейкс", cd: "це-де", cds: "це-декс", ski: "ши", skier: "шиер", yoga: "йога", jazz: "джес", volleyball: "волибал", laptop: "лептоп", laptops: "лептопс", bzw: "бе-цет-ве", orange: "оранже", ca: "цирка", ok: "окей",
  lkw: "ел-ка-ве", pkw: "пе-ка-ве", z: "цет", b: "бе", hofbräuhaus: "хофбройхаус", geehrter: "геертер", geehrte: "геерте", liter: "литер",
};
// подниз → транскрипция (prefix: само в началото на думата)
const TR_SUBS = [
  ["ingenieur", "инженьор", true], ["journal", "журнал", true], ["computer", "компютер", true],
  ["manager", "менеджер", true], ["hobby", "хоби"], ["restaurant", "ресторан"], ["fitnesscenter", "фитнессентер"], ["safe", "сейф"], ["toilett", "тоалет"], ["stück", "штюк"], ["straße", "штрасе"], ["abreise", "апрайзе", true], ["enthalt", "ентхалт"], ["ausstatt", "аусштат"], ["gehör", "гехьор"], ["garage", "гараже"], ["italien", "италиен", true], ["matchbox", "мечбокс"], ["sporthall", "шпортхал"], ["nachsch", "нахш"], ["igst", "ихст"], ["violet", "виолет"], ["orangen", "оранжен", true], ["erdbeereis", "ертбеерайс"], ["hausauf", "хаусауф"], ["vokal", "вокал"], ["tourist", "турист"], ["museum", "музеум"], ["museen", "музеен"], ["rathaus", "ратхаус"], ["ausstell", "аусштел"], ["vokabul", "вокабул"], ["igkeit", "ихкайт"], ["univers", "универз"], ["violin", "виолин", true], ["chemie", "хеми", true], ["beend", "беенд", true], ["buchstab", "бухштаб", true],
  ["jogg", "джог", true], ["variant", "вариант", true], ["entsch", "ентш", true], ["sechst", "зекст", true],
  ["wirtschaft", "виртшафт"], ["ssprache", "сшпрахе"],
  ["familie", "фамилие"], ["sprache", "шпрахе"], ["städte", "штете"], ["stadt", "штат"],
  ["stand", "штант"], ["stell", "штел"], ["steh", "ште"], ["spät", "шпет"],
];
const TR_V = "aeiouäöüyé";
const TR_SIMPLE = {
  a: "а", e: "е", é: "е", i: "и", o: "о", u: "у", ä: "е", ö: "ьо", ü: "ю", y: "ю",
  f: "ф", k: "к", l: "л", m: "м", n: "н", p: "п", r: "р", t: "т", w: "в", v: "ф", z: "ц", ß: "с", x: "кс",
};
const TR_MULTI = [ // [низ, кирилица, условие?]
  ["tsch", "ч"], ["sch", "ш"], ["chs", "кс"], ["tion", "цион"],
  ["ei", "ай"], ["ey", "ай"], ["ai", "ай"], ["eu", "ой"], ["äu", "ой"], ["au", "ау"],
  ["ee", "е"], ["aa", "а"], ["oo", "о"], ["ng", "нг"], ["ph", "ф"], ["pf", "пф"], ["qu", "кв"],
  ["th", "т"], ["ck", "к"], ["tz", "ц"], ["ss", "с"], ["dt", "т"],
];
function trWord(w) {
  if (TR_WHOLE[w]) return TR_WHOLE[w];
  let out = "", i = 0;
  const isV = (c) => !!c && TR_V.includes(c);
  outer: while (i < w.length) {
    for (const [k, v, pre] of TR_SUBS) {
      if ((!pre || i === 0) && w.startsWith(k, i)) { out += v; i += k.length; continue outer; }
    }
    const prev = w[i - 1], next = w[i + 1], rest = w.length - i;
    if (w.startsWith("chs", i) && w[i + 3] !== "t") { out += "кс"; i += 3; continue; }
    if (w.startsWith("ch", i)) { out += i === 0 ? "к" : "х"; i += 2; continue; }
    if (i === 0 && (w.startsWith("sp") || w.startsWith("st"))) { out += w[1] === "p" ? "шп" : "шт"; i += 2; continue; }
    if (rest === 2 && w.startsWith("ig", i) && i > 0) { out += "их"; i += 2; continue; }
    if (rest === 3 && w.startsWith("ien", i) && i > 0) { out += "иен"; i += 3; continue; }
    if (w.startsWith("ie", i)) { out += "и"; i += 2; continue; }
    for (const [k, v] of TR_MULTI) if (w.startsWith(k, i)) { out += v; i += k.length; continue outer; }
    const c = w[i];
    if (c === "j") {
      if (next === "a") { out += "я"; i += 2; continue; }
      if (next === "u") { out += "ю"; i += 2; continue; }
      out += "й"; i++; continue;
    }
    if ("bdg".includes(c)) { // обеззвучаване в края на сричката
      const devoice = !next || (!isV(next) && !"lrnj".includes(next));
      out += devoice ? { b: "п", d: "т", g: "к" }[c] : { b: "б", d: "д", g: "г" }[c]; i++; continue;
    }
    if (c === "h") { out += i === 0 || !isV(prev) ? "х" : ""; i++; continue; }
    if (c === "s") { out += isV(next) && (i === 0 || isV(prev) || "lrnm".includes(prev)) ? "з" : "с"; i++; continue; }
    if (c === "c") { out += "eiäy".includes(next || "") ? "ц" : "к"; i++; continue; }
    out += TR_SIMPLE[c] ?? c; i++;
  }
  return out.replace(/([бвгджзклмнпрстфхцчш])\1+/g, "$1");
}
function translit(text) {
  return text.toLowerCase().replace(/[a-zäöüßé]+/g, trWord);
}
if (typeof module !== "undefined") module.exports = { translit };
