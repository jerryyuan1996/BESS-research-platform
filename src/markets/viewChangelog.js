/* ---------------------------------------------------------------------------
   The whole changelog — what vite-plugin-view-changes.js puts here.

   view/changelog.jsonl, every line of it, with the record before and after
   each change, its reason and its evidence. The /changes page is the only
   thing that imports this, and it is loaded on demand, so the changelog can
   grow without the entry chunk or the home page's first view growing with it.
   The home page reads viewChanges.js instead: ten lines, five fields each.

   This file is what plain Node sees, so a test that imports the page's model
   gets an empty list rather than a module that cannot be resolved. The plugin
   replaces it in the dev server and in a build.

   Everything in a changelog line is public. The analyst's private reasons live
   in a folder the plugin never opens, and the view writer refuses to record
   one here.
   --------------------------------------------------------------------------- */

export const VIEW_CHANGELOG = [];
