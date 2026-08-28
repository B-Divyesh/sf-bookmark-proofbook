# Demo sandbox

Open `/demo` or `/?demo=1`. The demo creates three realistic research records:
SQLite guidance, WCAG keyboard guidance, and a browser-rendering explanation.
It stores only in `localStorage` under `demo:bookmark-proofbook:records`.

Use **Reset demo** to discard and recreate the sample. **Start for real**
discards the demo namespace, then opens `/app`. The real workspace uses the
separate `proofbook:records` key and never reads demo storage.

The demo does not call a network service during normal capture, search, or
export. The opened workspace keeps working if the connection drops; it does
not claim to reload while offline because this static site does not install a
service worker.
