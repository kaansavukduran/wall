import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { posix, resolve } from 'node:path';
import { languages } from '../content.js';
import { saveSchemaVersion } from '../save-data.js';

const output = resolve(process.argv[2] ?? 'site');
const version = (await readFile('VERSION', 'utf8')).trim().replace(/^v/, '');
const commit = process.env.WALL_BUILD_COMMIT ?? process.env.GITHUB_SHA ?? null;
const runtime = 'runtime-' + version + (commit ? '-' + commit.slice(0, 12) : '');
if ((commit && !/^[0-9a-f]{40}$/.test(commit)) || !/^runtime-\d+\.\d+\.\d+(?:-[0-9a-f]{12})?$/.test(runtime)) {
  throw new Error('Invalid WALL runtime version or commit');
}
await mkdir(output);
const runtimeRoot = resolve(output, runtime);
await mkdir(runtimeRoot);
const files = [
  'style.css', 'start.js', 'game.js', 'world.js', 'content.js',
  'chapters-early.js', 'chapters-modern.js', 'ancient-lessons.js', 'second-temple-lessons.js', 'roman-lessons.js', 'medieval-lessons.js',
  'early-modern-lessons.js', 'modern-lessons.js', 'source-timeline.js', 'messianic-lessons.js', 'press-lessons.js', 'displacement.js', 'displacement-lessons.js',
  'library.js', 'calendar.js', 'calendar-lessons.js', 'atlas.js', 'atlas-lessons.js',
  'kabbalah.js', 'kabbalah-lessons.js', 'kabbalah-advanced-lessons.js', 'kotel.js', 'kotel-lessons.js',
  'language-study.js', 'language-lessons.js', 'diaspora-archive.js', 'diaspora-lessons.js',
  'daily-life.js', 'daily-lessons.js', 'object-sprite.js',
  'culture-archive.js', 'culture-lessons.js',
  'accountability-archive.js', 'accountability-lessons.js',
  'talmud-page.js', 'talmud-lessons.js', 'geniza-desk.js', 'geniza-lessons.js',
  'portable-save.js', 'save-data.js',
  'appearance.js', 'study-circle.js', 'study-circle-lessons.js',
  'word-methods.js', 'word-method-lessons.js',
  'ashlag-workbench.js', 'ashlag-lessons.js', 'baku-archive.js', 'baku-lessons.js',
  'transfer.js', 'transfer-early-lessons.js', 'transfer-middle-lessons.js', 'transfer-late-lessons.js',
  'scenes.js', 'platform-assembly.js', 'catalogue.js', 'sequences.js', 'hebrew-labs.js', 'controller.js', 'tour.js', 'tour-evidence.js', 'assets',
];
const catalogue = 'docs/SOURCES.tsv';
const contentFiles = files.filter(name => name.endsWith('-lessons.js') || name.startsWith('chapters-'));
contentFiles.push('content.js','library.js','scenes.js','platform-assembly.js','sequences.js','hebrew-labs.js','tour-evidence.js');

async function fileRevision(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex');
}

async function groupRevision(files) {
  const indexed = [...files].sort();
  const hashes = await Promise.all(indexed.map(fileRevision));
  const ordered = indexed.map((name,index) => [name,hashes[index]]);
  return createHash('sha256').update(JSON.stringify(ordered)).digest('hex');
}

const artwork = (await readdir('assets', {recursive:true, withFileTypes:true}))
  .filter(asset => asset.isFile())
  .map(asset => posix.join(asset.parentPath.replaceAll('\\', '/'), asset.name));
const runtimeInputs = ['index.html', ...files.filter(file => file !== 'assets'), ...artwork];
const [planRevision,contentRevision,sourceCatalogueRevision,engineRevision] = await Promise.all([
  fileRevision('docs/PLAN.md'),groupRevision(contentFiles),fileRevision(catalogue),
  groupRevision(runtimeInputs),
]);
const manifest = {
  version, commit, runtime, planRevision, contentRevision, sourceCatalogueRevision,
  languages, saveSchema:saveSchemaVersion, engine:{name:'WALL Canvas 2D',revision:engineRevision},
};
for (const file of files) await cp(file, resolve(runtimeRoot, file), { recursive:true });
await mkdir(resolve(runtimeRoot, 'docs'));
await cp(catalogue, resolve(runtimeRoot, catalogue));
const html = (await readFile('index.html', 'utf8'))
  .replaceAll(/((?:src|href)=")\.\/(?=assets\/|start\.js"|style\.css")/g, '$1./' + runtime + '/');
await writeFile(resolve(output, 'index.html'), html);
await writeFile(resolve(output, 'build.json'), JSON.stringify(manifest) + '\n');
await writeFile(resolve(output, '.nojekyll'), '');
