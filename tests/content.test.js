import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ancientLessons } from '../ancient-lessons.js';
import { atlasEntries } from '../atlas-lessons.js';
import { calendarEvents } from '../calendar-lessons.js';
import { belongsTo, parseCatalogue } from '../catalogue.js';
import { chapters, languages, plaza, ui } from '../content.js';
import { archiveCases } from '../diaspora-archive.js';
import { diasporaRecords } from '../diaspora-lessons.js';
import { earlyModernLessons } from '../early-modern-lessons.js';
import { gematriaValues, sefirot } from '../hebrew-labs.js';
import { feynmanCases, kabbalahLessons } from '../kabbalah-lessons.js';
import { kotelLessons, kotelScenarios } from '../kotel-lessons.js';
import { languageLessons } from '../language-lessons.js';
import { library, libraryLabels } from '../library.js';
import { medievalLessons } from '../medieval-lessons.js';
import { messianicLessons } from '../messianic-lessons.js';
import { modernLessons } from '../modern-lessons.js';
import { romanLessons } from '../roman-lessons.js';
import { models, photo } from '../scenes.js';
import { secondTempleLessons } from '../second-temple-lessons.js';
import { tour } from '../tour.js';
import { tourEvidence } from '../tour-evidence.js';

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
  assert.equal(entries.length, 253);
  assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length);
  assert.ok(entries.some(entry => entry.url === photo.url && belongsTo(entry, 0) && belongsTo(entry, 23)));
  assert.ok(entries.some(entry => entry.url === photo.historyUrl && belongsTo(entry, 23)));
  assert.ok(entries.some(entry => belongsTo(entry, 0)));
  assert.ok(Array.from({length:24}, (_, index) => index + 1).every(id => entries.some(entry => belongsTo(entry, id))));
  assert.ok(belongsTo({chapters:'1–4,6'}, 3));
  assert.equal(belongsTo({chapters:'Prolog,1'}, 10), false);
});

test('festival calendar dates and four localized readings use indexed sources', () => {
  const urls = new Set(parseCatalogue(readFileSync('docs/SOURCES.tsv', 'utf8')).map(item => item.url));
  assert.equal(calendarEvents.length, 19);
  assert.equal(new Set(calendarEvents.map(event => event.id)).size, calendarEvents.length);
  for (const event of calendarEvents) {
    assert.ok(urls.has(event.source.url), event.source.url);
    for (const field of ['name','practice','history']) {
      assert.equal(event[field].length, languages.length);
      assert.ok(event[field].every(line => line.trim()));
    }
  }
  const find = id => calendarEvents.find(event => event.id === id);
  assert.equal(find('shabbat').month, null);
  assert.equal(find('purim').leapMonth, 13);
  assert.equal(find('simchat-torah').diasporaDay, 23);
  assert.equal(find('sigd').day, 29);
});

test('community atlas has separate categories with four-language indexed readings', () => {
  const urls = new Set(parseCatalogue(readFileSync('docs/SOURCES.tsv', 'utf8')).map(item => item.url));
  assert.equal(atlasEntries.length, 19);
  assert.equal(new Set(atlasEntries.map(entry => entry.id)).size, atlasEntries.length);
  assert.equal(atlasEntries.filter(entry => entry.category === 'communities').length, 9);
  assert.equal(atlasEntries.filter(entry => entry.category === 'movements').length, 10);
  for (const entry of atlasEntries) {
    assert.ok(urls.has(entry.source.url), entry.source.url);
    for (const language of languages) {
      for (const field of ['name','history','detail']) assert.ok(entry[field][language].trim());
    }
  }
  assert.equal(atlasEntries.find(entry => entry.id === 'mizrahim').regions, undefined);
});

test('Kabbalah source stops and explanation cases have matched references and four languages', () => {
  const urls = new Set(parseCatalogue(readFileSync('docs/SOURCES.tsv', 'utf8')).map(item => item.url));
  assert.equal(kabbalahLessons.length, 9);
  assert.equal(feynmanCases.length, 5);
  const ids = new Set(kabbalahLessons.map(lesson => lesson.id));
  assert.equal(ids.size, kabbalahLessons.length);
  for (const lesson of kabbalahLessons) {
    for (const field of ['title','period','genre','study','limit']) {
      assert.equal(lesson[field].length, languages.length);
      assert.ok(lesson[field].every(value => value.trim()));
    }
    assert.ok(lesson.sources.length >= 2);
    for (const source of lesson.sources) assert.ok(urls.has(source.url), source.url);
  }
  for (const sample of feynmanCases) {
    assert.ok(ids.has(sample.lessonId));
    assert.ok(sample.choices[sample.correct]);
    for (const values of [sample.question, sample.feedback, sample.transfer, ...sample.choices]) {
      assert.equal(values.length, languages.length);
      assert.ok(values.every(value => value.trim()));
    }
  }
  assert.deepEqual(kabbalahLessons.at(-1).sources.map(source => source.kind), ['self','metadata']);
});

test('Kotel visit observations and scenarios match their four-language sources', () => {
  const urls = new Set(parseCatalogue(readFileSync('docs/SOURCES.tsv', 'utf8')).map(item => item.url));
  assert.equal(kotelLessons.length, 10);
  assert.equal(kotelScenarios.length, 2);
  for (const lesson of kotelLessons) {
    assert.ok(lesson.sources.every(link => urls.has(link.url)));
    for (const values of [lesson.title, lesson.practice, lesson.history]) {
      assert.equal(values.length, languages.length);
      assert.ok(values.every(value => value.trim()));
      assert.doesNotMatch(values[0], /\p{Script=Hebrew}/u);
    }
  }
  for (const example of kotelScenarios) {
    assert.ok(urls.has(example.source));
    assert.ok(example.options[example.correct]);
    assert.equal(example.options.length, example.feedback.length);
    for (const values of [example.question,...example.options,...example.feedback]) {
      assert.equal(values.length, languages.length);
      assert.ok(values.every(value => value.trim()));
      assert.doesNotMatch(values[0], /\p{Script=Hebrew}/u);
    }
  }
});

test('the chapter 20 timeline orders five distinct sources with four equivalent locales', () => {
  const urls = new Set(parseCatalogue(readFileSync('docs/SOURCES.tsv', 'utf8')).map(item => item.url));
  const {cards,activity} = messianicLessons;
  assert.equal(cards.length, 5);
  assert.deepEqual(new Set(cards.map(card => card.id)), new Set(activity.correctOrder));
  assert.equal(activity.correctOrder.length, cards.length);
  for (const card of cards) {
    assert.ok(urls.has(card.source.url));
    if (card.relatedSource) assert.ok(urls.has(card.relatedSource.url));
    for (const field of ['date','sourceClass','title','placeActor','explanation']) {
      assert.equal(card[field].length, languages.length);
      assert.ok(card[field].every(value => value.trim()));
      assert.doesNotMatch(card[field][0], /\p{Script=Hebrew}/u);
    }
  }
  assert.equal(activity.correctOrder.at(-1), 'messianic-frank-lwow');
});

test('all six exhibition sources have a supported claim and open question in the right locale', () => {
  assert.equal(tour.length, 3);
  const options = tour.flatMap(stop => stop.options);
  assert.deepEqual(new Set(options.map(([id]) => id)), new Set(Object.keys(tourEvidence)));
  for (const [id, , url] of options) {
    assert.ok(entries.some(entry => entry.url === url));
    const evidence = tourEvidence[id];
    assert.ok(evidence.sourceTitle);
    assert.equal(evidence.alternatives.length, 2);
    for (const values of [evidence.claim,evidence.feedback,evidence.unanswered,...evidence.alternatives]) {
      assert.equal(values.length, languages.length);
      assert.ok(values.every(value => value.trim()));
      assert.match(values[2], /\p{Script=Hebrew}/u);
      for (const slot of [0,1,3]) assert.doesNotMatch(values[slot], /\p{Script=Hebrew}/u);
    }
  }
});

test('language workshop indexes original spellings and all four localized explanations', () => {
  const {cards,exercises} = languageLessons;
  assert.equal(cards.length, 13);
  assert.equal(exercises.length, 3);
  assert.equal(new Set(cards.map(card => card.id)).size, cards.length);
  const urls = new Set(entries.map(entry => entry.url));
  function scriptRatio(text) {
    const letters = text.match(/\p{L}/gu) ?? [];
    return letters.filter(letter => /\p{Script=Hebrew}/u.test(letter)).length / Math.max(1, letters.length);
  }
  for (const lesson of [...cards,...exercises]) {
    for (const source of [lesson.source,lesson.relatedSource].filter(Boolean)) assert.ok(urls.has(source.url));
    const fields = lesson.term ? [lesson.label,lesson.language,lesson.evidence,lesson.note]
      : [lesson.prompt,lesson.feedback,...lesson.options];
    for (const values of fields) {
      assert.equal(values.length, languages.length);
      assert.ok(values.every(value => value.trim()));
      assert.ok(scriptRatio(values[2]) > .6, values[2]);
      for (const slot of [0,1,3]) assert.ok(scriptRatio(values[slot]) < .4, values[slot]);
    }
    if (lesson.term) assert.match(lesson.term, /\p{Script=Hebrew}/u);
    else assert.ok(lesson.options[lesson.correct]);
  }
});

test('the early settings link nine inspectable objects to chapter sources', () => {
  for (const id of [1,3,4]) {
    const model = models.find(entry => entry.id === id);
    assert.equal(model.options.length, 3);
    assert.equal(new Set(model.options.map(([key]) => key)).size, 3);
    for (const [, names, bodies, url] of model.options) {
      assert.ok(entries.some(entry => entry.url === url && belongsTo(entry,id)), url);
      assert.match(names[2], /\p{Script=Hebrew}/u);
      assert.match(bodies[2], /\p{Script=Hebrew}/u);
      assert.doesNotMatch(bodies[0], /\p{Script=Hebrew}/u);
    }
  }
});

test('diaspora records and exercises preserve four-language dates, sources and subjects', () => {
  const records = new Map(diasporaRecords.map(record => [record.id,record]));
  assert.equal(records.size, 10);
  assert.equal(archiveCases.length, 3);
  for (const record of records.values()) {
    assert.ok(entries.some(entry => entry.url === record.source.url && belongsTo(entry,24)));
    for (const field of ['date','place','title','context','evidence']) {
      assert.ok(languages.every(language => record[field][language].trim()));
    }
    assert.match(record.evidence.he, /\p{Script=Hebrew}/u);
    assert.doesNotMatch(record.evidence.tr, /\p{Script=Hebrew}/u);
  }
  for (const sample of archiveCases) {
    const choices = new Set([sample.answer,...sample.others]);
    assert.equal(choices.size, 3);
    assert.ok([...choices].every(id => records.has(id)));
    assert.equal(sample.question.length, languages.length);
  }
  assert.equal(records.get('alice-kindertransport-1939').type, 'testimony');
  assert.equal(records.get('iraq-emigration-1950').type, 'law');
});

test('all 24 source exercises contain four versions of each card and matched catalogue entries', () => {
  const lessons = {...ancientLessons, ...secondTempleLessons, ...romanLessons, ...medievalLessons, ...earlyModernLessons, ...modernLessons};
  assert.deepEqual(Object.keys(lessons), chapters.map(chapter => String(chapter.id)));
  for (const [chapter, lesson] of Object.entries(lessons)) {
    assert.ok(lesson.cards.length >= 3);
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

test('the Hebrew workbench handles the 22 letters, five standard final values and ten qualities', () => {
  assert.deepEqual(gematriaValues('חי'), [8,10]);
  assert.deepEqual(gematriaValues('ךםןףץ -'), [20,40,50,80,90]);
  assert.deepEqual(gematriaValues('אבגדהוזחטיכלמנסעפצקרשת'), [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]);
  assert.equal(sefirot.length, 10);
  for (const [, titles, descriptions] of sefirot) {
    assert.equal(titles.length, languages.length);
    assert.equal(descriptions.length, languages.length);
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
