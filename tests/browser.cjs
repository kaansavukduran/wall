// Run via NODE_PATH pointing to an installation of playwright, or install it locally.
// WALL_BROWSER can select a local Chromium binary.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const target = process.argv[2] || 'http://127.0.0.1:8765/';
const browserOptions = { args:['--no-sandbox', '--disable-dev-shm-usage'] };
if (process.env.WALL_BROWSER) browserOptions.executablePath = process.env.WALL_BROWSER;

async function main() {
  const { chapters, plaza } = await import('../content.js');
  const { ancientLessons } = await import('../ancient-lessons.js');
  const { secondTempleLessons } = await import('../second-temple-lessons.js');
  const { romanLessons } = await import('../roman-lessons.js');
  const lessons = {...ancientLessons, ...secondTempleLessons, ...romanLessons};
  const decks = ['ancient-lessons.js', 'second-temple-lessons.js', 'roman-lessons.js'];
  const browser = await chromium.launch(browserOptions);
  try {
    for (const [locale, width] of [['tr',1100],['en',320],['he',320],['az',740]]) {
      const page = await browser.newPage({ viewport:{ width, height:750 },locale,hasTouch:width === 320 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const loadedLessons = new Set();
      page.on('request', request => {
        if (request.url().endsWith('-lessons.js')) loadedLessons.add(request.url().split('/').at(-1));
      });
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
      const frameBefore = await page.locator('#world').evaluate(el => el.toDataURL());
      await page.keyboard.down('ArrowRight');
      await page.waitForTimeout(180);
      await page.keyboard.up('ArrowRight');
      const walkedFrame = await page.locator('#world').evaluate(el => el.toDataURL());
      assert.notEqual(walkedFrame, frameBefore);
      await page.click('#photo-button');
      await page.locator('#photo[open]').waitFor();
      await page.waitForFunction(() => document.querySelector('#photo img').naturalWidth > 0);
      const comparison = page.locator('#compare-view');
      const picture = page.locator('#compare-canvas');
      assert.equal(await comparison.inputValue(), '1');
      const paired = await picture.evaluate(canvas => canvas.toDataURL());
      if (width === 320) {
        assert.ok(await comparison.evaluate(input => input.getBoundingClientRect().bottom <= window.innerHeight));
        await comparison.tap({position:{x:7,y:20}});
        assert.notEqual(await comparison.inputValue(), '1');
      }
      await comparison.press('Home');
      const old = await picture.evaluate(canvas => canvas.toDataURL());
      const oldLabel = await comparison.getAttribute('aria-valuetext');
      assert.notEqual(old, paired);
      assert.ok(oldLabel);
      await comparison.press('End');
      assert.equal(await comparison.inputValue(), '2');
      assert.notEqual(await picture.evaluate(canvas => canvas.toDataURL()), old);
      assert.notEqual(await comparison.getAttribute('aria-valuetext'), oldLabel);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      assert.equal(await page.locator('#photo').evaluate(panel => panel.scrollWidth > panel.clientWidth), false);
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#photo-button').evaluate(button => button === document.activeElement), true);
      assert.equal(await page.locator('#world').evaluate(el => el.toDataURL()), walkedFrame);
      await page.click('[data-layer="quarter"]');
      assert.notEqual(await page.locator('#models output').textContent(), '');
      await page.click('[data-choice="0"]');
      assert.equal(await page.locator('#next').isHidden(), true);
      await page.click('[data-choice="' + plaza.correct + '"]');
      await page.click('#next');
      for (const episode of chapters) {
        await page.waitForURL('**/#chapter-' + episode.id);
        assert.equal(await page.locator('#chapter').textContent(), String(episode.id));
        const evidence = lessons[episode.id];
        if (evidence) {
          const panel = page.locator('#evidence');
          assert.equal(await panel.getAttribute('open'), null);
          const filename = decks[Math.floor((episode.id - 1) / 4)];
          if (episode.id % 4 === 1) assert.equal(loadedLessons.has(filename), false);
          await panel.locator('summary').press('Enter');
          const wrongChoice = page.locator('[data-evidence="' + (evidence.correct + 1) % 3 + '"]');
          await wrongChoice.press('Enter');
          const firstLink = await page.locator('#evidence-source').getAttribute('href');
          const correctChoice = page.locator('[data-evidence="' + evidence.correct + '"]');
          await correctChoice.click();
          assert.equal(await wrongChoice.getAttribute('aria-pressed'), 'false');
          assert.equal(await correctChoice.getAttribute('aria-pressed'), 'true');
          const actualLink = await page.locator('#evidence-source').getAttribute('href');
          assert.notEqual(actualLink, firstLink);
          assert.equal(actualLink, evidence.cards[evidence.correct].url);
          const index = ['tr','en','he','az'].indexOf(locale);
          assert.equal(await page.locator('#evidence-feedback').textContent(), evidence.feedback[index]);
          assert.ok(loadedLessons.has(filename));
        }
        if (episode.id === 1) {
          for (const card of [2,0,1]) await page.click('[data-sequence="' + card + '"]');
          assert.equal(await page.locator('#sequence li').count(), 3);
        }
        if (episode.id === 2) {
          const before = await page.locator('#world').evaluate(canvas => canvas.toDataURL());
          await page.click('[data-layer="sanctuary"]');
          assert.notEqual(await page.locator('#world').evaluate(canvas => canvas.toDataURL()), before);
        }
        if (episode.id === 4) {
          for (const card of [2,0,1]) await page.click('[data-sequence="' + card + '"]');
          const dates = await page.locator('#sequence li').allTextContents();
          assert.deepEqual(dates.map(item => item.match(/\d+(?:\/\d+)?/)[0]), ['539','516/515','407']);
        }
        if (episode.id === 5) {
          await page.click('[data-night="3"]');
          const counts = await page.locator('.lamp-row').allTextContents();
          assert.equal(counts.length, 2);
          assert.match(counts[0], / · 3 /);
          assert.match(counts[1], / · 6 /);
        }
        if (episode.id === 6) {
          await page.click('[data-layer="temple"]');
          await page.reload();
          await page.locator('#app').waitFor();
          assert.equal(await page.locator('#chapter').textContent(), '6');
          await page.selectOption('#lang', locale === 'he' ? 'az' : 'he');
          assert.equal(await page.locator('#chapter').textContent(), '6');
          await page.selectOption('#lang', locale);
        }
        if (episode.id === 8) {
          await page.click('[data-layer="before"]');
          const intact = await page.locator('#world').evaluate(canvas => canvas.toDataURL());
          await page.click('[data-layer="after"]');
          assert.notEqual(await page.locator('#world').evaluate(canvas => canvas.toDataURL()), intact);
          for (const card of [1,2,0]) await page.click('[data-sequence="' + card + '"]');
          const dates = await page.locator('#sequence li').allTextContents();
          assert.deepEqual(dates.map(item => item.match(/\d+/)[0]), ['70','71','81']);
        }
        if (episode.id === 9 || episode.id === 10) {
          const sceneBefore = await page.locator('#world').evaluate(canvas => canvas.toDataURL());
          await page.click(episode.id === 9 ? '[data-layer="cyprus"]' : '[data-layer="ritual"]');
          assert.notEqual(await page.locator('#world').evaluate(canvas => canvas.toDataURL()), sceneBefore);
          assert.notEqual(await page.locator('#models output').textContent(), '');
        }
        if (episode.id === 11) {
          await page.click('[data-sequence="0"]');
          assert.equal(await page.locator('#sequence li').count(), 0);
          for (const id of [1,0,2]) await page.click('[data-sequence="' + id + '"]');
          assert.equal(await page.locator('#sequence li').count(), 3);
        }
        if (episode.id === 12) {
          for (const card of [1,2,0]) await page.click('[data-sequence="' + card + '"]');
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
        if (episode.id === 23) {
          await page.click('#photo-button');
          await page.locator('#compare-history').waitFor();
          assert.match(await page.locator('#compare-history').textContent(), /1967/);
          assert.equal(await page.locator('#compare-history-source').getAttribute('href'), 'https://whc.unesco.org/document/8721');
          await page.locator('#photo form button').click();
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
    assert.equal(await padPage.evaluate(() => getComputedStyle(document.activeElement).outlineWidth), '3px');
    await press(0, () => !document.getElementById('next').hidden);
    await padPage.click('#photo-button');
    await press(13, () => document.activeElement.id === 'photo-source');
    await press(13, () => document.activeElement.id === 'compare-view');
    await press(14, () => document.getElementById('compare-view').value === '2');
    await press(0, () => document.getElementById('compare-view').value === '0');
    await press(1, () => !document.getElementById('photo').open);
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
