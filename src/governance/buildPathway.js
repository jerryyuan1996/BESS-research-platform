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

   AND THERE IS NO SEQUENCE AT ALL, which took two attempts to get right.

   The first draft enforced one order and Finland failed it immediately. The
   second relaxed the rule but kept measuring each market against a reference
   order — corrected prose over an unchanged total-order model, which is worse
   than either, because the implementation quietly contradicted the page.

   A total order cannot represent what Fingrid actually publishes. Finland has
   TWO consent checkpoints binding at two different instruments: environmental
   evidence before the letter of intent, final planning consent before the
   connection agreement. "Consent comes before application" collapses both into
   one claim and loses which artefact gates which document.

   So the model is a PARTIAL ORDER: `prerequisites` are explicit edges saying
   this artefact must be in hand before that instrument. Everything not joined
   by an edge is unordered, which is the honest description of two workstreams
   that overlap. `stages` is presentation order and carries no meaning beyond
   the order rows appear in.

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
 * THE ORDER OF THIS ARRAY IS NOT A CLAIM. It is the order stages are listed in
 * so that two markets' tables can be read side by side; it is not a sequence any
 * project follows and nothing computes on it.
 *
 * What ordering a market actually has lives in `prerequisites` — explicit edges
 * between an artefact and the instrument it gates. See the header for why a
 * total order could not express Finland's two consent checkpoints.
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
    /* Order is NOT checked, because the array order is presentation only —
       ordering lives in `prerequisites`. What IS checked is that a stage appears
       once: the same stage twice is a modelling error, not a market that runs it
       twice. */
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

  /* PREREQUISITES. Optional — a market may genuinely publish no gating rule —
     but every edge declared must resolve, name its artefact, and cite a source.
     An edge pointing at a stage this market does not have is the failure mode
     that would otherwise render as a silently missing annotation. */
  const stageIds = new Set((pathway.stages || []).map(s => s.id));
  for (const edge of pathway.prerequisites || []){
    if (!edge.id) at('a prerequisite has no id');
    if (!stageIds.has(edge.before)) at(`prerequisite ${edge.id}: "before" names a stage this market does not have`);
    if (!stageIds.has(edge.requiresFrom)) at(`prerequisite ${edge.id}: "requiresFrom" names a stage this market does not have`);
    if (edge.before === edge.requiresFrom) at(`prerequisite ${edge.id}: a stage cannot gate itself`);
    if (!isPair(edge.requires)) at(`prerequisite ${edge.id}: requires must be an [en, zh] pair naming the artefact`);
    if (!isPair(edge.instrument)) at(`prerequisite ${edge.id}: instrument must name what cannot be signed without it`);
    if (!edge.sourceKey) at(`prerequisite ${edge.id}: no sourceKey — a gating rule without a citation is folklore`);
  }
  return problems;
}

/**
 * The prerequisite edges a market declares, validated against its own stages.
 *
 * An edge says: the artefact named in `requires`, produced by stage
 * `requiresFrom`, must be in hand before the instrument at stage `before` can be
 * signed. That is the unit Fingrid and Western Power actually publish, and it is
 * finer than "stage A precedes stage B" — Finland gates two different documents
 * on two different artefacts from the same consent stage, which a stage-level
 * ordering cannot say.
 *
 * Absence of an edge means UNORDERED, not simultaneous. Two workstreams with no
 * edge between them may overlap, run in either order, or not overlap at all;
 * what the market has not published, this does not invent.
 */
export function prerequisites(pathway){
  return [...(pathway.prerequisites || [])];
}

/** Edges that gate a given stage. Used by the renderer to annotate a row. */
export function prerequisitesBefore(pathway, stageId){
  return prerequisites(pathway).filter(p => p.before === stageId);
}
