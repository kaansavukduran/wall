import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ancientLessons } from '../ancient-lessons.js';
import { belongsTo, parseCatalogue } from '../catalogue.js';
import { chapters, languages, plaza, ui } from '../content.js';
import { library, libraryLabels } from '../library.js';
import { models, photo } from '../scenes.js';
import { secondTempleLessons } from '../second-temple-lessons.js';

test('every checkpoint has four equivalent locales and a valid source', () => {
  let previousId = 0;
  for (const episode of [plaza, ...chapters]) {
    if (episode.id !== undefined) {
      assert.ok(episode.id > previousId);
      previousId = episode.id;
    }
    assert.equal(episode.era.length, languages.length);
    assert.equal(episode.text.length, languages.length);
    assert.equal(episode.answers.length, 3);
    assert.ok(Number.isInteger(episode.correct) && episode.correct >= 0 && episode.correct < 3);
    assert.equal(new URL(episode.source).protocol, 'https:');
    for (const text of episode.text) {
      assert.equal(text.length, 7);
      assert.ok(text.every(value => typeof value === 'string' && value.trim()));
      assert.equal(new Set(text.slice(2, 5)).size, 3);
    }
  }
  for (const language of languages) assert.equal(ui[language].length, 15);
});

test('campaign covers all 24 planned IDs in order', () => {
  assert.deepEqual(chapters.map(episode => episode.id), Array.from({length:24}, (_, index) => index + 1));
});

test('study-room readings point to chapters and have four complete translations', () => {
  for (const item of library) {
    assert.ok(chapters.some(episode => episode.id === item.chapter));
    assert.equal(item.name.length, languages.length);
    assert.equal(item.body.length, languages.length);
    assert.equal(new URL(item.url).protocol, 'https:');
    assert.ok([...item.name, ...item.body].every(value => value.trim()));
  }
  for (const language of languages) assert.equal(libraryLabels[language].length, 5);
});

test('rendered version follows VERSION and scene options localize', () => {
  const version = readFileSync(new URL('../VERSION', import.meta.url), 'utf8').trim();
  assert.match(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), new RegExp('>' + version.replaceAll('.', '\\.') + '<'));
  for (const model of models) {
    assert.ok(model.id === 0 || chapters.some(episode => episode.id === model.id));
    assert.equal(model.name.length, languages.length);
    for (const [, names, notes] of model.options) {
      assert.equal(names.length, languages.length);
      assert.equal(notes.length, languages.length);
    }
  }
});


const entries = parseCatalogue(readFileSync(new URL('../docs/SOURCES.tsv', import.meta.url), 'utf8'));

test('catalogue maps ranges and the prologue without conflating them', () => {
  assert.equal(entries.length, 104);
  assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length);
  assert.ok(entries.some(entry => entry.url === photo.url && belongsTo(entry, 0) && belongsTo(entry, 23)));
  assert.ok(entries.some(entry => entry.url === photo.historyUrl && belongsTo(entry, 23)));
  assert.ok(entries.some(entry => belongsTo(entry, 0)));
  assert.ok(Array.from({length:24}, (_, index) => index + 1).every(id => entries.some(entry => belongsTo(entry, id))));
  assert.ok(belongsTo({chapters:'1–4,6'}, 3));
  assert.equal(belongsTo({chapters:'Prolog,1'}, 10), false);
});

test('ancient source exercises contain four versions of each card and matched catalogue entries', () => {
  const lessons = {...ancientLessons, ...secondTempleLessons};
  assert.deepEqual(Object.keys(lessons), ['1','2','3','4','5','6','7','8']);
  for (const [chapter, lesson] of Object.entries(lessons)) {
    assert.equal(lesson.cards.length, 3);
    assert.ok(lesson.cards[lesson.correct]);
    const translations = [lesson.prompt, lesson.feedback];
    for (const card of lesson.cards) {
      translations.push(card.title, card.date, card.description);
      assert.ok(entries.some(entry => entry.url === card.url && belongsTo(entry, Number(chapter))));
    }
    for (const text of translations) {
      assert.equal(text.length, languages.length);
      assert.ok(text.every(translation => translation.trim()));
    }
  }
});

test('each exported HTML document references its own release files', () => {
  const directory = mkdtempSync(join(tmpdir(), 'wall-release-check-'));
  try {
    const runtimes = [];
    for (const digit of ['a','b']) {
      const output = join(directory, digit);
      const commit = digit.repeat(40);
      execFileSync(process.execPath, ['scripts/build.mjs', output], {
        cwd:new URL('..', import.meta.url),
        env:{...process.env,GITHUB_SHA:commit},
      });
      const html = readFileSync(join(output, 'index.html'), 'utf8');
      const manifest = JSON.parse(readFileSync(join(output, 'build.json'), 'utf8'));
      assert.equal(manifest.commit, commit);
      const runtime = manifest.runtime;
      runtimes.push(runtime);
      for (const file of ['start.js','style.css','assets/fragaria-strawberry.png','assets/matpc-14762.jpg']) {
        assert.ok(html.includes('"./' + runtime + '/' + file + '"'));
        assert.ok(readFileSync(join(output, runtime, file)).length > 0);
      }
      assert.ok(readFileSync(join(output, runtime, 'docs/SOURCES.tsv')).length > 0);
    }
    assert.notEqual(runtimes[0], runtimes[1]);
  } finally {
    rmSync(directory, {recursive:true,force:true});
  }
});
