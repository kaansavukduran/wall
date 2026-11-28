import { objectSprite } from './object-sprite.js';
import { circleCopy, circleTurns } from './study-circle-lessons.js';

export function mountStudyCircle(panel, locale, view) {
  const fragment = document.getElementById('circle-template').content.cloneNode(true);
  const [intro, figure, question, choices, output, sources, next] = fragment.children;
  const [canvas, caption] = figure.children;
  const [speaker, speech] = caption.children;
  const [sourcesTitle, links] = sources.children;
  const [overview, prompt, sourceLabel, nextLabel, replay] = circleCopy.map(line => line[locale]);
  const draw = objectSprite(canvas, new URL('./assets/study-circle.png', import.meta.url), 3);
  view.step ??= 0;
  view.answer ??= null;

  intro.textContent = overview;
  question.textContent = prompt;
  sourcesTitle.textContent = sourceLabel;

  function showResponse() {
    const turn = circleTurns[view.step];
    const solved = view.answer === turn.correct;
    output.textContent = view.answer === null ? '' : (solved ? turn.response : turn.retry)[locale];
    next.hidden = !solved;
    draw(view.step + (solved ? circleTurns.length : 0));
    for (const [index, button] of [...choices.children].entries()) {
      button.setAttribute('aria-pressed',String(view.answer === index));
    }
  }

  function showTurn() {
    const turn = circleTurns[view.step];
    speaker.textContent = turn.name[locale];
    speech.textContent = turn.speech[locale];
    next.textContent = view.step === circleTurns.length - 1 ? replay : nextLabel;
    choices.replaceChildren(...turn.choices.map((option,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.circleChoice = String(index);
      button.textContent = option[locale];
      button.addEventListener('click', () => {
        view.answer = index;
        showResponse();
      });
      return button;
    }));
    links.replaceChildren(...turn.sources.map(([title,url]) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = title;
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dir = 'auto';
      item.append(link);
      return item;
    }));
    showResponse();
  }

  next.addEventListener('click', () => {
    view.step = (view.step + 1) % circleTurns.length;
    view.answer = null;
    sources.open = false;
    showTurn();
    choices.firstElementChild.focus();
  });

  showTurn();
  panel.replaceChildren(fragment);
}
