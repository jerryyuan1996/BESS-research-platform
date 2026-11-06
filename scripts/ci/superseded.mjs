#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   IS THIS CANDIDATE STILL THE HEAD OF MAIN?

   When two merges land on main minutes apart, both runs used to test for ten
   minutes and both deploy jobs queued for the release lock — and the release
   script then refused the older one, because a candidate that is not main's
   head is never published (scripts/lib/production-release.mjs). The older
   run's test minutes bought nothing.

   This asks the question the release script will ask, earlier. If the
   candidate is no longer main's head, it can never be published: main only
   moves forward (AGENTS.md forbids force-pushing), so a commit that has been
   passed stays passed. The test job then skips its remaining gates and the
   deploy job does not start. The newer commit's own run tests and publishes
   it, and that commit contains this one.

   Why not `concurrency: cancel-in-progress` on main: GitHub queues runs in the
   order they are created, not in commit order. A run created late for an
   older commit would cancel the newer commit's tests, and then the older
   deploy would be refused as superseded — nothing would publish. This check
   reads main's head instead of trusting arrival order, so a late run can only
   skip itself.

   Only a run that could deploy is ever skipped: main, and the events the
   deploy job allows. A pull request, or a run dispatched on another branch,
   always runs every gate. If GitHub cannot be read, the answer is "not
   superseded" and every gate runs — the safe direction.

   Writes `superseded=true|false` to $GITHUB_OUTPUT and SUPERSEDED to
   $GITHUB_ENV, so later steps can test `env.SUPERSEDED`.
   --------------------------------------------------------------------------- */
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/* The same allowlist as the deploy job's `if:` in ci.yml. When etl.yml calls
   ci.yml, github.event_name and github.ref are the caller's. */
export const DEPLOYING_EVENTS = ['push', 'schedule', 'workflow_dispatch'];

/** @returns {Promise<{superseded: boolean, head?: string, reason: string}>} */
export async function supersededCheck({ candidate, ref, event, readMain }){
  if (ref !== 'refs/heads/main' || !DEPLOYING_EVENTS.includes(event)){
    return { superseded: false, reason: 'not a run that deploys' };
  }
  if (!/^[a-f0-9]{40}$/.test(candidate || '')) return { superseded: false, reason: 'no full candidate SHA' };
  let head;
  try { head = await readMain(); }
  catch (error){ return { superseded: false, reason: `main could not be read (${error.message}); running every gate` }; }
  if (!/^[a-f0-9]{40}$/.test(head || '')) return { superseded: false, reason: 'main could not be read; running every gate' };
  if (head === candidate) return { superseded: false, head, reason: 'the candidate is main\'s head' };
  return { superseded: true, head, reason: `main has moved on to ${head.slice(0, 7)}; its own run tests and publishes it` };
}

async function main(){
  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GH_TOKEN;
  const readMain = async () => {
    const res = await fetch(`https://api.github.com/repos/${repo}/git/ref/heads/main`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).object?.sha;
  };
  const result = await supersededCheck({
    candidate: process.env.CANDIDATE, ref: process.env.GITHUB_REF, event: process.env.GITHUB_EVENT_NAME, readMain,
  });
  const value = result.superseded ? 'true' : 'false';
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `superseded=${value}\n`);
  if (process.env.GITHUB_ENV) appendFileSync(process.env.GITHUB_ENV, `SUPERSEDED=${value}\n`);
  console.log(result.superseded
    ? `::notice title=Superseded::${(process.env.CANDIDATE || '').slice(0, 7)} is no longer main's head: ${result.reason}. The remaining gates and the deploy are skipped.`
    : `Not superseded: ${result.reason}.`);
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main();
