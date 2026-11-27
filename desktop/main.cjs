const { app, BrowserWindow, protocol, shell } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

protocol.registerSchemesAsPrivileged([{
  scheme: 'wall',
  privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true },
}]);

const contentRoot = path.join(__dirname, 'site');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.tsv': 'text/tab-separated-values; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-src 'none'",
].join('; ');

function errorResponse(status, message) {
  return new Response(message, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

async function serveLocal(request) {
  if (!['GET', 'HEAD'].includes(request.method)) return errorResponse(405, 'Method not allowed');
  let url;
  try { url = new URL(request.url); } catch { return errorResponse(400, 'Bad request'); }
  if (url.protocol !== 'wall:' || url.hostname !== 'app') return errorResponse(403, 'Forbidden');

  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return errorResponse(400, 'Bad path'); }
  if (pathname === '/') pathname = '/index.html';
  if (pathname.includes('\\') || pathname.includes('\0')) return errorResponse(400, 'Bad path');
  const filePath = path.resolve(contentRoot, `.${pathname}`);
  if (filePath !== contentRoot && !filePath.startsWith(contentRoot + path.sep)) return errorResponse(403, 'Forbidden');
  if (!Object.hasOwn(mimeTypes, path.extname(filePath).toLowerCase())) return errorResponse(404, 'Not found');

  try {
    const info = await fs.stat(filePath);
    if (!info.isFile()) return errorResponse(404, 'Not found');
    const body = request.method === 'HEAD' ? null : await fs.readFile(filePath);
    return new Response(body, {
      headers: {
        'content-type': mimeTypes[path.extname(filePath).toLowerCase()],
        'content-security-policy': csp,
        'x-content-type-options': 'nosniff',
        'cache-control': 'no-store',
      },
    });
  } catch {
    return errorResponse(404, 'Not found');
  }
}

function isAppUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'wall:' && url.hostname === 'app';
  } catch {
    return false;
  }
}

function makeWindow() {
  const window = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 760,
    minHeight: 600,
    show: false,
    backgroundColor: '#121a22',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: !app.isPackaged,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') shell.openExternal(parsed.href);
    } catch {}
    return { action: 'deny' };
  });
  window.webContents.on('will-navigate', (event, url) => {
    if (!isAppUrl(url)) event.preventDefault();
  });
  window.webContents.on('will-attach-webview', event => event.preventDefault());
  window.once('ready-to-show', () => window.show());
  window.loadURL('wall://app/index.html');
  return window;
}

app.whenReady().then(() => {
  protocol.handle('wall', serveLocal);
  app.on('web-contents-created', (_event, contents) => {
    contents.session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  });
  makeWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) makeWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
