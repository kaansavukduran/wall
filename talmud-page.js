import { talmudCards, pageNote, pageFeedback } from './talmud-lessons.js';

const copy = {
  tr:{
    reading:'Metin katmanı', flip:'Sayfayı çevir', binding:['Cilt sağda','Cilt solda'],
    areas:['Sol kenar','Merkez','Sağ kenar'], prompt:'Sayfada bir bölgeye dokun, sonra metni seç.',
    answers:['Mişna ve Gemara','Rashi','Tosafot'], check:'Eşleşmeleri kontrol et',
    retry:'Cildin hangi tarafta olduğuna bak ve eşleşmeleri yeniden dene.',
  },
  en:{
    reading:'Text layer', flip:'Turn the page', binding:['Binding on the right','Binding on the left'],
    areas:['Left margin','Center','Right margin'], prompt:'Select a region on the page, then choose its text.',
    answers:['Mishnah and Gemara','Rashi','Tosafot'], check:'Check the positions',
    retry:'Look at the binding side and try matching the positions again.',
  },
  he:{
    reading:'שכבת טקסט', flip:'הפכו את הדף', binding:['הכריכה מימין','הכריכה משמאל'],
    areas:['שוליים שמאליים','מרכז','שוליים ימניים'], prompt:'בחרו אזור בדף ואז בחרו את הטקסט שלו.',
    answers:['משנה וגמרא','רש״י','תוספות'], check:'בדקו את ההתאמות',
    retry:'בדקו באיזה צד נמצאת הכריכה ונסו להתאים שוב.',
  },
  az:{
    reading:'Mətn qatı', flip:'Səhifəni çevir', binding:['Cild sağdadır','Cild soldadır'],
    areas:['Sol kənar','Mərkəz','Sağ kənar'], prompt:'Səhifədə bir sahəni, sonra həmin sahənin mətnini seç.',
    answers:['Mişna və Gemara','Raşi','Tosafot'], check:'Uyğunluğu yoxla',
    retry:'Cildin hansı tərəfdə olduğuna bax və yenidən sına.',
  },
};

export function mountTalmudPage(panel, language, locale, view) {
  const fragment = document.getElementById('talmud-template').content.cloneNode(true);
  const [label, select, reading, sheet, exercise] = fragment.children;
  const [layer, meaning, limit, sources] = reading.children;
  const [graphic, binding, note, flip] = sheet.children;
  const [legend, position, fields, check, feedback] = exercise.children;
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
    position.textContent = labels.areas[view.position];
    const answers = view.answers[view.side];
    for (const [index, region] of [...graphic.children].entries()) {
      region.setAttribute('aria-pressed',String(view.position === index));
      region.classList.toggle('has-answer',answers[index] !== '');
    }
    for (const button of fields.children) button.setAttribute('aria-pressed',String(answers[view.position] === button.dataset.pageText));
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
  for (const [index, region] of [...graphic.children].entries()) {
    region.setAttribute('aria-label',labels.areas[index]);
    region.addEventListener('click', () => {
      view.position = index;
      refreshPage();
    });
  }
  fields.replaceChildren(...labels.answers.map((answer,index) => {
    const choice = document.createElement('button');
    choice.type = 'button';
    choice.dataset.pageText = String(index);
    choice.textContent = answer;
    choice.addEventListener('click', () => {
      view.answers[view.side][view.position] = choice.dataset.pageText;
      refreshPage();
    });
    return choice;
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
