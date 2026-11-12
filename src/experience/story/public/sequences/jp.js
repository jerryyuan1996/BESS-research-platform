/* ---------------------------------------------------------------------------
   Japan: the step-through sequences of its scene.

   One sequence for each area and one for the national award they share. A
   reader in Kyushu sees Kyushu's and the national one; the area switch in the
   reading shows the others.

   Content, and nothing else: each step declares a scenario for the drawing
   (../scene.js) and says one thing about it. Every sentence restates the
   signed story script (src/markets/jp/story.js: the area shots -07 and -10,
   and jp-01, jp-05, jp-06, jp-09 and jp-11) or the reading's catalogue line
   for the area. Each step cites source ids that are in that area's own source
   pool (../content/jp.js): an area sequence never leans on another area's
   evidence. No step types a figure; a year is a date.

   tests/public-sequences.test.js holds every step to these rules.
   --------------------------------------------------------------------------- */
import { contracted } from './contracted.js';

const AWARD_GATES = [['Eligible bid', '合资格投标'], ['Award', '中标'], ['Performance', '履约']];

const kyushu = {
  id: 'jp-kyushu-surplus', home: ['system', 'storage'], family: 'shifting',
  title: ['Surplus, curtailment and charging access', '富余、弃电与充电准入'],
  gates: AWARD_GATES,
  steps: [
    { id: 'solar', asks: 'system', view: 'system', state: { time: 'day', solar: 'on', network: 'open', flow: 'idle', soc: 0.2 },
      title: ['Noon in Kyushu: power to spare', '九州的中午：电力有富余'],
      text: ['Solar spread fast across Kyushu after the feed-in tariff began. At noon the area can have more power than it uses.',
             '固定电价制度实施后，光伏在九州迅速普及。中午时段，区域内的电力可能多于自身用量。'],
      sources: ['SRC-JP-08'] },
    { id: 'link', asks: 'constraint', view: 'system', state: { time: 'day', solar: 'curtailed', network: 'constrained', flow: 'idle', soc: 0.2 },
      title: ['One way out, and it fills', '只有一条外送通道，而且会满'],
      text: ['Surplus leaves for Honshu through one interconnection. When that is full, the utility curtails renewable output.',
             '富余电力只能经由一条联络线送往本州。联络线满载时，电力公司对新能源实施出力控制。'],
      sources: ['SRC-JP-08', 'SRC-JP-10'] },
    { id: 'charge', asks: 'response', view: 'storage', state: { time: 'day', solar: 'curtailed', network: 'constrained', flow: 'charge', soc: 0.4 },
      title: ['The battery can charge, if its connection lets it', '并网条件允许时，电池可以充电'],
      text: ['A Kyushu battery can charge while solar is being curtailed, if its connection lets it draw power then, and sell when the evening price returns.',
             '九州电池可以在光伏被弃电时充电，前提是其并网条件允许在这些时段取电，然后在晚间电价回升时售电。'],
      sources: ['SRC-JP-08', 'SRC-JP-10'] },
    { id: 'access', asks: 'limit', view: 'storage', state: { time: 'day', solar: 'curtailed', network: 'constrained', flow: 'idle', breaker: 'open', soc: 0.2 },
      title: ['Curtailment is not charging access', '弃电不等于充电准入'],
      text: ['Curtailment is evidence of surplus; it does not establish free charging or an available connection. A battery whose connection does not let it draw power then stores nothing.',
             '弃电是富余电量的证据，并不代表可以免费充电或已获得并网条件。并网条件不允许在该时段取电的电池，什么也存不下。'],
      sources: ['SRC-JP-08', 'SRC-JP-10'] },
    { id: 'award', asks: 'payer', view: 'mechanism', state: { time: 'dusk', solar: 'off', network: 'open', flow: 'discharge', soc: 0.6 },
      title: ['The award pays; trading adds little', '付款来自中标合同，交易贡献有限'],
      text: ['The award takes back most of the trading margin, so cheap charging adds little to the holder’s return. What matters more is that the battery can always charge enough to hold the floor.',
             '中标合同会收回这部分利润的大半，因此廉价充电对持有人回报的提升有限。更重要的是，电池始终能充入足够的电量以守住最低时长。'],
      sources: ['SRC-JP-01'] },
    { id: 'shrinks', asks: 'limit', view: 'system', state: { time: 'day', solar: 'on', network: 'open', flow: 'charge', fleet: 'crowded', soc: 0.4 },
      title: ['Every gain in export shrinks the surplus', '外送能力每提高一分，弃电就减少一分'],
      text: ['A transfer-trip system now lets more surplus out, and more batteries chase the same noon hours. Each shrinks the curtailment a battery could use.',
             '转送遮断系统让更多富余电力得以送出，同时有更多电池追逐同样的中午时段。两者都会减少电池可以利用的弃电。'],
      sources: ['SRC-JP-10', 'SRC-JP-08'] },
  ],
};

const hokkaido = {
  id: 'jp-hokkaido-link', home: ['system', 'storage'], family: 'network',
  title: ['A small system, the Honshu link and controlled charging', '小型系统、本州联络线与受控充电'],
  gates: AWARD_GATES,
  steps: [
    { id: 'small', asks: 'system', view: 'system', state: { time: 'day', solar: 'on', network: 'open', flow: 'idle', soc: 0.5 },
      title: ['A small system with strong wind', '风资源丰富的小型系统'],
      text: ['Hokkaido is a small system with strong wind, joined to Honshu by direct-current links under the strait.',
             '北海道是一个风资源丰富的小型电力系统，通过海峡下的直流联络线与本州相连。'],
      sources: ['SRC-JP-15', 'SRC-JP-07'] },
    { id: 'exposed', asks: 'constraint', view: 'system', state: { time: 'night', solar: 'off', network: 'constrained', flow: 'idle', soc: 0.5 },
      title: ['The link decides how much help can arrive', '联络线决定外部支援能到多少'],
      text: ['In 2018 an earthquake set off a blackout of the whole area, a first for Japan. A new link followed, and more capacity is being added.',
             '2018年，一场地震引发全区域大停电，在日本尚属首次。此后新增一条联络线，并将继续扩容。'],
      sources: ['SRC-JP-07', 'SRC-JP-15'] },
    { id: 'limit', asks: 'constraint', view: 'storage', state: { time: 'day', solar: 'on', network: 'constrained', flow: 'charge', signal: 'limit', soc: 0.3 },
      title: ['Early connection comes with a charging limit', '提前并网附带充电限制'],
      text: ['A battery that wants to connect early must accept a device that limits its charging, on listed parts of the network, until reinforcement is built.',
             '希望提前并网的电池，在指定电网系统中必须接受限制其充电的装置，直至电网加固完成。'],
      sources: ['SRC-JP-11'] },
    { id: 'room', asks: 'response', view: 'storage', state: { time: 'day', solar: 'on', network: 'constrained', flow: 'idle', signal: 'limit', soc: 0.3 },
      title: ['Room to charge is the scarce input', '充电空间是稀缺资源'],
      text: ['Room to charge and to export is the scarce input here. A battery whose charging is limited may not store enough to deliver the hours it promised.',
             '在这里，充电和外送的空间是稀缺资源。充电受限的电池，可能存不下足以兑现承诺时长的电量。'],
      sources: ['SRC-JP-11', 'SRC-JP-01'] },
    { id: 'risk', asks: 'payer', view: 'mechanism', state: { time: 'dusk', solar: 'off', network: 'constrained', flow: 'idle', signal: 'limit', soc: 0.3, delivers: false },
      title: ['Under the award, the limit is the holder’s risk', '在中标合同下，限制由持有人承担'],
      text: ['OCCTO treats such limits, like fade, as risks the declared capacity must already allow for, so a holder that declared too much faces penalties every year.',
             'OCCTO将这类限制与衰减一样，视为申报容量必须事先考虑的风险，因此申报过高的持有人每年都会面临处罚。'],
      sources: ['SRC-JP-01', 'SRC-JP-11'] },
    { id: 'eases', asks: 'limit', view: 'system', state: { time: 'day', solar: 'on', network: 'open', flow: 'charge', soc: 0.5 },
      title: ['The link expansion eases export over time', '联络线扩容将随时间缓解外送'],
      text: ['The link to Honshu is being expanded, which eases export over time. Until then, check the charging limits against the hours the award requires.',
             '通往本州的联络线正在扩容，外送压力会随时间缓解。在此之前，先核对充电限制与中标合同要求的时长。'],
      sources: ['SRC-JP-15', 'SRC-JP-11'] },
  ],
};

const tokyo = {
  id: 'jp-tokyo-access', home: ['system', 'storage'], family: 'network',
  title: ['A demand centre, connection access and converter limits', '负荷中心、并网准入与变频站限制'],
  gates: AWARD_GATES,
  steps: [
    { id: 'demand', asks: 'system', view: 'system', state: { time: 'dusk', solar: 'off', network: 'open', flow: 'idle', soc: 0.6 },
      title: ['Japan’s largest demand area', '日本最大的负荷区'],
      text: ['Tokyo is Japan’s largest demand area, on the eastern frequency.',
             '东京是日本最大的负荷区，位于东部频率区。'],
      sources: ['SRC-JP-17', 'SRC-JP-14'] },
    { id: 'converters', asks: 'constraint', view: 'system', state: { time: 'dusk', solar: 'off', network: 'constrained', flow: 'idle', soc: 0.6 },
      title: ['The west can help only through converters', '西部的电力只能经变频站送入'],
      text: ['The east and the west run at different frequencies, so power crosses between the halves only through converter stations. They are being expanded.',
             '东部与西部的频率不同，两半之间的电力只能经由变频站交换。变频站正在扩容。'],
      sources: ['SRC-JP-14'] },
    { id: 'queue', asks: 'constraint', view: 'storage', state: { time: 'day', solar: 'on', network: 'constrained', flow: 'idle', breaker: 'open', soc: 0.1 },
      title: ['Getting connected is the bottleneck', '新电池并网是瓶颈'],
      text: ['Getting a new battery connected is the bottleneck: one applicant may have only a limited number of connection studies open at a time.',
             '新电池并网是瓶颈：每个申请人同时进行的并网研究数量受到限制。'],
      sources: ['SRC-JP-13'] },
    { id: 'trade', asks: 'response', view: 'storage', state: { time: 'dusk', solar: 'off', network: 'open', flow: 'discharge', soc: 0.7 },
      title: ['Inside the award, a Tokyo battery still trades', '在中标合同之内，东京电池仍可交易'],
      text: ['It charges when the area price is low, discharges into the evening peak, and can offer balancing services.',
             '它在区域电价低时充电，在晚高峰放电，并可提供调节服务。'],
      sources: ['SRC-JP-17', 'SRC-JP-01'] },
    { id: 'share', asks: 'payer', view: 'mechanism', state: { time: 'dusk', solar: 'off', network: 'open', flow: 'discharge', soc: 0.5 },
      title: ['It keeps only a small share of that margin', '它只能留下其中很小的一份'],
      text: ['The award pays a fixed amount each year, and the holder hands back most of its profit from other markets. Better price capture moves the return only a little.',
             '中标合同每年支付固定金额，持有人须上缴在其他市场所获利润的大部分。更好的价格兑现对回报的影响很小。'],
      sources: ['SRC-JP-01'] },
    { id: 'edge', asks: 'limit', view: 'system', state: { time: 'dusk', solar: 'off', network: 'open', flow: 'discharge', soc: 0.5 },
      title: ['An operating battery holds what entrants queue for', '已投运的电池握有新进入者排队等待的并网条件'],
      text: ['An operating Tokyo battery already holds a connection that new entrants queue for. More converter and interconnector capacity would narrow Tokyo’s price premium.',
             '已投运的东京电池已经拥有新进入者仍在排队等待的并网条件。变频站与联络线容量增加，会收窄东京的价格溢价。'],
      sources: ['SRC-JP-13', 'SRC-JP-14'] },
  ],
};

const ltda = contracted({
  id: 'jp-ltda', home: ['mechanism'],
  title: ['The long-term auction: eligibility, award, obligation', '长期拍卖：资格、中标与义务'],
  gates: AWARD_GATES,
  base: { network: 'open' },
  stages: {
    availability: { name: ['Capacity that can discharge for the hours asked', '能按要求时长放电的容量'],
      title: ['The award asks for hours, every year', '中标合同每年都要求时长'],
      text: ['The award asks for continuous discharge for a set number of hours in every year of its term, and the declared capacity must already allow for fade.',
             '中标合同要求在合同期内每年都能按规定时长连续放电，且申报容量必须已考虑衰减。'],
      sources: ['SRC-JP-01'] },
    accreditation: { name: ['An eligible bid, under the area’s ceiling', '不超过区域上限的合资格投标'],
      title: ['Batteries compete for a limited pool', '电池争夺有限的名额'],
      text: ['Lithium-ion batteries compete for a limited pool, and no award is made beyond it. Projects on cells from makers certified under Japan’s economic-security law clear first, and a bid may not exceed its area’s ceiling.',
             '锂离子电池争夺有限的名额，超出部分一律不予中标。使用经日本经济安全保障法认定的厂商所产电芯的项目优先中标，报价也不得超过所在区域的上限。'],
      sources: ['SRC-JP-01', 'SRC-JP-04'] },
    award: { name: ['An award', '中标'],
      title: ['A winner is paid a fixed amount for the term', '中标者在合同期内获得固定付费'],
      text: ['A winning battery is paid a fixed amount per kW each year for the term of the award. Winning prices are not published one by one.',
             '中标电池在合同期内按每千瓦每年获得固定付费。各项目的中标价格不单独公布。'],
      sources: ['SRC-JP-01'] },
    obligation: { name: ['A promise to discharge without stopping', '不间断放电的承诺'],
      title: ['What the holder promises in return', '持有人作出的承诺'],
      text: ['In return it must be able to discharge for the required hours without stopping, and its declared capacity is deemed to allow for every operating risk, fade included.',
             '作为交换，它必须能够按要求时长连续放电，且其申报容量被视为已考虑全部运行风险，包括容量衰减。'],
      sources: ['SRC-JP-01'] },
    performance: { name: ['Performance, and the share handed back', '履约，以及上缴的份额'],
      title: ['Performance is checked, and other profit is handed back', '履约受到核查，其他利润须上缴'],
      text: ['The holder must meet its performance requirements, with penalties for shortfalls, and hands back most of its profit from other markets.',
             '持有人必须满足履约要求，未达标将被处罚，并须上缴在其他市场所获利润的大部分。'],
      sources: ['SRC-JP-01', 'SRC-JP-18'] },
    settlement: { name: ['A monthly payment from OCCTO', 'OCCTO按月付款'],
      title: ['OCCTO pays; electricity users fund it', 'OCCTO付款，电力用户承担成本'],
      text: ['OCCTO pays the award each month, and the cost reaches electricity users through the capacity market. The capacity award does not remove regional charging or connection constraints.',
             'OCCTO按月支付中标合同款项，这笔成本通过容量市场最终由电力用户承担。容量中标不能消除区域充电或并网约束。'],
      sources: ['SRC-JP-01', 'SRC-JP-18'] },
  },
});

const BY_AREA = { jp_tokyo: tokyo, jp_kyushu: kyushu, jp_hokkaido: hokkaido };
export const SEQUENCES = [tokyo, kyushu, hokkaido, ltda];
export default { sequences: SEQUENCES, for: (marketId) => [BY_AREA[marketId], ltda].filter(Boolean) };
