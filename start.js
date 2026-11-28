const phrases = {
  tr: ['Yükleniyor…', 'Oyun yüklenemedi.', 'Yeniden dene'],
  en: ['Loading…', 'The game could not load.', 'Try again'],
  he: ['בטעינה…', 'טעינת המשחק נכשלה.', 'ניסיון נוסף'],
  az: ['Yüklənir…', 'Oyun yüklənmədi.', 'Yenidən cəhd et'],
};
const storedLanguage = (() => { try { return localStorage.getItem('wall.language'); } catch { return null; } })();
const candidates = [storedLanguage, ...navigator.languages].filter(Boolean).map(value => value.split('-')[0]);
const language = candidates.find(value => Object.hasOwn(phrases, value)) ?? 'tr';
document.documentElement.lang = language;
document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
const status = document.querySelector('#boot-status');
const retry = document.querySelector('#retry');
status.textContent = phrases[language][0];
retry.textContent = phrases[language][2];
let failed = false;
let initialControl;
retry.addEventListener('click', () => location.reload());
try {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const { start } = await import('./game.js');
  initialControl = await start(language);
} catch (error) {
  failed = true;
  console.error(error);
}
if (failed) {
  document.querySelector('#boot').dataset.failed = '';
  status.textContent = phrases[language][1];
  retry.hidden = false;
  retry.focus();
} else {
  document.querySelector('#app').hidden = false;
  document.querySelector('#boot').hidden = true;
  if (initialControl) {
    const fits = initialControl.getBoundingClientRect().bottom <= window.innerHeight;
    (fits ? initialControl : document.getElementById('arrival-title')).focus();
  }
}
