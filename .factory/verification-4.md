# Save bookmark context — verification 4 — PASS

**Product:** Bookmark Proofbook

**Live URL:** <https://bookmark-proofbook.sociobot.in>

**Verified:** 2026-09-06

**Implementation candidate:** `324ce5b57a9135799831939b13c7d2126bf29cbd`

**Documentation candidate:** `0b929b5ccb46b9343afa9d2c7d344d5b22c335c2`

## Verdict

**PASS.** Finding count: **0**. Untested public claim count: **0**.

There are no critical, high, medium, minor, or unclassified findings. All 23
declared claim commands passed individually from a clean clone. The live site
and downloaded extension match the candidate build and complete the bookmark
capture, search, link-check, import, export, and restore job.

No product code was changed during this verification. The documentation SHA is
later than the deployed implementation SHA. Commits after `324ce5b` contain
only release evidence and documentation.

## First screen before scrolling

Fresh 1440 × 900 and 390 × 844 Chromium contexts answered the required
questions before scrolling.

| Question | Live answer |
| --- | --- |
| What is the job? | “Save why each link mattered.” |
| Who is it for? | “For people with too many bookmarks to remember, save context and find the resource again.” |
| What should I do first? | “Try it with sample data,” followed by “Opens a sample proofbook with three bookmarks.” |

The phone action occupied y=380.41–427.20. The privacy, offline, and price
facts ended at y=547.28, 591.08, and 634.88, all within the initial 844 px
viewport. The first realistic sample began at y=404.91 after one click.

## Sample and real-data isolation

- One click from `/` opened `/?demo=1` with three realistic SQLite, WCAG, and
  browser-rendering bookmarks.
- The fixed 390 px demo strip remained at y=0–70.39 after scrolling to the
  final form action. Its sample label, **Reset demo**, and **Open my proofbook**
  controls stayed visible.
- A seeded real bookmark was unchanged after entering the demo, adding a
  fourth sample bookmark, removing and undoing a sample, resetting, and
  leaving the demo.
- **Reset demo** restored exactly three samples. **Open my proofbook** removed
  `demo:bookmark-proofbook:records`, opened `/app`, and retained the real
  `proofbook:records` value byte for byte.
- The complete flow made zero third-party requests.

## Every declared claim

The verifier cloned `main` into
`/tmp/bookmark-proofbook-verify-4-clean.yPRDEE`, confirmed HEAD was `0b929b5`,
and ran `npm ci`. All 23 exact commands then passed individually.

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

The 23 ids are unique, and each `@claim:<id>` tag occurs exactly once in the
test suite. The live landing, app, demo, legal pages, route metadata, extension
manifest and UI, generated exports, README, demo document, and catalog copy
were checked against the registry. No missing, false, incomplete, or untested
public claim was found.

## Clean quality gates

| Command | Clean-clone result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 12 tests |
| `npm run test:e2e` | PASS — 33 tests |
| `npm run test:extension` | PASS — 7 clean installed-extension tests |
| `npm run build` | PASS — `dist/site` and extension zip produced |
| `npm audit --omit=dev` | PASS — zero vulnerabilities |

Built JavaScript is 22.82 kB raw / 8.18 kB gzip. CSS is 8.73 kB raw /
2.68 kB gzip. The selected phone hero is 22.59 kB. No web font is loaded.

## Live site and installed extension

- Normal, invalid, boundary, and recovery paths passed. These covered capture,
  reason/title/selected-text/extract storage, search/no-result recovery,
  HTML/JSON export, browser HTML and proofbook JSON import, remove/undo,
  `javascript:` rejection, a 12,000-character extract, malformed JSON import,
  and corrupt local-storage recovery.
- The opened demo remained searchable and exported HTML after the context went
  offline. The product makes no cold-offline or service-worker-update promise;
  no site service worker or web-app manifest is present.
- The production zip was downloaded, extracted, and loaded into a fresh
  Chromium profile. It reported version 1.0.2 and the corrected manifest text.
  Explicit capture saved selected text, extract, and reason in extension local
  storage. Search and HTML/JSON export worked.
- A separate live-package link check rendered and stored reachable, changed,
  and unreachable states. Every result had a valid check time after the action
  began. No saved address was contacted before the explicit action in the
  declared limit test.
- The live JS, CSS, and hero are byte-identical to the clean candidate build.
  A recursive comparison found every unpacked live-extension file identical to
  `.output/chrome-mv3`.

## Routes, access, privacy, and links

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200. Each has its own
  title, description, canonical, Open Graph and Twitter metadata, `lang=en`,
  one h1, one main, a skip link, header, and footer.
- `/missing-verification-4-page` deliberately returned HTTP 404 and rendered
  the designed page with its own metadata, `noindex`, navigation, and home
  action. The expected 404 is not a defect.
- Playwright Axe found zero violations on all five normal routes and the 404.
  The installed extension had zero serious or critical violations.
- First Tab focused the skip link with a 4 px outline. Enter focused main.
  Back restored scroll y=1100, focused the landing h1, and updated the polite
  route announcement. No keyboard trap appeared.
- Tested phone targets were at least 44 × 44 CSS px. At 200% text size, the
  390 px page retained its headline/action with no horizontal overflow.
- Reduced motion changed the record animation to 0.00001 seconds.
- Normal site and demo flows made no third-party request. No analytics,
  third-party font, external script, billing request, or runtime AI request ran.
  The privacy page provides `privacy@sociobot.in`.
- Every product route, download, social image, `robots.txt`, `sitemap.xml`, and
  the three sample-source links returned 200.
- Live headers include CSP with `frame-ancestors` in the response, HSTS,
  `nosniff`, and a referrer policy. Hashed assets are immutable for one year;
  the changeable zip uses ten-minute revalidation.

Fresh live Lighthouse scores were Performance 100, Accessibility 100, Best
Practices 100, and SEO 100. LCP was 1.4 seconds, CLS was 0, TBT was 10 ms, and
total transfer was 125 KiB.

This product is a static companion site and browser extension. It has no
backend, tenant store, account system, server health endpoint, or product API.
Backend tenant isolation, restart persistence, health, and 429/`Retry-After`
checks do not apply. The brief explicitly excludes automatic summaries, and no
missing AI-assisted step was found.

## Earlier numbered findings

Every review and verification report was read. No earlier finding reopened.

| Finding | Current proof |
| --- | --- |
| F-1-1 | Fresh live Back restored y=1100, focused the h1, and announced the route. |
| F-1-2 | The unproved full-page-storage clause remains absent; the 12,000-character claim passed. |
| F-1-3 | The untestable browser-store-absence statement remains absent. |
| F-1-4 | `extension-local-records` passed in a clean installed profile and the downloaded live artifact. |
| F-1-5 | One click opened the isolated populated sample. |
| F-1-6 | All live route title, description, canonical, Open Graph, and Twitter fields passed. |
| F-1-7 | The designed HTTP 404 has complete metadata, local icons, `noindex`, and a home action. |
| F-1-8 | The atomic polite announcer and route h1 focus passed live. |
| F-1-9 | The process heading remains “How Bookmark Proofbook works.” |
| F-1-10 | The preview heading remains “What each bookmark keeps.” |
| F-1-11 | The decorative caption is absent and the useful image alt remains. |
| F-1-12 | Reader copy explains “extract code”; unexplained hash wording remains absent. |
| F-1-13 | The demo exit remains the accurate “Open my proofbook.” |
| F-1-14 | Reader-facing copy remains free of MV3/Xvfb implementation jargon. |
| F-2-1 | Reader copy consistently uses **bookmark** for an item and **proofbook** for the collection. |
| F-3-1 | The first complete sample begins at y=404.91 in the initial phone demo viewport. |
| F-3-2 | The unproved “open anywhere” wording remains absent. |
| F-3-3 | Every route and the 404 publish the absolute local Twitter image. |
| F-3-4 | Site and extension versioned JSON restore passed field-for-field. |
| F-3-5 | Demo exit discarded only sample data and preserved a seeded real bookmark. |
| F-3-6 | The boundary heading remains “Saved extract limit.” |
| F-3-7 | Samples are called bookmarks, not notes. |
| F-4-1 | Privacy, offline, and price facts all fit in the initial 390 × 844 screen. |
| F-6-1 | `link-health-results` passed with all three states and valid saved timestamps. |
| F-6-2 | The 70.39 px sample strip stayed fixed and fully visible at the last form action. |
| F-6-3 | The live 1.0.2 manifest uses tested capture/search/export wording. |
| F-6-4 | The first screen now states browser-local storage, opened-session offline use, and the free current price. |

## Earlier verification defects

| Earlier defect | Current proof |
| --- | --- |
| Broken claim command | All 23 exact commands passed individually. |
| False changed-link result | Unchanged, changed, and unreachable deterministic fixtures passed in the clean suite and live package. |
| Missing extension artifact or install path | Live zip returned 200, loaded unpacked, and the site/README give complete steps. |
| Dead paid checkout | No paid offer or checkout is advertised; the tested current price is free. |
| Skip-link and focus regression | First Tab, focus ring, Enter-to-main, route focus, and announcement passed. |
| Unlisted privacy/capability claims | The registry has 23 unique claims, one tag each, and the public-copy audit found none missing. |
| Undersized phone targets | Live tested controls measured at least 44 × 44 px. |
| Short asset caching | Live hashed JS/CSS return one-year immutable caching. |
| Duplicate browser import | The mixed import claim rejects duplicate and unsafe addresses. |
| Irreversible deletion | Site and extension remove/undo paths passed. |
| Demo retained on exit | Live exit removed the demo namespace and kept real data. |
| Unsafe manual URL | The live app rejected `javascript:` with focused recovery text and stored nothing. |
| HTTP-200 unknown route or wrong canonical | The direct unknown route returned 404; every route canonical passed. |
| Vulnerable clean install | `npm audit --omit=dev` reported zero vulnerabilities. |
| Missing deployment/install documentation | README includes build, deploy, and unpacked-install steps. |

## Evidence

- `.factory/evidence/verification-4/live-check.json`
- `.factory/evidence/verification-4/live-extension-check.json`
- `.factory/evidence/verification-4/lighthouse-live.json`
- `.factory/evidence/verification-4/verify/verify.json`
- `.factory/evidence/verification-4/live-desktop.png`
- `.factory/evidence/verification-4/live-phone.png`
- `.factory/evidence/verification-4/live-demo-scrolled-phone.png`
- `.factory/evidence/verification-4/live-installed-extension.png`

The initial live harness file records three harness-only failures: a skip-link
hash history entry changed the history test, Chromium logged the deliberate
404, and CSP blocked an injected test stylesheet. Each check was rerun with a
fresh history, explicit expected-404 handling, and CSP bypass only for the
user-style 200% text simulation. The corrected independent results are in
`live-check.json` and contain nine passes with zero failures.
