import assert from 'node:assert/strict';
import { setTimeout as wait } from 'node:timers/promises';

const port = Number(process.argv[2]);
assert.ok(Number.isInteger(port) && port > 0);
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
    ready = await evaluate("Boolean(document.querySelector('#app:not([hidden]) [data-choice]'))");
    if (!ready) await wait(250);
  }
  assert.ok(ready, 'The packaged browser did not reach the first scene');
  assert.equal(await evaluate("document.querySelector('[data-choice=\"1\"]').click(); !document.querySelector('#next').hidden"), true);
  console.log('Native package reached and completed the prologue.');
  if (await evaluate("Boolean(document.querySelector('#kabbalah'))")) {
    await evaluate("document.querySelector('#library-button').click(); document.querySelector('#kabbalah summary').click()");
    let loaded = false;
    while (!loaded && Date.now() < deadline) {
      loaded = await evaluate("document.querySelector('#kabbalah-lesson')?.options.length === 9");
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
} finally {
  socket.close();
}
