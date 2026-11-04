# Publishing this site — a first-time walkthrough

GitHub stores the code, runs the data refresh, and publishes the site. Vercel
serves it. Written for someone who has not done this before; every click is named.

Budget about 30 minutes. Nothing here costs money.

---

## What you are setting up

```
   your laptop
        │  git push
        ▼
   GitHub repository
        │
        ├── GitHub Actions, on every push to main
        │     npm test  ·  build  ·  scan  ·  etl:verify  ·  full browser suite
        │           │
        │           └──► vercel build → scan .vercel/output → deploy --prebuilt
        │                                                          │
        │                                                          ▼
        │                                                       Vercel
        │                                            smoke check on the live URL
        │
        └── GitHub Actions, every 6 hours
              fetches public market data
              commits it back to the repo
                    │
                    └──► then calls the same workflow on that commit — the gates
                         run again and the site updates itself. Skipped when no
                         data changed.
```

> **The last arrow used to read "that push runs the gates again", and it never
> did.** The ETL pushes with the workflow's built-in `GITHUB_TOKEN`, and GitHub
> starts no workflow for a push made with that token — the rule that stops a
> workflow from triggering itself forever. From 2026-08-20 to 2026-10-09 `main`
> took a data commit every six hours while the site served the snapshot from the
> last human merge, and every run involved was green.
>
> `etl.yml` now has a `publish` job that calls `ci.yml` directly, on the exact
> commit it pushed. Same test job, same scan of `.vercel/output`, same
> `--prebuilt` deploy; no extra token.

Three things worth understanding before you start, because they explain most of
the steps:

**The repository and the website are separate things.** The repository is private;
the website is public. Only the built output is published.

**Vercel does not build this site.** GitHub Actions builds the artefact, scans it,
and uploads the result with `--prebuilt`. This is deliberate — see Step 2.

> **This page used to say Vercel "is not connected to Git", and on 2026-08-17 that
> stopped being true.** A pull request drew two `vercel[bot]` Preview deployments,
> the first of them built and published three minutes *before* CI started and
> while the run was red — a build from source, on Vercel's infrastructure,
> producing bytes no scan in the workflow had ever seen. Nothing leaked: the
> previews were behind Vercel Authentication and the content passes every scan.
> The mechanism was the problem, not the outcome.
>
> `vercel.json` now sets `git.deploymentEnabled: false`, which refuses
> Git-triggered builds from inside the repository, where the setting is
> reviewable and travels with the commit. **The dashboard disconnect in Step 2a is
> still worth doing** — a project setting cannot be reverted by editing a file,
> and two controls for something this load-bearing is the right number.
>
> The lesson for this document: a claim about infrastructure decays silently.
> This one had been false for some unknown period before a bot comment made it
> visible.

**The data refresh works by committing.** The scheduled job writes JSON into
`public/data/` and pushes it to `main`. That push re-runs every gate and, if they
pass, redeploys. That is why `git log public/data` is the audit trail for every
number — and why the job needs permission to write to the repo.

---

## Step 0 — Keep the repository private. This one still matters.

The confidential WA project layer **was** in this repository's git history. It was
purged on 10 August 2026 with `git filter-repo`: the two prototype documents that
carried it were removed from every commit, and the markers were redacted
everywhere else they appeared. `legacy/README.md` records what went and why.

So the argument for privacy has changed, but the answer has not:

> **Keep the GitHub repository Private.** The published website is public either
> way; only the source is protected.

The rewrite changed *this* repository. It could not change:

- any clone or fork taken before that date, which still has the original objects;
- old pull requests and their diffs;
- GitHub's own unreferenced objects, which stay reachable by commit SHA until
  GitHub garbage-collects them — that needs a support request, not a push.

Vercel works with private repositories at no cost, and in this setup it does not
read the repository at all, so there is no trade-off to weigh here.

**Also back up `local-data/` somewhere else.** It is git-ignored, which means it is
now the only copy anywhere — history included. If you lose that folder you lose the
confidential Portfolio analysis and the archived prototype. Put it in the same
place you keep the source documents it came from.

---

## Step 1 — Push to GitHub

### 1a. Create the repository

1. Go to [github.com/new](https://github.com/new).
2. **Repository name:** `bess-research-platform` (or anything you like).
3. **Visibility:** **Private** — see Step 0.
4. Do **not** tick "Add a README", "Add .gitignore" or "Choose a licence". This
   repository already has all three, and pre-filling them creates a conflict you
   would then have to untangle.
5. **Create repository**.

GitHub shows you a page headed "push an existing repository from the command
line". You want the two commands on it, which are the ones below.

### 1b. Push

In a terminal, in the project folder:

```bash
git remote add origin https://github.com/YOUR-USERNAME/bess-research-platform.git
```

```bash
git push -u origin main
```

Replace `YOUR-USERNAME`. The first push asks you to sign in — on Windows, Git
Credential Manager opens a browser window; approve it there and it will not ask
again.

If it says `remote origin already exists`, you have run the first command before.
Use this instead:

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/bess-research-platform.git
```

### 1c. Check what landed

Refresh the GitHub page. Three things should be true:

- `local-data/` is absent apart from its `README.md`;
- `.vercel/` is absent entirely — it holds your project link, not shared config;
- `deliverables/` shows only `_comparison_system/`, never a named project folder.

If you see `wa-kemerton-project.json`, `wa-portfolio-section.js`, a `.vercel`
directory or a project comparison, stop: something is wrong with `.gitignore` and
none of those belong on a remote.

---

## Step 2 — Connect Vercel

**Vercel does not build this site, and must not be connected to Git.**

That is the opposite of the usual Vercel setup, so it is worth stating why. A Git
integration builds on *every* push to `main` and does not wait for GitHub Actions.
The confidentiality scan, the snapshot verifier and the whole test suite would run
beside the deployment rather than in front of it, and a red CI run would publish
anyway. The ETL bot pushes to `main` every six hours, so that is not a rare edge
case — it is the normal path. Branch protection would not help either: the bot
pushes directly, not through a pull request.

(Those bot pushes do not start GitHub Actions by themselves — see the note under
the diagram above. A Git integration on Vercel's side would see them regardless,
which is exactly why it must stay off.)

Instead, `.github/workflows/ci.yml` runs the checks, then builds `.vercel/output`
itself, scans **that directory**, and uploads it with
`vercel deploy --prebuilt --prod`. The artefact that was scanned is the artefact
that ships, with no rebuild in between.

### 2a — Create and link the project, without a Git connection

1. Sign in at [vercel.com](https://vercel.com) (the Hobby plan is free).
2. Create a new project named `bess-research-platform`. When it offers to import
   a Git repository, **skip it** — choose the option to create the project
   without one, or create it from the CLI in step 3 below.
3. In the project folder on your laptop:

   ```bash
   npx vercel link
   ```

   Pick the project you just created. This writes `.vercel/` locally and adds
   `.vercel` to `.gitignore`. That folder is never committed: it identifies your
   link to the project, not shared configuration.

> **Already connected to Git from an earlier setup?** Project → **Settings** →
> **Git** → **Disconnect**. Leaving it connected gives you two deployments per
> push: one gated, one not, racing each other onto the same URL. The ungated one
> wins about half the time.

You do not need to set a build command, an output directory, or a Node version in
the Vercel dashboard. `vercel.json` carries the build settings and the SPA
rewrite, and GitHub Actions takes its Node version from the repository's
`.nvmrc`.

### 2b — Create the token and find the two IDs

1. Vercel → your avatar → **Account Settings** → **Tokens** → **Create Token**.
   Scope it to the team that owns the project. Copy it — it is shown once.
2. Open `.vercel/repo.json` (or `.vercel/project.json`, depending on how you
   linked). It contains the project id (`prj_…`) and the org/team id (`team_…`).
   Those two are identifiers rather than credentials, but the workflow reads them
   from secrets so that nothing about your Vercel account is committed.

### 2c — Give them to GitHub

In the repository: **Settings** → **Secrets and variables** → **Actions** →
**New repository secret**. Add all three:

| Name | Value |
|---|---|
| `VERCEL_TOKEN` | the token from 2b |
| `VERCEL_ORG_ID` | the `team_…` id |
| `VERCEL_PROJECT_ID` | the `prj_…` id |

The deploy job checks for all three before it does anything and names the missing
ones, so a half-finished setup cannot look like a successful publish.

Push to `main`. Actions runs the suite, verifies the snapshots, builds
`.vercel/output`, scans it, and deploys. The first deployment takes two or three
minutes and gives you a URL. This project's production alias is
`https://globalbess.vercel.app`.

---

## Step 3 — Check the site

Open the URL and confirm:

- [ ] The home page renders with the market grid and the league table
- [ ] Click into a market — say Great Britain — and its tabs work
- [ ] **Refresh the page while on `/markets/great-britain`.** It should reload
      normally, not 404. This is what the `rewrites` rule in `vercel.json` is for
- [ ] Open an asset directly — the `/assets/index-*.js` the page loads. It must
      return JavaScript, not the HTML shell. If it returns HTML, the rewrite is
      running before the filesystem check instead of after it
- [ ] Visit `/data`. Every feed should be listed. At this point most will say
      *Not published* — that is correct, the pipeline has not run yet
- [ ] Visit `/markets/western-australia/portfolio`. It should say **"Project layer
      withheld"**. If you see the project name or the site address, stop — the
      confidential layer has leaked into the build

That last check is the one to take seriously. It is the same thing
`npm run build && node --test tests/bundle-confidentiality.test.js` asserts
locally, but seeing it on the live site is worth thirty seconds.

---

## Step 4 — Let the scheduled job write to the repository

The data refresh commits to `main` and opens pull requests. New repositories do
not allow that by default, and the failure looks like a permissions error deep in
a log, so set it now.

1. On GitHub: your repository → **Settings** → **Actions** → **General**.
2. Scroll to **Workflow permissions**.
3. Select **Read and write permissions**.
4. Tick **Allow GitHub Actions to create and approve pull requests**.
5. **Save**.

> The second tickbox only lets Actions *open* a pull request. It cannot merge one —
> and `tests/governance.test.js` asserts the workflow contains no auto-merge
> mechanism, so a proposal always waits for you.

---

## Step 5 — Add the ENTSO-E token (optional, enables four markets)

Without this, five feeds work (ECB FX, WA, and the three Japanese areas) and the
four ENTSO-E markets — GB, Ireland, Romania, Poland — show as unconfigured on
`/data`. Everything else is unaffected. You can skip this and come back.

1. Register at [transparency.entsoe.eu](https://transparency.entsoe.eu/).
2. **Email their service desk and ask for API access on your account.** This is
   the part that surprises people: registering does not grant API access, and the
   token silently returns nothing until they enable it. Allow a couple of days.
3. Once enabled, generate the token in your account settings.
4. On GitHub: **Settings** → **Secrets and variables** → **Actions** → **New
   repository secret**.
   - **Name:** `ENTSOE_TOKEN`
   - **Secret:** the token
5. **Add secret**.

The token is only ever read by the ETL inside GitHub Actions. It is not a build
variable and never reaches the browser — do **not** add it to Vercel.

---

## Step 6 — Run the pipeline once, by hand

Do not wait six hours to find out whether it works.

1. GitHub → **Actions** tab.
2. If you see a banner asking you to enable workflows, click to enable them.
3. Left sidebar → **Live data** → **Run workflow** → leave the input blank →
   **Run workflow**.

It takes a few minutes. What you should see:

- A **Fetch, validate, publish** job that succeeds.
- A step called **Check the wall held** confirming only `public/data/` changed.
- A new commit on `main` named something like `data: refresh fx-ecb, wa-wem-prices, …`.
- The **drift report** printed at the bottom of the run summary page.
- In the **same run**, a **Test and publish the data commit** group: every gate
  re-run on that commit and, if they pass, a redeploy. It does not appear as a
  separate run under **CI** — the bot's push starts nothing by itself, so this
  workflow calls CI directly. If no data changed, the group shows as skipped.

Then reload `/data` on the live site. Feeds should show coverage, point counts and
a green **Live** badge.

### Expect this on the first run

- **WA's window is short.** Backfill is capped at 45 days per run to be polite to
  AEMO's servers, so a full trailing year takes about a week of scheduled runs.
  This is intended and `/data` shows the real coverage.
- **The drift report says "no approved anchor"** for each market. Also intended —
  see the anchors section of [`governance.md`](governance.md). Do not set anchors
  until the windows have filled, or you will be measuring the season rather than
  the market.
- **FX shows as drifted.** Your approved rates are from July 2026 seeds and ECB has
  moved 4–6% since. It will be reported, not turned into a pull request, which is
  the materiality rule working as designed.

---

## Step 7 — A custom domain (optional)

If you own a domain:

1. Vercel → your project → **Settings** → **Domains** → **Add**.
2. Enter it. Vercel shows the A or CNAME record to add at your registrar, and
   verifies once it resolves.
3. HTTPS is issued automatically. Allow a few minutes.

---

## From now on

You do not need to do anything for the site to stay current.

| What happens | When |
|---|---|
| Data refresh, validate, publish, rebuild | every 6 hours, automatically |
| A pull request proposing an assumption change | only when drift is material |
| Tests and the confidentiality scan | on every push and pull request |

**When you change the research yourself** — an assumption, a thesis, a new market:

```bash
npm test
```

```bash
git add -A && git commit -m "describe the change" && git push
```

CI runs every gate, and publishes only if they all pass. If a test fails, nothing
is deployed and the live site keeps serving the last artefact that did pass —
you get a red run, not a broken site.

**One scheduling quirk to know:** GitHub disables scheduled workflows in a
repository with no activity for 60 days, and emails you when it does. The data
commits count as activity, so in practice this will not happen — but if the site
ever goes quiet for a couple of months, check the Actions tab first.

---

## When something goes wrong

| Symptom | Cause and fix |
|---|---|
| Two deployments per push, or an unreviewed change reaching the live site | The Vercel Git integration is still enabled and building in parallel with CI. Project → Settings → Git → **Disconnect**. Step 2a |
| Deploy job fails immediately naming a missing secret | One of `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` is unset or misspelled. Step 2c |
| Deploy succeeds but the live URL is unchanged | The `--prod` flag is missing from `vercel deploy`, so it published a preview |
| `vercel` reports the project does not exist, or 403s | `VERCEL_PROJECT_ID` / `VERCEL_ORG_ID` do not match the token's team. All three come from the same account |
| Deployed content differs from what CI scanned | `--prebuilt` was dropped from `vercel deploy`, so Vercel rebuilt from source. Restore it |
| Deep links 404 on refresh, home page fine | The `rewrites` rule in `vercel.json` is missing or malformed |
| Every page returns the HTML shell, assets included | A `routes` entry is overriding `rewrites` and running before the filesystem check. Use `rewrites`, which runs after it |
| Actions run fails at the commit step | Workflow permissions are still read-only. Step 4 |
| No pull request appears despite material drift | "Allow GitHub Actions to create and approve pull requests" is unticked. Step 4 |
| `/data` shows ENTSO-E feeds as *credential may not be configured* | `ENTSOE_TOKEN` missing, or API access not yet enabled on your ENTSO-E account. Step 5 |
| A feed says *Stale — not current* | That source has not published inside its declared window. Check the run summary; the previous snapshot is deliberately kept rather than replaced with something wrong |
| CI fails on `bundle-confidentiality` | Confidential content reached the build. Read the test's failure message — it names the file and the marker |
| A run says `refusing to publish; confirm the source's units` | The upstream source changed units. This is the guard working. Verify at the source before overriding |

---

## What this costs

Nothing, at this scale.

| | |
|---|---|
| GitHub | private repositories and Actions are free; this uses a few minutes of the monthly allowance |
| Vercel | Hobby plan covers this comfortably; CI does the building, so no Vercel build minutes are consumed at all |
| Data sources | ECB, ENTSO-E, AEMO and JEPX are all free public data |

---

## Related

- [`governance.md`](governance.md) — what automation may change, and anchors
- [`live-data.md`](live-data.md) — the pipeline, its sources and how to operate it
- [`data-policy.md`](data-policy.md) — public vs confidential, and why sourcemaps are off
