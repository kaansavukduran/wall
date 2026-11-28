import { early } from './chapters-early.js';
import { modern } from './chapters-modern.js';

export const languages = ['tr', 'en', 'he', 'az'];

export const ui = {
  tr: ['Zaman çizelgesi', 'İncele', 'Kaynak', 'Devam et', 'Kapat', 'Kaynağı aç', 'Sola yürü', 'Sağa yürü', 'Dil', 'Meydan', 'Bir daha düşün. Kaynağı açabilir veya sahneyi inceleyebilirsin.', 'Açık bölümler', 'İlk durak', 'Meydana dön', 'Kazı ve kaynak notu'],
  en: ['Timeline', 'Inspect', 'Source', 'Continue', 'Close', 'Open source', 'Walk left', 'Walk right', 'Language', 'The plaza', 'Take another look. You can inspect the scene or read the source.', 'Unlocked chapters', 'First stop', 'Return to the plaza', 'Excavation and source note'],
  he: ['ציר הזמן', 'בדיקה', 'מקור', 'המשך', 'סגירה', 'פתיחת המקור', 'הליכה שמאלה', 'הליכה ימינה', 'שפה', 'הרחבה', 'כדאי לבדוק שוב. אפשר לבחון את הסצנה או לקרוא את המקור.', 'פרקים פתוחים', 'תחנה ראשונה', 'חזרה לרחבה', 'חפירה ומקור'],
  az: ['Zaman xətti', 'Araşdır', 'Mənbə', 'Davam et', 'Bağla', 'Mənbəni aç', 'Sola get', 'Sağa get', 'Dil', 'Meydan', 'Bir də bax. Səhnəni araşdıra və ya mənbəni oxuya bilərsən.', 'Açıq bölmələr', 'İlk dayanacaq', 'Meydana qayıt', 'Qazıntı və mənbə qeydi'],
};

const passage = 'https://hadashot.iaa.org.il/Report_Detail_Eng.aspx?id=25662';

export const plaza = {
  era: ['Bugün', 'Today', 'כיום', 'Bu gün'],
  source: passage,
  answers: ['temple','wall','platform'],
  correct: 1,
  text: [
    ['Bir taşın izi','Eski fotoğraftaki dar geçidi bugünkü meydanla karşılaştır. Bugün gördüğün taş duvar hangi yapının bir parçası?','Tapınak binası','Batı istinat duvarı','Yükseltilmiş platform','Doğru. Kotel, Tapınak Tepesi’ndeki platformu destekleyen batı istinat duvarının görünen bir bölümüdür.','Kazı raporu, duvar çevresindeki yapı evrelerini belgeler. Sahnedeki kesit, ilişkiyi öğretmek için basitleştirilmiş bir canlandırmadır.'],
    ['A trail of stone','Compare the narrow passage in the old photo with today’s plaza. Which structure is the stone wall you see today part of?','Temple building','Western retaining wall','Raised platform','Correct. The Kotel is a visible section of the western retaining wall that supports the Temple Mount platform.','The excavation report documents building phases near the wall. The game’s cross-section is a simplified reconstruction.'],
    ['בעקבות האבן','השוו בין המעבר הצר בתצלום הישן לרחבה כיום. מאיזה מבנה קיר האבן שנראה היום הוא חלק?','מבנה בית המקדש','הקיר התומך המערבי','המתחם המוגבה','נכון. הכותל המערבי הוא חלק גלוי מן הקיר התומך המערבי של מתחם הר הבית.','דוח החפירה מתעד שלבי בנייה ליד הכותל. החתך במשחק הוא שחזור מפושט.'],
    ['Daşın izi','Köhnə fotodakı dar keçidi bugünkü meydanla müqayisə et. Bu gün gördüyün daş divar hansı tikilinin bir hissəsidir?','Məbəd binası','Qərb istinad divarı','Yüksəldilmiş platforma','Doğrudur. Kotel Məbəd dağı platformasını saxlayan qərb istinad divarının görünən hissəsidir.','Qazıntı hesabatı divarın ətrafındakı tikinti mərhələlərini göstərir. Oyundakı kəsik sadələşdirilmiş canlandırmadır.'],
  ],
};

const architectural = [
  {
    id:6, era:['Hirodes dönemi','Herodian period','תקופת הורדוס','Hirod dövrü'], source:passage, answers:['temple','wall','platform'], correct:2,
    text:[
      ['Ustanın kesiti','Duvarın arkasındaki dolgunun üstünde düz bir alan var. Tapınak binası bu geniş alanın üzerinde dururdu. Hangisi bu yükseltilmiş alandır?','Tapınak binası','İstinat duvarı','Platform','Doğru. İstinat duvarı, yükseltilmiş platformu destekler.','Wilson Kemeri kazıları, platform çevresindeki yapı evrelerini anlamamıza yardım eder.'],
      ['The mason’s section','Above the fill behind the wall is a wide, level area. The Temple building once stood within this area. Which part is the raised area?','Temple building','Retaining wall','Platform','Correct. The retaining wall supports the raised platform.','The Wilson’s Arch excavations help document the construction history of the area.'],
      ['חתך הבנייה','מעל המילוי שמאחורי הקיר יש שטח מישורי רחב. בית המקדש עמד בתחומו. מהו השטח המוגבה?','מבנה בית המקדש','קיר תומך','המתחם','נכון. הקיר התומך מסייע להחזיק את המתחם המוגבה.','החפירות בקשת וילסון מלמדות על שלבי הבנייה באזור.'],
      ['Ustanın kəsiyi','Divarın arxasındakı dolğunun üstündə geniş düz sahə var. Məbəd binası bu sahədə yerləşirdi. Yüksəldilmiş sahə hansıdır?','Məbəd binası','İstinad divarı','Platforma','Doğrudur. İstinad divarı yüksəldilmiş platformanı saxlayır.','Uilson tağı qazıntıları ərazinin tikinti tarixini öyrənməyə kömək edir.'],
    ],
  },
  {
    id:8, era:['MS 70','70 CE','70 לספירה','Eramızın 70-ci ili'], source:'https://www.sefaria.org/The_War_of_the_Jews.6.4-5', answers:['temple','wall','platform'], correct:1,
    text:[
      ['Aynı yere dönüş','MS 70’te Roma ordusu İkinci Tapınağı yıktı. Bugün meydanda hangi yapının bir bölümünü görebiliyoruz?','Tapınak binasının kendisi','Platformun batı istinat duvarı','Roma zafer takı','Doğru. Bugünkü Batı Duvarı platformla bağlantılıdır.','Josephus, Roma kuşatması sırasında Tapınağın uğradığı yıkımı anlatır. Bugünkü taşların neye ait olduğunu incelemek için arkeolojik kanıt da gerekir.'],
      ['Return to the same place','In 70 CE the Roman army destroyed the Second Temple. A section of which structure can be seen in the plaza today?','The Temple building','The platform’s western retaining wall','The Roman triumphal arch','Correct. The wall visible today belongs to the platform.','Josephus describes the destruction during the Roman siege. Archaeological evidence helps explain what the stones we see today belong to.'],
      ['חזרה לאותו מקום','בשנת 70 לספירה החריב הצבא הרומי את בית המקדש השני. חלק מאיזה מבנה אפשר לראות ברחבה כיום?','בית המקדש עצמו','הקיר התומך המערבי של המתחם','שער הניצחון הרומי','נכון. הכותל הנראה כיום קשור למתחם המוגבה.','יוספוס מתאר את החורבן במצור הרומי. הממצאים הארכאולוגיים מסייעים לזהות את האבנים הנראות היום.'],
      ['Eyni yerə qayıdış','Eramızın 70-ci ilində Roma ordusu İkinci Məbədi dağıtdı. Bu gün meydanda hansı tikilinin bir hissəsini görürük?','Məbədin öz binasını','Platformanın qərb istinad divarını','Roma zəfər tağını','Doğrudur. Bu gün görünən divar platformaya aiddir.','İosif Flavi Roma mühasirəsindəki dağıntını təsvir edir. Bugünkü daşların mənşəyini araşdırmaq üçün arxeoloji dəlillər də lazımdır.'],
    ],
  },
];

export const chapters = [...early, ...architectural, ...modern].sort((first, second) => first.id - second.id);
