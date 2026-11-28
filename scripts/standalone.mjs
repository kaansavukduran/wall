import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const site = resolve(process.argv[2] ?? 'site');
const output = resolve(process.argv[3] ?? 'WALL-Offline.html');
const temporary = await mkdtemp(resolve(tmpdir(), 'wall-offline-'));

async function embed(text, path, mime) {
  const payload = await readFile(resolve(site, path));
  return text.replaceAll(`./${path}`, `data:${mime};base64,${payload.toString('base64')}`);
}

try {
  for (const entry of ['start.js','game.js','world.js','content.js','controller.js','chapters-early.js',
    'chapters-modern.js','ancient-lessons.js','library.js','scenes.js','catalogue.js','sequences.js']) {
    await cp(resolve(site, entry), resolve(temporary, entry));
  }
  for (const [entry, path, mime] of [
    ['world.js','assets/visitor.png','image/png'],
    ['catalogue.js','docs/SOURCES.tsv','text/tab-separated-values;charset=utf-8'],
  ]) {
    const source = resolve(temporary, entry);
    await writeFile(source, await embed(await readFile(source, 'utf8'), path, mime));
  }
  execFileSync('npx', ['--yes','esbuild@0.25.12','start.js','--bundle','--format=esm','--minify','--charset=utf8',
    '--platform=browser','--target=es2022','--outfile=bundle.js'], { cwd:temporary,stdio:'inherit' });
  const bundle = (await readFile(resolve(temporary, 'bundle.js'), 'utf8')).replace(/<\/script/gi, '<\\/script');
  const css = await embed(await readFile(resolve(site, 'style.css'), 'utf8'), 'assets/PixelifySans.ttf', 'font/ttf');
  let html = await readFile(resolve(site, 'index.html'), 'utf8');
  html = await embed(html, 'assets/fragaria-strawberry.png', 'image/png');
  html = await embed(html, 'assets/matpc-14762.jpg', 'image/jpeg');
  html = html.replace('<link rel="stylesheet" href="./style.css">', () => '<style>' + css + '</style>');
  html = html.replace('<script type="module" src="./start.js"></script>', () => '<script type="module">' + bundle + '</script>');
  const notices = await Promise.all(['assets/PROVENANCE.md','assets/PIXELIFY-OFL.txt']
    .map(name => readFile(resolve(site, name), 'utf8')));
  html += '\n<!--\n' + notices.join('\n\n').replaceAll('-->', '-- >') + '\n-->\n';
  await writeFile(output, html);
} finally {
  await rm(temporary, { recursive:true,force:true });
}
