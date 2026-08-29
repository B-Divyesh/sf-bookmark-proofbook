# Adversarial first-read review 5 — PASS

**Product:** Bookmark Proofbook  
**Reviewed:** 2026-08-29  
**Live URL:** <https://bookmark-proofbook.sociobot.in>  
**Reviewed commit:** `37c42f3c94b57f22aa920d68edc24f83fb176786`

## Verdict

**PASS.** There are zero findings, including zero blocking findings. The cold
landing explains the job, audience, and first action on a 390 × 844 phone and
desktop. The one-click demo is populated and isolated. All 21 declared claims
passed from a clean clone. No unlisted visitor claim, dead link, route defect,
accessibility issue, or regression of an earlier finding was found.

## Cold first read

Before scrolling, I could answer all three required questions at 390 × 844 and
1440 × 900:

| Question | First-read answer | Exact evidence |
| --- | --- | --- |
| What does it do? | It saves the reason and context for a bookmark so I can find it later. | “Save why each link mattered” |
| Who is it for? | People who have too many bookmarks to remember. | “For people with too many bookmarks to remember, save context and find the resource again.” |
| What should I click first? | Open the ready-made sample proofbook. | “Try it with sample data” and “Opens a sample proofbook with three bookmarks.” |

At 390 px, all three required facts were wholly inside the first viewport:
their lower edges were 547.28 px, 615.88 px, and 659.67 px, respectively. The
cold landing made only four same-origin requests (document, JavaScript, CSS,
and the responsive self-hosted image) and produced no console or page errors.

## Copy audit

Counts are whitespace-delimited. The audit includes visible landing headings,
labels, actions, prose, and footer text, plus all README reader and developer
prose. No item exceeds 22 words. No jargon, banned marketing adjective,
metaphor/mood heading, inconsistent term, or non-result-naming action was
found. **Bookmark** names the saved item; **proofbook** names its collection.

### Landing page

| Copy | Words |
| --- | ---: |
| Skip to main content | 4 |
| LOCAL BOOKMARK TOOL | 3 |
| Save why each link mattered | 5 |
| For people with too many bookmarks to remember, save context and find the resource again. | 15 |
| Try it with sample data | 5 |
| Opens a sample proofbook with three bookmarks. | 7 |
| No account required. | 3 |
| Capture, search, and export work locally. | 6 |
| Export a readable HTML proofbook. | 5 |
| Install the browser extension | 4 |
| BOOKMARK DETAILS | 2 |
| What each bookmark keeps | 4 |
| Each bookmark stores your reason, selected words, and a small page extract. | 12 |
| It also stores a code that identifies that extract. | 9 |
| Checked once | 2 |
| Appropriate Uses For SQLite | 4 |
| Why I saved it: Decide when a small local database is the sensible choice. | 14 |
| SQLite is not directly comparable to client/server SQL database engines. | 10 |
| extract code · 4fa1c0e7 | 4 |
| THREE STEPS | 2 |
| How Bookmark Proofbook works | 4 |
| Capture a link. | 3 |
| Write why it matters while you still know. | 8 |
| Search your words. | 3 |
| Find a source by the reason or extract you saved. | 10 |
| Export your proofbook. | 3 |
| Export a readable HTML proofbook. | 5 |
| Saved extract limit | 3 |
| It stores a text extract of up to 12,000 characters. | 10 |
| CHROME OR EDGE | 3 |
| Install the browser extension | 4 |
| Download the extension zip | 4 |
| Extract the zip to a folder you can keep. | 9 |
| Open chrome://extensions or edge://extensions and turn on Developer mode. | 9 |
| Choose Load unpacked, then select the extracted folder. | 8 |
| Keep the folder after installation. | 5 |
| Bookmark Proofbook keeps the reason beside the link. | 8 |
| Privacy | 1 |
| Terms | 1 |
| Built by Param Factory · v1.0.1 | 6 |

### README

| Copy | Words |
| --- | ---: |
| Bookmark Proofbook | 2 |
| Save why each link mattered. | 5 |
| Bookmark Proofbook is for people with too many bookmarks to remember. | 11 |
| It keeps a reason, selected words, and a small page extract beside each link. | 14 |
| It also stores a code that identifies that extract. | 9 |
| Search that context later and export a readable HTML or JSON proofbook. | 12 |
| Restore a JSON proofbook without losing its bookmark fields. | 10 |
| The Chrome extension captures pages. | 5 |
| It reads the active page only after you press Capture this page. | 12 |
| The companion site has an isolated sample at `/?demo=1` and your proofbook at `/app`. | 14 |
| Run | 1 |
| Open the printed local URL. | 5 |
| Use `/demo` for isolated sample data. | 6 |
| Install the extension | 3 |
| Run `npm run build`, or download the extension zip from the product site. Then: | 14 |
| Extract the zip to a folder you can keep. | 9 |
| Open `chrome://extensions` or `edge://extensions`. | 4 |
| Turn on Developer mode. | 4 |
| Choose Load unpacked and select the extracted folder. | 7 |
| The generated zip is `dist/site/downloads/bookmark-proofbook-extension.zip`. | 5 |
| Test | 1 |
| The extension tests use a clean Chromium profile. | 8 |
| The exact public claim commands are listed in `.factory/claims.json`. | 9 |
| The demo contract is in `.factory/demo.md`. | 6 |
| Deploy | 1 |
| `npm run build` creates the static deployment in `dist/site`, including the Chrome extension zip. | 14 |
| Deploy that directory with the factory's static Azure Static Web Apps work order. | 13 |
| Do not deploy `.output` or the repository root. | 8 |
| The repository does not manage DNS, billing, or cloud infrastructure. | 10 |
| Privacy and limits | 3 |
| No account is required for capture, search, or export. | 9 |
| The companion site stores bookmarks in browser local storage and does not send them to a service. | 17 |
| The companion site does not run analytics. | 7 |
| The extension stores bookmarks in extension local storage. | 9 |
| Each saved page extract is capped at 12,000 characters. | 9 |
| The extension contacts saved addresses only after you press Check links. | 11 |
| Each check processes at most 25 bookmarks. | 7 |
| Remove has an immediate undo action in both the site and extension. | 12 |
| An opened proofbook keeps working if the connection drops. | 9 |
| License | 1 |
| MIT. | 1 |
| See [LICENSE](LICENSE). | 2 |

Every claim-like landing and README sentence maps to a declared claim. The
README’s build, route, and repository-scope instructions were additionally
confirmed by the clean-clone build and direct route checks.

## Demo, privacy, and claims

- One click on **Try it with sample data** opened `/?demo=1`.
- The first 390 px demo viewport contained **Saved bookmarks (3)** and a
  complete realistic SQLite bookmark starting at y=468 px.
- The persistent banner read “Demo — sample data, nothing is saved.” It
  provided **Reset demo** and **Open my proofbook**. Reset recreated the three
  samples.
- In a fresh context, samples used only
  `demo:bookmark-proofbook:records`; real storage was empty. Exiting deleted
  only that demo key and opened `/app`, leaving real storage untouched.
- The full landing, demo, reset, search, export, and exit flow requested only
  the product origin. No analytics, bookmark-sync, API, font-CDN, or other
  third-party request occurred.
- Every command in `.factory/claims.json` passed from a fresh `npm ci` clone:
  `save-bookmark-context`, `search-saved-context`, `portable-export`,
  `lossless-json-import`, `demo-namespace`, `one-click-demo`,
  `no-account-required`, `local-records`, `offline-session`, `no-record-sync`,
  `no-analytics`, `explicit-page-read`, `extension-local-records`,
  `extract-cap`, `link-check-limit`, `packaged-extension`, `unpacked-install`,
  `reversible-delete`, `http-links-only`, `browser-html-import`, and
  `evidence-hash`.

## Earlier-finding regression check

I read reviews 1–4, polish maps 1–4, the prior handoff, and the verification
reports. Each historic finding was checked in both current source and the live
site. None reopened.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | History state saves outgoing scroll; Back restores it after h1 focus and a polite route announcement. The regression test passes. |
| F-1-2 | The unproved full-page-storage clause is absent; the 12,000-character limit is declared and tested. |
| F-1-3 | The unsupported browser-store-absence claim is absent. |
| F-1-4 | `extension-local-records` is declared and its clean-profile test passes. |
| F-1-5 | One click enters the isolated, populated three-bookmark demo. |
| F-1-6 | Each live route updates its title, description, canonical URL, and Open Graph/Twitter metadata. |
| F-1-7 | An unknown address returns the designed HTTP 404 with `noindex`, local icon, canonical, and share metadata. |
| F-1-8 | Route changes focus the h1 and update the atomic polite announcer. |
| F-1-9 | The process heading is “How Bookmark Proofbook works.” |
| F-1-10 | The preview heading is “What each bookmark keeps.” |
| F-1-11 | The decorative artwork caption is absent; its useful image alt remains. |
| F-1-12 | Reader copy uses the explained term “extract code”; “evidence hash” is not exposed. |
| F-1-13 | The demo exit is the truthful, result-naming “Open my proofbook.” |
| F-1-14 | Visitor-facing extension text has no MV3/Xvfb implementation jargon. |
| F-2-1 | Reader-facing item terminology is consistently **bookmark** and collection terminology is **proofbook**. |
| F-3-1 | A complete sample bookmark is visible in the initial phone demo viewport. |
| F-3-2 | The unproved self-contained/open-anywhere wording is absent. |
| F-3-3 | Every live route has the absolute `twitter:image` for the local social image. |
| F-3-4 | Site and extension expose versioned JSON restore; its lossless cross-surface claim test passes. |
| F-3-5 | Demo exit stays truthful when real bookmarks already exist. |
| F-3-6 | The boundary section is named “Saved extract limit.” |
| F-3-7 | The landing and demo consistently call samples bookmarks, not notes. |
| F-4-1 | All three first-screen facts are fully visible at 390 × 844. |

## Structure, access, and quality

- `/`, `/demo`, `/?demo=1`, `/app`, `/privacy`, and `/terms` returned 200.
  The unknown route returned the designed 404. Every rendered internal link,
  extension zip, and all three sample-source links returned 200.
- Routes have route-specific titles in the required product/what-it-does
  pattern, one h1, `lang=en`, a description, canonical, OG/Twitter fields,
  favicon, apple-touch icon, skip link, main, consistent header, and footer.
  `robots.txt` and `sitemap.xml` are present. The response CSP carries
  `frame-ancestors` as a header.
- Live route changes update title, focus, and announcement; deep links and
  Back work. The 390 px layout has no horizontal overflow.
- The concrete, paper, moss, heavy-rule, monospace archive system and original
  self-hosted art match `.factory/design.md` and are product-specific rather
  than a generic SaaS template. No runtime AI feature or provider key exists;
  the brief does not imply an AI-assisted job.
- `npm run lint`, `npm run typecheck`, `npm test` (12/12), `npm run test:e2e`
  (31/31), `npm run test:extension` (6/6), and `npm run build` passed from the
  clean clone. The built site JavaScript is 22.82 kB raw / 8.16 kB gzip.
- `/opt/fleet/lib/verify-url.sh` passed locally with no console errors. A
  Playwright Axe check found zero violations on `/`, `/demo`, `/app`,
  `/privacy`, `/terms`, and the 404. The standalone `@axe-core/cli` could not
  start Chrome in this container; this is an environment limitation, and the
  installed Playwright Axe integration completed successfully.

## What would make this perfect

Nothing is currently required for acceptance. Keep the existing claim tests,
copy audit, demo-isolation check, and mobile first-screen regression in every
future change so this remains a zero-finding result.
