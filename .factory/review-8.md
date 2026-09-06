# Save why each link mattered — strict review 8 — PASS

**Product:** Bookmark Proofbook

**Live URL:** <https://bookmark-proofbook.sociobot.in>

**Reviewed:** 2026-09-06

**Implementation candidate:** `9b76d91854223bb9a8044e65097dc278eab267cc`

**Documentation baseline:** `2fee51b27a15fa87f5817d4adb43781aa9f89889`

## Verdict

**PASS. Finding count: 0. Untested public claim count: 0.**

The live site and downloadable extension match the implementation candidate.
The product completes its real bookmark capture, search, link-check, import,
restore, and export job. No earlier finding reopened.

No product code was changed during this review.

## First screen before scrolling

Fresh Chromium contexts opened the live root at 1440 × 900 and 390 × 844.

| Question | Live answer |
| --- | --- |
| Job | **Save why each link mattered** |
| Audience | **For people with too many bookmarks to remember** |
| First action | **Try it with sample data** — it opens a sample proofbook with three bookmarks. |

The phone first screen also shows these three facts: bookmarks stay in this
browser, an opened proofbook works offline, and this release is free. Their
lower edges are 547.28, 591.08, and 634.88 CSS px. The extension-install link
measures 279.36 × 44 CSS px on both phone and desktop.

## Review inputs and candidate identity

All repository review and verification reports were read, including every
minor finding in reviews 1–7 and the verification defects. The work order's
separate `factory-evidence/bookmark-proofbook-verify-5/qa-report.md` file was
not mounted under `/work`; the full repository report
`.factory/verification-5.md` was present and read. This review independently
repeated the required checks instead of relying on that missing copy.

The implementation candidate is `9b76d91`. The three later commits through
the documentation baseline contain only repair evidence, handoff text, and the
previous verification report. Fresh production output matched the clean build:

- live JavaScript: 22,841 bytes, byte-identical;
- live CSS: 8,800 bytes, byte-identical;
- both hero files, social image, and favicon: byte-identical;
- extension zip: 292,819 bytes, byte-identical;
- all 15 extracted extension files: byte-identical.

## Sample and real-data isolation

- One activation opened `/?demo=1`. The first phone screen showed **Saved
  bookmarks (3)** and the realistic SQLite bookmark starting at y=405.21.
- The persistent strip said **Demo — sample data, nothing is saved.** It kept
  **Reset demo** and **Open my proofbook** visible at y=0–70.39 after scrolling
  to the last form action.
- A fourth bookmark kept its reason, selected words, extract, and extract code.
  Search found it by its saved reason. Remove changed the count to three, and
  immediate undo restored four.
- **Reset demo** restored exactly three samples. A real sentinel bookmark was
  unchanged byte for byte.
- **Open my proofbook** removed `demo:bookmark-proofbook:records` and preserved
  `proofbook:records` byte for byte.
- After the opened demo went offline, search still found the WCAG bookmark and
  HTML export completed. Cold offline reload and service-worker updates are not
  claimed; the live site has no service worker or web-app manifest.

## Every declared public claim

After `npm ci`, all 23 exact commands in `.factory/claims.json` ran separately
from the clean checkout. Each claim id is unique, each has exactly one matching
test tag, and there are no undeclared tags.

| Claim | Exact command | Result |
| --- | --- | --- |
| `save-bookmark-context` | `npm run test:e2e -- --grep @claim:save-bookmark-context` | PASS |
| `search-saved-context` | `npm run test:e2e -- --grep @claim:search-saved-context` | PASS |
| `portable-export` | `npm run test:e2e -- --grep @claim:portable-export` | PASS |
| `lossless-json-import` | `npm run test:extension -- --grep @claim:lossless-json-import` | PASS |
| `demo-namespace` | `npm run test:e2e -- --grep @claim:demo-namespace` | PASS |
| `one-click-demo` | `npm run test:e2e -- --grep @claim:one-click-demo` | PASS |
| `no-account-required` | `npm run test:e2e -- --grep @claim:no-account-required` | PASS |
| `local-records` | `npm run test:e2e -- --grep @claim:local-records` | PASS |
| `offline-session` | `npm run test:e2e -- --grep @claim:offline-session` | PASS |
| `current-price` | `npm run test:e2e -- --grep @claim:current-price` | PASS |
| `no-record-sync` | `npm run test:e2e -- --grep @claim:no-record-sync` | PASS |
| `no-analytics` | `npm run test:e2e -- --grep @claim:no-analytics` | PASS |
| `explicit-page-read` | `npm run test:extension -- --grep @claim:explicit-page-read` | PASS |
| `extension-local-records` | `npm run test:extension -- --grep @claim:extension-local-records` | PASS |
| `extract-cap` | `npm test -- --testNamePattern @claim:extract-cap` | PASS |
| `link-check-limit` | `npm run test:extension -- --grep @claim:link-check-limit` | PASS |
| `link-health-results` | `npm run test:extension -- --grep @claim:link-health-results` | PASS |
| `packaged-extension` | `npm run test:e2e -- --grep @claim:packaged-extension` | PASS |
| `unpacked-install` | `npm run test:extension -- --grep @claim:unpacked-install` | PASS |
| `reversible-delete` | `npm run test:e2e -- --grep @claim:reversible-delete` | PASS |
| `http-links-only` | `npm run test:e2e -- --grep @claim:http-links-only` | PASS |
| `browser-html-import` | `npm run test:e2e -- --grep @claim:browser-html-import` | PASS |
| `evidence-hash` | `npm test -- --testNamePattern @claim:evidence-hash` | PASS |

Landing, demo, app, privacy, terms, README, manifest, popup, import, and export
copy were compared with the registry. No missing, false, incomplete, or
untested public claim was found.

## Clean quality gates

| Command | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 12 tests |
| `npm run test:e2e` | PASS — 33 tests |
| `npm run test:extension` | PASS — 7 clean-profile installed-extension tests |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| `npm run build` | PASS — produced `dist/site` and the extension zip |

The production build contains 22,841 bytes of raw JavaScript and 8,800 bytes
of CSS. It loads no web font. Fresh mobile Lighthouse scores are Performance
100, Accessibility 100, Best Practices 100, and SEO 100. LCP is 1,399 ms, CLS
is 0, TBT is 3 ms, and total transfer is 127,994 bytes.

## Normal, invalid, boundary, and recovery paths

- Normal save, search, HTML/JSON export, browser HTML import, proofbook JSON
  restore, remove/undo, reset, exit, and link checking passed.
- A `javascript:` address focused the URL control, explained the HTTP(S) rule,
  stored nothing, and retained count zero.
- The 12,000-character extract boundary passed. Browser HTML import kept two
  unique HTTP(S) links and rejected a duplicate, JavaScript address, and FTP
  address.
- Versioned JSON restore preserved every bookmark field. Unsupported, unsafe,
  and duplicate-record inputs were rejected. Corrupt local storage was removed
  on reload and recovered to the designed empty state.
- The clean installed-extension tests loaded the MV3 artifact in fresh
  Chromium profiles. Explicit capture, extension-local storage, search,
  HTML/JSON export, lossless JSON import, remove/undo, 25-address bounded link
  checks, and reachable/changed/unreachable states with check times passed.
  The downloaded live zip is byte-identical to that tested artifact.

## Accessibility, privacy, routes, and links

- `/opt/fleet/lib/verify-url.sh` passed against HTTPS: title, `lang=en`, one
  h1, main landmark, image alt text, button names, and console checks passed.
- Fresh Playwright Axe checks found zero violations on `/`, `/demo`, `/app`,
  `/privacy`, `/terms`, and the designed 404.
- First Tab focused **Skip to main content** with a 4 px visible outline. Enter
  focused `main`. Back restored y=1100, focused the h1, and announced the route.
- A fresh phone sweep found no visible interactive target below 44 × 44 CSS px
  and no horizontal overflow. Reduced motion changed animation and transition
  durations to `0.00001s`.
- Site and demo workflows made no third-party request. There is no analytics,
  account, sync, third-party script, third-party font, payment call, or runtime
  AI call. The privacy page provides `privacy@sociobot.in`.
- `/`, `/demo`, `/app`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`, the
  social image, extension download, and all three sample-source links returned
  200. Hashed JavaScript and CSS use one-year immutable caching.
- `/missing-review-eight` deliberately returned HTTP 404 and rendered the
  designed page with its own title, h1, main, metadata, and home action. The
  expected 404 is not a defect.
- CSP, HSTS, `nosniff`, and referrer-policy headers are present. `frame-ancestors`
  is delivered in the response header.

This is a static site and local browser extension. It has no backend, tenant
store, health route, or product API. Tenant isolation, server restart
persistence, and 429/`Retry-After` checks do not apply. The brief makes
automatic summaries a non-goal, so no missing AI feature was found.

## Earlier finding disposition

| Earlier finding | Fresh disposition |
| --- | --- |
| F-1-1 | Fixed: Back restored y=1100, h1 focus, and the polite announcement. |
| F-1-2–F-1-5 | Fixed: stronger unsupported wording remains absent; extension storage and one-click sample claims passed. |
| F-1-6–F-1-8 | Fixed: route metadata, designed HTTP 404, h1 focus, and atomic route announcement passed. |
| F-1-9–F-1-14 | Fixed: headings are plain, the decorative caption is absent, extract code is explained, demo exit is accurate, and reader copy avoids implementation jargon. |
| F-2-1 | Fixed: a saved item is consistently a **bookmark** and its collection a **proofbook**. |
| F-3-1 | Fixed: realistic populated output is visible in the initial phone demo. |
| F-3-2–F-3-3 | Fixed: stronger unproved export wording is absent and every route publishes the social image. |
| F-3-4–F-3-5 | Fixed: lossless JSON restore passed and demo exit preserved real data while discarding sample data. |
| F-3-6–F-3-7 | Fixed: the limit heading and bookmark terminology remain accurate. |
| F-4-1 | Fixed: local-storage, opened-session offline, and current-price facts fit before the phone fold. |
| F-6-1–F-6-4 | Fixed: all health outcomes and times passed, sample controls stay visible, manifest wording is bounded, and all three required facts are present. |
| F-7-1 | Fixed: the phone install link measures 279.36 × 44 CSS px and the regression covers it. |

Earlier verification defects also remain fixed: the broken claim command,
false changed result, missing extension package, dead checkout, skipped focus,
unlisted privacy claims, undersized controls, retained demo data, irreversible
delete, unsafe URL entry, duplicate import, wrong 404/canonical behavior, short
asset caching, vulnerable install, and missing installation/deployment docs all
passed their current checks.

## Evidence

- `.factory/evidence/review-8/live-check.json`
- `.factory/evidence/review-8/claims-results.json`
- `.factory/evidence/review-8/claim-registry-audit.json`
- `.factory/evidence/review-8/quality-gates.json`
- `.factory/evidence/review-8/identity.json`
- `.factory/evidence/review-8/links-headers.json`
- `.factory/evidence/review-8/lighthouse-live.json`
- `.factory/evidence/review-8/verify/verify.json`
- `.factory/evidence/review-8/live-desktop.png`
- `.factory/evidence/review-8/live-phone.png`
- `.factory/evidence/review-8/live-demo-phone.png`
- `.factory/evidence/review-8/live-demo-scrolled-phone.png`
