export const methodCopy = [
  ['Bir yöntem seç ve aşağıdaki örneğin parçalarına dokun. Her yöntem sözcüğe farklı bir soru sorar.',
    'Choose a method and reveal the parts of its example. Each method asks a different question about the word.',
    'בחרו שיטה וחשפו את חלקי הדוגמה שלה. כל שיטה שואלת שאלה אחרת על המילה.',
    'Üsul seç və nümunənin hissələrini aç. Hər üsul sözə ayrı sual verir.'],
  ['Harfleri seç', 'Select letters', 'בחרו אותיות', 'Hərfləri seç'],
  ['Son biçimlere 500–900 ver', 'Use 500–900 for final forms', 'ערכי האותיות הסופיות הם 500–900', 'Son formalara 500–900 dəyəri ver'],
  ['Kaynaklar', 'Sources', 'מקורות', 'Mənbələr'],
  ['Örneği sıfırla', 'Reset the example', 'אפסו את הדוגמה', 'Nümunəni sıfırla'],
  ['Yöntem', 'Method', 'שיטה', 'Üsul'],
];

export const wordMethods = [{
  id:'gematria',
  title:['Gematria','Gematria','גימטרייה','Gematriya'],
  tiles:[...'מלך'],
  hint:[
    'Meleh, “kral” demektir. Harflerin sayısal değerlerini sırayla aç. Standart bir hesapta son kaf 20’dir. Genişletilmiş yöntemde 500 olur.',
    'Melekh means “king.” Reveal each letter’s numerical value. In the standard convention, final kaf is 20. In the extended convention it is 500.',
    'מֶלֶךְ הוא שליט. חשפו את ערכי האותיות. בחישוב הרגיל ערכה של כ״ף סופית 20, ובחישוב המורחב ערכה 500.',
    'Melek “padşah” deməkdir. Hərflərin say dəyərlərini aç. Standart üsulda son kaf 20, genişləndirilmiş üsulda isə 500 olur.',
  ],
  result:[
    'Yöntem değişince aynı sözcüğün toplamı değişebilir. Kral anlamını öğrenmek için sözcüğün kullanıldığı cümleye ve sözlüğe bak.',
    'The same word can have a different sum when the convention changes. To learn that it means “king,” look at usage and a dictionary.',
    'כאשר שיטת החישוב משתנה, גם הסכום של אותה מילה עשוי להשתנות. כדי להבין את פירוש המילה, בודקים שימוש ומילון.',
    'Üsul dəyişdikdə eyni sözün cəmi dəyişə bilər. “Padşah” mənasını öyrənmək üçün sözün işləndiyi cümləyə və lüğətə bax.',
  ],
  sources:[
    ['Jewish Encyclopedia · Gemaṭria','https://www.jewishencyclopedia.com/articles/6571-gematria'],
    ['Irit Meir · Numerals, Modern Hebrew','https://signlab.haifa.ac.il/images/irit_articles/Meir%202013%20Numerals%20Modern%20Hebrew%20EHLL.pdf'],
  ],
}, {
  id:'notarikon',
  title:['Notarikon','Notarikon','נוטריקון','Notarikon'],
  tiles:[...'אנכי'],
  expanded:['אנא','נפשי','כתיבת','יהבית'],
  outputLang:'arc',
  hint:[
    'On Emir’in başındaki anokhi “ben” demektir. Şabat 105a:3’te Rabbi Yohanan, dört harfi dört Aramice sözcüğün başı olarak okur. Bu okuma, notarikon örneğidir.',
    'Anokhi means “I” at the start of the Ten Commandments. In Shabbat 105a:3, Rabbi Yohanan reads its four letters as the initials of four Aramaic words. That reading is an example of notarikon.',
    '„אנכי” פירושו „אני” בתחילת עשרת הדיברות. בשבת ק״ה ע״א ר׳ יוחנן קורא את ארבע האותיות כראשי תיבות של ארבע מילים בארמית. זהו נוטריקון.',
    'On Əmrin əvvəlində anoxi “mən” deməkdir. Şabbat 105a:3-də ravvin Yohanan dörd hərfi dörd arami sözünün baş hərfi kimi oxuyur. Bu, notarikon nümunəsidir.',
  ],
  result:[
    'Açılan ifade, Tanrı’nın yazıp verdiğini kendi ağzından dile getiren rabbanî bir yorumdur. Aynı Talmud pasajı başka açılımlar da verir.',
    'The phrase is a rabbinic interpretation of God speaking in the first person about writing and giving. The passage also gives other expansions.',
    'הביטוי הוא דרשה שבה האל מדבר בגוף ראשון על כתיבה ונתינה. באותו קטע מוצעים גם נוטריקונים נוספים.',
    'Açılan ifadə Tanrının yazıb verməsini onun dilindən söyləyən ravvin şərhidir. Eyni Talmud parçası başqa açılımlar da verir.',
  ],
  sources:[
    ['Exodus 20:2 · Sefaria','https://www.sefaria.org/Exodus.20.2'],
    ['Shabbat 105a:3 · Sefaria','https://www.sefaria.org/Shabbat.105a.3'],
  ],
}, {
  id:'atbash',
  title:['Atbaş','Atbash','אתב״ש','Atbaş'],
  tiles:[...'ששך'],
  outputLang:'he',
  hint:[
    'Temura, harfleri başka harflerle değiştirme yöntemlerini kapsar. Atbaş’ta alfabenin başı ve sonu eşleşir. Örneğin alef ↔ tav, bet ↔ şin. Yeremya’daki Şeşah adını aç.',
    'Temurah includes methods of substituting letters. In Atbash, the first and last letters pair, then the second and second-last, and so on. Decode Jeremiah’s Sheshach.',
    'תמורה כוללת שיטות להחלפת אותיות. באתב״ש האות הראשונה מתחלפת באחרונה, השנייה בלפני אחרונה, וכן הלאה. פענחו את ששך מירמיהו.',
    'Temura hərfləri başqa hərflərlə əvəz edən üsulları əhatə edir. Atbaşda ilk və son hərf, sonra ikinci və sondan ikinci hərf qoşalaşır. Yeremiyadakı Şeşax adını aç.',
  ],
  result:[
    'Raşi, Şeşah’ı bu yolla Bavel, yani Babil olarak okur. Sondaki ך, eşleştirmede ׳כ׳ harfinin biçimidir.',
    'Rashi reads Sheshach as Bavel, or Babylon, using this substitution. Final ך is the end-of-word form of כ in the pairing.',
    'רש״י קורא את ששך כבבל באמצעות ההחלפה הזאת. ך היא הצורה הסופית של כ בהחלפה.',
    'Raşi bu əvəzləmə ilə Şeşaxı Bavel, yəni Babil kimi oxuyur. Sondakı ך qoşalaşmada כ hərfinin son formasıdır.',
  ],
  sources:[
    ['Jeremiah 25:26 · Sefaria','https://www.sefaria.org/Jeremiah.25.26'],
    ['Rashi on Jeremiah 25:26:1 · Sefaria','https://www.sefaria.org/Rashi_on_Jeremiah.25.26.1'],
  ],
}, {
  id:'lexical',
  title:['Kök ve bağlam','Root and context','שורש והקשר','Kök və kontekst'],
  tiles:['וַיִּשְׁבֹּת'],
  expanded:['ש־ב־ת'],
  outputLang:'he',
  hint:[
    'Yaratılış 2:2’deki vaişbot biçimini incele. Sözcüğün köküne ve cümlede nelerin durduğuna bak.',
    'Examine vayishbot in Genesis 2:2. Look at its root and at what comes to an end in the sentence.',
    'בדקו את הצורה „וישבת” בבראשית ב׳:ב׳. שימו לב לשורש ולמה שמסתיים במשפט.',
    'Yaradılış 2:2-dəki vaysbot formasını yoxla. Sözün kökünə və cümlədə nəyin sona çatdığına bax.',
  ],
  result:[
    'BDB sözlüğünde şavat, durmak veya işe ara vermek anlamına gelebilir. Ayette yapılan işin bırakılması anlatılır. Kök ve bağlam, bu okumanın dayanaklarıdır.',
    'In the BDB dictionary, shavat can mean to stop or rest from work. The verse describes work ceasing. The root and context support that reading.',
    'במילון BDB, שבת יכול לציין הפסקה או מנוחה ממלאכה. הפסוק מתאר את הפסקת המלאכה. השורש וההקשר תומכים בקריאה הזאת.',
    'BDB lüğətində şavat dayanmaq və ya işə ara vermək demək ola bilər. Ayədə işin dayandırılmasından danışılır. Bu oxunuşu sözün kökü və konteksti dəstəkləyir.',
  ],
  sources:[
    ['Genesis 2:2 · Sefaria','https://www.sefaria.org/Genesis.2.2'],
    ['Brown–Driver–Briggs · שָׁבַת','https://www.sefaria.org/BDB%2C_%D7%A9%D6%B8%D7%81%D7%91%D6%B7%D7%AA'],
  ],
}];
