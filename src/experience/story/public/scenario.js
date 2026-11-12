/* ---------------------------------------------------------------------------
   THE SCENARIO of an explanatory scene, and what it says in words.

   A scenario is a handful of declared facts: the time of day, whether solar is
   held back, whether the network has room, whether the battery charges, and
   whether it is qualified, awarded and delivers. A sequence step declares one
   (./sequences/<market>.js), the reader's switches change one, and the drawing
   (./scene.js) and the lines of text beneath it are both made from it, so they
   cannot disagree.

   Pure: no DOM, no drawing, no number from the investment case. It is a module
   of its own so the content rules can be tested without a browser
   (tests/public-sequences.test.js).
   --------------------------------------------------------------------------- */
/* Where a market's network runs out of room, by the theme its catalogue entry
   carries: a link to a neighbouring system, a boundary with no link at all, or
   a line inside the area. */
const LIMIT={regional:'link',kyushu:'link',hokkaido:'link',tokyo:'link',island:'boundary',frequency:'boundary'};
/* A visual theme is not a topology. Britain trades over DC links, Ireland
   has interconnectors, and Finland belongs to the Nordic synchronous system.
   Only the Western Australian system has no neighbouring connection. These
   distinctions restate the existing public system chapters. */
const MARKET_LIMIT={wa:'boundary',gb:'link',ie:'link',fi:'link'};
export const limitOf=(theme,marketId)=>MARKET_LIMIT[marketId]||LIMIT[theme]||'line';
/** The scenario a market opens on when no step declares one. */
export function baseScenario(theme,marketId){
  return {time:'day',solar:'on',network:['regional','congestion','kyushu','hokkaido','tokyo'].includes(theme)&&limitOf(theme,marketId)!=='boundary'?'constrained':'open',
    flow:'discharge',soc:.6,breaker:'closed',signal:null,qualified:true,awarded:true,delivers:true,fleet:'today',headroom:false};
}
/** What a scenario may hold. A step that declares anything else is a content error (tests/public-sequences.test.js). */
export const SCENARIO={time:['day','dusk','night'],solar:['on','curtailed','off'],network:['open','constrained'],
  flow:['charge','discharge','idle'],breaker:['closed','open'],signal:[null,'dispatch','frequency','limit'],
  fleet:['today','crowded'],qualified:[true,false],awarded:[true,false],delivers:[true,false],headroom:[true,false]};

/**
 * What the drawing shows now, in words: one line per fact, in reading order.
 * Drawn from the scenario alone, so it is true of the picture whatever step
 * or switch produced it. The payment line is read in the payment chain, the
 * one view that draws the settlement rail it describes.
 */
export function readScenario(state,theme,view='mechanism',marketId){
  const out=[];
  const dark=state.time==='night';
  const daylight=state.solar==='off'
    ?['Daytime: solar is not contributing in this scenario.','白天：本情景中光伏未出力。']
    :['Midday: solar output is high.','正午：光伏出力高。'];
  out.push(['time',{day:daylight,dusk:['Evening: demand peaks as solar fades.','傍晚：光伏回落，负荷达到高峰。'],night:['Night: there is no solar output.','夜间：没有光伏出力。']}[state.time]]);
  if(state.solar==='curtailed'&&!dark)out.push(['solar',['Solar output is being held back: the network cannot take all of it.','光伏出力被限制：电网无法全部接纳。']]);
  const where=limitOf(theme,marketId);
  if(where==='boundary')out.push(['network',['This system has no link to a neighbour: it balances on its own resources.','本系统没有通往相邻系统的联络线：只能依靠自身资源平衡。']]);
  else if(state.network==='constrained')out.push(['network',where==='link'
    ?['The link to the neighbouring area is at its limit: power on one side cannot reach the other.','通往相邻区域的联络线已达上限：一侧的电力无法送到另一侧。']
    :['A line inside the area is at its limit: some power cannot reach where it is wanted.','区域内的一条线路已达上限：部分电力无法送到需要的地方。']]);
  else out.push(['network',['The network has room: power moves where it is wanted.','电网有裕度：电力可以送到需要的地方。']]);
  if(state.breaker==='open')out.push(['flow',['The connection is open: the plant can neither charge nor discharge.','并网开关断开：电站既不能充电，也不能放电。']]);
  else out.push(['flow',{charge:['The battery is charging: energy enters storage through its one connection.','电池正在充电：电量经唯一的并网连接进入储能。'],
    discharge:['The battery is discharging: stored energy leaves through the same connection.','电池正在放电：储存的电量经同一并网连接送出。'],
    idle:['The battery is holding its charge.','电池保持荷电，未充未放。']}[state.flow]]);
  if(state.headroom)out.push(['headroom',['Part of its power is held in reserve, and cannot be sold as energy at the same time.','部分功率被预留，不能同时作为电能量出售。']]);
  if(state.signal)out.push(['signal',{dispatch:['The operator has sent a dispatch instruction.','运营方已下达调度指令。'],
    frequency:['A frequency signal calls for fast response.','频率信号要求快速响应。'],
    limit:['The network operator is limiting what the plant may draw.','电网运营方正在限制电站可取用的功率。']}[state.signal]]);
  if(state.fleet==='crowded')out.push(['fleet',['More batteries are doing the same thing at the same hours.','更多电池在相同时段做着同样的事。']]);
  if(view==='mechanism')out.push(['payment',paymentOutcome(state)]);
  return out;
}
/** The one line a reader must not get wrong: whether the service delivered is paid. */
export function paymentOutcome(state){
  if(!state.qualified)return ['The first condition is not met: the service may be delivered, and no payment route accepts it.','第一项条件未满足：即使服务已交付，也没有付款渠道接受。'];
  if(!state.awarded)return ['The second condition is not met: with no cleared offer or signed award there is nothing to settle against.','第二项条件未满足：没有出清的报价或已签的合同，就没有结算依据。'];
  if(!state.delivers)return ['Awarded, but the third condition is not met: settlement must account for the market or contract’s deductions and penalties.','已中标，但第三项条件未满足：结算须按市场或合同规则核算扣款与罚则。'];
  return ['All three conditions are met: the payment settles.','三项条件均已满足：付款结算。'];
}
