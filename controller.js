const buttons = [
  [0, 'activate'], [1, 'back'], [2, 'inspect'], [3, 'timeline'],
  [9, 'library'], [12, 'previous'], [13, 'next'], [14, 'left'], [15, 'right'],
];
const actions = new Set([...buttons.map(([, action]) => action), 'move-left', 'move-right']);
const controls = 'button:enabled, select:enabled, summary, a[href]';

function available(root) {
  return [...root.querySelectorAll(controls)].filter(element =>
    !element.closest('[hidden], [inert]') && element.getClientRects().length > 0);
}

export function mountController(game) {
  let frame = 0;
  let previous = 0;
  let analog = 0;
  let nativeDirection = 0;
  let showedHint = false;
  let nativeHost = false;

  function updateMode() {
    document.documentElement.dataset.controllerInput = '';
    if (!showedHint) {
      showedHint = true;
      game.showHint();
    }
  }

  function focus(action) {
    const root = document.querySelector('dialog[open]') ?? document.querySelector('#app');
    const candidates = available(root);
    const at = candidates.indexOf(document.activeElement);
    if (!candidates.length) return;
    // Gamepads follow the document order, also used by keyboard Tab; left/right
    // follow reading order in a Hebrew layout.
    const reverse = action === 'previous'
      || (action === 'left' && document.dir !== 'rtl')
      || (action === 'right' && document.dir === 'rtl');
    const index = at < 0 ? 0 : (at + (reverse ? -1 : 1) + candidates.length) % candidates.length;
    candidates[index].focus();
    candidates[index].scrollIntoView({ block:'nearest', inline:'nearest' });
  }

  function run(action) {
    const dialog = document.querySelector('dialog[open]');
    if (['previous','next','left','right'].includes(action)) {
      focus(action);
    } else if (action === 'activate') {
      const active = document.activeElement;
      if (active.matches('select:enabled')) {
        active.selectedIndex = (active.selectedIndex + 1) % active.options.length;
        active.dispatchEvent(new Event('change', {bubbles:true}));
      } else if (active.matches(controls) && (!dialog || dialog.contains(active))) {
        active.click();
      } else {
        focus('next');
      }
    } else if (action === 'back') {
      if (dialog) dialog.close();
      else game.stop();
    } else if (!dialog) {
      if (action === 'inspect') game.inspect();
      if (action === 'timeline') game.timeline();
      if (action === 'library') game.library();
    }
  }

  function move(value) {
    if (value && !document.querySelector('dialog[open]')) {
      updateMode();
      game.walk(value);
    } else {
      game.stop();
    }
  }

  function check() {
    frame = 0;
    if (document.hidden || nativeHost) return;
    const pad = navigator.getGamepads?.().find(item => item?.connected);
    if (pad) {
      let held = 0;
      for (const [button, action] of buttons) {
        if (!pad.buttons[button]?.pressed) continue;
        const bit = 1 << button;
        held |= bit;
        if (previous & bit) continue;
        updateMode();
        run(action);
      }
      const axis = pad.axes[0] ?? 0;
      const direction = Math.abs(axis) > .35 ? Math.sign(axis) : 0;
      if (direction !== analog) {
        analog = direction;
        move(analog);
      }
      previous = held;
      frame = requestAnimationFrame(check);
    } else {
      if (analog) move(0);
      analog = 0;
      previous = 0;
    }
  }

  function start() {
    if (!frame && !document.hidden && !nativeHost && navigator.getGamepads) frame = requestAnimationFrame(check);
  }
  window.addEventListener('gamepadconnected', start);
  function otherInput() { delete document.documentElement.dataset.controllerInput; }
  document.addEventListener('pointerdown', otherInput);
  document.addEventListener('keydown', otherInput);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      nativeDirection = analog = 0;
      game.stop();
    } else {
      start();
    }
  });
  // Android WebView does not consistently expose a Gamepad API. The local
  // Android host forwards its OS controller key/axis events using this event.
  window.addEventListener('wall-controller', event => {
    const { action, pressed = true } = event.detail ?? {};
    if (!actions.has(action)) return;
    if (!nativeHost) {
      nativeHost = true;
      cancelAnimationFrame(frame);
      frame = 0;
      analog = 0;
      game.stop();
    }
    if (action === 'move-left' || action === 'move-right') {
      const value = action === 'move-left' ? -1 : 1;
      if (!pressed && nativeDirection !== value) return;
      nativeDirection = pressed ? value : 0;
      move(nativeDirection);
    } else if (pressed) {
      updateMode();
      run(action);
    }
  });
  start();
}

export const controllerHelp = {
  tr: 'Sol çubuk: yürü · Yön tuşları: gezin · A: seç · B: geri · X: incele · Y: zaman çizelgesi',
  en: 'Left stick: walk · D-pad: navigate · A: select · B: back · X: inspect · Y: timeline',
  he: 'מוט שמאלי: הליכה · חצים: ניווט · A: בחירה · B: חזרה · X: בדיקה · Y: ציר הזמן',
  az: 'Sol çubuq: get · İstiqamət düymələri: keç · A: seç · B: geri · X: araşdır · Y: zaman xətti',
};
