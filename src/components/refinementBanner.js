import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { chip } from './chip.js';

const CONSENSUS = {
  aligned: ['Aligned with review', '与复核一致'],
  more_bullish: ['Dashboard more bullish', '看板偏乐观'],
  stale: ['Fact set corrected', '事实集已更正'],
};

const CHIP = { aligned: 'good', more_bullish: 'serious', stale: 'warn' };

export function refinementBanner(market){
  const profile = market?.comparison?.refinement;
  if (!profile) return null;

  const gate = profile.investmentGate?.[0] || 'Project-level evidence';
  return h('section', { class: 'card refinement-banner', style: 'margin:10px 0 14px;' },
    h('div', { style: 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:7px;' },
      chip('serious', ['Screening only', '仅供筛选']),
      chip(CHIP[profile.consensus?.status] || 'info', CONSENSUS[profile.consensus?.status] || ['Review required', '需要复核']),
      h('span', { class: 'muted', style: 'font-size:11px;' }, L(['Reviewed ', '复核日期 ']) + profile.reviewDate)),
    h('div', { style: 'font-size:13px;line-height:1.55;' }, L(profile.currentUpdate)),
    h('div', { class: 'note', style: 'margin:9px 0 0;' },
      h('b', {}, L(['Next approval gate: ', '下一审批门槛：'])), gate,
      ' · ',
      h('b', {}, L(['Evidence confidence: ', '证据置信度：'])), profile.confidenceScore + '/10',
      ' · ',
      L(profile.pipeline?.eligible
        ? ['Pipeline passes the global inclusion contract.', '项目管线通过全局纳入规则。']
        : ['Pipeline is excluded from decision metrics until coverage and de-duplication are evidenced.', '在覆盖率及去重得到证明前，项目管线不计入决策指标。'])));
}
