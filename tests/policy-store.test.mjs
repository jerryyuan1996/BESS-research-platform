import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,rm,writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyPolicyStore} from '../policy/verify-store.mjs';
import {POLICY_AUTHORIZATION} from '../policy/authorization.mjs';
import {TRUSTED_POLICY_PROFILES,APPROVED_HISTORICAL_EVALUATION} from '../policy/validation-profiles.mjs';
const options={config:POLICY_AUTHORIZATION,profiles:TRUSTED_POLICY_PROFILES,evaluation:APPROVED_HISTORICAL_EVALUATION};
test('actual public policy store passes only as unpublished while approval gates are OFF',async()=>{
  assert.deepEqual(await verifyPolicyStore({repo:fileURLToPath(new URL('..',import.meta.url)),...options}),{versions:0,status:'unpublished'});
});
test('unapproved and orphan policy JSON cannot enter a release even without a public index',async()=>{
  const repo=await mkdtemp(path.join(os.tmpdir(),'policy-store-gate-'));try{
    const target=path.join(repo,'public/data/public/policy/snapshots');await mkdir(target,{recursive:true});await writeFile(path.join(target,'draft.json'),'{}');
    await assert.rejects(verifyPolicyStore({repo,...options}),/publication is OFF/);
  }finally{await rm(repo,{recursive:true,force:true});}
});
