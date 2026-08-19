/* ---------------------------------------------------------------------------
   SECTION CLAIMS — the schema, and what a machine can and cannot check.

   Every analytical section should open with one sentence saying what it
   ARGUES, not what it contains. That sentence is the most valuable and the
   most dangerous line on the page: it is the part a reader quotes.

   ---------------------------------------------------------------------------
   WHAT THIS MODULE ENFORCES

   Only the mechanical properties, and it says so loudly because the gap
   between "validated" and "sound" is exactly where a bad claim survives:

     · one sentence, so a claim cannot become a paragraph of hedging;
     · every evidence id resolves to a record in the section's own market —
       a retired or mistyped id fails rather than rendering an unsupported
       sentence with a confident full stop;
     · evidence cited from outside the section declares that dependency;
     · a claim that rests on a forecast, a policy target or an illustrative
       calculation declares its basis, so the reader is told what kind of thing
       it is before they act on it.

   ---------------------------------------------------------------------------
   WHAT IT CANNOT ENFORCE, AND MUST NOT PRETEND TO

   Whether the claim is true. Whether the evidence actually supports it.
   Whether a causal verb is earned. Whether "modest" is the right word for a
   9% spread. Those are editorial judgements, made by a person, market by
   market. A test that appeared to check them would license skipping the review
   that actually does.

   So: this file blocks what is checkably wrong, and the review does the rest.
   --------------------------------------------------------------------------- */

/** What kind of thing the claim rests on. Declared, never inferred. */
export const CLAIM_BASIS = {
  /** Observed, published, and final. The strongest thing a claim can stand on. */
  MEASURED: 'measured',
  /** A published forecast. The claim must read as a forecast, not as fact. */
  FORECAST: 'forecast',
  /** A policy target or announced intent, which is not a financed pipeline. */
  POLICY: 'policy',
  /** This platform's own calculation over declared inputs. */
  MODELLED: 'modelled',
};

/** Readiness of a section to carry a claim at all. */
export const READINESS = {
  SUPPORTED: 'supported',
  INCOMPLETE: 'incomplete',
  NOT_APPLICABLE: 'not-applicable',
  BLOCKED: 'blocked',
};

export const READINESS_LABEL = {
  [READINESS.SUPPORTED]: ['Claim supported by current section evidence', '现有分节证据可支持结论'],
  [READINESS.INCOMPLETE]: ['Claim possible, evidence incomplete or stale', '可提出结论，但证据不完整或已过时'],
  [READINESS.NOT_APPLICABLE]: ['Descriptive or referential — no claim intended', '描述性或索引性 — 不设结论'],
  [READINESS.BLOCKED]: ['Blocked by an identified research gap', '受既有研究缺口阻断'],
};

/* One sentence. Ends once, and does not smuggle a second in behind a
   semicolon — a claim a reader can only half-quote is not one sentence. */
const SENTENCE = /^[^.!?;]+[.!?]$/;

/**
 * Validate a claim against the market whose section carries it.
 *
 * @param {object} claim   { text:[en,zh], evidence:string[], basis, external?, note? }
 * @param {object} market  a registry entry; its sources supply the id namespace
 * @returns {string[]} problems; empty means mechanically acceptable
 */
export function validateClaim(claim, market){
  const problems = [];
  if (!claim) return problems;                       // absence is a valid state

  const text = claim.text;
  if (!Array.isArray(text) || !text[0] || !text[1]){
    problems.push('a claim needs [en, zh] text');
  } else {
    if (!SENTENCE.test(text[0].trim()))
      problems.push('the English claim must be exactly one sentence: ' + text[0].slice(0, 60));
    /* Chinese uses a full-width stop and no space before it. */
    if (!/[。！？]$/.test(text[1].trim()))
      problems.push('the Chinese claim must end in a full-width stop');
  }

  if (!Object.values(CLAIM_BASIS).includes(claim.basis))
    problems.push('basis must be one of ' + Object.values(CLAIM_BASIS).join(', ') +
                  ' — a reader must be told whether this is measured, forecast, policy or modelled');

  const known = evidenceIds(market);
  if (!Array.isArray(claim.evidence) || !claim.evidence.length){
    problems.push('a claim must cite at least one evidence id');
  } else {
    for (const id of claim.evidence){
      if (!known.has(id))
        problems.push(`evidence id "${id}" does not resolve in ${market?.manifest?.id ?? '?'} — ` +
                      'it is retired, mistyped, or belongs to another market');
    }
  }

  /* Evidence borrowed from another section is allowed and must be declared, so
     a reader following the claim knows where to look and a later edit to that
     other section cannot silently undermine this one. */
  if (claim.external?.length){
    for (const dep of claim.external){
      if (!dep.section || !dep.why)
        problems.push('an external dependency must name the section and why it is needed');
    }
  }

  return problems;
}

/** Every evidence id available to a market, as a set. */
export function evidenceIds(market){
  const src = market?.sources?.SRC ?? market?.sources ?? {};
  return new Set(Object.keys(src));
}

/**
 * Section types that are descriptive or referential by nature.
 *
 * These are NOT failures of coverage. A methodology page argues nothing — it
 * shows the working — and a portfolio page is an index. Recording them as
 * deliberate keeps a coverage percentage from being read as a to-do list.
 */
export const NO_CLAIM_SECTIONS = new Set(['data', 'portfolio']);

/** First-pass readiness for a section, refined by human review. */
export function defaultReadiness(tabId){
  return NO_CLAIM_SECTIONS.has(tabId) ? READINESS.NOT_APPLICABLE : READINESS.INCOMPLETE;
}
