import {objectSprite} from './object-sprite.js';

export const reservoirSources = [
  'https://hadashot.iaa.org.il/Report_Detail_Eng.aspx?id=25662',
  'https://doi.org/10.1371/journal.pone.0233307',
];

const copy = [
  {
    setting:'Birketü’l-Burak, Wilson Kemeri’nin altında en az 15 m uzunluğunda ve 13 m genişliğinde bir su haznesiydi. Batıda kemer ayağına, doğuda Batı Duvarı’na dayanıyordu. Kazı ekibi iki yapım evresi ayırt etti. Ön rapor katman sırasına ve seramiğe dayanır. Radyokarbon çalışması yapı malzemesindeki yanmış organik örnekleri inceler. Kesit şematiktir.',
    phase:'Haznenin iki evresini karşılaştır',
    names:['İlk evre','Sonraki evre'],
    readings:[
      'Taş ve sert harçtan kalın temele pembe tonlu iki sıva katı uygulandı. 2019 kazı ön raporu bu evreyi Memlûk dönemine yerleştirir. 2020 radyokarbon çalışması, bu evreden iki örneğe dayanarak MS 1305–1340 aralığını hesapladı.',
      'Tabana taş ve bağlayıcı malzemeden bir kat eklendi. Hazne yeniden sıvandı. İşaret, Batı Duvarı’nda kalan sıvanın izini gösteriyor. 2019 ön raporu bu evreyi Osmanlı dönemine yerleştirir. 2020 radyokarbon çalışması, bu evreden iki örneğe dayanarak MS 1330–1400 aralığını hesapladı.',
    ],
    question:'Kazı ekibi hazne duvarının yaklaşık 3,2 m yüksekliğinde olduğu sonucuna hangi izden vardı?',
    options:['Batı Duvarı’ndaki yeni sıvanın izinden','Kudüs şehir suru kitabesinden'],
    answer:'Kazı ekibi, Batı Duvarı’nda kalan sıva izlerinden yenilenen hazne duvarının yaklaşık 3,2 m yüksekliğinde olduğu sonucunu çıkardı. Dua alanındaki üst taş sıralarını tarihlendirmek için o sıralara ait kanıt gerekir.',
    retry:'Şehir suru kitabesi çevre suruna ait. Haznenin kesitinde Batı Duvarı üzerinde işaretlenen ize bak.',
    sources:['2019 kazı ön raporu · Tabaka 1 ve Görsel 8','2020 radyokarbon çalışması · Tabaka 1'],
  },
  {
    setting:'Birkat al-Burāq was a water reservoir at least 15 m long and 13 m wide beneath Wilson’s Arch. It rested on the arch pier to the west and on the Western Wall to the east. Excavators distinguished two phases. The preliminary report relies on the sequence of layers and pottery. The radiocarbon study examines charred organic samples in building material. The cross-section is schematic.',
    phase:'Compare the reservoir’s two phases',
    names:['Earlier phase','Later phase'],
    readings:[
      'The reservoir had a thick foundation of stone and hard mortar, coated with two layers of pinkish plaster. The 2019 preliminary excavation report places this phase in the Mamluk period. The 2020 radiocarbon study modeled a range of 1305–1340 CE using two samples from this phase.',
      'A layer of stone and bonding material was added to the floor and the reservoir was replastered. The mark shows where the plaster left a trace on the Western Wall. The 2019 preliminary report assigns this phase to the Ottoman period. The 2020 radiocarbon study modeled a range of 1330–1400 CE using two samples from this phase.',
    ],
    question:'What led the excavators to estimate the reservoir wall’s height at about 3.2 m?',
    options:['Traces of the later plaster on the Western Wall','The inscription on Jerusalem’s city wall'],
    answer:'The excavators used traces of the later plaster on the Western Wall to estimate the renovated reservoir wall’s height at about 3.2 m. Dating the upper stone courses at the prayer area requires evidence about those courses.',
    retry:'The inscription belongs to the city’s perimeter wall. In the reservoir cross-section, look at the mark on the Western Wall.',
    sources:['2019 preliminary excavation report · Stratum 1 and Figure 8','2020 radiocarbon study · Stratum 1'],
  },
  {
    setting:'בירכת אל־בוראק היה מאגר מים מתחת לקשת וילסון, באורך של לפחות 15 מטר וברוחב של 13 מטר. ממערב הוא נשען על אומנת הקשת וממזרח על הכותל המערבי. החופרים זיהו שני שלבי בנייה. הדוח המקדמי נשען על סדר השכבות ועל ממצאי כלי חרס. מחקר פחמן 14 בוחן דגימות אורגניות מפוחמות בחומרי הבנייה. החתך סכמטי.',
    phase:'השוו בין שני שלבי המאגר',
    names:['השלב הראשון','השלב המאוחר'],
    readings:[
      'על יסוד עבה מאבנים ומטיט קשה נמרחו שתי שכבות טיח ורדרד. דוח החפירה המקדמי מ־2019 משייך שלב זה לתקופה הממלוכית. במחקר פחמן 14 מ־2020 חושב הטווח 1305–1340 לספירה על סמך שתי דגימות מן השלב הזה.',
      'לרצפה נוספה שכבת אבנים וחומר מלכד, והמאגר טויח שוב. הסימון מציין שרידי טיח על הכותל המערבי. הדוח המקדמי מ־2019 משייך שלב זה לתקופה העות׳מאנית. במחקר פחמן 14 מ־2020 חושב הטווח 1330–1400 לספירה על סמך שתי דגימות מן השלב הזה.',
    ],
    question:'איזה ממצא הוביל את החופרים להעריך שגובה דופן המאגר היה כ־3.2 מטר?',
    options:['שרידי הטיח המאוחר על הכותל המערבי','הכתובת שעל חומת העיר ירושלים'],
    answer:'על סמך שרידי הטיח המאוחר על הכותל, החופרים העריכו שדופן המאגר לאחר חידושו הגיעה לגובה של כ־3.2 מטר. כדי לתארך את נדבכי האבן העליונים ברחבת התפילה יש צורך בממצאים הנוגעים לנדבכים עצמם.',
    retry:'הכתובת שייכת לחומה המקיפה את העיר. הביטו בסימון שעל הכותל בחתך המאגר.',
    sources:['דוח החפירה המקדמי מ־2019 · שכבה 1 ואיור 8','מחקר פחמן 14 מ־2020 · שכבה 1'],
  },
  {
    setting:'Birkat al-Buraq Vilson tağının altında yerləşən, ən azı 15 m uzunluğunda və 13 m enində olan su anbarı idi. Qərbdə tağın dayağına, şərqdə Qərb Divarına söykənirdi. Qazıntı qrupu iki tikinti mərhələsi müəyyənləşdirdi. İlkin hesabat təbəqələrin ardıcıllığına və keramika tapıntılarına əsaslanır. Radiokarbon tədqiqatı tikinti materialındakı yanmış üzvi nümunələri araşdırır. Kəsik sxematikdir.',
    phase:'Su anbarının iki mərhələsini müqayisə et',
    names:['İlk mərhələ','Sonrakı mərhələ'],
    readings:[
      'Daş və bərk məhluldan qalın təməlin üzərinə iki qat çəhrayımtıl suvaq çəkilmişdi. 2019-cu ilin ilkin qazıntı hesabatı bu mərhələni Məmlük dövrünə aid edir. 2020-ci ilin radiokarbon tədqiqatı bu mərhələnin iki nümunəsi əsasında 1305–1340 aralığını hesablayıb.',
      'Döşəməyə daş və bağlayıcı materialdan qat əlavə olundu, anbar yenidən suvandı. İşarə Qərb Divarında qalan suvaq izini göstərir. 2019-cu ilin ilkin hesabatı bu mərhələni Osmanlı dövrünə aid edir. 2020-ci ilin radiokarbon tədqiqatı bu mərhələnin iki nümunəsi əsasında 1330–1400 aralığını hesablayıb.',
    ],
    question:'Qazıntı qrupu su anbarının divarının təxminən 3,2 m hündürlüyündə olduğu nəticəsinə hansı iz əsasında gəldi?',
    options:['Qərb Divarındakı yeni suvağın izinə əsasən','Qüds şəhər divarının kitabəsinə əsasən'],
    answer:'Qazıntı qrupu Qərb Divarında qalan yeni suvaq izinə əsasən yenilənmiş anbar divarının təxminən 3,2 m hündürlüyündə olduğu qənaətinə gəldi. Dua yerindəki üst daş sıralarını tarixləndirmək üçün həmin sıralara aid dəlil lazımdır.',
    retry:'Kitabə şəhəri əhatə edən divara aiddir. Su anbarının kəsiyində Qərb Divarının üzərindəki işarəyə bax.',
    sources:['2019-cu ilin ilkin qazıntı hesabatı · 1-ci təbəqə və 8-ci şəkil','2020-ci ilin radiokarbon tədqiqatı · 1-ci təbəqə'],
  },
];

export function mountReservoir(panel, locale, view) {
  const lesson = copy[locale];
  const fragment = document.getElementById('reservoir-template').content.cloneNode(true);
  const [setting, controls, figure, question, references] = fragment.children;
  const [phaseLabel, phaseControls] = controls.children;
  const [canvas, caption] = figure.children;
  const [prompt, options, feedback] = question.children;
  const showFrame = objectSprite(canvas,new URL('./assets/reservoir.png',import.meta.url),2);

  setting.textContent = lesson.setting;
  phaseLabel.textContent = lesson.phase;
  prompt.textContent = lesson.question;
  for (const [index, item] of Array.from(references.children).entries()) {
    const link = item.firstElementChild;
    link.textContent = lesson.sources[index];
    link.href = reservoirSources[index];
  }

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
