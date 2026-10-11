/* ---------------------------------------------------------------------------
   The view store's recent changes — STUB.

   Replaced by vite-plugin-view-changes.js, on the dev server and in a build,
   with the last ten lines of view/changelog.jsonl reduced to who, what, why
   and when. The whole changelog is never bundled: each line carries the full
   record before and after, which is an audit trail and not page content.

   This file is what plain Node sees, so a test that imports the home page's
   model gets an empty digest rather than a module that cannot be resolved.
   The reduction itself is tested against the real changelog in
   tests/verdict-board.test.js.
   --------------------------------------------------------------------------- */

export const VIEW_CHANGES = { total: 0, recent: [], perDay: {} };
