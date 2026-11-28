import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ashlagCopy, ashlagPhases, ashlagScreen } from '../ashlag-lessons.js';
import { accountabilityCases, accountabilityRecords } from '../accountability-lessons.js';
import { ancientLessons } from '../ancient-lessons.js';
import { atlasEntries } from '../atlas-lessons.js';
import { bakuCopy, bakuStops } from '../baku-lessons.js';
import { calendarEvents, shabbatStudy } from '../calendar-lessons.js';
import { belongsTo, parseCatalogue } from '../catalogue.js';
import { chapters, languages, plaza, ui } from '../content.js';
import { cultureCases, cultureRecords } from '../culture-lessons.js';
import { pageFeedback, pageNote, talmudCards } from '../talmud-lessons.js';
import { completionKey, exportSave, mergeSave, parseSave, progressKey, readCampaign, saveSchemaVersion, saveSummary } from '../save-data.js';
import { appearanceKey, parseAppearance } from '../appearance.js';
import { dailyCards } from '../daily-lessons.js';
import { archiveCopy as displacementCopy, displacementRecords } from '../displacement-lessons.js';
import { dailyCases } from '../daily-life.js';
import { archiveCases } from '../diaspora-archive.js';
import { diasporaRecords } from '../diaspora-lessons.js';
import { earlyModernLessons } from '../early-modern-lessons.js';
import { deskCopy, genizaLetters } from '../geniza-lessons.js';
import { atbash, gematriaValues, sefirot } from '../hebrew-labs.js';
import { feynmanCases, kabbalahLessons } from '../kabbalah-lessons.js';
import { advancedReadings, comparisonCases } from '../kabbalah-advanced-lessons.js';
import { kotelLessons, kotelScenarios } from '../kotel-lessons.js';
import { languageLessons } from '../language-lessons.js';
import { library, libraryLabels } from '../library.js';
import { medievalLessons } from '../medieval-lessons.js';
import { messianicLessons } from '../messianic-lessons.js';
import { pressLessons } from '../press-lessons.js';
import { mandateLessons } from '../mandate-lessons.js';
import { modernLessons } from '../modern-lessons.js';
import { romanLessons } from '../roman-lessons.js';
import { models, photo } from '../scenes.js';
import { circleCopy, circleTurns } from '../study-circle-lessons.js';
import { secondTempleLessons } from '../second-temple-lessons.js';
import { methodCopy, wordMethods } from '../word-method-lessons.js';
import { tour } from '../tour.js';
import { tourEvidence } from '../tour-evidence.js';
import { tourFollowup } from '../tour-followup-lessons.js';
import { kingdomMap } from '../kingdom-map-lessons.js';
import { transferLessons as earlyTransfers } from '../transfer-early-lessons.js';
import { transferLessons as middleTransfers } from '../transfer-middle-lessons.js';
import { transferLessons as lateTransfers } from '../transfer-late-lessons.js';

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

test('portable saves merge valid progress without replacing local drafts or touching unrelated storage', () => {
  function mockStorage(initial, reject) {
    const values = new Map(Object.entries(initial));
    return {
      get length() { return values.size; },
      key(index) { return [...values.keys()][index]; },
      getItem(key) { return values.get(key) ?? null; },
      setItem(key, value) {
        if (key === reject) throw new Error('Test storage limit');
        values.set(key,value);
      },
      removeItem(key) { values.delete(key); },
    };
  }
  const draft = 'wall.transfer.1.draft';
  const importedProgress = JSON.stringify({active:'2',completed:['plaza','1'],placement:[121,-1]});
  const source = mockStorage({
    [progressKey]:importedProgress, [draft]:'עברית • Türkçe', 'wall.journal':'Açıq sual',
    'wall.tour.solved.followup-photo':'1',
    'wall.language':'he', 'unrelated.preferences':'private', 'wall.unknown-scope':'ignored',
    [appearanceKey]:JSON.stringify({theme:'contrast',motion:'reduce',size:175}),
  });
  const encoded = exportSave(source);
  assert.doesNotMatch(encoded,/unrelated|unknown-scope/);
  const incoming = parseSave(encoded);
  assert.deepEqual(saveSummary(incoming),{chapters:1,drafts:2});
  const fresh = mockStorage({});
  mergeSave(fresh,encoded);
  assert.deepEqual(JSON.parse(fresh.getItem(progressKey)),JSON.parse(importedProgress));
  const existingProgress = JSON.stringify({active:'3',completed:['plaza','2']});
  const destination = mockStorage({[progressKey]:existingProgress,[draft]:'Existing note','wall.language':'az'});
  mergeSave(destination,encoded);
  assert.deepEqual(JSON.parse(destination.getItem(progressKey)),{active:'3',completed:['plaza','1','2']});
  assert.equal(destination.getItem(draft),'Existing note');
  assert.equal(destination.getItem('wall.language'),'az');
  assert.equal(destination.getItem('wall.journal'),'Açıq sual');
  assert.equal(destination.getItem('wall.tour.solved.followup-photo'),'1');
  assert.equal(parseAppearance(destination.getItem(appearanceKey)).size,175);
  assert.throws(() => parseSave('{"format":"WALL save","version":1,"values":{"__proto__":"bad"}}'),/Save data/);
  assert.throws(() => parseSave(encoded.replace('"version":1','"version":2')),/Save version/);
  assert.throws(() => parseSave(encoded.replace('wall.transfer.1.draft','wall.transfer.25.draft')),/Save data/);
  for (const invalid of [[465,1],[80,0],[90.5,1]]) {
    const values = {...incoming,[progressKey]:JSON.stringify({...JSON.parse(importedProgress),placement:invalid})};
    assert.throws(() => parseSave(JSON.stringify({format:'WALL save',version:1,values})),/Save data/);
    assert.equal(readCampaign(() => values[progressKey]).placement,undefined);
  }
  const unavailable = mockStorage({[progressKey]:existingProgress},'wall.journal');
  assert.throws(() => mergeSave(unavailable,encoded),/Test storage limit/);
  assert.equal(unavailable.getItem(progressKey),existingProgress);
  assert.equal(unavailable.getItem(draft),null);
  assert.equal(unavailable.length,1);

  const pending = new Map([[draft,'Current session draft'],['wall.unknown-scope','ignored']]);
  assert.equal(parseSave(exportSave(source,pending))[draft],'Current session draft');
  assert.deepEqual(parseSave(exportSave(null,pending)),{[draft]:'Current session draft'});

  const competing = mockStorage({
    [progressKey]:JSON.stringify({active:'3',completed:['plaza'],placement:[150,1]}),
    [completionKey('1')]:'1',
  });
  const waiting = new Map([
    [progressKey,JSON.stringify({active:'2',completed:['plaza'],placement:[192,-1]})],
    [completionKey('2'),'1'],
  ]);
  assert.deepEqual(readCampaign(key => competing.getItem(key),waiting),{
    active:'2',completed:new Set(['plaza','1','2']),placement:[192,-1],
  });
  const shared = parseSave(exportSave(competing,waiting));
  assert.deepEqual(Object.keys(shared),[progressKey]);
  assert.deepEqual(JSON.parse(shared[progressKey]),{active:'2',completed:['plaza','1','2'],placement:[192,-1]});
  mergeSave(competing,encoded);
  assert.equal(competing.getItem(completionKey('1')),'1');
  assert.ok(readCampaign(key => competing.getItem(key)).completed.has('1'));
  assert.deepEqual(JSON.parse(competing.getItem(progressKey)).placement,[150,1]);
});

test('reading preferences reject invalid themes, sizes and motion options', () => {
  const preferences = {theme:'light',motion:'system',size:125};
  assert.deepEqual(parseAppearance(JSON.stringify(preferences)),preferences);
  for (const setting of [{size:90.5},{size:205},{size:83},{theme:'any'},{motion:false}]) {
    assert.equal(parseAppearance(JSON.stringify({...preferences,...setting})),null);
  }
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

test('browser and desktop versions follow VERSION and scene options localize', () => {
  const version = readFileSync(new URL('../VERSION', import.meta.url), 'utf8').trim();
  assert.match(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), new RegExp('>' + version.replaceAll('.', '\\.') + '<'));
  const desktopPackage = JSON.parse(readFileSync(new URL('../desktop/package.json', import.meta.url), 'utf8'));
  const desktopLock = JSON.parse(readFileSync(new URL('../desktop/package-lock.json', import.meta.url), 'utf8'));
  assert.equal('v' + desktopPackage.version, version);
  assert.equal(desktopLock.version, desktopPackage.version);
  assert.equal(desktopLock.packages[''].version, desktopPackage.version);
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
  assert.equal(entries.length, 442);
  assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length);
  assert.ok(entries.some(entry => entry.url === photo.url && belongsTo(entry, 0) && belongsTo(entry, 23)));
  assert.ok(entries.some(entry => entry.url === photo.historyUrl && belongsTo(entry, 23)));
  assert.ok(entries.some(entry => belongsTo(entry, 0)));
  assert.ok(Array.from({length:24}, (_, index) => index + 1).every(id => entries.some(entry => belongsTo(entry, id))));
  assert.ok(belongsTo({chapters:'1–4,6'}, 3));
  assert.equal(belongsTo({chapters:'Prolog,1'}, 10), false);
});

test('the late Mandate exercise orders the strike, commission and policy with chapter sources', () => {
  const {cards,displayOrder,activity} = mandateLessons;
  assert.deepEqual(activity.correctOrder,cards.map(card => card.id));
  assert.deepEqual([...displayOrder].sort((a,b) => a-b),[0,1,2]);
  for (const card of cards) {
    for (const field of ['title','date','sourceClass','placeActor','explanation']) {
      assert.equal(card[field].length,languages.length);
      assert.ok(card[field].every(value => value.trim()));
    }
    for (const source of [card.source,card.relatedSource].filter(Boolean)) {
      assert.ok(entries.some(record => record.url === source.url && belongsTo(record,21)),source.url);
    }
  }
});

test('Ashlag workbench separates the root, four phases and four screen states with sources', () => {
  assert.deepEqual(ashlagPhases.map(phase => phase.id),['root','alef','bet','gimel','dalet']);
  assert.equal(ashlagScreen.length,4);
  for (const copy of ashlagCopy) {
    assert.equal(copy.length,languages.length);
    assert.ok(copy.every(text => text.trim()));
  }
  for (const lesson of [...ashlagPhases,...ashlagScreen]) {
    assert.ok(entries.some(entry => entry.url === lesson.link && belongsTo(entry,24)));
    for (const line of [lesson.title ?? lesson.action,lesson.text]) {
      assert.equal(line.length,languages.length);
      assert.ok(line.every(text => text.trim()));
    }
  }
});

test('letter methods preserve two numeric conventions, text structure and exact references', () => {
  assert.deepEqual(wordMethods.map(method => method.id),['gematria','notarikon','atbash','lexical']);
  assert.deepEqual(gematriaValues('מלך'),[40,30,20]);
  assert.deepEqual(gematriaValues('מלך',true),[40,30,500]);
  assert.deepEqual(gematriaValues('ךםןףץ',true),[500,600,700,800,900]);
  assert.equal(atbash('ששך').join(''),'בבל');
  assert.equal(atbash('בבל').join(''),'ששך');
  assert.deepEqual(wordMethods[1].expanded.map(word => word[0]),wordMethods[1].tiles);
  for (const line of methodCopy) assert.equal(line.length,languages.length);
  for (const method of wordMethods) {
    for (const line of [method.title,method.hint,method.result]) {
      assert.equal(line.length,languages.length);
      assert.ok(line.every(text => text.trim()));
    }
    assert.ok(method.sources.every(([,url]) => entries.some(entry => entry.url === url && belongsTo(entry,16))));
  }
});

test('the closing study circle has three separate localized prompts and catalogue sources', () => {
  assert.deepEqual(circleTurns.map(turn => turn.id),['listen','purpose','mutual-support']);
  const byUrl = new Map(entries.filter(entry => belongsTo(entry,24)).map(entry => [entry.url,entry]));
  for (const copy of circleCopy) {
    assert.equal(copy.length,languages.length);
    assert.ok(copy.every(text => text.trim()));
  }
  for (const turn of circleTurns) {
    assert.equal(turn.choices.length,2);
    assert.ok(turn.choices[turn.correct]);
    for (const text of [turn.name,turn.speech,turn.retry,turn.response,...turn.choices]) {
      assert.equal(text.length,languages.length);
      assert.ok(text.every(value => value.trim()));
    }
    assert.ok(turn.sources.every(([,url]) => byUrl.has(url)));
  }
});

test('Geniza desk distinguishes two chronological records, with sources and localized sides', () => {
  assert.deepEqual(genizaLetters.map(letter => letter.id),['ena-2558-10','ts-12-203']);
  assert.ok(deskCopy.every(label => label.length === languages.length && label.every(text => text.trim())));
  for (const letter of genizaLetters) {
    assert.ok(entries.some(entry => entry.url === letter.url && belongsTo(entry,15)));
    assert.ok(letter.options[letter.correct]);
    for (const line of [letter.title,letter.front,letter.back,letter.prompt,letter.result,...letter.options]) {
      assert.equal(line.length,languages.length);
      assert.ok(line.every(text => text.trim()));
    }
  }
});

test('responsibility records stay chronological with sources and localized exercises', () => {
  assert.deepEqual(accountabilityRecords.map(record => record.id), [
    'hasmonean-idumea', 'rhine-1096', 'thrace-1934', 'baghdad-farhud-1941',
    'king-david-hotel-1946', 'kafr-qasim-1956', 'amia-1994', 'rabin-1995',
  ]);
  for (const record of accountabilityRecords) {
    for (const field of ['label','title','datePlace','actor','affected','account','evidenceLimit']) {
      assert.equal(record[field].length,languages.length);
      assert.ok(record[field].every(value => value.trim()));
    }
    assert.ok(record.sources.length >= 2);
    for (const source of record.sources) {
      assert.ok(entries.some(entry => entry.id === source.id && entry.url === source.url));
    }
  }
  for (const [id, exercise] of Object.entries(accountabilityCases)) {
    assert.ok(accountabilityRecords.some(record => record.id === id));
    assert.ok(exercise.choices[exercise.correct]);
    for (const locale of languages.keys()) {
      assert.ok(exercise.question[locale].trim());
      assert.ok(exercise.result[locale].trim());
      assert.equal(new Set(exercise.choices.map(choice => choice[locale])).size,exercise.choices.length);
    }
  }
});

test('chapter transfer examples have distinct localized choices and exact catalogue links', () => {
  const transferLessons = [...earlyTransfers,...middleTransfers,...lateTransfers];
  assert.deepEqual(transferLessons.map(item => item.chapter), chapters.map(episode => episode.id));
  const urls = new Set(entries.map(entry => entry.url));
  for (const lesson of transferLessons) {
    assert.equal(lesson.choices.length, 3);
    assert.ok(lesson.choices[lesson.correct]);
    for (const language of languages) {
      assert.equal(new Set(lesson.choices.map(choice => choice[language])).size, 3);
      const fields = [lesson.scenario, lesson.feedback, lesson.explain, ...lesson.choices];
      for (const field of fields) {
        assert.ok(field[language].trim());
        assert.equal(/[\u0590-\u05ff]/u.test(field[language]), language === 'he');
      }
    }
    assert.ok(lesson.sources.length > 0);
    for (const source of lesson.sources) assert.ok(urls.has(source.url), source.url);
  }
});

test('diaspora objects and exhibition labels have four locales and linked records', () => {
  assert.deepEqual(cultureRecords.map(record => record.id), [
    'kaifeng-stele','ferrara-bible','tsenerene-print','glikl-memoir',
    'baldones-census','regina-jonas','maimunah-song','juhuri-recording',
  ]);
  assert.equal(cultureCases.length, 4);
  for (const record of cultureRecords) {
    assert.ok(chapters.some(chapter => chapter.id === record.chapter));
    for (const field of ['title','era','object','context','limit']) {
      assert.equal(record[field].length, languages.length);
      assert.ok(record[field].every(line => line.trim()));
      assert.match(record[field][2], /\p{Script=Hebrew}/u);
      assert.doesNotMatch(record[field][0], /\p{Script=Hebrew}/u);
    }
    for (const source of record.sources) {
      assert.ok(entries.some(entry => entry.url === source.url));
      assert.equal(source.title.length, languages.length);
    }
  }
  for (const sample of cultureCases) {
    assert.ok(cultureRecords.some(record => record.id === sample.recordId));
    assert.equal(sample.choices.length, 3);
    assert.ok(sample.choices[sample.correct]);
    for (const values of [sample.question,sample.feedback,...sample.choices]) {
      assert.equal(values.length, languages.length);
      assert.ok(values.every(line => line.trim()));
    }
  }
});

test('the Talmud folio distinguishes six readings with indexed texts and a historical scan', () => {
  assert.equal(talmudCards.length,6);
  assert.equal(new Set(talmudCards.map(card => card.id)).size,talmudCards.length);
  const fields = [pageFeedback,pageNote];
  for (const card of talmudCards) {
    assert.ok(card.refs.length > 0);
    assert.ok(card.refs.every(source => entries.some(entry => entry.url === source.url)));
    fields.push(card.title,card.layer,card.meaning,card.limit,...card.refs.map(source => source.title));
  }
  assert.match(talmudCards.at(-1).refs.at(-1).url,/Berakhot2a.jpg$/);
  for (const values of fields) {
    assert.equal(values.length,languages.length);
    assert.ok(values.every(value => value.trim()));
    assert.match(values[2], /\p{Script=Hebrew}/u);
  }
});

test('festival calendar dates and four localized readings use indexed sources', () => {
  const urls = new Set(parseCatalogue(readFileSync('docs/SOURCES.tsv', 'utf8')).map(item => item.url));
  assert.equal(calendarEvents.length, 20);
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
  const mimouna = find('mimouna');
  assert.deepEqual([mimouna.month,mimouna.day,mimouna.diasporaDay],[1,22,23]);
  for (const source of [mimouna.source,mimouna.context,mimouna.schedule]) {
    assert.ok(entries.some(item => item.url === source.url && belongsTo(item,24)));
  }
  const {places, text, answer, heading, introduction, question, retry, feedback} = shabbatStudy;
  assert.equal(places.length, 4);
  assert.equal(new Set(places.map(place => place.id)).size, places.length);
  assert.ok(places.some(place => place.id === answer));
  for (const values of [heading,introduction,question,retry,feedback,...places.flatMap(place => [place.title,place.practice])]) {
    assert.equal(values.length, languages.length);
    assert.ok(values.every(value => value.trim()));
    assert.match(values[2], /\p{Script=Hebrew}/u);
  }
  for (const source of [text,...places.map(place => place.source)]) assert.ok(urls.has(source.url), source.url);
});

test('community atlas has separate categories with four-language indexed readings', () => {
  const urls = new Set(parseCatalogue(readFileSync('docs/SOURCES.tsv', 'utf8')).map(item => item.url));
  assert.equal(atlasEntries.length, 35);
  assert.equal(new Set(atlasEntries.map(entry => entry.id)).size, atlasEntries.length);
  assert.equal(atlasEntries.filter(entry => entry.category === 'communities').length, 14);
  assert.equal(atlasEntries.filter(entry => entry.category === 'movements').length, 16);
  assert.equal(atlasEntries.filter(entry => entry.category === 'identities').length, 1);
  assert.equal(atlasEntries.filter(entry => entry.category === 'ancient').length, 4);
  for (const entry of atlasEntries) {
    assert.ok(urls.has(entry.source.url), entry.source.url);
    if (entry.context) assert.ok(urls.has(entry.context.url), entry.context.url);
    if (entry.exercise) {
      assert.equal(entry.exercise.options.length,entry.exercise.feedback.length);
      for (const values of [entry.exercise.prompt,...entry.exercise.options,...entry.exercise.feedback]) {
        assert.equal(values.length,languages.length);
        assert.ok(values.every(text => text.trim()));
      }
    }
    for (const language of languages) {
      for (const field of ['name','history','detail']) assert.ok(entry[field][language].trim());
    }
  }
  assert.equal(atlasEntries.find(entry => entry.id === 'mizrahim').regions, undefined);
});

test('Baku archive distinguishes building, writing and photograph evidence in four languages', () => {
  const urls = new Set(entries.map(entry => entry.url));
  assert.deepEqual(bakuStops.map(stop => stop.year),[1906,1909,1976]);
  assert.deepEqual(bakuStops[1].views.map(side => side.example.slice(1)),[
    ['Hebr','rtl'],['Latn','ltr'],['Cyrl','ltr'],['Cyrl','ltr'],
  ]);
  assert.notEqual(bakuStops[1].views[2].example[0],bakuStops[1].views[3].example[0]);
  for (const stop of bakuStops) {
    for (const {url} of stop.sources) assert.ok(urls.has(url),url);
    assert.ok(stop.answers[stop.correct]);
    for (const copy of [...bakuCopy,stop.title,stop.question,stop.feedback,...stop.answers,
      ...stop.views.flatMap(side => [side.label,side.note])]) {
      assert.equal(copy.length,languages.length);
      assert.ok(copy.every(text => text.trim()));
    }
  }
});

test('Kabbalah source stops and explanation cases have matched references and four languages', () => {
  const urls = new Set(parseCatalogue(readFileSync('docs/SOURCES.tsv', 'utf8')).map(item => item.url));
  assert.equal(kabbalahLessons.length, 9);
  assert.equal(feynmanCases.length, 6);
  assert.equal(advancedReadings.length, 12);
  assert.equal(comparisonCases.length, 9);
  const readings = [...kabbalahLessons,...advancedReadings];
  const cases = [...feynmanCases,...comparisonCases];
  const ids = new Set(readings.map(lesson => lesson.id));
  assert.equal(ids.size, readings.length);
  assert.equal(new Set(cases.map(sample => sample.lessonId)).size, cases.length);
  for (const lesson of readings) {
    for (const field of ['title','period','genre','study','limit']) {
      assert.equal(lesson[field].length, languages.length);
      assert.ok(lesson[field].every(value => value.trim()));
      assert.match(lesson[field][2], /\p{Script=Hebrew}/u);
      assert.doesNotMatch(lesson[field][0], /\p{Script=Hebrew}/u);
    }
    assert.ok(lesson.sources.length >= 2);
    for (const source of lesson.sources) assert.ok(urls.has(source.url), source.url);
  }
  for (const sample of cases) {
    assert.ok(ids.has(sample.lessonId));
    assert.ok(sample.choices[sample.correct]);
    for (const values of [sample.question, sample.feedback, sample.transfer, ...sample.choices]) {
      assert.equal(values.length, languages.length);
      assert.ok(values.every(value => value.trim()));
    }
  }
  const community = kabbalahLessons.find(lesson => lesson.id === 'laitman-bnei-baruch');
  assert.deepEqual(community.sources.map(source => source.kind), ['self','research','metadata']);
  assert.equal(entries.find(entry => entry.id === 'B07A').url, community.sources[1].url);
  assert.ok(community.period.every(value => /1984.*1991/.test(value)));
  const rose = advancedReadings.find(lesson => lesson.id === 'zohar-rose-commentaries');
  assert.deepEqual(rose.sources.slice(0, 2).map(source => source.url),
    ['ZOH02','ZOH03'].map(id => entries.find(entry => entry.id === id).url));
  assert.deepEqual(rose.commentaries.map(commentary => commentary.url),
    ['ZOH04','ZOH05','ZOH06','ZOH07','ZOH08','ZOH09'].map(id => entries.find(entry => entry.id === id).url));
  for (const {title, period, study} of rose.commentaries) {
    for (const values of [title, period, study]) {
      assert.equal(values.length, languages.length);
      assert.ok(values.every(value => value.trim()));
      assert.match(values[2], /\p{Script=Hebrew}/u);
    }
  }
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

test('the chapter 20 timeline orders six distinct sources with four equivalent locales', () => {
  const urls = new Set(parseCatalogue(readFileSync('docs/SOURCES.tsv', 'utf8')).map(item => item.url));
  const {cards,activity} = messianicLessons;
  assert.equal(cards.length, 6);
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

test('press timeline dates proposals, congress decisions and the Bund’s program separately', () => {
  const {cards,displayOrder,activity} = pressLessons;
  assert.deepEqual(cards.map(card => card.id),activity.correctOrder);
  assert.deepEqual([...displayOrder].sort((left,right) => left-right),[0,1,2,3,4,5]);
  for (const card of cards) {
    for (const source of [card.source,card.relatedSource].filter(Boolean)) {
      assert.ok(entries.some(item => item.url === source.url && belongsTo(item,22)), source.url);
    }
    for (const field of ['date','sourceClass','title','placeActor','explanation']) {
      assert.equal(card[field].length,languages.length);
      assert.ok(card[field].every(text => text.trim()));
    }
  }
  for (const field of ['instruction','feedback']) {
    assert.equal(activity[field].length,languages.length);
    assert.ok(activity[field].every(text => text.trim()));
  }
});

test('chapter 22 displacement records keep distinct causes, places and documentary pathways', () => {
  assert.deepEqual(displacementRecords.map(record => record.id),[
    'holocaust-1933-1945','partition-recommendation','haifa-flight-return','lydda-ramle-expulsion','iraq-sawdai-departure',
  ]);
  for (const record of displacementRecords) {
    assert.ok(record.steps.length >= 2);
    assert.ok(record.sources.length >= 2);
    for (const source of record.sources) {
      assert.ok(entries.some(item => item.url === source.url && belongsTo(item,22)),source.url);
    }
    assert.ok(record.options[record.correct]);
    assert.equal(record.options.length,record.feedback.length);
    const values = [...displacementCopy,record.title,record.summary,record.prompt,...record.steps,...record.options,...record.feedback];
    for (const copy of values) {
      assert.equal(copy.length,languages.length);
      assert.ok(copy.every(text => text.trim()));
    }
  }
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

test('the visitor can ask about every exhibition stop and check another chapter source', () => {
  assert.deepEqual(Object.keys(tourFollowup),Object.keys(tourEvidence));
  for (const [id,followup] of Object.entries(tourFollowup)) {
    assert.equal(new Set(followup.choices).size,3);
    assert.ok(followup.choices.includes(id));
    assert.ok(followup.choices.every(choice => Object.hasOwn(tourFollowup,choice)));
    assert.ok(entries.some(entry => entry.url === followup.url && belongsTo(entry,24)),followup.url);
    assert.notEqual(followup.url,tour.flatMap(stop => stop.options).find(([option])=>option===id)[2]);
    for (const values of [followup.title,followup.prompt,followup.note]) {
      assert.equal(values.length,languages.length);
      assert.ok(values.every(value => value.trim()));
      assert.match(values[2],/\p{Script=Hebrew}/u);
    }
  }
});

test('the kingdom map pairs the northern and southern cities with their text sources', () => {
  assert.deepEqual(kingdomMap.cities.map(({id,kingdom})=>[id,kingdom]),[
    ['samaria','israel'],['jerusalem','judah'],
  ]);
  assert.ok(kingdomMap.cities[0].point[1]<kingdomMap.cities[1].point[1]);
  for (const city of kingdomMap.cities) {
    assert.ok(entries.some(entry => entry.url === city.source && belongsTo(entry,2)),city.source);
    for (const text of [city.name,city.text]) {
      assert.equal(text.length,languages.length);
      assert.ok(text.every(value=>value.trim()));
      assert.match(text[2],/\p{Script=Hebrew}/u);
    }
  }
  assert.ok(entries.some(entry => entry.url === kingdomMap.overview && belongsTo(entry,2)));
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

test('inspectable scenes link localized objects or views to chapter sources', () => {
  for (const id of [1,3,4,7,12,14,16,18,19,20,21]) {
    const model = models.find(entry => entry.id === id);
    const viewCounts = {7:8,12:5,20:4,21:4};
    assert.equal(model.options.length, viewCounts[id] ?? 3);
    assert.equal(new Set(model.options.map(([key]) => key)).size, model.options.length);
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

test('daily life topics cite living-practice context and legal texts in four locales', () => {
  const cards = new Map(dailyCards.map(card => [card.id,card]));
  assert.equal(cards.size,8);
  assert.equal(dailyCases.length,3);
  for (const card of cards.values()) {
    for (const source of [card.source,card.relatedSource].filter(Boolean)) {
      assert.ok(entries.some(entry => entry.url === source.url && belongsTo(entry,24)));
    }
    for (const field of ['topic','meaning','variation']) {
      assert.ok(languages.every(language => card[field][language].trim()));
      assert.match(card[field].he, /\p{Script=Hebrew}/u);
      assert.doesNotMatch(card[field].tr, /\p{Script=Hebrew}/u);
    }
  }
  for (const sample of dailyCases) {
    assert.ok([sample.answer,...sample.alternatives].every(id => cards.has(id)));
    assert.equal(sample.question.length,languages.length);
    assert.equal(sample.feedback.length,languages.length);
  }
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
    const engineRevisions = [];
    for (const digit of ['a','b']) {
      const output = join(directory, digit);
      const commit = digit.repeat(40);
      execFileSync(process.execPath, ['scripts/build.mjs', output], {
        cwd:new URL('..', import.meta.url),
        env:{...process.env,WALL_BUILD_COMMIT:commit},
      });
      const html = readFileSync(join(output, 'index.html'), 'utf8');
      const manifest = JSON.parse(readFileSync(join(output, 'build.json'), 'utf8'));
      assert.equal(manifest.commit, commit);
      assert.deepEqual(manifest.languages,languages);
      assert.equal(manifest.saveSchema,saveSchemaVersion);
      assert.match(manifest.contentRevision,/^[0-9a-f]{64}$/);
      assert.equal(manifest.engine.name,'WALL Canvas 2D');
      assert.equal(manifest.planRevision,createHash('sha256').update(readFileSync('docs/PLAN.md')).digest('hex'));
      assert.equal(manifest.sourceCatalogueRevision,
        createHash('sha256').update(readFileSync('docs/SOURCES.tsv')).digest('hex'));
      const runtime = manifest.runtime;
      runtimes.push(runtime);
      engineRevisions.push(manifest.engine.revision);
      const root = join(output, runtime);
      const runtimeFiles = readdirSync(root, {recursive:true,withFileTypes:true})
        .filter(file => file.isFile())
        .map(file => relative(root, join(file.parentPath,file.name)).replaceAll('\\', '/'))
        .filter(name => name !== 'docs/SOURCES.tsv');
      const inputs = ['index.html', ...runtimeFiles].sort().map(name => {
        const source = name === 'index.html' ? name : join(root,name);
        return [name,createHash('sha256').update(readFileSync(source)).digest('hex')];
      });
      assert.equal(manifest.engine.revision,createHash('sha256').update(JSON.stringify(inputs)).digest('hex'));
      for (const file of ['start.js','style.css','assets/fragaria-strawberry.png','assets/matpc-14762.jpg']) {
        assert.ok(html.includes('"./' + runtime + '/' + file + '"'));
        assert.ok(readFileSync(join(output, runtime, file)).length > 0);
      }
      assert.ok(readFileSync(join(output, runtime, 'docs/SOURCES.tsv')).length > 0);
    }
    assert.notEqual(runtimes[0], runtimes[1]);
    assert.equal(engineRevisions[0], engineRevisions[1]);
  } finally {
    rmSync(directory, {recursive:true,force:true});
  }
});
