# NEM G-2 release

The analyst signed off G-2 and explicitly authorised merging and publishing on 6 November 2026 (Australia/Perth) ("G-2 sign off. Go ahead merge and publish."), after the G-2 decisions of 5 November 2026 recorded in [the G-2 checklist](nem-g2-checklist.md) and [build evidence §0](nem-build-evidence.md#0-analyst-decisions--5-november-2026-g-2-review). The story pack merged first, unreleased.

This release sets `released: true` for `nem` in `src/experience/story/registry.js`. The market page's research button now opens the story on the infrastructure-fund lens, and story links (`?view=story`) work publicly. A changed call, play, duration or lens keeps the research-dialog fallback. The thirteen bilingual shots, bound figures, markers, AEMO observed layers (cleared 5 November 2026) and the `story-nem` cap of 41 KiB are unchanged. Teaching controls never modify the investment case.

No model number, fixture, snapshot, kit, shell, contract or view change. Publish only through GitHub Actions: validate, build, scan the exact Vercel output, deploy prebuilt, and verify the production release stamp and the bilingual live story. Exact head and test evidence belong in the release PR.

Rollback: set `released: false` for `nem`; the button opens the research dialog again.
