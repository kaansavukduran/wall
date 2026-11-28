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
  make(11, ['Bir sayfayı oluştur','Assemble a page','סדרו דף תלמוד','Səhifəni qur'], [1,0,2], [
    ['Gemara soruyu tartışır','Gemara discusses the question','הגמרא דנה בשאלה','Gemara sualı müzakirə edir'],
    ['Mişna soruyu ortaya koyar','Mishnah poses the question','המשנה מציגה את השאלה','Mişna sualı ortaya qoyur'],
    ['Daha sonra bir yorumcu sayfayı açıklar','A later commentator explains the page','מפרש מאוחר מסביר את הדף','Sonrakı şərhçi səhifəni izah edir'],
  ]),
  make(16, ['Zohar’ın zamanlarını ayır','Separate the Zohar’s dates','הבחינו בין זמני הזוהר','Zoharın tarixlərini ayır'], [2,0,1], [
    ['Zohar’ın tarihsel dolaşımı, Kastilya','Historical circulation in Castile','תפוצת הזוהר בקסטיליה','Kastiliyada Zoharın tarixi yayılması'],
    ['Modern edisyon ve inceleme','Modern edition and study','מהדורה ומחקר מודרניים','Müasir nəşr və araşdırma'],
    ['Şimon’un anlatı ortamı','Shimon’s narrative setting','זמן העלילה של שמעון','Şimonun rəvayət dövrü'],
  ]),
  make(20, ['1666 öncesi ve sonrası','Before and after 1666','לפני 1666 ואחריה','1666-dan əvvəl və sonra'], [2,1,0], [
    ['Sonraki Sabataycı topluluklar','Later Sabbatian communities','קהילות שבתאיות מאוחרות','Sonrakı Sabatayçı icmalar'],
    ['Sabatay Sevi İslam’a geçti','Sabbatai Zevi converted to Islam','שבתי צבי התאסלם','Sabatay Sevi İslamı qəbul etdi'],
    ['Mesih beklentisi ve haber ağı','Messianic expectation and reports','ציפייה משיחית וידיעות','Məsih gözləntisi və xəbərlər'],
  ]),
];

export const sequenceLabels = {
  tr:['Kartları sırayla seç.','Sıra tamamlandı.','Bir kez daha düşün.','Sıfırla'],
  en:['Choose the cards in order.','You completed the sequence.','Take another look.','Reset'],
  he:['בחרו בכרטיסים לפי הסדר.','השלמתם את הסדר.','בדקו שוב.','איפוס'],
  az:['Kartları ardıcıllıqla seç.','Ardıcıllıq tamamlandı.','Bir də bax.','Sıfırla'],
};
