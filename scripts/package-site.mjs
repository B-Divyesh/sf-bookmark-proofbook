import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const siteRoot = 'dist/site';
const baseHtml = await readFile(join(siteRoot, 'index.html'), 'utf8');
const routes = [
  { path: 'demo', title: 'Demo — Bookmark Proofbook' },
  { path: 'app', title: 'My proofbook — Bookmark Proofbook' },
  { path: 'privacy', title: 'Privacy — Bookmark Proofbook' },
  { path: 'terms', title: 'Terms — Bookmark Proofbook' },
];

for (const route of routes) {
  const directory = join(siteRoot, route.path);
  const canonical = `https://bookmark-proofbook.sociobot.in/${route.path}`;
  const html = baseHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), html);
}

const downloads = join(siteRoot, 'downloads');
await mkdir(downloads, { recursive: true });
const candidates = await readdir('.output');
const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const zip = `bookmark-proofbook-${packageJson.version}-chrome.zip`;
if (!candidates.includes(zip)) throw new Error(`The expected Chrome MV3 extension zip was not produced: ${zip}`);
await copyFile(join('.output', zip), join(downloads, 'bookmark-proofbook-extension.zip'));
