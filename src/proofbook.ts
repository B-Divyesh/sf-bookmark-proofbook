export type Health = 'unchecked' | 'alive' | 'changed' | 'unreachable';
export const EXTRACT_CHARACTER_LIMIT = 12_000;
export const LINK_CHECK_LIMIT = 25;

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

export interface ProofbookExport {
  format: 'Bookmark Proofbook';
  version: 1;
  exportedAt: string;
  records: BookmarkRecord[];
}

export interface ProofbookImportPlan {
  records: BookmarkRecord[];
  added: number;
  replaced: number;
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

export function plainText(value: string, limit = EXTRACT_CHARACTER_LIMIT) {
  return value.replace(/\s+/g, ' ').trim().slice(0, limit);
}

/**
 * Turn page markup into the stable, small evidence extract used for comparison.
 *
 * Browser `innerText` depends on layout, while `textContent` can join adjacent
 * block elements.  This deliberately inserts whitespace around structural
 * elements before removing markup, so capturing a page and fetching it again
 * take the same path.
 */
export function extractTextFromHtml(html: string, limit = EXTRACT_CHARACTER_LIMIT) {
  return plainText(
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(?:script|style|noscript|template)\b[^>]*>[\s\S]*?<\/(?:script|style|noscript|template)>/gi, ' ')
      .replace(/<\/?(?:address|article|aside|blockquote|br|dd|div|dl|dt|figcaption|figure|footer|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|table|td|th|tr|ul)\b[^>]*>/gi, ' ')
      .replace(/<[^>]*>/g, ' '),
    limit,
  );
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

export function normalizeHttpUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new TypeError('Bookmark addresses must start with http:// or https://.');
  }
  return url.href;
}

export function makeRecord(input: Pick<BookmarkRecord, 'url' | 'title' | 'reason' | 'selectedText' | 'extract'>): BookmarkRecord {
  const extract = plainText(input.extract);
  return {
    ...input, url: normalizeHttpUrl(input.url), extract, selectedText: plainText(input.selectedText, 3000), reason: plainText(input.reason, 2000),
    id: crypto.randomUUID(), contentHash: hashText(extract), createdAt: new Date().toISOString(), health: 'unchecked',
  };
}

export function recordsForLinkCheck(records: BookmarkRecord[]) {
  return records.slice(0, LINK_CHECK_LIMIT);
}

export function exportJson(records: BookmarkRecord[]) {
  const proofbook: ProofbookExport = { format: 'Bookmark Proofbook', version: 1, exportedAt: new Date().toISOString(), records };
  return JSON.stringify(proofbook, null, 2);
}

function invalidProofbook(message: string): never {
  throw new TypeError(`This is not a valid Bookmark Proofbook JSON file: ${message}`);
}

/**
 * Parse the product's own versioned backup format without changing any saved
 * bookmark fields. Browser-bookmark HTML is intentionally handled separately:
 * it contains only links and titles, while this format is a lossless backup.
 */
export function parseProofbookJson(value: string): BookmarkRecord[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return invalidProofbook('the file is not JSON.');
  }
  if (!parsed || typeof parsed !== 'object') return invalidProofbook('the top level is missing.');
  const proofbook = parsed as Partial<ProofbookExport>;
  if (proofbook.format !== 'Bookmark Proofbook') return invalidProofbook('the format name is missing.');
  if (proofbook.version !== 1) return invalidProofbook('this version is not supported.');
  if (!Array.isArray(proofbook.records)) return invalidProofbook('the bookmark list is missing.');

  return proofbook.records.map((item, index) => {
    if (!item || typeof item !== 'object') return invalidProofbook(`bookmark ${index + 1} is incomplete.`);
    const record = item as Partial<BookmarkRecord>;
    const stringFields: Array<keyof BookmarkRecord> = ['id', 'url', 'title', 'reason', 'selectedText', 'extract', 'contentHash', 'createdAt'];
    if (stringFields.some((field) => typeof record[field] !== 'string')) return invalidProofbook(`bookmark ${index + 1} has a missing field.`);
    if (!record.id || record.id.length > 200 || record.title!.length > 300 || record.reason!.length > 2000 || record.selectedText!.length > 3000 || record.extract!.length > EXTRACT_CHARACTER_LIMIT) {
      return invalidProofbook(`bookmark ${index + 1} has invalid text lengths.`);
    }
    try {
      normalizeHttpUrl(record.url!);
    } catch {
      return invalidProofbook(`bookmark ${index + 1} does not have an HTTP or HTTPS address.`);
    }
    if (!/^[a-f0-9]{8}$/.test(record.contentHash!)) return invalidProofbook(`bookmark ${index + 1} has an invalid extract code.`);
    if (Number.isNaN(Date.parse(record.createdAt!)) || (record.checkedAt !== undefined && (typeof record.checkedAt !== 'string' || Number.isNaN(Date.parse(record.checkedAt))))) {
      return invalidProofbook(`bookmark ${index + 1} has an invalid date.`);
    }
    if (!['unchecked', 'alive', 'changed', 'unreachable'].includes(record.health || '')) return invalidProofbook(`bookmark ${index + 1} has an invalid link status.`);
    return {
      id: record.id!, url: record.url!, title: record.title!, reason: record.reason!, selectedText: record.selectedText!, extract: record.extract!,
      contentHash: record.contentHash!, createdAt: record.createdAt!, ...(record.checkedAt ? { checkedAt: record.checkedAt } : {}), health: record.health!,
    };
  });
}

/** Prepare a confirmed, lossless import. Imported URLs replace local versions;
 * other local bookmarks remain in place. Repeated URLs in a backup are ignored. */
export function planProofbookImport(existing: BookmarkRecord[], imported: BookmarkRecord[]): ProofbookImportPlan {
  const seen = new Set<string>();
  const uniqueImported = imported.filter((record) => {
    if (seen.has(record.url)) return false;
    seen.add(record.url);
    return true;
  });
  const existingUrls = new Set(existing.map((record) => record.url));
  const replaced = uniqueImported.filter((record) => existingUrls.has(record.url)).length;
  const added = uniqueImported.length - replaced;
  return { records: [...uniqueImported, ...existing.filter((record) => !seen.has(record.url))], added, replaced };
}

export function exportHtml(records: BookmarkRecord[]) {
  const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
  const rows = records.map((r) => `<article><h2><a href="${escape(r.url)}">${escape(r.title)}</a></h2><p><strong>Why I saved it:</strong> ${escape(r.reason || 'No reason recorded.')}</p><blockquote>${escape(r.selectedText || 'No selected text recorded.')}</blockquote><p>${escape(r.extract || 'No page extract recorded.')}</p><footer>Saved ${escape(new Date(r.createdAt).toLocaleDateString())} · Extract code ${escape(r.contentHash)} · Status ${escape(r.health)}</footer></article>`).join('\n');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bookmark Proofbook export</title><style>body{max-width:760px;margin:3rem auto;padding:0 1rem;font:16px/1.55 system-ui;color:#1b211c;background:#f7f4eb}article{border-top:2px solid #1b211c;padding:1.5rem 0}a{color:#295b3b}blockquote{border-left:4px solid #b8ca8b;margin-left:0;padding-left:1rem}footer{color:#3b443b;font-size:.85rem}</style><main><h1>Bookmark Proofbook</h1><p>Portable bookmark evidence. Exported ${new Date().toLocaleString()}.</p>${rows}</main></html>`;
}

export function parseBookmarksHtml(html: string): Pick<BookmarkRecord, 'url' | 'title'>[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return dedupeBookmarkLinks(Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[href]'))
    .map((a) => ({ url: a.href, title: plainText(a.textContent || a.href, 300) }))
    .filter((item) => /^https?:/.test(item.url)));
}

export function dedupeBookmarkLinks(links: Pick<BookmarkRecord, 'url' | 'title'>[]) {
  const urls = new Set<string>();
  return links.filter((item) => {
    if (urls.has(item.url)) return false;
    urls.add(item.url);
    return true;
  });
}
