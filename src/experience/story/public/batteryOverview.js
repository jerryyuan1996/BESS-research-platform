import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {sourceButton} from '../../../components/sourcePopup.js';
import {BATTERY_CAPACITY as DATA} from './data/batteryCapacity.js';

const format = v => new Intl.NumberFormat('en-GB',{maximumFractionDigits:v<1?3:1}).format(v);
const bounds = v => Array.isArray(v)?v:[v,v];
const amount = v => {const [lo,hi]=bounds(v);return format(lo)+(hi!==lo?'–'+format(hi):'');};
const present = (row,unit) => Number.isFinite(row?.[unit]) || Array.isArray(row?.[unit]);
const TYPES = {target:['Policy target','政策目标'],scenario:['Planning scenario','规划情景'],outlook:['Deployment outlook','部署展望'],model:['Model baseline','模型基期'],observed:['Installed / grid-connected','已投运／已并网']};

function details(row) {
  return h('div',{},h('h4',{},L(row.name)),h('p',{},L(row.scope)),
    ...[['current',row.current],['outlook',row.outlook]].filter(([,v])=>v).map(([key,v])=>h('section',{},
      h('h4',{},L(v.date)||'2030',' · ',L(TYPES[v.kind]||TYPES[key==='current'?'observed':'scenario'])),
      ...['gw','gwh'].filter(unit=>present(v,unit)).map(unit=>h('p',{},amount(v[unit]),' ',unit==='gw'?'GW':'GWh')),
      v.label?h('p',{},L(v.label)):null)),
    row.note?h('p',{},L(row.note)):null,
    h('ul',{},row.sources.map(s=>h('li',{},h('a',{href:s.url,target:'_blank',rel:'noopener noreferrer'},s.title),s.locator?h('p',{},s.locator):null))),
    h('p',{},L(['Checked '+DATA.checkedOn+' · MW ÷ 1,000 = GW; MWh ÷ 1,000 = GWh.','核对日期 '+DATA.checkedOn+' · MW ÷ 1,000 = GW；MWh ÷ 1,000 = GWh。'])));
}

/** A common unit does not make unlike technologies or geographies comparable.
 * Only explicitly reviewed series may pair an observation with an outlook. */
export function batteryGroups(unit) {
  const paired=DATA.rows.filter(r=>r.comparable?.includes(unit)&&present(r.current,unit)&&present(r.outlook,unit));
  const model=paired.filter(r=>r.current.kind==='model');
  const observed=paired.filter(r=>r.current.kind!=='model');
  const other=DATA.rows.filter(r=>!paired.includes(r)&&(present(r.current,unit)||present(r.outlook,unit)));
  return {observed,other,model};
}

export function renderBatteryOverview({countryId=null,marketId=null}={}) {
  const root=h('div',{class:'po-battery'}),chart=h('div',{'aria-live':'polite'});
  let unit='gw';
  const units=h('div',{class:'po-switch',role:'group','aria-label':L(['Storage unit','储能装机单位'])});
  const draw=()=>{
    units.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.unit===unit)));
    const groups=batteryGroups(unit),all=Object.values(groups).flat(),suffix=unit==='gw'?'GW':'GWh';
    const max=Math.max(...all.flatMap(r=>[r.current,r.outlook].filter(v=>present(v,unit)).map(v=>bounds(v[unit])[1])));
    const renderRow=row=>{
      const source=sourceButton(()=>details(row),row.name);source.classList.add('po-country');
      const bars=[['current',row.current],['outlook',row.outlook]].filter(([,v])=>present(v,unit));
      const active=countryId==='au'?row.id===(marketId==='wa'?'au-wem':'au-nem'):row.country===countryId;
      return h('div',{class:'po-battery-row'+(active?' is-active':''),'data-battery-country':row.id},
        h('div',{class:'po-country-label'},source,h('small',{},L(row.scope))),
        h('div',{class:'po-battery-bars'},bars.map(([key,v])=>{
          const [lo,hi]=bounds(v[unit]);
          const label=[L(v.date)||'2030',L(TYPES[v.kind]||TYPES[key==='current'?'observed':'scenario'])].join(' · ');
          return h('div',{class:'po-battery-line','data-series':key},
            h('span',{class:'po-battery-date'},label),
            h('div',{class:'po-battery-track',role:'img','aria-label':L(row.name)+' · '+label+' · '+amount(v[unit])+' '+suffix},
              h('i',{class:key,style:`width:${hi/max*100}%`}),
              hi!==lo?h('i',{class:'po-battery-range',style:`left:${lo/max*100}%;width:${(hi-lo)/max*100}%`}):null),
            h('strong',{},v.approximate?'≈':'',amount(v[unit])));
        }),row.caption?h('small',{class:'po-battery-caption'},L(row.caption)):null));
    };
    const sections=[['observed',['Current → 2030 · grid and large batteries','当前 → 2030 · 电网及大型电池']],
      ['other',['Other verified installed or planned capacity','其他已核实装机与规划数据']],
      ['model',['Official model paths · baseline is not current installed stock','官方模型路径 · 基期不代表当前装机']]];
    chart.replaceChildren(h('div',{class:'po-battery-scale'},L(['Shared linear scale','统一线性尺度']),' · 0–',format(max),' ',suffix),
      ...sections.filter(([key])=>groups[key].length).map(([key,title])=>h('section',{class:'po-battery-group','data-battery-group':key},
        h('h5',{},L(title)),...groups[key].map(renderRow))));
  };
  [['gw',['Power · GW','功率 · GW']],['gwh',['Energy · GWh','容量 · GWh']]].forEach(([key,label])=>units.append(h('button',{
    type:'button','data-unit':key,onclick:()=>{unit=key;draw();}},L(label))));
  root.append(h('div',{class:'po-battery-head'},h('div',{},h('h5',{},L(['How much battery storage could be built?','电池储能还有多大建设空间？'])),
    h('p',{class:'po-method-note'},L(['Grid batteries, excluding pumped hydro and household systems where separable. Dates and regional scope are shown per row; targets and scenarios are not commissioning forecasts.',
      '以电网级电池为主，在来源可分时剔除抽蓄与户用。各行标注日期及区域；政策目标、规划情景不等于投运预测。']))),units),
    sourceButton(()=>h('div',{},h('h4',{},L(['13-country coverage and definitions','13 个国家的来源与统计口径'])),
      DATA.review.map(r=>h('section',{},h('h4',{},L(r.name)),h('p',{},L(r.note)),
        h('ul',{},r.sources.map(s=>h('li',{},h('a',{href:s.url,target:'_blank',rel:'noopener noreferrer'},s.title),s.locator?h('p',{},s.locator):null)))))),
      ['Source: Official · 13 countries','来源：官方 · 13 个国家']),
    h('div',{class:'po-legend'},h('span',{},h('i',{style:'--swatch:#406954'}),L(['Observed / model baseline','现状／模型基期'])),
      h('span',{},h('i',{style:'--swatch:#bca56f'}),L(['2030 reference capacity','2030 参考规模'])),h('span',{},L(['Striped end = range','斜纹端部＝区间']))),chart,
    h('p',{class:'po-method-note'},L(['Power (GW) and energy (GWh) are separate views. Japan’s derived GW uses the source’s stated 3-hour assumption. All 13 countries were reviewed; only verified values are plotted. Click a country for definitions and primary sources.',
      '功率 GW 与容量 GWh 分开比较；日本推算功率采用来源明确给出的 3 小时假设。已核对 13 个国家，仅将有明确数据的项绘入图中；点击国家可查看定义、算式与官方来源。'])));
  draw();return root;
}
