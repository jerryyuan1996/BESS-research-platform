/* ---------------------------------------------------------------------------
   PROVENANCE — where a record came from, and when.

   Every normalized project carries this. Without it a reader looking at a
   pipeline table can tell what the platform believes but not why, and an analyst
   reviewing a diff cannot tell a restated source from a parser change.

   Five fields, and each answers a question that has actually come up:

     authority     WHO says so. The Bundesnetzagentur and a volunteer OSM mapper
                   are not the same claim, and the map should not present them as
                   though they were.
     dataset       WHICH publication. "EIA-860M" and "EIA-860" carry different
                   fields and different reliability; EIA says so itself.
     sourceRecordId  The publisher's own identifier, where one exists. This is
                   what makes a record traceable back into the source file and
                   joinable to a companion dataset — the EIA-860 enrichment keys
                   on it, and a register that renumbers its rows between releases
                   would otherwise be undetectable.
     publishedAt   The release the data came FROM. A monthly file read in August
                   may be the June release.
     ingestedAt    When WE read it. Different from publishedAt, and the gap
                   between them is the staleness a reader should judge.

   `publishedAt` and `ingestedAt` are passed in rather than read from a clock in
   here, so a re-run over an unchanged release produces an unchanged record and
   the snapshot does not churn.
   --------------------------------------------------------------------------- */

/** Publisher standing. Not a quality score — a statement of who is speaking. */
export const AUTHORITY = {
  /** A statutory filing or a regulator's own register. */
  STATUTORY: 'statutory',
  /** A system or market operator publishing about its own system. */
  OPERATOR: 'operator',
  /** Open, volunteer-maintained data. Real, and not the same as the above. */
  COMMUNITY: 'community',
};

const AUTHORITIES = new Set(Object.values(AUTHORITY));
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Build the provenance block for one record.
 *
 * @param {object} spec
 * @param {string} spec.authority       one of AUTHORITY
 * @param {string} spec.dataset         the publication, e.g. 'EIA-860M'
 * @param {string} spec.publisher       the organisation, e.g. 'U.S. Energy Information Administration'
 * @param {?string} spec.sourceRecordId publisher's own id, or null where none exists
 * @param {?string} spec.publishedAt    release date, ISO, or null if the release is undated
 * @param {string} spec.ingestedAt      when this run read it, ISO
 */
export function provenance({ authority, dataset, publisher, sourceRecordId = null, publishedAt = null, ingestedAt }){
  if (!AUTHORITIES.has(authority)) throw new Error(`provenance: unknown authority "${authority}"`);
  if (!dataset) throw new Error('provenance: dataset is required');
  if (!publisher) throw new Error('provenance: publisher is required');
  if (!ISO_DATE.test(String(ingestedAt || ''))) throw new Error('provenance: ingestedAt must be an ISO date');
  if (publishedAt != null && !ISO_DATE.test(String(publishedAt))){
    throw new Error('provenance: publishedAt must be an ISO date or null');
  }

  return {
    authority,
    dataset,
    publisher,
    /* Null rather than a synthesised key. A fabricated id would look joinable
       and silently match the wrong record in a companion dataset. */
    sourceRecordId: sourceRecordId == null || sourceRecordId === '' ? null : String(sourceRecordId),
    publishedAt,
    ingestedAt,
  };
}

const REQUIRED = ['authority', 'dataset', 'publisher', 'sourceRecordId', 'publishedAt', 'ingestedAt'];

/** Problems with a record's provenance block, as strings. Empty when valid. */
export function validateProvenance(block, label = 'provenance'){
  const problems = [];
  if (!block || typeof block !== 'object') return [`${label}: missing`];

  for (const key of REQUIRED){
    if (!(key in block)) problems.push(`${label}: ${key} is absent`);
  }
  if (!AUTHORITIES.has(block.authority)) problems.push(`${label}: unknown authority "${block.authority}"`);
  if (!block.dataset) problems.push(`${label}: dataset is empty`);
  if (!block.publisher) problems.push(`${label}: publisher is empty`);
  if (!ISO_DATE.test(String(block.ingestedAt || ''))) problems.push(`${label}: ingestedAt is not an ISO date`);
  if (block.publishedAt != null && !ISO_DATE.test(String(block.publishedAt))){
    problems.push(`${label}: publishedAt is not an ISO date`);
  }
  /* A release cannot be read before it exists. This catches a connector that
     stamps the ingest date into publishedAt by mistake — which would make every
     dataset look permanently fresh. */
  if (block.publishedAt && block.ingestedAt && block.publishedAt > block.ingestedAt){
    problems.push(`${label}: publishedAt ${block.publishedAt} is after ingestedAt ${block.ingestedAt}`);
  }
  return problems;
}

/** Days between publication and ingestion, or null when the release is undated. */
export function stalenessDays(block){
  if (!block?.publishedAt || !block?.ingestedAt) return null;
  const ms = Date.parse(block.ingestedAt) - Date.parse(block.publishedAt);
  return Number.isFinite(ms) ? Math.round(ms / 86_400_000) : null;
}
