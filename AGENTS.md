# AGENTS.md

Rules for any AI assistant working in this repository: Codex, ChatGPT, Claude Code or another. They apply on every machine. Where a rule here and the topic's document under `docs/` disagree, the document wins. If neither settles it, ask the analyst, who owns the repository and makes every investment judgement.

## What this is

A battery-storage (BESS) investment research platform: a static Vite site (native ES modules, D3/SVG, no framework) with an investment model, ETL data snapshots and an investment brief across 18 markets. It is personal, non-commercial study, deployed publicly.

## Confidentiality: read this first

- `local-data/` is git-ignored. It holds confidential and licence-restricted material, including `markers.json`, the list of confidential terms. Never copy anything from it into a tracked file, a test fixture, the built site, a commit message, a PR title or body, or a branch name. Automation never reads it.
- Before writing any project, company or deal name anywhere, check it against `local-data/markers.json`. The guards scan staged files and the built output; nothing scans commit messages, PR text or branch names.
- The customer company named on the published supplier quote, and that quote's number, are not in the marker set. They must never be written anywhere either.
- On a new clone, restore `local-data/markers.json` and `local-data/fingerprint-key.txt`, run `npm run guard:install` to enable the pre-commit scan, and confirm it with `npm run guard:staged` before the first commit. A guard that cannot scan blocks the commit, and a skipped bundle scan is not a pass.
- Everything shipped to the browser is public, including unlinked files and source maps. See `docs/data-policy.md`.
- The repository stays private. Never make it public, add collaborators or rewrite history without the analyst. If content redaction is ever run, restore `tests/bundle-confidentiality.test.js` and `docs/data-policy.md` afterwards.
- A history rewrite does not reach everything. GitHub keeps every pull request's commits as they were, and content redaction does not change commit messages. Before any visibility change or new collaborator, GitHub Support must first purge old pull-request references and unreachable objects, and old commit messages must be checked against the marker set.

## Numbers and the model

- Never regenerate a fixture to make a change pass. `npm run test:baseline` rewrites `tests/fixtures/legacy-baseline.json` and is not a check; `npm run test:current` is.
- A change that moves published numbers in more than one market needs a written plan first: each proposed value with its source and arithmetic, then the analyst's explicit sign-off before any code. Small single-market data refreshes do not.
- Scoring weights and discount rates are set by the analyst only.
- Financing conventions, merchant-line rules and other analyst rulings are recorded in the dated plans under `docs/`. Treat them as settled unless the analyst reopens them.
- Figures taken from a private-use source must be recomputed from a public primary source before they are published as observed. Licence-restricted reports stay in `local-data/`; the site cites the primary sources they name.

## Automation and release

- The ETL refreshes public data once daily (06:17 UTC), in the same logical cycle as deterministic Policy Intelligence discovery, and commits validated snapshots to `main`. The analyst approved this cadence change on 2026-11-05. Policy model calls/publication remain disabled pending concrete authorization. That history is the audit trail: never rewrite or regenerate snapshots to hide a difference.
- Agent and scout model analysis is explicit dispatch only, never part of an ordinary refresh. Daily observed-data ETL, weekly briefing and monthly digest retain their schedules. Do not add automatic strategy analysis or publication.
- Observations publish automatically after validation; judgement and strategy are analyst-only. Rules report crossings without writes. Use read-only view-store capabilities for automation. See `docs/governance.md`.
- GitHub Actions builds the site, scans the exact output and deploys it to Vercel with `--prebuilt`. Vercel is not connected to Git. Never deploy around this pipeline; see `docs/publishing.md`.
- Automation minutes are a budget: keep GitHub Actions under 2,000 minutes a month. Pull-request checks run the fast gates and a smoke suite; the full browser suite runs on `main` before every deploy, and on a pull request only when it carries the `full-check` label. See `docs/ci-performance.md`.

## Writing for the site

- Conclusion first: the call, its numbers and the next action. Express uncertainty as one evidence marker (Strong, Fair or Thin) plus "what would change it". No disclaimer bands and no caveat paragraphs.
- English and Simplified Chinese everywhere on the site, with the same meaning.
- Never type a model figure into prose; read it from the model's result fields.

## Working practice

- Work on a branch, not on `main`. Commit or push only when the analyst asks.
- Preserve work you did not make. Never reset, clean or force-push.
- One pull request per feature or market release. Do not split one release into a chain of pull requests: each one pays for a check, a second check on `main` and a deploy. Keep unfinished work as a draft, which runs no checks.
- Run the checks locally before pushing. Local runs cost no automation minutes; push when the work is ready, not after every step.
- One AI tool per area at a time. Before starting, check open pull requests and branches for work on the same files, and continue that work rather than starting a parallel copy.
- Every pull request body opens with three plain-English lines for the analyst, who does not read code: **What changes on the site**, **Cost or risk**, **Decision needed**. No internal codes (gate, work-package or decision IDs) in those lines.
- One decision log per topic, updated in place. Do not add a new storyboard, build-evidence, release or reuse document for each pull request; the pull request body is the record of a change.
- Before a PR, run `npm test`, `npm run test:current`, `npm run build`, `npm run test:budget` and `npm run test:e2e`, plus `npm run etl:verify` after any data or dataset change. CI repeats them with the confidentiality secrets.
- To show the site to anyone, use the built output (`npm run build`, then `npm run preview`). Never share the dev server: it can load local confidential material.

## Where things are

| Topic | Document |
| --- | --- |
| What automation may change | `docs/governance.md` |
| The public and confidential boundary | `docs/data-policy.md` |
| Release and rollback | `docs/publishing.md` |
| Feeds and snapshots | `docs/live-data.md` |
| Registering a market | `docs/adding-a-market.md` |
| What belongs in `local-data/` | `local-data/README.md` |
| The market-story plan | `docs/immersive-experience-plan/README.md` |
