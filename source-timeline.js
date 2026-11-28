const copy = {
  tr:['Daha erken tarihli bir kart var. İlk kalan tarihi ara.','Sırayı temizle'],
  en:['One remaining card starts earlier. Look for the earliest date.','Clear the order'],
  he:['יש כרטיס נוסף שמתחיל מוקדם יותר. חפשו את התאריך המוקדם ביותר שנותר.','ניקוי הסדר'],
  az:['Qalan kartlardan biri daha əvvələ aiddir. Ən erkən tarixi tap.','Sıranı təmizlə'],
};
export function mountSourceTimeline(panel, language, locale, lessons, view) {
  const fragment = document.getElementById('source-timeline-template').content.cloneNode(true);
  const [instruction, choices, order, status, reset, reading, check] = fragment.children;
  const [title, kind, detail, explanation, links] = reading.children;
  const {cards, activity, displayOrder} = lessons;
  const byId = new Map(cards.map(card => [card.id,card]));
  view.placed ??= 0;
  instruction.id = panel.parentElement.id + '-instruction';
  choices.setAttribute('aria-labelledby',instruction.id);

  function showCard(card) {
    view.card = card.id;
    title.textContent = card.title[locale];
    kind.textContent = card.date[locale] + ' · ' + card.sourceClass[locale];
    detail.textContent = card.placeActor[locale];
    explanation.textContent = card.explanation[locale];
    links.replaceChildren(...[card.source,card.relatedSource].filter(Boolean).map(source => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = typeof source.title === 'string' ? source.title : source.title[locale];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dir = 'auto';
      item.append(link);
      return item;
    }));
    reading.hidden = false;
  }

  function appendCard(card) {
    const entry = document.createElement('li');
    entry.textContent = card.date[locale] + ' · ' + card.title[locale];
    order.append(entry);
  }

  function updateStatus() {
    status.textContent = view.placed === cards.length ? activity.feedback[locale]
      : view.retry ? copy[language][0] : '';
    reset.disabled = !view.card;
    if (activity.check) updateCheck();
  }

  function updateCheck() {
    const [, answers, feedback] = check.children;
    const {correct,result,retry} = activity.check;
    check.hidden = view.placed !== cards.length;
    for (const [index,button] of Array.from(answers.children).entries()) {
      button.setAttribute('aria-pressed',String(view.answer === index));
    }
    feedback.textContent = view.answer == null ? '' : (view.answer === correct ? result : retry)[locale];
  }

  function tryCard(card, button) {
    showCard(card);
    view.retry = card.id !== activity.correctOrder[view.placed];
    if (!view.retry) {
      appendCard(card);
      button.disabled = true;
      view.placed++;
      (choices.querySelector('button:enabled') ?? reset).focus();
    }
    updateStatus();
  }

  instruction.textContent = activity.instruction[locale];
  reset.textContent = copy[language][1];
  choices.replaceChildren(...displayOrder.map(index => {
    const card = cards[index];
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.timelineCard = card.id;
    button.textContent = card.title[locale];
    button.disabled = activity.correctOrder.indexOf(card.id) < view.placed;
    const date = document.createElement('small');
    date.textContent = card.date[locale];
    button.append(date);
    button.addEventListener('click', () => tryCard(card, button));
    return button;
  }));
  reset.addEventListener('click', () => {
    view.placed = 0;
    view.card = null;
    view.retry = false;
    if (activity.check) view.answer = null;
    order.replaceChildren();
    reading.hidden = true;
    for (const button of choices.children) button.disabled = false;
    choices.firstElementChild.focus();
    updateStatus();
  });
  if (activity.check) {
    const [legend, answers] = check.children;
    legend.textContent = activity.check.question[locale];
    answers.replaceChildren(...activity.check.options.map((option,index) => {
      const answer = document.createElement('button');
      answer.type = 'button';
      answer.textContent = option[locale];
      answer.addEventListener('click', () => {
        view.answer = index;
        updateCheck();
      });
      return answer;
    }));
  }
  for (const id of activity.correctOrder.slice(0,view.placed)) appendCard(byId.get(id));
  if (view.card) showCard(byId.get(view.card));
  updateStatus();
  panel.replaceChildren(fragment);
}
