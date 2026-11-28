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
  for(const lesson of [plaza,...chapters.slice(0,9)]) {
    await click(`#choices [data-choice="${lesson.correct}"]`);
    await click('#next');
  }

  assert.equal(await value('#chapter','textContent'),'10');
  assert.equal(await evaluate('document.documentElement.dir'),'rtl');
  const saved=await evaluate('localStorage.getItem("wall.progress.v1")');
  await evaluate(`document.documentElement.style.fontSize='200%'`);
  await click('#bar-kosiba-letter > summary');
  const canvas='#bar-kosiba-letter canvas';
  await until('The sprite did not decode',()=>visible(canvas));
  const frame=()=>evaluate(`${select(canvas)}.toDataURL()`);
  const blank=await frame();
  const first='#bar-kosiba-letter fieldset:first-of-type button:first-child';
  const second='#bar-kosiba-letter .letter-requests fieldset:nth-child(2) button:last-child';
  await evaluate(`${select(first)}.focus()`);
  adb('shell','input','gamepad','keyevent','KEYCODE_BUTTON_A');
  await until('Gamepad did not select the palm and citron basket',
    ()=>evaluate(`${select(first)}.getAttribute('aria-pressed')==='true'`));
  assert.equal(await evaluate(`${select(first)}===document.activeElement`),true);
  const partly=await frame();
  assert.notEqual(partly,blank);
  await click(second);
  assert.notEqual(await frame(),partly);
  const check='#bar-kosiba-letter > div > fieldset';
  await click(check+' button:first-child');
  assert.match(await value(check+' [role=status]','textContent'),/האיגרת מתעדת בקשה/);
  assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth'),false);
  adb('shell','cmd','window','user-rotation','lock','1');
  await until('Landscape viewport unavailable',()=>evaluate('innerWidth>innerHeight'));
  assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth'),false);
  assert.equal(await value(second,'textContent'),'הדסים וערבות');
  assert.equal(await evaluate('localStorage.getItem("wall.progress.v1")'),saved);
  console.log('Published APK reached Hebrew chapter 10. An Android gamepad key selected the first basket, both sprite states changed, correct feedback appeared, and rotation preserved the save.');
} finally {
  webview.close();
  adb('uninstall',pkg);
}
