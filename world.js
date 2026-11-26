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
  let steps = 0;
  function rect(ctx, color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
  function scene(index, layer = '') {
    const variant = index === 0 ? 0 : Math.floor(index / 4) % palettes.length;
    const [sky, clouds, hills, mortar, stone, ground] = palettes[variant];
    rect(background, sky, 0, 0, 480, 240);
    rect(background, '#f0c780', 382, 29, 30, 30);
    for (let i = 0; i < 12; i++) {
      rect(background, clouds, (i * 71 + 12) % 480, 29 + (i * 19) % 55, 21 + i % 6 * 4, 3);
      rect(background, hills, i * 43, 86 + (i * 11) % 26, 60, 125);
    }
    const cutaway = index === 6 || layer !== '';
    const wallStart = cutaway ? 112 : 166;
    rect(background, mortar, wallStart, 86, 480 - wallStart, 118);
    for (let row = 0; row < 8; row++) {
      for (let column = -1; column < 13; column++) {
        const left = wallStart + column * 32 + row % 2 * 16;
        const x = Math.max(wallStart, left);
        const y = 88 + row * 14;
        const width = left + 30 - x;
        if (width < 1) continue;
        rect(background, stone, x, y, width, 12);
        rect(background, '#edcc9f', x + 1, y + 1, width - 1, 2);
        rect(background, '#968365', x + 4, y + 9, Math.max(0,width - 6), 1);
      }
    }
    if (cutaway && index !== 8 || layer === 'temple') {
      rect(background, '#d9bba1', 173, 55, 116, 31);
      rect(background, '#f6dbad', 163, 51, 135, 6);
      for (let x = 183; x < 289; x += 24) rect(background, '#8f6f59', x, 60, 5, 24);
    }
    if (layer === 'platform') rect(background, '#ed973f', wallStart, 85, 480 - wallStart, 4);
    if (layer === 'wall') rect(background, '#ed973f', wallStart, 89, 5, 110);
    if (layer === 'temple') rect(background, '#ed973f', 161, 49, 140, 3);
    rect(background, ground, 0, 198, 480, 42);
    for (let i = 0; i < 91; i++) {
      const x = (i * 89 + index * 3) % 480;
      const y = 201 + i * 13 % 39;
      rect(background, i % 2 ? '#9f8270' : '#4d4140', x, y, 3 + i % 8, 1);
    }
    rect(background, '#b79b78', 0, 198, 480, 2);
    lastDraw = '';
    draw(0);
  }
  function draw(frame) {
    const x = Math.round(position);
    const key = [x, facing, frame].join(':');
    if (key === lastDraw) return;
    lastDraw = key;
    context.imageSmoothingEnabled = false;
    context.drawImage(scenery, 0, 0);
    rect(context, '#493935', x - 13, 207, 24, 3);
    context.save();
    context.translate(x, 207);
    context.scale(facing, 1);
    context.drawImage(sprite, frame * 16, 0, 16, 24, -16, -48, 32, 48);
    context.restore();
  }
  return {
    scene,
    step(direction) {
      facing = direction;
      position = Math.max(16, Math.min(464, position + direction * 5));
      steps++;
      draw(reducedMotion.matches ? 0 : steps % 4);
    },
    idle() { draw(0); },
  };
}
