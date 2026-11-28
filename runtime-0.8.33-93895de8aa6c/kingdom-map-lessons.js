export const kingdomMap = {
  overview:'https://www.metmuseum.org/perspectives/cyrus-and-the-judean-diaspora',
  kingdoms:[
    ['israel',['İsrail Krallığı','Kingdom of Israel','ממלכת ישראל','İsrail Krallığı']],
    ['judah',['Yehuda Krallığı','Kingdom of Judah','ממלכת יהודה','Yəhuda Krallığı']],
  ],
  cities:[
    {
      id:'samaria', kingdom:'israel', point:[102,39],
      name:['Samiriye · kuzey','Samaria · north','שומרון · צפון','Samariya · şimal'],
      source:'https://www.sefaria.org/I_Kings.16.23-24',
      text:[
        'I. Krallar 16:23–24’e göre Omri önce Tirsa’da hüküm sürdü. Ardından Samiriye tepesine bir kent kurdu. Samiriye, kuzeydeki İsrail Krallığı’nın sonraki yönetim merkeziydi.',
        'In I Kings 16:23–24, Omri first reigns in Tirzah and later builds a city on the hill of Samaria. Samaria became a later political center of the northern Kingdom of Israel.',
        'לפי מלכים א׳ ט״ז:כ״ג–כ״ד, עמרי מלך תחילה בתרצה. אחר כך בנה עיר בהר שומרון. שומרון הייתה מרכז שלטוני מאוחר יותר של ממלכת ישראל שבצפון.',
        'I Padşahlar 16:23–24-ə görə Omri əvvəlcə Tirsada hökm sürüb. Sonra Samariya təpəsində şəhər salıb. Samariya şimaldakı İsrail Krallığının sonrakı idarə mərkəzi idi.',
      ],
    },
    {
      id:'jerusalem', kingdom:'judah', point:[113,87],
      name:['Kudüs · güney','Jerusalem · south','ירושלים · דרום','Yerusəlim · cənub'],
      source:'https://www.sefaria.org/II_Kings.18.1-2',
      text:[
        'II. Krallar 18:1–2, kuzeyde Hoşea hüküm sürerken Hizkiya’nın Yehuda kralı olduğunu ve Kudüs’te hüküm sürdüğünü anlatır. Böylece aynı dönemde iki ayrı yönetim merkezi görülür.',
        'II Kings 18:1–2 describes Hezekiah becoming king of Judah and reigning from Jerusalem while Hoshea reigned in the north. The passage gives us two political centers in the same period.',
        'מלכים ב׳ י״ח:א׳–ב׳ מספר שחזקיהו נעשה מלך יהודה ומלך בירושלים בימי הושע שבצפון. הקטע מתאר שני מרכזי שלטון באותה תקופה.',
        'II Padşahlar 18:1–2 şimalda Huşə hökm sürərkən Xizqiyanın Yəhuda padşahı olduğunu və Yerusəlimdə hökm sürdüyünü danışır. Parça eyni dövrdə iki idarə mərkəzini göstərir.',
      ],
    },
  ],
};

const copy = [
  ['MÖ 8. yüzyılın sonları. İki kenti ait oldukları krallıklarla eşleştir.', 'Şema Samiriye’yi kuzeyde, Kudüs’ü güneyde gösterir. Noktalar kentlerin göreli konumlarını işaretler.', 'Diğer krallığı dene. Haritadaki kuzey ve güneye bak.', 'İlgili pasajı aç','İki krallık hakkında Met Müzesi’nin yazısını oku'],
  ['Late eighth century BCE. Match each city to its kingdom.', 'The diagram places Samaria to the north and Jerusalem to the south. The dots mark their relative locations.', 'Look at the north and south positions and try the other kingdom.', 'Read the passage','Read the Met’s account of the two kingdoms'],
  ['סוף המאה השמינית לפנה״ס. התאימו כל עיר לממלכה שלה.', 'התרשים מציג את שומרון בצפון ואת ירושלים בדרום. הנקודות מסמנות את מיקומן היחסי.', 'הביטו במיקומים בצפון ובדרום ונסו את הממלכה השנייה.', 'קראו את הקטע','קראו על שתי הממלכות באתר מוזיאון המטרופוליטן'],
  ['E.ə. VIII əsrin sonları. Hər şəhəri aid olduğu krallıqla uyğunlaşdır.', 'Sxem Samariyanı şimalda, Yerusəlimi cənubda göstərir. Nöqtələr şəhərlərin bir-birinə görə yerini bildirir.', 'Şimal və cənubdakı yerlərə bax, o biri krallığı seç.', 'Mətn parçasını oxu','İki krallıq haqqında Met Muzeyinin yazısını oxu'],
];

function drawMap(canvas, answers) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const {width,height} = canvas;
  ctx.fillStyle = '#527f88';
  ctx.fillRect(0,0,width,height);
  const coastline = [64,62,63,59,57,56,53,50,48,43,40,38,37,35,30,29];
  for (const [row,left] of coastline.entries()) {
    const y = row * 8;
    ctx.fillStyle = '#b7a274';
    ctx.fillRect(left,y,width-left,8);
    ctx.fillStyle = '#ded0a2';
    ctx.fillRect(left,y,3,8);
    ctx.fillStyle = '#9a8b66';
    ctx.fillRect(82 + row % 5 * 4,y + 1,52,3);
    ctx.fillStyle = '#628790';
    ctx.fillRect(149 - row % 3,y,3,8);
  }
  ctx.fillStyle = '#628790';
  ctx.fillRect(143,92,12,24);
  ctx.fillStyle = '#ebe3bc';
  ctx.fillRect(20,13,3,20);
  ctx.fillRect(18,15,7,3);
  ctx.fillRect(16,18,11,2);
  for (const {id,kingdom,point:[x,y]} of kingdomMap.cities) {
    const matched = answers[id] === kingdom;
    ctx.fillStyle = '#403d36';
    ctx.fillRect(x - 6,y - 6,12,12);
    ctx.fillStyle = matched ? '#eeda8d' : '#efe9d1';
    ctx.fillRect(x - 4,y - 4,8,8);
    if (!matched) {
      ctx.fillStyle = '#716247';
      ctx.fillRect(x - 2,y - 2,4,4);
    }
  }
}

export function mountKingdomMap(panel, locale, answers) {
  const fragment = document.getElementById('kingdom-map-template').content.cloneNode(true);
  const [instruction, figure, questions, overview] = fragment.children;
  const [canvas,caption] = figure.children;
  const [task,description,retry,read,overviewLabel] = copy[locale];
  instruction.textContent = task;
  caption.textContent = description;
  overview.textContent = overviewLabel;
  overview.href = kingdomMap.overview;
  for (const city of kingdomMap.cities) {
    const group = document.createElement('fieldset');
    const legend = document.createElement('legend');
    const controls = document.createElement('div');
    const feedback = document.createElement('p');
    const source = document.createElement('a');
    legend.textContent = city.name[locale];
    feedback.setAttribute('role','status');
    source.href = city.source;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.textContent = read;

    function update() {
      const chosen = answers[city.id];
      const matched = chosen === city.kingdom;
      feedback.textContent = !chosen ? '' : matched ? city.text[locale] : retry;
      source.hidden = !matched;
      for (const button of controls.children) {
        button.setAttribute('aria-pressed',String(button.dataset.kingdom === chosen));
      }
    }

    for (const [id,labels] of kingdomMap.kingdoms) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.kingdom = id;
      button.textContent = labels[locale];
      button.addEventListener('click',() => {
        answers[city.id] = id;
        update();
        drawMap(canvas,answers);
      });
      controls.append(button);
    }
    update();
    group.dataset.kingdomCity = city.id;
    group.append(legend,controls,feedback,source);
    questions.append(group);
  }
  drawMap(canvas,answers);
  panel.replaceChildren(fragment);
}
