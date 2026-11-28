export const tourFollowup = {
  wall:{
    choices:['photo','wall','quarter'],
    title:['Josephus’un Tapınak anlatısı','Josephus on the Temple','יוסף בן מתתיהו על המקדש','İosif Flavinin Məbəd təsviri'],
    url:'https://penelope.uchicago.edu/josephus/ant-15.html',
    prompt:[
      'Kazı, yapı katmanlarını gösteriyor. Hirodes’in Tapınak projesini anlatan antik tarihçi için hangi kaynağı açabiliriz?',
      'The excavation shows layers of construction. Which source gives us an ancient historian’s account of Herod’s Temple project?',
      'החפירה מראה שכבות בנייה. באיזה מקור נוכל לקרוא תיאור של היסטוריון קדום על מפעל הבנייה של הורדוס במקדש?',
      'Qazıntı tikinti təbəqələrini göstərir. Hirodun Məbəd layihəsini təsvir edən qədim tarixçini hansı mənbədə oxuya bilərik?',
    ],
    note:[
      'Josephus, Yahudilerin Eski Tarihi 15.11’de Hirodes’in Tapınak projesini anlatır. Bu anlatı inşa programını, kazı raporu ise Wilson Kemeri altındaki maddi katmanları ele alır.',
      'Josephus describes Herod’s building project in Antiquities 15.11. His account presents the project. The excavation report examines material layers below Wilson’s Arch.',
      'יוסף בן מתתיהו מתאר את מפעל הבנייה של הורדוס בקדמוניות היהודים ט״ו, י״א. החיבור מתאר את המפעל, ודו״ח החפירה בוחן את השכבות מתחת לקשת וילסון.',
      'İosif Flavi Yəhudilərin qədim tarixi 15.11-də Hirodun layihəsini təsvir edir. Əsər tikinti layihəsini, qazıntı hesabatı isə Uilson tağının altındakı maddi təbəqələri araşdırır.',
    ],
  },
  photo:{
    choices:['quarter','wall','photo'],
    title:['1930 Duvar Komisyonu raporu','1930 Wall Commission report','דו״ח ועדת הכותל משנת 1930','1930-cu il Divar Komissiyasının hesabatı'],
    url:'https://unispal.un.org/pdfs/59A92104ED00DC468525625B00527FEA.pdf#page=25',
    prompt:[
      'Fotoğrafta dar geçitte ibadet edenleri görüyorum. Manda döneminde erişim ve mülkiyet hangi belgede ayrı ayrı ele alınıyor?',
      'I can see people praying in the narrow passage. Which document addresses access and ownership separately during the Mandate?',
      'אני רואה מתפללים במעבר הצר. איזה מסמך עוסק בנפרד בגישה ובבעלות בתקופת המנדט?',
      'Dar keçiddə dua edənləri görürəm. Mandat dövründə giriş və mülkiyyət hansı sənəddə ayrıca nəzərdən keçirilir?',
    ],
    note:[
      'Fotoğraf, mekânı ve orada ibadet edenleri gösterir. 1930 Komisyonu raporu, Manda dönemindeki mülkiyet ile Yahudilerin ibadet için erişimini ayrı başlıklarda ele alır.',
      'The photograph shows the space and people praying there. The 1930 commission report treats ownership and Jewish access for worship as separate questions under the Mandate.',
      'התצלום מראה את המקום ואת האנשים שהתפללו בו. דו״ח ועדת 1930 עוסק בבעלות ובזכות הגישה של יהודים לתפילה כשאלות נפרדות בתקופת המנדט.',
      'Foto məkanı və orada dua edənləri göstərir. 1930-cu il komissiyasının hesabatı mandat dövründə mülkiyyəti və yəhudilərin dua üçün girişini ayrı məsələlər kimi araşdırır.',
    ],
  },
  talmud:{
    choices:['talmud','zohar','wall'],
    title:['Peqi’in mağarası saha araştırması','Field study of the Peqi’in cave','מחקר שדה במערת פקיעין','Peqi’in mağarasında sahə araşdırması'],
    url:'https://doi.org/10.26351/IHD/14-1/4',
    prompt:[
      'Talmud mağaraya bir yer adı vermiyor. Peqi’in’deki yerel geleneği ve mağaradaki buluntuları hangi kaynak yan yana inceliyor?',
      'The Talmud gives no place name for the cave. Which source examines the local tradition at Peqi’in alongside finds at the site?',
      'התלמוד אינו מציין היכן נמצאת המערה. איזה מקור בוחן את המסורת המקומית בפקיעין לצד הממצאים באתר?',
      'Talmud mağaranın yerini adla göstərmir. Peqi’indəki yerli ənənəni və mağaradakı tapıntıları hansı mənbə birlikdə araşdırır?',
    ],
    note:[
      'Saha araştırması Peqi’in’deki mağaranın maddi buluntularını ve yerel atfını inceler. Bulgular, anlatıdaki iki kişinin kimliğini belirlemeye yetmez.',
      'The field study examines material finds and the local attribution at Peqi’in. The finds leave the identity of the cave’s occupants in the story open.',
      'מחקר השדה בוחן את הממצאים במערת פקיעין ואת המסורת המקומית. הממצאים מותירים פתוחה את שאלת זהותם של יושבי המערה בסיפור.',
      'Sahə araşdırması Peqi’in mağarasındakı maddi tapıntıları və yerli ənənəni araşdırır. Bu tapıntılar rəvayətdəki iki şəxsin kimliyini müəyyən etməyə kifayət etmir.',
    ],
  },
  zohar:{
    choices:['geniza','zohar','talmud'],
    title:['Merton’un Zohar nüshası','Merton’s Zohar manuscript','כתב היד של הזוהר במרטון','Mertonun Zohar əlyazması'],
    url:'https://www.merton.ox.ac.uk/news/merton-zohar-manuscript-digitised',
    prompt:[
      'Giriş metnin Kastilya’da görünmesini anlatıyor. Daha sonraki bir Zohar kopyasının kâğıdını ve kâtip notunu hangi kayıtta görürüz?',
      'The introduction describes the text’s appearance in Castile. Which record examines the paper and a scribe’s note in a later copy of the Zohar?',
      'ההקדמה מתארת את הופעת הטקסט בקסטיליה. איזו רשומה בוחנת את הנייר ואת הערת המעתיק בעותק מאוחר יותר של הזוהר?',
      'Giriş mətnin Kastiliyada görünməsini təsvir edir. Zoharın sonrakı nüsxəsinin kağızı və katibin qeydi hansı mənbədə araşdırılır?',
    ],
    note:[
      'Merton kaydı, sonradan kopyalanmış bir nüshanın kâğıdını ve 111v yaprağındaki kâtip notunu tarihlendirmede kullanır. Bu, metnin ilk görünmesinden ayrı bir yazma tarihi sunar.',
      'Merton’s record uses the paper and the scribe’s note on folio 111v to discuss the dating of a later copy. This gives the manuscript its own place in the timeline of the text.',
      'הרשומה של מרטון נעזרת בנייר ובהערת המעתיק בדף 111v כדי לדון בתיארוך העותק המאוחר. כך לכתב היד יש תאריך משלו בתולדות הטקסט.',
      'Mertonun qeydi sonrakı nüsxənin tarixini araşdırmaq üçün kağıza və 111v vərəqindəki katib qeydinə baxır. Əlyazma mətnin tarixində ayrıca yer tutur.',
    ],
  },
  geniza:{
    choices:['zohar','photo','geniza'],
    title:['Berahot’un anneye mektubu','Berakhot’s letter to his mother','מכתבו של ברכות לאמו','Beraxotun anasına məktubu'],
    url:'https://geniza.princeton.edu/en/documents/6592/',
    prompt:[
      'Kardeşe mektuptaki yazar ve alıcı için katalog tahmin kullanıyor. Hangi başka Geniza belgesinin arka yüzünde şehir ve mektubu iletecek kişi yazılı?',
      'The catalogue uses estimates for the letter to a brother. Which other Geniza letter names a city and a person who should forward it on its reverse?',
      'הקטלוג משתמש בהערכות לגבי המכתב לאח. באיזה מכתב גניזה אחר כתובים בצדו האחורי עיר ושמו של האדם שאמור להעבירו?',
      'Kataloq qardaşa yazılmış məktubu ehtimallarla izah edir. Başqa hansı Geniza məktubunun arxasında şəhər və məktubu çatdıracaq şəxsin adı yazılıb?',
    ],
    note:[
      'Berahot’un 1158 tarihli mektubunun adresi İskenderiye’deki kuyumcular çarşısını ve mektubu iletecek kişiyi gösterir. Bu kayıt, kesin bir adres ile katalogdan çıkarılan alıcıyı karşılaştırmaya yarar.',
      'The address on Berakhot’s letter of 1158 names the goldsmiths’ market in Alexandria and the person who should forward it. It lets us compare a written address with a recipient inferred by a catalogue.',
      'בכתובת שעל מכתבו של ברכות משנת 1158 מופיעים שוק הצורפים באלכסנדריה והאדם שאמור להעביר את המכתב. אפשר להשוות כתובת כתובה לנמען שהקטלוג מזהה בהשערה.',
      'Beraxotun 1158-ci il məktubunun ünvanında İsgəndəriyyə zərgərlər bazarı və məktubu çatdıracaq şəxs göstərilir. Yazılmış ünvanı kataloqun ehtimal etdiyi alıcı ilə müqayisə etmək olar.',
    ],
  },
  quarter:{
    choices:['quarter','photo','geniza'],
    title:['UNESCO’nun Kudüs raporu','UNESCO’s Jerusalem report','דו״ח אונסק״ו על ירושלים','UNESCO-nun Yerusəlim hesabatı'],
    url:'https://whc.unesco.org/document/8721',
    prompt:[
      'Arşivde Mağribi Mahallesi’ne ait kayıtlar var. Mahallenin yıkımını ve meydandan Mağribi Kapısı’na kalan güzergâhı hangi kurum raporu anlatıyor?',
      'The archive holds records of the Maghrebi Quarter. Which institutional report describes its demolition and the remaining route from the plaza to the Mughrabi Gate?',
      'בארכיון יש תעודות על שכונת המוגרבים. איזה דו״ח מוסדי מתאר את הריסת השכונה ואת הדרך שנותרה מהרחבה לשער המוגרבים?',
      'Arxivdə Məğribi məhəlləsinin sənədləri var. Məhəllənin sökülməsini və meydandan Məğribi qapısına qalmış yolu hansı qurumun hesabatı təsvir edir?',
    ],
    note:[
      'UNESCO’nun 2007 raporu, İsrail’in Haziran 1967 savaşından sonra mahalleyi yıktığını kaydeder. Heyet meydandan Mağribi Kapısı’na kalan güzergâhı inceler. Arşiv, yıkımdan önceki mahalleyi araştırmaya yardım eder.',
      'UNESCO’s 2007 report records Israel’s demolition of the quarter after the June 1967 war. The mission examines the remaining route from the plaza to the Mughrabi Gate. The archive helps us study the neighborhood before demolition.',
      'דו״ח אונסק״ו מ־2007 מתעד שישראל הרסה את השכונה אחרי מלחמת יוני 1967. המשלחת בוחנת את הדרך שנותרה מהרחבה לשער המוגרבים. הארכיון מסייע לחקור את השכונה לפני ההריסה.',
      'UNESCO-nun 2007-ci il hesabatı İsrailin 1967-ci ilin iyun müharibəsindən sonra məhəlləni sökdüyünü qeyd edir. Missiya meydandan Məğribi qapısına qalmış yolu araşdırır. Arxiv sökülmədən əvvəlki məhəlləni öyrənməyə kömək edir.',
    ],
  },
};
