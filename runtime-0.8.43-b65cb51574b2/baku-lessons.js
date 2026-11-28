export const bakuCopy = [
  ['Qırmızı Qəsəbə’de bir yapı kaydına, Cuhuri yazı örneklerine ve Bakü’de çekilmiş bir fotoğrafa bak. Her durak için kaynakların desteklediği sergi etiketini seç.','Examine a building record in Qırmızı Qəsəbə, Juhuri writing samples, and a photograph from Baku. Choose an exhibit label supported by the sources at each stop.','עיינו ברשומת מבנה מקירמיזי קסבה, בדוגמאות כתב בג׳והורי ובצילום מבאקו. בכל תחנה בחרו תווית לתערוכה שהמקורות תומכים בה.','Qırmızı Qəsəbədə bir bina qeydinə, Cuhuri yazı nümunələrinə və Bakıda çəkilmiş fotoya bax. Hər dayanacaqda mənbələrin dəstəklədiyi sərgi yazısını seç.'],
  ['Arşiv durağı','Archive stop','תחנת ארכיון','Arxiv dayanacağı'],
  ['İncelenecek katman','View to examine','מה בודקים','Baxılacaq qat'],
  ['Kaynağın tarihine, türüne ve kapsamına tekrar bak.','Check the source’s date, type and scope again.','בדקו שוב את התאריך, סוג המקור והיקפו.','Mənbənin tarixinə, növünə və əhatəsinə bir də bax.'],
];

export const bakuStops = [
  {
    year:1906,
    title:['1906 · Qırmızı Qəsəbə','1906 · Qırmızı Qəsəbə','1906 · קירמיזי קסבה','1906 · Qırmızı Qəsəbə'],
    views:[
      {
        label:['Sinagog kaydı','Synagogue record','רשומת בית הכנסת','Sinaqoq qeydi'],
        note:['Katalog, Karçagi Sinagogu’nu 1906’ya tarihlendirir. Boris Hayimoviç’in arşivdeki fotoğrafı 1994’te çekildi.','The catalogue dates the Karchagi Synagogue to 1906. Boris Khaimovich took the archived photograph in 1994.','הקטלוג מתארך את בית הכנסת קרצ׳אגי לשנת 1906. בוריס חיימוביץ׳ צילם את התצלום שבארכיון ב־1994.','Kataloq Karçaqi sinaqoqunu 1906-cı ilə aid edir. Arxivdəki fotonu Boris Xaymoviç 1994-cü ildə çəkib.'],
      },
      {
        label:['Müzeye dönüşüm','Conversion to a museum','הסבה למוזיאון','Muzeyə çevrilməsi'],
        note:['Yahudi Sanatı Merkezi, eski Karçagi binasının 2020’de Dağ Yahudileri Müzesi’ne dönüştürüldüğünü kaydeder.','The Center for Jewish Art records the former Karchagi building’s conversion into the Mountain Jews Museum in 2020.','המרכז לאמנות יהודית מתעד את הסבת המבנה של קרצ׳אגי למוזיאון יהודי ההרים ב־2020.','Yəhudi İncəsənəti Mərkəzi keçmiş Karçaqi sinaqoqunun 2020-ci ildə Dağ Yəhudiləri Muzeyinə çevrildiyini qeydə alıb.'],
      },
    ],
    sources:[
      {name:'Center for Jewish Art · Karchagi Synagogue, 163403',url:'https://cja.huji.ac.il/browser.php?id=163403&mode=alone'},
      {name:'Center for Jewish Art · Activities Report, 2022–24',url:'https://cja.huji.ac.il/home/pics/updates/CJA_UPDATE_2022-24.pdf'},
      {name:'Euronews · Museum guide Naum Niftaliyev',url:'https://www.euronews.com/culture/2021/02/25/discover-the-centuries-old-culture-of-mountain-jews-in-azerbaijan'},
    ],
    question:['Hangi etiket üç tarihi doğru bağlar?','Which label connects the three dates correctly?','איזו תווית קושרת נכון את שלושת התאריכים?','Hansı yazı üç tarixi düzgün əlaqələndirir?'],
    answers:[
      ['1906 yapı kaydının, 1994 fotoğrafın, 2020 müzenin tarihidir.','1906 dates the building record, 1994 the photograph, and 2020 the museum.','1906 הוא תאריך המבנה בקטלוג, 1994 תאריך הצילום, ו־2020 תאריך המוזיאון.','1906 kataloqdakı binanın, 1994 fotonun, 2020 isə muzeyin tarixidir.'],
      ['Sinagog ve müze 1994’te birlikte açıldı.','The synagogue and museum opened together in 1994.','בית הכנסת והמוזיאון נפתחו יחד ב־1994.','Sinaqoqla muzey 1994-cü ildə birlikdə açılıb.'],
      ['1906 fotoğrafın, 2020 sinagogun ilk yapım tarihidir.','1906 dates the photograph and 2020 the original synagogue.','1906 הוא תאריך הצילום ו־2020 תאריך הבנייה המקורי של בית הכנסת.','1906 fotonun, 2020 sinaqoqun ilk tikildiyi tarixdir.'],
    ],
    correct:0,
    feedback:['Yapı, görüntü ve daha sonraki kullanım aynı mekânın farklı tarihlerini anlatır.','The building, its photograph and its later use tell different parts of the same place’s history.','המבנה, התצלום והשימוש המאוחר מספרים על שלבים שונים בתולדות אותו מקום.','Bina, foto və sonrakı istifadə eyni məkanın tarixinin ayrı hissələrini göstərir.'],
  },
  {
    year:1909,
    title:['1909 · Cuhuri baskı ve yazı','1909 · Juhuri print and script','1909 · דפוס וכתב בג׳והורי','1909 · Cuhuri nəşri və yazısı'],
    views:[
      {
        label:['İbrani alfabesi','Hebrew script','כתב עברי','İvrit əlifbası'],
        note:['Cuhuri önce İbrani alfabesiyle yazıldı. Qol tefila adlı 1909 dua kitabında Asaf Pinhasov’un Cuhuri çevirisi ana metnin yanında yer aldı. Örnek ifadenin anlamı “ana dil”.','Juhuri was first written in the Hebrew alphabet. The 1909 prayer book Qol tefila contains Asaf Pinhasov’s parallel Juhuri translation. The sample means “mother tongue.”','ג׳והורי נכתבה תחילה באותיות עבריות. סידור קול תפילה מ־1909 כולל תרגום לג׳והורי מאת אסף פנחסוב לצד הטקסט. משמעות הדוגמה היא ״שפת אם״.','Cuhuri əvvəlcə ivrit əlifbası ilə yazılırdı. 1909-cu il Qol tefila dua kitabında Asaf Pinhasovun Cuhuri dilinə tərcüməsi əsas mətnlə yanaşı verilib. Nümunə ifadə “ana dili” deməkdir.'],
        example:['זאוּהאוּן דאדאיאִ','Hebr','rtl'],
      },
      {
        label:['Latin alfabesi','Latin script','כתב לטיני','Latın əlifbası'],
        note:['1929’da Latin temelli yazıya geçme kararı alındı. “Ana dil” ifadesi bu yazıda da Cuhuri olarak okunur.','A decision to adopt a Latin-based alphabet came in 1929. The words for “mother tongue” are still Juhuri in this script.','ההחלטה לעבור לכתב מבוסס לטינית התקבלה ב־1929. צירוף המילים ״שפת אם״ נשאר בג׳והורי גם בכתב הזה.','Latın əsaslı əlifbaya keçid qərarı 1929-cu ildə verilib. “Ana dili” ifadəsi bu əlifbada da Cuhuri dilindədir.'],
        example:['zuhun dәdәji','Latn','ltr'],
      },
      {
        label:['Dağıstan Kirili','Dagestani Cyrillic','כתב קירילי דגסטני','Dağıstan kirili'],
        note:['Kiril yazısı 1938’de Latin temelli yazının yerini aldı. Burada “ana dil” ifadesinin Dağıstan’da kullanılan yazımı var.','Cyrillic replaced the Latin-based alphabet in 1938. Here is “mother tongue” in the spelling used in Dagestan.','הכתב הקירילי החליף את הכתב הלטיני ב־1938. כאן ״שפת אם״ בכתיב הנהוג בדגסטן.','1938-ci ildə latın əsaslı əlifbanı kiril əvəz etdi. Burada “ana dili” ifadəsinin Dağıstanda işlədilən yazılışı verilib.'],
        example:['зугьун дедеи','Cyrl','ltr'],
      },
      {
        label:['Azerbaycan Kirili','Azerbaijani Cyrillic','כתב קירילי אזרבייג׳ני','Azərbaycan kirili'],
        note:['Azerbaycan’da yerel Kiril alfabesi Cuhuri için de uyarlandı. Aynı “ana dil” ifadesindeki harfleri Dağıstan biçimiyle karşılaştır.','Azerbaijan’s local Cyrillic alphabet was also adapted for Juhuri. Compare how it spells “mother tongue” with the Dagestani form.','גם האלפבית הקירילי המקומי של אזרבייג׳ן הותאם לג׳והורי. השוו את הכתיב של ״שפת אם״ לצורה הדגסטנית.','Azərbaycanda yerli kiril əlifbası Cuhuri üçün də uyğunlaşdırılıb. “Ana dili” ifadəsinin bu yazılışını Dağıstandakı forma ilə müqayisə et.'],
        example:['зуһун дәдәји','Cyrl','ltr'],
      },
    ],
    sources:[
      {name:'Jewish Language Project · Juhuri, writing and alphabets',url:'https://www.jewishlanguages.org/judeo-tat-juhuri'},
    ],
    question:['İbrani, Latin ve Kiril harfleriyle gösterilen hangi özellik aynıdır?','What stays the same across the Hebrew, Latin and Cyrillic spellings?','מה נשאר זהה בין הכתיב העברי, הלטיני והקירילי?','İvrit, latın və kiril yazılışlarında hansı xüsusiyyət eyni qalır?'],
    answers:[
      ['Harflerin şekli aynıdır.','The letter shapes stay the same.','צורות האותיות נשארות זהות.','Hərflərin forması eyni qalır.'],
      ['Cuhuri ifadenin anlamı aynıdır.','The Juhuri phrase keeps its meaning.','המשמעות של הביטוי בג׳והורי נשארת זהה.','Cuhuri ifadəsinin mənası eyni qalır.'],
      ['Hepsi aynı yönde okunur.','All versions read in the same direction.','קוראים את כל הצורות באותו כיוון.','Hamısı eyni istiqamətdə oxunur.'],
    ],
    correct:1,
    feedback:['Dil ile alfabe ayrı şeylerdir. Cuhuri “ana dil” ifadesi farklı yazı biçimlerinde aynı anlamı taşır.','A language can be written with different alphabets. The Juhuri expression keeps its meaning across the four spellings.','אפשר לכתוב שפה באלפביתים שונים. לביטוי בג׳והורי אותה משמעות בכל ארבע הצורות.','Dil müxtəlif əlifbalarla yazıla bilər. Cuhuri ifadəsi dörd yazılışda da eyni mənanı daşıyır.'],
  },
  {
    year:1976,
    title:['1976 · Bakü','1976 · Baku','1976 · באקו','1976 · Bakı'],
    views:[
      {
        label:['Fotoğraf kaydı','Photograph record','רשומת התצלום','Foto qeydi'],
        note:['Valeri Fayerman, 1976’da Sovyet Azerbaycanı’nın Bakü kentinde Dağ Yahudileri sinagogunu fotoğrafladı. Müze, fotoğrafı bu yer ve tarihle katalogladı.','In 1976 Valery Fayerman photographed the Mountain Jews’ synagogue in Baku in Soviet Azerbaijan. The museum catalogues the image with that place and date.','ולרי פיירמן צילם ב־1976 את בית הכנסת של יהודי ההרים בבאקו שבאזרבייג׳ן הסובייטית. המוזיאון רשם את המקום והתאריך בקטלוג.','Valeri Fayerman 1976-cı ildə Sovet Azərbaycanının Bakı şəhərində Dağ yəhudilərinin sinaqoqunu çəkib. Muzey fotonu həmin yer və tarixlə kataloqa salıb.'],
      },
      {
        label:['Kent ve göç kayıtları','City and migration records','רישומי העיר וההגירה','Şəhər və köç qeydləri'],
        note:['ANU’nun Bakü dosyası, 1917’den sonra Dağ Yahudilerinin kente gelişinden söz eder. Şehirde başka Yahudi cemaatleri de vardı. Bakü Yahudilerine ait toplamlar ayrı bir veri türüdür.','ANU’s Baku record describes Mountain Jews moving into the city after 1917. Baku also had other Jewish communities. Citywide Jewish population figures are a separate type of evidence.','רשומת באקו של אנו מתארת מעבר של יהודי הרים לעיר אחרי 1917. בעיר חיו גם קהילות יהודיות נוספות. נתוני כלל האוכלוסייה היהודית בעיר הם ראיה מסוג אחר.','ANU-nun Bakı qeydi 1917-ci ildən sonra Dağ yəhudilərinin şəhərə köçündən bəhs edir. Bakıda başqa yəhudi icmaları da yaşayırdı. Şəhər üzrə yəhudi əhalisinin ümumi sayı ayrıca dəlil növüdür.'],
      },
    ],
    sources:[
      {name:'ANU · Jewish community of Baku, Fayerman photo and city history',url:'https://dbs.anumuseum.org.il/skn/en/c6/e185085/Place/Baku'},
      {name:'World Jewish Congress · Azerbaijan',url:'https://www.worldjewishcongress.org/en/about/communities/AZ'},
    ],
    question:['1976 fotoğrafı hangi iddiayı doğrudan destekler?','Which claim does the 1976 photograph support directly?','באיזו טענה תומך תצלום 1976 באופן ישיר?','1976-cı ilin fotosu hansı iddianı birbaşa dəstəkləyir?'],
    answers:[
      ['1976’da bütün Bakü Yahudileri bu sinagogu kullanıyordu.','Every Jew in Baku used this synagogue in 1976.','כל יהודי באקו השתמשו בבית הכנסת הזה ב־1976.','1976-cı ildə Bakının bütün yəhudiləri bu sinaqoqdan istifadə edirdi.'],
      ['Fotoğraf, şehirdeki bütün Yahudi ailelerin sayısını gösterir.','The photograph gives the number of all Jewish families in the city.','התצלום מציין את מספר כל המשפחות היהודיות בעיר.','Foto şəhərdəki bütün yəhudi ailələrinin sayını göstərir.'],
      ['Bakü’de bir Dağ Yahudileri sinagogu bu tarihte fotoğraflandı.','A Mountain Jews’ synagogue in Baku was photographed in that year.','בית כנסת של יהודי ההרים בבאקו צולם באותה שנה.','Həmin ildə Bakıda Dağ yəhudilərinin bir sinaqoqunun fotosu çəkilib.'],
    ],
    correct:2,
    feedback:['Fotoğrafın tarihini ve yapısını kayda geçirebilirsin. Kentteki cemaat sayısını ve göçü çalışma kayıtlarıyla incele.','Record the building and the photograph’s date. Use city and migration records to study the communities beyond the frame.','אפשר לרשום את המבנה ואת תאריך הצילום. למדו על הקהילות שמעבר לתמונה בעזרת רישומי העיר וההגירה.','Binanı və fotonun tarixini qeyd edə bilərsən. Kadrdan kənardakı icmaları şəhər və köç qeydləri ilə öyrən.'],
  },
];
