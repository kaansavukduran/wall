const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const html = resolve(process.argv[2]);
const useFixture = process.env.WALL_OFFLINE_FIXTURE === '1';
const address = useFixture ? 'https://wall-offline.test/' : pathToFileURL(html).href;
const options = { args:['--no-sandbox','--disable-dev-shm-usage'] };
if (process.env.WALL_BROWSER) options.executablePath = process.env.WALL_BROWSER;

async function openOffline(browser, hash, setup) {
  const page = await browser.newPage({locale:'az',viewport:{width:320,height:720},hasTouch:true});
  const requests = [];
  const errors = [];
  page.on('request',request => {
    const url = new URL(request.url());
    url.hash = '';
    if (url.href !== address && url.protocol !== 'data:') requests.push(url.href);
  });
  page.on('pageerror',error => errors.push(error.message));
  await page.route(/^https?:/,route => {
    if (useFixture && route.request().url() === address) {
      return route.fulfill({contentType:'text/html; charset=utf-8',body:readFileSync(html)});
    }
    return route.abort();
  });
  if (setup) await page.addInitScript(setup);
  await page.goto(address + hash);
  await page.locator('#app').waitFor();
  return {page,requests,errors};
}

async function main() {
  const browser = await chromium.launch(options);
  try {
    const first = await openOffline(browser,'');
    const manifest = JSON.parse(await first.page.locator('#wall-build').textContent());
    assert.deepEqual(manifest.languages,['tr','en','he','az']);
    assert.match(manifest.sourceCatalogueRevision,/^[0-9a-f]{64}$/);
    assert.match(await first.page.locator('footer').textContent(),new RegExp('v'+manifest.version+'$'));
    assert.equal(await first.page.locator('#start-campaign').textContent(),'Yeni oyun');
    await first.page.tap('#start-campaign');
    await first.page.tap('[data-choice="1"]');
    await first.page.tap('#next');
    assert.equal(await first.page.locator('#chapter').textContent(),'1');
    await first.page.tap('#library-button');
    await first.page.tap('#kabbalah > summary');
    await first.page.selectOption('#kabbalah-lesson', 'zohar-rose-commentaries');
    await first.page.locator('.kabbalah-commentaries summary').last().tap();
    assert.match(await first.page.locator('.kabbalah-commentaries details[open]').innerText(), /17 dekabr 2022/);
    assert.deepEqual(first.requests,[]);
    assert.deepEqual(first.errors,[]);
    await first.page.close();

    const model = await openOffline(browser,'#chapter-6',() => {
      localStorage.setItem('wall.progress.v1',JSON.stringify({
        active:'6',completed:['plaza','1','2','3','4','5'],
      }));
    });
    const assembly = model.page.locator('#platform-assembly');
    await assembly.locator('summary').tap();
    await assembly.locator('[data-platform-part="0"]').tap();
    await assembly.locator('[data-platform-place="0"]').tap();
    assert.match(await assembly.locator('.platform-feedback').textContent(),/İstinad divarı/);
    assert.deepEqual(model.requests,[]);
    assert.deepEqual(model.errors,[]);
    await model.page.close();

    const ritual = await openOffline(browser,'#chapter-7',() => {
      localStorage.setItem('wall.progress.v1',JSON.stringify({
        active:'7',completed:['plaza','1','2','3','4','5','6'],
      }));
    });
    const firstFruits = ritual.page.locator('#first-fruits');
    const basket = firstFruits.locator('canvas');
    await firstFruits.locator('summary').tap();
    await basket.waitFor();
    const shoulder = await basket.evaluate(el => el.toDataURL());
    await firstFruits.getByRole('button').tap();
    assert.notEqual(await basket.evaluate(el => el.toDataURL()),shoulder);
    assert.deepEqual(ritual.requests,[]);
    assert.deepEqual(ritual.errors,[]);
    await ritual.page.close();

    const wall = await openOffline(browser,'#chapter-8',() => {
      localStorage.setItem('wall.progress.v1',JSON.stringify({
        active:'8',completed:['plaza','1','2','3','4','5','6','7','8'],
      }));
    });
    const comparison = wall.page.locator('#wall-transfer');
    await comparison.locator(':scope > summary').tap();
    await comparison.locator('img').waitFor();
    await wall.page.waitForFunction(() => document.querySelector('#wall-transfer img').naturalWidth === 960);
    await comparison.locator('[data-wall-region="1"]').tap();
    assert.equal(await comparison.locator('.wall-transfer-mark').isVisible(),true);
    assert.deepEqual(wall.requests,[]);
    assert.deepEqual(wall.errors,[]);
    await wall.page.close();

    const roman = await openOffline(browser,'#chapter-10',() => {
      localStorage.setItem('wall.progress.v1',JSON.stringify({
        active:'10',completed:['plaza',...Array.from({length:9},(_,index)=>String(index+1))],
      }));
    });
    const letter = roman.page.locator('#bar-kosiba-letter');
    await letter.locator('summary').tap();
    const plants = letter.locator('canvas');
    await plants.waitFor();
    const empty = await plants.evaluate(canvas => canvas.toDataURL());
    await letter.locator('.letter-requests fieldset').first().locator('button').first().tap();
    await letter.locator('.letter-requests fieldset').last().locator('button').last().tap();
    assert.notEqual(await plants.evaluate(canvas => canvas.toDataURL()),empty);
    assert.deepEqual(roman.requests,[]);
    assert.deepEqual(roman.errors,[]);
    await roman.page.close();

    const ottoman = await openOffline(browser,'#chapter-19',() => {
      localStorage.setItem('wall.progress.v1',JSON.stringify({
        active:'19',completed:['plaza',...Array.from({length:18},(_,index)=>String(index+1))],
      }));
    });
    await ottoman.page.tap('[data-layer="paving-request"]');
    assert.match(await ottoman.page.locator('#model-reference').getAttribute('href'), /#page=30$/);
    await ottoman.page.tap('#evidence > summary');
    await ottoman.page.tap('[data-evidence="3"]');
    const bergheim = ottoman.page.locator('#evidence-photo img');
    await bergheim.waitFor();
    await bergheim.evaluate(image => image.decode());
    assert.equal(await bergheim.evaluate(image => image.naturalWidth),640);
    const reservoir = ottoman.page.locator('#reservoir');
    const basin = reservoir.locator('canvas');
    await reservoir.locator('summary').tap();
    await basin.waitFor();
    const earlier = await basin.evaluate(el => el.toDataURL());
    await reservoir.locator('.reservoir-phases button').last().tap();
    assert.notEqual(await basin.evaluate(el => el.toDataURL()),earlier);
    const reservoirQuestion = reservoir.locator('.reservoir-question');
    await reservoirQuestion.locator('button').first().tap();
    assert.match(await reservoirQuestion.getByRole('status').textContent(),/3,2 m/);
    assert.deepEqual(ottoman.requests,[]);
    assert.deepEqual(ottoman.errors,[]);
    await ottoman.page.close();

    const archive = await openOffline(browser,'#chapter-24',() => {
      localStorage.setItem('wall.progress.v1',JSON.stringify({
        active:'24',
        completed:['plaza',...Array.from({length:24},(_,index)=>String(index+1))],
      }));
    });
    const {page} = archive;
    assert.equal(await page.locator('#arrival').isHidden(),true);
    await page.tap('#baku-archive > summary');
    const canvas = page.locator('#baku-archive canvas');
    await canvas.waitFor();
    const building = await canvas.evaluate(el => el.toDataURL());
    await page.tap('[data-baku-stop="1"]');
    await page.tap('[data-baku-view="3"]');
    assert.notEqual(await canvas.evaluate(el => el.toDataURL()),building);
    assert.equal(await page.locator('.baku-word').textContent(),'зуһун дәдәји');
    const {contemporaryLessons} = await import('../contemporary-lessons.js');
    const documents = page.locator('#contemporary-timeline');
    await documents.locator('summary').tap();
    for (const id of contemporaryLessons.activity.correctOrder) {
      await documents.locator('[data-timeline-card="' + id + '"]').tap();
    }
    assert.equal(await documents.locator('.timeline-order li').count(),5);
    const question = documents.locator('.timeline-check');
    await question.getByRole('button').first().tap();
    assert.match(await question.getByRole('status').textContent(),/2027 və 2029/);
    assert.deepEqual(archive.requests,[]);
    assert.deepEqual(archive.errors,[]);
    await page.close();
    console.log(useFixture ? 'Standalone HTML via a local response fixture: PASS' : 'Standalone HTML opened from disk: PASS');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
