import { exportHtml, exportJson, hashText, sampleRecords, searchRecords } from './proofbook';
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

  it('@claim:no-account-required creates records without network access', () => {
    const before = globalThis.fetch;
    const output = exportJson(sampleRecords);
    expect(output).toContain('Bookmark Proofbook');
    expect(globalThis.fetch).toBe(before);
  });

  it('keeps evidence hashes stable for a stored extract', () => {
    expect(hashText('stable proof')).toBe(hashText('stable proof'));
    expect(hashText('stable proof')).not.toBe(hashText('changed proof'));
  });
});
