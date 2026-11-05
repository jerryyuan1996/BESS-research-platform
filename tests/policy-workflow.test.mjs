import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { POLICY_SOURCES } from '../policy/source-inventory.mjs';
const workflow=readFileSync(new URL('../.github/workflows/etl.yml',import.meta.url),'utf8');
const job=id=>workflow.split(`\n  ${id}:\n`)[1]?.split(/\n  [a-z][a-z-]*:\n/)[0]||'';
const executable=s=>s.split('\n').filter(line=>!line.trim().startsWith('#')).join('\n');
test('one ordinary daily schedule initiates both streams; monthly/weekly schedules survive',()=>{
  const crons=[...workflow.matchAll(/- cron: '([^']+)'/g)].map(x=>x[1]);
  assert.deepEqual(crons,['17 6 * * *','43 5 2 * *','7 6 3 * *','23 4 1 * *','7 23 * * 0']);
  assert.doesNotMatch(workflow,/17 \*\/6/);assert.match(job('policy-discovery'),/17 6 \* \* \*/);assert.match(job('refresh'),/17 6 \* \* \*/);
});
test('policy process has read-only permissions, no saved credential, no model key and no publisher import',()=>{
  const policy=executable(job('policy-discovery'));
  assert.match(policy,/contents: read/);assert.match(policy,/persist-credentials: false/);assert.doesNotMatch(policy,/contents: write|pull-requests: write|secrets\.|git push|git commit|ANTHROPIC|OPENAI/);
  for(const rel of ['../policy/discovery.mjs','../scripts/policy/discover.mjs']){
    const code=readFileSync(new URL(rel,import.meta.url),'utf8');assert.doesNotMatch(code,/viewWriter|etl\/rules|authorMayWrite|publishPolicySnapshot|src\/markets|src\/comparison|local-data/);
  }
});
test('refresh tolerates policy failure without ignoring explicit workflow cancellation',()=>{
  assert.match(job('refresh'),/needs: policy-discovery/);assert.match(job('refresh'),/!cancelled\(\)/);assert.match(job('refresh'),/needs\.policy-discovery\.result/);
  assert.doesNotMatch(job('refresh'),/needs\.policy-discovery\.result == 'success'/);
});
test('one normal refresh commit/push and one exact-SHA gated publish remain',()=>{
  const refresh=executable(job('refresh'));assert.equal((refresh.match(/git commit /g)||[]).length,1);assert.equal((refresh.match(/^\s+git push\s*$/gm)||[]).length,1);
  assert.match(refresh,/npm run etl:verify/);assert.match(refresh,/npm run guard:staged/);assert.match(refresh,/GUARD_MARKER_SET:/);assert.match(refresh,/GUARD_FINGERPRINT_KEY:/);
  const publish=executable(job('publish'));assert.match(publish,/committed == 'true'/);assert.match(publish,/uses: \.\/\.github\/workflows\/ci.yml/);assert.match(publish,/ref: \$\{\{ needs.refresh.outputs.sha \}\}/);
  assert.doesNotMatch(refresh,/vercel deploy|gh pr merge/);
});
test('manual dry run suppresses rules, commits and drift proposal without adding a cron',()=>{
  assert.match(workflow,/dry_run:[\s\S]*?type: boolean/);assert.match(job('refresh'),/ARGS\+=\(--dry-run\)/);
  assert.match(job('refresh'),/id: rules\n\s+if: inputs.dry_run != true/);assert.match(job('refresh'),/id: commit\n\s+if: inputs.dry_run != true/);assert.match(job('propose'),/inputs.dry_run != true/);
  assert.match(workflow,/group: live-data\n\s+cancel-in-progress: false/);
});
test('unreviewed source proposal remains inactive and no AI output can publish',()=>{
  assert.equal(POLICY_SOURCES.length,4);for(const source of POLICY_SOURCES){assert.equal(source.reviewed,false);assert.equal(source.rightsReviewed,false);}
  const cli=readFileSync(new URL('../scripts/policy/discover.mjs',import.meta.url),'utf8');assert.match(cli,/publicationEnabled:false/);assert.doesNotMatch(cli,/publishPolicySnapshot/);
});
