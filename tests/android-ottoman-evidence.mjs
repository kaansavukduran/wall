import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { pkg, adb, until, attach } from './android-preview-harness.mjs';
import { plaza, chapters } from '../content.js';

const files = readdirSync('.').filter(file => file.endsWith('.apk'));
assert.equal(files.length,1);
adb('install',files[0]);
adb('shell','am','start','-W','-n',pkg+'/.WallActivity');
const webview=await attach();
const {evaluate}=webview;
const visible=selector=>evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)})?.getClientRects().length)`);
const select=selector=>`document.querySelector(${JSON.stringify(selector)})`;
const value=(selector,property)=>evaluate(`${select(selector)}?.${property}`);
const click=async selector=>{
  await until('Control not visible: '+selector,()=>visible(selector));
  await evaluate(`${select(selector)}.click()`);
};

try {
  await until('Game could not open',()=>visible('#app'));
  assert.equal(await value('footer > span:last-child','textContent'),process.env.WALL_TAG);
  await evaluate(`(() => {
    const language=document.querySelector('#lang');
    language.value='he';
    language.dispatchEvent(new Event('change',{bubbles:true}));
  })()`);
  await click('#start-campaign');
  for(const lesson of [plaza,...chapters.slice(0,18)]) {
    await click(`#choices [data-choice="${lesson.correct}"]`);
    await click('#next');
  }

  assert.equal(await value('#chapter','textContent'),'19');
  assert.equal(await evaluate('document.documentElement.dir'),'rtl');
  const saved=await evaluate('localStorage.getItem("wall.progress.v1")');
  await evaluate(`document.documentElement.style.fontSize='200%'`);
  const passage='[data-layer="paving-request"]';
  await evaluate(`${select(passage)}.focus()`);
  adb('shell','input','gamepad','keyevent','KEYCODE_BUTTON_A');
  await until('Gamepad did not select the passage',()=>evaluate(`${select(passage)}.getAttribute('aria-pressed')==='true'`));
  assert.match(await value('#model-reference','href'),/#page=30$/);
  assert.match(await value('#models output','textContent'),/1840/);
  assert.equal(await evaluate(`${select(passage)}===document.activeElement`),true);
  await click('#evidence > summary');
  await click('[data-evidence="3"]');
  await until('Archive photo did not decode',async()=>await value('#evidence-photo img','naturalWidth')===640);
  assert.equal(await value('#evidence-photo img','naturalHeight'),509);
  assert.match(await value('#evidence-photo img','alt'),/שתי נשים/);
  assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth'),false);
  adb('shell','cmd','window','user-rotation','lock','1');
  await until('Landscape viewport unavailable',()=>evaluate('innerWidth>innerHeight'));
  assert.equal(await value('#evidence-photo img','naturalWidth'),640);
  assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth'),false);
  assert.equal(await evaluate('localStorage.getItem("wall.progress.v1")'),saved);
  console.log('Published APK reached chapter 19 in Hebrew. The gamepad opened the 1840 passage, the 640×509 photograph loaded in portrait and landscape at 200% text, and the campaign save was unchanged.');
} finally {
  webview.close();
  adb('uninstall',pkg);
}
