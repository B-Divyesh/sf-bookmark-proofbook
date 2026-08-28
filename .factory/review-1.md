# Adversarial first-read review 1 — FAIL

**Product:** Bookmark Proofbook  
**Reviewed:** 2026-08-28  
**Live URL:** <https://bookmark-proofbook.sociobot.in>  
**Method:** Fresh Chromium contexts on the live deployment at 390 × 844 and
1440 × 900, followed by a clean local `npm ci` and all declared claim commands.
No product source was modified.

## Verdict

**FAIL.** The core product is clear and genuinely usable: the first screen,
sample demo, local storage isolation, export, extension package, and all 17
declared claims pass. However, back navigation loses the visitor's scroll
position, which is a broken routing requirement and therefore blocking. The
404/share metadata, route announcement, public-claim inventory, and copy also
have findings. A PASS requires zero findings.

## Cold first read

At both viewport sizes, before scrolling, the product answers the required
questions:

| Question | What the visitor can determine | Evidence |
| --- | --- | --- |
| What does it do? | It keeps the reason and context for a saved link. | `Keep why each link mattered` |
| Who is it for? | People who have too many bookmarks to remember. | `For people with too many bookmarks to remember…` |
| What should I click first? | Try the sample workspace. | `Try it with sample data` and `Opens three saved research notes.` |

The 390 px page places the artwork first, but the headline begins at 443 px
and the action at 693 px; both remain visible in the 844 px cold viewport. This
gate passes. The site made only same-origin requests for HTML, JS, CSS, and
the self-hosted hero image; the browser recorded no console or page errors.

## Findings

### Blocking

#### F-1-1 — Back navigation does not restore scroll position

**Location:** live `/` → header `Demo` → browser Back; routing in
`site/main.ts` (`pushState`, `popstate`, and `render`).

**Observed:** After scrolling the landing page to `scrollY: 1100`, opening
`/demo`, then pressing Back, the live page returned to `/` at `scrollY: 0`.
The heading correctly received focus, but the visitor lost their place.

**Why this fails:** A first-time visitor comparing the demo with the landing
content cannot return to the section they were reading. The required route
behaviour explicitly includes restoring scroll and focus on back/forward.

**Concrete fix:** Save the current scroll offset in the outgoing history state
before `pushState`; on `popstate`, render the route, move focus to its h1, then
restore that state's offset. Add a Playwright regression test that scrolls,
navigates to Demo, presses Back, and asserts the original offset within a small
tolerance.

### High

#### F-1-2 — The landing boundary claims more than its declared claim proves

**Location/quote:** landing, **What it does not do**: “It stores a text extract
of up to 12,000 characters, **not a full web page**.”

**Why this fails:** `extract-cap` declares and tests only “Each saved page
extract is capped at 12,000 characters.” It does not list or independently
test the distinct public promise that a full page is not stored. A visitor can
rely on that privacy boundary.

**Concrete fix:** Either change the copy to “It stores a text extract of up to
12,000 characters.” or add an exact `not-full-page` claim with a tagged test
that captures markup and asserts the stored/exported record contains plain
extract text rather than page markup or a full-page payload.

#### F-1-3 — “No browser store” is an unlisted public distribution claim

**Location/quote:** landing installation note and README: “This release is not
listed in a browser store.”

**Why this fails:** No entry in `.factory/claims.json` names or tests this
visitor-facing statement. `unpacked-install` proves a downloaded zip can be
loaded unpacked; it does not prove the absence of a store listing.

**Concrete fix:** Remove the sentence and retain the tested instructions:
“Install the downloaded zip with Developer mode.” If retaining the statement,
add a claim and a reproducible release-distribution check.

#### F-1-4 — README makes an unlisted extension-storage privacy claim

**Location/quote:** README, **Privacy and limits**: “The extension stores
records in extension local storage.”

**Why this fails:** `no-record-sync` is specifically limited to the companion
site. The extension tests happen to inspect `chrome.storage.local`, but no
claims entry makes this visitor promise or specifies its evidence.

**Concrete fix:** Add an `extension-local-records` claim whose clean-profile
extension test creates a record, asserts it is in `chrome.storage.local`, and
records that no network request occurs; otherwise remove this sentence.

#### F-1-5 — README calls the demo “one-click” without a matching claim test

**Location/quote:** README: “The companion site provides a one-click demo and
a local workspace at `/app`.”

**Why this fails:** `demo-namespace` opens `/demo` directly. It does not start
on the landing page and assert that the visible action reaches a populated demo
in one click. The live path works in this review, but the public promise has no
listed regression test.

**Concrete fix:** Add a `one-click-demo` claim: from `/`, click **Try it with
sample data**, assert `/demo`, the persistent demo banner, and the three
sample records. Or rewrite the README to name `/demo` without claiming clicks.

#### F-1-6 — Shared-page metadata describes the landing page, not the route

**Location:** live `/privacy`, `/demo`, `/app`, and `/terms`; `setTitle()` in
`site/main.ts`.

**Observed:** `/privacy` correctly sets `document.title` to “Privacy —
Bookmark Proofbook” and its canonical URL, but its Open Graph title remains
“Bookmark Proofbook — Keep why links mattered” and its Open Graph description
remains the landing description.

**Why this fails:** A shared Privacy or Demo URL previews as the landing page,
which is misleading and does not satisfy route metadata requirements.

**Concrete fix:** Give every route a title, description, canonical URL, Open
Graph title/description/URL, and Twitter title/description; update all of them
inside the route metadata function. Add route metadata assertions for every
public route.

### Medium

#### F-1-7 — The designed 404 lacks required metadata and a favicon

**Location:** direct live unknown route, e.g. `/not-a-real-page`; `public/404.html`.

**Observed:** The route returns a correct designed HTTP 404 with one h1, but
its document has no canonical link, no Open Graph or Twitter metadata, and no
favicon link.

**Why this fails:** A direct 404 is still a public route. It breaks the stated
metadata/favicon baseline and produces an unbranded share preview.

**Concrete fix:** Add the local favicon, an appropriate canonical policy (or
`noindex`), and route-specific Open Graph/Twitter metadata to `404.html`; add a
test for those tags on a direct 404 response.

#### F-1-8 — Route changes have no concise polite announcement

**Location:** SPA route changes in `site/main.ts`.

**Observed:** Focus moves to the new h1, but there is no dedicated
`aria-live="polite"` route announcer. On Demo, the existing live regions are a
blank form message, the entire records list, and a blank action message; none
announces “Demo — Bookmark Proofbook.”

**Why this fails:** The route-change requirement calls for both focus and a
polite announcement. Making the full record list live is also unnecessarily
verbose for a screen-reader visitor.

**Concrete fix:** Add one visually hidden polite status element, set it to the
new route title after rendering, and remove `aria-live` from the static full
records container or limit it to search result-count changes. Test its text on
header navigation and Back.

### Copy and terminology

#### F-1-9 — “Keep the trail to a source” is a mood heading, not a section name

**Location/quote:** landing h2: “Keep the trail to a source”.

**Why this fails:** It does not identify the three-step section when heard out
of context and uses a metaphor instead of telling a visitor what the section
contains.

**Concrete fix:** Rewrite as **“How Bookmark Proofbook works”**.

#### F-1-10 — “A link needs a reason” does not name the record-preview section

**Location/quote:** landing h2: “A link needs a reason”.

**Why this fails:** This is a slogan-like statement rather than a useful
heading for the contents that follow.

**Concrete fix:** Rewrite as **“What each bookmark keeps”**.

#### F-1-11 — The artwork caption carries no visitor-useful information

**Location/quote:** hero figcaption: “Archive slips beside moss and concrete.”

**Why this fails:** It is a visual mood line that could appear on another
archive-themed product. It neither explains the product nor tells the visitor
what to do.

**Concrete fix:** Delete the visible caption. The existing useful image alt
text can remain for nonvisual readers.

#### F-1-12 — “Evidence hash” is unexplained technical jargon

**Location/quote:** landing: “A title, your note, selected words, a small page
extract, and an evidence hash sit together.” README uses the same term.

**Why this fails:** A first-time bookmark user cannot tell what an evidence
hash is or why it helps. The phrase adds technical weight without an outcome.

**Concrete fix:** Use two short sentences: “Each bookmark stores your reason,
selected words, and a small page extract. It also stores a code that identifies
that extract.” Link to a concise definition only if the user needs the hash.

#### F-1-13 — “Start for real” is not a result-naming action

**Location/quote:** demo banner link: “Start for real”.

**Why this fails:** It does not say what happens after activation; the target
is an empty real workspace.

**Concrete fix:** Rename it **“Open my empty proofbook”** (or **“Leave demo and
open my proofbook”**).

#### F-1-14 — README uses unexplained implementation jargon

**Location/quote:** “The Chrome MV3 extension is the main capture tool.” and
“The browser-extension suite uses Xvfb and a clean Chromium profile.”

**Why this fails:** `MV3` and `Xvfb` are implementation labels, not useful
first-read language for the person evaluating or installing the product.

**Concrete fix:** Rewrite as “The Chrome extension captures pages.” and “The
extension tests use a clean Chromium profile.” Keep implementation detail in
developer-only test notes if it is needed.

## Copy audit

Word counts below use whitespace-delimited visible words. Labels, headings,
buttons, captions, and README prose are included so no reader-facing copy is
skipped. No item exceeds 22 words. `F-*` identifies the flags above.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| LOCAL BOOKMARK EVIDENCE | 3 | Clear label, but redundant with the headline |
| Keep why each link mattered | 5 | Pass |
| For people with too many bookmarks to remember, save context and find the resource again. | 15 | Pass |
| Try it with sample data | 5 | Pass; result-naming action |
| Opens three saved research notes. | 5 | Pass |
| No account required. | 3 | Listed claim |
| Capture, search, and export work locally. | 6 | Listed claim |
| Export a readable HTML proofbook. | 5 | Listed claim |
| Install the browser extension | 4 | Pass |
| Archive slips beside moss and concrete. | 6 | F-1-11 |
| WHAT A RECORD KEEPS | 5 | Clear label |
| A link needs a reason | 5 | F-1-10 |
| Appropriate Uses For SQLite | 4 | Sample record title |
| Checked once | 2 | Sample status |
| Why I saved it: Decide when a small local database is the sensible choice. | 13 | Sample note, pass |
| SQLite is not directly comparable to client/server SQL database engines. | 8 | Sample quotation, pass |
| evidence hash · 4fa1c0e7 | 4 | Technical label; see F-1-12 |
| THREE STEPS | 2 | Clear label |
| Keep the trail to a source | 6 | F-1-9 |
| Capture a link. | 3 | Pass |
| Write why it matters while you still know. | 9 | Pass |
| Search your words. | 3 | Pass |
| Find a source by the reason or evidence you saved. | 11 | Pass |
| Export your proofbook. | 3 | Pass |
| Keep a self-contained file you can open anywhere. | 8 | Pass |
| What it does not do | 5 | Pass |
| It stores a text extract of up to 12,000 characters, not a full web page. | 15 | F-1-2 unlisted clause |
| CHROME OR EDGE | 3 | Clear label |
| Install the browser extension | 4 | Pass |
| Download the extension zip | 4 | Pass; result-naming action |
| Extract the zip to a folder you can keep. | 9 | Pass |
| Open chrome://extensions or edge://extensions and turn on Developer mode. | 8 | Pass |
| Choose Load unpacked, then select the extracted folder. | 7 | Pass |
| Keep the folder after installation. | 5 | Pass |
| This release is not listed in a browser store. | 9 | F-1-3 unlisted claim |
| Bookmark Proofbook keeps the reason beside the link. | 8 | Pass |
| Privacy | 1 | Navigation label |
| Terms | 1 | Navigation label |
| Built by Param Factory · v1.0.1 | 5 | Attribution/version label |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Keep why each link mattered. | 5 | Pass |
| Bookmark Proofbook is for people with too many bookmarks to remember. | 9 | Pass |
| It keeps a reason, selected words, a small page extract, and an evidence hash beside each link. | 16 | F-1-12 jargon |
| Search that context later and export a readable HTML or JSON proofbook. | 11 | Listed claim |
| The Chrome MV3 extension is the main capture tool. | 9 | F-1-14 jargon |
| It reads the active page only after you press Capture this page. | 12 | Listed claim |
| The companion site provides a one-click demo and a local workspace at `/app`. | 12 | F-1-5 unlisted claim |
| Open the printed local URL. | 5 | Pass |
| Use `/demo` for isolated sample data. | 6 | Pass |
| Run `npm run build`, or download the extension zip from the product site. | 13 | Pass |
| Extract the zip to a folder you can keep. | 9 | Pass |
| Open `chrome://extensions` or `edge://extensions`. | 4 | Pass |
| Turn on **Developer mode**. | 4 | Pass |
| Choose **Load unpacked** and select the extracted folder. | 7 | Pass |
| The generated zip is `dist/site/downloads/bookmark-proofbook-extension.zip`. | 4 | Listed package claim |
| This release is not listed in a browser store. | 9 | F-1-3 unlisted claim |
| The browser-extension suite uses Xvfb and a clean Chromium profile. | 9 | F-1-14 jargon |
| The exact public claim commands are listed in `.factory/claims.json`. | 9 | Pass |
| The demo contract is in `.factory/demo.md`. | 7 | Pass |
| `npm run build` creates the static deployment in `dist/site`, including the Chrome MV3 zip. | 12 | F-1-14 jargon; package claim otherwise covered |
| Deploy that directory with the factory's static Azure Static Web Apps work order. | 12 | Pass for deploy instructions |
| Do not deploy `.output` or the repository root. | 8 | Pass |
| The repository does not manage DNS, billing, or cloud infrastructure. | 9 | Pass |
| No account is required for capture, search, or export. | 9 | Listed claim |
| The companion site stores records in browser local storage and does not send them to a service. | 15 | Listed claim |
| The companion site does not run analytics. | 7 | Listed claim |
| The extension stores records in extension local storage. | 8 | F-1-4 unlisted claim |
| Each saved page extract is capped at 12,000 characters. | 8 | Listed claim |
| The extension contacts saved addresses only after you press **Check links**. | 11 | Listed claim |
| Each check processes at most 25 records. | 7 | Listed claim |
| Remove has an immediate undo action in both the site and extension. | 11 | Listed claim |
| An opened workspace keeps working if the connection drops. | 9 | Listed claim |
| MIT. | 1 | License label |
| See [LICENSE](LICENSE). | 2 | Pass |

## Demo and sandbox verification

- The landing action opens `/demo` in one click. Its first screen already has
  the three realistic SQLite, WCAG, and browser-rendering records.
- The persistent banner reads “Demo — sample data, nothing is saved.” It
  includes **Reset demo** and **Start for real**.
- In a fresh context, demo data occupied only
  `demo:bookmark-proofbook:records`; the real key was empty. Adding a sample
  record changed the total from three to four; **Reset demo** returned it to
  three. **Start for real** removed the demo key and opened an empty `/app`.
- The complete demo flow made only same-origin requests. It did not read or
  write the real local-storage namespace.

## Declared claims

Every exact command in `.factory/claims.json` passed from this clean install.
No listed claim test failed.

| Claim id | Exact test result |
| --- | --- |
| `search-saved-context` | PASS |
| `portable-export` | PASS |
| `demo-namespace` | PASS |
| `no-account-required` | PASS |
| `local-records` | PASS |
| `offline-session` | PASS |
| `no-record-sync` | PASS |
| `no-analytics` | PASS |
| `explicit-page-read` | PASS |
| `extract-cap` | PASS |
| `link-check-limit` | PASS |
| `packaged-extension` | PASS |
| `unpacked-install` | PASS |
| `reversible-delete` | PASS |
| `http-links-only` | PASS |
| `browser-html-import` | PASS |
| `evidence-hash` | PASS |

## Earlier-review history rechecked

The repository contains `verification.md`, `verification-2.md`, and
`verification-3.md`; there are no earlier `review-*.md` or `polish-*.md`
files. Every earlier finding was independently checked against live and code:

| Earlier finding | Current result |
| --- | --- |
| Broken declared claim command | Fixed: all 17 exact commands pass. |
| False changed-link result | Fixed: the current normalised extraction path is covered by unit tests and the installed-extension suite passes. |
| Missing live extension download | Fixed: live zip returns HTTP 200; package claim passes. |
| Dead paid checkout | Fixed by removal: no checkout or price is advertised. |
| Skip link/focus regression | Fixed: fresh first Tab focuses **Skip to main content** with a 4 px outline. |
| Earlier unlisted claims | Partly fixed, but F-1-2 through F-1-5 identify remaining unlisted public claims. |
| Undersized mobile targets | Fixed: current 390 px target test passes. |
| Demo data retained on exit | Fixed: live exit removes the `demo:` key. |
| Irreversible deletion | Fixed: site and extension suites verify immediate undo. |
| Unsafe manual URL | Fixed: the `javascript:` claim test passes. |
| Duplicate/unsafe browser import | Fixed: claim test passes. |
| Home canonical and HTTP-200 unknown route | Fixed: route canonicals update and an unknown URL returns HTTP 404. |
| Missing extension-install instructions | Fixed: live landing and README describe extract, Developer mode, and Load unpacked. |
| Asset cache policy | Fixed: live hashed JS/CSS return `max-age=31536000, immutable`; download remains revalidated. |
| Dependency audit | Fixed: `npm audit --omit=dev` reports zero vulnerabilities. |

## Structure, access, and quality checks

- The site has a distinct concrete/moss archive identity, original local art,
  self-hosted assets, visible focus states, and no generic SaaS-card treatment.
- Normal live routes have one h1, `lang="en"`, main landmark, title,
  description, canonical URL, and correct live 404 response. The 404 and route
  share metadata exceptions are F-1-6 and F-1-7.
- Header/footer links, the extension download, and all three shipped sample
  links returned HTTP 200. There were no dead links in this crawl.
- Fresh live Axe check on the demo found zero serious/critical violations; the
  verifier script reported title, language, h1, main, image alt, and no console
  errors.
- `npm run lint`, `npm run typecheck`, `npm test` (10/10), `npm run test:e2e`
  (24/24), `npm run test:extension` (4/4), `npm audit --omit=dev`, and
  `npm run build` all pass. The built initial JS is 17.40 KB raw / 6.72 KB gzip.
- The brief does not imply an AI feature: capture, import, search, link checks,
  and HTML/JSON export cover the obvious user leverage without decorative AI or
  embedded provider keys.

## What would make this perfect

Restore scroll on Back/Forward, complete route and 404 metadata, add a concise
route announcer, and resolve or remove every unlisted promise. Replace the
four flagged mood/jargon/action strings with the proposed plain wording. Then
add regression tests for each fix and rerun this entire review from a fresh
browser context and clean install.
