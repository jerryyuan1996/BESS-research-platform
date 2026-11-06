/* No network or writes. Reproduce the half-hour coverage gap in the current
   public WEM snapshot; a date being present is not a complete day. */
import { readSnapshot } from '../etl/lib/boundary.mjs';
import { auditIntervals } from '../etl/lib/interval-coverage.mjs';

const snapshot = await readSnapshot('public/data/public/wa-wem-prices.json');
if (!snapshot?.series?.length) throw new Error('No WEM snapshot to audit');
const audit = auditIntervals(snapshot.series, { intervalMinutes: 30 });
process.stdout.write(JSON.stringify({
  datasetId: snapshot.datasetId, contentChecksum: snapshot.contentChecksum,
  ...audit,
  missingClassification: 'Unclassified: may include unpublished intervals. Do not fill with zero or interpolation.',
  snapshotChanged: false,
}, null, 2) + '\n');
