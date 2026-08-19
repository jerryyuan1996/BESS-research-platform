/* ---------------------------------------------------------------------------
   SECTION CLAIMS — the schema, and what a machine can and cannot check.

   Every analytical section should open with one sentence saying what it
   ARGUES, not what it contains. That sentence is the most valuable and the
   most dangerous line on the page: it is the part a reader quotes.

   ---------------------------------------------------------------------------
   FOUR THINGS ARE MODELLED SEPARATELY, BECAUSE THEY FAIL SEPARATELY

   READINESS   whether a claim may be published at all
   BASIS       what KIND of assertion it is — measured, forecast, policy, modelled
   PROVENANCE  what the EVIDENCE is — official, third party, developer, unverified
   GAPS        what is missing, kept apart from what supports

   Basis and provenance are orthogonal and were briefly conflated. A modelled
   assertion can rest on official inputs; a measured one can rest on a third
   party's meter data. Folding them into one field would let "official" imply
   "fact" and "modelled" imply "weak", and neither follows.

   AFFIRMATIVE SUPPORT AND DEFICIENCY NEVER SHARE A FIELD. `evidence` holds
   records capable of supporting the claim; `gaps` holds declared coverage-gap
   records. A gap record resolves like any other id, so without this separation
   a claim could cite the absence of evidence AS evidence and pass every check.

   ---------------------------------------------------------------------------
   WHAT THIS MODULE CANNOT ENFORCE, AND MUST NOT PRETEND TO

   Whether the claim is true. Whether the evidence supports it. Whether a causal
   verb is earned. Whether "modest" is the right word for a 9% spread. Those are
   editorial judgements, made by a person, market by market. A test that
   appeared to check them would license skipping the review that actually does.
   --------------------------------------------------------------------------- */

/**
 * Whether a claim may be published, and what it must carry if not.
 *
 * `incomplete` is the state that does the most work: it holds a DRAFTED claim
 * that is not published, together with the records blocking approval. Without
 * it, a section with promising but unverified evidence has only "publish
 * anyway" or "pretend there is nothing to say".
 */
export const READINESS = {
  /** Publishable: claim text, affirmative evidence, no gap or unverified record. */
  SUPPORTED: 'supported',
  /** Drafted, NOT published. Records what is unresolved or unverified. */
  INCOMPLETE: 'incomplete',
  /** No claim text at all. Records the gaps and what would unblock it. */
  BLOCKED: 'blocked',
  /** Deliberate absence: the section is descriptive or referential. */
  NONE: 'none',
};

export const READINESS_LABEL = {
  [READINESS.SUPPORTED]:  ['Supported by section evidence', '有分节证据支持'],
  [READINESS.INCOMPLETE]: ['Drafted — evidence incomplete or unverified', '已起草 — 证据不完整或未核验'],
  [READINESS.BLOCKED]:    ['Blocked by a research gap', '受研究缺口阻断'],
  [READINESS.NONE]:       ['Descriptive or referential — no claim intended', '描述性或索引性 — 不设结论'],
};

/** What kind of assertion the sentence makes. Nothing to do with source quality. */
export const CLAIM_BASIS = {
  MEASURED: 'measured',
  FORECAST: 'forecast',
  POLICY: 'policy',
  MODELLED: 'modelled',
};

/**
 * What the evidence IS. Derived from the record's own status, never asserted by
 * the claim — a claim does not get to promote its own sources.
 */
export const PROVENANCE = {
  OFFICIAL: 'official',
  THIRD_PARTY: 'third-party',
  DEVELOPER: 'developer-reported',
  /** Explicitly flagged as needing re-verification. Cannot support `supported`. */
  UNVERIFIED: 'unverified',
  /** A declared coverage gap. Never affirmative support, for anything. */
  GAP: 'gap',
};

/** Classify one evidence record from its own declared status. */
export function provenanceOf(record){
  const status = record?.status?.[0] ?? '';
  if (/^Not verified/i.test(status)) return PROVENANCE.GAP;
  if (/^Verify against/i.test(status)) return PROVENANCE.UNVERIFIED;
  if (/^Developer-reported/i.test(status)) return PROVENANCE.DEVELOPER;
  if (/^Third[- ]party/i.test(status)) return PROVENANCE.THIRD_PARTY;
  if (/^Official|^Public/i.test(status)) return PROVENANCE.OFFICIAL;
  return PROVENANCE.UNVERIFIED;
}

/** Every evidence record available to a market, keyed by id. */
export const evidenceRecords = (market) => market?.sources?.SRC ?? market?.sources ?? {};
export const evidenceIds = (market) => new Set(Object.keys(evidenceRecords(market)));

/** Ids in a market that are declared coverage gaps rather than sources. */
export function gapIds(market){
  const src = evidenceRecords(market);
  return new Set(Object.keys(src).filter(k => provenanceOf(src[k]) === PROVENANCE.GAP));
}

/* One sentence. A semicolon is how a second one gets smuggled in. */
const SENTENCE = /^[^.!?;]+[.!?]$/;

const isPair = (v) => Array.isArray(v) && typeof v[0] === 'string' && typeof v[1] === 'string';

/**
 * Validate a section claim.
 *
 * @param {object} claim  { readiness, text?, basis?, evidence?, gaps?, external?, reason? }
 * @param {object} market a registry entry — supplies the evidence namespace
 * @param {string} sectionId  the section the claim belongs to
 * @param {Map<string,string>} [ownership]  evidence id -> owning section id.
 *        When absent, the cross-section rules cannot be checked and say so
 *        rather than passing silently.
 * @returns {string[]} problems; empty means mechanically acceptable
 */
export function validateClaim(claim, market, sectionId, ownership){
  const problems = [];
  if (!claim) return problems;                        // absence is a valid state

  if (!Object.values(READINESS).includes(claim.readiness)){
    problems.push('readiness must be one of ' + Object.values(READINESS).join(', '));
    return problems;
  }

  const records = evidenceRecords(market);
  const known = evidenceIds(market);
  const gaps = gapIds(market);
  const marketId = market?.manifest?.id ?? '?';
  const ev = claim.evidence ?? [];
  const gp = claim.gaps ?? [];

  /* ---- text ------------------------------------------------------------- */
  const needsText = claim.readiness === READINESS.SUPPORTED
                 || claim.readiness === READINESS.INCOMPLETE;
  if (needsText){
    if (!isPair(claim.text)) problems.push('a drafted claim needs [en, zh] text');
    else {
      if (!SENTENCE.test(claim.text[0].trim()))
        problems.push('the English claim must be exactly one sentence: ' + claim.text[0].slice(0, 60));
      if (!/[。！？]$/.test(claim.text[1].trim()))
        problems.push('the Chinese claim must end in a full-width stop');
    }
    if (!Object.values(CLAIM_BASIS).includes(claim.basis))
      problems.push('basis must be one of ' + Object.values(CLAIM_BASIS).join(', '));
  } else if (claim.text){
    problems.push(`readiness "${claim.readiness}" must not carry claim text`);
  }

  if ((claim.readiness === READINESS.BLOCKED || claim.readiness === READINESS.NONE)
      && !isPair(claim.reason)){
    problems.push(`readiness "${claim.readiness}" must record a reason in [en, zh]`);
  }

  /* ---- ids resolve ------------------------------------------------------- */
  for (const id of [...ev, ...gp]){
    if (!known.has(id))
      problems.push(`evidence id "${id}" does not resolve in ${marketId} — retired, ` +
                    'mistyped, or belonging to another market');
  }

  /* ---- affirmative support is never a gap -------------------------------- */
  for (const id of ev){
    if (gaps.has(id))
      problems.push(`"${id}" is a declared coverage gap and cannot be affirmative evidence; ` +
                    'move it to gaps[]');
  }
  for (const id of gp){
    if (known.has(id) && !gaps.has(id))
      problems.push(`"${id}" is a source record, not a declared gap; move it to evidence[]`);
  }
  if (gp.length && claim.readiness === READINESS.SUPPORTED)
    problems.push('a supported claim cannot carry gaps[] — it is incomplete or blocked');
  if (gp.length && claim.readiness === READINESS.NONE)
    problems.push('a deliberate absence records a reason, not gaps');

  /* ---- readiness against the provenance actually cited ------------------- */
  if (claim.readiness === READINESS.SUPPORTED){
    if (!ev.length) problems.push('a supported claim must cite affirmative evidence');
    for (const id of ev){
      const p = provenanceOf(records[id]);
      if (p === PROVENANCE.UNVERIFIED)
        problems.push(`"${id}" is flagged for re-verification, so this claim is incomplete, ` +
                      'not supported, until the record is re-checked');
    }
  }
  if (claim.readiness === READINESS.BLOCKED){
    if (!gp.length) problems.push('a blocked claim must name the gap records blocking it');
    if (!isPair(claim.requires))
      problems.push('a blocked claim must state what evidence would unblock it, in [en, zh]');
  }

  /* ---- provenance stays visible ------------------------------------------ */
  /* A third-party or developer-reported record MAY support a claim, but the
     claim must attribute it, so a reader is never told something rests on an
     official source when it rests on a vendor's own figure. */
  const needsAttribution = ev.filter(id =>
    [PROVENANCE.THIRD_PARTY, PROVENANCE.DEVELOPER].includes(provenanceOf(records[id])));
  if (needsAttribution.length && !claim.attribution)
    problems.push('evidence from ' + needsAttribution.join(', ') + ' is third-party or ' +
                  'developer-reported; set attribution so its provenance stays visible');

  /* ---- section ownership and declared external dependencies -------------- */
  const declaredExternal = new Set();
  for (const dep of claim.external ?? []){
    if (!dep.section || !Array.isArray(dep.evidence) || !dep.evidence.length || !dep.why){
      problems.push('an external dependency must name the section, the evidence ids ' +
                    'crossing the boundary, and why they are needed');
      continue;
    }
    for (const id of dep.evidence){
      declaredExternal.add(id);
      if (!ev.includes(id) && !gp.includes(id))
        problems.push(`external declaration cites "${id}", which the claim does not use`);
      if (ownership && ownership.get(id) && ownership.get(id) !== dep.section)
        problems.push(`"${id}" is owned by section "${ownership.get(id)}", not "${dep.section}"`);
    }
  }

  if (ownership){
    for (const id of ev){
      const owner = ownership.get(id);
      if (owner && owner !== sectionId && !declaredExternal.has(id))
        problems.push(`"${id}" belongs to section "${owner}", not "${sectionId}"; declare it ` +
                      'in external[] or cite evidence this section owns');
    }
  }

  return problems;
}

/**
 * Section types that argue nothing by design.
 *
 * Recorded as deliberate so a coverage percentage cannot read them as a to-do
 * list. A methodology page shows the working; a portfolio page is an index.
 */
export const NO_CLAIM_SECTIONS = new Set(['data', 'portfolio']);
