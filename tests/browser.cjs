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
  const { kotelScenarios } = await import('../kotel-lessons.js');
  const { dailyCases } = await import('../daily-life.js');
  const { transferLessons } = await import('../transfer-early-lessons.js');
  const { languageLessons } = await import('../language-lessons.js');
  const { archiveCases } = await import('../diaspora-archive.js');
  const { diasporaRecords } = await import('../diaspora-lessons.js');
  const { models } = await import('../scenes.js');
  const { messianicLessons } = await import('../messianic-lessons.js');
  const lessons = {...ancientLessons, ...secondTempleLessons, ...romanLessons, ...medievalLessons, ...earlyModernLessons, ...modernLessons};
  const decks = ['ancient-lessons.js', 'second-temple-lessons.js', 'roman-lessons.js', 'medieval-lessons.js', 'early-modern-lessons.js', 'modern-lessons.js'];
  const browser = await playwright[engine].launch(browserOptions);
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
      assert.match(await page.locator('#download').getAttribute('href'), /kaansavukduran\/wall\/releases$/);
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
        if ([1,3,4].includes(episode.id)) {
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
        if (episode.id === 16) {
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
          for (const card of [1,2,0]) await page.click('[data-sequence="' + card + '"]');
          const dates = await page.locator('#sequence li').allTextContents();
          assert.deepEqual(dates.map(item => item.match(/\d+/)[0]), ['1917','1929','1930']);
        }
        if (episode.id === 22) {
          await page.click('[data-layer="holocaust"]');
          const firstNote = await page.locator('#models output').textContent();
          await page.click('[data-layer="nakba"]');
          assert.notEqual(await page.locator('#models output').textContent(), firstNote);
        }
        if (episode.id === 24) {
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
          if (episode.id === 1) assert.equal(loadedLessons.has('transfer-early-lessons.js'), false);
          const summary = page.locator('#transfer summary');
          if (width === 320) await summary.tap();
          else await summary.press('Enter');
          const correct = page.locator('[data-transfer-choice="' + transfer.correct + '"]');
          await correct.waitFor();
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
      assert.match(await page.locator('.atlas-reading a').getAttribute('href'), /jewishlanguages.org/);
      await page.waitForFunction(() => document.querySelector('.atlas-map img').naturalWidth === 384);
      await page.selectOption('#atlas-category', 'movements');
      assert.equal(await page.locator('#atlas-entry').isDisabled(), true);
      await page.fill('#atlas-search', '');
      assert.equal(await page.locator('#atlas-entry option').count(), 10);
      await page.selectOption('#atlas-entry', 'reconstructionist');
      assert.match(await page.locator('.atlas-reading a').getAttribute('href'), /reconstructingjudaism.org/);
      await page.selectOption('#atlas-category', 'communities');
      await page.selectOption('#atlas-entry', 'mizrahim');
      assert.equal(await page.locator('.atlas-figure').isVisible(), false);
      assert.equal(loadedLessons.has('kabbalah-lessons.js'), false);
      const workshopRequest = page.waitForResponse(response => response.url().endsWith('/kabbalah-lessons.js'));
      await page.click('#kabbalah summary');
      assert.ok((await workshopRequest).ok());
      await page.locator('#kabbalah-lesson').waitFor();
      assert.equal(await page.locator('#kabbalah-lesson option').count(), 9);
      await page.click('.kabbalah-exercise summary');
      for (const sample of feynmanCases) {
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
      await page.selectOption('#kabbalah-lesson', 'rabash-purpose-of-society');
      assert.equal(await page.locator('#kabbalah-draft').inputValue(), 'WALL rabash-group-application');
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
