# Independent verification 2 — FAIL

**Candidate:** `79b69c81f9d31a42fe5d47d67b39c6784fd6e2b9`  
**Live URL:** <https://bookmark-proofbook.sociobot.in>  
**Verified:** 2026-08-28 from a clean checkout; no product source was changed.

## Release verdict

**FAIL.** The deployment is healthy and matches this candidate, and every test
listed in `.factory/claims.json` passes. The candidate still violates the
mandatory claims contract: several claim-like promises on the live product and
in `README.md` are absent from `claims.json`. The supplied contract says one
unlisted claim fails review. The demo exit, destructive actions, mobile touch
targets, and extension installation path also miss non-negotiable requirements.

## Mandatory first gates

### Claim tests

After `npm ci`, every exact command in `.factory/claims.json` was run
individually against the Playwright demo entry point.

| Claim | Exact command | Result |
| --- | --- | --- |
| `search-saved-context` | `npm run test:e2e -- --grep @claim:search-saved-context` | PASS, 1/1 |
| `portable-export` | `npm run test:e2e -- --grep @claim:portable-export` | PASS, 1/1 |
| `demo-namespace` | `npm run test:e2e -- --grep @claim:demo-namespace` | PASS, 1/1 |
| `no-account-required` | `npm run test:e2e -- --grep @claim:no-account-required` | PASS, 1/1 |
| `local-records` | `npm run test:e2e -- --grep @claim:local-records` | PASS, 1/1 |
| `offline-session` | `npm run test:e2e -- --grep @claim:offline-session` | PASS, 1/1 |
| `no-record-sync` | `npm run test:e2e -- --grep @claim:no-record-sync` | PASS, 1/1 |

Each id occurs exactly once as an `@claim:<id>` tag in the test suite.

### Cold first-read

Fresh desktop and 390 px browser contexts answer all three required questions
above the fold:

- What: **Keep why each link mattered.**
- Who: **For people with too many bookmarks to remember.**
- First click: **Try it with sample data**, followed by **Opens three saved
  research notes.**

The click opens `/demo` in one action with three records and the persistent
**Demo — sample data, nothing is saved** banner. This gate passes. Evidence:
`evidence/live-cold-desktop.png` and `evidence/live-cold-mobile.png`.

## Candidate and deployment identity

Fresh evidence supersedes the earlier deployment-only concern. Production is
this candidate:

- Live and local JS are both `index-CMkrIOXx.js`, 15,306 bytes, SHA-256
  `5decdf8051ec0a390f1c7f24a1267506bca4dac187e44b36a8759336d85a05a7`.
- Live and local CSS and hero image also have identical SHA-256 hashes.
- The live and local extension zips are both 267,602 bytes. Their container
  hashes differ because zip timestamps are nondeterministic; after extraction,
  `diff -rq` reports no differences and every file hash matches.
- The extension download returns 200 `application/zip`. Hashed assets use
  `public, max-age=31536000, immutable`; the zip uses
  `public, max-age=600, must-revalidate`.
- `/opt/fleet/lib/verify-url.sh` passes with title, `lang`, one h1, main,
  image alt text, and no console/page errors. See `evidence/verify-live/`.

## Local quality gates

| Gate | Result |
| --- | --- |
| `npm ci` | PASS; lockfile installed 402 packages |
| `npm test` | PASS, 7/7 Vitest tests |
| `npx tsc --noEmit` | PASS |
| `npm run test:e2e` | PASS, 15/15 Chromium tests |
| `npm run build` | PASS; `dist/site/` and MV3 zip produced |
| Lint | No lint command exists |

Build sizes pass: initial JS is 15.31 KB raw / 6.07 KB gzip, CSS is 6.86 KB
raw / 2.24 KB gzip, and the hero WebP is 115,156 bytes. Lighthouse mobile on
the live page scored Performance 100, Accessibility 100, Best Practices 100,
and SEO 100; LCP 1.4 s, CLS 0, TBT 60 ms, 122 KiB transferred. Evidence:
`evidence/lighthouse-live.json`.

`npm audit --omit=dev` nevertheless reports 10 dependency vulnerabilities:
3 critical, 4 high, 2 moderate, and 1 low. These are in WXT/build-tool
dependencies and are not present in the shipped 15 KB browser bundle, but the
clean install supply chain is not clear.

## End-to-end product evidence

### Companion site

- Demo search for `keyboard interface` returns only the WCAG record.
- Adding a demo record changes 3 to 4; **Reset demo** restores 3.
- Real workspace required-field and malformed-URL cases are blocked with
  focused native messages: “Please fill out this field” and “Please enter a
  URL.” Malformed local-storage JSON is removed and recovers to the empty state.
- A mixed browser HTML import retains two unique HTTP(S) URLs and rejects the
  duplicate, `javascript:`, and FTP entries. Multi-term search finds both;
  JSON export contains both.
- A manually entered `javascript:` URL is incorrectly accepted and stored.
  Clicking it did not execute in tested Chromium, but it is not a usable web
  bookmark and bypasses the importer's HTTP(S)-only rule.
- Normal capture/search/import/export produced no external requests, console
  errors, or page errors.

### Downloaded browser extension

The live zip was unpacked into a clean consumer profile and loaded as its MV3
artifact. It is not merely a site demo:

- **Capture this page** read a real local fixture only after the explicit click.
  Empty-reason submission was blocked. Save persisted the title, selected
  passage, reason, normalized extract, and hash in `chrome.storage.local`.
- Search found the record by selected words. JSON and self-contained HTML
  exports contained the record; exported HTML contained no script.
- Immediate checking of an unchanged fixture reported `alive`; after changing
  the fixture text it reported `changed`. The previous false-change defect is
  repaired.
- Importing 500 unique browser bookmarks took 297 ms, search retrieved item
  499, and JSON exported all 500. **Check links** issued exactly 25 source
  requests, marked those 25 alive, and left item 26 unchecked.
- Capturing a browser-internal page showed the recovery instruction instead of
  crashing. There were no extension console errors and no serious/critical axe
  findings.
- Remove immediately deletes the record, with no confirmation or undo.

## Privacy, security, accessibility, and routing

- Cold landing requests were same-origin only: document, hashed JS/CSS, and
  hero image. The normal site flow remained same-origin. The extension contacted
  a saved source only after the explicit link-health action.
- Live headers include HSTS, CSP, `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy: strict-origin-when-cross-origin`. No CSP error occurred.
- Axe found zero serious/critical issues on `/`, `/demo`, `/app`, `/privacy`,
  `/terms`, the client 404, and the extension popup.
- Keyboard smoke passes: first Tab reaches the skip link, its 4 px rust focus
  ring is visible, Enter moves focus to `main`, and reduced motion lowers the
  record animation to `0.00001s`. The 390 px layouts have no horizontal
  overflow.
- Mobile touch targets fail the 44 by 44 baseline: **Demo** is 41.7 px wide;
  **Reset demo** is 30 px high; **Start for real** is 24.8 px high; Remove is
  40.1 px high; record links are 24 px high; footer links are 15 px high.
- All internal and three shipped sample links return 200. Unknown routes render
  the designed client page but return HTTP 200, not a real 404. Every route also
  keeps the home URL as its canonical.
- This is a static site/extension with no product server API, sign-in, service
  worker, or PWA manifest. Backend concurrency/persistence, Entra identity,
  service-worker update/offline reload, and API 429 checks are not applicable.
  The opened-workspace offline claim itself passed. No product-unlock call is
  made. Fresh checks show checkout remains unregistered (404), while invalid
  license verification returns `{ valid: false }`; the site correctly does not
  advertise a dead checkout.
- The brief explicitly rejects automatic LLM summaries, and no missing AI step
  was found. Capture, import, search, health checking, and portable export are
  present.

## Defects by severity

### Critical / release-blocking

1. **Public claims are missing from `.factory/claims.json`.** Examples include
   “reads the active page only after you press Capture this page,” the
   12,000-character cap, the explicit 25-link check limit, the packaged zip
   “always” being included, “We do not run analytics,” browser deletion, and
   the live promise not to copy sites or bypass paywalls. Some were verified
   manually or by untagged tests, but the claims contract requires every public
   claim to be listed with exactly one tagged sandbox test. This alone mandates
   FAIL.

### High

1. **The extension is not installable for a normal visitor.** The only action
   downloads a raw zip. The site and README provide no unpack/developer-mode
   instructions, store listing, or signed install path. The artifact works only
   after the verifier manually unpacks and loads it.
2. **Record deletion is irreversible and unconfirmed** in both site and
   extension. One click permanently removes local data with no undo, contrary
   to the destructive-action contract.
3. **Demo data is not discarded on exit.** After **Start for real**,
   `demo:bookmark-proofbook:records` remains in local storage. The real namespace
   stays isolated, but the demo contract specifically requires discarding demo
   data on exit or offering a one-time keep action.
4. **Several mobile controls are below 44 by 44 px**, including demo controls,
   record links/removal, and footer links.

### Medium

1. Manual entry accepts and stores non-HTTP(S) `javascript:` URLs even though
   import correctly rejects them.
2. Unknown routes return 200 and every route publishes the home canonical URL.
3. `npm audit --omit=dev` reports critical/high vulnerable WXT toolchain
   dependencies. They are not shipped runtime code but affect clean installs.
4. `README.md` lacks the required deployment instructions and does not explain
   how to install the downloaded extension zip.

## Required re-verification

List or remove every public claim and add exactly one tagged demo test per
listed claim; provide a usable extension installation path; make delete undoable
or confirmed; discard demo data on exit; meet 44 px targets; restrict manual
URLs to HTTP(S); fix 404/canonical routing; update the toolchain; then rerun all
seven exact claim commands, all quality gates, the clean-profile extension
flow, and live identity/privacy/accessibility/performance checks.
