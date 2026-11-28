import { exportSave, mergeSave, parseSave, saveSummary } from './save-data.js';

const copy = {
  tr:{
    export:'Kayıt metni oluştur', exported:'Kopyalanacak kayıt', copy:'Kopyala',
    import:'Kayıt metnini yapıştır', review:'Kaydı incele', restore:'Kayıtları birleştir',
    invalid:'Kayıt metni geçersiz veya bu sürümle uyumsuz.',
    failed:'Tarayıcı kayda erişemedi. Mevcut kaydını koru ve tekrar dene.',
    copied:'Kayıt kopyalandı.', selected:'Metin seçildi. Cihazının Kopyala komutunu kullan.',
    private:'Metin, ilerlemeni ve yazdığın taslakları içerebilir. Bir kopyasını kendine sakla.',
    preview:(done,drafts) => `Gelen kayıtta ${done} tamamlanmış bölüm ve ${drafts} taslak var. Bu cihazdaki dolu taslaklar korunur.`,
  },
  en:{
    export:'Create save text', exported:'Save text to copy', copy:'Copy',
    import:'Paste save text', review:'Review the save', restore:'Merge saves',
    invalid:'The save text is invalid or incompatible with this version.',
    failed:'The app could not access storage. Keep your existing save and try again.',
    copied:'Save copied.', selected:'The text is selected. Use your device’s Copy command.',
    private:'This text may include your progress and drafts. Keep a copy for yourself.',
    preview:(done,drafts) => `The incoming save has ${done} completed chapters and ${drafts} drafts. Drafts on this device will be kept.`,
  },
  he:{
    export:'צרו טקסט שמירה', exported:'טקסט שמירה להעתקה', copy:'העתקה',
    import:'הדביקו טקסט שמירה', review:'בדקו את השמירה', restore:'מזגו שמירות',
    invalid:'טקסט השמירה פגום או אינו מתאים לגרסה זו.',
    failed:'לא ניתן לגשת לשמירה במכשיר. שמרו את העותק הקיים ונסו שוב.',
    copied:'השמירה הועתקה.', selected:'הטקסט סומן. השתמשו בפקודת ההעתקה של המכשיר.',
    private:'הטקסט עשוי לכלול את ההתקדמות והטיוטות שלכם. שמרו עותק אצלכם.',
    preview:(done,drafts) => `בשמירה שהתקבלה: ${done} פרקים שהושלמו ו־${drafts} טיוטות. הטיוטות במכשיר הזה יישמרו.`,
  },
  az:{
    export:'Yaddaş mətni yarat', exported:'Köçürüləcək yaddaş mətni', copy:'Köçür',
    import:'Yaddaş mətnini yapışdır', review:'Yaddaşı yoxla', restore:'Yaddaşları birləşdir',
    invalid:'Yaddaş mətni etibarsızdır və ya bu versiyaya uyğun deyil.',
    failed:'Tətbiq yaddaşa daxil ola bilmədi. Mövcud qeydi saxla və yenidən sına.',
    copied:'Yaddaş mətni köçürüldü.', selected:'Mətn seçilib. Cihazın Köçür əmrindən istifadə et.',
    private:'Mətndə irəliləyiş və yazdığın qaralamalar ola bilər. Bir nüsxəni özündə saxla.',
    preview:(done,drafts) => `Gələn yaddaşda ${done} tamamlanmış bölmə və ${drafts} qaralama var. Cihazdakı qaralamalar qorunur.`,
  },
};

export function mountPortableSave(panel, language, pending, retryPending) {
  const fragment = document.getElementById('save-template').content.cloneNode(true);
  const [outgoing, incoming, status] = fragment.children;
  const [exportButton, out, privacy] = outgoing.children;
  const [outLabel, outText, copyButton] = out.children;
  const [inLabel,inText,review,confirm] = incoming.children;
  const labels = copy[language];
  const numbers = new Intl.NumberFormat(language);
  let approvedText = '';

  exportButton.textContent = labels.export;
  outLabel.textContent = labels.exported;
  copyButton.textContent = labels.copy;
  privacy.textContent = labels.private;
  inLabel.textContent = labels.import;
  review.textContent = labels.review;
  confirm.textContent = labels.restore;

  exportButton.addEventListener('click', () => {
    try {
      let storage;
      try { storage = localStorage; } catch { /* Export the open session if storage is blocked. */ }
      outText.value = exportSave(storage,pending);
      out.hidden = false;
      privacy.hidden = false;
      status.textContent = '';
      outText.focus();
    } catch {
      status.textContent = labels.failed;
    }
  });
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(outText.value);
      status.textContent = labels.copied;
    } catch {
      outText.focus();
      outText.select();
      status.textContent = labels.selected;
    }
  });

  inText.addEventListener('input', () => {
    approvedText = '';
    confirm.hidden = true;
    status.textContent = '';
  });
  review.addEventListener('click', () => {
    try {
      const counts = saveSummary(parseSave(inText.value));
      approvedText = inText.value;
      confirm.hidden = false;
      status.textContent = labels.preview(numbers.format(counts.chapters),numbers.format(counts.drafts));
    } catch {
      approvedText = '';
      confirm.hidden = true;
      status.textContent = labels.invalid;
    }
  });
  confirm.addEventListener('click', () => {
    if (!approvedText || approvedText !== inText.value) return;
    if (pending.size && !retryPending()) {
      status.textContent = labels.failed;
      return;
    }
    try {
      mergeSave(localStorage,approvedText);
    } catch {
      status.textContent = labels.failed;
      return;
    }
    const url = location.href.split('#')[0];
    history.replaceState({ ...history.state, wallRestored:true },'',url);
    location.reload();
  });

  panel.replaceChildren(fragment);
}
