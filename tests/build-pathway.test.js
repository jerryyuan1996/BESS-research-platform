/* ---------------------------------------------------------------------------
   THE BUILD PATHWAY.

   This content answers "how", which is the question the rest of the platform
   does not. It is also the content most exposed to quiet decay: durations are
   inferred, instruments get renamed by the bodies that own them, and nothing
   downstream computes on any of it, so a stale pathway produces no failing
   number anywhere. These tests are the only thing that would notice.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  STAGES, STAGE_LABEL, OWNER, OWNER_LABEL, DURATION_BASIS, DURATION_BASIS_LABEL,
  validateBuildPathway, pathwayMonths, orderDeviation,
} from '../src/governance/buildPathway.js';
import { allBuildPathways, buildPathwayFor, hasBuildPathway, pathwayMarketIds } from '../src/markets/buildPathwayRegistry.js';
import { markets, byId } from '../src/markets/registry.js';

test('every pathway validates', () => {
  const pathways = allBuildPathways();
  assert.ok(pathways.length >= 2,
    'at least two markets need a pathway — the section makes a comparative argument and one market cannot make it');
  for (const p of pathways){
    assert.deepEqual(validateBuildPathway(p), [], `${p.marketId}: pathway is invalid`);
  }
});

test('every pathway belongs to a registered market', () => {
  for (const id of pathwayMarketIds()){
    assert.ok(byId(id), `${id}: a pathway for a market that is not registered`);
    assert.ok(hasBuildPathway(id));
  }
  /* Absence must stay comfortable. Most markets have no pathway and that is a
     supported state, not a gap to be filled with a placeholder. */
  const without = markets.filter(m => !hasBuildPathway(m.manifest.id));
  assert.ok(without.length > 0, 'expected most markets to have no pathway yet');
  assert.equal(buildPathwayFor(without[0].manifest.id), null);
});

test('every stage names its instrument, its gate and where its duration came from', () => {
  for (const p of allBuildPathways()){
    for (const stage of p.stages){
      assert.ok(STAGES.includes(stage.id), `${p.marketId}/${stage.id}: not in the vocabulary`);
      assert.ok(STAGE_LABEL[stage.id], `${p.marketId}/${stage.id}: no label`);
      assert.ok(OWNER_LABEL[stage.owner], `${p.marketId}/${stage.id}: owner has no label`);
      assert.ok(DURATION_BASIS_LABEL[stage.durationBasis],
        `${p.marketId}/${stage.id}: duration basis has no label`);
      /* The instrument is the load-bearing field. "How long" without "under what
         rule" is folklore, and this section exists to be the opposite of that. */
      assert.ok(stage.instrument[0].length > 3, `${p.marketId}/${stage.id}: instrument is empty`);
      assert.ok(stage.gate[0].length > 3, `${p.marketId}/${stage.id}: gate is empty`);
    }
  }
});

test('a pathway states what it does not know', () => {
  /* The limit is not a disclaimer, it is the thing that makes the rest usable.
     Correspondence with a network operator is not public, so a reader has to be
     told which parts are documented rules and which are inferred elapsed times. */
  for (const p of allBuildPathways()){
    assert.ok(p.limit && p.limit[0].length > 40,
      `${p.marketId}: limit must actually say what the pathway cannot see`);
    assert.match(p.limit[0], /not public|not a project plan|inferred/i,
      `${p.marketId}: the limit does not name the gap it exists to name`);
  }
});

test('parallel stages are excluded from the elapsed total', () => {
  /* The single most likely misreading: summing nine rows into a programme
     nobody has run. WA runs consent alongside studies, so its total must be
     lower than the naive sum. */
  for (const p of allBuildPathways()){
    const total = pathwayMonths(p);
    assert.ok(total, `${p.marketId}: no elapsed total`);

    const naive = p.stages
      .filter(s => Array.isArray(s.months))
      .reduce((a, s) => a + s.months[1], 0);
    assert.ok(total.max <= naive, `${p.marketId}: total exceeds the naive sum`);

    if (total.parallel > 0){
      assert.ok(total.max < naive,
        `${p.marketId}: declares parallel stages but the total is the naive sum`);
    }
    /* And a parallel stage must name a stage that actually exists in THIS
       market's pathway, not merely in the vocabulary. */
    const ids = new Set(p.stages.map(s => s.id));
    for (const stage of p.stages.filter(s => s.parallelWith)){
      assert.ok(ids.has(stage.parallelWith),
        `${p.marketId}/${stage.id}: runs parallel with a stage this market does not have`);
    }
  }
});

test('the ordering difference between WA and Finland is real and computed', () => {
  /* This is the section's headline finding, and it is derived rather than
     written so it cannot drift away from the stages that produce it.

     Finland makes consent a prerequisite of the connection agreement; WA runs
     the two in parallel. If someone reorders either market's stages, this test
     is what says the prose above them is now wrong. */
  const wa = buildPathwayFor('wa');
  const fi = buildPathwayFor('fi');
  assert.ok(wa && fi);

  assert.deepEqual(orderDeviation(wa), [],
    'WA is expected to follow the conventional order');

  const fiDev = orderDeviation(fi);
  assert.ok(fiDev.length > 0, 'Finland is expected to depart from the conventional order');
  assert.ok(fiDev.some(d => d.runsEarlier === 'consent' && d.insteadOf === 'application'),
    'Finland must show consent running before the connection application');

  /* And the parallelism is the other half of the same contrast. */
  assert.ok(wa.stages.some(s => s.parallelWith === 'studies'),
    'WA must show a stage running parallel with studies');
  assert.equal(fi.stages.filter(s => s.parallelWith).length, 0,
    'Finland front-loads rather than parallelises — no stage should be marked parallel');
});

test('every stage cites a source that exists in its market register', async () => {
  /* A citation naming a key the register does not have renders no link and no
     error, which is the failure mode this catches. */
  for (const p of allBuildPathways()){
    const mod = await import(`../src/markets/${p.marketId}/sources.js`);
    const SRC = mod.SRC || mod.sources || mod.default;
    for (const stage of p.stages){
      assert.ok(SRC[stage.sourceKey],
        `${p.marketId}/${stage.id}: sourceKey "${stage.sourceKey}" is not in the market's source register`);
      assert.ok(SRC[stage.sourceKey].url !== undefined,
        `${p.marketId}/${stage.id}: cited source has no url field`);
    }
  }
});

test('the vocabulary itself is complete', () => {
  for (const id of STAGES) assert.ok(STAGE_LABEL[id], `stage ${id} has no label`);
  for (const owner of Object.values(OWNER)) assert.ok(OWNER_LABEL[owner], `owner ${owner} has no label`);
  for (const basis of Object.values(DURATION_BASIS)){
    assert.ok(DURATION_BASIS_LABEL[basis], `duration basis ${basis} has no label`);
  }
  assert.equal(STAGES.length, new Set(STAGES).size, 'stage ids must be unique');
});
