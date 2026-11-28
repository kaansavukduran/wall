const assert = require('node:assert/strict');
const { resolve } = require('node:path');
const { chromium } = require('playwright');

const site = resolve(process.argv[2]);
const origin = 'https://appassets.androidplatform.net';
const progress = 'wall.progress.v1';
const firstDraft = 'wall.transfer.1.draft';
const secondDraft = 'wall.transfer.2.draft';
const firstTransfer = {
  [progress]: JSON.stringify({active:'2',completed:['plaza','1'],placement:[95,-1]}),
  'wall.language': 'he',
  'wall.appearance.v1': JSON.stringify({theme:'contrast',motion:'system',size:125}),
  [firstDraft]: 'טיוטה ראשונה',
};
const secondTransfer = {
  [progress]: JSON.stringify({active:'3',completed:['plaza','1','2'],placement:[120,1]}),
  [firstDraft]: 'Existing notes take precedence',
  [secondDraft]: 'טיוטה שנייה',
};

async function open(context, owner) {
  const page = await context.newPage();
  await page.goto(`${origin}/assets/index.html?wall-process=${owner}`);
  await page.locator('#app').waitFor();
  return page;
}

async function submit(page, values) {
  await page.locator('#settings-button').click();
  await page.locator('#save-transfer > summary').click();
  await page.locator('#save-input').fill(JSON.stringify({format:'WALL save',version:1,values}));
  await page.locator('#save-review').click();
  await page.locator('#save-confirm').click();
}

async function run() {
  const browser = await chromium.launch({executablePath:process.env.WALL_BROWSER});
  try {
    const context = await browser.newContext({serviceWorkers:'block'});
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin || !url.pathname.startsWith('/assets/')) return route.abort();
      return route.fulfill({path:resolve(site,url.pathname.slice('/assets/'.length))});
    });
    let page = await open(context,'first');
    await submit(page,firstTransfer);
    await page.locator('#restore-notice').waitFor();
    await submit(page,secondTransfer);
    await page.waitForURL(url => url.searchParams.get('wall-process') === 'first'
      && url.hash === '',{waitUntil:'domcontentloaded'});
    await page.locator('#restore-notice').waitFor();

    // Emulate losing WebView's in-memory localStorage batch, while the committed journal stays on disk.
    await page.evaluate(() => localStorage.clear());
    await page.close();
    page = await open(context,'second');
    await page.locator('#restore-notice').waitFor();
    assert.equal(await page.locator('#chapter').textContent(),'2');
    assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
    assert.deepEqual(await page.evaluate(keys => keys.map(key => localStorage.getItem(key)),
      [progress,firstDraft,secondDraft,'wall.appearance.v1','wall.completed.v1.2']),
    [JSON.stringify({active:'2',completed:['plaza','1','2'],placement:[95,-1]}),
      firstTransfer[firstDraft],secondTransfer[secondDraft],firstTransfer['wall.appearance.v1'],'1']);

    const newer = JSON.stringify({active:'3',completed:['plaza','1','2'],placement:[140,1]});
    await page.evaluate(([key,value,draft]) => {
      localStorage.setItem(key,value);
      localStorage.setItem(draft,'');
    },[progress,newer,firstDraft]);
    await page.close();
    page = await open(context,'third');
    assert.equal(await page.locator('#restore-notice').isHidden(),true);
    assert.deepEqual(await page.evaluate(keys => keys.map(key => localStorage.getItem(key)),
      [progress,firstDraft]),[newer,'']);

    await page.evaluate(() => {
      indexedDB.open = () => { throw new Error('Storage unavailable'); };
    });
    await submit(page,{'wall.journal':'Uncommitted change'});
    await page.getByText('לא ניתן לגשת לשמירה במכשיר.',{exact:false}).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('wall.journal')),null);
    assert.equal(await page.locator('#restore-notice').isHidden(),true);
    console.log('Android transfer journal restores both imports, skips later edits, and rejects a failed commit.');
  } finally {
    await browser.close();
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
