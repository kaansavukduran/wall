import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { pkg, adb, until, attach } from './android-preview-harness.mjs';
import { plaza, chapters } from '../content.js';
import { transferLessons } from '../transfer-early-lessons.js';

const draft = 'בדיקת העברה · WALL';
const baseline = apk('baseline');
const candidate = apk('candidate');
function apk(folder) {
  const files=readdirSync(folder).filter(file=>file.endsWith('.apk'));
  assert.equal(files.length,1);
  return `${folder}/${files[0]}`;
}

function screen(evaluate) {
  const text=selector=>evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent`);
  const visible=selector=>evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)})?.getClientRects().length)`);
  const click=async selector=>{
    await until(`Control unavailable: ${selector}`,()=>visible(selector));
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  };
  async function fill(selector,value,event) {
    await until(`Field unavailable: ${selector}`,()=>visible(selector));
    await evaluate(`(() => {
      const field=document.querySelector(${JSON.stringify(selector)});
      field.focus();
      field.value=${JSON.stringify(value)};
      field.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));
    })()`);
  }
  const foot=()=>evaluate(`(() => {
    const canvas=document.querySelector('#world');
    return Array.from(canvas.getContext('2d').getImageData(0,209,canvas.width,1).data);
  })()`);
  return {text,visible,click,fill,foot};
}

async function open(version) {
  adb('shell','am','start','-W','-n',`${pkg}/.WallActivity`);
  const browser=await attach();
  const ui=screen(browser.evaluate);
  await until('The published application did not become ready',()=>ui.visible('#app'));
  assert.equal(await ui.text('footer > span:last-child'),version);
  return {...browser,...ui};
}

async function settings(ui) {
  await ui.click('#settings-button');
  await ui.click('#save-transfer > summary');
  await until('Save transfer did not load',()=>ui.visible('#save-export'));
}

async function exportOldSave() {
  adb('install',baseline);
  const ui=await open(process.env.WALL_PREVIOUS_TAG);
  try {
    await ui.fill('#lang','he','change');
    await ui.click('#start-campaign');
    await ui.click(`#choices [data-choice="${plaza.correct}"]`);
    await ui.click('#next');
    assert.equal(await ui.text('#chapter'),'1');
    await ui.click(`#choices [data-choice="${chapters[0].correct}"]`);
    await ui.click('#transfer > summary');
    await ui.click(`[data-transfer-choice="${transferLessons[0].correct}"]`);
    await ui.fill('#transfer-draft',draft,'input');
    await ui.click('#next');
    assert.equal(await ui.text('#chapter'),'2');
    await ui.click('[data-move="-1"]');
    const footprint=await ui.foot();
    await settings(ui);
    await ui.fill('#theme','contrast','change');
    await ui.fill('#text-scale','125','input');
    await ui.evaluate(`document.querySelector('#text-scale').dispatchEvent(new Event('change',{bubbles:true}))`);
    await ui.click('#save-export');
    const saved=await ui.evaluate('document.querySelector("#save-output").value');
    const data=JSON.parse(saved);
    assert.equal(data.values['wall.transfer.1.draft'], draft);
    assert.equal(data.values['wall.language'],'he');
    assert.deepEqual(JSON.parse(data.values['wall.appearance.v1']),{theme:'contrast',motion:'system',size:125});
    const campaign=JSON.parse(data.values['wall.progress.v1']);
    assert.equal(campaign.active,'2');
    assert.deepEqual(campaign.completed,['plaza','1']);
    assert.equal(campaign.placement[1],-1);

    assert.throws(()=>adb('install','-r',candidate),error=>
      /INSTALL_FAILED_UPDATE_INCOMPATIBLE/.test(String(error.stderr)+String(error.stdout)));
    assert.equal(await ui.evaluate('document.querySelector("#save-output").value'),saved);
    console.log('Android rejected the in-place update of the differently signed APK; the old export remained intact.');
    return {saved,campaign,footprint};
  } finally {
    ui.close();
    adb('uninstall',pkg);
  }
}

async function restoreNewSave(record) {
  adb('install',candidate);
  let ui=await open(process.env.WALL_TAG);
  try {
    assert.equal(await ui.evaluate('localStorage.getItem("wall.progress.v1")'),null);
    await settings(ui);
    await ui.fill('#save-input','invalid WALL save','input');
    await ui.click('#save-review');
    assert.equal(await ui.visible('#save-confirm'),false);
    await ui.fill('#save-input',record.saved,'input');
    await ui.click('#save-review');
    await ui.click('#save-confirm');
    await until('The imported save did not reopen chapter 2',async()=>{
      try { return await ui.visible('#restore-notice') && await ui.text('#chapter')==='2'; }
      catch { return false; }
    });
    assert.deepEqual(await ui.foot(),record.footprint);
    assert.equal(await ui.evaluate('document.documentElement.dir'),'rtl');
    assert.deepEqual(JSON.parse(await ui.evaluate('localStorage.getItem("wall.appearance.v1")')),
      {theme:'contrast',motion:'system',size:125});
    ui.close();
    ui=null;
    adb('shell','am','force-stop',pkg);
    ui=await open(process.env.WALL_TAG);
    await ui.click('#start-campaign');
    assert.equal(await ui.text('#chapter'),'2');
    assert.deepEqual(await ui.foot(),record.footprint);
    assert.deepEqual(JSON.parse(await ui.evaluate('localStorage.getItem("wall.progress.v1")')),record.campaign);
    await ui.click('#episodes-button');
    await ui.click('#chapters ol li:nth-child(2) button');
    assert.equal(await ui.text('#chapter'),'1');
    await ui.click('#transfer > summary');
    await until('The restored draft did not open',()=>ui.visible('#transfer-draft'));
    assert.equal(await ui.evaluate('document.querySelector("#transfer-draft").value'),draft);
    console.log('Clean Android install restored chapter 2, scene position, two completion records, Hebrew RTL, appearance, and the identical chapter 1 draft after relaunch.');
  } finally {
    ui?.close();
    adb('uninstall',pkg);
  }
}

await restoreNewSave(await exportOldSave());
