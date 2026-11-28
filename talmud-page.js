import { talmudCards, pageNote, pageFeedback } from './talmud-lessons.js';

const copy = {
  tr:{
    reading:'Metin katmanı', flip:'Sayfayı çevir', binding:['Cilt sağda','Cilt solda'],
    areas:['Sol kenar','Merkez','Sağ kenar'], prompt:'Üç metni sayfadaki yerleriyle eşleştir.',
    answers:['Mişna ve Gemara','Rashi','Tosafot'], choose:'Metni seç', check:'Eşleşmeleri kontrol et',
    retry:'Cildin hangi tarafta olduğuna bak ve eşleşmeleri yeniden dene.',
  },
  en:{
    reading:'Text layer', flip:'Turn the page', binding:['Binding on the right','Binding on the left'],
    areas:['Left margin','Center','Right margin'], prompt:'Match the three texts to their positions on the page.',
    answers:['Mishnah and Gemara','Rashi','Tosafot'], choose:'Choose a text', check:'Check the positions',
    retry:'Look at the binding side and try matching the positions again.',
  },
  he:{
    reading:'שכבת טקסט', flip:'הפכו את הדף', binding:['הכריכה מימין','הכריכה משמאל'],
    areas:['שוליים שמאליים','מרכז','שוליים ימניים'], prompt:'התאימו את שלושת הטקסטים למקומם בדף.',
    answers:['משנה וגמרא','רש״י','תוספות'], choose:'בחרו טקסט', check:'בדקו את ההתאמות',
    retry:'בדקו באיזה צד נמצאת הכריכה ונסו להתאים שוב.',
  },
  az:{
    reading:'Mətn qatı', flip:'Səhifəni çevir', binding:['Cild sağdadır','Cild soldadır'],
    areas:['Sol kənar','Mərkəz','Sağ kənar'], prompt:'Üç mətni səhifədəki yerlərinə uyğunlaşdır.',
    answers:['Mişna və Gemara','Raşi','Tosafot'], choose:'Mətni seç', check:'Uyğunluğu yoxla',
    retry:'Cildin hansı tərəfdə olduğuna bax və yenidən sına.',
  },
};

export function mountTalmudPage(panel, language, locale, view) {
  const fragment = document.getElementById('talmud-template').content.cloneNode(true);
  const [label, select, reading, sheet, exercise] = fragment.children;
  const [layer, meaning, limit, sources] = reading.children;
  const [graphic, binding, note, flip] = sheet.children;
  const [legend, fields, check, feedback] = exercise.children;
  const labels = copy[language];

  function readCard() {
    const card = talmudCards[select.selectedIndex];
    view.reading = card.id;
    layer.textContent = card.layer[locale];
    meaning.textContent = card.meaning[locale];
    limit.textContent = card.limit[locale];
    sources.replaceChildren(...card.refs.map(item => {
      const row = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.url;
      link.textContent = item.title[locale];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dir = 'auto';
      row.append(link);
      return row;
    }));
  }

  function refreshPage() {
    graphic.dataset.binding = view.side === 0 ? 'right' : 'left';
    binding.textContent = labels.binding[view.side];
    for (const [index, field] of [...fields.children].entries()) {
      field.querySelector('select').value = view.answers[view.side][index];
    }
    feedback.textContent = '';
  }

  label.textContent = labels.reading;
  select.replaceChildren(...talmudCards.map(card => new Option(card.title[locale],card.id)));
  if (view.reading) select.value = view.reading;
  select.addEventListener('change',readCard);
  readCard();
  flip.textContent = labels.flip;
  flip.addEventListener('click', () => {
    view.side = 1 - view.side;
    refreshPage();
  });
  note.textContent = pageNote[locale];
  legend.textContent = labels.prompt;
  fields.replaceChildren(...labels.areas.map((position,index) => {
    const item = document.createElement('div');
    item.dir = 'auto';
    const name = document.createElement('label');
    const field = document.createElement('select');
    field.id = 'talmud-position-' + index;
    name.htmlFor = field.id;
    name.textContent = position;
    field.append(new Option(labels.choose,''), ...labels.answers.map((answer,number) => new Option(answer,String(number))));
    field.addEventListener('change', () => {
      view.answers[view.side][index] = field.value;
      feedback.textContent = '';
    });
    field.addEventListener('focus', () => graphic.dataset.highlight = String(index));
    field.addEventListener('blur', () => delete graphic.dataset.highlight);
    item.append(name,field);
    return item;
  }));
  check.textContent = labels.check;
  check.addEventListener('click', () => {
    const correct = view.side === 0 ? ['2','0','1'] : ['1','0','2'];
    const matched = view.answers[view.side].every((value,index) => value === correct[index]);
    feedback.textContent = matched ? pageFeedback[locale] : labels.retry;
  });
  refreshPage();
  panel.replaceChildren(fragment);
}
