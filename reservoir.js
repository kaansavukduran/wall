import {objectSprite} from './object-sprite.js';

export const reservoirSource = 'https://hadashot.iaa.org.il/Report_Detail_Eng.aspx?id=25662';

const copy = [
  {
    setting:'Birketü’l-Burak, Wilson Kemeri’nin altında en az 15 m uzunluğunda ve 13 m genişliğinde bir su haznesiydi. Batıda kemer ayağına, doğuda Batı Duvarı’na dayanıyordu. Kazı ekibi iki yapım evresi ayırt etti. Kesit, katmanları şematik olarak gösteriyor.',
    phase:'Haznenin iki evresini karşılaştır',
    names:['Memlûk evresi','Osmanlı evresi'],
    readings:[
      'Önce taş ve sert harçtan kalın bir temel yapıldı. Üzerine pembe tonlu iki sıva katı uygulandı.',
      'Haznenin tabanına bir taş ve bağlayıcı malzeme katı eklendi. Hazne yeniden pembe tonlu sıvayla kaplandı. Kesitteki işaret, Batı Duvarı üzerinde kalan sıva izini gösteriyor.',
    ],
    question:'Kazı ekibi hazne duvarının yaklaşık 3,2 m yüksekliğinde olduğu sonucuna hangi izden vardı?',
    options:['Batı Duvarı’ndaki yeni sıvanın izinden','Kudüs şehir suru kitabesinden'],
    answer:'Kazı ekibi, Batı Duvarı’nda kalan sıva izlerinden yenilenen hazne duvarının yaklaşık 3,2 m yüksekliğinde olduğu sonucunu çıkardı. Rapor, dua alanındaki üst taş sıralarını tarihlendirmiyor.',
    retry:'Şehir suru kitabesi çevre suruna ait. Haznenin kesitinde Batı Duvarı üzerinde işaretlenen ize bak.',
    source:'Kazı raporunu aç · Tabaka 1, Görsel 8',
  },
  {
    setting:'Birkat al-Burāq was a water reservoir at least 15 m long and 13 m wide beneath Wilson’s Arch. It rested on the arch pier to the west and on the Western Wall to the east. Excavators distinguished two building phases. The cross-section is schematic.',
    phase:'Compare the reservoir’s two phases',
    names:['Mamluk phase','Ottoman phase'],
    readings:[
      'In the earlier phase, the reservoir was built on a thick foundation of stone and hard mortar, coated with two layers of pinkish plaster.',
      'The reservoir floor gained another layer of stone and bonding material. The reservoir was lined with a fresh coat of pinkish plaster. The mark in the cross-section shows where traces of plaster remained on the Western Wall.',
    ],
    question:'What led the excavators to estimate the reservoir wall’s height at about 3.2 m?',
    options:['Traces of the later plaster on the Western Wall','The inscription on Jerusalem’s city wall'],
    answer:'The excavators used traces of the later plaster on the Western Wall. The estimate of about 3.2 m applies to the renovated reservoir wall. The report does not date the upper stone courses at the prayer area.',
    retry:'The inscription belongs to the city’s perimeter wall. In the reservoir cross-section, look at the mark on the Western Wall.',
    source:'Read the excavation report · Stratum 1, Figure 8',
  },
  {
    setting:'בירכת אל־בוראק היה מאגר מים מתחת לקשת וילסון, באורך של לפחות 15 מטר וברוחב של 13 מטר. ממערב הוא נשען על אומנת הקשת וממזרח על הכותל המערבי. החופרים זיהו שני שלבי בנייה. החתך מציג את השכבות בתרשים.',
    phase:'השוו בין שני שלבי המאגר',
    names:['השלב הממלוכי','השלב העות׳מאני'],
    readings:[
      'בשלב הראשון הונח יסוד עבה מאבנים ומטיט קשה. מעליו נמרחו שתי שכבות טיח ורדרד.',
      'לרצפת המאגר נוספה שכבת אבנים וחומר מלכד. המאגר צופה שוב בטיח ורדרד. הסימון בחתך מציין את טיח השלב המאוחר שנותר על הכותל המערבי.',
    ],
    question:'איזה ממצא הוביל את החופרים להעריך שגובה דופן המאגר היה כ־3.2 מטר?',
    options:['שרידי הטיח המאוחר על הכותל המערבי','הכתובת שעל חומת העיר ירושלים'],
    answer:'החופרים הסתמכו על שרידי הטיח המאוחר על הכותל. גובה של כ־3.2 מטר הוא הערכה לדופן המאגר לאחר חידושו. הדוח אינו מתארך את נדבכי האבן העליונים ברחבת התפילה.',
    retry:'הכתובת שייכת לחומה המקיפה את העיר. הביטו בסימון שעל הכותל בחתך המאגר.',
    source:'קראו את דוח החפירה · שכבה 1, איור 8',
  },
  {
    setting:'Birkat al-Buraq Vilson tağının altında yerləşən, ən azı 15 m uzunluğunda və 13 m enində olan su anbarı idi. Qərbdə tağın dayağına, şərqdə Qərb Divarına söykənirdi. Qazıntı qrupu iki tikinti mərhələsi müəyyənləşdirdi. Kəsik qatları sxem şəklində göstərir.',
    phase:'Su anbarının iki mərhələsini müqayisə et',
    names:['Məmlük mərhələsi','Osmanlı mərhələsi'],
    readings:[
      'İlk mərhələdə daş və bərk məhluldan qalın təməl qurulmuşdu. Üzərinə iki qat çəhrayımtıl suvaq çəkilmişdi.',
      'Su anbarının döşəməsinə daş və bağlayıcı materialdan yeni qat əlavə olundu. Anbara yenidən çəhrayımtıl suvaq çəkildi. Kəsikdəki işarə Qərb Divarında qalan suvaq izini göstərir.',
    ],
    question:'Qazıntı qrupu su anbarının divarının təxminən 3,2 m hündürlüyündə olduğu nəticəsinə hansı iz əsasında gəldi?',
    options:['Qərb Divarındakı yeni suvağın izinə əsasən','Qüds şəhər divarının kitabəsinə əsasən'],
    answer:'Qazıntı qrupu Qərb Divarında qalan yeni suvaq izinə əsaslandı. Təxminən 3,2 m hündürlük yenilənmiş su anbarının divarına aiddir. Hesabat dua yerindəki üst daş sıralarını tarixləndirmir.',
    retry:'Kitabə şəhəri əhatə edən divara aiddir. Su anbarının kəsiyində Qərb Divarının üzərindəki işarəyə bax.',
    source:'Qazıntı hesabatını oxu · 1-ci təbəqə, 8-ci şəkil',
  },
];

export function mountReservoir(panel, locale, view) {
  const lesson = copy[locale];
  const fragment = document.getElementById('reservoir-template').content.cloneNode(true);
  const [setting, controls, figure, question, source] = fragment.children;
  const [phaseLabel, phaseControls] = controls.children;
  const [canvas, caption] = figure.children;
  const [prompt, options, feedback] = question.children;
  const showFrame = objectSprite(canvas,new URL('./assets/reservoir.png',import.meta.url),2);

  setting.textContent = lesson.setting;
  phaseLabel.textContent = lesson.phase;
  prompt.textContent = lesson.question;
  source.textContent = lesson.source;
  source.href = reservoirSource;

  function renderPhase() {
    for (const [index, button] of Array.from(phaseControls.children).entries()) {
      button.setAttribute('aria-pressed',String(view.phase === index));
    }
    showFrame(view.phase);
    caption.textContent = lesson.readings[view.phase];
    question.hidden = view.phase === 0;
  }

  function renderAnswer() {
    for (const [index, button] of Array.from(options.children).entries()) {
      button.setAttribute('aria-pressed',String(view.answer === index));
    }
    feedback.textContent = view.answer === null ? '' : view.answer === 0 ? lesson.answer : lesson.retry;
  }

  for (const [index, button] of Array.from(phaseControls.children).entries()) {
    button.textContent = lesson.names[index];
    button.addEventListener('click',() => {
      if (view.phase === index) return;
      view.phase = index;
      renderPhase();
    });
  }
  for (const [index, button] of Array.from(options.children).entries()) {
    button.textContent = lesson.options[index];
    button.addEventListener('click',() => {
      view.answer = index;
      renderAnswer();
    });
  }
  renderPhase();
  renderAnswer();
  panel.replaceChildren(fragment);
}
