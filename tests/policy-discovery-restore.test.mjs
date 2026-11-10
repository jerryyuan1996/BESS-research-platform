import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('artifact restore is bounded, fixed-member only and rejects untrusted workflow runs',()=>{
  const code=String.raw`
import importlib.util, io, json, zipfile
spec=importlib.util.spec_from_file_location('restore','scripts/policy/restore-discovery.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
run={'id':1,'head_branch':'main','path':'.github/workflows/etl.yml','head_repository':{'full_name':'owner/repo'},'event':'schedule','status':'completed','conclusion':'success'}
assert m.trusted_run(run,'owner/repo')
assert m.trusted_run(dict(run,conclusion='failure'),'owner/repo')
for patch in [{'head_branch':'other'},{'event':'pull_request'},{'status':'in_progress'},{'path':'.github/workflows/other.yml'},{'head_repository':{'full_name':'outside/repo'}}]:
    assert not m.trusted_run(dict(run,**patch),'owner/repo')
def archive(extra=None,body=None):
    output=io.BytesIO()
    with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as z:
        for name in m.FILES:z.writestr(name,body or json.dumps({'schemaVersion':1,'records':[]}))
        if extra:z.writestr(extra,'must not extract')
    return output.getvalue()
data=archive('../not-extracted.txt')
assert set(m.decode_archive(data))==set(m.FILES)
for bad in [archive(body='{}'),archive(body='x'*(m.MAX_BYTES+1))]:
    try:m.decode_archive(bad);raise AssertionError('must reject')
    except ValueError:pass
calls=[]
def request(url,token=None):
    calls.append((url,token))
    if '/workflows/etl.yml/runs?' in url:return json.dumps({'workflow_runs':[dict(run,event='pull_request'),run]}).encode()
    if '/runs/1/jobs?' in url:return json.dumps({'jobs':[{'name':'Policy discovery, shadow only','status':'completed','conclusion':'success'}]}).encode()
    if '/runs/1/artifacts?' in url:return json.dumps({'artifacts':[{'id':2,'name':'policy-discovery','expired':False,'size_in_bytes':len(data)}]}).encode()
    if '/artifacts/2/zip' in url:return data
    raise AssertionError(url)
m.request=request
files,run_id,status=m.restore('owner/repo','synthetic-token')
assert run_id==1 and status=='restored' and set(files)==set(m.FILES) and len(calls)==4
assert all(url.startswith('https://api.github.com/repos/owner/repo/') for url,_ in calls)
def failed_request(url,token=None):
    if '/jobs?' in url:return json.dumps({'jobs':[{'name':'Policy discovery, shadow only','status':'completed','conclusion':'failure'}]}).encode()
    return request(url,token)
m.request=failed_request
files,run_id,status=m.restore('owner/repo','synthetic-token')
assert not files and status=='gap'
legacy=io.BytesIO()
with zipfile.ZipFile(legacy,'w') as z:
    z.writestr('policy-discovery.json',json.dumps({'schemaVersion':1,'records':[{'id':name,'status':'pending_source_review','lastKnownGood':None,'lastSuccessfulAt':None} for name in ['de-agnes','gb-connections','nem-iess','wa-wic']]}))
assert set(m.decode_archive(legacy.getvalue()))=={'policy-discovery.json'}
empty=io.BytesIO()
with zipfile.ZipFile(empty,'w') as z:z.writestr('policy-discovery.json',json.dumps({'schemaVersion':1,'records':[]}))
try:m.decode_archive(empty.getvalue());raise AssertionError('must not seed missing history')
except ValueError:pass
for scenario in ['cancelled','expired','missing']:
    def gap_request(url,token=None):
        if '/workflows/etl.yml/runs?' in url:return json.dumps({'workflow_runs':[dict(run,conclusion='cancelled') if scenario=='cancelled' else run,dict(run,id=3)]}).encode()
        if '/runs/1/jobs?' in url:return json.dumps({'jobs':[{'name':'Policy discovery, shadow only','status':'completed','conclusion':'skipped' if scenario=='cancelled' else 'success'}]}).encode()
        if '/runs/1/artifacts?' in url:return json.dumps({'artifacts':[{'id':2,'name':'policy-discovery','expired':True}] if scenario=='expired' else []}).encode()
        raise AssertionError('must not fall back or download: '+url)
    m.request=gap_request
    files,run_id,status=m.restore('owner/repo','synthetic-token')
    assert not files and run_id==1 and status=='gap'
`;
  const result=spawnSync('python',['-B','-c',code],{cwd:fileURLToPath(new URL('../',import.meta.url)),encoding:'utf8',timeout:30_000});
  assert.equal(result.status,0,result.error?.message||result.stderr);
});
