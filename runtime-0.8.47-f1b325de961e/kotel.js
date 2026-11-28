import { kotelLessons, kotelScenarios } from './kotel-lessons.js';
import { objectSprite } from './object-sprite.js';

const sheet = new URL('./assets/kotel-props.png', import.meta.url);
const frames = {
  'kotel-names':0, 'kotel-observe':1, 'kotel-amidah':2, 'kotel-notes':3, 'kotel-shema':4,
  'kotel-tallit':5, 'kotel-tefillin':6, 'kotel-siddur-torah':7, 'kotel-customs':8, 'kotel-platform':9,
};
const copy = {
  tr: {
    topic:'Neyi incelemek istersin?', sources:'Kaynaklar', practice:'Bir ziyaret durumunu incele',
    scenario:'Ziyaret durumu', names:['Bir not bırakmak','Toplu Tora okuması'], reference:'Bu örneğin kaynağı',
  },
  en: {
    topic:'What would you like to inspect?', sources:'Sources', practice:'Explore a visit scenario',
    scenario:'Visit scenario', names:['Leaving a note','Public Torah reading'], reference:'Source for this example',
  },
  he: {
    topic:'מה תרצו לבדוק?', sources:'מקורות', practice:'בדקו מצב שאפשר לפגוש בביקור',
    scenario:'מצב בביקור', names:['השארת פתק','קריאת תורה בציבור'], reference:'המקור לדוגמה הזאת',
  },
  az: {
    topic:'Nəyi araşdırmaq istəyirsən?', sources:'Mənbələr', practice:'Ziyarət vəziyyətini araşdır',
    scenario:'Ziyarət vəziyyəti', names:['Qeyd qoymaq','Camaatla Tövrat oxunuşu'], reference:'Bu nümunənin mənbəyi',
  },
};

export function mountKotel(panel, language, locale) {
  const fragment = document.getElementById('visit-template').content.cloneNode(true);
  const select = fragment.querySelector('#visit-topic');
  const [heading, object, history, sources] = fragment.querySelector('.visit-reading').children;
  const [canvas, detail] = object.children;
  const [sourceLabel, links] = sources.children;
  const exercise = fragment.querySelector('.visit-exercise');
  const [exerciseLabel, scenarioLabel, scenario, question, choices, feedback, link] = exercise.children;
  const showObject = objectSprite(canvas, sheet, 5);
  const labels = copy[language];

  function showTopic() {
    const lesson = kotelLessons[select.selectedIndex];
    heading.textContent = lesson.title[locale];
    detail.textContent = lesson.practice[locale];
    history.textContent = lesson.history[locale];
    links.replaceChildren(...lesson.sources.map(source => {
      const item = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.textContent = source.title;
      anchor.href = source.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.dir = 'auto';
      item.append(anchor);
      return item;
    }));
    showObject(frames[lesson.id]);
  }

  function showScenario() {
    const example = kotelScenarios[scenario.selectedIndex];
    feedback.textContent = '';
    link.hidden = true;
    question.textContent = example.question[locale];
    link.href = example.source;
    choices.replaceChildren(...example.options.map((_, index) => {
      const chosen = (index + scenario.selectedIndex + 1) % example.options.length;
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.visitChoice = String(chosen);
      button.textContent = example.options[chosen][locale];
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        for (const sibling of choices.children) sibling.setAttribute('aria-pressed', String(sibling === button));
        feedback.textContent = example.feedback[chosen][locale];
        link.hidden = false;
      });
      return button;
    }));
  }

  fragment.querySelector('[for="visit-topic"]').textContent = labels.topic;
  sourceLabel.textContent = labels.sources;
  exerciseLabel.textContent = labels.practice;
  scenarioLabel.textContent = labels.scenario;
  link.textContent = labels.reference;
  select.replaceChildren(...kotelLessons.map(lesson => new Option(lesson.title[locale], lesson.id)));
  scenario.replaceChildren(...kotelScenarios.map((example, index) => new Option(labels.names[index], example.id)));
  select.addEventListener('change', showTopic);
  scenario.addEventListener('change', showScenario);
  showTopic();
  showScenario();
  panel.replaceChildren(fragment);
}
