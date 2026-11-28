export const visitorBounds = [16,464];

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
  const [leftEdge, rightEdge] = visitorBounds;
  let position = 80;
  let facing = 1;
  let lastDraw = '';
  let lastScene = '';
  let walked = 0;
  let inspecting = false;
  function rect(ctx, color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
  function scene(index, layer = '') {
    const key = index + ':' + layer;
    if (key !== lastScene) {
      drawScenery(background, index, layer);
      lastScene = key;
      lastDraw = '';
    }
    inspecting = false;
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
    const site = index === 0 || [13, 23, 24].includes(index) || (index === 19 && !cityWall);
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
    if (layer === 'quarter' || layer === 'mughrabi-quarter' || layer === 'paving-request' || (index === 23 && layer !== 'plaza')) {
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
    if (layer === 'paving-request') {
      rect(background, '#ffe1a0', 192, 205, 244, 2);
      rect(background, '#ffe1a0', 192, 202, 2, 5);
      rect(background, '#ffe1a0', 434, 202, 2, 5);
    }
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

  function comparePlaza(canvas, view, rtl, mark) {
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
    if (mark === 'passage') {
      for (let x = 170; x < width-14; x += 28) {
        rect(context, '#49351e', x, 201, 18, 7);
        rect(context, '#ffe1a0', x+1, 202, 16, 3);
      }
    }
    if (mark === 'wall') {
      const spans = view === 1 ? [[177.5,49],[254.5,202]] : [[177.5,279]];
      for (const [x, width] of spans) {
        context.lineWidth = 5;
        context.strokeStyle = '#49351e';
        context.strokeRect(x, 98.5, width, 32);
        context.lineWidth = 3;
        context.strokeStyle = '#ffe1a0';
        context.strokeRect(x, 98.5, width, 32);
      }
    }
  }

  function drawPilgrimage(context, stage, stone, mortar) {
    if (stage === 'pilgrim-gathering') {
      for (const [x, y, width] of [[122,113,62],[188,99,80],[362,110,71]]) {
        rect(context, mortar, x, y - 5, width + 4, 7);
        rect(context, stone, x + 2, y + 2, width, 196 - y);
        rect(context, '#644b42', x + 19, y + 35, 13, 161 - y);
      }
    } else if (stage === 'pilgrim-arrival') {
      rect(context, mortar, 125, 92, 317, 106);
      for (let row = 0; row < 5; row++) {
        for (let x = 128 + row % 2 * 16; x < 429; x += 31) {
          rect(context, stone, x, 96 + row * 20, Math.min(27,439 - x), 16);
        }
      }
      rect(context, '#624d45', 348, 138, 51, 60);
      rect(context, '#624d45', 355, 128, 37, 12);
      rect(context, '#9c7354', 160, 160, 91, 6);
      rect(context, '#65483f', 169, 166, 5, 26);
      rect(context, '#65483f', 233, 166, 5, 26);
    } else {
      rect(context, mortar, 191, 108, 252, 90);
      rect(context, stone, 185, 106, 264, 9);
      for (const x of [205,233,385,413]) rect(context, '#e0c594', x, 116, 9, 72);
      rect(context, '#645049', 286, 124, 61, 57);
      for (let step = 0; step < 3; step++) {
        rect(context, stone, 275 - step * 10, 181 + step * 6, 84 + step * 20, 5);
      }
    }
    const x = stage === 'pilgrim-court' ? 257 : 300;
    rect(context, '#665046', x + 8, 136, 17, 7);
    rect(context, '#c49c78', x + 11, 143, 12, 9);
    rect(context, '#627077', x + 6, 152, 21, 30);
    rect(context, '#50473e', x + 7, 182, 6, 15);
    rect(context, '#50473e', x + 20, 182, 6, 15);
    rect(context, '#c49c78', x + 23, 157, 10, 5);
    rect(context, '#b88558', x + 27, 155, 23, 13);
    rect(context, '#e2ba7d', x + 28, 152, 21, 5);
    rect(context, '#8c654b', x + 30, 159, 19, 2);
    rect(context, '#80556a', x + 31, 148, 6, 5);
    rect(context, '#857d4c', x + 39, 148, 6, 5);
  }

  function drawSetting(background, index, stone, mortar, layer) {
    if (index === 1) {
      rect(background, '#493840', 124, 69, 356, 132);
      rect(background, '#7c5b51', 129, 72, 351, 116);
      rect(background, '#49343b', 320, 78, 133, 49);
      rect(background, '#d79871', 324, 81, 125, 41);
      rect(background, '#e7ae79', 325, 107, 124, 14);
      rect(background, '#614754', 376, 81, 4, 43);
      rect(background, '#453341', 181, 155, 265, 26);
      rect(background, '#9f795e', 184, 150, 261, 23);
      rect(background, '#695045', 200, 178, 9, 19);
      rect(background, '#695045', 421, 178, 9, 19);
      rect(background, '#75544a', 213, 145, 51, 17);
      rect(background, layer === 'matzah' ? '#ffe1a0' : '#caa16f', 219, 145, 43, 11);
      rect(background, '#967657', 224, 147, 33, 1);
      for (let x = 224; x < 255; x += 4) {
        rect(background, '#826043', x, 151 + x % 2, 2, 2);
      }
      rect(background, '#537261', 258, 152, 17, 6);
      const book = layer === 'questions' ? '#ffe1a0' : '#e4d8bb';
      rect(background, '#4b4c56', 296, 145, 65, 17);
      rect(background, book, 300, 144, 28, 14);
      rect(background, book, 330, 144, 27, 14);
      for (const x of [304,334]) for (let y = 148; y < 156; y += 3) {
        rect(background, '#9a7861', x, y, 18, 1);
      }
      const scroll = layer === 'exodus' ? '#ffe1a0' : '#e1bc8b';
      rect(background, scroll, 388, 145, 39, 11);
      rect(background, '#8a634e', 386, 143, 4, 15);
      rect(background, '#8a634e', 425, 143, 4, 15);
      rect(background, '#8a634e', 394, 148, 23, 1);
      rect(background, '#8a634e', 394, 152, 15, 1);
      return;
    }
    if (index === 3) {
      rect(background, '#3f3742', 120, 68, 360, 128);
      rect(background, '#58454a', 125, 73, 355, 118);
      if (layer === 'destruction-587') {
        for (const [x,y,width] of [[142,142,48],[192,120,45],[265,148,57],[338,114,35],[387,152,66]]) {
          rect(background, '#886f65', x, y, width, 46);
          rect(background, '#c49d7f', x, y, width - 12, 4);
          rect(background, '#4a3b41', x + 12, y + 17, 15, 29);
          rect(background, '#aa836d', x + width - 10, y + 12, 8, 20);
        }
      } else if (layer === 'stayed-exiled') {
        for (const [x,color] of [[164,'#c6a77d'],[381,'#cea56f']]) {
          for (let block = 0; block < 3; block++) {
            const left = x + block * 16;
            rect(background, color, left, 125 - block % 2 * 8, 14, 38 + block % 2 * 8);
            rect(background, '#745550', left + 4, 145, 5, 18);
          }
        }
        for (let x = 223; x < 380; x += 9) {
          rect(background, '#dfba82', x, 150 - (x % 4), 5, 3);
        }
        rect(background, '#d7ab76', 178, 173, 33, 5);
        rect(background, '#d7ab76', 393, 173, 28, 5);
      } else {
        rect(background, '#46323a', 252, 98, 106, 84);
        rect(background, '#b7815d', 259, 92, 94, 83);
        rect(background, '#d1a076', 263, 97, 84, 2);
        for (let y = 105; y < 170; y += 8) for (let x = 269; x < 343; x += 9) {
          rect(background, '#805542', x, y, 5, 2);
          rect(background, '#805542', x + 3, y + 2, 2, 3);
        }
        if (layer === 'chronicle-597') rect(background, '#ffe1a0', 257, 177, 96, 3);
      }
      return;
    }
    if (index === 4) {
      rect(background, '#453a43', 112, 69, 354, 121);
      rect(background, '#ab9671', 118, 75, 342, 109);
      if (layer === 'petition-407') {
        rect(background, '#704f46', 180, 111, 218, 53);
        rect(background, '#edd6a0', 187, 112, 204, 48);
        for (let y = 120; y < 154; y += 6) {
          rect(background, '#a18363', 196, y, 182 - y % 13, 2);
        }
        rect(background, '#9e744e', 185, 108, 6, 56);
        rect(background, '#9e744e', 386, 108, 6, 56);
      } else {
        for (let row = 0; row < 5; row++) {
          rect(background, '#557d86', 150 - row * 5, 75 + row * 22, 73, 21);
        }
        const marker = ['jerusalem-temple', 'elephantine'].includes(layer) ? layer : '';
        rect(background, marker === 'elephantine' ? '#ffe1a0' : '#d6bd85', 151, 130, 31, 17);
        rect(background, '#8f7257', 161, 131, 11, 12);
        rect(background, marker === 'jerusalem-temple' ? '#ffe1a0' : '#d6bd85', 348, 116, 59, 31);
        rect(background, '#745a4f', 356, 124, 44, 21);
        for (const x of [360,376,392]) rect(background, '#c19d69', x, 124, 4, 20);
        rect(background, '#84634f', 344, 114, 67, 4);
      }
      return;
    }
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
    if (index === 7) {
      if (layer.startsWith('pilgrim-')) {
        drawPilgrimage(background, layer, stone, mortar);
        return;
      }
      if (layer.startsWith('market-measure-')) {
        const step = Number(layer.at(-1));
        rect(background, '#685b50', 124, 112, 322, 88);
        rect(background, '#8b7b68', 129, 117, 312, 79);
        rect(background, '#dbc6a4', 163, 111, 254, 32);
        rect(background, '#b49973', 169, 133, 241, 10);
        rect(background, '#8b755d', 262, 111, 73, 10);
        rect(background, '#8b755d', 271, 121, 55, 7);
        rect(background, '#8b755d', 293, 127, 10, 16);
        rect(background, '#745e51', 252, 153, 92, 7);
        rect(background, '#5f5651', 258, 160, 80, 21);
        rect(background, '#b68c65', 260, 167, 76, 18);
        rect(background, '#b68c65', 266, 185, 64, 9);
        rect(background, '#d4ad7a', 261, 168, 74, 3);
        if (step === 1 || step === 2) rect(background, '#ad7159', 290, 141, 17, 6);
        if (step === 2) {
          rect(background, '#6d9ca1', 267, 114, 63, 5);
          rect(background, '#739da4', 273, 119, 51, 7);
        }
        if (step === 3) {
          rect(background, '#90b5b2', 295, 134, 6, 43);
          rect(background, '#79a1a5', 265, 176, 66, 10);
        }
        return;
      }
      if (layer === 'theodotos-inscription') {
        rect(background, '#594d4c', 116, 73, 327, 125);
        rect(background, '#ac9278', 121, 78, 317, 120);
        rect(background, '#ccb495', 130, 81, 297, 5);
        rect(background, '#68534c', 350, 103, 64, 95);
        rect(background, '#755d53', 359, 110, 47, 88);
        rect(background, '#bc9a78', 367, 111, 32, 5);
        rect(background, '#bb9a78', 210, 178, 71, 20);
        rect(background, '#785e52', 175, 96, 146, 90);
        rect(background, '#c4aa88', 179, 99, 138, 83);
        rect(background, '#e3c8a4', 181, 100, 132, 3);
        for (let row = 0; row < 8; row++) {
          for (let mark = 0; mark < 18 - row % 3; mark++) {
            const x = 190 + mark * 6;
            const y = 111 + row * 8;
            rect(background, '#796656', x, y, 1, 4);
            rect(background, '#796656', x, y + (row + mark) % 3, 4, 1);
          }
        }
        rect(background, '#99775b', 129, 173, 32, 5);
        rect(background, '#805c49', 134, 178, 5, 18);
        rect(background, '#805c49', 154, 178, 5, 18);
        rect(background, '#e6ca91', 132, 166, 25, 7);
        rect(background, '#685d57', 378, 167, 21, 29);
        rect(background, '#779091', 376, 168, 25, 5);
        rect(background, '#a9c0b4', 379, 169, 20, 2);
        return;
      }
      rect(background, '#50404a', 118, 65, 362, 134);
      rect(background, '#88715d', 123, 70, 357, 124);
      rect(background, '#5c4b45', 165, 154, 287, 29);
      rect(background, '#a88262', 160, 148, 296, 18);
      rect(background, '#68514a', 169, 181, 12, 17);
      rect(background, '#68514a', 428, 181, 12, 17);
      rect(background, '#554649', 158, 88, 67, 52);
      rect(background, '#a48b68', 165, 94, 53, 40);
      rect(background, '#6c5648', 165, 122, 53, 3);
      rect(background, '#cdab81', 232, 126, 45, 24);

      let columns = 0;
      if (layer === 'scroll-isaiah') columns = 5;
      else if (layer === 'scroll-rule') columns = 3;
      else if (layer === 'scroll-pesher') columns = 2;
      if (columns === 0) {
        rect(background, '#ddba8a', 281, 141, 90, 13);
        rect(background, '#84604d', 286, 144, 73, 2);
        return;
      }

      const right = 429;
      const left = right - columns * 39 - 9;
      rect(background, '#745745', left, 98, right - left, 55);
      rect(background, '#ecd19a', left + 4, 96, right - left - 8, 56);
      for (let column = 0; column < columns; column++) {
        for (let row = 0; row < 10; row++) {
          const x = left + 9 + column * 39 + row % 3 * 2;
          const y = 102 + row * 4;
          const quotation = layer === 'scroll-pesher' && row < 4;
          const ink = quotation ? '#924136' : '#68604b';
          rect(background, ink, x, y, 28 - (row * 3 + column * 5) % 8, 1);
          if (layer === 'scroll-rule' && row % 3 === 0) rect(background, '#935849', x + 27, y, 3, 2);
        }
      }
      return;
    }
    if (index === 12) {
      if (layer === 'cave-first-exit' || layer === 'cave-second-exit') {
        const dusk = layer === 'cave-second-exit';
        if (dusk) rect(background, '#af786d', 0, 0, 480, 102);
        rect(background, dusk ? '#766044' : '#7b7754', 105, 119, 375, 79);
        for (let row = 0; row < 6; row++) {
          rect(background, dusk ? '#98734e' : '#a59561', 122 - row * 3, 128 + row * 12, 358 + row * 3, 2);
        }
        rect(background, '#6d594f', 299, 132, 20, 31);
        rect(background, '#d9bc9b', 303, 123, 12, 9);
        rect(background, '#514742', 301, 120, 16, 5);
        rect(background, '#50463e', 301, 163, 5, 17);
        rect(background, '#50463e', 313, 163, 5, 17);
        if (dusk) {
          rect(background, '#efd097', 370, 72, 39, 22);
          rect(background, '#c7bba7', 299, 124, 4, 9);
          rect(background, '#cfa684', 292, 146, 10, 4);
          rect(background, '#cfa684', 317, 146, 11, 4);
          for (const x of [279,326]) {
            rect(background, '#66734f', x, 138, 15, 14);
            rect(background, '#a6ad71', x + 2, 137, 11, 4);
            rect(background, '#d3a777', x + 2, 149, 11, 2);
          }
        } else {
          for (const [x,y] of [[200,158],[230,171],[255,158],[377,171],[419,185]]) {
            rect(background, '#4f5b3d', x, y, 3, 9);
            rect(background, '#758255', x-3, y, 9, 3);
          }
          rect(background, '#58453e', 320, 155, 35, 3);
          rect(background, '#58453e', 349, 156, 4, 13);
        }
      } else if (layer === 'meron-visit') {
        for (const [x,y,w] of [[132,108,110],[221,86,135],[336,122,144]]) {
          rect(background, '#888681', x, y, w, 198 - y);
          rect(background, '#a29b87', x, y, w, 5);
        }
        rect(background, '#b39676', 249, 95, 125, 79);
        rect(background, '#d9be94', 241, 88, 140, 9);
        rect(background, '#d1b58e', 247, 101, 131, 8);
        rect(background, '#6d6c63', 293, 122, 37, 52);
        rect(background, '#647478', 298, 114, 27, 8);
        for (let step = 0; step < 5; step++) {
          rect(background, '#d5b38c', 235 - step * 8, 174 + step * 4, 150 + step * 8, 2);
        }
        for (const [x,y] of [[209,172],[349,175],[365,176]]) {
          rect(background, '#4c4543', x - 1, y - 9, 11, 11);
          rect(background, '#aa988a', x, y - 15, 8, 6);
          rect(background, '#dac7a5', x - 2, y - 16, 10, 2);
        }
      } else {
        for (let row = 0; row < 8; row++) {
          const edge = 152 - Math.min(row, 5) * 8;
          rect(background, mortar, edge, 80 + row * 16, 480 - edge, 17);
          rect(background, '#32303a', edge + 56, 89 + row * 16, 480 - edge - 56, 13);
        }
        if (layer === 'peqi-in-survey') {
          for (const [x,y,width] of [[190,102,99],[184,108,114],[173,115,142],[169,123,155]]) {
            for (let dot = 0; dot < width; dot += 11) rect(background, '#d4ac73', x + dot, y, 5, 1);
          }
          rect(background, '#776054', 303, 154, 109, 30);
          rect(background, '#b49a79', 305, 151, 106, 8);
          for (const [x,y] of [[313,147],[338,142],[365,147],[389,144]]) {
            rect(background, '#69493e', x, y, 12, 8);
            rect(background, '#c37d5a', x + 3, y + 1, 10, 5);
          }
        } else {
          rect(background, '#715142', 177, 127, 9, 68);
          rect(background, '#726649', 156, 117, 51, 13);
          rect(background, '#8e8253', 164, 110, 38, 8);
          rect(background, '#527c85', 261, 177, 50, 15);
          rect(background, '#7fa4a0', 269, 178, 30, 2);
          rect(background, '#ecd0a1', 281, 166, 4, 12);
          if (layer === 'cave-story') {
            rect(background, '#d5bd7d', 156, 118, 51, 2);
            rect(background, '#a3c6bd', 262, 188, 46, 2);
          }
        }
      }
      return;
    }
    if (index === 14) {
      rect(background, '#5b4b48', 125, 76, 355, 123);
      rect(background, '#a9977c', 131, 82, 349, 114);
      for (const [x, y, w] of [[151,105,64],[210,125,76],[156,151,101]]) {
        rect(background, '#7b6555', x, y, w, 35);
        rect(background, '#cfaf83', x + 3, y + 3, w - 6, 29);
        rect(background, '#61514a', x + w - 18, y + 15, 9, 17);
      }
      rect(background, '#cdb38d', 294, 82, 57, 112);
      rect(background, '#8c6e58', 353, 82, 19, 112);
      rect(background, '#d6b288', 354, 82, 4, 112);
      if (layer === 'quarter-endowment') {
        for (const [x, y] of [[168,99],[180,98],[192,103],[204,101]]) {
          rect(background, '#667051', x, y, 4, 5);
        }
        for (const [x, y] of [[195,109],[205,119],[216,129],[226,139],[236,149],[246,159]]) {
          rect(background, '#f1cb79', x, y, 5, 3);
        }
        rect(background, '#f1cb79', 248, 157, 11, 6);
      } else if (layer === 'quarter-home') {
        rect(background, '#657456', 269, 148, 22, 30);
        rect(background, '#9f8d5e', 272, 153, 16, 5);
        rect(background, '#9f8d5e', 272, 163, 16, 5);
        rect(background, '#f1cb79', 212, 125, 70, 2);
        rect(background, '#f1cb79', 212, 156, 52, 2);
      } else if (layer === 'quarter-passage') {
        for (let y = 175; y > 96; y -= 10) rect(background, '#6d5c52', 324, y, 5, 4);
        rect(background, '#ebc27c', 349, 94, 9, 7);
      }
      return;
    }
    if (index === 15) {
      rect(background, '#4b382e', 105, 60, 375, 138);
      rect(background, '#7d5849', 110, 65, 370, 130);
      rect(background, '#42363a', 134, 82, 98, 65);
      rect(background, '#c3a477', 138, 85, 90, 57);
      rect(background, '#a17b57', 139, 120, 88, 21);
      for (const x of [139,163,188,212]) rect(background, '#8a653d', x, 88, 3, 54);
      for (const y of [92,110,128]) rect(background, '#8a653d', 139, y, 88, 2);
      rect(background, '#4e3d3b', 332, 83, 114, 59);
      rect(background, '#755447', 336, 87, 106, 48);
      for (const x of [345,374,402,423]) {
        rect(background, '#ae835e', x, 102 - x % 7, 13, 24 + x % 7);
        rect(background, '#c8a579', x + 2, 114, 8, 2);
      }
      rect(background, '#513d35', 179, 152, 263, 25);
      rect(background, '#b18154', 174, 149, 271, 16);
      rect(background, '#604533', 185, 175, 11, 23);
      rect(background, '#604533', 426, 175, 11, 23);
      for (const [x,y,w] of [[216,143,35],[275,144,48],[344,145,32]]) {
        rect(background, '#dfbf81', x, y, w, 12);
        for (let row = 0; row < 3; row++) rect(background, '#937052', x+4, y+3+row*3, w - 8 - row*4, 1);
      }
      rect(background, '#453638', 398, 139, 13, 12);
      rect(background, '#a5724e', 401, 140, 6, 4);
      return;
    }
    if (index === 16) {
      rect(background, '#4b3744', 131, 64, 349, 133);
      rect(background, '#766052', 137, 70, 343, 125);
      rect(background, '#3f3740', 158, 85, 89, 61);
      rect(background, '#9f846b', 162, 89, 81, 54);
      rect(background, '#45343c', 162, 124, 82, 19);
      rect(background, '#a97d56', 179, 172, 272, 21);
      rect(background, '#c1925e', 174, 168, 280, 7);

      const manuscript = layer === 'zohar-merton';
      const castile = layer === 'zohar-castile';
      rect(background, '#51373a', 252, 102, 161, 70);
      for (const x of [257,335]) {
        rect(background, manuscript ? '#d5a878' : '#e2c78d', x, 104, 74, 62);
        rect(background, '#a38063', x, 104, 74, 2);
        for (let row = 0; row < 7; row++) {
          const width = 54 - (row * (castile ? 13 : 8) + x) % 17;
          rect(background, '#7c5747', x + 63 - width, 112 + row * 6, width, 2);
        }
      }
      if (castile) {
        for (const [x,y] of [[172,105],[181,98],[197,109],[215,102]]) {
          rect(background, '#d0ac79', x, y, 14, 16);
        }
        rect(background, '#e8d6a1', 183, 149, 45, 15);
        rect(background, '#956c52', 188, 155, 36, 2);
        rect(background, '#956c52', 191, 158, 29, 2);
      } else if (manuscript) {
        rect(background, '#f2d07e', 263, 149, 63, 14);
        rect(background, '#83573b', 270, 155, 49, 3);
      } else if (layer === 'zohar-voice') {
        rect(background, '#deae67', 339, 111, 62, 12);
        rect(background, '#9c523f', 345, 115, 51, 3);
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
    if (index === 18) {
      rect(background, '#493942', 120, 65, 360, 133);
      rect(background, '#866354', 125, 70, 355, 126);
      for (const x of [146,396]) {
        rect(background, '#ad8d68', x, 85, 55, 56);
        rect(background, '#654d4a', x + 4, 89, 47, 48);
        rect(background, '#d6a274', x + 6, 94, 43, 30);
        rect(background, '#8d6b53', x + 24, 91, 4, 43);
      }
      rect(background, '#553e3b', 172, 163, 270, 18);
      rect(background, '#bb926c', 166, 157, 282, 9);
      rect(background, '#5c443e', 181, 180, 9, 18);
      rect(background, '#5c443e', 420, 180, 9, 18);
      switch (layer) {
        case 'safed-law':
          rect(background, '#d2bd97', 186, 151, 215, 14);
          for (const x of [219,313,371]) {
            rect(background, '#957e68', x, 150, 21, 10);
            rect(background, '#e1d1a7', x + 2, 150, 16, 6);
          }
          rect(background, '#e9c674', 261, 149, 36, 5);
          rect(background, '#776056', 340, 136, 11, 13);
          rect(background, '#98758c', 342, 137, 7, 5);
          break;
        case 'safed-ethics':
          for (const [x, coat] of [[213,'#526967'],[376,'#77627b']]) {
            rect(background, coat, x, 135, 25, 30);
            rect(background, '#c89573', x + 6, 123, 13, 14);
            rect(background, '#513c3b', x + 3, 119, 19, 5);
          }
          rect(background, '#e5c593', 273, 142, 63, 15);
          rect(background, '#897059', 279, 148, 49, 2);
          rect(background, '#897059', 279, 152, 35, 1);
          break;
        case 'safed-vital':
          rect(background, '#493c45', 255, 80, 110, 75);
          rect(background, '#e4c58c', 258, 83, 104, 69);
          for (const [x,y,w,h] of [[300,94,22,2],[291,102,9,2],[322,102,9,2],
            [285,109,2,18],[335,109,2,18],[291,132,9,2],[322,132,9,2],[300,140,22,2]]) {
            rect(background, '#78504d', x, y, w, h);
          }
          rect(background, '#a5584b', 310, 90, 3, 36);
          rect(background, '#a5584b', 309, 124, 5, 5);
          break;
        default:
          rect(background, '#e1c495', 274, 145, 66, 12);
          rect(background, '#8b6b54', 280, 149, 49, 1);
      }
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
    if (index === 20) {
      rect(background, '#69564b', 122, 62, 345, 130);
      rect(background, '#637d81', 127, 67, 335, 120);
      for (const [x,y,w,h] of [[130,69,321,27],[144,95,100,21],[209,104,21,17],[277,95,60,32],
        [392,94,65,37],[137,149,320,37],[288,139,169,18]]) {
        rect(background, '#ac9a72', x, y, w, h);
      }
      const cairo = [362,164];
      const edirne = [324,115];
      const hamburg = [204,76];
      const livorno = [218,107];
      const cities = [cairo, edirne, hamburg, livorno];
      for (const [x,y] of cities) rect(background, '#5b5152', x - 2, y - 2, 5, 5);
      if (layer === 'news-cairo') {
        rect(background, '#f6d48b', cairo[0] - 3, cairo[1] - 3, 7, 7);
        rect(background, '#e7c18a', 370, 151, 21, 12);
        rect(background, '#806651', 372, 155, 16, 1);
      } else if (layer === 'news-glikl') {
        rect(background, '#f6d48b', hamburg[0] - 3, hamburg[1] - 3, 7, 7);
        rect(background, '#654f44', 216, 76, 26, 18);
        rect(background, '#efcf92', 218, 74, 22, 18);
        for (const [y, width] of [[78,12],[82,14],[86,9]]) {
          rect(background, '#958061', 221, y, width, 1);
        }
      } else if (layer === 'news-edirne') {
        rect(background, '#f6d48b', edirne[0] - 3, edirne[1] - 3, 7, 7);
        rect(background, '#d9ad79', 333, 102, 19, 12);
        rect(background, '#b28663', 331, 101, 23, 3);
      } else if (layer === 'news-hamburg') {
        for (const [x,y] of [[217,106],[214,100],[211,94],[208,88],[205,82]]) {
          rect(background, '#f2d083', x, y, 4, 3);
        }
        for (const [x,y] of [hamburg,livorno]) rect(background, '#f6d48b', x - 3, y - 3, 7, 7);
      }
      return;
    }
    if (index === 21) {
      rect(background, '#62504a', 134, 71, 346, 128);
      rect(background, '#938774', 138, 75, 342, 118);
      for (let row = 0; row < 5; row++) {
        const y = 81 + row * 22;
        rect(background, '#b19b81', 151 + row % 2 * 12, y, 90 - row % 2 * 8, 17);
        rect(background, '#d9ba8f', 154 + row % 2 * 12, y + 2, 80 - row % 2 * 8, 2);
      }
      rect(background, '#c5ae8b', 245, 75, 59, 118);
      for (let y = 80; y < 195; y += 11) rect(background, '#a58b6f', 246, y, 57, 1);
      rect(background, '#9b7e61', 305, 75, 19, 118);
      rect(background, '#d7b387', 306, 75, 4, 118);
      rect(background, '#877f65', 325, 76, 153, 117);
      rect(background, '#ae9779', 328, 82, 146, 4);
      rect(background, '#67534b', 291, 184, 19, 9);
      if (layer === 'commission-property') {
        rect(background, '#f5cb7e', 142, 77, 333, 3);
        rect(background, '#f5cb7e', 142, 190, 333, 3);
        rect(background, '#f5cb7e', 142, 77, 3, 116);
        rect(background, '#f5cb7e', 472, 77, 3, 116);
        rect(background, '#f5cb7e', 307, 77, 5, 116);
      } else if (layer === 'commission-access') {
        for (let y = 180; y >= 99; y -= 9) rect(background, '#615044', 280, y, 5, 5);
        rect(background, '#615044', 282, 97, 23, 5);
        rect(background, '#ffe1ac', 300, 96, 10, 8);
      } else if (layer === 'commission-conditions') {
        rect(background, '#51443c', 275, 129, 21, 16);
        rect(background, '#f3d5a3', 277, 130, 8, 13);
        rect(background, '#f3d5a3', 287, 130, 7, 13);
        for (const y of [88,104,151,168]) rect(background, '#6e584c', 253, y, 6, 6);
      } else if (layer === 'mandate-screen') {
        rect(background, '#724e4a', 264, 133, 40, 7);
        rect(background, '#ad765c', 268, 130, 31, 8);
        rect(background, '#6f4744', 269, 128, 4, 17);
        rect(background, '#6f4744', 296, 128, 4, 17);
      }
      return;
    }
    if (index === 22) {
      rect(background, '#35404a', 116, 82, 364, 117);
      rect(background, '#24353c', 127, 92, 342, 102);
      for (const [archive,x] of [['holocaust',157],['nakba',326]]) {
        rect(background, '#514940', x, 116, 103, 73);
        rect(background, '#987e62', x + 5, 121, 93, 63);
        rect(background, layer === archive ? '#d6bd87' : '#594e48', x + 10, 126, 83, 52);
        rect(background, '#dfc9a0', x + 25, 137, 55, 31);
        for (let y = 142; y < 166; y += 5) {
          rect(background, '#796452', x + 30, y, 38, 1);
        }
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
    placement() { return [Math.round(position), facing]; },
    restorePlacement([x, direction]) {
      position = x;
      facing = direction;
      walked = 0;
    },
    move(direction, distance) {
      facing = direction;
      const next = Math.max(leftEdge, Math.min(rightEdge, position + direction * distance));
      const traveled = Math.abs(next - position);
      position = next;
      walked += traveled;
      const canContinue = next !== (direction < 0 ? leftEdge : rightEdge);
      draw(reducedMotion.matches || !canContinue ? 0 : Math.floor(walked / 6) % 4);
      return canContinue;
    },
    idle() { draw(0); },
    inspect() { inspecting = true; draw(0); },
  };
}
