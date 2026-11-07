// Граматика — кратки и ясни обяснения по темите от курса.
const GRAMMAR = [
  {
    id: "articles", title: "Род и членове", icon: "◐",
    html: `
<p>Всяко съществително има род. <b>Учи думата винаги заедно с члена!</b> Цветовете в приложението са навсякъде еднакви:</p>
<table class="g"><tr><th></th><th>определен</th><th>неопределен</th><th>пример</th></tr>
<tr><td><span class="art der">der</span> мъжки</td><td>der</td><td>ein</td><td>der Vater – ein Vater</td></tr>
<tr><td><span class="art die">die</span> женски</td><td>die</td><td>eine</td><td>die Stadt – eine Stadt</td></tr>
<tr><td><span class="art das">das</span> среден</td><td>das</td><td>ein</td><td>das Land – ein Land</td></tr>
<tr><td><span class="art pl">die</span> мн.ч.</td><td>die</td><td>—</td><td>die Kinder</td></tr></table>
<h4>Правила, които спестяват време</h4>
<ul>
<li><b>-ung</b> → винаги <span class="art die">die</span>: die Wohnung, die Zeichnung, die Endung</li>
<li><b>-in</b> (женска професия) → <span class="art die">die</span>, мн.ч. <b>-innen</b>: die Lehrerin → die Lehrerinnen</li>
<li><b>-ei</b>, <b>-ik</b>, <b>-ie</b> → обикновено <span class="art die">die</span>: die Polizei, die Musik, die Familie</li>
<li>Сложни думи взимат рода на <b>последната</b> дума: das Haus + <span class="art die">die</span> Frau → <b>die</b> Hausfrau; der Fuß + der Ball → <b>der</b> Fußball</li>
<li>Мн.ч. винаги е <span class="art pl">die</span>, без значение от рода.</li>
</ul>
<h4>Отрицание: kein / keine</h4>
<p>Пред съществително „не“ е <b>kein</b> (der/das) или <b>keine</b> (die, мн.ч.): <i>Ich habe <b>keine</b> Geschwister. <b>Keine</b> Fragen.</i></p>`
  },
  {
    id: "pronouns", title: "Местоимения и притежание", icon: "👤",
    html: `
<p>Притежателното местоимение взима <b>-e</b>, когато думата след него е <span class="art die">die</span> или мн.ч.:
<i>mein Kind</i> (das), <i>mein<b>e</b> Freundin</i> (die).</p>
<table class="g"><tr><th>лично</th><th>значение</th><th>der / das</th><th>die / мн.ч.</th><th>значение</th></tr>
<tr><td>ich</td><td>аз</td><td>mein</td><td>meine</td><td>мой</td></tr>
<tr><td>du</td><td>ти</td><td>dein</td><td>deine</td><td>твой</td></tr>
<tr><td>er</td><td>той</td><td>sein</td><td>seine</td><td>негов</td></tr>
<tr><td>sie</td><td>тя</td><td>ihr</td><td>ihre</td><td>неин</td></tr>
<tr><td>es</td><td>то</td><td>sein</td><td>seine</td><td>негов (на него)</td></tr>
<tr><td>wir</td><td>ние</td><td>unser</td><td>unsere</td><td>наш</td></tr>
<tr><td>ihr</td><td>вие (вие двамата, приятели)</td><td>euer</td><td>eure</td><td>ваш</td></tr>
<tr><td>sie</td><td>те</td><td>ihr</td><td>ihre</td><td>техен</td></tr>
<tr><td><b>Sie</b></td><td>Вие (учтиво)</td><td>Ihr</td><td>Ihre</td><td>Ваш</td></tr></table>
<p class="tip">💡 <b>Sie</b> (учтиво) винаги е с главна буква — също и <b>Ihr</b>: <i>Wie ist Ihr Name?</i></p>
<p class="tip">💡 <b>euer → eure</b> (губи e-то).</p>`
  },
  {
    id: "verbs", title: "Глаголи в сегашно време", icon: "⚙",
    html: `
<p>Махни <b>-en</b> от инфинитива → получаваш основата. Добави окончанията:</p>
<table class="g"><tr><th>лице</th><th>окончание</th><th>wohnen</th><th>arbeiten</th><th>heißen</th></tr>
<tr><td>ich</td><td><b>-e</b></td><td>wohn<b>e</b></td><td>arbeit<b>e</b></td><td>heiß<b>e</b></td></tr>
<tr><td>du</td><td><b>-st</b></td><td>wohn<b>st</b></td><td>arbeit<b>est</b></td><td>heiß<b>t</b></td></tr>
<tr><td>er/sie/es</td><td><b>-t</b></td><td>wohn<b>t</b></td><td>arbeit<b>et</b></td><td>heiß<b>t</b></td></tr>
<tr><td>wir</td><td><b>-en</b></td><td>wohn<b>en</b></td><td>arbeit<b>en</b></td><td>heiß<b>en</b></td></tr>
<tr><td>ihr</td><td><b>-t</b></td><td>wohn<b>t</b></td><td>arbeit<b>et</b></td><td>heiß<b>t</b></td></tr>
<tr><td>sie/Sie</td><td><b>-en</b></td><td>wohn<b>en</b></td><td>arbeit<b>en</b></td><td>heiß<b>en</b></td></tr></table>
<p class="tip">🔑 <b>wir</b> и <b>sie/Sie</b> = винаги като инфинитива.</p>
<h4>Специални случаи</h4>
<ul>
<li>Основа на <b>-t / -d / -chn</b> → добавя <b>-e-</b>: du arbeit<b>e</b>st, er find<b>e</b>t, er zeichn<b>e</b>t</li>
<li>Основа на <b>-s / -ß / -z / -ss</b> → при du само <b>-t</b>: du heißt, du passt, du ergänzt</li>
<li><b>-eln</b> → при ich губи e: ich lächle, ich sammle</li>
<li>Смяна на гласна (само при <b>du</b> и <b>er/sie/es</b>!):
  <br><b>e → i</b>: sprechen → du spr<b>i</b>chst, er spr<b>i</b>cht
  <br><b>e → ie</b>: lesen → du l<b>ie</b>st, er l<b>ie</b>st</li>
</ul>
<h4>Неправилни — наизуст</h4>
<table class="g"><tr><th></th><th>sein (съм)</th><th>haben (имам)</th><th>wissen (знам)</th></tr>
<tr><td>ich</td><td>bin</td><td>habe</td><td>weiß</td></tr>
<tr><td>du</td><td>bist</td><td>hast</td><td>weißt</td></tr>
<tr><td>er/sie/es</td><td>ist</td><td>hat</td><td>weiß</td></tr>
<tr><td>wir</td><td>sind</td><td>haben</td><td>wissen</td></tr>
<tr><td>ihr</td><td>seid</td><td>habt</td><td>wisst</td></tr>
<tr><td>sie/Sie</td><td>sind</td><td>haben</td><td>wissen</td></tr></table>
<h4>Словоред</h4>
<p>Глаголът е <b>винаги на 2-ро място</b> в изречението: <i>Ich <b>wohne</b> in Sofia. Jetzt <b>lerne</b> ich Deutsch.</i><br>
Във въпрос с да/не — на 1-во място: <i><b>Haben</b> Sie Geschwister?</i><br>
Разделими глаголи — представката отива накрая: <i>Ich <b>stelle</b> mich <b>vor</b>.</i></p>`
  },
  {
    id: "sentence", title: "Как се строи изречение", icon: "🧱",
    html: `
<p>Едно правило решава 80% от словореда: <b>глаголът е винаги втори</b>. Като влак, в който глаголът е винаги вторият вагон.</p>
<table class="g"><tr><th>1-во място</th><th>2-ро — ГЛАГОЛ</th><th>останалото</th></tr>
<tr><td>Ich</td><td><b>lerne</b></td><td>heute Deutsch.</td></tr>
<tr><td>Heute</td><td><b>lerne</b></td><td>ich Deutsch.</td></tr>
<tr><td>Deutsch</td><td><b>lerne</b></td><td>ich heute.</td></tr>
<tr><td>Wo</td><td><b>wohnst</b></td><td>du?</td></tr></table>
<p>Ако започнеш с нещо друго (heute, hier, im Mai…), подлогът (ich) <b>минава след</b> глагола.</p>
<h4>Въпрос „да / не“</h4>
<p>Глаголът отива <b>най-отпред</b>: <i><b>Sprichst</b> du Deutsch?</i> · <i><b>Haben</b> Sie Geschwister?</i></p>
<h4>Заповед / молба (както в учебника)</h4>
<p>Глаголът отпред + <b>Sie</b>: <i><b>Kommen</b> Sie!</i> = Елате! · <i><b>Lesen</b> Sie den Text.</i> = Прочетете текста.</p>
<h4>Два глагола в изречението</h4>
<p>Първият е на 2-ро място, вторият отива <b>най-накрая</b> (в речникова форма): <i>Ich <b>kann</b> gut Deutsch <b>sprechen</b>.</i></p>`
  },
  {
    id: "kein", title: "kein или nicht?", icon: "🚫",
    html: `
<p>И двете значат „не“. Изборът е лесен:</p>
<table class="g"><tr><th>Кога</th><th>Използвай</th><th>Пример</th></tr>
<tr><td>пред съществително с <b>ein / eine</b> или без член</td><td><b>kein / keine</b></td><td>Das ist <b>kein</b> Computer. · Ich habe <b>keine</b> Zeit.</td></tr>
<tr><td>всичко останало (глагол, прилагателно, „der/die/das“)</td><td><b>nicht</b></td><td>Ich rauche <b>nicht</b>. · Das ist <b>nicht</b> teuer. · Das ist <b>nicht</b> das Regal.</td></tr></table>
<p class="tip">💡 Трик: <b>kein = k + ein</b>. Където би казал <i>ein</i>, за „не“ казваш <i>kein</i>.</p>
<table class="g"><tr><th></th><th>има</th><th>няма</th></tr>
<tr><td><span class="art der">der</span></td><td>ein Stuhl</td><td><b>kein</b> Stuhl</td></tr>
<tr><td><span class="art die">die</span></td><td>eine Lampe</td><td><b>keine</b> Lampe</td></tr>
<tr><td><span class="art das">das</span></td><td>ein Regal</td><td><b>kein</b> Regal</td></tr>
<tr><td><span class="art pl">мн.ч.</span></td><td>Bücher <span style="color:var(--muted)">(няма „ein“ за много)</span></td><td><b>keine</b> Bücher</td></tr></table>
<p><i>Das ist ein Computer.</i> → <i>Das ist <b>kein</b> Computer.</i><br><i>Das sind Bücher.</i> → <i>Das sind <b>keine</b> Bücher.</i></p>`
  },
  {
    id: "modal", title: "Модални глаголи", icon: "🎛",
    html: `
<p>Те казват <b>отношението</b> към действието: мога ли, искам ли, трябва ли. Почти винаги идват с <b>втори глагол</b>, който отива <b>в края</b> без промяна.</p>
<p><i>Ich <b>kann</b> Deutsch <b>sprechen</b>.</i> = Мога да говоря немски.<br><i><b>Darf</b> ich hier <b>sitzen</b>?</i> = Може ли да седна тук?</p>
<table class="g"><tr><th></th><th>können<br><small>мога</small></th><th>dürfen<br><small>разрешено ми е</small></th><th>müssen<br><small>трябва</small></th><th>wollen<br><small>искам</small></th><th>sollen<br><small>трябва (казват ми)</small></th><th>möchten<br><small>бих искал</small></th></tr>
<tr><td>ich</td><td><b>kann</b></td><td><b>darf</b></td><td><b>muss</b></td><td><b>will</b></td><td>soll</td><td>möchte</td></tr>
<tr><td>du</td><td>kannst</td><td>darfst</td><td>musst</td><td>willst</td><td>sollst</td><td>möchtest</td></tr>
<tr><td>er/sie/es</td><td><b>kann</b></td><td><b>darf</b></td><td><b>muss</b></td><td><b>will</b></td><td>soll</td><td>möchte</td></tr>
<tr><td>wir</td><td>können</td><td>dürfen</td><td>müssen</td><td>wollen</td><td>sollen</td><td>möchten</td></tr>
<tr><td>ihr</td><td>könnt</td><td>dürft</td><td>müsst</td><td>wollt</td><td>sollt</td><td>möchtet</td></tr>
<tr><td>sie/Sie</td><td>können</td><td>dürfen</td><td>müssen</td><td>wollen</td><td>sollen</td><td>möchten</td></tr></table>
<p class="tip">🔑 Двете неща за запомняне: (1) <b>ich = er</b>, и двете без окончание: ich kann, er kann. (2) При ich/du/er гласната често се сменя: k<b>ö</b>nnen → k<b>a</b>nn, m<b>ü</b>ssen → m<b>u</b>ss.</p>
<h4>Капани</h4>
<ul>
<li><b>ich will</b> = искам, а <b>не</b> „ще“!</li>
<li><b>möchten</b> е учтивото „искам“ — в магазин, кафене: <i>Ich möchte einen Kaffee.</i></li>
<li><b>müssen</b> = необходимо е (аз решавам); <b>sollen</b> = някой друг ми казва: <i>Der Arzt sagt, ich soll nicht rauchen.</i></li>
<li><b>dürfen</b> = позволено е: <i>Hier darf man nicht rauchen.</i> = Тук не се пуши.</li>
</ul>`
  },
  {
    id: "adjectives", title: "Прилагателни: описване", icon: "🎨",
    html: `
<p>Прилагателното казва <b>какво е</b> нещо. Най-лесният случай — след <b>ist / sind</b>: прилагателното <b>не се променя</b> (не като в българския!):</p>
<p><i>Der Stuhl ist <b>bequem</b>. · Die Lampe ist <b>bequem</b>. · Die Stühle sind <b>bequem</b>.</i> — винаги „bequem“.</p>
<h4>Двойки противоположности</h4>
<table class="g"><tr><th>+</th><th>−</th></tr>
<tr><td>teuer — скъп</td><td>billig — евтин <small>(preiswert = изгоден)</small></td></tr>
<tr><td>hell — светъл</td><td>dunkel — тъмен</td></tr>
<tr><td>bequem — удобен</td><td>unbequem — неудобен</td></tr>
<tr><td>schön — хубав</td><td>hässlich — грозен</td></tr>
<tr><td>neu — нов</td><td>alt — стар</td></tr>
<tr><td>groß — голям</td><td>klein — малък</td></tr>
<tr><td>interessant — интересен</td><td>langweilig — скучен</td></tr>
<tr><td>modern — модерен</td><td>kaputt — счупен</td></tr></table>
<p class="tip">💡 <b>un-</b> = „не-“: bequem → <b>un</b>bequem.</p>
<h4>По-скъп, по-тъмен</h4>
<p>+ <b>-er</b>: klein → klein<b>er</b>. Прилагателните на <b>-er/-el</b> губят e: teu<b>er</b> → teu<b>rer</b>, dunk<b>el</b> → dunk<b>ler</b>.</p>
<h4>Пред съществително (за сега само да го разпознаваш)</h4>
<p>Тогава получава окончание: <i>ein neu<b>er</b> Drucker</i> (der) · <i>ein klein<b>es</b> Problem</i> (das) · <i>eine schön<b>e</b> Lampe</i> (die). Окончанието „показва“ рода.</p>`
  },
  {
    id: "classroom", title: "Инструкции в учебника", icon: "📝",
    html: `
<p>Тези изречения ще видиш във всяко упражнение. Всички са молби с <b>Sie</b> — глаголът е отпред.</p>
<table class="g"><tr><th>Немски</th><th>Какво искат от теб</th></tr>
<tr><td><i>Lesen Sie.</i></td><td>Прочетете.</td></tr>
<tr><td><i>Hören Sie.</i></td><td>Слушайте.</td></tr>
<tr><td><i>Ergänzen Sie.</i></td><td>Допълнете (празните места).</td></tr>
<tr><td><i>Ordnen Sie zu.</i></td><td>Свържете / подредете (кое с кое).</td></tr>
<tr><td><i>Kreuzen Sie an.</i></td><td>Отбележете с ×.</td></tr>
<tr><td><i>Bilden Sie Sätze.</i></td><td>Съставете изречения.</td></tr>
<tr><td><i>Beschreiben Sie.</i></td><td>Опишете.</td></tr>
<tr><td><i>Verbinden Sie.</i></td><td>Свържете.</td></tr>
<tr><td><i>Fragen Sie.</i></td><td>Попитайте.</td></tr>
<tr><td><i>Wiederholen Sie.</i></td><td>Повторете.</td></tr>
<tr><td><i>Schreiben Sie.</i></td><td>Напишете.</td></tr></table>`
  },
  {
    id: "conj", title: "Свързване: und, aber, denn, weil", icon: "🔗",
    html: `
<p>Тези малки думи слепват две изречения. Важното е само едно: <b>какво става с глагола след тях</b>.</p>
<h4>Група 1: „нулево място“ — нищо не се променя</h4>
<p><b>und</b> (и) · <b>oder</b> (или) · <b>aber</b> (но) · <b>sondern</b> (а) · <b>denn</b> (защото)</p>
<p>Те стоят „извън“ изречението (на място 0). След тях продължаваш <b>както обикновено</b>: подлог → глагол.</p>
<table class="g"><tr><th>изречение 1</th><th>съюз</th><th>изречение 2 (нормален ред)</th></tr>
<tr><td>Ich arbeite heute</td><td><b>oder</b></td><td>ich <b>mache</b> Sport.</td></tr>
<tr><td>Ich lerne gern Deutsch,</td><td><b>aber</b></td><td>ich <b>höre</b> lieber Musik.</td></tr>
<tr><td>Ich lerne nicht Deutsch,</td><td><b>sondern</b></td><td>Englisch.</td></tr>
<tr><td>Ich lerne nicht Deutsch,</td><td><b>denn</b></td><td>ich <b>wohne</b> in England.</td></tr></table>
<p class="tip">💡 Мнемоника: <b>ADUSO</b> — <b>A</b>ber, <b>D</b>enn, <b>U</b>nd, <b>S</b>ondern, <b>O</b>der = не пипат словореда.</p>
<h4>Група 2: weil — глаголът бяга НАКРАЯ</h4>
<p><b>weil</b> също значи „защото“, но изпраща глагола <b>в самия край</b> на изречението:</p>
<table class="g"><tr><th></th><th>пример</th></tr>
<tr><td>denn</td><td>…, denn ich <b>wohne</b> in England.</td></tr>
<tr><td>weil</td><td>…, weil ich in England <b>wohne</b>.</td></tr></table>
<p>Значението е <b>едно и също</b> — разликата е само къде е глаголът. Ако се съмняваш, казвай <b>denn</b> — по-лесно е.</p>
<h4>aber или sondern?</h4>
<p><b>sondern</b> = „а“, но <b>само след отрицание</b> (nicht / kein): <i>Ich trinke <b>nicht</b> Kaffee, <b>sondern</b> Tee.</i><br>
<b>aber</b> = „но“ — навсякъде другаде: <i>Der Kaffee ist gut, <b>aber</b> teuer.</i></p>`
  },
  {
    id: "where", title: "Къде? Накъде? (nach, zu)", icon: "🧭",
    html: `
<table class="g"><tr><th>Въпрос</th><th>Отговор</th><th>Пример</th></tr>
<tr><td><b>Wo?</b> Къде съм?</td><td><b>zu Hause</b></td><td>Ich bin <b>zu Hause</b>. — Вкъщи съм.</td></tr>
<tr><td><b>Wohin?</b> Накъде отивам?</td><td><b>nach Hause</b></td><td>Ich gehe <b>nach Hause</b>. — Прибирам се.</td></tr>
<tr><td>Wohin? (град, държава)</td><td><b>nach</b> + име</td><td>Ich fahre <b>nach</b> München / <b>nach</b> Bulgarien.</td></tr>
<tr><td>Wohin? (човек, място, сграда)</td><td><b>zu</b> → zum / zur</td><td>Ich gehe <b>zum</b> Arzt. · Ich gehe <b>zur</b> Apotheke.</td></tr></table>
<p class="tip">💡 <b>zum</b> = zu + dem (за <span class="art der">der</span> и <span class="art das">das</span>) · <b>zur</b> = zu + der (за <span class="art die">die</span>). Пак родът решава!</p>
<p class="tip">💡 Капан: „Haus“ е с <b>e</b> накрая само в тези изрази: zu Haus<b>e</b>, nach Haus<b>e</b>.</p>
<h4>gehen или fahren?</h4>
<p><b>gehen</b> = пеша · <b>fahren</b> = с превозно средство (кола, влак, колело, ски!): <i>Ich <b>fahre</b> Fahrrad. Ich <b>fahre</b> Ski.</i></p>
<h4>Дни: am</h4>
<p><b>am</b> + ден: <i>am Montag, am Freitag, am Wochenende</i>. Всички дни са <span class="art der">der</span>.<br>
<b>Sonnabend</b> = Samstag (казват го в Северна Германия). <b>Donnerstag</b> идва от <i>der Donner</i> (гръм) — денят на бога на гръмотевиците.</p>`
  },
  {
    id: "moegen", title: "mögen и möchten", icon: "❤️",
    html: `
<table class="g"><tr><th></th><th>mögen — харесвам</th><th>möchten — бих искал</th></tr>
<tr><td>ich</td><td><b>mag</b></td><td><b>möchte</b></td></tr>
<tr><td>du</td><td>magst</td><td>möchtest</td></tr>
<tr><td>er/sie/es</td><td><b>mag</b></td><td><b>möchte</b></td></tr>
<tr><td>wir</td><td>mögen</td><td>möchten</td></tr>
<tr><td>ihr</td><td>mögt</td><td>möchtet</td></tr>
<tr><td>sie/Sie</td><td>mögen</td><td>möchten</td></tr></table>
<ul>
<li><b>mögen</b> = харесвам нещо по принцип: <i>Ich <b>mag</b> Kaffee.</i> (обичам кафе)</li>
<li><b>möchten</b> = искам нещо сега, учтиво: <i>Ich <b>möchte</b> einen Kaffee.</i> (едно кафе, моля)</li>
<li><b>mochte</b> = харесвах (минало време на mögen) — засега само да го разпознаваш.</li>
</ul>
<p class="tip">💡 Хобита: <b>gern</b> + глагол е най-естественото: <i>Ich schwimme <b>gern</b>.</i> = Обичам да плувам. <i>Ich koche <b>nicht gern</b>.</i> = Не обичам да готвя.</p>`
  },
  {
    id: "akk", title: "Nominativ и Akkusativ", icon: "🎯",
    html: `
<p>Звучи страшно, но правилото е <b>едно</b>. В изречението има <b>кой прави</b> (Nominativ) и <b>какво/кого засяга</b> (Akkusativ).</p>
<table class="g"><tr><th></th><th>Въпрос</th><th>Пример</th></tr>
<tr><td><b>Nominativ</b><br><small>подлог — кой действа</small></td><td><b>Wer?</b> кой · <b>Was?</b> какво</td><td><b>Der Mann</b> trinkt Wasser. → <i>Wer trinkt Wasser?</i></td></tr>
<tr><td><b>Akkusativ</b><br><small>пряко допълнение</small></td><td><b>Wen?</b> кого · <b>Was?</b> какво</td><td>Ich trinke <b>einen Kaffee</b>. → <i>Was trinkst du?</i></td></tr></table>
<h4>Какво се сменя? САМО мъжкият род!</h4>
<table class="g"><tr><th></th><th><span class="art der">der</span></th><th><span class="art die">die</span></th><th><span class="art das">das</span></th><th><span class="art pl">мн.ч.</span></th></tr>
<tr><td>Nominativ</td><td>der · ein · kein · mein</td><td>die · eine</td><td>das · ein</td><td>die · keine</td></tr>
<tr><td><b>Akkusativ</b></td><td><b>den · einen · keinen · meinen</b></td><td>die · eine <small>(същото)</small></td><td>das · ein <small>(същото)</small></td><td>die · keine <small>(същото)</small></td></tr></table>
<p class="tip">🔑 Трик: в Akkusativ мъжкият род получава <b>-n</b>: der → de<b>n</b>, ein → eine<b>n</b>, kein → keine<b>n</b>, mein → meine<b>n</b>. Всичко останало — без промяна.</p>
<p><i>Der Kaffee ist warm.</i> (Nom.) → <i>Ich trinke <b>den</b> Kaffee.</i> (Akk.)<br>
<i>Die Zeitung ist neu.</i> → <i>Ich lese <b>die</b> Zeitung.</i> (без промяна)<br>
<i>Das Buch ist spannend.</i> → <i>Ich lese <b>das</b> Buch.</i> (без промяна)</p>
<h4>Как да позная, че е Akkusativ?</h4>
<p>Повечето глаголи искат „какво?“: <b>haben, nehmen, kennen, trinken, essen, lesen, schreiben, suchen, brauchen, bezahlen, besuchen, finden, sehen, kaufen, möchten, es gibt</b> → след тях идва Akkusativ. Учебникът казва: <b>„Das Verb regiert im Satz“</b> — глаголът решава падежа.</p>
<p><i>Ich habe <b>einen</b> Bruder. · Wir suchen <b>einen</b> Drucker. · Es gibt <b>keinen</b> Kaffee. · Ich finde <b>den</b> Roman langweilig.</i></p>
<h4>Изключение: sein, werden, bleiben</h4>
<p>След тях <b>няма</b> Akkusativ — двете страни са „едно и също нещо“: <i>Das ist <b>ein</b> Computer. Er ist <b>ein</b> guter Lehrer. Er wird <b>ein</b> Arzt.</i></p>
<h4>Местоимения: кого?</h4>
<p>ich → <b>mich</b> · du → <b>dich</b> · er → <b>ihn</b> · sie → sie · es → es · wir → <b>uns</b> · ihr → <b>euch</b> · Sie → Sie<br>
<i>Kennst du <b>ihn</b>? · Ich liebe <b>dich</b>.</i></p>`
  },
  {
    id: "ersiees", title: "er, sie, es за предмети", icon: "🔁",
    html: `
<p>В немския „той/тя/то“ се избира по <b>рода на думата</b>, а не по това дали е човек. Компютърът е „той“, лампата е „тя“:</p>
<table class="g"><tr><th>дума</th><th>замества се с</th><th>пример</th></tr>
<tr><td><span class="art der">der</span> Computer</td><td><b>er</b></td><td>Ist der Computer neu? – Ja, aber <b>er</b> funktioniert nicht.</td></tr>
<tr><td><span class="art die">die</span> Lampe</td><td><b>sie</b></td><td>Geht die Lampe? – Ja, <b>sie</b> geht.</td></tr>
<tr><td><span class="art das">das</span> Telefon</td><td><b>es</b></td><td>Wo ist das Telefon? – <b>Es</b> ist auf dem Tisch.</td></tr>
<tr><td><span class="art pl">die</span> Bücher</td><td><b>sie</b> (мн.ч.)</td><td>Sind die Bücher spannend? – Nein, <b>sie</b> sind langweilig.</td></tr></table>
<p class="tip">💡 der → <b>er</b> (същото r накрая) · die → <b>sie</b> (същото e) · das → <b>es</b> (същото s). Лесно!</p>
<p class="tip">⚠️ Капан за българи: <i>die Uhr</i> е „тя“ (часовникът), <i>das Buch</i> е „то“ (книгата), <i>der Stuhl</i> е „той“ (столът).</p>`
  },
  {
    id: "manes", title: "man и es", icon: "👥",
    html: `
<h4>man = „човек“, „хората“, „се“</h4>
<p>Когато не е важно <b>кой точно</b>. Глаголът е като при <b>er</b> (3 л. ед.ч.):</p>
<p><i>Hier <b>kann man</b> Bücher lesen.</i> = Тук може да се четат книги.<br>
<i>In Österreich <b>spricht man</b> Deutsch.</i> = В Австрия се говори немски.<br>
<i><b>Man isst</b> gern gesund.</i> = Хората обичат да се хранят здравословно.</p>
<p class="tip">💡 Преводът на „man“ на български почти винаги е с „<b>се</b>“: kann man = може да се.</p>
<h4>es = безличното „то“</h4>
<p>За неща без конкретен „извършител“ — време, светлина, усещания:</p>
<p><i><b>Es</b> ist dunkel. · <b>Es</b> ist hell. · <b>Es</b> ist schwer. · <b>Es</b> regnet. · <b>Es</b> donnert. · <b>Es</b> gibt … · Wie geht <b>es</b>?</i></p>
<p>На български тук <b>няма</b> подлог („Тъмно е.“), но в немския винаги трябва — затова идва <b>es</b>.</p>`
  },
  {
    id: "praep", title: "Предлози: aus, in, bei, an, nach", icon: "📍",
    html: `
<table class="g"><tr><th>Woher? Откъде?</th><th>Wo? Къде?</th><th>Wohin? Накъде?</th></tr>
<tr><td><b>aus</b> Italien</td><td><b>in</b> Italien</td><td><b>nach</b> Italien</td></tr>
<tr><td><b>aus</b> Rom</td><td><b>in</b> Rom</td><td><b>nach</b> Rom</td></tr>
<tr><td>Ich komme <b>aus</b> Bulgarien.</td><td>Ich wohne <b>in</b> Sofia.</td><td>Ich fahre <b>nach</b> London.</td></tr></table>
<h4>Работа и учене (къде?)</h4>
<ul>
<li><b>bei</b> + фирма: <i>Ich arbeite <b>bei</b> Siemens.</i> (при, във фирмата)</li>
<li><b>an</b> der Universität: <i>Ich studiere <b>an der</b> Universität.</i></li>
<li><b>in</b> + град: <i>Ich arbeite bei BASF <b>in</b> Ludwigshafen.</i></li>
</ul>
<p class="tip">💡 Държави с член (die Schweiz, die Türkei, die USA): <i>aus <b>der</b> Schweiz · in <b>der</b> Schweiz · <b>in die</b> Schweiz</i> (накъде) — не „nach“!</p>
<p class="tip">🔑 Запомни реда: <b>aus → in → nach</b> = идвам от → живея в → пътувам за.</p>`
  },
  {
    id: "formell", title: "du, ihr или Sie?", icon: "🤝",
    html: `
<table class="g"><tr><th></th><th>с кого</th><th>глагол</th><th>„твой / ваш“</th></tr>
<tr><td><b>du</b></td><td>един приятел, дете, студент</td><td>spielst, kommst, kannst</td><td><b>dein</b> / deine</td></tr>
<tr><td><b>ihr</b></td><td>няколко приятели</td><td>spielt, kommt, könnt</td><td><b>euer</b> / eure</td></tr>
<tr><td><b>Sie</b></td><td>един или много — учтиво</td><td>spielen, kommen, können</td><td><b>Ihr</b> / Ihre</td></tr></table>
<p><i>Welches Instrument spielen <b>Sie</b>?</i> (учтиво) → <i>Welches Instrument spiel<b>st du</b>?</i> (на един) → <i>Welches Instrument spiel<b>t ihr</b>?</i> (на няколко)</p>
<p><i>Ist das <b>Ihr</b> Kugelschreiber?</i> ↔ <i>Ist das <b>dein</b> Kugelschreiber?</i> · <i>Sind das <b>Ihre</b> Bücher?</i> ↔ <i>Sind das <b>eure</b> Bücher?</i></p>
<p class="tip">💡 Sie = като „те“ (sie), само с главна буква. Затова глаголът е винаги -en: Sie spiel<b>en</b>.</p>
<p class="tip">💡 Колеги в офиса и непознати → <b>Sie</b>. Студенти помежду си → <b>du/ihr</b>.</p>`
  },
  {
    id: "akzent", title: "Ударение (Wortakzent)", icon: "🎵",
    html: `
<table class="g"><tr><th>Правило</th><th>Примери (ударената сричка е с главни)</th></tr>
<tr><td><b>Основно:</b> ударението е <b>отляво</b> — на първата сричка</td><td>A-bend, BÜ-cher, LAM-pe, NA-me, DRU-cker, ZIM-mer, ZEI-tung · SE-hen, AR-bei-ten, FAH-ren, SCHREI-ben, HÖ-ren</td></tr>
<tr><td><b>Сложни думи:</b> пак отляво (на първата дума)</td><td>FUSS-ball, BRIEF-marken, FAX-gerät, WÖR-terbuch, SCHREIB-tisch, KU-gelschreiber, BLEI-stift</td></tr>
<tr><td><b>Чужди думи:</b> често <b>отдясно</b></td><td>Kaf-FEE, Bü-RO, Stu-DENT, Doku-MENT, Ter-MIN, Universi-TÄT, Biblio-THEK, Kaf-FEE-maschine, Bü-RO-stuhl, Ter-MIN-kalender</td></tr></table>
<p class="tip">💡 Глаголите на <b>-ieren</b> винаги са ударени на <b>-IE-</b>: studIEren, telefonIEren, fotografIEren, funktionIEren.</p>
<p class="tip">💡 Представките be-, ge-, ver-, er-, ent- <b>никога</b> не се ударяват: beSUchen, beKOMmen, beZAHlen, verSTEhen.</p>`
  },
  {
    id: "adjend", title: "Прилагателни: eine alte Lampe", icon: "🧱",
    html: `
<p>Прилагателното има <b>два живота</b>:</p>
<ol>
<li><b>След ist/sind</b> → <b>никакво окончание</b>: <i>Die Lampe ist <b>alt</b>. Der Stuhl ist <b>alt</b>. Das Bett ist <b>alt</b>.</i> Лесно!</li>
<li><b>Пред съществително</b> → <b>получава окончание</b>: <i>eine alt<b>e</b> Lampe, ein alt<b>er</b> Stuhl, ein alt<b>es</b> Bett.</i></li>
</ol>
<h4>Таблицата от учебника (A16, A17)</h4>
<table class="g"><tr><th></th><th><span class="art der">der</span></th><th><span class="art die">die</span></th><th><span class="art das">das</span></th><th><span class="art pl">мн.ч.</span></th></tr>
<tr><td><b>Nominativ</b><br><small>кой? какво е?</small></td><td>der alt<b>e</b> Fernseher<br>ein alt<b>er</b> Fernseher</td><td>die neu<b>e</b> Lampe<br>eine neu<b>e</b> Lampe</td><td>das modern<b>e</b> Radio<br>ein modern<b>es</b> Radio</td><td>die klein<b>en</b> Zimmer<br>keine klein<b>en</b> Zimmer</td></tr>
<tr><td><b>Akkusativ</b><br><small>какво? (след haben, brauchen…)</small></td><td>de<b>n</b> alt<b>en</b> Fernseher<br>eine<b>n</b> alt<b>en</b> Fernseher</td><td>die neu<b>e</b> Lampe<br>eine neu<b>e</b> Lampe</td><td>das modern<b>e</b> Radio<br>ein modern<b>es</b> Radio</td><td>die klein<b>en</b> Zimmer<br>keine klein<b>en</b> Zimmer</td></tr></table>
<h4>Как да го запомниш — 3 правила</h4>
<ul>
<li><b>Някой трябва да покаже рода.</b> Ако членът го показва (der, die, das, den) → прилагателното е скромно: <b>-e</b> (или <b>-en</b>). Ако членът не го показва (ein, kein, mein — без окончание) → прилагателното го показва: ein alt<b>er</b> (der), ein alt<b>es</b> (das).</li>
<li><b>die-думите</b> са най-лесни: винаги <b>-e</b> (eine neue Lampe, die neue Lampe) — и в Nominativ, и в Akkusativ.</li>
<li><b>-en</b> идва при: мъжки род в Akkusativ (einen alt<b>en</b>, den alt<b>en</b>) и в мн.ч. след член (die/keine/meine klein<b>en</b> Zimmer).</li>
</ul>
<p class="tip">⚠️ <b>teuer</b> и <b>dunkel</b> губят e: ein teu<b>rer</b> Stuhl, eine dunk<b>le</b> Lampe.</p>
<p class="tip">👆 Във всяко изречение в приложението цъкни прилагателното → ще видиш точно защо има това окончание.</p>`
  },
  {
    id: "trennbar", title: "Разделими глаголи", icon: "✂️",
    html: `
<p>Някои глаголи имат <b>представка</b> (an, ab, mit, ein, aus, fern, nach, vor, teil, weg…). В изречението тя се <b>откъсва</b> и отива <b>най-накрая</b>:</p>
<table class="g"><tr><th>глагол</th><th>в изречение</th><th>превод</th></tr>
<tr><td>an|kommen</td><td>Der Zug <b>kommt</b> um 10 Uhr <b>an</b>.</td><td>Влакът пристига в 10.</td></tr>
<tr><td>ab|fahren</td><td>Ich <b>fahre</b> morgen <b>ab</b>.</td><td>Заминавам утре.</td></tr>
<tr><td>mit|fahren</td><td><b>Fährst</b> du <b>mit</b>?</td><td>Идваш ли с нас?</td></tr>
<tr><td>fern|sehen</td><td>Ich <b>sehe</b> gern <b>fern</b>.</td><td>Обичам да гледам телевизия.</td></tr>
<tr><td>ein|laden</td><td>Er <b>lädt</b> mich <b>ein</b>.</td><td>Той ме кани.</td></tr>
<tr><td>teil|nehmen</td><td>Wir <b>nehmen</b> am Kurs <b>teil</b>.</td><td>Участваме в курса.</td></tr></table>
<h4>Кога остават слети?</h4>
<ul><li>В речника и след модален глагол (инфинитив): <i>Ich kann morgen nicht <b>mitfahren</b>.</i></li>
<li>С <b>zu</b> → zu влиза в средата: teil<b>zu</b>nehmen, vor<b>zu</b>bereiten, nach<b>zu</b>denken.</li></ul>
<p class="tip">💡 Ударението е винаги върху представката: <b>AN</b>kommen, <b>MIT</b>fahren.</p>
<p class="tip">⚠️ <b>be-, ver-, ent-, er-, über-, unter-</b> НЕ се отделят: Ich <b>bezahle</b>. Ich <b>verstehe</b>. Ich <b>übersetze</b>. Ich <b>unterschreibe</b>.</p>`
  },
  {
    id: "sich", title: "Възвратни глаголи (sich)", icon: "🪞",
    html: `
<p>Като българското „<b>се</b>“: представям <b>се</b>, извинявам <b>се</b>. В немския „се“ сменя формата си по лицето:</p>
<table class="g"><tr><th></th><th>sich setzen (сядам)</th><th>sich entschuldigen (извинявам се)</th></tr>
<tr><td>ich</td><td>setze <b>mich</b></td><td>entschuldige <b>mich</b></td></tr>
<tr><td>du</td><td>setzt <b>dich</b></td><td>entschuldigst <b>dich</b></td></tr>
<tr><td>er/sie/es</td><td>setzt <b>sich</b></td><td>entschuldigt <b>sich</b></td></tr>
<tr><td>wir</td><td>setzen <b>uns</b></td><td>entschuldigen <b>uns</b></td></tr>
<tr><td>ihr</td><td>setzt <b>euch</b></td><td>entschuldigt <b>euch</b></td></tr>
<tr><td>sie/Sie</td><td>setzen <b>sich</b></td><td>entschuldigen <b>sich</b></td></tr></table>
<p class="tip">💡 Само при er/sie/es и sie/Sie е <b>sich</b>. Иначе е mich, dich, uns, euch.</p>
<p>Учтиво: <i>Setzen Sie <b>sich</b>, bitte!</i> = Седнете, моля! · <i>Ich entschuldige <b>mich</b> für die Verspätung.</i></p>
<p class="tip">⚠️ <b>sitzen</b> = седя (вече седнал) · <b>sich setzen</b> = сядам (движение).</p>`
  },
  {
    id: "zeit", title: "Часове и дни", icon: "🕘",
    html: `
<table class="g"><tr><th>Въпрос</th><th>Отговор</th><th>Значение</th></tr>
<tr><td>Wann öffnet das Museum?</td><td><b>Um</b> 9 Uhr.</td><td>точно в 9</td></tr>
<tr><td>Wann kommst du?</td><td><b>Gegen</b> 9 Uhr.</td><td>около 9</td></tr>
<tr><td>Wie lange ist es geöffnet?</td><td><b>Von</b> 9 <b>bis</b> 17 Uhr.</td><td>от … до</td></tr>
<tr><td>Wann ist es geschlossen?</td><td><b>Am</b> Montag.</td><td>в (един) понеделник</td></tr>
<tr><td>Wann ist es geschlossen?</td><td><b>Montags.</b></td><td>всеки понеделник</td></tr>
<tr><td>Wann ist es geöffnet?</td><td><b>Täglich.</b></td><td>всеки ден (= von Montag bis Sonntag)</td></tr></table>
<p class="tip">💡 Дни: <b>am</b> + ден (am Montag, am Wochenende). Навик: ден + <b>s</b>, с малка буква: montags, dienstags, sonntags.</p>
<p class="tip">💡 Часове: <b>um</b> + час. 17.00 Uhr = „siebzehn Uhr“. В разговор: 9.30 = „neun Uhr dreißig“.</p>`
  },
  {
    id: "hotel", title: "В хотела: es gibt, im, ein → der", icon: "🏨",
    html: `
<h4>es gibt = има (+ Akkusativ)</h4>
<p><i>Im Zimmer gibt es <b>einen</b> Fernseher, <b>eine</b> Minibar und <b>ein</b> Bad.</i> · Няма: <i>Es gibt <b>keinen</b> Schreibtisch, <b>keine</b> Handtücher, <b>kein</b> Toilettenpapier.</i></p>
<p class="tip">💡 След es gibt, haben, brauchen, nehmen, möchten, kennen → Akkusativ. Само der-думите се сменят: einen / keinen.</p>
<h4>im или in der? (къде?)</h4>
<p>in + <b>dem</b> = <b>im</b> (за der/das): im Zimmer, im Hotel, im Bad · in + <b>der</b> (за die): in der Dusche, in der Sauna.</p>
<h4>ein → der (A10)</h4>
<p>Първия път, когато споменаваш нещо, то е „едно някакво“ → <b>ein</b>. После вече е известно → <b>der/die/das</b>:<br>
<i>Es gibt im Zimmer <b>einen</b> Schreibtisch. Ich finde <b>den</b> Schreibtisch sehr klein.</i></p>
<h4>Умалителни: -chen, -lein</h4>
<p>Правят думата „малка“ и са <b>винаги das</b>, често с умлаут: die Hand → <b>das Händchen</b>, das Bild → <b>das Bildchen</b>, das Buch → <b>das Büchlein</b>.</p>
<h4>ein Problem → mehrere → viele</h4>
<p>Ich habe <b>ein</b> Problem → <b>mehrere</b> Probleme (няколко) → <b>viele</b> Probleme (много).</p>`
  },
  {
    id: "umzu", title: "um … zu, statt … zu, ohne … zu", icon: "🎯",
    html: `
<p>Втората част на изречението завършва със <b>zu + глагол</b> (без лице):</p>
<table class="g"><tr><th></th><th>значение</th><th>пример</th></tr>
<tr><td><b>um … zu</b></td><td>за да</td><td>Ich brauche ein Auto, <b>um</b> zur Arbeit <b>zu fahren</b>.</td></tr>
<tr><td><b>statt … zu</b></td><td>вместо да</td><td><b>Statt</b> zu lernen, sieht er fern.</td></tr>
<tr><td><b>ohne … zu</b></td><td>без да</td><td>Er antwortet, <b>ohne</b> nach<b>zu</b>denken.</td></tr></table>
<p class="tip">💡 При разделими глаголи zu влиза в средата: teil<b>zu</b>nehmen, vor<b>zu</b>bereiten.</p>
<p class="tip">💡 Това е малко по-напреднала граматика — засега е достатъчно да го разпознаваш.</p>`
  },
  {
    id: "stark", title: "Силни глаголи (смяна на гласната)", icon: "💪",
    html: `
<p>Някои глаголи сменят гласната — но <b>само при du и er/sie/es</b>. Всички останали лица са нормални.</p>
<table class="g"><tr><th>смяна</th><th>глаголи</th><th>ich</th><th>du</th><th>er/sie/es</th></tr>
<tr><td><b>a → ä</b></td><td>fahren, schlafen, tragen, waschen, halten, einladen</td><td>fahre</td><td>f<b>ä</b>hrst</td><td>f<b>ä</b>hrt</td></tr>
<tr><td><b>e → i</b></td><td>geben, helfen, sprechen, essen, nehmen, treffen, vergessen</td><td>gebe</td><td>g<b>i</b>bst</td><td>g<b>i</b>bt</td></tr>
<tr><td><b>e → ie</b></td><td>sehen, lesen, empfehlen</td><td>sehe</td><td>s<b>ie</b>hst</td><td>s<b>ie</b>ht</td></tr>
<tr><td><b>au → äu</b></td><td>laufen</td><td>laufe</td><td>l<b>äu</b>fst</td><td>l<b>äu</b>ft</td></tr></table>
<p class="tip">💡 <b>ihr</b> НЕ сменя: ihr fahrt, ihr gebt, ihr seht.</p>
<h4>Капани</h4>
<ul>
<li><b>nehmen</b> → du <b>nimmst</b>, er <b>nimmt</b> (и двойно m!)</li>
<li><b>essen</b> → du <b>isst</b>, er <b>isst</b> (еднакви)</li>
<li><b>halten</b> → er <b>hält</b> (без -t) · ihr halt<b>et</b></li>
<li><b>-t/-d</b> накрая на основата → +e: du wart<b>e</b>st, er red<b>e</b>t (но силните: du hältst)</li>
</ul>`
  },
  {
    id: "akkpron", title: "Местоимения: ihn, sie, es, mich…", icon: "👉",
    html: `
<table class="g"><tr><th>Nominativ (кой?)</th><th>ich</th><th>du</th><th>er</th><th>sie</th><th>es</th><th>wir</th><th>ihr</th><th>sie/Sie</th></tr>
<tr><td><b>Akkusativ (кого?)</b></td><td><b>mich</b></td><td><b>dich</b></td><td><b>ihn</b></td><td>sie</td><td>es</td><td><b>uns</b></td><td><b>euch</b></td><td>sie/Sie</td></tr></table>
<p>За неща — по рода: <i>Isst du <b>den</b> Kuchen? – Ja, ich esse <b>ihn</b>.</i> · <i>Trinkst du <b>die</b> Milch? – Ja, ich trinke <b>sie</b>.</i> · <i>Liest du <b>das</b> Buch? – Ja, ich lese <b>es</b>.</i> · <i>Kaufst du <b>die</b> Erdbeeren? – Ja, ich kaufe <b>sie</b>.</i></p>
<p class="tip">🔑 der → den → <b>ihn</b> (всичко с <b>n</b>!). die → <b>sie</b>, das → <b>es</b> — не се променят.</p>
<p><i><b>Ich</b> kenne Maria, aber <b>sie</b> kennt <b>mich</b> nicht.</i> — подлогът е Nominativ (ich, sie), обектът — Akkusativ (mich).</p>`
  },
  {
    id: "possakk", title: "mein → meinen (Akkusativ)", icon: "👜",
    html: `
<table class="g"><tr><th></th><th><span class="art der">der</span></th><th><span class="art die">die</span></th><th><span class="art das">das</span></th><th><span class="art pl">мн.ч.</span></th></tr>
<tr><td>Nominativ</td><td>mein</td><td>meine</td><td>mein</td><td>meine</td></tr>
<tr><td><b>Akkusativ</b></td><td><b>meinen</b></td><td>meine</td><td>mein</td><td>meine</td></tr></table>
<p>Същото за <b>dein, sein, ihr, unser, Ihr</b>: <i>Ich besuche mein<b>en</b> Onkel. Paul fragt sein<b>en</b> Vater. Wir besuchen unser<b>e</b> Eltern.</i></p>
<p class="tip">⚠️ <b>euer</b> губи e: <b>eure</b> Tante, <b>euren</b> Großvater (но euer Auto).</p>
<h4>Кое притежателно?</h4>
<p>ich → mein · du → dein · er/es → sein · sie → ihr · wir → unser · ihr → euer · sie (мн.ч.) → ihr · Sie → Ihr<br>
<i>Peter hat einen Computer. Das ist <b>sein</b> Computer. · Anna hat eine Kamera. Das ist <b>ihre</b> Kamera. · Das Mädchen trägt einen Hut. Das ist <b>sein</b> Hut.</i></p>`
  },
  {
    id: "praepakk", title: "Предлози с Akkusativ", icon: "🧭",
    html: `
<p>Тези 6 предлога <b>винаги</b> са с Akkusativ (der → den, ein → einen). Мнемоника: <b>DOGFUB</b> — <b>d</b>urch, <b>o</b>hne, <b>g</b>egen, <b>f</b>ür, <b>u</b>m, <b>b</b>is.</p>
<table class="g"><tr><th>предлог</th><th>значение</th><th>пример</th></tr>
<tr><td><b>bis</b></td><td>до (време/място)</td><td>bis morgen, bis München</td></tr>
<tr><td><b>durch</b></td><td>през; заради</td><td>durch die Stadt, durch einen Unfall</td></tr>
<tr><td><b>für</b></td><td>за</td><td>für die Tante, für zwei Wochen</td></tr>
<tr><td><b>gegen</b></td><td>срещу; против; около (час)</td><td>gegen den Baum, gegen den Plan</td></tr>
<tr><td><b>ohne</b></td><td>без</td><td>ohne Schirm, ohne einen Grund</td></tr>
<tr><td><b>um</b></td><td>около; в (час)</td><td>um den Tisch, um 18 Uhr</td></tr></table>
<p class="tip">💡 Слети: durch<b>s</b> = durch das · für<b>s</b> = für das · um<b>s</b> = um das.</p>`
  },
  {
    id: "neg", title: "Отрицание: nicht, kein, doch", icon: "🙅",
    html: `
<h4>kein = „не“ + ein</h4>
<p>Пред съществително с <b>ein</b> или <b>без член</b>: <i>Ist das ein Apfel? – Nein, das ist <b>kein</b> Apfel. · Sind das Äpfel? – Nein, das sind <b>keine</b> Äpfel. · Ich trinke <b>kein</b> Bier.</i></p>
<h4>nicht — всичко останало. Къде стои?</h4>
<table class="g"><tr><th>отричам</th><th>nicht стои</th><th>пример</th></tr>
<tr><td>само глагола</td><td>в края</td><td>Ich lese <b>nicht</b>.</td></tr>
<tr><td>обект с der/die/das или име</td><td>в края</td><td>Ich kenne Lisa <b>nicht</b>. Ich trinke das Bier <b>nicht</b>.</td></tr>
<tr><td>прилагателно / gern</td><td>пред него</td><td>Ich bin <b>nicht</b> krank. Ich tanze <b>nicht</b> gern.</td></tr>
<tr><td>място / посока</td><td>пред него</td><td>Ich wohne <b>nicht</b> in Berlin.</td></tr>
<tr><td>2-ри глагол / представка</td><td>пред него</td><td>Ich kann <b>nicht</b> schwimmen. Ich fahre <b>nicht</b> mit.</td></tr></table>
<h4>Ja, Nein или Doch?</h4>
<p><i>Studierst du? – <b>Ja</b>, ich studiere. / <b>Nein</b>, ich studiere nicht.</i><br>
<i>Studierst du <b>nicht</b>? – <b>Doch</b>, ich studiere! / Nein, ich studiere nicht.</i></p>
<p class="tip">💡 <b>Doch</b> = „да“ като отговор на <b>отрицателен</b> въпрос (с nicht/kein).</p>`
  },
  {
    id: "praefix", title: "Представки: разделими или не?", icon: "🔒",
    html: `
<table class="g"><tr><th></th><th>представки</th><th>пример</th></tr>
<tr><td><b>Неразделими</b> 🔒</td><td>be-, emp-, ent-, er-, ge-, ver-, zer-</td><td>Peter <b>bekommt</b> ein Schnitzel. Ich <b>verstehe</b> das Problem.</td></tr>
<tr><td><b>Разделими</b> ✂️</td><td>ab-, an-, auf-, aus-, ein-, mit-, her-, vor-, zu-, zurück-, fern-, teil-</td><td>Der Zug <b>kommt</b> um 18 Uhr <b>an</b>. Du <b>schließt</b> die Tür <b>ab</b>.</td></tr></table>
<p>Представката сменя значението: kommen (идвам) → <b>be</b>kommen (получавам) · stehen (стоя) → <b>ver</b>stehen (разбирам) · dienen (служа) → <b>ver</b>dienen (печеля).</p>
<p class="tip">💡 Ударението: разделимите — на представката (<b>AN</b>kommen), неразделимите — на глагола (be<b>KOM</b>men).</p>`
  },
  {
    id: "farben", title: "Цветове и противоположности", icon: "🌈",
    html: `
<p><b>rot</b> червен · <b>gelb</b> жълт · <b>grün</b> зелен · <b>blau</b> син · <b>violett / lila</b> лилав · <b>orange</b> оранжев · <b>braun</b> кафяв · <b>schwarz</b> черен · <b>weiß</b> бял · <b>grau</b> сив · <b>hell</b>blau светлосин · <b>dunkel</b>blau тъмносин</p>
<p><i>Welche Farbe hat die Tomate? – <b>Sie</b> ist rot.</i> (die Tomate → sie)</p>
<h4>Противоположности</h4>
<table class="g"><tr><th>+</th><th>−</th><th>+</th><th>−</th></tr>
<tr><td>warm / heiß</td><td>kalt</td><td>gesund</td><td>krank</td></tr>
<tr><td>teuer</td><td>billig</td><td>fleißig</td><td>faul</td></tr>
<tr><td>einfach / leicht</td><td>schwierig / schwer</td><td>dick</td><td>dünn / schlank</td></tr>
<tr><td>schnell</td><td>langsam</td><td>gut</td><td>schlecht</td></tr>
<tr><td>laut</td><td>leise</td><td>süß</td><td>sauer</td></tr>
<tr><td>hart</td><td>weich</td><td>richtig</td><td>falsch</td></tr>
<tr><td>spannend</td><td>langweilig</td><td>hell</td><td>dunkel</td></tr></table>
<p class="tip">⚠️ <b>alt</b> има 3 противоположности: neu (das neue Haus), jung (der junge Mann), frisch (frisches Brot).</p>`
  },
  {
    id: "questions", title: "Въпросителни думи", icon: "?",
    html: `
<table class="g"><tr><th>дума</th><th>значение</th><th>пример</th></tr>
<tr><td><b>wie</b></td><td>как</td><td>Wie heißen Sie?</td></tr>
<tr><td><b>wie alt</b></td><td>на колко години</td><td>Wie alt sind Sie?</td></tr>
<tr><td><b>was</b></td><td>какво</td><td>Was sind Sie von Beruf?</td></tr>
<tr><td><b>welche</b></td><td>кои, какви</td><td>Welche Sprachen sprechen Sie?</td></tr>
<tr><td><b>wo</b></td><td>къде (място)</td><td>Wo wohnen Sie?</td></tr>
<tr><td><b>woher</b></td><td>откъде</td><td>Woher kommen Sie?</td></tr>
<tr><td><b>wohin</b></td><td>накъде</td><td>Wohin gehst du?</td></tr>
<tr><td><b>wie viel</b></td><td>колко (неброимо)</td><td>Wie viel ist drei plus vier?</td></tr>
<tr><td><b>wie viele</b></td><td>колко (броими)</td><td>Wie viele Kinder haben Sie?</td></tr></table>
<h4>her / hin</h4>
<p><b>her</b> = към мен (говорещия) · <b>hin</b> = от мен натам.<br>
<i>Komm her!</i> – Ела тук! · <i>Geh hin!</i> – Иди там! · <i>wo<b>her</b></i> – откъде · <i>wo<b>hin</b></i> – накъде</p>`
  },
  {
    id: "compare", title: "Сравнение", icon: "↗",
    html: `
<table class="g"><tr><th>основна</th><th>сравнителна</th><th>превъзходна</th></tr>
<tr><td>groß – голям</td><td>größer – по-голям</td><td>am größten – най-голям</td></tr>
<tr><td>gern – с удоволствие</td><td><b>lieber</b> – предпочитам</td><td><b>am liebsten</b> – най-много обичам</td></tr>
<tr><td>viel – много</td><td><b>mehr</b> – повече</td><td><b>am meisten</b> – най-много</td></tr></table>
<p>Правилото: <b>+er</b> / <b>am …sten</b> (често с умлаут: groß → gr<b>ö</b>ßer). gern и viel са неправилни.</p>
<p><i>Ich lese <b>gern</b> Krimis, <b>lieber</b> Romane und <b>am liebsten</b> Gedichte.</i></p>`
  },
  {
    id: "numbers", title: "Числа", icon: "#",
    html: `
<table class="g"><tr><th>0–10</th><th>11–20</th><th>десетици</th></tr>
<tr><td>0 null</td><td>11 elf</td><td>10 zehn</td></tr>
<tr><td>1 eins</td><td>12 zwölf</td><td>20 zwanzig</td></tr>
<tr><td>2 zwei</td><td>13 dreizehn</td><td>30 drei<b>ß</b>ig</td></tr>
<tr><td>3 drei</td><td>14 vierzehn</td><td>40 vierzig</td></tr>
<tr><td>4 vier</td><td>15 fünfzehn</td><td>50 fünfzig</td></tr>
<tr><td>5 fünf</td><td>16 se<b>ch</b>zehn</td><td>60 se<b>ch</b>zig</td></tr>
<tr><td>6 sechs</td><td>17 sie<b>b</b>zehn</td><td>70 sie<b>b</b>zig</td></tr>
<tr><td>7 sieben</td><td>18 achtzehn</td><td>80 achtzig</td></tr>
<tr><td>8 acht</td><td>19 neunzehn</td><td>90 neunzig</td></tr>
<tr><td>9 neun</td><td>20 zwanzig</td><td>100 (ein)hundert</td></tr>
<tr><td>10 zehn</td><td></td><td>1000 (ein)tausend</td></tr></table>
<p><b>21–99 се казват обратно</b>: единици + <b>und</b> + десетици, слято.<br>
35 = fünf<b>und</b>dreißig („пет и трийсет“) · 21 = <b>ein</b>undzwanzig (не eins!)</p>
<p><b>Години</b> до 1999 — на стотици: 1871 = achtzehn<b>hundert</b>einundsiebzig.</p>
<h4>Първо, второ, трето…</h4>
<p>число + <b>-tens</b> (до 19), неправилни: <b>erstens</b>, <b>drittens</b>, <b>siebtens</b>, <b>achtens</b>.</p>
<h4>Сметки</h4>
<p>2 + 3 = 5 → <i>zwei <b>plus</b> drei <b>ist (gleich)</b> fünf</i> · 7 − 4 = 3 → <i>sieben <b>minus</b> vier ist drei</i></p>`
  },
  {
    id: "sounds", title: "Произношение", icon: "🔊",
    html: `
<p>Немският се чете почти както се пише. Научи тези комбинации и ще четеш всичко:</p>
<table class="g"><tr><th>пише се</th><th>чете се</th><th>пример</th></tr>
<tr><td><b>ei</b></td><td>ай</td><td>die Reise, der Papagei</td></tr>
<tr><td><b>ie</b></td><td>дълго и</td><td>die Wiese, lieben</td></tr>
<tr><td><b>eu / äu</b></td><td>ой</td><td>Deutsch, Häuser</td></tr>
<tr><td><b>au</b></td><td>ау</td><td>das Haus, faul, der Rauch</td></tr>
<tr><td><b>sch</b></td><td>ш</td><td>die Schwester</td></tr>
<tr><td><b>sp / st</b> (в началото)</td><td>шп / шт</td><td>sprechen, der Student</td></tr>
<tr><td><b>ch</b></td><td>х (меко след e/i)</td><td>lachen, ich</td></tr>
<tr><td><b>chs</b></td><td>кс</td><td>sechs</td></tr>
<tr><td><b>ph</b></td><td>ф</td><td>die Physik, der Philosoph</td></tr>
<tr><td><b>z / tz</b></td><td>ц</td><td>die Zahl, zehn</td></tr>
<tr><td><b>w</b></td><td>в</td><td>die Wiese, wohnen</td></tr>
<tr><td><b>v</b></td><td>ф</td><td>der Vater, von (но: die Variante → в)</td></tr>
<tr><td><b>j</b></td><td>й</td><td>ja, das Jahr</td></tr>
<tr><td><b>qu</b></td><td>кв</td><td>die Quitte</td></tr>
<tr><td><b>h</b> след гласна</td><td>не се чете, удължава</td><td>wohnen, die Zahl</td></tr>
<tr><td><b>ß</b></td><td>с (= ss)</td><td>heißen, groß</td></tr>
<tr><td><b>ä / ö / ü</b></td><td>е / ьо / ю</td><td>Ärztin, hören, Brüder</td></tr></table>
<p class="tip">💡 Натисни 🔊 до всяка дума, за да я чуеш.</p>`
  },
  {
    id: "jobs", title: "Професии и държави", icon: "💼",
    html: `
<p>Женската форма = мъжка + <b>-in</b>, мн.ч. <b>-innen</b>:</p>
<table class="g"><tr><th>мъжки</th><th>женски</th></tr>
<tr><td>der Lehrer</td><td>die Lehrer<b>in</b></td></tr>
<tr><td>der Student</td><td>die Student<b>in</b></td></tr>
<tr><td>der Arzt</td><td>die <b>Ä</b>rzt<b>in</b> (+ умлаут)</td></tr>
<tr><td>der Koch</td><td>die K<b>ö</b>ch<b>in</b> (+ умлаут)</td></tr>
<tr><td>der Feuerwehr<b>mann</b></td><td>die Feuerwehr<b>frau</b></td></tr></table>
<p class="tip">💡 За професия <b>без член</b>: <i>Ich bin Informatiker.</i> <i>Sie ist Ärztin.</i></p>
<p>arbeiten <b>als</b> + професия · arbeiten <b>bei</b> + фирма: <i>Ich arbeite als Informatiker bei Siemens.</i></p>
<h4>Държави</h4>
<p>Повечето са <b>без член</b>: aus Bulgarien, in Deutschland, aus Österreich.<br>
Някои са с <span class="art die">die</span>: <b>die Türkei, die Schweiz, die Ukraine</b> → in <b>der</b> Schweiz, aus <b>der</b> Türkei.<br>
Мн.ч.: <b>die USA, die Niederlande</b> → in <b>den</b> USA.</p>
<h4>Държава → език</h4>
<p>Bulgarien → Bulgarisch · Deutschland → Deutsch · Polen → Polnisch · Tschechien → Tschechisch · Frankreich → Französisch</p>`
  },
];
