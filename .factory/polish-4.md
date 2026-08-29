# Polish 4 — cumulative zero-finding repair map

Review candidate `200f0c429fb1b1ca6431ade6ec7b083eb391cd46` had one
remaining defect. Repair commit `e69e96a79eb6f1281f81273f9aff3733ce6a85bf`
is pushed to `main` and deployed to
<https://bookmark-proofbook.sociobot.in> (Static Web Apps deployment
`55839741-8999-46d7-9a7e-cf2ce8bc39f8`). This map covers every finding in all
four adversarial reviews.

Evidence key: **L** is the cold live check at
`https://bookmark-proofbook.sociobot.in` in
`.factory/evidence/polish-4-live/live-check.json`; **S** is the relevant live
screenshot; all listed tests passed from the clean clone at
`/tmp/bookmark-proofbook-polish-4-clean.9KMQex`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Saved outgoing history scroll and restore it after route focus on Back/Forward. | Test: `restores scroll and announces the new route after back navigation`; S: `polish-4-live/verify/screenshot-desktop.png`; L: `/` → `/demo` → Back restored `scrollY: 1100`. |
| F-1-2 | Removed the unproved full-page-storage clause; the public limit is only the tested 12,000-character extract cap. | Test: `@claim:extract-cap`; S: `polish-4-live/verify/screenshot-desktop.png`; L: landing boundary at `/`. |
| F-1-3 | Removed the unverifiable browser-store absence statement; installation copy names the tested unpacked path only. | Test: `@claim:unpacked-install`; S: `polish-4-live/verify/screenshot-desktop.png`; L: `/`. |
| F-1-4 | Declared `extension-local-records` and covered clean-profile local-only extension storage. | Test: `@claim:extension-local-records`; S: `polish-4-live/landing-mobile-first-screen.png`; L: extension download at `/downloads/bookmark-proofbook-extension.zip`. |
| F-1-5 | The landing action opens the isolated populated `?demo=1` proofbook in one activation. | Test: `@claim:one-click-demo`; S: `polish-4-live/demo-mobile-first-screen.png`; L: `/?demo=1` has banner, `(3)`, and only demo storage. |
| F-1-6 | Route metadata now updates title, description, canonical, Open Graph, and Twitter fields. | Test: `publishes route-specific metadata and returns a real 404 response`; S: `polish-4-live/verify/screenshot-desktop.png`; L: all six real routes in `live-check.json`. |
| F-1-7 | The designed HTTP 404 has noindex, local icons, canonical, and complete share metadata. | Test: `publishes route-specific metadata and returns a real 404 response`; S: `polish-4-live/verify/screenshot-desktop.png`; L: `/missing-proofbook-page` returns 404 with 404 metadata. |
| F-1-8 | Added an atomic polite route announcer and kept record-list updates separate. | Test: `restores scroll and announces the new route after back navigation`; S: `polish-4-live/demo-mobile-first-screen.png`; L: announcement is `Demo — Bookmark Proofbook`. |
| F-1-9 | Renamed the process section to “How Bookmark Proofbook works.” | Test: site copy regression in `npm test`; S: `polish-4-live/verify/screenshot-desktop.png`; L: `/`. |
| F-1-10 | Renamed the preview section to “What each bookmark keeps.” | Test: site copy regression in `npm test`; S: `polish-4-live/verify/screenshot-desktop.png`; L: `/`. |
| F-1-11 | Removed the decorative hero caption while retaining the useful image alt text. | Test: `has no serious accessibility violations on the landing page`; S: `polish-4-live/landing-mobile-first-screen.png`; L: `/` has no caption and no missing alt. |
| F-1-12 | Replaced unexplained “evidence hash” copy with explained “extract code” language. | Test: `@claim:evidence-hash`; S: `polish-4-live/demo-mobile-first-screen.png`; L: `/?demo=1`. |
| F-1-13 | Renamed the demo exit to “Open my proofbook,” which remains true with existing real data. | Test: `keeps real bookmarks and names the real destination correctly when leaving demo`; S: `polish-4-live/demo-mobile-first-screen.png`; L: `/?demo=1`. |
| F-1-14 | Rewrote visitor-facing extension language without MV3/Xvfb jargon. | Test: `keeps bookmark terminology consistent in reader-facing copy`; S: `polish-4-live/verify/screenshot-desktop.png`; L: `/` and repository README. |
| F-2-1 | Standardised reader-facing names: a saved item is a bookmark and its collection is a proofbook. | Test: `uses bookmark consistently for saved items and proofbook for the collection`; S: `polish-4-live/demo-mobile-first-screen.png`; L: `/?demo=1` says “Saved bookmarks (3)”. |
| F-3-1 | Reordered the demo to show search, count, and a sample bookmark before controls and the add form. | Test: `@claim:one-click-demo`; S: `polish-4-live/demo-mobile-first-screen.png`; L: sample starts at y=466.41 in `/?demo=1`. |
| F-3-2 | Replaced the unproved self-contained/open-anywhere wording with the tested readable-HTML export wording. | Test: `@claim:portable-export`; S: `polish-4-live/verify/screenshot-desktop.png`; L: `/`. |
| F-3-3 | Added the absolute `twitter:image` field to the app shell and designed 404. | Test: `publishes route-specific metadata and returns a real 404 response`; S: `polish-4-live/verify/screenshot-desktop.png`; L: every checked route names `/social-preview.webp`. |
| F-3-4 | Added versioned, validated, confirmed lossless proofbook-JSON restore in the site and extension. | Test: `@claim:lossless-json-import`; S: `polish-4-live/demo-mobile-first-screen.png`; L: `/app` metadata and controls passed in `live-check.json`. |
| F-3-5 | Kept the truthful “Open my proofbook” exit and verified real bookmarks survive demo exit. | Test: `keeps real bookmarks and names the real destination correctly when leaving demo`; S: `polish-4-live/demo-mobile-first-screen.png`; L: `/?demo=1`. |
| F-3-6 | Renamed the boundary section “Saved extract limit.” | Test: site copy regression in `npm test`; S: `polish-4-live/verify/screenshot-desktop.png`; L: `/`. |
| F-3-7 | Rewrote the landing result as “three bookmarks” and reject “saved notes” in the copy guard. | Test: `keeps bookmark terminology consistent in reader-facing copy`; S: `polish-4-live/landing-mobile-first-screen.png`; L: `/` then `/?demo=1`. |
| F-4-1 | On narrow screens, the useful hero copy now comes before the artwork; hero spacing is reduced and all three facts are fully inside the first 390 × 844 viewport. | Test: `shows all three first-screen facts in the initial 390px landing viewport`; S: `polish-4-live/landing-mobile-first-screen.png`; L: fact bottoms are 547.28, 615.88, and 659.67 px at `/`. |

## Verification

- Clean clone: `npm ci`, every one of the 21 exact commands in
  `.factory/claims.json`, lint, typecheck, Vitest (12/12), site Playwright
  (31/31), extension Playwright (6/6), build, and `npm audit --omit=dev`
  passed. Individual claim logs are retained for this work order at
  `/tmp/bookmark-proofbook-polish-4-claims.IxEIPQ`.
- Local verification: `/opt/fleet/lib/verify-url.sh` passed with no console or
  page errors, one h1, `lang=en`, a main landmark, no missing image alt, and no
  unnamed buttons. Screenshots are in `.factory/evidence/polish-4-local/`.
- Live verification: the same URL verifier passed at the production URL. The
  cold live suite checks route metadata, 404 status, console/request logs,
  serious/critical Axe findings, demo isolation, mobile placement, and history
  restoration in `.factory/evidence/polish-4-live/live-check.json`.
- Production serves the same built JavaScript as `dist/site`:
  `index-C5aoMG9d.js` SHA-256
  `797ce653d6eb6d11fe08499bf6f5a4b20458fc5da48eced499e469995891670a`.
