import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const desktop = fileURLToPath(new URL('.', import.meta.url));
const project = resolve(desktop, '..');
const app = resolve(desktop, '.build/app');
const packageInfo = JSON.parse(await readFile(resolve(desktop, 'package.json'), 'utf8'));
const version = (await readFile(resolve(project, 'VERSION'), 'utf8')).trim().replace(/^v/, '');
if (packageInfo.version !== version) {
  throw new Error(`Desktop version ${packageInfo.version} does not match WALL VERSION ${version}`);
}

await rm(app, { recursive:true, force:true });
await mkdir(app, { recursive:true });
const buildEnvironment = {...process.env};
if (!buildEnvironment.WALL_BUILD_COMMIT) {
  try {
    buildEnvironment.WALL_BUILD_COMMIT = execFileSync('git', ['rev-parse','--verify','HEAD'], {
      cwd:project,encoding:'utf8',stdio:['ignore','pipe','ignore'],
    }).trim();
  } catch {
    delete buildEnvironment.GITHUB_SHA;
  }
}
execFileSync(process.execPath, ['scripts/build.mjs', resolve(app, 'site')], {
  cwd:project,stdio:'inherit',env:buildEnvironment,
});
await cp(resolve(desktop, 'main.cjs'), resolve(app, 'main.cjs'));
await writeFile(resolve(app, 'package.json'), JSON.stringify({
  name:'wall-desktop-app',
  version,
  private:true,
  main:'main.cjs',
}, null, 2) + '\n');
