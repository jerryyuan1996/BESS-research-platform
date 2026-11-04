/** Production switching runs inside the shared, non-cancelling release lock. */
export async function publishProduction({ candidate, readMain, readProject, scan, upload, verifyCandidate, promote, record }){
  if (candidate !== await readMain()) return { published:false, reason:'superseded' };
  const project = await readProject();
  // The owner chose to retain existing hosting access settings on 2026-10-17.
  const rollback = project.targets?.production?.id;
  if (!rollback) throw new Error('No current production deployment was identified for rollback.');
  const artifact = await scan();
  const deployment = await upload();
  await verifyCandidate(deployment);
  if (candidate !== await readMain()) {
    await record({ candidate, artifact, deployment, rollback, published:false, reason:'superseded-after-upload' });
    return { published:false, reason:'superseded-after-upload' };
  }
  await record({ candidate, artifact, deployment, rollback, published:false, reason:'ready-to-promote' });
  await promote(deployment);
  const release = { candidate, artifact, deployment, rollback, published:true };
  await record(release);
  return release;
}

/**
 * The promotion command can return before the production alias has switched.
 * On 2026-11-04 the stamp was read 0.46 s after `vercel promote` reported
 * success and still named the previous commit, which failed a deployment that
 * had in fact published. Poll the public stamp for a bounded window instead of
 * reading it once.
 *
 * The query string is a cache key, not a parameter the file reads: it stops a
 * CDN edge from answering with the stamp of the deployment the alias pointed at
 * a second ago. The error names the last commit seen, so a genuine mismatch is
 * distinguishable from a slow alias.
 */
export async function waitForLiveStamp({
  url, candidate, attempts = 20, intervalMs = 1500,
  fetchImpl = fetch, sleepImpl = ms => new Promise(resolve => setTimeout(resolve, ms)),
}){
  let last = 'no response';
  for (let attempt = 1; attempt <= attempts; attempt++){
    try {
      const res = await fetchImpl(`${url}/release.json?ts=${Date.now()}`, { cache:'no-store' });
      if (!res.ok){
        last = `HTTP ${res.status}`;
      } else {
        const body = await res.json().catch(() => null);
        if (body?.commit === candidate) return body;
        last = body?.commit ?? 'no commit field';
      }
    } catch (error){
      last = error.message;
    }
    if (attempt < attempts) await sleepImpl(intervalMs);
  }
  throw new Error(`The live source version did not match the candidate after ${attempts} checks (last saw ${last}).`);
}
