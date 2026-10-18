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
