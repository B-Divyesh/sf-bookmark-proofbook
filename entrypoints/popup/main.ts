import '../../site/styles.css';
import './style.css';
import { exportHtml, exportJson, extractTextFromHtml, hashText, makeRecord, parseBookmarksHtml, searchRecords, type BookmarkRecord } from '../../src/proofbook';

const root = document.querySelector<HTMLElement>('#app')!;
let records: BookmarkRecord[] = [];
const key = 'records';
const store = { get: async () => (await chrome.storage.local.get(key))[key] as BookmarkRecord[] | undefined, set: (data: BookmarkRecord[]) => chrome.storage.local.set({ [key]: data }) };
function download(name: string, content: string, type: string) { const url = URL.createObjectURL(new Blob([content], { type })); const a = Object.assign(document.createElement('a'), { href: url, download: name }); a.click(); URL.revokeObjectURL(url); }
function escape(text: string) { return text.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]!)); }
function card(r: BookmarkRecord) { return `<article class="record"><div class="record-top"><p class="status ${r.health}">● ${r.health === 'unchecked' ? 'Not checked' : r.health === 'alive' ? 'Reachable when checked' : r.health === 'changed' ? 'Page changed' : 'Could not reach page'}</p><button class="text-button remove" data-id="${r.id}">Remove</button></div><h3><a href="${escape(r.url)}" target="_blank">${escape(r.title)} ↗</a></h3><p><strong>Why I saved it:</strong> ${escape(r.reason)}</p>${r.selectedText ? `<blockquote>${escape(r.selectedText)}</blockquote>` : ''}<details><summary>Evidence hash ${r.contentHash}</summary><p>${escape(r.extract || 'No page extract recorded.')}</p></details></article>`; }
function render(query = '') { const found = searchRecords(records, query); root.innerHTML = `<section class="popup-head"><p class="eyebrow">LOCAL BOOKMARK EVIDENCE</p><h1>Keep why each link mattered</h1><p>Capture this page, then write the reason you expect to forget.</p></section><section class="popup-actions"><button class="button moss" id="capture">Capture this page</button><button class="button outline" id="health">Check links</button><button class="button outline" id="import">Import HTML</button><input hidden type="file" id="file" accept=".html,text/html"><button class="text-button" id="json">JSON</button><button class="text-button" id="html">HTML</button></section><p id="notice" aria-live="polite"></p><section id="form-slot"></section><section class="popup-library"><label>Search saved context<input id="search" type="search" value="${escape(query)}" placeholder="Reason, title, quote, or extract"></label><h2>Saved evidence (${records.length})</h2><div id="list">${found.length ? found.map(card).join('') : '<div class="empty"><h3>No bookmarks yet</h3><p>Capture the page you are reading to save its context.</p></div>'}</div></section>`; wire(query); }
async function wire(query: string) {
  document.querySelector('#search')?.addEventListener('input', (e) => render((e.target as HTMLInputElement).value));
  document.querySelector('#capture')?.addEventListener('click', async () => { const slot = document.querySelector('#form-slot')!; slot.innerHTML = '<p>Reading this page…</p>'; try { const page = await chrome.runtime.sendMessage({ type: 'capture-active-page' }); slot.innerHTML = `<form id="reason-form" class="capture"><label>Why did this matter?<textarea required id="reason" placeholder="Write the reason you expect to forget."></textarea></label><label>Selected words<textarea id="selected">${escape(page.selectedText)}</textarea></label><button class="button moss">Save this bookmark</button></form>`; (document.querySelector('#reason') as HTMLElement | null)?.focus(); document.querySelector('#reason-form')?.addEventListener('submit', async (e) => { e.preventDefault(); const record = makeRecord({ url: page.url, title: page.title || page.url, reason: (document.querySelector('#reason') as HTMLTextAreaElement).value, selectedText: (document.querySelector('#selected') as HTMLTextAreaElement).value, extract: page.extract }); records.unshift(record); await store.set(records); render(query); }); } catch (err) { slot.innerHTML = '<p>Could not read this page. Open a normal web page, then try Capture this page.</p>'; } });
  document.querySelector('#list')?.addEventListener('click', async (e) => { const t = e.target as HTMLElement; if (t.classList.contains('remove')) { records = records.filter((r) => r.id !== t.dataset.id); await store.set(records); render(query); } });
  document.querySelector('#json')?.addEventListener('click', () => download('bookmark-proofbook.json', exportJson(records), 'application/json'));
  document.querySelector('#html')?.addEventListener('click', () => download('bookmark-proofbook.html', exportHtml(records), 'text/html'));
  document.querySelector('#import')?.addEventListener('click', () => (document.querySelector('#file') as HTMLInputElement).click());
  document.querySelector('#file')?.addEventListener('change', async (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return; const links = parseBookmarksHtml(await file.text()); const urls = new Set(records.map((r) => r.url)); const added = links.filter((l) => !urls.has(l.url)).map((l) => makeRecord({ ...l, reason: 'Imported from browser bookmarks. Add why this link matters.', selectedText: '', extract: '' })); records = [...added, ...records]; await store.set(records); render(query); document.querySelector('#notice')!.textContent = `Imported ${added.length} bookmarks.`; });
  document.querySelector('#health')?.addEventListener('click', checkLinks);
}
async function checkLinks() {
  const notice = document.querySelector('#notice')!; if (!records.length) { notice.textContent = 'Add a bookmark before checking links.'; return; }
  notice.textContent = `Checking ${Math.min(records.length, 25)} links with your explicit permission…`;
  const checked = await Promise.all(records.slice(0, 25).map(async (record) => {
    try { const response = await fetch(record.url, { redirect: 'follow' }); if (!response.ok) return { ...record, health: 'unreachable' as const, checkedAt: new Date().toISOString() }; const extract = extractTextFromHtml(await response.text()); const nextHash = hashText(extract); return { ...record, health: record.extract && nextHash !== record.contentHash ? 'changed' as const : 'alive' as const, checkedAt: new Date().toISOString() }; } catch { return { ...record, health: 'unreachable' as const, checkedAt: new Date().toISOString() }; }
  }));
  records = [...checked, ...records.slice(25)]; await store.set(records); render(); document.querySelector('#notice')!.textContent = `Checked ${checked.length} links. A changed hash means the page text differs from the saved extract.`;
}
async function bootstrap() {
  records = (await store.get()) || [];
  render();
}
void bootstrap();
