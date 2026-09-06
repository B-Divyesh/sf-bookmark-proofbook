# Bookmark Proofbook — repair 3 handoff

## Result

Repaired all four findings from `review-6.md` and deployed version 1.0.2 to
<https://bookmark-proofbook.sociobot.in>. No known acceptance finding remains.

## Versions and deployment

- Review base: `437306d6241311b6e8578fb1832050f6284ab444`
- Deployed implementation: `324ce5b57a9135799831939b13c7d2126bf29cbd`
- Azure Static Web Apps deployment: `21fe449e-acae-4de4-ad40-ba75f6c23159`
- Product resource: `sf-bookmark-proofbook`, existing Central US static app
- The live JavaScript, CSS, and extension zip have the same SHA-256 hashes as
  the implementation build.

The verification evidence and this handoff are a later documentation commit;
the implementation SHA above is the deployed product image.

## Repairs

1. Added the declared `link-health-results` claim. Its installed-extension test
   uses deterministic reachable, changed, and unreachable fixtures, then
   checks the rendered state, stored state, and saved check time for each.
2. Made the demo strip sticky and compact. A 390 × 844 regression scrolls to
   the last form action and requires the sample label, reset, and exit controls
   to remain inside the viewport.
3. Replaced the manifest's inaccurate durability sentence with capture,
   search, and export wording. The installed artifact test now completes those
   outcomes, and the manifest sentence is included in `copy-audit.md`.
4. Replaced the first-screen facts with browser-local storage, opened-session
   offline use, and the current price: free during this release. The new price
   claim completes save, search, and export without payment or billing traffic.
5. Bumped the site and extension to 1.0.2. The existing original artwork and
   concrete-and-moss visual system were retained; no new generated asset or
   runtime AI feature was warranted.

## Clean verification

A fresh clone at the implementation SHA was installed with `npm ci`. Every one
of the 23 exact commands in `.factory/claims.json` passed individually.

The same clean clone then passed:

- `npm run lint`
- `npm run typecheck`
- `npm test` — 12 tests
- `npm run test:e2e` — 33 tests
- `npm run test:extension` — 7 tests in clean installed profiles
- `npm run build` — produced `dist/site` and the 1.0.2 extension zip
- `npm audit --omit=dev` — zero vulnerabilities
- `/opt/fleet/lib/verify-url.sh` — title, language, one h1, main, alt text,
  labels, and console checks passed
- Playwright Axe — zero violations on `/`, `/demo`, `/app`, `/privacy`,
  `/terms`, and the designed 404

The suites cover normal capture/search/export, invalid and boundary input,
corrupt-storage recovery, browser HTML and proofbook JSON import, removal and
undo, keyboard/focus, 44 px phone targets, reduced motion, offline use after
load, route metadata, history restoration, legal pages, and the HTTP 404.

## Cold live verification

Fresh 390 × 844 and 1440 × 900 Chromium contexts showed the job, audience,
sample action, and all three facts before scrolling. On the phone, the fact
rows ended at 547.28, 591.08, and 634.88 px. First Tab reached the skip link
with a 4 px focus outline.

One click opened the populated sample. The first sample began at y=404.91 px.
Adding a bookmark changed the sample count to four without changing a seeded
real bookmark. At scroll y=2210, the 70.39 px demo strip remained at y=0 with
its label, reset, and exit actions visible. Reset restored three samples. Exit
deleted the demo key and reopened the unchanged real bookmark.

All normal routes returned 200 with route-specific titles, `lang=en`, one h1,
one main, and no console or page errors. The designed missing route returned
the expected HTTP 404 and had zero Axe violations. All product-owned links,
the extension download, and the three sample-source links returned 200. The
opened live demo still searched and exported after the browser went offline.
Normal live flows made no third-party request.

Live Lighthouse results are Performance 100, Accessibility 100, Best
Practices 100, and SEO 100. LCP was 1.4 s, CLS was 0, TBT was 0 ms, and total
transfer was 125 KiB. Built JavaScript is 22.82 kB raw / 8.18 kB gzip; CSS is
8.73 kB raw / 2.66 kB gzip.

Evidence files:

- `.factory/evidence/repair-3-live-phone.png`
- `.factory/evidence/repair-3-live-desktop.png`
- `.factory/evidence/repair-3-live-demo-scrolled-phone.png`
- `.factory/evidence/lighthouse-repair-3-live.json`

## Earlier findings rechecked

| Finding | Current disposition |
| --- | --- |
| F-1-1 | Back navigation restores saved scroll, focuses the h1, and updates the polite route announcement. |
| F-1-2, F-1-3 | The unproved full-page-storage and browser-store-absence statements remain absent. |
| F-1-4, F-1-5 | Extension-local storage and one-click isolated demo claims pass in clean profiles. |
| F-1-6, F-1-7, F-1-8 | Route metadata, the true HTTP 404, h1 focus, and route announcements pass. |
| F-1-9 through F-1-14 | Plain section names, useful image alt, explained extract code, truthful demo exit, and plain installation wording remain. |
| F-2-1 | **Bookmark** remains the item and **proofbook** remains the collection in reader copy. |
| F-3-1 | The first realistic sample starts at y=404.91 in the live phone viewport. |
| F-3-2, F-3-3 | Export wording stays within the tested claim; all routes keep complete local share metadata. |
| F-3-4 | Versioned proofbook JSON restores every bookmark field across site and extension. |
| F-3-5, F-3-6, F-3-7 | Demo exit preserves real data, the limit heading is accurate, and bookmark terminology stays consistent. |
| F-4-1 | All three corrected privacy/offline/price facts end above y=635 in the 844 px phone viewport. |

## Price, privacy, and limits

The current release has no paid tier or advertised billing offer, so no
`billing-offer.json` was created. No paid deliverable existed to remove. The
catalog description was copied unchanged to
`/work/.evidence/catalog-description.txt`; it is verb-first and 78 bytes.

Bookmarks remain local to browser storage. There is no backend, account,
analytics, or runtime AI. Backend tenancy, server restart persistence, health
endpoints, and 429 handling do not apply.

Cold offline reload is not supported or claimed; only a proofbook loaded before
connection loss stays usable. Extension installation remains the documented
download, extract, Developer mode, and Load unpacked path.
