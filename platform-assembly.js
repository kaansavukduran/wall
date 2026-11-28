const copy = {
  tr: {
    task: 'Bir parça seç. Çizime dokun veya yerini listeden seç.',
    parts: 'Parçalar', places: 'Kesitteki yerler',
    names: ['İstinat duvarı', 'Dolgu', 'Platform'],
    positions: ['Dış kenar', 'İç bölüm', 'Üst yüzey'],
    reset: 'Yeniden kur', source: 'Wilson Kemeri kazısı',
    retry: 'Başka bir yer dene.',
    explanation: [
      'İstinat duvarı, dolgunun dışa doğru kaymasını sınırlar.',
      'Dolgu, duvarın arkasında yükseltilen alanı oluşturur.',
      'Platform, üzerinde yapıların durduğu düz yüzeyi oluşturur.',
    ],
    done: 'Duvar dolguyu tutar. Tapınak düz platformun üstünde durur. Şema, parçaların görevini gösterir.',
  },
  en: {
    task: 'Choose a piece, then tap its place in the drawing or use the buttons.',
    parts: 'Pieces', places: 'Places in the section',
    names: ['Retaining wall', 'Fill', 'Platform'],
    positions: ['Outer edge', 'Inside', 'Top surface'],
    reset: 'Build again', source: 'Wilson’s Arch excavation',
    retry: 'Try another place.',
    explanation: [
      'The retaining wall holds the fill back at its outer edge.',
      'Fill makes up the raised area behind the wall.',
      'The platform provides the level surface for buildings.',
    ],
    done: 'The wall retains the fill. The Temple stands on the level platform. The diagram shows how the parts work together.',
  },
  he: {
    task: 'בחרו חלק, ואז הקישו על מקומו באיור או השתמשו בכפתורים.',
    parts: 'חלקים', places: 'מקומות בחתך',
    names: ['קיר תומך', 'מילוי', 'משטח מוגבה'],
    positions: ['שוליים חיצוניים', 'החלק הפנימי', 'המשטח העליון'],
    reset: 'בנייה מחדש', source: 'חפירת קשת וילסון',
    retry: 'נסו מקום אחר.',
    explanation: [
      'הקיר התומך מחזיק את המילוי לאורך שוליו החיצוניים.',
      'המילוי יוצר את התשתית המוגבהת מאחורי הקיר.',
      'המשטח המוגבה יוצר משטח ישר שעליו עומדים מבנים.',
    ],
    done: 'הקיר מחזיק את המילוי. בית המקדש עומד על המשטח המוגבה. האיור מראה את תפקידיהם של החלקים.',
  },
  az: {
    task: 'Bir hissə seç. Şəklə toxun və ya yerini siyahıdan seç.',
    parts: 'Hissələr', places: 'Kəsikdəki yerlər',
    names: ['İstinad divarı', 'Dolğu', 'Platforma'],
    positions: ['Xarici kənar', 'İç hissə', 'Üst səth'],
    reset: 'Yenidən qur', source: 'Vilson tağının qazıntısı',
    retry: 'Başqa yeri sına.',
    explanation: [
      'İstinad divarı dolğunu xarici kənarda saxlayır.',
      'Dolğu divarın arxasındakı yüksəldilmiş sahəni əmələ gətirir.',
      'Platforma tikililərin dayandığı düz səthi yaradır.',
    ],
    done: 'Divar dolğunu saxlayır. Məbəd düz platformanın üstündə dayanır. Şəkil hissələrin rolunu göstərir.',
  },
};

// Geometry is fixed in every locale. The drawing is a teaching section.
const pieces = [
  { box: [47,47,24,47], color:'#d3b58a', lines:'#7d604c' },
  { box: [73,47,132,47], color:'#a37655', lines:'#644839' },
  { box: [47,35,158,10], color:'#e8c791', lines:'#a07c53' },
];
const pieceOrder = [1,2,0];

function drawSection(canvas, placed) {
  const context = canvas.getContext('2d');
  function block(fill, x, y, width, height) {
    context.fillStyle = fill;
    context.fillRect(x,y,width,height);
  }
  block('#49616a',0,0,240,112);
  block('#514139',0,94,240,18);
  block('#947457',0,94,240,3);
  for (let index = 0; index < pieces.length; index++) {
    const {box,color,lines} = pieces[index];
    const [x,y,width,height] = box;
    if (!placed.has(index)) {
      block('#718086',...box);
      block('#394c53',x+2,y+2,width-4,height-4);
      continue;
    }
    block(color,...box);
    for (let row = y+5; row < y+height; row += 9) {
      block(lines,x+2,row,width-4,1);
      for (let column = x+8+(row%2)*6; column < x+width-3; column += 17) {
        block(lines,column,row-4,1,4);
      }
    }
  }
  if (placed.size === pieces.length) {
    block('#c9a680',114,17,52,18);
    block('#e5c69b',109,13,62,5);
    for (const column of [120,135,150]) block('#755949',column,20,4,15);
  }
}

export function mountPlatformAssembly(panel, language, view) {
  const labels = copy[language];
  const fragment = document.getElementById('platform-assembly-template').content.cloneNode(true);
  const [task, diagram, groups, feedback, actions] = fragment.children;
  const [parts, places] = groups.children;
  const [reset, source] = actions.children;
  task.textContent = labels.task;
  parts.firstElementChild.textContent = labels.parts;
  places.firstElementChild.textContent = labels.places;
  reset.textContent = labels.reset;
  source.textContent = labels.source;
  view.placed ??= new Set();

  const partButtons = pieceOrder.map(index => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.platformPart = index;
    button.addEventListener('click', event => {
      view.selected = index;
      view.message = '';
      update();
      if (event.detail === 0) places.querySelector('button:enabled')?.focus();
    });
    parts.append(button);
    return [button,index];
  });
  const placeButtons = labels.positions.map((label,index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.platformPlace = index;
    button.addEventListener('click', event => place(index,event.detail === 0));
    places.append(button);
    return button;
  });

  function place(index, keyboard) {
    if (view.selected == null || view.placed.has(index)) return;
    if (view.selected !== index) {
      view.message = 'retry';
      update();
      return;
    }
    view.placed.add(index);
    view.selected = null;
    view.message = 'placed';
    view.lastPiece = index;
    drawSection(diagram,view.placed);
    update();
    (parts.querySelector('button:enabled') ?? reset).focus({preventScroll:!keyboard});
  }

  diagram.addEventListener('click', event => {
    const bounds = diagram.getBoundingClientRect();
    const x = (event.clientX-bounds.left)*diagram.width/bounds.width;
    const y = (event.clientY-bounds.top)*diagram.height/bounds.height;
    const index = pieces.findIndex(({box:[left,top,width,height]}) =>
      x >= left && x < left+width && y >= top && y < top+height);
    if (index !== -1) place(index,false);
  });

  function update() {
    const complete = view.placed.size === pieces.length;
    task.hidden = groups.hidden = complete;
    for (const [button,index] of partButtons) {
      button.disabled = view.placed.has(index);
      button.textContent = labels.names[index];
      button.setAttribute('aria-pressed',String(view.selected === index));
    }
    placeButtons.forEach((button,index) => {
      const placed = view.placed.has(index);
      button.disabled = view.selected == null || placed;
      button.textContent = placed ? labels.positions[index] + ' · ' + labels.names[index] : labels.positions[index];
    });
    reset.disabled = view.placed.size === 0 && view.selected == null;
    feedback.textContent = complete ? labels.done
      : view.message === 'retry' ? labels.explanation[view.selected] + ' ' + labels.retry
      : view.message === 'placed' ? labels.explanation[view.lastPiece]
      : '';
  }

  reset.addEventListener('click', () => {
    view.placed.clear();
    view.selected = null;
    view.message = '';
    drawSection(diagram,view.placed);
    update();
    partButtons[0][0].focus();
  });
  drawSection(diagram,view.placed);
  update();
  panel.replaceChildren(fragment);
}
