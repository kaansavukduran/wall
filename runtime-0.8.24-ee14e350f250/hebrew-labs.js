const regular = [...'אבגדהוזחטיכלמנסעפצקרשת'];
const finals = [...'ךםןףץ'];
const values = [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const numericValues = new Map(regular.map((letter, index) => [letter, values[index]]));
for (const [index, letter] of finals.entries()) {
  numericValues.set(letter, [20,40,50,80,90][index]);
}
const names = [
  'Alef Bet Gimel Dalet He Vav Zayin Het Tet Yod Kaf Lamed Mem Nun Sameh Ayin Pe Tsadi Kof Reş Şin Tav',
  'Alef Bet Gimel Dalet He Vav Zayin Het Tet Yod Kaf Lamed Mem Nun Samekh Ayin Pe Tsadi Qof Resh Shin Tav',
  'אָלֶף בֵּית גִּימֶל דָּלֶת הֵא וָו זַיִן חֵית טֵית יוֹד כַּף לָמֶד מֵם נוּן סָמֶךְ עַיִן פֵּא צָדִי קוֹף רֵישׁ שִׁין תָּו',
  'Alef Bet Gimel Dalet He Vav Zayin Xet Tet Yod Kaf Lamed Mem Nun Samex Ayin Pe Tsadi Qof Reş Şin Tav',
].map(line => line.split(' '));

export const sefirot = [
  ['כתר',['Keter','Keter','כתר','Keter'],[
    'Taç. Bu modelde diğer niteliklerden önce gelen iradeyi simgeler.',
    'Crown. In this model it signifies the will that precedes the other qualities.',
    'כתר. בדגם הזה הוא מסמל את הרצון שקודם למידות האחרות.',
    'Tac. Bu modeldə digər keyfiyyətlərdən əvvəl gələn iradəni bildirir.',
  ]],
  ['חכמה',['Hokhma','Chokhmah','חכמה','Xoxma'],[
    'Bilgelik. Bir düşüncenin ilk kez belirdiği anı düşün.',
    'Wisdom. Think of the instant when an insight first appears.',
    'חכמה. חשבו על הרגע שבו מופיע ניצוץ של רעיון.',
    'Müdriklik. Yeni bir fikrin ilk dəfə yarandığı anı düşün.',
  ]],
  ['בינה',['Bina','Binah','בינה','Bina'],[
    'Kavrayış. İlk düşünceyi ayrıntıları ve sonuçlarıyla işler.',
    'Understanding. It develops an initial insight into a fuller idea.',
    'בינה. היא מפתחת ניצוץ ראשוני לרעיון שלם יותר.',
    'Dərk. İlk fikri inkişaf etdirərək daha dolğun anlayışa çevirir.',
  ]],
  ['חסד',['Hesed','Chesed','חסד','Xesed'],[
    'İyilik ve cömertlik. Bir başkasına alan açmak ve vermek.',
    'Lovingkindness. Giving freely and making room for another.',
    'חסד. נתינה ברוחב לב ופינוי מקום לאחר.',
    'Mərhəmət və səxavət. Başqasına yer açmaq və könüllü vermək.',
  ]],
  ['גבורה',['Gevura','Gevurah','גבורה','Gevura'],[
    'Güç ve ölçü. Bir eylemin sınırını belirlemek için gereken disiplin.',
    'Strength and restraint. The discipline needed to set a boundary.',
    'גבורה. הכוח והריסון הדרושים לקביעת גבול.',
    'Güc və təmkin. Bir hərəkətə sərhəd qoymaq üçün lazım olan intizam.',
  ]],
  ['תפארת',['Tiferet','Tiferet','תפארת','Tiferet'],[
    'Güzellik ve uyum. İyilik ile sınır arasında denge kurmayı simgeler.',
    'Beauty and harmony. It represents a balance between kindness and restraint.',
    'תפארת. יופי והרמוניה המבטאים איזון בין חסד לריסון.',
    'Gözəllik və ahəng. Mərhəmətlə təmkin arasında tarazlığı bildirir.',
  ]],
  ['נצח',['Netsah','Netzach','נצח','Netsax'],[
    'Sebat. Bir amaca doğru güçlükler karşısında devam etme niteliği.',
    'Endurance. The quality of pursuing a purpose through difficulty.',
    'נצח. התמדה בדרך אל מטרה גם מול קושי.',
    'Əzmkarlıq. Çətinliyə baxmayaraq məqsədə doğru irəliləmək.',
  ]],
  ['הוד',['Hod','Hod','הוד','Hod'],[
    'Görkem. Bazı yorumlar bu niteliği tevazu ve kabulle ilişkilendirir.',
    'Splendor. Some interpretations connect it with humility and acknowledgment.',
    'הוד. בכמה פירושים הוא קשור לענווה ולהכרה.',
    'Əzəmət. Bəzi şərhlər onu təvazökarlıq və qəbul ilə bağlayır.',
  ]],
  ['יסוד',['Yesod','Yesod','יסוד','Yesod'],[
    'Temel. Önceki nitelikler ile onların aktarılması arasında bağ kurar.',
    'Foundation. It links the preceding qualities to their transmission.',
    'יסוד. הוא קושר בין המידות הקודמות לבין העברת השפעתן.',
    'Təməl. Əvvəlki keyfiyyətlərlə onların ötürülməsi arasında bağ yaradır.',
  ]],
  ['מלכות',['Malkhut','Malkhut','מלכות','Malxut'],[
    'Hükümranlık. Alınan etkilerin görünür dünyada ortaya çıkmasıyla ilişkilidir.',
    'Sovereignty. It is associated with receiving and manifesting the preceding influences.',
    'מלכות. היא קשורה לקבלת השפעות המידות הקודמות ולהופעתן.',
    'Hökmdarlıq. Əvvəlki təsirlərin qəbul edilməsi və dünyada görünməsi ilə bağlıdır.',
  ]],
];

const copy = [
  ['İbrani harfleri ve gematria','On sefirot','Bir harf seç. Sözcüğe eklenen değerleri izle. Sondaki beş biçim, standart hesapta aynı değeri taşır.','Son harfi sil','Temizle','Sayıların anlamı, toplamdan sonra gelen bir yorumdur.','İbranice ben ve Aramice bar, “oğlu” anlamında kullanılabilir. Şimon bar Yohai, Yohai’nin oğludur.','Yaygın bir Keter düzenini inceliyorsun. Bazı sayımlarda Keter yerine Daat, yani bilgi, eklenir. Sefer Yetsira’daki onlu anlatı daha eski bir metin katmanıdır.','Harf değerleri kaynağı','Sefirot kaynağı'],
  ['Hebrew letters and gematria','The ten sefirot','Choose a letter and watch its value enter the word. The five final forms keep their standard values.','Remove last letter','Clear','An interpretation of a number comes after the arithmetic.','Hebrew ben and Aramaic bar can mean “son of.” Shimon bar Yohai is the son of Yohai.','This is a common arrangement with Keter. Some counts include Daat, or knowledge, in its place. The tenfold description in Sefer Yetzirah belongs to an earlier textual layer.','Source for letter values','Source for the sefirot'],
  ['האותיות העבריות וגימטרייה','עשר הספירות','בחרו אות ועקבו אחר ערכה במילה. בגימטרייה רגילה הערך של חמש האותיות הסופיות נשמר.','מחיקת האות האחרונה','ניקוי','פרשנות המספר באה אחרי החישוב.','בן בעברית ובר בארמית מציינים קשר של בן לאביו. שמעון בר יוחאי הוא בנו של יוחאי.','זהו סדר נפוץ הכולל כתר. בכמה מניינים מופיעה דעת במקום כתר. התיאור העשרוני בספר יצירה שייך לרובד טקסטואלי קדום יותר.','מקור לערכי האותיות','מקור לספירות'],
  ['İvrit hərfləri və gematriya','On sefirot','Hərf seç və dəyərinin sözə əlavə olunmasına bax. Beş son forma standart hesabda eyni dəyəri saxlayır.','Son hərfi sil','Təmizlə','Rəqəmin mənası hesabdan sonra gələn bir şərhdir.','İvritdə ben, aramicədə bar “oğlu” demək ola bilər. Şimon bar Yohai Yohainin oğludur.','Bu, Keterin daxil olduğu geniş yayılmış düzülüşdür. Bəzi sayımlarda Keterin yerində Daat, yəni bilik, verilir. Sefer Yetsiradakı onlu təsvir daha qədim mətn qatıdır.','Hərf dəyərlərinin mənbəyi','Sefirotun mənbəyi'],
];

const daat = ['דעת',['Daat','Daat','דעת','Daat'],[
  'Bilgi. Kavranan bir düşünceyi kişinin kendi tutumuna bağlar. Bu sayımda onlu düzen Daat’ı içerir.',
  'Knowledge. It connects an understood idea to one’s own outlook. This count includes Daat among the ten.',
  'דעת. היא מחברת רעיון מובן לעמדתו של האדם. במניין הזה דעת נכללת בעשר הספירות.',
  'Bilik. Anlaşılan fikri insanın öz münasibəti ilə bağlayır. Bu sayım Daatı onlu düzülüşə daxil edir.',
]];

export function gematriaValues(letters, extendedFinals = false) {
  return [...letters].map(letter => {
    if (extendedFinals) {
      const finalIndex = finals.indexOf(letter);
      if (finalIndex >= 0) return 500 + 100 * finalIndex;
    }
    return numericValues.get(letter);
  }).filter(value => value !== undefined);
}

const regularForms = [...'כמנפצ'];

export function atbash(letters) {
  const sequence = [...letters];
  return sequence.map((letter,index) => {
    const form = regularForms[finals.indexOf(letter)] ?? letter;
    const position = regular.indexOf(form);
    if (position < 0) return letter;
    const paired = regular[regular.length - 1 - position];
    if (index === sequence.length - 1) return finals[regularForms.indexOf(paired)] ?? paired;
    return paired;
  });
}

export function renderHebrewLabs(root, locale, state) {
  const find = id => root.querySelector('#' + id);
  const [lettersTitle, sefirotTitle, instruction, undoLabel, clearLabel, meaning, son, overview, valuesLabel, sefirotLabel] = copy[locale];
  find('aleph-summary').textContent = lettersTitle;
  find('sefirot-summary').textContent = sefirotTitle;
  find('aleph-instructions').textContent = instruction;
  find('aleph-meaning').textContent = meaning;
  find('aramaic-note').textContent = son;
  find('letter-values').textContent = valuesLabel;
  find('sefirot-intro').textContent = overview;
  find('sefirot-source').textContent = sefirotLabel;

  const undo = find('undo-letter');
  const clear = find('clear-letters');
  const keys = find('letter-grid');
  undo.textContent = undoLabel;
  clear.textContent = clearLabel;
  function renderWord() {
    const scores = gematriaValues(state.word);
    const total = scores.reduce((sum, value) => sum + value, 0);
    find('aleph-word').textContent = state.word.join('');
    find('aleph-total').textContent = scores.length > 1 ? scores.join(' + ') + ' = ' + total : String(total);
    undo.disabled = clear.disabled = state.word.length === 0;
    for (const button of keys.children) button.disabled = state.word.length >= 12;
  }
  keys.replaceChildren(...[...regular, ...finals].map(letter => {
    const regularIndex = regular.indexOf(letter);
    const index = regularIndex < 0 ? [10,12,13,16,17][finals.indexOf(letter)] : regularIndex;
    const value = numericValues.get(letter);
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.hebrewLetter = letter;
    button.textContent = letter + ' · ' + value;
    button.dir = 'ltr';
    button.setAttribute('aria-label', letter + ' · ' + names[locale][index] + ' · ' + value);
    button.addEventListener('click', () => {
      state.word.push(letter);
      renderWord();
      if (button.disabled) undo.focus();
    });
    return button;
  }));
  undo.onclick = () => { state.word.pop(); renderWord(); if (undo.disabled) keys.firstElementChild.focus(); };
  clear.onclick = () => { state.word.length = 0; renderWord(); keys.firstElementChild.focus(); };
  renderWord();

  const diagram = find('sefirot-grid');
  const count = find('count-daat');
  count.textContent = ['Daat’ı say','Count Daat','כללו את דעת במניין','Daatı say'][locale];
  function showSefirah() {
    const [hebrew, , descriptions] = state.sefirah === 0 && state.daat ? daat : sefirot[state.sefirah];
    find('sefirah-name').textContent = hebrew;
    find('sefirah-detail').textContent = descriptions[locale];
    for (const button of diagram.children) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.sefirah) === state.sefirah));
    }
  }
  function nameSefirah(button, [hebrew, titles]) {
    button.textContent = titles[locale];
    if (locale !== 2) button.setAttribute('aria-label', titles[locale] + ' · ' + hebrew);
  }
  diagram.replaceChildren(...sefirot.map((entry, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.sefirah = String(index);
    button.style.setProperty('--position', 's' + index);
    button.dir = 'auto';
    nameSefirah(button, entry);
    button.addEventListener('click', () => { state.sefirah = index; showSefirah(); });
    return button;
  }));
  function updateCount() {
    count.setAttribute('aria-pressed', String(state.daat));
    diagram.toggleAttribute('data-daat', state.daat);
    nameSefirah(diagram.firstElementChild, state.daat ? daat : sefirot[0]);
    showSefirah();
  }
  count.onclick = () => { state.daat = !state.daat; state.sefirah = 0; updateCount(); };
  updateCount();
}
