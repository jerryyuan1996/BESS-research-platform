import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { loadSummary } from '../live/client.js';
import { STORAGE_TARIFFS } from '../markets/nem/data/storageTariffs.js';
import { signedNetworkPerMWYear } from '../derive/networkValue.js';

const money = amount => new Intl.NumberFormat(L(['en-AU','zh-CN']), { maximumFractionDigits: 0 }).format(amount) + ' AUD/MW/' + L(['yr','年']);
const message = pair => h('p', { class:'ix-caption' }, L(pair));
const row = (label, value) => h('tr', {}, h('th', { scope:'row' }, L(label)), h('td', {}, value));

export function networkReplay(card) {
  const selected = h('select', { 'aria-label': L(['Network distributor and tariff','配网公司及费率']) },
    h('option', { value: '' }, L(['Choose a distributor','选择配网公司'])));
  for (const t of STORAGE_TARIFFS) {
    if (t.id === 'sapn') {
      selected.append(h('option', { value:t.id }, t.distributor + ' · HVBG · ' + L(['outside CBD','非 CBD'])),
        h('option', { value:'sapn-cbd' }, t.distributor + ' · HVBGCBD · CBD'));
    } else selected.append(h('option', { value:t.id }, t.distributor + ' · ' + t.code));
  }
  const output = h('div', { 'aria-live':'polite' });
  const seed = h('p', { class:'ix-basis-note' }, L(['Network amount used in the investment card','投资卡采用的配网净额']), ' · ', money(card.distribution.networkPerMW));
  selected.addEventListener('change', async () => {
    const key = selected.value;
    output.replaceChildren();
    if (!key) return;
    const t = STORAGE_TARIFFS.find(t => t.id === (key === 'sapn-cbd' ? 'sapn' : key));
    const datasetId = 'nem-' + t.region.toLowerCase() + '-prices';
    const details = message(t.eligibility);
    const reference = h('a', { href:t.source, target:'_blank', rel:'noopener noreferrer' },
      t.financialYear, ' · ', t.code, ' · ', t.page);
    const extent = message(t.windows);
    output.append(details, extent, reference);
    const state = message(['Loading regional price coverage…','正在读取地区电价覆盖情况…']);
    output.append(state);
    const summary = await loadSummary(datasetId);
    if (key !== selected.value) return;
    const result = summary?.storageTariffs?.[key];
    if (!result) {
      state.textContent = L(['Regional price coverage is not available yet.','当前尚无可读取的地区电价覆盖记录。']); return;
    }
    if (result.status === 'insufficient-days') {
      state.textContent = L(['Complete local price days','完整当地电价日']) + ' · ' + result.days + '/28';
      return;
    }
    if (result.status === 'event-calendar') {
      state.textContent = L(['The historical critical-event calendar is required to calculate import charges and export credits.',
        '计算购电费和售电抵扣需取得该期间的关键需量事件日历。']); return;
    }
    if (result.status === 'tariff-expired') {
      state.textContent = L(['The latest observed price is outside this tariff edition. The next published schedule is required.',
        '最新观测电价已超出本版费率有效期，需核对下一版价表。']); return;
    }
    state.textContent = result.from + ' – ' + result.to + ' · ' + result.days + ' ' + L(['complete local days','个完整当地电价日']);
    const pf = h('input', { type:'number', min:'0.01', max:'1', step:'0.01', 'aria-label':L(['Site power factor','项目功率因数']) });
    const rows = h('tbody');
    if (result.needsPowerFactor) output.append(h('label', {}, L(['Site power factor (0–1)','项目功率因数（0–1）']), ' ', pf));
    const display = () => {
      const signed = signedNetworkPerMWYear(result, pf.valueAsNumber);
      let total;
      if (signed != null) total = money(signed);
      else if (result.billing === 'rolling-history') total = L(['Requires 12 complete months of demand history','需 12 个月完整需量历史']);
      else if (result.demandPerMWYearAtUnity == null) total = L(['Awaiting a complete billing month','等待完整计费月']);
      else total = L(['Enter the site power factor','请输入项目功率因数']);
      const demand = result.demandPerMWYearAtUnity == null ? null
        : result.needsPowerFactor ? (signed == null ? null : result.demandPerMWYearAtUnity / pf.valueAsNumber) : result.demandPerMWYearAtUnity;
      rows.replaceChildren(
        row(['Wholesale arbitrage, annualised','批发套利，年化'], money(result.merchantPerMWYear)),
        row(['Network energy charges and credits, signed','分时购电费及售电抵扣，带符号'], money(result.variableNetworkPerMWYear)),
        row(['Fixed network access, annual cost','固定配网接入费，年费用'], money(result.fixedPerMWYear)),
        row(['Network demand charge, annual cost','配网需量费，年费用'], demand == null ? '—' : money(demand)),
        row(['Net network value, annualised','配网净额，年化'], total));
    };
    pf.addEventListener('input', display);
    display();
    output.append(h('div', { class:'ix-table-scroll' }, h('table', { class:'ix-table' }, rows)));
    if (result.billing === 'latest-rolling-annual-rate') output.append(message(['Demand cost annualises the latest 12-month maximum at the published rate.',
      '需量费用按最近 12 个月的实测价格调度峰值及本版费率年化。']));
    if (result.billingMonths) output.append(message([result.billingMonths + ' complete billing months support the annualised demand charge.',
      '需量费用按 '+ result.billingMonths +' 个完整计费月年化。']));
  });
  return h('section', { class:'ix-section', 'aria-label':L(['NEM network tariff replay','澳洲配网费率回算']) },
    h('h3', {}, L(['Network tariff replay','配网费率回算'])), seed,
    message(['Apply the selected tariff to observed five-minute regional dispatch prices for the reference battery. The profile assumes the connection permits the modelled power.',
      '将所选费率应用于实测的地区五分钟调度电价，按参考储能的功率和时长回算。此情景假设接入条件允许该功率。']), selected, output);
}
