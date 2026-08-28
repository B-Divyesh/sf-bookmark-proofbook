import './styles.css';
import { exportHtml, exportJson, hashText, makeRecord, parseBookmarksHtml, sampleRecords, searchRecords, type BookmarkRecord } from '../src/proofbook';

const APP = document.querySelector<HTMLDivElement>('#app')!;
const SLUG = 'bookmark-proofbook';
const isDemoRoute = () => location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
const isAppRoute = () => location.pathname === '/app';
const storeKey = () => isDemoRoute() ? 'demo:bookmark-proofbook:records' : 'proofbook:records';
let live: BookmarkRecord[] = [];

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
function nav(path: string) { history.pushState({}, '', path); render(); window.scrollTo(0, 0); }
function setTitle(title: string) { document.title = title; document.querySelector('meta[name="description"]')?.setAttribute('content', 'Keep why a bookmark mattered, search it later, and export a durable local proofbook.'); }
function header() { return `<header class="site-header"><a class="wordmark" href="/" data-nav>BOOKMARK<br>PROOFBOOK</a><nav aria-label="Primary"><a href="/demo" data-nav>Demo</a><a href="/app" data-nav>My proofbook</a><a href="/privacy" data-nav>Privacy</a></nav></header>`; }
function footer() { return `<footer><p>Bookmark Proofbook keeps the reason beside the link.</p><p><a href="/privacy" data-nav>Privacy</a> · <a href="/terms" data-nav>Terms</a> · Built by Param Factory · v1.0.0</p></footer>`; }

function landing() {
  setTitle('Bookmark Proofbook — Keep why links mattered');
  APP.innerHTML = `${header()}<main id="main" tabindex="-1">
    <section class="hero" aria-labelledby="home-title"><div class="hero-copy"><p class="eyebrow">LOCAL BOOKMARK EVIDENCE</p><h1 id="home-title">Keep why each link mattered</h1><p class="lede">For people with too many bookmarks to remember, save context and find the resource again.</p><div class="actions"><a class="button moss" href="/demo" data-nav>Try it with sample data</a><span>Opens three saved research notes.</span></div><ul class="facts"><li>No account required.</li><li>Your notes stay in this browser.</li><li>Export a readable HTML proofbook.</li></ul></div><figure><img src="/proofbook-hero.webp" width="1200" height="800" fetchpriority="high" decoding="async" alt="An archive box of research slips beside moss growing through concrete."/><figcaption>Original illustration: an archive built to outlast a service.</figcaption></figure></section>
    <section class="preview" aria-labelledby="preview-title"><div><p class="eyebrow">WHAT A RECORD KEEPS</p><h2 id="preview-title">A link needs a reason</h2><p>A title, your note, selected words, a small page extract, and an evidence hash sit together.</p></div><article class="record paper"><p class="status alive">● Checked once</p><h3>Appropriate Uses For SQLite</h3><p><strong>Why I saved it:</strong> Decide when a small local database is the sensible choice.</p><blockquote>SQLite is not directly comparable to client/server SQL database engines.</blockquote><code>evidence hash · 4fa1c0e7</code></article></section>
    <section class="how" aria-labelledby="how-title"><p class="eyebrow">THREE STEPS</p><h2 id="how-title">Keep the trail to a source</h2><ol><li><strong>Capture a link.</strong><span>Write why it matters while you still know.</span></li><li><strong>Search your words.</strong><span>Find a source by the reason or evidence you saved.</span></li><li><strong>Export your proofbook.</strong><span>Keep a self-contained file you can open anywhere.</span></li></ol></section>
    <section class="boundary" aria-labelledby="boundary-title"><h2 id="boundary-title">What it does not do</h2><p>It does not copy full sites, bypass a paywall, make a social feed, or sync your archive to our servers.</p></section>
    ${licensePanel()}
  </main>${footer()}`;
  wireLicense();
}

function licensePanel() { return `<section class="license" aria-labelledby="license-title"><p class="eyebrow">ONE-TIME LICENSE</p><h2 id="license-title">Keep the whole archive checked</h2><p>Free capture, search, and every export stay available. A $19 one-time license checks link changes across your full archive.</p><div class="actions"><a class="button outline" href="https://api.sociobot.in/api/v1/products/${SLUG}/checkout">Buy the $19 license</a><span>Sociobot/Dodo handles payment and refunds.</span></div><details><summary>Have a license? Paste it</summary><label for="license-token">License token</label><div class="license-form"><input id="license-token" autocomplete="off" /><button class="button moss" id="restore-license">Restore license</button></div><p class="quiet" id="license-status" aria-live="polite"></p></details></section>`; }

function appView() {
  setTitle(isDemoRoute() ? 'Demo — Bookmark Proofbook' : 'My proofbook — Bookmark Proofbook'); load();
  const demo = isDemoRoute();
  APP.innerHTML = `${header()}${demo ? `<aside class="demo-banner" role="status"><strong>Demo — sample data, nothing is saved.</strong><button id="reset-demo">Reset demo</button><a href="/app" data-nav>Start for real</a></aside>` : ''}<main id="main" tabindex="-1" class="workbench"><section class="workhead"><div><p class="eyebrow">${demo ? 'SAMPLE PROOFBOOK' : 'MY PROOFBOOK'}</p><h1>${demo ? 'Find a saved reason' : 'Start your proofbook'}</h1><p>${demo ? 'Search the note you wrote, not only the page title.' : 'Add a bookmark from the extension, or enter one here.'}</p></div><div class="toolbar"><button class="button outline" id="import-html">Import browser HTML</button><input id="html-file" type="file" accept="text/html,.html" hidden><button class="button outline" id="export-json">Export JSON</button><button class="button moss" id="export-html">Export HTML</button></div></section>
  <section class="capture" aria-labelledby="capture-title"><h2 id="capture-title">Add a bookmark</h2><form id="capture-form"><label>Page URL<input required name="url" type="url" placeholder="https://example.com/article" /></label><label>Page title<input required name="title" maxlength="300" placeholder="A title you will recognise" /></label><label>Why did this matter?<textarea required name="reason" maxlength="2000" placeholder="Write the reason you expect to forget."></textarea></label><label>Selected words <textarea name="selectedText" maxlength="3000" placeholder="Optional: quote the part that made you save it."></textarea></label><label>Small page extract <textarea name="extract" maxlength="12000" placeholder="Optional: a short extract. The extension fills this for you."></textarea></label><button class="button moss" type="submit">Save this bookmark</button><p id="form-message" role="status" aria-live="polite"></p></form></section>
  <section class="library" aria-labelledby="library-title"><div class="library-head"><div><h2 id="library-title">Saved evidence <span id="count"></span></h2><p>Each record keeps its original address and a small local extract.</p></div><label class="search-label">Search your proofbook<input id="search" type="search" placeholder="Try “keyboard” or “database”" autofocus></label></div><div id="records" aria-live="polite"></div></section>
  ${licensePanel()}</main>${footer()}`;
  wireApp();
}

function recordMarkup(record: BookmarkRecord) { return `<article class="record" data-id="${record.id}"><div class="record-top"><p class="status ${record.health}">● ${record.health === 'unchecked' ? 'Not checked' : record.health === 'alive' ? 'Reachable when checked' : record.health === 'changed' ? 'Page changed' : 'Could not reach page'}</p><button class="text-button delete" data-id="${record.id}">Remove</button></div><h3><a href="${escapeHtml(record.url)}" target="_blank" rel="noreferrer">${escapeHtml(record.title)} <span class="external">↗</span></a></h3><p class="url">${escapeHtml(new URL(record.url).hostname)}</p><p><strong>Why I saved it:</strong> ${escapeHtml(record.reason)}</p>${record.selectedText ? `<blockquote>${escapeHtml(record.selectedText)}</blockquote>` : ''}${record.extract ? `<details><summary>Show saved extract and hash</summary><p>${escapeHtml(record.extract)}</p><code>${record.contentHash}</code></details>` : ''}<p class="meta">Saved ${new Date(record.createdAt).toLocaleDateString()}</p></article>`; }
function renderRecords(query = '') { const found = searchRecords(live, query); const root = document.querySelector('#records')!; document.querySelector('#count')!.textContent = `(${live.length})`; root.innerHTML = found.length ? found.map(recordMarkup).join('') : `<div class="empty"><h3>${live.length ? 'No saved evidence matches that search' : 'Your saved evidence will appear here'}</h3><p>${live.length ? 'Try a word from the reason, title, quote, or extract.' : 'Use the form above, or open the extension while you are on a page.'}</p></div>`; }
function wireApp() {
  renderRecords();
  document.querySelector('#search')?.addEventListener('input', (e) => renderRecords((e.target as HTMLInputElement).value));
  document.querySelector('#capture-form')?.addEventListener('submit', (e) => { e.preventDefault(); const data = new FormData(e.target as HTMLFormElement); const record = makeRecord({ url: String(data.get('url')), title: String(data.get('title')), reason: String(data.get('reason')), selectedText: String(data.get('selectedText')), extract: String(data.get('extract')) }); live.unshift(record); save(); (e.target as HTMLFormElement).reset(); document.querySelector('#form-message')!.textContent = 'Saved. The evidence hash is ' + record.contentHash + '.'; renderRecords(); });
  document.querySelector('#records')?.addEventListener('click', (e) => { const target = e.target as HTMLElement; if (target.classList.contains('delete')) { live = live.filter((r) => r.id !== target.dataset.id); save(); renderRecords((document.querySelector('#search') as HTMLInputElement).value); } });
  document.querySelector('#export-json')?.addEventListener('click', () => download('bookmark-proofbook.json', exportJson(live), 'application/json'));
  document.querySelector('#export-html')?.addEventListener('click', () => download('bookmark-proofbook.html', exportHtml(live), 'text/html'));
  document.querySelector('#import-html')?.addEventListener('click', () => (document.querySelector('#html-file') as HTMLInputElement).click());
  document.querySelector('#html-file')?.addEventListener('change', async (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return; const links = parseBookmarksHtml(await file.text()); const existing = new Set(live.map((r) => r.url)); const added = links.filter((link) => !existing.has(link.url)).map((link) => makeRecord({ ...link, reason: 'Imported from browser bookmarks. Add why this link matters.', selectedText: '', extract: '' })); live = [...added, ...live]; save(); document.querySelector('#form-message')!.textContent = `Imported ${added.length} bookmarks. Add a reason when you revisit one.`; renderRecords(); });
  document.querySelector('#reset-demo')?.addEventListener('click', () => { localStorage.removeItem('demo:bookmark-proofbook:records'); load(); render(); });
  wireLicense();
}
function wireLicense() {
  const incoming = new URLSearchParams(location.search).get('license');
  if (incoming) { localStorage.setItem(`sb_license:${SLUG}`, incoming); const url = new URL(location.href); url.searchParams.delete('license'); history.replaceState({}, '', url); }
  const restore = document.querySelector('#restore-license');
  restore?.addEventListener('click', async () => { const token = (document.querySelector('#license-token') as HTMLInputElement).value.trim(); const status = document.querySelector('#license-status')!; if (!token) { status.textContent = 'Paste the token from your receipt first.'; return; } localStorage.setItem(`sb_license:${SLUG}`, token); status.textContent = 'License saved on this device. Checking it now.'; try { const result = await fetch(`https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`).then((r) => r.json()); localStorage.setItem(`sb_license_verdict:${SLUG}`, JSON.stringify({ ...result, checkedAt: Date.now() })); status.textContent = result.valid ? 'License active.' : 'License is not active. You can buy a new one above.'; } catch { status.textContent = 'License saved. We will check it when you are online.'; } });
}
function legal(kind: 'privacy' | 'terms') { const privacy = kind === 'privacy'; setTitle(`${privacy ? 'Privacy' : 'Terms'} — Bookmark Proofbook`); APP.innerHTML = `${header()}<main id="main" tabindex="-1" class="legal"><p class="eyebrow">${privacy ? 'PRIVACY' : 'TERMS'}</p><h1>${privacy ? 'Your bookmark evidence stays local' : 'Terms for Bookmark Proofbook'}</h1>${privacy ? `<p>Bookmark Proofbook stores bookmark records in browser or extension local storage. We do not run analytics or receive your records.</p><h2>What you control</h2><p>You can export and delete records in your browser. A license token is stored locally if you choose to add one. License verification contacts Sociobot only after you request it.</p><h2>Contact</h2><p>Email privacy@sociobot.in for privacy questions.</p>` : `<p>Bookmark Proofbook is a local-first tool. You are responsible for the links and notes you save.</p><h2>License</h2><p>The optional $19 license is a one-time purchase for expanded link checks. Sociobot/Dodo is the merchant of record. Refunds can revoke a license.</p><h2>No warranty</h2><p>Links can change or disappear. Keep your exported proofbook as your durable copy.</p>`}</main>${footer()}`; }
function notFound() { setTitle('Page not found — Bookmark Proofbook'); APP.innerHTML = `${header()}<main id="main" tabindex="-1" class="legal"><p class="eyebrow">404</p><h1>This page is not in the proofbook</h1><p>Return to the archive and keep what matters.</p><a class="button moss" href="/" data-nav>Return home</a></main>${footer()}`; }
function render() { if (location.pathname === '/') landing(); else if (isDemoRoute() || isAppRoute()) appView(); else if (location.pathname === '/privacy' || location.pathname === '/terms') legal(location.pathname.slice(1) as 'privacy' | 'terms'); else notFound(); const heading = APP.querySelector<HTMLElement>('h1'); if (heading) { heading.tabIndex = -1; heading.focus(); } bindGlobal(); }
function bindGlobal() { APP.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); nav(a.getAttribute('href')!); })); }
window.addEventListener('popstate', render); render();

export { hashText };
