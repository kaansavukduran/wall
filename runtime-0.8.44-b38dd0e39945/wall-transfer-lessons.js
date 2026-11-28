const lesson = {
  tr: {
    prompt:'2016 fotoğrafında, Tapınak platformunu taşıyan duvarın yüzü nerede?',
    alt:'Önde insanların yürüdüğü açık bir meydan var. Ortada büyük taş sıraları, arkada altın kubbeli bir yapı görünüyor.',
    choices:['Altın kubbe','Büyük taş sıraları','Açık meydanın zemini'],
    retry:'Kesitteki dik yüzü hatırla. Platformun kenarını tutan büyük taş sıralarına bak.',
    matched:'Büyük taş sıraları Batı Duvarı’nın görünen yüzünde. Bu istinat duvarı üstteki platformu destekler. Taş sıralarını tarihlendirmek için kazı raporuna bak.',
    photo:'Fallaner · 24 Mart 2016 · Fotoğraf kaydı',
    excavation:'Wilson Kemeri kazı raporu',
  },
  en: {
    prompt:'Where is the face of the wall that supports the Temple platform in this 2016 photograph?',
    alt:'People cross an open plaza in the foreground. Rows of large stones stand in the middle, with a gold-domed building behind them.',
    choices:['The gold dome','The rows of large stones','The surface of the open plaza'],
    retry:'Recall the upright face in the cutaway. Look for the large stones holding up the edge of the platform.',
    matched:'The rows of large stones belong to the visible face of the Western Wall. This retaining wall supports the raised platform. The excavation report helps date the layers of masonry.',
    photo:'Fallaner · 24 March 2016 · Photograph record',
    excavation:'Wilson’s Arch excavation report',
  },
  he: {
    prompt:'היכן נראה בתצלום מ־2016 קיר התמך של מתחם הר הבית?',
    alt:'אנשים חוצים רחבה פתוחה בחזית. במרכז נראות שורות של אבנים גדולות, ומאחוריהן מבנה בעל כיפה מוזהבת.',
    choices:['הכיפה המוזהבת','שורות האבנים הגדולות','רצפת הרחבה הפתוחה'],
    retry:'היזכרו במשטח האנכי שבחתך. חפשו את האבנים הגדולות התומכות בשולי המתחם.',
    matched:'שורות האבנים הגדולות הן חלק מחזיתו הגלויה של הכותל המערבי. קיר התמך נושא את המתחם המוגבה. דוח החפירה מסייע בתיארוך שכבות הבנייה.',
    photo:'Fallaner · 24 במרץ 2016 · רשומת התצלום',
    excavation:'דוח החפירה בקשת וילסון',
  },
  az: {
    prompt:'2016-cı il fotosunda Məbəd platformasını saxlayan divarın üzü haradadır?',
    alt:'Ön planda insanlar açıq meydandan keçir. Ortada iri daş sıraları, onların arxasında qızılı günbəzli tikili görünür.',
    choices:['Qızılı günbəz','İri daş sıraları','Açıq meydanın döşəməsi'],
    retry:'Kəsikdəki şaquli səthi yada sal. Platformanın kənarını saxlayan iri daşlara bax.',
    matched:'İri daş sıraları Qərb Divarının görünən səthinə aiddir. Bu istinad divarı yüksəldilmiş platformanı saxlayır. Qazıntı hesabatı daş hörgünün qatlarını tarixləndirməyə kömək edir.',
    photo:'Fallaner · 24 mart 2016 · Foto qeydi',
    excavation:'Vilson tağında qazıntı hesabatı',
  },
};

export function mountWallTransfer(panel, language, view) {
  const fragment = document.getElementById('wall-transfer-template').content.cloneNode(true);
  const [prompt,figure,choices,feedback,sources] = fragment.children;
  const [image,mark] = figure.children;
  const [credit,,excavation] = sources.querySelectorAll('a');
  const text = lesson[language];
  prompt.textContent = text.prompt;
  image.src = new URL('./assets/western-wall-2016.jpg',import.meta.url).href;
  image.alt = text.alt;
  credit.textContent = text.photo;
  excavation.textContent = text.excavation;

  choices.replaceChildren(...text.choices.map((label,index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.dataset.wallRegion = String(index);
    button.addEventListener('click', () => {
      view.answer = index;
      render();
    });
    return button;
  }));

  function render() {
    for (const [index,button] of [...choices.children].entries()) {
      button.setAttribute('aria-pressed',String(view.answer === index));
    }
    mark.hidden = view.answer !== 1;
    feedback.textContent = view.answer === undefined ? '' : text[view.answer === 1 ? 'matched' : 'retry'];
  }
  render();
  panel.replaceChildren(fragment);
}
