import { calendarEvents, shabbatStudy } from './calendar-lessons.js';

const months = {
  tr: ['Her hafta','Nisan','İyar','Sivan','Tamuz','Av','Elul','Tişri','Heşvan','Kislev','Tevet','Şevat','Adar','Adar II'],
  en: ['Every week','Nisan','Iyar','Sivan','Tammuz','Av','Elul','Tishrei','Cheshvan','Kislev','Tevet','Shevat','Adar','Adar II'],
  he: ['בכל שבוע','ניסן','אייר','סיוון','תמוז','אב','אלול','תשרי','חשוון','כסלו','טבת','שבט','אדר','אדר ב׳'],
  az: ['Hər həftə','Nisan','İyar','Sivan','Tamuz','Av','Elul','Tişri','Xeşvan','Kislev','Tevet','Şevat','Adar','II Adar'],
};

const copy = {
  tr: {
    intro:'İbrani takvimi Ay’a ve Güneş’e göre düzenlenir. Yıl numarası Tişri’de değişir. Bazı yıllarda ikinci bir Adar ayı eklenir. Takvimde bir gün, önceki akşam başlar.',
    month:'Dönem', monthly:'Her ay', days:'Takvim günleri', empty:'Bu dönem için henüz bir kart yok.',
    year:'Yıl türü', common:'12 ay', leap:'Artık yıl', firstAdar:'Adar I',
    custom:'Geleneksel bayram günleri', israel:'İsrail', diaspora:'Diaspora',
    practice:'Bir günü takvime yerleştir', answer:'Ayı seç', check:'Kontrol et', next:'Sonraki örnek',
    retry:'Bir daha dene. İpucundaki uygulamayı takvim kartlarında ara.',
    clues:['Matsa yenir ve Çıkış anlatısı bir sofrada yeniden anlatılır.','Kandiller sekiz gece yakılır. İlk gece hangi aya denk gelir?','Yılın başında birçok cemaatte şofar sesi duyulur.','Pesah bitince bazı Fas Yahudisi aileler evlerini misafirlere açar. Mimuna hangi aya denk gelir?'],
  },
  en: {
    intro:'The Hebrew calendar follows both the Moon and Sun. The year number changes in Tishrei. Some years add a second Adar. A calendar day starts the evening before.',
    month:'Period', monthly:'Every month', days:'Calendar dates', empty:'There is no card for this period yet.',
    year:'Year type', common:'12 months', leap:'Leap year', firstAdar:'Adar I',
    custom:'Traditional festival dates', israel:'Israel', diaspora:'Diaspora',
    practice:'Place an observance on the calendar', answer:'Choose the month', check:'Check', next:'Next example',
    retry:'Try again. Look for the practice in the calendar cards.',
    clues:['People eat matzah and retell the Exodus around a table.','Lamps are lit for eight nights. Which month has the first night?','Many communities sound the shofar as the new year begins.','After Passover, some Moroccan Jewish families welcome guests for Mimouna. Which month is it?'],
  },
  he: {
    intro:'הלוח העברי מתואם עם הירח והשמש. מספר השנה משתנה בתשרי. בשנים מסוימות נוסף אדר שני. היום בלוח מתחיל בערב שלפניו.',
    month:'תקופה', monthly:'בכל חודש', days:'מועדים בלוח', empty:'עדיין אין כרטיס לתקופה הזאת.',
    year:'סוג השנה', common:'12 חודשים', leap:'שנה מעוברת', firstAdar:'אדר א׳',
    custom:'מועדי החגים לפי המנהג', israel:'ישראל', diaspora:'תפוצות',
    practice:'שבצו את המועד בלוח', answer:'בחרו חודש', check:'בדיקה', next:'הדוגמה הבאה',
    retry:'נסו שוב. חפשו בכרטיסי הלוח את המנהג שברמז.',
    clues:['אוכלים מצה ומספרים סביב השולחן את סיפור יציאת מצרים.','מדליקים נרות במשך שמונה לילות. באיזה חודש חל הלילה הראשון?','בקהילות רבות תוקעים בשופר בתחילת השנה.','אחרי פסח משפחות מיהודי מרוקו מארחות במימונה. באיזה חודש זה?'],
  },
  az: {
    intro:'İbrani təqvimi Ay və Günəş dövrlərinə əsaslanır. İlin nömrəsi Tişridə dəyişir. Bəzi illərdə ikinci Adar ayı əlavə olunur. Təqvim günü əvvəlki axşam başlayır.',
    month:'Dövr', monthly:'Hər ay', days:'Təqvim günləri', empty:'Bu dövr üçün hələ kart yoxdur.',
    year:'İlin növü', common:'12 ay', leap:'Uzun il', firstAdar:'I Adar',
    custom:'Ənənəvi bayram günləri', israel:'İsrail', diaspora:'Diaspor',
    practice:'Mərasimi təqvimdə yerləşdir', answer:'Ayı seç', check:'Yoxla', next:'Növbəti nümunə',
    retry:'Bir də cəhd et. İpucundakı adəti təqvim kartlarında axtar.',
    clues:['Matsa yeyilir və süfrə ətrafında Misirdən çıxış əhvalatı danışılır.','Çıraqlar səkkiz gecə yandırılır. Birinci gecə hansı aya düşür?','Yeni il başlayanda bir çox icmada şofar çalınır.','Pesahdan sonra bəzi Mərakeş yəhudi ailələri Mimunada qonaq qəbul edir. Mimuna hansı aya düşür?'],
  },
};

const periodOrder = [0,-1,7,8,9,10,11,12,13,1,2,3,4,5,6];
const practiceEvents = ['pesach','chanukah','rosh-hashanah','mimouna'];

function sourceLink({url, title}) {
  const link = document.createElement('a');
  link.textContent = title;
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.dir = 'auto';
  return link;
}

function prepareShabbat(panel, locale, view) {
  const [title, introduction, cards, prompt, answers, status] = panel.children;
  function showAnswer() {
    for (const button of answers.children) {
      button.setAttribute('aria-pressed', String(button.dataset.shabbatPlace === view.answer));
    }
    const result = view.answer === shabbatStudy.answer ? shabbatStudy.feedback : shabbatStudy.retry;
    status.textContent = view.answer ? result[locale] : '';
  }

  title.textContent = shabbatStudy.heading[locale];
  introduction.textContent = shabbatStudy.introduction[locale];
  introduction.append(' ', sourceLink(shabbatStudy.text));
  panel.open = view.open;
  title.addEventListener('click', () => { view.open = !panel.open; });
  panel.addEventListener('toggle', () => {
    if (panel.isConnected) view.open = panel.open;
  });
  for (const place of shabbatStudy.places) {
    const card = document.createElement('details');
    const summary = document.createElement('summary');
    const practice = document.createElement('p');
    summary.textContent = place.title[locale];
    practice.textContent = place.practice[locale];
    card.append(summary, practice, sourceLink(place.source));
    card.open = view.cards.has(place.id);
    const remember = open => {
      if (open) view.cards.add(place.id);
      else view.cards.delete(place.id);
    };
    summary.addEventListener('click', () => remember(!card.open));
    card.addEventListener('toggle', () => {
      if (card.isConnected) remember(card.open);
    });
    cards.append(card);

    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.shabbatPlace = place.id;
    button.textContent = place.title[locale];
    button.addEventListener('click', () => {
      view.answer = place.id;
      showAnswer();
    });
    answers.append(button);
  }
  prompt.textContent = shabbatStudy.question[locale];
  showAnswer();
}

export function mountCalendar(panel, language, locale, view) {
  const fragment = document.getElementById('calendar-template').content.cloneNode(true);
  const labels = copy[language];
  const monthNames = months[language];
  const number = new Intl.NumberFormat(language);
  const period = fragment.querySelector('#calendar-period');
  const year = fragment.querySelector('#calendar-year');
  const custom = fragment.querySelector('#calendar-custom');
  const dates = fragment.querySelector('.calendar-days');
  const reading = fragment.querySelector('.calendar-reading');
  const [name, practice, history, links, shabbat] = reading.children;
  const answer = fragment.querySelector('#calendar-answer');
  const exercise = fragment.querySelector('.calendar-practice');
  const clue = exercise.querySelector('#calendar-clue');
  const check = exercise.querySelector('button');
  const status = exercise.querySelector('[role="status"]');
  let example = 0;
  let solved = false;
  const eventDay = event => custom.value === 'diaspora' ? event.diasporaDay ?? event.day : event.day;

  function dateLabel(day, month) {
    return month === 0 ? monthNames[0] : number.format(day) + ' ' + monthNames[month];
  }

  function showReading(event, selected) {
    for (const button of dates.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button === selected));
    }
    view.event = event.id;
    name.textContent = event.name[locale];
    practice.textContent = event.practice[locale];
    history.textContent = event.history[locale];
    links.replaceChildren(...[event.source,event.context,event.schedule].filter(Boolean).map(source => {
      const item = document.createElement('li');
      item.append(sourceLink(source));
      return item;
    }));
    shabbat.hidden = event.id !== 'shabbat';
    reading.hidden = false;
  }

  function updatePeriods() {
    const lastPeriod = period.value || view.period;
    const leap = year.value === 'leap';
    const periods = periodOrder.filter(month => leap || month !== 13);
    period.replaceChildren(...periods.map(month => {
      const name = leap && month === 12 ? labels.firstAdar : monthNames[month] ?? labels.monthly;
      return new Option(name, month);
    }));
    period.value = lastPeriod || '7';
    if (!leap && lastPeriod === '13') period.value = '12';
    showDates();
  }

  function showDates() {
    const month = Number(period.value);
    view.period = period.value;
    view.year = year.value;
    view.custom = custom.value;
    const events = calendarEvents.filter(event => {
      const current = year.value === 'leap' ? event.leapMonth ?? event.month : event.month;
      return (current ?? 0) === month;
    }).sort((a, b) => eventDay(a) - eventDay(b));
    if (!events.length) {
      dates.textContent = labels.empty;
      reading.hidden = true;
      return;
    }
    const previous = view.event;
    const buttons = events.map(event => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.event = event.id;
      button.textContent = month > 0 ? number.format(eventDay(event)) + ' · ' + event.name[locale] : event.name[locale];
      button.addEventListener('click', () => showReading(event, button));
      return button;
    });
    dates.replaceChildren(...buttons);
    const selected = Math.max(0, events.findIndex(event => event.id === previous));
    showReading(events[selected], buttons[selected]);
  }

  function showExample() {
    solved = false;
    clue.textContent = labels.clues[example];
    status.textContent = '';
    check.textContent = labels.check;
    check.disabled = true;
    answer.value = '';
  }

  fragment.querySelector('.calendar-intro').textContent = labels.intro;
  fragment.querySelector('[for="calendar-period"]').textContent = labels.month;
  fragment.querySelector('[for="calendar-year"]').textContent = labels.year;
  fragment.querySelector('[for="calendar-custom"]').textContent = labels.custom;
  dates.setAttribute('aria-label', labels.days);
  exercise.querySelector('summary').textContent = labels.practice;
  exercise.querySelector('[for="calendar-answer"]').textContent = labels.answer;
  year.replaceChildren(new Option(labels.common, 'common'), new Option(labels.leap, 'leap'));
  custom.replaceChildren(new Option(labels.israel, 'israel'), new Option(labels.diaspora, 'diaspora'));
  year.value = view.year;
  custom.value = view.custom;
  answer.replaceChildren(new Option('—', ''), ...periodOrder.filter(month => month > 0 && month !== 13)
    .map(month => new Option(monthNames[month], month)));
  period.addEventListener('change', showDates);
  year.addEventListener('change', updatePeriods);
  custom.addEventListener('change', showDates);
  answer.addEventListener('change', () => {
    solved = false;
    check.textContent = labels.check;
    check.disabled = !answer.value;
    status.textContent = '';
  });
  check.addEventListener('click', () => {
    if (solved) {
      example = (example + 1) % practiceEvents.length;
      showExample();
      answer.focus();
      return;
    }
    const event = calendarEvents.find(item => item.id === practiceEvents[example]);
    solved = Number(answer.value) === event.month;
    if (solved) {
      status.textContent = event.name[locale] + ' · ' + dateLabel(eventDay(event), event.month);
      check.textContent = labels.next;
    } else {
      status.textContent = labels.retry;
    }
  });
  prepareShabbat(shabbat, locale, view.shabbat);
  updatePeriods();
  showExample();
  panel.replaceChildren(fragment);
}
