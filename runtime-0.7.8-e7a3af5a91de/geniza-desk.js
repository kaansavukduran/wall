import { deskCopy, genizaLetters } from './geniza-lessons.js';
import { objectSprite } from './object-sprite.js';

export function mountGenizaDesk(panel, locale, view) {
  const fragment = document.getElementById('geniza-template').content.cloneNode(true);
  const [intro, navigation, reading, exercise] = fragment.children;
  const [figure, flip, source] = reading.children;
  const [canvas, caption] = figure.children;
  const [prompt, choices, feedback] = exercise.children;
  const [overview, turn, returnToFront, openRecord, retry, choose] = deskCopy.map(line => line[locale]);
  const draw = objectSprite(canvas, new URL('./assets/geniza-letters.png', import.meta.url), 3);

  view.letter ??= 0;
  view.readings ??= genizaLetters.map(() => ({back:false,openedBack:false,choice:null}));
  intro.textContent = overview;
  navigation.setAttribute('aria-label',choose);
  source.textContent = openRecord;

  function showReading() {
    const letter = genizaLetters[view.letter];
    const state = view.readings[view.letter];
    const solved = state.choice === letter.correct;
    caption.textContent = (state.back ? letter.back : letter.front)[locale];
    flip.textContent = state.back ? returnToFront : turn;
    source.href = letter.url;
    exercise.hidden = !state.openedBack;
    draw(view.letter * 3 + (state.back ? (solved ? 2 : 1) : 0));
    feedback.textContent = state.choice === null ? '' : solved ? letter.result[locale] : retry;
    for (const [index, button] of [...choices.children].entries()) {
      button.setAttribute('aria-pressed',String(index === state.choice));
    }
  }

  function chooseLetter(index) {
    view.letter = index;
    const letter = genizaLetters[index];
    prompt.textContent = letter.prompt[locale];
    for (const [index, button] of [...navigation.children].entries()) {
      button.setAttribute('aria-pressed', String(index === view.letter));
    }
    choices.replaceChildren(...letter.options.map((option,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.genizaChoice = String(index);
      button.textContent = option[locale];
      button.addEventListener('click', () => {
        view.readings[view.letter].choice = index;
        showReading();
      });
      return button;
    }));
    showReading();
  }
  for (const [index, letter] of genizaLetters.entries()) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.genizaLetter = letter.id;
    button.textContent = letter.title[locale];
    button.addEventListener('click', () => chooseLetter(index));
    navigation.append(button);
  }
  flip.addEventListener('click', () => {
    const state = view.readings[view.letter];
    state.back = !state.back;
    if (state.back) state.openedBack = true;
    showReading();
  });
  chooseLetter(view.letter);
  panel.replaceChildren(fragment);
}
