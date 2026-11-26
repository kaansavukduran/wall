import { chapters, languages, plaza, ui } from './content.js';
import { library, libraryLabels } from './library.js';
import { alphabetNotes, models, photo, studyNames, worldNote, worlds } from './scenes.js';
import { makeWorld } from './world.js';

const episodes = [plaza, ...chapters];
const key = 'wall.progress.v1';
const find = id => document.getElementById(id);

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
  const journal = find('journal');
  const note = find('journal-text');
  note.value = read('wall.journal') ?? '';
  note.addEventListener('input', () => store('wall.journal', note.value));
  const selector = find('lang');
  const progress = readProgress();
  let language = initialLanguage;
  let active = 0;
  let movement = null;
  let direction = 0;
  let selectedLayer = '';
  let studyOption = null;
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
    journal.querySelector('p').textContent = libraryLabels[language][4];
    journal.hidden = !completed || active !== episodes.length - 1;
    find('inspect').textContent = labels[1];
    controls.querySelector('[data-move="-1"]').setAttribute('aria-label', labels[6]);
    controls.querySelector('[data-move="1"]').setAttribute('aria-label', labels[7]);
    find('source').textContent = labels[2];
    find('era').textContent = episode.era[index];
    find('chapter').textContent = active === 0 ? labels[9] : String(episode.id);
    find('title').textContent = text[0];
    find('intro').textContent = text[1];
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
    if (focus) find('title').focus();
  }

  function go(index, updateHash = true) {
    if (!episodes[index] || !unlocked(index)) return;
    active = index;
    stop();
    selectedLayer = '';
    studyOption = null;
    letters.clear();
    if (updateHash) history.replaceState(null, '', index === 0 ? '#game' : '#chapter-' + episodeId(index));
    save();
    render(updateHash);
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
    photoButton.hidden = id !== 0;
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
    surface.hidden = id !== 16 && id !== 18;
    if (surface.hidden) return;
    const index = locale();
    const output = surface.querySelector('output');
    const note = surface.querySelector('small');
    surface.querySelector('p').textContent = (id === 16 ? studyNames.gematria : studyNames.worlds)[index];
    const controls = surface.querySelector('div');
    const rows = id === 16
      ? [['ח', 8], ['י', 10]].map(([letter, value]) => ({ label:letter + ' · ' + value, lang:'he', value }))
      : worlds.map(([hebrew, names, meanings], order) =>
          ({ label:names[index], hebrew, value:order, meaning:meanings[index] }));

    controls.replaceChildren(...rows.map(({label,lang,value}, rowIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      if (lang) button.lang = lang;
      button.dir = 'auto';
      button.dataset.study = String(rowIndex);
      button.setAttribute('aria-pressed', String(id === 16 ? letters.has(value) : studyOption === rowIndex));
      button.addEventListener('click', () => {
        if (id === 16) {
          if (letters.has(value)) letters.delete(value); else letters.add(value);
        } else {
          studyOption = rowIndex;
        }
        renderStudy();
        controls.querySelector('[data-study="' + rowIndex + '"]').focus();
      });
      return button;
    }));
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
    if (studyOption !== null) {
      const row = rows[studyOption];
      const original = document.createElement('bdi');
      original.lang = 'he';
      original.dir = 'rtl';
      original.textContent = row.hebrew;
      output.append(original, ' · ' + row.meaning);
    }
    note.textContent = worldNote[index];
  }

  function openSource() {
    stop();
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
  find('photo-button').addEventListener('click', () => {
    stop();
    const index = locale();
    photoPanel.querySelector('h2').textContent = photo.title[index];
    photoPanel.querySelector('img').alt = photo.alt[index];
    photoPanel.querySelector('figcaption').textContent = photo.note[index];
    const source = photoPanel.querySelector('a');
    source.href = photo.url;
    source.textContent = ui[language][5];
    photoPanel.querySelector('button').textContent = ui[language][4];
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
}
