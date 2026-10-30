# Preparation, Migration and Acceptance

Pack: BESS-IX-2026-10-30, version 1.2  
Status: sequence, gates, self-review and laptop handoff checklist; nothing executed except committing v1.0 (`db158b9`)  
Navigation: [Master plan](README.md) | [Engineering work packages](engineering-work-packages.md) | [Market narratives](market-narratives.md) | [WA storyboard](western-australia-storyboard.md)

## 1. Nothing in the pilot needs the new laptop

With isometric SVG and no new financial views, every pilot task runs on the current machine: research, script, kit, shell, scenes and tests. From this plan, the new laptop needs only a clean setup (§6). It is described as an AMD AI 9 H365 with 32 GB of RAM; record the actual CPU, GPU and driver at handoff. The hardware matters only if `WP-11` (WebGL) is ever opened.

## 2. Roles

| Work | AI assistants (ChatGPT, Codex, Claude Code) | User |
| --- | --- | --- |
| Research | Find primary sources, extract claims with locators, flag conflicts | Approve interpretations |
| Script | Draft copy anchored to the call; check references and tokens | Sign off (`G-1`) |
| Build | Implement the packages and run the checks | Review the running story |
| Release | Prepare the PR and its evidence | Merge and publish through the existing pipeline |

Every assistant follows the repository's `AGENTS.md`, drafted on branch `claude/agents-md` (§6). Agreement between assistants is not review; the user's sign-off is.

## 3. Gates

v1.1 replaces v1.0's `G-0` to `G-7` with three gates.

| Gate | Evidence | Owner |
| --- | --- | --- |
| G-1: script signed off | The story leads to the published call; hinge claims are sourced or styled as Example or scenario; one marker per shot; Chinese drafted | User |
| G-2: story merged | `WP-02` to `WP-07` complete; existing CI green on the exact SHA (model baselines, confidentiality scan, budgets, e2e); keyboard, mobile and two-language walkthrough; no fixture regenerated | User merges |
| G-3: optional WebGL | A named shot that SVG cannot explain; the `WP-11` requirements and the §5.2 budgets in the engineering plan are met | User decides |

There is no separate numeric gate. The story shows only fields that existing components already render, and the existing model tests guard those.

## 4. Suggested sequence

Relative working days, not dates. If a source takes longer, move the gate rather than skip it.

| Day | Output | Gate |
| --- | --- | --- |
| 1 | Source the WA hinge claims: CL-WA-06, CL-WA-07 with GAP-WA-RCM, and CL-WA-05; decide how to close GAP-WA-DAY | |
| 2 | Revise the WA script against those sources; assign markers; draft the Chinese | G-1 |
| | *Status on 30 October (v1.2): days 1 and 2 done; the script awaits `G-1`* | |
| 3 to 4 | `WP-02` contract and `WP-06` kit; `WP-03` shell with placeholder diagrams | |
| 5 to 6 | `WP-07` scenes and the signature chart; `WP-04` URLs | |
| 7 | Walkthrough, fixes and the `WP-10` PR | G-2 |
| Later | German and Finnish research (GAP-DE-PRICES, GAP-FI-NEED), then `WP-09` | |

`WP-01` (the Node pin) and the laptop handoff (§6) can happen at any time; neither blocks the story.

## 5. Self-review

The reader is mainly the user (D8), so the user's own checks at `G-1` and `G-2` replace recruited tests. Optionally, walk one colleague through the story and note where they stumble.

For WA, using the story alone:

- Can I say why the play is an eight-hour capacity battery, seven hours for the rule and one for the fade, bought behind a sponsor?
- Can I say why the NEM's opposite choice matters?
- Can I name what would weaken the play, and find the matching Downside input?
- Does every "What would change it" line name real evidence?
- Is any sentence a caveat paragraph? If so, cut it.

For Germany: why a toll, and why congestion is not battery income. For Finland: why two hours with a negotiated floor, and why reserve prices are falling.

Critical misreadings to look for:

- Teaching arrows read as measured flows.
- "The system needs batteries" read as a revenue guarantee.
- Modelled secured revenue read as a signed contract.
- A grant read as recurring revenue.
- Services read as stackable at their individual maxima.
- Commercial operation read as every income line starting at once.
- A teaching control read as changing the case.
- A downside case read as a probability.

Screens to check: 1440, 1280, 768 and 390 CSS pixels wide, in English and Chinese, in each supported theme, with the keyboard only and with reduced motion, plus one real phone.

## 6. Laptop handoff checklist

Found on this workstation on 30 October 2026. Do not copy `node_modules`, build caches or `.claude/worktrees/`: clone fresh and run `npm ci` on the pinned Node. Keep credentials and marker terms out of this document.

| Item | State on 30 October | Action |
| --- | --- | --- |
| Plan pack | v1.0 is commit `db158b9` and v1.1 is `3f1101f` on branch `claude/immersive-plan`, pushed to GitHub on 30 October | Done; merge when ready |
| Unpushed branch | `claude/bess-economics-investment-logic-779d70` has two commits from 30 July and 4 August; `main` later removed that chain's test | Push it as a backup branch, or drop it |
| Worktrees | Nine clean worktrees removed on 30 October; a research note from one was copied to `local-data/g12-augmentation-crosscheck.md`. Two remain. `bess-economics-investment-logic-779d70` still stages the prototype files purged on 10 August, though its commits are clean. `youthful-dijkstra-f42b23` staged a scout-schedule doc fix, now saved on branch `claude/scout-schedule-docs` | Remove the two with `git worktree remove --force`; do not copy them |
| Git-ignored material | `local-data/`, `deliverables/`, `.env.local`, `.env.fingrid`, `.vercel/` | Move by encrypted drive or password manager; never by cloud sync or Git |
| Marker guard | Active here only because `core.hooksPath` is set in this clone's local Git configuration | On the new laptop, restore `local-data/markers.json` and `local-data/fingerprint-key.txt`, run `npm run guard:install` and then `npm run guard:staged`, all before the first commit. Without the markers file, the local bundle scan silently skips |
| Pre-purge backup | `Downloads\BESS-repo-backup-2026-08-10` holds the full repository history from before the 10 August purge | Encrypted drive only, or keep it offline on the old machine |
| Claude Code memory and plans | Project rulings live under `~/.claude/projects/<repository path>/memory/`; approved plans under `~/.claude/plans/` | Copy both. The memory folder is named after the repository path, so place the notes under the new path's folder. Do not copy the global `~/.claude/CLAUDE.md` unchanged; its tool paths describe this machine |
| Rules for other assistants | Codex and ChatGPT cannot see Claude Code memory. `AGENTS.md`, plus a `CLAUDE.md` that imports it, was drafted on branch `claude/agents-md` and pushed on 30 October | Review and merge it before the first session on the new laptop |
| Runtime | CI and ETL pin Node 20, which is past end of life; local is 26.2; no `.nvmrc` | `WP-01` |
| Clone location | The repository sits under Downloads, in a path with spaces | Clone to a short path without spaces |
| Not tied to this machine | GitHub secrets; scheduled Actions (ETL and the weekly digest); no local scheduled tasks | Re-authenticate `gh` and the Vercel CLI only if needed |
| Recovery | Old machine still holds everything above | Keep it until the new clone passes `npm test`, `npm run build` and the guard check |

### Record at handoff

| Field | Value |
| --- | --- |
| Date | |
| HEAD SHA on the old and new machines | |
| Node and npm versions | |
| Tests passed on the new machine | |
| New hardware: CPU, GPU, driver | |
| Open items and next gate | |

### Next-session brief

> Read `docs/immersive-experience-plan/README.md` (v1.1) and `AGENTS.md`. Check `git status` and preserve existing changes. Take the next unmet gate: source the WA hinge claims, then revise the script for `G-1`. Keep teaching state out of the case, bind every figure, and never regenerate fixtures. Return the result, the test evidence and the next gate. Do not publish unless asked.

## 7. Documentation checks

These checks cover the planning pack only; product acceptance is in §3 and §5. The results for v1.1 are recorded in [the master plan](README.md#9-documentation-checks).
