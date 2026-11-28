// Run via NODE_PATH pointing to an installation of playwright, or install it locally.
// WALL_BROWSER can select a local Chromium binary.
const assert = require('node:assert/strict');
const playwright = require('playwright');
const engine = process.env.WALL_BROWSER_ENGINE || 'chromium';
const target = process.argv[2] || 'http://127.0.0.1:8765/';
const browserOptions = engine === 'chromium' ? { args:['--no-sandbox', '--disable-dev-shm-usage'] } : {};
if (process.env.WALL_BROWSER) browserOptions.executablePath = process.env.WALL_BROWSER;

async function main() {
  const { chapters, plaza } = await import('../content.js');
  const { ancientLessons } = await import('../ancient-lessons.js');
  const { secondTempleLessons } = await import('../second-temple-lessons.js');
  const { romanLessons } = await import('../roman-lessons.js');
  const { medievalLessons } = await import('../medieval-lessons.js');
  const { earlyModernLessons } = await import('../early-modern-lessons.js');
  const { modernLessons } = await import('../modern-lessons.js');
  const { feynmanCases } = await import('../kabbalah-lessons.js');
  const { comparisonCases } = await import('../kabbalah-advanced-lessons.js');
  const { kotelScenarios } = await import('../kotel-lessons.js');
  const { dailyCases } = await import('../daily-life.js');
  const { ashlagPhases, ashlagScreen } = await import('../ashlag-lessons.js');
  const { circleTurns } = await import('../study-circle-lessons.js');
  const { genizaLetters } = await import('../geniza-lessons.js');
  const { bakuCopy,bakuStops } = await import('../baku-lessons.js');
  const { atlasEntries } = await import('../atlas-lessons.js');
  const { cultureCases, cultureRecords } = await import('../culture-lessons.js');
  const { accountabilityCases, accountabilityRecords } = await import('../accountability-lessons.js');
  const { pageFeedback } = await import('../talmud-lessons.js');
  const { transferLessons:earlyTransfers } = await import('../transfer-early-lessons.js');
  const { transferLessons:middleTransfers } = await import('../transfer-middle-lessons.js');
  const { transferLessons:lateTransfers } = await import('../transfer-late-lessons.js');
  const transferLessons = [...earlyTransfers,...middleTransfers,...lateTransfers];
  const transferDecks = ['transfer-early-lessons.js','transfer-middle-lessons.js','transfer-late-lessons.js'];
  const { languageLessons } = await import('../language-lessons.js');
  const { archiveCases } = await import('../diaspora-archive.js');
  const { diasporaRecords } = await import('../diaspora-lessons.js');
  const { models } = await import('../scenes.js');
  const { messianicLessons } = await import('../messianic-lessons.js');
  const { pressLessons } = await import('../press-lessons.js');
  const { displacementRecords } = await import('../displacement-lessons.js');
  const lessons = {...ancientLessons, ...secondTempleLessons, ...romanLessons, ...medievalLessons, ...earlyModernLessons, ...modernLessons};
  const decks = ['ancient-lessons.js', 'second-temple-lessons.js', 'roman-lessons.js', 'medieval-lessons.js', 'early-modern-lessons.js', 'modern-lessons.js'];
  const browser = await playwright[engine].launch(browserOptions);
  try {
    for (const [locale, width] of [['tr',1100],['en',320],['he',320],['az',320]]) {
      const page = await browser.newPage({ viewport:{ width, height:750 },locale,hasTouch:width === 320 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const loadedLessons = new Set();
      page.on('request', request => {
        if (request.url().endsWith('-lessons.js')) loadedLessons.add(request.url().split('/').at(-1));
      });
      await page.goto(target);
      await page.locator('#app').waitFor();
      assert.match(await page.locator('#download').getAttribute('href'), /kaansavukduran\/wall\/releases$/);
      await page.selectOption('#lang', locale);
      assert.equal(await page.locator('html').getAttribute('dir'), locale === 'he' ? 'rtl' : 'ltr');
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
      await page.click('#settings-button');
      assert.equal(await page.locator('#settings').evaluate(dialog => dialog.scrollWidth > dialog.clientWidth),false);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#settings-button').evaluate(el => el === document.activeElement),true);
      await page.click('#source');
      await page.locator('#reader[open]').waitFor();
      await page.click('#catalogue summary');
      await page.locator('#catalogue li').first().waitFor();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#source').evaluate(el => el === document.activeElement), true);
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
      assert.equal(loadedLessons.has('kotel-lessons.js'), false);
      const visitRequest = page.waitForResponse(response => response.url().endsWith('/kotel-lessons.js'));
      if (width === 320) await page.tap('#visit-button');
      else await page.click('#visit-button');
      assert.ok((await visitRequest).ok());
      await page.locator('.visit-object canvas').waitFor();
      assert.ok(await page.locator('.visit-object canvas').evaluate(canvas => {
        const {width,height} = canvas.getBoundingClientRect();
        return Math.abs(width / height - 4/3) < .02;
      }));
      const initialObject = await page.locator('.visit-object canvas').evaluate(canvas => canvas.toDataURL());
      await page.selectOption('#visit-topic', 'kotel-tefillin');
      assert.notEqual(await page.locator('.visit-object canvas').evaluate(canvas => canvas.toDataURL()), initialObject);
      await page.click('.visit-sources summary');
      assert.match(await page.locator('.visit-sources a').first().getAttribute('href'), /Deuteronomy/);
      await page.click('.visit-exercise summary');
      for (const sample of kotelScenarios) {
        await page.selectOption('#visit-scenario', sample.id);
        const other = (sample.correct + 1) % sample.options.length;
        await page.click('[data-visit-choice="' + other + '"]');
        const index = ['tr','en','he','az'].indexOf(locale);
        assert.equal(await page.locator('.visit-exercise [role="status"]').innerText(), sample.feedback[other][index]);
        await page.click('[data-visit-choice="' + sample.correct + '"]');
        assert.equal(await page.locator('.visit-exercise [role="status"]').innerText(), sample.feedback[sample.correct][index]);
      }
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      assert.equal(await page.locator('#library').evaluate(dialog => dialog.scrollWidth > dialog.clientWidth), false);
      await page.keyboard.press('Escape');
      assert.ok(await page.locator('#visit-button').evaluate(button => button === document.activeElement));
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
          const wrongIndex = (evidence.correct + 1) % evidence.cards.length;
          const wrongChoice = page.locator('[data-evidence="' + wrongIndex + '"]');
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
        if ([1,3,4,7,12,14,16,18,20,21].includes(episode.id)) {
          const model = models.find(entry => entry.id === episode.id);
          let previous = await page.locator('#world').evaluate(canvas => canvas.toDataURL());
          for (const [layer, , readings, source] of model.options) {
            const button = page.locator('[data-layer="' + layer + '"]');
            const stable = await button.elementHandle();
            await button.press('Enter');
            assert.ok(await stable.evaluate(element => element === document.activeElement && element.isConnected));
            assert.equal(await button.getAttribute('aria-pressed'), 'true');
            assert.equal(await page.locator('#models output').innerText(), readings[['tr','en','he','az'].indexOf(locale)]);
            assert.equal(await page.locator('#model-reference').getAttribute('href'), source);
            const current = await page.locator('#world').evaluate(canvas => canvas.toDataURL());
            assert.notEqual(current, previous);
            previous = current;
          }
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
          assert.equal(loadedLessons.has('talmud-lessons.js'),false);
          await page.locator('#talmud-page summary').press('Enter');
          await page.selectOption('#talmud-reading','rashi-reading');
          assert.match(await page.locator('.talmud-reading a').getAttribute('href'),/Rashi_on_Berakhot/);
          await page.selectOption('#talmud-reading','printed-page-history');
          assert.match(await page.locator('.talmud-reading a').last().getAttribute('href'),/Berakhot2a.jpg/);
          await page.click('#talmud-check');
          const talmudFeedback = page.locator('#talmud-feedback');
          const answer = pageFeedback[['tr','en','he','az'].indexOf(locale)];
          assert.notEqual(await talmudFeedback.textContent(),answer);
          for (const [binding, entries] of [['right',['2','0','1']],['left',['1','0','2']]]) {
            assert.equal(await page.locator('.folio-paper').getAttribute('data-binding'),binding);
            for (const [index, value] of entries.entries()) {
              await page.click('[data-page-region="' + index + '"]');
              await page.click('[data-page-text="' + value + '"]');
            }
            if (width === 320) await page.tap('#talmud-check');
            else await page.locator('#talmud-check').press('Enter');
            assert.equal(await talmudFeedback.textContent(),answer);
            await page.click('#talmud-flip');
          }
          await page.click('[data-page-region="0"]');
          assert.equal(await page.locator('[data-page-text="2"]').getAttribute('aria-pressed'),'true');
          assert.ok(loadedLessons.has('talmud-lessons.js'));
          if (width === 320) {
            await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
            const separation = await page.evaluate(() => {
              const era = document.getElementById('era');
              const world = document.getElementById('world');
              return {position:getComputedStyle(era).position,
                gap:world.getBoundingClientRect().top - era.getBoundingClientRect().bottom};
            });
            assert.equal(separation.position,'static');
            assert.ok(separation.gap >= -1, 'The era label overlaps the scenery by ' + -separation.gap + 'px');
            const overflow = await page.evaluate(() => {
              const {scrollWidth,clientWidth} = document.documentElement;
              if (scrollWidth <= window.innerWidth) return null;
              const elements = [...document.querySelectorAll('#game *')].map(element => {
                const box = element.getBoundingClientRect();
                return {
                  name:element.id || element.getAttribute('class') || element.tagName,
                  width:Math.round(box.width), edge:Math.round(box.right + window.scrollX),
                  inner:element.clientWidth, scroll:element.scrollWidth,
                };
              }).filter(item => item.width && (item.edge > clientWidth || item.scroll > item.inner + 2));
              return {viewport:window.innerWidth,clientWidth,scrollWidth,elements:elements.slice(0,18)};
            });
            assert.equal(overflow,null,JSON.stringify(overflow));
            await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
          }
        }
        if (episode.id === 12) {
          for (const card of [1,2,0]) await page.click('[data-sequence="' + card + '"]');
          assert.equal(await page.locator('#sequence li').count(), 3);
        }
        if (episode.id === 13) {
          const first = await page.locator('#world').evaluate(canvas => canvas.toDataURL());
          await page.click('[data-layer="qibli"]');
          assert.notEqual(await page.locator('#world').evaluate(canvas => canvas.toDataURL()), first);
        }
        if (episode.id === 14) {
          for (const card of [1,2,0]) await page.click('[data-sequence="' + card + '"]');
          const dates = await page.locator('#sequence li').allTextContents();
          assert.deepEqual(dates.map(item => item.match(/\d+/)[0]), ['1099','1187','1193']);
        }
        if (episode.id === 15) {
          assert.equal(loadedLessons.has('geniza-lessons.js'),false);
          const desk = page.locator('#geniza-desk');
          await desk.locator('summary').press('Enter');
          const picture = desk.locator('canvas');
          await picture.waitFor();
          const index = ['tr','en','he','az'].indexOf(locale);
          for (const letter of genizaLetters) {
            await desk.locator('[data-geniza-letter="' + letter.id + '"]').press('Enter');
            assert.equal(await desk.locator('figcaption').textContent(),letter.front[index]);
            assert.equal(await desk.locator('#geniza-source').getAttribute('href'),letter.url);
            const front = await picture.evaluate(canvas => canvas.toDataURL());
            const flip = desk.locator('#geniza-flip');
            if (width === 320) await flip.tap();
            else await flip.press('Enter');
            const back = await picture.evaluate(canvas => canvas.toDataURL());
            assert.notEqual(back,front);
            assert.equal(await desk.locator('figcaption').textContent(),letter.back[index]);
            const feedback = desk.locator('.geniza-exercise [role="status"]');
            await desk.locator('[data-geniza-choice="0"]').click();
            assert.notEqual(await feedback.textContent(),letter.result[index]);
            await desk.locator('[data-geniza-choice="' + letter.correct + '"]').click();
            assert.equal(await feedback.textContent(),letter.result[index]);
            assert.notEqual(await picture.evaluate(canvas => canvas.toDataURL()),back);
            if (width === 320 && letter.id === 'ena-2558-10') {
              await page.setViewportSize({width:750,height:320});
              assert.equal(await feedback.textContent(),letter.result[index]);
              await page.setViewportSize({width:320,height:750});
              await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
              assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),false);
              await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
            }
            await flip.press('Enter');
            assert.equal(await picture.evaluate(canvas => canvas.toDataURL()),front);
          }
        }
        if (episode.id === 16) {
          for (const card of [2,0,1]) await page.click('[data-sequence="' + card + '"]');
          assert.equal(await page.locator('#sequence li').count(),3);
          if (width === 320) {
            await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),false);
            await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
          }
          await page.click('[data-study="0"]');
          await page.click('[data-study="1"]');
          assert.equal(await page.locator('#workbench output').textContent(), '8 + 10 = 18');
          await page.click('#aleph-summary');
          assert.equal(await page.locator('#letter-grid button').count(), 27);
          await page.click('[data-hebrew-letter="ח"]');
          await page.click('[data-hebrew-letter="י"]');
          assert.equal(await page.locator('#aleph-word').textContent(), 'חי');
          assert.equal(await page.locator('#aleph-total').textContent(), '8 + 10 = 18');
          await page.click('#undo-letter');
          await page.click('[data-hebrew-letter="ך"]');
          assert.equal(await page.locator('#aleph-total').textContent(), '8 + 20 = 28');
          await page.click('#clear-letters');
          assert.equal(await page.locator('#aleph-total').textContent(), '0');
          assert.equal(loadedLessons.has('word-method-lessons.js'),false);
          const methods = page.locator('#word-methods');
          await methods.locator(':scope > summary').press('Enter');
          const methodOutput = methods.locator('.method-result');
          const examples = [
            ['gematria',3,'40 + 30 + 20 = 90'],
            ['notarikon',4,'אנא נפשי כתיבת יהבית'],
            ['atbash',3,'בבל'],
            ['lexical',1,'ש־ב־ת'],
          ];
          for (const [id,count,expected] of examples) {
            await methods.locator('[data-method="' + id + '"]').press('Enter');
            for (let index = 0; index < count; index++) {
              const tile = methods.locator('[data-method-tile="' + index + '"]');
              if (width === 320) await tile.tap();
              else await tile.press('Enter');
            }
            assert.equal(await methodOutput.textContent(),expected);
            if (id === 'gematria') {
              const convention = methods.locator('input[type="checkbox"]');
              await convention.check();
              assert.equal(await methodOutput.textContent(),'40 + 30 + 500 = 570');
              await convention.uncheck();
            }
          }
          await methods.locator('.daily-sources summary').click();
          assert.match(await methods.locator('a').first().getAttribute('href'),/Genesis\.2\.2/);
          await page.selectOption('#lang', locale === 'he' ? 'en' : 'he');
          assert.equal(await methodOutput.textContent(),'ש־ב־ת');
          await page.selectOption('#lang', locale);
          await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),false);
          await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
          await page.click('#sefirot-summary');
          await page.click('[data-sefirah="5"]');
          assert.equal(await page.locator('#sefirah-name').textContent(), 'תפארת');
          await page.click('#count-daat');
          assert.equal(await page.locator('#sefirot-grid button').count(), 10);
          assert.equal(await page.locator('#count-daat').getAttribute('aria-pressed'), 'true');
          assert.equal(await page.locator('#sefirah-name').textContent(), 'דעת');
          await page.selectOption('#lang', locale === 'he' ? 'en' : 'he');
          assert.equal(await page.locator('#sefirah-name').textContent(), 'דעת');
          await page.selectOption('#lang', locale);
          await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
          await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
        }
        if (episode.id === 18) {
          const currentButton = await page.locator('[data-study="3"]').elementHandle();
          await page.click('[data-study="3"]');
          assert.equal(await page.locator('#workbench output bdi').textContent(), 'עשייה');
          assert.ok(await currentButton.evaluate(button => button.isConnected && button === document.activeElement));
          assert.ok((await page.locator('#workbench .world-description').textContent()).length > 30);
          for (const card of [1,2,0]) await page.click('[data-sequence="' + card + '"]');
          assert.equal(await page.locator('#sequence li').count(), 3);
        }
        if (episode.id === 17 || episode.id === 19) {
          const initial = await page.locator('#world').evaluate(canvas => canvas.toDataURL());
          await page.click(episode.id === 17 ? '[data-layer="north-africa"]' : '[data-layer="city-walls"]');
          assert.notEqual(await page.locator('#world').evaluate(canvas => canvas.toDataURL()), initial);
          if (episode.id === 19) {
            await page.click('[data-layer="kotel-courses"]');
            await page.click('[data-evidence="3"]');
            assert.match(await page.locator('#evidence-date').textContent(), /1920/);
          }
        }
        if (episode.id === 23) {
          await page.click('#photo-button');
          await page.locator('#compare-history').waitFor();
          assert.match(await page.locator('#compare-history').textContent(), /1967/);
          assert.equal(await page.locator('#compare-history-source').getAttribute('href'), 'https://whc.unesco.org/document/8721');
          await page.locator('#photo form button').click();
        }
        if (episode.id === 17) {
          assert.equal(loadedLessons.has('diaspora-lessons.js'),false);
          const archiveRequest = page.waitForResponse(response => response.url().endsWith('/diaspora-lessons.js'));
          await page.click('#diaspora-button');
          assert.ok((await archiveRequest).ok());
          await page.selectOption('#diaspora-record','alice-kindertransport-1939');
          assert.match(await page.locator('.diaspora-reading a').getAttribute('href'), /oral-history/);
          await page.click('.diaspora-exercise summary');
          for (const sample of archiveCases) {
            await page.selectOption('#diaspora-example',sample.id);
            await page.click('[data-archive-answer="' + sample.others[0] + '"]');
            const answer = diasporaRecords.find(record => record.id === sample.answer);
            const feedback = page.locator('.diaspora-exercise [role="status"]');
            assert.notEqual(await feedback.innerText(), answer.evidence[locale]);
            await page.click('[data-archive-answer="' + sample.answer + '"]');
            assert.equal(await feedback.innerText(), answer.evidence[locale]);
            await page.click('.diaspora-review');
            assert.equal(await page.locator('#diaspora-record').inputValue(), sample.answer);
            assert.equal(await page.locator('.diaspora-date bdi').innerText(), answer.date[locale]);
          }
          await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
          assert.equal(await page.locator('#library').evaluate(dialog => dialog.scrollWidth > dialog.clientWidth), false);
          await page.keyboard.press('Escape');
          assert.ok(await page.locator('#diaspora-button').evaluate(button => button === document.activeElement));
          await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
        }
        if (episode.id === 20) {
          assert.equal(loadedLessons.has('messianic-lessons.js'), false);
          const timelineRequest = page.waitForResponse(response => response.url().endsWith('/messianic-lessons.js'));
          await page.click('#messianic-timeline summary');
          assert.ok((await timelineRequest).ok());
          await page.click('[data-timeline-card="messianic-frank-lwow"]');
          assert.equal(await page.locator('.timeline-order li').count(), 0);
          assert.match(await page.locator('.timeline-reading a').first().getAttribute('href'), /yivo/);
          for (const id of messianicLessons.activity.correctOrder) {
            await page.click('[data-timeline-card="' + id + '"]');
          }
          assert.equal(await page.locator('.timeline-order li').count(), 5);
          const textIndex = ['tr','en','he','az'].indexOf(locale);
          assert.equal(await page.locator('.timeline-status').innerText(), messianicLessons.activity.feedback[textIndex]);
          await page.click('.timeline-reset');
          assert.equal(await page.locator('.timeline-order li').count(), 0);
          await page.click('#messianic-timeline summary');
        }
        if (episode.id === 21) {
          for (const card of [1,3,2,0,4]) await page.click('[data-sequence="' + card + '"]');
          const dates = await page.locator('#sequence li').allTextContents();
          assert.deepEqual(dates.map(item => item.match(/\d+/)[0]), ['1917','1928','1929','1930','1931']);
          if (width === 320) {
            await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),false);
            await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
          }
        }
        if (episode.id === 22) {
          await page.click('[data-layer="holocaust"]');
          const firstNote = await page.locator('#models output').textContent();
          await page.click('[data-layer="nakba"]');
          assert.notEqual(await page.locator('#models output').textContent(), firstNote);
        }
        if (episode.id === 22) {
          const localIndex = ['tr','en','he','az'].indexOf(locale);
          assert.equal(loadedLessons.has('press-lessons.js'),false);
          const pressRequest = page.waitForResponse(response => response.url().endsWith('/press-lessons.js'));
          const press = page.locator('#press-timeline');
          await press.locator('summary').press('Enter');
          assert.ok((await pressRequest).ok());
          const order = press.locator('.timeline-order li');
          const card = id => press.locator('[data-timeline-card="' + id + '"]');
          await card('press-bund-autonomy').press('Enter');
          assert.equal(await order.count(),0);
          assert.match(await press.locator('.timeline-reading a').first().getAttribute('href'),/our-demands$/);
          for (const [index, record] of pressLessons.cards.entries()) {
            if (width === 320) await card(record.id).tap();
            else await card(record.id).press('Enter');
            assert.equal(await order.count(),index+1);
            assert.equal(await press.locator('.timeline-reading a').first().getAttribute('href'),record.source.url);
            if (index === 2) {
              await page.selectOption('#lang',locale === 'he' ? 'az' : 'he');
              await order.nth(index).waitFor();
              assert.equal(await card(record.id).isDisabled(),true);
              await page.selectOption('#lang',locale);
              await order.nth(index).waitFor();
              assert.equal(await order.nth(index).textContent(),record.date[localIndex] + ' · ' + record.title[localIndex]);
            }
          }
          assert.equal(await press.locator('.timeline-status').textContent(),pressLessons.activity.feedback[localIndex]);
          await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),false);
          await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
          await press.locator('.timeline-reset').press('Enter');
          assert.equal(await order.count(),0);
          assert.equal(loadedLessons.has('displacement-lessons.js'),false);
          const archiveRequest = page.waitForResponse(response => response.url().endsWith('/displacement-lessons.js'));
          const archive = page.locator('#displacement');
          await archive.locator(':scope > summary').press('Enter');
          assert.ok((await archiveRequest).ok());
          assert.equal(await press.getAttribute('open'),null);
          const recordSelect = archive.locator('#displacement-record');
          await recordSelect.waitFor();
          const details = archive.locator('.relocation-sources');
          const note = details.locator('[role=status]');
          const answer = choice => archive.locator('[data-displacement-answer="' + choice + '"]');
          assert.equal(await recordSelect.locator('option').count(),5);
          assert.equal(await details.getAttribute('open'),null);
          assert.equal(await answer(0).isVisible(),false);
          await details.locator('summary').press('Enter');
          for (const record of displacementRecords) {
            await recordSelect.selectOption(record.id);
            assert.equal(await archive.locator('article > p').textContent(),record.summary[localIndex]);
            assert.equal(await details.locator('ol li').count(),record.steps.length);
            assert.deepEqual(await details.locator('a').evaluateAll(links => links.map(link => link.href)),
              record.sources.map(source => source.url));
            const alternative = 1-record.correct;
            await answer(alternative).press('Enter');
            assert.equal(await note.textContent(),record.feedback[alternative][localIndex]);
            if (width === 320) await answer(record.correct).tap();
            else await answer(record.correct).press('Enter');
            assert.equal(await note.textContent(),record.feedback[record.correct][localIndex]);
          }
          await page.selectOption('#lang',locale === 'he' ? 'az' : 'he');
          await note.waitFor();
          assert.equal(await recordSelect.inputValue(),'iraq-sawdai-departure');
          assert.equal(await answer(0).getAttribute('aria-pressed'),'true');
          await page.selectOption('#lang',locale);
          await note.waitFor();
          assert.equal(await note.textContent(),displacementRecords.at(-1).feedback[0][localIndex]);
          await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),false);
          await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
          await archive.locator(':scope > summary').press('Enter');
        }
        if (episode.id === 24) {
          assert.equal(loadedLessons.has('ashlag-lessons.js'),false);
          const ashlag = page.locator('#ashlag-workbench');
          await ashlag.locator(':scope > summary').press('Enter');
          const diagram = ashlag.locator('canvas');
          await diagram.waitFor();
          const localIndex = ['tr','en','he','az'].indexOf(locale);
          const frames = new Set();
          for (const phase of ashlagPhases) {
            await ashlag.locator('[data-ashlag-phase="' + phase.id + '"]').press('Enter');
            frames.add(await diagram.evaluate(canvas => canvas.toDataURL()));
            assert.equal(await ashlag.locator('figcaption').textContent(),phase.text[localIndex]);
            assert.equal(await ashlag.locator('#ashlag-phase-source').getAttribute('href'),phase.link);
            assert.equal(await ashlag.locator('#ashlag-action').isVisible(),phase.id === 'dalet');
          }
          assert.equal(frames.size,ashlagPhases.length);
          const action = ashlag.locator('#ashlag-action');
          for (const [index, step] of ashlagScreen.entries()) {
            assert.equal(await ashlag.locator('.ashlag-screen p').textContent(),step.text[localIndex]);
            assert.equal(await ashlag.locator('#ashlag-step-source').getAttribute('href'),step.link);
            frames.add(await diagram.evaluate(canvas => canvas.toDataURL()));
            if (index === ashlagScreen.length - 1) break;
            if (width === 320) await action.tap();
            else await action.press('Enter');
          }
          assert.equal(frames.size,ashlagPhases.length + ashlagScreen.length - 1);
          await ashlag.locator('.ashlag-comparison summary').press('Enter');
          assert.match(await ashlag.locator('.ashlag-comparison a').first().getAttribute('href'),/Sefer_Etz_Chaim/);
          assert.match(await ashlag.locator('.ashlag-comparison a').last().getAttribute('href'),/#section-6$/);
          await page.selectOption('#lang', locale === 'he' ? 'az' : 'he');
          assert.equal(await ashlag.locator('#ashlag-step-source').getAttribute('href'),ashlagScreen.at(-1).link);
          await page.selectOption('#lang',locale);
          await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),false);
          await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
          await ashlag.locator(':scope > summary').press('Enter');
          assert.equal(loadedLessons.has('study-circle-lessons.js'),false);
          const circle = page.locator('#study-circle');
          await circle.locator(':scope > summary').press('Enter');
          const portrait = circle.locator('canvas');
          await portrait.waitFor();
          const index = ['tr','en','he','az'].indexOf(locale);
          for (const turn of circleTurns) {
            assert.equal(await circle.locator('figcaption b').textContent(),turn.name[index]);
            const idle = await portrait.evaluate(canvas => canvas.toDataURL());
            const respond = choice => circle.locator('[data-circle-choice="' + choice + '"]');
            await respond(1 - turn.correct).press('Enter');
            assert.equal(await circle.locator('#circle-response').textContent(),turn.retry[index]);
            assert.equal(await circle.locator('#circle-next').isVisible(),false);
            if (width === 320) await respond(turn.correct).tap();
            else await respond(turn.correct).press('Enter');
            assert.equal(await circle.locator('#circle-response').textContent(),turn.response[index]);
            assert.notEqual(await portrait.evaluate(canvas => canvas.toDataURL()),idle);
            await circle.locator('.daily-sources summary').press('Enter');
            assert.deepEqual(await circle.locator('a').evaluateAll(links => links.map(link => link.href)),
              turn.sources.map(([,url]) => url));
            if (width === 320) {
              await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
              assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),false);
              await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
            }
            await circle.locator('#circle-next').press('Enter');
            assert.ok(await respond(0).evaluate(button => document.activeElement === button));
          }
          assert.equal(await circle.locator('figcaption b').textContent(),circleTurns[0].name[index]);
          assert.equal(loadedLessons.has('baku-lessons.js'),false);
          const baku = page.locator('#baku-archive');
          const bakuRequest = page.waitForResponse(response => response.url().endsWith('/baku-lessons.js'));
          await baku.locator(':scope > summary').press('Enter');
          assert.ok((await bakuRequest).ok());
          assert.equal(await circle.getAttribute('open'),null);
          const evidencePicture = baku.locator('canvas');
          await evidencePicture.waitFor();
          const bakuFrames = new Set();
          for (const [stopIndex, stop] of bakuStops.entries()) {
            await baku.locator('[data-baku-stop="' + stopIndex + '"]').press('Enter');
            for (const [sideIndex, side] of stop.views.entries()) {
              const sideButton = baku.locator('[data-baku-view="' + sideIndex + '"]');
              if (width === 320) await sideButton.tap();
              else await sideButton.press('Enter');
              bakuFrames.add(await evidencePicture.evaluate(canvas => canvas.toDataURL()));
              assert.equal(await baku.locator('figcaption span').textContent(),side.note[index]);
              const word = baku.locator('.baku-word');
              assert.equal(await word.isVisible(),Boolean(side.example));
              if (side.example) {
                assert.equal(await word.textContent(),side.example[0]);
                assert.equal(await word.getAttribute('lang'),'jdt-' + side.example[1]);
                assert.equal(await word.getAttribute('dir'),side.example[2]);
              }
            }
            assert.deepEqual(await baku.locator('a').evaluateAll(links => links.map(link => link.href)),
              stop.sources.map(source => source.url));
            const answer = choice => baku.locator('[data-baku-answer="' + choice + '"]');
            const status = baku.locator('.baku-exercise [role=status]');
            await answer((stop.correct + 1) % stop.answers.length).press('Enter');
            assert.equal(await status.textContent(),bakuCopy[3][index]);
            await answer(stop.correct).press('Enter');
            assert.equal(await status.textContent(),stop.feedback[index]);
          }
          assert.equal(bakuFrames.size,8);
          await page.selectOption('#lang',locale === 'he' ? 'az' : 'he');
          await baku.locator('[data-baku-stop="2"][aria-pressed=true]').waitFor();
          assert.equal(await baku.locator('[data-baku-view="1"]').getAttribute('aria-pressed'),'true');
          assert.equal(await baku.locator('[data-baku-answer="2"]').getAttribute('aria-pressed'),'true');
          await page.selectOption('#lang',locale);
          await baku.locator('[data-baku-stop="2"][aria-pressed=true]').waitFor();
          await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),false);
          await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
          await baku.locator(':scope > summary').press('Enter');
          await page.click('[data-evidence="4"]');
          assert.match(await page.locator('#evidence-date').textContent(), /2025/);
          assert.equal(await page.locator('#evidence-source').getAttribute('href'),
            'https://www.un.org/unispal/document/commission-of-inquiry-report-genocide-in-gaza-a-hrc-60-crp-3/');
          await page.click('[data-evidence="5"]');
          assert.equal(await page.locator('#evidence-source').getAttribute('href'),
            'https://embassies.gov.il/ungeneva/en/news/16-09-2025');
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
        await page.click('[data-choice="' + episode.correct + '"]');
        const transfer = transferLessons.find(item => item.chapter === episode.id);
        if (transfer) {
          const filename = transferDecks[Math.floor((episode.id - 1) / 8)];
          if (episode.id % 8 === 1) assert.equal(loadedLessons.has(filename), false);
          const summary = page.locator('#transfer summary');
          if (width === 320) await summary.tap();
          else await summary.press('Enter');
          const correct = page.locator('[data-transfer-choice="' + transfer.correct + '"]');
          await correct.waitFor();
          assert.ok(loadedLessons.has(filename));
          assert.equal(await page.locator('#transfer-scenario').textContent(), transfer.scenario[locale]);
          assert.deepEqual(await page.locator('#transfer-sources a').evaluateAll(links =>
            links.map(link => link.href)), transfer.sources.map(source => source.url));
          await page.click('[data-transfer-choice="' + (transfer.correct + 1) % 3 + '"]');
          assert.ok((await page.locator('#transfer-feedback').textContent()).length);
          assert.equal(await page.locator('#transfer-draft').isVisible(), false);
          await correct.click();
          assert.equal(await page.locator('#transfer-feedback').textContent(), transfer.feedback[locale]);
          assert.equal(await correct.getAttribute('aria-pressed'), 'true');
          if (episode.id === 1) {
            await page.fill('#transfer-draft', 'WALL ' + locale);
            await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
            await page.reload();
            await page.locator('#app').waitFor();
            await page.click('#transfer summary');
            assert.equal(await page.locator('#transfer-draft').inputValue(), 'WALL ' + locale);
            assert.equal(await page.locator('#transfer-feedback').textContent(), transfer.feedback[locale]);
          }
        }
        if (episode.id !== 24) await page.click('#next');
      }
      await page.selectOption('#tour-stops select >> nth=0', 'photo');
      assert.equal(await page.locator('#tour-present').isDisabled(), true);
      const tourStops = page.locator('#tour-stops details');
      await tourStops.first().locator('[data-tour-claim="overclaim"]').first().click();
      assert.equal(await page.locator('#tour-question').isDisabled(), true);
      await tourStops.first().locator('[data-tour-claim="supported"]').click();
      for (const index of [1,2]) {
        await tourStops.nth(index).locator('summary').click();
        await tourStops.nth(index).locator('[data-tour-claim="supported"]').click();
      }
      assert.equal(await page.locator('#tour-question option').count(), 4);
      assert.equal(await page.locator('#tour-present').isDisabled(), true);
      await page.selectOption('#tour-question', 'photo');
      assert.ok((await page.locator('#tour-question-preview').innerText()).trim());
      await page.fill('#journal-text', 'WALL');
      await page.click('#tour-present');
      await page.locator('#tour-presentation[open]').waitFor();
      assert.equal(await page.locator('#tour-presentation li').count(), 3);
      assert.equal(await page.locator('.tour-open-question').innerText(), await page.locator('#tour-question-preview').innerText());
      assert.equal(await page.locator('.tour-personal-note').innerText(), 'WALL');
      await page.locator('.tour-personal-note').scrollIntoViewIfNeeded();
      assert.ok(await page.locator('#tour-presentation button').evaluate(button => {
        const rect = button.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      }));
      await page.keyboard.press('Escape');
      assert.ok(await page.locator('#tour-present').evaluate(button => document.activeElement === button));
      await page.reload();
      await page.locator('#tour-builder').waitFor();
      assert.equal(await page.locator('#journal-text').inputValue(), 'WALL');
      assert.equal(await page.locator('#tour-stops select').first().inputValue(), 'photo');
      assert.equal(await page.locator('#tour-question').inputValue(), 'photo');
      assert.equal(await page.locator('#tour-present').isEnabled(), true);
      await page.click('#library-button');
      await page.locator('#library[open]').waitFor();
      assert.ok(await page.locator('#library details').count() >= 8);
      assert.equal(loadedLessons.has('calendar-lessons.js'), false);
      const calendarRequest = page.waitForResponse(response => response.url().endsWith('/calendar-lessons.js'));
      if (width === 320) await page.tap('#calendar summary');
      else await page.click('#calendar summary');
      assert.ok((await calendarRequest).ok());
      await page.locator('[data-event="simchat-torah"]').waitFor();
      await page.click('[data-event="simchat-torah"]');
      assert.match(await page.locator('[data-event="simchat-torah"]').innerText(), /^22/);
      await page.selectOption('#calendar-custom', 'diaspora');
      assert.match(await page.locator('[data-event="simchat-torah"]').innerText(), /^23/);
      assert.equal(await page.locator('[data-event="simchat-torah"]').getAttribute('aria-pressed'), 'true');
      await page.selectOption('#calendar-period', '12');
      await page.locator('[data-event="purim"]').waitFor();
      await page.selectOption('#calendar-year', 'leap');
      assert.equal(await page.locator('[data-event="purim"]').count(), 0);
      await page.selectOption('#calendar-period', '13');
      await page.click('[data-event="purim"]');
      assert.match(await page.locator('.calendar-reading a').getAttribute('href'), /Esther/);
      await page.selectOption('#calendar-period', '8');
      await page.locator('[data-event="sigd"]').waitFor();
      await page.click('.calendar-practice summary');
      await page.selectOption('#calendar-answer', '7');
      await page.click('.calendar-practice button');
      assert.doesNotMatch(await page.locator('.calendar-practice [role="status"]').innerText(), /15/);
      await page.selectOption('#calendar-answer', '1');
      await page.click('.calendar-practice button');
      assert.match(await page.locator('.calendar-practice [role="status"]').innerText(), /15/);
      await page.click('.calendar-practice button');
      assert.equal(await page.locator('#calendar-answer').inputValue(), '');
      assert.equal(loadedLessons.has('atlas-lessons.js'), false);
      const atlasRequest = page.waitForResponse(response => response.url().endsWith('/atlas-lessons.js'));
      await page.click('#atlas summary');
      assert.ok((await atlasRequest).ok());
      await page.locator('#atlas-search').waitFor();
      await page.fill('#atlas-search', locale === 'he' ? 'קִירְמִיזִי' : 'Qirmizi Qesebe');
      assert.equal(await page.locator('#atlas-entry').inputValue(), 'mountain-jews-juhuri');
      assert.equal(await page.locator('.atlas-marker').count(), 2);
      assert.match(await page.locator('#atlas-source').getAttribute('href'), /jewishlanguages.org/);
      await page.waitForFunction(() => document.querySelector('.atlas-map img').naturalWidth === 384);
      await page.selectOption('#atlas-category', 'movements');
      assert.equal(await page.locator('#atlas-entry').isDisabled(), true);
      await page.fill('#atlas-search', '');
      assert.equal(await page.locator('#atlas-entry option').count(), 16);
      await page.selectOption('#atlas-entry', 'reconstructionist');
      assert.match(await page.locator('#atlas-source').getAttribute('href'), /reconstructingjudaism.org/);
      await page.selectOption('#atlas-category', 'communities');
      assert.equal(await page.locator('#atlas-entry option').count(),14);
      await page.selectOption('#atlas-entry','iraqi-baghdadi-rite');
      assert.equal(await page.locator('.atlas-marker').count(),2);
      assert.match(await page.locator('#atlas-source').getAttribute('href'),/item\/10065$/);
      await page.selectOption('#atlas-entry','iranian-judeo-persian');
      assert.match(await page.locator('.atlas-reading p').first().textContent(),/1319/);
      assert.match(await page.locator('#atlas-source').getAttribute('href'),/032-003384430$/);
      assert.equal(await page.locator('.atlas-figure').isVisible(),false);
      await page.selectOption('#atlas-entry', 'mizrahim');
      assert.equal(await page.locator('.atlas-figure').isVisible(), false);
      await page.selectOption('#atlas-category', 'ancient');
      assert.equal(await page.locator('#atlas-entry option').count(), 4);
      await page.selectOption('#atlas-entry', 'samaritans-israelite-tradition');
      assert.match(await page.locator('#atlas-source').getAttribute('href'), /MS-SAMARITAN-00001/);
      assert.equal(await page.locator('.atlas-marker').count(), 1);
      await page.fill('#atlas-search', 'Qumran');
      assert.equal(await page.locator('#atlas-entry').inputValue(), 'essenes-qumran-debate');
      await page.locator('#atlas-context').waitFor();
      assert.match(await page.locator('#atlas-context').getAttribute('href'), /deadseascrolls.org.il/);
      const otherLanguage = locale === 'he' ? 'en' : 'he';
      const qumran = atlasEntries.find(entry => entry.id === 'essenes-qumran-debate');
      await page.click('#library form button');
      await page.selectOption('#lang',otherLanguage);
      await page.click('#library-button');
      await page.locator('#atlas-context').waitFor();
      assert.equal(await page.locator('#atlas-category').inputValue(), 'ancient');
      assert.equal(await page.locator('#atlas-search').inputValue(), 'Qumran');
      assert.equal(await page.locator('#atlas-entry').inputValue(), 'essenes-qumran-debate');
      assert.equal(await page.locator('.atlas-reading h3').textContent(),qumran.name[otherLanguage]);
      await page.click('#library form button');
      await page.selectOption('#lang',locale);
      await page.click('#library-button');
      await page.locator('#atlas-context').waitFor();
      assert.equal(await page.locator('.atlas-reading h3').textContent(),qumran.name[locale]);
      await page.fill('#atlas-search', '');
      await page.selectOption('#atlas-category','movements');
      await page.selectOption('#atlas-entry','belz-hasidism');
      assert.equal(await page.locator('.atlas-marker').count(),3);
      assert.match(await page.locator('#atlas-source').getAttribute('href'),/sztetl\.org\.pl/);
      await page.selectOption('#atlas-category','identities');
      assert.equal(await page.locator('#atlas-entry').inputValue(),'israeli-religiosity-labels');
      const identity = atlasEntries.find(entry => entry.id === 'israeli-religiosity-labels').exercise;
      const identityIndex = ['tr','en','he','az'].indexOf(locale);
      const identityChoices = page.locator('.atlas-exercise button');
      const identityResult = page.locator('.atlas-exercise [role=status]');
      await identityChoices.nth(1).press('Enter');
      assert.equal(await identityResult.textContent(),identity.feedback[1][identityIndex]);
      if (width === 320) await identityChoices.first().tap();
      else await identityChoices.first().press('Enter');
      assert.equal(await identityResult.textContent(),identity.feedback[0][identityIndex]);
      await page.click('#library form button');
      await page.selectOption('#lang',otherLanguage);
      await page.click('#library-button');
      await identityChoices.first().waitFor();
      assert.equal(await identityChoices.first().getAttribute('aria-pressed'),'true');
      assert.equal(await identityResult.textContent(),identity.feedback[0][['tr','en','he','az'].indexOf(otherLanguage)]);
      await page.click('#library form button');
      await page.selectOption('#lang',locale);
      await page.click('#library-button');
      await identityChoices.first().waitFor();
      assert.equal(loadedLessons.has('kabbalah-lessons.js'), false);
      assert.equal(loadedLessons.has('kabbalah-advanced-lessons.js'), false);
      const workshopRequest = page.waitForResponse(response => response.url().endsWith('/kabbalah-lessons.js'));
      await page.click('#kabbalah summary');
      assert.ok((await workshopRequest).ok());
      await page.locator('#kabbalah-lesson').waitFor();
      assert.equal(await page.locator('#kabbalah-lesson option').count(), 20);
      assert.equal(await page.locator('#kabbalah-lesson optgroup').count(), 2);
      assert.ok(loadedLessons.has('kabbalah-advanced-lessons.js'));
      await page.click('.kabbalah-exercise summary');
      for (const sample of [...feynmanCases,...comparisonCases]) {
        await page.selectOption('#kabbalah-lesson', sample.lessonId);
        await page.click('[data-case-choice="' + (sample.correct + 1) % sample.choices.length + '"]');
        assert.equal(await page.locator('#kabbalah-draft').isVisible(), false);
        await page.click('[data-case-choice="' + sample.correct + '"]');
        const text = sample.feedback[['tr','en','he','az'].indexOf(locale)];
        assert.equal(await page.locator('.kabbalah-feedback').innerText(), text);
        await page.fill('#kabbalah-draft', 'WALL ' + sample.id);
      }
      await page.selectOption('#kabbalah-lesson', 'laitman-bnei-baruch');
      await page.click('.kabbalah-sources summary');
      assert.equal(await page.locator('.kabbalah-sources li').count(), 2);
      assert.match(await page.locator('.kabbalah-sources a').last().getAttribute('href'), /cris.bgu.ac.il/);
      await page.selectOption('#kabbalah-lesson', 'prayer-intention-cleaving');
      assert.equal(await page.locator('.kabbalah-sources li').count(), 5);
      assert.match(await page.locator('.kabbalah-sources a').nth(1).getAttribute('href'), /Mishnah_Berakhot\.5\.1/);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      assert.equal(await page.locator('#library').evaluate(dialog => dialog.scrollWidth > dialog.clientWidth), false);
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
      await page.selectOption('#kabbalah-lesson', 'rabash-purpose-of-society');
      assert.equal(await page.locator('#kabbalah-draft').inputValue(), 'WALL rabash-group-application');
      await page.selectOption('#kabbalah-lesson', 'nefesh-hachaim-gate3');
      await page.keyboard.press('Escape');
      await page.selectOption('#lang', locale === 'he' ? 'tr' : 'he');
      await page.click('#library-button');
      await page.locator('.kabbalah-reading h3').waitFor();
      assert.equal(await page.locator('#kabbalah-lesson').inputValue(), 'nefesh-hachaim-gate3');
      assert.equal(await page.locator('#kabbalah-draft').inputValue(), 'WALL tzimtzum-tanya-nefesh');
      await page.keyboard.press('Escape');
      await page.selectOption('#lang', locale);
      await page.click('#library-button');
      assert.equal(loadedLessons.has('language-lessons.js'), false);
      const languageRequest = page.waitForResponse(response => response.url().endsWith('/language-lessons.js'));
      await page.click('#language-study summary');
      assert.ok((await languageRequest).ok());
      await page.selectOption('#language-card', 'lang-malka');
      const aramaic = page.locator('.language-word bdi[dir="rtl"]');
      assert.equal(await aramaic.getAttribute('lang'), 'arc');
      assert.equal(await aramaic.innerText(), 'מַלְכָּא');
      await page.click('.language-pointing');
      assert.equal(await aramaic.innerText(), 'מלכא');
      await page.click('.language-pointing');
      assert.equal(await aramaic.innerText(), 'מַלְכָּא');
      await page.click('.language-sources summary');
      assert.match(await page.locator('.language-sources a').first().getAttribute('href'), /Daniel\.2\.4/);
      await page.click('.language-exercise summary');
      for (const sample of languageLessons.exercises) {
        await page.selectOption('#language-example', sample.id);
        await page.click('[data-language-choice="' + (sample.correct + 1) % sample.options.length + '"]');
        const message = page.locator('.language-exercise [role="status"]');
        const text = sample.feedback[['tr','en','he','az'].indexOf(locale)];
        assert.notEqual(await message.innerText(), text);
        await page.click('[data-language-choice="' + sample.correct + '"]');
        assert.equal(await message.innerText(), text);
      }
      assert.equal(loadedLessons.has('daily-lessons.js'),false);
      const dailyRequest = page.waitForResponse(response => response.url().endsWith('/daily-lessons.js'));
      await page.click('#daily-life summary');
      assert.ok((await dailyRequest).ok());
      const dailyObject = page.locator('#daily-life canvas');
      await dailyObject.waitFor();
      const market = await dailyObject.evaluate(canvas => canvas.toDataURL());
      await page.selectOption('#daily-topic','ketubah-marriage');
      assert.notEqual(await dailyObject.evaluate(canvas => canvas.toDataURL()),market);
      await page.click('.daily-sources summary');
      assert.match(await page.locator('.daily-sources a').first().getAttribute('href'),/Mishnah_Ketubot/);
      await page.click('.daily-exercise summary');
      for (const sample of dailyCases) {
        await page.selectOption('#daily-example',sample.id);
        await page.click('[data-daily-choice="' + sample.alternatives[0] + '"]');
        const status = page.locator('.daily-exercise [role="status"]');
        const text = sample.feedback[['tr','en','he','az'].indexOf(locale)];
        assert.notEqual(await status.innerText(),text);
        await page.click('[data-daily-choice="' + sample.answer + '"]');
        assert.equal(await status.innerText(),text);
      }
      assert.equal(loadedLessons.has('culture-lessons.js'),false);
      await page.click('#culture-archive summary');
      const cultureImage = page.locator('#culture-archive canvas');
      const cultureSelect = page.locator('#culture-object');
      await cultureImage.waitFor();
      const textures = new Set();
      for (const item of cultureRecords) {
        await cultureSelect.selectOption(item.id);
        textures.add(await cultureImage.evaluate(canvas => canvas.toDataURL()));
      }
      assert.equal(textures.size,cultureRecords.length);
      await page.click('#culture-archive .daily-sources summary');
      assert.match(await page.locator('#culture-archive .daily-sources a').first().getAttribute('href'),/lashon.org\/en\/node\/9467/);
      for (const sample of cultureCases) {
        await cultureSelect.selectOption(sample.recordId);
        if (await page.locator('#culture-archive .visit-exercise').getAttribute('open') === null) {
          await page.click('#culture-archive .visit-exercise summary');
        }
        await page.click('[data-culture-choice="' + (sample.correct + 1) % 3 + '"]');
        const result = page.locator('#culture-archive .visit-exercise [role="status"]');
        assert.ok((await result.textContent()).length);
        await page.click('[data-culture-choice="' + sample.correct + '"]');
        assert.equal(await result.textContent(),sample.feedback[['tr','en','he','az'].indexOf(locale)]);
      }
      assert.equal(loadedLessons.has('accountability-lessons.js'),false);
      await page.click('#accountability-archive summary');
      const eventSelect = page.locator('#accountability-record');
      const eventPanel = page.locator('#accountability-archive');
      const eventLocale = ['tr','en','he','az'].indexOf(locale);
      for (const record of accountabilityRecords) {
        await eventSelect.selectOption(record.id);
        assert.equal(await eventPanel.locator('h3').innerText(),record.title[eventLocale]);
        const sources = eventPanel.locator('.daily-sources');
        if (await sources.getAttribute('open') === null) await sources.locator('summary').click();
        assert.equal(await sources.locator('a').first().getAttribute('href'),record.sources[0].url);
        const sample = accountabilityCases[record.id];
        const exercise = eventPanel.locator('.visit-exercise');
        if (!sample) {
          assert.equal(await exercise.isVisible(),false);
          continue;
        }
        if (await exercise.getAttribute('open') === null) await exercise.locator('summary').click();
        const status = exercise.locator('[role="status"]');
        await exercise.locator('[data-accountability-choice="' + (1 - sample.correct) + '"]').click();
        assert.notEqual(await status.textContent(),sample.result[eventLocale]);
        await exercise.locator('[data-accountability-choice="' + sample.correct + '"]').click();
        assert.equal(await status.textContent(),sample.result[eventLocale]);
      }
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      assert.equal(await page.locator('#library').evaluate(dialog => dialog.scrollWidth > dialog.clientWidth), false);
      await page.keyboard.press('Escape');
      assert.ok(await page.locator('#library-button').evaluate(button => button === document.activeElement));
      await page.reload();
      await page.click('#library-button');
      await page.click('#kabbalah summary');
      await page.selectOption('#kabbalah-lesson', 'rabash-purpose-of-society');
      await page.click('.kabbalah-exercise summary');
      assert.equal(await page.locator('#kabbalah-draft').inputValue(), 'WALL rabash-group-application');
      await page.keyboard.press('Escape');
      await page.click('#next');
      await page.waitForURL('**/#game');
      assert.deepEqual(errors, []);
      await page.close();
      console.log(locale, width, '25 checkpoints, workshops and saved evidence exhibition: PASS');
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
    async function native(action) {
      await padPage.evaluate(value => window.dispatchEvent(new CustomEvent('wall-controller', {
        detail:{action:value,pressed:true},
      })), action);
    }
    await native('next');
    assert.equal(await padPage.evaluate(() => document.activeElement.parentElement.id), 'calendar');
    await native('activate');
    await padPage.locator('#calendar-period').waitFor();
    await native('next');
    assert.equal(await padPage.evaluate(() => document.activeElement.id), 'calendar-period');
    await native('activate');
    await padPage.locator('[data-event="sigd"]').waitFor();
    await native('back');
    assert.equal(await padPage.locator('#library[open]').count(), 0);
    await padPage.close();
    console.log('Gamepad browser mapping and native event path (simulated): PASS');

    const source = await browser.newPage({locale:'he',viewport:{width:320,height:700},hasTouch:true});
    await source.goto(target);
    await source.locator('#app').waitFor();
    await source.selectOption('#lang','he');
    await source.click('[data-choice="' + plaza.correct + '"]');
    await source.click('#next');
    await source.click('[data-choice="' + chapters[0].correct + '"]');
    await source.tap('#transfer summary');
    await source.tap('[data-transfer-choice="' + transferLessons[0].correct + '"]');
    await source.fill('#transfer-draft','בדיקת שמירה');
    await source.click('#next');
    await source.tap('#settings-button');
    await source.tap('#save-transfer summary');
    await source.tap('#save-export');
    const saved = await source.locator('#save-output').inputValue();
    assert.ok(saved.includes('בדיקת שמירה'));
    await source.close();

    const restore = await browser.newPage({locale:'tr',viewport:{width:320,height:700},hasTouch:true});
    await restore.goto(target);
    await restore.locator('#app').waitFor();
    await restore.tap('#settings-button');
    await restore.tap('#save-transfer summary');
    await restore.fill('#save-input','not a WALL save');
    await restore.tap('#save-review');
    assert.equal(await restore.locator('#save-confirm').isHidden(),true);
    await restore.fill('#save-input',saved);
    await restore.tap('#save-review');
    await restore.locator('#save-confirm').waitFor();
    await restore.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    assert.equal(await restore.locator('#settings').evaluate(d => d.scrollWidth > d.clientWidth),false);
    await restore.tap('#save-confirm');
    await restore.locator('#restore-notice').waitFor();
    assert.equal(await restore.locator('#chapter').textContent(),'2');
    assert.equal(await restore.locator('html').getAttribute('dir'),'rtl');
    await restore.click('#episodes-button');
    await restore.locator('#chapters button').nth(1).click();
    await restore.tap('#transfer summary');
    assert.equal(await restore.locator('#transfer-draft').inputValue(),'בדיקת שמירה');
    await restore.close();
    console.log('Export, invalid-save rejection, restore into a separate profile and Hebrew draft: PASS');

    const reading = await browser.newPage({locale:'az',viewport:{width:320,height:700},hasTouch:true,colorScheme:'dark'});
    await reading.goto(target);
    await reading.locator('#app').waitFor();
    await reading.tap('#settings-button');
    const behindSettings = await reading.locator('#world').evaluate(canvas => canvas.toDataURL());
    await reading.keyboard.down('ArrowRight');
    await reading.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
    await reading.keyboard.up('ArrowRight');
    await reading.keyboard.press('e');
    assert.equal(await reading.locator('#world').evaluate(canvas => canvas.toDataURL()),behindSettings);
    assert.ok(await reading.locator('#settings').evaluate(dialog => dialog.contains(document.activeElement)));
    await reading.selectOption('#theme','light');
    assert.equal(await reading.locator('html').getAttribute('data-theme'),'light');
    assert.equal(await reading.evaluate(() => getComputedStyle(document.documentElement).colorScheme),'light');
    await reading.selectOption('#theme','system');
    assert.equal(await reading.locator('html').getAttribute('data-theme'),'dark');
    await reading.emulateMedia({colorScheme:'light'});
    await reading.waitForFunction(() => document.documentElement.dataset.theme === 'light');
    await reading.selectOption('#theme','contrast');
    await reading.selectOption('#motion','reduce');
    await reading.locator('#text-scale').press('End');
    assert.equal(await reading.locator('#text-scale').getAttribute('aria-valuetext'),'200%');
    assert.equal(await reading.locator('#settings').evaluate(dialog => dialog.scrollWidth > dialog.clientWidth),false);
    await reading.reload();
    await reading.locator('#app').waitFor();
    assert.equal(await reading.locator('html').getAttribute('data-theme'),'contrast');
    assert.ok(await reading.locator('html').evaluate(root => root.hasAttribute('data-reduced-motion')));
    assert.equal(await reading.evaluate(() => getComputedStyle(document.documentElement).fontSize),'32px');
    await reading.tap('#settings-button');
    await reading.tap('#scale-reset');
    assert.equal(await reading.locator('#text-scale').inputValue(),'100');
    assert.equal(await reading.locator('#theme').inputValue(),'contrast');
    assert.equal(await reading.locator('#motion').inputValue(),'reduce');
    await reading.close();
    console.log('Reading appearance, system theme reactivity and independent saved input preferences: PASS');

    for (const locale of ['tr','en','he','az']) {
      const recovery = await browser.newPage({locale,viewport:{width:320,height:560}});
      await recovery.route('**/visitor.png', route => route.abort());
      await recovery.goto(target);
      await recovery.locator('#retry').waitFor();
      await recovery.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      for (const [width,height] of [[320,560],[568,320],[800,260]]) {
        await recovery.setViewportSize({width,height});
        assert.ok(await recovery.locator('#boot').evaluate(boot => {
          const shell = boot.querySelector('.boot-shell').getBoundingClientRect();
          const version = boot.querySelector('small').getBoundingClientRect();
          return version.top >= shell.bottom && document.documentElement.scrollWidth <= innerWidth;
        }),locale + ' ' + width + '×' + height + ' loading screen');
      }
      await recovery.unroute('**/visitor.png');
      await recovery.click('#retry');
      await recovery.locator('#app').waitFor();
      await recovery.close();
    }
    console.log('Loading error, readable version and retry in four locales: PASS');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
