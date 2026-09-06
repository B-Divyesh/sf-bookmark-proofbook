# Bookmark Proofbook — review 6 handoff

## Result

Completed the seven-day independent re-review without changing product code.
The result is **FAIL: 4 findings and 2 untested public claims**. Full evidence
and repair requirements are in `.factory/review-6.md`.

## Reviewed versions

- Implementation candidate: `e69e96a79eb6f1281f81273f9aff3733ce6a85bf`
- Documentation commit: `d9ffbb74ed44caeb9398e95a80c8ba0855174c92`
- Live JavaScript, CSS, and extension zip match the clean candidate build.

## Verification completed

- Fresh live phone and desktop contexts, first-read placement, one-click
  sample, sample isolation, reset, real-data preservation, invalid input,
  boundary input, recovery, offline opened-session behavior, keyboard, focus,
  reduced motion, routes, legal pages, links, metadata, headers, and 404.
- Every one of the 21 exact `.factory/claims.json` commands passed from a clean
  `npm ci` clone. Logs are in `/tmp/bookmark-proofbook-review-6-claims/`.
- Full clean gates passed: lint, typecheck, Vitest (12), site Playwright (31),
  installed-extension Playwright (6), build, and production audit.
- Factory URL verification passed. Live Playwright Axe found zero violations
  on all routes and the 404. Lighthouse mobile scored 100/100/100/100 with
  LCP 1,424 ms, CLS 0, and TBT 0 ms.
- A separate installed-extension fixture proved current changed and
  unreachable link outcomes, but that capability lacks the required declared
  claim regression.

## Findings to repair

1. Add a declared test for reachable, changed, and unreachable link-check
   outcomes and saved check times.
2. Keep the sample-data label visible while the demo page scrolls.
3. Replace or test the installed manifest's “durable export with each
   bookmark” statement and add manifest copy to the copy audit.
4. Make the three first-screen facts explicitly cover privacy, offline use,
   and the actual price.

The standalone Axe CLI was attempted but could not start its Selenium Chrome
session in this container. The installed Playwright Axe integration and a
separate live Playwright Axe audit both completed with zero violations.

## Next step

Repair all four findings, update the claim registry and tests, then rerun the
clean claim loop and full gates. No deployment was performed by this review.
