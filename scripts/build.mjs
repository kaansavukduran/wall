import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const output = resolve(process.argv[2] ?? 'site');
const version = (await readFile('VERSION', 'utf8')).trim().replace(/^v/, '');
const commit = process.env.GITHUB_SHA ?? process.env.WALL_BUILD_COMMIT ?? null;
const runtime = 'runtime-' + version + (commit ? '-' + commit.slice(0, 12) : '');
if (!/^runtime-\d+\.\d+\.\d+(?:-[0-9a-f]{12})?$/.test(runtime)) {
  throw new Error('Invalid WALL runtime version or commit');
}
await mkdir(output);
const runtimeRoot = resolve(output, runtime);
await mkdir(runtimeRoot);
const files = [
  'style.css', 'start.js', 'game.js', 'world.js', 'content.js',
  'chapters-early.js', 'chapters-modern.js', 'ancient-lessons.js', 'second-temple-lessons.js', 'roman-lessons.js', 'medieval-lessons.js',
  'early-modern-lessons.js', 'modern-lessons.js',
  'library.js', 'calendar.js', 'calendar-lessons.js', 'atlas.js', 'atlas-lessons.js',
  'scenes.js', 'catalogue.js', 'sequences.js', 'hebrew-labs.js', 'controller.js', 'assets',
];
for (const file of files) await cp(file, resolve(runtimeRoot, file), { recursive:true });
await mkdir(resolve(runtimeRoot, 'docs'));
await cp('docs/SOURCES.tsv', resolve(runtimeRoot, 'docs/SOURCES.tsv'));
const html = (await readFile('index.html', 'utf8'))
  .replaceAll(/((?:src|href)=")\.\/(?=assets\/|start\.js"|style\.css")/g, '$1./' + runtime + '/');
await writeFile(resolve(output, 'index.html'), html);
await writeFile(resolve(output, 'build.json'), JSON.stringify({version, commit, runtime}) + '\n');
await writeFile(resolve(output, '.nojekyll'), '');
