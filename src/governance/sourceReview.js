/* ---------------------------------------------------------------------------
   SOURCE REVIEW RECORDS — evidence that a document was actually opened.

   Provenance says WHAT a record is. A review record says SOMEONE READ IT, when,
   which part, and what it does and does not establish. They are separate fields
   because they answer separate questions and go stale at different rates: a
   publisher does not change, a reading does.

   ---------------------------------------------------------------------------
   WHY THIS EXISTS

   The claim round stalled because fourteen of fifteen WA records were a URL and
   a title, and a title is not evidence. The fix is not to trust the next
   reading either — it is to write the reading down in a form a later reviewer
   can check without re-doing it and without asking the person who did it.

   So a review record must carry a LOCATOR. "The ESOO says so" is not
   reviewable; "landing page, section heading X" or "final determination PDF,
   table 4" is. And it must carry `doesNotEstablish`, because the failure this
   round keeps producing is not a false statement, it is a true statement
   stretched one clause too far.

   ---------------------------------------------------------------------------
   WHAT IT DELIBERATELY IS NOT

   A copy of the document. Excerpts are optional, short, and only where a
   paraphrase would lose the point. The repository is not an archive and must
   not become one.
   --------------------------------------------------------------------------- */

const isPair = (v) => Array.isArray(v) && typeof v[0] === 'string' && typeof v[1] === 'string';
const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

/** How the document was reached, which decides how reproducible the reading is. */
export const ACCESS = {
  /** Fetched from the publisher at the recorded URL. */
  PUBLISHER: 'publisher',
  /** Fetched from the publisher, but a landing page rather than the document. */
  LANDING_PAGE: 'landing-page',
  /** Reached through an archive because the live URL failed. */
  ARCHIVE: 'archive',
  /** Could not be reached at all. `establishes` must then be empty. */
  INACCESSIBLE: 'inaccessible',
};

/**
 * Validate one review record.
 *
 * The strict rule is the last one: a record that could not be opened may not
 * claim to establish anything. Without it, an inaccessible source quietly
 * becomes a reviewed source with an empty locator.
 */
export function validateReview(review, id = '?'){
  const problems = [];
  if (!review) return problems;                      // absence is a valid state

  if (!nonEmpty(review.reviewedAt) || !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt))
    problems.push(`${id}: reviewedAt must be an ISO date`);

  if (!Object.values(ACCESS).includes(review.access))
    problems.push(`${id}: access must be one of ${Object.values(ACCESS).join(', ')}`);

  const reached = review.access !== ACCESS.INACCESSIBLE;

  if (reached){
    for (const f of ['confirmedTitle', 'confirmedPublisher', 'locator']){
      if (!nonEmpty(review[f])) problems.push(`${id}: ${f} is required once a source is opened`);
    }
    if (!Array.isArray(review.establishes) || !review.establishes.length)
      problems.push(`${id}: a reviewed source must record what it establishes`);
    if (!Array.isArray(review.doesNotEstablish) || !review.doesNotEstablish.length)
      problems.push(`${id}: record what must NOT be inferred — the recurring failure is a ` +
                    'true statement stretched one clause too far');
  } else {
    if (review.establishes?.length)
      problems.push(`${id}: access is "inaccessible" but the record claims to establish things`);
    if (!nonEmpty(review.accessNote))
      problems.push(`${id}: an inaccessible source must say what was tried and what failed`);
  }

  /* A confirmed date that contradicts the register is the single most useful
     thing a review turns up, so it is recorded rather than silently reconciled. */
  if (review.registerDateDiffers && !nonEmpty(review.registerDateNote))
    problems.push(`${id}: registerDateDiffers is set but nothing says how`);

  if (review.excerpt && review.excerpt.length > 300)
    problems.push(`${id}: excerpt is ${review.excerpt.length} characters; keep it short — ` +
                  'this repository is not an archive');

  if (review.claimText && !isPair(review.claimText))
    problems.push(`${id}: claimText must be [en, zh]`);

  return problems;
}

/** Did this review actually open the document, as opposed to a page about it? */
export const openedTheDocument = (review) => review?.access === ACCESS.PUBLISHER
                                          || review?.access === ACCESS.ARCHIVE;
