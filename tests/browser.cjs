// Run via NODE_PATH pointing to an installation of playwright, or install it locally.
// WALL_BROWSER can select a local Chromium binary.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const target = process.argv[2] || 'http://127.0.0.1:8765/';
const browserOptions = { args:['--no-sandbox', '--disable-dev-shm-usage'] };
if (process.env.WALL_BROWSER) browserOptions.executablePath = process.env.WALL_BROWSER;

async function main() {
  const { chapters, plaza } = await import('../content.js');
  const browser = await chromium.launch(browserOptions);
  try {
    for (const [locale, width] of [['tr',1100],['en',320],['he',320],['az',740]]) {
      const page = await browser.newPage({ viewport:{ width, height:750 },locale });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(target);
      await page.locator('#app').waitFor();
      await page.selectOption('#lang', locale);
      assert.equal(await page.locator('html').getAttribute('dir'), locale === 'he' ? 'rtl' : 'ltr');
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
      await page.click('#source');
      await page.locator('#reader[open]').waitFor();
      await page.click('#catalogue summary');
      await page.locator('#catalogue li').first().waitFor();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#source').evaluate(el => el === document.activeElement), true);
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
      const frameBefore = await page.locator('canvas').evaluate(el => el.toDataURL());
      await page.keyboard.down('ArrowRight');
      await page.waitForTimeout(180);
      await page.keyboard.up('ArrowRight');
      assert.notEqual(await page.locator('canvas').evaluate(el => el.toDataURL()), frameBefore);
      await page.click('#photo-button');
      await page.locator('#photo[open]').waitFor();
      await page.waitForFunction(() => document.querySelector('#photo img').naturalWidth > 0);
      await page.keyboard.press('Escape');
      await page.click('[data-layer="quarter"]');
      assert.notEqual(await page.locator('#models output').textContent(), '');
      await page.click('[data-choice="0"]');
      assert.equal(await page.locator('#next').isHidden(), true);
      await page.click('[data-choice="' + plaza.correct + '"]');
      await page.click('#next');
      for (const episode of chapters) {
        await page.waitForURL('**/#chapter-' + episode.id);
        assert.equal(await page.locator('#chapter').textContent(), String(episode.id));
        if (episode.id === 6) {
          await page.click('[data-layer="temple"]');
          await page.reload();
          await page.locator('#app').waitFor();
          assert.equal(await page.locator('#chapter').textContent(), '6');
          await page.selectOption('#lang', locale === 'he' ? 'az' : 'he');
          assert.equal(await page.locator('#chapter').textContent(), '6');
          await page.selectOption('#lang', locale);
        }
        if (episode.id === 11) {
          await page.click('[data-sequence="0"]');
          assert.equal(await page.locator('#sequence li').count(), 0);
          for (const id of [1,0,2]) await page.click('[data-sequence="' + id + '"]');
          assert.equal(await page.locator('#sequence li').count(), 3);
        }
        if (episode.id === 16) {
          await page.click('[data-study="0"]');
          await page.click('[data-study="1"]');
          assert.equal(await page.locator('#workbench output').textContent(), '8 + 10 = 18');
        }
        if (episode.id === 18) {
          await page.click('[data-study="3"]');
          assert.equal(await page.locator('#workbench output bdi').textContent(), 'עשייה');
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
        await page.click('[data-choice="' + episode.correct + '"]');
        if (episode.id !== 24) await page.click('#next');
      }
      await page.selectOption('#tour-stops select >> nth=0', 'photo');
      await page.fill('#journal-text', 'WALL');
      await page.reload();
      await page.locator('#app').waitFor();
      assert.equal(await page.locator('#journal-text').inputValue(), 'WALL');
      assert.equal(await page.locator('#tour-stops select').first().inputValue(), 'photo');
      await page.click('#library-button');
      await page.locator('#library[open]').waitFor();
      assert.ok(await page.locator('#library details').count() >= 8);
      await page.keyboard.press('Escape');
      await page.click('#next');
      await page.waitForURL('**/#game');
      assert.deepEqual(errors, []);
      await page.close();
      console.log(locale, width, '25 checkpoints, sources, movement, save, library: PASS');
    }
    const padPage = await browser.newPage({ locale:'he' });
    await padPage.addInitScript(() => {
      const pad = {
        connected:true, axes:[0], buttons:Array.from({length:16}, () => ({pressed:false})),
      };
      Object.defineProperty(navigator, 'getGamepads', {value:() => [pad]});
      window.fixtureController = pad;
    });
    await padPage.goto(target);
    await padPage.locator('#app').waitFor();
    async function press(button, condition, argument) {
      await padPage.evaluate(id => { window.fixtureController.buttons[id].pressed = true; }, button);
      await padPage.waitForFunction(condition, argument);
      await padPage.evaluate(id => { window.fixtureController.buttons[id].pressed = false; }, button);
      await padPage.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
    }
    await press(2, () => document.activeElement === document.querySelector('#choices button'));
    await press(13, () => document.activeElement.dataset.choice === '1');
    await press(0, () => !document.getElementById('next').hidden);
    const oldFrame = await padPage.locator('#world').evaluate(canvas => canvas.toDataURL());
    await padPage.evaluate(() => { window.fixtureController.axes[0] = 1; });
    await padPage.waitForFunction(before => document.querySelector('#world').toDataURL() !== before, oldFrame);
    await padPage.evaluate(() => { window.fixtureController.axes[0] = 0; });
    await press(3, () => document.getElementById('chapters').open);
    await press(1, () => !document.getElementById('chapters').open);
    await padPage.evaluate(() => window.dispatchEvent(new CustomEvent('wall-controller', {
      detail:{action:'library',pressed:true},
    })));
    await padPage.locator('#library[open]').waitFor();
    await padPage.close();
    console.log('Gamepad browser mapping and native event path (simulated): PASS');

    const recovery = await browser.newPage();
    await recovery.route('**/visitor.png', route => route.abort());
    await recovery.goto(target);
    await recovery.locator('#retry').waitFor();
    await recovery.unroute('**/visitor.png');
    await recovery.click('#retry');
    await recovery.locator('#app').waitFor();
    await recovery.close();
    console.log('Loading error and retry: PASS');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
