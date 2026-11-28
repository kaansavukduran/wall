import { accountabilityCases, accountabilityRecords } from './accountability-lessons.js';

const copy = {
  tr:['Olayı seç','Sorumluluk','Etkilenenler','Belgeler ve sınırları','Bir sergi etiketi seç','Belgenin tarihi ve kimi kapsadığına tekrar bak.'],
  en:['Choose an event','Responsibility','People affected','Records and their limits','Choose an exhibition label','Look again at when the record was made and whom it covers.'],
  he:['בחרו אירוע','אחריות','מי נפגע','מסמכים וגבולותיהם','בחרו תווית לתערוכה','בדקו שוב מתי נערך המסמך ואת מי הוא מכסה.'],
  az:['Hadisəni seç','Məsuliyyət','Təsirə məruz qalanlar','Sənədlər və onların sərhədləri','Sərgi etiketi seç','Sənədin tarixinə və kimləri əhatə etdiyinə yenidən bax.'],
};

export function mountAccountabilityArchive(panel, language, locale, view) {
  const fragment = document.getElementById('accountability-template').content.cloneNode(true);
  const [label, select, article, exercise] = fragment.children;
  const [title, date, parties, account, sourceSection] = article.children;
  const [responsibility, actor, affectedLabel, affected] = parties.children;
  const [sourcesLabel, limit, links] = sourceSection.children;
  const [exerciseLabel, question, choices, feedback] = exercise.children;
  const labels = copy[language];
  [label, responsibility, affectedLabel, sourcesLabel, exerciseLabel].forEach((element, index) => {
    element.textContent = labels[index];
  });

  function showRecord() {
    const record = accountabilityRecords[select.selectedIndex];
    view.record = record.id;
    title.textContent = record.title[locale];
    date.textContent = record.datePlace[locale];
    actor.textContent = record.actor[locale];
    affected.textContent = record.affected[locale];
    account.textContent = record.account[locale];
    limit.textContent = record.evidenceLimit[locale];
    links.replaceChildren(...record.sources.map(source => {
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

    const sample = accountabilityCases[record.id];
    exercise.hidden = !sample;
    feedback.textContent = '';
    choices.replaceChildren();
    if (!sample) return;
    question.textContent = sample.question[locale];
    for (const [index, option] of sample.choices.entries()) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = option[locale];
      button.dataset.accountabilityChoice = String(index);
      button.setAttribute('aria-pressed','false');
      button.addEventListener('click', () => {
        for (const sibling of choices.children) sibling.setAttribute('aria-pressed',String(sibling === button));
        feedback.textContent = index === sample.correct ? sample.result[locale] : labels[5];
      });
      choices.append(button);
    }
  }

  select.replaceChildren(...accountabilityRecords.map(record => new Option(record.label[locale],record.id)));
  if (view.record) select.value = view.record;
  select.addEventListener('change',showRecord);
  showRecord();
  panel.replaceChildren(fragment);
}
