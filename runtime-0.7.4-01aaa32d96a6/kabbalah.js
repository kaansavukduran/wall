import { feynmanCases, kabbalahLessons } from './kabbalah-lessons.js';
import { advancedReadings, comparisonCases } from './kabbalah-advanced-lessons.js';

const readings = [...kabbalahLessons, ...advancedReadings];
const exercises = new Map([...feynmanCases, ...comparisonCases].map(sample => [sample.lessonId, sample]));

const copy = {
  tr: {
    choose:'Okuma durağı', sources:'Kaynaklar ve bağlam', apply:'Kendi sözlerinle açıkla',
    groups:['Tarih ve temel kavramlar','İleri karşılaştırmalar'],
    retry:'Bu örnek için kaynak ve bağlamı tekrar incele.',
    local:'Taslak bu tarayıcıda saklanır.',
    kinds:{annotated:'Açıklamalı metin', text:'Birincil metin', research:'Akademik çalışma', overview:'Tarihsel özet',
      index:'Katalog veya dizin', edition:'Baskı veya el yazması kaydı', interpretation:'Sonraki yorum', self:'Kurumun kendi anlatımı',
      archived:'Kurum arşivindeki birincil metin', metadata:'Akademik yayın kaydı'},
  },
  en: {
    choose:'Reading stop', sources:'Sources and context', apply:'Explain it in your own words',
    groups:['History and foundations','Advanced comparisons'],
    retry:'Read the source and context again for this example.',
    local:'The draft stays in this browser.',
    kinds:{annotated:'Annotated text', text:'Primary text', research:'Academic study', overview:'Historical overview',
      index:'Catalogue or index', edition:'Edition or manuscript record', interpretation:'Later interpretation',
      self:'Institution’s own account', archived:'Primary text in an institutional archive', metadata:'Academic publication record'},
  },
  he: {
    choose:'תחנת קריאה', sources:'מקורות והקשר', apply:'הסבירו במילים שלכם',
    groups:['היסטוריה ומושגי יסוד','השוואות למתקדמים'],
    retry:'קראו שוב את המקור ואת ההקשר לדוגמה הזאת.',
    local:'הטיוטה נשמרת בדפדפן הזה.',
    kinds:{annotated:'טקסט עם הערות', text:'מקור ראשוני', research:'מחקר אקדמי', overview:'סקירה היסטורית',
      index:'קטלוג או מפתח', edition:'רשומה של מהדורה או כתב יד', interpretation:'פרשנות מאוחרת',
      self:'תיאור עצמי של המוסד', archived:'מקור ראשוני בארכיון מוסדי', metadata:'רשומה ביבליוגרפית אקדמית'},
  },
  az: {
    choose:'Oxu dayanacağı', sources:'Mənbələr və kontekst', apply:'Öz sözlərinlə izah et',
    groups:['Tarix və əsas anlayışlar','İrəli səviyyə müqayisələri'],
    retry:'Bu nümunə üçün mənbəni və konteksti yenidən oxu.',
    local:'Qaralama bu brauzerdə saxlanılır.',
    kinds:{annotated:'İzahlı mətn', text:'İlkin mətn', research:'Akademik araşdırma', overview:'Tarixi icmal',
      index:'Kataloq və ya göstərici', edition:'Nəşr və ya əlyazma qeydi', interpretation:'Sonrakı şərh',
      self:'Qurumun öz izahı', archived:'Qurum arxivində ilkin mətn', metadata:'Akademik nəşr qeydi'},
  },
};

export function mountKabbalah(panel, language, locale, memory, view) {
  const fragment = document.getElementById('kabbalah-template').content.cloneNode(true);
  const select = fragment.querySelector('#kabbalah-lesson');
  const [heading, period, genre, study, sourcePanel] = fragment.querySelector('.kabbalah-reading').children;
  const [sourceLabel, limit, links] = sourcePanel.children;
  const exercise = fragment.querySelector('.kabbalah-exercise');
  const [exerciseLabel, question, choices, feedback, transfer] = exercise.children;
  const [draftLabel, draft, help] = transfer.children;
  const solvedCases = view.solved;
  const labels = copy[language];

  function showCase(sample, offset) {
    exercise.hidden = !sample;
    if (!sample) return;
    const draftKey = 'wall.kabbalah.' + sample.id;
    const existing = memory.read(draftKey) ?? '';
    question.textContent = sample.question[locale];
    draftLabel.textContent = sample.transfer[locale];
    draft.value = existing;
    draft.oninput = () => memory.store(draftKey, draft.value);
    const solved = solvedCases.has(sample.id) || existing.length > 0;
    transfer.hidden = !solved;
    feedback.textContent = solved ? sample.feedback[locale] : '';

    choices.replaceChildren(...sample.choices.map((_, index) => {
      const choice = (index + offset) % sample.choices.length;
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.caseChoice = String(choice);
      button.textContent = sample.choices[choice][locale];
      button.setAttribute('aria-pressed', String(solved && choice === sample.correct));
      button.addEventListener('click', () => {
        for (const sibling of choices.children) sibling.setAttribute('aria-pressed', String(sibling === button));
        const correct = choice === sample.correct;
        feedback.textContent = correct ? sample.feedback[locale] : labels.retry;
        if (correct) {
          solvedCases.add(sample.id);
          transfer.hidden = false;
        }
      });
      return button;
    }));
  }

  function showLesson() {
    const lesson = readings[select.selectedIndex];
    view.lesson = lesson.id;
    heading.textContent = lesson.title[locale];
    period.textContent = lesson.period[locale];
    genre.textContent = lesson.genre[locale];
    study.textContent = lesson.study[locale];
    limit.textContent = lesson.limit[locale];
    links.replaceChildren(...lesson.sources.map(source => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = source.title;
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dir = 'auto';
      const kind = document.createElement('small');
      kind.textContent = labels.kinds[source.kind];
      item.append(link, kind);
      return item;
    }));
    showCase(exercises.get(lesson.id), select.selectedIndex + 1);
  }

  fragment.querySelector('[for="kabbalah-lesson"]').textContent = labels.choose;
  sourceLabel.textContent = labels.sources;
  exerciseLabel.textContent = labels.apply;
  help.textContent = labels.local;
  for (const [index, group] of [kabbalahLessons,advancedReadings].entries()) {
    const options = document.createElement('optgroup');
    options.label = labels.groups[index];
    options.append(...group.map(lesson => new Option(lesson.title[locale], lesson.id)));
    select.append(options);
  }
  if (view.lesson) select.value = view.lesson;
  select.addEventListener('change', showLesson);
  sourcePanel.open = view.sourcesOpen;
  exercise.open = view.exerciseOpen;
  sourcePanel.addEventListener('toggle', () => {
    if (sourcePanel.isConnected) view.sourcesOpen = sourcePanel.open;
  });
  exercise.addEventListener('toggle', () => {
    if (exercise.isConnected) view.exerciseOpen = exercise.open;
  });
  showLesson();
  panel.replaceChildren(fragment);
}
