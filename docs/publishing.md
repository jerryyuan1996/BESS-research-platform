# Publishing this site — a first-time walkthrough

GitHub stores the code and runs the data refresh. Cloudflare Pages builds the site
and serves it. Written for someone who has not done this before; every click is
named.

Budget about 30 minutes. Nothing here costs money.

---

## What you are setting up

```
   your laptop
        │  git push
        ▼
   GitHub repository  ──────────────►  Cloudflare Pages
        │                              builds `npm run build`
        │                              serves dist/ at a public URL
        │
        └── GitHub Actions, every 6 hours
              fetches public market data
              commits it back to the repo
                    │
                    └──► the push triggers a rebuild, so the site updates itself
```

Two things worth understanding before you start, because they explain most of the
steps:

**The repository and the website are separate things.** The repository can be
private while the website is public. Cloudflare reads the private repo, builds it,
and publishes only the built output.

**The data refresh works by committing.** The scheduled job writes JSON into
`public/data/` and pushes it to `main`. Cloudflare sees the push and rebuilds.
That is why `git log public/data` becomes the audit trail for every number — and
why the job needs permission to write to the repo.

---

## Step 0 — Make the repository private. This one matters.

**The confidential WA project layer is still in this repository's git history.**

The current files are clean — it was moved to `local-data/` in commit `49495ab`,
and `tests/bundle-confidentiality.test.js` proves it never reaches the built site.
But git keeps history, and the earlier commit still contains it:

```bash
git show f7793c5:src/markets/wa/data/kemerton.js
```

That will print the site address, the financial-model capex and the Google Drive
links. Anyone who can read the repository can run that command.

So:

> **Create the GitHub repository as Private.** The published website is public
> either way; only the source history is protected.

Cloudflare Pages works with private repositories at no cost, so there is no
trade-off to weigh here.

<details>
<summary>If you later need the repository to be public</summary>

You would have to rewrite history to purge those commits — `git filter-repo`, or
starting a fresh repository with a single initial commit from the current clean
tree. Both are irreversible and both break every existing clone. Do not attempt it
as a first task. Keeping the repository private is the correct answer for a
research platform with a data room behind it.
</details>

**Also back up `local-data/` somewhere else.** It is git-ignored, which means it is
now the only copy outside history. If you lose that folder you lose the confidential
Portfolio analysis. Put it in the same place you keep the source documents it came
from.

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

Refresh the GitHub page. You should see the files, and `local-data/` should **not**
be among them — only its `README.md`. If you see `wa-kemerton-project.json` or
`wa-portfolio-section.js` on GitHub, stop and tell me: something is wrong with the
`.gitignore` and those files should not be there.

---

## Step 2 — Connect Cloudflare Pages

**Cloudflare does not build this site, and must not be connected to Git.**

That is the opposite of the usual Pages setup, so it is worth stating why. If
Cloudflare builds from a Git connection, it builds on *every* push to `main` and
does not wait for GitHub Actions. The confidentiality scan, the snapshot
verifier and the whole test suite would run beside the deployment rather than in
front of it, and a red CI run would publish anyway. The ETL bot pushes to `main`
every six hours, so that is not a rare edge case — it is the normal path.

Instead, `.github/workflows/ci.yml` runs the checks, and only if they all pass
does it upload the built `dist/` and hand those exact bytes to
`wrangler pages deploy`. The artefact that was scanned is the artefact that
ships.

### 2a — Create the project without a Git connection

1. Sign in at [dash.cloudflare.com](https://dash.cloudflare.com) (create a free
   account if you need one — no card required).
2. In the left sidebar: **Workers & Pages** → **Create** → **Pages** tab →
   **Upload assets** (*not* "Connect to Git").
3. Name the project `bess-research-platform`. The name is not cosmetic — it is
   the `--project-name` in the workflow, it becomes part of the URL, and
   changing one without the other breaks the deploy.
4. Upload anything to create the project — the first real deployment from CI
   replaces it. A folder containing an empty `index.html` is enough.

> **Already connected to Git from an earlier setup?** Go to the project →
> **Settings** → **Build** → **Git repository** → **Disconnect**. Leaving it
> connected gives you two deployments per push: one gated, one not, racing each
> other onto the same URL. The ungated one wins about half the time.

You do not need a build command, a build output directory, or `NODE_VERSION`
here. Those are GitHub Actions' problem now, and it already pins Node 20.

### 2b — Create the API token

1. Cloudflare dashboard → your profile → **API Tokens** → **Create Token**.
2. Use the **Edit Cloudflare Workers** template, or a custom token with
   **Account → Cloudflare Pages → Edit**. Nothing more: this token only needs to
   publish a static site.
3. Copy the token — it is shown once.
4. Copy your **Account ID** too, from **Workers & Pages** → the right-hand
   sidebar.

### 2c — Give them to GitHub

In the repository: **Settings** → **Secrets and variables** → **Actions** →
**New repository secret**. Add both:

| Name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | the token from 2b |
| `CLOUDFLARE_ACCOUNT_ID` | your account ID |

The deploy job checks for both before it does anything and fails with a pointed
message if either is missing, so a half-finished setup cannot look like a
successful publish.

Push to `main`. Actions runs the suite, builds, scans the bundle, verifies the
snapshots, and publishes. The first deployment takes two or three minutes and
gives you a URL like `https://bess-research-platform.pages.dev`.

---

## Step 3 — Check the site

Open the URL and confirm:

- [ ] The home page renders with the market grid and the league table
- [ ] Click into a market — say Great Britain — and its tabs work
- [ ] **Refresh the page while on `/markets/great-britain`.** It should reload
      normally, not 404. This is what `public/_redirects` is for; if it 404s, that
      file did not make it into `dist/`
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
variable and never reaches the browser — do **not** add it to Cloudflare.

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
- Cloudflare starting a fresh deploy on its own, because of that commit.

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

1. Cloudflare Pages → your project → **Custom domains** → **Set up a custom
   domain**.
2. Enter it. If the domain's DNS is already on Cloudflare, it configures itself.
   If not, Cloudflare shows you the CNAME record to add at your registrar.
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
| Two deployments per push, or an unreviewed change reaching the live site | The Cloudflare Git connection is still enabled and building in parallel with CI. Project → Settings → Build → **Disconnect**. Step 2a |
| Deploy job fails immediately with a message about credentials | `CLOUDFLARE_API_TOKEN` or `CLOUDFLARE_ACCOUNT_ID` is missing or misspelled. Step 2c |
| Deploy succeeds but the live URL is unchanged | The deployment landed on a preview branch. `--branch=main` in `ci.yml` must match the Pages production branch |
| `wrangler` reports the project does not exist | The Pages project name is not `bess-research-platform`. Rename it, or change `--project-name` in `ci.yml` — they have to agree |
| Deep links 404 on refresh, home page fine | `public/_redirects` did not reach `dist/`. Confirm the build output directory is `dist`, not `dist/` or `./dist` |
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
| Cloudflare Pages | free tier covers 500 builds/month and unlimited bandwidth; six-hourly data commits produce well under 200 |
| Data sources | ECB, ENTSO-E, AEMO and JEPX are all free public data |

---

## Related

- [`governance.md`](governance.md) — what automation may change, and anchors
- [`live-data.md`](live-data.md) — the pipeline, its sources and how to operate it
- [`data-policy.md`](data-policy.md) — public vs confidential, and why sourcemaps are off
