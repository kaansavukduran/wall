import { planSaveMerge, writeSaveEntries } from './save-data.js';

const owner = new URLSearchParams(location.search).get('wall-process');
const receiptKey = 'wall.android.transfer-receipt';
const journalKey = 'pending';

function openJournal() {
  return new Promise((resolve,reject) => {
    const opening = indexedDB.open('wall-android-transfer',1);
    opening.onupgradeneeded = () => opening.result.createObjectStore('transfer');
    opening.onsuccess = () => resolve(opening.result);
    opening.onerror = () => reject(opening.error);
  });
}

function journalOperation(db, mode, operation) {
  return new Promise((resolve,reject) => {
    const transaction = db.transaction('transfer',mode,{durability:'strict'});
    const request = operation(transaction.objectStore('transfer'));
    transaction.oncomplete = () => resolve(request.result);
    transaction.onabort = () => reject(transaction.error);
  });
}

export async function importAndroidSave(storage, text) {
  const {changed,snapshot} = planSaveMerge(storage,text);
  if (!changed.length) return;
  const receipt = crypto.getRandomValues(new Uint32Array(4)).join('-');
  const db = await openJournal();
  try {
    const previous = await journalOperation(db,'readonly', store => store.get(journalKey));
    await journalOperation(db,'readwrite', store => store.put({owner,receipt,snapshot},journalKey));
    try {
      writeSaveEntries(storage,[...changed,[receiptKey,receipt]]);
    } catch (error) {
      await journalOperation(db,'readwrite', store =>
        previous ? store.put(previous,journalKey) : store.delete(journalKey));
      throw error;
    }
  } finally {
    db.close();
  }
}

export async function recoverAndroidSave(storage) {
  const db = await openJournal();
  try {
    const pending = await journalOperation(db,'readonly', store => store.get(journalKey));
    if (!pending) return false;
    if (storage.getItem(receiptKey) === pending.receipt) {
      // A new Android process can see the receipt only after WebView persisted it.
      if (owner !== pending.owner) {
        await journalOperation(db,'readwrite', store => store.delete(journalKey));
      }
      return false;
    }
    await journalOperation(db,'readwrite', store => store.put({...pending,owner},journalKey));
    writeSaveEntries(storage,[...pending.snapshot,[receiptKey,pending.receipt]]);
    return true;
  } finally {
    db.close();
  }
}
