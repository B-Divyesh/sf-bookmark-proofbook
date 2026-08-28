# Independent verification 3 — PASS

**Candidate:** `44501d0aae3db16951fa5cf79463d15c23f8747e`

**Live URL:** <https://bookmark-proofbook.sociobot.in>

**Verified:** 2026-08-28 from the clean candidate checkout; no product code was changed.

## Release verdict

**PASS.** Fresh evidence resolves the earlier deployment concern. Every test
listed in `.factory/claims.json` passes, the live product is byte-identical to
the candidate build, and the browser extension completes the brief's capture,
search, link-change, import, and portable-export job end to end. No critical,
high, or medium defect remains.

## Mandatory first gates

### Cold first-read

The first live screen answers the required questions in plain words:

- What: **Keep why each link mattered.**
- Who: **For people with too many bookmarks to remember.**
- First action: **Try it with sample data**, beside **Opens three saved
  research notes.**

One click opens `/demo` with three realistic records and the persistent
**Demo — sample data, nothing is saved** banner. The gate passes on desktop
and at 390 by 844 CSS pixels.

### Every declared claim

After `npm ci`, every exact command in `.factory/claims.json` was run
individually from the candidate checkout.

| Claim | Exact command | Result |
| --- | --- | --- |
| `search-saved-context` | `npm run test:e2e -- --grep @claim:search-saved-context` | PASS, 1/1 |
| `portable-export` | `npm run test:e2e -- --grep @claim:portable-export` | PASS, 1/1 |
| `demo-namespace` | `npm run test:e2e -- --grep @claim:demo-namespace` | PASS, 1/1 |
| `no-account-required` | `npm run test:e2e -- --grep @claim:no-account-required` | PASS, 1/1 |
| `local-records` | `npm run test:e2e -- --grep @claim:local-records` | PASS, 1/1 |
| `offline-session` | `npm run test:e2e -- --grep @claim:offline-session` | PASS, 1/1 |
| `no-record-sync` | `npm run test:e2e -- --grep @claim:no-record-sync` | PASS, 1/1 |
| `no-analytics` | `npm run test:e2e -- --grep @claim:no-analytics` | PASS, 1/1 |
| `explicit-page-read` | `npm run test:extension -- --grep @claim:explicit-page-read` | PASS, 1/1 |
| `extract-cap` | `npm test -- --testNamePattern @claim:extract-cap` | PASS, 1/1 |
| `link-check-limit` | `npm run test:extension -- --grep @claim:link-check-limit` | PASS, 1/1 |
| `packaged-extension` | `npm run test:e2e -- --grep @claim:packaged-extension` | PASS, 1/1 |
| `unpacked-install` | `npm run test:extension -- --grep @claim:unpacked-install` | PASS, 1/1 |
| `reversible-delete` | `npm run test:e2e -- --grep @claim:reversible-delete` | PASS, 1/1 |
| `http-links-only` | `npm run test:e2e -- --grep @claim:http-links-only` | PASS, 1/1 |
| `browser-html-import` | `npm run test:e2e -- --grep @claim:browser-html-import` | PASS, 1/1 |
| `evidence-hash` | `npm test -- --testNamePattern @claim:evidence-hash` | PASS, 1/1 |

The live landing page, legal pages, extension UI, and `README.md` were also
cross-checked against this inventory. No unlisted product or privacy promise
was found.

## Clean local quality gates

| Gate | Fresh result |
| --- | --- |
| `npm ci` | PASS; 256 packages, zero audit findings |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS, 10/10 Vitest tests |
| `npm run test:e2e` | PASS, 24/24 Playwright tests |
| `npm run test:extension` | PASS, 4/4 installed-extension tests |
| `npm audit --omit=dev` | PASS, zero vulnerabilities |
| `npm run build` | PASS; `dist/site/` and the MV3 zip produced |

The exact production build is 17,395 bytes of initial JavaScript (6,759 gzip),
7,661 bytes of CSS (2,425 gzip), no web fonts, and a 115,156-byte hero WebP.
These are well inside the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero
budgets.

## End-to-end product evidence

### Companion site and demo

In a fresh live browser context, the demo started with three records in only
`demo:bookmark-proofbook:records`. Searching `keyboard interface` returned the
WCAG record. HTML export was standalone and contained no script. **Start for
real** deleted the demo namespace and opened an empty real workspace.

The real workspace handled these independent cases:

- Empty submission focused the URL field and reported “Please fill out this
  field.”
- `javascript:alert(1)` was rejected with the HTTP/HTTPS recovery instruction
  and stored zero records.
- A valid record with exactly 12,000 extract characters saved all 12,000.
- Remove changed the count and **Undo remove** restored the record.
- Malformed local-storage JSON was cleared and recovered to the empty state.
- Importing 500 unique bookmarks took 52 ms in this run; search found item 499
  and JSON export contained all 500 records.

No console or page error occurred in these normal, boundary, invalid, and
recovery flows.

### Downloaded browser extension

The live zip downloaded as 268,642 bytes, unpacked with `manifest_version: 3`,
and loaded in a clean Chromium profile. A separate mutable local-page exercise
proved the full job:

- Before **Capture this page**, extension storage was empty and the extension
  did not request the source.
- The explicit action captured the title, selected words, limited extract, and
  reason into `chrome.storage.local`.
- Search found the record by its reason. JSON and standalone HTML exports both
  contained it.
- The first explicit link check made one source request and reported the
  unchanged page as reachable. After the fixture text changed, a second check
  reported the page as changed.
- Remove and immediate undo both persisted correctly.
- No extension console or page error occurred.

The 26-record regression separately proves that no saved address is contacted
before **Check links**, one action checks exactly 25, and record 26 remains
unchecked.

## Live deployment identity and routing

Fresh production assets exactly match the candidate build:

| Artifact | SHA-256 | Comparison |
| --- | --- | --- |
| JavaScript `index-C6Zxwtte.js` | `0273a913c6ac747aca247d6d7ced214dc6f9069cab002b22d1832a7e0a474065` | byte-identical |
| CSS `index-D4omoN8z.css` | `8e05b6398887e6e52999988eafb47e307d1564b9e99f4b6923157f3e86924d0a` | byte-identical |
| Hero WebP | `4aec68af8426de65d674b0e1632313da20c308e324e7c3db18896e0b17db8558` | byte-identical |
| Extension zip | `c18d03ea2198f7203fe41cdd100b9d0fa3f8c53a09b2ab2dd5156a5fa07327b4` | byte-identical |

`/`, `/demo`, `/app`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`, and
the zip return 200. An unknown route returns a designed HTTP 404. Each real
route publishes its own title and canonical URL. Every rendered link was
crawled; all internal links, the download, and all three sample sources return
200.

Hashed JS and CSS return `Cache-Control: public, max-age=31536000, immutable`.
The changeable extension zip returns a 10-minute revalidation policy. HTML uses
a 30-second revalidation policy.

## Privacy, security, accessibility, and performance

- Cold landing and the complete live capture/search/import/export flow made
  only same-origin requests. No analytics or telemetry request appeared.
- The extension made a saved-source request only after the explicit link-check
  action. Capture itself used the active tab without a source request.
- Live headers include CSP, HSTS, `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy: strict-origin-when-cross-origin`. No CSP violation appeared.
- `/opt/fleet/lib/verify-url.sh` passes: title, `lang`, one h1, main landmark,
  image alt text, labels, and console/page checks.
- Live Axe found zero serious or critical findings on `/`, `/demo`, `/app`,
  `/privacy`, `/terms`, and the 404. The installed popup also passed Axe.
- Keyboard Tab reaches the skip link first with a 4 px rust focus outline;
  Enter moves focus to `main`. There was no trap. At 390 px, tested nav, demo,
  record, removal, and footer targets are at least 44 by 44 CSS pixels, with no
  horizontal overflow.
- Reduced-motion emulation changes the record animation to `0.00001s`.
- Live mobile Lighthouse: Performance 98, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.4 s, TBT 170 ms, CLS 0, and 123 KiB total.

This is a static companion site plus browser extension, not a PWA or backend.
It registers no site service worker, exposes no server-side product endpoint,
makes no product-unlock call, and requires no sign-in. PWA update/offline
reload, backend concurrency/persistence, API 429 allowance, and Entra authority
checks therefore do not apply. The narrower claim that an already opened
workspace keeps working after connection loss passed.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.

## Non-blocking limits and next steps

- Installation is deliberately documented as download, extract, and **Load
  unpacked** because there is no Chrome Web Store or Edge Add-ons listing.
- Cold offline reload is not supported or claimed; only the opened workspace
  remains usable after connection loss.
- The researched monetization direction is one-time purchase, but this release
  exposes no paid tier or checkout. Register the Sociobot product before
  advertising a paid unlock; do not add a direct payment-provider integration.
