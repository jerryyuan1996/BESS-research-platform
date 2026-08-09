/* ---------------------------------------------------------------------------
   The common project registry.

   One interface over four sources with genuinely different shapes: MaStR has
   coordinates and energy, EIA-860M has neither until the annual join, AEMO has
   energy but no position, OSM has position and sometimes energy. The dashboard
   must be able to render all of them without knowing which is which — and must
   not be able to imply a completeness none of them has.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  registerProjects, projectsFor, mappableProjects, coverage, attribution,
  hasSource, sourcesFor, registeredMarkets, __resetRegistry,
} from '../src/projects/registry.js';
import { PROJECT_STAGE } from '../src/projects/schema.js';

let seq = 0;
const project = (over = {}) => ({
  id: `p-${++seq}`, marketId:'de', name:`P${seq}`,
  stage: PROJECT_STAGE.OPERATING, statusRaw:'In Betrieb',
  evidenceDate:'2026-08-09', expectedCod:null,
  capacityMW: 50, durationHours: 2, operator:'Op',
  lat: 52, lon: 13, sourceIds:['de-mastr'], ...over,
});

test.beforeEach(() => __resetRegistry());

test('a market with no registered source is distinguishable from an empty one', () => {
  assert.equal(hasSource('ro'), false);
  assert.deepEqual(projectsFor('ro'), []);
  assert.equal(coverage('ro').hasSource, false);

  registerProjects('de', { projects: [], dataset:'MaStR', licence:{ attribution:'Bundesnetzagentur' } });
  assert.equal(hasSource('de'), true, 'a registered but empty source is not the same as no source');
  assert.equal(coverage('de').hasSource, true);
});

test('several sources accumulate rather than replace', () => {
  registerProjects('ercot', { projects:[project({ id:'a', marketId:'ercot' })], dataset:'EIA-860M' });
  registerProjects('ercot', { projects:[project({ id:'b', marketId:'ercot' })], dataset:'EIA-860 annual' });
  assert.equal(projectsFor('ercot').length, 2);
  assert.deepEqual(sourcesFor('ercot').map(s => s.dataset), ['EIA-860M', 'EIA-860 annual']);
});

test('an enriched record replaces the bare one it was built from', () => {
  /* The US path registers EIA-860M and then its enriched form. Doubling the
     fleet because a record gained coordinates would be the worst kind of bug. */
  registerProjects('ercot', { projects:[project({ id:'x', marketId:'ercot', lat:null, lon:null })], dataset:'EIA-860M' });
  registerProjects('ercot', { projects:[project({ id:'x', marketId:'ercot', lat:31, lon:-99 })], dataset:'EIA-860 annual' });

  const projects = projectsFor('ercot');
  assert.equal(projects.length, 1, 'one project, not two');
  assert.equal(projects[0].lat, 31, 'and it is the enriched one');
});

test('records with no position stay in the register but off the map', () => {
  registerProjects('nem', { projects:[
    project({ id:'located', marketId:'nem' }),
    project({ id:'unlocated', marketId:'nem', lat:null, lon:null }),
  ], dataset:'AEMO' });

  assert.equal(projectsFor('nem').length, 2, 'both belong in the pipeline table');
  assert.deepEqual(mappableProjects('nem').map(p => p.id), ['located']);

  const c = coverage('nem');
  assert.equal(c.records, 2);
  assert.equal(c.located, 1);
  assert.equal(c.unlocated, 1);
  assert.equal(c.mappable, true);
});

test('a market where nothing has a position is mappable:false, not empty', () => {
  // EIA-860M before the annual join. A pipeline table and no map layer.
  registerProjects('pjm', { projects:[
    project({ id:'p1', marketId:'pjm', lat:null, lon:null }),
    project({ id:'p2', marketId:'pjm', lat:null, lon:null }),
  ], dataset:'EIA-860M' });

  const c = coverage('pjm');
  assert.equal(c.records, 2);
  assert.equal(c.mappable, false);
  assert.equal(c.located, 0);
});

test('energy coverage is reported so a caption cannot imply a fleet has none', () => {
  registerProjects('gb', { projects:[
    project({ id:'e1', marketId:'gb', durationHours: 2 }),
    project({ id:'e2', marketId:'gb', durationHours: null }),
    project({ id:'e3', marketId:'gb', durationHours: null }),
  ], dataset:'NESO TEC' });

  const c = coverage('gb');
  assert.equal(c.energyKnown, 1);
  assert.equal(c.energyUnknown, 2, 'unpublished, not zero');
});

test('queue stages never reach the map or the coverage counts', () => {
  registerProjects('de', { projects:[
    project({ id:'op', stage: PROJECT_STAGE.OPERATING }),
    project({ id:'queue', stage: PROJECT_STAGE.GRID_APPLICATION }),
  ], dataset:'MaStR' });

  assert.equal(projectsFor('de').length, 2, 'the register keeps everything it was given');
  assert.equal(mappableProjects('de').length, 1, 'the map draws only rendered stages');
  assert.equal(coverage('de').records, 1);
});

test('attribution is collected from every source, because it is an obligation', () => {
  registerProjects('ie', { projects:[project({ marketId:'ie' })], dataset:'OSM',
    licence:{ attribution:'© OpenStreetMap contributors', shareAlike:true } });
  registerProjects('ie', { projects:[project({ marketId:'ie' })], dataset:'EirGrid',
    licence:{ attribution:'EirGrid' } });

  assert.deepEqual(attribution('ie'), ['© OpenStreetMap contributors', 'EirGrid']);
  assert.deepEqual(attribution('ro'), [], 'a market with no source owes no attribution');
});

test('the register lists only markets that registered something', () => {
  registerProjects('de', { projects:[project()], dataset:'MaStR' });
  registerProjects('nem', { projects:[project({ marketId:'nem' })], dataset:'AEMO' });
  assert.deepEqual(registeredMarkets(), ['de', 'nem']);
});

test('order is stable so a re-render does not reshuffle the table', () => {
  registerProjects('de', { projects:[
    project({ id:'zzz' }), project({ id:'aaa' }), project({ id:'mmm' }),
  ], dataset:'MaStR' });
  assert.deepEqual(projectsFor('de').map(p => p.id), ['aaa', 'mmm', 'zzz']);
});
