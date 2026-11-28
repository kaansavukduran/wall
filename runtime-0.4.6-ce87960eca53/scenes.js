const scene = (id, name, options) => ({id,name,options});

export const models = [
  scene(0, ['Aynı yer, iki görünüm','One place, two views','אותו מקום, שני מבטים','Eyni yer, iki görünüş'], [
    ['plaza',['Bugünkü meydan','Present-day plaza','הרחבה כיום','Bugünkü meydan'],
      ['Duvarın önünde geniş bir açık alan var.','A broad open area stands in front of the wall.','לפני הכותל יש רחבה פתוחה.','Divarın qarşısında geniş açıq sahə var.']],
    ['quarter',['1967 öncesi sokak','Street before 1967','רחוב לפני 1967','1967-dən əvvəlki küçə'],
      ['Bu temsili kesit, meydandan önce duvara komşu konutları gösterir.','This schematic view shows homes near the wall before the plaza.','תרשים זה מציג בתי מגורים ליד הכותל לפני הקמת הרחבה.','Bu şərti görünüş meydandan əvvəl divara yaxın evləri göstərir.']],
  ]),
  scene(2, ['Birinci Krallar 6’ya göre şematik kesit','Schematic from I Kings 6','חתך סכמטי על פי מלכים א׳ ו׳','I Padşahlar 6 əsasında şərti kəsik'], [
    ['porch',['Giriş sundurması','Entrance porch','אולם הכניסה','Giriş eyvanı'],
      ['Metin, ana salonun önünde bir giriş sundurması tarif eder.','The text describes a porch in front of the main hall.','הטקסט מתאר אולם כניסה לפני האולם הראשי.','Mətn əsas zalın önündə giriş eyvanını təsvir edir.']],
    ['hall',['Ana salon','Main hall','ההיכל','Əsas zal'],
      ['Ana salon, giriş ile iç oda arasında yer alır.','The main hall lies between the entrance and the inner room.','ההיכל נמצא בין הכניסה לחדר הפנימי.','Əsas zal girişlə daxili otaq arasında yerləşir.']],
    ['sanctuary',['İç kutsal oda','Inner sanctuary','הדביר','Daxili müqəddəs otaq'],
      ['Metin, yapının en iç bölümünü ayrı bir oda olarak betimler.','The text describes a separate room in the innermost part of the building.','הטקסט מתאר חדר נפרד בחלקו הפנימי ביותר של המבנה.','Mətn tikilinin ən iç hissəsini ayrıca otaq kimi təsvir edir.']],
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
  scene(9, ['Doğu Akdeniz’de üç bölge','Three regions of the eastern Mediterranean','שלושה אזורים במזרח הים התיכון','Şərqi Aralıq dənizində üç bölgə'], [
    ['cyrene',['Kyrene','Cyrene','קירנה','Kirena'],
      ['Kyrene, bugünkü Libya’nın doğusundaydı. Roma kaynakları bölgedeki ayaklanmayı anlatır.','Cyrene lay in what is now eastern Libya. Roman sources recount a revolt in the region.','קירנה שכנה במזרח לוב של היום. מקורות רומיים מתארים התקוממות באזור.','Kirena bugünkü Liviyanın şərqində idi. Roma mənbələri bölgədəki üsyandan danışır.']],
    ['egypt',['Mısır','Egypt','מצרים','Misir'],
      ['Mısır’dan kalan papirüsler çatışmanın bir kısmını belgeler. İskenderiye’nin dışındaki yerleşimler de etkilendi.','Papyri from Egypt document parts of the conflict. Settlements beyond Alexandria were affected.','פפירוסים ממצרים מתעדים חלק מן העימות. גם יישובים מחוץ לאלכסנדריה נפגעו.','Misirdən qalan papiruslar qarşıdurmanın bir hissəsini sənədləşdirir. İsgəndəriyyədən kənar məskənlər də təsirləndi.']],
    ['cyprus',['Kıbrıs','Cyprus','קפריסין','Kipr'],
      ['Cassius Dio, Kıbrıs’ı çatışmanın bir başka bölgesi olarak anar. Adada yaşananları Roma bakış açısından aktarır.','Cassius Dio names Cyprus as another area of conflict. His history provides a Roman account of the island.','קסיוס דיו מזכיר את קפריסין כאזור עימות נוסף. חיבורו מציג תיאור רומי של מה שאירע באי.','Kassius Dio Kipri qarşıdurmanın başqa bölgəsi kimi qeyd edir. Onun əsəri adada baş verənləri Roma baxışından təqdim edir.']],
  ]),
  scene(10, ['Bir isyan sikkesinin iki yüzü','Two sides of a revolt coin','שני צדדים של מטבע מרד','Üsyan sikkəsinin iki üzü'], [
    ['facade',['Yapı imgesi','Building image','דימוי מבנה','Tikili təsviri'],
      ['Bu çizim, bazı sikkelerde Tapınak cephesi olarak yorumlanan yapıyı sadeleştirir. Sikke yapının ölçülerini kaydetmez.','This drawing simplifies the structure interpreted as a Temple façade on some coins. The coin does not record its measurements.','הציור מפשט את המבנה המתפרש כחזית המקדש על מטבעות מסוימים. המטבע אינו מתעד את מידות המבנה.','Bu təsvir bəzi sikkələrdə Məbədin ön üzü kimi şərh olunan tikilini sadələşdirir. Sikkədə tikilinin ölçüləri göstərilmir.']],
    ['ritual',['Sukot simgeleri','Sukkot symbols','סמלי סוכות','Sukkot rəmzləri'],
      ['Bazı büyük gümüş sikkelerin öbür yüzünde, Sukot’la ilişkili lulav ve etrog görünür. Lulav, hurma dalının da yer aldığı bir bitki demetidir. Etrog, bir turunçgil meyvesidir.','Some large silver coins show a lulav and etrog on the other side. For Sukkot, a palm branch is held with other plants, alongside the citron.','על צדו השני של חלק ממטבעות הכסף הגדולים נראים לולב ואתרוג. בחג הסוכות נוטלים את הלולב עם צמחים נוספים, ואת האתרוג לצדם.','Bəzi iri gümüş sikkələrin digər üzündə Sukkotla bağlı lulav və etroq görünür. Lulav xurma budağı ilə başqa bitkilərin dəstəsidir. Etroq sitrus meyvəsidir.']],
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
  title:['Fotoğraf ve meydan','Photo and plaza','התצלום והרחבה','Foto və meydan'],
  note:[
    'Negatif yaklaşık 1900–1920. Duvarın dibindeki insanlara ve dar geçide bak.',
    'Negative dated about 1900–1920. Look at the people next to the wall and the narrow passage.',
    'התשליל מתוארך בקירוב ל־1900–1920. שימו לב לאנשים שליד הכותל ולסמטה הצרה.',
    'Neqativ təxminən 1900–1920-ci illərə aiddir. Divarın dibindəki insanlara və dar keçidə bax.',
  ],
  alt:['Dar bir alanda Batı Duvarı’na yakın duran insanlar','People standing close to the Western Wall in a narrow area','אנשים עומדים ליד הכותל בשטח צר','Dar sahədə Qərb Divarının yanında dayanan insanlar'],
  url:'https://www.loc.gov/pictures/item/2019704965/',
  source:['Kongre Kütüphanesi kaydı','Library of Congress record','רשומת ספריית הקונגרס','Konqres Kitabxanasının qeydi'],
  compare:['Sokağı ve meydanı karşılaştır','Compare the alley and plaza','השוו בין הסמטה לרחבה','Küçə ilə meydanı müqayisə et'],
  views:[
    ['1967 öncesi','Before 1967','לפני 1967','1967-dən əvvəl'],
    ['Yan yana','Side by side','זה לצד זה','Yan-yana'],
    ['Bugün','Today','כיום','Bu gün'],
  ],
  captions:[
    ['Temsili çizimde dar geçit, duvar ile evlerin arasındadır.','In this schematic, the narrow passage lies between the wall and the homes.','בתרשים הסמטה הצרה עוברת בין הכותל לבתים.','Şərti təsvirdə dar keçid divarla evlərin arasındadır.'],
    ['İki çizimde de aynı taş duvarı izle. Değişen şey, duvarın önündeki alan.','Follow the same stone wall across the two views. The space in front changes.','עקבו אחר אותו קיר אבן בשני המבטים. השטח שלפניו משתנה.','Hər iki təsvirdə eyni daş divarı izlə. Dəyişən onun qarşısındakı sahədir.'],
    ['Temsili çizimde duvarın önünde geniş bir meydan var.','In this schematic, a broad plaza stands in front of the wall.','בתרשים יש רחבה גדולה לפני הכותל.','Şərti təsvirdə divarın qarşısında geniş meydan var.'],
  ],
  history:[
    'Arşiv fotoğrafı dar alanı gösterir. UNESCO raporu sonraki değişimi belgeler. Haziran 1967 savaşının ardından İsrail, Mağribi Mahallesi’ni yıktı. Mahalle sakinleri evlerini kaybetti. Duvarın önü geniş bir ibadet meydanına dönüştü.',
    'The photograph shows the narrow space. A UNESCO report documents the later change. After the June 1967 war, Israel demolished the Maghrebi Quarter. Residents lost their homes. The space in front of the wall became a broad prayer plaza.',
    'התצלום מראה את השטח הצר. דוח אונסק״ו מתעד את השינוי המאוחר. לאחר מלחמת יוני 1967 הרסה ישראל את שכונת המוגרבים. תושבי השכונה איבדו את בתיהם. השטח לפני הכותל הפך לרחבת תפילה גדולה.',
    'Arxiv fotosu dar sahəni göstərir. UNESCO hesabatı sonrakı dəyişikliyi sənədləşdirir. 1967-ci ilin iyun müharibəsindən sonra İsrail Məğrib məhəlləsini sökdü. Sakinlər evlərini itirdilər. Divarın qarşısındakı sahə geniş ibadət meydanına çevrildi.',
  ],
  historySource:['UNESCO saha raporu','UNESCO field report','דוח השטח של אונסק״ו','UNESCO-nun sahə hesabatı'],
  historyUrl:'https://whc.unesco.org/document/8721',
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
