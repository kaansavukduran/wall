import assert from 'node:assert/strict';
import { setTimeout as wait } from 'node:timers/promises';

const port = Number(process.argv[2]);
assert.ok(Number.isInteger(port) && port > 0);
const mode = process.argv[3] ?? 'clean';
const expected = process.argv[4];
assert.ok(['clean','advance','resume'].includes(mode));

const deadline = Date.now() + 60_000;
let page;

while (!page && Date.now() < deadline) {
  try {
    const tabs = await fetch(`http://127.0.0.1:${port}/json/list`).then(response => response.json());
    page = tabs.find(tab => tab.url.startsWith('wall://app/'));
  } catch { /* The packaged app is still starting. */ }
  if (!page) await wait(400);
}
assert.ok(page, 'The Electron window did not open');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, {once:true});
  socket.addEventListener('error', reject, {once:true});
});
let id = 0;
function evaluate(expression) {
  const request = ++id;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.removeEventListener('message', handle);
      reject(new Error('Runtime.evaluate timed out'));
    }, 5000);
    function handle(event) {
      const data = JSON.parse(event.data);
      if (data.id !== request) return;
      clearTimeout(timeout);
      socket.removeEventListener('message', handle);
      if (data.error || data.result.exceptionDetails) reject(new Error(JSON.stringify(data)));
      else resolve(data.result.result.value);
    }
    socket.addEventListener('message', handle);
    socket.send(JSON.stringify({id:request,method:'Runtime.evaluate',params:{expression,returnByValue:true}}));
  });
}
try {
  let ready = false;
  while (!ready && Date.now() < deadline) {
    ready = await evaluate(`(() => {
      const app = document.querySelector('#app:not([hidden])');
      app?.querySelector('#arrival:not([hidden]) #start-campaign')?.click();
      return Boolean(app?.querySelector('[data-choice]')?.getClientRects().length);
    })()`);
    if (!ready) await wait(250);
  }
  assert.ok(ready, 'The packaged browser did not reach a playable scene');
  if (expected) {
    assert.equal(await evaluate('document.querySelector("footer > span:last-child").textContent'),expected);
  }
  const hasSavedChapter = await evaluate("document.querySelector('#chapter').textContent === '1'");
  if (mode === 'resume') {
    assert.ok(hasSavedChapter, 'Chapter 1 was not restored after installing the new build');
    await evaluate("document.querySelector('#episodes-button').click(); document.querySelector('#chapters ol li:first-child button').click()");
    assert.equal(await evaluate("!document.querySelector('#next').hidden"),true,
      'The completed prologue was not retained after installing the new build');
    console.log('The new native build restored chapter 1 and the completed prologue from the earlier release.');
  }

  assert.equal(await evaluate("document.querySelector('[data-choice=\"1\"]').click(); !document.querySelector('#next').hidden"), true);
  console.log('Native package reached and completed the prologue.');
  if (await evaluate("Boolean(document.querySelector('#kabbalah'))")) {
    await evaluate("document.querySelector('#library-button').click(); document.querySelector('#kabbalah summary').click()");
    let loaded = false;
    while (!loaded && Date.now() < deadline) {
      loaded = await evaluate("Boolean(document.querySelector('#kabbalah-lesson option[value=rabash-purpose-of-society]'))");
      if (!loaded) await wait(250);
    }
    assert.ok(loaded, 'The packaged Kabbalah workshop did not load');
    assert.equal(await evaluate(`(() => {
      const select = document.querySelector('#kabbalah-lesson');
      select.value = 'rabash-purpose-of-society';
      select.dispatchEvent(new Event('change'));
      document.querySelector('.kabbalah-exercise summary').click();
      document.querySelector('[data-case-choice="0"]').click();
      return !document.querySelector('.kabbalah-transfer').hidden;
    })()`), true);
    console.log('Native package loaded and completed a source exercise in the workshop.');
  }
  if (await evaluate("Boolean(document.querySelector('#settings-button'))")) {
    await evaluate("document.querySelector('#library[open]')?.close(); document.querySelector('#settings-button').click(); document.querySelector('#save-transfer summary').click()");
    const saveDeadline = Date.now() + 10_000;
    let loaded = false;
    while (!loaded && Date.now() < saveDeadline) {
      loaded = await evaluate("Boolean(document.querySelector('#save-export'))");
      if (!loaded) await wait(250);
    }
    assert.ok(loaded, 'The packaged save tools did not load');
    const value = await evaluate("document.querySelector('#save-export').click(); document.querySelector('#save-output').value");
    const backup = JSON.parse(value);
    assert.equal(backup.version,1);
    assert.ok(JSON.parse(backup.values['wall.progress.v1']).completed.includes('plaza'));
    console.log('Native package exported its completed prologue through Settings.');
  }
  if (mode === 'advance') {
    await evaluate("document.querySelector('dialog[open]')?.close(); document.querySelector('#next').click()");
    assert.equal(await evaluate("document.querySelector('#chapter').textContent"),'1');
    console.log('The earlier native build saved chapter 1 from normal play.');
  }
  await evaluate("setTimeout(() => window.close(), 100)");
} finally {
  socket.close();
}
