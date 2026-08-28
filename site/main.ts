import './styles.css';
import { exportHtml, exportJson, hashText, makeRecord, normalizeHttpUrl, parseBookmarksHtml, sampleRecords, searchRecords, type BookmarkRecord } from '../src/proofbook';

const APP = document.querySelector<HTMLDivElement>('#app')!;
const isDemoRoute = () => location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
const isAppRoute = () => location.pathname === '/app';
const DEMO_STORE_KEY = 'demo:bookmark-proofbook:records';
const REAL_STORE_KEY = 'proofbook:records';
const storeKey = () => isDemoRoute() ? DEMO_STORE_KEY : REAL_STORE_KEY;
let live: BookmarkRecord[] = [];
let removedRecord: { record: BookmarkRecord; index: number } | undefined;

function escapeHtml(text: string) { return text.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]!)); }
function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click(); URL.revokeObjectURL(url);
}
function save() { localStorage.setItem(storeKey(), JSON.stringify(live)); }
function load() {
  const raw = localStorage.getItem(storeKey());
  if (raw) { try { live = JSON.parse(raw); return; } catch { localStorage.removeItem(storeKey()); } }
  live = isDemoRoute() ? structuredClone(sampleRecords) : [];
  if (isDemoRoute()) save();
}
function setTitle(title: string) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', 'Keep why a bookmark mattered, search it later, and export a durable local proofbook.');
  const canonical = new URL(location.pathname === '/' ? '/' : location.pathname, 'https://bookmark-proofbook.sociobot.in').href;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', canonical);
}
function header() { return `<header class="site-header"><a class="wordmark" href="/" data-nav>BOOKMARK<br>PROOFBOOK</a><nav aria-label="Primary"><a href="/demo" data-nav>Demo</a><a href="/app" data-nav>My proofbook</a><a href="/privacy" data-nav>Privacy</a></nav></header>`; }
function footer() { return `<footer><p>Bookmark Proofbook keeps the reason beside the link.</p><nav aria-label="Footer"><a href="/privacy" data-nav>Privacy</a><a href="/terms" data-nav>Terms</a><span>Built by Param Factory · v1.0.1</span></nav></footer>`; }

function landing() {
  setTitle('Bookmark Proofbook — Keep why links mattered');
  APP.innerHTML = `${header()}<main id="main" tabindex="-1">
    <section class="hero" aria-labelledby="home-title"><div class="hero-copy"><p class="eyebrow">LOCAL BOOKMARK EVIDENCE</p><h1 id="home-title">Keep why each link mattered</h1><p class="lede">For people with too many bookmarks to remember, save context and find the resource again.</p><div class="actions"><a class="button moss" href="/demo" data-nav>Try it with sample data</a><span>Opens three saved research notes.</span></div><ul class="facts"><li>No account required.</li><li>Capture, search, and export work locally.</li><li>Export a readable HTML proofbook.</li></ul><p><a href="#install">Install the browser extension</a></p></div><figure><img src="/proofbook-hero.webp" width="1200" height="800" fetchpriority="high" decoding="async" alt="An archive box of research slips beside moss growing through concrete."/><figcaption>Archive slips beside moss and concrete.</figcaption></figure></section>
    <section class="preview" aria-labelledby="preview-title"><div><p class="eyebrow">WHAT A RECORD KEEPS</p><h2 id="preview-title">A link needs a reason</h2><p>A title, your note, selected words, a small page extract, and an evidence hash sit together.</p></div><article class="record paper"><p class="status alive">● Checked once</p><h3>Appropriate Uses For SQLite</h3><p><strong>Why I saved it:</strong> Decide when a small local database is the sensible choice.</p><blockquote>SQLite is not directly comparable to client/server SQL database engines.</blockquote><code>evidence hash · 4fa1c0e7</code></article></section>
    <section class="how" aria-labelledby="how-title"><p class="eyebrow">THREE STEPS</p><h2 id="how-title">Keep the trail to a source</h2><ol><li><strong>Capture a link.</strong><span>Write why it matters while you still know.</span></li><li><strong>Search your words.</strong><span>Find a source by the reason or evidence you saved.</span></li><li><strong>Export your proofbook.</strong><span>Keep a self-contained file you can open anywhere.</span></li></ol></section>
    <section class="boundary" aria-labelledby="boundary-title"><h2 id="boundary-title">What it does not do</h2><p>It stores a text extract of up to 12,000 characters, not a full web page.</p></section>
    <section class="install" id="install" aria-labelledby="install-title"><p class="eyebrow">CHROME OR EDGE</p><h2 id="install-title">Install the browser extension</h2><ol><li><a class="button moss" href="/downloads/bookmark-proofbook-extension.zip" download>Download the extension zip</a></li><li>Extract the zip to a folder you can keep.</li><li>Open <code>chrome://extensions</code> or <code>edge://extensions</code> and turn on Developer mode.</li><li>Choose <strong>Load unpacked</strong>, then select the extracted folder.</li></ol><p class="quiet">Keep the folder after installation. This release is not listed in a browser store.</p></section>
  </main>${footer()}`;
}

function appView() {
  setTitle(isDemoRoute() ? 'Demo — Bookmark Proofbook' : 'My proofbook — Bookmark Proofbook'); load();
  const demo = isDemoRoute();
  APP.innerHTML = `${header()}${demo ? `<aside class="demo-banner" role="status"><strong>Demo — sample data, nothing is saved.</strong><button id="reset-demo">Reset demo</button><a href="/app" data-nav>Start for real</a></aside>` : ''}<main id="main" tabindex="-1" class="workbench"><section class="workhead"><div><p class="eyebrow">${demo ? 'SAMPLE PROOFBOOK' : 'MY PROOFBOOK'}</p><h1>${demo ? 'Find a saved reason' : 'Start your proofbook'}</h1><p>${demo ? 'Search the note you wrote, not only the page title.' : 'Add a bookmark from the extension, or enter one here.'}</p></div><div class="toolbar"><button class="button outline" id="import-html">Import browser HTML</button><input id="html-file" type="file" accept="text/html,.html" hidden><button class="button outline" id="export-json">Export JSON</button><button class="button moss" id="export-html">Export HTML</button></div></section>
  <section class="capture" aria-labelledby="capture-title"><h2 id="capture-title">Add a bookmark</h2><form id="capture-form"><label>Page URL<input required name="url" type="url" inputmode="url" placeholder="https://example.com/article" aria-describedby="url-help" /><span class="field-help" id="url-help">Use an address that starts with http:// or https://.</span></label><label>Page title<input required name="title" maxlength="300" placeholder="A title you will recognise" /></label><label>Why did this matter?<textarea required name="reason" maxlength="2000" placeholder="Write the reason you expect to forget."></textarea></label><label>Selected words <textarea name="selectedText" maxlength="3000" placeholder="Optional: quote the part that made you save it."></textarea></label><label>Small page extract <textarea name="extract" maxlength="12000" placeholder="Optional: a short extract. The extension fills this for you."></textarea></label><button class="button moss" type="submit">Save this bookmark</button><p id="form-message" role="status" aria-live="polite"></p></form></section>
  <section class="library" aria-labelledby="library-title"><div class="library-head"><div><h2 id="library-title">Saved evidence <span id="count"></span></h2><p>Each record keeps its original address and a small local extract.</p></div><label class="search-label">Search your proofbook<input id="search" type="search" placeholder="Try “keyboard” or “database”" autofocus></label></div><div id="records" aria-live="polite"></div></section>
  <div class="action-message" id="action-message" role="status" aria-live="polite"></div></main>${footer()}`;
  wireApp();
}

function recordMarkup(record: BookmarkRecord) { return `<article class="record" data-id="${record.id}"><div class="record-top"><p class="status ${record.health}">● ${record.health === 'unchecked' ? 'Not checked' : record.health === 'alive' ? 'Reachable when checked' : record.health === 'changed' ? 'Page changed' : 'Could not reach page'}</p><button class="text-button delete" data-id="${record.id}">Remove</button></div><h3><a href="${escapeHtml(record.url)}" target="_blank" rel="noreferrer">${escapeHtml(record.title)} <span class="external">↗</span></a></h3><p class="url">${escapeHtml(new URL(record.url).hostname)}</p><p><strong>Why I saved it:</strong> ${escapeHtml(record.reason)}</p>${record.selectedText ? `<blockquote>${escapeHtml(record.selectedText)}</blockquote>` : ''}${record.extract ? `<details><summary>Show saved extract and hash</summary><p>${escapeHtml(record.extract)}</p><code>${record.contentHash}</code></details>` : ''}<p class="meta">Saved ${new Date(record.createdAt).toLocaleDateString()}</p></article>`; }
function renderRecords(query = '') { const found = searchRecords(live, query); const root = document.querySelector('#records')!; document.querySelector('#count')!.textContent = `(${live.length})`; root.innerHTML = found.length ? found.map(recordMarkup).join('') : `<div class="empty"><h3>${live.length ? 'No saved evidence matches that search' : 'Your saved evidence will appear here'}</h3><p>${live.length ? 'Try a word from the reason, title, quote, or extract.' : 'Use the form above, or open the extension while you are on a page.'}</p></div>`; }
function wireApp() {
  renderRecords();
  document.querySelector('#search')?.addEventListener('input', (e) => renderRecords((e.target as HTMLInputElement).value));
  const urlInput = document.querySelector<HTMLInputElement>('input[name="url"]')!;
  urlInput.addEventListener('input', () => urlInput.setCustomValidity(''));
  document.querySelector('#capture-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    try {
      const record = makeRecord({ url: normalizeHttpUrl(String(data.get('url'))), title: String(data.get('title')), reason: String(data.get('reason')), selectedText: String(data.get('selectedText')), extract: String(data.get('extract')) });
      live.unshift(record); save(); form.reset(); document.querySelector('#form-message')!.textContent = 'Saved. The evidence hash is ' + record.contentHash + '.'; renderRecords();
    } catch {
      urlInput.setCustomValidity('Enter a web address that starts with http:// or https://.');
      urlInput.reportValidity();
      urlInput.focus();
    }
  });
  document.querySelector('#records')?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('delete')) {
      const index = live.findIndex((record) => record.id === target.dataset.id);
      if (index < 0) return;
      removedRecord = { record: live[index], index };
      live.splice(index, 1); save(); renderRecords((document.querySelector('#search') as HTMLInputElement).value);
      const message = document.querySelector('#action-message')!;
      message.innerHTML = `Removed “${escapeHtml(removedRecord.record.title)}”. <button class="text-button" id="undo-remove">Undo remove</button>`;
      document.querySelector('#undo-remove')?.addEventListener('click', () => {
        if (!removedRecord) return;
        live.splice(removedRecord.index, 0, removedRecord.record); removedRecord = undefined; save(); renderRecords((document.querySelector('#search') as HTMLInputElement).value); document.querySelector('#action-message')!.textContent = 'Record restored.';
      });
    }
  });
  document.querySelector('#export-json')?.addEventListener('click', () => download('bookmark-proofbook.json', exportJson(live), 'application/json'));
  document.querySelector('#export-html')?.addEventListener('click', () => download('bookmark-proofbook.html', exportHtml(live), 'text/html'));
  document.querySelector('#import-html')?.addEventListener('click', () => (document.querySelector('#html-file') as HTMLInputElement).click());
  document.querySelector('#html-file')?.addEventListener('change', async (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return; const links = parseBookmarksHtml(await file.text()); const existing = new Set(live.map((r) => r.url)); const added = links.filter((link) => !existing.has(link.url)).map((link) => makeRecord({ ...link, reason: 'Imported from browser bookmarks. Add why this link matters.', selectedText: '', extract: '' })); live = [...added, ...live]; save(); document.querySelector('#form-message')!.textContent = `Imported ${added.length} bookmarks. Add a reason when you revisit one.`; renderRecords(); });
  document.querySelector('#reset-demo')?.addEventListener('click', () => { localStorage.removeItem('demo:bookmark-proofbook:records'); load(); render(); });
}
function legal(kind: 'privacy' | 'terms') { const privacy = kind === 'privacy'; setTitle(`${privacy ? 'Privacy' : 'Terms'} — Bookmark Proofbook`); APP.innerHTML = `${header()}<main id="main" tabindex="-1" class="legal"><p class="eyebrow">${privacy ? 'PRIVACY' : 'TERMS'}</p><h1>${privacy ? 'Your bookmark evidence stays local' : 'Terms for Bookmark Proofbook'}</h1>${privacy ? `<p>The companion site stores records in browser local storage. The extension stores records in extension local storage.</p><p>The companion site does not run analytics or send your records to a service.</p><h2>What you control</h2><p>You can export records. Remove has an immediate undo action.</p><h2>Contact</h2><p>Email privacy@sociobot.in for privacy questions.</p>` : `<p>Bookmark Proofbook is a local-first tool. You are responsible for the links and notes you save.</p><h2>No warranty</h2><p>Links can change or disappear. Keep your exported proofbook as your durable copy.</p>`}</main>${footer()}`; }
function notFound() { setTitle('Page not found — Bookmark Proofbook'); APP.innerHTML = `${header()}<main id="main" tabindex="-1" class="legal"><p class="eyebrow">404</p><h1>This page is not in the proofbook</h1><p>Return to the archive and keep what matters.</p><a class="button moss" href="/" data-nav>Return home</a></main>${footer()}`; }
function render(moveFocus = false) { if (location.pathname === '/') landing(); else if (isDemoRoute() || isAppRoute()) appView(); else if (location.pathname === '/privacy' || location.pathname === '/terms') legal(location.pathname.slice(1) as 'privacy' | 'terms'); else notFound(); const heading = APP.querySelector<HTMLElement>('h1'); if (moveFocus && heading) { heading.tabIndex = -1; heading.focus(); } bindGlobal(); }
function bindGlobal() { APP.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const destination = a.getAttribute('href')!; if (isDemoRoute() && !destination.startsWith('/demo')) localStorage.removeItem(DEMO_STORE_KEY); history.pushState({}, '', destination); render(true); window.scrollTo(0, 0); })); }
window.addEventListener('popstate', () => render(true)); render();

export { hashText };
