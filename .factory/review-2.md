# Adversarial first-read review 2 — FAIL

**Product:** Bookmark Proofbook
**Reviewed:** 2026-08-28
**Live URL:** <https://bookmark-proofbook.sociobot.in>
**Candidate:** `56f752c60b64e9075f8abd40ae198369d94b9dd6`

## Verdict

**FAIL.** The product is clear on a cold 390 px and desktop load, the demo is
real and isolated, all declared claims pass from a clean clone, and the earlier
review findings are repaired. One minor terminology regression remains. The
acceptance standard for this review is zero findings, so it cannot pass yet.

## Cold first read

Before scrolling, both fresh Chromium contexts answered all three questions.

| Question | Answer a visitor can give | Exact first-screen evidence |
| --- | --- | --- |
| What does it do? | Saves the reason a bookmarked link mattered. | “Save why each link mattered” |
| Who is it for? | People with too many bookmarks to remember. | “For people with too many bookmarks to remember, save context and find the resource again.” |
| What should I click first? | Open the sample proofbook. | “Try it with sample data” and “Opens a sample proofbook with three saved notes.” |

At 390 × 844, the action began at y=668 px and was fully visible (253.6 ×
46.8 px). The desktop action began at y=448 px. There were no browser console
or page errors. This gate passes.

## Findings

### Minor

#### F-2-1 — The product calls the same saved thing “bookmarks,” “records,” “evidence,” and a “workspace”

**Location and exact text:**

- Live `/demo` and `/app`, section heading: “Saved evidence (3)”.
- Live empty states: “No saved evidence matches that search” and “Your saved
  evidence will appear here”.
- README first section: “The companion site has an isolated sample at
  `/?demo=1` and a local workspace at `/app`.”

**Why this is a finding:** The landing page calls the user’s saved item a
“bookmark” (“What each bookmark keeps”), while the product’s own terminology
table calls it a “record.” “Saved evidence” is a third, metaphorical name, and
“workspace” is a fourth name for the same place. A first-time visitor needs to
learn one name for the thing they will save and search; changing it in the
working screen makes the interface less direct.

**Concrete fix:** Use **bookmark** for the user-facing item throughout:
change the heading to “Saved bookmarks (3)”, the two empty-state headings to
“No saved bookmarks match that search” and “Your saved bookmarks will appear
here”, and the README sentence to “The companion site has an isolated sample
at `/?demo=1` and an empty proofbook at `/app`.” Update the terminology table
to match. Add a copy regression assertion or extend the copy audit so “saved
evidence” and “workspace” cannot return as names for bookmarks.

## Copy audit

Counts are whitespace-delimited. Interface labels, headings, controls,
captions, and README prose are included. No line exceeds 22 words. `F-2-1`
is the only terminology flag.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| LOCAL BOOKMARK TOOL | 3 | Pass |
| Save why each link mattered | 5 | Pass |
| For people with too many bookmarks to remember, save context and find the resource again. | 15 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a sample proofbook with three saved notes. | 8 | Pass |
| No account required. | 3 | Listed claim |
| Capture, search, and export work locally. | 6 | Listed claim |
| Export a readable HTML proofbook. | 5 | Listed claim |
| Install the browser extension | 4 | Pass |
| BOOKMARK DETAILS | 2 | Pass |
| What each bookmark keeps | 4 | Pass |
| Each bookmark stores your reason, selected words, and a small page extract. | 12 | Listed claim |
| It also stores a code that identifies that extract. | 9 | Listed claim |
| Checked once | 2 | Sample status |
| Appropriate Uses For SQLite | 4 | Sample title |
| Why I saved it: Decide when a small local database is the sensible choice. | 14 | Sample note |
| SQLite is not directly comparable to client/server SQL database engines. | 10 | Sample quotation |
| extract code · 4fa1c0e7 | 4 | Pass |
| THREE STEPS | 2 | Pass |
| How Bookmark Proofbook works | 4 | Pass |
| Capture a link. | 3 | Pass |
| Write why it matters while you still know. | 8 | Pass |
| Search your words. | 3 | Pass |
| Find a source by the reason or extract you saved. | 10 | Listed claim |
| Export your proofbook. | 3 | Pass |
| Keep a self-contained file you can open anywhere. | 8 | Listed claim |
| What it does not do | 5 | Pass |
| It stores a text extract of up to 12,000 characters. | 10 | Listed claim |
| CHROME OR EDGE | 3 | Pass |
| Install the browser extension | 4 | Pass |
| Download the extension zip | 4 | Listed claim |
| Extract the zip to a folder you can keep. | 9 | Pass |
| Open chrome://extensions or edge://extensions and turn on Developer mode. | 9 | Pass |
| Choose Load unpacked, then select the extracted folder. | 8 | Pass |
| Keep the folder after installation. | 5 | Pass |
| Bookmark Proofbook keeps the reason beside the link. | 8 | Listed claim |
| Privacy | 1 | Navigation |
| Terms | 1 | Navigation |
| Built by Param Factory · v1.0.1 | 6 | Attribution |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Bookmark Proofbook | 2 | Product name |
| Save why each link mattered. | 5 | Pass |
| Bookmark Proofbook is for people with too many bookmarks to remember. | 11 | Pass |
| It keeps a reason, selected words, and a small page extract beside each link. | 14 | Listed claim |
| It also stores a code that identifies that extract. | 9 | Listed claim |
| Search that context later and export a readable HTML or JSON proofbook. | 12 | Listed claim |
| The Chrome extension captures pages. | 5 | Listed claim |
| It reads the active page only after you press Capture this page. | 12 | Listed claim |
| The companion site has an isolated sample at `/?demo=1` and a local workspace at `/app`. | 15 | F-2-1 |
| Run | 1 | Heading |
| Open the printed local URL. | 5 | Pass |
| Use `/demo` for isolated sample data. | 6 | Pass |
| Install the extension | 3 | Heading |
| Run `npm run build`, or download the extension zip from the product site. Then: | 14 | Pass |
| Extract the zip to a folder you can keep. | 9 | Pass |
| Open `chrome://extensions` or `edge://extensions`. | 4 | Pass |
| Turn on **Developer mode**. | 4 | Pass |
| Choose **Load unpacked** and select the extracted folder. | 8 | Pass |
| The generated zip is `dist/site/downloads/bookmark-proofbook-extension.zip`. | 5 | Listed claim |
| Test | 1 | Heading |
| The extension tests use a clean Chromium profile. | 8 | Pass |
| The exact public claim commands are listed in `.factory/claims.json`. | 9 | Pass |
| The demo contract is in `.factory/demo.md`. | 6 | Pass |
| Deploy | 1 | Heading |
| `npm run build` creates the static deployment in `dist/site`, including the Chrome extension zip. | 14 | Listed claim |
| Deploy that directory with the factory’s static Azure Static Web Apps work order. | 13 | Developer instruction |
| Do not deploy `.output` or the repository root. | 8 | Pass |
| The repository does not manage DNS, billing, or cloud infrastructure. | 10 | Pass |
| Privacy and limits | 3 | Heading |
| No account is required for capture, search, or export. | 9 | Listed claim |
| The companion site stores records in browser local storage and does not send them to a service. | 17 | Listed claims |
| The companion site does not run analytics. | 7 | Listed claim |
| The extension stores records in extension local storage. | 8 | Listed claim |
| Each saved page extract is capped at 12,000 characters. | 9 | Listed claim |
| The extension contacts saved addresses only after you press **Check links**. | 11 | Listed claim |
| Each check processes at most 25 records. | 7 | Listed claim |
| Remove has an immediate undo action in both the site and extension. | 12 | Listed claim |
| An opened workspace keeps working if the connection drops. | 9 | Listed claim; terminology is within F-2-1’s same concept |
| License | 1 | Heading |
| MIT. See [LICENSE](LICENSE). | 3 | Pass |

No banned marketing adjectives, overlong lines, unclear landing headings, or
non-result-naming buttons were found. All claim-like sentences on the landing,
README, and public privacy/demo/app routes map to an entry in
`.factory/claims.json`; no unlisted-claim finding was found.

## Demo, privacy, and claims

- A fresh landing click opened `/?demo=1` in one action. The first screen
  already contained three realistic SQLite, WCAG, and browser-rendering
  bookmarks.
- The persistent banner was “Demo — sample data, nothing is saved.” It exposed
  **Reset demo** and **Open my empty proofbook**. Reset restored three records.
  Exiting opened an empty `/app` and removed only
  `demo:bookmark-proofbook:records`; the real `proofbook:records` namespace
  remained empty.
- The complete live landing/demo/search/reset/exit flow made only same-origin
  requests (document, CSS, JavaScript, and self-hosted WebP). It made no
  analytics, record-sync, or third-party request. The offline claim’s tagged
  test passed after `context.setOffline(true)`.
- From a temporary clean clone, `npm ci` completed with no audit findings and
  every exact command in `.factory/claims.json` passed. The 20 passing IDs were
  `save-bookmark-context`, `search-saved-context`, `portable-export`,
  `demo-namespace`, `one-click-demo`, `no-account-required`, `local-records`,
  `offline-session`, `no-record-sync`, `no-analytics`, `explicit-page-read`,
  `extension-local-records`, `extract-cap`, `link-check-limit`,
  `packaged-extension`, `unpacked-install`, `reversible-delete`,
  `http-links-only`, `browser-html-import`, and `evidence-hash`.

## Structure and interaction checks

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200; the extension
  download returns 200; the three sample-source links return 200; and an
  unknown route returns a designed HTTP 404 with a return-home action.
- Every public route has the expected route-specific title, one h1, description,
  canonical (the 404 is deliberately `noindex`), Open Graph/Twitter metadata,
  favicon, `lang=en`, header, skip link, main, and footer with Privacy and
  Terms. The sitemap lists every public route.
- Fresh 390 px checks found no horizontal overflow. The primary action is
  46.8 px tall; nav, demo, record, delete, and footer controls meet the 44 px
  target. The first Tab reaches the skip link and its 4 px focus outline.
- Direct route changes move focus to the h1 and update the polite route
  announcer. A non-scrolling programmatic navigation from y=1100 to Demo then
  Back returned to y=1100, confirming the repaired history state logic.
- The concrete-and-moss archive surface is visibly product-specific rather
  than a generic SaaS template. It matches `.factory/design.md`; the original
  self-hosted artwork is present. Reduced-motion and Axe coverage pass in the
  checked test suites.

The brief does not imply AI, and capture/import/search/link checks/export are
already present. No AI feature is needed, and no provider key or decorative AI
flow was found.

## Earlier-finding regression check

Every finding in `review-1.md` was checked on the live deployment and in the
candidate source rather than accepted from the polish note.

| Earlier finding | Result and evidence |
| --- | --- |
| F-1-1 | Fixed: `saveScrollPosition`, `popstate`, and the tagged scroll test restore y=1100. |
| F-1-2 | Fixed: the untested “not a full web page” clause is absent. |
| F-1-3 | Fixed: the browser-store absence claim is absent. |
| F-1-4 | Fixed: `extension-local-records` is declared and passed in a clean profile. |
| F-1-5 | Fixed: `one-click-demo` is declared and passed from landing to three-record demo. |
| F-1-6 | Fixed: each route updates title, description, canonical, OG, and Twitter data. |
| F-1-7 | Fixed: the direct 404 has favicon, share metadata, and `noindex`. |
| F-1-8 | Fixed: `#route-announcer` is atomic polite and announces route names. |
| F-1-9 | Fixed: the heading is “How Bookmark Proofbook works”. |
| F-1-10 | Fixed: the heading is “What each bookmark keeps”. |
| F-1-11 | Fixed: the decorative visible artwork caption is absent. |
| F-1-12 | Fixed: public copy now explains an “extract code”; “evidence hash” is absent. |
| F-1-13 | Fixed: the exit action is “Open my empty proofbook”. |
| F-1-14 | Fixed: visitor-facing README copy no longer uses MV3/Xvfb jargon. |

## What would make this perfect

Apply the four terminology rewrites in F-2-1, update the terminology table,
and add a copy guard. Re-run the existing suite and the clean-clone claim loop.
At that point this review has no remaining issue to report.
