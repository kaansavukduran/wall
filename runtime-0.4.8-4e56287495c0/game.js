import { controllerHelp, mountController } from './controller.js';
import { chapters, languages, plaza, ui } from './content.js';
import { library, libraryLabels } from './library.js';
import { alphabetNotes, lights, models, photo, studyNames, tour, tourPrompt, worldNote, worlds } from './scenes.js';
import { belongsTo, catalogue, catalogueLabels } from './catalogue.js';
import { sequenceLabels, sequences } from './sequences.js';
import { makeWorld } from './world.js';

const episodes = [plaza, ...chapters];
const key = 'wall.progress.v1';
const find = id => document.getElementById(id);
const evidenceLabels = {
  tr: ['Kaynakları karşılaştır', 'Bu soruya yanıt veren kaynağı bulmak için diğer kartlara da bak.', 'Kaynak kartları yükleniyor…', 'Kaynak kartları açılamadı. Sayfayı yenileyip tekrar dene.'],
  en: ['Compare the sources', 'Check the other cards for the source that answers this question.', 'Loading source cards…', 'The cards could not open. Reload the page and try again.'],
  he: ['השוו בין המקורות', 'בדקו איזה מן הכרטיסים האחרים עונה על השאלה הזאת.', 'כרטיסי המקורות נטענים…', 'הכרטיסים לא נפתחו. רעננו את הדף ונסו שוב.'],
  az: ['Mənbələri müqayisə et', 'Bu suala cavab verən mənbəni tapmaq üçün digər kartlara bax.', 'Mənbə kartları yüklənir…', 'Kartlar açılmadı. Səhifəni yeniləyib yenidən cəhd et.'],
};
const lessonDecks = [
  () => import('./ancient-lessons.js').then(module => module.ancientLessons),
  () => import('./second-temple-lessons.js').then(module => module.secondTempleLessons),
  () => import('./roman-lessons.js').then(module => module.romanLessons),
  () => import('./medieval-lessons.js').then(module => module.medievalLessons),
  () => import('./early-modern-lessons.js').then(module => module.earlyModernLessons),
];

function read(keyName) {
  try { return localStorage.getItem(keyName); } catch { return null; }
}

function store(keyName, value) {
  try { localStorage.setItem(keyName, value); } catch { /* The session stays playable. */ }
}

function readProgress() {
  try {
    const value = JSON.parse(read(key) ?? '{}');
    const ids = ['plaza', ...chapters.map(episode => String(episode.id))];
    const completed = new Set(Array.isArray(value.completed) ? value.completed.filter(id => ids.includes(id)) : []);
    return { completed, active: value.active };
  } catch {
    return { completed:new Set(), active:null };
  }
}

export async function start(initialLanguage) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const world = await makeWorld(find('world'), reducedMotion);
  const controls = find('controls');
  const options = find('choices');
  const result = find('result');
  const next = find('next');
  const reader = find('reader');
  const chooser = find('chapters');
  const studyRoom = find('library');
  const photoPanel = find('photo');
  const comparison = find('compare-view');
  const journal = find('journal');
  const note = find('journal-text');
  note.value = read('wall.journal') ?? '';
  note.addEventListener('input', () => store('wall.journal', note.value));
  const selector = find('lang');
  const cataloguePanel = find('catalogue');
  const sequenceSurface = find('sequence');
  const evidence = find('evidence');
  const evidenceChoices = find('evidence-choices');
  const labRoot = find('language-labs');
  const labs = labRoot.querySelectorAll('details');
  const labState = {word:[], sefirah:0, daat:false};
  const progress = readProgress();
  let language = initialLanguage;
  let active = 0;
  let movement = null;
  let direction = 0;
  let selectedLayer = '';
  let studyOption = null;
  let evidenceCard = null;
  const sequenceSteps = [];
  let attempt = '';
  let sourceToken = 0;
  let evidenceToken = 0;
  let labToken = 0;
  const letters = new Set();

  const episodeId = index => String(episodes[index].id ?? 'plaza');
  const firstIncomplete = () => episodes.findIndex((_, index) => !progress.completed.has(episodeId(index)));
  const unlocked = index => index >= 0 && (index === 0 || index === firstIncomplete() || progress.completed.has(episodeId(index)));
  const save = () => store(key, JSON.stringify({active:episodeId(active),completed:[...progress.completed]}));
  const locale = () => languages.indexOf(language);

  function choose(selected) {
    const episode = episodes[active];
    const text = episode.text[locale()];
    const layer = episode.answers[selected];
    if (episode.id === 6 && ['temple','platform','wall'].includes(layer)) {
      selectedLayer = layer;
      renderModel();
    }
    if (selected !== episode.correct) {
      result.textContent = ui[language][10];
      return;
    }
    progress.completed.add(episodeId(active));
    result.textContent = text[5];
    next.hidden = false;
    next.textContent = firstIncomplete() < 0 ? ui[language][13] : ui[language][3];
    journal.hidden = active !== episodes.length - 1;
    save();
  }

  function render(focus = false) {
    const episode = episodes[active];
    const index = locale();
    const text = episode.text[index];
    const labels = ui[language];
    const completed = progress.completed.has(episodeId(active));
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    selector.value = language;
    selector.setAttribute('aria-label', labels[8]);
    find('episodes-button').textContent = labels[0];
    find('library-button').textContent = libraryLabels[language][0];
    journal.querySelector('label').textContent = libraryLabels[language][3];
    journal.querySelector('p:last-child').textContent = libraryLabels[language][4];
    if (active === episodes.length - 1) renderTour();
    journal.hidden = !completed || active !== episodes.length - 1;
    find('inspect').textContent = labels[1];
    controls.querySelector('[data-move="-1"]').setAttribute('aria-label', labels[6]);
    controls.querySelector('[data-move="1"]').setAttribute('aria-label', labels[7]);
    find('source').textContent = labels[2];
    find('era').textContent = episode.era[index];
    find('chapter').textContent = active === 0 ? labels[9] : String(episode.id);
    find('title').textContent = text[0];
    find('intro').textContent = text[1];
    find('controller-hint').textContent = controllerHelp[language];
    const rotation = (episode.id ?? 0) % 3;
    const order = [rotation, (rotation + 1) % 3, (rotation + 2) % 3];
    options.replaceChildren(...order.map(selected => {
      const label = text[2 + selected];
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.dataset.choice = String(selected);
      button.addEventListener('click', () => choose(selected));
      return button;
    }));
    result.textContent = completed ? text[5] : '';
    next.textContent = firstIncomplete() < 0 ? labels[13] : labels[3];
    next.hidden = !completed;
    renderModel();
    renderStudy();
    renderSequence();
    renderEvidence();
    renderLanguageLabs();
    if (focus) find('title').focus();
  }

  function go(index, updateHash = true) {
    if (!episodes[index] || !unlocked(index)) return;
    active = index;
    stop();
    selectedLayer = '';
    studyOption = null;
    evidenceCard = null;
    evidence.open = false;
    labState.word.length = 0;
    labState.sefirah = 0;
    labState.daat = false;
    for (const lab of labs) lab.open = false;
    sequenceSteps.length = 0;
    attempt = '';
    letters.clear();
    if (updateHash) history.replaceState(null, '', index === 0 ? '#game' : '#chapter-' + episodeId(index));
    save();
    render(updateHash);
  }

  evidence.addEventListener('toggle', () => {
    if (evidence.open) renderEvidence();
  });

  async function renderEvidence() {
    const chapter = episodes[active].id;
    const request = ++evidenceToken;
    const load = lessonDecks[Math.floor((chapter - 1) / 4)];
    evidence.hidden = !load;
    if (!load) return;
    const labels = evidenceLabels[language];
    evidence.querySelector('summary').textContent = labels[0];
    if (!evidence.open) return;
    const index = locale();
    const question = find('evidence-question');
    question.textContent = labels[2];
    evidenceChoices.replaceChildren();
    readEvidence(null, index);
    let lesson;
    try {
      lesson = (await load())[chapter];
    } catch {
      if (request === evidenceToken) question.textContent = labels[3];
      return;
    }
    if (request !== evidenceToken || !evidence.open) return;
    question.textContent = lesson.prompt[index];
    evidenceChoices.replaceChildren(...lesson.cards.map((_, position) => {
      const number = (position + chapter) % lesson.cards.length;
      const card = lesson.cards[number];
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = card.title[index];
      button.dataset.evidence = String(number);
      button.addEventListener('click', () => {
        evidenceCard = number;
        readEvidence(lesson, index);
      });
      return button;
    }));
    readEvidence(lesson, index);
  }

  function readEvidence(lesson, index) {
    const card = lesson?.cards[evidenceCard];
    for (const button of evidenceChoices.children) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.evidence) === evidenceCard));
    }
    find('evidence-date').textContent = card?.date[index] ?? '';
    find('evidence-detail').textContent = card?.description[index] ?? '';
    find('evidence-feedback').textContent = !card ? ''
      : evidenceCard === lesson.correct ? lesson.feedback[index] : evidenceLabels[language][1];
    const source = find('evidence-source');
    source.hidden = !card;
    if (card) {
      source.href = card.url;
      source.textContent = ui[language][5];
    }
  }

  async function renderLanguageLabs() {
    const request = ++labToken;
    const message = find('language-lab-message');
    message.hidden = labRoot.hidden = true;
    if (episodes[active].id !== 16) return;
    try {
      const {renderHebrewLabs} = await import('./hebrew-labs.js');
      if (request !== labToken) return;
      renderHebrewLabs(labRoot, locale(), labState);
      labRoot.hidden = false;
    } catch {
      if (request !== labToken) return;
      message.textContent = {
        tr:'Atölyeler açılamadı. Sayfayı yenileyip tekrar dene.',
        en:'The workbenches could not open. Reload the page and try again.',
        he:'הסדנאות לא נפתחו. רעננו את הדף ונסו שוב.',
        az:'Emalatxanalar açılmadı. Səhifəni yeniləyib yenidən cəhd et.',
      }[language];
      message.hidden = false;
    }
  }

  function renderModel() {
    const id = episodes[active].id ?? 0;
    const surface = find('models');
    const model = models.find(entry => entry.id === id);
    world.scene(id, selectedLayer);
    surface.hidden = !model;
    if (!model) return;
    const index = locale();
    surface.querySelector('p').textContent = model.name[index];
    const photoButton = find('photo-button');
    photoButton.hidden = id !== 0 && id !== 23;
    photoButton.textContent = photo.title[index];
    const activeOption = model.options.find(option => option[0] === selectedLayer);
    surface.querySelector('output').textContent = activeOption?.[2][index] ?? '';
    surface.querySelector('div').replaceChildren(...model.options.map(([key, titles]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.layer = key;
      button.textContent = titles[index];
      button.setAttribute('aria-pressed', String(selectedLayer === key));
      button.addEventListener('click', () => {
        selectedLayer = key;
        renderModel();
        surface.querySelector('[data-layer="' + key + '"]').focus();
      });
      return button;
    }));
  }

  function renderStudy() {
    const id = episodes[active].id;
    const surface = find('workbench');
    surface.hidden = id !== 5 && id !== 16 && id !== 18;
    if (surface.hidden) return;
    const index = locale();
    const output = surface.querySelector('output');
    const note = surface.querySelector('small');
    if (id === 5) {
      renderLights(surface, output, note);
      return;
    }
    surface.querySelector('p').textContent = (id === 16 ? studyNames.gematria : studyNames.worlds)[index];
    const controls = surface.querySelector('div');
    const rows = id === 16
      ? [['ח', 8], ['י', 10]].map(([letter, value]) => ({ label:letter + ' · ' + value, lang:'he', value }))
      : worlds.map(([hebrew, names, meanings, descriptions], order) =>
          ({ label:names[index], hebrew, value:order, meaning:meanings[index], description:descriptions[index] }));

    function updateStudy() {
      for (const button of controls.children) {
        const rowIndex = Number(button.dataset.study);
        const selected = id === 16 ? letters.has(rows[rowIndex].value) : studyOption === rowIndex;
        button.setAttribute('aria-pressed', String(selected));
      }
      if (id === 16) {
        const values = [8, 10].filter(value => letters.has(value));
        const total = values.reduce((sum, value) => sum + value, 0);
        output.dir = 'ltr';
        output.textContent = values.length === 2 ? '8 + 10 = 18' : String(total);
        note.textContent = alphabetNotes[Number(total === 18)][index];
        return;
      }
      output.dir = 'auto';
      output.replaceChildren();
      if (studyOption === null) return;
      const row = rows[studyOption];
      const original = document.createElement('bdi');
      original.lang = 'he';
      original.dir = 'rtl';
      original.textContent = row.hebrew;
      const description = document.createElement('span');
      description.className = 'world-description';
      description.textContent = row.description;
      output.append(original, ' · ' + row.meaning, description);
    }

    controls.replaceChildren(...rows.map(({label,lang,value}, rowIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      if (lang) button.lang = lang;
      button.dir = 'auto';
      button.dataset.study = String(rowIndex);
      button.addEventListener('click', () => {
        if (id === 16) {
          if (letters.has(value)) letters.delete(value); else letters.add(value);
        } else {
          studyOption = rowIndex;
        }
        updateStudy();
        button.focus({preventScroll:true});
      });
      return button;
    }));
    if (id === 18) note.textContent = worldNote[index];
    updateStudy();
  }

  function renderLights(surface, output, note) {
    const index = locale();
    const day = studyOption ?? 1;
    const choices = surface.querySelector('div');
    surface.querySelector('p').textContent = lights.title[index];
    choices.replaceChildren(...Array.from({length:8}, (_, offset) => {
      const value = offset + 1;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(value);
      button.dataset.night = String(value);
      button.setAttribute('aria-label', lights.day[index] + ' ' + value);
      button.setAttribute('aria-pressed', String(day === value));
      button.addEventListener('click', () => {
        studyOption = value;
        renderStudy();
        choices.querySelector('[data-night="' + value + '"]').focus();
      });
      return button;
    }));
    output.dir = 'auto';
    output.replaceChildren(...[day,9 - day].map((count, school) => {
      const row = document.createElement('span');
      row.className = 'lamp-row';
      row.textContent = lights.schools[school][index] + ' · ' + count + ' ';
      const symbols = document.createElement('span');
      symbols.className = 'lamps';
      symbols.setAttribute('aria-hidden', 'true');
      for (let index = 0; index < count; index++) {
        const lamp = document.createElement('i');
        symbols.append(lamp);
      }
      row.append(symbols);
      return row;
    }));
    note.textContent = lights.note[index];
  }

  function renderSequence() {
    const sample = sequences.find(item => item.id === episodes[active].id);
    sequenceSurface.hidden = !sample;
    if (!sample) return;
    const index = locale();
    const labels = sequenceLabels[language];
    const list = sequenceSurface.querySelector('ol');
    const buttons = sequenceSurface.querySelector('div');
    sequenceSurface.querySelector('p').textContent = sample.name[index];
    sequenceSurface.querySelector('small').textContent = labels[0];
    const reset = find('sequence-reset');
    reset.textContent = labels[3];
    reset.disabled = sequenceSteps.length === 0 && attempt === '';
    const status = sequenceSurface.querySelector('output');
    status.textContent = attempt === 'correct' ? labels[1] : attempt === 'wrong' ? labels[2] : '';
    list.replaceChildren(...sequenceSteps.map(id => {
      const entry = document.createElement('li');
      entry.textContent = sample.steps[id][index];
      return entry;
    }));
    buttons.replaceChildren(...sample.steps.map((names, id) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = names[index];
      button.dataset.sequence = String(id);
      button.disabled = sequenceSteps.includes(id);
      button.addEventListener('click', () => {
        if (sample.order[sequenceSteps.length] === id) {
          sequenceSteps.push(id);
          attempt = sequenceSteps.length === sample.order.length ? 'correct' : '';
        } else {
          attempt = 'wrong';
        }
        renderSequence();
        (buttons.querySelector('button:enabled') ?? reset).focus();
      });
      return button;
    }));
  }

  find('sequence-reset').addEventListener('click', () => {
    sequenceSteps.length = 0;
    attempt = '';
    renderSequence();
    sequenceSurface.querySelector('div button').focus();
  });

  cataloguePanel.addEventListener('toggle', async () => {
    if (!cataloguePanel.open) return;
    const id = episodes[active].id ?? 0;
    const ticket = ++sourceToken;
    const labels = catalogueLabels[language];
    const status = cataloguePanel.querySelector('p');
    const list = cataloguePanel.querySelector('ul');
    status.textContent = labels[1];
    list.replaceChildren();
    try {
      const matches = (await catalogue()).filter(entry => belongsTo(entry, id));
      if (ticket !== sourceToken) return;
      status.textContent = matches.length ? '' : labels[3];
      list.replaceChildren(...matches.map(entry => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = entry.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        const label = document.createElement('bdi');
        label.lang = 'tr';
        label.textContent = entry.id + ' · ' + entry.title;
        link.append(label);
        item.append(link);
        return item;
      }));
    } catch {
      if (ticket === sourceToken) status.textContent = labels[2];
    }
  });

  function renderTour() {
    const index = locale();
    find('tour-prompt').textContent = tourPrompt[index];
    find('tour-stops').replaceChildren(...tour.map((stop, stopIndex) => {
      const section = document.createElement('div');
      const label = document.createElement('label');
      const select = document.createElement('select');
      const storageKey = 'wall.tour.' + stopIndex;
      for (const [id, names] of stop.options) select.add(new Option(names[index], id));
      const saved = read(storageKey);
      if (stop.options.some(option => option[0] === saved)) select.value = saved;
      label.append(stop.label[index], select);
      const link = document.createElement('a');
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = ui[language][5];
      function updateLink() {
        link.href = stop.options.find(option => option[0] === select.value)[2];
      }
      updateLink();
      select.addEventListener('change', () => {
        store(storageKey, select.value);
        updateLink();
      });
      section.append(label, link);
      return section;
    }));
  }

  function openSource() {
    stop();
    sourceToken++;
    cataloguePanel.open = false;
    cataloguePanel.querySelector('summary').textContent = catalogueLabels[language][0];
    const episode = episodes[active];
    const labels = ui[language];
    reader.querySelector('h2').textContent = labels[14];
    reader.querySelector('p').textContent = episode.text[locale()][6];
    const link = reader.querySelector('a');
    link.href = episode.source;
    link.textContent = labels[5];
    reader.querySelector('button').textContent = labels[4];
    reader.showModal();
  }

  function openChapters() {
    stop();
    chooser.querySelector('h2').textContent = ui[language][11];
    chooser.querySelector('button').textContent = ui[language][4];
    chooser.querySelector('ol').replaceChildren(...episodes.map((episode, index) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = episode.text[locale()][0];
      button.disabled = !unlocked(index);
      button.addEventListener('click', () => { chooser.close(); go(index); });
      item.append(button);
      return item;
    }));
    chooser.showModal();
  }

  function openLibrary() {
    stop();
    const index = locale();
    studyRoom.querySelector('h2').textContent = libraryLabels[language][1];
    studyRoom.querySelector('button').textContent = ui[language][4];
    const available = library.filter(item => {
      const chapter = episodes.findIndex(episode => episode.id === item.chapter);
      return unlocked(chapter);
    });
    const readings = available.length ? available : [{
      name:plaza.text.map(text => text[0]),
      body:plaza.text.map(text => text[6]),
      url:plaza.source,
    }];
    studyRoom.querySelector('div').replaceChildren(...readings.map(item => {
      const entry = document.createElement('details');
      const title = document.createElement('summary');
      title.textContent = item.name[index];
      const text = document.createElement('p');
      text.textContent = item.body[index];
      const source = document.createElement('a');
      source.href = item.url;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = ui[language][5];
      entry.append(title, text, source);
      return entry;
    }));
    studyRoom.showModal();
  }

  function stop() {
    cancelAnimationFrame(movement);
    movement = null;
    direction = 0;
    world.idle();
  }
  function walk(value) {
    if (direction === value) return;
    stop();
    direction = value;
    world.move(value, 2);
    let previous = performance.now();
    function animate(now) {
      const elapsed = Math.min(34, Math.max(0, now - previous));
      previous = now;
      world.move(value, elapsed * .063);
      movement = requestAnimationFrame(animate);
    }
    movement = requestAnimationFrame(animate);
  }

  for (const button of controls.querySelectorAll('[data-move]')) {
    button.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      button.setPointerCapture(event.pointerId);
      walk(Number(button.dataset.move));
    });
    for (const name of ['pointerup','pointercancel','lostpointercapture']) button.addEventListener(name, stop);
    button.addEventListener('click', event => {
      if (event.detail === 0) {
        world.move(Number(button.dataset.move), 6);
        world.idle();
      }
    });
  }
  document.addEventListener('keydown', event => {
    if (reader.open || chooser.open || photoPanel.open || studyRoom.open || event.metaKey || event.ctrlKey
      || event.target.closest('select, input, textarea, [contenteditable]')) return;
    const value = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (value) {
      event.preventDefault();
      walk(value);
    } else if (event.code === 'KeyE' && !event.repeat) {
      event.preventDefault();
      inspect();
    }
  });
  document.addEventListener('keyup', event => {
    if (event.key === (direction < 0 ? 'ArrowLeft' : 'ArrowRight')) stop();
  });
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

  function comparePhoto() {
    const index = locale();
    const view = comparison.valueAsNumber;
    world.comparePlaza(find('compare-canvas'), view, language === 'he');
    comparison.setAttribute('aria-valuetext', photo.views[view][index]);
    find('compare-caption').textContent = photo.captions[view][index];
  }

  comparison.addEventListener('input', comparePhoto);
  find('photo-button').addEventListener('click', () => {
    stop();
    const index = locale();
    const modernHistory = episodes[active].id === 23;
    photoPanel.querySelector('h2').textContent = photo.title[index];
    photoPanel.querySelector('img').alt = photo.alt[index];
    photoPanel.querySelector('figcaption').textContent = photo.note[index];
    const source = find('photo-source');
    source.href = photo.url;
    source.textContent = photo.source[index];
    find('compare-label').textContent = photo.compare[index];
    const [earlier, today] = photoPanel.querySelectorAll('.compare-endpoints span');
    earlier.textContent = photo.views[0][index];
    today.textContent = photo.views[2][index];
    const history = find('compare-history');
    history.hidden = !modernHistory;
    history.textContent = photo.history[index];
    const historySource = find('compare-history-source');
    historySource.hidden = !modernHistory;
    historySource.href = photo.historyUrl;
    historySource.textContent = photo.historySource[index];
    photoPanel.querySelector('button').textContent = ui[language][4];
    comparePhoto();
    photoPanel.showModal();
  });
  find('source').addEventListener('click', openSource);
  function inspect() {
    stop();
    world.inspect();
    options.querySelector('button').focus();
  }
  find('inspect').addEventListener('click', inspect);
  find('episodes-button').addEventListener('click', openChapters);
  find('library-button').addEventListener('click', openLibrary);
  next.addEventListener('click', () => {
    const upcoming = firstIncomplete();
    go(upcoming < 0 ? 0 : upcoming);
  });
  selector.addEventListener('change', () => {
    if (!languages.includes(selector.value)) return;
    language = selector.value;
    store('wall.language', language);
    render();
  });

  function fromHash() {
    const hash = location.hash;
    return hash === '#game' ? 0 : episodes.findIndex((_, index) => '#chapter-' + episodeId(index) === hash);
  }
  window.addEventListener('hashchange', () => go(fromHash(), false));
  const requested = fromHash();
  const saved = episodes.findIndex((_, index) => episodeId(index) === progress.active);
  const startAt = requested >= 0 && unlocked(requested) ? requested : saved >= 0 && unlocked(saved) ? saved : 0;
  go(startAt, false);
  mountController({
    walk, stop, inspect, timeline:openChapters, library:openLibrary,
    showHint() { find('controller-hint').hidden = false; },
  });
}
