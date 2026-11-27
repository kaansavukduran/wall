const scene = (id, name, options) => ({id,name,options});

export const models = [
  scene(0, ['Aynı yer, iki görünüm','One place, two views','אותו מקום, שני מבטים','Eyni yer, iki görünüş'], [
    ['plaza',['Bugünkü meydan','Present-day plaza','הרחבה כיום','Bugünkü meydan'],
      ['Duvarın önünde geniş bir açık alan var.','A broad open area stands in front of the wall.','לפני הכותל יש רחבה פתוחה.','Divarın qarşısında geniş açıq sahə var.']],
    ['quarter',['1967 öncesi sokak','Street before 1967','רחוב לפני 1967','1967-dən əvvəlki küçə'],
      ['Bu temsili kesit, meydandan önce duvara komşu konutları gösterir.','This schematic view shows homes near the wall before the plaza.','תרשים זה מציג בתי מגורים ליד הכותל לפני הקמת הרחבה.','Bu şərti görünüş meydandan əvvəl divara yaxın evləri göstərir.']],
  ]),
  scene(6, ['Mimari kesit','Architectural section','חתך אדריכלי','Memarlıq kəsiyi'], [
    ['wall',['İstinat duvarı','Retaining wall','קיר תומך','İstinad divarı'],
      ['Yan yüz, dolgunun yerinde kalmasına yardım eder.','The side wall helps retain the fill.','הקיר הצדדי מסייע להחזיק את המילוי.','Yan divar dolğunu yerində saxlayır.']],
    ['platform',['Platform','Platform','מתחם מוגבה','Platforma'],
      ['Üstteki düz alanı takip et.','Follow the level surface at the top.','עקבו אחר המשטח המישורי למעלה.','Yuxarıdakı düz səthi izlə.']],
    ['temple',['Tapınak','Temple','בית המקדש','Məbəd'],
      ['Kutsal bina bu alanın üzerinde bulunuyordu.','The sacred building stood on this raised area.','המבנה הקדוש עמד על המשטח הזה.','Müqəddəs bina bu yüksəldilmiş sahədə yerləşirdi.']],
  ]),
  scene(8, ['Yıkımdan önce ve sonra','Before and after the destruction','לפני החורבן ואחריו','Dağıntıdan əvvəl və sonra'], [
    ['before',['Yıkımdan önce','Before the destruction','לפני החורבן','Dağıntıdan əvvəl'],
      ['Basitleştirilmiş kesitte üst yapıyı ve platformu ayır.','Distinguish the building from the platform in the simplified view.','הבחינו בין המבנה למתחם בחתך המפושט.','Sadələşdirilmiş kəsikdə bina ilə platformanı ayır.']],
    ['after',['Yıkımdan sonra','After the destruction','אחרי החורבן','Dağıntıdan sonra'],
      ['Üst yapı ortadan kalktı. Çevre duvarlarının bazı kısımları kaldı.','The upper building was destroyed. Parts of the retaining walls survived.','המבנה העליון נחרב. חלקים מן הקירות התומכים נותרו.','Yuxarıdakı bina dağıdıldı. İstinad divarlarının müəyyən hissələri qaldı.']],
  ]),
  scene(23, ['Mahalle ve meydan','Neighborhood and plaza','שכונה ורחבה','Məhəllə və meydan'], [
    ['quarter',['Mağribi Mahallesi','Maghrebi Quarter','שכונת המוגרבים','Məğrib məhəlləsi'],
      ['Temsili çizimde evlerin ve geçidin duvara yakınlığına bak.','Look at the homes and passage near the wall in this schematic.','שימו לב לבתים ולמעבר שליד הכותל בתרשים.','Şərti təsvirdə evlərin və keçidin divara yaxınlığına bax.']],
    ['plaza',['Açık meydan','Open plaza','רחבה פתוחה','Açıq meydan'],
      ['1967 sonrasında evlerin yerinde geniş bir dua meydanı oluştu.','After 1967, a broad prayer plaza occupied the space where homes had stood.','לאחר 1967 הוקמה רחבת תפילה רחבה במקום הבתים.','1967-dən sonra evlərin yerində geniş ibadət meydanı salındı.']],
  ]),
];

export const studyNames = {
  gematria: ['Gematria tezgâhı','Gematria workbench','סדנת גימטרייה','Gematriya emalatxanası'],
  worlds: ['ABiYA’nın dört dünyası','The four worlds of ABYA','ארבעת עולמות אבי״ע','ABiYA-nın dörd dünyası'],
};

export const alphabetNotes = [
  ['Her iki harfi seç ve toplamı izle. Bu, standart hesap yöntemidir.','Select both letters and watch the total. This uses standard gematria.','בחרו בשתי האותיות ועקבו אחר הסכום. זהו חישוב גימטרייה רגיל.','Hər iki hərfi seç və cəmi izlə. Bu, standart gematriya hesabıdır.'],
  ['Hesap tamamlandı. Sayıya yüklenen anlam ayrı bir yorumdur.','The calculation is complete. The meaning assigned to the number is a separate interpretation.','החישוב הושלם. המשמעות שמייחסים למספר שייכת לפרשנות.','Hesab tamamlandı. Rəqəmə verilən məna ayrıca şərhdir.'],
];

export const worlds = [
  ['אצילות', ['Atsilut','Atzilut','אצילות','Atsilut'], ['Yayılım','Emanation','האצלה','Yayılma']],
  ['בריאה', ['Beria','Beriah','בריאה','Beria'], ['Yaratılış','Creation','בריאה','Yaradılış']],
  ['יצירה', ['Yetsira','Yetzirah','יצירה','Yetsira'], ['Biçimlenme','Formation','יצירה','Formalaşma']],
  ['עשייה', ['Asiya','Asiyah','עשייה','Asiya'], ['Eylem','Action','עשייה','Əməl']],
];

export const worldNote = [
  'Bu gösterim dört adın sırasını öğretir. Farklı Kabala yazarları dünyalar ve sefirot ilişkisini farklı açıklar.',
  'This diagram teaches the sequence of the four names. Kabbalistic authors explain their relation to the sefirot in different ways.',
  'התרשים מלמד את סדר ארבעת השמות. מחברים קבליים שונים מסבירים בדרכים שונות את הקשר לספירות.',
  'Bu sxem dörd adın ardıcıllığını öyrədir. Kabala müəllifləri dünyalarla sefirotların əlaqəsini fərqli izah edirlər.',
];

export const photo = {
  title:['Eski fotoğraf','Historic photograph','תצלום היסטורי','Tarixi foto'],
  note:[
    'Negatif yaklaşık 1900–1920. Fotoğrafta taş duvara yaklaşan insanlara ve duvarın önündeki dar alana bak. Oyun sahnesi şematik bir karşılaştırmadır.',
    'Negative dated about 1900–1920. Look at the people next to the stone wall and the narrow space in front of it. The game scene is a schematic comparison.',
    'התשליל מתוארך בקירוב ל־1900–1920. שימו לב לאנשים ליד הכותל ולשטח הצר שלפניו. הסצנה במשחק היא השוואה סכמטית.',
    'Neqativ təxminən 1900–1920-ci illərə aiddir. Daş divarın yanındakı insanlara və qarşısındakı dar sahəyə bax. Oyun səhnəsi şərti müqayisədir.',
  ],
  alt:['Dar bir alanda Batı Duvarı’na yakın duran insanlar','People standing close to the Western Wall in a narrow area','אנשים עומדים ליד הכותל בשטח צר','Dar sahədə Qərb Divarının yanında dayanan insanlar'],
  url:'https://www.loc.gov/pictures/item/2019704965/',
};

export const tour = [
  {
    label:['Taş ve mekân','Stone and place','אבן ומקום','Daş və məkan'],
    options:[
      ['wall',['Wilson Kemeri kazısı','Wilson’s Arch excavation','חפירת קשת וילסון','Uilson tağı qazıntısı'],'https://hadashot.iaa.org.il/Report_Detail_Eng.aspx?id=25662'],
      ['photo',['Eski meydan fotoğrafı','A historic photograph','תצלום היסטורי','Tarixi foto'],'https://www.loc.gov/pictures/item/2019704965/'],
    ],
  },
  {
    label:['Bir metin','A text','טקסט','Bir mətn'],
    options:[
      ['talmud',['Şimon’un mağara anlatısı','Shimon’s cave narrative','סיפור המערה של שמעון','Şimonun mağara rəvayəti'],'https://www.sefaria.org/Shabbat.33b'],
      ['zohar',['Zohar’ın tarihsel dolaşımı','The Zohar’s historical circulation','תפוצתו ההיסטורית של הזוהר','Zoharın tarixi yayılması'],'https://www.sup.org/books/pages/4810/Front_Matter.pdf'],
    ],
  },
  {
    label:['Bir kayıt veya tanıklık','A record or testimony','תיעוד או עדות','Qeyd və ya şahidlik'],
    options:[
      ['geniza',['Geniza mektubu','Geniza letter','מכתב מן הגניזה','Geniza məktubu'],'https://geniza.princeton.edu/en/documents/19917/'],
      ['quarter',['Mağribi Mahallesi arşivi','Maghrebi Quarter archive','ארכיון שכונת המוגרבים','Məğrib məhəlləsinin arxivi'],'https://archives.openjerusalem.org/index.php/mughrabi-quarter'],
    ],
  },
];

export const tourPrompt = [
  'Bu üç durağı bir ziyaretçiye anlat. Her kaynak neyi gösteriyor? Hangi soru açık kalıyor?',
  'Take a visitor to these three stops. What does each source show? What question remains open?',
  'הדריכו מבקר בשלוש התחנות. מה מראה כל מקור? איזו שאלה נשארת פתוחה?',
  'Ziyarətçini bu üç dayanacağa apar. Hər mənbə nəyi göstərir? Hansı sual açıq qalır?',
];


export const lights = {
  title:['Hanuka’da kandiller','Hanukkah lights','נרות חנוכה','Xanuka işıqları'],
  day:['Gece','Night','לילה','Gecə'],
  note:[
    'Şabat 21b iki görüş kaydeder. Hillel okulu her gece kandil sayısını artırır. Şamay okulu azaltır. Yaygın uygulama Hillel okulunu izler. Hizmet mumu sayıya dahil değil.',
    'Shabbat 21b records two views. The school of Hillel adds a light each night. The school of Shammai counts down. Common practice follows Hillel. The helper candle is not counted here.',
    'שבת כא ע״ב מתעד שתי דעות. בית הלל מוסיפים נר בכל לילה ובית שמאי מפחיתים. המנהג הרווח הוא כבית הלל. השמש אינו נספר כאן.',
    'Şabbat 21b iki fikri qeyd edir. Hillel məktəbi hər gecə çıraq sayını artırır, Şammay məktəbi azaldır. Yayğın adət Hilleli izləyir. Köməkçi şam sayılmır.',
  ],
  schools:[
    ['Hillel okulu','School of Hillel','בית הלל','Hillel məktəbi'],
    ['Şamay okulu','School of Shammai','בית שמאי','Şammay məktəbi'],
  ],
};
