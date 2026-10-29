/* ---------------------------------------------------------------------------
   THE INVESTMENT LAB — one model, every market, your assumptions.

   This replaces the per-market Investment Lab and Project Debt tabs. They were
   six labs, not one: four markets shared an engine written in native currency
   against their own dashboard seeds, WA had a separate co-optimised model, and
   nothing let a reader ask the only question that matters across a portfolio —
   the same question, of every market, on the same terms.

   So the Lab does not have a model of its own. It re-runs the comparison engine
   the rest of this page already runs, with the reader's overrides applied:

       your inputs ──► withOverrides() ──► runCase() ──► sizeProjectDebt()

   Three things follow from that, and all three are the point.

   1. THE NUMBERS RECONCILE. Reset every input and the Lab reproduces the league
      table above it, to the cent. A lab whose base case disagrees with the page
      it sits on is worse than no lab.

   2. EVERY INPUT IS BOUNDED, AND THE BOUND IS EVIDENCE. A field can only be moved
      inside a band the market declares, and every band states where its endpoints
      came from. Poland's capacity line runs from €8.2k to €64.9k/MW/yr because two
      real auctions say so — not because someone picked ±50%. See comparison/ranges.js.

   3. LEVERAGE IS A CHOICE, NOT A DEFAULT. The cross-market comparison stays
      unlevered on purpose. Here you may turn debt on, because at market level a
      capital structure is a legitimate thing to state — and the four PRICED
      conventions move within their own bands while the coverage tests, tranche
      split and tenor caps stay human-set.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { requestRender } from '../app/state.js';
import { spacedCard, card } from '../components/card.js';
import { badge } from '../components/badge.js';
import { chip } from '../components/chip.js';
import { why } from '../components/decisionLogic.js';
import { kpi } from '../components/metricCard.js';
import { renderProjectDebt } from '../components/debtPanel.js';
import { waterfall } from '../charts/index.js';
import { fmtN, fmt1, fmtPct, fmtIRR, fmtIRRor, fmtX, fmtUSDk } from '../utils/formatting.js';
import { runCase } from '../comparison/engine.js';
import { createCaseRecord, entryPriceAtHurdle } from '../comparison/caseRecord.js';
import { PROJECT_EVIDENCE_GATES, projectEvidenceStatus } from '../comparison/projectEvidence.js';
import { supportedStrategies, baseStrategy, strategyById } from '../comparison/strategies.js';
import { sizeProjectDebt, riskClassFor } from '../economics/projectDebt.js';
import { withOverrides, conventionsWith, movedFields } from '../comparison/scenario.js';
import {
  labFieldsFor, LAB_GROUPS, DEBT_FIELDS, DEBT_RANGES,
  clampToRange, isMoved, readPath, DISPERSION_NOTE,
} from '../comparison/ranges.js';
import { RESOURCE_ADEQUACY_LABEL, RESOURCE_ADEQUACY_DEFINITION } from '../markets/schema.js';
import { congestionFor } from '../markets/congestionRegistry.js';
import { CAPTURE_FLOW, reliefRunway } from '../governance/congestion.js';
import { RUNWAY_FROM } from '../components/congestionPanel.js';
import { homeState, labMarket, labOverrides } from './state.js';
import { createPrintContext, PRINT_STATUS } from '../print/printContext.js';
import { renderPrintSnapshot } from '../print/printSnapshot.js';
import { renderAcquisitionLab } from '../acquisition/lab.js';
import { EXIT_YEARS } from '../comparison/assumptions.js';

const T = {
  title: ['Acquisition price and return target','收购价格与目标回报'],
  intro: [
    'Choose a market and revenue route. Complete the project inputs to estimate the most you can pay while meeting the required return.',
    '选择市场和收入路径，补齐项目资料，计算达到目标回报时最多值得付多少钱。',
  ],
};

/* ---- formatting --------------------------------------------------------- */

/**
 * Formats a value in the unit its field declares.
 *
 * Fractions scale their precision to the band they sit in: a senior margin of
 * 200-250bp rendered at whole percentages reads "2% – 3%", which is both wrong
 * and the exact opposite of the point — that band is narrow.
 */
function fmtValue(v, field, mf, range){
  if (v == null || !Number.isFinite(v)) return '—';
  switch (field.unit){
    case 'pct': return fmt1(v) + '%';
    case 'frac': {
      const span = range ? Math.abs(range.max - range.min) : 1;
      const dp = span < 0.05 ? 2 : span < 0.5 ? 1 : 0;
      return (v * 100).toFixed(dp) + '%';
    }
    case 'yr': return fmtN(v) + L([' yr', '年']);
    /* Months rather than years, because a build programme is negotiated in
       months and rounding one to a year hides the case this field exists for. */
    case 'mo': return fmtN(v) + L([' mo', '个月']);
    default: return mf.currencySymbol + fmtN(v);
  }
}

/** A step small enough to be useful and large enough not to need eleven keystrokes. */
function stepFor(field, range){
  if (field.unit === 'yr') return 1;
  if (field.unit === 'mo') return 3;
  if (field.unit === 'frac') return 0.01;
  if (field.unit === 'pct') return 0.5;
  const span = Math.abs(range.max - range.min) || Math.abs(range.seed) || 1;
  const mag = Math.pow(10, Math.floor(Math.log10(span)) - 2);
  return Math.max(mag, 0.01);
}

const KIND_LABEL = {
  sourced: ['Both ends observed', '两端均为实测'],
  'part-sourced': ['One end observed', '一端为实测'],
  dispersed: ['No published band', '无公开区间'],
  limit: ['Scheme limits', '机制限制'],
};
const KIND_TONE = { sourced: 'ok', 'part-sourced': 'info', dispersed: 'serious', limit: 'info' };

/* ---- A. what is being modelled ------------------------------------------ */

function segButton(label, active, onclick){
  return h('button', { class: 'btn' + (active ? ' active' : ''), onclick }, label);
}

/** Re-render without losing the reader's place on a long page. */
function rerender(){
  const y = window.scrollY;
  requestRender();
  window.scrollTo(0, y);
}

function renderControls(parent, marketList, market, strategyId){
  const mf = market.manifest;

  parent.append(h('div', { class: 'lab-ctl' },
    h('div', { class: 'lab-ctl-lbl' }, L(['Market', '市场'])),
    h('div', { class: 'seg' }, marketList.map(m => segButton(
      m.manifest.flag + ' ' + L(m.manifest.shortName),
      m.manifest.id === mf.id,
      () => { homeState.labMarket = m.manifest.id; homeState.labStrategy = null; rerender(); })))));

  const routes = supportedStrategies(market);
  parent.append(h('div', { class: 'lab-ctl' },
    h('div', { class: 'lab-ctl-lbl' }, L(['Route to market', '售电路径'])),
    h('div', { class: 'seg' }, routes.map(s => segButton(
      L(s.n), s.id === strategyId,
      () => { homeState.labStrategy = s.id; rerender(); })))));

  /* What "capacity-backed" counts as, stated where the reader chooses it.
     The term does more work than it looks: several markets run arrangements
     they call capacity markets while paying a merchant battery nothing for
     accredited adequacy, and whether this route is offered at all turns on that
     distinction. Definition lives in markets/schema.js so the methodology page
     and this control cannot drift apart. */
  if (routes.some(s => s.id === 'cap')){
    parent.append(h('div', { class: 'lab-ctl-note cap' },
      h('b', {}, L(RESOURCE_ADEQUACY_LABEL)), ' — ', L(RESOURCE_ADEQUACY_DEFINITION)));
  }

}

function renderLegacyCapitalControls(parent){
  parent.append(h('div', { class: 'lab-ctl' },
    h('div', { class: 'lab-ctl-lbl' }, L(['Capital structure', '资本结构'])),
    h('div', { class: 'seg' },
      segButton(L(['Unlevered', '无杠杆']), !homeState.labLevered,
        () => { homeState.labLevered = false; rerender(); }),
      segButton(L(['Project debt', '项目债务']), homeState.labLevered,
        () => { homeState.labLevered = true; rerender(); }))));
}

/* ---- B. the assumptions form -------------------------------------------- */

function basisDrawer(key, range){
  const open = homeState.labOpenBasis === key;
  const toggle = h('button', {
    class: 'lab-basis-btn',
    type: 'button',
    'aria-expanded': String(open),
    onclick: () => { homeState.labOpenBasis = open ? null : key; rerender(); },
  }, open ? L(['Hide evidence', '收起依据']) : L(['Why this range', '区间依据']));

  const wrap = h('div', { class: 'lab-basis' }, toggle);
  if (!open) return wrap;

  const body = h('div', { class: 'lab-basis-body' });
  if (range.basis) body.append(h('div', {}, L(range.basis)));
  if (range.source) body.append(h('div', { class: 'cap' },
    L(['Source: ', '来源：']) + range.source));
  if (range.kind === 'dispersed') body.append(h('div', { class: 'cap' }, L(DISPERSION_NOTE)));
  wrap.append(body);
  return wrap;
}

/**
 * The dated warning a congestion register puts on one of these fields.
 *
 * A seed is a present-tense observation. Where a market's own register says the
 * constraint behind that observation has a funded relief project with a
 * commissioning year, holding the seed flat for fifteen years assumes the
 * project does not arrive. That is a legitimate position — it is not a legitimate
 * silence, so the field says so.
 *
 * Constraints whose mechanism CHARGES are excluded. Romania's connection auction
 * bears on capex as a cost, not as a revenue that expires, so warning that it
 * "is relieved" would read backwards. An UNCOMPENSATED constraint is still
 * flagged: nobody is paid for it, but the depressed prices it creates are
 * already inside the merchant seed, and they end when the constraint does.
 */
function reliefWarning(market, fieldKey){
  const register = congestionFor(market.manifest.id);
  if (!register) return null;

  const dated = register.zones
    .filter(z => z.bearsOn === fieldKey && CAPTURE_FLOW[z.capture.mechanism] !== 'charges')
    .map(z => ({ zone: z, runway: reliefRunway(z, RUNWAY_FROM) }))
    .filter(x => x.runway != null)
    .sort((a, b) => a.runway - b.runway);
  if (!dated.length) return null;

  const { zone, runway } = dated[0];
  return h('div', { class: 'lab-relief' },
    chip('warn', L(['relief in ' + runway + ' yr', runway + '年后缓解'])),
    h('span', {}, L([
      L(zone.name) + ' is relieved by ' + L(zone.relief.project) + ' in ' + zone.relief.expected
        + '. That is a present-tense observation; holding it flat assumes the project does not arrive.',
      L(zone.name) + '将由' + L(zone.relief.project) + '于' + zone.relief.expected
        + '年缓解。该数值反映的是当前观测；若保持不变，即等同于假设该工程不会建成。',
    ])));
}

function renderField(parent, field, market, overrides){
  const mf = market.manifest;
  const range = field.range;
  const current = Number.isFinite(overrides[field.key]) ? overrides[field.key] : field.value;
  const moved = isMoved(current, range);

  const input = h('input', {
    class: 'inp' + (moved ? ' moved' : ''),
    type: 'number',
    step: String(stepFor(field, range)),
    min: String(range.min),
    max: String(range.max),
    value: String(current),
  });
  /* Clamp on commit, not on keystroke: typing "1" on the way to "150" must not
     be snapped to the floor before the second digit arrives. */
  input.addEventListener('change', (e) => {
    const clamped = clampToRange(Number(e.target.value), range);
    if (Math.abs(clamped - range.seed) < 1e-9) delete overrides[field.key];
    else overrides[field.key] = clamped;
    rerender();
  });

  const row = h('div', { class: 'lab-field' + (moved ? ' moved' : '') },
    h('label', {}, L(field.label)),
    input,
    h('div', { class: 'lab-range' },
      h('span', {}, fmtValue(range.min, field, mf, range) + ' – ' + fmtValue(range.max, field, mf, range)),
      chip(KIND_TONE[range.kind] || 'info', L(KIND_LABEL[range.kind] || KIND_LABEL.dispersed)),
      range.gate ? chip('serious', L(['gate ' + range.gate, '研究缺口 ' + range.gate])) : null,
      moved ? chip('warn', L(['base ', '基准值 ']) + fmtValue(range.seed, field, mf, range)) : null),
    reliefWarning(market, field.key),
    basisDrawer(field.key, range));

  parent.append(row);
}

function renderAssumptions(parent, market, fields, overrides){
  const moved = movedFields(market, overrides);

  const c = card(
    ['Assumptions — ' + L(market.manifest.name), '假设输入 — ' + L(market.manifest.name)],
    [badge('illus')]);

  c.append(h('div', { class: 'note' },
    h('b', {}, L(['Every field is bounded by evidence. ', '每个输入均受证据约束。'])),
    L([
      'A value can only be moved inside the range its market declares, and each range says which of its endpoints is an observation and which is not. Where no published band exists the field is marked accordingly and carries a research gate — those are the numbers to distrust first.',
      '取值仅可在所属市场声明的区间内调整，且每个区间均说明其端点中哪些为实测观察值、哪些不是。若无公开区间，该输入将被相应标注并附带研究缺口编号 — 这些正是最应存疑的数值。',
    ])));

  const head = h('div', { class: 'lab-form-head' },
    h('span', {}, moved.length
      ? L([moved.length + ' input' + (moved.length === 1 ? '' : 's') + ' changed',
           '已有' + moved.length + '项输入被调整'])
      : L(['All inputs at base case — outputs match the page above', '全部输入为基准值 — 输出与上方页面一致'])),
    h('button', {
      class: 'btn',
      disabled: moved.length ? null : 'disabled',
      onclick: () => {
        for (const k of Object.keys(overrides)) delete overrides[k];
        homeState.labDebt = {};
        rerender();
      },
    }, L(['Reset to base case', '重置为基准情景'])));
  c.append(head);

  for (const group of LAB_GROUPS){
    const inGroup = fields.filter(f => f.group === group.id);
    if (!inGroup.length) continue;
    c.append(h('div', { class: 'lab-group-title' }, L(group.title)));
    const grid = h('div', { class: 'lab-form' });
    inGroup.forEach(f => renderField(grid, f, market, overrides));
    c.append(grid);
  }

  if (homeState.labLevered){
    c.append(h('div', { class: 'lab-group-title' }, L(['Financing — priced terms', '融资条件 — 价格类'])));
    const grid = h('div', { class: 'lab-form' });
    DEBT_FIELDS.forEach(f => renderField(grid, {
      ...f, group: 'debt', range: DEBT_RANGES[f.key], value: DEBT_RANGES[f.key].seed,
    }, market, homeState.labDebt));
    c.append(grid);
    c.append(h('div', { class: 'cap' }, L([
      'Coverage tests (1.20–1.40x contracted by contract type, 2.00x market), the two-tranche split, the tenor caps and the rollover allowance are methodology, not price, and stay human-set. They are not editable here.',
      '覆盖倍数检验（合同档按合同类型1.20–1.40倍、市场档2.00倍）、双档结构划分、期限上限及续作宽限属方法论而非价格，仅由人工设定，本处不可编辑。',
    ])));
  }

  parent.append(c);
}

/* ---- C. outputs --------------------------------------------------------- */

function deltaChip(now, seed, fmt){
  if (now == null || seed == null || !Number.isFinite(now) || !Number.isFinite(seed)) return null;
  const d = now - seed;
  if (Math.abs(d) < 1e-9) return null;
  return { text: (d > 0 ? '+' : '−') + fmt(Math.abs(d)), cls: d > 0 ? 'good' : 'bad' };
}


/* ---------------------------------------------------------------------------
   THE LAB'S PRINT ADAPTER.

   Same contract as the dossier's, different everything else. The Lab runs a
   shared market engine over app-level state with per-field overrides and a
   named strategy; a dossier runs its own pure function over closure-local
   inputs. Nothing is gained by making those look alike, so each owns the six
   lines that describe its own run and both hand the result to one renderer.

   Built from `now` — the case that was just run — and from the same `fields`
   and `overrides` that produced it. No control is read at print time.

   `extra` carries what the Lab has and a dossier does not: the strategy, the
   exit year and whether the levered view is on. Those belong on the printed
   sheet and there is no reason to flatten them into the assumption table to
   make the two tools look symmetrical.
   --------------------------------------------------------------------------- */
/* The field `unit` keys are internal. On a printed sheet a column reading
   "cur" is worse than no column. */
const UNIT_LABEL = { cur: 'currency', pct: '%', frac: '%', yr: 'years', mo: 'months' };

function labPrintContext(market, seedMarket, fields, overrides, strategyId, exitYear, now, kpiRows){
  const mf = seedMarket.manifest;
  const assumptions = fields.map(f => {
    const current = Number.isFinite(overrides[f.key]) ? overrides[f.key] : f.value;
    const moved = Math.abs(current - f.range.seed) > 1e-9;
    return {
      label: f.label,
      value: fmtValue(current, f, mf, f.range),
      unit: UNIT_LABEL[f.unit] ?? null,
      source: f.range.gate ? 'research gap ' + f.range.gate : null,
      /* Whether the reader moved this is the single most useful thing on a
         printed assumption sheet: it separates the house view from the case
         being argued. */
      status: moved
        ? 'changed from base ' + fmtValue(f.range.seed, f, mf, f.range)
        : 'base case',
    };
  });

  const failed = !!now.na;
  return createPrintContext({
    status: failed ? PRINT_STATUS.FAILED : PRINT_STATUS.OK,
    statusReason: failed
      ? [String(now.na), String(now.na)]
      : null,
    scenario: { id: strategyId, name: strategyById(strategyId).n },
    model: {
      id: 'Investment Lab — ' + L(seedMarket.manifest.shortName),
      version: seedMarket.manifest.modelVersion ?? null,
      vintage: seedMarket.manifest.asAt ?? null,
    },
    assumptions,
    gaps: [],
    outputs: failed ? [] : kpiRows,
    extra: [
      { label: ['Strategy', '策略'], value: L(strategyById(strategyId).n) },
      { label: ['Exit year', '退出年份'], value: String(exitYear) },
      { label: ['Capital structure', '资本结构'],
        value: homeState.labLevered ? 'Levered' : 'Unlevered' },
    ],
  });
}

function renderOutputs(parent, market, seedMarket, strategyId, exitYear, conventions, fields, overrides){
  const now = runCase(market, strategyId, exitYear);
  const seed = runCase(seedMarket, strategyId, exitYear);
  const stratName = strategyById(strategyId).n;

  const c = card(
    ['Result — ' + L(stratName) + ', exit year ' + exitYear + ', USD per MW',
     '测算结果 — ' + L(stratName) + '，第' + exitYear + '年退出，每MW美元'],
    [badge('calc'), badge('illus')]);

  if (now.na){
    c.append(h('div', { class: 'warnbox' }, '⚠ ' + L(now.na)));
    /* A case the engine cannot run still prints — saying what was assumed and
       why there is no result. A blank space is indistinguishable from a case
       nobody tried. */
    c.append(renderPrintSnapshot(
      labPrintContext(market, seedMarket, fields, overrides, strategyId, exitYear, now, [])));
    parent.append(c);
    return null;
  }

  const debt = homeState.labLevered
    ? sizeProjectDebt(now, { exitYear, riskClass: riskClassFor(market, strategyId), conventions })
    : null;

  const kpis = h('div', { class: 'kpis' },
    kpi(L(['15-yr hold IRR', '15年持有IRR']), fmtIRRor(now.irrHold, now.irrHoldAbsent, L),
      deltaChip(now.irrHold, seed.irrHold, v => fmt1(v * 100) + 'pp')),
    kpi(L(['Exit-year IRR', '退出年IRR']), fmtIRRor(now.irrExit, now.irrExitAbsent, L),
      deltaChip(now.irrExit, seed.irrExit, v => fmt1(v * 100) + 'pp')),
    kpi(L(['MOIC at exit', '退出时MOIC']), fmtX(now.moic),
      deltaChip(now.moic, seed.moic, v => fmt1(v) + '×')),
    kpi(L(['Payback', '回收期']), now.payback ? now.payback + L([' yr', '年']) : '—'),
    kpi(L(['Yr-1 cash per $1M', '每$1M第1年现金']), fmtUSDk(now.eb1 * 1e6 / now.net)),
    kpi(L(['kW per $1M', '每$1M可控kW']), fmtN(now.kwPerM)),
    kpi(L(['Secured share of yr-1 revenue', '第1年收入锁定占比']),
      fmtPct((now.evidenceSecuredShare || 0) * 100, 0)));

  if (debt){
    kpis.append(
      kpi(L(['Gearing achieved', '实现杠杆率']), fmtPct(debt.gearing * 100, 0),
        { text: L(debt.ceilingBinds
          ? ['Capped by the gearing ceiling', '受杠杆上限约束']
          : ['Capped by the coverage test', '受覆盖倍数约束']) }),
      kpi(L(['Minimum DSCR', '最低偿债覆盖倍数']),
        debt.minDSCR == null ? '—' : debt.minDSCR.toFixed(2) + 'x',
        { cls: debt.minDSCR != null && debt.minDSCR < 1.3 ? 'bad' : null }),
      kpi(L(['Levered IRR (yr ' + exitYear + ')', '杠杆后IRR（第' + exitYear + '年）']),
        fmtIRR(debt.irrLevered),
        { text: L(['unlevered ', '无杠杆 ']) + fmtIRR(debt.irrUnlevered),
          cls: debt.irrLevered != null && debt.irrUnlevered != null
            && debt.irrLevered < debt.irrUnlevered ? 'bad' : null }));
  }
  /* Immediately before the outputs, built from the case just run. */
  c.append(renderPrintSnapshot(labPrintContext(
    market, seedMarket, fields, overrides, strategyId, exitYear, now,
    /* Read back from the KPI nodes just built, so the printed figures are
       literally the ones on screen rather than a second formatting of the same
       result. `.lbl` and `.val` are metricCard's own classes. */
    [...kpis.children].map(k => {
      const label = k.querySelector('.lbl')?.textContent?.trim() ?? '';
      return { label: [label, label], value: k.querySelector('.val')?.textContent?.trim() ?? '' };
    }).filter(o => o.label[0] && o.value))));
  c.append(kpis);

  const hurdle = h('input', {type:'number',min:'0',max:'100',step:'0.5',
    value:homeState.labHurdle === null ? '' : String(homeState.labHurdle),
    'aria-label':L(['Your unlevered return hurdle (%)','你的无杠杆回报门槛（%）']),
    onchange:event => {
      const value=event.target.value.trim(),number=Number(value);
      homeState.labHurdle=value!==''&&Number.isFinite(number)&&number>=0&&number<=100?number:null;
      requestRender();
    }});
  c.append(h('p', {class:'note'}, h('label',{},L(['Your unlevered return hurdle (%) ','你的无杠杆回报门槛（%） ']),hurdle)));
  const price=entryPriceAtHurdle(now,homeState.labHurdle===null?null:homeState.labHurdle/100);
  if(price) c.append(h('div',{class:'note'},L([
    `At a ${fmtPct(price.hurdle*100,1)} unlevered hurdle, the maximum additional upfront premium is ${fmtUSDk(price.entryPremiumPerMW)}/MW. A negative figure means the modelled cost needs a discount. Construction spending is unchanged; the premium is paid at investment.`,
    `按${fmtPct(price.hurdle*100,1)}无杠杆门槛，投资时可额外支付的最高溢价为每MW ${fmtUSDk(price.entryPremiumPerMW)}。负数表示需在模型成本上折价。建设支出时间不变，溢价在投资时支付。`,
  ])));
  const proceeds=now.cumOp+now.exitVal;
  c.append(h('p',{class:'cap'},L(['Exit value as a share of total proceeds: ','退出价值占总收入：']),
    proceeds>0?fmtPct(now.exitVal/proceeds*100,1):'—'));
  const saveStatus=h('span',{role:'status'});
  c.append(h('button',{class:'btn',onclick:async()=>{
    try {
      let release=null;
      try { const response=await fetch('/release.json');if(response.ok)release=await response.json(); } catch {}
      const record=createCaseRecord({market:seedMarket,strategyId,exitYear,overrides,
        conventions:debt?conventions:null,modelCommit:typeof __MODEL_COMMIT__==='string'?__MODEL_COMMIT__:'local-unavailable',
        dataVintages:release?.data || null,projectEvidence:homeState.labProjectEvidence[market.manifest.id] || {}});
      record.entryPrice=price;
      const url=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json'}));
      const link=document.createElement('a');link.href=url;link.download=`${market.manifest.id}-investment-case.json`;link.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      saveStatus.textContent=L(['Case saved with inputs, cash flows, financing and unresolved gates.','已保存假设、现金流、融资口径与未解决事项。']);
    } catch {saveStatus.textContent=L(['The case could not be saved. Please try again.','未能保存，请重试。']);}
  }},L(['Save investment case','保存投资情景'])),saveStatus);
  const evidence=homeState.labProjectEvidence[market.manifest.id] ||= {};
  const unresolved=projectEvidenceStatus(evidence).filter(g=>g.status==='unresolved').length;
  const gates=h('details',{},h('summary',{},L([`Project evidence · ${unresolved} unresolved`,`项目证据 · ${unresolved}项未解决`])),
    h('p',{class:'cap'},L(['Document references are saved only in your downloaded case. A reference records your review; it is not independent verification. Missing evidence stays unresolved and changes no market score.',
      '资料索引只保存在你下载的情景中。提供索引记录的是你的复核，不代表独立验证。缺少证据的事项保持未解决，不改变市场评分。'])));
  for(const gate of PROJECT_EVIDENCE_GATES){
    const item=evidence[gate.id] ||= {status:'unresolved',sourceRef:''};
    const update=()=>{
      item.status=status.value;item.sourceRef=reference.value;
      const missing=projectEvidenceStatus(evidence).filter(g=>g.status==='unresolved').length;
      gates.querySelector('summary').textContent=L([`Project evidence · ${missing} unresolved`,`项目证据 · ${missing}项未解决`]);
    };
    const status=h('select',{'aria-label':L(gate.label),onchange:update},
      ...[['unresolved',['Unresolved','未解决']],['provided',['Evidence provided','已提供证据']],['not-applicable',['Not applicable, with reason','不适用，需说明']]].map(([value,label])=>
        h('option',{value,...(item.status===value?{selected:''}:{})},L(label))));
    const reference=h('input',{type:'text',value:item.sourceRef,'aria-label':L([`${gate.label[0]} reference or reason`,`${gate.label[1]}资料或理由`]),onchange:update});
    gates.append(h('p',{},h('label',{},L(gate.label),' ',status,' ',reference)));
  }
  c.append(gates);

  /* The $1M recovery path, on the same basis as the cockpit's waterfall so the
     two can be read side by side. */
  const sf = 1e6 / now.net;
  waterfall(c, {
    yfmt: v => '$' + fmtN(v) + 'k', h: 210,
    steps: [
      { l: ['$1M invested (net of grant)', '投入100万美元（扣除补贴后）'], v: -1000, t: 'start' },
      { l: ['Operating cash, years 1–' + exitYear, '第1–' + exitYear + '年运营现金'],
        v: Math.round(now.cumOp * sf / 1000), t: 'd' },
      { l: ['Exit proceeds (yr ' + exitYear + ')', '退出所得（第' + exitYear + '年）'],
        v: Math.round(now.exitVal * sf / 1000), t: 'd' },
      { l: ['Net position', '净头寸'],
        v: Math.round((now.cumOp + now.exitVal - now.net) * sf / 1000), t: 'total' },
    ],
  });

  if (debt && debt.irrLevered != null && debt.irrUnlevered != null){
    const accretive = debt.irrLevered > debt.irrUnlevered;
    c.append(h('div', { class: accretive ? 'reco' : 'warnbox' },
      h('b', {}, accretive
        ? L(['Leverage is accretive here. ', '此处杠杆具增厚作用。'])
        : L(['Leverage dilutes equity here. ', '此处杠杆摊薄权益回报。'])),
      L(accretive
        ? ['The project return clears the all-in cost of debt, so borrowing adds to the equity return rather than subtracting from it.',
           '项目回报高于综合债务成本，因此举债将增厚而非削弱权益回报。']
        : ['The project return sits below the all-in cost of debt. A route can carry a high secured share, finance easily, and still be a poor use of equity — bankable and worth owning are different tests.',
           '项目回报低于综合债务成本。某一路径可能锁定占比高、融资顺利，却仍是权益资本的低效运用 — 可融资与值得持有是两个不同的检验。'])));
  }

  parent.append(c);
  return now;
}

/* ---- entry point -------------------------------------------------------- */

export function renderInvestmentLab(main, marketList, exitYear){
  const engineReady = marketList.filter(m => m.comparison && m.comparison.engineReady !== false);
  if (!engineReady.length) return;

  const seedMarket = labMarket(engineReady);
  if (!seedMarket) return;

  const routes = supportedStrategies(seedMarket);
  const strategyId = routes.some(s => s.id === homeState.labStrategy)
    ? homeState.labStrategy
    : baseStrategy(seedMarket);

  const overrides = labOverrides(seedMarket.manifest.id);
  const fields = labFieldsFor(seedMarket);
  const market = withOverrides(seedMarket, overrides);
  const conventions = conventionsWith(homeState.labDebt);

  const c = spacedCard(T.title, [badge('calc'), badge('illus')]);
  c.id = 'lab';
  c.classList.add('lab-card');
  c.append(h('div', { class: 'note' }, L(T.intro)));
  renderControls(c, engineReady, seedMarket, strategyId);
  main.append(c);

  renderAcquisitionLab(main, seedMarket, strategyId, overrides);
  const legacy=h('details',{class:'lab-legacy',ontoggle:event=>{homeState.labLegacyOpen=event.target.open;}},
    h('summary',{},L(['Reference construction-cost comparison','参考建设成本比较'])),
    h('p',{class:'cap'},L(['This compares returns at the modelled build cost. Acquisition ceilings are calculated above.','这里按模型建设成本比较回报；收购价格上限在上方单独计算。'])));
  legacy.open=!!homeState.labLegacyOpen;
  const legacyExit=h('select',{'aria-label':L(['Reference sale year','参考方案出售年度']),onchange:event=>{homeState.exitYear=Number(event.target.value);rerender();}},
    EXIT_YEARS.map(year=>h('option',{value:year},String(year))));legacyExit.value=exitYear;
  legacy.append(h('label',{},L(['Reference sale year ','参考方案出售年度 ']),legacyExit));
  renderLegacyCapitalControls(legacy);
  const body = h('div', { class: 'lab-body' });
  renderAssumptions(body, seedMarket, fields, overrides);
  renderOutputs(body, market, seedMarket, strategyId, exitYear, conventions, fields, overrides);
  legacy.append(body);

  if (homeState.labLevered){
    const debtWrap = h('div', { class: 'lab-debt' });
    /* The same panel the six market dashboards used to carry, now reading the
       scenario rather than the seeds. */
    renderProjectDebt(debtWrap, market, exitYear, { conventions });
    legacy.append(debtWrap);
  }

  const tail = h('div');
  tail.append(why([
    'Test lower revenues and higher costs before setting a purchase price. Verify the contracts and project inputs, and use the acquisition calculation above for the price decision.',
    '确定收购价格前，先测试收入下降、成本上升的情况，再核实合同和项目资料。收购决策使用上方的价格上限及对应回报。',
  ], ['Check the downside before setting a price','确定价格前先看不利情景']));
  legacy.append(tail);main.append(legacy);
}
