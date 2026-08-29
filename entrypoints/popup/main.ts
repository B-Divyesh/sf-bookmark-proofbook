import '../../site/styles.css';
import './style.css';
import { exportHtml, exportJson, extractTextFromHtml, hashText, makeRecord, parseBookmarksHtml, parseProofbookJson, planProofbookImport, recordsForLinkCheck, searchRecords, type BookmarkRecord } from '../../src/proofbook';

const root = document.querySelector<HTMLElement>('#app')!;
let records: BookmarkRecord[] = [];
let removedRecord: { record: BookmarkRecord; index: number } | undefined;
let pendingJsonImport: BookmarkRecord[] | undefined;
const key = 'records';
const store = { get: async () => (await chrome.storage.local.get(key))[key] as BookmarkRecord[] | undefined, set: (data: BookmarkRecord[]) => chrome.storage.local.set({ [key]: data }) };
function download(name: string, content: string, type: string) { const url = URL.createObjectURL(new Blob([content], { type })); const a = Object.assign(document.createElement('a'), { href: url, download: name }); a.click(); URL.revokeObjectURL(url); }
function escape(text: string) { return text.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]!)); }
function card(r: BookmarkRecord) { return `<article class="record"><div class="record-top"><p class="status ${r.health}">● ${r.health === 'unchecked' ? 'Not checked' : r.health === 'alive' ? 'Reachable when checked' : r.health === 'changed' ? 'Page changed' : 'Could not reach page'}</p><button class="text-button remove" data-id="${r.id}">Remove</button></div><h3><a href="${escape(r.url)}" target="_blank" rel="noreferrer">${escape(r.title)} ↗</a></h3><p><strong>Why I saved it:</strong> ${escape(r.reason)}</p>${r.selectedText ? `<blockquote>${escape(r.selectedText)}</blockquote>` : ''}<details><summary>Saved extract code ${r.contentHash}</summary><p>${escape(r.extract || 'No page extract recorded.')}</p></details></article>`; }
function render(query = '') { const found = searchRecords(records, query); root.innerHTML = `<section class="popup-head"><p class="eyebrow">LOCAL BOOKMARK TOOL</p><h1>Save why each link mattered</h1><p>Capture this page, then write the reason you expect to forget.</p></section><section class="popup-actions"><button class="button moss" id="capture">Capture this page</button><button class="button outline" id="health">Check links</button><button class="button outline" id="import-html">Import browser HTML</button><input hidden type="file" id="html-file" accept=".html,text/html"><button class="button outline" id="import-json">Import proofbook JSON</button><input hidden type="file" id="json-file" accept=".json,application/json"><button class="text-button" id="json">Export JSON</button><button class="text-button" id="html">Export HTML</button></section><p id="notice" aria-live="polite" aria-atomic="true"></p><section id="form-slot"></section><section class="popup-library"><label>Search saved context<input id="search" type="search" value="${escape(query)}" placeholder="Reason, title, quote, or extract"></label><h2>Saved bookmarks (${records.length})</h2><div id="list">${found.length ? found.map(card).join('') : '<div class="empty"><h3>No bookmarks yet</h3><p>Capture the page you are reading to save its context.</p></div>'}</div></section>`; wire(query); }
async function wire(query: string) {
  document.querySelector('#search')?.addEventListener('input', (e) => render((e.target as HTMLInputElement).value));
  document.querySelector('#capture')?.addEventListener('click', async () => { const slot = document.querySelector('#form-slot')!; slot.innerHTML = '<p>Reading this page…</p>'; try { const page = await chrome.runtime.sendMessage({ type: 'capture-active-page' }); slot.innerHTML = `<form id="reason-form" class="capture"><label>Why did this matter?<textarea required id="reason" placeholder="Write the reason you expect to forget."></textarea></label><label>Selected words<textarea id="selected">${escape(page.selectedText)}</textarea></label><button class="button moss">Save this bookmark</button></form>`; (document.querySelector('#reason') as HTMLElement | null)?.focus(); document.querySelector('#reason-form')?.addEventListener('submit', async (e) => { e.preventDefault(); const record = makeRecord({ url: page.url, title: page.title || page.url, reason: (document.querySelector('#reason') as HTMLTextAreaElement).value, selectedText: (document.querySelector('#selected') as HTMLTextAreaElement).value, extract: page.extract }); records.unshift(record); await store.set(records); render(query); }); } catch { slot.innerHTML = '<p>Could not read this page. Open a normal web page, then try Capture this page.</p>'; } });
  document.querySelector('#list')?.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('remove')) return;
    const index = records.findIndex((record) => record.id === target.dataset.id);
    if (index < 0) return;
    removedRecord = { record: records[index], index };
    records.splice(index, 1); await store.set(records); render(query);
    const notice = document.querySelector('#notice')!;
    notice.innerHTML = `Removed “${escape(removedRecord.record.title)}”. <button class="text-button" id="undo-remove">Undo remove</button>`;
    document.querySelector('#undo-remove')?.addEventListener('click', async () => {
      if (!removedRecord) return;
      records.splice(removedRecord.index, 0, removedRecord.record); removedRecord = undefined; await store.set(records); render(query); document.querySelector('#notice')!.textContent = 'Bookmark restored.';
    });
  });
  document.querySelector('#json')?.addEventListener('click', () => download('bookmark-proofbook.json', exportJson(records), 'application/json'));
  document.querySelector('#html')?.addEventListener('click', () => download('bookmark-proofbook.html', exportHtml(records), 'text/html'));
  document.querySelector('#import-html')?.addEventListener('click', () => (document.querySelector('#html-file') as HTMLInputElement).click());
  document.querySelector('#html-file')?.addEventListener('change', async (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return; const links = parseBookmarksHtml(await file.text()); const urls = new Set(records.map((r) => r.url)); const added = links.filter((l) => !urls.has(l.url)).map((l) => makeRecord({ ...l, reason: 'Imported from browser bookmarks. Add why this link matters.', selectedText: '', extract: '' })); records = [...added, ...records]; await store.set(records); render(query); document.querySelector('#notice')!.textContent = `Imported ${added.length} bookmarks.`; });
  document.querySelector('#import-json')?.addEventListener('click', () => (document.querySelector('#json-file') as HTMLInputElement).click());
  document.querySelector('#json-file')?.addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const notice = document.querySelector('#notice')!;
    try {
      pendingJsonImport = parseProofbookJson(await file.text());
      const plan = planProofbookImport(records, pendingJsonImport);
      notice.innerHTML = `Ready to import ${pendingJsonImport.length} bookmarks: ${plan.added} added and ${plan.replaced} replaced. <button class="text-button" id="confirm-json-import">Import ${pendingJsonImport.length} bookmarks</button> <button class="text-button" id="cancel-json-import">Cancel</button>`;
      document.querySelector('#confirm-json-import')?.addEventListener('click', async () => {
        if (!pendingJsonImport) return;
        const confirmed = planProofbookImport(records, pendingJsonImport);
        records = confirmed.records;
        await store.set(records);
        pendingJsonImport = undefined;
        render(query);
        document.querySelector('#notice')!.textContent = `Imported ${confirmed.added} bookmarks and replaced ${confirmed.replaced}.`;
      });
      document.querySelector('#cancel-json-import')?.addEventListener('click', () => { pendingJsonImport = undefined; notice.textContent = 'JSON import cancelled.'; });
    } catch (error) {
      pendingJsonImport = undefined;
      notice.textContent = error instanceof Error ? error.message : 'Could not read that proofbook JSON file.';
    } finally {
      input.value = '';
    }
  });
  document.querySelector('#health')?.addEventListener('click', checkLinks);
}
async function checkLinks() {
  const notice = document.querySelector('#notice')!; if (!records.length) { notice.textContent = 'Add a bookmark before checking links.'; return; }
  const pending = recordsForLinkCheck(records);
  notice.textContent = `Checking ${pending.length} links after your request…`;
  const checked = await Promise.all(pending.map(async (record) => {
    try { const response = await fetch(record.url, { redirect: 'follow' }); if (!response.ok) return { ...record, health: 'unreachable' as const, checkedAt: new Date().toISOString() }; const extract = extractTextFromHtml(await response.text()); const nextHash = hashText(extract); return { ...record, health: record.extract && nextHash !== record.contentHash ? 'changed' as const : 'alive' as const, checkedAt: new Date().toISOString() }; } catch { return { ...record, health: 'unreachable' as const, checkedAt: new Date().toISOString() }; }
  }));
  records = [...checked, ...records.slice(pending.length)]; await store.set(records); render(); document.querySelector('#notice')!.textContent = `Checked ${checked.length} links. A changed extract code means the page text differs from the saved extract.`;
}
async function bootstrap() {
  records = (await store.get()) || [];
  render();
}
void bootstrap();
