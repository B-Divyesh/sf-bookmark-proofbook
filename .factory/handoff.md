# Bookmark Proofbook handoff

## What shipped

- MV3 WXT browser extension with explicit active-tab capture, user-written
  reason, selected text, capped 12,000-character extract, evidence hash,
  browser HTML import, context search, JSON/standalone HTML export, and
  explicit link health checks.
- Static companion site with landing page, `/demo`, `/app`, `/privacy`,
  `/terms`, designed 404, static metadata, and a packaged extension download
  at `dist/site/downloads/bookmark-proofbook-extension.zip` after build.
- One-click demo records are isolated in `demo:bookmark-proofbook:records`.
  Real local workspace data uses `proofbook:records`.
- $19 one-time license UI, hosted Sociobot checkout link, local license
  restore, and background verification. Core capture, search, and export stay
  free.
- Original generated hero art, optimized to a 113 KB WebP. Prompt and
  provenance are recorded in `design.md`.

## Verification

Run from a clean checkout:

```sh
npm install
npm test
npm run test:e2e
npm run build
```

Completed locally on 2026-08-28:

- `npm test`: 5 unit tests passed.
- `npm run test:e2e`: 5 Playwright tests passed, including all sandbox claims,
  export download, no external demo requests, no console errors, and axe with
  zero serious/critical violations.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed; `dist/site/index.html` is the static deploy root.
- Lighthouse 13.4.1 on production preview: home Performance 100,
  Accessibility 100, Best Practices 100, SEO 100; LCP 1.8 s; CLS 0. Demo was
  also 100/100/100/100 with LCP 1.0 s and CLS 0.
- Initial site JS is 6.72 KB gzip; CSS is 2.22 KB gzip; hero WebP is 113 KB.

## Known gaps / factory follow-up

- The checkout and verification URLs use the product slug as required, but
  license activation needs the factory to register the product in Sociobot.
- Link checks depend on the destination allowing an extension fetch. A blocked
  destination is clearly reported as unreachable; no bypass is attempted.
