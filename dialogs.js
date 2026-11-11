// 24 ситуации от живота (ниво A1) — всяка реплика с превод. Ползват се в „Диалози“, „Коя реплика липсва?“ и „Подреди диалога“.
// { title, ic, lines: [[кой, немски, български]], qs: [[твърдение, вярно?, ред]] }
const DIALOGS2 = [
  { title: "В пекарната", ic: "🥐", lines: [
    ["Verkäuferin", "Guten Morgen! Was möchten Sie?", "Добро утро! Какво желаете?"], ["Kunde", "Guten Morgen! Ich möchte vier Brötchen, bitte.", "Добро утро! Бих искал четири хлебчета, моля."],
    ["Verkäuferin", "Gern. Noch etwas?", "С удоволствие. Още нещо?"], ["Kunde", "Ja, ein Stück Kuchen.", "Да, едно парче торта."],
    ["Verkäuferin", "Das macht vier Euro zwanzig.", "Това прави четири евро и двадесет."], ["Kunde", "Hier, bitte. Auf Wiedersehen!", "Ето, заповядайте. Довиждане!"]],
    qs: [["Der Kunde möchte vier Brötchen.", true, 1], ["Er nimmt auch einen Kaffee.", false, 3], ["Alles kostet vier Euro zwanzig.", true, 4], ["Das Gespräch ist am Abend.", false, 0]] },
  { title: "В кафенето", ic: "☕", lines: [
    ["Kellner", "Hallo! Was möchtet ihr trinken?", "Здравейте! Какво ще пиете?"], ["Anna", "Ich nehme einen Cappuccino.", "Аз ще взема капучино."],
    ["Paul", "Und ich möchte einen Tee mit Milch.", "А аз бих искал чай с мляко."], ["Kellner", "Möchtet ihr auch etwas essen?", "Ще хапнете ли и нещо?"],
    ["Anna", "Ja, einen Apfelkuchen, bitte.", "Да, ябълков сладкиш, моля."], ["Paul", "Für mich nichts, danke.", "За мен нищо, благодаря."]],
    qs: [["Anna trinkt Tee.", false, 1], ["Paul möchte Milch im Tee.", true, 2], ["Anna isst Apfelkuchen.", true, 4], ["Paul isst auch etwas.", false, 5]] },
  { title: "При лекаря", ic: "🩺", lines: [
    ["Ärztin", "Guten Tag, Herr Kurz. Was fehlt Ihnen?", "Добър ден, господин Курц. Какво Ви е?"], ["Patient", "Ich habe Kopfschmerzen und Fieber.", "Имам главоболие и температура."],
    ["Ärztin", "Seit wann haben Sie das?", "Откога имате това?"], ["Patient", "Seit zwei Tagen.", "От два дни."],
    ["Ärztin", "Sie sind krank. Bleiben Sie drei Tage zu Hause.", "Болен сте. Останете три дни вкъщи."], ["Ärztin", "Trinken Sie viel Tee und nehmen Sie diese Tabletten.", "Пийте много чай и вземайте тези таблетки."]],
    qs: [["Herr Kurz hat Kopfschmerzen.", true, 1], ["Er ist seit einer Woche krank.", false, 3], ["Er muss drei Tage zu Hause bleiben.", true, 4], ["Die Ärztin sagt: Trinken Sie Kaffee.", false, 5]] },
  { title: "На гарата", ic: "🚉", lines: [
    ["Reisende", "Eine Fahrkarte nach Hamburg, bitte.", "Един билет за Хамбург, моля."], ["Mitarbeiter", "Einfach oder hin und zurück?", "Еднопосочен или отиване и връщане?"],
    ["Reisende", "Hin und zurück, bitte. Was kostet das?", "Отиване и връщане, моля. Колко струва?"], ["Mitarbeiter", "Achtzig Euro.", "Осемдесет евро."],
    ["Reisende", "Wann fährt der nächste Zug ab?", "Кога тръгва следващият влак?"], ["Mitarbeiter", "Um zehn Uhr fünfzehn von Gleis drei.", "В десет и петнадесет от коловоз три."]],
    qs: [["Die Frau fährt nach Hamburg.", true, 0], ["Sie kauft eine einfache Fahrkarte.", false, 2], ["Die Fahrkarte kostet achtzig Euro.", true, 3], ["Der Zug fährt von Gleis drei ab.", true, 5]] },
  { title: "Питане за пътя", ic: "🗺️", lines: [
    ["Tourist", "Entschuldigung, wo ist der Bahnhof?", "Извинете, къде е гарата?"], ["Frau", "Gehen Sie hier geradeaus und dann links.", "Вървете тук направо и после наляво."],
    ["Tourist", "Ist das weit?", "Далеч ли е?"], ["Frau", "Nein, nur fünf Minuten zu Fuß.", "Не, само пет минути пеша."],
    ["Tourist", "Und gibt es dort eine Apotheke?", "А има ли там аптека?"], ["Frau", "Ja, neben dem Bahnhof.", "Да, до гарата."], ["Tourist", "Vielen Dank!", "Много благодаря!"]],
    qs: [["Der Tourist sucht den Bahnhof.", true, 0], ["Er muss rechts gehen.", false, 1], ["Der Bahnhof ist weit.", false, 3], ["Die Apotheke ist neben dem Bahnhof.", true, 5]] },
  { title: "В супермаркета", ic: "🛒", lines: [
    ["Mann", "Was brauchen wir noch?", "Какво още ни трябва?"], ["Frau", "Milch, Eier und Brot.", "Мляко, яйца и хляб."],
    ["Mann", "Haben wir noch Käse?", "Имаме ли още сирене?"], ["Frau", "Nein, wir haben keinen Käse mehr.", "Не, нямаме вече сирене."],
    ["Mann", "Gut, ich hole Käse und Tomaten.", "Добре, ще взема сирене и домати."], ["Frau", "Und kauf bitte keine Schokolade!", "И моля те, не купувай шоколад!"]],
    qs: [["Sie brauchen Milch und Eier.", true, 1], ["Sie haben noch Käse.", false, 3], ["Der Mann holt Tomaten.", true, 4], ["Die Frau möchte Schokolade.", false, 5]] },
  { title: "Телефонно обаждане", ic: "📞", lines: [
    ["Lisa", "Hallo Tom, hier ist Lisa.", "Здравей, Том, Лиза е."], ["Tom", "Hallo Lisa! Wie geht's?", "Здравей, Лиза! Как си?"],
    ["Lisa", "Gut, danke. Hast du am Samstag Zeit?", "Добре, благодаря. Имаш ли време в събота?"], ["Tom", "Am Samstag arbeite ich leider. Aber am Sonntag habe ich Zeit.", "В събота за съжаление работя. Но в неделя имам време."],
    ["Lisa", "Super! Gehen wir am Sonntag ins Kino?", "Супер! Да отидем ли в неделя на кино?"], ["Tom", "Gern! Um wie viel Uhr?", "С удоволствие! В колко часа?"], ["Lisa", "Um acht Uhr.", "В осем часа."]],
    qs: [["Tom hat am Samstag Zeit.", false, 3], ["Am Sonntag hat Tom Zeit.", true, 3], ["Sie gehen ins Theater.", false, 4], ["Der Film beginnt um acht Uhr.", true, 6]] },
  { title: "Нов колега", ic: "🤝", lines: [
    ["Frau Roth", "Guten Morgen! Sind Sie neu hier?", "Добро утро! Нов ли сте тук?"], ["Herr Petrov", "Ja, ich bin Ivan Petrov. Ich arbeite in der Abteilung Marketing.", "Да, аз съм Иван Петров. Работя в отдел маркетинг."],
    ["Frau Roth", "Herzlich willkommen! Ich bin Maria Roth. Woher kommen Sie?", "Добре дошли! Аз съм Мария Рот. Откъде сте?"], ["Herr Petrov", "Ich komme aus Bulgarien, aus Sofia.", "От България съм, от София."],
    ["Frau Roth", "Und wo wohnen Sie jetzt?", "А къде живеете сега?"], ["Herr Petrov", "Ich wohne seit Montag in München.", "Живея в Мюнхен от понеделник."]],
    qs: [["Herr Petrov ist neu im Büro.", true, 1], ["Er arbeitet in der Verwaltung.", false, 1], ["Er kommt aus Sofia.", true, 3], ["Er wohnt schon lange in München.", false, 5]] },
  { title: "Оглед на жилище", ic: "🏠", lines: [
    ["Vermieter", "Das ist die Wohnung. Sie hat drei Zimmer.", "Това е жилището. Има три стаи."], ["Anna", "Die Küche ist sehr schön! Gibt es auch einen Balkon?", "Кухнята е много хубава! Има ли и балкон?"],
    ["Vermieter", "Ja, der Balkon ist hier.", "Да, балконът е тук."], ["Anna", "Wie viel kostet die Wohnung?", "Колко струва жилището?"],
    ["Vermieter", "Neunhundert Euro im Monat.", "Деветстотин евро на месец."], ["Anna", "Das ist ziemlich teuer, aber die Lage ist super.", "Доста е скъпо, но местоположението е супер."]],
    qs: [["Die Wohnung hat zwei Zimmer.", false, 0], ["Die Wohnung hat einen Balkon.", true, 2], ["Die Miete ist neunhundert Euro.", true, 4], ["Anna findet die Wohnung billig.", false, 5]] },
  { title: "Купуване на дрехи", ic: "👕", lines: [
    ["Verkäufer", "Kann ich Ihnen helfen?", "Мога ли да Ви помогна?"], ["Kundin", "Ja, ich suche eine Jacke.", "Да, търся яке."],
    ["Verkäufer", "Welche Farbe möchten Sie?", "Какъв цвят искате?"], ["Kundin", "Blau oder schwarz.", "Синьо или черно."],
    ["Verkäufer", "Hier ist eine blaue Jacke. Sie kostet sechzig Euro.", "Ето едно синьо яке. Струва шестдесет евро."], ["Kundin", "Sie ist schön, aber zu klein. Haben Sie die Jacke in Größe 40?", "Хубаво е, но е малко. Имате ли якето размер 40?"]],
    qs: [["Die Frau sucht eine Hose.", false, 1], ["Sie möchte eine blaue oder schwarze Jacke.", true, 3], ["Die Jacke kostet sechzig Euro.", true, 4], ["Die Jacke ist zu groß.", false, 5]] },
  { title: "Покана за рожден ден", ic: "🎂", lines: [
    ["Mia", "Hast du am Freitag Zeit? Ich habe Geburtstag!", "Имаш ли време в петък? Имам рожден ден!"], ["Jonas", "Herzlichen Glückwunsch! Wann ist die Party?", "Честит рожден ден! Кога е партито?"],
    ["Mia", "Um sieben Uhr bei mir zu Hause.", "В седем часа у нас."], ["Jonas", "Super, ich komme gern. Was soll ich mitbringen?", "Супер, идвам с удоволствие. Какво да донеса?"],
    ["Mia", "Vielleicht einen Salat.", "Може би салата."], ["Jonas", "Gut, ich mache einen Kartoffelsalat.", "Добре, ще направя картофена салата."]],
    qs: [["Mia hat am Freitag Geburtstag.", true, 0], ["Die Party ist im Restaurant.", false, 2], ["Jonas kommt nicht.", false, 3], ["Jonas bringt einen Salat mit.", true, 5]] },
  { title: "Планове за уикенда", ic: "🏞️", lines: [
    ["Ben", "Was machst du am Wochenende?", "Какво правиш през уикенда?"], ["Sara", "Am Samstag wandere ich im Gebirge.", "В събота ходя на поход в планината."],
    ["Ben", "Toll! Und am Sonntag?", "Страхотно! А в неделя?"], ["Sara", "Am Sonntag bleibe ich zu Hause und lese ein Buch. Und du?", "В неделя оставам вкъщи и чета книга. А ти?"],
    ["Ben", "Ich spiele am Samstag Fußball und besuche am Sonntag meine Eltern.", "В събота играя футбол, а в неделя ходя на гости на родителите си."]],
    qs: [["Sara wandert am Samstag.", true, 1], ["Am Sonntag geht Sara ins Kino.", false, 3], ["Ben spielt Fußball.", true, 4], ["Ben besucht am Samstag seine Eltern.", false, 4]] },
  { title: "Сметката в ресторанта", ic: "🍽️", lines: [
    ["Gast", "Die Rechnung, bitte!", "Сметката, моля!"], ["Kellnerin", "Zusammen oder getrennt?", "Заедно или поотделно?"],
    ["Gast", "Zusammen, bitte.", "Заедно, моля."], ["Kellnerin", "Das macht zweiundvierzig Euro.", "Това прави четиридесет и две евро."],
    ["Gast", "Fünfundvierzig, bitte. Stimmt so.", "Четиридесет и пет, моля. Задръжте рестото."], ["Kellnerin", "Vielen Dank! Einen schönen Abend noch!", "Много благодаря! Приятна вечер!"]],
    qs: [["Die Gäste zahlen getrennt.", false, 2], ["Das Essen kostet zweiundvierzig Euro.", true, 3], ["Der Gast gibt drei Euro Trinkgeld.", true, 4], ["Es ist Morgen.", false, 5]] },
  { title: "В аптеката", ic: "💊", lines: [
    ["Apothekerin", "Guten Tag! Was kann ich für Sie tun?", "Добър ден! С какво мога да Ви помогна?"], ["Kunde", "Ich habe Husten. Haben Sie etwas gegen Husten?", "Имам кашлица. Имате ли нещо против кашлица?"],
    ["Apothekerin", "Ja, dieser Saft hilft gut.", "Да, този сироп помага добре."], ["Kunde", "Wie oft muss ich ihn nehmen?", "Колко често трябва да го пия?"],
    ["Apothekerin", "Dreimal am Tag nach dem Essen.", "Три пъти на ден след ядене."], ["Kunde", "Danke. Was kostet er?", "Благодаря. Колко струва?"], ["Apothekerin", "Sieben Euro fünfzig.", "Седем евро и петдесет."]],
    qs: [["Der Mann hat Kopfschmerzen.", false, 1], ["Er bekommt einen Saft.", true, 2], ["Er nimmt ihn zweimal am Tag.", false, 4], ["Der Saft kostet sieben Euro fünfzig.", true, 6]] },
  { title: "В пощата", ic: "📮", lines: [
    ["Kundin", "Ich möchte diesen Brief nach Bulgarien schicken.", "Бих искала да изпратя това писмо до България."], ["Mitarbeiter", "Das kostet ein Euro zehn.", "Това струва едно евро и десет."],
    ["Kundin", "Und ich brauche auch fünf Briefmarken.", "И ми трябват също пет пощенски марки."], ["Mitarbeiter", "Hier, bitte. Zusammen sechs Euro.", "Ето, заповядайте. Общо шест евро."],
    ["Kundin", "Wie lange braucht der Brief?", "Колко време ще пътува писмото?"], ["Mitarbeiter", "Ungefähr vier Tage.", "Около четири дни."]],
    qs: [["Die Frau schickt einen Brief nach Bulgarien.", true, 0], ["Sie kauft zehn Briefmarken.", false, 2], ["Sie bezahlt sechs Euro.", true, 3], ["Der Brief braucht eine Woche.", false, 5]] },
  { title: "В библиотеката", ic: "📚", lines: [
    ["Student", "Entschuldigung, ich suche ein Wörterbuch Deutsch–Bulgarisch.", "Извинете, търся речник немско-български."], ["Bibliothekarin", "Die Wörterbücher stehen dort im Regal.", "Речниците са там на рафта."],
    ["Student", "Kann ich das Buch mit nach Hause nehmen?", "Мога ли да взема книгата вкъщи?"], ["Bibliothekarin", "Ja, für zwei Wochen. Haben Sie einen Ausweis?", "Да, за две седмици. Имате ли читателска карта?"],
    ["Student", "Nein, noch nicht.", "Не, още не."], ["Bibliothekarin", "Dann füllen Sie bitte dieses Formular aus.", "Тогава попълнете, моля, този формуляр."]],
    qs: [["Der Student sucht ein Wörterbuch.", true, 0], ["Er kann das Buch für zwei Wochen mitnehmen.", true, 3], ["Er hat schon einen Ausweis.", false, 4], ["Er muss ein Formular ausfüllen.", true, 5]] },
  { title: "Във фитнеса", ic: "🏋️", lines: [
    ["Trainer", "Hallo! Sind Sie zum ersten Mal hier?", "Здравейте! За първи път ли сте тук?"], ["Frau", "Ja. Ich möchte zweimal pro Woche trainieren.", "Да. Искам да тренирам два пъти седмично."],
    ["Trainer", "Gut. Machen Sie gern Yoga?", "Добре. Обичате ли йога?"], ["Frau", "Nein, lieber schwimme ich.", "Не, предпочитам да плувам."],
    ["Trainer", "Das Schwimmbad ist unten. Es ist täglich bis zweiundzwanzig Uhr geöffnet.", "Басейнът е долу. Отворен е всеки ден до двадесет и два часа."]],
    qs: [["Die Frau ist zum ersten Mal im Fitnesscenter.", true, 1], ["Sie möchte täglich trainieren.", false, 1], ["Sie macht gern Yoga.", false, 3], ["Das Schwimmbad schließt um zweiundzwanzig Uhr.", true, 4]] },
  { title: "Билети за кино", ic: "🎬", lines: [
    ["Kunde", "Zwei Karten für den Film um acht, bitte.", "Два билета за филма в осем, моля."], ["Kassiererin", "In welcher Reihe möchten Sie sitzen?", "На кой ред искате да седнете?"],
    ["Kunde", "Nicht zu weit vorne, bitte. Reihe zehn?", "Не много отпред, моля. Ред десет?"], ["Kassiererin", "Ja, das geht. Das macht zwanzig Euro.", "Да, може. Това прави двадесет евро."],
    ["Kunde", "Wie lange dauert der Film?", "Колко дълъг е филмът?"], ["Kassiererin", "Zwei Stunden.", "Два часа."]],
    qs: [["Der Mann kauft zwei Karten.", true, 0], ["Der Film beginnt um neun Uhr.", false, 0], ["Die Karten kosten zwanzig Euro.", true, 3], ["Der Film dauert drei Stunden.", false, 5]] },
  { title: "В таксито", ic: "🚕", lines: [
    ["Fahrer", "Guten Abend! Wohin möchten Sie?", "Добър вечер! Накъде желаете?"], ["Fahrgast", "Zum Flughafen, bitte. Ich habe es eilig.", "До летището, моля. Бързам."],
    ["Fahrer", "Wann fliegt Ihr Flugzeug?", "Кога лети самолетът Ви?"], ["Fahrgast", "Um zwanzig Uhr nach Sofia.", "В двадесет часа за София."],
    ["Fahrer", "Kein Problem, wir brauchen nur zwanzig Minuten.", "Няма проблем, трябват ни само двадесет минути."], ["Fahrgast", "Kann ich mit Karte bezahlen?", "Мога ли да платя с карта?"], ["Fahrer", "Ja, natürlich.", "Да, разбира се."]],
    qs: [["Der Mann fährt zum Bahnhof.", false, 1], ["Er fliegt nach Sofia.", true, 3], ["Die Fahrt dauert eine Stunde.", false, 4], ["Er kann mit Karte bezahlen.", true, 6]] },
  { title: "Разговор за времето", ic: "🌦️", lines: [
    ["Nachbar", "Was für ein Wetter heute!", "Какво време днес!"], ["Nachbarin", "Ja, es regnet seit Stunden. Und es ist so kalt!", "Да, вали от часове. И е толкова студено!"],
    ["Nachbar", "Morgen soll es schön werden. Die Sonne kommt.", "Утре трябва да е хубаво. Ще излезе слънцето."], ["Nachbarin", "Hoffentlich! Am Wochenende möchte ich im Garten arbeiten.", "Дано! През уикенда искам да работя в градината."],
    ["Nachbar", "Ich auch. Dann trinken wir danach zusammen Kaffee?", "И аз. Тогава после да пием заедно кафе?"], ["Nachbarin", "Gern!", "С удоволствие!"]],
    qs: [["Heute regnet es.", true, 1], ["Heute ist es warm.", false, 1], ["Morgen kommt die Sonne.", true, 2], ["Die Nachbarin möchte am Wochenende im Garten arbeiten.", true, 3]] },
  { title: "Моето семейство", ic: "👨‍👩‍👧", lines: [
    ["Emma", "Ist das ein Foto von deiner Familie?", "Това снимка на семейството ти ли е?"], ["Leo", "Ja. Das sind meine Eltern. Mein Vater ist Arzt und meine Mutter ist Lehrerin.", "Да. Това са родителите ми. Баща ми е лекар, а майка ми е учителка."],
    ["Emma", "Und wer ist das?", "А това кой е?"], ["Leo", "Das ist meine Schwester Lena. Sie ist zwanzig und studiert in Wien.", "Това е сестра ми Лена. На двадесет е и следва във Виена."],
    ["Emma", "Hast du auch einen Bruder?", "Имаш ли и брат?"], ["Leo", "Nein, ich habe keinen Bruder.", "Не, нямам брат."]],
    qs: [["Leos Vater ist Lehrer.", false, 1], ["Leos Mutter ist Lehrerin.", true, 1], ["Lena studiert in Wien.", true, 3], ["Leo hat einen Bruder.", false, 5]] },
  { title: "Изгубеният ключ", ic: "🔑", lines: [
    ["Tim", "Oh nein! Wo ist mein Schlüssel?", "О, не! Къде ми е ключът?"], ["Julia", "Vielleicht ist er in deiner Tasche?", "Може би е в чантата ти?"],
    ["Tim", "Nein, da ist er nicht. Und auf dem Tisch ist er auch nicht.", "Не, там не е. И на масата също не е."], ["Julia", "Hast du ihn im Auto vergessen?", "Да не си го забравил в колата?"],
    ["Tim", "Ja, genau! Er ist im Auto. Danke!", "Да, точно! В колата е. Благодаря!"]],
    qs: [["Tim sucht seinen Schlüssel.", true, 0], ["Der Schlüssel ist in der Tasche.", false, 2], ["Der Schlüssel ist auf dem Tisch.", false, 2], ["Der Schlüssel ist im Auto.", true, 4]] },
  { title: "Първи ден в курса", ic: "🏫", lines: [
    ["Lehrerin", "Willkommen im Deutschkurs! Wie heißt du?", "Добре дошли в курса по немски! Как се казваш?"], ["Elena", "Ich heiße Elena. Ich komme aus Spanien.", "Казвам се Елена. От Испания съм."],
    ["Lehrerin", "Warum lernst du Deutsch?", "Защо учиш немски?"], ["Elena", "Ich möchte in Deutschland arbeiten. Ich bin Krankenschwester.", "Искам да работя в Германия. Медицинска сестра съм."],
    ["Lehrerin", "Toll! Der Kurs ist montags und mittwochs von neun bis zwölf Uhr.", "Страхотно! Курсът е в понеделник и сряда от девет до дванадесет."]],
    qs: [["Elena kommt aus Italien.", false, 1], ["Sie möchte in Deutschland arbeiten.", true, 3], ["Elena ist Lehrerin.", false, 3], ["Der Kurs ist montags und mittwochs.", true, 4]] },
  { title: "Съседът", ic: "🏘️", lines: [
    ["Herr Wolf", "Guten Tag! Ich bin Ihr neuer Nachbar, Thomas Wolf.", "Добър ден! Аз съм новият Ви съсед, Томас Волф."], ["Frau Klein", "Hallo, Herr Wolf! Herzlich willkommen. Wohnen Sie allein?", "Здравейте, господин Волф! Добре дошли. Сам ли живеете?"],
    ["Herr Wolf", "Nein, mit meiner Frau und zwei Kindern.", "Не, със съпругата ми и двете ни деца."], ["Frau Klein", "Schön! Möchten Sie am Sonntag zum Kaffee kommen?", "Чудесно! Искате ли да дойдете в неделя на кафе?"],
    ["Herr Wolf", "Sehr gern! Um wie viel Uhr?", "С голямо удоволствие! В колко часа?"], ["Frau Klein", "Um drei Uhr.", "В три часа."]],
    qs: [["Herr Wolf ist neu im Haus.", true, 0], ["Er wohnt allein.", false, 2], ["Er hat zwei Kinder.", true, 2], ["Der Kaffee ist am Samstag.", false, 3]] },
];
// добави към DIALOGS (за „Диалози: вярно/невярно“)
DIALOGS.push(...DIALOGS2.map((d) => ({ title: `${d.ic} ${d.title}`, lines: d.lines, qs: d.qs })));

// ── Коя реплика липсва?
function genDlgFill() {
  const d = rnd(DIALOGS2), k = 1 + ((Math.random() * (d.lines.length - 1)) | 0), right = d.lines[k];
  const others = shuffle(DIALOGS2.filter((x) => x !== d).flatMap((x) => x.lines)).filter((l) => l[1] !== right[1]).slice(0, 2);
  const html = d.lines.map(([who, de, bg], i) => i === k ? `<div class="dl dlgap"><b>${esc(who)}:</b> <span class="blank">???</span></div>` : `<div class="dl"><b>${esc(who)}:</b> ${esc(de)}</div>`).join("");
  return { kind: "mc", task: `${d.ic} ${esc(d.title)}: коя реплика липсва?`, prompt: `<div class="dlg">${html}</div>`, options: shuffle([right[1], ...others.map((l) => l[1])]), answer: right[1], say: right[1], full: right[1], bg: right[2], keys: true,
    explain: `Липсваше: <b>${esc(right[1])}</b> — „${esc(right[2])}“. Тя отговаря на предишната реплика: <i>${esc(d.lines[k - 1][1])}</i>` };
}
// ── Подреди диалога
function genDlgOrder() {
  const d = rnd(DIALOGS2), st = (Math.random() * Math.max(1, d.lines.length - 3)) | 0, part = d.lines.slice(st, st + 4);
  const toks = part.map((l) => `${l[0]}: ${l[1]}`);
  let sh = shuffle(toks); for (let n = 0; n < 6 && sh.join("|") === toks.join("|"); n++) sh = shuffle(toks);
  return { kind: "order", lines: true, task: `${d.ic} ${esc(d.title)}: подреди репликите`, prompt: `<div class="meta">Цъкни репликите в правилния ред</div>`, toks, sh, answer: toks.join(" → "), say: part.map((l) => l[1]).join(" "),
    explain: part.map((l) => `<div class="dl"><b>${esc(l[0])}:</b> ${esc(l[1])} <span class="muted">— ${esc(l[2])}</span></div>`).join("") };
}
EX_TYPES.push(
  { k: "dlgfill", skill: "Четене и слушане", ic: "🧩", t: "Коя реплика липсва?", d: "24 ситуации: пекарна, лекар, гара, пазаруване…", gen: genDlgFill },
  { k: "dlgorder", skill: "Четене и слушане", ic: "🔀", t: "Подреди диалога", d: "Сглоби разговора в правилния ред", gen: genDlgOrder },
);

// урок 10 (Kapitel 3, A26–A27): обаждане в музея и имейлът на Петер
const DIALOGS3 = [
  { title: "Обаждане в музея", ic: "🏛️", lines: [
    ["Besucher", "Ja, guten Tag. Ich habe eine Frage. Wann hat das Stadtmuseum geöffnet?", "Да, добър ден. Имам въпрос. Кога е отворен Градският музей?"],
    ["Museum", "Das Stadtmuseum hat von 10 bis 18 Uhr geöffnet.", "Градският музей е отворен от 10 до 18 часа."],
    ["Besucher", "Haben Sie immer geöffnet, von Montag bis Sonntag?", "Винаги ли сте отворени, от понеделник до неделя?"],
    ["Museum", "Nein, am Montag ist das Museum geschlossen.", "Не, в понеделник музеят е затворен."],
    ["Besucher", "Und wie viel kostet eine Eintrittskarte?", "А колко струва един входен билет?"],
    ["Museum", "Eine Eintrittskarte kostet 2,50 Euro. Sonntags ist der Eintritt frei.", "Един билет струва 2,50 евро. В неделя входът е свободен."],
    ["Besucher", "Kann ich mit Kreditkarte bezahlen?", "Мога ли да платя с кредитна карта?"],
    ["Museum", "Nein, wir nehmen nur Bargeld.", "Не, приемаме само пари в брой."],
    ["Besucher", "Gut. Danke für die Auskunft. Auf Wiederhören!", "Добре. Благодаря за информацията. Довиждане!"]],
    qs: [["Das Museum hat bis 18 Uhr geöffnet.", true, 1], ["Am Montag ist das Museum geöffnet.", false, 3], ["Sonntags kostet der Eintritt nichts.", true, 5], ["Man kann mit Kreditkarte bezahlen.", false, 7]] },
  { title: "Имейл от Мюнхен", ic: "✉️", lines: [
    ["Peter", "Liebe Klara, viele Grüße aus München.", "Мила Клара, много поздрави от Мюнхен."],
    ["Peter", "Mein Hotel liegt im Zentrum. Das Hotelzimmer ist sehr groß.", "Хотелът ми се намира в центъра. Хотелската стая е много голяма."],
    ["Peter", "Es hat einen Fernseher und zum Glück einen Internetanschluss.", "Има телевизор и за щастие интернет връзка."],
    ["Peter", "Heute Abend um 20 Uhr gibt das Orchester ein Konzert und ich spiele, wie immer, Klavier.", "Довечера в 20 часа оркестърът изнася концерт и аз, както винаги, свиря на пиано."],
    ["Peter", "Aber bis 20 Uhr habe ich noch etwas Zeit. Ich möchte das Deutsche Museum besuchen.", "Но до 20 часа имам още малко време. Искам да посетя Германския музей."],
    ["Peter", "Vielleicht mache ich auch noch einen Spaziergang und trinke ein Bier. Aber nur ein Bier!", "Може би ще се разходя и ще изпия една бира. Но само една!"],
    ["Peter", "Liebe Grüße, dein Peter", "Сърдечни поздрави, твой Петер"]],
    qs: [["Peters Hotel liegt im Zentrum.", true, 1], ["Das Hotelzimmer ist klein.", false, 1], ["Peter spielt heute Abend Gitarre.", false, 3], ["Peter möchte ein Museum besuchen.", true, 4], ["Peter trinkt drei Bier.", false, 5]] },
];
DIALOGS.push(...DIALOGS3.map((d) => ({ title: `${d.ic} ${d.title}`, lines: d.lines, qs: d.qs })));
