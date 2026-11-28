import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { pkg, adb, until, attach } from './android-preview-harness.mjs';
import { readdirSync } from 'node:fs';
import { setTimeout as wait } from 'node:timers/promises';

const diagnostics = [];

function joystick(id, name) {
  const handle = spawn('adb', ['shell','-T','uinput','-'], { stdio:['pipe','pipe','pipe'] });
  handle.stdout.on('data', value => diagnostics.push(`${name} ${value}`));
  handle.stderr.on('data', value => diagnostics.push(`${name} ${value}`));
  handle.stdin.on('error', error => diagnostics.push(`${name} ${error.message}`));
  const send = (command, values = {}) => handle.stdin.write(JSON.stringify({id,command,...values})+'\n');
  send('register', {
    name,vid:0x1209,pid:0x4230 + id,bus:'usb',
    configuration:[
      {type:'UI_SET_EVBIT',data:['EV_KEY','EV_ABS']},
      {type:'UI_SET_KEYBIT',data:['BTN_SOUTH','BTN_EAST','BTN_NORTH','BTN_WEST']},
      {type:'UI_SET_ABSBIT',data:['ABS_X','ABS_Y']},
    ],
    abs_info:['ABS_X','ABS_Y'].map(code=>({code,info:{value:0,minimum:-32768,maximum:32767,fuzz:0,flat:0,resolution:1}})),
  });
  const connected = () => new RegExp(`Device [0-9]+: ${name}(?:\\s|$)`).test(adb('shell','dumpsys','input'));
  return {
    connect:() => until(`Android did not enumerate ${name}`,connected),
    move(value) {
      send('updateTimeBase');
      send('inject',{events:['EV_ABS','ABS_X',value,'EV_SYN','SYN_REPORT',0]});
    },
    async disconnect() {
      handle.stdin.end();
      await until(`Android still lists ${name}`,()=>!connected());
    },
    close() { handle.stdin.end(); handle.kill(); },
  };
}

async function inspect(folder, version, shouldRelease) {
  const names=readdirSync(folder).filter(file=>file.endsWith('.apk'));
  assert.equal(names.length,1);
  adb('install',`${folder}/${names[0]}`);
  adb('shell','am','start','-W','-n',`${pkg}/.WallActivity`);
  const browser=await attach();
  const {evaluate}=browser;
  const devices=[];
  const add=(id,name)=>{const item=joystick(id,name); devices.push(item); return item;};
  try {
    await until('WALL did not reach the active prologue',async()=>evaluate(`(() => {
      if (document.querySelector('#app[hidden]')) return false;
      document.querySelector('#arrival:not([hidden]) #start-campaign')?.click();
      return Boolean(document.querySelector('#campaign:not([hidden]) #world'));
    })()`));
    assert.equal(await evaluate('document.querySelector("footer > span:last-child").textContent'),version);
    await evaluate(`window.observedJoystick = [];
      window.addEventListener('wall-controller', event => window.observedJoystick.push(event.detail));`);
    const read=()=>evaluate('window.observedJoystick');
    const seen=async(action,pressed)=> (await read()).some(item=>item.action===action && item.pressed===pressed);
    const footprint=()=>evaluate(`(() => {
      const canvas=document.querySelector('#world');
      return Array.from(canvas.getContext('2d').getImageData(0,209,canvas.width,1).data);
    })()`);
    const first=add(1,'WALL Virtual Stick');
    const spare=add(2,'WALL Virtual Spare');
    await Promise.all([first.connect(),spare.connect()]);
    const before=await footprint();
    first.move(32767);
    await until('No native stick press reached the actual APK',()=>seen('move-right',true));
    assert.notDeepEqual(await footprint(),before);
    await spare.disconnect();
    assert.equal(await seen('move-right',false),false,'An unrelated virtual device stopped movement');
    await first.disconnect();
    if(!shouldRelease) {
      await wait(350);
      console.log(version,'stick release after actual virtual removal:',await seen('move-right',false));
      return;
    }
    await until('Active virtual stick removal did not reach the release handler',()=>seen('move-right',false));
    const stopped=await footprint();
    await wait(170);
    assert.deepEqual(await footprint(),stopped,'The scene continued moving after release');
    assert.equal(await evaluate('JSON.parse(localStorage.getItem("wall.progress.v1")).placement[1]'),1);
    const returned=add(3,'WALL Virtual Reconnect');
    await returned.connect();
    returned.move(-32768);
    await until('Reconnected stick did not move left',()=>seen('move-left',true));
    assert.notDeepEqual(await footprint(),stopped);
    await returned.disconnect();
    await until('Reconnected stick did not release after removal',()=>seen('move-left',false));
    console.log(version,'active virtual removal stopped the actual scene, saved placement and allowed a new stick');
  } finally {
    for(const item of devices) item.close();
    browser.close();
    adb('uninstall',pkg);
  }
}

try {
  console.log('Virtual input command:', adb('shell','command -v uinput'));
  await inspect('baseline',process.env.WALL_PREVIOUS_TAG,false);
  await inspect('candidate',process.env.WALL_TAG,true);
} catch(error) {
  console.error(error);
  console.error(diagnostics.join(''));
  process.exitCode=1;
}
