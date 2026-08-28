import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist/site');
const port = Number(process.env.PORT || 4173);
const types = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.zip', 'application/zip'],
]);

async function resolveFile(pathname) {
  const relative = normalize(decodeURIComponent(pathname)).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  const candidate = join(root, relative || 'index.html');
  try {
    const info = await stat(candidate);
    if (info.isDirectory()) return join(candidate, 'index.html');
    return candidate;
  } catch {
    return undefined;
  }
}

createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;
  const file = await resolveFile(pathname);
  const target = file || join(root, '404.html');
  response.statusCode = file ? 200 : 404;
  response.setHeader('Content-Type', types.get(extname(target)) || 'application/octet-stream');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (request.method === 'HEAD') return response.end();
  createReadStream(target).pipe(response);
}).listen(port, '127.0.0.1');
