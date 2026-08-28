import { cp, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const downloads = 'dist/site/downloads';
await mkdir(downloads, { recursive: true });
const candidates = await readdir('.output', { recursive: true }).catch(() => []);
const zip = candidates.find((name) => name.endsWith('.zip'));
if (zip) await cp(join('.output', zip), join(downloads, 'bookmark-proofbook-extension.zip'));
