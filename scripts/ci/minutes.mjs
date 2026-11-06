#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   AUTOMATION MINUTES, FOR THE WEEKLY BRIEFING.

   Prints one Markdown section: the GitHub Actions minutes used in the last 7
   and 30 days. The weekly-briefing job in etl.yml appends it to the issue.

   Counted from job durations, not from the billing API. While the repository
   is public its billable minutes read zero, which says nothing about what a
   private repository would pay. GitHub bills each job rounded up to the whole
   minute, so this does the same: sum over every job of ceil(minutes). A
   skipped job has no duration and counts nothing. Re-run attempts are counted,
   because they are billed. Jobs of ci.yml that etl.yml calls are listed under
   the Live data run, so nothing is counted twice.

     GH_TOKEN=… GITHUB_REPOSITORY=owner/repo node scripts/ci/minutes.mjs

   Needs `actions: read`. It reads and prints; it writes nothing.
   --------------------------------------------------------------------------- */
import { pathToFileURL } from 'node:url';

const DAY = 86_400_000;
/* A private repository on the free plan gets this many a month. */
export const FREE_MINUTES = 2000;

/** Whole billed minutes for one job, rounded up as GitHub bills them. */
export function billedMinutes(job){
  const start = Date.parse(job.started_at), end = Date.parse(job.completed_at);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.ceil((end - start) / 60_000);
}

/** Sum jobs that completed inside each window, overall and by workflow. */
export function minutesUsed(jobs, now = Date.now()){
  const out = { d7: 0, d30: 0, byWorkflow: {} };
  for (const job of jobs){
    const end = Date.parse(job.completed_at);
    if (!Number.isFinite(end) || end > now || end <= now - 30 * DAY) continue;
    const minutes = billedMinutes(job);
    out.d30 += minutes;
    if (end > now - 7 * DAY) out.d7 += minutes;
    const name = job.workflow_name || 'other';
    out.byWorkflow[name] = (out.byWorkflow[name] || 0) + minutes;
  }
  return out;
}

const n = (x) => x.toLocaleString('en-GB');

export function renderMinutes({ d7, d30, byWorkflow }){
  const split = Object.entries(byWorkflow).filter(([, m]) => m > 0).sort((a, b) => b[1] - a[1])
    .map(([name, m]) => `${name} ${n(m)}`).join(' · ');
  return [
    '## Automation minutes',
    '',
    `**${n(d7)}** in the last 7 days, **${n(d30)}** in the last 30 (${Math.round(100 * d30 / FREE_MINUTES)}% of the ${n(FREE_MINUTES)} a private repository gets free each month).`
      + (split ? ` Last 30 days by workflow: ${split}.` : ''),
    '',
    'Job time, each job rounded up to the minute as GitHub bills it. Billable minutes read zero while the repository is public.',
    '',
  ].join('\n');
}

export async function fetchJobs({ repo, token, now = Date.now() }){
  /* The run listing is slow (10–20 s a page) and answers 502 now and then, so
     a server error is retried twice before the section is given up. */
  const get = async (path, attempt = 1) => {
    const res = await fetch(`https://api.github.com/repos/${repo}/${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });
    if (res.status >= 500 && attempt < 3){
      await new Promise(r => setTimeout(r, 5000 * attempt));
      return get(path, attempt + 1);
    }
    if (!res.ok) throw new Error(`GitHub ${path.split('?')[0]} failed (${res.status})`);
    return res.json();
  };
  /* A day of margin: a run created 31 days ago can have a job that finished
     inside the window. */
  const since = new Date(now - 31 * DAY).toISOString().slice(0, 10);
  const runs = [];
  for (let page = 1; ; page++){
    const body = await get(`actions/runs?created=%3E%3D${since}&exclude_pull_requests=true&per_page=50&page=${page}`);
    runs.push(...body.workflow_runs);
    if (body.workflow_runs.length < 50) break;
  }
  const jobs = [];
  /* Six requests at a time: well inside the token's rate limit, and a month
     of runs is a few hundred calls. */
  for (let i = 0; i < runs.length; i += 6){
    await Promise.all(runs.slice(i, i + 6).map(async (run) => {
      for (let page = 1; ; page++){
        const body = await get(`actions/runs/${run.id}/jobs?filter=all&per_page=100&page=${page}`);
        jobs.push(...body.jobs.map(j => ({ ...j, workflow_name: run.name, event: run.event })));
        if (body.jobs.length < 100) break;
      }
    }));
  }
  return jobs;
}

async function main(){
  const repo = process.env.GITHUB_REPOSITORY, token = process.env.GH_TOKEN;
  if (!repo || !token) throw new Error('GITHUB_REPOSITORY and GH_TOKEN are required');
  const now = Date.now();
  process.stdout.write(renderMinutes(minutesUsed(await fetchJobs({ repo, token, now }), now)));
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main();
