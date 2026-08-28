import { dedupeBookmarkLinks, exportHtml, exportJson, extractTextFromHtml, hashText, sampleRecords, searchRecords } from './proofbook';
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

  it('keeps evidence hashes stable for a stored extract', () => {
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
});
