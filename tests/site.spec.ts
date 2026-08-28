import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:demo-namespace loads an isolated sample workspace without external requests', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => { if (!request.url().startsWith('http://127.0.0.1:4173')) external.push(request.url()); });
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Find a saved reason' })).toBeVisible();
  await expect(page.locator('#count')).toHaveText('(3)');
  await expect.poll(() => external).toEqual([]);
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

test('loads the landing page without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Keep why each link mattered' })).toBeVisible();
  expect(errors).toEqual([]);
});
