#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   THE AGENT'S DAILY PASS — the program the workflow runs.

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

   IT WRITES NOTHING TO THE VIEW. See agent/core.mjs.

   Usage (in the workflow):  node agent/run.mjs
   --------------------------------------------------------------------------- */
import { pathToFileURL } from 'node:url';

import { createViewStore, writeRunReport } from '../etl/lib/viewWriter.mjs';
import { runAgent, renderAgentReport } from './core.mjs';
import { PROMPT_VERSION, MODEL } from './prompt.mjs';

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
    headers: { 'user-agent': 'bess-research-platform agent (personal study; reads cited public pages)', accept: 'text/html,text/plain' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (!/^https:\/\//.test(response.url)) throw new Error('redirected off https');
  const type = response.headers.get('content-type') || '';
  if (!/text\/|html|xml/.test(type)) throw new Error(`not a text page (${type || 'no content type'})`);
  return { body: await response.text() };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href){
  if (process.env.GITHUB_ACTIONS !== 'true'){
    console.error('The agent runs in CI only. It is not run on a developer\'s machine.');
    process.exit(2);
  }
  if (!process.env.ANTHROPIC_API_KEY){
    const idle = `## Agent — ${new Date().toISOString()}\n\nNo model key is configured. Nothing was fetched and nothing was evaluated.\n`;
    console.log(idle);
    await writeRunReport('agent-report.md', idle);
    process.exit(0);
  }

  const { askModel } = await import('./model.mjs');
  const result = await runAgent({ store: createViewStore(), registers, fetchPage, askModel });
  const report = renderAgentReport(result);
  console.log(report);
  await writeRunReport('agent-report.md', `${report}\n`);
  await writeRunReport('agent-report.json', `${JSON.stringify({ ...result, prompt: PROMPT_VERSION, model: MODEL }, null, 2)}\n`);
}
