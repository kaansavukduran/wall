const item = (chapter, name, body, url) => ({ chapter, name, body, url });

export const library = [
  item(6, ['Batı Duvarı, platform ve Tapınak','Wall, platform and Temple','הכותל, המתחם והמקדש','Divar, platforma və məbəd'], [
    'Batı Duvarı bir istinat duvarının görünen kesimidir. İstinat duvarı, yükseltilmiş alanı ve arkasındaki dolguyu destekler. Tapınak, platformun üzerinde bulunan ayrı kutsal yapıydı. Kesitte üç katmanı tek tek seç.',
    'The Western Wall is a visible section of a retaining wall. A retaining wall supports the raised area and the fill behind it. The Temple was a distinct sacred building on the platform. Select each layer in the cross-section.',
    'הכותל המערבי הוא חלק גלוי מקיר תומך. הקיר תומך במתחם המוגבה ובמילוי שמאחוריו. בית המקדש היה מבנה קדוש נפרד שניצב במתחם. בחרו כל שכבה בחתך.',
    'Qərb Divarı istinad divarının görünən hissəsidir. Divar yüksəldilmiş sahəni və arxasındakı dolğunu saxlayır. Məbəd platformadakı ayrıca müqəddəs bina idi. Kəsikdə qatları ayrı-ayrılıqda seç.',
  ], 'https://hadashot.iaa.org.il/Report_Detail_Eng.aspx?id=25662'),
  item(11, ['Tevrat, Mişna ve Gemara','Torah, Mishnah and Gemara','תורה, משנה וגמרא','Tövrat, Mişna və Gemara'], [
    'Tevrat dar anlamıyla Tanah’ın ilk beş kitabıdır. Mişna rabbanî öğretileri düzenler. Gemara, Mişna’yı tartışan sonraki kuşakların yorumlarından oluşur. Mişna ve Gemara, iki büyük Talmud derlemesinin yapısını anlamanın anahtarıdır.',
    'In its narrower sense, Torah names the first five books of the Tanakh. The Mishnah organizes rabbinic teachings. The Gemara records later discussions of the Mishnah. Together they help explain the structure of the two major Talmud compilations.',
    'במובן המצומצם, תורה היא חמשת חומשי התורה שבתנ״ך. המשנה מסדרת דברי חכמים. הגמרא מביאה דיונים מאוחרים במשנה. כך אפשר להבין את מבנה שני התלמודים.',
    'Dar mənada Tövrat Tanaxın ilk beş kitabıdır. Mişna ravvin təlimlərini toplayır. Gemara Mişna barədə sonrakı müzakirələri qoruyur. Bu ikisi Talmud məcmuələrinin quruluşunu anlamağa kömək edir.',
  ], 'https://www.sefaria.org/Berakhot.2a'),
  item(12, ['Mağara ve Meron','Peqi’in and Meron','המערה ומירון','Mağara və Meron'], [
    'Şabat 33b’de Şimon ve Elazar’ın saklandığı mağara anlatılır. Peqi’in günümüzde bu mağarayla ilişkilendirilen bir yerel gelenektir. Meron, Şimon bar Yohai’ye atfedilen mezar ve Lag BaOmer anmalarıyla ayrı bir duraktır.',
    'Shabbat 33b tells of the cave where Shimon and Elazar hid. Modern Peqi’in is associated with the cave in local tradition. Meron is a separate site tied to the tomb attributed to Shimon bar Yohai and the Lag BaOmer commemoration.',
    'שבת לג ע״ב מספר על המערה שבה הסתתרו שמעון ואלעזר. מסורת מקומית קושרת את המערה לפקיעין. מירון קשור לקבר המיוחס לשמעון בר יוחאי ולהילולת ל״ג בעומר.',
    'Şabbat 33b Şimon və Elazarın gizləndiyi mağaranı danışır. Peqi’in mağara ilə yerli ənənədə əlaqələndirilir. Meron Şimon bar Yohaya aid edilən məzar və Laq BaOmer anımı ilə bağlı ayrıca bir yerdir.',
  ], 'https://www.sefaria.org/Shabbat.33b'),
  item(16, ['Harfler ve gematria','Letters and gematria','אותיות וגימטרייה','Hərflər və gematriya'], [
    'Standart gematria yönteminde ח = 8 ve י = 10. Bu nedenle “canlı” anlamındaki חי sözcüğünün toplamı 18’dir. Belirli bir yorumcunun bu sayıdan çıkardığı anlam, harf hesabının yanında ayrı bir yorum adımıdır.',
    'In standard gematria, ח = 8 and י = 10. The word חי, “living,” therefore totals 18. A commentator’s interpretation of that number is a separate step from computing it.',
    'בגימטרייה הרגילה ח = 8 ו־י = 10, ולכן ערכה של המילה חי הוא 18. המשמעות שמפרש מעניק למספר היא שלב נפרד מן החישוב.',
    'Standart gematriyada ח = 8, י = 10. Buna görə “canlı” mənalı חי sözünün cəmi 18-dir. Şərhçinin bu rəqəmə verdiyi məna hesablamadan ayrı addımdır.',
  ], 'https://www.sefaria.org/Sefer_Yetzirah.1'),
  item(18, ['On sefirot','Ten sefirot','עשר ספירות','On sefirot'], [
    'Keter (taç), Hokhma (bilgelik), Bina (anlayış), Hesed (iyilik), Gevura (güç ve sınır), Tiferet (güzellik), Netsah (süreklilik), Hod (görkem), Yesod (temel) ve Malkhut (hükümranlık). Bu kısa anlamlar giriş niteliğindedir. Yazarlar ilişkileri farklı biçimde açıklar.',
    'Keter (crown), Hokhma (wisdom), Bina (understanding), Hesed (kindness), Gevura (strength and restraint), Tiferet (beauty), Netzah (endurance), Hod (splendor), Yesod (foundation), and Malkhut (sovereignty). These glosses are introductory. Authors explain the relationships differently.',
    'כתר, חכמה, בינה, חסד, גבורה, תפארת, נצח, הוד, יסוד ומלכות. שמות אלו הם נקודת פתיחה לקריאה. מחברים שונים מסבירים באופן שונה את היחסים בין הספירות.',
    'Keter (tac), Xoxma (müdriklik), Bina (anlayış), Xesed (xeyirxahlıq), Gevura (güc və hədd), Tiferet (gözəllik), Netsax (davamlılıq), Hod (əzəmət), Yesod (təməl) və Malxut (hökmranlıq). Müxtəlif müəlliflər əlaqələri fərqli izah edirlər.',
  ], 'https://www.sefaria.org/texts/Kabbalah'),
  item(18, ['ABiYA’nın dört dünyası','The four worlds of ABYA','ארבעת עולמות אבי״ע','ABiYA-nın dörd dünyası'], [
    'Atsilut (yayılım), Beria (yaratılış), Yetsira (biçimlenme) ve Asiya (eylem). ABiYA bu dört adın baş harflerinden oluşur. Adam Kadmon, bazı Lurianik anlatımlarda bu dörtlünün öncesinde yer alır. Şemalar kullanılan metin ve geleneğe göre değişebilir.',
    'Atzilut (emanation), Beriah (creation), Yetzirah (formation) and Asiyah (action) give ABYA its name. Adam Kadmon precedes the four in some Lurianic accounts. The diagram depends on the text and tradition.',
    'אצילות, בריאה, יצירה ועשייה נותנות לאבי״ע את שמו. בכמה תיאורים לוריאניים אדם קדמון קודם לארבעת העולמות. תרשימים משתנים לפי המקור והמסורת.',
    'Atsilut (yayılma), Beria (yaradılış), Yetsira (formalaşma) və Asiya (əməl). ABiYA bu dörd adın baş hərflərindən yaranır. Bəzi Luri ənənələrində Adam Kadmon bu dörd dünyadan əvvəl yerləşir.',
  ], 'https://www.chabad.org/library/article_cdo/aid/6679794/jewish/The-Four-Worlds.htm'),
  item(22, ['Holokost ve tanıklık','The Holocaust and testimony','השואה ועדויות','Holokost və şahidlik'], [
    'Nazi Almanyası, müttefikleri ve işbirlikçileri altı milyon Yahudiyi öldürdü. Ayrımcı yasalar, gettolar, toplu infazlar ve imha merkezleri zaman içinde farklı yerlerde uygulandı. Tanıklıklar kişisel hayat ve kaybı, tarihsel kayıtlar zulmün kapsamını anlamaya yardım eder.',
    'Nazi Germany, its allies and collaborators murdered six million Jews. Discriminatory laws, ghettos, mass shootings and killing centers operated at different times and places. Testimony preserves individual lives and loss; records help establish the scale.',
    'גרמניה הנאצית, בעלות בריתה ומשתפי הפעולה עמה רצחו שישה מיליון יהודים. חוקי אפליה, גטאות, ירי המוני ומרכזי הרג התקיימו בזמנים ובמקומות שונים. עדויות שומרות את סיפורי החיים והאובדן.',
    'Nasist Almaniyası, müttəfiqləri və əlaltıları altı milyon yəhudini öldürdü. Ayrı-seçkilik qanunları, gettolar, kütləvi güllələmələr və məhvetmə mərkəzləri fərqli vaxtlarda və yerlərdə tətbiq edildi. Şahidlik insan həyatını və itkini anlamağa kömək edir.',
  ], 'https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust'),
  item(24, ['Aşlag, Rabaş ve Bnei Baruch','Ashlag, Rabash and Bnei Baruch','אשלג, רב״ש ובני ברוך','Aşlaq, Rabaş və Bnei Barux'], [
    'Yehuda Aşlag’ın Sulam yorumu Zohar’a bir okuma sunar. Baruh Şalom Aşlag’ın yazıları dostlar grubunda çalışmaya odaklanır. Michael Laitman ve Bnei Baruch bu çizginin çağdaş öğretim örneklerinden biridir. Onlu grup, bu öğretim bağlamına aittir.',
    'Yehuda Ashlag’s Sulam offers a reading of the Zohar. Baruch Shalom Ashlag wrote about work among friends. Michael Laitman and Bnei Baruch represent a contemporary teaching stream in this lineage. The “ten” belongs to that teaching context.',
    'פירוש הסולם של יהודה אשלג מציע דרך קריאה בזוהר. ברוך שלום אשלג כתב על העבודה בין חברים. מיכאל לייטמן ובני ברוך מייצגים זרם הוראה בן זמננו בקו זה. העשירייה שייכת להקשר ההוראתי הזה.',
    'Yehuda Aşlaqın Sulam şərhi Zohara bir oxunuş təqdim edir. Barux Şalom Aşlaq dostlar arasında mənəvi iş barədə yazıb. Mixail Laytman və Bnei Barux bu xəttin müasir tədris nümunəsidir. Onlu qrup bu tədris kontekstinə aiddir.',
  ], 'https://kabbalah.academy/en/courses/lesson/696/'),
];

export const libraryLabels = {
  tr: ['Öğrenim evi', 'Açılan kaynaklar', 'İncelediğim nesne', 'Kendi açıklamanı yaz', 'Bu not yalnız bu tarayıcıda kalır.'],
  en: ['Study room', 'Unlocked readings', 'Object I examined', 'Write your explanation', 'This note stays in this browser.'],
  he: ['בית המדרש', 'מקורות שנפתחו', 'החפץ שבדקתי', 'כתבו הסבר משלכם', 'ההערה נשמרת רק בדפדפן הזה.'],
  az: ['Öyrənmə otağı', 'Açılan mənbələr', 'Araşdırdığım əşya', 'Öz izahını yaz', 'Bu qeyd yalnız bu brauzerdə qalır.'],
};

export const calendarLabels = {
  tr: ['Bayram takvimi', 'Takvim yükleniyor…', 'Takvim açılamadı. Sayfayı yenileyip tekrar dene.'],
  en: ['Festival calendar', 'Loading the calendar…', 'The calendar could not open. Reload the page and try again.'],
  he: ['לוח חגים', 'הלוח נטען…', 'הלוח לא נפתח. רעננו את הדף ונסו שוב.'],
  az: ['Bayram təqvimi', 'Təqvim yüklənir…', 'Təqvim açılmadı. Səhifəni yeniləyib yenidən cəhd et.'],
};

export const atlasLabels = {
  tr: ['Cemaat atlası', 'Atlas yükleniyor…', 'Atlas açılamadı. Sayfayı yenileyip tekrar dene.'],
  en: ['Community atlas', 'Loading the atlas…', 'The atlas could not open. Reload the page and try again.'],
  he: ['אטלס קהילות', 'האטלס נטען…', 'האטלס לא נפתח. רעננו את הדף ונסו שוב.'],
  az: ['İcmalar atlası', 'Atlas yüklənir…', 'Atlas açılmadı. Səhifəni yeniləyib yenidən cəhd et.'],
};
