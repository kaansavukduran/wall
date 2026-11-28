// Run via NODE_PATH pointing to an installation of playwright, or install it locally.
// WALL_BROWSER can select a local Chromium binary.
const assert = require('node:assert/strict');
const playwright = require('playwright');
const engine = process.env.WALL_BROWSER_ENGINE || 'chromium';
const target = process.argv[2] || 'http://127.0.0.1:8765/';
const browserOptions = engine === 'chromium' ? { args:['--no-sandbox', '--disable-dev-shm-usage'] } : {};
if (process.env.WALL_BROWSER) browserOptions.executablePath = process.env.WALL_BROWSER;

async function enterCampaign(page, input = 'click') {
  await page.locator('#app').waitFor();
  if (input === 'keyboard') await page.locator('#start-campaign').press('Enter');
  else if (input === 'tap') await page.tap('#start-campaign');
  else await page.click('#start-campaign');
  await page.locator('#campaign').waitFor();
}

function visitorFootprint(page) {
  // Read the sprite's shadow row to compare position across browser profiles.
  return page.locator('#world').evaluate(canvas =>
    Array.from(canvas.getContext('2d').getImageData(0,209,canvas.width,1).data));
}

async function main() {
  const { chapters, languages, plaza, ui } = await import('../content.js');
  const { ancientLessons } = await import('../ancient-lessons.js');
  const { secondTempleLessons } = await import('../second-temple-lessons.js');
  const { romanLessons } = await import('../roman-lessons.js');
  const { medievalLessons } = await import('../medieval-lessons.js');
  const { earlyModernLessons } = await import('../early-modern-lessons.js');
  const { modernLessons } = await import('../modern-lessons.js');
  const { feynmanCases } = await import('../kabbalah-lessons.js');
  const { advancedReadings, comparisonCases } = await import('../kabbalah-advanced-lessons.js');
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
  const { shabbatStudy } = await import('../calendar-lessons.js');
  const { archiveCases } = await import('../diaspora-archive.js');
  const { diasporaRecords } = await import('../diaspora-lessons.js');
  const { models } = await import('../scenes.js');
  const { messianicLessons } = await import('../messianic-lessons.js');
  const { pressLessons } = await import('../press-lessons.js');
  const { mandateLessons } = await import('../mandate-lessons.js');
  const { displacementRecords } = await import('../displacement-lessons.js');
  const lessons = {...ancientLessons, ...secondTempleLessons, ...romanLessons, ...medievalLessons, ...earlyModernLessons, ...modernLessons};
  const decks = ['ancient-lessons.js', 'second-temple-lessons.js', 'roman-lessons.js', 'medieval-lessons.js', 'early-modern-lessons.js', 'modern-lessons.js'];
  const browser = await playwright[engine].launch(browserOptions);
  try {
    for (const [locale, width] of [['tr',1100],['en',320],['he',320],['az',320]]) {
      const context = await browser.newContext({ viewport:{ width, height:750 },locale,hasTouch:width === 320 });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const loadedLessons = new Set();
      page.on('request', request => {
        if (request.url().endsWith('-lessons.js')) loadedLessons.add(request.url().split('/').at(-1));
      });
      await page.goto(target);
      await page.locator('#app').waitFor();
      assert.match(await page.locator('#download').getAttribute('href'), /kaansavukduran\/wall\/releases$/);
      assert.equal(await page.locator('#start-campaign').evaluate(button => button === document.activeElement),true);
      await page.selectOption('#lang', locale);
      assert.equal(await page.locator('html').getAttribute('dir'), locale === 'he' ? 'rtl' : 'ltr');
      const newGame = {tr:'Yeni oyun',en:'New game',he:'משחק חדש',az:'Yeni oyun'};
      assert.equal(await page.locator('#start-campaign').textContent(),newGame[locale]);
      assert.equal(await page.locator('#campaign').isHidden(),true);
      assert.equal(await page.locator('#return-plaza').isHidden(),true);
      assert.equal(await page.evaluate(() => localStorage.getItem('wall.progress.v1')),null);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
      await page.click('#settings-button');
      assert.equal(await page.locator('#settings').evaluate(dialog => dialog.scrollWidth > dialog.clientWidth),false);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#settings-button').evaluate(el => el === document.activeElement),true);
      await enterCampaign(page, width === 320 ? 'tap' : 'keyboard');
      assert.equal(await page.locator('#title').evaluate(title => title === document.activeElement),true);
      const photoTask = page.locator('#title + #photo-button');
      assert.ok(await photoTask.evaluate(button => {
        const viewport = button.getBoundingClientRect();
        const title = button.previousElementSibling.getBoundingClientRect();
        return button.classList.contains('primary') && title.top >= 0 && viewport.bottom <= innerHeight;
      }));
      assert.match(await page.locator('#intro').textContent(), /[?？]$/);
      assert.equal(await page.locator('#arrival').isHidden(),true);
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
      await page.goto(target);
      await enterCampaign(page,width === 320 ? 'tap' : 'keyboard');
      assert.equal(await page.locator('#world').evaluate(el => el.toDataURL()),walkedFrame);
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
      assert.equal(await photoTask.evaluate(button => button.classList.contains('primary')),false);
      await page.click('#next');
      const calendarRoutes = {1:['1','pesach'],5:['9','chanukah'],12:['2','lag-baomer']};
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
          try {
            await wrongChoice.press('Enter');
          } catch (error) {
            const status = await panel.locator('#evidence-question').textContent();
            throw new Error('Chapter ' + episode.id + ' (' + locale + ') evidence: ' + status, {cause:error});
          }
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
        if (calendarRoutes[episode.id] || episode.id === 18) {
          const before = await visitorFootprint(page);
          const shortcut = page.locator('#chapter-study-button');
          if (width === 320) await shortcut.tap();
          else await shortcut.press('Enter');
          if (episode.id === 18) {
            await page.locator('#kabbalah-lesson').waitFor();
            assert.equal(await page.locator('#kabbalah-lesson').inputValue(),'tzimtzum-partzufim-abya');
          } else {
            const [period,event] = calendarRoutes[episode.id];
            await page.locator('#calendar [data-event="' + event + '"]').waitFor();
            assert.equal(await page.locator('#calendar-period').inputValue(),period);
            assert.equal(await page.locator('#calendar [data-event="' + event + '"]').getAttribute('aria-pressed'),'true');
          }
          await page.keyboard.press('Escape');
          assert.equal(await shortcut.evaluate(button => button === document.activeElement),true);
          assert.deepEqual(await visitorFootprint(page),before);
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
        if (episode.id === 7) {
          const frame = () => page.locator('#world').evaluate(canvas => canvas.toDataURL());
          const market = page.locator('[data-layer="market-measure"]');
          await market.press('Enter');
          const selectedMarket = await market.elementHandle();
          const initial = await frame();
          const step = id => page.locator('[data-sequence="' + id + '"]');
          await step(0).press('Enter');
          assert.equal(await frame(),initial);
          assert.equal(await page.locator('#sequence li').count(),0);
          const frames = new Set([initial]);
          for (const id of [1,2,0]) {
            await step(id).press('Enter');
            frames.add(await frame());
            assert.ok(await selectedMarket.evaluate(button => button.isConnected && button.getAttribute('aria-pressed') === 'true'));
          }
          assert.equal(frames.size,4);
          assert.equal(await page.locator('#sequence li').count(),3);
          assert.ok(await page.locator('#sequence-reset').evaluate(button => document.activeElement === button));
          await page.locator('#sequence-reset').press('Enter');
          assert.equal(await frame(),initial);
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
          const assembly = page.locator('#platform-assembly');
          const diagram = assembly.locator('canvas');
          const load = page.waitForResponse(response => response.url().endsWith('/platform-assembly.js'));
          await assembly.locator('summary').press('Enter');
          assert.ok((await load).ok());
          const frames = [];
          const readDiagram = () => diagram.evaluate(canvas => canvas.toDataURL());
          const part = index => assembly.locator('[data-platform-part="' + index + '"]');
          const place = index => assembly.locator('[data-platform-place="' + index + '"]');
          frames.push(await readDiagram());
          await part(2).press('Enter');
          await place(0).press('Enter');
          assert.equal(await readDiagram(), frames[0]);
          await place(2).press('Enter');
          frames.push(await readDiagram());
          await page.selectOption('#lang', locale === 'he' ? 'tr' : 'he');
          assert.equal(await part(2).isDisabled(),true);
          assert.equal(await readDiagram(),frames[1]);
          await page.selectOption('#lang', locale);
          await part(0).press('Enter');
          if (width === 320) {
            const {width:diagramWidth,height:diagramHeight} = await diagram.boundingBox();
            await diagram.tap({position:{x:diagramWidth*59/240,y:diagramHeight*69/112}});
          } else {
            await place(0).press('Enter');
          }
          frames.push(await readDiagram());
          await part(1).press('Enter');
          await place(1).press('Enter');
          frames.push(await readDiagram());
          assert.equal(new Set(frames).size,4);
          assert.equal(await assembly.locator('fieldset').first().locator('button:disabled').count(),3);
          assert.equal(await assembly.locator('.platform-groups').isHidden(),true);
          assert.match(await assembly.locator('a').getAttribute('href'),/id=25662$/);
          await assembly.locator('[data-platform-reset]').press('Enter');
          assert.equal(await readDiagram(),frames[0]);
          assert.equal(await assembly.locator('.platform-groups').isVisible(),true);
          await assembly.locator('summary').press('Enter');
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
            const model = models.find(entry => entry.id === episode.id);
            const views = new Set();
            for (const [key,,copy,source] of model.options) {
              const layer = page.locator('[data-layer="' + key + '"]');
              if (width === 320) await layer.tap();
              else await layer.press('Enter');
              assert.equal(await layer.getAttribute('aria-pressed'),'true');
              assert.equal(await page.locator('#models output').textContent(),copy[['tr','en','he','az'].indexOf(locale)]);
              assert.equal(await page.locator('#model-reference').getAttribute('href'),source);
              views.add(await page.locator('#world').evaluate(canvas => canvas.toDataURL()));
            }
            assert.equal(views.size,3);
            const awning = page.locator('[data-evidence="3"]');
            if (width === 320) await awning.tap();
            else await awning.press('Enter');
            assert.match(await page.locator('#evidence-date').textContent(), /1866.*1875/);
            assert.match(await page.locator('#evidence-source').getAttribute('href'), /openletteraddres00auer\)\.pdf#page=138$/);
            await page.click('[data-evidence="4"]');
            assert.match(await page.locator('#evidence-date').textContent(), /1884/);
            assert.match(await page.locator('#evidence-source').getAttribute('href'), /PEFSurveyOfWesternPalestineJerusalem1884English[.]pdf#page=203$/);
            await page.click('[data-evidence="5"]');
            assert.match(await page.locator('#evidence-date').textContent(), /1920.*1929/);
            assert.match(await page.locator('#evidence-source').getAttribute('href'), /CustReport1929English[.]pdf#page=54$/);
          }
        }
        if (episode.id === 23) {
          await page.click('#photo-button');
          await page.locator('#compare-history').waitFor();
          assert.match(await page.locator('#compare-history').textContent(), /1967/);
          assert.equal(await page.locator('#compare-history-source').getAttribute('href'), 'https://whc.unesco.org/document/8721');
          const passage = page.locator('#compare-passage');
          await passage.waitFor();
          const comparisonCanvas = page.locator('#compare-canvas');
          const unmarked = await comparisonCanvas.evaluate(canvas => canvas.toDataURL());
          await passage.locator('button').first().press('Enter');
          assert.equal(await comparisonCanvas.evaluate(canvas => canvas.toDataURL()),unmarked);
          const correctPlace = passage.locator('button').last();
          if (width === 320) await correctPlace.tap();
          else await correctPlace.press('Enter');
          assert.equal(await correctPlace.getAttribute('aria-pressed'),'true');
          assert.notEqual(await comparisonCanvas.evaluate(canvas => canvas.toDataURL()),unmarked);
          assert.ok((await passage.locator('[role="status"]').textContent()).trim());
          if (width === 320) {
            await page.evaluate(() => {document.documentElement.style.fontSize = '200%';});
            assert.equal(await page.locator('#photo').evaluate(dialog => dialog.scrollWidth > dialog.clientWidth),false);
            await page.evaluate(() => {document.documentElement.style.fontSize = '';});
          }
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
            if (id === 'messianic-hamburg-letters') {
              const reading = page.locator('#messianic-timeline .timeline-reading');
              assert.match(await reading.locator('.timeline-source-kind').textContent(), /1691/);
              assert.deepEqual(await reading.locator('a').evaluateAll(links => links.map(link => link.href)), [
                'https://keydocuments.net/source/jgo%3Asource-165',
                'https://keydocuments.net/article/teplitsky-glikl',
              ]);
            }
          }
          assert.equal(await page.locator('.timeline-order li').count(), 6);
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
          if (width === 320) await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
          const timeline = page.locator('#mandate-timeline');
          await timeline.locator('summary').press('Enter');
          const policy = timeline.locator('[data-timeline-card="mandate-white-paper"]');
          await policy.press('Enter');
          assert.equal(await timeline.locator('ol li').count(),0);
          assert.equal(await timeline.locator('.timeline-reading a').first().getAttribute('href'),mandateLessons.cards[2].source.url);
          for (const id of mandateLessons.activity.correctOrder) {
            await timeline.locator('[data-timeline-card="' + id + '"]').press('Enter');
          }
          assert.equal(await timeline.locator('ol li').count(),3);
          assert.equal(await timeline.locator('.timeline-status').textContent(),mandateLessons.activity.feedback[['tr','en','he','az'].indexOf(locale)]);
          if (width === 320) {
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),false);
            await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
          }
          await timeline.locator('summary').press('Enter');
          assert.equal(await timeline.getAttribute('open'),null);
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
      const visitorExercise = page.locator('#tour-followup');
      await visitorExercise.locator('[data-followup-source="quarter"]').press('Enter');
      assert.ok((await visitorExercise.locator('[role="status"]').textContent()).trim());
      assert.ok(await visitorExercise.locator('#tour-companion').isHidden());
      const secondSource = visitorExercise.locator('[data-followup-source="photo"]');
      if (width === 320) await secondSource.tap();
      else await secondSource.press('Enter');
      assert.equal(await visitorExercise.locator('#tour-companion a').getAttribute('href'),'https://www.palquest.org/en/node/21938');
      assert.ok(await visitorExercise.locator('#tour-companion-title').evaluate(el=>el===document.activeElement));
      await page.locator('.tour-personal-note').scrollIntoViewIfNeeded();
      assert.ok(await page.locator('#tour-presentation button').evaluate(button => {
        const rect = button.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      }));
      await page.keyboard.press('Escape');
      assert.ok(await page.locator('#tour-present').evaluate(button => document.activeElement === button));
      loadedLessons.clear();
      await page.reload();
      await page.locator('#tour-builder').waitFor();
      assert.equal(await page.locator('#journal-text').inputValue(), 'WALL');
      assert.equal(await page.locator('#tour-stops select').first().inputValue(), 'photo');
      assert.equal(await page.locator('#tour-question').inputValue(), 'photo');
      assert.equal(await page.locator('#tour-present').isEnabled(), true);
      await page.locator('#tour-present').press('Enter');
      assert.equal(await visitorExercise.locator('#tour-companion a').getAttribute('href'),'https://www.palquest.org/en/node/21938');
      assert.ok(await visitorExercise.locator('#tour-followup-choices').isHidden());
      await page.keyboard.press('Escape');
      await page.click('#library-button');
      await page.locator('#library[open]').waitFor();
      assert.ok(await page.locator('#library details').count() >= 8);
      assert.equal(loadedLessons.has('calendar-lessons.js'), false);
      const calendarRequest = page.waitForResponse(response => response.url().endsWith('/calendar-lessons.js'));
      if (width === 320) await page.tap('#calendar summary');
      else await page.click('#calendar summary');
      assert.ok([200,304].includes((await calendarRequest).status()));
      await page.locator('[data-event="simchat-torah"]').waitFor();
      await page.click('[data-event="simchat-torah"]');
      assert.match(await page.locator('[data-event="simchat-torah"]').innerText(), /^22/);
      await page.selectOption('#calendar-custom', 'diaspora');
      assert.match(await page.locator('[data-event="simchat-torah"]').innerText(), /^23/);
      assert.equal(await page.locator('[data-event="simchat-torah"]').getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('.shabbat-study').isVisible(), false);
      await page.selectOption('#calendar-period', '0');
      const shabbat = page.locator('.shabbat-study');
      const shabbatIndex = ['tr','en','he','az'].indexOf(locale);
      await shabbat.locator(':scope > summary').press('Enter');
      assert.equal(await shabbat.locator(':scope > p').first().locator('a').getAttribute('href'),shabbatStudy.text.url);
      for (const [index, place] of shabbatStudy.places.entries()) {
        const card = shabbat.locator('details').nth(index);
        assert.equal(await card.locator('summary').innerText(),place.title[shabbatIndex]);
        if (width === 320) await card.locator('summary').tap();
        else await card.locator('summary').press('Space');
        assert.equal(await card.locator('p').innerText(),place.practice[shabbatIndex]);
        assert.equal(await card.locator('a').getAttribute('href'),place.source.url);
      }
      await shabbat.locator('[data-shabbat-place="binghamton"]').press('Enter');
      assert.equal(await shabbat.locator('[role="status"]').innerText(),shabbatStudy.retry[shabbatIndex]);
      await shabbat.locator('[data-shabbat-place="nava-tehila"]').press('Enter');
      assert.equal(await shabbat.locator('[role="status"]').innerText(),shabbatStudy.feedback[shabbatIndex]);
      await page.selectOption('#calendar-year', 'leap');
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      const calendarOverflow = await page.locator('#library').evaluate(dialog => {
        if (dialog.scrollWidth <= dialog.clientWidth) return [];
        return [dialog,...dialog.querySelectorAll('#calendar *')].flatMap(element =>
          element.scrollWidth > element.clientWidth && element.clientWidth > 0
            ? [[element.id || element.className || element.tagName, element.scrollWidth, element.clientWidth]]
            : []);
      });
      assert.deepEqual(calendarOverflow, []);
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
      await page.selectOption('#calendar-year', 'common');
      await page.selectOption('#calendar-period', '12');
      await page.locator('[data-event="purim"]').waitFor();
      assert.equal(await shabbat.isVisible(), false);
      await page.selectOption('#calendar-year', 'leap');
      assert.equal(await page.locator('[data-event="purim"]').count(), 0);
      await page.selectOption('#calendar-period', '13');
      await page.click('[data-event="purim"]');
      assert.match(await page.locator('.calendar-sources a').getAttribute('href'), /Esther/);
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
      await page.selectOption('#calendar-period','1');
      await page.selectOption('#calendar-custom','israel');
      const mimouna = page.locator('[data-event="mimouna"]');
      await mimouna.press('Enter');
      assert.match(await mimouna.textContent(),/22/);
      assert.match(await page.locator('.calendar-sources a').first().getAttribute('href'),/recf5zztixexjse0q$/);
      assert.match(await page.locator('.calendar-sources a').last().getAttribute('href'),/seder-mimounah/);
      await page.selectOption('#calendar-custom','diaspora');
      assert.match(await mimouna.textContent(),/23/);
      assert.equal(await mimouna.getAttribute('aria-pressed'),'true');
      for (const month of ['9','7','1']) {
        await page.selectOption('#calendar-answer',month);
        await page.click('.calendar-practice button');
        if (month !== '1') await page.click('.calendar-practice button');
      }
      assert.match(await page.locator('.calendar-practice [role="status"]').textContent(),/23/);
      await page.click('#library form button');
      await page.selectOption('#lang',locale === 'he' ? 'en' : 'he');
      await page.click('#library-button');
      await mimouna.waitFor();
      assert.equal(await page.locator('#calendar-period').inputValue(),'1');
      assert.equal(await page.locator('#calendar-custom').inputValue(),'diaspora');
      assert.equal(await mimouna.getAttribute('aria-pressed'),'true');
      assert.match(await mimouna.textContent(),locale === 'he' ? /Mimouna/ : /מימונה/);
      await page.click('#library form button');
      await page.selectOption('#lang',locale);
      await page.click('#library-button');
      await mimouna.waitFor();
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
      assert.ok([200,304].includes((await workshopRequest).status()));
      await page.locator('#kabbalah-lesson').waitFor();
      assert.equal(await page.locator('#kabbalah-lesson option').count(), 21);
      assert.equal(await page.locator('#kabbalah-lesson optgroup').count(), 2);
      assert.ok(loadedLessons.has('kabbalah-advanced-lessons.js'));
      const rose = advancedReadings.find(lesson => lesson.id === 'zohar-rose-commentaries');
      const localeIndex = ['tr','en','he','az'].indexOf(locale);
      const roseCards = page.locator('.kabbalah-commentaries details');
      await page.selectOption('#kabbalah-lesson', rose.id);
      assert.equal(await page.locator('.kabbalah-excerpt bdi[lang="arc"][dir="rtl"]').innerText(), rose.excerpt);
      assert.equal(await roseCards.count(), rose.commentaries.length);
      for (const [index, commentary] of rose.commentaries.entries()) {
        const summary = roseCards.nth(index).locator('summary');
        assert.equal(await summary.textContent(), commentary.title[localeIndex]);
        if (width === 320) await summary.tap();
        else await summary.press('Enter');
        assert.equal(await roseCards.nth(index).locator('p').first().innerText(), commentary.period[localeIndex]);
        assert.equal(await roseCards.nth(index).locator('p').last().innerText(), commentary.study[localeIndex]);
        assert.equal(await roseCards.nth(index).locator('a').getAttribute('href'), commentary.url);
      }
      assert.equal(await page.locator('.kabbalah-commentaries details[open]').count(), rose.commentaries.length);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      assert.equal(await page.locator('#library').evaluate(dialog => dialog.scrollWidth > dialog.clientWidth), false);
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
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
      assert.equal(await page.locator('.kabbalah-commentaries').isVisible(), false);
      await page.click('.kabbalah-sources summary');
      assert.equal(await page.locator('.kabbalah-sources li').count(), 3);
      assert.equal(await page.locator('.kabbalah-sources a').nth(1).getAttribute('href'), 'https://www.academia.edu/18676960');
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
      await page.selectOption('#kabbalah-lesson', rose.id);
      assert.equal(await page.locator('#kabbalah-draft').inputValue(), 'WALL zohar-rose-voices');
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
      const returning = await context.newPage();
      if (locale === 'he') {
        await returning.setViewportSize({width:320,height:590});
        await returning.addInitScript(() => localStorage.setItem('wall.appearance.v1',JSON.stringify({
          size:200,theme:'contrast',motion:'reduce',
        })));
      }
      await returning.goto(target);
      await returning.locator('#arrival').waitFor();
      const chapterTitle = chapters.at(-1).text[languages.indexOf(locale)][0];
      assert.ok((await returning.locator('#arrival-description').textContent()).includes(chapterTitle));
      assert.equal(await returning.locator('#start-campaign').textContent(),ui[locale][3]);
      assert.equal(await returning.evaluate(() => JSON.parse(localStorage.getItem('wall.progress.v1')).active),'24');
      if (locale === 'he') {
        assert.equal(await returning.locator('#arrival-title').evaluate(title => document.activeElement === title),true);
        assert.equal(await returning.evaluate(() => scrollY),0);
      }
      await enterCampaign(returning);
      assert.equal(await returning.locator('#chapter').textContent(),'24');
      const progressBeforeReplay = await returning.evaluate(() => JSON.parse(localStorage.getItem('wall.progress.v1')).completed);
      await returning.goto(target);
      const returnPlaza = returning.locator('#return-plaza');
      await returnPlaza.waitFor();
      assert.equal(await returnPlaza.textContent(),ui[locale][13]);
      assert.equal(await returning.evaluate(() => document.documentElement.scrollWidth > innerWidth),false);
      if (locale === 'he') {
        const controller = action => returning.evaluate(action => window.dispatchEvent(new CustomEvent('wall-controller',{
          detail:{action,pressed:true},
        })),action);
        await controller('next');
        assert.ok(await returnPlaza.evaluate(button => button === document.activeElement));
        await controller('activate');
      } else if (width === 320) await returnPlaza.tap();
      else await returnPlaza.press('Enter');
      await returning.waitForURL('**/#game');
      assert.equal(await returning.locator('#next').textContent(),ui[locale][3]);
      await returning.click('#next');
      await returning.waitForURL('**/#chapter-1');
      assert.deepEqual(await returning.evaluate(() => JSON.parse(localStorage.getItem('wall.progress.v1')).completed),
        progressBeforeReplay);
      await returning.close();
      await page.click('#next');
      await page.waitForURL('**/#game');
      assert.deepEqual(errors, []);
      await context.close();
      console.log(locale, width, '25 checkpoints, workshops and saved evidence exhibition: PASS');
    }
    const landscape = await browser.newPage({locale:'en',viewport:{width:320,height:640},hasTouch:true});
    await landscape.goto(target);
    await enterCampaign(landscape,'tap');
    await landscape.tap('[data-choice="' + plaza.correct + '"]');
    await landscape.tap('#next');
    await landscape.setViewportSize({width:640,height:320});
    await landscape.tap('[data-choice="' + chapters[0].correct + '"]');
    await landscape.waitForFunction(() => {
      const next = document.getElementById('next');
      const {top,bottom} = next.getBoundingClientRect();
      return !next.hidden && top >= 0 && bottom <= innerHeight;
    });
    await landscape.tap('#next');
    assert.equal(await landscape.locator('#chapter').textContent(),'2');
    await landscape.close();
    console.log('Landscape touch reveals Continue inside the viewport: PASS');

    const chapterStudy = await browser.newPage({locale:'en',viewport:{width:320,height:750},hasTouch:true});
    await chapterStudy.addInitScript(() => localStorage.setItem('wall.progress.v1',JSON.stringify({
      active:'16', completed:['plaza',...Array.from({length:20},(_,index) => String(index + 1))],
    })));
    await chapterStudy.goto(target + '#chapter-16');
    const chapterStudyButton = chapterStudy.locator('#chapter-study-button');
    await chapterStudyButton.waitFor();
    const manuscriptFrame = await visitorFootprint(chapterStudy);
    await chapterStudyButton.press('Enter');
    const kabbalahPicker = chapterStudy.locator('#kabbalah-lesson');
    await kabbalahPicker.waitFor();
    assert.equal(await kabbalahPicker.inputValue(),'zohar-rose-commentaries');
    const manuscripts = chapterStudy.locator('.kabbalah-commentaries details');
    await manuscripts.last().locator('summary').tap();
    await chapterStudy.locator('.kabbalah-exercise summary').press('Enter');
    await chapterStudy.locator('[data-case-choice="1"]').press('Enter');
    await chapterStudy.fill('#kabbalah-draft','WALL from chapter 16');
    await kabbalahPicker.selectOption('bahir');
    await chapterStudy.keyboard.press('Escape');
    assert.ok(await chapterStudyButton.evaluate(button => document.activeElement === button));
    assert.deepEqual(await visitorFootprint(chapterStudy),manuscriptFrame);
    await chapterStudy.selectOption('#lang','he');
    await chapterStudyButton.press('Enter');
    await kabbalahPicker.waitFor();
    assert.equal(await kabbalahPicker.inputValue(),'zohar-rose-commentaries');
    assert.equal(await manuscripts.last().getAttribute('open'),'');
    assert.equal(await chapterStudy.locator('#kabbalah-draft').inputValue(),'WALL from chapter 16');
    await chapterStudy.keyboard.press('Escape');
    await chapterStudy.click('#episodes-button');
    await chapterStudy.locator('#chapters ol').getByRole('button',{name:chapters[19].text[2][0],exact:true}).click();
    await chapterStudyButton.press('Enter');
    const shabbatWorkshop = chapterStudy.locator('.shabbat-study');
    await shabbatWorkshop.waitFor();
    assert.equal(await shabbatWorkshop.getAttribute('open'),'');
    await shabbatWorkshop.locator('details').first().locator('summary').tap();
    await shabbatWorkshop.locator('[data-shabbat-place="nava-tehila"]').tap();
    await chapterStudy.selectOption('#calendar-period','7');
    await chapterStudy.keyboard.press('Escape');
    await chapterStudy.selectOption('#lang','az');
    await chapterStudyButton.press('Enter');
    await shabbatWorkshop.waitFor();
    assert.equal(await chapterStudy.locator('#calendar-period').inputValue(),'0');
    assert.equal(await shabbatWorkshop.locator('details').first().getAttribute('open'),'');
    assert.equal(await shabbatWorkshop.locator('[data-shabbat-place="nava-tehila"]').getAttribute('aria-pressed'),'true');
    assert.equal(await shabbatWorkshop.locator('[role="status"]').innerText(),shabbatStudy.feedback[3]);
    await chapterStudy.close();
    console.log('Chapter links keep scene, focus and localized workshop state: PASS');

    const edge = await browser.newPage();
    await edge.addInitScript(() => {
      const frame = window.requestAnimationFrame.bind(window);
      const probe = {x:null,frames:0};
      window.edgeProbe = probe;
      window.requestAnimationFrame = callback => frame(now => {
        probe.frames++;
        callback(now);
      });
      const translate = CanvasRenderingContext2D.prototype.translate;
      CanvasRenderingContext2D.prototype.translate = function(x,y) {
        if (this.canvas.id === 'world') probe.x = x;
        return translate.call(this,x,y);
      };
      probe.afterPaint = () => new Promise(resolve => frame(() => frame(resolve)));
    });
    await edge.goto(target + '#chapter-24');
    await edge.locator('#arrival').waitFor();
    assert.equal(await edge.locator('#campaign').isHidden(),true);
    await enterCampaign(edge,'keyboard');
    await edge.waitForURL('**/#game');
    await edge.keyboard.down('ArrowLeft');
    await edge.waitForFunction(() => window.edgeProbe.x === 16);
    await edge.evaluate(() => window.edgeProbe.afterPaint());
    const restingFrames = await edge.evaluate(() => window.edgeProbe.frames);
    await edge.keyboard.down('ArrowLeft');
    await edge.evaluate(() => window.edgeProbe.afterPaint());
    assert.equal(await edge.evaluate(() => window.edgeProbe.frames), restingFrames);
    await edge.keyboard.up('ArrowLeft');
    await edge.keyboard.down('ArrowRight');
    await edge.waitForFunction(() => window.edgeProbe.x > 16);
    await edge.keyboard.up('ArrowRight');
    await edge.close();
    console.log('Holding movement at the scenery boundary stops scheduling frames: PASS');

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
    await press(1, () => document.documentElement.hasAttribute('data-controller-input'));
    assert.equal(await padPage.locator('#arrival').isVisible(),true);
    await press(0, () => !document.getElementById('campaign').hidden);
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
    await native('library');
    await padPage.locator('#kabbalah > summary').focus();
    await native('activate');
    const rosePicker = padPage.locator('#kabbalah-lesson');
    await rosePicker.waitFor();
    await rosePicker.selectOption('laitman-bnei-baruch');
    await rosePicker.focus();
    await native('activate');
    assert.equal(await rosePicker.inputValue(), 'zohar-rose-commentaries');
    await native('next');
    assert.equal(await padPage.evaluate(() => document.activeElement.parentElement.className), 'kabbalah-sources');
    await native('next');
    assert.equal(await padPage.evaluate(() => document.activeElement.closest('.kabbalah-commentaries')?.className),
      'kabbalah-commentaries');
    await native('activate');
    assert.equal(await padPage.locator('.kabbalah-commentaries details[open]').count(), 1);
    await native('back');
    await padPage.close();
    console.log('Gamepad browser mapping and native event path (simulated): PASS');

    const source = await browser.newPage({locale:'he',viewport:{width:320,height:700},hasTouch:true});
    await source.goto(target);
    await enterCampaign(source,'tap');
    await source.selectOption('#lang','he');
    await source.click('[data-choice="' + plaza.correct + '"]');
    await source.click('#next');
    await source.click('[data-choice="' + chapters[0].correct + '"]');
    await source.tap('#transfer summary');
    await source.tap('[data-transfer-choice="' + transferLessons[0].correct + '"]');
    await source.fill('#transfer-draft','בדיקת שמירה');
    await source.click('#next');
    await source.locator('[data-move="-1"]').press('Enter');
    const exportedFootprint = await visitorFootprint(source);
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
    assert.deepEqual(await visitorFootprint(restore),exportedFootprint);
    assert.equal(await restore.locator('html').getAttribute('dir'),'rtl');
    await restore.click('#episodes-button');
    await restore.locator('#chapters button').nth(1).click();
    await restore.tap('#transfer summary');
    assert.equal(await restore.locator('#transfer-draft').inputValue(),'בדיקת שמירה');
    await restore.close();
    console.log('Export, invalid-save rejection, restore into a separate profile and Hebrew draft: PASS');

    const blocked = await browser.newPage({locale:'en',viewport:{width:320,height:700},hasTouch:true});
    await blocked.addInitScript(() => {
      const write = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key,value) {
        if (window.blockSaveWrites) throw new DOMException('Storage quota','QuotaExceededError');
        return write.call(this,key,value);
      };
    });
    await blocked.goto(target);
    await enterCampaign(blocked,'tap');
    await blocked.evaluate(() => { window.blockSaveWrites = true; });
    await blocked.tap('[data-choice="' + plaza.correct + '"]');
    const notice = blocked.locator('#storage-notice');
    assert.match(await notice.textContent(), /Some changes could not be saved/);
    await blocked.tap('#next');
    await blocked.tap('[data-choice="' + chapters[0].correct + '"]');
    await blocked.locator('[data-move="-1"]').press('Enter');
    const blockedFrame = await blocked.locator('#world').evaluate(canvas => canvas.toDataURL());
    await blocked.tap('#transfer summary');
    await blocked.tap('[data-transfer-choice="' + transferLessons[0].correct + '"]');
    await blocked.fill('#transfer-draft','בדיקת התאוששות');
    await blocked.selectOption('#lang','he');
    assert.match(await notice.textContent(), /לא נשמרו/);
    await blocked.tap('#library-button');
    assert.match(await blocked.locator('#library-storage:visible').textContent(), /לא נשמרו/);
    await blocked.keyboard.press('Escape');
    await blocked.tap('#settings-button');
    await blocked.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    assert.equal(await blocked.locator('#settings').evaluate(dialog => dialog.scrollWidth > dialog.clientWidth),false);
    await blocked.tap('#retry-storage');
    assert.match(await blocked.locator('#settings-storage').textContent(), /רק בהפעלה הנוכחית/);
    await blocked.tap('#save-transfer summary');
    await blocked.tap('#save-export');
    const pending = JSON.parse(await blocked.locator('#save-output').inputValue()).values;
    assert.deepEqual(JSON.parse(pending['wall.progress.v1']),{active:'1',completed:['plaza','1'],placement:[74,-1]});
    assert.equal(pending['wall.language'],'he');
    assert.equal(pending['wall.transfer.1.draft'],'בדיקת התאוששות');
    assert.deepEqual(await blocked.evaluate(() => JSON.parse(localStorage.getItem('wall.progress.v1'))),{active:'plaza',completed:[],placement:[80,1]});
    await blocked.evaluate(() => { window.blockSaveWrites = false; });
    await blocked.tap('#retry-storage');
    assert.equal(await notice.textContent(),'');
    assert.equal(await blocked.locator('#retry-storage').isHidden(),true);
    assert.equal(await blocked.locator('#settings-close').evaluate(button => button === document.activeElement),true);
    await blocked.reload();
    await blocked.locator('#app').waitFor();
    assert.equal(await blocked.locator('html').getAttribute('lang'),'he');
    assert.equal(await blocked.locator('#chapter').textContent(),'1');
    assert.equal(await blocked.locator('#world').evaluate(canvas => canvas.toDataURL()),blockedFrame);
    await blocked.tap('#transfer summary');
    assert.equal(await blocked.locator('#transfer-draft').inputValue(),'בדיקת התאוששות');
    await blocked.close();
    console.log('Storage failure warning, session save export and retry with preserved progress: PASS');

    const shared = await browser.newContext({locale:'en',viewport:{width:1100,height:750}});
    const firstTab = await shared.newPage();
    await firstTab.goto(target);
    await enterCampaign(firstTab);
    await firstTab.click('[data-choice="' + plaza.correct + '"]');
    await firstTab.click('#next');

    const olderTab = await shared.newPage();
    await olderTab.addInitScript(() => {
      const write = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key,value) {
        if (window.blockSaveWrites) throw new DOMException('Storage quota','QuotaExceededError');
        return write.call(this,key,value);
      };
    });
    await olderTab.goto(target);
    await enterCampaign(olderTab);
    const savedCampaign = page => page.evaluate(() => JSON.parse(localStorage.getItem('wall.progress.v1')));
    await firstTab.bringToFront();
    await firstTab.locator('[data-move="1"]').press('Enter');
    const placement = (await savedCampaign(firstTab)).placement;
    assert.deepEqual(placement,[86,1]);
    await olderTab.click('#episodes-button');
    await olderTab.locator('#chapters ol li').nth(1).getByRole('button').click();
    assert.deepEqual((await savedCampaign(olderTab)).placement,placement);
    assert.deepEqual(await visitorFootprint(olderTab),await visitorFootprint(firstTab));
    await firstTab.bringToFront();
    await firstTab.locator('[data-move="1"]').press('Enter');
    await olderTab.click('[data-choice="' + chapters[0].correct + '"]');
    assert.deepEqual((await savedCampaign(olderTab)).placement,[92,1]);
    await olderTab.click('#next');
    assert.deepEqual((await savedCampaign(olderTab)).placement,[92,1]);
    const nextPlacement = await visitorFootprint(olderTab);
    await olderTab.reload();
    await olderTab.locator('#campaign').waitFor();
    assert.equal(await olderTab.locator('#chapter').textContent(),'2');
    assert.deepEqual(await visitorFootprint(olderTab),nextPlacement);
    await olderTab.click('#episodes-button');
    await olderTab.locator('#chapters ol li').nth(1).getByRole('button').click();
    await olderTab.click('#episodes-button');
    const waitingTab = await shared.newPage();
    await waitingTab.goto(target);
    await waitingTab.locator('#arrival').waitFor();
    await firstTab.click('[data-choice="' + chapters[0].correct + '"]');
    await firstTab.click('#next');
    await waitingTab.bringToFront();
    await waitingTab.locator('#arrival-description')
      .getByText('You last visited “' + chapters[1].text[1][0] + '”.',{exact:true}).waitFor();
    await olderTab.locator('#chapters ol li').nth(1).getByRole('button').click();
    assert.equal(await olderTab.locator('#next').isVisible(),true);
    assert.deepEqual((await savedCampaign(olderTab)).completed,['plaza','1']);

    await olderTab.evaluate(() => { window.blockSaveWrites = true; });
    await olderTab.click('#next');
    await olderTab.locator('#storage-notice').getByText(/Some changes could not be saved/).waitFor();
    await firstTab.click('[data-choice="' + chapters[1].correct + '"]');
    await olderTab.click('#settings-button');
    await olderTab.click('#save-transfer summary');
    await olderTab.click('#save-export');
    const sharedBackup = JSON.parse(await olderTab.locator('#save-output').inputValue());
    assert.equal(sharedBackup.version,1);
    assert.deepEqual(JSON.parse(sharedBackup.values['wall.progress.v1']).completed,['plaza','1','2']);
    await olderTab.evaluate(() => { window.blockSaveWrites = false; });
    await olderTab.click('#retry-storage');
    assert.deepEqual((await savedCampaign(olderTab)).completed,['plaza','1','2']);
    await olderTab.evaluate(() => {
      localStorage.setItem('wall.progress.v1',JSON.stringify({active:'2',completed:['plaza']}));
    });
    await olderTab.reload();
    await olderTab.locator('#campaign').waitFor();
    assert.equal(await olderTab.locator('#chapter').textContent(),'2');
    assert.equal(await olderTab.locator('#next').isVisible(),true);
    assert.deepEqual((await savedCampaign(olderTab)).completed,['plaza','1','2']);
    await waitingTab.bringToFront();
    const returnPlaza = waitingTab.locator('#return-plaza');
    await returnPlaza.focus();
    await olderTab.click('#episodes-button');
    await olderTab.locator('#chapters ol li:first-child button').click();
    await waitingTab.bringToFront();
    await returnPlaza.waitFor({state:'hidden'});
    assert.equal(await waitingTab.locator('#start-campaign').evaluate(button => button === document.activeElement),true);
    await shared.close();
    console.log('Shared campaign keeps unlocks through stale navigation, save export and a failed write retry: PASS');

    const reading = await browser.newPage({locale:'az',viewport:{width:320,height:700},hasTouch:true,colorScheme:'dark'});
    await reading.goto(target);
    await enterCampaign(reading,'tap');
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
      await enterCampaign(recovery);
      await recovery.close();
    }
    console.log('Loading error, readable version and retry in four locales: PASS');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
