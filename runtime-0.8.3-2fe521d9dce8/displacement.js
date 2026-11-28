import { archiveCopy, displacementRecords } from './displacement-lessons.js';

export function mountDisplacement(panel, locale, view) {
  const fragment = document.getElementById('displacement-template').content.cloneNode(true);
  const [intro, label, select, article] = fragment.children;
  const [heading, summary, full] = article.children;
  const [detailsLabel, chronology, sources, prompt, choices, result] = full.children;
  const [overview, choose, details] = archiveCopy.map(text => text[locale]);
  view.record ??= displacementRecords[0].id;
  view.answers ??= {};

  intro.textContent = overview;
  label.textContent = choose;
  select.replaceChildren(...displacementRecords.map(record => new Option(record.title[locale],record.id)));
  select.value = view.record;
  detailsLabel.textContent = details;

  function showRecord() {
    const record = displacementRecords[select.selectedIndex];
    view.record = record.id;
    heading.textContent = record.title[locale];
    summary.textContent = record.summary[locale];
    chronology.replaceChildren(...record.steps.map(step => {
      const item = document.createElement('li');
      item.textContent = step[locale];
      return item;
    }));
    sources.replaceChildren(...record.sources.map(source => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = source.title;
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dir = 'auto';
      item.append(link);
      return item;
    }));
    prompt.textContent = record.prompt[locale];

    function showAnswer() {
      const selected = view.answers[record.id];
      for (const [index, button] of [...choices.children].entries()) {
        button.setAttribute('aria-pressed', String(index === selected));
      }
      result.textContent = selected === undefined ? '' : record.feedback[selected][locale];
    }

    choices.replaceChildren(...record.options.map((option,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = option[locale];
      button.dataset.displacementAnswer = String(index);
      button.addEventListener('click', () => {
        view.answers[record.id] = index;
        showAnswer();
      });
      return button;
    }));
    showAnswer();
  }

  select.addEventListener('change',showRecord);
  full.open = view.detailsOpen ?? false;
  full.addEventListener('toggle', () => {
    if (full.isConnected) view.detailsOpen = full.open;
  });
  showRecord();
  panel.replaceChildren(fragment);
}
