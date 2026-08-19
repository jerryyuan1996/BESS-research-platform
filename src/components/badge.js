/* ---------------------------------------------------------------------------
   BADGES CARRY STATE. EVERYTHING ELSE IS TEXT.

   A badge is a bounded categorical state a reader needs to scan or compare at a
   glance. Before this pass the same chip shape was carrying four different jobs
   — state, provenance, methodology and explanatory qualification — and 674 of
   the 1,378 chips on the platform were the two most common kinds of provenance.
   A page that labels everything labels nothing.

   The vocabulary is now three groups, and the group decides the rendering.

   WARNING (highest priority). Illustrative output, an instruction to re-verify,
   confidential handling, superseded material. These change what a reader is
   allowed to DO with the number.

   STATE (normal priority). Forecast, draft, final, consultation, allocation
   area. Concise operating or publication states, worth comparing across blocks.

   DEMOTED. Provenance, methodology and descriptive qualification. These are not
   deleted — they are rendered as a labelled note, "Source: …", "Method: …",
   "Basis: …", "Context: …", "Scope: …", so the metadata survives and stops
   competing with the states for attention.

   DEMOTION HAPPENS HERE, NOT AT THE CALL SITE. Six hundred call sites keep
   saying `badge('official')`; what changes is what that produces. The
   alternative — editing every site — would have been a very large diff in which
   a single missed conversion is invisible.

   RENDERING NEVER DEPENDS ON COLOUR. A warning badge carries a leading glyph
   and the word itself; a state badge carries the word. Both are readable in
   grayscale, in forced-colours mode and by a screen reader, which is given the
   priority explicitly rather than being left to infer it from a class name.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

/** Highest priority: these change what a reader may do with the number. */
export const WARNING_BADGES = new Set(['illus', 'verify', 'conf', 'superseded']);

/** Normal priority: concise operating or publication state. */
export const STATE_BADGES = new Set([
  'forecast', 'final', 'draft', 'consult',
  'jp-tokyo', 'jp-kyushu', 'jp-hokkaido',
]);

/**
 * Types that are no longer badges, and the label each is rendered under.
 *
 * `policy` is deliberately "Scope" rather than "Context": it exists to stop a
 * policy target being read as a financed pipeline, so it sits beside the figure
 * as a qualification rather than sinking into prose.
 */
export const DEMOTED_BADGES = {
  official: ['Source', '来源'],
  public:   ['Source', '来源'],
  supp:     ['Source', '来源'],
  dev:      ['Source', '来源'],
  tp:       ['Source', '来源'],
  project:  ['Source', '来源'],
  calc:     ['Method', '方法'],
  recon:    ['Method', '方法'],
  model:    ['Basis', '口径'],
  peer:     ['Context', '背景'],
  nem:      ['Context', '背景'],
  policy:   ['Scope', '适用范围'],
};

export const BADGE_LABELS = {

  official:   ['Verified official source', '已核验官方来源'],
  calc:       ['Calculated from official data', '基于官方数据计算'],
  illus:      ['Illustrative — not official', '示例数据 — 非官方'],
  forecast:   ['Forecast', '预测'],
  dev:        ['Developer-reported', '开发商披露'],
  tp:         ['Third-party modelled', '第三方模型'],
  conf:       ['Confidential', '保密'],
  recon:      ['Chart-reconstructed', '图表重构'],
  final:      ['Official — Final', '官方 — 最终'],
  draft:      ['Official — Draft', '官方 — 草案'],
  project:    ['Project technical study', '项目技术研究'],
  model:      ['Financial-model assumption', '财务模型假设'],
  superseded: ['Superseded', '已被替代'],
  supp:       ['Supplementary source', '补充来源'],
  nem:        ['NEM namespace — context only', 'NEM命名空间 — 仅背景'],
  public:     ['Public source', '公开来源'],

  // Added by the GB/IE/RO/PL lineage. WA never emits these; the union is what
  // lets both lineages share one dictionary instead of carrying two.
  policy:     ['Policy target — not financed pipeline', '政策目标 — 非已融资管线'],
  verify:     ['Verify against current documents', '须以现行文件核验'],
  consult:    ['Consultation — not final policy', '征询阶段 — 非最终政策'],
  peer:       ['Peer namespace — context only', '同业命名空间 — 仅背景'],

  // Regional-lens labels for multi-region markets. A block carrying one of these
  // is showing area-specific data; anything without one is national.
  'jp-tokyo':    ['Tokyo Area', '东京区域'],
  'jp-kyushu':   ['Kyushu Area', '九州区域'],
  'jp-hokkaido': ['Hokkaido Area', '北海道区域'],
};

/**
 * @param {string} type  CSS modifier and dictionary key
 * @param {[string,string]|string} [label]  explicit override
 */
/** A demoted type rendered as a labelled note rather than a chip. */
function demotedNote(type, label){
  const kind = DEMOTED_BADGES[type];
  const text = label !== undefined ? label : BADGE_LABELS[type];
  return h('span', { class: 'meta-note meta-' + type },
    h('span', { class: 'meta-kind' }, L(kind) + ': '),
    h('span', { class: 'meta-value' }, L(text)));
}

/**
 * @param {string} type  CSS modifier and dictionary key
 * @param {[string,string]|string} [label]  explicit override
 */
export function badge(type, label){
  if (DEMOTED_BADGES[type]) return demotedNote(type, label);

  const known = WARNING_BADGES.has(type) || STATE_BADGES.has(type);
  if (!known){
    /* FAIL LOUDLY RATHER THAN FALL BACK.

       The previous version rendered an unknown type using the "illustrative"
       label, which meant a typo produced a plausible chip saying something the
       author never wrote. It also meant a demoted type could be reintroduced by
       simply passing a new string. An unrecognised type is now a mistake, and
       the message says which group the author probably wanted. */
    throw new Error(
      `unknown badge type "${type}". Add it to WARNING_BADGES or STATE_BADGES ` +
      'if it is a bounded state, or to DEMOTED_BADGES if it is provenance, ' +
      'methodology or a qualification. See src/components/badge.js.');
  }

  const warning = WARNING_BADGES.has(type);
  const text = label !== undefined ? label : BADGE_LABELS[type];

  /* The priority is announced, not implied by colour. A screen reader hears
     "Warning: illustrative, not official" rather than a bare fragment whose
     weight it cannot see. */
  return h('span', {
    class: 'badge ' + type + (warning ? ' badge-warning' : ' badge-state'),
    'data-priority': warning ? 'warning' : 'state',
  },
    warning ? h('span', { class: 'badge-glyph', 'aria-hidden': 'true' }, '\u26A0 ') : null,
    h('span', { class: 'sr-only' }, warning ? L(['Warning: ', '警告：']) : ''),
    L(text));
}

/**
 * Whether a block's numbers are the approved base case or are waiting on a feed.
 *
 * This used to print the raw identifiers — `SEED_JSON_V1`, `GB_SEED_V1`,
 * `LIVE_ETL_REQUIRED` — straight onto the page. They are internal build tags,
 * and a reader who does not work on this codebase cannot tell whether
 * `LIVE_ETL_REQUIRED` means the number is live, is stale, or is broken.
 *
 * The distinction they were drawing is real and worth keeping, so the badge
 * stays; only the words change. The market's own tag is still accepted, because
 * every market passes one and `mkt.js` is not the place to litigate vocabulary,
 * but it identifies a build rather than telling a reader anything and so is no
 * longer rendered. It belongs on the Data & Methodology tab with the rest of the
 * provenance detail.
 *
 * @param {boolean} live   true when this block is waiting on an automated feed
 * @param {string} [seedTag]  the market's build tag. Accepted, not displayed.
 */
export function statusBadge(live, seedTag){          // eslint-disable-line no-unused-vars
  /* Both are normal-priority publication states, so they carry the same tier
     markup as any other state badge rather than a bespoke shape. "Live feed
     pending" is not a warning: the number shown is the approved base case, and
     treating it as an alarm would spend the reader's attention on a state that
     requires nothing of them. */
  return live
    ? h('span', { class: 'badge etl badge-state', 'data-priority': 'state' },
        L(['Live feed pending', '实时数据待接入']))
    : h('span', { class: 'badge seed badge-state', 'data-priority': 'state' },
        L(['Base case', '基准情景']));
}

/** Resolves a badge spec that may be a key string or an already-built node. */
export const toBadge = (b) => (typeof b === 'string' ? badge(b) : b);
