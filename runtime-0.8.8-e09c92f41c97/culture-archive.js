import { cultureCases, cultureRecords } from './culture-lessons.js';
import { objectSprite } from './object-sprite.js';

const frames = [
  'kaifeng-stele','ferrara-bible','tsenerene-print','glikl-memoir',
  'baldones-census','regina-jonas','maimunah-song','juhuri-recording',
];

const copy = {
  tr:{
    select:'Arşivdeki nesne', sources:'Belge ve kaynaklar', apply:'Bir sergi etiketi seç',
    retry:'Kaynağın hangi kişi, yer veya tarih hakkında bilgi verdiğine bak.',
  },
  en:{
    select:'Archive object', sources:'Records and sources', apply:'Choose an exhibition label',
    retry:'Check which person, place or date the source documents.',
  },
  he:{
    select:'פריט מהארכיון', sources:'תיעוד ומקורות', apply:'בחרו תווית לתערוכה',
    retry:'בדקו איזה אדם, מקום או זמן המקור מתעד.',
  },
  az:{
    select:'Arxivdəki əşya', sources:'Sənədlər və mənbələr', apply:'Sərgi etiketi seç',
    retry:'Mənbənin hansı şəxs, yer və ya tarix barədə məlumat verdiyinə bax.',
  },
};

export function mountCultureArchive(panel, language, locale, view) {
  const fragment = document.getElementById('culture-template').content.cloneNode(true);
  const [label, select, article, exercise] = fragment.children;
  const [era, figure, context, sourcesPanel] = article.children;
  const [canvas, object] = figure.children;
  const [sourcesLabel, limit, links] = sourcesPanel.children;
  const [exerciseLabel, question, choices, feedback] = exercise.children;
  const labels = copy[language];
  const draw = objectSprite(canvas, new URL('./assets/culture-objects.png', import.meta.url), 4);

  function showCase(sample, offset) {
    exercise.hidden = !sample;
    if (!sample) return;
    question.textContent = sample.question[locale];
    feedback.textContent = '';
    choices.replaceChildren(...sample.choices.map((_,position) => {
      const choice = (position + offset) % sample.choices.length;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = sample.choices[choice][locale];
      button.dataset.cultureChoice = String(choice);
      button.setAttribute('aria-pressed','false');
      button.addEventListener('click', () => {
        for (const sibling of choices.children) sibling.setAttribute('aria-pressed',String(sibling === button));
        feedback.textContent = choice === sample.correct ? sample.feedback[locale] : labels.retry;
      });
      return button;
    }));
  }

  function showRecord() {
    const record = cultureRecords[select.selectedIndex];
    view.record = record.id;
    era.textContent = record.era[locale];
    object.textContent = record.object[locale];
    context.textContent = record.context[locale];
    limit.textContent = record.limit[locale];
    draw(frames.indexOf(record.id));
    links.replaceChildren(...record.sources.map(source => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.title[locale];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dir = 'auto';
      item.append(link);
      return item;
    }));
    showCase(cultureCases.find(sample => sample.recordId === record.id), select.selectedIndex);
  }

  label.textContent = labels.select;
  sourcesLabel.textContent = labels.sources;
  exerciseLabel.textContent = labels.apply;
  select.replaceChildren(...cultureRecords.map(record => new Option(record.title[locale],record.id)));
  if (view.record) select.value = view.record;
  select.addEventListener('change',showRecord);
  showRecord();
  panel.replaceChildren(fragment);
}
