/* Romania — the `grid` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { buildROGridSection } from '../gridSection.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.grid = function (){
  return {
  head: ['Grid & Permitting — a chain of approvals, not a binary status','并网与许可 — 一连串审批与合同，而非二元状态'],
  cap: ['Connection and permitting are where Romanian development capital is lost, and the failure mode is a category error rather than a technical one — treating a capacity map, an authorisation or a scheme budget as evidence of a project.',
        '并网与许可是罗马尼亚开发资本损失之处，且其失效模式是类别错误而非技术错误 — 将容量地图、许可或计划预算视为项目的证据。'],
  blocks: [
    { t:'card', mt:false, title:['Nameplate → revenue bridge','铭牌容量至收入桥'], badges:['calc','illus'], live:true, blocks:[
      { t:'flow', items:[
        ['Indicative capacity map','示意性容量地图'], ['Establishment authorisation','设立许可'],
        ['ATR — technical connection permit','ATR — 技术并网许可'], ['Executed connection agreement','已签并网合同'],
        ['Energisation & unrestricted operation','送电与无限制运行'], ['Market & balancing registration','市场与平衡市场注册'],
      ] },
      { t:'ladder', items:[
        { n:['Indicative capacity map','示意性容量地图'], d:['A screening tool published by the system operator. It is never a financeable right and it changes without notice.','系统运营方公布的筛选工具。它绝非可融资权利，且会在无预告的情况下变更。'] },
        { n:['Establishment authorisation','设立许可'], d:['A permit to develop, not capacity to connect. Approved in volume; converts at roughly a quarter.','这是开发许可，而非并网容量。批量核准，转化率约四分之一。'] },
        { n:['ATR','ATR'], d:['The technical connection permit with a defined capacity and validity period. This is the first tier that is evidence.','载明容量与有效期的技术并网许可。这是第一个构成证据的层级。'] },
        { n:['Executed connection agreement','已签并网合同'], d:['Works scope, cost allocation and delivery responsibility become binding. Model against this, not the ATR alone.','工程范围、费用分担与交付责任在此具备约束力。应据此建模，而非仅凭ATR。'] },
        { n:['Energisation & registration','送电与注册'], d:['Unrestricted operation plus market and balancing-responsible-party registration. Revenue starts here, not at mechanical completion.','无限制运行加市场及平衡责任方注册。收入自此开始，而非自机械完工开始。'] },
      ] },
      { t:'why', text:['Five tiers, and the first two are the ones most often presented as a project. ' + fmtN(O.authFeb2026MW) + ' MW of authorisations approved in a single meeting is the clearest illustration: that volume is genuine developer interest, and almost none of it holds an ATR with adequate capacity at a location with a real price spread. The diligence question is not "does the project have permits" but "which tier, and what is the document number".',
        '共五个层级，而最常被当作项目呈现的是前两个。单次会议核准' + fmtN(O.authFeb2026MW) + 'MW许可是最清晰的例证：该体量代表真实的开发商兴趣，但其中几乎没有项目在具备真实价差的位置持有容量充足的ATR。尽调问题不是“项目是否有许可”，而是“处于哪一层级？文件编号是什么”。'],
        sig:['Which tier, and what is the document number?','处于哪一层级？文件编号为何？'] },
    ] },

    { t:'card', title:['Guarantees — capital at risk before financial close','保函 — 融资交割前的风险资本'], badges:['verify'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Allocation-auction participation guarantee','容量分配拍卖参与保函'], v:fmtC(O.auctionGuarEurMW) + '<small>/MW</small>', d:['verify the current documentation and release path','须核验现行文件与释放路径'], b:['verify'] },
        { l:['Connection-tariff guarantee','并网费保函'], v:O.connTariffGuarPct + '<small>%</small>', d:['of the connection tariff — verify applicability','占并网费的比例 — 须核验适用性'], b:['verify'] },
        { l:['Establishment-authorisation guarantee','设立许可保函'], v:fmtC(O.estabGuarEurKW) + '<small>/kW</small>', d:['verify return and forfeiture conditions','须核验返还与没收条件'], b:['verify'] },
        { l:['Guarantee cost on a 50 MW / 2h project','50MW/2小时项目的保函成本'], v:fmtCM(50 * O.auctionGuarEurMW + 50 * 1000 * O.estabGuarEurKW), d:['illustrative combined exposure before financial close','示例：融资交割前的合计敞口'], b:['calc'] },
      ] },
      { t:'warn', text:['Guarantee mechanics are still evolving and must be verified per transaction against the order in force. Capital posted against auction, connection and authorisation guarantees is capital at risk until the release conditions are documented in the share purchase agreement — and forfeiture conditions are frequently drafted more broadly than sponsors assume.',
        '保函机制仍在演变，每笔交易均须对照现行法令核验。为拍卖、并网与设立许可保函缴付的资金，在释放条件于股权买卖协议中形成书面约定之前均属风险资本 — 且没收条件的拟定范围往往比发起人预期的更宽。'] },
      { t:'why', text:['On a 50 MW project the combined guarantee exposure is roughly ' + fmtCM(50 * O.auctionGuarEurMW + 50 * 1000 * O.estabGuarEurKW) + ' posted before financial close — meaningful development capital sitting against conditions the sponsor does not control. Negotiate the release mechanics in the SPA before posting, not after, and price the carrying cost of that capital into the development budget rather than treating it as a deposit.',
        '对50MW项目，融资交割前缴付的保函合计敞口约为' + fmtCM(50 * O.auctionGuarEurMW + 50 * 1000 * O.estabGuarEurKW) + ' — 这是一笔可观的开发资本，且其释放取决于发起人无法控制的条件。应在缴付之前而非之后于股权买卖协议中谈定释放机制，并将该资金的持有成本计入开发预算，而非视为押金。'],
        sig:['Negotiate release before posting','缴付前先谈定释放机制'] },
      { t:'src', src: SRC.anre, use:['Connection rules, guarantees and allocation auctions','并网规则、保函与分配拍卖'] },
    ] },

    { t:'card', title:['Connection risk → suggested commercial protections','并网风险 → 建议商业保护条款'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Risk','风险'],['Protection','保护条款'],['Trigger to invoke','触发条件']], rows:[
        [{b:['Indicative map capacity not available at ATR stage','示意性地图容量在ATR阶段不可得']},
         ['ATR with a specified capacity and validity period as a hard condition precedent','以载明容量与有效期的ATR为硬性先决条件'],
         ['Any reliance on the capacity map in the investment case','投资案例中对容量地图的任何依赖']],
        [{b:['ATR expires before financial close','ATR在融资交割前失效']},
         ['Validity-period covenant with an extension obligation and a price adjustment','有效期契约，附延期义务及价款调整'],
         ['Less than twelve months of ATR validity remaining','ATR剩余有效期不足十二个月']],
        [{b:['Network reinforcement scope or cost shifts','网络加强范围或费用变动']},
         ['Cost-sharing cap above an agreed threshold and clear delivery responsibility','超出约定阈值的成本分担上限及明确的交付责任划分'],
         ['Any revision to the works scope or estimate','工程范围或估算的任何修订']],
        [{b:['Grant not awarded or reduced','补贴未获授予或被削减']},
         ['Formal award letter as a condition precedent; equity bridge sized for the no-grant case','以正式授予函为先决条件；股权过桥资金按无补贴情景配置'],
         ['Grant assumed in the base case','基准情景假设取得补贴']],
        [{b:['Balancing revenue not realised','平衡收入未能实现']},
         ['Earn-out or deferred consideration linked to prequalification and a first activation record','与预认证及首次激活记录挂钩的对赌或递延对价'],
         ['Balancing revenue above evidence tier 2','平衡收入主张超出第2证据层级']],
      ] },
      { t:'why', text:['Every protection here converts an administrative risk into a priced or allocated one, which is the only thing that can be done with Romanian development exposure. The two that matter most are the ATR validity covenant and the grant award condition precedent — both are routinely omitted, and each on its own can turn a completed acquisition into a project that cannot reach financial close.',
        '此处每项保护都把行政风险转化为可定价或可分配的风险，而这也是应对罗马尼亚开发敞口的唯一手段。其中最关键的是ATR有效期契约与补贴授予先决条件 — 两者常被遗漏，且任一项缺失都可能使一笔已完成的收购变成无法走到融资交割的项目。'],
        sig:['ATR validity and award condition first','优先落实ATR有效期与授予条件'] },
      { t:'src', src: SRC.telmap, use:['Indicative available connection capacity — screening only, never a financeable right','示意性可用并网容量 — 仅供筛选，绝非可融资权利'] },
    ] },
  ] };
};

// ============================== ROMANIA vs POLAND (peer benchmark) ==============================
// Mirrors the WA dashboard's "WEM vs NEM" section: the only tab that uses peer-market
// data, held in a separate namespace and excluded from every Romania scoring input.
  SEC_B.grid = () => buildROGridSection({ SRC, M });

  /* ---- Investment Case and Entry — the investment-view revision ------------
     Both read the view store and the capital-at-risk ledger by market id; the
     section says which market and nothing else. */

  return SEC_B.grid;
}
