/* ---------------------------------------------------------------------------
   Every grid map, eagerly — for tests, and for nothing else.

   `gridMapRegistry.js` no longer imports the map modules. They register
   themselves as their market's dashboard chunk loads, which is what keeps ~460 KB
   of coordinates out of the first download for a visitor who never opens a
   market page.

   That leaves the test suite needing a way to see all of them at once, because
   the properties it asserts are properties of the COLLECTION: that every map id
   is unique, that every constraint zone resolves, that no market is missing one.
   Those cannot be checked a chunk at a time.

   So this file exists to be imported first by a test that needs the whole set:

       import '../src/markets/gridMapRegistry.all.js';
       import { allGridMaps } from '../src/markets/gridMapRegistry.js';

   NOTHING IN THE APPLICATION IMPORTS IT, and that is the point — it is the same
   arrangement `_template/` relies on, so Vite tree-shakes it out of the
   production bundle. If an application module ever imports this file, every map
   is back in the main chunk and the split is silently undone.
   tests/bundle-budget.test.js is what would notice.
   --------------------------------------------------------------------------- */
import './wa/gridMapData.js';
import './nem/gridMapData.js';
import './gb/gridMapData.js';
import './de/gridMapData.js';
import './it/gridMapData.js';
import './ie/gridMapData.js';
import './ro/gridMapData.js';
import './pl/gridMapData.js';
import './jp/gridMapData.js';
import './pjm/gridMapData.js';
import './ercot/gridMapData.js';
import './caiso/gridMapData.js';
import './fi/gridMapData.js';
import './ca_on/gridMapData.js';
