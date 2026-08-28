# Bookmark Proofbook

Save why each link mattered. Bookmark Proofbook is for people with too many
bookmarks to remember. It keeps a reason, selected words, and a small page
extract beside each link. It also stores a code that identifies that extract.
Search that context later and export a readable HTML or JSON proofbook.

The Chrome extension captures pages. It reads the active page only after you
press **Capture this page**. The companion site has an isolated sample at
`/?demo=1` and a local workspace at `/app`.

## Run

```sh
npm ci
npm run dev:site
```

Open the printed local URL. Use `/demo` for isolated sample data.

## Install the extension

Run `npm run build`, or download the extension zip from the product site. Then:

1. Extract the zip to a folder you can keep.
2. Open `chrome://extensions` or `edge://extensions`.
3. Turn on **Developer mode**.
4. Choose **Load unpacked** and select the extracted folder.

The generated zip is `dist/site/downloads/bookmark-proofbook-extension.zip`.

## Test

```sh
npm test
npx tsc --noEmit
npm run test:e2e
npm run test:extension
npm run build
npm audit --omit=dev
```

The extension tests use a clean Chromium profile. The exact public claim
commands are listed in `.factory/claims.json`. The demo contract is in
`.factory/demo.md`.

## Deploy

`npm run build` creates the static deployment in `dist/site`, including the
Chrome extension zip. Deploy that directory with the factory's static Azure Static
Web Apps work order. Do not deploy `.output` or the repository root.

For an authenticated factory shell:

```sh
swa deploy ./dist/site --env production \
  --app-name sf-bookmark-proofbook \
  --resource-group sociobot \
  --subscription-id "$AZURE_SUBSCRIPTION_ID"
```

The repository does not manage DNS, billing, or cloud infrastructure.

## Privacy and limits

No account is required for capture, search, or export. The companion site
stores records in browser local storage and does not send them to a service.
The companion site does not run analytics. The extension stores records in
extension local storage.

Each saved page extract is capped at 12,000 characters. The extension contacts
saved addresses only after you press **Check links**. Each check processes at
most 25 records. Remove has an immediate undo action in both the site and
extension. An opened workspace keeps working if the connection drops.

## License

MIT. See [LICENSE](LICENSE).
