import { bakuCopy, bakuStops } from './baku-lessons.js';
import { objectSprite } from './object-sprite.js';

export function mountBakuArchive(panel, locale, view) {
  const fragment = document.getElementById('baku-template').content.cloneNode(true);
  const [intro, stops, article, exercise] = fragment.children;
  const [views, figure, links] = article.children;
  const [canvas, caption] = figure.children;
  const [captionText, example] = caption.children;
  const [question, answers, result] = exercise.children;
  const [overview, stopLabel, viewLabel, retry] = bakuCopy.map(line => line[locale]);
  const draw = objectSprite(canvas, new URL('./assets/baku-archive.png', import.meta.url), 4);

  view.stop ??= 0;
  view.visits ??= bakuStops.map(() => ({side:0,choice:null}));
  intro.textContent = overview;
  stops.setAttribute('aria-label',stopLabel);
  views.setAttribute('aria-label',viewLabel);

  function buttons(container, items, attribute, activate) {
    container.replaceChildren(...items.map((item,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = item[locale];
      button.dataset[attribute] = String(index);
      button.addEventListener('click',() => activate(index));
      return button;
    }));
  }

  function mark(container, selected) {
    for (const [index, button] of [...container.children].entries()) {
      button.setAttribute('aria-pressed',String(index === selected));
    }
  }

  function showView() {
    const stop = bakuStops[view.stop];
    const visit = view.visits[view.stop];
    const side = stop.views[visit.side];
    mark(views,visit.side);
    draw(view.stop * 4 + visit.side);
    captionText.textContent = side.note[locale];
    example.hidden = !side.example;
    if (side.example) {
      const [word,script,direction] = side.example;
      example.textContent = word;
      example.lang = 'jdt-' + script;
      example.dir = direction;
    }
  }

  function showAnswer() {
    const stop = bakuStops[view.stop];
    const {choice} = view.visits[view.stop];
    mark(answers,choice);
    result.textContent = choice === null ? '' : choice === stop.correct ? stop.feedback[locale] : retry;
  }

  function showStop(index) {
    view.stop = index;
    const stop = bakuStops[index];
    const visit = view.visits[index];
    mark(stops,index);
    buttons(views,stop.views.map(side => side.label),'bakuView',side => {
      visit.side = side;
      showView();
    });
    links.replaceChildren(...stop.sources.map(({name,url}) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dir = 'auto';
      link.textContent = name;
      item.append(link);
      return item;
    }));
    question.textContent = stop.question[locale];
    buttons(answers,stop.answers,'bakuAnswer',choice => {
      visit.choice = choice;
      showAnswer();
    });
    showView();
    showAnswer();
  }

  buttons(stops,bakuStops.map(stop => stop.title),'bakuStop',showStop);
  showStop(view.stop);
  panel.replaceChildren(fragment);
}
