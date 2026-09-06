# Bookmark Proofbook — repair 4 handoff

## Result

**PASS.** Strict review finding F-7-1 is fixed and no current or earlier
finding remains open.

The deployed implementation is
`9b76d91477ff7fda3fd068ad8bd775ef4d82bbf4` (`fix: enlarge mobile extension
install target`). The prior review/documentation baseline was
`e1b941b84bda2cfee36448913e6acd249c8ba04a`. Repair evidence is documented in
`2417cc55f799eab545ce94b95a2b461275853d50`; this handoff is later
documentation-only work.

## What changed

The landing **Install the browser extension** link is now a 44 px-high inline
flex touch target. The existing 390 px target regression now measures that
real rendered link in addition to the header, demo, bookmark, and footer
controls. The live phone target is 279.36 × 44 CSS px.

## How verified

- Fresh clone: `npm ci` and all 23 exact declared claim commands passed.
- `npm run lint`, `npm run typecheck`, `npm test` (12), `npm run test:e2e`
  (33), `npm run test:extension` (7), `npm audit --omit=dev`, and
  `npm run build` passed.
- Local and HTTPS `verify-url.sh` passed. Live Axe found zero violations on
  all public routes and the designed 404.
- Fresh HTTPS phone and desktop browsers showed the job, audience, and
  **Try it with sample data** action before scrolling. The phone contains all
  three required facts and the 44 px install target.
- The live one-click sample showed a realistic bookmark, Reset restored three
  bookmarks, the sample label stayed visible while using the final form
  action, and demo exit changed neither real data nor retained demo data.
- Lighthouse on HTTPS: 100 performance, accessibility, best practices, and
  SEO; LCP 1.35 s, CLS 0, TBT 0 ms.

## Deploy

`npm run build` created `dist/site`, then the existing Static Web Apps product
configuration deployed it to production. The canonical HTTPS URL now serves
the repaired asset.

## Remaining

No product defect is known. The free release has no advertised paid offer.
Any future one-time paid unlock depends on separate Sociobot billing
registration; no billing path or credentials were added.
