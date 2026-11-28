import { atbash, gematriaValues } from './hebrew-labs.js';
import { methodCopy, wordMethods } from './word-method-lessons.js';

export function mountWordMethods(panel, locale, view) {
  const fragment = document.getElementById('word-method-template').content.cloneNode(true);
  const [intro, modes, hint, convention, tiles, result, explanation, sourcePanel, reset] = fragment.children;
  const [expandedFinals, conventionLabel] = convention.children;
  const [sourceLabel, links] = sourcePanel.children;
  const [introText, tileLabel, useFinals, sources, clear, methodLabel] = methodCopy.map(line => line[locale]);
  view.method ??= 0;
  view.extended ??= false;
  view.revealed ??= new Set();

  intro.textContent = introText;
  modes.setAttribute('aria-label',methodLabel);
  tiles.setAttribute('aria-label',tileLabel);
  conventionLabel.textContent = useFinals;
  sourceLabel.textContent = sources;
  reset.textContent = clear;

  function revealTiles() {
    const method = wordMethods[view.method];
    const numeric = method.id === 'gematria';
    const values = numeric ? gematriaValues(method.tiles,view.extended)
      : method.id === 'atbash' ? atbash(method.tiles) : method.expanded;
    const revealed = [];
    for (const [index, button] of [...tiles.children].entries()) {
      const open = view.revealed.has(index);
      button.lastElementChild.textContent = open ? String(values[index]) : '';
      button.setAttribute('aria-pressed',String(open));
      if (open) revealed.push(values[index]);
    }
    const sum = numeric ? revealed.reduce((total, value) => total + value, 0) : null;
    const separator = method.id === 'notarikon' ? ' ' : '';
    const sequence = numeric ? revealed.join(' + ') : revealed.join(separator);
    result.textContent = numeric && revealed.length > 1 ? sequence + ' = ' + sum : sequence;
    explanation.hidden = revealed.length !== method.tiles.length;
    reset.disabled = !revealed.length;
  }

  function changeExample() {
    const method = wordMethods[view.method];
    hint.textContent = method.hint[locale];
    explanation.textContent = method.result[locale];
    convention.hidden = method.id !== 'gematria';
    expandedFinals.checked = view.extended;
    result.dir = method.outputLang ? 'rtl' : 'ltr';
    if (method.outputLang) result.lang = method.outputLang;
    else result.removeAttribute('lang');
    for (const [index, button] of [...modes.children].entries()) {
      button.setAttribute('aria-pressed',String(view.method === index));
    }
    tiles.replaceChildren(...method.tiles.map((letter,index) => {
      const button = document.createElement('button');
      const original = document.createElement('bdi');
      const value = document.createElement('bdi');
      button.type = 'button';
      button.dataset.methodTile = String(index);
      original.lang = 'he';
      original.textContent = letter;
      if (method.outputLang) value.lang = method.outputLang;
      button.append(original,value);
      button.addEventListener('click', () => {
        if (view.revealed.has(index)) view.revealed.delete(index);
        else view.revealed.add(index);
        revealTiles();
      });
      return button;
    }));
    links.replaceChildren(...method.sources.map(([title,url]) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = title;
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dir = 'auto';
      item.append(link);
      return item;
    }));
    revealTiles();
  }

  for (const [index, method] of wordMethods.entries()) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.method = method.id;
    button.textContent = method.title[locale];
    button.addEventListener('click', () => {
      if (view.method === index) return;
      view.method = index;
      view.revealed.clear();
      changeExample();
    });
    modes.append(button);
  }
  expandedFinals.addEventListener('change', () => {
    view.extended = expandedFinals.checked;
    revealTiles();
  });
  reset.addEventListener('click', () => {
    view.revealed.clear();
    revealTiles();
    tiles.firstElementChild.focus();
  });
  changeExample();
  panel.replaceChildren(fragment);
}
