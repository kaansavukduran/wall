const width = 96;
const height = 64;
const poseFrames = [0,2,4];
let sprite;

const description = [
  'Mişna Bikkurim 3:6, Tapınak avlusundaki ilk ürün sunusunu anlatır. Çizimdeki hacı, metindeki hareketleri canlandıran kurgusal bir kişidir.',
  'Mishnah Bikkurim 3:6 describes the first-fruits offering in the Temple court. The illustrated pilgrim is a fictional character who shows the motions described in the text.',
  'משנה ביכורים ג׳:ו׳ מתארת את הבאת הביכורים בחצר המקדש. עולה הרגל המאויר הוא דמות בדויה שמדגימה את תנועות הסל המתוארות במשנה.',
  'Mişna Bikkurim 3:6 Məbədin həyətində ilk məhsulun təqdim edilməsini təsvir edir. Şəkildəki zəvvar mətndəki hərəkətləri göstərən uydurma obrazdır.',
];

const poses = [
  [
    'Hacı okumaya başlarken ilk ürün sepetini omzunda taşır.',
    'The pilgrim carries the basket of first fruits on one shoulder as the reading begins.',
    'עולה הרגל נושא את סל הביכורים על כתפו בתחילת הקריאה.',
    'Zəvvar oxuya başlayanda ilk məhsul səbətini çiynində daşıyır.',
  ],
  [
    'Mişna’daki anlatımlardan birinde hacı, “Arami oved avi” sözlerine gelince sepeti omzundan indirip iki kenarından tutar. Metin ayrıca bir Tapınak rahibinin sepeti alttan tutup salladığını anlatır.',
    'In one account in the Mishnah, the pilgrim reaches the words “Arami oved avi,” lowers the basket and holds it by both edges. The text also describes a priest supporting the basket from below and waving it.',
    'לפי אחת הדעות במשנה, במילים ״ארמי אובד אבי״ עולה הרגל מוריד את הסל מכתפו ואוחז בו משני צדדיו. המשנה מתארת גם כוהן התומך בסל מלמטה ומניף אותו.',
    'Mişnadakı təsvirlərdən birində zəvvar “Arami oved avi” sözlərinə çatanda səbəti çiynindən endirib iki kənarından tutur. Mətn Məbəd kahininin səbəti altdan tutub yırğaladığını da bildirir.',
  ],
  [
    'Okuma bitince hacı sepeti sunağın yanına bırakır. Mişna, ardından eğilip ayrıldığını anlatır.',
    'After the reading, the pilgrim sets the basket beside the altar. The Mishnah describes the pilgrim bowing and leaving afterward.',
    'בתום הקריאה עולה הרגל מניח את הסל לצד המזבח. המשנה מתארת כיצד הוא משתחווה ויוצא אחר כך.',
    'Oxu bitəndə zəvvar səbəti qurbangahın yanına qoyur. Mişnada onun sonra təzim edib getdiyi deyilir.',
  ],
];

const actions = [
  ['Sepeti omuzdan indir','Lower the basket','הורידו את הסל מהכתף','Səbəti çiyindən endir'],
  ['Sepeti sunağın yanına bırak','Set the basket beside the altar','הניחו את הסל לצד המזבח','Səbəti qurbangahın yanına qoy'],
  ['Başa dön','Show the first step','חזרו לשלב הראשון','İlk addıma qayıt'],
];

const sourceNames = [
  'Mişna Bikkurim 3:6 · Sefaria','Mishnah Bikkurim 3:6 · Sefaria',
  'משנה ביכורים ג׳:ו׳ · ספריא','Mişna Bikkurim 3:6 · Sefaria',
];

function loadSprite() {
  if (!sprite) {
    const image = new Image();
    image.src = new URL('./assets/first-fruits.png',import.meta.url).href;
    sprite = image.decode().then(() => image).catch(error => {
      sprite = undefined;
      throw error;
    });
  }
  return sprite;
}

export function mountFirstFruits(panel, locale, view, reducedMotion) {
  const fragment = document.getElementById('first-fruits-template').content.cloneNode(true);
  const [intro,canvas,note,button,source] = fragment.children;
  const context = canvas.getContext('2d',{alpha:false});
  let image;
  let finalFrame;
  view.step ??= 0;

  function paint(frame) {
    if (!image || !canvas.isConnected) return;
    context.drawImage(image,frame * width,0,width,height,0,0,width,height);
  }

  function render() {
    note.textContent = poses[view.step][locale];
    button.textContent = actions[view.step][locale];
  }

  intro.textContent = description[locale];
  source.textContent = sourceNames[locale];
  render();
  button.addEventListener('click', () => {
    clearTimeout(finalFrame);
    view.step = (view.step + 1) % poses.length;
    render();
    const frame = poseFrames[view.step];
    if (!image || reducedMotion.matches || frame === 0) {
      paint(frame);
      return;
    }
    paint(frame - 1);
    finalFrame = setTimeout(() => paint(poseFrames[view.step]),160);
  });
  panel.replaceChildren(fragment);
  loadSprite().then(decoded => {
    if (!canvas.isConnected) return;
    image = decoded;
    paint(poseFrames[view.step]);
    canvas.hidden = false;
  }).catch(() => { /* The text and controls remain available. */ });
}
