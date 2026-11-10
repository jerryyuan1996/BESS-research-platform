/** Operational metadata only. A successful job is not proof of source coverage. */
export function discoveryCoverage(records) {
  const count = status => records.filter(record => record.status === status).length;
  const checked = count('changed') + count('unchanged');
  const pendingReview = count('pending_source_review');
  const disabled = count('disabled');
  const duplicates = count('duplicate');
  const retained = count('same_cycle_retained');
  return {
    registered: records.length,
    checked,
    changed: count('changed'),
    pendingReview,
    disabled,
    duplicates,
    retained,
    failed: records.length - checked - pendingReview - disabled - duplicates - retained,
    status: records.length === 0 ? 'no_sources'
      : checked === records.length ? 'all_registered_pages_checked'
      : checked > 0 ? 'partial_coverage' : 'no_sources_checked',
  };
}

export function discoverySummary(report) {
  const c = discoveryCoverage(report.records);
  return [
    '## Policy discovery: factual page checks only',
    '',
    `Registered pages: ${c.registered}; checked successfully: ${c.checked}; changed: ${c.changed}.`,
    `Pending source/rights review: ${c.pendingReview}; disabled: ${c.disabled}; duplicates: ${c.duplicates}; same-day attempts retained without refetch: ${c.retained}; failed: ${c.failed}.`,
    c.checked === 0
      ? 'No source was checked successfully. A successful workflow does not mean current policies were collected.'
      : 'A changed page hash is a review lead, not a verified policy release, legal change or effective date.',
    'Daily target: 06:17 UTC with market ETL, not real-time monitoring; source delays, scheduler drift and failures can extend the interval.',
    'No policy AI analysis, automatic policy publication, investment strategy or rating changes.',
    `Rolling metadata journal: ${report.journal?.records??0} links; ${report.journal?.added??0} first observations this cycle; ${report.journal?.overflow??0} omitted by bounds; ${report.journal?.prunedNavigation??0} source-navigation records removed; baseline: ${report.journal?.baseline??'unavailable'}.`,
    'Original link titles and URLs are unverified observations; firstObservedAt is not publishedAt or effectiveAt. No linked document is downloaded.',
    'Journal and Actions artifacts retain rolling 90-day metadata, not a durable cumulative policy archive or complete legal database. Artifacts may be public; no source body, private notes or strategy is stored.',
    'Bundesnetzagentur attribution: original-title metadata from https://www.bundesnetzagentur.de/1059162; terms: https://www.bundesnetzagentur.de/DE/Service/Impressum/start.html.',
    'Ofgem attribution: Contains public sector information licensed under the Open Government Licence v3.0 (https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/). Source-use exclusions: https://www.ofgem.gov.uk/c-ofgem-2026.',
    '',
  ].join('\n');
}
