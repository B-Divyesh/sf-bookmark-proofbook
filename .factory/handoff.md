# Bookmark Proofbook polish 1 handoff

## Outcome

All findings in `.factory/review-1.md` and the earlier verification reports
are repaired and rechecked. The repair commits are:

- `34c16ea357f032b2d18ff526c635ddcbe5761578` — product, claim, copy, demo,
  routing, metadata, accessibility, test, and evidence repairs.
- `0c3bc485c45f0872082c0c7cbf574c369657e9db` — pre-rendered route metadata
  for share crawlers before JavaScript runs.

Both are pushed to `origin/main`. The code commit was deployed through the
Static Web Apps work order at 2026-08-28 22:24 UTC:
<https://bookmark-proofbook.sociobot.in>.

## What changed

- Rewrote the first screen in plain words and retained the concrete-and-moss
  archive visual system.
- Made **Try it with sample data** open the isolated `/?demo=1` workspace in
  one click. The banner offers Reset demo and **Open my empty proofbook**;
  exit deletes only `demo:bookmark-proofbook:records`.
- Added claims and exact tagged tests for one-click demo entry, saved bookmark
  context, and extension-local storage. The inventory now has 20 claims, each
  with exactly one tag.
- Restored history scroll position, focus, and a polite route announcement.
- Added complete route-specific title, description, canonical, Open Graph,
  and Twitter metadata both at runtime and in generated static route HTML.
- Completed the direct 404 metadata and favicon/noindex treatment.
- Removed unproven distribution/capture-boundary wording and replaced jargon,
  decorative labels, and unclear actions across landing, demo, README, and
  extension copy.

The full finding-to-change map is in `.factory/polish-1.md`.

## Verification

From a fresh clone at `0c3bc48`:

```sh
npm ci
npm run typecheck       # PASS
npm run lint            # PASS
npm test                # PASS — 10 tests
npm run test:e2e        # PASS — 27 tests
npm run test:extension  # PASS — 5 installed-extension tests
npm audit --omit=dev    # PASS — 0 vulnerabilities
npm run build           # PASS — dist/site and MV3 zip
```

Every exact command listed in `.factory/claims.json` was also run separately
from that clean clone: all 20 claims passed. This includes the 14 site/demo
commands, 4 clean-profile extension commands, and 2 unit commands (with
commands shared by multiple claim types counted as their own individual run).

The production build is 19.10 KB raw / 7.02 KB gzip JavaScript, 7.65 KB raw /
2.43 KB gzip CSS, and a 115,156-byte hero WebP. It is under the static-product
budgets.

Local and live verification evidence is committed in:

- `.factory/evidence/polish-local/verify.json`
- `.factory/evidence/polish-local/landing-desktop.png`
- `.factory/evidence/polish-local/demo-mobile.png`
- `.factory/evidence/polish-live/verify.json`
- `.factory/evidence/polish-live/demo-mobile.png`

`/opt/fleet/lib/verify-url.sh` passed locally and against the live URL with no
console or page errors, a title, `lang=en`, one h1, a main landmark, and image
alt text. Playwright Axe passed with zero serious or critical issues locally
and on live `/`, `/?demo=1`, `/app`, `/privacy`, `/terms`, and the direct 404.
The standalone Axe CLI was attempted but cannot launch this container's
Chrome-for-Testing binary; the installed Playwright Axe integration is the
equivalent completed gate.

Cold live checks confirmed the repaired first screen, `/?demo=1` banner/reset
path, HTTP 404 response, route metadata, CSP, and only same-origin requests.
A fresh live browser context also clicked the first-screen demo action, checked
its three isolated records and discard-on-exit behavior, then verified Back
restored `scrollY` above 1000 and announced each route. The live extension zip
returned HTTP 200 as `application/zip` (268,820 bytes).

## Run and deploy

Use `npm run dev:site` for local development. Build deployable files with
`npm run build`; deploy only `dist/site` through the factory Static Web Apps
work order. The packaged extension is at
`dist/site/downloads/bookmark-proofbook-extension.zip`.

## Known gaps / next steps

None.
