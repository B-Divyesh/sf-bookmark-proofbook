# Independent verification — FAIL

**Candidate:** `4db2149de974f8602c62ac4c36888eed202e8889`  
**Live URL:** <https://bookmark-proofbook.sociobot.in>  
**Verified:** 2026-08-28, clean checkout; no product source was changed.

## Release verdict

**FAIL.** The mandatory claims command fails. In addition, the deployed
extension artifact and paid checkout are dead, and the core link-change check
returns a false positive for an unchanged page.

## First-read and deployment identity

Cold-load, desktop and 390 px mobile, gave this answer in plain language:

- It keeps the reason and evidence beside browser bookmarks.
- It is for people with too many bookmarks to remember.
- Click **Try it with sample data** first; it says it opens three saved
  research notes.

This meets the first-read and one-click demo requirement. The live HTML loaded
`/assets/index-DwQgqXW9.js`, exactly matching the candidate production build;
the live document was last modified at 18:56:54 UTC, just after this commit
(18:56:03 UTC). The deployed site therefore appears to be this candidate, not
the previously reported deployment-only failure.

## Mandatory claim-test results

Dependencies were installed with `npm ci` before running every exact command
in `.factory/claims.json`.

| Claim | Exact command | Result |
| --- | --- | --- |
| `search-saved-context` | `npm run test:e2e -- --grep @claim:search-saved-context` | PASS (1 Playwright test) |
| `portable-export` | `npm run test:e2e -- --grep @claim:portable-export` | PASS (1 Playwright test) |
| `demo-namespace` | `npm run test:e2e -- --grep @claim:demo-namespace` | PASS (1 Playwright test) |
| `no-account-required` | `npm test -- --grep @claim:no-account-required` | **FAIL** — Vitest 3.2.7 exits 1: `CACError: Unknown option --grep`. |

This exact failing claim command is release-blocking. Its tagged test is also a
unit-only assertion that does not run the documented demo entry point or
exercise creating/exporting a UI record without requests.

## Local quality gates

- `npm test`: PASS, 5/5.
- `npm run test:e2e`: PASS, 5/5 (including current demo axe test).
- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS. Static JS is 6.72 KB gzip and CSS 2.22 KB gzip;
  the hero is 115,156 bytes. `dist/site/` and the 267,173-byte extension zip
  were produced.
- No lint script exists.

## End-to-end evidence

### Companion site/demo

In a clean Playwright context, `/demo` created three records only in
`demo:bookmark-proofbook:records`; `proofbook:records` was null. Search for
`keyboard interface` returned one record. The HTML export was named
`bookmark-proofbook.html`, began with `<!doctype html>`, contained the saved
reason, and had no script. Leaving for `/app` began with zero real records.

On `/app`, an invalid empty submission stayed at `(0)` and focused the required
URL input with the native message “Please fill out this field.” A valid record
saved successfully; a 12,001-character extract was capped to 12,000. HTML
import added records, JSON export contained those records, and Remove updated
the count. No console or page errors occurred.

### Extension

The unpacked MV3 build was loaded in Chromium under Xvfb. On `example.com`,
**Capture this page** opened the required-reason form and saved one record in
`chrome.storage.local` with the active-page title and entered reason; there
were no console errors. This proves the main capture path works.

The link-change result is not reliable: capture of the unchanged static
`https://example.com/` stored hash `a6354f52` for
“Example Domain This domain is for use in documentation examples without
needing permission. Avoid use in operations. Learn more”. An immediate explicit
**Check links** reported **“Page changed.”** The checker parses fetched HTML in
a detached document and collapses the inline text without spaces, yielding
`ab22095a`. This is a deterministic false change on a canonical static page.

## Privacy, security, accessibility, and performance evidence

- Cold live landing made only same-origin requests for HTML, CSS, JS and the
  hero image. The normal demo/app capture-search-import-export flow likewise
  made only same-origin requests. No telemetry was seen. License verification
  was not initiated.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and the configured CSP.
  No console CSP errors occurred.
- Playwright Axe on the live landing reported zero serious/critical issues.
  HTML has `lang`, title, one h1, main, useful image alt text, and the
  reduced-motion emulation reduced record animation to `0.00001s`.
- Keyboard check failed manually: application startup programmatically focuses
  the h1. The first forward Tab goes directly to **Try it with sample data**;
  the skip link and header navigation are skipped in normal forward tab order.
  The focused first control had a computed 0 px outline. At 390 px, header nav
  links are only 21.7 px high, below the required 44 px touch target.
- Live hashed JS, CSS and hero all use `cache-control: public,
  must-revalidate, max-age=30`, not immutable long-lived caching required for
  hashed static assets.

## Live endpoint checks

- `/`, `/demo`, `/app`, `/privacy`, `/terms`, `robots.txt`, and `sitemap.xml`
  responded 200. Client-side unknown route rendered the designed 404.
- The generated local zip is `dist/site/downloads/bookmark-proofbook-extension.zip`,
  but the live equivalent
  `/downloads/bookmark-proofbook-extension.zip` returns **404** (362 bytes),
  and the landing page has no install/download link. This browser-extension
  product is not deliverable from its deployed site.
- The visible `$19` checkout target
  `https://api.sociobot.in/api/v1/products/bookmark-proofbook/checkout`
  returns **404** with `{"error":"enabled factory product","status":404}`.
  The paid workflow is unavailable. There is no product server endpoint to
  load-test for a 429/`Retry-After`; sign-in is not used.

## Defects by severity

### Critical / release-blocking

1. **Broken mandatory claim command:** `no-account-required` cannot run as
   declared (`--grep` is invalid for installed Vitest). This alone fails the
   acceptance contract.
2. **False link-health changes:** an immediate recheck of an unchanged static
   source reports “Page changed,” undermining the brief’s link-health-change
   job.
3. **No live extension artifact:** the built zip is absent from deployment and
   no installation path is linked.
4. **Dead paid checkout:** the advertised one-time purchase endpoint is 404.

### High

1. **Keyboard access regression:** initial h1 focus skips the skip link and
   header navigation in forward tab order; the current focus target has no
   visible outline. This violates the required keyboard/skip-link baseline.
2. **Unlisted, unproven visitor claims:** “Your notes stay in this browser” and
   “does not … sync your archive to our servers” appear on the landing page,
   but neither is an exact claim in `claims.json` with a corresponding demo
   test. The claims contract makes this a failing review finding.

### Medium

1. Header navigation touch targets are approximately 22 px high at 390 px,
   not 44 px.
2. Hashed production assets are cached for only 30 seconds rather than with
   long-lived immutable caching.
3. HTML import accepts duplicate URLs in the same uploaded file (a three-link
   file with two identical HTTPS URLs said “Imported 2 bookmarks”). This will
   add needless duplicate records to a large browser import.

## Required re-verification

Fix the claim command and make it an actual demo-flow privacy test; correct
the health hash extraction; deploy/link the extension zip; register or remove
the paid checkout; restore first-Tab skip/header navigation with a visible
focus state; then rerun all four exact claims commands, `npm test`,
`npm run test:e2e`, `npx tsc --noEmit`, `npm run build`, and the live checks
above.
