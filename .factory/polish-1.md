# Polish 1 — repair map

Candidate `7a8590aa2880755bf486d68ff36911eed0477539` was repaired from the
adversarial-review base `aef2d4ec581d736b4e11e0bc85fdb9be2ef24b8c`.
The deployed code is `0c3bc485c45f0872082c0c7cbf574c369657e9db` at
<https://bookmark-proofbook.sociobot.in>.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Navigation now writes the outgoing `scrollY` into history state, uses manual scroll restoration, and restores it after focus on Back/Forward. | `npm run test:e2e -- --grep "restores scroll"`; `.factory/evidence/polish-local/landing-desktop.png` |
| F-1-2 | Removed the unproven “not a full web page” clause; the remaining 12,000-character boundary is claimed and tested. | `npm test -- --testNamePattern @claim:extract-cap` |
| F-1-3 | Removed the untestable browser-store-distribution statement from the landing page and README. | `rg` copy audit; `npm run test:e2e -- --grep @claim:unpacked-install` |
| F-1-4 | Added `extension-local-records` to the claims inventory and a clean-profile extension test that inspects `chrome.storage.local` and external requests. | `npm run test:extension -- --grep @claim:extension-local-records` |
| F-1-5 | The first-screen action now enters `/?demo=1`; added `one-click-demo` claim coverage for URL, banner, three records, and isolated storage. | `npm run test:e2e -- --grep @claim:one-click-demo`; `.factory/evidence/polish-local/demo-mobile.png` |
| F-1-6 | Route metadata is now a per-route model that updates title, description, canonical URL, Open Graph, and Twitter title/description. | `npm run test:e2e -- --grep "route-specific metadata"` |
| F-1-7 | The real `404.html` now has `noindex`, local favicon and apple-touch icon, plus 404-specific Open Graph and Twitter metadata. | `npm run test:e2e -- --grep "route-specific metadata"`; local `curl -I /missing-proofbook-page` returned 404 |
| F-1-8 | Added a dedicated atomic polite route announcer. Record results are no longer the route announcement. | `npm run test:e2e -- --grep "restores scroll"` |
| F-1-9 | Replaced “Keep the trail to a source” with “How Bookmark Proofbook works.” | `.factory/copy-audit.md`; landing screenshot |
| F-1-10 | Replaced “A link needs a reason” with “What each bookmark keeps.” | `.factory/copy-audit.md`; landing screenshot |
| F-1-11 | Removed the decorative artwork caption; useful image alt text remains. | `/opt/fleet/lib/verify-url.sh` local report; landing screenshot |
| F-1-12 | Rewrote public “evidence hash” copy as a plain “extract code” explanation. | `.factory/copy-audit.md`; `npm test -- --testNamePattern @claim:evidence-hash` |
| F-1-13 | Renamed the demo exit to “Open my empty proofbook.” | `npm run test:e2e -- --grep @claim:demo-namespace`; demo screenshot |
| F-1-14 | Rewrote README product language to “Chrome extension” and “clean Chromium profile”; implementation labels no longer appear in visitor copy. | `.factory/copy-audit.md`; README review |

## Earlier review coverage

`verification.md`, `verification-2.md`, and `verification-3.md` were also
read. Their previously repaired requirements remain covered: local-only
storage and no analytics, the explicit bounded link check, HTTP(S)-only entry
and import, duplicate filtering, undo, unpacked extension instructions and
artifact, 44 px mobile targets, real 404, route canonicals, cache rules, and
the absence of a dead paid checkout. The final full suites exercise these
regressions: `npm test` (10), `npm run test:e2e` (27), and
`npm run test:extension` (5).

## Local evidence

- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ .factory/evidence/polish-local` passed with no console/page errors, one h1, `lang=en`, a main landmark, and no missing image alt text.
- Playwright Axe integration passed across `/`, `/?demo=1`, `/app`, `/privacy`, `/terms`, and the direct 404 in `npm run test:e2e`.
- The standalone Axe CLI could not launch this container’s Chrome binary; the installed Playwright Axe integration is the accessibility gate used above.

## Live recheck

After Static Web Apps deployment, a cold production request loaded
`index-DQzq6Qzc.js`, the repaired landing title, and the expected CSP. A direct
unknown address returned HTTP 404. `verify-url.sh` passed on the live landing,
and a fresh mobile screenshot confirms the direct `/?demo=1` banner, Reset
demo, empty-proofbook exit, three sample records, and stacked mobile layout:
`.factory/evidence/polish-live/demo-mobile.png`. A live Playwright Axe and
console/request smoke test reported zero serious/critical issues, console
errors, or third-party requests for all public routes.
