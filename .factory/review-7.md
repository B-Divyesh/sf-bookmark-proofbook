# Save bookmark context — strict review 7 — FAIL

**Product:** Bookmark Proofbook  
**Live URL:** <https://bookmark-proofbook.sociobot.in>  
**Reviewed:** 2026-09-06  
**Implementation candidate:** `324ce5b57a9135799831939b13c7d2126bf29cbd`  
**Documentation baseline:** `72a5f37c2bf035ce5121f789eaa678b051dace22`

## Verdict

**FAIL.** Finding count: **1**. Untested public claim count: **0**.

The job, demo, local-data isolation, all 23 declared claims, clean build, live
routes, offline session, and downloaded extension work. One minor phone touch
target does not meet the required 44 px minimum. A PASS requires zero findings
of every severity, so the otherwise passing product cannot receive PASS.

No product code was changed during this review.

## First screen before scrolling

Fresh Chromium contexts opened the live root at 1440 × 900 and 390 × 844.

| Question | Answer shown on the live first screen |
| --- | --- |
| What is the job? | “Save why each link mattered.” |
| Who is it for? | “For people with too many bookmarks to remember, save context and find the resource again.” |
| What should I do first? | “Try it with sample data,” followed by “Opens a sample proofbook with three bookmarks.” |

The phone screen also shows all three required facts before scrolling:
bookmarks stay in this browser, an opened proofbook works offline, and the
release is free.

## Finding

### Minor — F-7-1: The phone install link has a 19 px-high touch target

**Location:** `/`, 390 × 844 viewport, **Install the browser extension** below
the three first-screen facts.

The live link measures 279.36 × 19 CSS px. It is the only visible interactive
element below 44 px across `/`, `/demo`, `/app`, `/privacy`, and `/terms` in the
phone sweep. The accessibility and design contracts require touch targets to
be at least 44 × 44 CSS px. The link remains readable and operable, so this is
minor rather than blocking.

**Required repair:** Give the link a 44 px minimum target, for example with an
inline-flex wrapper, alignment, and vertical padding. Add it to the existing
390 px touch-target regression instead of testing only header, demo, record,
and footer controls.

Evidence: `.factory/evidence/review-7/touch-targets.json` and
`.factory/evidence/review-7/live-phone.png`.

## Sample and real-data isolation

- One click on **Try it with sample data** opened `/?demo=1` with three
  realistic SQLite, WCAG, and browser-rendering bookmarks.
- The first sample was visible on the initial phone screen. The fixed sample
  strip remained visible at the final form action with **Reset demo** and
  **Open my proofbook**.
- A fourth sample kept its reason, selected words, extract, and extract code.
  Search found it by its reason. Remove and immediate undo both worked.
- **Reset demo** restored exactly three samples. Leaving the demo removed
  `demo:bookmark-proofbook:records` and preserved a seeded
  `proofbook:records` value byte for byte.
- The complete flow made no third-party request and logged no console error.
- An opened demo still searched and exported HTML after the context went
  offline. Cold offline reload and service-worker update are not claimed; the
  live site has no service-worker registration or web-app manifest.

## Every declared claim

A temporary clean clone at documentation SHA `72a5f37` received `npm ci`.
Every exact command from `.factory/claims.json` then ran separately.

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

The 23 ids are unique. Each has exactly one matching `@claim:<id>` tag, and no
undeclared tag exists. Landing, app, demo, legal, README, manifest, import,
export, and installed-extension copy were compared with the registry. Manual
live checks also covered extension browser-HTML import and both site and
extension malformed-JSON recovery. No missing, false, incomplete, or untested
public claim was found.

## Clean quality gates

| Command | Clean-clone result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 12 tests |
| `npm run test:e2e` | PASS — 33 tests |
| `npm run test:extension` | PASS — 7 clean installed-extension tests |
| `npm run build` | PASS — `dist/site` and 292,812-byte extension zip |
| `npm audit --omit=dev` | PASS — zero vulnerabilities |

The clean build contains 22.82 kB raw / 8.18 kB gzip JavaScript and 8.73 kB
raw / 2.66 kB gzip CSS. The selected phone hero is 22.59 kB. No web font is
loaded.

## Live site and installed extension

- The downloaded live zip was extracted into a new profile and loaded as an
  MV3 extension. It reports version 1.0.2 and matches every file in the clean
  `.output/chrome-mv3` build.
- Nothing was captured or stored before **Capture this page**. Explicit capture
  kept title, selected words, reason, extract, and extract code in
  `chrome.storage.local`. Search and both exports worked.
- A fresh live link check made no saved-address request before the button. It
  then stored reachable, changed, and unreachable states with valid check
  times. The 25-link limit passed in the declared clean claim.
- Browser HTML import accepted two unique HTTPS links and rejected a duplicate,
  JavaScript address, and FTP address. Malformed proofbook JSON showed a useful
  error without changing stored data.
- The installed popup had no serious or critical Axe violation.
- Live JavaScript, CSS, both hero files, and every extension file match the
  clean candidate build.

## Normal, invalid, boundary, and recovery paths

Normal capture, search, readable HTML/JSON export, browser HTML import,
versioned JSON restore, remove/undo, reset, exit, and link checking passed.

Invalid `javascript:` entry focused the URL control, explained the HTTP(S)
rule, and stored nothing. The extract input and stored record stopped at 12,000
characters. Malformed JSON preserved existing data. Corrupt local storage was
discarded and recovered to the designed empty state. JSON import previewed
additions and replacements before mutation; cancel changed nothing.

## Routes, accessibility, privacy, and performance

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200. Each had its own
  title, description, canonical, Open Graph/Twitter metadata, `lang=en`, one
  h1, one main, skip link, header, and footer.
- `/missing-review-seven` deliberately returned HTTP 404 and rendered the
  designed noindex page with its own metadata and home action. This expected
  404 is not a defect.
- Playwright Axe found zero violations on all normal routes and the 404. The
  factory URL verifier found no console error, missing alt text, unlabeled
  button, or required-structure error.
- First Tab focused the skip link with a 4 px outline; Enter focused main.
  The exact fresh Back regression restored y=1100, focused the h1, and updated
  the polite route announcement. No keyboard trap or custom widget was found.
- Reduced motion shortened the record animation to 0.00001 seconds. The 390 px
  page retained content without horizontal overflow. F-7-1 is the one target
  size exception.
- Site and demo workflows made no third-party request. There is no analytics,
  third-party font/script, billing call, runtime AI call, account, or sync
  service. The privacy page gives `privacy@sociobot.in` for privacy requests.
- Product routes, zip, image/metadata files, and all three sample-source links
  returned 200. Hashed assets use one-year immutable caching; the zip uses
  ten-minute revalidation. CSP, HSTS, `nosniff`, and referrer-policy headers
  are live, with `frame-ancestors` in the response header.
- Fresh mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.38 s, CLS 0, TBT 1 ms, total transfer 127,950 bytes.

This is a static site and local browser extension. It has no backend, tenant
store, server health route, or product API. Backend tenant isolation, restart
persistence, health, and 429/`Retry-After` checks do not apply. The brief
excludes automatic summaries, so no missing AI-assisted step was found.

## Earlier finding disposition

Every prior review, polish map, verification report, and handoff was inspected.

| Earlier finding | Fresh disposition |
| --- | --- |
| F-1-1 | Fixed: the exact live Back regression restored y=1100, h1 focus, and announcement. |
| F-1-2 | Fixed: the stronger full-page wording is absent; the 12,000-character cap passed. |
| F-1-3 | Fixed: the untestable browser-store wording remains absent. |
| F-1-4 | Fixed: extension local storage passed in clean and downloaded profiles. |
| F-1-5 | Fixed: one click opened the isolated populated sample. |
| F-1-6 | Fixed: all route title, description, canonical, Open Graph, and Twitter fields passed. |
| F-1-7 | Fixed: the deliberate 404 has complete local metadata, noindex, navigation, and home action. |
| F-1-8 | Fixed: route h1 focus and the atomic polite announcement passed. |
| F-1-9–F-1-14 | Fixed: plain section headings, useful alt text, explained extract code, accurate demo exit, and reader-facing wording remain. |
| F-2-1 | Fixed: reader copy uses **bookmark** for an item and **proofbook** for the collection. |
| F-3-1 | Fixed: the populated sample is visible in the initial phone demo. |
| F-3-2 | Fixed: “open anywhere” and other stronger unproved export wording remain absent. |
| F-3-3 | Fixed: routes and 404 publish the product social image. |
| F-3-4 | Fixed: versioned JSON restore preserved fields in site and installed extension checks. |
| F-3-5 | Fixed: demo exit removed only sample data and preserved seeded real data byte for byte. |
| F-3-6–F-3-7 | Fixed: the limit heading and bookmark terminology remain accurate. |
| F-4-1 | Fixed: privacy, offline, and price facts all fit before the 844 px phone fold. |
| F-6-1 | Fixed: the declared health-results test and live package check saved all three states and times. |
| F-6-2 | Fixed: the complete sample strip remained visible after scrolling to the last form action. |
| F-6-3 | Fixed: the live manifest uses the tested capture/search/export wording. |
| F-6-4 | Fixed: the first screen states local storage, opened-session offline use, and current free price. |

Earlier verification defects also remain repaired: the formerly broken claim
command, false changed result, missing artifact, dead checkout, skipped focus,
unlisted privacy claims, short asset caching, duplicate import, irreversible
delete, retained demo data, unsafe URL entry, 200 unknown route, vulnerable
install, and missing install/deploy docs all passed their current checks. The
previously named demo, record, footer, and header phone targets are at least
44 px. F-7-1 identifies a separate landing install link omitted from those
earlier target sweeps.

## Evidence

- `.factory/evidence/review-7/claims-results.json`
- `.factory/evidence/review-7/quality-gates.json`
- `.factory/evidence/review-7/live-check.json`
- `.factory/evidence/review-7/back-navigation.json`
- `.factory/evidence/review-7/live-import-recovery.json`
- `.factory/evidence/review-7/live-installed-extension.json`
- `.factory/evidence/review-7/live-extension-health.json`
- `.factory/evidence/review-7/live-extension-import.json`
- `.factory/evidence/review-7/touch-targets.json`
- `.factory/evidence/review-7/lighthouse-live.json`
- `.factory/evidence/review-7/verify/verify.json`
- `.factory/evidence/review-7/live-desktop.png`
- `.factory/evidence/review-7/live-phone.png`
- `.factory/evidence/review-7/live-demo-scrolled-phone.png`
- `.factory/evidence/review-7/live-installed-extension.png`

Two manual harness seeds were corrected before classification. A combined
history probe physically clicked an off-screen header link, which changed the
source scroll before navigation; the isolated shipped regression passed. A
health probe used an incorrect hand-written hash, and the extension correctly
reported changed; the corrected product-computed-hash probe passed. Both
initial observations and corrected evidence remain recorded in the JSON.
