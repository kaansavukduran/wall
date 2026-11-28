const places = [
  {
    id:'western-wall',
    point:[143,57],
    title:['Batı Duvarı / El-Burak','Western Wall / al-Buraq','הכותל המערבי / אל־בוראק','Qərb Divarı / əl-Büraq'],
    detail:[
      'Haritada Batı Duvarı, mahallenin doğu kenarı boyunca uzanır. 1967 sonrasında duvarın önündeki geniş meydan eski mahallenin alanına yayıldı.',
      'On the map, the Western Wall runs along the eastern edge of the quarter. After 1967, the broad plaza in front of the wall extended into the former neighborhood.',
      'במפה הכותל המערבי עובר לאורך הקצה המזרחי של השכונה. לאחר 1967 הרחבה מול הכותל התפרשה על שטח השכונה לשעבר.',
      'Xəritədə Qərb Divarı məhəllənin şərq kənarı boyunca uzanır. 1967-ci ildən sonra divarın qarşısındakı geniş meydan keçmiş məhəllənin ərazisinə yayıldı.',
    ],
  },
  {
    id:'dar-abu-saud',
    point:[145,96],
    title:['Dâr Ebu Suud','Dar Abu Saud','דאר אבו סעוד','Dar Əbu Səud'],
    detail:[
      'Dâr Ebu Suud, rampanın yanındaki konut kompleksiydi. Araştırma, mahallenin büyük bölümünün 1967’deki yıkımı ile bu yapının 15 Haziran 1969’daki yıkımını ayrı tarihlere yerleştirir.',
      'Dar Abu Saud was a residential complex by the ramp. The study dates the demolition of most of the quarter to 1967 and the demolition of this complex to 15 June 1969.',
      'דאר אבו סעוד היה מתחם מגורים ליד המעלה. המחקר מתארך את הריסת רוב השכונה ל־1967 ואת הריסת המתחם הזה ל־15 ביוני 1969.',
      'Dar Əbu Səud rampanın yanındakı yaşayış kompleksi idi. Araşdırma məhəllənin böyük hissəsinin sökülməsini 1967-ci ilə, bu kompleksin sökülməsini isə 15 iyun 1969-cu ilə aid edir.',
    ],
  },
  {
    id:'south-gate',
    point:[140,148],
    title:['Eski Şehir’in güney kapısı','Southern gate of the Old City','השער הדרומי של העיר העתיקה','Köhnə Şəhərin cənub darvazası'],
    detail:[
      'Bab el-Mağaribe adı güney surundan Eski Şehir’e açılan kapı için kullanılır. Rampanın ulaştığı Haram eş-Şerif kapısı da aynı adı taşıyan ayrı bir geçittir.',
      'Bab al-Maghariba names the gate through the southern wall into the Old City. The distinct gate into Haram al-Sharif reached by the ramp shares that name.',
      'באב אל־מגארבה הוא שם השער בחומה הדרומית שדרכו נכנסים לעיר העתיקה. השער הנפרד שאליו המעלה מוביל בכניסה לחראם א־שריף נושא אותו שם.',
      'Bab əl-Məğaribə cənub divarından Köhnə Şəhərə açılan darvazanın adıdır. Rampanın çatdığı Haram əş-Şərif darvazası da eyni adı daşıyan ayrıca keçiddir.',
    ],
  },
];

const copy = [
  [
    'Yerleri Salmon’un 1936’da hazırlanan ve 1945 ile 1947’de güncellenen Eski Şehir planıyla karşılaştır. Şema yaklaşık konumları gösterir. Kuzey üstte.',
    'Compare the sites with Salmon’s Old City plan, prepared in 1936 and revised in 1945 and 1947. The drawing shows approximate locations. North is at the top.',
    'השוו את האתרים למפת העיר העתיקה של סלמון, שהוכנה ב־1936 ועודכנה ב־1945 וב־1947. האיור מציג מיקומים משוערים. הצפון נמצא למעלה.',
    'Yerləri Salmonun 1936-cı ildə hazırlanmış, 1945 və 1947-ci illərdə yenilənmiş Köhnə Şəhər planı ilə müqayisə et. Sxem təxmini yerləri göstərir. Şimal yuxarıdadır.',
  ],
  ['1945 planının arşiv kaydı','Archive record for the 1945 plan','רשומת הארכיון של מפת 1945','1945-ci il planının arxiv qeydi'],
  ['Araştırmanın işaretlediği yerler','Locations marked in the research','המיקומים המסומנים במחקר','Araşdırmada işarələnən yerlər'],
];

function drawMap(canvas, selected) {
  const ctx = canvas.getContext('2d',{alpha:false});
  function fill(color,x,y,width,height) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,width,height);
  }
  fill('#cbb697',0,0,200,168);
  fill('#ac9679',151,15,49,101);
  fill('#e1cca5',153,15,47,96);
  fill('#7b6a56',148,19,4,91);
  fill('#aa9272',132,68,15,36);
  fill('#b29a78',36,38,77,58);
  for (const x of [41,66,91]) {
    for (const y of [42,62,82]) fill('#bfa885',x,y,20,13);
  }
  fill('#8d775e',34,145,153,7);
  fill('#625443',131,145,18,10);
  fill('#dfbd8e',134,145,12,8);
  fill('#684f39',19,17,3,16);
  fill('#684f39',15,19,11,3);
  fill('#684f39',17,17,7,2);
  fill('#684f39',19,14,3,3);
  for (const [index,{point:[x,y]}] of places.entries()) {
    fill('#563b2b',x-5,y-5,11,11);
    fill(index === selected ? '#ffe0a0' : '#ba9b71',x-3,y-3,7,7);
  }
}

export function mountQuarterMap(panel, locale, view) {
  const fragment = document.getElementById('quarter-map-template').content.cloneNode(true);
  const [intro,canvas,choices,note,plan,research] = fragment.children;
  [intro.textContent,plan.textContent,research.textContent] = copy.map(items => items[locale]);
  view.selected ??= 0;
  choices.replaceChildren(...places.map(({id,title}, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.quarterPlace = id;
    button.textContent = title[locale];
    button.addEventListener('click', () => {
      view.selected = index;
      render();
    });
    return button;
  }));

  function render() {
    for (const [index,button] of [...choices.children].entries()) {
      button.setAttribute('aria-pressed',String(index === view.selected));
    }
    note.textContent = places[view.selected].detail[locale];
    drawMap(canvas,view.selected);
  }
  render();
  panel.replaceChildren(fragment);
}
