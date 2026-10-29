/* Saudi Arabia — capital at risk before the investment decision.

   Looked at on 2026-10-29 and nothing sourced, which is different from not
   looked at (src/entry/ledgerRegistry.js). Entry is a bid in an SPPC round:
   prequalification, a bid bond and the bid's own costs. None of those amounts
   is in any public source read, and SPPC's site refused connections that day
   (gate SA-6). Great Britain's empty ledger is the precedent. */

export const ENTRY_LEDGER = {
  marketId: 'sa',
  basis: { powerMW: 50, durationHours: 4 },
  summary: [
    'Entry is a bid in an SPPC round, inside a consortium. No bid bond, fee or security amount was found in any public source read.',
    '进入方式为以联合体身份参与SPPC轮次投标。在已核阅的公开来源中未找到任何投标保函、费用或担保金额。'],
  limit: [
    'SPPC\'s request-for-proposal documents are issued to prequalified bidders and were not read; its site refused connections on 2026-10-29. The cost of preparing a bid for a 500 MW site, and any development security after award, are not sourced.',
    'SPPC的招标文件仅向通过资格预审的投标人发放，未予核阅；其官网于2026年10月29日无法连接。为500MW场址准备投标的成本及授标后的开发担保均无来源。'],
  items: [],
};
