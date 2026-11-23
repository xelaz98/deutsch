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
<p><i>Ich lese <b>gern</b> Krimis, <b>lieber</b> Romane und <b>am liebsten</b> Gedichte.</i></p>
<h4>Превъзходна степен: am …sten / der …ste (урок 10)</h4>
<table class="g"><tr><th>основна</th><th>сравнителна</th><th>превъзходна</th></tr>
<tr><td>berühmt</td><td>berühmt<b>er</b></td><td>am berühmt<b>esten</b></td></tr>
<tr><td>bekannt</td><td>bekannt<b>er</b></td><td>am bekannt<b>esten</b></td></tr>
<tr><td>bedeutend</td><td>bedeutend<b>er</b></td><td>am bedeutend<b>sten</b></td></tr>
<tr><td>klein</td><td>klein<b>er</b></td><td>am klein<b>sten</b></td></tr></table>
<p class="tip">💡 След <b>-t, -d, -s, -ß, -z</b> се вмъква <b>-e-</b>, за да се изговаря: berühmt<b>e</b>sten, bekannt<b>e</b>sten. Изключения: при <b>-end</b> (bedeutend) — без -e-: bedeutend<b>sten</b>; groß → am gr<b>ö</b>ß<b>ten</b> (без -e-, с умлаут).</p>
<p><b>Пред съществително</b> → der/die/das + <b>-ste</b>: <i>das berühmte<b>ste</b> Wirtshaus der Welt, das bedeutend<b>ste</b> Museum, die bekannte<b>sten</b> Bilder</i> (мн.ч. -sten).</p>`
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
  {
    id: "tageszeit", title: "Части на деня: morgens, am Morgen, morgen", icon: "🌅",
    html: `
<table class="g"><tr><th>кога?</th><th>част от деня</th><th>всеки ден (навик)</th></tr>
<tr><td>ca. 8–10 Uhr</td><td>der Morgen — сутрин</td><td><b>morgens</b></td></tr>
<tr><td>ca. 10–12 Uhr</td><td>der Vormittag — предобед</td><td><b>vormittags</b></td></tr>
<tr><td>ca. 12–14 Uhr</td><td>der Mittag — обед</td><td><b>mittags</b></td></tr>
<tr><td>ca. 14–18 Uhr</td><td>der Nachmittag — следобед</td><td><b>nachmittags</b></td></tr>
<tr><td>ca. 18–22 Uhr</td><td>der Abend — вечер</td><td><b>abends</b></td></tr>
<tr><td>ab ca. 22 Uhr</td><td><b>die</b> Nacht — нощ</td><td><b>nachts</b></td></tr></table>
<p>Всички са <b>der</b>, само <b>die Nacht</b> е die. С <b>-s</b> и малка буква = „всеки ден по това време“: <i>Ich trinke <b>morgens</b> Kaffee.</i> = <i><b>Jeden Morgen</b> trinke ich Kaffee.</i></p>
<h4>Капанът: morgen или Morgen?</h4>
<ul><li><b>morgen</b> (малка буква) = <b>утре</b>: <i>Morgen fahre ich nach Hamburg.</i></li>
<li><b>der Morgen</b> (голяма буква) = <b>сутринта</b>: <i>Guten Morgen!</i></li>
<li>Заедно: <i>morgen Vormittag</i> = утре предобед, <i>heute Abend</i> = довечера (частта от деня — с голяма буква).</li></ul>
<h4>Дни подред</h4>
<p>vorgestern (онзи ден) → gestern (вчера) → <b>heute</b> (днес) → morgen (утре) → übermorgen (вдругиден)</p>
<h4>am, im или без предлог?</h4>
<table class="g"><tr><th>предлог</th><th>с какво</th><th>пример</th></tr>
<tr><td><b>um</b></td><td>час</td><td>um 8 Uhr</td></tr>
<tr><td><b>am</b></td><td>ден, част от деня</td><td>am Montag, am Abend (но: in der Nacht)</td></tr>
<tr><td><b>im</b></td><td>месец, сезон</td><td>im November, im Sommer</td></tr>
<tr><td><b>im Jahr</b> / без предлог</td><td>година</td><td>im Jahr 1999 · 1999 (никога „in 1999“!)</td></tr></table>
<p class="tip">💡 Дните се съкращават с две букви и точка: Mo. Di. Mi. Do. Fr. Sa. So. — <i>von Di. bis Sa. geöffnet</i>.</p>
<p class="tip">💡 Stunde ≠ Uhr: <i>Der Film dauert zwei <b>Stunden</b></i> (колко дълго) · <i>Er beginnt um zwei <b>Uhr</b></i> (в колко часа).</p>`
  },
  {
    id: "himmel", title: "Wo liegt …? Посоките на света", icon: "🧭",
    html: `
<table class="g"><tr><td>der Nordwesten<br><small>северозапад</small></td><td><b>der Norden</b><br><small>север</small></td><td>der Nordosten<br><small>североизток</small></td></tr>
<tr><td><b>der Westen</b><br><small>запад</small></td><td><b>die Mitte</b><br><small>средата</small></td><td><b>der Osten</b><br><small>изток</small></td></tr>
<tr><td>der Südwesten<br><small>югозапад</small></td><td><b>der Süden</b><br><small>юг</small></td><td>der Südosten<br><small>югоизток</small></td></tr></table>
<p>Посоките са <b>der</b> → „къде?“ = <b>im</b> (in + dem): <i>Berlin liegt <b>im</b> Osten von Deutschland.</i></p>
<p class="tip">⚠️ Само <b>die Mitte</b> е die → <b>in der</b> Mitte: <i>Kassel liegt <b>in der</b> Mitte von Deutschland.</i></p>
<p>Въпрос: <i><b>Wo liegt</b> München?</i> — Отговор: <i>München <b>liegt im Süden</b> von Deutschland.</i> (liegen = намирам се — за градове, сгради, хотели)</p>`
  },
  {
    id: "wann", title: "Кога? am, um, im (предлози за време)", icon: "⏰",
    html: `
<p>На въпроса <b>Wann?</b> (кога?) отговаряме с един от три предлога. Учебникът ги нарича <b>temporal</b> — „за време“.</p>
<table class="g"><tr><th>предлог</th><th>за какво</th><th>пример</th></tr>
<tr><td><b>um</b></td><td>точен час</td><td><i><b>um</b> 8 Uhr, <b>um</b> halb zehn</i></td></tr>
<tr><td><b>am</b></td><td>ден, част от деня, дата</td><td><i><b>am</b> Donnerstag, <b>am</b> Morgen, <b>am</b> Wochenende, <b>am</b> 3. Mai</i></td></tr>
<tr><td><b>im</b></td><td>месец, сезон</td><td><i><b>im</b> Mai, <b>im</b> Sommer, <b>im</b> Winter</i></td></tr></table>
<p><b>am = an + dem</b> · <b>im = in + dem</b> — двете думи се сливат в една. Никой не казва „an dem Donnerstag“ в разговор.</p>
<p class="tip">🔑 Трик за запомняне — от малко към голямо: <b>um</b> (час) → <b>am</b> (ден) → <b>im</b> (месец).<br>Изключение: <b>in der Nacht</b> (през нощта) — die Nacht е женски род.</p>
<p><i>Wann frühstückst du? — <b>Am</b> Sonntag frühstücke ich <b>um</b> 10 Uhr.</i><br>
<i>Wann hast du Urlaub? — <b>Im</b> August.</i></p>
<p class="tip">💡 Ако времето е в началото, глаголът пак е <b>втори</b>: <i><b>Am Morgen</b> trinke ich Kaffee.</i> (не „Am Morgen ich trinke“)</p>`
  },
  {
    id: "buefett", title: "На шведската маса: ich hätte gern, mögen, wollen", icon: "🥐",
    html: `
<h4>Три начина да кажеш „искам“</h4>
<table class="g"><tr><th></th><th>значение</th><th>пример</th></tr>
<tr><td><b>ich möchte</b></td><td>бих искал — учтиво, най-често</td><td><i>Ich möchte einen Kaffee.</i></td></tr>
<tr><td><b>ich hätte gern</b></td><td>бих искал — също учтиво, в кафене/магазин</td><td><i>Ich hätte gern ein Brötchen.</i></td></tr>
<tr><td><b>ich will</b></td><td>искам — твърдо, звучи грубо пред сервитьор</td><td><i>Ich will jetzt essen!</i></td></tr></table>
<p class="tip">⚠️ <b>ich will</b> ≠ „ще“! На български „ще взема“ = <b>ich nehme</b>.</p>
<h4>Една и съща схема: сега – тогава – учтиво</h4>
<table class="g"><tr><th>сега</th><th>минало</th><th>учтиво желание</th></tr>
<tr><td>ich <b>mag</b> (харесвам)</td><td>ich <b>mochte</b> (харесвах)</td><td>ich <b>möchte</b> (бих искал)</td></tr>
<tr><td>ich <b>habe</b> (имам)</td><td>ich <b>hatte</b> (имах)</td><td>ich <b>hätte</b> (бих имал)</td></tr></table>
<p>Учтивата форма = миналото + <b>умлаут</b>: mochte → m<b>ö</b>chte, hatte → h<b>ä</b>tte.</p>
<h4>wollen и mögen: ich = er</h4>
<table class="g"><tr><th></th><th>wollen</th><th>mögen</th><th>nehmen</th></tr>
<tr><td>ich</td><td><b>will</b></td><td><b>mag</b></td><td>nehme</td></tr>
<tr><td>du</td><td>willst</td><td>magst</td><td><b>nimmst</b></td></tr>
<tr><td>er/sie/es</td><td><b>will</b></td><td><b>mag</b></td><td><b>nimmt</b></td></tr>
<tr><td>wir</td><td>wollen</td><td>mögen</td><td>nehmen</td></tr>
<tr><td>ihr</td><td>wollt</td><td>mögt</td><td>nehmt</td></tr>
<tr><td>sie/Sie</td><td>wollen</td><td>mögen</td><td>nehmen</td></tr></table>
<h4>Мерки: без „von“</h4>
<p><i>eine Tasse Kaffee · ein Glas Saft · eine Scheibe Brot · zwei Scheiben Käse</i> — мярката и храната стоят една до друга, без предлог (на български: „чаша <b>с</b> кафе“, на немски — не).</p>
<h4>stehen или liegen?</h4>
<p><b>stehen</b> = изправено: <i>Die Gläser <b>stehen</b> auf dem Büfett.</i> · <b>liegen</b> = легнало: <i>Das Besteck <b>liegt</b> dort.</i></p>
<h4>Гладен съм</h4>
<p><i>Ich <b>habe</b> Hunger.</i> — с <b>haben</b>, не със sein! · <i>Ich habe einen Bärenhunger!</i> = Умирам от глад.</p>
<p class="tip">💡 <b>erst</b> = първо / чак: <i>Erst Kaffee, dann Brötchen.</i> · <i>Er kommt erst um 10.</i> (= чак в 10) · <b>nur</b> = само.</p>`
  },
  {
    id: "imperativ", title: "Imperativ: Mach! Macht! Machen Sie!", icon: "📣",
    html: `
<p>Императивът е формата за <b>заповед, молба, съвет, рецепта</b>: <i>Iss! Trink viel Wasser! Schneiden Sie die Zwiebel!</i> Има три форми — според това на кого говориш.</p>
<table class="g"><tr><th></th><th>как се прави</th><th>machen</th><th>essen</th><th>fahren</th></tr>
<tr><td><b>du</b></td><td>du-формата <b>без du и без -st</b></td><td>du machst → <b>Mach!</b></td><td>du isst → <b>Iss!</b></td><td>du fährst → <b>Fahr!</b></td></tr>
<tr><td><b>ihr</b></td><td>ihr-формата <b>без ihr</b></td><td>ihr macht → <b>Macht!</b></td><td>ihr esst → <b>Esst!</b></td><td>ihr fahrt → <b>Fahrt!</b></td></tr>
<tr><td><b>Sie</b></td><td>инфинитив + <b>Sie</b></td><td><b>Machen Sie!</b></td><td><b>Essen Sie!</b></td><td><b>Fahren Sie!</b></td></tr></table>
<h4>Трите капана</h4>
<ul>
<li><b>e → i остава</b>: du isst → <b>Iss!</b> · du gibst → <b>Gib!</b> · du nimmst → <b>Nimm!</b> · du liest → <b>Lies!</b></li>
<li><b>a → ä НЕ остава</b> (умлаутът изчезва): du fährst → <b>Fahr!</b> · du bäckst → <b>Back!</b> · du schläfst → <b>Schlaf!</b> · du brätst → <b>Brat!</b></li>
<li><b>основа на -d / -t</b> → добавя се -e: <b>Schneide!</b> · <b>Warte!</b> · <b>Arbeite!</b></li>
</ul>
<h4>sein и haben — неправилни</h4>
<table class="g"><tr><th></th><th>du</th><th>ihr</th><th>Sie</th></tr>
<tr><td>sein</td><td><b>Sei!</b></td><td><b>Seid!</b></td><td><b>Seien Sie!</b></td></tr>
<tr><td>haben</td><td><b>Hab!</b></td><td><b>Habt!</b></td><td><b>Haben Sie!</b></td></tr></table>
<p><i>Sei brav!</i> = Бъди послушен! · <i>Seid leise!</i> = Пазете тишина! · <i>Hab keine Angst!</i> = Не се страхувай!</p>
<p class="tip">🔑 Глаголът е <b>винаги първи</b>. Разделимата представка отива накрая: <i><b>Bereite</b> das Essen <b>zu</b>! · <b>Bieten</b> Sie Obst <b>an</b>!</i><br>
💡 <b>bitte</b> прави заповедта учтива: <i>Gib mir <b>bitte</b> das Salz!</i></p>
<h4>В рецептата</h4>
<p><i>Schäl die Äpfel. Schneide sie in kleine Stücke. Misch alles in einer Schüssel. Gib zwei Esslöffel Zucker dazu. Back die Mischung 30 Minuten.</i></p>`
  },
  {
    id: "wieoft", title: "Колко често? nie, einmal, dreimal pro Woche", icon: "🔁",
    html: `
<table class="g"><tr><th>колко често</th><th>значение</th></tr>
<tr><td><b>nie</b></td><td>никога (0)</td></tr>
<tr><td><b>einmal</b> pro Woche</td><td>веднъж седмично</td></tr>
<tr><td><b>zweimal</b> pro Woche</td><td>два пъти седмично</td></tr>
<tr><td><b>dreimal</b> am Tag</td><td>три пъти на ден</td></tr>
<tr><td><b>oft</b></td><td>често</td></tr>
<tr><td><b>normalerweise</b></td><td>обикновено</td></tr>
<tr><td><b>wöchentlich</b> · <b>täglich</b></td><td>всяка седмица · всеки ден</td></tr>
<tr><td><b>immer</b></td><td>винаги</td></tr></table>
<p>Число + <b>-mal</b> = пъти: ein<b>mal</b>, zwei<b>mal</b>, drei<b>mal</b>, zehn<b>mal</b>. После: <b>pro Woche</b> / <b>am Tag</b> / <b>im Monat</b>.</p>
<p><i>Ich esse <b>zweimal pro Woche</b> Fleisch.</i> · <i><b>Normalerweise</b> frühstücke ich um 7.</i> (времето отпред → глаголът пак е втори!)</p>
<p class="tip">💡 <b>nie</b> стои там, където би стоял <b>nicht</b>: <i>Ich esse <b>nie</b> Fleisch.</i> · <b>zum Frühstück</b> = за закуска (zu + dem = zum).</p>`
  },
  {
    id: "einkauf", title: "На пазара: eine Flasche, eine Dose, ein Becher", icon: "🛒",
    html: `
<p>Опаковка + храна, <b>без „von“</b> (както при eine Tasse Kaffee):</p>
<table class="g"><tr><th>опаковка</th><th>пример</th><th>превод</th></tr>
<tr><td><span class="art die">die</span> Flasche</td><td>eine Flasche Wasser / Wein</td><td>бутилка</td></tr>
<tr><td><span class="art die">die</span> Dose</td><td>eine Dose Tomaten / Ananas</td><td>консерва</td></tr>
<tr><td><span class="art der">der</span> Becher</td><td>ein Becher Joghurt / Sahne</td><td>кофичка</td></tr>
<tr><td><span class="art die">die</span> Packung</td><td>eine Packung Spaghetti / Kaffee</td><td>пакет</td></tr>
<tr><td><span class="art die">die</span> Tüte</td><td>eine Tüte Äpfel</td><td>торбичка</td></tr>
<tr><td><span class="art die">die</span> Tafel</td><td>eine Tafel Schokolade</td><td>блокче</td></tr>
<tr><td><span class="art das">das</span> Glas</td><td>ein Glas Honig / Marmelade</td><td>буркан</td></tr>
<tr><td><span class="art das">das</span> Stück</td><td>ein Stück Kuchen / Melone</td><td>парче</td></tr>
<tr><td><span class="art der">der</span> Liter · <span class="art das">das</span> Kilo</td><td>ein Liter Milch · ein Kilo Kirschen</td><td>литър · килограм</td></tr></table>
<h4>При зарзаватчията</h4>
<p><b>Sie wünschen?</b> (Какво желаете?) — <i>Ich hätte gern ein Kilo Tomaten.</i> — <b>Sonst noch etwas?</b> (Нещо друго?) — <i>Nein, danke. Das ist alles.</i></p>
<p class="tip">⚠️ <b>der Kunde → den Kunden</b>: някои мъжки думи получават -n в Akkusativ (като der Student → den Studenten). <i>Der Händler fragt den Kunden.</i></p>
<h4>sauer → saure</h4>
<p>Прилагателни на <b>-er</b> / <b>-el</b> губят <b>e</b> пред окончание: <i>sauer → <b>saure</b> Äpfel · teuer → ein <b>teures</b> Steak · dunkel → eine <b>dunkle</b> Küche</i>.</p>
<p class="tip">💡 <b>statt</b> = вместо: <i>Statt Kaffee trinke ich Tee.</i> · <b>bevorzugen</b> = предпочитам.</p>`
  },
  {
    id: "dativ", title: "Dativ: wem? (на кого?)", icon: "🎁",
    html: `
<p>Третият падеж. Отговаря на въпроса <b>Wem?</b> = <b>на кого?</b> На български често казваме „ми, ти, му“: <i>харесва <b>ми</b>, помагам <b>ти</b></i> — това е точно Dativ.</p>
<table class="g"><tr><th></th><th>въпрос</th><th>пример</th></tr>
<tr><td>Nominativ</td><td><b>Wer?</b> кой</td><td><b>Der Mann</b> isst.</td></tr>
<tr><td>Akkusativ</td><td><b>Wen? Was?</b> кого, какво</td><td>Ich sehe <b>den Mann</b>.</td></tr>
<tr><td><b>Dativ</b></td><td><b>Wem?</b> на кого</td><td>Der Käse schmeckt <b>dem Mann</b>.</td></tr></table>
<h4>Членовете в Dativ</h4>
<table class="g"><tr><th></th><th><span class="art der">der</span></th><th><span class="art die">die</span></th><th><span class="art das">das</span></th><th><span class="art pl">мн.ч.</span></th></tr>
<tr><td>Nominativ</td><td>der · ein · mein</td><td>die · eine · meine</td><td>das · ein · mein</td><td>die · meine</td></tr>
<tr><td><b>Dativ</b></td><td><b>dem · einem · meinem · keinem</b></td><td><b>der · einer · meiner · keiner</b></td><td><b>dem · einem · deinem · keinem</b></td><td><b>den</b> · meinen · keinen + <b>-n</b></td></tr></table>
<p class="tip">🔑 Трик: Dativ = окончания <b>-m</b> (мъжки и среден), <b>-r</b> (женски), <b>-n</b> (мн.ч.). В мн.ч. и съществителното получава <b>-n</b>: die Kinder → den Kinder<b>n</b>.</p>
<p><i><b>Dem</b> Mann schmeckt der Käse nicht. · Der Käse schmeckt <b>meiner</b> Frau nicht. · Die Forelle schmeckt <b>meinem</b> Sohn nicht. · Die Suppe schmeckt <b>den</b> Kinder<b>n</b> sehr gut.</i></p>
<h4>Местоименията в Dativ</h4>
<table class="g"><tr><th>Nominativ</th><th>Akkusativ</th><th><b>Dativ</b></th><th>превод</th></tr>
<tr><td>ich</td><td>mich</td><td><b>mir</b></td><td>на мен, ми</td></tr>
<tr><td>du</td><td>dich</td><td><b>dir</b></td><td>на теб, ти</td></tr>
<tr><td>er</td><td>ihn</td><td><b>ihm</b></td><td>на него, му</td></tr>
<tr><td>sie</td><td>sie</td><td><b>ihr</b></td><td>на нея, ѝ</td></tr>
<tr><td>es</td><td>es</td><td><b>ihm</b></td><td>на него (das), му</td></tr>
<tr><td>wir</td><td>uns</td><td><b>uns</b></td><td>на нас, ни</td></tr>
<tr><td>ihr</td><td>euch</td><td><b>euch</b></td><td>на вас, ви</td></tr>
<tr><td>sie / Sie</td><td>sie / Sie</td><td><b>ihnen / Ihnen</b></td><td>на тях / на Вас</td></tr></table>
<p class="tip">⚠️ <b>ihn</b> (Akk.) ≠ <b>ihm</b> (Dat.): <i>Ich sehe <b>ihn</b>.</i> (виждам го) · <i>Ich helfe <b>ihm</b>.</i> (помагам му)</p>
<h4>Глаголи, които искат Dativ</h4>
<p><b>schmecken, gefallen, gehören, helfen, danken, folgen, empfehlen</b> (+ какво в Akk.), <b>Es geht mir gut</b>, <b>Es tut mir leid</b>.</p>
<p><i>Das Buch <b>gehört mir</b>. · Ich <b>helfe dir</b>. · Ich <b>danke Ihnen</b>. · <b>Folgen</b> Sie <b>mir</b>! · Ich <b>empfehle Ihnen</b> den Fisch.</i></p>
<h4>schmecken и gefallen: обратно на българския ред</h4>
<p>Нещото, което харесваш, е <b>подлогът</b> (Nominativ). Ти си „на кого“ (Dativ) — точно като в „харесва <b>ми</b>“:</p>
<p><i><b>Der Film</b> gefällt <b>mir</b>.</i> = Филмът <b>ми</b> харесва. · <i><b>Die Erdbeeren</b> schmecken <b>dem Kind</b> nicht.</i> (мн.ч. → schmeck<b>en</b>)<br>
<i>Gefällt <b>Ihnen</b> der Film? — Ja, <b>er</b> gefällt <b>mir</b> sehr gut.</i> (er = der Film)</p>
<p class="tip">💡 <b>schmecken</b> = за храна · <b>gefallen</b> = за всичко друго (филм, град, рокля).</p>
<h4>Внимавай</h4>
<p><b>antworten auf</b> + Akk. = <b>beantworten</b> + Akk. (без auf): <i>Ich antworte <b>auf die Frage</b>. = Ich beantworte <b>die Frage</b>.</i><br>
<b>wohnen bei</b> + Dativ: <i>Ich wohne <b>bei meinen Eltern</b>.</i> = Живея при родителите си.</p>`
  },
  {
    id: "warhatte", title: "Минало: war и hatte", icon: "⏪",
    html: `
<p>За <b>sein</b> и <b>haben</b> германците казват миналото с една дума — <b>war</b> и <b>hatte</b>:</p>
<table class="g"><tr><th></th><th>sein → war (бях)</th><th>haben → hatte (имах)</th></tr>
<tr><td>ich</td><td><b>war</b></td><td><b>hatte</b></td></tr>
<tr><td>du</td><td>warst</td><td>hattest</td></tr>
<tr><td>er/sie/es</td><td><b>war</b></td><td><b>hatte</b></td></tr>
<tr><td>wir</td><td>waren</td><td>hatten</td></tr>
<tr><td>ihr</td><td>wart</td><td>hattet</td></tr>
<tr><td>sie/Sie</td><td>waren</td><td>hatten</td></tr></table>
<p class="tip">🔑 Пак <b>ich = er</b>, без окончание: ich war, er war · ich hatte, er hatte.</p>
<p><i>Wir <b>waren</b> in Rom. Das Essen <b>war</b> köstlich. Wir <b>hatten</b> Glück.</i></p>
<p>Другите глаголи имат три форми: <b>trinken – trank – hat getrunken</b> (пия – пих – пил съм). Засега само да ги разпознаваш.</p>
<h4>Сравнение: teuer – teurer – am teuersten</h4>
<p>При <b>-er</b> накрая e-то пада: teuer → <b>teurer</b> (не „teuerer“) → am teuersten.</p>`
  },
  {
    id: "kapani", title: "Капани: der See / die See, Bank – Bänke", icon: "🪤",
    html: `
<table class="g"><tr><th>дума</th><th>значение</th><th>трик</th></tr>
<tr><td><span class="art der">der</span> See · die Seen</td><td>езеро</td><td rowspan="2">членът сменя значението!</td></tr>
<tr><td><span class="art die">die</span> See</td><td>море (= das Meer)</td></tr>
<tr><td>die Bank → die <b>Banken</b></td><td>банки (за пари)</td><td rowspan="2">една дума, различно мн.ч.</td></tr>
<tr><td>die Bank → die <b>Bänke</b></td><td>пейки</td></tr>
<tr><td>die <b>Stadt</b> · die Städte</td><td>град</td><td rowspan="2">звучат почти еднакво</td></tr>
<tr><td>der <b>Staat</b> · die Staaten</td><td>държава</td></tr>
<tr><td>das <b>Bett</b> (кратко e)</td><td>легло</td><td rowspan="2">двойна съгласна = кратка гласна · двойна гласна = дълга</td></tr>
<tr><td>das <b>Beet</b> (дълго ee)</td><td>леха</td></tr></table>
<p class="tip">💡 Град + <b>-er</b> = прилагателно с главна буква и без окончание: <i>Wien → das <b>Wiener</b> Schnitzel · Berlin → der <b>Berliner</b> Dom</i>.</p>`
  },
  {
    id: "komposita", title: "Сложни думи и имена (das Hotelzimmer)", icon: "🧩",
    html: `
<p>Немският лепи думи една за друга. <b>Последната дума решава члена</b> (и множественото число):</p>
<table class="g"><tr><th>части</th><th>нова дума</th></tr>
<tr><td>das Telefon + <span class="art die">die</span> Nummer</td><td><span class="art die">die</span> Telefonnummer</td></tr>
<tr><td>das Internet + <span class="art der">der</span> Anschluss</td><td><span class="art der">der</span> Internetanschluss</td></tr>
<tr><td>das Hotel + <span class="art der">der</span> Schlüssel</td><td><span class="art der">der</span> Hotelschlüssel</td></tr>
<tr><td>das Hotel + <span class="art das">das</span> Zimmer</td><td><span class="art das">das</span> Hotelzimmer</td></tr>
<tr><td>das Hotel + das Zimmer + <span class="art der">der</span> Schlüssel</td><td><span class="art der">der</span> Hotelzimmerschlüssel</td></tr>
<tr><td>der Computer + <span class="art das">das</span> Programm</td><td><span class="art das">das</span> Computerprogramm</td></tr></table>
<p class="tip">💡 Понякога се добавя -s- за лепило: der Wirt + s + das Haus = das Wirt<b>s</b>haus, die Öffnung + s + die Zeit = die Öffnung<b>s</b>zeit.</p>
<h4>Прилагателни в имена — с главна буква</h4>
<p>В имена прилагателното се пише <b>с голяма буква</b>: <i>das <b>D</b>eutsche Museum, der <b>E</b>nglische Garten, die <b>S</b>üddeutsche Zeitung</i>.<br>
Иначе — с малка: <i>die <b>d</b>eutsche Sprache, eine <b>e</b>nglische Kollegin</i>. Окончанието се сменя както обикновено: <i>Ich besuche <b>den</b> Englisch<b>en</b> Garten.</i></p>
<h4>Wer? или Wen? (Kapitel 3, C9)</h4>
<p><b>sein</b> → двете страни са Nominativ: <i>Er ist <b>ein guter</b> Arzt.</i> (Wer?)<br>
Повечето глаголи искат Akkusativ (Wen? Was?): <i>Ich brauche <b>ein</b> Auto. Das Zimmer hat <b>einen</b> Fernseher. Sie besucht <b>ihren</b> Freund.</i></p>
<p class="tip">📋 Глаголи с Akkusativ: besuchen, bezahlen, brauchen, es gibt, essen, finden, haben, hören, kennen, kosten, lesen, machen, möchten, öffnen, parken, sehen, studieren, trinken, bewundern, umfassen.</p>`
  },
  {
    id: "faelle", title: "Падежите: карта (кой? кого? на кого?)", icon: "🗺️",
    html: `
<p>В немския всяко съществително „носи табела“ — <b>членът</b> показва каква роля има в изречението. На български ролята личи главно от реда на думите; на немски — от <b>der / den / dem</b>. Затова редът може да се мести, а смисълът остава.</p>
<h4>1. Задай въпроса — той казва падежа</h4>
<table class="g"><tr><th>роля</th><th>въпрос</th><th>падеж</th><th>пример</th></tr>
<tr><td>кой върши действието</td><td><b>Wer?</b> кой?</td><td><b>Nominativ</b></td><td><b>Der Mann</b> kocht.</td></tr>
<tr><td>върху кого/какво пада действието</td><td><b>Wen? Was?</b> кого? какво?</td><td><b>Akkusativ</b></td><td>Ich sehe <b>den Mann</b>.</td></tr>
<tr><td>получателят, „на кого“</td><td><b>Wem?</b> на кого?</td><td><b>Dativ</b></td><td>Ich helfe <b>dem Mann</b>.</td></tr></table>
<p class="tip">🔑 Бърз тест на български: ако можеш да кажеш „<b>го / я / ги</b>“ → Akkusativ. Ако казваш „<b>му / ѝ / им</b>“ (= на него) → Dativ. <i>Виждам <b>го</b> → ihn · Помагам <b>му</b> → ihm.</i></p>
<h4>2. Всички форми на едно място</h4>
<table class="g"><tr><th></th><th><span class="art der">der</span></th><th><span class="art die">die</span></th><th><span class="art das">das</span></th><th><span class="art pl">мн.ч.</span></th></tr>
<tr><td>Nominativ</td><td>der · ein</td><td>die · eine</td><td>das · ein</td><td>die · –</td></tr>
<tr><td>Akkusativ</td><td><b>den · einen</b></td><td>die · eine</td><td>das · ein</td><td>die · –</td></tr>
<tr><td>Dativ</td><td><b>dem · einem</b></td><td><b>der · einer</b></td><td><b>dem · einem</b></td><td><b>den</b> + -n</td></tr></table>
<p class="tip">💡 В Akkusativ се сменя <b>само мъжкият род</b> (der → den). Ако думата е die, das или мн.ч. — Akkusativ изглежда като Nominativ.</p>
<h4>3. Кой решава падежа?</h4>
<p><b>а) Глаголът.</b> Повечето глаголи искат Akkusativ: <i>haben, brauchen, sehen, kaufen, essen, trinken, besuchen, anrufen, lieben, kennen, finden, suchen…</i><br>
Малка група иска <b>Dativ</b> — научи ги като група: <b>helfen, danken, gefallen, schmecken, gehören, antworten, gratulieren</b> + <i>Wie geht es dir? Es tut mir leid.</i><br>
Някои искат и двете — <b>на кого</b> (Dat.) + <b>какво</b> (Akk.): <i>Ich gebe <b>dir</b> <b>das Buch</b>. Er empfiehlt <b>mir</b> <b>den Fisch</b>.</i></p>
<p><b>б) Предлогът</b> — той „командва“ и е по-силен от глагола:<br>
<b>+ Akkusativ:</b> für, ohne, gegen, durch, um, bis — <i>für <b>dich</b>, ohne <b>den</b> Kaffee</i><br>
<b>+ Dativ:</b> mit, bei, nach, aus, zu, von, seit, ab — <i>mit <b>dem</b> Auto, zu<b>r</b> Arbeit, bei <b>mir</b></i><br>
<b>in, an, auf:</b> къде? → Dativ (<i>im Büro</i>) · накъде? → Akkusativ (<i>ins Büro</i>)</p>
<p><b>в) sein / werden / heißen</b> — няма „обект“, двете страни са Nominativ: <i>Das ist <b>der</b> Chef. Er ist <b>ein</b> guter Lehrer.</i></p>
<h4>4. Строим изречение стъпка по стъпка</h4>
<table class="g"><tr><th>I.</th><th>II. глагол</th><th>…средата…</th><th>КРАЙ</th></tr>
<tr><td>Ich</td><td>gebe</td><td><b>dem Kind</b> (Dat.) <b>einen Apfel</b> (Akk.)</td><td>.</td></tr>
<tr><td>Morgen</td><td>rufe</td><td>ich <b>dich</b> (Akk.)</td><td><b>an</b>.</td></tr>
<tr><td>Ich</td><td>habe</td><td><b>meinem Bruder</b> (Dat.) <b>das Buch</b> (Akk.)</td><td><b>gegeben</b>.</td></tr>
<tr><td>Der Kuchen</td><td>schmeckt</td><td><b>mir</b> (Dat.)</td><td>.</td></tr></table>
<p class="tip">📏 Ред в средата: обикновено <b>Dativ преди Akkusativ</b> (<i>dem Kind einen Apfel</i>). Но ако Akkusativ е местоимение, то отива първо: <i>Ich gebe <b>ihn</b> dem Kind.</i></p>
<h4>5. Защо преводът не е „дума по дума“</h4>
<p><i>Der Film gefällt mir.</i> — буквално „Филмът харесва на мен“, на хубав български: „<b>Харесва ми</b> филмът“. <i>Wie geht es dir?</i> — буквално „Как върви на теб?“ → „<b>Как си?</b>“. <i>Ich habe Hunger.</i> — „Имам глад“ → „<b>Гладен съм</b>“. Учи изреченията като цели фрази, не като сбор от думи.</p>`
  },
  {
    id: "michmir", title: "mich или mir? dich или dir?", icon: "🎯",
    html: `
<p>Най-честата грешка на A1. Правилото е едно: <b>кого?</b> → <b>mich / dich</b> (Akkusativ) · <b>на кого?</b> → <b>mir / dir</b> (Dativ).</p>
<table class="g"><tr><th>Nominativ (кой?)</th><th>Akkusativ (кого?)</th><th>Dativ (на кого?)</th></tr>
<tr><td>ich</td><td><b>mich</b> — мен, ме</td><td><b>mir</b> — на мен, ми</td></tr>
<tr><td>du</td><td><b>dich</b> — теб, те</td><td><b>dir</b> — на теб, ти</td></tr>
<tr><td>er</td><td><b>ihn</b> — него, го</td><td><b>ihm</b> — на него, му</td></tr>
<tr><td>sie</td><td><b>sie</b> — нея, я</td><td><b>ihr</b> — на нея, ѝ</td></tr>
<tr><td>es</td><td><b>es</b> — него (das), го</td><td><b>ihm</b> — му</td></tr>
<tr><td>wir</td><td><b>uns</b></td><td><b>uns</b> (същото!)</td></tr>
<tr><td>ihr</td><td><b>euch</b></td><td><b>euch</b> (същото!)</td></tr>
<tr><td>sie / Sie</td><td><b>sie / Sie</b></td><td><b>ihnen / Ihnen</b></td></tr></table>
<p class="tip">🔑 Българският ти помага: <b>ме / те / го / я</b> = Akkusativ · <b>ми / ти / му / ѝ</b> = Dativ. <i>Обичам <b>те</b> → Ich liebe <b>dich</b>. · Благодаря <b>ти</b> → Ich danke <b>dir</b>.</i></p>
<h4>Кога е mich / dich (Akkusativ)?</h4>
<p>1. След повечето глаголи: <i>Er besucht <b>mich</b>. Ich rufe <b>dich</b> an. Kennst du <b>mich</b>? Ich sehe <b>dich</b>. Die Musik stört <b>mich</b>.</i><br>
2. След <b>für, ohne, gegen, um</b>: <i>Das Geschenk ist für <b>dich</b>. Ohne <b>mich</b>!</i><br>
3. При възвратни глаголи: <i>Ich freue <b>mich</b>. Setz <b>dich</b>!</i></p>
<h4>Кога е mir / dir (Dativ)?</h4>
<p>1. След <b>helfen, danken, gefallen, schmecken, gehören, antworten</b>: <i>Hilf <b>mir</b>! Das gefällt <b>dir</b>. Das Buch gehört <b>mir</b>.</i><br>
2. „Даваш нещо НА някого“ (geben, zeigen, schicken, empfehlen, erklären): <i>Gib <b>mir</b> das Salz! Ich zeige <b>dir</b> die Stadt.</i><br>
3. След <b>mit, bei, zu, von, nach, aus</b>: <i>Kommst du mit <b>mir</b>? Er wohnt bei <b>mir</b>. Das ist von <b>dir</b>.</i><br>
4. Изрази: <i>Wie geht es <b>dir</b>? Es tut <b>mir</b> leid. Mir ist kalt.</i></p>
<h4>Капани</h4>
<p>⚠️ <b>anrufen</b> = Akkusativ (на български „обаждам <b>ти</b> се“, но): <i>Ich rufe <b>dich</b> an.</i> ✔ — <s>Ich rufe dir an</s> ✘<br>
⚠️ <b>helfen</b> = Dativ (на български „помагам <b>ти</b>“ ✔ съвпада): <i>Ich helfe <b>dir</b>.</i><br>
⚠️ <b>fragen</b> = Akkusativ: <i>Ich frage <b>dich</b>.</i> (питам те) · <b>antworten</b> = Dativ: <i>Ich antworte <b>dir</b>.</i> (отговарям ти)<br>
⚠️ <b>ihr</b> е две неща: Dativ на „sie“ (<i>Ich helfe <b>ihr</b></i> = помагам ѝ) и подлог „вие“ (<i><b>Ihr</b> seid da</i>).</p>
<h4>Двете в едно изречение</h4>
<p><i>Kannst du <b>mir</b> (на кого) <b>das Buch</b> (какво) geben?</i> · <i>Ich schenke <b>dir</b> <b>einen Hund</b>.</i> · <i>Er zeigt <b>uns</b> <b>die Stadt</b>.</i></p>`
  },
  {
    id: "perfekt", title: "Perfekt: Ich habe gemacht / Ich bin gefahren", icon: "⏮️",
    html: `
<p>Когато германците <b>разказват устно какво е станало</b>, използват почти винаги <b>Perfekt</b>. (Изключение: <b>war</b> и <b>hatte</b> — за sein и haben се казва Präteritum, виж „war и hatte“.)</p>
<p><b>Формула:</b> <b>haben</b> или <b>sein</b> (спрегнато, на 2-ро място) + <b>Partizip II</b> (в самия край).</p>
<table class="g"><tr><th>I.</th><th>II. haben/sein</th><th>…</th><th>КРАЙ: Partizip II</th></tr>
<tr><td>Ich</td><td><b>habe</b></td><td>ein Eis</td><td><b>gekauft</b>.</td></tr>
<tr><td>Gestern</td><td><b>bin</b></td><td>ich nach Berlin</td><td><b>gefahren</b>.</td></tr>
<tr><td>Um 10.30 Uhr</td><td><b>hat</b></td><td>er Frau Körner</td><td><b>angerufen</b>.</td></tr>
<tr><td><b>Hast</b></td><td>du</td><td>schon</td><td><b>gefrühstückt</b>?</td></tr></table>
<p class="tip">🧱 Същата „скоба“ като при модалните глаголи: <i>Ich <b>muss</b> … <b>lesen</b>. → Ich <b>habe</b> … <b>gelesen</b>.</i> На 2-ро място е само помощният глагол.</p>
<h4>1. haben или sein?</h4>
<table class="g"><tr><th>sein</th><th>haben</th></tr>
<tr><td><b>движение от А до Б</b>: gehen, kommen, fahren, fliegen, laufen, reisen, ankommen<br><b>промяна на състоянието</b>: aufstehen, einschlafen, sterben, ertrinken, werden<br>+ <b>sein</b> и <b>bleiben</b></td><td><b>всички останали</b> (≈ 90%): machen, kaufen, essen, lesen, schlafen, arbeiten, anrufen, sehen, frühstücken…<br>и всички с Akkusativ-обект</td></tr></table>
<p class="tip">💡 Тест: „Тръгнах ли от едно място/състояние към друго?“ → sein. <i>Ich <b>bin</b> eingeschlafen</i> (буден → спя), но <i>Ich <b>habe</b> geschlafen</i> (просто съм спал — няма промяна).</p>
<h4>2. Как се прави Partizip II?</h4>
<table class="g"><tr><th>вид</th><th>правило</th><th>примери</th></tr>
<tr><td><b>слаби (правилни)</b></td><td>ge- + корен + <b>-t</b></td><td>kaufen → <b>ge</b>kauf<b>t</b> · machen → <b>ge</b>mach<b>t</b> · arbeiten → <b>ge</b>arbeit<b>et</b> (корен на -t/-d → -et)</td></tr>
<tr><td><b>силни (неправилни)</b></td><td>ge- + корен (често друга гласна) + <b>-en</b></td><td>schlafen → <b>ge</b>schlaf<b>en</b> · fahren → <b>ge</b>fahr<b>en</b> · gehen → <b>ge</b>g<b>a</b>ng<b>en</b> · schreiben → <b>ge</b>schr<b>ie</b>b<b>en</b></td></tr>
<tr><td><b>разделими</b></td><td>представка + <b>ge</b> + …</td><td>an<b>ge</b>rufen · auf<b>ge</b>standen · ein<b>ge</b>kauft · fern<b>ge</b>sehen · ein<b>ge</b>schlafen</td></tr>
<tr><td><b>неразделими</b> (be-, ver-, er-, ge-, über-, emp-, ent-, zer-)</td><td><b>без ge-</b></td><td><b>be</b>gonnen · <b>ver</b>einbart · <b>über</b>setzt · <b>be</b>zahlt · <b>er</b>trunken · <b>be</b>sucht</td></tr>
<tr><td><b>на -ieren</b></td><td><b>без ge-</b>, винаги -t</td><td>telefonier<b>t</b> · reservier<b>t</b> · reparier<b>t</b> · studier<b>t</b></td></tr></table>
<h4>3. Таблиците от учебника</h4>
<table class="g"><tr><th></th><th>без представка</th><th>разделим</th><th>неразделим</th></tr>
<tr><td>ich</td><td>habe <b>ge</b>schlafen</td><td>habe an<b>ge</b>rufen</td><td>habe begonnen</td></tr>
<tr><td>du</td><td>hast <b>ge</b>schlafen</td><td>hast an<b>ge</b>rufen</td><td>hast begonnen</td></tr>
<tr><td>er/sie/es</td><td>hat <b>ge</b>schlafen</td><td>hat an<b>ge</b>rufen</td><td>hat begonnen</td></tr>
<tr><td>wir</td><td>haben <b>ge</b>schlafen</td><td>haben an<b>ge</b>rufen</td><td>haben begonnen</td></tr><tr><td>ihr</td><td>habt <b>ge</b>schlafen</td><td>habt an<b>ge</b>rufen</td><td>habt begonnen</td></tr><tr><td>sie/Sie</td><td>haben <b>ge</b>schlafen</td><td>haben an<b>ge</b>rufen</td><td>haben begonnen</td></tr></table>
<p class="tip">⚠️ В таблицата от учебника (Kapitel 5, Teil C) при wir/ihr/sie пише <b>sind/seid geschlafen</b> — това е печатна грешка: schlafen е винаги с <b>haben</b> (wir <b>haben</b> geschlafen).</p>
<table class="g"><tr><th></th><th>haben + gekauft</th><th>sein + gereist</th></tr>
<tr><td>ich</td><td>habe gekauft</td><td>bin gereist</td></tr><tr><td>du</td><td>hast gekauft</td><td>bist gereist</td></tr>
<tr><td>er/sie/es</td><td>hat gekauft</td><td>ist gereist</td></tr><tr><td>wir</td><td>haben gekauft</td><td>sind gereist</td></tr>
<tr><td>ihr</td><td>habt gekauft</td><td>seid gereist</td></tr><tr><td>sie/Sie</td><td>haben gekauft</td><td>sind gereist</td></tr></table>
<h4>4. Силните глаголи от урока (учи ги с трите форми)</h4>
<table class="g"><tr><th>инфинитив</th><th>Präteritum</th><th>Perfekt</th></tr>
<tr><td>schlafen</td><td>schlief</td><td>hat geschlafen</td></tr><tr><td>anrufen</td><td>rief an</td><td>hat angerufen</td></tr>
<tr><td>beginnen</td><td>begann</td><td>hat begonnen</td></tr><tr><td>aufstehen</td><td>stand auf</td><td><b>ist</b> aufgestanden</td></tr>
<tr><td>gehen</td><td>ging</td><td><b>ist</b> gegangen</td></tr><tr><td>kommen</td><td>kam</td><td><b>ist</b> gekommen</td></tr>
<tr><td>fahren</td><td>fuhr</td><td><b>ist</b> gefahren</td></tr><tr><td>sterben</td><td>starb</td><td><b>ist</b> gestorben</td></tr>
<tr><td>ertrinken</td><td>ertrank</td><td><b>ist</b> ertrunken</td></tr><tr><td>einschlafen</td><td>schlief ein</td><td><b>ist</b> eingeschlafen</td></tr>
<tr><td>lesen</td><td>las</td><td>hat gelesen</td></tr><tr><td>schreiben</td><td>schrieb</td><td>hat geschrieben</td></tr>
<tr><td>sehen</td><td>sah</td><td>hat gesehen</td></tr><tr><td>essen</td><td>aß</td><td>hat gegessen</td></tr>
<tr><td>trinken</td><td>trank</td><td>hat getrunken</td></tr><tr><td>laufen</td><td>lief</td><td><b>ist</b> gelaufen</td></tr></table>
<h4>5. Как се превежда?</h4>
<p>Perfekt = българското минало свършено: <i>Ich habe gegessen</i> → „<b>Ядох</b>“ / „<b>Ял съм</b>“. Не превеждай „имам ядено“ — <b>haben</b> тук не значи „имам“, а е само помощна дума.</p>
<p><i>Was hast du gestern gemacht?</i> = Какво прави вчера? · <i>Ich bin ins Kino gegangen.</i> = Отидох на кино.</p>`
  },
  {
    id: "uhrzeit", title: "Колко е часът? halb, Viertel, vor, nach", icon: "🕒",
    html: `
<p>Има два начина да кажеш часа: <b>официално</b> (по радиото, гарата) и <b>разговорно</b> (между хората).</p>
<table class="g"><tr><th>часовник</th><th>официално</th><th>разговорно</th></tr>
<tr><td>13:00</td><td>dreizehn Uhr</td><td>(es ist) <b>eins</b> / ein Uhr</td></tr>
<tr><td>17:15</td><td>siebzehn Uhr fünfzehn</td><td><b>Viertel nach fünf</b></td></tr>
<tr><td>14:30</td><td>vierzehn Uhr dreißig</td><td><b>halb drei</b> ⚠️</td></tr>
<tr><td>18:45</td><td>achtzehn Uhr fünfundvierzig</td><td><b>Viertel vor sieben</b></td></tr>
<tr><td>16:10</td><td>sechzehn Uhr zehn</td><td><b>zehn nach vier</b></td></tr>
<tr><td>20:55</td><td>zwanzig Uhr fünfundfünfzig</td><td><b>fünf vor neun</b></td></tr></table>
<p class="tip">⚠️ <b>halb</b> гледа НАПРЕД: <i>halb drei</i> = половин час <b>до</b> три = <b>2:30</b>, не 3:30! Мисли си „половината на третия час“.</p>
<h4>Писане и говорене</h4>
<p>Пише се <b>14.30 Uhr</b> (с точка), казва се „vierzehn Uhr dreißig“. „Uhr“ стои между часа и минутите.</p>
<h4>Минутите около „halb“ (разговорно)</h4>
<p>14:25 = fünf <b>vor halb</b> drei · 14:35 = fünf <b>nach halb</b> drei (често в Германия; можеш и просто „vierzehn Uhr fünfunddreißig“).</p>
<h4>Wann? (кога) ≠ Wie lange? (колко време)</h4>
<table class="g"><tr><th>въпрос</th><th>отговор</th></tr>
<tr><td><b>Wie spät ist es?</b> / Wie viel Uhr ist es?</td><td><b>Es ist</b> halb acht. (без um!)</td></tr>
<tr><td><b>Wann</b> beginnt das Konzert?</td><td><b>Um</b> 20 Uhr. (момент → um)</td></tr>
<tr><td><b>Wie lange</b> dauert das Konzert?</td><td>Es dauert <b>drei Stunden</b>. / <b>von</b> 20 <b>bis</b> 23 Uhr.</td></tr>
<tr><td>от кога нататък?</td><td><b>Ab</b> 19 Uhr sieht Martin fern.</td></tr></table>
<h4>Продължителност</h4>
<p>½ = <b>eine halbe Stunde</b> (30 мин.) · 1½ = <b>anderthalb</b> / eineinhalb <b>Stunden</b> (90 мин.) · 2½ = <b>zweieinhalb Stunden</b> (150 мин.) · ¼ = <b>eine Viertelstunde</b> (15 мин.)</p>
<p class="tip">💡 Над един час → мн.ч.: <i>anderthalb Stunde<b>n</b></i>. Затова „eine anderthalb Stunde“ е грешно.</p>
<h4>Как се превежда?</h4>
<p><i>Es ist Viertel vor sieben.</i> → „Седем без петнайсет е.“ (не „четвърт преди седем“) · <i>Es ist zehn nach vier.</i> → „Четири и десет е.“</p>`
  },
  {
    id: "alltag", title: "Денят ми: разделими глаголи, zuerst/dann, müssen/sollen", icon: "☀️",
    html: `
<h4>1. Разделимите глаголи в дневния режим</h4>
<p>Представката (<b>auf-, an-, ein-, fern-, zurück-, ab-</b>) отива <b>в края</b>, а глаголът стои на 2-ро място:</p>
<table class="g"><tr><th>I.</th><th>II.</th><th>…</th><th>КРАЙ</th></tr>
<tr><td>Um 8 Uhr</td><td><b>steht</b></td><td>Martin</td><td><b>auf</b>.</td></tr>
<tr><td>Um 9.30 Uhr</td><td><b>fängt</b></td><td>er mit der Arbeit</td><td><b>an</b>.</td></tr>
<tr><td>Er</td><td><b>ruft</b></td><td>Frau Körner</td><td><b>an</b>.</td></tr>
<tr><td>Ab 19 Uhr</td><td><b>sieht</b></td><td>Martin</td><td><b>fern</b>.</td></tr></table>
<p><b>НЕ</b> се отделят: <b>be-, ver-, er-, ge-, emp-, ent-, zer-</b> (+ über- в „übersetzen“): <i>Ich <b>vereinbare</b> einen Termin. Ich <b>bezahle</b>. Ich <b>übersetze</b> den Brief.</i></p>
<p class="tip">🔊 Ударението подсказва: разделимите са с ударение на представката (<b>AN</b>rufen, <b>AUF</b>stehen), неразделимите — на корена (ver<b>EIN</b>baren, be<b>ZAH</b>len, über<b>SET</b>zen).</p>
<h4>2. zuerst – dann – danach – zum Schluss</h4>
<p>Тези думи заемат <b>1-во място</b> → глаголът остава на 2-ро, подлогът минава <b>след</b> него:</p>
<p><i><b>Zuerst</b> liest er seine E-Mails. <b>Dann</b> ruft er die Firma an. <b>Danach</b> fährt er zum Flughafen. <b>Zum Schluss</b> bucht er einen Flug.</i></p>
<p class="tip">⚠️ Не казвай <s>Dann er fährt</s> — на немски е <b>Dann fährt er</b>. Същото след часовете: <i>Um 8 Uhr <b>steht er</b> auf.</i></p>
<h4>3. müssen и sollen</h4>
<table class="g"><tr><th></th><th>müssen</th><th>sollen</th></tr>
<tr><td>ich</td><td>muss</td><td>soll</td></tr><tr><td>du</td><td>musst</td><td>sollst</td></tr><tr><td>er/sie/es</td><td><b>muss</b></td><td><b>soll</b></td></tr>
<tr><td>wir</td><td>müssen</td><td>sollen</td></tr><tr><td>ihr</td><td>müsst</td><td>sollt</td></tr><tr><td>sie/Sie</td><td>müssen</td><td>sollen</td></tr></table>
<p><b>müssen</b> = необходимо е (аз самият трябва): <i>Ich <b>muss</b> heute 55 E-Mails <b>beantworten</b>.</i><br>
<b>sollen</b> = някой друг ми казва / очаква: <i>Der Chef sagt: Die Sekretärin <b>soll</b> ein Hotelzimmer <b>buchen</b>.</i><br>
<b>Soll ich …?</b> = предложение „Да … ли?“: <i><b>Soll ich</b> Spaghetti kochen? – Ja, bitte! / Nein, das brauchst du nicht.</i></p>
<p class="tip">🧱 Вторият глагол (инфинитив) е <b>в края</b>. При разделим глагол остава цял: <i>Ich muss Frau Körner <b>anrufen</b>.</i></p>
<h4>4. Предлози за деня</h4>
<p><b>um</b> 8 Uhr (в колко) · <b>von</b> 13 <b>bis</b> 13.30 Uhr (от … до) · <b>ab</b> 19 Uhr (от … нататък) · <b>mit dem</b> Auto (с какво) · <b>zur</b> Arbeit (накъде, die → zur) · <b>ins</b> Bett (накъде, das → ins) · <b>zu Hause</b> (къде) · <b>nach Hause</b> (накъде)</p>`
  },
];

// ───────── урок 15 ─────────
GRAMMAR.push(
  {
    id: "zeiten", title: "Трите времена: Präsens, Präteritum, Perfekt", icon: "🕰️",
    html: `
<p>Едно действие — три начина да го кажеш. Разликата <b>не е</b> кога е станало (Präteritum и Perfekt са <b>едно и също минало</b>), а <b>къде</b> го казваш.</p>
<table class="g"><tr><th>Време</th><th>Пример</th><th>Как се прави</th><th>Кога</th></tr>
<tr><td><b>Präsens</b></td><td>Ich <b>gehe</b> einkaufen.</td><td>1 глагол, сегашна форма</td><td>сега, всеки ден, и бъдеще (Morgen gehe ich …)</td></tr>
<tr><td><b>Präteritum</b></td><td>Ich <b>ging</b> einkaufen.</td><td>1 глагол, минала форма (-te или нова гласна)</td><td>в <b>писмен</b> разказ, книги, новини · и в говора за <b>war, hatte</b>, musste, konnte</td></tr>
<tr><td><b>Perfekt</b></td><td>Ich <b>bin</b> einkaufen <b>gegangen</b>.</td><td>haben/sein + Partizip II в края</td><td>в <b>говора</b> — когато разказваш на някого</td></tr>
<tr><td>Plusquamperfekt</td><td>Vorher <b>hatte</b> ich <b>gefrühstückt</b>.</td><td>hatte/war + Partizip II</td><td>минало <b>преди</b> друго минало („бях закусил“)</td></tr></table>
<p class="tip">🗣️ Практичното правило за разговор: <b>sein и haben → war, hatte</b>; <b>всичко друго → Perfekt</b>. <i>Gestern <b>war</b> ich müde. Ich <b>hatte</b> keine Zeit. Ich <b>habe</b> nichts <b>gegessen</b>.</i></p>
<h4>Как да позная времето?</h4>
<ul><li>Има <b>habe/hast/hat/bin/ist…</b> + дума с <b>ge-…-t/-en</b> в края → <b>Perfekt</b>.</li>
<li>Има <b>hatte/war</b> + Partizip II в края → <b>Plusquamperfekt</b>.</li>
<li>Само един глагол с <b>-te</b> (kaufte, arbeitete) или непозната гласна (ging, las, fuhr, aß) → <b>Präteritum</b>.</li>
<li>Само един глагол в сегашна форма (gehe, liest, fährt) → <b>Präsens</b>.</li></ul>
<h4>Сигнални думи</h4>
<table class="g"><tr><th>минало</th><th>сегашно</th></tr>
<tr><td>gestern (вчера), vorgestern (онзи ден), letzte Woche, letztes Jahr, früher, vorher</td><td>jetzt, heute, jeden Tag, immer, oft, morgen (бъдеще с Präsens)</td></tr></table>
<h4>Един глагол — три изречения</h4>
<table class="g"><tr><th>Präsens</th><th>Präteritum</th><th>Perfekt</th></tr>
<tr><td>Martin <b>steht</b> um 7 Uhr <b>auf</b>.</td><td>Martin <b>stand</b> um 7 Uhr <b>auf</b>.</td><td>Martin <b>ist</b> um 7 Uhr <b>aufgestanden</b>.</td></tr>
<tr><td>Ich <b>arbeite</b> bis 18 Uhr.</td><td>Ich <b>arbeitete</b> bis 18 Uhr.</td><td>Ich <b>habe</b> bis 18 Uhr <b>gearbeitet</b>.</td></tr>
<tr><td>Wir <b>haben</b> kein Benzin.</td><td>Wir <b>hatten</b> kein Benzin.</td><td>Wir <b>haben</b> kein Benzin <b>gehabt</b>.</td></tr>
<tr><td>Er <b>isst</b> nichts.</td><td>Er <b>aß</b> nichts.</td><td>Er <b>hat</b> nichts <b>gegessen</b>.</td></tr></table>
<p class="tip">⚠️ Капани: (1) В Perfekt <b>не</b> превеждай „habe“ като „имам“ — то само показва минало. (2) Разделимите глаголи и в Präteritum хвърлят представката в края: Ich <b>kaufte</b> im Supermarkt <b>ein</b>. (3) На български „работих“ и „работил съм“ — немският Perfekt превеждаме най-често с обикновеното минало („работих“).</p>`,
  },
  {
    id: "praeteritum", title: "Präteritum: ging, kaufte, war, hatte", icon: "⏪",
    html: `
<p>Präteritum е <b>един</b> глагол в минала форма. Има два вида глаголи:</p>
<h4>1. Слаби (правилни) глаголи: корен + <b>-te</b></h4>
<table class="g"><tr><th></th><th>machen</th><th>arbeiten</th><th>einkaufen</th></tr>
<tr><td>ich</td><td>mach<b>te</b></td><td>arbeit<b>ete</b></td><td>kauf<b>te</b> … ein</td></tr>
<tr><td>du</td><td>mach<b>test</b></td><td>arbeit<b>etest</b></td><td>kauf<b>test</b> … ein</td></tr>
<tr><td>er/sie/es</td><td>mach<b>te</b></td><td>arbeit<b>ete</b></td><td>kauf<b>te</b> … ein</td></tr>
<tr><td>wir</td><td>mach<b>ten</b></td><td>arbeit<b>eten</b></td><td>kauf<b>ten</b> … ein</td></tr>
<tr><td>ihr</td><td>mach<b>tet</b></td><td>arbeit<b>etet</b></td><td>kauf<b>tet</b> … ein</td></tr>
<tr><td>sie/Sie</td><td>mach<b>ten</b></td><td>arbeit<b>eten</b></td><td>kauf<b>ten</b> … ein</td></tr></table>
<p class="tip">Коренът свършва на -t/-d (arbeit-, send-, wart-) → вмъква се <b>e</b>: arbeit<b>e</b>te, send<b>e</b>te. Същото като в Präsens: du arbeit<b>e</b>st.</p>
<h4>2. Силни (неправилни) глаголи: нова гласна, <b>без -te</b></h4>
<table class="g"><tr><th></th><th>gehen</th><th>fahren</th><th>lesen</th><th>sein</th><th>haben</th></tr>
<tr><td>ich</td><td>ging</td><td>fuhr</td><td>las</td><td>war</td><td>hatte</td></tr>
<tr><td>du</td><td>ging<b>st</b></td><td>fuhr<b>st</b></td><td>las<b>est</b></td><td>war<b>st</b></td><td>hatte<b>st</b></td></tr>
<tr><td>er/sie/es</td><td>ging</td><td>fuhr</td><td>las</td><td>war</td><td>hatte</td></tr>
<tr><td>wir</td><td>ging<b>en</b></td><td>fuhr<b>en</b></td><td>las<b>en</b></td><td>war<b>en</b></td><td>hatte<b>n</b></td></tr>
<tr><td>ihr</td><td>ging<b>t</b></td><td>fuhr<b>t</b></td><td>las<b>t</b></td><td>war<b>t</b></td><td>hatte<b>t</b></td></tr>
<tr><td>sie/Sie</td><td>ging<b>en</b></td><td>fuhr<b>en</b></td><td>las<b>en</b></td><td>war<b>en</b></td><td>hatte<b>n</b></td></tr></table>
<p class="tip">🔑 Най-важното: <b>ich и er са еднакви и без окончание</b> (ich ging = er ging, ich machte = er machte). Останалите окончания са като в Präsens (-st, -en, -t, -en).</p>
<h4>Списъкът от урока (учи по три форми)</h4>
<table class="g"><tr><th>инфинитив</th><th>Präteritum</th><th>Perfekt</th></tr>
<tr><td>sein</td><td>war</td><td>ist gewesen</td></tr><tr><td>haben</td><td>hatte</td><td>hat gehabt</td></tr><tr><td>tun</td><td>tat</td><td>hat getan</td></tr>
<tr><td>gehen</td><td>ging</td><td>ist gegangen</td></tr><tr><td>fahren</td><td>fuhr</td><td>ist gefahren</td></tr><tr><td>laufen</td><td>lief</td><td>ist gelaufen</td></tr>
<tr><td>ankommen</td><td>kam an</td><td>ist angekommen</td></tr><tr><td>aufstehen</td><td>stand auf</td><td>ist aufgestanden</td></tr><tr><td>zurückfahren</td><td>fuhr zurück</td><td>ist zurückgefahren</td></tr>
<tr><td>lesen</td><td>las</td><td>hat gelesen</td></tr><tr><td>sehen / fernsehen</td><td>sah / sah fern</td><td>hat (fern)gesehen</td></tr><tr><td>essen</td><td>aß</td><td>hat gegessen</td></tr>
<tr><td>vergessen</td><td>vergaß</td><td>hat vergessen</td></tr><tr><td>schreiben</td><td>schrieb</td><td>hat geschrieben</td></tr><tr><td>anrufen</td><td>rief an</td><td>hat angerufen</td></tr>
<tr><td>anfangen</td><td>fing an</td><td>hat angefangen</td></tr><tr><td>machen, kaufen, kochen</td><td>machte, kaufte, kochte</td><td>hat gemacht, gekauft, gekocht</td></tr>
<tr><td>arbeiten</td><td>arbeitete</td><td>hat gearbeitet</td></tr><tr><td>frühstücken</td><td>frühstückte</td><td>hat gefrühstückt</td></tr><tr><td>einkaufen</td><td>kaufte ein</td><td>hat eingekauft</td></tr>
<tr><td>studieren</td><td>studierte</td><td>hat studiert</td></tr><tr><td>vereinbaren</td><td>vereinbarte</td><td>hat vereinbart</td></tr></table>
<h4>tun (правя)</h4>
<table class="g"><tr><th></th><th>Präsens</th><th>Präteritum</th></tr><tr><td>ich</td><td>tue</td><td>tat</td></tr><tr><td>du</td><td>tust</td><td>tatest</td></tr><tr><td>er/sie/es</td><td>tut</td><td>tat</td></tr><tr><td>wir</td><td>tun</td><td>taten</td></tr><tr><td>ihr</td><td>tut</td><td>tatet</td></tr><tr><td>sie/Sie</td><td>tun</td><td>taten</td></tr></table>
<p><i>Ich habe viel zu tun.</i> = Имам много работа. · <i>(Es) tut mir leid.</i> = Съжалявам.</p>
<p class="tip">📝 Поправки от бележките: fuhr zurück (не „führ“), aß, vergaß (с ß), sah fern, <b>das</b> Benzin, Du Armer!</p>`,
  },
  {
    id: "computer", title: "На компютъра: глаголи и Perfekt", icon: "💻",
    html: `
<table class="g"><tr><th>с какво?</th><th>глаголи</th></tr>
<tr><td>den Computer / den Drucker</td><td>einschalten (включвам) · ausschalten (изключвам) · anschließen (свързвам)</td></tr>
<tr><td>den Text / die Daten</td><td>speichern (запазвам) · kopieren · ausschneiden (изрязвам) · einfügen (поставям) · löschen (трия) · ausdrucken (разпечатвам)</td></tr>
<tr><td>eine E-Mail</td><td>schreiben · senden (изпращам) · weiterleiten (препращам) · erhalten (получавам)</td></tr></table>
<h4>Разделими: представката в края</h4>
<p><i>Ich <b>schalte</b> den Computer <b>ein</b>.</i> · <i>Bitte <b>drucken</b> Sie den Text <b>aus</b>!</i> · <i>Man muss den Drucker <b>anschließen</b>.</i> (с модален глагол — цял в края)</p>
<h4>Perfekt</h4>
<table class="g"><tr><th>разделими: ge в средата</th><th>без ge-</th><th>обикновени</th></tr>
<tr><td>ein<b>ge</b>schaltet, aus<b>ge</b>schaltet, an<b>ge</b>schlossen, aus<b>ge</b>druckt, weiter<b>ge</b>leitet, ein<b>ge</b>fügt, aus<b>ge</b>schnitten</td><td>kopiert (-ieren), erhalten (er-)</td><td>gespeichert, gelöscht, gesendet</td></tr></table>
<p><b>Какво се обърка?</b> <i>Der Text ist weg. Du hast <b>ihn</b> nicht <b>gespeichert</b>.</i> — <b>ihn</b> = der Text (Akkusativ), отрицанието <b>nicht</b> е точно преди Partizip II.</p>`,
  },
);
