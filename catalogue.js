let load;

export function parseCatalogue(text) {
  const entries = [];
  for (const line of text.trim().split(/\r?\n/).slice(1)) {
    const [id, era, chapters, title, type, topic, url, status] = line.split('\t');
    if (![id, era, chapters, title, type, topic, url, status].every(Boolean)) continue;
    if (!url.startsWith('https://')) continue;
    entries.push({id, era, chapters, title, type, topic, url, status});
  }
  return entries;
}

export function belongsTo(entry, chapter) {
  return entry.chapters.split(',').some(token => {
    const part = token.trim();
    if (chapter === 0) return part === 'Prolog';
    const [start, end = start] = part.split(/[–-]/).map(Number);
    return start <= chapter && chapter <= end;
  });
}

export async function catalogue() {
  load ??= fetch(new URL('./docs/SOURCES.tsv', import.meta.url)).then(response => {
    if (!response.ok) throw new Error('Source catalogue unavailable');
    return response.text();
  }).then(parseCatalogue).catch(error => {
    load = undefined;
    throw error;
  });
  return load;
}

export const catalogueLabels = {
  tr:['İlgili kaynak kataloğu','Kaynaklar yükleniyor…','Katalog açılamadı. Ana kaynak yukarıda.','Bu bölüm için ek kayıt yok.'],
  en:['Related source catalogue','Loading the catalogue…','The catalogue could not open. The main source is above.','No additional entries for this chapter.'],
  he:['קטלוג מקורות קשורים','הקטלוג נטען…','לא ניתן לפתוח את הקטלוג. המקור העיקרי נמצא למעלה.','אין רשומות נוספות לפרק הזה.'],
  az:['Əlaqəli mənbə kataloqu','Kataloq yüklənir…','Kataloq açıla bilmədi. Əsas mənbə yuxarıdadır.','Bu bölmə üçün əlavə qeyd yoxdur.'],
};
