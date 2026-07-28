/* ---------------------------------------------------------------------------
   Quality / provenance badges.

   The prototype had two incompatible signatures for the same visual element:

     cockpit:  badge('calc', ['Calculated from official data', '基于官方数据计算'])
     WA:       badge('calc')            // looked the pair up in WA's T object

   The label text was identical in both. This module keeps one dictionary and
   supports both call styles: badge('calc') resolves from BADGE_LABELS,
   badge('calc', pair) overrides with an explicit label.

   Presentation components must never hardcode source information — a market's
   source register lives in its own sources.js and is rendered through
   sourceDrawer(). These badges classify *quality*, not provenance detail.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

/** Shared badge vocabulary. Every string is byte-identical to the prototype. */
export const BADGE_LABELS = {
  official:   ['Verified official (seed)', '官方已验证（种子）'],
  calc:       ['Calculated from official data', '基于官方数据计算'],
  illus:      ['Illustrative seed — not official', '示例种子 — 非官方'],
  forecast:   ['Forecast', '预测'],
  dev:        ['Developer-reported', '开发商披露'],
  tp:         ['Third-party modelled', '第三方模型'],
  conf:       ['Confidential', '保密'],
  recon:      ['Chart-reconstructed', '图表重构'],
  gross:      ['Gross, not net', '毛值非净值'],
  mismatch:   ['Rule-vintage mismatch', '规则版本不一致'],
  final:      ['Official — Final', '官方 — 最终'],
  draft:      ['Official — Draft', '官方 — 草案'],
  project:    ['Project technical study', '项目技术研究'],
  model:      ['Financial-model assumption', '财务模型假设'],
  contract:   ['Contracted', '已签约'],
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
  'jp-national': ['Japan national', '日本全国机制'],
  'jp-tokyo':    ['Tokyo Area', '东京区域'],
  'jp-kyushu':   ['Kyushu Area', '九州区域'],
  'jp-hokkaido': ['Hokkaido Area', '北海道区域'],
};

/**
 * @param {string} type  CSS modifier and dictionary key
 * @param {[string,string]|string} [label]  explicit override
 */
export function badge(type, label){
  // The GB lineage falls back to the "illustrative" label for an unknown type
  // rather than rendering an empty badge. WA never hits this path.
  const text = label !== undefined ? label : (BADGE_LABELS[type] || BADGE_LABELS.illus);
  return h('span', { class: 'badge ' + type }, L(text));
}

/**
 * Seed vs live-ETL provenance tag.
 * @param {boolean} live
 * @param {string} [seedTag]  each market's own seed identifier; WA's is the default
 */
export function statusBadge(live, seedTag = 'SEED_JSON_V1'){
  return live
    ? h('span', { class: 'badge etl' }, 'LIVE_ETL_REQUIRED')
    : h('span', { class: 'badge seed' }, seedTag);
}

/** Resolves a badge spec that may be a key string or an already-built node. */
export const toBadge = (b) => (typeof b === 'string' ? badge(b) : b);
