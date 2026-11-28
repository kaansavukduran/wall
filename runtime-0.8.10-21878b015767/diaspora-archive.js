import { diasporaRecords } from './diaspora-lessons.js';

export const archiveCases = [
  {
    id:'crown',
    question:['1290 sürgününün kraliyet adına nasıl gerekçelendirildiğini hangi belge gösterir?',
      'Which record shows how the Crown justified the 1290 expulsion?',
      'איזה מקור מראה כיצד הכתר נימק את גירוש 1290?',
      '1290-cı il sürgününün kral adından necə əsaslandırıldığını hansı sənəd göstərir?'],
    answer:'england-expulsion-1290',
    others:['france-expulsion-1306','alice-kindertransport-1939'],
  },
  {
    id:'memory',
    question:['Bir ailenin mülteci olarak ayrılışını, yıllar sonra kaydedilmiş kişisel bir hatıradan hangi kaynakla öğrenebilirsin?',
      'Which source lets you learn about one family’s refugee journey from a personal memory recorded years later?',
      'מאיזה מקור אפשר ללמוד על מסע הפליטות של משפחה אחת, מתוך זיכרון אישי שתועד שנים אחר כך?',
      'Bir ailənin qaçqın kimi getməsini illər sonra qeydə alınmış şəxsi xatirədən hansı mənbə ilə öyrənmək olar?'],
    answer:'alice-kindertransport-1939',
    others:['evian-refugees-1938','yemen-airlift-1948'],
  },
  {
    id:'law',
    question:['Hangi dosyada vatandaşlıktan çıkış ve ayrılanların mallarına ilişkin iki ayrı yasa bulunur?',
      'Which file contains separate laws on relinquishing citizenship and on the property of those who left?',
      'באיזה תיק יש חוקים נפרדים על ויתור על אזרחות ועל רכושם של העוזבים?',
      'Hansı faylda vətəndaşlıqdan çıxma və gedənlərin əmlakı barədə ayrı-ayrı qanunlar var?'],
    answer:'iraq-emigration-1950',
    others:['iberia-decree-1492','yemen-airlift-1948'],
  },
];

const copy = {
  tr: {
    intro:'Belgeleri tarihe göre aç. Her kayıt, bir kararın, saldırının veya yolculuğun hangi kaynaktan izlenebildiğini gösterir.',
    record:'Açılacak kayıt', exercise:'Belgeyi soruyla eşleştir', example:'Araştırma sorusu', number:n => 'Soru ' + n,
    retry:'Bu kayıt başka bir soruyu aydınlatır. Verdiği bilgiye bakıp tekrar dene.',
    review:'Bu kaydı aç', types:{royal:'Kraliyet belgesi',catalogue:'Kütüphane kataloğu',history:'Tarihsel inceleme',
      testimony:'Sonradan kaydedilen sözlü tarih',finding:'Arşiv dosya rehberi',law:'Resmî Gazete ve hukuk dosyası'},
  },
  en: {
    intro:'Open records in date order. Each entry shows which source documents a decision, attack, or journey.',
    record:'Record to open', exercise:'Match a record to the question', example:'Research question', number:n => 'Question ' + n,
    retry:'This record answers a different question. Read what it shows and try again.',
    review:'Open this record', types:{royal:'Royal document',catalogue:'Library catalogue',history:'Historical overview',
      testimony:'Oral history recorded later',finding:'Archival finding aid',law:'Official gazette and legal file'},
  },
  he: {
    intro:'פתחו את הרשומות לפי סדר התאריכים. כל רשומה מראה איזה מקור מתעד החלטה, התקפה או מסע.',
    record:'רשומה לפתיחה', exercise:'התאימו מסמך לשאלה', example:'שאלת מחקר', number:n => 'שאלה ' + n,
    retry:'הרשומה עונה על שאלה אחרת. קראו מה היא מראה ונסו שוב.',
    review:'פתחו את הרשומה הזאת', types:{royal:'מסמך מלכותי',catalogue:'קטלוג ספרייה',history:'סקירה היסטורית',
      testimony:'עדות בעל פה שתועדה מאוחר יותר',finding:'מדריך לארכיון',law:'עיתון רשמי ותיק משפטי'},
  },
  az: {
    intro:'Qeydləri tarix sırası ilə aç. Hər qeyd qərarı, hücumu və ya səfəri hansı mənbənin sənədləşdirdiyini göstərir.',
    record:'Açılacaq qeyd', exercise:'Sənədi sualla uyğunlaşdır', example:'Tədqiqat sualı', number:n => 'Sual ' + n,
    retry:'Bu qeyd başqa sualı cavablandırır. Nəyi göstərdiyini oxu və bir də yoxla.',
    review:'Bu qeydi aç', types:{royal:'Kral sənədi',catalogue:'Kitabxana kataloqu',history:'Tarixi icmal',
      testimony:'Sonradan qeydə alınmış şifahi tarix',finding:'Arxiv sənədləri bələdçisi',law:'Rəsmi qəzet və hüquqi fayl'},
  },
};

export function mountDiasporaArchive(panel, language, locale) {
  const fragment = document.getElementById('diaspora-template').content.cloneNode(true);
  const labels = copy[language];
  const records = new Map(diasporaRecords.map(record => [record.id, record]));
  const number = new Intl.NumberFormat(language);
  const select = fragment.querySelector('#diaspora-record');
  const [heading, date, context, evidence, type, link] = fragment.querySelector('.diaspora-reading').children;
  const [when, where] = date.children;
  const exercise = fragment.querySelector('.diaspora-exercise');
  const [summary, exampleLabel, example, question, choices, status, review] = exercise.children;

  function showRecord() {
    const record = records.get(select.value);
    heading.textContent = record.title[language];
    when.textContent = record.date[language];
    where.textContent = ' · ' + record.place[language];
    context.textContent = record.context[language];
    evidence.textContent = record.evidence[language];
    type.textContent = labels.types[record.type];
    link.href = record.source.url;
    link.textContent = record.source.title;
  }

  function showExample() {
    const item = archiveCases[example.selectedIndex];
    const options = [item.answer,...item.others];
    const offset = (example.selectedIndex + 1) % options.length;
    question.textContent = item.question[locale];
    status.textContent = '';
    review.hidden = true;
    choices.replaceChildren(...options.map((_, index) => {
      const record = records.get(options[(index + offset) % options.length]);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = record.title[language];
      button.dataset.archiveAnswer = record.id;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        for (const sibling of choices.children) sibling.setAttribute('aria-pressed', String(sibling === button));
        status.textContent = record.id === item.answer ? record.evidence[language] : labels.retry;
        review.dataset.record = record.id;
        review.hidden = false;
      });
      return button;
    }));
  }

  fragment.querySelector('.diaspora-intro').textContent = labels.intro;
  fragment.querySelector('[for="diaspora-record"]').textContent = labels.record;
  exampleLabel.textContent = labels.example;
  summary.textContent = labels.exercise;
  review.textContent = labels.review;
  select.replaceChildren(...diasporaRecords.map(record => new Option(record.title[language],record.id)));
  example.replaceChildren(...archiveCases.map((item,index) => new Option(labels.number(number.format(index + 1)),item.id)));
  select.addEventListener('change',showRecord);
  example.addEventListener('change',showExample);
  review.addEventListener('click', () => {
    select.value = review.dataset.record;
    showRecord();
    select.focus();
  });
  showRecord();
  showExample();
  panel.replaceChildren(fragment);
}
