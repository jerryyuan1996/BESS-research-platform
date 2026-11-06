/* Authoritative full research history. Extracted verbatim from src/markets/jp/sections.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  
  
  
  return {head: ['Japan Market Story — one national timeline, three regional divergences',
           '日本市场演进 — 一条全国时间轴，三种区域分化'],
cap: ['National mechanisms arrived in a sequence that applies everywhere. What differs is what each region needed storage FOR by the time they arrived.',
          '全国性机制按同一顺序落地、各地适用。差异在于机制落地时，各区域究竟需要储能来解决什么问题。'],
  cards:[
{ t: 'card', mt: false, title: ['National timeline', '全国时间轴'], badges: ['public'], live: false, blocks: [
        { t: 'timeline', items: [
          { y: '2005', t: ['JEPX opens', 'JEPX成立'], p: ['A wholesale exchange exists, but liquidity and price formation stay thin for years.', '批发交易所成立，但流动性与价格形成在此后多年仍较薄弱。'],
            i: ['No storage case yet — there is no spread to monetize.', '尚无储能投资逻辑 — 不存在可变现的价差。'] },
          { y: '2012', t: ['FIT drives the solar build', 'FIT推动光伏建设'], p: ['Feed-in tariffs produce a large, concentrated solar fleet, heaviest in Kyushu.', '固定电价制度催生大规模、集中的光伏装机，以九州最为集中。'],
            i: ['The surplus that later creates charging value starts here.', '日后形成充电价值的电力过剩自此开始。'] },
          { y: '2018', t: ['Kyushu output control begins', '九州开始出力抑制'], p: ['The first sustained renewable curtailment in mainland Japan.', '日本本土首次持续性新能源弃电。'],
            i: ['System need is proven. Project revenue is not.', '系统需求得到证明，但项目收入并未证明。'] },
          { y: '2020', t: ['Capacity Market first auction', '容量市场首次拍卖'], p: ['OCCTO runs the first main auction; area prices become a distinct revenue line.', 'OCCTO举行首次主拍卖；区域价格成为独立收入项。'],
            i: ['A capacity line appears — but it is won one delivery year at a time.', '容量收入线出现 — 但每次仅锁定一个实需年度。'] },
          { y: '2021', t: ['Balancing Market launches', '需给调整市场启动'], p: ['Products phase in; the full product set follows over the following years.', '各品种分阶段引入，完整品种体系于其后数年建立。'],
            i: ['A second merchant channel, and the first saturation risk.', '第二条市场化渠道出现，同时带来首个饱和风险。'] },
          { y: '2023', t: ['LTDA introduced', '长期脱碳电源拍卖引入'], p: ['A long-term fixed capacity payment becomes available, with other-market revenue sharing.', '长期固定容量付费成为可能，同时附带其他市场收入分享机制。'],
            i: ['The first genuinely long contract — but project-specific, not a market benchmark.', '首个真正意义上的长期合同 — 但属项目层面，而非市场基准。'] },
          { y: '2026', t: ['Connection discipline tightens', '并网管理收紧'], p: ['All three TSOs cap concurrent studies from 1 August; Tokyo records verified curtailment for the first time at scale.', '三家电网运营商自8月1日起设定并发检讨上限；东京首次出现规模化的已核验弃电。'],
            i: ['Grid access, not market access, becomes the binding constraint.', '约束条件从市场准入转为电网接入。'] },
        ] },
        { t: 'why', text: ['Japan added revenue channels faster than it added grid capacity. Every mechanism on this timeline is national and available to every project; the 2026 entries are the first that ration by region. That inversion — from "can I earn?" to "can I connect?" — is the transition this platform is built to price.',
                           '日本增加收入渠道的速度快于增加电网容量。时间轴上每项机制都是全国性、对所有项目开放的；唯有2026年的条目开始按区域配给。这一转折 — 从“能否赚钱”转为“能否并网” — 正是本平台旨在定价的过渡。'],
          sig: ['Grid access is now the binding constraint', '电网接入已成约束条件'] } ] },
{ t: 'card', title: ['Regional divergence — three lanes', '区域分化 — 三条路径'], badges: ['calc'], live: false, blocks: [
        { t: 'flow', items: [['Load depth', '负荷深度'], ['Scarcity / basis', '稀缺性/价差'], ['Growing output control', '出力抑制上升'], ['Tighter connection discipline', '并网管理收紧']], sep: '→' },
        { t: 'sub', text: ['Tokyo', '东京'] },
        { t: 'flow', items: [['Solar buildout', '光伏建设'], ['Chronic surplus', '长期过剩'], ['Transfer solutions', '外送方案'], ['Charging value + cannibalisation risk', '充电价值与收益蚕食风险']], sep: '→' },
        { t: 'sub', text: ['Kyushu', '九州'] },
        { t: 'flow', items: [['Wind / solar resource', '风光资源'], ['Output control + export bottleneck', '出力抑制与外送瓶颈'], ['Charging-side congestion', '充电侧拥塞'], ['Interconnector + balancing saturation', '联络线与调整力饱和']], sep: '→' },
        { t: 'sub', text: ['Hokkaido', '北海道'] },
        { t: 'why', text: ['The three lanes converge on the same word — saturation — by different routes. Tokyo saturates on connection slots, Kyushu on batteries chasing the same curtailment windows, Hokkaido on both at once plus an export limit. An allocator holding all three is not diversified against that; they are diversified against the timing of it.',
                           '三条路径经由不同途径汇向同一个词 — 饱和。东京在并网名额上饱和，九州在争夺同一弃电窗口的储能上饱和，北海道则两者兼有并叠加外送限制。同时持有三者的配置者并未分散该风险，而是分散了其发生时点。'],
          sig: ['Diversified on timing, not on risk', '分散的是时点而非风险'] } ] }
  ]};
}
