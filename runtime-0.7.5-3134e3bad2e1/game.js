import { controllerHelp, mountController } from './controller.js';
import { connectAppearance } from './appearance.js';
import { chapters, languages, plaza, ui } from './content.js';
import { accountabilityLabels, ashlagLabels, atlasLabels, calendarLabels, cultureLabels, dailyLabels, diasporaLabels, genizaLabels, kabbalahLabels, languageStudyLabels, library, libraryLabels, studyCircleLabels, visitLabels, wordMethodLabels } from './library.js';
import { alphabetNotes, lights, models, photo, studyNames, worldNote, worlds } from './scenes.js';
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
const timelineLabels = {
  tr:['1665–1759 belgelerini tarihe koy','Belgeler yükleniyor…','Belgeler açılamadı. Sayfayı yenileyip tekrar dene.'],
  en:['Put the 1665–1759 sources in order','Loading the documents…','The documents could not open. Reload the page and try again.'],
  he:['סדרו את המקורות מ־1665 עד 1759','המסמכים נטענים…','המסמכים לא נפתחו. רעננו את הדף ונסו שוב.'],
  az:['1665–1759-cu illərin mənbələrini sırala','Sənədlər yüklənir…','Sənədlər açılmadı. Səhifəni yeniləyib yenidən cəhd et.'],
};
const tourLoadLabels = {
  tr:['Ziyaretçiye sergini anlat','Sergi yükleniyor…','Sergi açılamadı. Sayfayı yenileyip tekrar dene.'],
  en:['Tell a visitor your story','Loading your exhibition…','The exhibition could not open. Reload the page and try again.'],
  he:['ספרו למבקר את סיפור התערוכה','התערוכה נטענת…','התערוכה לא נפתחה. רעננו את הדף ונסו שוב.'],
  az:['Ziyarətçiyə sərgini anlat','Sərgi yüklənir…','Sərgi açılmadı. Səhifəni yeniləyib yenidən cəhd et.'],
};
const transferLabels = {
  tr:['Yeni bir örnekte dene','Örnek yükleniyor…','Örnek açılamadı. Kapatıp yeniden aç.','Oyunu indir'],
  en:['Try a new example','Loading the example…','The example could not open. Close it and reopen it.','Download WALL'],
  he:['נסו דוגמה חדשה','הדוגמה נטענת…','הדוגמה לא נפתחה. סגרו אותה ופתחו שוב.','הורידו את WALL'],
  az:['Yeni nümunədə sına','Nümunə yüklənir…','Nümunə açılmadı. Bağlayıb yenidən aç.','WALL-u endir'],
};
const transferDecks = [
  () => import('./transfer-early-lessons.js'),
  () => import('./transfer-middle-lessons.js'),
  () => import('./transfer-late-lessons.js'),
];
const talmudLabels = {
  tr:['Talmud sayfasını aç','Sayfa yükleniyor…','Sayfa açılamadı. Kapatıp yeniden aç.'],
  en:['Open a Talmud page','Loading the page…','The page could not open. Close it and reopen it.'],
  he:['פתחו דף תלמוד','הדף נטען…','הדף לא נפתח. סגרו אותו ופתחו שוב.'],
  az:['Talmud səhifəsini aç','Səhifə yüklənir…','Səhifə açılmadı. Bağlayıb yenidən aç.'],
};
const settingsLabels = {
  tr:{title:'Ayarlar',backup:['Kayıt taşı','Kayıt araçları yükleniyor…','Araçlar açılamadı. Kapatıp yeniden aç.'],restored:'Kayıtlar birleştirildi.'},
  en:{title:'Settings',backup:['Transfer a save','Loading save tools…','The tools could not open. Close and reopen.'],restored:'The saves were merged.'},
  he:{title:'הגדרות',backup:['העברת שמירה','כלי השמירה נטענים…','הכלים לא נפתחו. סגרו ופתחו שוב.'],restored:'השמירות מוזגו.'},
  az:{title:'Ayarlar',backup:['Yaddaşı köçür','Yaddaş alətləri yüklənir…','Alətlər açılmadı. Bağlayıb yenidən aç.'],restored:'Yaddaşlar birləşdirildi.'},
};
const saveLabels = Object.fromEntries(Object.entries(settingsLabels).map(([lang,labels]) => [lang,labels.backup]));
const lessonDecks = [
  () => import('./ancient-lessons.js').then(module => module.ancientLessons),
  () => import('./second-temple-lessons.js').then(module => module.secondTempleLessons),
  () => import('./roman-lessons.js').then(module => module.romanLessons),
  () => import('./medieval-lessons.js').then(module => module.medievalLessons),
  () => import('./early-modern-lessons.js').then(module => module.earlyModernLessons),
  () => import('./modern-lessons.js').then(module => module.modernLessons),
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
  const appearance = connectAppearance(find('appearance'),read,store);
  const world = await makeWorld(find('world'), appearance.reducedMotion);
  const controls = find('controls');
  const options = find('choices');
  const result = find('result');
  const next = find('next');
  const reader = find('reader');
  const chooser = find('chapters');
  const studyRoom = find('library');
  const settings = find('settings');
  const photoPanel = find('photo');
  const comparison = find('compare-view');
  const journal = find('journal');
  const selector = find('lang');
  const cataloguePanel = find('catalogue');
  const sequenceSurface = find('sequence');
  const evidence = find('evidence');
  const timeline = find('messianic-timeline');
  const talmud = find('talmud-page');
  const geniza = find('geniza-desk');
  const circle = find('study-circle');
  const ashlag = find('ashlag-workbench');
  const transfer = find('transfer');
  const evidenceChoices = find('evidence-choices');
  const labRoot = find('language-labs');
  const labs = labRoot.querySelectorAll('details');
  const labState = {word:[], sefirah:0, daat:false};
  const kabbalahView = {lesson:null,sourcesOpen:false,exerciseOpen:false,solved:new Set()};
  const cultureView = {record:null};
  const accountabilityView = {record:null};
  const genizaView = {};
  const circleView = {};
  const wordMethodView = {};
  const ashlagView = {};
  const talmudView = {reading:null,side:0,position:0,answers:[['','',''],['','','']]};
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
  let tourLanguage;
  const letters = new Set();
  const restored = history.state?.wallRestored === true;
  if (restored) {
    const state = { ...history.state };
    delete state.wallRestored;
    history.replaceState(state,'');
  }

  const episodeId = index => String(episodes[index].id ?? 'plaza');
  const firstIncomplete = () => episodes.findIndex((_, index) => !progress.completed.has(episodeId(index)));
  const unlocked = index => index >= 0 && (index === 0 || index === firstIncomplete() || progress.completed.has(episodeId(index)));
  const save = () => store(key, JSON.stringify({active:episodeId(active),completed:[...progress.completed]}));
  const locale = () => languages.indexOf(language);
  function connectDisclosure(id, translations, load, scope = () => null) {
    const detail = find(id);
    const [summary, status, panel] = detail.children;
    let request;
    async function refresh() {
      const current = language;
      const labels = translations[current];
      summary.textContent = labels[0];
      const context = scope();
      if (request && (request.language !== current || request.context !== context)) {
        request = undefined;
        panel.replaceChildren();
        status.hidden = true;
      }
      if (detail.hidden || !detail.open || request) return;
      const pending = {language:current,context};
      request = pending;
      status.hidden = false;
      status.textContent = labels[1];
      try {
        const mount = await load(context);
        if (request === pending) {
          mount(panel, current, languages.indexOf(current));
          status.hidden = true;
        }
      } catch {
        if (request === pending) {
          request = undefined;
          status.textContent = labels[2];
        }
      }
    }
    detail.addEventListener('toggle', refresh);
    return refresh;
  }
  const workshops = [
    ['calendar', calendarLabels, () => import('./calendar.js').then(module => module.mountCalendar)],
    ['atlas', atlasLabels, () => import('./atlas.js').then(module => module.mountAtlas)],
    ['kabbalah', kabbalahLabels, () => import('./kabbalah.js').then(({mountKabbalah}) =>
      (panel, current, index) => mountKabbalah(panel, current, index, {read,store}, kabbalahView))],
    ['visit', visitLabels, () => import('./kotel.js').then(module => module.mountKotel)],
    ['language-study', languageStudyLabels, () => import('./language-study.js').then(module => module.mountLanguageStudy)],
    ['diaspora-archive', diasporaLabels, () => import('./diaspora-archive.js').then(module => module.mountDiasporaArchive)],
    ['daily-life', dailyLabels, () => import('./daily-life.js').then(module => module.mountDailyLife)],
    ['culture-archive', cultureLabels, () => import('./culture-archive.js').then(({mountCultureArchive}) =>
      (panel, current, index) => mountCultureArchive(panel, current, index, cultureView))],
    ['accountability-archive', accountabilityLabels, () => import('./accountability-archive.js').then(({mountAccountabilityArchive}) =>
      (panel, current, index) => mountAccountabilityArchive(panel, current, index, accountabilityView))],
  ].map(([id, labels, load]) => connectDisclosure(id, labels, load));
  const refreshTimeline = connectDisclosure('messianic-timeline', timelineLabels, () =>
    import('./messianic-timeline.js').then(module => module.mountMessianicTimeline));
  const refreshTalmud = connectDisclosure('talmud-page', talmudLabels, () =>
    import('./talmud-page.js').then(({mountTalmudPage}) =>
      (panel, current, index) => mountTalmudPage(panel,current,index,talmudView)));
  const refreshGeniza = connectDisclosure('geniza-desk', genizaLabels, () =>
    import('./geniza-desk.js').then(({mountGenizaDesk}) =>
      (panel, current, index) => mountGenizaDesk(panel,index,genizaView)));
  const refreshCircle = connectDisclosure('study-circle', studyCircleLabels, () =>
    import('./study-circle.js').then(({mountStudyCircle}) =>
      (panel, current, index) => mountStudyCircle(panel,index,circleView)));
  const refreshWordMethods = connectDisclosure('word-methods', wordMethodLabels, () =>
    import('./word-methods.js').then(({mountWordMethods}) =>
      (panel, current, index) => mountWordMethods(panel,index,wordMethodView)));
  const refreshAshlag = connectDisclosure('ashlag-workbench', ashlagLabels, () =>
    import('./ashlag-workbench.js').then(({mountAshlagWorkbench}) =>
      (panel, current, index) => mountAshlagWorkbench(panel,index,ashlagView)));
  const refreshSave = connectDisclosure('save-transfer', saveLabels, () =>
    import('./portable-save.js').then(module => module.mountPortableSave));
  const refreshTransfer = connectDisclosure('transfer', transferLabels, async chapter => {
    const [{mountTransfer},{transferLessons}] = await Promise.all([
      import('./transfer.js'), transferDecks[Math.floor((chapter - 1) / 8)](),
    ]);
    const lesson = transferLessons.find(item => item.chapter === chapter);
    return (panel, current) => mountTransfer(panel, current, lesson, {read,store});
  }, () => episodes[active].id);

  function offerTransfer(completed) {
    const chapter = episodes[active].id;
    transfer.hidden = !completed || !transferDecks[Math.floor((chapter - 1) / 8)];
    refreshTransfer();
  }

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
    offerTransfer(true);
    renderTour();
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
    find('settings-button').textContent = settingsLabels[language].title;
    find('download').textContent = transferLabels[language][3];
    const visit = find('visit-button');
    visit.textContent = visitLabels[language][0];
    visit.hidden = active !== 0 && active !== episodes.length - 1;
    const diaspora = find('diaspora-button');
    diaspora.textContent = diasporaLabels[language][0];
    diaspora.hidden = ![17,20,22,24].includes(episode.id);
    renderTour();
    find('inspect').textContent = labels[1];
    controls.querySelector('[data-move="-1"]').setAttribute('aria-label', labels[6]);
    controls.querySelector('[data-move="1"]').setAttribute('aria-label', labels[7]);
    find('source').textContent = labels[2];
    find('era').textContent = episode.era[index];
    find('chapter').textContent = active === 0 ? labels[9] : String(episode.id);
    find('title').textContent = text[0];
    find('intro').textContent = text[1];
    const restoreNotice = find('restore-notice');
    restoreNotice.hidden = !restored;
    if (restored) restoreNotice.textContent = settingsLabels[language].restored;
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
    offerTransfer(completed);
    renderModel();
    renderStudy();
    renderSequence();
    timeline.hidden = episode.id !== 20;
    if (!timeline.hidden) refreshTimeline();
    talmud.hidden = episode.id !== 11;
    if (!talmud.hidden) refreshTalmud();
    geniza.hidden = episode.id !== 15;
    if (!geniza.hidden) refreshGeniza();
    circle.hidden = episode.id !== 24;
    if (!circle.hidden) refreshCircle();
    ashlag.hidden = episode.id !== 24;
    if (!ashlag.hidden) refreshAshlag();
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
    timeline.open = false;
    talmud.open = false;
    transfer.open = false;
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
      refreshWordMethods();
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
    surface.hidden = !model;
    if (!model) {
      world.scene(id, selectedLayer);
      return;
    }
    const index = locale();
    const controls = surface.querySelector('div');
    const output = surface.querySelector('output');
    const reference = find('model-reference');
    surface.querySelector('p').textContent = model.name[index];
    const photoButton = find('photo-button');
    photoButton.hidden = id !== 0 && id !== 23;
    photoButton.textContent = photo.title[index];

    function updateModel() {
      const activeOption = model.options.find(option => option[0] === selectedLayer);
      output.textContent = activeOption?.[2][index] ?? '';
      reference.hidden = !activeOption?.[3];
      if (activeOption?.[3]) reference.href = activeOption[3];
      for (const button of controls.children) button.setAttribute('aria-pressed', String(button.dataset.layer === selectedLayer));
      world.scene(id, selectedLayer);
    }

    reference.textContent = ui[language][5];
    controls.replaceChildren(...model.options.map(([key, titles]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.layer = key;
      button.textContent = titles[index];
      button.addEventListener('click', () => {
        selectedLayer = key;
        updateModel();
      });
      return button;
    }));
    updateModel();
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

  async function renderTour() {
    journal.hidden = active !== episodes.length - 1 || !progress.completed.has(episodeId(active));
    if (journal.hidden || tourLanguage === language) return;
    const current = language;
    const labels = tourLoadLabels[current];
    const status = find('tour-load');
    const builder = find('tour-builder');
    tourLanguage = current;
    find('tour-title').textContent = labels[0];
    builder.hidden = true;
    status.hidden = false;
    status.textContent = labels[1];
    try {
      const { mountTour } = await import('./tour.js');
      if (tourLanguage !== current) return;
      mountTour(journal, find('tour-presentation'), current, languages.indexOf(current), {read,store});
      status.hidden = true;
      builder.hidden = false;
    } catch {
      if (tourLanguage !== current) return;
      tourLanguage = undefined;
      status.textContent = labels[2];
    }
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
    studyRoom.querySelector('h2').textContent = libraryLabels[language][0];
    for (const refresh of workshops) refresh();
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
    const readingGroup = find('library-readings');
    readingGroup.setAttribute('aria-label', libraryLabels[language][1]);
    readingGroup.replaceChildren(...readings.map(item => {
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
  find('settings-button').addEventListener('click', () => {
    stop();
    find('settings-title').textContent = settingsLabels[language].title;
    settings.querySelector('form button').textContent = ui[language][4];
    appearance.render(language);
    refreshSave();
    settings.showModal();
  });
  function openWorkshop(id) {
    openLibrary();
    const workshop = find(id);
    workshop.open = true;
    workshop.querySelector('summary').focus();
  }
  find('visit-button').addEventListener('click', () => openWorkshop('visit'));
  find('diaspora-button').addEventListener('click', () => openWorkshop('diaspora-archive'));
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
