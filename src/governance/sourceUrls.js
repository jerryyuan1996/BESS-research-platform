/* ---------------------------------------------------------------------------
   SOURCE URL VALIDATION — the deterministic half of link health.

   The editorial pass turned up link rot one claim at a time: a PJM Board
   disclosure page that 404s, two dead Modo articles, a queue URL that is now a
   redirect notice pointing at a page that says its own data is stale, and a WA
   record whose URL is a regulator homepage. None of that was visible to any
   gate.

   ---------------------------------------------------------------------------
   THIS FILE MAKES NO NETWORK REQUEST, DELIBERATELY

   A live fetch in a pull-request gate fails for reasons that have nothing to do
   with the change under review — a publisher rate-limits, a CI runner has no
   egress, a government site blocks automation. A gate that goes red for reasons
   the author cannot fix is a gate people learn to ignore, and then it protects
   nothing.

   So the split is: this checks what is decidable from the string alone and runs
   on every change. Reachability is a scheduled audit that reports, in
   scripts/link-audit.mjs.

   AND LINK HEALTH IS NOT FRESHNESS. A page can return 200 while announcing that
   its own dataset has moved — the PJM serial queue page does exactly that. No
   HTTP status detects it. Freshness lives in the source metadata and the review
   records, and is a human judgement.
   --------------------------------------------------------------------------- */

/** Records that legitimately have no URL, with the reason each is exempt. */
export const URL_EXEMPT = {
  'wa:mkt': 'A market study with no public address. Its identity is unresolved ' +
            'and it is on the research backlog; it supports no published claim.',

  /* Found by this gate on its first run, which is the argument for having it.
     Both are legitimately address-less, and for different reasons — worth
     keeping apart rather than exempting as one category. */
  'gb:vendor': 'A licensed third-party index whose vendor and vintage are ' +
               'recorded as still to be established. It has no public address ' +
               'because it is licensed, and no attribution because nobody has ' +
               'named it yet; it supports no published claim.',
  'jp_hokkaido:modelSeed': 'An internal illustrative seed awaiting its ETL feed, ' +
               'not an external document. There is nothing to link to, and the ' +
               'record exists so the placeholder is visible rather than implied.',
};

/** Placeholder shapes that must never reach the register. */
const PLACEHOLDER = /^(?:#|todo|tbd|n\/a|xxx|https?:\/\/(?:example\.(?:com|org)|localhost|127\.0\.0\.1))/i;

/**
 * Validate one source record's URL.
 *
 * @param {string} key    "market:id", used for exemption lookup and messages
 * @param {object} record the source record
 * @returns {string[]} problems; empty means acceptable
 */
export function validateSourceUrl(key, record){
  const problems = [];
  const url = record?.url;

  if (!url){
    /* Absence is allowed only where it has been thought about and named. */
    if (!URL_EXEMPT[key])
      problems.push(`${key} has no url and is not in URL_EXEMPT — add the record with a ` +
                    'reason, or give it an address');
    return problems;
  }

  if (PLACEHOLDER.test(url)){
    problems.push(`${key} has a placeholder url: ${url}`);
    return problems;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    problems.push(`${key} has a malformed url: ${url}`);
    return problems;
  }

  if (parsed.protocol !== 'https:')
    problems.push(`${key} must use https, not ${parsed.protocol.replace(':', '')}`);
  if (!parsed.hostname.includes('.'))
    problems.push(`${key} has no real hostname: ${parsed.hostname}`);
  if (/\s/.test(url))
    problems.push(`${key} url contains whitespace`);

  return problems;
}

/**
 * The registered domain of a URL, for the change-of-domain check.
 *
 * Deliberately crude — last two labels — because the check it feeds is "did the
 * publisher change", and a subdomain move within a publisher is not that.
 */
export function registrableDomain(url){
  try {
    const host = new URL(url).hostname.toLowerCase();
    const parts = host.split('.');
    return parts.slice(-2).join('.');
  } catch { return null; }
}
