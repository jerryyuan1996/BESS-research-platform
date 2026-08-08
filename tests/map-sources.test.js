/* ---------------------------------------------------------------------------
   The map's source declarations, checked against the registry.

   Both files here are governed data: a market may not appear on a map layer
   without declaring where the layer's data comes from and how far that source
   has been checked. Registering a market and forgetting the declaration is the
   failure this file catches — it would otherwise surface as a market silently
   missing from the grid map, which looks like a rendering bug and is not.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { markets } from '../src/markets/registry.js';
import { TRANSMISSION_VOLTAGE, voltageFor } from '../src/governance/transmissionVoltage.js';
import {
  PIPELINE_SOURCES, pipelineSourceFor, RENDERED_STATUS,
} from '../src/governance/projectPipelineSources.js';

const IDS = markets.map(m => m.manifest.id);
const bilingual = v => Array.isArray(v) && v.length === 2 && v.every(s => typeof s === 'string' && s.trim());

test('every registered market declares what counts as transmission in it', () => {
  for (const id of IDS){
    const v = voltageFor(id);
    assert.ok(v, `${id}: no transmission voltage definition`);

    /* The bulk layer is the backbone and the detail layer reaches further down,
       never the other way round — inverting them would hide the backbone and
       show only sub-transmission. */
    assert.ok(v.bulkKV >= v.detailKV, `${id}: bulk ${v.bulkKV} kV must not sit below detail ${v.detailKV} kV`);
    assert.ok(v.detailKV >= 100, `${id}: ${v.detailKV} kV is below any transmission definition`);
    assert.ok(v.operator && v.url.startsWith('https://'), `${id}: definition must cite a public operator`);
    assert.ok(bilingual(v.basis), `${id}: the reason for the threshold must be bilingual`);
    assert.ok(Array.isArray(v.levels) && v.levels.length, `${id}: must name the operator's own levels`);
  }
});

test('no market is silently absent from the voltage table', () => {
  const declared = Object.keys(TRANSMISSION_VOLTAGE).toSorted();
  assert.deepEqual(declared, IDS.toSorted(),
    'the voltage table and the market registry must describe the same set of markets');
});

test('every market declares a pipeline source, including the ones with none', () => {
  for (const id of IDS){
    const p = pipelineSourceFor(id);
    assert.ok(p, `${id}: no pipeline source declaration`);
    assert.ok(['verified', 'candidate', 'none'].includes(p.status), `${id}: invalid status ${p.status}`);

    if (p.status === 'none'){
      /* A market with no source must say why in the open. This is the Romania
         case, and the note is what stops an empty layer being read as an empty
         market. */
      assert.equal(p.storage, null, `${id}: status "none" cannot carry a source`);
      assert.ok(bilingual(p.note), `${id}: an absent source must be explained bilingually`);
      continue;
    }

    assert.ok(p.storage?.url?.startsWith('https://'), `${id}: source must be a public HTTPS location`);
    assert.ok(bilingual(p.storage.note), `${id}: source note must be bilingual`);

    if (p.status === 'verified'){
      assert.ok(p.storage.licence, `${id}: a verified source must state its licence`);
      assert.ok(p.storage.cadence, `${id}: a verified source must state its cadence`);
      assert.ok(p.storage.fields?.includes('powerMW'), `${id}: a verified source must carry power`);
      assert.ok(p.storage.fields.includes('status'), `${id}: a verified source must carry project status`);
    }
  }
});

test('a candidate source is never mistaken for a buildable one', () => {
  /* `fields` is what the ETL reads. A candidate has not been checked, so it
     declares none — which makes building against it impossible by accident
     rather than by discipline. */
  for (const [id, p] of Object.entries(PIPELINE_SOURCES)){
    if (p.status !== 'candidate') continue;
    assert.deepEqual(p.storage.fields, [],
      `${id}: a candidate cannot declare fields until the endpoint is checked`);
  }
});

test('interconnection queues are not rendered as pipeline', () => {
  // Most of a queue never gets built; plotting it would overstate every market.
  assert.deepEqual(RENDERED_STATUS, ['operating', 'construction']);
  assert.ok(!RENDERED_STATUS.includes('proposed'));
});
