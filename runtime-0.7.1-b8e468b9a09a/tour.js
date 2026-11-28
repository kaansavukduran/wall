import { tourEvidence } from './tour-evidence.js';
import { ui } from './content.js';
import { libraryLabels } from './library.js';

export const tour = [
  {
    label:['Taş ve mekân','Stone and place','אבן ומקום','Daş və məkan'],
    options:[
      ['wall',['Wilson Kemeri kazısı','Wilson’s Arch excavation','חפירת קשת וילסון','Uilson tağı qazıntısı'],'https://hadashot.iaa.org.il/Report_Detail_Eng.aspx?id=25662'],
      ['photo',['Eski meydan fotoğrafı','A historic photograph','תצלום היסטורי','Tarixi foto'],'https://www.loc.gov/pictures/item/2019704965/'],
    ],
  },
  {
    label:['Bir metin','A text','טקסט','Bir mətn'],
    options:[
      ['talmud',['Şimon’un mağara anlatısı','Shimon’s cave narrative','סיפור המערה של שמעון','Şimonun mağara rəvayəti'],'https://www.sefaria.org/Shabbat.33b'],
      ['zohar',['Zohar’ın tarihsel dolaşımı','The Zohar’s historical circulation','תפוצתו ההיסטורית של הזוהר','Zoharın tarixi yayılması'],'https://www.sup.org/books/pages/4810/Front_Matter.pdf'],
    ],
  },
  {
    label:['Bir kayıt veya tanıklık','A record or testimony','תיעוד או עדות','Qeyd və ya şahidlik'],
    options:[
      ['geniza',['Geniza mektubu','Geniza letter','מכתב מן הגניזה','Geniza məktubu'],'https://geniza.princeton.edu/en/documents/19917/'],
      ['quarter',['Mağribi Mahallesi arşivi','Maghrebi Quarter archive','ארכיון שכונת המוגרבים','Məğrib məhəlləsinin arxivi'],'https://archives.openjerusalem.org/index.php/mughrabi-quarter'],
    ],
  },
];

export const tourPrompt = [
  'Bu üç durağı bir ziyaretçiye anlat. Her kaynak neyi gösteriyor? Hangi soru açık kalıyor?',
  'Take a visitor to these three stops. What does each source show? What question remains open?',
  'הדריכו מבקר בשלוש התחנות. מה מראה כל מקור? איזו שאלה נשארת פתוחה?',
  'Ziyarətçini bu üç dayanacağa apar. Hər mənbə nəyi göstərir? Hansı sual açıq qalır?',
];

const copy = {
  tr: {
    source:'İnceleyeceğin kaynak', claim:'Kaynak neyi destekler?',
    retry:'Bu ifade kaynakta belirlenebilenin ötesine gidiyor. Başka bir açıklamayı dene.',
    count:n => n + ' / 3 durak kaynağa bağlandı.',
    question:'Açık kalan bir soru', choose:'Bir soru seç', present:'Sergiyi ziyaretçiye göster', title:'Senin sergin',
  },
  en: {
    source:'Source to examine', claim:'What does the source support?',
    retry:'This claim goes beyond what the source establishes. Try another explanation.',
    count:n => n + ' of 3 stops connected to evidence.',
    question:'A question that remains open', choose:'Choose a question', present:'Show your exhibition', title:'Your exhibition',
  },
  he: {
    source:'מקור לבדיקה', claim:'מה המקור מבסס?',
    retry:'הטענה חורגת ממה שהמקור מבסס. נסו הסבר אחר.',
    count:n => n + ' מתוך 3 תחנות קושרו למקור.',
    question:'שאלה שנשארה פתוחה', choose:'בחרו שאלה', present:'הציגו את התערוכה', title:'התערוכה שלכם',
  },
  az: {
    source:'Araşdırılacaq mənbə', claim:'Mənbə hansı fikri dəstəkləyir?',
    retry:'Bu fikir mənbənin göstərdiyindən daha irəli gedir. Başqa izahı yoxla.',
    count:n => '3 dayanacaqdan ' + n + '-i mənbə ilə bağlandı.',
    question:'Açıq qalan sual', choose:'Sualı seç', present:'Sərgini ziyarətçiyə göstər', title:'Sənin sərgin',
  },
};

function sourceLink(url, title) {
  const link = document.createElement('a');
  link.href = url;
  link.textContent = title;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.dir = 'auto';
  return link;
}

export function mountTour(journal, presentation, language, locale, memory) {
  const labels = copy[language];
  const number = new Intl.NumberFormat(language);
  const container = journal.querySelector('#tour-stops');
  const progress = journal.querySelector('#tour-progress');
  const question = journal.querySelector('#tour-question');
  const questionPreview = journal.querySelector('#tour-question-preview');
  const draft = journal.querySelector('#journal-text');
  const present = journal.querySelector('#tour-present');
  const selections = [];
  const solved = new Set(Object.keys(tourEvidence).filter(id => memory.read('wall.tour.solved.' + id) === '1'));

  function updatePresentationAvailability() {
    const open = tourEvidence[question.value];
    questionPreview.textContent = open?.unanswered[locale] ?? '';
    questionPreview.hidden = !open;
    present.disabled = selections.some(([id]) => !solved.has(id)) || !open;
  }

  function updateProgress() {
    const supported = selections.filter(([id]) => solved.has(id));
    const lastQuestion = question.value || memory.read('wall.tour.question');
    question.replaceChildren(new Option(labels.choose, ''), ...supported.map(([id, names]) =>
      new Option(names[locale], id)));
    if (supported.some(([id]) => id === lastQuestion)) question.value = lastQuestion;
    question.disabled = !supported.length;
    progress.textContent = labels.count(number.format(supported.length));
    updatePresentationAvailability();
  }

  const panels = tour.map((stop, index) => {
    const detail = document.createElement('details');
    detail.name = 'tour-stop';
    detail.open = index === 0;
    const summary = document.createElement('summary');
    summary.textContent = stop.label[locale];
    const label = document.createElement('label');
    const select = document.createElement('select');
    const reference = document.createElement('p');
    const claimPrompt = document.createElement('p');
    claimPrompt.id = 'tour-claim-prompt-' + index;
    claimPrompt.textContent = labels.claim;
    const group = document.createElement('div');
    group.className = 'tour-claims';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-labelledby', claimPrompt.id);
    const feedback = document.createElement('p');
    feedback.className = 'tour-feedback';
    feedback.setAttribute('role', 'status');
    const storageKey = 'wall.tour.' + index;
    label.textContent = labels.source;
    label.append(select);
    select.replaceChildren(...stop.options.map(([id, names]) => new Option(names[locale], id)));
    const saved = memory.read(storageKey);
    if (stop.options.some(([id]) => id === saved)) select.value = saved;

    function showStop() {
      const option = stop.options[select.selectedIndex];
      const [id, , url] = option;
      selections[index] = option;
      const evidence = tourEvidence[id];
      reference.replaceChildren(sourceLink(url, evidence.sourceTitle));
      feedback.textContent = solved.has(id) ? evidence.feedback[locale] : '';
      const lines = [evidence.claim, ...evidence.alternatives];
      const offset = (index + select.selectedIndex + 1) % lines.length;
      group.replaceChildren(...lines.map((_, position) => {
        const choice = (position + offset) % lines.length;
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.tourClaim = choice === 0 ? 'supported' : 'overclaim';
        button.textContent = lines[choice][locale];
        button.setAttribute('aria-pressed', String(solved.has(id) && choice === 0));
        button.addEventListener('click', () => {
          for (const sibling of group.children) sibling.setAttribute('aria-pressed', String(sibling === button));
          if (choice === 0) {
            solved.add(id);
            memory.store('wall.tour.solved.' + id, '1');
          }
          feedback.textContent = choice === 0 ? evidence.feedback[locale] : labels.retry;
          updateProgress();
        });
        return button;
      }));
    }

    select.addEventListener('change', () => {
      memory.store(storageKey, select.value);
      showStop();
      updateProgress();
    });
    showStop();
    detail.append(summary, label, reference, claimPrompt, group, feedback);
    return detail;
  });
  function showPresentation() {
    presentation.querySelector('ol').replaceChildren(...selections.map(([id, names, url]) => {
      const stop = document.createElement('li');
      const name = document.createElement('h3');
      name.textContent = names[locale];
      const claim = document.createElement('p');
      claim.textContent = tourEvidence[id].claim[locale];
      stop.append(name, claim, sourceLink(url, tourEvidence[id].sourceTitle));
      return stop;
    }));
    presentation.querySelector('.tour-open-question').textContent = tourEvidence[question.value].unanswered[locale];
    const note = presentation.querySelector('.tour-personal-note');
    note.textContent = draft.value.trim();
    note.hidden = !note.textContent;
    presentation.showModal();
  }

  journal.querySelector('#tour-prompt').textContent = tourPrompt[locale];
  journal.querySelector('[for="tour-question"]').textContent = labels.question;
  journal.querySelector('[for="journal-text"]').textContent = libraryLabels[language][3];
  journal.querySelector('#tour-note-help').textContent = libraryLabels[language][4];
  presentation.querySelector('#tour-presentation-title').textContent = labels.title;
  presentation.querySelector(':scope > h3').textContent = labels.question;
  presentation.querySelector('button').textContent = ui[language][4];
  draft.value = memory.read('wall.journal') ?? '';
  draft.oninput = () => memory.store('wall.journal', draft.value);
  question.onchange = () => {
    memory.store('wall.tour.question', question.value);
    updatePresentationAvailability();
  };
  present.textContent = labels.present;
  present.onclick = showPresentation;
  container.replaceChildren(...panels);
  updateProgress();
}
