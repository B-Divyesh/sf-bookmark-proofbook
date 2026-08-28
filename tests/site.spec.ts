import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

test('@claim:portable-export downloads a readable standalone proofbook', async ({ page }) => {
  await page.goto('/demo');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export HTML' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('bookmark-proofbook.html');
  expect(await file.createReadStream()).toBeTruthy();
});

test('has no serious accessibility violations on the demo', async ({ page }) => {
  await page.goto('/demo');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).length).toBe(0);
});

test('has no serious accessibility violations on the landing page', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).length).toBe(0);
});

test('keeps the skip link first, shows a designed focus ring, and preserves 44px mobile navigation targets', async ({ page }) => {
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
});

test('includes a linked extension zip in the static deployment output', async ({ page }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: 'Download the browser extension' });
  await expect(link).toHaveAttribute('href', '/downloads/bookmark-proofbook-extension.zip');
  const response = await page.request.get('/downloads/bookmark-proofbook-extension.zip');
  expect(response.status()).toBe(200);
  expect((await response.body()).byteLength).toBeGreaterThan(100_000);
});

test('does not advertise an unavailable paid checkout', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href*="api.sociobot.in"][href*="checkout"]')).toHaveCount(0);
  await expect(page.getByText('Buy the $19 license')).toHaveCount(0);
});

test('does not import duplicate URLs from a single browser HTML file', async ({ page }) => {
  await page.goto('/app');
  await page.locator('#html-file').setInputFiles({
    name: 'bookmarks.html',
    mimeType: 'text/html',
    buffer: Buffer.from('<a href="https://example.com/">Example</a><a href="https://example.com/">Example duplicate</a><a href="https://www.w3.org/">W3C</a>'),
  });
  await expect(page.locator('#count')).toHaveText('(2)');
  await expect(page.locator('#form-message')).toHaveText('Imported 2 bookmarks. Add a reason when you revisit one.');
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
  await expect(page.getByRole('heading', { name: 'Keep why each link mattered' })).toBeVisible();
  expect(errors).toEqual([]);
});
