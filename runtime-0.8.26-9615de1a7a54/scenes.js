const scene = (id, name, options) => ({id,name,options});

export const models = [
  scene(0, ['Aynı yer, iki görünüm','One place, two views','אותו מקום, שני מבטים','Eyni yer, iki görünüş'], [
    ['plaza',['Bugünkü meydan','Present-day plaza','הרחבה כיום','Bugünkü meydan'],
      ['Duvarın önünde geniş bir açık alan var.','A broad open area stands in front of the wall.','לפני הכותל יש רחבה פתוחה.','Divarın qarşısında geniş açıq sahə var.']],
    ['quarter',['1967 öncesi sokak','Street before 1967','רחוב לפני 1967','1967-dən əvvəlki küçə'],
      ['Bu temsili kesit, meydandan önce duvara komşu konutları gösterir.','This schematic view shows homes near the wall before the plaza.','תרשים זה מציג בתי מגורים ליד הכותל לפני הקמת הרחבה.','Bu şərti görünüş meydandan əvvəl divara yaxın evləri göstərir.']],
  ]),
  scene(1, ["Seder sofrasındaki üç nesne","Three objects at a seder table","שלושה חפצים בשולחן הסדר","Seder süfrəsində üç əşya"], [
    ["matzah",["Matsa ve acı otlar","Matzah and bitter herbs","מצה ומרור","Matsa və acı otlar"],
      ["Kuşaklar aynı masada matsa ve acı otları inceler. Mişna Pesahim 10, bu yiyecekleri anlatıyla ilişkilendirir. Çıkış’ın tarihini araştırmak için ayrı tarihsel kaynaklara bakılır.","Generations gather around matzah and bitter herbs. Mishnah Pesachim 10 connects these foods with the story. Dating the Exodus calls for separate historical evidence.","דורות מתכנסים סביב מצה ומרור. משנה פסחים י׳ קושרת את המאכלים לסיפור. לשאלת תיארוך יציאת מצרים נדרשות ראיות היסטוריות נפרדות.","Nəsillər matsa və acı otlar olan süfrəyə toplaşır. Mişna Pesahim 10 bu yeməkləri rəvayətlə bağlayır. Çıxışın tarixini öyrənmək üçün ayrıca tarixi mənbələrə baxılır."],
      "https://www.sefaria.org/Mishnah_Pesachim.10.4-5"],
    ["questions",["Dört soru","Four questions","ארבע הקושיות","Dörd sual"],
      ["Mişna, çocuğun sormasını sağlayan soruları ve anlatı yoluyla yanıtlamayı tarif eder. Bu, kuşaklar arası öğretim pratiğidir; Mısır’daki bir olay tutanağı değildir.","The Mishnah describes prompting a child’s questions and answering through the telling. This is an intergenerational teaching practice, not a report written during an event in Egypt.","המשנה מתארת עידוד שאלות של ילד ומתן מענה באמצעות הסיפור. זהו נוהג לימודי בין־דורי, לא דיווח שנכתב בזמן אירוע במצרים.","Mişna uşağın suallar verməsini və rəvayətlə cavablandırılmasını təsvir edir. Bu, nəsillərarası öyrətmə üsuludur, Misirdə hadisə vaxtı yazılmış hesabat deyil."],
      "https://www.sefaria.org/Mishnah_Pesachim.10.4-5"],
    ["exodus",["Çıkış anlatısı","Exodus narrative","סיפור יציאת מצרים","Çıxış rəvayəti"],
      ["Çıkış 12, Mısır’dan ayrılışı ve Pesah’ı anlatır. Çıkış’ın tarihine dair kesinlik yok. Bu sofrada aile üyeleri kutsal anlatıyı bir sonraki kuşağa aktarır.","Exodus 12 describes leaving Egypt and Passover. The historical date of the Exodus is uncertain. At this table, the family passes the sacred story to the next generation.","שמות י״ב מספר על היציאה ממצרים ועל הפסח. זמנה ההיסטורי של היציאה אינו ודאי. סביב השולחן המשפחה מעבירה את הסיפור המקודש לדור הבא.","Çıxış 12 Misirdən ayrılışı və Pesahı təsvir edir. Hadisənin tarixi dəqiq bilinmir. Süfrə ətrafında ailə müqəddəs rəvayəti növbəti nəslə ötürür."],
      "https://www.sefaria.org/Exodus.12.1-20"],
  ]),
  scene(2, ['Birinci Krallar 6’ya göre şematik kesit','Schematic from I Kings 6','חתך סכמטי על פי מלכים א׳ ו׳','I Padşahlar 6 əsasında şərti kəsik'], [
    ['porch',['Giriş sundurması','Entrance porch','אולם הכניסה','Giriş eyvanı'],
      ['Metin, ana salonun önünde bir giriş sundurması tarif eder.','The text describes a porch in front of the main hall.','הטקסט מתאר אולם כניסה לפני האולם הראשי.','Mətn əsas zalın önündə giriş eyvanını təsvir edir.']],
    ['hall',['Ana salon','Main hall','ההיכל','Əsas zal'],
      ['Ana salon, giriş ile iç oda arasında yer alır.','The main hall lies between the entrance and the inner room.','ההיכל נמצא בין הכניסה לחדר הפנימי.','Əsas zal girişlə daxili otaq arasında yerləşir.']],
    ['sanctuary',['İç kutsal oda','Inner sanctuary','הדביר','Daxili müqəddəs otaq'],
      ['Metin, yapının en iç bölümünü ayrı bir oda olarak betimler.','The text describes a separate room in the innermost part of the building.','הטקסט מתאר חדר נפרד בחלקו הפנימי ביותר של המבנה.','Mətn tikilinin ən iç hissəsini ayrıca otaq kimi təsvir edir.']],
  ]),
  scene(3, ["Babil kayıt odası","Babylonian records room","חדר התעודות על בבל","Babil sənədləri otağı"], [
    ["chronicle-597",["BM 21946 kroniği","BM 21946 Chronicle","כרוניקה BM 21946","BM 21946 salnaməsi"],
      ["Babil Kroniği, MÖ 597’de “Yahuda kenti”nin alındığını ve kralın yakalandığını kaydeder. Kent genellikle Kudüs olarak tanımlanır; tablet adını açıkça vermez.","The Babylonian Chronicle records the capture of the “city of Judah” and its king in 597 BCE. The city is usually identified as Jerusalem, though the tablet does not name it explicitly.","הכרוניקה הבבלית מתעדת את כיבוש „עיר יהודה” ואת לכידת המלך ב-597 לפנה״ס. מקובל לזהות את העיר עם ירושלים, אך הלוח אינו מציין את שמה במפורש.","Babil salnaməsi e.ə. 597-də “Yəhuda şəhəri”nin alınmasını və padşahının əsir tutulmasını qeyd edir. Şəhər adətən Yerusəlim sayılır, lakin lövhədə adı açıq yazılmayıb."],
      "https://www.britishmuseum.org/collection/object/W_1896-0409-51"],
    ["destruction-587",["Kudüs ve Tapınak, 587/586","Jerusalem and the Temple, 587/586","ירושלים והמקדש, 587/586","Yerusəlim və Məbəd, 587/586"],
      ["II. Krallar 25, Babil’in daha sonraki saldırısında Kudüs ve Tapınak’ın yıkımını anlatır. Yaygın tarihleme MÖ 587/586’dır; bu, 597’deki ele geçirmeyle aynı sefer değildir.","II Kings 25 narrates Jerusalem’s and the Temple’s destruction in a later Babylonian campaign, commonly dated 587/586 BCE. It was not the same campaign as the capture in 597.","מלכים ב׳ כ״ה מספר על חורבן ירושלים והמקדש במסע בבלי מאוחר יותר, המתוארך בדרך כלל ל-587/586 לפנה״ס. אין זה אותו מסע של 597.","II Padşahlar 25 Yerusəlim və Məbədin daha sonrakı Babil yürüşündə dağıdılmasını danışır; bu hadisə adətən e.ə. 587/586-cı ilə aid edilir. Bu, 597-ci il yürüşü ilə eyni deyil."],
      "https://www.sefaria.org/II_Kings.25"],
    ["stayed-exiled",["Kalanlar ve sürülenler","Those who stayed and those deported","הנשארים והמוגלים","Qalanlar və sürgün edilənlər"],
      ["II. Krallar 25:12, Babil komutanının ülkede yoksul halkın bir bölümünü bıraktığını söyler; 25:11 sürülenleri anar. Bu, herkesin aynı yere gittiği anlamına gelmez.","II Kings 25:12 says the Babylonian commander left some of the poorest people in the land; 25:11 also describes deportees. The population did not all follow one path.","מלכים ב׳ כ״ה:י״ב אומר שמפקד בבל השאיר בארץ חלק מעניי העם; פסוק י״א מתאר גם גולים. לא כל האוכלוסייה עברה באותו מסלול.","II Padşahlar 25:12 Babil başçısının ölkədə yoxsul xalqın bir hissəsini saxladığını bildirir; 25:11 sürgün edilənlərdən də danışır. Hamı eyni yolu keçməyib."],
      "https://www.sefaria.org/II_Kings.25"],
  ]),
  scene(4, ["Kudüs ve Nil’deki ada","Jerusalem and an island in the Nile","ירושלים ואי בנהר הנילוס","Qüds və Nil çayındakı ada"], [
    ["jerusalem-temple",["Kudüs’te İkinci Tapınak","The Second Temple in Jerusalem","המקדש השני בירושלים","Yerusəlimdə İkinci Məbəd"],
      ["Ezra 6:15, Tapınağın Darius’un altıncı yılında tamamlandığını söyler; bu genellikle MÖ 516/515’e tarihlenir. Bu, Kudüs’teki tapınaktır.","Ezra 6:15 says the Temple was completed in Darius’s sixth year, commonly dated 516/515 BCE. This is the Temple in Jerusalem.","עזרא ו׳:ט״ו אומר שהמקדש הושלם בשנתו השישית של דריווש; בדרך כלל מתארכים זאת ל-516/515 לפנה״ס. זהו המקדש בירושלים.","Ezra 6:15 Məbədin Daranın altıncı ilində tamamlandığını bildirir; bu, adətən e.ə. 516/515-ci ilə aid edilir. Söhbət Yerusəlimdəki Məbəddən gedir."],
      "https://www.sefaria.org/Ezra.6.15"],
    ["elephantine",["Elephantine’de yerel Yaho Tapınağı","The local Yaho temple at Elephantine","מקדש יהו המקומי באלפנטינה","Elephantinedə yerli Yaho məbədi"],
      ["Elephantine, Mısır’daki Nil adasında yaşayan Yahudi cemaatinin Aramice belgelerini korudu. Cemaatin Yaho Tapınağı Kudüs’te değildi; kendi yerel ibadet merkeziydi.","Elephantine preserves Aramaic documents from a Jewish community on an island in the Nile in Egypt. Its Yaho temple was local, not the Jerusalem Temple.","באלפנטינה השתמרו מסמכים ארמיים של קהילה יהודית באי בנילוס שבמצרים. מקדש יהו שלה היה מקומי, ולא המקדש בירושלים.","Elephantinedə Misirdə, Nil adasında yaşayan yəhudi icmasının arami sənədləri qorunub. Onların Yaho məbədi Yerusəlimdə deyil, yerli ibadət məkanı idi."],
      "https://search.smb.museum/object/obj-823546"],
    ["petition-407",["MÖ 407 dilekçesi","The 407 BCE petition","העתירה משנת 407 לפנה״ס","E.ə. 407-ci il müraciəti"],
      ["Elephantine papirusu P.13495, MÖ 407’de cemaatin yıkılmış yerel tapınağını yeniden kurmak için izin istediğini kaydeder. Belge, Ezra’daki Kudüs anlatısından ayrı bir cemaati anlatır.","Elephantine papyrus P.13495 records a 407 BCE request to rebuild the community’s destroyed local temple. It concerns a separate community from Ezra’s account of Jerusalem.","פפירוס אלפנטינה P.13495 מתעד בקשה משנת 407 לפנה״ס לבנות מחדש את מקדש הקהילה המקומי שנהרס. הוא עוסק בקהילה נפרדת מסיפור ירושלים בעזרא.","Elephantine P.13495 papirusu e.ə. 407-də icmanın dağıdılmış yerli məbədini yenidən tikmək üçün icazə istədiyini qeyd edir. Bu icma Ezra-dakı Yerusəlim hekayəsindən ayrıdır."],
      "https://search.smb.museum/object/obj-823546"],
  ]),
  scene(6, ['Mimari kesit','Architectural section','חתך אדריכלי','Memarlıq kəsiyi'], [
    ['wall',['İstinat duvarı','Retaining wall','קיר תומך','İstinad divarı'],
      ['Yan yüz, dolgunun yerinde kalmasına yardım eder.','The side wall helps retain the fill.','הקיר הצדדי מסייע להחזיק את המילוי.','Yan divar dolğunu yerində saxlayır.']],
    ['platform',['Platform','Platform','מתחם מוגבה','Platforma'],
      ['Üstteki düz alanı takip et.','Follow the level surface at the top.','עקבו אחר המשטח המישורי למעלה.','Yuxarıdakı düz səthi izlə.']],
    ['temple',['Tapınak','Temple','בית המקדש','Məbəd'],
      ['Kutsal bina bu alanın üzerinde bulunuyordu.','The sacred building stood on this raised area.','המבנה הקדוש עמד על המשטח הזה.','Müqəddəs bina bu yüksəldilmiş sahədə yerləşirdi.']],
  ]),
  scene(7, ['Kumran’da kâtip masası','A scribe’s desk at Qumran','שולחן כתיבה בקומראן','Qumranda katib masası'], [
    ['scroll-isaiah',['Yeşaya nüshası · 1QIsaᵃ','Isaiah copy · 1QIsaᵃ','עותק ישעיהו · 1QIsaᵃ','Yeşaya nüsxəsi · 1QIsaᵃ'], [
      'Uzun tomarın sütunlarını aç. Büyük Yeşaya Tomarı, Yeşaya kitabının neredeyse tamamını korur. Bu bir kutsal metin nüshasıdır. Çizim tomarın biçimini temsil eder.',
      'Unroll the long scroll. The Great Isaiah Scroll preserves nearly the whole book of Isaiah. It is a copy of scripture. The drawing illustrates the format.',
      'פרשו את המגילה הארוכה. מגילת ישעיהו הגדולה משמרת כמעט את כל ספר ישעיהו. זהו עותק של טקסט מקראי. האיור ממחיש את צורת המגילה.',
      'Uzun tumarı aç. Böyük Yeşaya tumarı Yeşaya kitabının demək olar hamısını qoruyur. Bu, müqəddəs mətnin nüsxəsidir. Şəkil tumarın formasını təsvir edir.',
    ],'https://dss.collections.imj.org.il/isaiah'],
    ['scroll-rule',['Topluluk Kuralı · 1QS','Community Rule · 1QS','סרך היחד · 1QS','İcma qaydası · 1QS'], [
      'Topluluğa kabul ve birlikte yaşama kurallarını gösteren tomarı aç. Metin, Yahad denen grubun nasıl düzenlenmesi gerektiğini anlatır. Yahad ile Essenilerin ilişkisi araştırma konusudur.',
      'Open the scroll containing rules about joining and living together. It lays out how a group called the Yahad should be organized. The relationship between the Yahad and the Essenes remains a research question.',
      'פתחו את המגילה ובה כללים לקבלה לקהילה ולחיים במשותף. היא מתארת איך קבוצה המכונה „יחד” אמורה להתנהל. הקשר בין היחד לאיסיים עודנו שאלה מחקרית.',
      'İcmaya qoşulma və birgə yaşayış qaydalarını göstərən tumarı aç. Bu mətn Yahad adlı qrupun idarə qaydalarını təsvir edir. Yahad ilə essenilər arasındakı əlaqə araşdırma mövzusudur.',
    ],'https://dss.collections.imj.org.il/community'],
    ['scroll-pesher',['Habakkuk Yorumu · 1QpHab','Habakkuk Commentary · 1QpHab','פשר חבקוק · 1QpHab','Habakkuk şərhi · 1QpHab'], [
      'İki renge bak. Önce Habakkuk’tan bir bölüm alıntılanır, ardından pesher denen yorum gelir. Yorum, eski sözleri yorumcunun yaşadığı çağa bağlar. Renkler okuma sırasını göstermek için eklendi.',
      'Look at the two colors. A passage from Habakkuk comes first, then its interpretation, called pesher. The interpretation connects the older words to the interpreter’s own time. The colors mark the reading sequence in this illustration.',
      'שימו לב לשני הצבעים. תחילה מובא קטע מחבקוק ואחריו פירוש הנקרא פשר. הפשר מחיל מילים קדומות על זמנו של המפרש. הצבעים מסמנים באיור את סדר הקריאה.',
      'İki rəngə bax. Əvvəl Habakkukdan bir parça gətirilir, sonra pesher adlı şərh gəlir. Şərh qədim sözləri şərhçinin öz dövrü ilə əlaqələndirir. Rənglər şəkildə oxu ardıcıllığını göstərir.',
    ],'https://dss.collections.imj.org.il/habakkuk'],
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
  scene(12, ['Celile’de mağara ve ziyaret','Cave and pilgrimage in Galilee','מערה ועלייה לרגל בגליל','Cəlilədə mağara və ziyarət'], [
    ['cave-story',['Şabat 33b anlatısı','The story in Shabbat 33b','הסיפור בשבת לג ע״ב','Şabbat 33b rəvayəti'], [
      'Anlatıda Şimon bar Yohai ve oğlu Elazar mağaraya sığınır. Bir keçiboynuzu ağacı ve su onları besler. İlk çıkıştan sonra geri dönerler. Talmud bu mağaranın adresini vermez. Çizim anlatıyı canlandırır.',
      'In the story, Shimon bar Yohai and his son Elazar shelter in a cave. A carob tree and a spring sustain them. They return after their first departure. The Talmud gives no address for the cave. This drawing illustrates the story.',
      'בסיפור רבי שמעון בר יוחאי ובנו אלעזר מסתתרים במערה. עץ חרוב ומעיין מקיימים אותם. אחרי היציאה הראשונה הם חוזרים למערה. בתלמוד אין כתובת למערה. האיור ממחיש את הסיפור.',
      'Rəvayətdə Şimon bar Yohay və oğlu Elazar mağaraya sığınırlar. Keçibuynuzu ağacı və bulaq onların yaşamasına kömək edir. İlk çıxışdan sonra geri qayıdırlar. Talmud mağaranın ünvanını göstərmir. Şəkil rəvayəti canlandırır.',
    ],'https://www.sefaria.org/Shabbat.33b'],
    ['cave-first-exit',['İlk çıkış · Tarla','First exit · The field','היציאה הראשונה · השדה','İlk çıxış · Tarla'], [
      'Şabat 33b anlatısında Şimon ve Elazar, on iki yıl sonra mağaradan çıkar. Tarlayı süren ve eken insanları görürler. Şimon geçim için çalışmayı Tora öğrenimiyle karşılaştırıp eleştirir. Anlatıda bir ses ikisini mağaraya geri çağırır.',
      'In the story in Shabbat 33b, Shimon and Elazar leave the cave after twelve years. They see people plowing and sowing. Shimon criticizes working for a living in comparison with studying Torah. A voice calls them back to the cave.',
      'בסיפור בשבת לג ע״ב יוצאים שמעון ואלעזר מן המערה אחרי שתים־עשרה שנים. הם רואים אנשים חורשים וזורעים. שמעון מבקר את העיסוק בפרנסה בהשוואה ללימוד תורה. בת קול קוראת לשניהם לשוב למערה.',
      'Şabbat 33b rəvayətində Şimon və Elazar on iki ildən sonra mağaradan çıxırlar. Torpağı şumlayan və toxum səpən insanları görürlər. Şimon dolanışıq üçün çalışmağı Tövrat öyrənməklə müqayisə edib tənqid edir. Rəvayətdə bir səs hər ikisini mağaraya geri çağırır.',
    ],'https://www.sefaria.org/Shabbat.33b.5-8'],
    ['cave-second-exit',['İkinci çıkış · Şabat arifesi','Second exit · Shabbat eve','היציאה השנייה · ערב שבת','İkinci çıxış · Şabbat ərəfəsi'], [
      'Anlatıda on iki ay daha geçer. İkinci çıkışta Elazar zarar verirken Şimon onarır. Şabat arifesinde yaşlı bir adamın iki mersin demeti taşıdığını görürler. Adam demetleri Çıkış 20:8’deki “hatırla” ve Tesniye 5:12’deki “gözet” sözleriyle açıklar. Bu hazırlığı görünce ikisi de yatışır.',
      'Twelve more months pass in the story. On the second exit, Shimon heals what Elazar harms. On Shabbat eve they meet an older man carrying two myrtle bundles. He links them to “remember” in Exodus 20:8 and “observe” in Deuteronomy 5:12. Seeing his preparations puts them both at ease.',
      'בסיפור עוברים עוד שנים־עשר חודשים. ביציאה השנייה שמעון מרפא את מה שאלעזר פוגע בו. בערב שבת הם פוגשים זקן שנושא שני אגדי הדסים. הוא קושר אותם ל״זכור״ בשמות כ׳, ח׳ ול״שמור״ בדברים ה׳, י״ב. כשהם רואים את הכנותיו, דעתם נרגעת.',
      'Rəvayətdə daha on iki ay keçir. İkinci çıxışda Şimon Elazarın zərər vurduğunu sağaldır. Şabbat ərəfəsində iki mərsin dəstəsi daşıyan yaşlı bir adamla rastlaşırlar. Adam bir dəstəni Çıxış 20:8-dəki “xatırla”, o birini Qanunun Təkrarı 5:12-dəki “riayət et” sözü ilə bağlayır. Hazırlığı görmək hər ikisini sakitləşdirir.',
    ],'https://www.sefaria.org/Shabbat.33b.5-8'],
    ['meron-visit',['Meron’da Lag BaOmer','Lag BaOmer at Meron','ל״ג בעומר במירון','Meronda Laq BaOmer'], [
      'Meron, Peqi’in’den ayrı bir yerdir. Ziyaretçiler burada Şimon bar Yohai’ye atfedilen mezarı Lag BaOmer’de ziyaret eder. Bu anmanın yazılı tanıklıkları arasında 16. yüzyıl Safed çevresi yer alır.',
      'Meron is a separate site from Peqi’in. Pilgrims visit the tomb traditionally associated with Shimon bar Yohai on Lag BaOmer. Written evidence for the observance includes records from the sixteenth-century Safed circle.',
      'מירון הוא אתר נפרד מפקיעין. בל״ג בעומר עולים לקבר המיוחס במסורת לרבי שמעון בר יוחאי. בין העדויות הכתובות למנהג יש תיעוד מחוגי צפת במאה השש־עשרה.',
      'Meron Peqiindən ayrı yerdir. Laq BaOmerdə zəvvarlar ənənədə Şimon bar Yohaya aid edilən qəbri ziyarət edirlər. Ayin haqqında yazılı qeydlər arasında XVI əsr Safed çevrəsinə aid sənədlər var.',
    ],'https://schechter.edu/a-historical-treatise-on-the-lag-bomer-celebration-at-mt-meron/'],
    ['peqi-in-survey',['Peqi’in mağara araştırması','Peqi’in cave survey','מחקר המערה בפקיעין','Peqiin mağara araşdırması'], [
      'Peqi’in’de yerel gelenek bir mağarayı Şimon’la ilişkilendirir. 2025 araştırması bazı çanak çömlek parçalarının antik dönemden kalmış olabileceğini bildirir. Bu buluntular mağaranın belirli bir kişi tarafından kullanıldığını göstermiyor. Kesit temsilidir.',
      'A local tradition associates a cave at Peqi’in with Shimon. A 2025 survey reports potsherds that may date to antiquity. Those finds cannot identify an individual who used the cave. The section is schematic.',
      'מסורת מקומית קושרת מערה בפקיעין לרבי שמעון. מחקר מ־2025 מדווח על חרסים שייתכן שהם מן העת העתיקה. הממצאים אינם מזהים אדם מסוים שהשתמש במערה. החתך סכמטי.',
      'Peqiində yerli ənənə bir mağaranı Şimonla bağlayır. 2025-ci il araşdırması bəzi saxsı qırıqlarının qədim dövrə aid ola biləcəyini bildirir. Tapıntılar mağaradan istifadə etmiş konkret şəxsi müəyyənləşdirmir. Kəsik şərtidir.',
    ],'https://doi.org/10.26351/IHD/14-1/4'],
  ]),
  scene(13, ['Bugünkü kutsal alandan üç yapı','Three structures at the site today','שלושה מבנים באתר כיום','Bugünkü müqəddəs məkanda üç tikili'], [
    ['dome-rock',['Kubbetü’s-Sahra','Dome of the Rock','כיפת הסלע','Qübbət əs-Səxra'],
      ['Sekizgen yapı ve kubbe, platformun üzerinde durur. Mozaik yazıt yapının Emevi dönemi tarihine tanıklık eder.','The octagonal building and its dome stand on the platform. A mosaic inscription attests to its Umayyad date.','המבנה המתומן והכיפה עומדים על המתחם. כתובת פסיפס מעידה על זמנו האומיי.','Səkkizguşəli tikili və qübbə platformanın üstündədir. Mozaika kitabəsi onun Əməvilər dövrünə aid olduğunu göstərir.']],
    ['qibli',['Güneydeki Kıble Camii','The Qibli Mosque to the south','מסגד אל־קיבלי בדרום','Cənubdakı Qiblə məscidi'],
      ['Güneydeki cemaat namazı yapısıdır. Mescid-i Aksa adı, kullanıma göre bu yapıyı ya da daha geniş kutsal alanı ifade edebilir.','This is the congregational prayer hall to the south. In different usage, al-Aqsa can name this building or the wider sanctuary.','זהו אולם התפילה בדרום. השם אל־אקצא יכול לציין את המבנה או את המתחם המקודש הרחב יותר.','Bu, cənubdakı camaat namazı binasıdır. Əl-Əqsa adı işlənmə yerindən asılı olaraq binanı və ya daha geniş müqəddəs ərazini bildirə bilər.']],
    ['western-wall',['Batı Duvarı','Western Wall','הכותל המערבי','Qərb Divarı'],
      ['Platformun batı kenarındaki istinat yapısının görünen bölümüdür. Meydana bakan alt seviyededir.','This visible section of the platform’s western retaining wall faces the plaza at a lower level.','חלק זה של קיר התמך המערבי פונה לרחבה במפלס נמוך יותר.','Platformanın qərb istinad divarının görünən bu hissəsi aşağı səviyyədə meydanla üzbəüzdür.']],
  ]),
  scene(14, ['Mağribi Mahallesi’nde üç kayıt','Three records of the Maghrebi Quarter','שלוש רשומות על השכונה המוגרבית','Məğribi məhəlləsi haqqında üç sənəd'], [
    ['quarter-endowment',['1320 · Vakıf','1320 · Endowment','1320 · הקדש','1320 · Vəqf'], [
      'Ebu Medyen Vakfı’nın 1320 tarihli kaydı, Ayn Kerim arazisinin gelirinin Kudüs’teki zaviye ve Mağribilere ayrıldığını bildirir. Bir vakıf, gelir veya mülkü belirli bir amaç için ayırır. Çizimde iki ayrı yer arasındaki gelir ilişkisini izle.',
      'The 1320 Abu Madyan record assigns revenue from ‘Ayn Karim land to a hospice and to Maghrebis in Jerusalem. A waqf dedicates property or revenue to a stated purpose. Follow the relationship between two separate places.',
      'רשומת וקף אבו מדין מ־1320 מקצה הכנסות מאדמות עין כרם לזאוויה ולמוגרבים בירושלים. וקף מקדיש רכוש או הכנסות למטרה מוגדרת. עקבו בתרשים אחר הקשר בין שני המקומות.',
      'Əbu Mədyən vəqfinin 1320-ci il qeydi Ayn Kərim torpağının gəlirini Qüdsdəki zaviyəyə və məğribilərə ayırır. Vəqf əmlakı və ya gəliri müəyyən məqsədə həsr edir. Sxemdə iki yer arasındakı əlaqəni izlə.',
    ],'https://archives.openjerusalem.org/index.php/turkish-translation-of-the-arabic-waqfiyya-of-the-ebu-medyen-suayb-al-maghribi-2-november-1320-gregorian-calendar-29-ramazan-n-720-ottoman-calendar'],
    ['quarter-home',['1613 · Bahçeli ev','1613 · House and garden','1613 · בית וגינה','1613 · Bağçalı ev'], [
      'Bir Kudüs mahkeme kaydı, 1613’te Ebu Medyen Vakfı’na komşu bir bahçeli evi kaydeder. Bugünkü adresi eldeki metinden çıkaramıyoruz. Çizim, bir evin ve komşu vakıf mülkünün ayrı ayrı tarif edilebildiğini gösterir.',
      'A Jerusalem court record from 1613 lists a house with a garden beside the Abu Madyan endowment. The record leaves its modern address uncertain. The drawing distinguishes a home from the neighboring endowment property.',
      'רשומת בית משפט בירושלים מ־1613 מציינת בית עם גינה ליד וקף אבו מדין. כתובתו כיום אינה ידועה מן הרשומה. האיור מפריד בין הבית לנכס ההקדש השכן.',
      'Qüds məhkəməsinin 1613-cü il qeydi Əbu Mədyən vəqfinin yanında bağçalı ev göstərir. Sənəd bu günkü ünvanı dəqiq müəyyənləşdirmir. Şəkil evi qonşu vəqf mülkündən ayırır.',
    ],'https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/18/01/99/32/2018019932/2018019932.pdf'],
    ['quarter-passage',['1930 · Döşeli geçit','1930 · Paved passage','1930 · המעבר המרוצף','1930 · Döşənmiş keçid'], [
      'Yüzyıllar sonraki Duvar Komisyonu, mabet yükseltisini tutan duvarın önündeki geçidi tarif eder. Rapor geçidin mülkiyetiyle dua için erişimi ayrı değerlendirir. Şema yalnızca bu ilişkiyi gösterir.',
      'Centuries later, the Wall Commission describes the passage along the retaining wall. It considers ownership of the passage and devotional access separately. The sketch shows that relationship.',
      'מאות שנים אחר כך ועדת הכותל מתארת את המעבר שליד קיר התמך. הדוח דן בנפרד בבעלות על המעבר ובגישה לתפילה. התרשים מציג את הקשר ביניהן.',
      'Əsrlər sonra Divar Komissiyası istinad divarının önündəki keçidi təsvir edir. Hesabat keçidin mülkiyyətini və dua üçün girişi ayrı araşdırır. Sxem bu əlaqəni göstərir.',
    ],'https://unispal.un.org/pdfs/59A92104ED00DC468525625B00527FEA.pdf'],
  ]),
  scene(16, ['Zohar’ın yolculuğu','The Zohar across time','הזוהר לאורך הדורות','Zoharın zamanla yolçuluğu'], [
    ['zohar-voice',['Anlatıdaki ses','The voice in the story','הקול בסיפור','Rəvayətdəki səs'], [
      'Zohar, Tevrat’ı yorumlayan ve mistik sahneler anlatan metinlerden oluşur. Şimon bar Yohai metnin öne çıkan öğretmenidir ve geleneksel yazarlık atfının merkezindedir.',
      'The Zohar brings together interpretations of the Torah and mystical stories. Shimon bar Yohai is a leading teacher in its pages and the figure to whom tradition attributes authorship.',
      'הזוהר מאגד פירושים לתורה וסיפורים מיסטיים. רבי שמעון בר יוחאי הוא מורה מרכזי בספר, והמסורת מייחסת לו את חיבורו.',
      'Zohar Tövratı şərh edən və mistik səhnələri danışan mətnləri birləşdirir. Şimon bar Yohay əsərin əsas müəllimlərindən biridir və ənənə müəllifliyi ona aid edir.',
    ],'https://www.sefaria.org/Zohar'],
    ['zohar-castile',['13. yüzyılda Kastilya','Castile in the 13th century','קסטיליה במאה ה־13','XIII əsrdə Kastiliya'], [
      'Araştırmacılar külliyatın önemli bir bölümünün dolaşıma girmesini 13. yüzyıl sonu Kastilya’sı ve Moşe de Leon çevresiyle ilişkilendirir. Külliyat farklı metinlerden ve katmanlardan oluşur.',
      'Scholars trace the circulation of much of the corpus to late thirteenth-century Castile and the circle of Moses de León. The corpus has several textual layers.',
      'חוקרים קושרים את תפוצתו של חלק חשוב מן הקורפוס לקסטיליה בסוף המאה ה־13 ולחוגו של משה די ליאון. הקורפוס מורכב מכמה שכבות טקסטואליות.',
      'Tədqiqatçılar külliyyatın mühüm hissəsinin yayılmasını XIII əsrin sonlarında Kastiliya və Moşe de Leon çevrəsi ilə əlaqələndirirlər. Külliyyat bir neçə mətn qatından ibarətdir.',
    ],'https://www.sup.org/books/pages/4810/Front_Matter.pdf'],
    ['zohar-merton',['Merton nüshası','The Merton copy','עותק מרטון','Merton nüsxəsi'], [
      'Bu nüshanın kâğıdı 1499–1502 dönemine tarihlenir. Nüsha muhtemelen 16. yüzyılın başlarında veya ortalarında yazıldı. 111v yaprağındaki kâtip notunda Şabtai adı geçer. Çizimde kâtip notu ayrı renkle gösterilir. Nüshanın nerede yazıldığı kesin değildir.',
      'The paper was made between 1499 and 1502. The copy was likely written in the early to mid-sixteenth century. The scribe’s note on folio 111v names Shabtai. The drawing highlights the scribe’s note in a separate color. The place of copying is uncertain.',
      'הנייר יוצר בין 1499 ל־1502. ההעתקה נעשתה כנראה בראשית עד אמצע המאה ה־16. בקולופון בדף 111 ע״ב מופיע השם שבתאי. האיור מדגיש את הערת הסופר בצבע אחר. מקום ההעתקה אינו ודאי.',
      'Kağız 1499–1502-ci illərə aiddir. Nüsxə ehtimalən XVI əsrin əvvəli və ya ortalarında köçürülüb. 111v vərəqindəki katib qeydində Şabtay adı keçir. Şəkildə katib qeydi fərqli rənglə göstərilir. Köçürülmə yeri dəqiq bilinmir.',
    ],'https://www.merton.ox.ac.uk/news/merton-zohar-manuscript-digitised'],
  ]),
  scene(17, ['1492 sonrasında üç güzergâh','Three routes after 1492','שלושה נתיבי הגירה אחרי 1492','1492-dən sonra üç marşrut'], [
    ['portugal',['Portekiz','Portugal','פורטוגל','Portuqaliya'],
      ['Bazı aileler önce Portekiz’e geçti. Buradaki 1496 buyruğu ve ardından gelen zorla din değiştirmeler yeni ayrılışlara yol açtı.','Some families first went to Portugal. The order of 1496 and the forced conversions that followed prompted further departures.','משפחות אחדות עברו תחילה לפורטוגל. הצו של 1496 והמרות הדת הכפויות אחריו הביאו לעזיבות נוספות.','Bəzi ailələr əvvəl Portuqaliyaya getdi. 1496-cı il fərmanı və sonra zorla din dəyişdirmə yeni köçlərə səbəb oldu.']],
    ['north-africa',['Kuzey Afrika','North Africa','צפון אפריקה','Şimali Afrika'],
      ['Bazı sürgünler Fas ve başka Kuzey Afrika bölgelerine yerleşti. Daha önce bu bölgelerde yaşayan Yahudi cemaatleri de vardı.','Some exiles settled in Morocco and elsewhere in North Africa, where Jewish communities already lived.','חלק מהמגורשים התיישבו במרוקו ובאזורים אחרים בצפון אפריקה, שבהם כבר חיו קהילות יהודיות.','Bəzi sürgünlər Mərakeşdə və Şimali Afrikanın başqa bölgələrində məskunlaşdı. Orada əvvəlcədən yəhudi icmaları yaşayırdı.']],
    ['salonika',['Osmanlı limanları','Ottoman ports','נמלים עות׳מאניים','Osmanlı limanları'],
      ['Selanik ve İstanbul önemli varış yerleri oldu. Bazı aileler buralara İtalya veya başka bir liman üzerinden ulaştı.','Salonika and Istanbul became important destinations. Some families reached them through Italy or another port.','סלוניקי ואיסטנבול היו יעדים חשובים. משפחות מסוימות הגיעו דרך איטליה או נמל אחר.','Saloniki və İstanbul mühüm dayanacaqlar oldu. Bəzi ailələr bu şəhərlərə İtaliya və ya başqa liman vasitəsilə gəlib çatdı.']],
  ]),
  scene(18, ['Safed’de üç okuma masası','Three reading tables in Safed','שלושה שולחנות לימוד בצפת','Səfəddə üç oxu masası'], [
    ['safed-law',['Karo · Pesah sofrası','Karo · Passover table','קארו · שולחן הסדר','Karo · Pesax süfrəsi'], [
      'Henüz gündüzken sofrayı hazırla. Yosef Karo, çocuklar uykuya dalmadan Seder’e başlanabilmesi için böyle öğüt verir. Kiduş, şarap üzerine söylenen kutsama, gece olunca okunur. Kaynak Şulhan Aruh, Orah Hayim 472:1.',
      'Set the table while it is still light. Joseph Karo directs households to prepare ahead so the Seder can start before children fall asleep. The Kiddush blessing over wine waits until nightfall. See Shulchan Arukh, Orach Chayim 472:1.',
      'ערכו את השולחן בעוד יום. יוסף קארו מנחה להכין אותו מראש כדי שאפשר יהיה להתחיל את הסדר לפני שהילדים נרדמים. את הקידוש על היין אומרים אחרי רדת הלילה. ראו שולחן ערוך, אורח חיים תע״ב, א׳.',
      'Hava işıqlı ikən süfrəni hazırla. Yosef Karo uşaqlar yatmadan Sederə başlamaq üçün süfrəni qabaqcadan hazırlamağı bildirir. Şərab üzərində deyilən Kiduş gecə düşəndə oxunur. Bax: Şulhan Aruh, Orah Hayim 472:1.',
    ],'https://www.sefaria.org/Shulchan_Arukh%2C_Orach_Chayim.472.1'],
    ['safed-ethics',['Cordovero · Merhamet','Cordovero · Compassion','קורדובירו · רחמים','Kordovero · Mərhəmət'], [
      'Moşe Cordovero, Tomer Devora’nın ilk bölümünde ilahî merhametin davranışla örnek alınmasını önerir. Örneğin incindiğin bir konuşmada karşındaki kişiye yeniden söz vermeyi düşün. Bu örnek, metnin ahlâk sorusunu gündelik bir duruma taşır.',
      'In the first chapter of Tomer Devorah, Moses Cordovero asks how human conduct can imitate divine compassion. Imagine giving someone another chance to speak after a conversation that hurt you. The example brings the ethical question into an everyday setting.',
      'בפרק הראשון של תומר דבורה משה קורדובירו שואל איך המעשים שלנו יכולים לחקות את מידת הרחמים האלוהית. דמיינו שאתם נותנים לאדם הזדמנות נוספת לדבר אחרי שיחה שפגעה בכם. הדוגמה מעבירה את השאלה המוסרית למצב יומיומי.',
      'Moşe Kordovero Tomer Devoranın birinci fəslində insanın davranışında ilahi mərhəməti necə nümunə götürə biləcəyini soruşur. Səni incidən söhbətdən sonra qarşıdakı adama yenidən danışmaq imkanı verməyi düşün. Bu nümunə etik sualı gündəlik həyata gətirir.',
    ],'https://www.sefaria.org/Tomer_Devorah.1.1'],
    ['safed-vital',['Vital · Boşluk ve çizgi','Vital · Space and line','ויטאל · חלל וקו','Vital · Boşluq və xətt'], [
      'Ets Hayim, tsimtsumdan sonra kalan boşluğa sonsuz ışıktan bir çizginin, kav’ın, uzandığını anlatır. Hayim Vital’in aktardığı Luria öğretisini şemada izle. Bu, dünyaların nasıl ortaya çıktığını anlatan mistik bir modeldir.',
      'Etz Chaim describes a line, the kav, extending from the infinite light into the space left by tzimtzum. Follow Hayyim Vital’s transmission of Luria’s teaching in the diagram. It is a mystical account of how the worlds emerge.',
      'עץ חיים מתאר קו הנמשך מאור אין סוף אל החלל שנותר אחרי הצמצום. עקבו בתרשים אחר תורת האר״י כפי שנמסרה בידי חיים ויטאל. זהו תיאור מיסטי של התהוות העולמות.',
      'Etz Hayim tsimtsumdan sonra qalan boşluğa sonsuz nurdan kav adlı xəttin uzandığını təsvir edir. Hayim Vitalin ötürdüyü Luriya təlimini sxemdə izlə. Bu, dünyaların yaranmasını izah edən mistik modeldir.',
    ],'https://www.sefaria.org/Sefer_Etz_Chaim.1.2.2'],
  ]),
  scene(19, ['Sur, Batı Duvarı ve mahalle','City wall, Western Wall and neighborhood','חומת העיר, הכותל והשכונה','Şəhər divarı, Qərb divarı və məhəllə'], [
    ['city-walls',['Osmanlı şehir suru','Ottoman city wall','חומת העיר העות׳מאנית','Osmanlı şəhər divarı'],
      ['Kanûnî devrindeki kitabe, Eski Şehir çevre surunun inşasını belgeler. Bu sur şehri çevreler.','The inscription from Süleyman’s reign documents construction of the city wall that surrounds the Old City.','הכתובת מימי סולימאן מתעדת את בניית החומה המקיפה את העיר העתיקה.','Süleyman dövrünün kitabəsi Qüdsün Köhnə Şəhərini əhatə edən divarın tikintisini sənədləşdirir.'],
      'https://www.imj.org.il/en/node/6581296'],
    ['kotel-courses',['Batı Duvarı taş sıraları','Western Wall stone courses','נדבכי האבנים בכותל','Qərb Divarının daş sıraları'],
      ['İri alt taşları ve küçük üst taşları karşılaştır. Batı Duvarı, Tapınak platformunu tutan istinat duvarıdır. Osmanlı döneminde yayımlanan araştırma, dua alanında görülen taşları tarif eder.','Compare the large lower blocks and smaller upper ones. The Western Wall retains the Temple Mount platform. A survey published under Ottoman rule describes the stones visible at the prayer area.','השוו בין האבנים הגדולות למטה לאבנים הקטנות למעלה. הכותל המערבי תומך במתחם הר הבית. סקר שפורסם בתקופה העות׳מאנית מתאר את האבנים שנראו במקום התפילה.','Aşağıdakı iri daşları yuxarıdakı kiçik daşlarla müqayisə et. Qərb divarı Məbəd dağı platformasını saxlayan istinad divarıdır. Osmanlı dövründə nəşr olunan tədqiqat dua yerində görünən daşları təsvir edir.'],
      'https://content.ecf.org.il/files/M00868_PEFSurveyOfWesternPalestineJerusalem1884English.pdf#page=203'],
    ['mughrabi-quarter',['Mağribi Mahallesi','Maghrebi Quarter','שכונת המוגרבים','Məğribi məhəlləsi'],
      ['Batı Duvarı’nın önündeki dar geçide bak. Mağribi Mahallesi’nin evleri bu alana komşuydu. Çizim, mahalle ile dua yerinin birbirine yakınlığını gösteren bir şemadır.','Look at the narrow passage in front of the Western Wall. Homes in the Maghrebi Quarter stood next to it. The drawing shows the proximity of the neighborhood and the prayer area.','שימו לב למעבר הצר שלפני הכותל. בתי שכונת המוגרבים עמדו בצמוד אליו. האיור הסכמטי מראה את הקרבה בין השכונה למקום התפילה.','Qərb divarının önündəki dar keçidə bax. Məğribi məhəlləsinin evləri bu yerə bitişik idi. Şəkil məhəllə ilə dua yerinin bir-birinə yaxınlığını göstərən sxemdir.'],
      'https://archives.openjerusalem.org/index.php/mughrabi-quarter'],
  ]),
  scene(20, ['Sabatay Sevi haberinin izinde','Following news of Sabbatai Sevi','בעקבות הבשורות על שבתאי צבי','Sabatay Sevi xəbərinin izi ilə'], [
    ['news-cairo',['1665/1666 · Kahire’ye mektup','1665/1666 · Letter to Cairo','1665/1666 · מכתב לקהיר','1665/1666 · Qahirəyə məktub'], [
      'Gazzeli Natan, Sabatay Sevi’yi destekleyen bir mektubu Kahire cemaatinin önderlerinden Rafael Yusif’e yazdı. Jonatan Meir’in edisyonu mektubu 1665’e, Posen Library kaydı 1666’ya tarihler. Çizim muhatabın yerini gösterir.',
      'Nathan of Gaza wrote in support of Sabbatai Sevi to Raphael Joseph, a leader of Cairo’s Jewish community. Jonatan Meir’s edition dates the letter to 1665 and the Posen Library records it as 1666. The illustration marks the recipient’s city.',
      'נתן העזתי כתב בזכות שבתאי צבי לרפאל יוסף, ממנהיגי הקהילה היהודית בקהיר. מהדורת יונתן מאיר מתארכת את המכתב ל־1665, ובספריית פוזן הוא מתוארך ל־1666. האיור מסמן את עיר הנמען.',
      'Qəzzalı Natan Sabatay Sevini dəstəkləyən məktubu Qahirə yəhudi icmasının rəhbərlərindən Rafael Yusifə yazdı. Yonatan Meirin nəşri məktubu 1665-ci ilə, Posen Kitabxanası isə 1666-cı ilə aid edir. Şəkil məktubu alanın şəhərini göstərir.',
    ],'https://old-digitalcollections.nypl.org/collections/collection-of-texts-on-shabbethai-tzevi-and-the-sabbatean-movement'],
    ['news-glikl',['1666 başları · Hamburg','Early 1666 · Hamburg','תחילת 1666 · המבורג','1666-cı ilin əvvəli · Hamburq'], [
      'Mektup simgesi Hamburg’u gösteriyor. Glikl von Hameln, Sabatay Sevi hakkında gelen mektupların Sefarad sinagogunda sesli okunduğunu hatırlıyordu. Aşkenaz dinleyiciler de gelirdi. Bu olayı yıllar sonra ailesine Yidişçe anlattı.',
      'The letter marks Hamburg. Glikl von Hameln recalled letters about Sabbatai Sevi being read aloud at the Sephardic synagogue. Ashkenazi listeners also came. Years later, she told her family about it in her Yiddish memoir.',
      'ציור המכתב מסמן את המבורג. גליקל מהמלן זכרה שהקריאו בבית הכנסת הספרדי מכתבים על שבתאי צבי. גם מאזינים אשכנזים באו לשמוע. כעבור שנים היא סיפרה על כך למשפחתה בזיכרונותיה ביידיש.',
      'Məktub işarəsi Hamburqu göstərir. Glikl von Hameln Sabatay Sevi barədə gələn məktubların Sefarad sinaqoqunda ucadan oxunduğunu xatırlayırdı. Aşkenaz dinləyicilər də gəlirdi. Glikl illər sonra bu hadisəni ailəsinə yidiş dilində yazdığı xatirələrdə danışdı.',
    ],'https://keydocuments.net/source/jgo%3Asource-165'],
    ['news-edirne',['1666 · Edirne','1666 · Edirne','1666 · אדירנה','1666 · Ədirnə'], [
      'Sabatay Sevi 1666’da Osmanlı saray kenti Edirne’de İslam’a geçti. Kimi takipçiler bunu yeniden yorumladı, kimileri beklentilerinden vazgeçti. Sonraki tarihçiler farklı çevrelerin kayıtlarını karşılaştırır.',
      'Sabbatai Sevi converted to Islam in the Ottoman court city of Edirne in 1666. Some followers reinterpreted the change and others gave up their hopes. Later historians compare accounts from different circles.',
      'שבתאי צבי התאסלם ב־1666 בעיר החצר העות׳מאנית אדירנה. חלק ממאמיניו פירשו מחדש את ההמרה ואחרים ויתרו על ציפיותיהם. היסטוריונים משווים רישומים מחוגים שונים.',
      'Sabatay Sevi 1666-cı ildə Osmanlı saray şəhəri Ədirnədə İslamı qəbul etdi. Bəzi ardıcılları dəyişikliyi yenidən şərh etdilər, başqaları ümidlərindən əl çəkdilər. Tarixçilər müxtəlif çevrələrin qeydlərini müqayisə edirlər.',
    ],'https://cmes.fas.harvard.edu/publications/jewish-messiah-ottoman-court-sabbatai-sevi-and-emergence-judeo-islamic-community'],
    ['news-hamburg',['Kasım 1666 · Hamburg’a haber','November 1666 · News to Hamburg','נובמבר 1666 · דיווח להמבורג','Noyabr 1666 · Hamburqa xəbər'], [
      'Livorno’dan Rav Yusif Halevi, Hamburg’daki Rav Yaakov Sasportas’a din değiştirme haberini yazdı. Sasportas harekete karşı çıkan bir hahamdı. Harita mektubun iki ucunu gösterir. Haber önceki beklentinin kanıtından farklı bir soruya yanıt verir.',
      'Rabbi Joseph Halevi in Livorno sent news of the conversion to Rabbi Jacob Sasportas in Hamburg. Sasportas opposed the movement. The map marks the two ends of their correspondence. This report answers a different question from the earlier letter of support.',
      'ר׳ יוסף הלוי בליבורנו כתב לר׳ יעקב ששפורטש בהמבורג על ההמרה. ששפורטש התנגד לתנועה. המפה מסמנת את שני קצות ההתכתבות. הדיווח עונה על שאלה אחרת ממכתב התמיכה הקודם.',
      'Livornodakı ravvin Yusif Halevi din dəyişməsi xəbərini Hamburqdakı ravvin Yaakov Sasportasa yazdı. Sasportas hərəkata qarşı idi. Xəritə yazışmanın iki ucunu göstərir. Bu məlumat əvvəlki dəstək məktubundan fərqli suala cavab verir.',
    ],'https://www.sabbateanstudies.org/primasy-sources'],
  ]),
  scene(21, ['Manda döneminde dar geçit','The narrow passage under the Mandate','המעבר הצר בימי המנדט','Mandat dövründə dar keçid'], [
    ['mandate-screen',['1928 · Paravan olayı','1928 · The screen incident','1928 · תקרית המחיצה','1928 · Arakəsmə hadisəsi'], [
      'Yom Kipur arifesinde dua alanına bir paravan kondu. Vakıf yöneticisi şikâyet etti. Britanya Manda polisi paravanı 24 Eylül’de kaldırdı. Bu belge 1928 olayını kaydeder. Ağustos 1929 şiddetini Shaw Komisyonu ayrıca inceledi.',
      'A screen was put up at the place of prayer on the eve of Yom Kippur. The waqf administrator complained and Mandate police removed the screen on 24 September. This is the 1928 incident. The Shaw Commission separately investigated the violence of August 1929.',
      'בערב יום הכיפורים הוצבה מחיצה במקום התפילה. מנהל הווקף התלונן, ומשטרת המנדט הסירה את המחיצה ב־24 בספטמבר. זהו האירוע של 1928. ועדת שו חקרה בנפרד את האלימות באוגוסט 1929.',
      'Yom Kipur ərəfəsində dua yerində arakəsmə qoyuldu. Vəqf idarəçisi şikayət etdi və mandat polisi arakəsməni sentyabrın 24-də götürdü. Bu, 1928-ci il hadisəsidir. Şou Komissiyası 1929-cu ilin avqust zorakılığını ayrıca araşdırdı.',
    ],'https://www.un.org/unispal/document/auto-insert-193243/'],
    ['commission-property',['1930 · Mülkiyet','1930 · Ownership','1930 · בעלות','1930 · Mülkiyyət'], [
      '1930 Komisyonu, Batı Duvarı’nı vakıf statüsündeki Harem-i Şerif’in parçası saydı. Duvar, önündeki döşeli yol ve karşıdaki Mağribi Mahallesi üzerindeki mülkiyet haklarını Müslümanlara atfetti. Şema, dönemin mülkiyet kararını gösterir.',
      'The 1930 Commission treated the Western Wall as part of the Haram al-Sharif waqf. It attributed ownership of the Wall, the paved passage and the adjoining Maghrebi Quarter to Muslims. The drawing shows the scope of that historical finding.',
      'ועדת 1930 ראתה בכותל המערבי חלק מווקף אל־חרם א־שריף. היא ייחסה למוסלמים את הבעלות על הכותל, המעבר המרוצף והשכונה המוגרבית הסמוכה. התרשים מראה את תחולת ההכרעה ההיסטורית.',
      '1930-cu il Komissiyası Qərb Divarını vəqf statuslu Hərəm əş-Şərifin bir hissəsi saydı. Divar, döşənmiş keçid və yaxın Məğribi məhəlləsi üzərində mülkiyyəti müsəlmanlara aid etdi. Sxem həmin tarixi qərarın əhatəsini göstərir.',
    ],'https://unispal.un.org/pdfs/59A92104ED00DC468525625B00527FEA.pdf'],
    ['commission-access',['1930 · Dua için erişim','1930 · Access for prayer','1930 · גישה לתפילה','1930 · Dua üçün giriş'], [
      'Geçitteki işaretleri izle. Komisyon, Yahudilerin duvara ibadet için ulaşma hakkını tanıdı ve bitişik yapı işlerinin bu erişimi engellememesi gerektiğini belirtti. Çizgi, geçidi gösteren bir şemadır.',
      'Follow the marks on the passage. The commission recognized Jewish access to the Wall for devotion and required adjacent construction to preserve that access. The line shows the passage schematically.',
      'עקבו אחר הסימונים במעבר. הוועדה הכירה בזכות היהודים להגיע לכותל לתפילה וקבעה שעבודות בנייה סמוכות ישמרו על הגישה. הקו מציג את המעבר באופן סכמטי.',
      'Keçiddəki işarələri izlə. Komissiya yəhudilərin dua üçün Divara giriş hüququnu tanıdı və bitişik tikinti işlərinin bu girişi qorumalı olduğunu bildirdi. Xətt keçidi şərti şəkildə göstərir.',
    ],'https://unispal.un.org/pdfs/59A92104ED00DC468525625B00527FEA.pdf'],
    ['commission-conditions',['1930 · Geçit kuralları','1930 · Rules for the passage','1930 · כללי השימוש במעבר','1930 · Keçid qaydaları'], [
      'Rapor, Müslümanların geçitten olağan biçimde geçmesini korudu. İbadet eşyaları ve zamanları için koşullar koydu. Örneğin kişisel dua kitaplarına izin verirken paravanlara sınırlama getirdi. Bunlar Manda döneminin hükümleridir.',
      'The report protected ordinary passage for Muslims and set conditions on worship objects and times. For example, it allowed personal prayer books and restricted screens. These were rules from the Mandate period.',
      'הדוח הגן על זכות המעבר הרגילה של מוסלמים וקבע תנאים לחפצי תפילה ולמועדים. לדוגמה, הוא התיר סידורים אישיים והגביל הצבת מחיצות. אלה כללים מתקופת המנדט.',
      'Hesabat müsəlmanların keçiddən adi qaydada istifadəsini qorudu, ibadət əşyaları və vaxtları üçün şərtlər qoydu. Məsələn, şəxsi dua kitablarına icazə verdi, arakəsmələri isə məhdudlaşdırdı. Bunlar mandat dövrünün qaydalarıdır.',
    ],'https://unispal.un.org/pdfs/59A92104ED00DC468525625B00527FEA.pdf'],
  ]),
  scene(22, ['İki ayrı tarihsel arşiv','Two historical archives','שני ארכיונים היסטוריים','İki ayrı tarixi arxiv'], [
    ['holocaust',['Holokost kayıtları','Holocaust records','תיעוד השואה','Holokost qeydləri'],
      ['Nazi Almanyası, müttefik ve işbirlikçileriyle birlikte yaklaşık altı milyon Avrupalı Yahudiyi sistemli biçimde öldürdü. Arşivler kararları, failleri, kurtulanların tanıklıklarını ve tek tek yaşamları belgeler.','Nazi Germany, with allies and collaborators, systematically murdered about six million European Jews. The archives preserve decisions, perpetrators’ records, survivor testimony, and individual lives.','גרמניה הנאצית, עם בעלות בריתה ומשתפי פעולה, רצחה בשיטתיות כשישה מיליון יהודים אירופים. הארכיונים משמרים החלטות, מסמכי מבצעים ועדויות ניצולים וחיים של יחידים.','Nasist Almaniyası müttəfiqləri və əməkdaşları ilə birlikdə təxminən altı milyon Avropa yəhudisini sistemli şəkildə öldürdü. Arxivlər qərarları, icraçıların qeydlərini, sağ qalanların şahidliyini və ayrı-ayrı həyatları sənədləşdirir.']],
    ['nakba',['1948 yerinden edilme kayıtları','Displacement records from 1948','תיעוד העקירה ב־1948','1948-ci ilin köçkünlük qeydləri'],
      ['1948 savaşı sırasında yüz binlerce Filistinli evinden kaçtı ya da çıkarıldı. İnsanların deneyimleri yere ve zamana göre değişti. Nakba, bu kitlesel yerinden edilmenin Filistinli hafızasındaki adıdır.','During the 1948 war, hundreds of thousands of Palestinians fled or were expelled from their homes. Their experiences varied by place and time. Nakba is the term in Palestinian memory for this mass displacement.','במהלך מלחמת 1948 מאות אלפי פלסטינים נמלטו או גורשו מבתיהם. חוויותיהם השתנו לפי המקום והזמן. נכבה הוא הכינוי בזיכרון הפלסטיני לעקירה ההמונית הזאת.','1948-ci il müharibəsində yüz minlərlə fələstinli evindən qaçdı və ya çıxarıldı. Təcrübələr yerə və vaxta görə fərqli idi. Nəkbə Fələstin yaddaşında bu kütləvi köçkünlüyün adıdır.']],
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
  ['אצילות', ['Atsilut','Atzilut','אצילות','Atsilut'], ['Yayılım','Emanation','האצלה','Yayılma'], [
    'Bu düzeyde Kabala, ilahî niteliklerin kaynaklarıyla birliğini vurgular. Bir dostuna mektup yazmaya karar verdiğin andaki niyeti düşün.',
    'At this level Kabbalah emphasizes the unity of divine qualities with their source. For an analogy, think of your intention to write to a friend.',
    'ברובד הזה הקבלה מדגישה את האחדות בין המידות האלוהיות למקורן. כדוגמה, חשבו על הכוונה לכתוב מכתב לחבר.',
    'Bu səviyyədə Kabala ilahi keyfiyyətlərin mənbəyi ilə birliyini vurğulayır. Bir dosta məktub yazmaq niyyətini düşün.',
  ]],
  ['בריאה', ['Beria','Beriah','בריאה','Beria'], ['Yaratılış','Creation','בריאה','Yaradılış'], [
    'Bu düzey, yaratılan bir varlığın belirmesini anlatır. Mektubunda söyleyeceğin düşüncenin ilk kez belirginleşmesi buna benzetilebilir.',
    'This level describes created existence coming into view. In the letter analogy, it is like the message first taking shape in your mind.',
    'הרובד מתאר הופעה של מציאות נבראת. במשל המכתב, זה הרגע שבו המסר מתחיל להתבהר במחשבה.',
    'Bu səviyyə yaradılmış varlığın meydana çıxmasını təsvir edir. Məktub misalında demək istədiyin fikir ilk dəfə aydınlaşır.',
  ]],
  ['יצירה', ['Yetsira','Yetzirah','יצירה','Yetsira'], ['Biçimlenme','Formation','יצירה','Formalaşma'], [
    'Yaratılanların ayırt edilebilir biçimler kazanmasını anlatan düzeydir. Mektupta bir düşüncenin sözcüklere ve cümlelere dönüşmesini düşün.',
    'This level describes creation taking distinguishable forms. Think of arranging an idea into words and sentences for the letter.',
    'ברובד הזה לבריאה יש צורות מובחנות. במשל המכתב, רעיון מקבל צורה במילים ובמשפטים.',
    'Bu səviyyədə yaradılanlar seçilən formalar alır. Məktubdakı fikrin sözlərə və cümlələrə çevrilməsini düşün.',
  ]],
  ['עשייה', ['Asiya','Asiyah','עשייה','Asiya'], ['Eylem','Action','עשייה','Əməl'], [
    'Bu düzey, eyleme ve somut dünyaya uzanır. Mektubu kâğıda yazıp dostuna gönderdiğin adımı düşün.',
    'This level reaches into action and the material world. In the letter analogy, you put the words on paper and send them.',
    'הרובד מגיע אל המעשה ואל העולם החומרי. במשל, כותבים את המכתב על נייר ושולחים אותו.',
    'Bu səviyyə əməli və maddi dünyanı əhatə edir. Məktubu kağıza yazıb dostuna göndərdiyin addımı düşün.',
  ]],
];

export const worldNote = [
  'ABiYA dört adın baş harflerini birleştirir. Her dünyayı ayrı incele. Mektup örneği bir benzetmedir. Bazı Luria okumalarında Adam Kadmon bu dörtlüden önce gelir. Partzuf, sefirotun birbiriyle ilişkili bir yapı olarak düzenlenişidir.',
  'ABYA combines the initials of the four names. Explore each world. The letter is an analogy. Some readings of Luria place Adam Kadmon before these four. A partzuf is a configuration of sefirot in relation to one another.',
  'אבי״ע הוא ראשי התיבות של ארבעת השמות. בחנו כל עולם בנפרד. המכתב הוא משל. בכמה קריאות של תורת האר״י, אדם קדמון קודם לארבעת העולמות. פרצוף הוא מבנה של ספירות הקשורות זו לזו.',
  'ABiYA dörd adın baş hərflərini birləşdirir. Hər dünyaya ayrıca bax. Məktub nümunəsi bənzətmədir. Lurianın bəzi şərhlərində Adam Kadmon bu dörd dünyadan əvvəl gəlir. Partsuf sefirotun əlaqəli bir quruluşda düzülüşüdür.',
];

export const photo = {
  task:['Eski fotoğrafı aç','Open the old photo','פתחו את התצלום הישן','Köhnə fotonu aç'],
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
  passage: {
    question:[
      'Fotoğraftaki dar geçit, bugünkü meydanın neresindeydi?',
      'Where was the narrow passage in the photo in relation to today’s plaza?',
      'היכן היה המעבר הצר שבתצלום ביחס לרחבה של היום?',
      'Fotodakı dar keçid bugünkü meydanın harasında idi?',
    ],
    places:[
      ['Platformun üstünde','On top of the platform','על גבי המתחם המוגבה','Platformanın üstündə'],
      ['Batı Duvarı’nın dibinde','At the foot of the Western Wall','למרגלות הכותל המערבי','Qərb Divarının dibində'],
    ],
    retry:[
      'Fotoğrafta insanların durduğu yere bak. Geçidi duvara göre yeniden konumlandır.',
      'Look at where people stand in the photograph. Try placing the passage again.',
      'התבוננו במקום שבו עומדים האנשים בתצלום. נסו למקם שוב את המעבר.',
      'Fotoda insanların dayandığı yerə bax. Keçidin yerini yenidən seç.',
    ],
    matched:[
      'Dar geçit duvarın dibindeydi. İşaret, bu konumu eski sokakta ve bugünkü meydanda şematik olarak gösteriyor.',
      'The narrow passage was at the foot of the wall. The marker shows that position schematically in the old street and today’s plaza.',
      'המעבר הצר היה למרגלות הכותל. הסימון מציג את מקומו באופן סכמטי בסמטה הישנה וברחבה של היום.',
      'Dar keçid divarın dibində idi. İşarə həmin yeri köhnə küçədə və bugünkü meydanda şərti olaraq göstərir.',
    ],
  },
  historySource:['UNESCO saha raporu','UNESCO field report','דוח השטח של אונסק״ו','UNESCO-nun sahə hesabatı'],
  historyUrl:'https://whc.unesco.org/document/8721',
};

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
