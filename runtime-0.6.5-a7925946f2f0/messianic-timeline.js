import { messianicLessons } from './messianic-lessons.js';

const copy = {
  tr:['Daha erken tarihli bir kart var. İlk kalan tarihi ara.','Sırayı temizle'],
  en:['One remaining card starts earlier. Look for the earliest date.','Clear the order'],
  he:['יש כרטיס נוסף שמתחיל מוקדם יותר. חפשו את התאריך המוקדם ביותר שנותר.','ניקוי הסדר'],
  az:['Qalan kartlardan biri daha əvvələ aiddir. Ən erkən tarixi tap.','Sıranı təmizlə'],
};
const displayOrder = [2,4,1,3,0];

export function mountMessianicTimeline(panel, language, locale) {
  const fragment = document.getElementById('messianic-template').content.cloneNode(true);
  const [instruction, choices, order, status, reset, reading] = fragment.children;
  const [title, kind, detail, explanation, links] = reading.children;
  const {cards, activity} = messianicLessons;
  let placed = 0;

  function showCard(card) {
    title.textContent = card.title[locale];
    kind.textContent = card.date[locale] + ' · ' + card.sourceClass[locale];
    detail.textContent = card.placeActor[locale];
    explanation.textContent = card.explanation[locale];
    links.replaceChildren(...[card.source,card.relatedSource].filter(Boolean).map(source => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.title;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dir = 'auto';
      item.append(link);
      return item;
    }));
    reading.hidden = false;
  }

  function tryCard(card, button) {
    showCard(card);
    if (card.id !== activity.correctOrder[placed]) {
      status.textContent = copy[language][0];
      reset.disabled = false;
      return;
    }
    const entry = document.createElement('li');
    entry.textContent = card.date[locale] + ' · ' + card.title[locale];
    order.append(entry);
    button.disabled = true;
    reset.disabled = false;
    placed++;
    status.textContent = placed === cards.length ? activity.feedback[locale] : '';
    (choices.querySelector('button:enabled') ?? reset).focus();
  }

  instruction.textContent = activity.instruction[locale];
  reset.textContent = copy[language][1];
  choices.replaceChildren(...displayOrder.map(index => {
    const card = cards[index];
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.timelineCard = card.id;
    button.textContent = card.title[locale];
    const date = document.createElement('small');
    date.textContent = card.date[locale];
    button.append(date);
    button.addEventListener('click', () => tryCard(card, button));
    return button;
  }));
  reset.addEventListener('click', () => {
    placed = 0;
    order.replaceChildren();
    status.textContent = '';
    reading.hidden = true;
    for (const button of choices.children) button.disabled = false;
    choices.firstElementChild.focus();
    reset.disabled = true;
  });
  panel.replaceChildren(fragment);
}
