import { chapters, languages, plaza, ui } from './content.js';
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
  const selector = find('lang');
  const progress = readProgress();
  let language = initialLanguage;
  let active = 0;
  let movement = null;
  let direction = 0;
  let choice = null;

  const episodeId = index => String(episodes[index].id ?? 'plaza');
  const unlocked = index => index === 0 || progress.completed.has(episodeId(index - 1));
  const save = () => store(key, JSON.stringify({active:episodeId(active),completed:[...progress.completed]}));
  const locale = () => languages.indexOf(language);

  function choose(selected) {
    const episode = episodes[active];
    const text = episode.text[locale()];
    choice = selected;
    world.scene(episode.id ?? 0, episode.answers[selected] ?? '');
    if (selected !== episode.correct) {
      result.textContent = ui[language][10];
      return;
    }
    progress.completed.add(episodeId(active));
    result.textContent = text[5];
    next.hidden = false;
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
    find('inspect').textContent = labels[1];
    controls.querySelector('[data-move="-1"]').setAttribute('aria-label', labels[6]);
    controls.querySelector('[data-move="1"]').setAttribute('aria-label', labels[7]);
    find('source').textContent = labels[2];
    find('era').textContent = episode.era[index];
    find('chapter').textContent = active === 0 ? labels[9] : String(episode.id);
    find('title').textContent = text[0];
    find('intro').textContent = text[1];
    options.replaceChildren(...text.slice(2,5).map((label, selected) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => choose(selected));
      return button;
    }));
    result.textContent = completed ? text[5] : '';
    next.textContent = active === episodes.length - 1 ? labels[13] : labels[3];
    next.hidden = !completed;
    world.scene(episode.id ?? 0, choice === null ? '' : episode.answers[choice] ?? '');
    if (focus) find('title').focus();
  }

  function go(index, updateHash = true) {
    if (!episodes[index] || !unlocked(index)) return;
    active = index;
    choice = null;
    if (updateHash) history.replaceState(null, '', index === 0 ? '#game' : '#chapter-' + episodeId(index));
    save();
    render(updateHash);
  }

  function openSource() {
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

  function stop() {
    clearInterval(movement);
    movement = null;
    direction = 0;
    world.idle();
  }
  function walk(value) {
    if (direction === value) return;
    stop();
    direction = value;
    world.step(value);
    movement = setInterval(() => world.step(value), 88);
  }

  for (const button of controls.querySelectorAll('[data-move]')) {
    button.addEventListener('pointerdown', event => {
      button.setPointerCapture(event.pointerId);
      walk(Number(button.dataset.move));
    });
    for (const name of ['pointerup','pointercancel','lostpointercapture']) button.addEventListener(name, stop);
    button.addEventListener('click', event => {
      if (event.detail === 0) {
        world.step(Number(button.dataset.move));
        world.idle();
      }
    });
  }
  document.addEventListener('keydown', event => {
    if (reader.open || chooser.open || event.metaKey || event.ctrlKey
      || event.target.closest('select, input, textarea, [contenteditable]')) return;
    const value = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (value) {
      event.preventDefault();
      walk(value);
    }
  });
  document.addEventListener('keyup', event => {
    if (event.key === (direction < 0 ? 'ArrowLeft' : 'ArrowRight')) stop();
  });
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  find('source').addEventListener('click', openSource);
  find('inspect').addEventListener('click', () => options.querySelector('button').focus());
  find('episodes-button').addEventListener('click', openChapters);
  next.addEventListener('click', () => go((active + 1) % episodes.length));
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
