/* ---------------------------------------------------------------------------
   WESTERN AUSTRALIA — THE FIVE SECTIONS THAT PUBLISH NOTHING.

   Held out of the runtime bundle: imported by the test suite and by nothing a
   reader downloads. See the note in claims.js for why the boundary exists.

   The full set, published and not, is DISPOSITIONS.
   --------------------------------------------------------------------------- */
import { READINESS, CLAIM_BASIS } from '../../governance/claims.js';
import { CLAIMS } from './claims.js';

export const UNPUBLISHED = {

  /* ---- incomplete: drafted or deferred, not published --------------------- */

  duration: {
    readiness: READINESS.INCOMPLETE,
    basis: CLAIM_BASIS.POLICY,
    evidence: ['esoo'],
    text: [
      'WA’s energy storage duration requirement rises to fourteen trading intervals for 2028/29, so four-hour assets outside the grandfathered cohort no longer meet the full-credit standard.',
      '西澳储能时长要求于2028-29年度提高至十四个交易时段，故不适用祖父条款的四小时资产已不满足全额容量信用标准。',
    ],
    blockedBy: ['aemo-access'],
    note: [
      'Drafted, not published. All four elements — fourteen intervals, the 2028/29 effective period, the grandfathering boundary and the full-credit consequence — are unverified: aemo.com.au returns 403 to an automated fetch and the archive fallback is unreachable. The price determination does not carry the duration requirement.',
      '已起草，未发布。四项要素——十四个交易时段、2028-29适用期、祖父条款边界及全额容量信用后果——均未核验：aemo.com.au对自动抓取返回403，且存档回退不可达。价格裁定文件不包含时长要求内容。',
    ],
  },

  energy: {
    readiness: READINESS.INCOMPLETE,
    basis: CLAIM_BASIS.MEASURED,
    evidence: ['qed'],
    text: [
      'WA discharge spreads fell 74% year-on-year over the same period the storage fleet grew more than fivefold, on a single year of observation.',
      '西澳放电价差同比下降74%，同期储能装机增长逾五倍，观测期仅为一年。',
    ],
    blockedBy: ['aemo-access'],
    note: [
      'Drafted with the causal reading removed — the section prose says spreads collapsed "as the fleet grew", which the evidence does not establish. Neither figure, nor whether the two are measured over comparable periods, has been verified against the quarterly report.',
      '已起草并移除因果表述——章节原文称价差随装机增长而崩塌，现有证据无法支持该因果关系。两项数值本身，以及二者观测期是否可比，均未与季度报告核验。',
    ],
  },

  fcess: {
    readiness: READINESS.INCOMPLETE,
    evidence: ['qed'],
    blockedBy: ['aemo-access'],
    note: [
      'No claim drafted. The revenue and enablement-share figures behind this section have not been read.',
      '未起草结论。本节所依据的收入与投入份额数据尚未阅读。',
    ],
  },

  pipeline: {
    readiness: READINESS.INCOMPLETE,
    evidence: ['mkt'],
    reason: [
      'Source identity unavailable.',
      '来源主体不可考。',
    ],
    note: [
      'The market study has no url and names no author. Its third-party classification requires attribution before it can support a claim, and attribution cannot be produced from the record. Identifying the underlying study is new sourcing and belongs in the research backlog.',
      '该市场研究无网址且未署名作者。其第三方来源分类要求先行标注出处方可支撑结论，而现有记录无法提供该出处。查明原始研究属于新增取证工作，应列入研究待办。',
    ],
  },

  home: {
    readiness: READINESS.INCOMPLETE,
    note: [
      'Dependency-ordered and drafted last. It synthesises six sections, of which three are now supported; a synthesis written over three accepted and three unverified inputs would be a claim about the platform rather than about the market.',
      '按依赖顺序最后起草。本节综合六个分节，其中三项现已获支持；若在三项已确认与三项未核验的基础上撰写综合结论，将成为关于平台自身而非关于市场的论断。',
    ],
  },
};

/** All eight analytical dispositions: the three that publish, and the five that do not. */
export const DISPOSITIONS = { ...CLAIMS, ...UNPUBLISHED };
