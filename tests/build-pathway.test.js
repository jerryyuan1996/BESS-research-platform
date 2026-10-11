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
  validateBuildPathway, prerequisites, prerequisitesBefore,
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

test('a stage that overlaps another names one this market actually has', () => {
  /* `parallelWith` is a display hint now rather than an input to any total —
     the elapsed sum was removed because dropping parallel stages is not a
     critical path. It still must not point at a stage the market lacks, which
     would render an annotation naming nothing. */
  for (const p of allBuildPathways()){
    const ids = new Set(p.stages.map(s => s.id));
    for (const stage of p.stages.filter(s => s.parallelWith)){
      assert.ok(ids.has(stage.parallelWith),
        `${p.marketId}/${stage.id}: overlaps a stage this market does not have`);
      assert.notEqual(stage.parallelWith, stage.id,
        `${p.marketId}/${stage.id}: cannot overlap itself`);
    }
  }
});

test('the WA/Finland difference is modelled as gates, not as an order', () => {
  /* THE SECTION'S HEADLINE FINDING, asserted against the model that produces it.

     An earlier version asserted "Finland must show consent running before the
     connection application" — a stage-level claim that could not express what
     Fingrid publishes. Finland gates TWO different instruments on TWO different
     artefacts drawn from the same consent stage, and a total order collapses
     both into one statement. */
  const wa = buildPathwayFor('wa');
  const fi = buildPathwayFor('fi');
  assert.ok(wa && fi);

  const fiGates = prerequisites(fi);
  assert.equal(fiGates.length, 2,
    'Finland publishes two consent checkpoints — one at the letter of intent, one at the connection agreement');

  const loi = fiGates.find(g => g.before === 'application');
  assert.ok(loi, 'Finland must gate the letter of intent');
  assert.match(loi.requires[0], /EIA|environmental/i,
    'the letter of intent is gated on environmental evidence, not on final consent');

  const agreement = fiGates.find(g => g.before === 'studies');
  assert.ok(agreement, 'Finland must gate the connection agreement');
  assert.match(agreement.requires[0], /land-use plan|building permit/i,
    'the connection agreement is gated on final planning consent');

  /* The two edges come from the same stage and gate different instruments.
     That is precisely what a stage-level ordering could not say, so it is the
     assertion that would fail if someone collapsed the model back. */
  assert.equal(loi.requiresFrom, agreement.requiresFrom,
    'both Finnish gates draw on the same consent stage');
  assert.notEqual(loi.before, agreement.before,
    'the two gates bind at different instruments — collapsing them loses the finding');

  /* WA's published gating rule is the GPS sequencing, and notably NOT a
     development approval gating the access process. */
  const waGates = prerequisites(wa);
  assert.equal(waGates.length, 1, 'WA publishes one gating rule in this model');
  assert.equal(waGates[0].before, 'compliance');
  assert.match(waGates[0].requires[0], /ETAC|Electricity Transfer Access/i,
    'the GPS submission is gated on the ETAC application');
  assert.ok(!waGates.some(g => g.before === 'studies' && g.requiresFrom === 'consent'),
    'WA must NOT gate its access process on consent — that is the difference from Finland');

  /* And the annotation the renderer draws must resolve for a gated stage. */
  assert.equal(prerequisitesBefore(fi, 'application').length, 1);
  assert.equal(prerequisitesBefore(wa, 'compliance').length, 1);
  assert.equal(prerequisitesBefore(wa, 'studies').length, 0);
});

test('Great Britain gates on land and Romania on an auction, and neither gates the permit on consent', () => {
  /* The two later pathways, pinned the same way: by the gates they publish.

     Great Britain's reform makes land rights the readiness test for a Gate 2
     application and does NOT require planning consent to apply. Romania sells
     the connection at an annual auction and then polices consent by deadline:
     it is required before the connection works are contracted, not before the
     permit. Both differ from Finland, where consent gates the connection
     agreement itself, and an edit that made either look like Finland would be
     a change of finding rather than of wording. */
  const gb = buildPathwayFor('gb');
  const ro = buildPathwayFor('ro');
  assert.ok(gb && ro);

  const gbGates = prerequisites(gb);
  assert.equal(gbGates.length, 2, 'Great Britain publishes two gating rules in this model');
  const land = gbGates.find(g => g.before === 'application');
  assert.ok(land && land.requiresFrom === 'site', 'the Gate 2 application is gated on the site');
  assert.match(land.requires[0], /land rights/i);
  assert.ok(gbGates.some(g => g.before === 'entry' && g.requiresFrom === 'compliance'),
    'first export is gated on the Interim Operational Notification');

  const roGates = prerequisites(ro);
  assert.equal(roGates.length, 3, 'Romania publishes three gating rules in this model');
  const auction = roGates.find(g => g.requiresFrom === 'application');
  assert.ok(auction && auction.before === 'studies', 'the permit is gated on the allocation contract');
  assert.match(auction.requires[0], /allocation contract/i);
  assert.ok(roGates.some(g => g.requiresFrom === 'consent' && g.before === 'construction'),
    'consent gates the connection works');

  for (const p of [gb, ro]){
    assert.ok(!prerequisites(p).some(g => g.requiresFrom === 'consent' && ['application', 'studies'].includes(g.before)),
      `${p.marketId} must NOT gate its application or its offer on consent — that is Finland`);
  }

  /* A stage with no duration is a statement, not an omission: the next British
     application window has no published date. Only that stage may be null. */
  assert.deepEqual(gb.stages.filter(s => s.months === null).map(s => s.id), ['application']);
  assert.ok(ro.stages.every(s => s.months !== null));
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
    /* A gating rule without a citation is folklore, and a gating rule is the
       strongest claim this section makes. */
    for (const edge of prerequisites(p)){
      assert.ok(SRC[edge.sourceKey],
        `${p.marketId}/${edge.id}: sourceKey "${edge.sourceKey}" is not in the market's source register`);
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
