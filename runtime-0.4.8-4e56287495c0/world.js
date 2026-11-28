export async function makeWorld(canvas, reducedMotion) {
  const sprite = new Image();
  sprite.src = new URL('./assets/visitor.png', import.meta.url).href;
  await sprite.decode();
  const context = canvas.getContext('2d', { alpha: false });
  const scenery = document.createElement('canvas');
  scenery.width = canvas.width;
  scenery.height = canvas.height;
  const background = scenery.getContext('2d', { alpha: false });
  let plazaViews;
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
    drawScenery(background, index, layer);
    lastDraw = '';
    draw(0);
  }

  function drawScenery(background, index, layer) {
    const variant = index === 0 ? 0 : Math.floor(index / 4) % palettes.length;
    const [sky, clouds, hills, mortar, stone, ground] = palettes[variant];
    rect(background, sky, 0, 0, 480, 240);
    rect(background, '#f0c780', 382, 29, 30, 30);
    for (let i = 0; i < 12; i++) {
      rect(background, clouds, (i * 71 + 12) % 480, 29 + (i * 19) % 55, 21 + i % 6 * 4, 3);
      rect(background, hills, i * 43, 86 + (i * 11) % 26, 60, 125);
    }
    const cutaway = index === 6 || index === 8;
    const cityWall = index === 19 && layer === 'city-walls';
    const site = index === 0 || [13, 14, 21, 23, 24].includes(index) || (index === 19 && !cityWall);
    const wallStart = 166;
    if (cutaway) {
      drawPlatformSection(background, index === 6 || layer === 'before', layer);
    } else if (site) {
      rect(background, mortar, wallStart, 86, 480 - wallStart, 118);
      for (let row = 0; row < 8; row++) {
        let left = wallStart - row % 2 * 17;
        for (let column = 0; left < 480; column++) {
          const block = index === 19 && row < 3 ? 13 + column % 6 : 23 + ((row * 13 + column * 17) % 16);
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
    } else {
      drawSetting(background, index, stone, mortar, layer);
    }
    if (index === 13) {
      rect(background, '#537487', 213, 66, 64, 20);
      rect(background, '#467181', 219, 63, 52, 6);
      for (const [x, y, width] of [[224,57,42],[228,51,34],[235,46,20]]) {
        rect(background, '#dabc68', x, y, width, 6);
      }
      rect(background, '#d9b58c', 346, 68, 99, 18);
      rect(background, '#6c6e69', 342, 64, 106, 6);
      rect(background, '#595c5a', 395, 55, 25, 10);
      for (const [position, x, y, width] of [['dome-rock',213,84,64],['qibli',346,84,99],['western-wall',180,179,280]]) {
        if (layer === position) rect(background, '#ffe1a0', x, y, width, 3);
      }
    }
    if (index === 19 && layer === 'kotel-courses') {
      rect(background, '#ffe1a0', 168, 128, 312, 2);
    }
    if (layer === 'quarter' || (index === 23 && layer !== 'plaza')) {
      for (let x = 197; x < 430; x += 57) {
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
    if (site) {
      for (const x of [175, 239, 410]) {
        rect(background, '#695447', x, 194, 14, 7);
        rect(background, '#757a55', x + 1, 189, 12, 5);
        rect(background, '#596747', x + 5, 185, 7, 7);
      }
    }
  }

  function drawPlatformSection(context, intact, layer) {
    rect(context, '#906f54', 155, 118, 325, 80);
    for (let row = 0; row < 6; row++) {
      const y = 124 + row * 12;
      for (let x = 157 + row % 2 * 16; x < 480; x += 35) {
        rect(context, '#a89172', x, y, 24, 3);
        rect(context, '#745944', x + 7, y + 6, 14, 2);
      }
      rect(context, '#d8bc8b', 108 + row % 2 * 6, 119 + row * 13, 42 - row % 2 * 6, 11);
    }
    rect(context, '#725b49', 106, 114, 51, 5);
    rect(context, layer === 'platform' ? '#ffe1a0' : '#d5ba8d', 106, 108, 374, 6);
    if (layer === 'wall') rect(context, '#ffe1a0', 103, 117, 5, 81);
    if (intact) {
      rect(context, '#d1ac82', 259, 67, 128, 41);
      rect(context, '#654d3e', 272, 71, 104, 34);
      for (let x = 277; x <= 367; x += 30) rect(context, '#e0c594', x, 71, 7, 34);
      rect(context, layer === 'temple' ? '#ffe1a0' : '#e0c594', 250, 61, 146, 7);
    } else {
      for (let x = 261; x <= 370; x += 26) {
        rect(context, '#93765d', x, 101 - (x % 3), 15, 7 + (x % 3));
      }
    }
  }

  function comparePlaza(canvas, view, rtl) {
    if (!plazaViews) {
      plazaViews = ['quarter', 'plaza'].map(layer => {
        const image = document.createElement('canvas');
        image.width = canvas.width;
        image.height = canvas.height;
        drawScenery(image.getContext('2d', { alpha:false }), 0, layer);
        return image;
      });
    }
    const context = canvas.getContext('2d', { alpha:false });
    const {width, height} = canvas;
    const [quarter, plaza] = plazaViews;
    context.drawImage(view === 2 ? plaza : quarter, 0, 0);
    if (view === 1) {
      const half = width / 2;
      const start = rtl ? 0 : half;
      context.drawImage(plaza, start, 0, half, height, start, 0, half, height);
      rect(context, '#201b18', half - 1, 0, 2, height);
    }
  }
  function drawSetting(background, index, stone, mortar, layer) {
    if (index === 2) {
      rect(background, mortar, 119, 91, 310, 107);
      rect(background, stone, 112, 88, 328, 10);
      rect(background, '#e1c395', 126, 82, 308, 6);
      rect(background, '#634a3d', 127, 104, 291, 89);
      rect(background, '#9c7556', 133, 108, 45, 82);
      rect(background, '#9c7556', 188, 108, 126, 82);
      rect(background, '#805d51', 323, 108, 90, 82);
      for (const x of [134, 174, 315, 413]) {
        rect(background, '#dcc193', x, 106, 5, 84);
      }
      for (const [zone, x, width] of [['porch',133,45], ['hall',188,126], ['sanctuary',323,90]]) {
        rect(background, layer === zone ? '#ffe1a0' : stone, x, 190, width, 5);
      }
      return;
    }
    if (index === 9) {
      rect(background, '#624a3d', 106, 53, 331, 133);
      rect(background, '#436776', 111, 58, 321, 123);
      rect(background, '#9b8865', 111, 130, 321, 51);
      rect(background, '#9b8865', 113, 118, 97, 15);
      rect(background, '#9b8865', 284, 122, 51, 12);
      rect(background, '#9b8865', 343, 113, 87, 19);
      rect(background, '#9b8865', 355, 84, 29, 7);
      rect(background, '#9b8865', 380, 82, 11, 5);
      rect(background, '#9b8865', 411, 58, 21, 31);
      for (const [place, x, y] of [['cyrene',179,120], ['egypt',298,125], ['cyprus',371,87]]) {
        if (layer === place) rect(background, '#222832', x - 8, y - 8, 16, 16);
        rect(background, layer === place ? '#ffe1a0' : '#ecaa6d', x - 4, y - 4, 8, 8);
      }
      return;
    }
    if (index === 10) {
      rect(background, mortar, 160, 115, 285, 83);
      rect(background, '#7f6762', 165, 120, 275, 72);
      for (let row = -37; row <= 37; row++) {
        const edge = Math.floor(Math.sqrt(37 ** 2 - row ** 2));
        rect(background, row < 0 ? '#b2afa3' : '#8b887e', 299 - edge, 129 + row, edge * 2 + 1, 1);
      }
      if (layer === 'ritual') {
        for (let offset = 0; offset < 3; offset++) {
          rect(background, '#454744', 286 + offset * 3, 113 + offset * 2, 2, 31 - offset * 2);
        }
        rect(background, '#454744', 304, 130, 8, 10);
        rect(background, '#454744', 306, 128, 4, 14);
      } else {
        rect(background, '#454744', 277, 113, 44, 4);
        rect(background, '#454744', 279, 143, 40, 4);
        for (let x = 280; x <= 315; x += 11) rect(background, '#454744', x, 118, 3, 24);
      }
      return;
    }
    if (index === 12) {
      for (let row = 0; row < 8; row++) {
        const edge = 152 - Math.min(row, 5) * 8;
        rect(background, mortar, edge, 80 + row * 16, 480 - edge, 17);
        rect(background, '#32303a', edge + 56, 89 + row * 16, 480 - edge - 56, 13);
      }
      return;
    }
    if (index === 17) {
      rect(background, '#624a3d', 109, 57, 326, 128);
      rect(background, '#436776', 114, 62, 316, 118);
      rect(background, '#a69571', 114, 62, 316, 25);
      rect(background, '#a69571', 133, 85, 53, 37);
      rect(background, '#a69571', 184, 86, 25, 17);
      rect(background, '#a69571', 390, 85, 40, 31);
      rect(background, '#a69571', 154, 140, 276, 40);
      rect(background, '#a69571', 195, 132, 94, 13);
      const destinations = {'portugal':[141,96],'north-africa':[185,145],'salonika':[397,101]};
      if (destinations[layer]) {
        const [x,y] = destinations[layer];
        for (let step = 1; step <= 20; step++) {
          const proportion = step / 20;
          rect(background, '#ffe1a0', Math.round(163 + (x - 163) * proportion), Math.round(106 + (y - 106) * proportion), 3, 3);
        }
        rect(background, '#ffe1a0', x - 2, y - 2, 7, 7);
      }
      rect(background, '#674b43', 160, 103, 8, 8);
      return;
    }
    if (index === 19) {
      rect(background, '#6f5e51', 108, 103, 372, 95);
      for (const x of [120,170,220,330,380,430]) {
        rect(background, '#c7a97f', x, 81, 28, 19);
      }
      for (let row = 0; row < 5; row++) {
        for (let x = 113 + row % 2 * 20; x < 480; x += 40) {
          rect(background, row < 2 ? '#c8ab80' : '#ad916e', x, 106 + row * 17, 38, 15);
        }
      }
      rect(background, '#443a38', 253, 149, 63, 49);
      rect(background, '#443a38', 263, 140, 43, 12);
      rect(background, '#443a38', 273, 132, 23, 9);
      rect(background, '#d2b584', 272, 117, 23, 7);
      return;
    }
    if ([3,4,22].includes(index)) {
      for (let i = 0; i < 9; i++) {
        const x = 125 + i * 42;
        rect(background, mortar, x, 114 - i % 3 * 9, 36, 88);
        rect(background, stone, x + 2, 119 - i % 3 * 9, 32, 80);
        rect(background, '#453944', x + 14, 158, 10, 43);
      }
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
    if (index === 7) {
      for (const [x, width] of [[270,21],[307,25],[348,28]]) {
        rect(background, '#e9c594', x, 165, width, 9);
        rect(background, '#724b3f', x + 3, 168, width - 7, 1);
        rect(background, '#724b3f', x + 5, 170, width - 9, 1);
      }
    }
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
    comparePlaza,
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
