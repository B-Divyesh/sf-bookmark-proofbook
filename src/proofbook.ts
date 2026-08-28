export type Health = 'unchecked' | 'alive' | 'changed' | 'unreachable';

export interface BookmarkRecord {
  id: string;
  url: string;
  title: string;
  reason: string;
  selectedText: string;
  extract: string;
  contentHash: string;
  createdAt: string;
  checkedAt?: string;
  health: Health;
}

export const sampleRecords: BookmarkRecord[] = [
  {
    id: 'sample-sqlite', url: 'https://www.sqlite.org/whentouse.html', title: 'Appropriate Uses For SQLite',
    reason: 'Keep this for deciding when a small local database is the sensible choice.',
    selectedText: 'SQLite is not directly comparable to client/server SQL database engines.',
    extract: 'SQLite is an in-process library. It is a compact and reliable way to keep structured data close to one application. The page explains where a server database is still the better fit.',
    contentHash: '4fa1c0e7', createdAt: '2025-04-12T09:31:00.000Z', checkedAt: '2025-05-01T08:00:00.000Z', health: 'alive',
  },
  {
    id: 'sample-accessibility', url: 'https://www.w3.org/WAI/WCAG22/quickref/', title: 'How to Meet WCAG 2.2',
    reason: 'Use this when reviewing keyboard paths and readable contrast before release.',
    selectedText: 'All functionality of the content is operable through a keyboard interface.',
    extract: 'A filterable reference for WCAG success criteria. It gives practical checks for keyboard operation, focus appearance, labels, and contrast.',
    contentHash: 'be2b9401', createdAt: '2025-05-08T14:16:00.000Z', checkedAt: '2025-05-20T08:00:00.000Z', health: 'changed',
  },
  {
    id: 'sample-web', url: 'https://web.dev/articles/howbrowserswork', title: 'How browsers work',
    reason: 'Return here before making claims about parsing, rendering, or browser work.',
    selectedText: 'The rendering engine starts getting the contents of the requested document.',
    extract: 'A practical explanation of navigation, parsing, rendering and painting. It is a good source to revisit when a browser detail feels fuzzy.',
    contentHash: 'dc8a1182', createdAt: '2025-06-17T11:08:00.000Z', health: 'unchecked',
  },
];

export function plainText(value: string, limit = 12000) {
  return value.replace(/\s+/g, ' ').trim().slice(0, limit);
}

export function hashText(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function searchRecords(records: BookmarkRecord[], query: string) {
  const terms = plainText(query).toLowerCase().split(' ').filter(Boolean);
  if (!terms.length) return records;
  return records.filter((record) => {
    const haystack = [record.title, record.url, record.reason, record.selectedText, record.extract].join(' ').toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function makeRecord(input: Pick<BookmarkRecord, 'url' | 'title' | 'reason' | 'selectedText' | 'extract'>): BookmarkRecord {
  const extract = plainText(input.extract);
  return {
    ...input, extract, selectedText: plainText(input.selectedText, 3000), reason: plainText(input.reason, 2000),
    id: crypto.randomUUID(), contentHash: hashText(extract), createdAt: new Date().toISOString(), health: 'unchecked',
  };
}

export function exportJson(records: BookmarkRecord[]) {
  return JSON.stringify({ format: 'Bookmark Proofbook', version: 1, exportedAt: new Date().toISOString(), records }, null, 2);
}

export function exportHtml(records: BookmarkRecord[]) {
  const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
  const rows = records.map((r) => `<article><h2><a href="${escape(r.url)}">${escape(r.title)}</a></h2><p><strong>Why I saved it:</strong> ${escape(r.reason || 'No reason recorded.')}</p><blockquote>${escape(r.selectedText || 'No selected text recorded.')}</blockquote><p>${escape(r.extract || 'No page extract recorded.')}</p><footer>Saved ${escape(new Date(r.createdAt).toLocaleDateString())} · Evidence hash ${escape(r.contentHash)} · Status ${escape(r.health)}</footer></article>`).join('\n');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bookmark Proofbook export</title><style>body{max-width:760px;margin:3rem auto;padding:0 1rem;font:16px/1.55 system-ui;color:#1b211c;background:#f7f4eb}article{border-top:2px solid #1b211c;padding:1.5rem 0}a{color:#295b3b}blockquote{border-left:4px solid #b8ca8b;margin-left:0;padding-left:1rem}footer{color:#3b443b;font-size:.85rem}</style><main><h1>Bookmark Proofbook</h1><p>Portable bookmark evidence. Exported ${new Date().toLocaleString()}.</p>${rows}</main></html>`;
}

export function parseBookmarksHtml(html: string): Pick<BookmarkRecord, 'url' | 'title'>[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[href]')).map((a) => ({ url: a.href, title: plainText(a.textContent || a.href, 300) }))
    .filter((item) => /^https?:/.test(item.url));
}
