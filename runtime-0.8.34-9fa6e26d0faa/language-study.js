import { languageLessons } from './language-lessons.js';

const copy = {
  tr: {
    intro:'Sözcüğü özgün yazımıyla oku, okunuşuna bak ve metinde hangi anlamda kullanıldığını incele.',
    card:'Sözcük veya metin', pointing:'Noktalı yazımı göster', sources:'Kaynaklar',
    practice:'Sözcükleri karşılaştır', example:'Alıştırma', number:n => 'Örnek ' + n,
    retry:'Kaynağı veya sözcük kartlarını inceleyip başka bir yanıt dene.', link:'Alıştırmanın kaynağı',
  },
  en: {
    intro:'Read a word in its original spelling, see its transliteration, and examine what it means in the source.',
    card:'Word or text', pointing:'Show the pointing marks', sources:'Sources',
    practice:'Compare the words', example:'Exercise', number:n => 'Example ' + n,
    retry:'Read the source or word cards and try a different answer.', link:'Source for the exercise',
  },
  he: {
    intro:'קראו את המילה בכתיב המקורי, עיינו בתעתיק ובדקו את משמעותה במקור.',
    card:'מילה או טקסט', pointing:'הצגת סימני הניקוד', sources:'מקורות',
    practice:'השוו בין המילים', example:'תרגיל', number:n => 'דוגמה ' + n,
    retry:'עיינו במקור או בכרטיסי המילים ונסו תשובה אחרת.', link:'מקור לתרגיל',
  },
  az: {
    intro:'Sözü orijinal yazılışında oxu, transkripsiyasına bax və mənbədəki mənasını araşdır.',
    card:'Söz və ya mətn', pointing:'Nöqtəli yazılışı göstər', sources:'Mənbələr',
    practice:'Sözləri müqayisə et', example:'Tapşırıq', number:n => 'Nümunə ' + n,
    retry:'Mənbəyə və ya söz kartlarına bax, sonra başqa cavabı yoxla.', link:'Tapşırığın mənbəyi',
  },
};
const withoutPointing = text => text.replace(/[\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7]/g, '');

function sourceItems(lesson) {
  return [lesson.source, lesson.relatedSource].filter(Boolean).map(source => {
    const entry = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = source.title;
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.dir = 'auto';
    entry.append(link);
    return entry;
  });
}

export function mountLanguageStudy(panel, language, locale, view) {
  const fragment = document.getElementById('language-study-template').content.cloneNode(true);
  const card = fragment.querySelector('#language-card');
  const [heading, word, pointing, evidence, note, sources] = fragment.querySelector('.language-reading').children;
  const [origin, original, transliteration] = word.children;
  const [sourceLabel, links] = sources.children;
  const exercise = fragment.querySelector('.language-exercise');
  const [exerciseLabel, exampleLabel, example, prompt, choices, feedback, exampleSources] = exercise.children;
  const labels = copy[language];
  const number = new Intl.NumberFormat(language);
  const {cards,exercises} = languageLessons;

  function showSpelling() {
    const lesson = cards[card.selectedIndex];
    const bare = withoutPointing(lesson.term);
    original.textContent = view.marked ? lesson.term : bare;
    pointing.hidden = lesson.term === bare;
    pointing.setAttribute('aria-pressed', String(view.marked));
  }

  function showCard() {
    const lesson = cards[card.selectedIndex];
    view.card = lesson.id;
    heading.textContent = lesson.label[locale];
    origin.textContent = lesson.language[locale];
    original.lang = lesson.originalLanguage ?? 'he';
    transliteration.textContent = lesson.transliteration;
    evidence.textContent = lesson.evidence[locale];
    note.textContent = lesson.note[locale];
    links.replaceChildren(...sourceItems(lesson));
    showSpelling();
  }

  function showExample() {
    const sample = exercises[example.selectedIndex];
    view.example = sample.id;
    exampleSources.replaceChildren(...sourceItems(sample));
    prompt.textContent = sample.prompt[locale];

    function showAnswer() {
      for (const button of choices.children) {
        button.setAttribute('aria-pressed',String(Number(button.dataset.languageChoice) === view.choice));
      }
      feedback.textContent = view.choice === undefined ? ''
        : view.choice === sample.correct ? sample.feedback[locale] : labels.retry;
      exampleSources.hidden = view.choice === undefined;
    }

    choices.replaceChildren(...sample.options.map((_, index) => {
      const choice = (index + example.selectedIndex + 1) % sample.options.length;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = sample.options[choice][locale];
      button.dataset.languageChoice = String(choice);
      button.addEventListener('click', () => {
        view.choice = choice;
        showAnswer();
      });
      return button;
    }));
    showAnswer();
  }

  fragment.querySelector('.language-study-intro').textContent = labels.intro;
  fragment.querySelector('[for="language-card"]').textContent = labels.card;
  pointing.textContent = labels.pointing;
  sourceLabel.textContent = labels.sources;
  exerciseLabel.textContent = labels.practice;
  exampleLabel.textContent = labels.example;
  exampleSources.setAttribute('aria-label',labels.link);
  card.replaceChildren(...cards.map(lesson => new Option(lesson.label[locale],lesson.id)));
  example.replaceChildren(...exercises.map((sample,index) => new Option(labels.number(number.format(index + 1)),sample.id)));
  if (view.card) card.value = view.card;
  if (view.example) example.value = view.example;
  sources.open = !!view.sourcesOpen;
  exercise.open = !!view.exerciseOpen;
  sources.addEventListener('toggle',() => { view.sourcesOpen = sources.open; });
  exercise.addEventListener('toggle',() => { view.exerciseOpen = exercise.open; });
  card.addEventListener('change',showCard);
  pointing.addEventListener('click', () => {
    view.marked = !view.marked;
    showSpelling();
  });
  example.addEventListener('change',() => {
    view.choice = undefined;
    showExample();
  });
  showCard();
  showExample();
  panel.replaceChildren(fragment);
}
