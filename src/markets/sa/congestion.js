/* ---------------------------------------------------------------------------
   Saudi Arabia — congestion register.

   There is no price for congestion to reach and no queue for it to sit in.
   SPPC chooses each storage site and the transmission company connects it,
   so where storage goes is decided in the procurement — the buyer places the
   asset where the system needs it and pays for its availability there. That
   is closest to Italy's zonal procurement, at site rather than zone grain.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  group2: 'https://www.ess-news.com/2026/07/03/saudi-arabia-qualifies-27-companies-for-second-bess-tender/',
};

export const SA_CONGESTION = {
  marketId: 'sa',
  summary: [
    'No wholesale price and no connection queue: SPPC names each site and the transmission company connects it. Location is decided by the buyer in the procurement, and paid for through the availability fee.',
    '无批发电价，亦无并网排队：SPPC指定每个场址，由输电公司负责并网。区位由买方在采购中决定，并通过可用性付费支付。',
  ],
  gateNote: [
    'How SPPC chose the ten sites, and what each connection costs, is not published. The register states the mechanism, not a constraint map.',
    'SPPC如何选定十个场址、各并网成本多少均未公布。本登记表说明机制，而非约束地图。',
  ],

  zones: [
    {
      id: 'sa-sppc-sites',
      name: ['SPPC-chosen sites', 'SPPC指定场址'],
      shape: 'zone',
      coord: [42.50, 24.50],
      direction: 'import',
      intensity: 0.4,
      metrics: [
        { label: ['Sites procured', '已采购场址'],
          value: ['Ten 500 MW sites: four in Group 1, six in Group 2', '十个500MW场址：第一组四个、第二组六个'],
          period: ['2026', '2026年'] },
        { label: ['Where', '分布'],
          value: ['Five in Makkah province; Qassim two; Hail, Madinah and the Eastern Province one each', '麦加省五个；卡西姆省两个；哈伊勒省、麦地那省与东部省各一个'],
          period: ['2026', '2026年'] },
      ],
      capture: {
        mechanism: CAPTURE.LOCATIONAL_PROCUREMENT,
        text: [
          'The buyer procures storage site by site and pays for its availability where it sits; a bidder does not choose a node and carries no locational price risk.',
          '买方逐场址采购储能并按其所在位置支付可用性费用；投标方不选择节点，亦不承担区位价格风险。',
        ],
      },
      relief: {
        project: ['No relief project: access is allocated by procurement', '无缓解工程：接入通过采购分配'],
        operator: 'SPPC / National Grid SA',
        scope: ['Not a wire. Each round names its own sites; the next round\'s sites are the relief.', '并非电网工程。每轮采购自行指定场址；下一轮的场址即为缓解途径。'],
        expected: null,
        status: RELIEF_STATUS.RULE_CHANGE,
      },
      investor: [
        'Location is not an investment decision here; the round is. A bidder diligences the site SPPC names — the connection, the land and the climate a battery must hold its rating in — rather than looking for one.',
        '在此区位不是投资决策，轮次才是。投标方对SPPC指定的场址开展尽调 — 并网、土地以及电池须在其中保持额定容量的气候条件 — 而无需自行寻找场址。',
      ],
      source: 'ESS News — Saudi Arabia qualifies 27 companies for second BESS tender',
      sourceUrl: URL.group2,
    },
  ],
};

export default SA_CONGESTION;
