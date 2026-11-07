import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { projectsFor } from './registry.js';
import { loadEiaInventory } from './eiaInventoryClient.js';
import './eiaInventory.css';

const number=n=>Number.isFinite(n)?n.toLocaleString('en-US',{maximumFractionDigits:4}):'—';
const status=p=>L(p.stage==='operating'?['Operating','在运']:['Under construction','在建']);
const REASON={
  'annual-key-absent':['Not in annual storage table','未列入年度储能表'],
  'ambiguous-annual-key':['Duplicate annual identity','年度身份重复'],
  'missing-compound-id':['Missing identity','身份字段缺失'],
  'annual-vintage-incompatible':['Incompatible reporting year','报告年份不兼容'],
  'annual-vintage-too-old':['Annual observation too old','年度观测过旧'],
  'annual-technology-mismatch':['Technology differs','技术类型不符'],
  'annual-status-mismatch':['Status differs','状态不符'],
  'annual-plant-authority-ambiguous':['Annual plant identity unresolved','年度电站身份未解'],
  'annual-authority-mismatch':['Balancing authority differs','平衡区域不符'],
  'annual-state-mismatch':['State differs','州信息不符'],
  'annual-operating-year-invalid':['Invalid operating year','投运年份无效'],
  'operating-date-mismatch':['Operating date differs','投运日期不符'],
  'annual-energy-missing':['Annual MWh not reported','年度 MWh 未申报'],
  'annual-discharge-missing':['Annual discharge MW not reported','年度放电 MW 未申报'],
};
const reason=e=>e.match==='exact-plant-generator'?L(e.reason?REASON[e.reason]||['Annual field unavailable','年度字段缺失']:['Exact ID','精确 ID']):L(REASON[e.reason]||['No annual match','无年度匹配']);
const location=(p,monthly,annual)=>p.coordinateEvidence.basis==='monthly-reported'?`${monthly.period} EIA-860M`:
  L(p.coordinateEvidence.basis==='annual-plant-code'?[`${annual.reportingYear} exact Plant ID`,`${annual.reportingYear} 电站 ID 精确匹配`]:p.coordinateEvidence.basis==='annual-name-state'?[`${annual.reportingYear} name/state (weaker)`,`${annual.reportingYear} 名称/州匹配（较弱）`]:['Not reported','未申报']);

/** Source-specific controls stay with the lazy inventory feature. */
export function attachEiaInventory(parent,marketId,{gone,layerGroup,onProjects,onToggle}){
  return mountEiaInventory(parent,marketId,{gone,onProjects:projects=>{
    if(!layerGroup.querySelector('.geo-layer-toggle.project')){
      const input=h('input',{type:'checkbox',checked:'',onchange:event=>onToggle(event.target.checked)});
      layerGroup.append(h('label',{class:'geo-layer-toggle project'},input,h('span',{'aria-hidden':'true'}),L(['Battery inventory','电池机组清单'])));
    }
    onProjects(projects);
  }});
}

/** The existing map and this table receive the same canonical registry rows. */
export function mountEiaInventory(parent,marketId,{onProjects=()=>{},gone=()=>false}={}){
  const root=h('section',{class:'eia-inventory','data-market':marketId,'aria-label':L(['Official battery generator inventory','官方电池机组清单'])});
  const message=h('p',{role:'status'},L(['Loading official generator inventory…','正在读取官方机组清单…']));
  root.append(message);parent.append(root);
  let retained=false;
  const load=async force=>{
    message.textContent=L(['Loading official generator inventory…','正在读取官方机组清单…']);
    try{
      const snapshot=await loadEiaInventory({force});if(gone()||!root.isConnected)return;
      if(!snapshot)throw new Error('disabled');
      const inventory=snapshot.derived.inventory,monthly=inventory.sources.monthly,annual=inventory.sources.annual,coverage=inventory.markets[marketId];
      const projects=projectsFor(marketId).filter(p=>p.sourceIds.includes('us-eia-860m'));
      root.replaceChildren(message);message.textContent='';
      root.dataset.projectCount=String(projects.length);root.dataset.locatedCount=String(coverage.located);root.dataset.contentChecksum=snapshot.contentChecksum;
      root.append(h('h4',{},L(['Battery generator inventory — EIA','电池机组清单 — EIA'])),
        h('p',{class:'eia-periods'},L([`Monthly ${monthly.period}, published ${monthly.publishedAt}; annual supplement ${annual.reportingYear}.`,`月度 ${monthly.period}，发布 ${monthly.publishedAt}；年度补充 ${annual.reportingYear}。`])),
        h('p',{class:'eia-coverage'},L([`${coverage.operating} operating / ${coverage.underConstruction} under construction; ${coverage.located}/${coverage.units} located. Monthly MWh ${coverage.monthlyEnergyKnown}/${coverage.units}; exact annual energy evidence ${coverage.annualEnergyKnown}/${coverage.units}.`,`${coverage.operating} 个在运 / ${coverage.underConstruction} 个在建；${coverage.located}/${coverage.units} 有坐标。月度 MWh ${coverage.monthlyEnergyKnown}/${coverage.units}；精确年度能量证据 ${coverage.annualEnergyKnown}/${coverage.units}。`])),
        h('p',{class:'eia-basis'},L(['Fair · A dated generator inventory, not a complete connection queue. Monthly MW/MWh and annual charge/discharge MW are different observations. Annual hours = annual MWh / annual maximum discharge MW. The inventory layer appears only in the current system period. New filings or a matching annual record would change the coverage.','一般 · 这是注明日期的机组清单，不是完整并网队列。月度 MW/MWh 与年度充放电 MW 分属不同观测；年度时长 = 年度 MWh ÷ 年度最大放电 MW。机组图层仅在当前系统时期显示。新申报或可匹配年表会改变覆盖范围。'])));
      const details=h('details',{class:'eia-project-details'},h('summary',{},L([`View ${projects.length} generator records`,`查看 ${projects.length} 条机组记录`])));
      let built=false;details.addEventListener('toggle',()=>{if(!details.open||built)return;built=true;
        const headers=[L(['Project / unit ID','项目 / 机组 ID']),L(['Status','状态']),`${monthly.period} MW`,`${monthly.period} MWh`,`${annual.reportingYear} MWh`,L([`${annual.reportingYear} charge MW`,`${annual.reportingYear} 充电 MW`]),L([`${annual.reportingYear} discharge MW`,`${annual.reportingYear} 放电 MW`]),L([`${annual.reportingYear} discharge hours`,`${annual.reportingYear} 放电时长`]),L(['Annual match','年度匹配']),L(['Location source','位置来源'])];
        const table=h('table',{class:'eia-project-table'},h('thead',{},h('tr',{},...headers.map(label=>h('th',{},label)))));
        table.append(h('tbody',{},...[...projects].sort((a,b)=>b.capacityMW-a.capacityMW||a.id.localeCompare(b.id)).map(p=>{
          const e=p.storageEvidence;
          return h('tr',{'data-project-id':p.id},h('td',{},p.name,h('br'),h('small',{},p.sourceRef.plantId+' : '+p.sourceRef.generatorId)),h('td',{},status(p)),
            h('td',{class:'num','data-field':'monthly-mw'},number(p.capacityMW)),h('td',{class:'num','data-field':'monthly-mwh'},number(p.energyObservation?.value)),
            h('td',{class:'num','data-field':'annual-mwh'},number(e.energyMWh)),h('td',{class:'num'},number(e.maximumChargeMW)),h('td',{class:'num','data-field':'annual-discharge-mw'},number(e.maximumDischargeMW)),h('td',{class:'num','data-field':'annual-hours'},number(e.durationHours)),
            h('td',{},reason(e)),h('td',{},location(p,monthly,annual)));
        })));
        details.append(h('div',{class:'tbl-wrap'},table));
      });
      root.append(details,h('p',{class:'eia-attribution'},snapshot.source.notice,' ',h('a',{href:monthly.url,target:'_blank',rel:'noopener noreferrer'},L(['Monthly file','月表'])),' · ',h('a',{href:annual.url,target:'_blank',rel:'noopener noreferrer'},L(['Annual file','年表']))));
      const sourceDetails=h('details',{},h('summary',{},L(['Versions and matching coverage','版本与匹配覆盖'])));
      sourceDetails.append(h('p',{},L([`Observed revisions: ${inventory.revisions.length}. Monthly SHA-256: ${monthly.sha256}. Annual ZIP SHA-256: ${annual.sha256}.`,`已观测版本：${inventory.revisions.length}。月表 SHA-256：${monthly.sha256}。年度 ZIP SHA-256：${annual.sha256}。`])),
        h('p',{},L([`${coverage.annualIdentityUnmatched} records have no usable annual identity match; ${coverage.annualPowerDiffersFromMonthly} matched records have different monthly nameplate and annual discharge MW.`,`${coverage.annualIdentityUnmatched} 条记录没有可用的年度身份匹配；${coverage.annualPowerDiffersFromMonthly} 条匹配记录的月度铭牌功率与年度放电功率不同。`])),
        h('a',{href:'/data/public/us-eia-storage-projects.json',target:'_blank',rel:'noopener'},L(['Full observed inventory and revision ledger','完整观测清单与版本记录'])));
      root.append(sourceDetails);retained=true;onProjects(projects,snapshot);
    }catch{
      if(gone()||!root.isConnected)return;
      message.replaceChildren(document.createTextNode(L(retained?['Inventory refresh unavailable; retained observations remain shown. ','清单刷新暂不可用，保留已有观测。 ']:['Official inventory unavailable; the existing map remains usable. ','官方清单暂不可用，原有地图仍可使用。 '])),
        h('button',{type:'button',onclick:()=>load(true)},L(['Retry inventory','重试清单'])));
    }
  };
  void load(false);
  return root;
}
