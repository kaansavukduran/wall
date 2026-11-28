import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';

export const pkg = 'com.fragariainteractive.wall';
export const adb = (...args) => execFileSync('adb', args, { encoding:'utf8', timeout:12_000, maxBuffer:4_000_000 }).trim();

export async function until(label, check, milliseconds = 8000) {
  const expiry = Date.now() + milliseconds;
  do {
    if (await check()) return;
    await wait(120);
  } while(Date.now() < expiry);
  throw new Error(label);
}

export async function attach() {
  const pid=adb('shell','pidof',pkg).split(/\s+/)[0];
  assert.match(pid,/^[0-9]+$/);
  const port=Number(adb('forward','tcp:0',`localabstract:webview_devtools_remote_${pid}`));
  let entry;
  try {
    await until('The debuggable Android WebView did not expose its page',async()=>{
      try {
        const response=await fetch(`http://127.0.0.1:${port}/json/list`,{signal:AbortSignal.timeout(1000)});
        entry=(await response.json()).find(page=>page.url.startsWith('https://appassets.androidplatform.net/'));
      } catch { /* The view is loading. */ }
      return entry;
    });
    const socket=new WebSocket(entry.webSocketDebuggerUrl);
    await new Promise((resolve,reject)=>{
      socket.addEventListener('open',resolve,{once:true});
      socket.addEventListener('error',reject,{once:true});
    });
    let request=0;
    function evaluate(expression) {
      const id=++request;
      return new Promise((resolve,reject)=>{
        const timeout=setTimeout(()=>{
          socket.removeEventListener('message',response);
          reject(new Error('Android Runtime.evaluate timed out'));
        },5000);
        function response(event) {
          const data=JSON.parse(event.data);
          if(data.id!==id) return;
          clearTimeout(timeout);
          socket.removeEventListener('message',response);
          if(data.error || data.result.exceptionDetails) reject(new Error(JSON.stringify(data)));
          else resolve(data.result.result.value);
        }
        socket.addEventListener('message',response);
        socket.send(JSON.stringify({id,method:'Runtime.evaluate',params:{expression,returnByValue:true}}));
      });
    }
    return {evaluate, close() { socket.close(); adb('forward','--remove',`tcp:${port}`); }};
  } catch(error) {
    adb('forward','--remove',`tcp:${port}`);
    throw error;
  }
}

