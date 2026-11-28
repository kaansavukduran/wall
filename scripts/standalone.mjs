import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const site = resolve(process.argv[2] ?? 'site');
const output = resolve(process.argv[3] ?? 'WALL-Offline.html');
const manifest = JSON.parse(await readFile(resolve(site, 'build.json'), 'utf8'));
const {runtime} = manifest;
if (runtime && !/^runtime-\d+\.\d+\.\d+(?:-[0-9a-f]{12})?$/.test(runtime)) {
  throw new Error('Invalid WALL runtime directory');
}
const runtimeRoot = resolve(site, runtime ?? '.');
const htmlPrefix = runtime ? './' + runtime + '/' : './';
const temporary = await mkdtemp(resolve(tmpdir(), 'wall-offline-'));

async function embed(text, path, mime, prefix = './') {
  const payload = await readFile(resolve(runtimeRoot, path));
  return text.replaceAll(prefix + path, `data:${mime};base64,${payload.toString('base64')}`);
}

try {
  const files = (await readdir(runtimeRoot, {withFileTypes:true})).filter(entry => entry.isFile())
    .map(entry => entry.name).filter(name => name.endsWith('.js'));
  for (const name of files) {
    await cp(resolve(runtimeRoot, name), resolve(temporary, name));
  }
  for (const [entry, path, mime] of [
    ['world.js','assets/visitor.png','image/png'],
    ['atlas.js','assets/atlas-land.png','image/png'],
    ['kotel.js','assets/kotel-props.png','image/png'],
    ['daily-life.js','assets/daily-props.png','image/png'],
    ['culture-archive.js','assets/culture-objects.png','image/png'],
    ['geniza-desk.js','assets/geniza-letters.png','image/png'],
    ['study-circle.js','assets/study-circle.png','image/png'],
    ['baku-archive.js','assets/baku-archive.png','image/png'],
    ['first-fruits.js','assets/first-fruits.png','image/png'],
    ['catalogue.js','docs/SOURCES.tsv','text/tab-separated-values;charset=utf-8'],
  ]) {
    if (!files.includes(entry)) continue;
    const source = resolve(temporary, entry);
    await writeFile(source, await embed(await readFile(source, 'utf8'), path, mime));
  }
  execFileSync('npx', ['--yes','esbuild@0.25.12','start.js','--bundle','--format=esm','--minify','--charset=utf8',
    '--platform=browser','--target=es2022','--outfile=bundle.js'], { cwd:temporary,stdio:'inherit' });
  const bundle = (await readFile(resolve(temporary, 'bundle.js'), 'utf8')).replace(/<\/script/gi, '<\\/script');
  const css = await embed(await readFile(resolve(runtimeRoot, 'style.css'), 'utf8'), 'assets/PixelifySans.ttf', 'font/ttf');
  let html = await readFile(resolve(site, 'index.html'), 'utf8');
  html = await embed(html, 'assets/fragaria-strawberry.png', 'image/png', htmlPrefix);
  html = await embed(html, 'assets/matpc-14762.jpg', 'image/jpeg', htmlPrefix);
  html = html.replace('<link rel="stylesheet" href="' + htmlPrefix + 'style.css">', () => '<style>' + css + '</style>');
  html = html.replace('<script type="module" src="' + htmlPrefix + 'start.js"></script>', () => '<script type="module">' + bundle + '</script>');
  const buildInfo = JSON.stringify(manifest).replaceAll('<','\\u003c');
  html = html.replace('</body>', () => '<script type="application/json" id="wall-build">' + buildInfo + '</script>\n</body>');
  const notices = await Promise.all(['assets/PROVENANCE.md','assets/PIXELIFY-OFL.txt']
    .map(name => readFile(resolve(runtimeRoot, name), 'utf8')));
  html += '\n<!--\n' + notices.join('\n\n').replaceAll('-->', '-- >') + '\n-->\n';
  await writeFile(output, html);
} finally {
  await rm(temporary, { recursive:true,force:true });
}
