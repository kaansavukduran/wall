import { ashlagCopy, ashlagPhases, ashlagScreen } from './ashlag-lessons.js';

function drawDiagram(canvas, phase, screen) {
  const context = canvas.getContext('2d');
  if (!context) return;
  function block(color,x,y,width,height) {
    context.fillStyle = color;
    context.fillRect(x,y,width,height);
  }

  block('#3c343b',0,0,160,80);
  block('#755452',4,4,152,72);
  block('#c9a77e',7,7,146,66);
  block('#f1ce7d',28,19,11,10);
  block('#bd8748',25,22,17,4);
  block('#704f49',107,27,42,31);
  block('#dfbd8c',111,29,34,26);
  if (phase === 0) return;

  const stop = screen > 0 ? 90 : 105;
  block('#82602f',40,30,stop-40,3);
  block('#82602f',stop-6,27,4,9);
  block('#82602f',stop-2,29,3,5);

  if (phase === 1) block('#d18b48',114,33,28,19);
  if (phase === 2 || phase === 3) block('#4b7d7a',114,36,28,16);
  if (phase === 3) block('#d18b48',134,36,8,7);

  if (screen > 0) {
    block('#6b4d58',94,19,7,37);
    for (let y=21; y<53; y+=6) block('#a98992',96,y,3,2);
  }
  if (screen > 1) {
    block('#38676d',44,44,50,3);
    block('#38676d',45,41,4,9);
    block('#38676d',42,43,3,5);
  }
  if (screen > 2) {
    for (const x of [114,124]) block('#4b7d7a',x,44,8,8);
    block('#ad896c',134,44,8,8);
  }
}

export function mountAshlagWorkbench(panel, locale, view) {
  const fragment = document.getElementById('ashlag-template').content.cloneNode(true);
  const [intro, controls, figure, phaseSource, screenSection, comparison] = fragment.children;
  const [canvas, caption] = figure.children;
  const [stage, action, stageSource] = screenSection.children;
  const [compareSummary, vitalText, vitalSource, worldsTitle, worldsText, worldsSource] = comparison.children;
  const [overview, phaseLabel, sourceLabel, stepSource, compareLabel, compareText, vitalLabel,
    abyaTitle, abyaText, abyaSource] = ashlagCopy.map(line => line[locale]);
  view.phase ??= 0;
  view.screen ??= 0;

  intro.textContent = overview;
  controls.setAttribute('aria-label',phaseLabel);
  phaseSource.textContent = sourceLabel;
  stageSource.textContent = stepSource;
  compareSummary.textContent = compareLabel;
  vitalText.textContent = compareText;
  vitalSource.textContent = vitalLabel;
  worldsTitle.textContent = abyaTitle;
  worldsText.textContent = abyaText;
  worldsSource.textContent = abyaSource;

  function showModel() {
    const phase = ashlagPhases[view.phase];
    const showScreen = phase.id === 'dalet';
    caption.textContent = phase.text[locale];
    phaseSource.href = phase.link;
    screenSection.hidden = !showScreen;
    if (showScreen) {
      const step = ashlagScreen[view.screen];
      stage.textContent = step.text[locale];
      action.textContent = step.action[locale];
      stageSource.href = step.link;
    }
    for (const [index, button] of [...controls.children].entries()) {
      button.setAttribute('aria-pressed',String(index === view.phase));
    }
    drawDiagram(canvas,view.phase,showScreen ? view.screen : 0);
  }

  for (const [index, phase] of ashlagPhases.entries()) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.ashlagPhase = phase.id;
    button.textContent = phase.title[locale];
    button.addEventListener('click', () => {
      view.phase = index;
      showModel();
    });
    controls.append(button);
  }
  action.addEventListener('click', () => {
    view.screen = (view.screen + 1) % ashlagScreen.length;
    showModel();
  });

  showModel();
  panel.replaceChildren(fragment);
}
