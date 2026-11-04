import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { publishProduction, waitForLiveStamp } from './lib/production-release.mjs';

const required = name => { if (!process.env[name]) throw new Error(`Missing ${name}`); return process.env[name]; };
const candidate = required('RELEASE_SHA');
if (!/^[a-f0-9]{40}$/.test(candidate)) throw new Error('Release target must be a full commit SHA.');
const repo = required('GITHUB_REPOSITORY');
const token = required('VERCEL_TOKEN');
const team = required('VERCEL_ORG_ID');
const projectId = required('VERCEL_PROJECT_ID');
const cli = (...args) => {
  try { return execFileSync('vercel', [...args, `--scope=${team}`, `--token=${token}`],
    { encoding:'utf8', stdio:['ignore', 'pipe', 'inherit'] }).trim(); }
  catch { throw new Error(`Vercel ${args[0]} failed. Check the CLI log above.`); }
};
const github = async path => {
  const res = await fetch(`https://api.github.com/repos/${repo}/${path}`, { headers:{ Authorization:`Bearer ${required('GH_TOKEN')}`, Accept:'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`GitHub release check failed (${res.status}).`);
  return res.json();
};
const project = async () => {
  const res = await fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}?teamId=${encodeURIComponent(team)}`,
    { headers:{ Authorization:`Bearer ${token}` } });
  if (!res.ok) throw new Error(`Vercel access check failed (${res.status}).`);
  return res.json();
};
const walk = dir => readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(resolve(dir,e.name)) : [resolve(dir,e.name)]).sort();
const output = resolve('.vercel/output');
const digest = () => {
  const hash = createHash('sha256');
  for (const file of walk(output)) hash.update(relative(output,file).replaceAll('\\','/')).update('\0').update(readFileSync(file)).update('\0');
  return hash.digest('hex');
};
let scannedHash, deploymentId;
const result = await publishProduction({
  candidate,
  readMain:async () => (await github('git/ref/heads/main')).object.sha,
  readProject:project,
  scan:async () => {
    // Re-run the guard against the exact bytes immediately before uploading.
    execFileSync(process.execPath, ['--test','tests/bundle-confidentiality.test.js'], {
      stdio:'inherit', env:{...process.env,SCAN_DIR:'.vercel/output',REQUIRE_OUTPUT:'1',REQUIRE_MARKERS:'1'},
    });
    scannedHash = digest();
    return scannedHash;
  },
  upload:async () => {
    if (digest() !== scannedHash) throw new Error('The scanned artifact changed before upload.');
    // Upload without changing the production domain. Promotion uses this URL.
    const url = cli('deploy','--prebuilt','--prod','--skip-domain', '-m', `releaseSha=${candidate}`);
    if (!/^https:\/\/[a-z0-9.-]+\.vercel\.app$/.test(url)) throw new Error('Vercel did not return one deployment URL.');
    return url;
  },
  verifyCandidate:async url => {
    const res = await fetch(`https://api.vercel.com/v13/deployments/${new URL(url).hostname}?teamId=${encodeURIComponent(team)}`,
      {headers:{Authorization:`Bearer ${token}`}});
    if (!res.ok) throw new Error(`Cannot inspect uploaded deployment (${res.status}).`);
    const info = await res.json();
    if (info.readyState !== 'READY' || info.meta?.releaseSha !== candidate) throw new Error('Deployment identity or readiness did not match the candidate.');
    deploymentId = info.id;
  },
  promote:async url => {
    cli('promote',url,'--yes');
    if ((await project()).targets?.production?.id !== deploymentId) throw new Error('The production target does not match the checked deployment.');
    /* Retain existing Standard Protection: verify the public production stamp.
       The alias can answer with the previous deployment for a few seconds after
       the promotion returns, so the check polls rather than reading once. */
    await waitForLiveStamp({ url:required('PRODUCTION_URL'), candidate });
  },
  record:async data => {
    mkdirSync('release-records',{recursive:true});
    writeFileSync('release-records/production.json',JSON.stringify({...data,deploymentId,accessPolicy:'existing-settings',at:new Date().toISOString()},null,2));
  },
});
console.log(result.published ? 'Published the checked deployment.' : `No production change: ${result.reason}.`);
