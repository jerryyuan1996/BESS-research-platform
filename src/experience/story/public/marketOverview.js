import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {sourceButton} from '../../../components/sourcePopup.js';
import {ELECTRICITY_OVERVIEW as DATA} from './data/electricity2024.js';
import './marketOverview.css';
import {renderBatteryOverview} from './batteryOverview.js';
import {countryForMarket,countryIndicators} from './overviewModel.js';

const n = value => new Intl.NumberFormat('en-GB',{maximumFractionDigits:1}).format(value);
const percent = (value,total) => n(value / total * 100) + '%';
const finite = Number.isFinite;
import {GEN,USE} from './electricityPalette.js';
const positiveEntries = mix => Object.entries(mix).filter(([,value])=>finite(value)&&value>0);
const text = (value,cls='')=>h('p',{class:cls},L(value));
function sourcesList(sources){
  return h('ul',{},sources.map(s=>h('li',{},h('a',{href:s.url,target:'_blank',rel:'noopener noreferrer'},s.name+' · '+s.title),
    s.locator?h('p',{},s.locator):null)));
}
function valueList(mix,total,palette,labels={}){
  return h('dl',{class:'po-values'},positiveEntries(mix).map(([key,value])=>h('div',{},
    h('dt',{},h('i',{style:`--swatch:${palette[key].color}`,'aria-hidden':'true'}),L(labels[key]||palette[key].label)),
    h('dd',{},n(value),' TWh',h('small',{},percent(value,total))))));
}
function stacked(mix,total,palette,label,labels={}){
  const entries=positiveEntries(mix);
  return h('div',{class:'po-stacked',role:'img','aria-label':L(label)+' · '+entries.map(([key,value])=>L(labels[key]||palette[key].label)+' '+percent(value,total)).join('; ')},
    entries.map(([key,value])=>h('span',{style:`width:${value/total*100}%;--swatch:${palette[key].color}`,title:L(labels[key]||palette[key].label)+' · '+n(value)+' TWh · '+percent(value,total)})));
}
function countryDetails(c){
  return h('div',{},h('h4',{},L(c.name),' · ',c.period),text(c.scope),
    c.generation?h('section',{},h('h4',{},L(['Generation','发电量']),' · ',n(c.generation.total),' TWh'),text(c.generation.basis),valueList(c.generation.mix,c.generation.mixTotal,GEN)):null,
    c.gridSent?h('section',{},h('h4',{},L(['Sent to grid','入网电量']),' · ',n(c.gridSent.total),' TWh'),text(c.gridSent.basis)):null,
    h('h4',{},L(['Electricity use','用电量']),' · ',n(c.demand.total),' TWh'),text(c.demand.basis),valueList(c.demand.mix,c.demand.mixTotal,USE,c.demand.sectorLabels),
    text(c.calculation),sourcesList(c.sources),text(['Checked '+DATA.checkedOn,'核对日期 '+DATA.checkedOn]));
}
function sourceNote(sources,calculation,period='2024'){
  return sourceButton(()=>h('div',{},text(['Official statistics · '+period+' · checked '+DATA.checkedOn,'官方统计 · '+period+' · 核对于 '+DATA.checkedOn]),
    sourcesList(sources),text(calculation)));
}
function kpi(label,value,unit,note){
  return h('div',{class:'po-kpi'},h('span',{},L(label)),h('strong',{},value,h('small',{},unit)),h('small',{},L(note)));
}

function comparison(country,marketId){
  const chart=h('div',{class:'po-comparison-chart','aria-live':'polite'});
  const modes=[['generation',['Generation mix','发电结构']],['demand',['Demand mix','用电结构']],['scale',['System size','电力规模']],['battery',['Battery build-out','电池储能装机']]];
  let mode=country.generation?'generation':'demand';
  const controls=h('div',{class:'po-switch',role:'group','aria-label':L(['Comparison metric','对比指标'])});
  const draw=()=>{
    controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.metric===mode)));
    if(mode==='battery'){chart.replaceChildren(renderBatteryOverview({countryId:country.id,marketId}));return;}
    const rows=DATA.countries.filter(c=>mode!=='generation'||c.generation);
    const palette=mode==='demand'?USE:GEN;
    const max=Math.max(...rows.flatMap(c=>[c.generation?.total||0,c.gridSent?.total||0,c.demand.total]));
    const keys=new Set(rows.flatMap(c=>Object.keys((mode==='generation'?c.generation:c.demand)?.mix||{})));
    const legend=mode==='scale'?h('div',{class:'po-legend'},
      h('span',{},h('i',{style:'--swatch:#406954'}),L(['Generation / grid supply','发电／入网供电'])),
      h('span',{},h('i',{style:'--swatch:#bca56f'}),L(['Final use','终端用电']))):h('div',{class:'po-legend'},
        Object.entries(palette).filter(([key])=>keys.has(key)).map(([,spec])=>h('span',{},h('i',{style:`--swatch:${spec.color}`}),L(spec.label))));
    const rowNodes=rows.map(c=>{
      const datum=mode==='generation'?c.generation:c.demand;
      const button=sourceButton(()=>countryDetails(c),c.name);button.classList.add('po-country');
      const label=h('div',{class:'po-country-label'},button,h('small',{},c.period,
        c.id==='uk'?L([' · UK',' · 含北爱']):c.id==='ie'?L([' · Republic',' · 共和国']):c.markets.length>1?L([' · national',' · 全国']):c.id==='ca'?L([' · national',' · 全国']):''));
      const value=mode==='scale'?h('div',{class:'po-volume-pair'},
        h('div',{},h('span',{style:`width:${(c.generation?.total||c.gridSent?.total)/max*100}%;--swatch:#406954`}),h('b',{},n(c.generation?.total||c.gridSent?.total))),
        h('div',{},h('span',{style:`width:${c.demand.total/max*100}%;--swatch:#bca56f`}),h('b',{},n(c.demand.total)))):
        stacked(datum.mix,datum.mixTotal,palette,c.name,mode==='demand'?c.demand.sectorLabels:{});
      return h('div',{class:'po-country-row'+(c.id===country.id?' is-active':''),'data-country':c.id},label,value,
        h('div',{class:'po-row-total'},mode==='scale'?h('small',{},L(c.gridSent?['Grid-sent / sales','入网／售电']:c.generation.kind==='net'?['Net / end use','净发电／终端']:['Gross / end use','毛发电／终端'])):
          [h('strong',{},n(datum.total)),h('small',{},'TWh',mode==='generation'&&c.generation.kind==='net'?L([' · net',' · 净']):'')]));
    });
    chart.replaceChildren(legend,h('div',{class:'po-chart-scale'},h('span',{},L(['Country · source details ↗','国家 · 点击查看来源 ↗'])),h('span',{},mode==='scale'?`0 — ${n(max)} TWh`:'0% — 100%')),...rowNodes,
      text(mode==='generation'?
        ['Generation shares use each country’s stated gross/net basis. Saudi Arabia appears in demand and size views; only its grid-sent total is verified.',
          '发电占比按各国注明的毛／净口径计算。沙特已核验入网总量，列于用电和规模视图。']:
        mode==='demand'?['Sector shares use final use; U.S. direct use is separate. Japan’s industry line is manufacturing. Australia’s sectors use rounded published totals.',
          '行业占比以终端用电为基础；美国直接自用单列，日本工业项为制造业，澳大利亚行业按官方取整合计。']:
        ['Bars share one linear scale. Gross generation, U.S. net generation and Saudi grid-sent electricity retain their labels; demand is final use, not system load.',
          '条形使用同一线性尺度。毛发电、美国净发电与沙特入网电量分别标注；需求为终端用电，不是含网损的系统负荷。'],'po-method-note'));
  };
  modes.forEach(([key,label])=>controls.append(h('button',{type:'button','data-metric':key,'aria-pressed':String(key===mode),onclick:()=>{mode=key;draw();}},L(label))));
  draw();
  return h('section',{class:'po-compare'},
    h('div',{class:'po-section-head'},h('div',{},h('span',{class:'po-eyebrow'},L(['13 COUNTRIES · 18 PLATFORM MARKETS','13 个国家 · 覆盖 18 个平台市场'])),
      h('h4',{},L(['Put '+country.name[0]+' in context','把'+country.name[1]+'放在全球背景中']))),controls),
    text(['Compare countries once. Regional markets share their national context; country buttons reveal scope, values and sources. Fiscal years are labelled in each row.',
      '国家只比较一次；区域市场共用对应国家背景。点击国家可查看统计范围、数值和来源，财年在各行标注。'],'po-method-note'),chart);
}

function geography(it){
  const totalWindSolar=it.generationMix.wind+it.generationMix.solar;
  const rows=it.regions.map(r=>h('div',{class:'po-region-row'},h('strong',{},L(r.name)),
    h('div',{},h('span',{},L(['Use','用电'])),h('div',{class:'po-region-track'},h('i',{style:`width:${r.consumption/it.consumption*100}%;--swatch:#406954`})),h('b',{},percent(r.consumption,it.consumption))),
    h('div',{},h('span',{},L(['Wind + solar','风光'])),h('div',{class:'po-region-track'},h('i',{style:`width:${(r.wind+r.solar)/totalWindSolar*100}%;--swatch:#bca56f`})),h('b',{},percent(r.wind+r.solar,totalWindSolar)))));
  return h('section',{class:'po-geography'},
    h('div',{class:'po-section-head'},h('div',{},h('span',{class:'po-eyebrow'},L(['LOCATION CHANGES THE INVESTMENT CASE','位置改变投资逻辑'])),
      h('h4',{},L(['Demand is north; wind and solar lean south','负荷在北，风光偏南']))),sourceNote(it.sources.slice(0,2),it.calculation)),
    h('div',{class:'po-region-layout'},h('div',{class:'po-region-insight'},
      h('strong',{},percent(it.regions[0].industry,it.demandMix.industry)),
      text(['of industrial electricity is consumed in the north. A national average cannot establish a project’s charging access or delivery value.',
        '的工业用电集中在北部。全国均价无法替代项目所在地的充电条件与交付价值。'])),h('div',{class:'po-regions'},rows)),
    text(['Shares of national electricity use and wind + solar generation, respectively. Administrative macro-regions are not electricity bidding zones.',
      '分别为全国用电量、全国风光发电量的占比。这里的行政大区不等于电力竞价分区。'],'po-method-note'));
}

function italyChapter(){
  const it=DATA.italy;
  return h('article',{class:'public-chapter power-overview','data-chapter':'overview','data-country':'it'},
    h('div',{class:'po-section-head'},h('div',{},h('span',{class:'po-eyebrow'},'MARKET OVERVIEW / 2024'),h('h3',{tabindex:'-1'},L(['The electricity system behind the market','先看电力系统，再理解市场']))),sourceNote(it.sources,it.calculation)),
    h('div',{class:'po-hero'},h('div',{class:'po-hero-copy'},h('h4',{},L(['Gas and imports support supply. Geography shapes storage value.', '天然气与进口托底，地理错配塑造储能价值。'])),
      text(['Italy’s annual balance shows both the need for dependable capacity and the reason to move energy across hours and regions.',
        '意大利的年度电力平衡，既解释可靠容量为何有价值，也解释电量为何需要跨时段、跨区域配置。'])),
      h('div',{class:'po-kpis'},kpi(['Total generation','总发电量'],n(it.generation),'TWh',['Gross · Terna','毛发电 · Terna']),
        kpi(['System demand','系统总需求'],n(it.demand),'TWh',['Including network losses','包含网损']),
        kpi(['Electricity consumption','用电量'],n(it.consumption),'TWh',['Terna consumption definition','Terna 消费统计口径']),
        kpi(['Net imports','净进口'],n(it.netImports),'TWh',[percent(it.netImports,it.demand)+' of demand','占需求 '+percent(it.netImports,it.demand)]))),
    h('div',{class:'po-mix-pair'},
      h('section',{class:'po-mix-card'},h('h4',{},L(['Where electricity comes from','电从哪里来'])),stacked(it.generationMix,it.generation,GEN,['Italy generation','意大利发电']),valueList(it.generationMix,it.generation,GEN)),
      h('section',{class:'po-mix-card'},h('h4',{},L(['Who uses the electricity','谁在用电'])),stacked(it.demandMix,it.consumption,USE,['Italy electricity use','意大利用电']),valueList(it.demandMix,it.consumption,USE),
        text(['Purchased and self-generated use, excluding network losses. Services include transport. Italy’s cross-country row below uses Eurostat final use, a different definition from this Terna consumption total.',
          '含购电与自发自用，剔除网损；服务业项含交通用电。下方跨国图表中的意大利采用 Eurostat 终端用电口径，与此处 Terna 消费统计不同。'],'po-method-note'))),
    geography(it),comparison(countryForMarket('it'),'it'));
}

export function renderChapter(data={marketId:'it'}) {
  if(data.marketId==='it')return italyChapter();
  const c=countryForMarket(data.marketId);
  if(!c)throw new Error('Country overview is unavailable');
  const largest=c.generation?positiveEntries(c.generation.mix).sort((a,b)=>b[1]-a[1])[0]:null;
  const title=largest?['Largest generation category: '+GEN[largest[0]].label[0], '最大发电类别：'+GEN[largest[0]].label[1]]
    :['Grid supply and final sales','入网供电与终端售电'];
  const context=data.marketName?['National context for '+data.marketName[0]+'. '+c.scope[0],data.marketName[1]+'的全国背景。'+c.scope[1]]:c.scope;
  return h('article',{class:'public-chapter power-overview','data-chapter':'overview','data-country':c.id,'data-market':data.marketId},
    h('div',{class:'po-section-head'},h('div',{},h('span',{class:'po-eyebrow'},'MARKET OVERVIEW / '+c.period),
      h('h3',{tabindex:'-1'},L(c.name),' · ',L(['The electricity system','电力系统']))),sourceNote(c.sources,c.calculation,c.period)),
    text(context,'po-method-note'),
    h('div',{class:'po-hero'},h('div',{class:'po-hero-copy'},h('h4',{},L(title)),
      largest?h('strong',{class:'po-leading-share'},percent(largest[1],c.generation.mixTotal)):null,
      text(['Annual generation and final use describe the system behind this market. Shares use the definitions stated in the sources.',
        '年度发电与终端用电，展示市场背后的电力系统；各项占比使用来源注明的统计口径。'])),
      h('div',{class:'po-kpis'},countryIndicators(data.marketId).map(v=>h('div',{'data-indicator':v.key},kpi(v.label,n(v.value),v.unit,v.basis))))),
    h('div',{class:'po-mix-pair',...(c.generation?{}:{style:'grid-template-columns:1fr'})},
      c.generation?h('section',{class:'po-mix-card'},h('h4',{},L(['Where electricity comes from','电从哪里来'])),
        stacked(c.generation.mix,c.generation.mixTotal,GEN,c.name),valueList(c.generation.mix,c.generation.mixTotal,GEN),text(c.generation.basis,'po-method-note')):null,
      h('section',{class:'po-mix-card'},h('h4',{},L(['Who uses the electricity','谁在用电'])),
        stacked(c.demand.mix,c.demand.mixTotal,USE,c.name,c.demand.sectorLabels),valueList(c.demand.mix,c.demand.mixTotal,USE,c.demand.sectorLabels),text(c.demand.basis,'po-method-note'))),
    data.summary?.logic?h('section',{class:'po-local-context'},h('h4',{},L(['How this relates to the selected market','与当前市场机制有什么关系'])),text(data.summary.logic)):null,
    comparison(c,data.marketId));
}
