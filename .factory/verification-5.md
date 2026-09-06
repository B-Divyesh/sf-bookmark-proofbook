# Save bookmark context — independent verification 5 — PASS

**Implementation candidate:** `9b76d91854223bb9a8044e65097dc278eab267cc`  
**Documentation revision:** `c23d0e68dc800f5e9d49be19e2ac049b6e828645`  
**Live URL:** <https://bookmark-proofbook.sociobot.in>  
**Verified:** 2026-09-06 from a new clone. No product code was changed.

## Verdict

**PASS. Finding count: 0. Untested public claim count: 0.**

The live static site and downloaded browser-extension artifact match the clean
candidate build. All declared public claims passed their exact commands, and
the live product completed the real capture/search/export job without a
finding.

## First screen before scrolling

Fresh Chromium contexts opened the live root at 1440 × 900 and 390 × 844.

| Question | Live answer |
| --- | --- |
| Job | **Save why each link mattered** |
| Audience | **For people with too many bookmarks to remember** |
| First action | **Try it with sample data** — it opens a sample proofbook with three bookmarks. |

The phone first screen also contains the local-storage, opened-session offline,
and current-free-price facts. The extension-install link measures **279.36 ×
44 CSS px** on both desktop and phone.

## Candidate and live identity

`git diff --name-only 9b76d91..c23d0e6` contains only repair-4 evidence and
handoff documentation; it contains no product source or build input change.
After a fresh `npm ci` and `npm run build`, live and local bytes matched for
the HTML shell, JavaScript, CSS, both hero variants, social image, and the
downloaded extension zip. Extracting the live and local zips produced identical
extension payloads. The clean installed-extension suite therefore exercised the
same artifact a visitor downloads.

## Declared public claims

After `npm ci`, every exact command in `.factory/claims.json` ran separately
from the clean clone. All 23 passed; logs were retained for this verification
at `/tmp/bookmark-proofbook-verify-5-claims/`.

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

I compared landing, demo, app, legal, README, manifest, extension, import,
and export copy with the claims registry. No missing, false, incomplete, or
untested public claim was found.

## Clean quality gates

All commands below passed from the same fresh clone:

| Command | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 12 tests |
| `npm run test:e2e` | PASS — 33 tests |
| `npm run test:extension` | PASS — 7 clean-profile installed-extension tests |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| `npm run build` | PASS — produced `dist/site` and a 292,819-byte extension zip |

The build has 22,841 bytes of raw JavaScript and 8,800 bytes of CSS; no web
font is loaded. Fresh live Lighthouse JSON records Performance 100,
Accessibility 100, Best Practices 100, and SEO 100 (LCP 1,401 ms, CLS 0,
TBT 0 ms, 127,931 bytes transferred). The local Lighthouse runner printed a
browser-tab crash after writing that complete JSON report; this is a runner
diagnostic, not a site console or response error.

## Live user paths

- One click entered `/?demo=1` with the persistent **Demo — sample data,
  nothing is saved** label, three realistic SQLite/WCAG/browser bookmarks, and
  a visible SQLite result on the initial phone view.
- With a real bookmark first saved at `/app`, demo storage was separate.
  Removing a sample changed `(3)` to `(2)`; **Reset demo** restored `(3)`.
  **Open my proofbook** removed the `demo:` key and retained the real key byte
  for byte. No external request or console error occurred.
- A manual `javascript:` address focused the URL field, explained the HTTP(S)
  rule, saved nothing, and retained count `(0)`. Corrupt real local storage
  was removed on reload and recovered to the designed empty state.
- In an opened offline demo, search still found the WCAG bookmark and HTML
  export completed. Cold offline reload, service-worker updates, and a PWA
  manifest are not claimed; no service worker is registered.
- The clean installed-extension tests exercised explicit capture, local
  storage, search, JSON/HTML export, browser-HTML and JSON import, immediate
  undo, 25-address bounded checks, and reachable/changed/unreachable results
  with check times. This satisfies the extension consumer-artifact path.

## Accessibility, privacy, routes, and links

- `/opt/fleet/lib/verify-url.sh` passed against HTTPS: title present,
  `lang=en`, one h1, a main landmark, no missing image alt text, no unlabeled
  buttons, and no console/page error.
- Fresh Playwright Axe checks found **zero violations** on `/`, `/demo`,
  `/app`, `/privacy`, `/terms`, and the designed 404. First Tab reaches the
  skip link with its visible focus ring; Enter moves focus to main. A phone
  sweep found no visible interactive target below 44 × 44 px. Reduced motion
  changes record animation and transition duration to `0.00001s`.
- The normal, demo, and privacy flows made only same-origin requests. There is
  no analytics, account, sync, third-party script, third-party font, payment
  path, or runtime AI call. The privacy page provides `privacy@sociobot.in`.
- Normal routes, asset/download links, and the three sample-source links
  returned 200. `/missing-verify-five` deliberately returned HTTP 404 and
  rendered the designed page with its own title, h1, main landmark, metadata,
  and home action. The browser's expected 404 network console message is not a
  product defect.
- This is a static site plus local extension, with no backend, tenant store,
  health endpoint, or rate-limited product API. Tenant isolation, restart
  persistence, and 429/`Retry-After` checks do not apply.

## Earlier findings

I read all earlier review, verification, polish, repair, and handoff reports.
Their current dispositions are:

| Earlier finding | Fresh disposition |
| --- | --- |
| F-1-1 | Fixed: exact live Back restored scroll position, h1 focus, and the polite route announcement. |
| F-1-2–F-1-3 | Fixed: stronger unproved extract and browser-store wording remains absent. |
| F-1-4–F-1-5 | Fixed: declared clean-profile local-storage and one-click isolated-demo claims pass. |
| F-1-6–F-1-8 | Fixed: route metadata, designed HTTP 404, h1 focus, and atomic route announcement pass. |
| F-1-9–F-1-14 | Fixed: headings are plain, decorative caption is absent, extract code is explained, demo exit is accurate, and reader copy avoids implementation jargon. |
| F-2-1 | Fixed: a saved item is consistently a **bookmark** and its collection a **proofbook**. |
| F-3-1 | Fixed: a realistic populated sample is visible on the first phone demo screen. |
| F-3-2–F-3-3 | Fixed: unproved portable-export wording is absent and all routes publish the local social image. |
| F-3-4–F-3-5 | Fixed: confirmed lossless JSON restore passes, and demo exit preserves real data while discarding sample data. |
| F-3-6–F-3-7 | Fixed: the limit section is correctly named and visitor copy uses bookmark terminology. |
| F-4-1 | Fixed: local-storage, opened-session offline, and free-price facts fit in the 390 × 844 first screen. |
| F-6-1–F-6-4 | Fixed: all three link-health outcomes/times pass, sample controls remain visible while scrolling, manifest wording is bounded, and the required three fact types are present. |
| F-7-1 | Fixed: the phone install link now measures 279.36 × 44 px and is included in the rendered-target regression. |

No earlier issue reopened. No product defect remains.

