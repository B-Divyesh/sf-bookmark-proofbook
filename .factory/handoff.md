# Bookmark Proofbook polish 2 handoff

## Outcome

Every finding in `.factory/review-1.md` and `.factory/review-2.md` is repaired
and rechecked. The final product commit is
`0788e60c8628b963462e0c8469a1e565e35f0d2f`, pushed to `origin/main` and
deployed to <https://bookmark-proofbook.sociobot.in>.

## What changed

- Standardized reader-facing terminology: a saved item is a **bookmark** and
  the collection/working area is a **proofbook**. This includes the companion
  site, extension, legal pages, README, demo and claims documentation.
- Added unit, site, and installed-extension regressions for the terminology.
- Made demo storage discard on any route exit, including browser Back.
- Limited search announcements to the bookmark count instead of making the
  complete result list live.
- Corrected demo-banner ARIA semantics and removed transient animation opacity,
  producing zero Axe findings at the mobile viewport.
- Added a responsive 600 px derivative of the existing original hero artwork.
  The concrete-and-moss identity and browser-extension artifact class remain
  unchanged.

The complete finding-to-change map is in `.factory/polish-2.md`.

## What was verified

From a clean clone of `0788e60`:

- `npm ci`: PASS, 256 packages, zero audit findings.
- Every exact `.factory/claims.json` command: PASS, 20/20.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test`: PASS, 11/11.
- `npm run test:e2e`: PASS, 28/28.
- `npm run test:extension`: PASS, 5/5 clean-profile extension tests.
- `npm audit --omit=dev`: PASS, zero vulnerabilities.
- `npm run build`: PASS; `dist/site` and the packaged extension zip exist.

The final build is 19.25 KB raw / 7.08 KB gzip JavaScript, 7.63 KB raw /
2.42 KB gzip CSS, a 22,588-byte mobile hero, and a 115,156-byte desktop hero.

After deployment, a fresh 390 × 844 Chromium context verified the first-screen
action at y=715, one-click `/?demo=1`, three sample bookmarks, Reset demo,
separate `demo:` storage, discard on exit, empty `/app`, and no horizontal
overflow. It also checked every route title/canonical, the HTTP 404, Back to
scrollY 1100, the polite announcement, 44 px minimum touch targets, the live
extension zip, zero external requests, and zero console errors.

`verify-url.sh` passed on production. Axe reported zero findings on `/`,
`/demo`, `/app`, `/privacy`, `/terms`, and the 404. Mobile Lighthouse scored
Performance 97, Accessibility 100, Best Practices 100, and SEO 100 with LCP
2,487 ms, CLS 0, and TBT 0 ms. The local and live JavaScript SHA-256 is
`bf83057e9373cccd25cb4efba76e135cb2d4d9bba84fa0e823207734d8f63663`.

Evidence:

- `.factory/evidence/polish-2-live/check.json`
- `.factory/evidence/polish-2-live/verify.json`
- `.factory/evidence/polish-2-live/lighthouse.json`
- `.factory/evidence/polish-2-live/landing-mobile.png`
- `.factory/evidence/polish-2-live/demo-mobile.png`

## Run and deploy

Use `npm run dev:site` locally. Run the commands above to verify. `npm run
build` creates the static site in `dist/site` and the browser-extension zip at
`dist/site/downloads/bookmark-proofbook-extension.zip`. Deploy only `dist/site`
with the documented Static Web Apps work-order command.

## Remaining work

None.
