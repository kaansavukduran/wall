import { chapters, languages } from './content.js';
import { appearanceKey, parseAppearance } from './appearance.js';
import { visitorBounds } from './world.js';

export const progressKey = 'wall.progress.v1';
const completionPrefix = 'wall.completed.v1.';
export const completionKey = id => completionPrefix + id;
export const isCampaignKey = key => key === progressKey || key?.startsWith(completionPrefix);
export const saveSchemaVersion = 1;
export const maxSaveLength = 500_000;
const format = 'WALL save';
const episodeIds = ['plaza',...chapters.map(chapter => String(chapter.id))];
const chapterIds = new Set(episodeIds);
const transferKey = /^wall\.transfer\.(?:[1-9]|1\d|2[0-4])\.(draft|solved)$/u;
const kabbalahKey = /^wall\.kabbalah\.[a-z0-9-]{1,80}$/u;
const tourChoiceKey = /^wall\.tour\.(?:[0-2]|question)$/u;
const tourSolvedKey = /^wall\.tour\.solved\.[a-z0-9-]{1,60}$/u;
const choiceValue = /^[a-z0-9-]{0,60}$/u;

function parseProgress(raw) {
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function validPlacement(value) {
  if (!Array.isArray(value) || value.length !== 2) return false;
  const [x, direction] = value;
  const [left, right] = visitorBounds;
  return Number.isInteger(x) && x >= left && x <= right && (direction === -1 || direction === 1);
}

function validProgress(raw) {
  const {active,completed,placement} = parseProgress(raw) ?? {};
  if (!chapterIds.has(active) || !Array.isArray(completed)
    || completed.length > episodeIds.length || completed.some(id => !chapterIds.has(id))
    || (placement !== undefined && !validPlacement(placement))) return null;
  return {active,completed:[...new Set(completed)],placement};
}

export function readCampaign(read, pending) {
  const stored = parseProgress(read(progressKey));
  const waiting = parseProgress(pending?.get(progressKey));
  const completed = new Set();
  for (const record of [stored,waiting]) {
    if (!Array.isArray(record?.completed)) continue;
    for (const id of record.completed) if (chapterIds.has(id)) completed.add(id);
  }
  // Set each completed episode independently so competing writes to the old
  // snapshot cannot erase a completion from another tab.
  for (const id of episodeIds) {
    if (completed.has(id)) continue;
    const key = completionKey(id);
    if (pending?.get(key) === '1' || read(key) === '1') completed.add(id);
  }
  const latest = [waiting,stored].find(record => chapterIds.has(record?.active));
  const active = latest?.active
    ?? (completed.size ? episodeIds.find(id => !completed.has(id)) ?? episodeIds.at(-1) : null);
  const placement = validPlacement(latest?.placement) ? latest.placement : undefined;
  return {active,completed,placement};
}

export function encodeCampaign(active, completed, placement) {
  return JSON.stringify({active,completed:episodeIds.filter(id => completed.has(id)),placement});
}

function validValue(key, value) {
  if (typeof value !== 'string') return false;
  if (key === progressKey) return value.length <= 512 && !!validProgress(value);
  if (key === 'wall.language') return languages.includes(value);
  if (key === appearanceKey) return value.length < 100 && parseAppearance(value) !== null;
  if (key === 'wall.journal') return value.length <= 2_000;
  if (kabbalahKey.test(key)) return value.length <= 1_200;
  if (tourChoiceKey.test(key)) return choiceValue.test(value);
  if (tourSolvedKey.test(key)) return value === '1';
  const transfer = key.match(transferKey);
  if (transfer?.[1] === 'draft') return value.length <= 1_200;
  return transfer?.[1] === 'solved' && value === 'true';
}

function snapshot(storage, pending) {
  const values = Object.create(null);
  const markers = Object.create(null);
  try {
    for (let index = 0; index < storage.length; index++) {
      const key = storage.key(index);
      if (!key?.startsWith('wall.')) continue;
      const value = storage.getItem(key);
      if (key.startsWith(completionPrefix)) markers[key] = value;
      else if (key === progressKey || validValue(key,value)) values[key] = value;
    }
  } catch (error) {
    if (!pending?.size) throw error;
  }
  const progress = readCampaign(key => key === progressKey ? values[key] : markers[key],pending);
  for (const [key,value] of pending ?? []) {
    if (key !== progressKey && validValue(key,value)) values[key] = value;
  }
  if (progress.active) values[progressKey] = encodeCampaign(progress.active,progress.completed,progress.placement);
  else delete values[progressKey];
  return values;
}

export function exportSave(storage, pending) {
  const values = snapshot(storage,pending);
  const encoded = JSON.stringify({format,version:saveSchemaVersion,values});
  if (encoded.length > maxSaveLength || Object.keys(values).length > 100) throw new Error('Save size');
  return encoded;
}

export function parseSave(text) {
  if (text.length > maxSaveLength) throw new Error('Save size');
  const data = JSON.parse(text);
  if (data?.format !== format || data.version !== saveSchemaVersion || !data.values
    || typeof data.values !== 'object' || Array.isArray(data.values)) throw new Error('Save version');
  const entries = Object.entries(data.values);
  if (!entries.length || entries.length > 100 || entries.some(([key,value]) => !validValue(key,value))) {
    throw new Error('Save data');
  }
  return data.values;
}

export function saveSummary(values) {
  const progress = validProgress(values[progressKey]);
  return {
    chapters:progress?.completed.filter(id => id !== 'plaza').length ?? 0,
    drafts:Object.keys(values).filter(key =>
      values[key] && (key === 'wall.journal' || kabbalahKey.test(key) || key.endsWith('.draft'))).length,
  };
}

export function mergeSave(storage, text) {
  const incoming = parseSave(text);
  const current = snapshot(storage);
  const merged = {...incoming,...current};
  // Filled local fields win. Empty notes and unselected questions can be restored.
  for (const [key,value] of Object.entries(incoming)) {
    if (!current[key]) merged[key] = value;
  }
  const incomingProgress = validProgress(incoming[progressKey]);
  if (incomingProgress) {
    const local = validProgress(current[progressKey]);
    const completed = new Set([...(local?.completed ?? []),...incomingProgress.completed]);
    const resume = local?.completed.length ? local : incomingProgress;
    merged[progressKey] = encodeCampaign(resume.active,completed,resume.placement);
  }

  const changed = Object.entries(merged).filter(([key,value]) => current[key] !== value);
  for (const id of incomingProgress?.completed ?? []) {
    const key = completionKey(id);
    if (storage.getItem(key) !== '1') changed.push([key,'1']);
  }
  const written = [];
  try {
    for (const [key,value] of changed) {
      const previous = storage.getItem(key);
      storage.setItem(key,value);
      written.push([key,previous]);
    }
  } catch (error) {
    for (const [key,previous] of written.reverse()) {
      if (previous === null) storage.removeItem(key);
      else storage.setItem(key,previous);
    }
    throw error;
  }
}
