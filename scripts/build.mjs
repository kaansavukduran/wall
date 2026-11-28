import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const output = resolve(process.argv[2] ?? 'site');
await mkdir(output);
const files = [
  'index.html', 'style.css', 'start.js', 'game.js', 'world.js', 'content.js',
  'chapters-early.js', 'chapters-modern.js', 'ancient-lessons.js', 'library.js', 'scenes.js', 'catalogue.js', 'sequences.js', 'controller.js', 'assets',
];
for (const file of files) await cp(file, resolve(output, file), { recursive:true });
await mkdir(resolve(output, 'docs'));
await cp('docs/SOURCES.tsv', resolve(output, 'docs/SOURCES.tsv'));
const version = (await readFile('VERSION', 'utf8')).trim().replace(/^v/, '');
await writeFile(resolve(output, 'build.json'), JSON.stringify({
  version, commit: process.env.GITHUB_SHA ?? process.env.WALL_BUILD_COMMIT ?? null,
}) + '\n');
await writeFile(resolve(output, '.nojekyll'), '');
