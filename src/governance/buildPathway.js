/* ---------------------------------------------------------------------------
   THE BUILD PATHWAY — how a project actually gets built, as a comparable
   structure.

   This platform answers what a market pays and why a thesis holds. It has never
   answered what a sponsor DOES: in what order, with whom, and what each step can
   stop. That is the question that separates a research dashboard from something
   a development team can act on, and it is the gap this vocabulary closes.

   ---------------------------------------------------------------------------
   NINE STAGES FIXED, THE ORDER NOT

   Every market describes its own process in its own words, and left alone they
   are incomparable — Fingrid's "letter of intent" and Western Power's "access
   offer" are not the same instrument, and neither is a "connection agreement".
   Mapping all of them onto ONE VOCABULARY is what makes two markets legible side
   by side, and it is the same trick the comparison interface plays on revenue.

   But the SEQUENCE is market-specific and must stay that way. Finland gates the
   letter of intent on environmental evidence and the connection agreement on
   final planning consent; Western Australia permits more of the same work to
   proceed in parallel. An earlier draft enforced a single order, Finland failed
   it immediately, and the failure was the model's rather than Finland's — a
   schema that normalises away where the gates bind destroys the most useful
   thing this section has to say.

   The vocabulary is deliberately coarse. A market that needs a tenth stage is
   telling you something about the market, and should say it in `note` rather
   than inventing a stage nobody else has.

   ---------------------------------------------------------------------------
   WHAT THIS IS NOT, AND THE LIMIT IS LOAD-BEARING

   Correspondence between a developer and a network operator is not public.
   Nothing here is a disclosed queue position, a negotiated date or a private
   study result. Every stage is reconstructed from:

     · the statutory instrument or published rule that governs it
     · the operator's own published process pages
     · durations INFERRED from announcements and regulator decisions

   That third source is the weak one and it is marked as such. `duration` is a
   range in months and it is an observation about projects that have been
   announced, not a commitment anyone has made. A market whose durations rest on
   a handful of press releases says so in `durationBasis`.

   THIS CONTENT IS ANALYST-CONTROLLED. Under the governance model no ETL job and
   no automated agent may write or amend a pathway. If observed durations are
   ever ingested they enter as a separate observed series shown beside the
   framework, never merged into it.
   --------------------------------------------------------------------------- */

/**
 * The canonical spine: WHICH STAGES EXIST, not what order a market runs them in.
 *
 * The first draft enforced this order and Finland immediately failed it, which
 * was the validator being right and the model being wrong. Finland shows consent
 * before the connection application because Fingrid gates on it twice — the
 * letter of intent on environmental evidence, the connection agreement on final
 * planning consent — while Western Australia permits more of the two to run in
 * parallel. That difference is not noise to be normalised away; it is the most
 * useful thing a sponsor moving between the two markets could be told, and a
 * schema that forbade it would have hidden it.
 *
 * So the spine fixes the vocabulary and each market declares its own sequence.
 * The listed order below is the REFERENCE, used by `orderDeviation()` to say how
 * a market departs from it; departures are findings, not errors.
 *
 * Some stages also run PARALLEL rather than sequentially. `parallelWith` says so
 * explicitly, because a reader summing nine durations would otherwise get a
 * programme nobody has ever run.
 */
export const STAGES = [
  'site',        // site control, land rights, land-use status
  'application', // the connection application itself
  'studies',     // studies and the connection offer that comes out of them
  'consent',     // planning and environmental consent
  'compliance',  // grid code compliance and performance standards
  'revenue',     // capacity certification or reserve prequalification
  'procurement', // equipment and EPC contracting
  'construction',
  'entry',       // commissioning, registration, market entry
];

export const STAGE_LABEL = {
  site:         ['Site control and land', '场址控制与土地'],
  application:  ['Connection application', '并网申请'],
  studies:      ['Studies and connection offer', '研究与并网要约'],
  consent:      ['Planning and environmental consent', '规划与环境许可'],
  compliance:   ['Grid code compliance', '电网规范符合性'],
  revenue:      ['Revenue qualification', '收入资格取得'],
  procurement:  ['Procurement and EPC', '采购与EPC'],
  construction: ['Construction', '建设'],
  entry:        ['Commissioning and market entry', '调试与市场准入'],
};

/**
 * Who the stage is actually with. This is the field a development team reads
 * first, because it answers "who can stop me" — and the answer is rarely the
 * party a market's marketing suggests.
 */
export const OWNER = {
  SPONSOR:    'sponsor',      // within the developer's own control
  TSO:        'tso',          // transmission system operator
  DSO:        'dso',          // distribution system operator
  REGULATOR:  'regulator',    // economic or market regulator
  GOVERNMENT: 'government',   // planning, environmental, consenting authority
  MARKET:     'market',       // a market operator or exchange
  COUNTERPARTY: 'counterparty', // EPC, OEM, offtaker
};

export const OWNER_LABEL = {
  [OWNER.SPONSOR]:      ['Sponsor', '投资方'],
  [OWNER.TSO]:          ['Transmission operator', '输电运营商'],
  [OWNER.DSO]:          ['Distribution operator', '配电运营商'],
  [OWNER.REGULATOR]:    ['Regulator', '监管机构'],
  [OWNER.GOVERNMENT]:   ['Consenting authority', '许可审批机关'],
  [OWNER.MARKET]:       ['Market operator', '市场运营机构'],
  [OWNER.COUNTERPARTY]: ['Counterparty', '交易对手'],
};

/**
 * How well the DURATION is known. Separate from the stage's own evidence,
 * because the rule governing a stage is usually published and how long it takes
 * in practice usually is not.
 */
export const DURATION_BASIS = {
  /** A statutory or published timeframe the operator commits to. */
  PUBLISHED: 'published',
  /** Inferred from dated announcements or regulator decisions. */
  OBSERVED: 'observed',
  /** Sector convention. The weakest, and it says so on the page. */
  CONVENTION: 'convention',
};

export const DURATION_BASIS_LABEL = {
  [DURATION_BASIS.PUBLISHED]:  ['Published timeframe', '公布时限'],
  [DURATION_BASIS.OBSERVED]:   ['Inferred from announcements', '据公告推断'],
  [DURATION_BASIS.CONVENTION]: ['Sector convention', '行业惯例'],
};

const isPair = (v) => Array.isArray(v) && v.length >= 2 && typeof v[0] === 'string';

/**
 * Problems with one market's pathway. Empty array means valid.
 *
 * Deliberately strict about two things that would otherwise rot quietly: every
 * stage must be one of the nine and must appear once; and every stage must name
 * a duration basis, so nobody can publish a range whose provenance is unstated.
 * Deliberately silent about sequence — see STAGES.
 */
export function validateBuildPathway(pathway){
  const problems = [];
  const at = (m) => problems.push(`${pathway?.marketId || '?'}: ${m}`);

  if (!pathway || !pathway.marketId) return ['pathway has no marketId'];
  if (!isPair(pathway.summary)) at('summary must be an [en, zh] pair');
  if (!isPair(pathway.limit)) at('limit must be an [en, zh] pair — what the pathway does NOT know is not optional');
  if (!Array.isArray(pathway.stages) || !pathway.stages.length) return [...problems, `${pathway.marketId}: no stages`];

  const seen = new Set();
  for (const stage of pathway.stages){
    const index = STAGES.indexOf(stage.id);
    if (index < 0){ at(`unknown stage "${stage.id}" — the vocabulary is fixed, see STAGES`); continue; }
    /* Order is NOT checked. A market declares its own sequence and a departure
       from the reference order is a finding — see orderDeviation(). What is
       checked is that a stage appears once: the same stage twice is a modelling
       error, not a market that does it twice. */
    if (seen.has(stage.id)) at(`stage "${stage.id}" appears more than once`);
    seen.add(stage.id);

    if (!Object.values(OWNER).includes(stage.owner)) at(`${stage.id}: unknown owner "${stage.owner}"`);
    if (!isPair(stage.instrument)) at(`${stage.id}: instrument must be an [en, zh] pair naming the rule that governs it`);
    if (!isPair(stage.gate)) at(`${stage.id}: gate must be an [en, zh] pair — what decision ends this stage`);
    if (!Object.values(DURATION_BASIS).includes(stage.durationBasis)){
      at(`${stage.id}: durationBasis must say where the range came from`);
    }
    if (stage.months !== null){
      if (!Array.isArray(stage.months) || stage.months.length !== 2) at(`${stage.id}: months must be [min, max] or null`);
      else if (!(stage.months[0] <= stage.months[1])) at(`${stage.id}: months range is inverted`);
    }
    if (stage.parallelWith && STAGES.indexOf(stage.parallelWith) < 0){
      at(`${stage.id}: parallelWith names an unknown stage`);
    }
    if (!stage.sourceKey) at(`${stage.id}: no sourceKey — every stage cites the register entry behind it`);
  }
  return problems;
}

/**
 * How a market's sequence departs from the reference order.
 *
 * Returns the stages that run earlier than the reference expects, each with what
 * it now precedes. Empty means the market follows the conventional order.
 *
 * This exists to be RENDERED, not merely asserted: "consent precedes
 * application" is the sentence a sponsor needs, and computing it from the data
 * means it cannot drift out of step with the stages the page draws.
 */
export function orderDeviation(pathway){
  const actual = (pathway.stages || []).map(s => s.id).filter(id => STAGES.includes(id));
  const out = [];
  for (let i = 0; i < actual.length; i++){
    for (let j = i + 1; j < actual.length; j++){
      /* A pair is inverted when the market runs `later` before `earlier`
         relative to the reference order. */
      if (STAGES.indexOf(actual[i]) > STAGES.indexOf(actual[j])){
        out.push({ runsEarlier: actual[i], insteadOf: actual[j] });
      }
    }
  }
  return out;
}

/**
 * Total elapsed months, treating parallel stages as overlapping rather than
 * additive.
 *
 * A nine-stage list summed naively describes a programme nobody has run, which
 * is the single most likely way this data gets misread. Stages declaring
 * `parallelWith` contribute nothing to the total; the stage they run alongside
 * carries the time.
 */
export function pathwayMonths(pathway){
  const sequential = (pathway.stages || []).filter(s => !s.parallelWith && Array.isArray(s.months));
  if (!sequential.length) return null;
  return {
    min: sequential.reduce((a, s) => a + s.months[0], 0),
    max: sequential.reduce((a, s) => a + s.months[1], 0),
    counted: sequential.length,
    parallel: (pathway.stages || []).filter(s => s.parallelWith).length,
  };
}
