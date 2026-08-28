# Polish 2 — cumulative repair map

Release candidate `56f752c60b64e9075f8abd40ae198369d94b9dd6` was reviewed at
`ecf88b759d23c585fedc6d02ce10e78c1025a8f4`. The repaired product is the
commit series ending at `0788e60c8628b963462e0c8469a1e565e35f0d2f`, deployed
at <https://bookmark-proofbook.sociobot.in>.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | History state retains outgoing `scrollY`; Back/Forward restores it after route focus. | `restores scroll and announces the new route after back navigation`; live `restoredScrollY: 1100` in `.factory/evidence/polish-2-live/check.json`. |
| F-1-2 | The unproved full-page-storage clause remains removed; only the tested 12,000-character extract cap is public. | `@claim:extract-cap`; live landing in `.factory/evidence/polish-2-live/screenshot-desktop.png`. |
| F-1-3 | The untestable browser-store absence claim remains removed. Installation copy gives only the tested unpacked steps. | `@claim:unpacked-install` and `gives complete unpacked installation instructions beside the extension download`; live landing screenshot. |
| F-1-4 | The extension-local-storage claim remains listed and uses bookmark terminology. | `@claim:extension-local-records`; all 20 exact claim commands passed from a clean clone. |
| F-1-5 | The first-screen action enters isolated `/?demo=1` in one click, shows three bookmarks, and now discards demo storage on link exit or browser Back. | `@claim:one-click-demo` and `@claim:demo-namespace`; `.factory/evidence/polish-2-live/demo-mobile.png`; cold live check. |
| F-1-6 | Runtime and pre-rendered pages retain route-specific titles, descriptions, canonicals, Open Graph, and Twitter metadata. | `publishes route-specific metadata and returns a real 404 response`; live checks for `/`, `/demo`, `/app`, `/privacy`, and `/terms`. |
| F-1-7 | The designed HTTP 404 retains `noindex`, favicon, and route-specific share metadata. | Same metadata test; cold live `/missing-proofbook-page` returned 404 with zero Axe violations. |
| F-1-8 | A dedicated atomic polite route announcer names route changes. The full bookmark list is no longer live; only its count is announced. | `restores scroll and announces the new route after back navigation`; live announcer and Back check. |
| F-1-9 | The section remains named “How Bookmark Proofbook works.” | `.factory/copy-audit.md`; live landing screenshot. |
| F-1-10 | The preview remains named “What each bookmark keeps.” | `.factory/copy-audit.md`; live landing screenshot. |
| F-1-11 | The decorative visible artwork caption remains absent while the useful image alt stays present. | `verify-url.sh` live result in `.factory/evidence/polish-2-live/verify.json`. |
| F-1-12 | Reader copy explains an “extract code”; the technical “evidence hash” label remains absent. | `@claim:evidence-hash`; `.factory/copy-audit.md`; live landing screenshot. |
| F-1-13 | Demo exit remains the result-naming “Open my empty proofbook.” | `@claim:demo-namespace`; `.factory/evidence/polish-2-live/demo-mobile.png`. |
| F-1-14 | README and product copy retain plain “Chrome extension” and “clean Chromium profile” wording. | `.factory/copy-audit.md`; `npm test` copy regression. |
| F-2-1 | All reader-facing item names are now “bookmark”; the collection and working area are “proofbook.” Updated site headings, empty states, legal copy, extension popup, README, demo docs, and claim wording. | `uses bookmark consistently for saved items and proofbook for the collection`; `keeps bookmark terminology consistent in reader-facing copy`; extension accessibility test; `.factory/evidence/polish-2-live/demo-mobile.png`; cold live text check. |

## Additional zero-finding checks

- Replaced the invalid `role="status"` on the demo `<aside>` with a named
  complementary landmark. The 390 px demo Axe test now requires zero findings,
  not only zero serious findings.
- Kept the 180 ms archive-stamp movement while removing transient opacity that
  could lower text contrast during an audit.
- Added a 22,588-byte, 600 px responsive derivative of the original hero art.
  Mobile fetches it instead of the 115,156-byte desktop source.
- Cold production checks found zero Axe violations on all six checked pages,
  no console errors, no external requests, 44 px minimum touch targets, a
  visible first-screen demo action, and byte-identical local/live JavaScript.

## Verification

From a fresh clone of `0788e60`, `npm ci` installed 256 packages with zero
audit findings. Every exact command in `.factory/claims.json` passed (20/20),
followed by `npm run lint`, `npm run typecheck`, `npm test` (11/11),
`npm run test:e2e` (28/28), `npm run test:extension` (5/5),
`npm audit --omit=dev`, and `npm run build`.

Live evidence is under `.factory/evidence/polish-2-live/`. Lighthouse mobile
scored Performance 97, Accessibility 100, Best Practices 100, and SEO 100;
LCP was 2,487 ms, CLS 0, and TBT 0 ms.
