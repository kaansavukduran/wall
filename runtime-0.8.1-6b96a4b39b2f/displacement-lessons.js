export const archiveCopy = [
  ['Beş ayrı olayın kısa özetini oku. İstersen ayrıntıları açıp tarihleri ve belgeleri incele.','Read short accounts of five distinct cases. Open the details when you want to examine dates and records.','קראו תקצירים של חמישה מקרים נפרדים. אפשר לפתוח את הפרטים ולעיין בתאריכים ובמסמכים.','Beş ayrı hadisənin qısa xülasəsini oxu. Tarix və sənədlərə baxmaq üçün təfərrüatı aça bilərsən.'],
  ['Arşiv kaydı','Archive record','רשומת ארכיון','Arxiv qeydi'],
  ['Tarihler, belgeler ve yorum','Dates, records and interpretation','תאריכים, מסמכים ופרשנות','Tarixlər, sənədlər və şərh'],
];

export const displacementRecords = [
  {
    id:'holocaust-1933-1945',
    title:['1933–1945 · Holokost','1933–1945 · The Holocaust','1933–1945 · השואה','1933–1945 · Holokost'],
    summary:['Nazi Almanyası, müttefikleri ve işbirlikçileri altı milyon Avrupa Yahudisini sistematik olarak öldürdü. Irkçı rejim Romanlar ve başka hedef gruplara da zulmetti ve onları öldürdü.','Nazi Germany, its allies and collaborators systematically murdered six million European Jews. The racist regime also persecuted and killed Roma and other targeted groups.','גרמניה הנאצית, בעלות בריתה ומשתפי פעולה רצחו באופן שיטתי שישה מיליון מיהודי אירופה. המשטר הגזעני רדף ורצח גם רומה וקבוצות נוספות.','Nasist Almaniyası, müttəfiqləri və əməkdaşları altı milyon Avropa yəhudisini sistemli şəkildə öldürdü. İrqçi rejim romanlara və başqa hədəf qruplarına da zülm etdi və onları öldürdü.'],
    steps:[
      ['1933–1938. Naziler iktidara geldi. Ayrımcı yasalar Yahudilerin haklarını aşındırdı. Kasım 1938 pogromunda sinagoglar ve evler hedef alındı.','1933–1938. The Nazis took power. Discriminatory laws stripped Jews of rights. The November 1938 pogrom targeted synagogues and homes.','1933–1938. הנאצים עלו לשלטון. חוקים מפלים שללו בהדרגה את זכויות היהודים. בפוגרום בנובמבר 1938 הותקפו בתי כנסת ובתים.','1933–1938. Nasistlər hakimiyyətə gəldi. Ayrı-seçkilik qanunları yəhudiləri hüquqlarından məhrum etdi. 1938-ci ilin noyabr talanında sinaqoqlar və evlər hədəfə alındı.'],
      ['1939–1942. İşgal altında gettolar kuruldu. 1941’den itibaren sistematik kitlesel katliamlar başladı. Sürgün trenleri ve imha merkezleri soykırımın parçası oldu.','1939–1942. Ghettos were established under occupation. Systematic mass murder began in 1941. Deportations and killing centers became part of the genocide.','1939–1942. תחת הכיבוש הוקמו גטאות. ב־1941 החל רצח המוני שיטתי. גירושים ומרכזי השמדה נעשו חלק מרצח העם.','1939–1942. İşğal altında gettolar yaradıldı. 1941-ci ildən sistemli kütləvi qətllər başlandı. Deportasiyalar və məhvetmə mərkəzləri soyqırımın bir hissəsinə çevrildi.'],
      ['1943–1945 ve sonrası. Varşova Gettosu’nda Yahudiler sürgünlere karşı direndi. Müttefikler kampları kurtardı. Çok sayıda hayatta kalan, yeni bir yaşam kurmaya çalışırken yerinden edilmiş kişiler kamplarında kaldı.','1943–1945 and after. Jews in the Warsaw ghetto resisted deportation. Allied forces liberated camps. Many survivors stayed in displaced-persons camps while trying to rebuild their lives.','1943–1945 ואילך. יהודים בגטו ורשה התנגדו לגירוש. בעלות הברית שחררו מחנות. ניצולים רבים שהו במחנות עקורים בדרכם לבנות מחדש את חייהם.','1943–1945 və sonrakı dövr. Varşava gettosundakı yəhudilər deportasiyaya müqavimət göstərdilər. Müttəfiqlər düşərgələri azad etdi. Sağ qalanların çoxu yeni həyata başlamağa çalışarkən köçkün düşərgələrində qaldı.'],
    ],
    sources:[
      {title:'United States Holocaust Memorial Museum · Holocaust timeline',url:'https://encyclopedia.ushmm.org/content/en/timeline/holocaust'},
      {title:'United States Holocaust Memorial Museum · Introduction to the Holocaust',url:'https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust'},
      {title:'United States Holocaust Memorial Museum · The Warsaw Ghetto Uprising',url:'https://encyclopedia.ushmm.org/content/en/article/the-warsaw-ghetto-uprising'},
    ],
    prompt:['Müzenin 1933 ve 1941 tarihleri hangi iki aşamayı ayırır?','Which stages do the museum’s 1933 and 1941 dates distinguish?','אילו שלבים מבחינים התאריכים 1933 ו־1941 במוזיאון?','Muzeyin 1933 və 1941 tarixləri hansı iki mərhələni ayırır?'],
    options:[
      ['Nazi iktidarının başlamasını ve sistematik kitlesel öldürmenin başlamasını.','The start of Nazi rule and the onset of systematic mass murder.','תחילת השלטון הנאצי ותחילת הרצח ההמוני השיטתי.','Nasist hakimiyyətinin başlanmasını və sistemli kütləvi qətllərin başlanmasını.'],
      ['Müttefiklerin kampları kurtarmasını ve savaşın sona ermesini.','Allied liberation of the camps and the end of the war.','שחרור המחנות בידי בעלות הברית וסיום המלחמה.','Düşərgələrin müttəfiqlər tərəfindən azad edilməsini və müharibənin bitməsini.'],
    ],
    feedback:[
      ['Evet. Zulmün ilk yılları ile savaş sırasında hızlanan soykırımı ayrı tarihlere yerleştirdin.','Yes. You distinguished the early years of persecution from wartime genocide.','כן. הבחנתם בין שנות הרדיפה הראשונות לבין רצח העם בזמן המלחמה.','Bəli. Zülmün ilk illərini müharibə dövründəki soyqırımdan ayırdın.'],
      ['Kampların kurtarılması için kronolojinin sonuna, 1944–1945’e bak.','Look near the end of the chronology, in 1944–1945, for the liberation of the camps.','חפשו את שחרור המחנות לקראת סוף הציר, בשנים 1944–1945.','Düşərgələrin azad olunduğu vaxta baxmaq üçün xronologiyanın sonuna, 1944–1945-ci illərə keç.'],
    ],
    correct:0,
  },
  {
    id:'partition-recommendation',
    title:['29 Kasım 1947 · BM taksim tavsiyesi','29 November 1947 · UN partition recommendation','29 בנובמבר 1947 · המלצת האו״ם על חלוקה','29 noyabr 1947 · BMT-nin bölünmə tövsiyəsi'],
    summary:['BM Genel Kurulu 181 (II) kararıyla Filistin için taksim ve ekonomik birlik planının kabul edilip uygulanmasını tavsiye etti. Önerilen planda Arap ve Yahudi devletleri ile Kudüs için ayrı bir yönetim vardı.','In Resolution 181 (II), the UN General Assembly recommended adopting a plan of partition with economic union for Palestine. The proposal envisaged Arab and Jewish states and a distinct regime for Jerusalem.','בהחלטה 181 (II) המליצה עצרת האו״ם על אימוץ תוכנית חלוקה ואיחוד כלכלי. התוכנית הציעה מדינה ערבית ומדינה יהודית ומשטר נפרד לירושלים.','BMT Baş Assambleyası 181 (II) saylı qətnamə ilə Fələstin üçün bölünmə və iqtisadi birlik planının qəbulunu və icrasını tövsiyə etdi. Planda ərəb və yəhudi dövlətləri, Qüds üçün isə ayrıca idarəçilik nəzərdə tutulurdu.'],
    steps:[
      ['1947. Kararın başındaki “tavsiye eder” ifadesi, Genel Kurul’un üye devletlere sunduğu öneriyi tanımlar.','1947. The resolution’s opening recommendation sets out what the General Assembly asked member states to adopt.','1947. לשון ההמלצה בתחילת ההחלטה מגדירה מה ביקשה העצרת מהמדינות החברות לאמץ.','1947. Qətnamənin əvvəlindəki “tövsiyə edir” ifadəsi Baş Assambleyanın üzv dövlətlərə təqdim etdiyi təklifi göstərir.'],
      ['1948–1949. Savaş ve ateşkeslerle oluşan fiilî denetim alanlarını ayrı kayıtlar ve haritalar gösterir.','1948–1949. Separate records and maps show how actual control changed through war and armistice agreements.','1948–1949. מסמכים ומפות אחרים מראים כיצד השתנתה השליטה בפועל במהלך המלחמה ובהסכמי שביתת הנשק.','1948–1949. Müharibə və atəşkəs razılaşmalarından sonra faktiki nəzarəti ayrı qeydlər və xəritələr göstərir.'],
    ],
    sources:[
      {title:'United Nations · General Assembly Resolution 181 (II)',url:'https://www.un.org/unispal/document/auto-insert-185393/'},
      {title:'United Nations · Israel–Jordan General Armistice Agreement, 3 April 1949',url:'https://www.un.org/unispal/document/auto-insert-189953/'},
    ],
    prompt:['Arşivde 181 (II) için hangi başlık uygun?','What is the appropriate archive label for Resolution 181 (II)?','איזו תווית ארכיונית מתאימה להחלטה 181 (II)?','181 (II) üçün hansı arxiv yazısı uyğundur?'],
    options:[
      ['1949’da fiilen denetlenen bölgelerin kaydı.','A record of territories actually controlled in 1949.','תיעוד של השטחים שנשלטו בפועל ב־1949.','1949-cu ildə faktiki nəzarətdə olan ərazilərin qeydi.'],
      ['1947’de tavsiye edilen yönetim planı.','A plan of government recommended in 1947.','תוכנית ממשל שהומלצה ב־1947.','1947-ci ildə tövsiyə edilmiş idarəçilik planı.'],
    ],
    feedback:[
      ['Savaş sonrasındaki denetim için ateşkes metinlerine ve o dönemin haritalarına bak.','For postwar control, consult armistice documents and period maps.','לשליטה אחרי המלחמה, בדקו את הסכמי שביתת הנשק ומפות התקופה.','Müharibədən sonrakı nəzarət üçün atəşkəs sənədlərinə və dövrün xəritələrinə bax.'],
      ['Evet. Belgenin tarihi ve öneri bildiren fiili, planın hukuki türünü gösterir.','Yes. The date and the verb of recommendation identify the kind of document.','כן. התאריך ולשון ההמלצה עוזרים לזהות את סוג המסמך.','Bəli. Tarix və tövsiyəni bildirən feil sənədin növünü göstərir.'],
    ],
    correct:1,
  },
  {
    id:'haifa-flight-return',
    title:['Nisan–Haziran 1948 · Hayfa','April–June 1948 · Haifa','אפריל–יוני 1948 · חיפה','aprel–iyun 1948 · Hayfa'],
    summary:['Haganah Hayfa’yı ele geçirirken Filistinli Arap sivillerin bir bölümü çatışmalar sırasında limana doğru kaçtı. Sonraki belgeler, kente ya da mahallelere dönüşte uygulanan kısıtlamaları kaydeder.','As the Haganah took Haifa, some Palestinian Arab civilians fled toward the port during the fighting. Later documents report restrictions on return to the city or to particular neighborhoods.','בעת כיבוש חיפה בידי ההגנה, חלק מהאזרחים הערבים הפלסטינים נמלטו בזמן הלחימה לכיוון הנמל. מסמכים מאוחרים מדווחים על הגבלות חזרה לעיר או לשכונות מסוימות.','Haqana Hayfanı ələ keçirəndə fələstinli ərəb dinc sakinlərin bir qismi döyüş zamanı limana doğru qaçdı. Sonrakı sənədlər şəhərə və ya bəzi məhəllələrə qayıdışın məhdudlaşdırıldığını göstərir.'],
    steps:[
      ['1 Mayıs. David Ben-Gurion’un günlüğü, 22 Nisan’daki çatışma sırasında limana kaçışı kaydeder. Vadi Nisnas ve Vadi Salib’in bazı kesimlerine dönüşe izin verildiğini, Eski Şehir’e dönüşün yasaklandığını aktarır.','1 May. David Ben-Gurion’s diary describes flight toward the port during the 22 April fighting. It reports that return was allowed in designated parts of Wadi Nisnas and Wadi Salib and barred in the Old City.','1 במאי. יומן דוד בן־גוריון מתאר מנוסה לנמל בלחימה ב־22 באפריל. הוא מדווח על היתר לחזור לחלקים מוגדרים של ואדי ניסנאס וואדי סאליב ועל איסור לחזור לעיר העתיקה.','1 may. David Ben-Qurionun gündəliyi 22 aprel döyüşü zamanı limana qaçışı təsvir edir. Vadi Nisnas və Vadi Salibin müəyyən hissələrinə qayıdışa icazə verildiyini, İçəri Şəhərə qayıdışın isə qadağan edildiyini bildirir.'],
      ['23 Haziran. ABD’nin Hayfa konsolosu, Victor Khayat’ın dönüş izinleri hakkında anlattıklarını telgrafla iletti. Bu, izin uygulamasına dair çağdaş bir diplomatik kayıttır.','23 June. The US consul in Haifa relayed Victor Khayat’s account of return permissions in a telegram. It is contemporary diplomatic reporting about how permissions operated.','23 ביוני. הקונסול האמריקאי בחיפה העביר במברק את דברי ויקטור ח׳יאט על היתרי חזרה. זהו דיווח דיפלומטי מזמן האירועים על נוהלי ההיתר.','23 iyun. ABŞ-ın Hayfadakı konsulu Viktor Xəyatın qayıdış icazələri barədə dediklərini teleqramla çatdırdı. Bu, icazələrin necə tətbiq edilməsi barədə dövrün diplomatik məlumatıdır.'],
    ],
    sources:[
      {title:'Ben-Gurion Archive · Haifa diary, 1 May 1948',url:'https://bengurionarchive.bgu.ac.il/en/node/15267'},
      {title:'US Department of State · Haifa consular telegram, 23 June 1948',url:'https://history.state.gov/historicaldocuments/frus1948v05p2/d402'},
    ],
    prompt:['Bir ailenin önce kaçması, daha sonra neyi açık bırakır?','If a family first fled, what question remains open?','אם משפחה נמלטה תחילה, איזו שאלה נשארת פתוחה?','Ailə əvvəlcə qaçıbsa, hansı sual açıq qalır?'],
    options:[
      ['Geri dönüş için izin alıp alamadığı.','Whether the family was later allowed to return.','האם המשפחה קיבלה לאחר מכן רשות לחזור.','Ailənin sonradan qayıtmağa icazə alıb-almaması.'],
      ['Kaçış ve dönüş koşullarının her aile için aynı olup olmadığı zaten belirlenmiş olur.','The conditions for flight and return have already been settled for every family.','כבר אפשר לקבוע את תנאי הבריחה והחזרה של כל המשפחות.','Bütün ailələrin qaçış və qayıdış şəraiti artıq müəyyən olunub.'],
    ],
    feedback:[
      ['Evet. Ayrılış zamanı ile geri dönme şartları iki ayrı araştırma sorusu oluşturur.','Yes. Departure and the conditions for return are separate questions.','כן. העזיבה ותנאי החזרה הן שאלות נפרדות למחקר.','Bəli. Getmək və qayıdış şərtləri ayrı araşdırma suallarıdır.'],
      ['Günlük ve telgrafı karşılaştır. Her biri belirli bir tarihte görülen uygulamaları kaydeder.','Compare the diary and telegram. Each reports conditions observed at a particular time.','השוו בין היומן למברק. כל אחד מתעד תנאים שנצפו בזמן מסוים.','Gündəliklə teleqramı müqayisə et. Hər biri müəyyən vaxtda müşahidə edilən şəraiti göstərir.'],
    ],
    correct:0,
  },
  {
    id:'lydda-ramle-expulsion',
    title:['Temmuz 1948 · Lydda ve Ramle','July 1948 · Lydda and Ramle','יולי 1948 · לוד ורמלה','iyul 1948 · Lidda və Rəmlə'],
    summary:['İsrail birlikleri Dani Harekâtı sırasında Lydda ve Ramle’yi ele geçirdi. Filistinli siviller zorla çıkarıldı. Lydda’nın boşaltılmasına ilişkin askerî emri araştırmalar ayrı bir belge olarak ele alır.','Israeli forces captured Lydda and Ramle in Operation Dani. Palestinian civilians were forcibly expelled. Historical studies examine the military order for Lydda as a specific document.','כוחות ישראליים כבשו את לוד ורמלה במבצע דני. אזרחים פלסטינים גורשו בכוח. מחקרים היסטוריים בוחנים את פקודת הגירוש בלוד כמסמך מסוים.','İsrail qüvvələri Dani əməliyyatı zamanı Lidda və Rəmləni ələ keçirdi. Fələstinli dinc sakinlər zorla çıxarıldı. Tarixçilər Liddanın boşaldılmasına dair hərbi əmri ayrıca sənəd kimi araşdırırlar.'],
    steps:[
      ['9–13 Temmuz. PalQuest, harekâtı ve Lydda sakinlerinin çıkarılmasını tarihlendirir. Kayıt, 12 Temmuz’da Yitshak Rabin’in imzaladığı emri aktarır.','9–13 July. PalQuest dates the fighting and removal of Lydda’s residents. It describes the order signed by Yitzhak Rabin on 12 July.','9–13 ביולי. PalQuest מתארך את הלחימה ואת גירוש תושבי לוד. הרשומה מתארת את הפקודה שעליה חתם יצחק רבין ב־12 ביולי.','9–13 iyul. PalQuest döyüşü və Lidda sakinlərinin çıxarılmasını tarixləndirir. Qeyd İshaq Rabinin 12 iyulda imzaladığı əmri təsvir edir.'],
      ['Tarihçi Benny Morris, aynı harekâtta Lydda ve Ramle’deki çıkarılmaları birlikte inceler. Olayı araştırırken askerî emir ile uygulamadaki eylemleri ayrı kaydet.','Historian Benny Morris examines the expulsions from Lydda and Ramle within the same operation. Record the military order and the actions that carried it out separately.','ההיסטוריון בני מוריס בוחן יחד את הגירושים מלוד ומרמלה במבצע. בתיעוד האירוע, הפרידו בין הפקודה הצבאית לפעולות שביצעו אותה.','Tarixçi Benni Morris eyni əməliyyatda Lidda və Rəmlədən zorla çıxarılmaları birlikdə araşdırır. Hadisəni qeydə alarkən hərbi əmri və onun icra olunduğu hərəkətləri ayır.'],
    ],
    sources:[
      {title:'PalQuest · Lydda, 9–13 July 1948',url:'https://www.palquest.org/en/highlight/24073/lydda-9-13-july-1948'},
      {title:'Middle East Journal · Benny Morris, Operation Dani and the Palestinian Exodus',url:'https://www.jstor.org/stable/4327250'},
    ],
    prompt:['Lydda dosyasında doğrudan zorla çıkarılmayı hangi kanıt destekler?','What evidence supports direct expulsion in the Lydda case?','איזו ראיה תומכת בגירוש ישיר במקרה של לוד?','Lidda hadisəsində birbaşa zorla çıxarılmanı hansı dəlil dəstəkləyir?'],
    options:[
      ['Bir kentin boşaldığını gösteren sonradan çizilmiş nüfus haritası.','A later population map showing that the town emptied.','מפת אוכלוסייה מאוחרת המראה שהעיר התרוקנה.','Şəhərin boşaldığını göstərən sonradan hazırlanmış əhali xəritəsi.'],
      ['Adı ve tarihi belirli askerî emir ve uygulamanın kayıtları.','A dated military order and evidence of its implementation.','פקודה צבאית מתוארכת ותיעוד הביצוע שלה.','Tarixi məlum hərbi əmr və onun icrasını göstərən qeydlər.'],
    ],
    feedback:[
      ['Nüfus haritası sonucu gösterir. Sonuca yol açan eylemi belirlemek için emre ve uygulama kayıtlarına bak.','A population map shows the outcome. The order and its implementation help identify the action that produced it.','מפת אוכלוסייה מראה תוצאה. הפקודה ותיעוד הביצוע עוזרים לזהות מה הביא אליה.','Əhali xəritəsi nəticəni göstərir. Səbəb olan hərəkəti müəyyən etmək üçün əmrə və icra qeydlərinə bax.'],
      ['Evet. Emir ve uygulama kayıtları bu yerin, bu tarihteki zorla çıkarılmasını ayırt eder.','Yes. The order and evidence of its execution identify a forced removal at this place and time.','כן. הפקודה ותיעוד הביצוע מזהים גירוש בכוח במקום ובזמן האלה.','Bəli. Əmr və icra qeydləri bu yerdə və bu vaxtda zorla çıxarılmanı müəyyən edir.'],
    ],
    correct:1,
  },
  {
    id:'iraq-sawdai-departure',
    title:['1950–1951 · Irak Yahudilerinin ayrılışları','1950–1951 · Iraqi Jewish departures','1950–1951 · יציאת יהודי עיראק','1950–1951 · İraq yəhudilərinin gedişi'],
    summary:['1950’deki Irak yasası, ülkeyi terk eden Yahudilerin vatandaşlıktan çıkmasına izin verdi. Sonraki yasa bu kişilerin varlıklarını sınırladı. Bu koşullarda aileler ve aile üyeleri farklı kararlar aldı.','Iraq’s 1950 law let Jews leaving the country renounce citizenship. A later law placed restrictions on their assets. Families and family members made different decisions under these conditions.','חוק עיראקי מ־1950 אפשר ליהודים שעזבו לוותר על אזרחותם. חוק מאוחר יותר הגביל את נכסיהם. משפחות ובני משפחה קיבלו החלטות שונות בתנאים האלה.','İraqın 1950-ci il qanunu ölkədən gedən yəhudilərə vətəndaşlıqdan çıxmağa imkan verdi. Sonrakı qanun onların əmlakına məhdudiyyət qoydu. Bu şəraitdə ailələr və ailə üzvləri müxtəlif qərarlar verdilər.'],
    steps:[
      ['1950–1951. Bağdat Yahudi cemaati dosyasında hava taşımacılığına ilişkin teklif, vatandaşlık duyuruları ve polis müdahalesine dair şikâyetler bulunur.','1950–1951. A Baghdadi Jewish community file contains a proposal for air travel, citizenship notices and complaints about police interference.','1950–1951. תיק של הקהילה היהודית בבגדאד כולל הצעה להסעה אווירית, הודעות אזרחות ותלונות על התערבות המשטרה.','1950–1951. Bağdad yəhudi icmasının sənədlərində hava nəqliyyatı təklifi, vətəndaşlıq elanları və polisin müdaxiləsi barədə şikayətlər var.'],
      ['1951. Sinemacılıkla uğraşan Sawda’i ailesinde Maurice İsrail’e gitti. Üç kardeş Ezra, Meir ve Hayyawi Irak’ta kaldı. Araştırma aynı ailenin farklı yollarını izler.','1951. Maurice Sawda’i left for Israel. Ezra, Me’ir and Hayyawi, three brothers in the family’s cinema business, stayed in Iraq. The study traces divergent paths within one family.','1951. מוריס ממשפחת סודאי, שעסקה בקולנוע, יצא לישראל. שלושת האחים עזרא, מאיר וחיאווי נשארו בעיראק. המחקר עוקב אחר מסלולים שונים במשפחה אחת.','1951. Kino işi ilə məşğul olan Savdai ailəsindən Moris İsrailə getdi. Üç qardaş Ezra, Meir və Həyyavi İraqda qaldı. Araşdırma eyni ailədə müxtəlif yolları izləyir.'],
    ],
    sources:[
      {title:'Iraqi Jewish Archive · IJA 3699, travel and citizenship',url:'https://ijarchive.org/s/iraqi-jewish-archive/item/10158'},
      {title:'Iraqi Jewish Archive · Iraqi citizenship laws and court cases',url:'https://ijarchive.org/s/iraqi-jewish-archive/item/16225'},
      {title:'International Journal of Middle East Studies · A Tale of Three Brothers',url:'https://www.cambridge.org/core/journals/international-journal-of-middle-east-studies/article/tale-of-three-brothers-ezra-meir-and-hayyawi-sawdai-and-the-history-of-an-iraqi-jewish-cinema-business/9FE4BF4CFBB04C314CFB0AC4DC0709B9'},
    ],
    prompt:['Sawda’i ailesinin hikâyesini hangi sergi etiketi karşılar?','Which exhibit label fits the Sawda’i family’s story?','איזו תווית תצוגה מתאימה לסיפורה של משפחת סודאי?','Savdai ailəsinin hekayəsinə hansı sərgi yazısı uyğundur?'],
    options:[
      ['Aynı aile içinde kalış ve ayrılış: bir araştırmanın izlediği farklı yollar.','Staying and leaving within one family: different paths traced in a study.','הישארות ויציאה באותה משפחה: מסלולים שונים שמחקר אחד מתעד.','Eyni ailədə qalmaq və getmək: araşdırmanın göstərdiyi müxtəlif yollar.'],
      ['Bütün aile üyelerinin 1951’de aynı uçakla çıkışı.','The whole family left on one flight in 1951.','כל בני המשפחה יצאו באותה טיסה ב־1951.','Ailənin bütün üzvləri 1951-ci ildə eyni təyyarə ilə getdilər.'],
    ],
    feedback:[
      ['Evet. Genel yasa ile bireylerin farklı yollarını birlikte izledin.','Yes. You followed the general laws and the different paths individual people took.','כן. עקבתם אחר החוקים הכלליים ואחר המסלולים השונים של בני המשפחה.','Bəli. Ümumi qanunları və insanların fərqli yollarını birlikdə izlədin.'],
      ['Araştırmada Maurice’in ve üç kardeşin izlediği yolları ayrı ayrı bul.','Find Maurice’s path and the three brothers’ paths separately in the study.','מצאו במחקר בנפרד את דרכו של מוריס ואת דרכם של שלושת האחים.','Araşdırmada Morisin və üç qardaşın yollarını ayrı-ayrı tap.'],
    ],
    correct:0,
  },
];
