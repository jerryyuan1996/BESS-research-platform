import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money, multiple, returnPct } from './model.js';
import { labField } from '../comparison/ranges.js';
import { REVENUE_EVIDENCE_LABEL } from '../governance/revenueEvidence.js';
import { fixedIncomeByEvidence } from './riskData.js';
import { chartFigure, chartSVG, chartTable, linePlot, seriesInspector, svgEl, svgText, exactMoney } from './riskChart.js';

const pp = value => Number.isFinite(value) ? (value>=0?'+':'')+(value*100).toFixed(2)+L([' pp',' 个百分点']) : 'N/M';
const evidenceLabel = value => value==='sourced'?['Sourced','有来源']:['Assumed','假设'];
const endpoint = end => end==='min'?['Lower input','输入下限']:['Upper input','输入上限'];
function inputValue(key,value,currency,scale=1) {
  const unit=labField(key)?.unit;
  return unit==='cur'?money(value*scale,currency):unit==='pct'?value+'%':unit==='frac'?(value*100).toFixed(1)+'%':
    value+(unit==='mo'?L([' months',' 个月']):unit==='yr'?L([' years',' 年']):'');
}
export function tornadoChart(factors, baseIRR, currency, scale=1) {
  const title=['Ranked single-factor sensitivity','单因素敏感性排序'];
  const desc=['Largest absolute change in all-equity hold IRR first. Each endpoint changes one input only; all other inputs stay at base. Effects are not added together.',
    '按全股权长持 IRR 相对基准的最大绝对变化排序。每个端点只改变一项输入，其余保持基准；各因素影响不能相加。'];
  const box=chartFigure('tornado',title,desc),max=Math.max(.0001,...factors.map(f=>f.effect||0));
  box.append(h('p',{class:'ix-risk-readout'},L(['Base all-equity IRR: ','基准全股权 IRR：']),returnPct(baseIRR)));
  for(const f of factors) {
    const label=labField(f.key)?.label||[f.key,f.key],ends=f.ends.map(e=>({...e,text:L(endpoint(e.end))+' '+inputValue(f.key,e.value,currency,scale)+' → '+returnPct(e.hold)+' ('+pp(e.delta)+')'}));
    const svg=chartSVG(label,[ends.map(e=>e.text).join('; '),ends.map(e=>e.text).join('；')],'0 0 440 82');
    const x=v=>220+v/max*198;
    svg.append(svgEl('line',{x1:220,x2:220,y1:2,y2:60,class:'ix-risk-zero'}));
    svg.append(svgText(220,78,L(['Base','基准']),{'text-anchor':'middle'}));
    ends.forEach((e,i)=>{
      if(!Number.isFinite(e.delta))return;
      const at=x(e.delta),cy=17+i*28;
      svg.append(svgEl('rect',{x:Math.min(220,at),y:cy-8,width:Math.max(1,Math.abs(at-220)),height:16,class:e.delta<0?'ix-risk-down':'ix-risk-up'}),
        svgEl('circle',{cx:at,cy,r:3,fill:'currentColor'}));
    });
    const row=h('section',{class:'ix-tornado-factor','data-factor':f.key,'data-effect':f.effect??'','data-evidence':f.evidence},
      h('h4',{},L(label),h('span',{class:'ix-risk-badge'},L(evidenceLabel(f.evidence)))),svg,
      h('div',{class:'ix-risk-endpoints'},ends.map(e=>h('p',{tabindex:0},e.text))));
    const detail=chartTable(label,[['Endpoint','端点'],['Input','输入'],['All-equity IRR','全股权 IRR'],['Change','变化']],
      ends.map(e=>[endpoint(e.end),inputValue(f.key,e.value,currency,scale),returnPct(e.hold),pp(e.delta)]));
    detail.append(h('p',{class:'ix-caption'},L(f.band.basis||['Band basis not supplied.','未提供区间依据。'])),
      h('p',{class:'ix-caption'},L(['Source: ','来源：']),L(f.band.source||['Not supplied','未提供'])));
    row.append(detail);box.append(row);
  }
  return box;
}

export function debtCoverChart(investment) {
  const l=investment?.leverage;
  if(!l?.coverByYear?.length)return null;
  const title=['Debt cover by operating year','逐运营年偿债覆盖'];
  const desc=['Cash available ÷ scheduled debt service, before the balloon, on the same basis as the published minimum. Dashed lines are loan-sizing thresholds. No ratio is shown after scheduled debt service ends.',
    '可用现金流 ÷ 计划还本付息，不含到期尾款，与已公布最低值口径相同。虚线为贷款测算门槛；计划偿债结束后不显示倍数。'];
  const thresholds=[
    ...(Number.isFinite(l.contractedDSCR)?[{value:l.contractedDSCR,label:L(['Contracted sizing threshold','合同收入测算门槛'])}]:[]),
    {value:l.merchantDSCR,label:L(['Merchant sizing threshold','市场收入测算门槛'])}];
  const points=l.coverByYear.map(y=>({at:y.year,value:y.dscr})),box=chartFigure('dscr',title,desc);
  box.append(h('p',{class:'ix-risk-readout'},L(['Minimum annual DSCR: ','最低年度 DSCR：']),multiple(l.minCover)),
    linePlot(title,desc,points,multiple,{thresholds}),
    h('p',{class:'ix-caption'},L(['Operating year · coverage in multiples','运营年度 · 覆盖倍数'])),
    h('div',{class:'ix-risk-legend'},thresholds.map((t,i)=>h('span',{class:'threshold-'+i},t.label+' '+multiple(t.value)))),
    seriesInspector(points,['Inspect an operating year','选择运营年度'],p=>L(['Year ','第 '])+p.at+L([' · ',' 年 · '])+(Number.isFinite(p.value)?multiple(p.value):L(['No scheduled debt service','无计划还本付息']))),
    chartTable(title,[['Operating year','运营年'],['DSCR','偿债覆盖倍数'],...thresholds.map(t=>t.label)],points.map(p=>[p.at,Number.isFinite(p.value)?multiple(p.value):['No scheduled debt service','无计划还本付息'],...thresholds.map(t=>multiple(t.value))])));
  return box;
}

export function incomeEvidenceChart(investment) {
  if(!investment?.bridge)return null;
  const split=fixedIncomeByEvidence(investment),title=['Year-one fixed income by evidence','首年固定收入的证据分类'];
  const desc=['Modelled fixed income is not confirmation of a project contract. The existing model gives this income pool one evidence class; no component split is inferred.',
    '模型固定收入不代表项目合同已确认。现有模型为这组收入提供一个证据类别，不推定内部拆分。'];
  const box=chartFigure('income-evidence',title,desc),unit=split.currency+' / MW',name=c=>REVENUE_EVIDENCE_LABEL[c.evidenceClass]||['Unclassified','未分类'];
  box.append(h('p',{class:'ix-risk-readout'},L(['Modelled fixed income: ','模型固定收入：']),money(split.total,split.currency),
    ' / MW · ',L(['Project-contracted income evidenced: ','已有项目合同证据支持的收入：']),money(split.contracted,split.currency)));
  const svg=chartSVG(title,L(desc)+' '+split.classes.map(c=>L(name(c))+': '+exactMoney(c.amount,split.currency)+' / MW').join('; '),'0 0 440 50');
  svg.append(svgEl('rect',{x:4,y:6,width:432,height:30,class:split.classes[0]?.evidenceClass?'ix-evidence-'+split.classes[0].evidenceClass:'ix-risk-empty'}));
  box.append(svg,h('p',{class:'ix-caption'},unit+' · '+L(['Year one, nominal','首年名义值'])),
    ...split.classes.map(c=>h('p',{class:'ix-risk-evidence-value',tabindex:0,'data-evidence-class':c.evidenceClass||'unclassified'},L(name(c)),': ',money(c.amount,split.currency),' / MW')),
    ...(split.total===0?[h('p',{tabindex:0},L(['No fixed income in this case.','本方案无固定收入。']))]:[]),
    chartTable(title,[['Evidence class','证据类别'],unit,['Basis','依据']],split.classes.length?split.classes.map(c=>[name(c),exactMoney(c.amount,split.currency),c.evidence?.basis||['Not supplied','未提供']]):[[['No fixed income','无固定收入'],exactMoney(split.total,split.currency),'—']]));
  return box;
}
