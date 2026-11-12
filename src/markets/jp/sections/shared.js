/* ---------------------------------------------------------------------------
   Japan — the constants and helpers every section reads.

   Lifted verbatim from the prelude of the single-file sections.js. BUILT FROM
   `api`, NOT IMPORTED: `O` is `M.official` and `M` is the market dataset,
   which the engine already holds. Importing data.js here would put 20+ kB into
   every section chunk, or hoist it into a chunk the landing tab also pays for.

   `SEC_B` and `SECTIONS()` are kept in the copied text because they are part
   of the prelude, but they are unused here: the facade owns the section map,
   and each section module owns its own local `SEC_B`.
   --------------------------------------------------------------------------- */

/**
 * @param {object} api  supplied by src/markets/_shared/engine.js
 * @returns {object} O, N, RG, R, path, jpy, jpyM, perRegion, regionTable, regionBadge, lensNote, seedGate, casePerRegion
 */
export function createShared(api){
  const {
    h, L, M, SRC, T, state, GLOSS_CORE,
    fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX,
    liveScore, bandFor, durationAt, interp,
    lensRegions, isCompare, region,
  } = api;

  const O = M.official;
  const N = M.national;
  const RG = M.regions;

  // ---- helpers ----------------------------------------------------------
  const R = (id) => RG[id];
  const path = (id, key) => 'regions.' + id + '.' + key;
  const jpy = (v) => '¥' + fmtN(v);
  const jpyM = (v) => '¥' + fmt1(v / 1e6) + 'M';

  /** Card body per region: three columns in compare mode, one expanded otherwise. */
  function perRegion(makeCard){
    const rs = lensRegions();
    if (rs.length === 1) return Object.assign({ t: 'card' }, makeCard(rs[0]));
    return { t: 'g3', cards: rs.map(makeCard) };
  }

  /** A three-column table with one column per region in view. */
  function regionTable(headLabel, rows){
    const rs = lensRegions();
    return {
      t: 'table',
      head: [headLabel].concat(rs.map(id => L(R(id).short))),
      num: rs.map((_, i) => i + 1),
      rows: rows.map(r => [r.l].concat(rs.map(id => r.f(id)))),
    };
  }

  const regionBadge = (id) => ({
    tokyo: 'jp-tokyo', kyushu: 'jp-kyushu', hokkaido: 'jp-hokkaido',
  })[id];

  const lensNote = () => (isCompare()
    ? { t: 'sub', text: ['Comparing all three regions. National rules are shown once, at full width.',
                         '正在对比三个区域。全国性规则仅完整显示一次。'] }
    : { t: 'sub', text: [L(R(region()).area) + ' lens — national context stays visible below.',
                         L(R(region()).area) + '视角 — 下方仍保留全国背景。'] });

  const seedGate = {
    t: 'warn',
    text: ['Economics on this page are illustrative seed. Structural facts — Capacity Market prices, curtailment days, study caps, interconnector capacity — are verified against the cited sources; capex, merchant margin, incremental balancing value, the expected-capacity factor and the auction-renewal curve are not. See Data & Methodology for the ETL gates.',
           '本页经济性数值为示例种子。结构性事实 — 容量市场价格、弃电天数、并网检讨上限、联络线容量 — 已对照所引来源核验；造价、市场化收益、调整力增量价值、期待容量系数及拍卖续约曲线尚未核验。ETL门槛见“数据与方法”页。'],
  };

  // =======================================================================
  const SEC_B = {};
  function SECTIONS(){
    const o = {};
    Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
    return o;
  }

  // ============================== OVERVIEW ==============================
const casePerRegion = (block) => lensRegions().flatMap(id => [
    { t: 'sub', text: R(id).area },
    { t: block, marketId: 'jp_' + id },
  ]);
  return { O, N, RG, R, path, jpy, jpyM, perRegion, regionTable, regionBadge, lensNote, seedGate, casePerRegion };
}
