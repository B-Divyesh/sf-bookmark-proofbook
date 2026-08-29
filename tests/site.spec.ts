import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { exportJson, sampleRecords } from '../src/proofbook';

function recordExternalRequests(page: import('@playwright/test').Page) {
  const external: string[] = [];
  page.on('request', (request) => {
    const { hostname } = new URL(request.url());
    if (hostname !== '127.0.0.1' && hostname !== 'localhost') external.push(request.url());
  });
  return external;
}

test('@claim:demo-namespace loads an isolated sample workspace without external requests', async ({ page }) => {
  const external = recordExternalRequests(page);
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Find a saved reason' })).toBeVisible();
  await expect(page.locator('#count')).toHaveText('(3)');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('demo:bookmark-proofbook:records'))).not.toBeNull();
  await page.locator('article[data-id="sample-sqlite"]').getByRole('button', { name: 'Remove' }).click();
  await expect(page.locator('#count')).toHaveText('(2)');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#count')).toHaveText('(3)');
  await page.getByRole('link', { name: 'Open my proofbook' }).click();
  await expect(page).toHaveURL('/app');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('demo:bookmark-proofbook:records'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('proofbook:records'))).toBeNull();
  await expect.poll(() => external).toEqual([]);
});

test('@claim:no-account-required creates and exports a demo record without authentication or external requests', async ({ page }) => {
  const external = recordExternalRequests(page);
  await page.goto('/demo');
  await page.getByLabel('Page URL').fill('https://example.com/research');
  await page.getByLabel('Page title').fill('A local research note');
  await page.getByLabel('Why did this matter?').fill('Prove this works without signing in.');
  await page.getByRole('button', { name: 'Save this bookmark' }).click();
  await expect(page.locator('#count')).toHaveText('(4)');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  expect((await download).suggestedFilename()).toBe('bookmark-proofbook.json');
  expect(external).toEqual([]);
});

test('@claim:save-bookmark-context stores the reason, selected words, extract, and its stable code', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Page URL').fill('https://example.com/context');
  await page.getByLabel('Page title').fill('Context record');
  await page.getByLabel('Why did this matter?').fill('Keep the release decision beside this source.');
  await page.getByLabel('Selected words').fill('The selected words explain the decision.');
  await page.getByLabel('Small page extract').fill('The small page extract gives later context.');
  await page.getByRole('button', { name: 'Save this bookmark' }).click();
  await expect(page.getByRole('heading', { name: 'Context record' })).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('demo:bookmark-proofbook:records') || '[]')[0]);
  expect(stored.reason).toContain('release decision');
  expect(stored.selectedText).toContain('selected words');
  expect(stored.extract).toContain('small page extract');
  expect(stored.contentHash).toMatch(/^[a-f0-9]{8}$/);
});

test('@claim:one-click-demo opens the isolated sample proofbook from the landing page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.locator('#count')).toHaveText('(3)');
  const firstSample = page.locator('article[data-id="sample-sqlite"]');
  const box = await firstSample.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(844);
  expect(box!.y + box!.height).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('demo:bookmark-proofbook:records'))).not.toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('proofbook:records'))).toBeNull();
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('demo:bookmark-proofbook:records'))).toBeNull();
});

test('@claim:local-records captures, searches, and exports without sending records to a service', async ({ page }) => {
  const external = recordExternalRequests(page);
  await page.goto('/app');
  await page.getByLabel('Page URL').fill('https://example.com/local-only');
  await page.getByLabel('Page title').fill('Local record');
  await page.getByLabel('Why did this matter?').fill('Searchable local context.');
  await page.getByRole('button', { name: 'Save this bookmark' }).click();
  await page.getByLabel('Search your proofbook').fill('searchable');
  await expect(page.getByRole('heading', { name: 'Local record' })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export HTML' }).click();
  expect((await download).suggestedFilename()).toBe('bookmark-proofbook.html');
  expect(external).toEqual([]);
});

test('@claim:no-record-sync keeps a saved record in local storage without a service request', async ({ page }) => {
  const external = recordExternalRequests(page);
  await page.goto('/app');
  await page.getByLabel('Page URL').fill('https://example.com/private-note');
  await page.getByLabel('Page title').fill('Private local note');
  await page.getByLabel('Why did this matter?').fill('Check that no record is sent away.');
  await page.getByRole('button', { name: 'Save this bookmark' }).click();
  await expect(page.locator('#count')).toHaveText('(1)');
  await expect.poll(() => external).toEqual([]);
  const stored = await page.evaluate(() => localStorage.getItem('proofbook:records'));
  expect(stored).toContain('Private local note');
});

test('@claim:offline-session keeps an opened demo workspace usable when the connection drops', async ({ page, context }) => {
  await page.goto('/demo');
  await context.setOffline(true);
  await page.getByLabel('Search your proofbook').fill('keyboard');
  await expect(page.getByRole('heading', { name: 'How to Meet WCAG 2.2' })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export HTML' }).click();
  expect((await download).suggestedFilename()).toBe('bookmark-proofbook.html');
  await context.setOffline(false);
});

test('@claim:search-saved-context finds demo evidence by a saved reason', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Search your proofbook').fill('keyboard');
  await expect(page.getByRole('heading', { name: 'How to Meet WCAG 2.2' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Appropriate Uses For SQLite' })).toHaveCount(0);
});

test('uses bookmark consistently for saved items and proofbook for the collection', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Saved bookmarks (3)' })).toBeVisible();
  await page.getByLabel('Search your proofbook').fill('no bookmark matches this');
  await expect(page.getByRole('heading', { name: 'No saved bookmarks match that search' })).toBeVisible();
  await page.goto('/app');
  await expect(page.getByRole('heading', { name: 'Your saved bookmarks will appear here' })).toBeVisible();
  const readme = await readFile('README.md', 'utf8');
  expect(readme).toContain('your proofbook at `/app`');
  expect(readme.toLowerCase()).not.toContain('workspace');
  expect(readme.toLowerCase()).not.toContain('saved evidence');
  expect(readme.toLowerCase()).not.toContain('saved notes');
});

test('@claim:portable-export downloads a readable standalone proofbook', async ({ page }) => {
  await page.goto('/demo');
  const htmlDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export HTML' }).click();
  const htmlFile = await htmlDownload;
  expect(htmlFile.suggestedFilename()).toBe('bookmark-proofbook.html');
  const html = await readFile((await htmlFile.path())!, 'utf8');
  expect(html).toContain('<!doctype html>');
  expect(html).toContain('Appropriate Uses For SQLite');
  expect(html).not.toContain('<script');
  const jsonDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const jsonFile = await jsonDownload;
  expect(jsonFile.suggestedFilename()).toBe('bookmark-proofbook.json');
  const json = JSON.parse(await readFile((await jsonFile.path())!, 'utf8'));
  expect(json.records).toHaveLength(3);
});

test('@claim:no-analytics performs a complete site workflow without analytics or third-party requests', async ({ page }) => {
  const external = recordExternalRequests(page);
  await page.goto('/demo');
  await page.getByLabel('Search your proofbook').fill('database');
  await expect(page.getByRole('heading', { name: 'Appropriate Uses For SQLite' })).toBeVisible();
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page.getByRole('heading', { name: 'Privacy for saved bookmarks' })).toBeVisible();
  expect(external).toEqual([]);
});

test('@claim:reversible-delete removes a record and restores it with undo', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('article[data-id="sample-sqlite"]').getByRole('button', { name: 'Remove' }).click();
  await expect(page.locator('#count')).toHaveText('(2)');
  await expect(page.getByRole('heading', { name: 'Appropriate Uses For SQLite' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Undo remove' }).click();
  await expect(page.locator('#count')).toHaveText('(3)');
  await expect(page.getByRole('heading', { name: 'Appropriate Uses For SQLite' })).toBeVisible();
});

test('has no serious accessibility violations on the demo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('has no serious accessibility violations on the landing page', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).length).toBe(0);
});

for (const route of ['/app', '/privacy', '/terms', '/missing-proofbook-page']) {
  test(`has no serious accessibility violations or console errors on ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
    if (route !== '/missing-proofbook-page') expect(errors).toEqual([]);
  });
}

test('keeps the skip link first, shows a designed focus ring, and preserves 44px mobile touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveCSS('outline-width', '4px');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'BOOKMARK PROOFBOOK' })).toBeFocused();
  const navHeights = await page.locator('.site-header nav a').evaluateAll((links) => links.map((link) => link.getBoundingClientRect().height));
  expect(navHeights.every((height) => height >= 44)).toBe(true);
  await page.goto('/demo');
  const controls = page.locator('.demo-banner a, .demo-banner button, .record h3 a, .record .delete, footer a');
  const sizes = await controls.evaluateAll((elements) => elements.map((element) => {
    const box = element.getBoundingClientRect();
    return { label: element.textContent?.trim(), width: box.width, height: box.height };
  }));
  expect(sizes.every(({ width, height }) => width >= 44 && height >= 44), JSON.stringify(sizes)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('@claim:packaged-extension includes a linked extension zip in the static deployment output', async ({ page }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: 'Download the extension zip' });
  await expect(link).toHaveAttribute('href', '/downloads/bookmark-proofbook-extension.zip');
  const response = await page.request.get('/downloads/bookmark-proofbook-extension.zip');
  expect(response.status()).toBe(200);
  expect((await response.body()).byteLength).toBeGreaterThan(100_000);
});

test('gives complete unpacked installation instructions beside the extension download', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Install the browser extension' }).click();
  await expect(page.locator('#install')).toContainText('Extract the zip');
  await expect(page.locator('#install')).toContainText('chrome://extensions');
  await expect(page.locator('#install')).toContainText('Developer mode');
  await expect(page.locator('#install')).toContainText('Load unpacked');
});

test('@claim:http-links-only rejects non-HTTP bookmark addresses before saving', async ({ page }) => {
  await page.goto('/app');
  await page.getByLabel('Page URL').fill('javascript:alert(1)');
  await page.getByLabel('Page title').fill('Unsafe address');
  await page.getByLabel('Why did this matter?').fill('This must not be stored.');
  await page.getByRole('button', { name: 'Save this bookmark' }).click();
  await expect(page.getByLabel('Page URL')).toBeFocused();
  expect(await page.getByLabel('Page URL').evaluate((input: HTMLInputElement) => input.validationMessage)).toContain('http:// or https://');
  await expect(page.locator('#count')).toHaveText('(0)');
  expect(await page.evaluate(() => localStorage.getItem('proofbook:records'))).toBeNull();
});

test('publishes route-specific metadata and returns a real 404 response', async ({ page }) => {
  const routes = [
    ['/', 'Bookmark Proofbook — Save bookmark context', 'https://bookmark-proofbook.sociobot.in/'],
    ['/?demo=1', 'Demo — Bookmark Proofbook', 'https://bookmark-proofbook.sociobot.in/demo'],
    ['/demo', 'Demo — Bookmark Proofbook', 'https://bookmark-proofbook.sociobot.in/demo'],
    ['/app', 'My proofbook — Bookmark Proofbook', 'https://bookmark-proofbook.sociobot.in/app'],
    ['/privacy', 'Privacy — Bookmark Proofbook', 'https://bookmark-proofbook.sociobot.in/privacy'],
    ['/terms', 'Terms — Bookmark Proofbook', 'https://bookmark-proofbook.sociobot.in/terms'],
  ] as const;
  for (const [route, title, canonical] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:description"]')).not.toHaveAttribute('content', '');
    await expect(page.locator('meta[name="twitter:description"]')).not.toHaveAttribute('content', '');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://bookmark-proofbook.sociobot.in/social-preview.webp');
  }
  expect((await page.request.get('/missing-proofbook-page')).status()).toBe(404);
  const response = await page.goto('/missing-proofbook-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'This page is not in the proofbook' })).toBeVisible();
  await expect(page).toHaveTitle('Page not found — Bookmark Proofbook');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bookmark-proofbook.sociobot.in/404');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — Bookmark Proofbook');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://bookmark-proofbook.sociobot.in/404');
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Page not found — Bookmark Proofbook');
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://bookmark-proofbook.sociobot.in/social-preview.webp');
  expect((await page.request.get('/social-preview.webp')).status()).toBe(200);
});

test('restores scroll and announces the new route after back navigation', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1100));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
  await page.getByRole('link', { name: 'Demo' }).evaluate((link) => link.click());
  await expect(page).toHaveURL('/demo');
  await expect(page.locator('#route-announcer')).toHaveText('Demo — Bookmark Proofbook');
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.locator('#route-announcer')).toHaveText('Bookmark Proofbook');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
});

test('does not advertise an unavailable paid checkout', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href*="api.sociobot.in"][href*="checkout"]')).toHaveCount(0);
  await expect(page.getByText('Buy the $19 license')).toHaveCount(0);
});

test('@claim:browser-html-import imports unique HTTP(S) bookmarks and rejects unsafe or duplicate addresses', async ({ page }) => {
  await page.goto('/app');
  await page.locator('#html-file').setInputFiles({
    name: 'bookmarks.html',
    mimeType: 'text/html',
    buffer: Buffer.from('<a href="https://example.com/">Example</a><a href="https://example.com/">Example duplicate</a><a href="https://www.w3.org/">W3C</a><a href="javascript:alert(1)">Unsafe</a><a href="ftp://example.com/file">FTP</a>'),
  });
  await expect(page.locator('#count')).toHaveText('(2)');
  await expect(page.locator('#form-message')).toHaveText('Imported 2 bookmarks. Add a reason when you revisit one.');
});

test('imports a versioned proofbook JSON file after showing additions and replacements', async ({ page }) => {
  await page.goto('/app');
  await page.locator('#json-file').setInputFiles({
    name: 'bookmark-proofbook.json',
    mimeType: 'application/json',
    buffer: Buffer.from(exportJson(sampleRecords)),
  });
  await expect(page.locator('#json-import-preview')).toContainText('Ready to import 3 bookmarks: 3 added and 0 replaced.');
  await page.getByRole('button', { name: 'Import 3 bookmarks' }).click();
  await expect(page.locator('#count')).toHaveText('(3)');
  expect(JSON.parse(await page.evaluate(() => localStorage.getItem('proofbook:records') || '[]'))).toEqual(sampleRecords);
});

test('keeps real bookmarks and names the real destination correctly when leaving demo', async ({ page }) => {
  await page.goto('/app');
  await page.evaluate((records) => localStorage.setItem('proofbook:records', JSON.stringify(records)), [sampleRecords[1]]);
  await page.goto('/demo');
  await expect(page.getByRole('link', { name: 'Open my proofbook' })).toBeVisible();
  await page.getByRole('link', { name: 'Open my proofbook' }).click();
  await expect(page).toHaveURL('/app');
  await expect(page.getByRole('heading', { name: 'How to Meet WCAG 2.2' })).toBeVisible();
  expect(JSON.parse(await page.evaluate(() => localStorage.getItem('proofbook:records') || '[]'))).toEqual([sampleRecords[1]]);
});

test('ships immutable caching for hashed assets without making the extension download immutable', async ({ page }) => {
  const response = await page.request.get('/staticwebapp.config.json');
  const config = await response.json() as { routes: Array<{ route: string; headers: Record<string, string> }> };
  const assets = config.routes.find((route) => route.route === '/assets/*');
  const downloads = config.routes.find((route) => route.route === '/downloads/*');
  expect(assets?.headers['Cache-Control']).toBe('public, max-age=31536000, immutable');
  expect(downloads?.headers['Cache-Control']).toBe('public, max-age=600, must-revalidate');
});

test('loads the landing page without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Save why each link mattered' })).toBeVisible();
  expect(errors).toEqual([]);
});
