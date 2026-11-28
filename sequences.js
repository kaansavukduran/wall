const make = (id, name, order, steps) => ({id,name,order,steps});

// The options are displayed in the listed order. Every step contains tr/en/he/az.
export const sequences = [
  make(1, ['Seder sofrasında bir soru','A question at the seder','שאלה בשולחן הסדר','Seder süfrəsində bir sual'], [2,0,1], [
    ['Çocuk sofradaki farklılığı sorar','A child asks what makes this night different','ילד שואל מה השתנה הלילה','Uşaq bu gecənin fərqini soruşur'],
    ['Öykü anlatılır ve Çıkış hatırlanır','The story is told and the Exodus is remembered','מספרים את הסיפור וזוכרים את יציאת מצרים','Hekayə danışılır və Çıxış xatırlanır'],
    ['Aile Pesah sofrasına oturur','A household gathers at the Passover table','המשפחה מתכנסת לשולחן הפסח','Ailə Pesax süfrəsinə toplaşır'],
  ]),
  make(3, ['Babil ve dönüş','Babylon and return','בבל והשיבה','Babil və dönüş'], [1,2,0], [
    ['Pers dönemi başlar','The Persian period begins','ראשית התקופה הפרסית','Fars dövrü başlayır'],
    ['MÖ 597 ele geçirme ve sürgün','Capture and deportation, 597 BCE','כיבוש והגליה, 597 לפנה״ס','E.ə. 597, şəhərin alınması və sürgün'],
    ['MÖ 587/586 yıkım','Destruction, 587/586 BCE','חורבן, 587/586 לפנה״ס','E.ə. 587/586, dağıntı'],
  ]),
  make(4, ['Pers döneminden üç tarih','Three dates under Persian rule','שלושה תאריכים בשלטון פרס','Fars hakimiyyətindən üç tarix'], [2,0,1], [
    ['Kudüs’te İkinci Tapınak tamamlandı · MÖ 516/515','The Second Temple was completed in Jerusalem · 516/515 BCE','הושלם בית המקדש השני בירושלים · 516/515 לפנה״ס','Yerusəlimdə İkinci Məbəd tamamlandı · e.ə. 516/515'],
    ['Elephantine dilekçesi yazıldı · MÖ 407','The Elephantine petition was written · 407 BCE','נכתבה הבקשה מיב · 407 לפנה״ס','Elefantin müraciəti yazıldı · e.ə. 407'],
    ['Kyros Babil’i aldı · MÖ 539','Cyrus took Babylon · 539 BCE','כורש כבש את בבל · 539 לפנה״ס','Kir Babili aldı · e.ə. 539'],
  ]),
  make(8, ['Olay, zafer alayı ve anıt','The event, triumph and monument','האירוע, התהלוכה והאנדרטה','Hadisə, zəfər yürüşü və abidə'], [1,2,0], [
    ['Titus Takı dikildi · MS 81’den sonra','The Arch of Titus was built · after 81 CE','שער טיטוס הוקם · אחרי 81 לספירה','Titus tağı tikildi · 81-ci ildən sonra'],
    ['Roma ordusu Tapınağı yıktı · MS 70','The Roman army destroyed the Temple · 70 CE','הצבא הרומי החריב את בית המקדש · 70 לספירה','Roma ordusu Məbədi dağıtdı · 70-ci il'],
    ['Roma’da zafer alayı düzenlendi · MS 71','A triumph was held in Rome · 71 CE','נערכה תהלוכת ניצחון ברומא · 71 לספירה','Romada zəfər yürüşü keçirildi · 71-ci il'],
  ]),
  make(11, ['Bir sayfayı oluştur','Assemble a page','סדרו דף תלמוד','Səhifəni qur'], [1,0,2], [
    ['Gemara soruyu tartışır','Gemara discusses the question','הגמרא דנה בשאלה','Gemara sualı müzakirə edir'],
    ['Mişna soruyu ortaya koyar','Mishnah poses the question','המשנה מציגה את השאלה','Mişna sualı ortaya qoyur'],
    ['Daha sonra bir yorumcu sayfayı açıklar','A later commentator explains the page','מפרש מאוחר מסביר את הדף','Sonrakı şərhçi səhifəni izah edir'],
  ]),
  make(12, ['Mağara anlatısında üç an','Three moments in the cave story','שלושה רגעים בסיפור המערה','Mağara rəvayətində üç an'], [1,2,0], [
    ['İkinci çıkışta Şabat için mersin taşıyan birini görürler','After leaving again, they see a man carrying myrtle for Shabbat','ביציאה השנייה הם רואים אדם הנושא הדסים לשבת','İkinci çıxışda Şabbat üçün mərsin daşıyan bir adam görürlər'],
    ['Şimon ve Elazar mağaraya sığınır','Shimon and Elazar take shelter in the cave','שמעון ואלעזר מסתתרים במערה','Şimon və Elazar mağaraya sığınırlar'],
    ['İlk çıkıştan sonra mağaraya geri dönerler','After their first departure, they return to the cave','לאחר היציאה הראשונה הם חוזרים למערה','İlk çıxışdan sonra mağaraya qayıdırlar'],
  ]),
  make(14, ['Orta Çağ Kudüs’ünde üç tarih','Three dates in medieval Jerusalem','שלושה תאריכים בירושלים בימי הביניים','Orta əsr Yerusəlimində üç tarix'], [1,2,0], [
    ['Mağribi Mahallesi’nin erken vakıf tarihi · yaklaşık 1193','Early endowment of the Maghrebi Quarter · around 1193','הקדש מוקדם של רובע המגרבים · סביב 1193','Məğribi məhəlləsinin ilk vəqf tarixi · təxminən 1193'],
    ['Haçlılar kenti aldı · 1099','Crusaders captured the city · 1099','הצלבנים כבשו את העיר · 1099','Səlibçilər şəhəri aldı · 1099'],
    ['Selahaddin kenti geri aldı · 1187','Saladin retook the city · 1187','צלאח א־דין כבש מחדש את העיר · 1187','Səlahəddin şəhəri geri aldı · 1187'],
  ]),
  make(16, ['Zohar’ın zamanlarını ayır','Separate the Zohar’s dates','הבחינו בין זמני הזוהר','Zoharın tarixlərini ayır'], [2,0,1], [
    ['Zohar’ın tarihsel dolaşımı, Kastilya','Historical circulation in Castile','תפוצת הזוהר בקסטיליה','Kastiliyada Zoharın tarixi yayılması'],
    ['Merton nüshasının yazımı · muhtemelen 16. yüzyıl','Copying the Merton manuscript · likely 16th century','העתקת עותק מרטון · כנראה במאה ה־16','Merton nüsxəsinin köçürülməsi · ehtimalən XVI əsr'],
    ['Şimon’un anlatı ortamı','Shimon’s narrative setting','זמן העלילה של שמעון','Şimonun rəvayət dövrü'],
  ]),
  make(18, ['Luria’nın öğretisinde üç aşama','Three stages in Luria’s teaching','שלושה שלבים בתורת האר״י','Lurianın təlimində üç mərhələ'], [1,2,0], [
    ['Tikkun · onarım ve yeniden düzenlenme','Tikkun · repair and reordering','תיקון · שיקום וארגון מחדש','Tikkun · bərpa və yenidən düzülüş'],
    ['Tsimtsum · yaratılışa yer açan çekilme','Tzimtzum · withdrawal that makes room for creation','צמצום · נסיגה המפנה מקום לבריאה','Tsimtsum · yaradılışa yer açan çəkilmə'],
    ['Şevirat ha-kelim · kapların kırılması','Shevirat ha-kelim · breaking of the vessels','שבירת הכלים','Şevirat ha-kelim · qabların sınması'],
  ]),
  make(20, ['1666 öncesi ve sonrası','Before and after 1666','לפני 1666 ואחריה','1666-dan əvvəl və sonra'], [2,1,0], [
    ['Sonraki Sabataycı topluluklar','Later Sabbatian communities','קהילות שבתאיות מאוחרות','Sonrakı Sabatayçı icmalar'],
    ['Sabatay Sevi İslam’a geçti','Sabbatai Zevi converted to Islam','שבתי צבי התאסלם','Sabatay Sevi İslamı qəbul etdi'],
    ['Mesih beklentisi ve haber ağı','Messianic expectation and reports','ציפייה משיחית וידיעות','Məsih gözləntisi və xəbərlər'],
  ]),
  make(21, ['Manda öncesi ve sırasında üç tarih','Three dates before and during the Mandate','שלושה תאריכים לפני המנדט ובמהלכו','Mandatdan əvvəl və mandat dövründə üç tarix'], [1,2,0], [
    ['Batı Duvarı Komisyonu raporu · 1930','Western Wall Commission report · 1930','דוח ועדת הכותל · 1930','Qərb Divarı Komissiyasının hesabatı · 1930'],
    ['Balfour Deklarasyonu · 1917','Balfour Declaration · 1917','הצהרת בלפור · 1917','Balfur Bəyannaməsi · 1917'],
    ['Kudüs, Hebron ve başka yerlerde şiddet · 1929','Violence in Jerusalem, Hebron and elsewhere · 1929','אלימות בירושלים, בחברון ובמקומות נוספים · 1929','Yerusəlimdə, Xevronda və başqa yerlərdə zorakılıq · 1929'],
  ]),
];

export const sequenceLabels = {
  tr:['Kartları sırayla seç.','Sıra tamamlandı.','Bir kez daha düşün.','Sıfırla'],
  en:['Choose the cards in order.','You completed the sequence.','Take another look.','Reset'],
  he:['בחרו בכרטיסים לפי הסדר.','השלמתם את הסדר.','בדקו שוב.','איפוס'],
  az:['Kartları ardıcıllıqla seç.','Ardıcıllıq tamamlandı.','Bir də bax.','Sıfırla'],
};
