/* ---------------------------------------------------------------------------
   Where the dashboard's project data comes from — the registration point.

   This is the only file that knows which market takes which dataset. It imports
   the JSON the ETL produced and hands it to the registry; nothing here parses
   anything, and adding a market is one `registerProjects` call.

   A market with no verified source registers nothing, on purpose. Romania, Italy,
   Poland and the three Japanese areas measured out and are deliberately absent —
   `coverage()` then reports `hasSource:false`, which a renderer must show
   differently from a market that has a source and no projects in it.
   --------------------------------------------------------------------------- */
import { registerProjects } from './registry.js';
import ieStorage from '../markets/ie/ie-storage-osm.json' with { type:'json' };

/* Ireland — OpenStreetMap, ODbL. The only market carried on OSM for storage,
   because its coverage was MEASURED at 1,039 MW against the roughly 1 GW ESB
   Networks reports as available. See src/governance/projectPipelineSources.js
   for why Italy, Poland and Japan are not here. */
registerProjects('ie', {
  projects: ieStorage.projects,
  licence: ieStorage.licence,
  dataset: 'OpenStreetMap — power=plant, plant:source=battery',
  publishedAt: ieStorage.fetchedAt,
  note: [
    'Volunteer-maintained. Coverage was measured against the published fleet total rather than assumed, and no commissioning dates are published.',
    '由志愿者维护。其覆盖度系与公开的机组总量实测比对得出，而非假定；且不含投运日期。',
  ],
});

/* US EIA records are loaded lazily from the governed public inventory by the
   interactive map bridge (eiaInventoryClient.js), which registers the same rows
   used by its table. Refresh: npm run etl -- --only us-eia-storage-projects.
   MaStR and AEMO project connectors remain separate, unregistered candidates;
   having a parser is not a production integration. */
