# Polish 3 — cumulative zero-finding repair map

Candidate `9463231156105fb1164a1da4bbb97ad09f7ae6b3` was repaired in
`8f015cc3b32b9db842d70a68735f02dc93d93e44` and deployed to
<https://bookmark-proofbook.sociobot.in> on 2026-08-29. This map includes
every finding in all three adversarial reviews, not only the newest report.

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | History saves the outgoing scroll position and restores it after focus on Back/Forward. | `restores scroll and announces the new route after back navigation`; live route check in `polish-3-live/live-check.json`. |
| F-1-2 | The unproved “not a full web page” statement remains removed; only the tested 12,000-character cap is public. | `@claim:extract-cap`; live landing check. |
| F-1-3 | The untestable browser-store statement remains absent from the landing and README. | Copy regression and clean-clone claim loop. |
| F-1-4 | `extension-local-records` remains declared and proves clean-profile local-only extension storage. | `@claim:extension-local-records` in the clean clone. |
| F-1-5 | The landing action still enters `?demo=1` in one activation, now with a visible sample record. | `@claim:one-click-demo`; `polish-3-live/demo-mobile.png`. |
| F-1-6 | Runtime and pre-rendered routes update title, description, canonical, Open Graph, and Twitter metadata. | `publishes route-specific metadata and returns a real 404 response`; live five-route metadata check. |
| F-1-7 | The HTTP 404 now has `noindex`, canonical/OG URL, local icons, all share metadata, and a home link. | Same metadata test; live `/not-a-real-proofbook-page` returned 404. |
| F-1-8 | The dedicated atomic polite route announcer and h1 focus behaviour remain in place. | Scroll/announcement regression and live route check. |
| F-1-9 | The process section remains “How Bookmark Proofbook works.” | `copy-audit.md`; live landing. |
| F-1-10 | The preview remains “What each bookmark keeps.” | `copy-audit.md`; live landing. |
| F-1-11 | The decorative visible caption remains absent; the artwork retains useful alt text. | `verify-url.sh` live report. |
| F-1-12 | Reader copy uses the explained term “extract code,” not “evidence hash.” | `@claim:evidence-hash`; copy regression. |
| F-1-13 | The former “Start for real” action was replaced, then corrected again in F-3-5. | Live demo action is “Open my proofbook.” |
| F-1-14 | Reader-facing README/product copy still avoids MV3/Xvfb implementation jargon. | `copy-audit.md`; clean-clone unit suite. |

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | **Bookmark** is the saved item and **proofbook** is the collection throughout. The final guard also rejects “saved notes.” | `uses bookmark consistently for saved items and proofbook for the collection`; `copy-audit.md`; live demo screenshot. |

## Review 3

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | The demo is proofbook-first: heading, count, search, and seeded records render before export/import controls and the add form. Mobile sample-card top is y=466.68; desktop top is y=439.10. | `@claim:one-click-demo`; `polish-3-live/demo-mobile.png`; `polish-3-local/demo-desktop.png`; live URL `/?demo=1`. |
| F-3-2 | Replaced “Keep a self-contained file you can open anywhere” with the exact tested wording “Export a readable HTML proofbook.” | Live landing check in `live-check.json`; `@claim:portable-export`; `copy-audit.md`. |
| F-3-3 | Added an absolute `twitter:image` using the existing original 1200×630 social image to the app shell and static 404. | Route metadata regression; live five-route metadata check; `/social-preview.webp` returned 200. |
| F-3-4 | Added shared versioned JSON parsing/import planning plus confirmed **Import proofbook JSON** in both site and extension. It validates format/version/fields/HTTP(S), shows added/replaced counts, replaces same-address records safely, and preserves all fields. | `@claim:lossless-json-import` exports the demo and restores it into a clean extension byte-for-field; site import regression; live JSON restore in `live-check.json`. |
| F-3-5 | Renamed the exit action to **Open my proofbook** and added a regression with a pre-existing real bookmark. Demo storage is discarded while real storage remains. | `keeps real bookmarks and names the real destination correctly when leaving demo`; live exit check. |
| F-3-6 | Renamed the mismatched section to **Saved extract limit**. | `copy-audit.md`; live landing check. |
| F-3-7 | Rewrote the first-screen result to “Opens a sample proofbook with three bookmarks” and extended the terminology guard. | Copy regression; `copy-audit.md`; live landing check. |

## Verification

- A detached clean clone at `8f015cc` ran `npm ci`, each of the 21 exact
  commands in `.factory/claims.json`, then `npm run lint`, `npm run
  typecheck`, `npm test`, `npm run test:e2e` (30/30), `npm run
  test:extension` (6/6), `npm run build`, and `npm audit --omit=dev`.
  All passed. Command logs were retained at
  `/tmp/bookmark-proofbook-claim-*.log` and
  `/tmp/bookmark-proofbook-clean-*.log` during the work order.
- Production cold checks are retained in `.factory/evidence/polish-3-live/`:
  `live-check.json`, mobile landing/demo screenshots, `verify/verify.json`,
  `axe-live.json`, and `lighthouse.json`.
- Production JavaScript was byte-identical to the local build:
  `index-DH3yVw0a.js` SHA-256
  `7d4d4bfc4afb614d29af1d870594adf1c8a9fbd4d18f2e6025fbda468ab545be`.
