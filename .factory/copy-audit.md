# Copy audit

Audited 2026-08-29. The first screen says the job, audience, next action, and
three facts in one breath. Every sentence is at most 22 words. No banned term
appears in reader-facing copy.

## Catalog description

| Copy | Words | Result |
| --- | ---: | --- |
| Save context for every bookmark, then search and export your local proofbook. | 12 | Verb-first, specific, and within 120 characters |

## Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| LOCAL BOOKMARK TOOL | 3 | Specific label |
| Save why each link mattered | 5 | Verb-first headline |
| For people with too many bookmarks to remember, save context and find the resource again. | 15 | Audience and outcome |
| Try it with sample data | 5 | Primary action |
| Opens a sample proofbook with three bookmarks. | 7 | Explains the action; item term is consistent |
| No account required. | 3 | Tested claim |
| Capture, search, and export work locally. | 6 | Tested claim |
| Export a readable HTML proofbook. | 5 | Tested claim |
| Install the browser extension | 4 | Secondary action |
| BOOKMARK DETAILS | 2 | Specific label |
| What each bookmark keeps | 4 | Section heading |
| Each bookmark stores your reason, selected words, and a small page extract. | 12 | Tested claim |
| It also stores a code that identifies that extract. | 9 | Tested claim |
| Checked once | 2 | Sample status |
| Why I saved it: Decide when a small local database is the sensible choice. | 14 | Sample reason |
| SQLite is not directly comparable to client/server SQL database engines. | 10 | Sample quotation |
| THREE STEPS | 2 | Specific label |
| How Bookmark Proofbook works | 4 | Section heading |
| Capture a link. | 3 | Step |
| Write why it matters while you still know. | 8 | Plain instruction |
| Search your words. | 3 | Step |
| Find a source by the reason or extract you saved. | 10 | Tested claim |
| Export your proofbook. | 3 | Step |
| Export a readable HTML proofbook. | 6 | Tested claim; no unproved portability promise |
| Saved extract limit | 3 | Boundary heading names its content |
| It stores a text extract of up to 12,000 characters. | 10 | Tested limit |
| CHROME OR EDGE | 3 | Installation label |
| Install the browser extension | 4 | Installation heading |
| Download the extension zip | 4 | Tested action |
| Extract the zip to a folder you can keep. | 9 | Installation instruction |
| Open chrome://extensions or edge://extensions and turn on Developer mode. | 9 | Installation instruction |
| Choose Load unpacked, then select the extracted folder. | 8 | Installation instruction |
| Keep the folder after installation. | 5 | Installation instruction |
| Bookmark Proofbook keeps the reason beside the link. | 8 | Product-specific footer |

## Proofbook, extension, and legal copy

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved. | 6 | Tested demo claim |
| Open my proofbook | 4 | Names the real destination without assuming it is empty |
| Find a saved reason | 4 | Demo heading |
| Saved bookmarks | 2 | Consistent item name |
| Each bookmark keeps its original address and a small local extract. | 10 | Tested claim |
| No saved bookmarks match that search | 7 | Consistent empty state |
| Your saved bookmarks will appear here | 6 | Consistent empty state |
| Bookmark restored. | 2 | Consistent action result |
| The companion site stores bookmarks in browser local storage. | 9 | Tested claim |
| The extension stores bookmarks in extension local storage. | 9 | Tested claim |
| The companion site does not run analytics or send your bookmarks to a service. | 13 | Tested claims |
| You can export bookmarks. | 4 | Tested claim |
| Restore a JSON proofbook without losing its bookmark fields. | 10 | Tested claim |

## Terminology

| Concept | One term used |
| --- | --- |
| saved link plus context | bookmark |
| collection and working area | proofbook |
| small stored page text | extract |
| reason written by the person | reason |
| small identifier for an extract | extract code |
| network page status comparison | link check |

The unit regression `keeps bookmark terminology consistent in reader-facing
copy` rejects the previous names “saved evidence” and “workspace.” The site
browser regression checks the saved-bookmark heading and both empty states.
