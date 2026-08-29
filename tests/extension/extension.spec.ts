import { chromium, expect, test, type BrowserContext, type Page, type Worker } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

type InstalledExtension = {
  context: BrowserContext;
  worker: Worker;
  popup: Page;
  source: Page;
  profile: string;
};

async function installExtension(): Promise<InstalledExtension> {
  const profile = await mkdtemp(join(tmpdir(), 'bookmark-proofbook-profile-'));
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(profile, {
    headless: false,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  let [worker] = context.serviceWorkers();
  if (!worker) worker = await context.waitForEvent('serviceworker');
  const source = await context.newPage();
  await source.goto('http://127.0.0.1:4173/');
  const sourceTab = (await worker.evaluate(() => chrome.tabs.query({}))).find((tab) => tab.url?.startsWith('http://127.0.0.1'));
  if (!sourceTab?.id) throw new Error('Could not find the source tab.');
  const extensionId = new URL(worker.url()).host;
  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await worker.evaluate((tabId) => chrome.tabs.update(tabId, { active: true }), sourceTab.id);
  return { context, worker, popup, source, profile };
}

async function closeExtension(extension: InstalledExtension) {
  await extension.context.close();
  await rm(extension.profile, { recursive: true, force: true });
}

test('@claim:unpacked-install @claim:explicit-page-read loads the MV3 artifact and reads the page only after capture', async () => {
  const extension = await installExtension();
  try {
    await extension.source.locator('h1').selectText();
    await expect(extension.popup.locator('#reason-form')).toHaveCount(0);
    expect(await extension.worker.evaluate(() => chrome.storage.local.get('records'))).toEqual({});
    await extension.popup.getByRole('button', { name: 'Capture this page' }).click();
    await expect(extension.popup.getByLabel('Selected words')).toHaveValue('Save why each link mattered');
    expect(await extension.worker.evaluate(() => chrome.storage.local.get('records'))).toEqual({});
    await extension.popup.getByLabel('Why did this matter?').fill('Keep the source for a release review.');
    await extension.popup.getByRole('button', { name: 'Save this bookmark' }).click();
    const stored = await extension.worker.evaluate(() => chrome.storage.local.get('records'));
    expect(stored.records).toHaveLength(1);
    expect(stored.records[0].selectedText).toBe('Save why each link mattered');
  } finally {
    await closeExtension(extension);
  }
});

test('@claim:extension-local-records stores a captured record only in extension local storage', async () => {
  const extension = await installExtension();
  try {
    const external: string[] = [];
    extension.context.on('request', (request) => {
      const hostname = new URL(request.url()).hostname;
      if (hostname !== '127.0.0.1' && hostname !== 'localhost') external.push(request.url());
    });
    await extension.source.locator('h1').selectText();
    await extension.popup.getByRole('button', { name: 'Capture this page' }).click();
    await extension.popup.getByLabel('Why did this matter?').fill('Keep the source in extension local storage.');
    await extension.popup.getByRole('button', { name: 'Save this bookmark' }).click();
    const stored = await extension.worker.evaluate(() => chrome.storage.local.get('records'));
    expect(stored.records).toHaveLength(1);
    expect(stored.records[0].reason).toContain('extension local storage');
    expect(external).toEqual([]);
  } finally {
    await closeExtension(extension);
  }
});

test('@claim:lossless-json-import exports the sample and restores every field in extension local storage', async () => {
  const extension = await installExtension();
  try {
    const external: string[] = [];
    extension.context.on('request', (request) => {
      const hostname = new URL(request.url()).hostname;
      if (hostname !== '127.0.0.1' && hostname !== 'localhost') external.push(request.url());
    });
    await extension.source.goto('http://127.0.0.1:4173/demo');
    const download = extension.source.waitForEvent('download');
    await extension.source.getByRole('button', { name: 'Export JSON' }).click();
    const exportedFile = await download;
    const path = await exportedFile.path();
    const exported = JSON.parse(await readFile(path!, 'utf8'));
    await extension.popup.locator('#json-file').setInputFiles(path!);
    await expect(extension.popup.locator('#notice')).toContainText('Ready to import 3 bookmarks: 3 added and 0 replaced.');
    await extension.popup.getByRole('button', { name: 'Import 3 bookmarks' }).click();
    await expect.poll(() => extension.worker.evaluate(() => chrome.storage.local.get('records'))).toEqual({ records: exported.records });
    expect(external).toEqual([]);
  } finally {
    await closeExtension(extension);
  }
});

test('@claim:link-check-limit contacts no saved address before Check links and checks only the first 25', async () => {
  const extension = await installExtension();
  try {
    const records = Array.from({ length: 26 }, (_, index) => ({
      id: `health-${index}`,
      url: `http://127.0.0.1:4173/?health-check=${index}`,
      title: `Health record ${index}`,
      reason: 'Verify bounded, explicit link checking.',
      selectedText: '',
      extract: '',
      contentHash: '811c9dc5',
      createdAt: '2026-08-28T00:00:00.000Z',
      health: 'unchecked',
    }));
    const requests: string[] = [];
    extension.context.on('request', (request) => {
      if (request.url().includes('health-check=')) requests.push(request.url());
    });
    await extension.worker.evaluate((seed) => chrome.storage.local.set({ records: seed }), records);
    await extension.popup.reload();
    expect(requests).toEqual([]);
    await extension.popup.getByRole('button', { name: 'Check links' }).click();
    await expect(extension.popup.locator('#notice')).toContainText('Checked 25 links.');
    expect(requests).toHaveLength(25);
    expect(requests.some((url) => url.endsWith('health-check=25'))).toBe(false);
    const stored = (await extension.worker.evaluate(() => chrome.storage.local.get('records'))).records;
    expect(stored).toHaveLength(26);
    expect(stored[25].health).toBe('unchecked');
  } finally {
    await closeExtension(extension);
  }
});

test('removes an extension record with an immediate undo path', async () => {
  const extension = await installExtension();
  try {
    await extension.worker.evaluate(() => chrome.storage.local.set({ records: [{
      id: 'undo-record', url: 'https://example.com/', title: 'Undo this record', reason: 'Verify reversible removal.', selectedText: '', extract: '', contentHash: '811c9dc5', createdAt: '2026-08-28T00:00:00.000Z', health: 'unchecked',
    }] }));
    await extension.popup.reload();
    await extension.popup.getByRole('button', { name: 'Remove' }).click();
    await expect(extension.popup.getByRole('button', { name: 'Undo remove' })).toBeVisible();
    expect((await extension.worker.evaluate(() => chrome.storage.local.get('records'))).records).toHaveLength(0);
    await extension.popup.getByRole('button', { name: 'Undo remove' }).click();
    await expect(extension.popup.getByRole('heading', { name: 'Undo this record' })).toBeVisible();
    expect((await extension.worker.evaluate(() => chrome.storage.local.get('records'))).records).toHaveLength(1);
  } finally {
    await closeExtension(extension);
  }
});

test('has no serious or critical accessibility findings in the installed popup', async () => {
  const extension = await installExtension();
  try {
    await expect(extension.popup.getByRole('heading', { name: 'Saved bookmarks (0)' })).toBeVisible();
    const results = await new AxeBuilder({ page: extension.popup }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  } finally {
    await closeExtension(extension);
  }
});
