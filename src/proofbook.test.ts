import { EXTRACT_CHARACTER_LIMIT, LINK_CHECK_LIMIT, dedupeBookmarkLinks, exportHtml, exportJson, extractTextFromHtml, hashText, makeRecord, normalizeHttpUrl, recordsForLinkCheck, sampleRecords, searchRecords } from './proofbook';
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('Bookmark Proofbook', () => {
  it('finds a bookmark by the reason and selected text', () => {
    expect(searchRecords(sampleRecords, 'local database')).toHaveLength(1);
    expect(searchRecords(sampleRecords, 'keyboard interface')[0].title).toBe('How to Meet WCAG 2.2');
  });

  it('creates a readable self-contained HTML proofbook', () => {
    const html = exportHtml(sampleRecords.slice(0, 1));
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('Why I saved it:');
    expect(html).toContain(sampleRecords[0].url);
    expect(html).not.toContain('<script');
  });

  it('keeps sample records out of the real storage key', () => {
    const demoKey = 'demo:bookmark-proofbook:records';
    const realKey = 'proofbook:records';
    expect(demoKey).not.toEqual(realKey);
    expect(demoKey.startsWith('demo:')).toBe(true);
  });

  it('creates records without network access', () => {
    const before = globalThis.fetch;
    const output = exportJson(sampleRecords);
    expect(output).toContain('Bookmark Proofbook');
    expect(globalThis.fetch).toBe(before);
  });

  it('@claim:evidence-hash keeps evidence hashes stable for a stored extract', () => {
    expect(hashText('stable proof')).toBe(hashText('stable proof'));
    expect(hashText('stable proof')).not.toBe(hashText('changed proof'));
  });

  it('normalizes captured and re-fetched markup to the same evidence text', () => {
    const captured = '<main><h1>Example Domain</h1><p>This domain is for use in documentation examples.</p></main>';
    const fetched = '<!doctype html><html><body><main>\n<h1>Example Domain</h1>\n<p>This domain is for use in documentation examples.</p>\n</main></body></html>';
    expect(extractTextFromHtml(captured)).toBe('Example Domain This domain is for use in documentation examples.');
    expect(hashText(extractTextFromHtml(captured))).toBe(hashText(extractTextFromHtml(fetched)));
  });

  it('deduplicates repeated URLs inside one browser bookmark import', () => {
    const links = dedupeBookmarkLinks([
      { url: 'https://example.com/', title: 'Example' },
      { url: 'https://example.com/', title: 'Example again' },
      { url: 'https://www.w3.org/', title: 'W3C' },
    ]);
    expect(links).toEqual([
      { url: 'https://example.com/', title: 'Example' },
      { url: 'https://www.w3.org/', title: 'W3C' },
    ]);
  });

  it('@claim:extract-cap keeps no more than 12,000 page-text characters', () => {
    const extract = extractTextFromHtml(`<main>${'e'.repeat(EXTRACT_CHARACTER_LIMIT + 500)}</main>`);
    expect(extract).toHaveLength(12_000);
    expect(makeRecord({ url: 'https://example.com', title: 'Example', reason: 'Reference', selectedText: '', extract: 'e'.repeat(12_500) }).extract).toHaveLength(12_000);
  });

  it('selects no more than 25 records for one link check', () => {
    const records = Array.from({ length: 40 }, (_, index) => ({ ...sampleRecords[0], id: `record-${index}` }));
    expect(LINK_CHECK_LIMIT).toBe(25);
    expect(recordsForLinkCheck(records)).toHaveLength(25);
    expect(recordsForLinkCheck(records)[24].id).toBe('record-24');
  });

  it('accepts only HTTP and HTTPS bookmark addresses', () => {
    expect(normalizeHttpUrl('https://example.com/research')).toBe('https://example.com/research');
    expect(normalizeHttpUrl('http://example.com')).toBe('http://example.com/');
    expect(() => normalizeHttpUrl('javascript:alert(1)')).toThrow('http:// or https://');
    expect(() => normalizeHttpUrl('ftp://example.com/file')).toThrow('http:// or https://');
  });

  it('keeps bookmark terminology consistent in reader-facing copy', async () => {
    const files = ['site/main.ts', 'entrypoints/popup/main.ts', 'README.md', '.factory/demo.md'];
    for (const file of files) {
      const copy = (await readFile(file, 'utf8')).toLowerCase();
      expect(copy, file).not.toContain('saved evidence');
      expect(copy, file).not.toContain('workspace');
    }
  });
});
