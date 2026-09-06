# Strict repair 4 — PASS

## Result

**PASS.** Finding count: **0**. Untested public claim count: **0**.

Implementation fixed and deployed: `9b76d91477ff7fda3fd068ad8bd775ef4d82bbf4`.
The review/documentation baseline before this repair was
`e1b941b84bda2cfee36448913e6acd249c8ba04a`.

## Fixed finding

| Finding | Cause | Repair | Regression proof |
| --- | --- | --- | --- |
| F-7-1: 19 px phone install link | The landing anchor used the browser's text line box, so it did not inherit the 44 px control minimum. | The landing anchor is now an inline flex target with `min-height: 44px`. | The existing 390 × 844 keyboard/touch-target browser test measures the rendered install link's width and height, alongside header, demo, record, and footer controls. It does not inspect source strings. |

Fresh live phone measurement: **279.36 × 44 CSS px**. The same target is
44 px high on desktop.

## Earlier finding disposition

All earlier review and verification findings remain repaired. The current full
site and extension suites cover their actual user outcomes: isolated sample
data and exit discard; capture, search, import, export, undo, URL validation,
and extract boundaries; lossless JSON restore; explicit and bounded link
checks with all saved health states; per-route metadata and HTTP 404; Back
scroll/focus/route announcement; privacy/no-analytics requests; keyboard,
visible focus, reduced motion, and 44 px controls. The only previously missed
control was F-7-1, now covered by the expanded phone target sweep.

## Verification

- Fresh clone: `npm ci`, then every one of the 23 exact commands in
  `.factory/claims.json`: **PASS** (`ALL_CLAIMS_PASSED 23`).
- Current checkout: `npm run lint`, `npm run typecheck`, `npm test` (12),
  `npm run test:e2e` (33), `npm run test:extension` (7),
  `npm audit --omit=dev`, and `npm run build`: **PASS**.
- Factory URL verifier: local and HTTPS production **PASS** with one h1,
  `lang=en`, main landmark, image alt text, labelled controls, and no console
  errors.
- Fresh HTTPS phone and desktop checks: the first screen states the job
  (**Save why each link mattered**), audience, and first action before
  scrolling. All three local/offline/price facts fit in the phone viewport.
- HTTPS demo check: one click showed the realistic SQLite sample; Reset
  restored `(3)`; the sticky sample banner stayed at y=0; exit removed the
  demo key and left the real key unchanged.
- Live Axe check: zero violations on `/`, `/demo`, `/app`, `/privacy`,
  `/terms`, and the designed 404. The browser's expected network message for
  the deliberate 404 is not a product console defect.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.35 s, CLS 0, TBT 0 ms, 127,931 bytes transferred.

Evidence is in `.factory/evidence/repair-4-local/` and
`.factory/evidence/repair-4-live/`.

## Remaining dependency

The current release truthfully advertises the free core and has no paid offer
or checkout. A future one-time paid offer still depends on the separate
Sociobot billing-registration operator; no payment path or offer metadata was
invented here.
