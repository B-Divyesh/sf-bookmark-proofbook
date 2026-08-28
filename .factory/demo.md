# Demo sandbox

Open `/demo` or `/?demo=1`. The demo creates three realistic research records:
SQLite guidance, WCAG keyboard guidance, and a browser-rendering explanation.
It stores only in `localStorage` under `demo:bookmark-proofbook:records`.

Use **Reset demo** to discard and recreate the sample. **Start for real** goes
to `/app`, which uses the separate `proofbook:records` key. Demo storage is
never read by the real workspace.

The demo does not call a network service during normal capture, search, or
export. It can be used after its bundled page shell has loaded.
