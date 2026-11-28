import { controllerHelp, mountController } from './controller.js';
import { connectAppearance } from './appearance.js';
import { chapters, languages, plaza, ui } from './content.js';
import { accountabilityLabels, ashlagLabels, atlasLabels, bakuLabels, calendarLabels, cultureLabels, dailyLabels, diasporaLabels, genizaLabels, kabbalahLabels, languageStudyLabels, library, libraryLabels, studyCircleLabels, visitLabels, wordMethodLabels } from './library.js';
import { alphabetNotes, lights, models, photo, studyNames, worldNote, worlds } from './scenes.js';
import { belongsTo, catalogue, catalogueLabels } from './catalogue.js';
import { sequenceLabels, sequences } from './sequences.js';
import { completionKey, encodeCampaign, isCampaignKey, progressKey, readCampaign } from './save-data.js';
import { makeWorld } from './world.js';

const episodes = [plaza, ...chapters];
const find = id => document.getElementById(id);
const chapterWorkshopLinks = {
  1:{workshop:'calendar', period:'1', event:'pesach',
    labels:['Takvimde Pesah','Passover in the calendar','פסח בלוח','Təqvimdə Pesah']},
  5:{workshop:'calendar', period:'9', event:'chanukah',
    labels:['Takvimde Hanuka','Hanukkah in the calendar','חנוכה בלוח','Təqvimdə Hanuka']},
  11:{workshop:'language-study', card:'lang-talmud-gemara', example:'language-ex-genres',
    labels:['Talmud’un dilini incele','Explore the Talmud’s languages','חקרו את שפות התלמוד','Talmudun dillərini araşdır']},
  12:{workshop:'calendar', period:'2', event:'lag-baomer',
    labels:['Takvimde Lag BaOmer','Lag BaOmer in the calendar','ל״ג בעומר בלוח','Təqvimdə Laq BaOmer']},
  16:{workshop:'kabbalah', lesson:'zohar-rose-commentaries',
    labels:['Zohar yorumlarını karşılaştır','Compare readings of the Zohar','השוו פירושים לזוהר','Zoharın şərhlərini müqayisə et']},
  17:{workshop:'atlas', category:'communities', record:'ottoman-sephardi',
    labels:['Sefarad cemaatlerini haritada gör','See Sephardi communities on the map','ראו קהילות ספרדיות במפה','Sefarad icmalarına xəritədə bax']},
  18:{workshop:'kabbalah', lesson:'tzimtzum-partzufim-abya',
    labels:['ABiYA dünyalarını incele','Explore the four worlds','חקרו את ארבעת העולמות','ABiYA aləmlərini araşdır']},
  20:{workshop:'calendar', period:'0', event:'shabbat',
    labels:['Bir Şabat, dört cemaat','One Shabbat, four communities','שבת אחת, ארבע קהילות','Bir Şabbat, dörd icma']},
};
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
const mandateLabels = {
  tr:['1936–1939 · Grev, taksim ve göç','Belgeler yükleniyor…','Belgeler açılamadı. Kapatıp yeniden aç.'],
  en:['1936–1939 · Strike, partition and immigration','Loading the documents…','The documents could not open. Close and reopen the panel.'],
  he:['1936–1939 · שביתה, חלוקה ועלייה','המסמכים נטענים…','המסמכים לא נפתחו. סגרו את החלונית ופתחו שוב.'],
  az:['1936–1939 · Tətil, bölgü və miqrasiya','Sənədlər yüklənir…','Sənədlər açılmadı. Bölməni bağlayıb yenidən aç.'],
};
const pressLabels = {
  tr:['Aydınlanma, Siyonizm ve Bund','Belgeler yükleniyor…','Belgeler açılamadı. Kapatıp yeniden aç.'],
  en:['Enlightenment, Zionism and the Bund','Loading the documents…','The documents could not open. Close and reopen the panel.'],
  he:['השכלה, ציונות והבונד','המסמכים נטענים…','המסמכים לא נפתחו. סגרו את החלונית ופתחו שוב.'],
  az:['Maarifçilik, sionizm və Bund','Sənədlər yüklənir…','Sənədlər açılmadı. Bölməni bağlayıb yenidən aç.'],
};
const displacementLabels = {
  tr:['Holokost ve yerinden edilme arşivi','Arşiv yükleniyor…','Arşiv açılamadı. Kapatıp yeniden aç.'],
  en:['Holocaust and displacement archive','Loading the archive…','The archive could not open. Close and reopen the panel.'],
  he:['ארכיון השואה והעקירה','הארכיון נטען…','הארכיון לא נפתח. סגרו את החלונית ופתחו שוב.'],
  az:['Holokost və didərginlik arxivi','Arxiv yüklənir…','Arxiv açılmadı. Bölməni bağlayıb yenidən aç.'],
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
const platformLabels = {
  tr:['Mimari kesiti kur','Parçalar hazırlanıyor…','Parçalar açılamadı. Kapatıp yeniden aç.'],
  en:['Assemble the cross-section','Loading the pieces…','The pieces could not be loaded. Close and reopen to try again.'],
  he:['הרכבת החתך','החלקים נטענים…','טעינת החלקים נכשלה. סגרו ופתחו מחדש.'],
  az:['Memarlıq kəsiyini qur','Hissələr yüklənir…','Hissələr açılmadı. Bağla və yenidən aç.'],
};
const kingdomMapLabels = {
  tr:['İki krallığı haritada bul','Harita açılıyor…','Harita açılamadı. Kapatıp yeniden aç.'],
  en:['Find the two kingdoms on the map','Opening the map…','The map could not open. Close and reopen it.'],
  he:['מצאו את שתי הממלכות במפה','המפה נטענת…','המפה לא נפתחה. סגרו אותה ופתחו שוב.'],
  az:['İki krallığı xəritədə tap','Xəritə açılır…','Xəritə açılmadı. Bağla və yenidən aç.'],
};
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
const arrivalCopy = {
  tr:['Yeni oyun','Ağlama Duvarı’nın tarihini keşfet. Bugünkü meydandan bakıp eski bir fotoğrafı incele.', chapter => `Son açtığın bölüm “${chapter}”.`],
  en:['New game','Explore the history of the Western Wall. Begin in today’s plaza and examine a historic photograph.', chapter => `You last visited “${chapter}”.`],
  he:['משחק חדש','גלו את תולדות הכותל המערבי. התחילו ברחבה של היום ובחנו תצלום היסטורי.', chapter => `ביקרתם לאחרונה בפרק ״${chapter}״.`],
  az:['Yeni oyun','Qərb divarının tarixini araşdır. Bugünkü meydandan başla və tarixi fotoşəkli nəzərdən keçir.', chapter => `Son açdığın bölmə “${chapter}” idi.`],
};
const storageCopy = {
  tr:[
    'Bazı değişiklikler kaydedilemedi. Çıkmadan önce Ayarlar’dan kayıt metnini kopyalayabilirsin.',
    'Değişiklikler yalnızca bu oturumda duruyor. Tekrar kaydetmeyi dene veya kayıt metnini kopyala.',
    'Tekrar kaydet', 'Oturumdaki değişiklikler kaydedildi.',
  ],
  en:[
    'Some changes could not be saved. Before closing, you can copy your save text in Settings.',
    'Your changes are only in this session. Try saving again or copy your save text.',
    'Try saving again', 'Your session changes were saved.',
  ],
  he:[
    'חלק מהשינויים לא נשמרו. לפני הסגירה אפשר להעתיק את טקסט השמירה בהגדרות.',
    'השינויים זמינים רק בהפעלה הנוכחית. נסו לשמור שוב או העתיקו את טקסט השמירה.',
    'נסו לשמור שוב', 'השינויים מההפעלה הנוכחית נשמרו.',
  ],
  az:[
    'Bəzi dəyişikliklər saxlanmadı. Bağlamazdan əvvəl Ayarlardan yaddaş mətnini köçürə bilərsən.',
    'Dəyişikliklər yalnız bu sessiyadadır. Yenidən saxlamağa çalış və ya yaddaş mətnini köçür.',
    'Yenidən saxla', 'Sessiyadakı dəyişikliklər saxlandı.',
  ],
};
const lessonDecks = [
  () => import('./ancient-lessons.js').then(module => module.ancientLessons),
  () => import('./second-temple-lessons.js').then(module => module.secondTempleLessons),
  () => import('./roman-lessons.js').then(module => module.romanLessons),
  () => import('./medieval-lessons.js').then(module => module.medievalLessons),
  () => import('./early-modern-lessons.js').then(module => module.earlyModernLessons),
  () => import('./modern-lessons.js').then(module => module.modernLessons),
];

function readStored(keyName) {
  try { return localStorage.getItem(keyName); } catch { return null; }
}

export async function start(initialLanguage) {
  let language = initialLanguage;
  const pending = new Map();
  const storageNotice = find('storage-notice');
  const libraryStorage = find('library-storage');
  const settingsStorage = find('settings-storage');
  const retryStorage = find('retry-storage');
  const read = keyName => pending.get(keyName) ?? readStored(keyName);

  function showStorageStatus(recovered = false) {
    const [warning, settingsWarning, retryTitle, saved] = storageCopy[language];
    const mainText = pending.size ? warning : '';
    const modalText = pending.size ? settingsWarning : recovered ? saved : '';
    for (const notice of [storageNotice,libraryStorage]) {
      if (notice.textContent !== mainText) notice.textContent = mainText;
    }
    if (settingsStorage.textContent !== modalText) settingsStorage.textContent = modalText;
    retryStorage.textContent = retryTitle;
    retryStorage.hidden = pending.size === 0;
  }

  function store(keyName, value) {
    const hadPending = pending.size > 0;
    try {
      localStorage.setItem(keyName,value);
      pending.delete(keyName);
    } catch {
      pending.set(keyName,value);
    }
    if (hadPending !== (pending.size > 0)) showStorageStatus();
  }

  function retryPending() {
    for (const [keyName,value] of [...pending]) {
      if (keyName === progressKey) {
        synchronizeProgress();
        save();
      } else {
        store(keyName,value);
      }
    }
    showStorageStatus(pending.size === 0);
    return pending.size === 0;
  }

  retryStorage.addEventListener('click', () => {
    if (retryPending()) find('settings-close').focus();
  });
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
  const photoButton = find('photo-button');
  const comparison = find('compare-view');
  const compareObservation = find('compare-observation');
  const journal = find('journal');
  const selector = find('lang');
  const cataloguePanel = find('catalogue');
  const sequenceSurface = find('sequence');
  const evidence = find('evidence');
  const timeline = find('messianic-timeline');
  const mandate = find('mandate-timeline');
  const press = find('press-timeline');
  const displacement = find('displacement');
  const kingdomMap = find('kingdom-map');
  const platform = find('platform-assembly');
  const talmud = find('talmud-page');
  const geniza = find('geniza-desk');
  const circle = find('study-circle');
  const ashlag = find('ashlag-workbench');
  const baku = find('baku-archive');
  const transfer = find('transfer');
  const evidenceChoices = find('evidence-choices');
  const labRoot = find('language-labs');
  const labs = labRoot.querySelectorAll('details');
  const labState = {word:[], sefirah:0, daat:false};
  const kabbalahView = {lesson:null,sourcesOpen:false,exerciseOpen:false,solved:new Set(),commentariesOpen:new Set(),route:0};
  const atlasView = {category:'all',search:'',record:null};
  const languageView = {marked:true};
  let activeAtlasView = atlasView;
  let activeLanguageView = languageView;
  const calendarView = {period:'7',year:'common',custom:'israel',event:null,route:0,
    shabbat:{open:false,cards:new Set(),answer:null}};
  const cultureView = {record:null};
  const accountabilityView = {record:null};
  const genizaView = {};
  const messianicView = {};
  const mandateView = {};
  const pressView = {};
  const displacementView = {};
  const kingdomAnswers = {};
  const circleView = {};
  const wordMethodView = {};
  const ashlagView = {};
  const bakuView = {};
  const platformView = {};
  const talmudView = {reading:null,side:0,position:0,answers:[['','',''],['','','']]};
  const initialProgress = readCampaign(readStored,pending);
  const {completed} = initialProgress;
  const arrival = find('arrival');
  const campaign = find('campaign');
  const startCampaign = find('start-campaign');
  const returnPlaza = find('return-plaza');
  const campaignLinks = ['game-mark','episodes-button','library-button'].map(find);
  let active = 0;
  let movement = null;
  let direction = 0;
  let lastPlacement = world.placement();
  let selectedLayer = '';
  const photoAnswers = {wall:null,passage:null};
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
  const firstIncomplete = () => episodes.findIndex((_, index) => !completed.has(episodeId(index)));
  const unlocked = index => index >= 0 && (index === 0 || index === firstIncomplete() || completed.has(episodeId(index)));
  const locale = () => languages.indexOf(language);

  function placementUnchanged(placement) {
    return placement[0] === lastPlacement[0] && placement[1] === lastPlacement[1];
  }

  function save(placement = world.placement()) {
    store(progressKey,encodeCampaign(episodeId(active),completed,placement));
    lastPlacement = placement;
  }

  function saveMovement() {
    const placement = world.placement();
    if (placementUnchanged(placement)) return;
    synchronizeProgress();
    save(placement);
  }

  function synchronizeProgress() {
    const latest = readCampaign(readStored,pending);
    for (const id of latest.completed) completed.add(id);
    return latest;
  }

  function restoreSharedPlacement(latest, index) {
    if (latest.active !== episodeId(index) || !latest.placement || placementUnchanged(latest.placement)) return false;
    world.restorePlacement(latest.placement);
    return true;
  }

  function resumeIndex(last = synchronizeProgress().active) {
    const index = episodes.findIndex((_, index) => episodeId(index) === last);
    return unlocked(index) ? index : -1;
  }

  function upcomingIndex() {
    const incomplete = firstIncomplete();
    const following = active + 1;
    if (episodes[following] && (following === incomplete || completed.has(episodeId(following)))) return following;
    return Math.max(0,incomplete);
  }
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
    ['calendar', calendarLabels, () => import('./calendar.js').then(({mountCalendar}) =>
      (panel, current, index) => mountCalendar(panel,current,index,calendarView)), () => calendarView.route],
    ['atlas', atlasLabels, () => import('./atlas.js').then(({mountAtlas}) =>
      (panel, current, index) => mountAtlas(panel, current, index, activeAtlasView)), () => activeAtlasView],
    ['kabbalah', kabbalahLabels, () => import('./kabbalah.js').then(({mountKabbalah}) =>
      (panel, current, index) => mountKabbalah(panel, current, index, {read,store}, kabbalahView)), () => kabbalahView.route],
    ['visit', visitLabels, () => import('./kotel.js').then(module => module.mountKotel)],
    ['language-study', languageStudyLabels, () => import('./language-study.js').then(({mountLanguageStudy}) =>
      (panel,current,index) => mountLanguageStudy(panel,current,index,activeLanguageView)), () => activeLanguageView],
    ['diaspora-archive', diasporaLabels, () => import('./diaspora-archive.js').then(module => module.mountDiasporaArchive)],
    ['daily-life', dailyLabels, () => import('./daily-life.js').then(module => module.mountDailyLife)],
    ['culture-archive', cultureLabels, () => import('./culture-archive.js').then(({mountCultureArchive}) =>
      (panel, current, index) => mountCultureArchive(panel, current, index, cultureView))],
    ['accountability-archive', accountabilityLabels, () => import('./accountability-archive.js').then(({mountAccountabilityArchive}) =>
      (panel, current, index) => mountAccountabilityArchive(panel, current, index, accountabilityView))],
  ].map(([id, labels, load, scope]) => connectDisclosure(id, labels, load, scope));
  const refreshTimeline = connectDisclosure('messianic-timeline', timelineLabels, async () => {
    const [{mountSourceTimeline},{messianicLessons}] = await Promise.all([
      import('./source-timeline.js'),import('./messianic-lessons.js'),
    ]);
    return (panel, current, index) => mountSourceTimeline(panel,current,index,messianicLessons,messianicView);
  });
  const refreshPress = connectDisclosure('press-timeline', pressLabels, async () => {
    const [{mountSourceTimeline},{pressLessons}] = await Promise.all([
      import('./source-timeline.js'),import('./press-lessons.js'),
    ]);
    return (panel, current, index) => mountSourceTimeline(panel,current,index,pressLessons,pressView);
  });
  const refreshMandate = connectDisclosure('mandate-timeline', mandateLabels, async () => {
    const [{mountSourceTimeline},{mandateLessons}] = await Promise.all([
      import('./source-timeline.js'),import('./mandate-lessons.js'),
    ]);
    return (panel, current, index) => mountSourceTimeline(panel,current,index,mandateLessons,mandateView);
  });
  const refreshDisplacement = connectDisclosure('displacement', displacementLabels, () =>
    import('./displacement.js').then(({mountDisplacement}) =>
      (panel, current, index) => mountDisplacement(panel,index,displacementView)));
  const refreshPlatform = connectDisclosure('platform-assembly', platformLabels, () =>
    import('./platform-assembly.js').then(({mountPlatformAssembly}) =>
      (panel, current) => mountPlatformAssembly(panel,current,platformView)));
  const refreshKingdomMap = connectDisclosure('kingdom-map', kingdomMapLabels, () =>
    import('./kingdom-map-lessons.js').then(({mountKingdomMap}) =>
      (panel, current, index) => mountKingdomMap(panel,index,kingdomAnswers)));
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
  const refreshBaku = connectDisclosure('baku-archive', bakuLabels, () =>
    import('./baku-archive.js').then(({mountBakuArchive}) =>
      (panel, current, index) => mountBakuArchive(panel,index,bakuView)));
  const refreshSave = connectDisclosure('save-transfer', saveLabels, () =>
    import('./portable-save.js').then(({mountPortableSave}) =>
      (panel, current) => mountPortableSave(panel, current, pending, retryPending)));
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
    const latest = synchronizeProgress();
    if (placementUnchanged(world.placement()) && restoreSharedPlacement(latest,active)) world.idle();
    const id = episodeId(active);
    if (!completed.has(id)) {
      completed.add(id);
      store(completionKey(id),'1');
    }
    result.textContent = text[5];
    next.hidden = false;
    next.textContent = ui[language][upcomingIndex() === 0 ? 13 : 3];
    offerTransfer(true);
    if (active === 0) photoButton.classList.remove('primary');
    renderTour();
    save();
  }

  function renderLanguage() {
    const labels = ui[language];
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    showStorageStatus();
    selector.value = language;
    selector.setAttribute('aria-label', labels[8]);
    find('episodes-button').textContent = labels[0];
    find('library-button').textContent = libraryLabels[language][0];
    find('settings-button').textContent = settingsLabels[language].title;
    find('download').textContent = transferLabels[language][3];
  }

  function renderArrival(last) {
    const savedIndex = resumeIndex(last);
    const [startLabel, intro, resume] = arrivalCopy[language];
    startCampaign.textContent = savedIndex >= 0 ? ui[language][3] : startLabel;
    if (savedIndex > 0) returnPlaza.textContent = ui[language][13];
    else if (document.activeElement === returnPlaza) startCampaign.focus();
    returnPlaza.hidden = savedIndex <= 0;
    find('arrival-description').textContent = savedIndex >= 0
      ? resume(episodes[savedIndex].text[locale()][0])
      : intro;
  }

  function render(focus = false) {
    const episode = episodes[active];
    const index = locale();
    const text = episode.text[index];
    const labels = ui[language];
    const finished = completed.has(episodeId(active));
    renderLanguage();
    const visit = find('visit-button');
    visit.textContent = visitLabels[language][0];
    visit.hidden = active !== 0 && active !== episodes.length - 1;
    const diaspora = find('diaspora-button');
    diaspora.textContent = diasporaLabels[language][0];
    diaspora.hidden = ![17,20,22,24].includes(episode.id);
    const chapterStudy = find('chapter-study-button');
    const link = chapterWorkshopLinks[episode.id];
    chapterStudy.textContent = link?.labels[index] ?? '';
    chapterStudy.hidden = !link;
    renderTour();
    find('inspect').textContent = labels[1];
    controls.querySelector('[data-move="-1"]').setAttribute('aria-label', labels[6]);
    controls.querySelector('[data-move="1"]').setAttribute('aria-label', labels[7]);
    find('source').textContent = labels[2];
    find('era').textContent = episode.era[index];
    find('chapter').textContent = active === 0 ? labels[9] : String(episode.id);
    find('title').textContent = text[0];
    find('intro').textContent = text[1];
    photoButton.hidden = active !== 0 && episode.id !== 23;
    photoButton.textContent = (active === 0 ? photo.task : photo.title)[index];
    photoButton.classList.toggle('primary', active === 0 && !finished);
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
      button.addEventListener('click', event => {
        choose(selected);
        if (selected === episode.correct && event.detail > 0) {
          next.scrollIntoView({block:'nearest',inline:'nearest'});
        }
      });
      return button;
    }));
    result.textContent = finished ? text[5] : '';
    next.textContent = labels[upcomingIndex() === 0 ? 13 : 3];
    next.hidden = !finished;
    offerTransfer(finished);
    renderModel();
    renderStudy();
    renderSequence();
    timeline.hidden = episode.id !== 20;
    if (!timeline.hidden) refreshTimeline();
    mandate.hidden = episode.id !== 21;
    if (!mandate.hidden) refreshMandate();
    press.hidden = episode.id !== 22;
    if (!press.hidden) refreshPress();
    displacement.hidden = episode.id !== 22;
    if (!displacement.hidden) refreshDisplacement();
    kingdomMap.hidden = episode.id !== 2;
    if (!kingdomMap.hidden) refreshKingdomMap();
    platform.hidden = episode.id !== 6;
    if (!platform.hidden) refreshPlatform();
    talmud.hidden = episode.id !== 11;
    if (!talmud.hidden) refreshTalmud();
    geniza.hidden = episode.id !== 15;
    if (!geniza.hidden) refreshGeniza();
    circle.hidden = episode.id !== 24;
    if (!circle.hidden) refreshCircle();
    ashlag.hidden = episode.id !== 24;
    if (!ashlag.hidden) refreshAshlag();
    baku.hidden = episode.id !== 24;
    if (!baku.hidden) refreshBaku();
    renderEvidence();
    renderLanguageLabs();
    if (focus) {
      find('title').focus();
      if (active === 0 && !finished) photoButton.scrollIntoView({block:'nearest',inline:'nearest'});
    }
  }

  function go(index, updateHash = true) {
    const latest = synchronizeProgress();
    if (!episodes[index] || !unlocked(index)) return;
    const entering = campaign.hidden;
    const moved = !placementUnchanged(world.placement());
    stop();
    if (!moved) restoreSharedPlacement(latest,index);
    if (entering) {
      arrival.hidden = true;
      campaign.hidden = false;
      for (const link of campaignLinks) link.hidden = false;
      for (const id of completed) {
        const marker = completionKey(id);
        if (read(marker) !== '1') store(marker,'1');
      }
    }
    active = index;
    selectedLayer = '';
    studyOption = null;
    evidenceCard = null;
    evidence.open = false;
    timeline.open = false;
    mandate.open = false;
    press.open = false;
    displacement.open = false;
    kingdomMap.open = false;
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
    render(updateHash || entering);
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

  function drawMarketMeasure() {
    world.scene(7, 'market-measure-' + sequenceSteps.length);
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

    function updateModel() {
      const activeOption = model.options.find(option => option[0] === selectedLayer);
      output.textContent = activeOption?.[2][index] ?? '';
      reference.hidden = !activeOption?.[3];
      if (activeOption?.[3]) reference.href = activeOption[3];
      for (const button of controls.children) button.setAttribute('aria-pressed', String(button.dataset.layer === selectedLayer));
      if (selectedLayer === 'market-measure') drawMarketMeasure();
      else world.scene(id, selectedLayer);
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
        if (sample.id === 7) {
          if (selectedLayer === 'market-measure') drawMarketMeasure();
          else {
            selectedLayer = 'market-measure';
            renderModel();
          }
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
    if (selectedLayer === 'market-measure') drawMarketMeasure();
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
    journal.hidden = active !== episodes.length - 1 || !completed.has(episodeId(active));
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
    if (campaign.hidden) return;
    stop();
    synchronizeProgress();
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

  function openLibrary(route) {
    if (campaign.hidden) return;
    stop();
    synchronizeProgress();
    activeAtlasView = route?.workshop === 'atlas'
      ? {category:route.category,search:'',record:route.record} : atlasView;
    activeLanguageView = route?.workshop === 'language-study'
      ? {card:route.card,example:route.example,marked:languageView.marked,exerciseOpen:true} : languageView;
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
    if (!campaign.hidden) {
      world.idle();
      saveMovement();
    }
  }
  function walk(value) {
    if (campaign.hidden || direction === value) return;
    stop();
    direction = value;
    if (!world.move(value, 2)) {
      saveMovement();
      return;
    }
    let previous = performance.now();
    function animate(now) {
      const elapsed = Math.min(34, Math.max(0, now - previous));
      previous = now;
      movement = world.move(value, elapsed * .063) ? requestAnimationFrame(animate) : null;
      if (movement === null) saveMovement();
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
        stop();
      }
    });
  }
  document.addEventListener('keydown', event => {
    if (campaign.hidden || document.querySelector('dialog[open]') || event.metaKey || event.ctrlKey
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
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

  const photoExercise = () => episodes[active].id === 23 ? 'passage' : 'wall';

  function comparePhoto() {
    const index = locale();
    const view = comparison.valueAsNumber;
    const exercise = photoExercise();
    const mark = photoAnswers[exercise] === 1 ? exercise : null;
    world.comparePlaza(find('compare-canvas'), view, language === 'he', mark);
    comparison.setAttribute('aria-valuetext', photo.views[view][index]);
    find('compare-caption').textContent = photo.captions[view][index];
  }

  const observationChoices = [...compareObservation.querySelectorAll('button')];
  function showPhotoObservation() {
    const index = locale();
    const exercise = photoExercise();
    const content = photo[exercise];
    const answer = photoAnswers[exercise];
    compareObservation.querySelector('legend').textContent = content.question[index];
    observationChoices.forEach((button, position) => {
      button.textContent = content.places[position][index];
      button.setAttribute('aria-pressed', String(answer === position));
    });
    compareObservation.querySelector('[role="status"]').textContent = answer === null ? ''
      : content[answer === 1 ? 'matched' : 'retry'][index];
  }
  observationChoices.forEach((button, position) => button.addEventListener('click', () => {
    photoAnswers[photoExercise()] = position;
    showPhotoObservation();
    comparePhoto();
  }));

  comparison.addEventListener('input', comparePhoto);
  photoButton.addEventListener('click', () => {
    stop();
    const index = locale();
    const modernHistory = episodes[active].id === 23;
    showPhotoObservation();
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
    photoPanel.querySelector('form button').textContent = ui[language][4];
    comparePhoto();
    photoButton.focus({preventScroll:true});
    photoPanel.showModal();
  });
  find('source').addEventListener('click', openSource);
  function inspect() {
    if (campaign.hidden) return;
    stop();
    world.inspect();
    options.querySelector('button').focus();
  }
  find('inspect').addEventListener('click', inspect);
  find('episodes-button').addEventListener('click', openChapters);
  find('library-button').addEventListener('click', () => openLibrary());
  find('settings-button').addEventListener('click', () => {
    stop();
    find('settings-title').textContent = settingsLabels[language].title;
    settings.querySelector('form button').textContent = ui[language][4];
    appearance.render(language);
    refreshSave();
    settings.showModal();
  });
  function openWorkshop(id, route) {
    openLibrary(route);
    const workshop = find(id);
    workshop.open = true;
    workshop.querySelector('summary').focus();
  }
  find('visit-button').addEventListener('click', () => openWorkshop('visit'));
  find('diaspora-button').addEventListener('click', () => openWorkshop('diaspora-archive'));
  find('chapter-study-button').addEventListener('click', event => {
    const link = chapterWorkshopLinks[episodes[active].id];
    if (!link) return;
    if (link.workshop === 'kabbalah') {
      if (kabbalahView.lesson !== link.lesson) {
        kabbalahView.lesson = link.lesson;
        kabbalahView.route++;
      }
    } else if (link.workshop === 'calendar') {
      const revealShabbat = link.event === 'shabbat' && !calendarView.shabbat.open;
      if (calendarView.period !== link.period || calendarView.event !== link.event || revealShabbat) {
        calendarView.period = link.period;
        calendarView.event = link.event;
        if (revealShabbat) calendarView.shabbat.open = true;
        calendarView.route++;
      }
    }
    event.currentTarget.focus({preventScroll:true});
    openWorkshop(link.workshop,link);
  });
  next.addEventListener('click', () => {
    synchronizeProgress();
    go(upcomingIndex());
  });
  selector.addEventListener('change', () => {
    if (!languages.includes(selector.value)) return;
    language = selector.value;
    store('wall.language', language);
    if (campaign.hidden) {
      renderLanguage();
      renderArrival();
    }
    else render();
  });

  function fromHash() {
    const hash = location.hash;
    return hash === '#game' ? 0 : episodes.findIndex((_, index) => '#chapter-' + episodeId(index) === hash);
  }
  window.addEventListener('hashchange', () => go(fromHash(), false));
  let arrivalUpdate = 0;
  window.addEventListener('storage', event => {
    if (!campaign.hidden || !isCampaignKey(event.key) || arrivalUpdate) return;
    arrivalUpdate = requestAnimationFrame(() => {
      arrivalUpdate = 0;
      if (campaign.hidden) renderArrival();
    });
  });
  const requested = fromHash();
  startCampaign.addEventListener('click', () => go(Math.max(0,resumeIndex())));
  returnPlaza.addEventListener('click', () => go(0));
  if (unlocked(requested)) {
    go(requested, false);
  } else if (restored) {
    go(Math.max(0,resumeIndex(initialProgress.active)));
  } else {
    renderLanguage();
    renderArrival(initialProgress.active);
    arrival.hidden = false;
  }
  mountController({
    walk, stop, inspect, timeline:openChapters, library:openLibrary,
    showHint() {
      find('controller-hint').hidden = false;
      if (!arrival.hidden && document.activeElement === find('arrival-title')) startCampaign.focus();
    },
  });
  return arrival.hidden ? null : startCampaign;
}
