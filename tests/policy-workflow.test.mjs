import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { POLICY_SOURCES } from '../policy/source-inventory.mjs';
const workflow=readFileSync(new URL('../.github/workflows/etl.yml',import.meta.url),'utf8');
const job=id=>workflow.split(`\n  ${id}:\n`)[1]?.split(/\n  [a-z][a-z-]*:\n/)[0]||'';
const executable=s=>s.split('\n').filter(line=>!line.trim().startsWith('#')).join('\n');
test('one ordinary daily schedule initiates both streams; monthly/weekly schedules survive',()=>{
  const crons=[...workflow.matchAll(/- cron: '([^']+)'/g)].map(x=>x[1]);
  assert.deepEqual(crons,['17 6 * * *','7 6 3 * *','7 23 * * 0']);
  assert.doesNotMatch(workflow,/17 \*\/6/);assert.match(job('policy-discovery'),/17 6 \* \* \*/);assert.match(job('refresh'),/17 6 \* \* \*/);
});
test('policy process has read-only permissions, no saved credential, no model key and no publisher import',()=>{
  const policy=executable(job('policy-discovery'));
  assert.match(policy,/contents: read/);assert.match(policy,/actions: read/);assert.match(policy,/persist-credentials: false/);assert.doesNotMatch(policy,/contents: write|pull-requests: write|secrets\.|git push|git commit|ANTHROPIC|OPENAI/);
  for(const rel of ['../policy/discovery.mjs','../scripts/policy/discover.mjs']){
    const code=readFileSync(new URL(rel,import.meta.url),'utf8');assert.doesNotMatch(code,/viewWriter|etl\/rules|authorMayWrite|publishPolicySnapshot|src\/markets|src\/comparison|local-data/);
  }
});
test('refresh tolerates policy failure without ignoring explicit workflow cancellation',()=>{
  assert.match(job('refresh'),/needs: \[policy-discovery\]/);assert.match(job('refresh'),/!cancelled\(\)/);assert.match(job('refresh'),/needs\.policy-discovery\.result/);
  assert.doesNotMatch(job('refresh'),/needs\.policy-discovery\.result == 'success'/);
});

test('daily and dispatched ETL cannot invoke a policy model or publish model candidates',()=>{
  assert.equal(job('policy-research'),'');
  assert.doesNotMatch(executable(workflow),/POLICY_MODEL_API_KEY|POLICY_EVALUATION_API_KEY|policy\/research\.mjs|policy\/evaluate-shadow\.mjs|publish-candidate\.mjs|policy-candidate/);
  assert.doesNotMatch(job('policy-discovery'),/ai_enabled|authorize\.mjs/);
  const research=readFileSync(new URL('../scripts/policy/research.mjs',import.meta.url),'utf8');
  assert.match(research,/manual_only/);assert.doesNotMatch(research,/policyTransport|researchShadow|API_KEY|fetchPolicyEvidence/);
  const authorization=readFileSync(new URL('../scripts/policy/authorize.mjs',import.meta.url),'utf8');
  assert.match(authorization,/const enabled=false/);
});
test('one normal refresh commit/push and one exact-SHA gated publish remain',()=>{
  const refresh=executable(job('refresh'));assert.equal((refresh.match(/git commit /g)||[]).length,1);
  assert.equal((refresh.match(/^\s+bash scripts\/ci\/push-main\.sh\s*$/gm)||[]).length,1);
  assert.doesNotMatch(refresh,/^\s+git push\b/gm);
  assert.match(refresh,/npm run etl:verify/);assert.match(refresh,/npm run guard:staged/);assert.match(refresh,/GUARD_MARKER_SET:/);assert.match(refresh,/GUARD_FINGERPRINT_KEY:/);
  const publish=executable(job('publish'));assert.match(publish,/committed == 'true'/);assert.match(publish,/uses: \.\/\.github\/workflows\/ci.yml/);assert.match(publish,/ref: \$\{\{ needs.refresh.outputs.sha \}\}/);
  assert.doesNotMatch(refresh,/vercel deploy|gh pr merge/);
});

test('validated data reaches CI despite optional policy skips while failed, cancelled and no-change runs stay closed',()=>{
  const line=job('publish').match(/^    if:\s*(.+)$/m)?.[1];
  assert.ok(line,'the data publisher has an eligibility condition');
  const expression=line.replace(/^\$\{\{\s*|\s*\}\}$/g,'');
  // GitHub adds success() across ancestors unless a status function is explicit.
  // Evaluate the actual workflow predicate, including that documented default.
  const explicitStatus=/\b(?:always|cancelled|failure|success)\s*\(/.test(expression);
  const cases=[
    {name:'model disabled',policy:'skipped',expected:true},
    {name:'discovery failed but market refresh validated',discovery:'failure',policy:'skipped',expected:true},
    {name:'all predecessors succeeded',expected:true},
    {name:'refresh failed after producing an output',refresh:'failure',expected:false},
    {name:'refresh skipped',refresh:'skipped',expected:false},
    {name:'refresh cancelled',refresh:'cancelled',cancelled:true,expected:false},
    {name:'workflow cancelled after refresh',cancelled:true,expected:false},
    {name:'no changed content',committed:'false',expected:false},
    {name:'missing commit output',committed:'',expected:false},
    {name:'another branch',ref:'refs/heads/research',expected:false},
  ];
  for(const entry of cases){
    const c={discovery:'success',policy:'success',refresh:'success',cancelled:false,committed:'true',ref:'refs/heads/main',...entry};
    const states=[c.discovery,c.policy,c.refresh];
    const success=()=>states.every(s=>s==='success');
    const result=runInNewContext(expression,{
      needs:{refresh:{result:c.refresh,outputs:{committed:c.committed}}},github:{ref:c.ref},
      cancelled:()=>c.cancelled,always:()=>true,success,failure:()=>states.includes('failure'),
    },{timeout:100});
    assert.equal(Boolean(result)&&(explicitStatus||success()),c.expected,c.name);
  }
});
test('manual dry run suppresses rules, commits and drift proposal without adding a cron',()=>{
  assert.match(workflow,/dry_run:[\s\S]*?type: boolean/);assert.match(job('refresh'),/ARGS\+=\(--dry-run\)/);
  assert.match(job('refresh'),/id: rules\n\s+if: inputs.dry_run != true/);assert.match(job('refresh'),/id: commit\n\s+if: inputs.dry_run != true/);assert.match(job('propose'),/inputs.dry_run != true/);
  assert.match(workflow,/group: live-data\n\s+cancel-in-progress: false/);
});
test('reviewed metadata scopes activate; original denied sources and broader publication stay off',()=>{
  assert.equal(POLICY_SOURCES.length,8);for(const source of POLICY_SOURCES){assert.equal(source.reviewed,false);assert.equal(source.rightsReviewed,false);}
  assert.deepEqual(POLICY_SOURCES.filter(s=>s.metadataScope?.reviewed).map(s=>s.id),['de-agnes','gb-connections','nem-iess-aemo','wa-wic-aemo','nem-iess-technical','wa-brcp-era']);
  for(const source of POLICY_SOURCES.filter(s=>s.metadataScope?.reviewed)){
    assert.equal(source.metadataScope.purpose,'metadata_discovery_only');assert.deepEqual(source.metadataScope.attachmentDownloadHosts,[]);
  }
  const cli=readFileSync(new URL('../scripts/policy/discover.mjs',import.meta.url),'utf8');assert.match(cli,/publicationEnabled:false/);assert.doesNotMatch(cli,/publishPolicySnapshot/);
});

test('discovery publishes actual coverage to its job summary, not just workflow success',()=>{
  assert.match(job('policy-discovery'),/cat etl\/out\/policy-discovery\.md >> "\$GITHUB_STEP_SUMMARY"/);
  assert.match(job('policy-discovery'),/path: \|\n\s+etl\/out\/policy-discovery\.json\n\s+etl\/out\/policy-discovery\.md\n\s+etl\/out\/policy-discovery-journal\.json/);
  assert.match(job('policy-discovery'),/retention-days: 90/);
  assert.match(job('policy-discovery'),/python scripts\/policy\/restore-discovery\.py/);
  assert.doesNotMatch(job('policy-discovery'),/actions\/cache/);
  const cli=readFileSync(new URL('../scripts/policy/discover.mjs',import.meta.url),'utf8');
  assert.match(cli,/coverage:discoveryCoverage\(result\.records\)/);
  assert.match(cli,/discoverySummary\(result\)/);
});
