import {objectSprite} from './object-sprite.js';

export const letterSources = [
  ['https://cojs.org/simon-bar-kokhba-132-135-c-sukkot/',
    ['P. Yadin 57 · mektubun çevirisi', 'P. Yadin 57 · letter translation', 'פפירוס ידין 57 · תרגום האיגרת', 'P. Yadin 57 · məktubun tərcüməsi']],
  ['https://www.ashmolean.org/tetradrachm-judaea',
    ['Ashmolean HCR6354 · sikke', 'Ashmolean HCR6354 · coin', 'אשמוליאן HCR6354 · המטבע', 'Ashmolean HCR6354 · sikkə']],
  ['https://www.sefaria.org/Jerusalem_Talmud_Taanit.4.5.13?lang=bi',
    ['Yeruşalmi Taanit 4:5:13 · sonraki anlatı', 'Jerusalem Talmud Taanit 4:5:13 · later account', 'תלמוד ירושלמי, תענית ד׳:ה׳:י״ג · מסורת מאוחרת', 'Yerusəlim Talmudu, Taanit 4:5:13 · sonrakı rəvayət']],
  ['https://www.sefaria.org/Leviticus.23.39-43',
    ['Levililer 23:39–43 · Sukot', 'Leviticus 23:39–43 · Sukkot', 'ויקרא כ״ג:ל״ט–מ״ג · סוכות', 'Levililər 23:39–43 · Sukot']],
];

const copy = [
  {
    letter:'MS 132–135. Şimon ben Kosiba, Aramice mektupta Yehuda ben Menaşe’ye iki eşek gönderdiğini yazıyor. Yehuda’dan, bu eşekleri iki kişiyle Yehonatan bar Beayan ve Masabala’ya göndermesini istiyor. Onlar palmiye dallarını ve etrogu (ağaç kavunu) hazırlayıp kampa yollayacak. Yehuda bulunduğu yerden başka kişileri de kamp için mersin ve söğüt getirmeye gönderecek.',
    task:'Mektuptaki iki talebi ilgili bitkilerle eşleştir.',
    routes:['Yehonatan ile Masabala’dan istenen', 'Yehuda’nın bulunduğu çevreden istenen'],
    plants:['Palmiye dalları ve etrog', 'Mersin ve söğüt'],
    match:'Bu bitkileri mektuptaki taleple eşleştirdin.',
    retry:'Mektupta bu ikiliyi kimin getirmesi isteniyor? Diğer seçeneği dene.',
    question:'Kamp hakkında mektuptan hangi sonucu çıkarabilirsin?',
    choices:['Dört türün kampa gönderilmesi istenmişti.', 'Dört türün hepsi kampa ulaşmıştı.'],
    correct:'Mektup bir talebi kaydeder. Teslimi doğrulamak için başka bir kayıt gerekir.',
    incorrect:'Yehuda’ya verilen talimatı okudun. Bitkilerin ulaştığına dair bir kayıt gösterilmedi.',
    context:'Mektup Sukot’un adını vermez. Levililer 23:40 bayramın bitki kullanımını anlatır. Ashmolean Müzesi de sikkenin arka yüzünde palmiye dalı ve etrog imgeleri tanımlar. Geç Antik Çağ’da derlenen Yeruşalmi, Rabbi Akiva’nın Bar Kosiba’yı mesih olarak gördüğünü ve Rabbi Yohanan ben Torta’nın buna itiraz ettiğini anlatır.',
  },
  {
    letter:'132–135 CE. In an Aramaic letter, Shimon ben Kosiba writes that he sent two donkeys to Yehuda ben Menashe. He tells Yehuda to send two people with those donkeys to Yehonatan bar Beayan and Masabala, who are to pack and send palm branches and citrons to the camp. Yehuda is also to send people from his own area to bring myrtle and willow for the camp.',
    task:'Match the two requests in the letter to the plants.',
    routes:['Requested from Yehonatan and Masabala', 'Requested from Yehuda’s area'],
    plants:['Palm branches and citrons', 'Myrtle and willow'],
    match:'These plants match the request in the letter.',
    retry:'Who is asked to provide these plants in the letter? Try the other option.',
    question:'What does the letter establish about the camp?',
    choices:['Someone asked for the four species to be sent to the camp.', 'All four species reached the camp.'],
    correct:'The letter records a request. You would need another record to verify delivery.',
    incorrect:'You read the instructions given to Yehuda. The letter gives no record of the plants arriving.',
    context:'The letter does not name Sukkot. Leviticus 23:40 describes the use of plants at the festival. The Ashmolean Museum identifies a palm branch and a citron on the back of the coin. The Jerusalem Talmud, compiled in Late Antiquity, recounts that Rabbi Akiva saw Bar Kosiba as the messiah and that Rabbi Yohanan ben Torta disagreed.',
  },
  {
    letter:'132–135 לספירה. באיגרת בארמית שמעון בן כוסבה כותב ששלח ליהודה בן מנשה שני חמורים. הוא מורה ליהודה לשלוח אותם עם שני אנשים אל יהונתן בר בעיאן ומסבלה, כדי שיארזו וישלחו למחנה לולבים ואתרוגים. יהודה מתבקש גם לשלוח אנשים ממקומו להביא הדסים וערבות למחנה.',
    task:'התאימו את שתי הבקשות באיגרת לצמחים.',
    routes:['הבקשה ליהונתן ולמסבלה', 'הבקשה לאנשים ממקומו של יהודה'],
    plants:['לולבים ואתרוגים', 'הדסים וערבות'],
    match:'אלה הצמחים שנזכרים בבקשה הזאת באיגרת.',
    retry:'ממי ביקשו להביא את הצמחים האלה? נסו את האפשרות השנייה.',
    question:'מה אפשר ללמוד מהאיגרת על המחנה?',
    choices:['באיגרת ביקשו לשלוח את ארבעת המינים למחנה.', 'כל ארבעת המינים הגיעו למחנה.'],
    correct:'האיגרת מתעדת בקשה. כדי לאמת שהצמחים הגיעו למחנה צריך תיעוד נוסף.',
    incorrect:'קראתם את ההוראות שקיבל יהודה. האיגרת אינה מתעדת את הגעת הצמחים.',
    context:'האיגרת אינה מציינת את חג הסוכות. ויקרא כ״ג:מ׳ מתאר שימוש בצמחים בחג. מוזיאון אשמוליאן מזהה על גב המטבע דימויים של לולב ואתרוג. התלמוד הירושלמי, שנערך בעת העתיקה המאוחרת, מספר שרבי עקיבא ראה בבר כוסבה משיח ושרבי יוחנן בן תורתא חלק עליו.',
  },
  {
    letter:'Eramızın 132–135-ci illəri. Şimon ben Kosiba aramicə məktubda iki eşşəyi Yehuda ben Menaşeyə göndərdiyini yazır. O, eşşəkləri iki nəfərlə Yehonatan bar Beayan və Masabalaya göndərməyi tapşırır. Onlar xurma budaqları ilə etroqu (sitronu) qablaşdırıb düşərgəyə yollamalıdırlar. Yehuda olduğu yerdən başqa adamları düşərgə üçün mərsin və söyüd gətirməyə göndərməlidir.',
    task:'Məktubdakı iki tapşırığı müvafiq bitkilərlə uyğunlaşdır.',
    routes:['Yehonatan və Masabaladan istənilən', 'Yehudanın olduğu yerdən istənilən'],
    plants:['Xurma budaqları və etroq', 'Mərsin və söyüd'],
    match:'Bu bitkiləri məktubdakı tapşırıqla düzgün uyğunlaşdırdın.',
    retry:'Məktubda bu bitkiləri kimdən istəyirlər? O biri variantı yoxla.',
    question:'Məktub düşərgə haqqında hansı nəticəni çıxarmağa əsas verir?',
    choices:['Dörd növ bitkinin düşərgəyə göndərilməsi istənilib.', 'Dörd növ bitkinin hamısı düşərgəyə çatıb.'],
    correct:'Məktubda tapşırıq qeyd olunub. Bitkilərin çatdığını təsdiqləmək üçün başqa sənəd lazımdır.',
    incorrect:'Yehudaya verilən tapşırığı oxudun. Məktubda bitkilərin çatması barədə qeyd yoxdur.',
    context:'Məktub Sukot bayramının adını çəkmir. Levililər 23:40 bayramda bitkilərdən istifadəni təsvir edir. Ashmolean Muzeyi sikkənin arxa üzündəki təsvirləri xurma budağı və etroq kimi müəyyənləşdirir. Son Antik dövrdə tərtib olunmuş Yerusəlim Talmudu Rabbi Akivanın Bar Kosibanı məsih saydığını və Rabbi Yohanan ben Tortanın buna etiraz etdiyini nəql edir.',
  },
];

export function mountBarKosibaLetter(panel, locale, view) {
  const {letter, task, routes, plants, match, retry, question, choices, correct, incorrect, context} = copy[locale];
  const fragment = document.getElementById('bar-kosiba-letter-template').content.cloneNode(true);
  const [reading, instruction, canvas, requests, check, comparison, sources] = fragment.children;
  reading.textContent = letter;
  instruction.textContent = task;
  comparison.textContent = context;
  const showFrame = objectSprite(canvas,new URL('./assets/bar-kosiba-letter.png',import.meta.url),4);

  function setChoice(group, prompt, options, selection, feedbackFor, onSelect) {
    const [legend, controls, feedback] = group.children;
    legend.textContent = prompt;
    function update(selected) {
      for (const [index, button] of Array.from(controls.children).entries()) {
        button.setAttribute('aria-pressed',String(index === selected));
      }
      feedback.textContent = selected === undefined ? '' : feedbackFor(selected);
    }
    for (const [index, option] of options.entries()) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = option;
      button.addEventListener('click',() => {
        onSelect(index);
        update(index);
      });
      controls.append(button);
    }
    update(selection);
  }

  const answers = view.answers ??= [];
  function renderBaskets() {
    const firstMatched = answers[0] === 0;
    const secondMatched = answers[1] === 1;
    showFrame(Number(firstMatched) + 2 * Number(secondMatched));
    check.hidden = !firstMatched || !secondMatched;
  }

  for (const [index, group] of Array.from(requests.children).entries()) {
    setChoice(group,routes[index],plants,answers[index],
      selected => selected === index ? match : retry,
      selected => {
        answers[index] = selected;
        renderBaskets();
      });
  }
  setChoice(check,question,choices,view.response,selected => selected === 0 ? correct : incorrect,
    selected => { view.response = selected; });
  renderBaskets();
  for (const [url, label] of letterSources) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = label[locale];
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    item.append(link);
    sources.append(item);
  }
  panel.replaceChildren(fragment);
}
