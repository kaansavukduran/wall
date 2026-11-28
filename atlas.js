import { atlasEntries } from './atlas-lessons.js';

const mapImage = new URL('./assets/atlas-land.png', import.meta.url);
const sites = {
  AZ:[48.49,41.37,['Qırmızı Qəsəbə','Qırmızı Qəsəbə','קירמיזי קסבה','Qırmızı Qəsəbə']],
  RU:[48.29,42.06,['Derbent','Derbent','דרבנט','Dərbənd']],
  TR:[28.98,41.01,['İstanbul','Istanbul','איסטנבול','İstanbul']],
  GR:[20.85,39.67,['Yanya','Ioannina','יואנינה','Yanina']],
  qumran:[35.46,31.74,['Kumran','Qumran','קומראן','Qumran']],
  gerizim:[35.27,32.20,['Gerizim Dağı','Mount Gerizim','הר גריזים','Gerizim dağı']],
  volozhin:[26.52,54.09,['Volojin','Volozhin','וולוז׳ין','Volojin']],
  IL:[35.22,31.78,['Kudüs','Jerusalem','ירושלים','Qüds']],
  ET:[37.47,12.61,['Gondar','Gondar','גונדר','Qondar']],
  IN:[76.27,9.93,['Koçin','Kochi','קוצ׳ין','Koçin']],
  YE:[44.21,15.37,['Sana','Sanaa','צנעא','Səna']],
  UZ:[64.42,39.77,['Buhara','Bukhara','בוכרה','Buxara']],
  TJ:[68.79,38.56,['Duşanbe','Dushanbe','דושנבה','Düşənbə']],
  DE:[13.40,52.52,['Berlin','Berlin','ברלין','Berlin']],
  ger:[21.22,51.98,['Góra Kalwaria','Góra Kalwaria','גורה קלוואריה','Góra Kalwaria']],
  belz:[24.01,50.38,['Belz','Belz','בעלז','Belz']],
  vizhnitz:[25.19,48.25,['Vıjnıtsya','Vyzhnytsia','ויז׳ניציה','Vıjnıtsya']],
  pshischa:[20.63,51.36,['Przysucha','Przysucha','פשיסחה','Przysucha']],
  telaviv:[34.78,32.08,['Tel Aviv','Tel Aviv','תל אביב','Təl-Əviv']],
  PL:[21.01,52.23,['Varşova','Warsaw','ורשה','Varşava']],
  LT:[25.28,54.69,['Vilnius','Vilnius','וילנה','Vilnüs']],
  UA:[28.19,48.82,['Bratslav','Bratslav','ברסלב','Bratslav']],
  US:[-74.00,40.71,['New York','New York','ניו יורק','Nyu-York']],
  BY:[30.85,54.60,['Liadi','Liadi','לאדי','Liadi']],
  RO:[22.88,47.79,['Satu Mare','Satu Mare','סאטו מארה','Satu Mare']],
  EG:[31.24,30.04,['Kahire','Cairo','קהיר','Qahirə']],
  salonica:[22.94,40.64,['Selanik','Salonica','סלוניקי','Saloniki']],
  mum:[72.88,19.07,['Mumbai','Mumbai','מומבאי','Mumbay']],
  kol:[88.36,22.57,['Kalküta','Kolkata','קולקטה','Kolkata']],
};

const copy = {
  tr: {
    intro:'Bir şehri, dili ya da dinî akımı ara. Aynı kişi hem bir cemaat mirasına hem bir ibadet geleneğine bağlı olabilir.',
    types:['Tümü','Bölge ve dil cemaatleri','Dinî akımlar ve gelenekler','Antik gruplar ve gelenekler','Aidiyet tanımları'],
    category:'Kayıt türü', search:'Atlastaki ad, yer veya dil', entry:'Okuyacağın kayıt',
    empty:'Eşleşme yok. Başka bir ad veya yer dene.', count:n => n + ' kayıt',
    stops:'Haritadaki örnek duraklar',
  },
  en: {
    intro:'Find a city, language, or religious movement. One person can share a community heritage and follow a religious tradition.',
    types:['All','Regional and language communities','Religious movements and traditions','Ancient groups and traditions','Identity terms'],
    category:'Type of entry', search:'Name, place or language', entry:'Entry to read',
    empty:'No matches. Try another name or place.', count:n => n + ' entries',
    stops:'Example places on the map',
  },
  he: {
    intro:'חפשו עיר, שפה או זרם דתי. לאדם אחד יכולות להיות גם מורשת קהילתית וגם מסורת דתית.',
    types:['הכול','קהילות לפי אזור ושפה','זרמים ומסורות דתיות','קבוצות ומסורות מן העת העתיקה','הגדרות זהות'],
    category:'סוג הרשומה', search:'שם, מקום או שפה', entry:'רשומה לקריאה',
    empty:'לא נמצאו תוצאות. נסו שם או מקום אחר.', count:n => n + ' רשומות',
    stops:'דוגמאות למקומות במפה',
  },
  az: {
    intro:'Şəhər, dil və ya dini cərəyan axtar. Eyni şəxs həm icma irsini daşıya, həm də dini ənənəyə bağlı ola bilər.',
    types:['Hamısı','Bölgə və dil icmaları','Dini cərəyanlar və ənənələr','Qədim qruplar və ənənələr','Kimlik anlayışları'],
    category:'Qeyd növü', search:'Ad, yer və ya dil', entry:'Oxumaq üçün qeyd',
    empty:'Uyğun qeyd yoxdur. Başqa ad və ya yer yaz.', count:n => n + ' qeyd',
    stops:'Xəritədəki nümunə məkanlar',
  },
};

function normalize(text) {
  return text.normalize('NFD').toLowerCase().replace(/\p{M}/gu,'').replaceAll('ı','i').replaceAll('ə','e')
    .replace(/[^\p{L}\p{N}]+/gu,' ').trim();
}

const indexedEntries = atlasEntries.map(entry => {
  const places = (entry.regions ?? []).map(code => sites[code]);
  const terms = ['name','history','detail'].flatMap(field => Object.values(entry[field]));
  const words = normalize([...terms, ...places.flatMap(place => place[2])].join(' '));
  return {entry, places, words};
});

export function mountAtlas(panel, language, locale, view) {
  const fragment = document.getElementById('atlas-template').content.cloneNode(true);
  const labels = copy[language];
  const category = fragment.querySelector('#atlas-category');
  const search = fragment.querySelector('#atlas-search');
  const select = fragment.querySelector('#atlas-entry');
  const reading = fragment.querySelector('.atlas-reading');
  const figure = reading.querySelector('figure');
  const map = figure.querySelector('.atlas-map');
  const image = map.querySelector('img');
  const [title, , history, detail, sources] = reading.children;
  const source = sources.querySelector('#atlas-source');
  const context = sources.querySelector('#atlas-context');
  const status = fragment.querySelector('.atlas-status');
  const exercise = reading.querySelector('.atlas-exercise');
  const [prompt, answers, feedback] = exercise.children;
  const list = new Intl.ListFormat(language);
  const numbers = new Intl.NumberFormat(language);
  const collator = new Intl.Collator(language, {sensitivity:'base'});
  const entries = indexedEntries.slice()
    .sort((left, right) => collator.compare(left.entry.name[language], right.entry.name[language]));

  function showIdentityExercise(sample) {
    exercise.hidden = !sample;
    if (!sample) {
      answers.replaceChildren();
      return;
    }
    prompt.textContent = sample.prompt[locale];
    function mark() {
      for (const [index, button] of [...answers.children].entries()) {
        button.setAttribute('aria-pressed', String(index === view.identityChoice));
      }
      feedback.textContent = view.identityChoice === undefined ? '' : sample.feedback[view.identityChoice][locale];
    }
    answers.replaceChildren(...sample.options.map((option,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = option[locale];
      button.addEventListener('click', () => {
        view.identityChoice = index;
        mark();
      });
      return button;
    }));
    mark();
  }

  function showEntry() {
    const selected = entries.find(item => item.entry.id === select.value);
    reading.hidden = !selected;
    if (!selected) return;
    const {entry, places} = selected;
    showIdentityExercise(entry.exercise);
    view.record = entry.id;
    title.textContent = entry.name[language];
    history.textContent = entry.history[language];
    detail.textContent = entry.detail[language];
    source.textContent = entry.source.title;
    source.href = entry.source.url;
    context.parentElement.hidden = !entry.context;
    if (entry.context) {
      context.textContent = entry.context.title;
      context.href = entry.context.url;
    } else {
      context.removeAttribute('href');
    }
    figure.hidden = places.length === 0;
    if (!places.length) return;
    if (!image.hasAttribute('src')) image.src = mapImage.href;
    for (const pin of map.querySelectorAll('.atlas-marker')) pin.remove();
    for (const [longitude, latitude] of places) {
      const marker = document.createElement('span');
      marker.className = 'atlas-marker';
      marker.style.setProperty('--map-x', ((longitude + 88) / 188 * 100) + '%');
      marker.style.setProperty('--map-y', ((69 - latitude) / 70 * 100) + '%');
      map.append(marker);
    }
    figure.querySelector('figcaption').textContent = labels.stops + ' · ' + list.format(places.map(place => place[2][locale]));
  }

  function filter() {
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    view.category = category.value;
    view.search = search.value;
    const results = entries.filter(({entry, words}) =>
      (category.value === 'all' || entry.category === category.value) && terms.every(term => words.includes(term)));
    select.replaceChildren(...results.map(({entry}) => new Option(entry.name[language], entry.id)));
    if (results.some(({entry}) => entry.id === view.record)) select.value = view.record;
    select.disabled = !results.length;
    status.textContent = results.length ? labels.count(numbers.format(results.length)) : labels.empty;
    showEntry();
  }

  fragment.querySelector('.atlas-intro').textContent = labels.intro;
  fragment.querySelector('[for="atlas-category"]').textContent = labels.category;
  fragment.querySelector('[for="atlas-search"]').textContent = labels.search;
  fragment.querySelector('[for="atlas-entry"]').textContent = labels.entry;
  category.replaceChildren(...['all','communities','movements','ancient','identities'].map((value, index) => new Option(labels.types[index], value)));
  category.value = view.category;
  search.value = view.search;
  category.addEventListener('change', filter);
  search.addEventListener('input', filter);
  select.addEventListener('change', showEntry);
  filter();
  panel.replaceChildren(fragment);
}
