export async function makeWorld(canvas, reducedMotion) {
  const sprite = new Image();
  sprite.src = './assets/visitor.png';
  await sprite.decode();
  const context = canvas.getContext('2d', { alpha: false });
  const scenery = document.createElement('canvas');
  scenery.width = canvas.width;
  scenery.height = canvas.height;
  const background = scenery.getContext('2d', { alpha: false });
  const palettes = [
    ['#809b9d','#adb2a4','#b3a37a','#735e4b','#ccb589','#665544'],
    ['#a6a991','#d6bc8a','#a9916d','#6a5548','#e8c89a','#755646'],
    ['#6a8190','#8b9c93','#99887f','#68554e','#c8a786','#54474a'],
    ['#776983','#a399a1','#a68f8c','#705b65','#d9b6a1','#685667'],
  ];
  let position = 80;
  let facing = 1;
  let lastDraw = '';
  let walked = 0;
  let inspecting = false;
  function rect(ctx, color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
  function scene(index, layer = '') {
    inspecting = false;
    const variant = index === 0 ? 0 : Math.floor(index / 4) % palettes.length;
    const [sky, clouds, hills, mortar, stone, ground] = palettes[variant];
    rect(background, sky, 0, 0, 480, 240);
    rect(background, '#f0c780', 382, 29, 30, 30);
    for (let i = 0; i < 12; i++) {
      rect(background, clouds, (i * 71 + 12) % 480, 29 + (i * 19) % 55, 21 + i % 6 * 4, 3);
      rect(background, hills, i * 43, 86 + (i * 11) % 26, 60, 125);
    }
    const cutaway = index === 6 || (index === 8 && layer === 'before');
    const site = index === 0 || cutaway || [7, 8, 13, 14, 19, 21, 23, 24].includes(index);
    const wallStart = cutaway ? 112 : 166;
    if (site) {
      rect(background, mortar, wallStart, 86, 480 - wallStart, 118);
      for (let row = 0; row < 8; row++) {
        let left = wallStart - row % 2 * 17;
        for (let column = 0; left < 480; column++) {
          const block = 23 + ((row * 13 + column * 17) % 16);
          const x = Math.max(wallStart, left);
          const y = 88 + row * 14;
          const width = left + block - x - 2;
          left += block;
          if (width < 2) continue;
          const hue = (row * 3 + column * 5) % 7 === 0 ? '#b19a74' : stone;
          rect(background, hue, x, y, width, 12);
          rect(background, '#e0c198', x + 1, y + 1, width - 1, 2);
          rect(background, '#968365', x + 4, y + 9, Math.max(0,width - 6), 1);
          if ((row + column * 2) % 9 === 0) rect(background, '#7c8264', x + 1, y + 10, 4, 2);
        }
      }
      if (cutaway) {
        rect(background, '#d9bba1', 173, 55, 116, 31);
        rect(background, '#f6dbad', 163, 51, 135, 6);
        for (let x = 183; x < 289; x += 24) rect(background, '#8f6f59', x, 60, 5, 24);
      }
    } else {
      drawSetting(index, stone, mortar);
    }
    if (layer === 'platform') rect(background, '#ed973f', wallStart, 85, 480 - wallStart, 4);
    if (layer === 'wall') rect(background, '#ed973f', wallStart, 89, 5, 110);
    if (layer === 'temple' && cutaway) rect(background, '#ed973f', 161, 49, 140, 3);
    if (index === 8 && layer !== 'before') {
      for (let i = 0; i < 8; i++) rect(background, i % 2 ? mortar : stone, 300 + i * 17, 69 + i % 3 * 5, 16, 15);
    }
    if (layer === 'quarter' || (index === 23 && layer !== 'plaza')) {
      for (let x = 224; x < 430; x += 57) {
        rect(background, '#70594d', x, 143, 41, 58);
        rect(background, '#e2bb89', x + 2, 146, 37, 53);
        rect(background, '#594e4b', x + 13, 171, 13, 28);
      }
    }
    rect(background, ground, 0, 198, 480, 42);
    for (let i = 0; i < 91; i++) {
      const x = (i * 89 + index * 3) % 480;
      const y = 201 + i * 13 % 39;
      rect(background, i % 2 ? '#9f8270' : '#4d4140', x, y, 3 + i % 8, 1);
    }
    rect(background, '#b79b78', 0, 198, 480, 2);
    if (site && index !== 8) {
      for (const x of [175, 239, 410]) {
        rect(background, '#695447', x, 194, 14, 7);
        rect(background, '#757a55', x + 1, 189, 12, 5);
        rect(background, '#596747', x + 5, 185, 7, 7);
      }
    }
    lastDraw = '';
    draw(0);
  }
  function drawSetting(index, stone, mortar) {
    if (index === 12) {
      for (let row = 0; row < 8; row++) {
        const edge = 152 - Math.min(row, 5) * 8;
        rect(background, mortar, edge, 80 + row * 16, 480 - edge, 17);
        rect(background, '#32303a', edge + 56, 89 + row * 16, 480 - edge - 56, 13);
      }
      return;
    }
    if ([3,4,9,10,17,22].includes(index)) {
      for (let i = 0; i < 9; i++) {
        const x = 125 + i * 42;
        rect(background, mortar, x, 114 - i % 3 * 9, 36, 88);
        rect(background, stone, x + 2, 119 - i % 3 * 9, 32, 80);
        rect(background, '#453944', x + 14, 158, 10, 43);
      }
      if (index === 9 || index === 17) rect(background, '#58757e', 0, 150, 120, 49);
      return;
    }
    rect(background, mortar, 145, 86, 335, 112);
    rect(background, stone, 158, 92, 322, 104);
    for (let i = 0; i < 3; i++) {
      const x = 192 + i * 95;
      rect(background, '#6c5446', x, 120, 50, 42);
      rect(background, '#59433e', x + 3, 124, 44, 6);
      for (let j = 0; j < 5; j++) rect(background, j % 2 ? '#a18869' : '#dec49f', x + 5 + j * 8, 131, 5, 24);
    }
    rect(background, '#564039', 260, 174, 130, 10);
    rect(background, '#59453f', 272, 184, 5, 15);
    rect(background, '#59453f', 370, 184, 5, 15);
    rect(background, '#eed8a6', 301, 169, 32, 5);
  }

  function draw(frame) {
    const x = Math.round(position);
    const key = [x, facing, frame, inspecting].join(':');
    if (key === lastDraw) return;
    lastDraw = key;
    context.imageSmoothingEnabled = false;
    context.drawImage(scenery, 0, 0);
    if (inspecting) {
      rect(context, '#513c37', 200, 182, 20, 22);
      rect(context, '#f3c675', 202, 184, 16, 18);
      rect(context, '#5c463c', 207, 190, 6, 6);
    }
    rect(context, '#493935', x - 13, 207, 24, 3);
    context.save();
    context.translate(x, 207);
    context.scale(facing, 1);
    context.drawImage(sprite, frame * 16, 0, 16, 24, -16, -48, 32, 48);
    context.restore();
  }
  return {
    scene,
    move(direction, distance) {
      facing = direction;
      const next = Math.max(16, Math.min(464, position + direction * distance));
      const traveled = Math.abs(next - position);
      position = next;
      walked += traveled;
      draw(reducedMotion.matches || traveled === 0 ? 0 : Math.floor(walked / 6) % 4);
    },
    idle() { draw(0); },
    inspect() { inspecting = true; draw(0); },
  };
}
