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
    assert.deepEqual(archive.requests,[]);
    assert.deepEqual(archive.errors,[]);
    await page.close();
    console.log(useFixture ? 'Standalone HTML via a local response fixture: PASS' : 'Standalone HTML opened from disk: PASS');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
