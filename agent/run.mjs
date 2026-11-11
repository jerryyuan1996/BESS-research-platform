#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   THE AGENT'S EXPLICITLY DISPATCHED PASS — the program the workflow runs.

   agent/core.mjs is the agent. This file gives it the two things it needs
   from the outside world, a way to fetch a page and a way to ask the model,
   and writes its report under etl/out/.

   IT RUNS IN CI AND NOWHERE ELSE. The agent must never be able to see the
   analyst's private notes, and the surest way to arrange that is for it to run
   only where they do not exist. So this refuses to start unless it is inside a
   GitHub Actions job, and the workflow step that starts it first checks that
   no private folder is present in the checkout. Nothing in this directory
   names that folder or has a path to it; tests/view.test.js asserts so.

   IT NEEDS A KEY, AND WITHOUT ONE IT DOES NOTHING. The model credential is a
   repository secret. With no secret set the step is skipped by the workflow,
   and if this program is started without one anyway it says so and exits
   cleanly, having fetched nothing and asked nothing.

   BOTH PASSES RECEIVE A READ-ONLY STORE AND WRITE ONLY REPORTS.
   They have no scheduled trigger and no capability to apply a strategy.

   Usage (explicit workflow dispatch only):
     node agent/run.mjs                      report on due core-market triggers
     node agent/run.mjs --scout [region]     report on the selected scout region
   --------------------------------------------------------------------------- */
import { pathToFileURL } from 'node:url';

import { createReadOnlyViewStore, writeRunReport } from '../etl/lib/viewWriter.mjs';
import { runAgent, renderAgentReport } from './core.mjs';
import { PROMPT_VERSION, MODEL } from './prompt.mjs';
import { runScoutPass, renderScoutReport, robotsAllows, AGENT_TOKEN } from './scout.mjs';
import { SCOUT_REGION_IDS } from '../src/governance/scout.js';

/** A market's source register, or null when it has none. */
async function registers(marketId){
  try { return (await import(`../src/markets/${marketId.replace(/_/g, '-')}/sources.js`)).SRC ?? null; }
  catch { return null; }
}

/* A plain HTTPS GET with a time limit. No cookies, no credentials, no
   redirects to another scheme: the agent reads public pages as a stranger. */
async function fetchPage(url){
  if (!/^https:\/\//.test(url)) throw new Error('not an https link');
  const response = await fetch(url, {
    redirect: 'follow', signal: AbortSignal.timeout(20_000),
    headers: { 'user-agent': `${AGENT_TOKEN} agent (personal study; reads cited public pages)`, accept: 'text/html,text/plain' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (!/^https:\/\//.test(response.url)) throw new Error('redirected off https');
  const type = response.headers.get('content-type') || '';
  if (!/text\/|html|xml/.test(type)) throw new Error(`not a text page (${type || 'no content type'})`);
  return { body: await response.text() };
}

/* Does the site's robots file allow this page? Read once per site. A site
   with no robots file allows; one that cannot be reached is not assumed to. */
const robotsFiles = new Map();
async function robots(url){
  const { origin, pathname, search } = new URL(url);
  if (!robotsFiles.has(origin)){
    robotsFiles.set(origin, (async () => {
      const response = await fetch(`${origin}/robots.txt`, {
        redirect: 'follow', signal: AbortSignal.timeout(20_000), headers: { 'user-agent': `${AGENT_TOKEN} agent (personal study)` },
      });
      if (response.status === 404 || response.status === 410) return '';
      if (!response.ok) throw new Error(`robots file: HTTP ${response.status}`);
      return response.text();
    })());
  }
  return robotsAllows(await robotsFiles.get(origin), pathname + search);
}

/* The regions a scout run covers: the one named, or every region in roster
   order. The scheduled run names none, so once a month it covers them all. */
function scoutRegions(named){
  const region = named || process.env.SCOUT_REGION;
  if (!region) return [...SCOUT_REGION_IDS];
  if (!SCOUT_REGION_IDS.includes(region)){
    console.error(`"${region}" is not a scout region. Name one of: ${SCOUT_REGION_IDS.join(', ')}.`);
    process.exit(2);
  }
  return [region];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href){
  if (process.env.GITHUB_ACTIONS !== 'true'){
    console.error('The agent runs in CI only. It is not run on a developer\'s machine.');
    process.exit(2);
  }
  const scout = process.argv[2] === '--scout';
  if (!process.env.ANTHROPIC_API_KEY){
    const idle = `## Agent — ${new Date().toISOString()}\n\nNo model key is configured. Nothing was fetched and nothing was evaluated.\n`;
    console.log(idle);
    await writeRunReport(scout ? 'scout-report.md' : 'agent-report.md', idle);
    process.exit(0);
  }

  const { askModel } = await import('./model.mjs');
  if (scout){
    /* One pass a region, each through a fresh store so it reads what the pass
       before it wrote. The report keeps `region` and `pass.written` at the top
       for the workflow's commit message, and every pass in full beneath. */
    const passes = [];
    for (const region of scoutRegions(process.argv[3])){
      passes.push(await runScoutPass({ store: createReadOnlyViewStore(), region, fetchPage, robots, askModel }));
    }
    const report = passes.map(renderScoutReport).join('\n\n');
    console.log(report);
    await writeRunReport('scout-report.md', `${report}\n`);
    const summary = {
      region: passes.map(p => p.region).join(', '),
      pass: { written: passes.reduce((n, p) => n + (p.pass?.written ?? 0), 0) },
      passes,
    };
    await writeRunReport('scout-report.json', `${JSON.stringify(summary, null, 2)}\n`);
    process.exit(0);
  }
  const result = await runAgent({ store: createReadOnlyViewStore(), registers, fetchPage, askModel });
  const report = renderAgentReport(result);
  console.log(report);
  await writeRunReport('agent-report.md', `${report}\n`);
  await writeRunReport('agent-report.json', `${JSON.stringify({ ...result, prompt: PROMPT_VERSION, model: MODEL }, null, 2)}\n`);
}
