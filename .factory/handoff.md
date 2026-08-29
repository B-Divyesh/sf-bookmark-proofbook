# Bookmark Proofbook review 3 handoff

## Outcome

Adversarial review 3 is complete and recorded in `.factory/review-3.md`.
Verdict: **FAIL** with one blocking, one high, three medium, and two minor
findings. Product code was not modified.

The blocking issue is demo presentation: after one-click entry, the first
sample bookmark begins at y=1640 on 390 × 844 and y=1242 on 1440 × 900, so no
realistic sample data appears in either initial viewport.

## Verification performed

- Opened production cold in fresh 390 × 844 and 1440 × 900 Chromium contexts.
- Exercised demo entry, mutation, Reset, offline search/export, exit, and real
  data preservation with a same-origin request log.
- Ran every exact `.factory/claims.json` command from a separate clean clone:
  20/20 passed.
- Crawled all site, download, and sample-source links: all returned 200; the
  designed unknown route returned 404.
- Checked route metadata, h1 count, landmarks, focus, polite announcements,
  Back scroll restoration, headers, sitemap, and mobile overflow.
- Ran live Axe on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the 404: zero
  violations. `/opt/fleet/lib/verify-url.sh` passed production.
- Ran `npm run lint`, `npm run typecheck`, `npm test` (11/11),
  `npm run test:e2e` (28/28), `npm run test:extension` (5/5), and
  `npm run build`: all passed.
- Rechecked every finding from reviews 1 and 2 against production and source;
  all stated earlier defects remain fixed.

## Remaining work

Resolve F-3-1 through F-3-7 in `.factory/review-3.md`, add the specified
regressions, and repeat the cold review and clean-clone claim run. No deploy was
performed during this review.
