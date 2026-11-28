export const deskCopy = [
  ['Geniza, yazılı belgelerin saklandığı bir yerdi. Kahire’deki Geniza’da bu iki aile mektubu da korundu. Çizimler belgeyi okumaya yardımcı olan temsillerdir.', 'A geniza was a place to store written documents. These two family letters survived in the Cairo Geniza. The drawings are teaching illustrations.', 'גניזה הייתה מקום לשמירת כתבים. שני המכתבים המשפחתיים האלה השתמרו בגניזה הקהירית. האיורים נועדו לסייע בקריאה.', 'Geniza yazılı sənədlərin saxlandığı yer idi. Bu iki ailə məktubu Qahirə Genizasında qorunub. Şəkillər sənədi oxumağa kömək edən təsvirlərdir.'],
  ['Mektubu çevir', 'Turn the letter over', 'הפכו את המכתב', 'Məktubu çevir'],
  ['Ön yüze dön', 'Return to the front', 'חזרו לצד הקדמי', 'Ön üzə qayıt'],
  ['Arşiv kaydını aç', 'Open the archive record', 'פתחו את רשומת הארכיון', 'Arxiv qeydini aç'],
  ['Arka yüzdeki bilgiyi yeniden oku.', 'Read the information on the back again.', 'קראו שוב את המידע בצד האחורי.', 'Arxa üzdəki məlumatı yenidən oxu.'],
  ['Mektubu seç', 'Choose a letter', 'בחרו מכתב', 'Məktubu seç'],
];

export const genizaLetters = [{
  id:'ena-2558-10',
  url:'https://geniza.princeton.edu/en/documents/6592/',
  title:['1158 · Anneye mektup', '1158 · A letter to a mother', '1158 · מכתב לאם', '1158 · Anaya məktub'],
  front:[
    '15 Haziran 1158. Berahot, Būş’tan annesine yazıyor. Şabat ve bayramlarda giymek üzere keten bir giysi diktirmek istiyor. Bayramdan sonra Fustat’a gitmeyi umduğunu da söylüyor.',
    '15 June 1158. Berakhot writes to his mother from Būsh. He wants a linen garment to wear on Shabbat and festivals. He also hopes to go to Fustat after the holiday.',
    '15 ביוני 1158. ברכות כותב מבוש לאמו. הוא מבקש בגד פשתן לשבת ולחגים ומקווה לנסוע לפוסטאט אחרי החג.',
    '15 iyun 1158. Beraxot Būşdan anasına yazır. Şabat və bayramlarda geyinmək üçün kətan paltar istəyir. Bayramdan sonra Fustata getməyə də ümid edir.',
  ],
  back:[
    'Arka yüzdeki adres İskenderiye’nin kuyumcular çarşısını ve mektubu iletecek kişiyi gösterir. Adres hem Yahudi Arapçasıyla hem Arap harfleriyle yazılmıştır.',
    'The address on the back gives the goldsmiths’ market in Alexandria and names the person who should forward the letter. It appears in Judeo-Arabic and in Arabic script.',
    'בצד האחורי מצוינים שוק הצורפים באלכסנדריה ושמו של מי שאמור להעביר את המכתב. הכתובת נכתבה בערבית יהודית ובכתב ערבי.',
    'Arxa üzdəki ünvan İsgəndəriyyədə zərgərlər bazarını və məktubu çatdırmalı olan şəxsi göstərir. Ünvan həm yəhudi ərəbcəsində, həm ərəb əlifbası ilə yazılıb.',
  ],
  prompt:['Mektubun adresi hangi kenti gösteriyor?', 'Which city does the address name?', 'איזו עיר מופיעה בכתובת?', 'Məktubun ünvanı hansı şəhəri göstərir?'],
  options:[
    ['Fustat', 'Fustat', 'פוסטאט', 'Fustat'],
    ['İskenderiye', 'Alexandria', 'אלכסנדריה', 'İsgəndəriyyə'],
    ['Kudüs', 'Jerusalem', 'ירושלים', 'Qüds'],
  ],
  correct:1,
  result:[
    'Būş → İskenderiye. İki yer, gönderenin bulunduğu yeri ve mektubun adresini gösterir. Mektubun gerçekten teslim edilip edilmediği bu kayıttan bilinmiyor. Fustat, gönderenin gelecek planında geçer.',
    'Būsh → Alexandria. These are the sender’s location and the letter’s address. The record leaves actual delivery open. Fustat appears in the sender’s plans.',
    'מבוש לאלכסנדריה. בוש היא מקום השולח ואלכסנדריה היא יעד המכתב. אין ברשומה מידע על מסירה בפועל. פוסטאט מופיעה בתוכניותיו של השולח.',
    'Būş → İsgəndəriyyə. Bunlar göndərənin olduğu yer və məktubun ünvanıdır. Məktubun həqiqətən çatdırılıb-çatdırılmadığı məlum deyil. Fustat göndərənin gələcək planında keçir.',
  ],
}, {
  id:'ts-12-203',
  url:'https://geniza.princeton.edu/en/documents/19917/',
  title:['1167–1170 civarı · Kardeşe mektup', 'Around 1167–1170 · A letter to a brother', 'סביב 1167–1170 · מכתב לאח', 'Təxminən 1167–1170 · Qardaşa məktub'],
  front:[
    'Yazar ayrılığın kendisini üzdüğünü söylüyor. Kardeşiyle Eski Kahire’de yeniden buluşmayı diliyor. Belgenin dili İbranice ve Yahudi Arapçası olarak kaydedilmiş.',
    'The writer is saddened by the separation. He hopes to see his brother again in Old Cairo. The archive records Hebrew and Judeo-Arabic as the languages of the letter.',
    'הכותב מספר על צער הפרידה ומקווה לראות שוב את אחיו בקהיר העתיקה. שפות המכתב הרשומות בארכיון הן עברית וערבית יהודית.',
    'Müəllif ayrılıqdan kədərləndiyini və qardaşı ilə Köhnə Qahirədə yenidən görüşməyə ümid etdiyini yazır. Arxiv məktubun dillərini ivrit və yəhudi ərəbcəsi kimi qeyd edir.',
  ],
  back:[
    'Katalog mektubu Maimonides’e, muhtemel alıcıyı da kardeşi David’e bağlar. 1167–1170 bir tarih tahminidir. Yazı Maimonides’in eliyle yazılmamış; imzanın ona ait olması ise olası.',
    'The catalogue attributes the letter to Maimonides and identifies his brother David as the likely recipient. It estimates 1167–1170 as the date. Someone else wrote the text, though the signature might be Maimonides’s.',
    'הקטלוג מייחס את המכתב לרמב״ם ומזהה את אחיו דוד בתור הנמען הסביר. התיארוך ל־1167–1170 משוער. גוף המכתב נכתב בידי אדם אחר, וייתכן שהחתימה היא של הרמב״ם.',
    'Kataloq məktubu Maimonidesə aid edir və ehtimal olunan alıcını onun qardaşı David kimi göstərir. 1167–1170 təxmini tarixdir. Mətn başqa adamın xətti ilə yazılıb, imza isə Maimonidesə aid ola bilər.',
  ],
  prompt:['Eski Kahire bu kayıtta nasıl geçiyor?', 'How does Old Cairo appear in this record?', 'באיזה הקשר מוזכרת קהיר העתיקה?', 'Köhnə Qahirə bu qeyddə necə keçir?'],
  options:[
    ['Teslimatın tamamlandığı yer', 'A place where delivery was completed', 'מקום שבו המכתב נמסר', 'Çatdırılmanın başa çatdığı yer'],
    ['Kesin gönderim adresi', 'A confirmed mailing address', 'כתובת משלוח ודאית', 'Təsdiqlənmiş göndəriş ünvanı'],
    ['Yeniden buluşma umudu', 'A hope of reunion', 'תקווה למפגש מחדש', 'Yenidən görüşmək ümidi'],
  ],
  correct:2,
  result:[
    'Eski Kahire, yazarın kardeşiyle buluşmayı umduğu yer. Buraya bir mektup güzergâhı çizmek için gönderim veya teslimat kaydı gerekir.',
    'Old Cairo is where the writer hopes to see his brother. A route on the map would require evidence of posting or delivery.',
    'קהיר העתיקה היא המקום שבו הכותב מקווה לפגוש את אחיו. כדי לסמן מסלול על המפה דרוש תיעוד של משלוח או מסירה.',
    'Köhnə Qahirə müəllifin qardaşı ilə görüşməyə ümid etdiyi yerdir. Xəritədə marşrut çəkmək üçün göndəriş və ya çatdırılma sənədi lazımdır.',
  ],
}];
