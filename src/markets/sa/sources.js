/* ---------------------------------------------------------------------------
   Saudi Arabia — source register.

   Read on 2026-10-29 for docs/saudi-registration-plan.md, which the analyst
   signed off the same day. SPPC's own site refused connections that day (gate
   SA-6), so its announcements are read as reported by the press and in the
   consortia's own disclosures. The one figure the case needs — the SSA price
   — is in no source, and the register says so.
   --------------------------------------------------------------------------- */
import { QUOTE_SOURCES } from '../../comparison/supplierQuote.js';

const OFFICIAL = { authority: 'official', publication: 'final', availability: 'public', verification: 'verified' };
const PRESS = { authority: 'third-party', publication: 'final', availability: 'public', verification: 'verified' };
const COUNTERPARTY = { authority: 'counterparty-reported', publication: 'final', availability: 'public', verification: 'verified' };
const GAP = { authority: 'internal', publication: 'draft', availability: 'restricted', verification: 'requires-reverification' };

export const SRC = {
  /* The supplier quotation: cited only to show why it is not the Saudi price. */
  ...QUOTE_SOURCES,

  // ---- the procurement --------------------------------------------------------
  group1Award: {
    file: 'pv magazine — Saudi Arabia awards $1.16 billion for 8 GWh of battery storage',
    status: ['Third-party — Press', '第三方 — 媒体'], provenance: PRESS,
    date: '25 Aug 2026',
    cy: 'SPPC, as Principal Buyer, signed four 15-year Storage Services Agreements for 2,000 MW / 8,000 MWh, four 500 MW / 2,000 MWh sites, total investment more than US$1.16bn. Build-own-operate; winners hold 100% of each SPV. Al Muwayh, Haden (Makkah), Al Kahfah (Hail): Saudi Energy, ACWA Power, Al Sharif; Al Khushaybi (Qassim): ENGIE, Haji Abdullah Alireza. No tariff is stated.',
    url: 'https://www.pv-magazine.com/2026/08/25/saudi-arabia-awards-1-16-billion-for-8-gwh-of-battery-storage/',
    authority: 'observed', historical: 'Group 1', forecast: 'Group 2 bids 12 Nov 2026',
    frequency: 'Per round', format: 'HTML', machineReadable: 'No',
    automation: 'D — read', lastChecked: '2026-10-29', freshness: 'Current',
  },
  group1Summary: {
    file: 'Zawya / TradeArabia — Saudi Energy, ACWA and ENGIE consortiums land $1.16bn BESS contracts',
    status: ['Third-party — Press', '第三方 — 媒体'], provenance: PRESS,
    date: 'Aug 2026',
    cy: 'Combined investment "over SAR4.35 billion ($1.16 billion)"; 2,000 MW for four hours; build-own-operate covering development, financing, construction, ownership, operation and maintenance; supervised by the Ministry of Energy.',
    url: 'https://www.zawya.com/en/business/saudi-energy-acwa-engie-consortiums-land-1.16bln-bess-projects-contract-464095',
  },
  acwaDisclosure: {
    file: 'Zawya — Saudi Energy, ACWA sign contracts for 3 BESS projects',
    status: ['Counterparty-reported', '交易对手方披露'], provenance: COUNTERPARTY,
    date: 'Aug 2026',
    cy: 'Al Kahfah, Haden and Al Muwayh, 500 MW / 2,000 MWh each, Independent Storage Provider model; ACWA Power 34.9% at financial close, Saudi Energy 35.1%, Al Sharif the rest; 15 years from each COD; combined value SAR 3.25bn; final values set at financial close. Payment basis and tariff not disclosed.',
    url: 'https://www.zawya.com/en/sponsored-content/saudi-energy-acwa-sign-contracts-for-3-bess-projects-in-saudi-arabia-465213',
  },
  engineKhushaybi: {
    file: 'Saudi Gulf Projects — ENGIE and Haji Abdullah Alireza sign for Al Khushaybi',
    status: ['Counterparty-reported', '交易对手方披露'], provenance: COUNTERPARTY,
    date: 'Aug 2026',
    cy: 'Al Khushaybi BESS, Qassim, 500 MW / 2,000 MWh, build-own-operate; ENGIE puts the investment at around US$220m and calls it the largest battery project in its portfolio.',
    url: 'https://www.saudigulfprojects.com/2026/08/engie-and-haji-abdullah-alireza-sign-agreement-for-500-mw-al-khushaybi-battery-storage-project-in-saudi-arabia/',
  },
  group2Prequal: {
    file: 'ESS News — Saudi Arabia qualifies 27 companies for second BESS tender',
    status: ['Third-party — Press', '第三方 — 媒体'], provenance: PRESS,
    date: '3 Jul 2026',
    cy: 'Group 2: 3 GW / 12 GWh at six 500 MW sites — Samha (Qassim), Al-Leeth (Makkah), Al-Henakiyah (Madinah), Khulais (Makkah), Sadawi (Eastern Province), Ashyrah (Makkah). 27 prequalified, including Masdar, ACWA Power, EDF, TotalEnergies, Marubeni, KEPCO, Sumitomo, SPIC, PowerChina and Tesla.',
    url: 'https://www.ess-news.com/2026/07/03/saudi-arabia-qualifies-27-companies-for-second-bess-tender/',
  },
  group2Deadline: {
    file: 'MEED — Saudi Arabia extends deadline for Group 2 BESS projects',
    status: ['Third-party — Press', '第三方 — 媒体'], provenance: PRESS,
    date: 'Oct 2026',
    cy: 'SPPC extended the Group 2 bid submission deadline to 12 November 2026.',
    url: 'https://guest.meed.com/?p=18212',
  },
  renewableVision: {
    file: 'Renewable Vision — Saudi battery storage, series 03',
    status: ['Third-party — Research', '第三方 — 研究'], provenance: PRESS,
    date: '12 Sep 2026',
    cy: 'SEC\'s own Tabuk and Hail systems at about US$120 and US$123/kWh; 18 GWh energized by end-June 2026; a 44.3 GWh ledger across delivery stages. No Saudi storage tariff is given.',
    url: 'https://renewablevision.com.sa/en/reports/RV-SAU-SERIES03-20260912',
  },

  // ---- money and tax -----------------------------------------------------------
  peg: {
    file: 'SAMA — commitment to the exchange-rate policy',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: 'Undated statement',
    cy: 'SAMA affirms its commitment to the riyal\'s peg of 3.75 to the US dollar, in place since 1986.',
    url: 'https://www.sama.gov.sa/en-US/MediaCenter/News/Pages/news-557.aspx',
  },
  incomeTax: {
    file: 'ZATCA — income tax rate',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '2026',
    cy: 'Income tax at 20% of the tax base for resident capital companies on the non-Saudi share, and for non-residents through a permanent establishment; the Saudi share pays zakat at 2.5%.',
    url: 'https://zatca.gov.sa/en/HelpCenter/FAQs/Pages/FAQ_148.aspx',
  },

  // ---- grid ----------------------------------------------------------------------
  transmission: {
    file: 'REGlobal — Transmission ties: Saudi Arabia\'s regional connections',
    status: ['Third-party — Press', '第三方 — 媒体'], provenance: PRESS,
    date: 'Aug 2023',
    cy: 'About 93,000 circuit-km from 132 kV to 380 kV in 2022, of which 49,649 at 230 and 380 kV.',
    url: 'https://reglobal.org/transmission-ties-saudi-arabias-regional-connections/',
  },

  // ---- gaps ------------------------------------------------------------------------
  priceGap: {
    file: 'SSA price — coverage gap',
    status: ['Not verified', '未核实'], provenance: GAP,
    date: 'Oct 2026',
    cy: 'The Storage Services Agreement fee per MW',
    url: 'https://www.zawya.com/en/sponsored-content/saudi-energy-acwa-sign-contracts-for-3-bess-projects-in-saudi-arabia-465213',
    authority: 'methodology', historical: 'No Group 1 price published by SPPC, the consortia or the press, in English or in Arabic', forecast: 'Group 2 award, H1 2027; a Tadawul filing at financial close',
    frequency: 'Per round', format: 'Coverage assessment', machineReadable: 'No', automation: 'D — analyst review (gate SA-1)',
    lastChecked: '2026-10-29', freshness: 'Assessment current at review date',
  },
};

export const sources = SRC;
export default SRC;
