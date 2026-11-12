/* ---------------------------------------------------------------------------
   National Electricity Market: the step-through sequences of its scene.

   Content, and nothing else: each step declares a scenario for the drawing
   (../scene.js) and says one thing about it. Every sentence restates the
   market's existing research: the signed story script (src/markets/nem/
   story.js, shots nem-01 to nem-10), the research tabs and the reading's own
   shared lines. Each step cites source ids already in this market's public
   content (../content/nem.js). No step types a figure: a year is a date, and
   the shares a tender agreement pays are read in the research, not here.

   Four sequences:
     shift     solar surplus to evening peak   volatility, arbitrage, saturation
     fcas      one megawatt, two markets       response against energy, headroom
     cis       a CIS award is a contract       the shared six-stage template
     network   a constrained network           links, loss factors, what is left

   tests/public-sequences.test.js holds every step to these rules.
   --------------------------------------------------------------------------- */
import { contracted } from './contracted.js';

const ENERGY_GATES = [['Registered', '已注册'], ['Dispatched', '已被调度'], ['Delivered', '已交付']];
const FCAS_GATES = [['Registered', '已注册'], ['Enabled', '已启用'], ['Responded', '已响应']];

const shift = {
  id: 'nem-shift', home: ['system'], family: 'shifting',
  title: ['Solar surplus to evening peak', '从午间光伏富余到晚高峰'],
  gates: ENERGY_GATES, base: { network: 'open' },
  steps: [
    { id: 'surplus', asks: 'system', view: 'system', state: { time: 'day', solar: 'on', flow: 'idle', soc: 0.2 },
      title: ['Midday: solar pushes the price down', '正午：光伏压低电价'],
      text: ['Each NEM region has its own spot price, set every five minutes. Around midday solar output is high and the regional price is low.',
             'NEM每个价区都有自己的现货价格，每五分钟出清一次。正午前后光伏出力高，价区电价低。'],
      sources: ['SRC-NEM-03', 'SRC-NEM-05'] },
    { id: 'charge', asks: 'response', view: 'storage', state: { time: 'day', solar: 'on', flow: 'charge', soc: 0.4 },
      title: ['The battery buys at midday', '电池在中午买入'],
      text: ['The battery charges while energy is cheap. Charging and discharging use the same connection, and conversion losses reduce what it can later deliver.',
             '电池在电价低时充电。充放电共用同一并网连接，转换损耗会减少之后可交付的电量。'],
      sources: ['SRC-NEM-05', 'SRC-NEM-06'] },
    { id: 'peak', asks: 'system', view: 'system', state: { time: 'dusk', solar: 'off', flow: 'discharge', soc: 0.8 },
      title: ['Evening: demand peaks as solar fades', '傍晚：光伏回落，负荷达到高峰'],
      text: ['In the evening peak the regional price is higher, and the battery sells what it stored.',
             '晚高峰时价区电价更高，电池卖出此前储存的电量。'],
      sources: ['SRC-NEM-05', 'SRC-NEM-06'] },
    { id: 'paid', asks: 'payer', view: 'mechanism', state: { time: 'dusk', solar: 'off', flow: 'discharge', soc: 0.5 },
      title: ['The market pays for energy, and only for energy', '市场只为电能量付费'],
      text: ['AEMO settles the energy discharged at the regional price, adjusted for the loss factor at the connection point. The battery keeps the gap between what it sold for and what it paid to charge. Nothing is paid for standing ready.',
             'AEMO按价区电价结算放电电量，并乘以并网点的网损系数。电池赚取的是售电所得与充电成本之间的差额；随时待命不付费。'],
      sources: ['SRC-NEM-02', 'SRC-NEM-19', 'SRC-NEM-05'] },
    { id: 'squeeze', asks: 'limit', view: 'system', state: { time: 'dusk', solar: 'off', flow: 'discharge', soc: 0.5, fleet: 'crowded' },
      title: ['Every battery added narrows the gap', '每增加一台电池，价差就更窄'],
      text: ['Batteries buy at midday and sell in the evening, and in doing so they pull the two prices together. The merchant spread is shrinking because of batteries themselves, so it is not a base to underwrite.',
             '电池在中午买入、傍晚卖出，这样做的同时也把两个时段的价格拉近了。市场化价差的收窄正是电池自身造成的，因此它不能作为承销的基础。'],
      sources: ['SRC-NEM-05', 'SRC-NEM-06', 'SRC-NEM-07'] },
  ],
};

const fcas = {
  id: 'nem-fcas', home: ['storage'], family: 'frequency',
  title: ['One megawatt, two markets', '一兆瓦，两个市场'],
  gates: FCAS_GATES, base: { network: 'open', time: 'dusk', solar: 'off' },
  steps: [
    { id: 'need', asks: 'system', view: 'system', state: { flow: 'idle', signal: 'frequency', soc: 0.6 },
      title: ['Frequency has to be held steady', '频率必须保持稳定'],
      text: ['After South Australia’s black system in 2016, keeping frequency steady became a paid priority. AEMO buys fast response through the frequency control ancillary services markets, FCAS.',
             '2016年南澳大利亚全州停电之后，维持频率稳定成为需要付费的优先事项。AEMO通过频率控制辅助服务（FCAS）市场采购快速响应。'],
      sources: ['SRC-NEM-18', 'SRC-NEM-16'] },
    { id: 'respond', asks: 'response', view: 'storage', state: { flow: 'discharge', signal: 'frequency', headroom: true, soc: 0.6 },
      title: ['The battery answers within seconds', '电池在数秒内响应'],
      text: ['Power changes immediately; energy limits how long it can continue. FCAS is a power product: response is measured in seconds, and the energy delivered is small.',
             '功率可以立即改变，但电量限制了动作能持续多久。FCAS是功率型产品：响应以秒计，实际交付的电量很小。'],
      sources: ['SRC-NEM-05', 'SRC-NEM-17'] },
    { id: 'split', asks: 'constraint', view: 'storage', state: { flow: 'discharge', headroom: true, soc: 0.6 },
      title: ['One megawatt cannot be sold twice', '同一兆瓦不能卖两次'],
      text: ['Power held in reserve for FCAS cannot be sold as energy in the same interval. The same power and energy cannot be promised twice.',
             '为FCAS预留的功率，在同一时段不能再作为电能量出售。同一份功率和电量不能重复承诺。'],
      sources: ['SRC-NEM-05', 'SRC-NEM-06'] },
    { id: 'paid', asks: 'payer', view: 'mechanism', state: { flow: 'discharge', headroom: true, soc: 0.6 },
      title: ['AEMO pays for response that is enabled', 'AEMO为已启用的响应付费'],
      text: ['Three conditions stand between the response and the payment: the battery is registered for the service, its offer is enabled, and it responds when called. A battery that could respond but is not enabled is paid nothing for it.',
             '从响应到付款之间有三个条件：电池已注册提供该服务，其报价被启用，并在被调用时作出响应。能够响应但未被启用的电池，不会因此获得任何付款。'],
      sources: ['SRC-NEM-05', 'SRC-NEM-06'] },
    { id: 'filled', asks: 'limit', view: 'system', state: { flow: 'discharge', fleet: 'crowded', soc: 0.6 },
      title: ['Fast services filled first', '快速服务最先饱和'],
      text: ['As the fleet grew, batteries took over most of these services and earned less from them. A battery’s revenue now rests on moving energy across the day.',
             '随着电池规模扩大，电池承担了这些服务的大部分，从中获得的收入却越来越少。如今电池的收入依赖于在一天之内转移电能量。'],
      sources: ['SRC-NEM-05', 'SRC-NEM-06', 'SRC-NEM-20'] },
  ],
};

const cis = contracted({
  id: 'nem-cis', home: ['mechanism'],
  title: ['A CIS award is a contract', 'CIS中标是一份合同'],
  gates: [['Eligible bid', '合资格投标'], ['Executed agreement', '已签协议'], ['Fully operating', '全面投运']],
  base: { network: 'open' },
  stages: {
    availability: { name: ['A battery able to operate', '能够运行的电池'],
      title: ['The market pays nothing for standing ready', '市场不为待命付费'],
      text: ['The NEM pays for energy and nothing for standing ready, so a battery here has no secured revenue unless it signs a contract for it.',
             'NEM只为电能量付费，随时待命不付费；这里的电池除非签订合同，否则没有任何锁定收入。'],
      sources: ['SRC-NEM-02', 'SRC-NEM-14'] },
    accreditation: { name: ['A bid in a government tender', '参加政府招标'],
      title: ['Each bidder names a floor, a ceiling and a payment cap', '每个投标方报出下限、上限和支付上限'],
      text: ['Under the Capacity Investment Scheme, each bidder names a yearly revenue floor, a ceiling and a payment cap. An application is not an award.',
             '在容量投资计划下，每个投标方自行报出年度收入下限、上限和支付上限。申请不等于中标。'],
      sources: ['SRC-NEM-08', 'SRC-NEM-09'] },
    award: { name: ['An executed agreement', '已签署的协议'],
      title: ['An award is a project’s own agreement', '中标是项目自己的协议'],
      text: ['Its floor, ceiling, payment cap, start and expiry must be read from the contract. The floors are not published.',
             '收入下限、上限、支付限额、起始与到期条件须从合同核对。各项目的下限均不公开。'],
      sources: ['SRC-NEM-12', 'SRC-NEM-13'] },
    obligation: { name: ['Fully operating before support starts', '全面投运后才开始托底'],
      title: ['Support starts only once the battery is fully operating', '托底只在电池全面投运后才开始'],
      text: ['An award pays nothing while the battery is being built. Support starts only once it is fully operating, and lasts for the term in its agreement.',
             '电池建设期间，中标合同不支付任何款项。托底只在电池全面投运后才开始，并持续至协议约定的期限。'],
      sources: ['SRC-NEM-08'] },
    performance: { name: ['Market revenue, year by year', '逐年的市场收入'],
      title: ['The battery still trades; each year is measured', '电池仍在交易，逐年核算'],
      text: ['Once the battery is fully operating, the Commonwealth settles each year against the floor and ceiling in its agreement.',
             '电池全面投运后，联邦政府每年按协议中的下限和上限进行结算。'],
      sources: ['SRC-NEM-08', 'SRC-NEM-12'] },
    settlement: { name: ['A top-up, or a pay-back', '补足，或返还'],
      title: ['It cuts off the bad years and shares the good ones', '去掉坏年景，分享好年景'],
      text: ['Below the floor the Commonwealth tops up most of the gap. Above the ceiling the battery pays back part of the excess. After the term the battery earns only what the market pays.',
             '收入低于下限时，联邦政府补足差额的大部分；高于上限时，电池须返还超出部分的一部分。合同期满后，电池只能获得市场支付的收入。'],
      sources: ['SRC-NEM-08', 'SRC-NEM-10'] },
  },
});

const network = {
  id: 'nem-network', home: ['system'], family: 'network',
  title: ['A constrained network', '受约束的电网'],
  gates: ENERGY_GATES,
  steps: [
    { id: 'regions', asks: 'system', view: 'system', state: { time: 'day', network: 'open', flow: 'idle', soc: 0.5 },
      title: ['Regions joined by links of limited size', '各价区由容量有限的联络线相连'],
      text: ['The NEM runs down the east coast from Queensland to South Australia and across to Tasmania. Each region has its own spot price, and the regions trade through links of limited size.',
             'NEM沿东海岸从昆士兰一路延伸至南澳大利亚，并跨海连接塔斯马尼亚。每个价区都有自己的现货价格，各价区之间通过容量有限的联络线互相交易。'],
      sources: ['SRC-NEM-03', 'SRC-NEM-04', 'SRC-NEM-01'] },
    { id: 'full', asks: 'constraint', view: 'system', state: { time: 'day', network: 'constrained', flow: 'idle', soc: 0.5 },
      title: ['When a link is full, prices separate', '联络线满载时，价格分离'],
      text: ['A NEM battery earns its region’s price; the links decide how often neighbouring regions share one. When a link is at its limit, cheap power on one side cannot reach the other.',
             'NEM的电池按所在价区的价格获利；联络线决定相邻价区多常共享同一价格。联络线达到上限时，一侧的低价电力无法送到另一侧。'],
      sources: ['SRC-NEM-03', 'SRC-NEM-04'] },
    { id: 'connection', asks: 'response', view: 'storage', state: { time: 'day', network: 'constrained', flow: 'discharge', signal: 'dispatch', soc: 0.5 },
      title: ['The battery acts only through its own connection', '电池只能通过自身的并网点动作'],
      text: ['Controls must respect the connection agreement as well as the battery’s usable energy. Metering and connection terms determine the permissible import and export.',
             '控制系统既要遵守并网协议，也要服从电池可用电量限制。计量与并网条款决定允许的输入与输出。'],
      sources: ['SRC-NEM-03', 'SRC-NEM-19'] },
    { id: 'loss', asks: 'value', view: 'mechanism', state: { time: 'day', network: 'constrained', flow: 'discharge', soc: 0.4 },
      title: ['Energy is settled through a loss factor', '电量乘以网损系数后结算'],
      text: ['At its own connection point a battery’s energy is settled through a loss factor that AEMO fixes for each financial year, so two batteries in one region can earn different amounts for the same output.',
             '在电池自身的并网点上，其电量要乘以AEMO每个财年确定一次的网损系数结算，因此同一价区的两台电池，相同出力也可能收入不同。'],
      sources: ['SRC-NEM-19', 'SRC-NEM-05'] },
    { id: 'remainder', asks: 'limit', view: 'system', state: { time: 'dusk', solar: 'off', network: 'constrained', flow: 'discharge', soc: 0.4 },
      title: ['Region and connection point decide what is left', '价区与并网点决定剩下的收入'],
      text: ['A full link restricts what can be dispatched, and the loss factor scales what is settled. Region and connection point decide the merchant remainder.',
             '联络线满载限制可调度的电量，网损系数折算可结算的电量。价区与并网点决定其余的市场化收入。'],
      sources: ['SRC-NEM-05', 'SRC-NEM-19'] },
  ],
};

export const SEQUENCES = [shift, fcas, cis, network];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
