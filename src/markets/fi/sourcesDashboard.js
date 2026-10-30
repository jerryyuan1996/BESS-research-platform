/* ---------------------------------------------------------------------------
   Finland — sources the dashboard cites, added 2026-10-30.

   Kept out of sources.js on purpose. Every market's source register ships in
   the entry chunk the home page loads, and that chunk sits at its 170 kB
   budget. These entries are cited only inside Finland's own tabs, so
   dashboard.js merges them into the register it hands the engine, and they
   travel in this market's lazy chunk. Claims use the same route
   (registerClaims in dashboard.js).
   --------------------------------------------------------------------------- */

const READ = { authority: 'observed', historical: 'n/a', forecast: 'None', frequency: 'As published',
  machineReadable: 'No', automation: 'C — read, not ingested', lastChecked: '2026-10-30', freshness: 'Current' };
const VERIFIED = { publication: 'final', availability: 'public', verification: 'verified' };
const OFFICIAL = { status: ['Official — Final', '官方 — 最终'], provenance: { authority: 'official', ...VERIFIED } };
const DEVELOPER = { status: ['Developer-reported', '开发商披露'], provenance: { authority: 'developer-reported', ...VERIFIED } };
const THIRD_PARTY = { status: ['Third party', '第三方'], provenance: { authority: 'third-party', ...VERIFIED } };

export const DASHBOARD_SRC = {
  // ---- pipeline rows, each from its own announcement -------------------------
  dealTeuva: { ...THIRD_PARTY, ...READ, format: 'HTML',
    file: 'EY-Parthenon — advised Usva Energia on the sale of a 100 MW BESS project (Teuva) to Prime Capital',
    date: '2026',
    cy: 'Teuva, South Ostrobothnia: 100 MW / 400 MWh, four hours, ready-to-build, sold by Usva Energia to Prime Capital.',
    url: 'https://www.ey.com/en_fi/insights/strategy-transactions/deals/ey-parthenon-advises-usva-energia-on-sale-of-a-100-mw-bess-project' },
  akkulaNeoen: { ...DEVELOPER, ...READ, format: 'PDF release',
    file: 'Neoen — Akkula Big Battery, Rauma: notice to proceed',
    date: '30 Dec 2025',
    cy: 'Akkula Big Battery, Rauma: 62.5 MW / 231 MWh, about four hours, on Fingrid’s 110 kV line; notice to proceed to Nidec in December 2025; fully operational in 2027; for the reserve and wholesale markets.',
    url: 'https://neoen.com/app/uploads/2026/01/251230-Neoen-Akkula-Big-Battery-EN.pdf' },
  tuiskuLuxcara: { ...DEVELOPER, ...READ, format: 'HTML release',
    file: 'Luxcara — acquires construction-ready battery storage project in Finland (Tuisku)',
    date: '26 Feb 2026',
    cy: 'Tuisku, Keminmaa (southern Lapland): up to 125 MW, fully permitted, bought from Pohjan Voima, with a fast-track connection to an adjacent Fingrid substation; commercial operation targeted for summer 2027.',
    url: 'https://luxcara.com/press-releases/luxcara-acquires-construction-ready-battery-storage-project-in-finland' },

  // ---- market design, dated --------------------------------------------------
  reserveRoadmap: { ...OFFICIAL, ...READ, format: 'HTML', historical: 'Dated milestones from 2024',
    file: 'Fingrid — reserve market development',
    date: '2025',
    cy: 'aFRR energy market 12 Jun 2024 · Nordic flow-based capacity calculation 29 Oct 2024 · mFRR capacity market FI+SE+DK 19 Nov 2024 · FCR-N activated energy paid to the BSP 10 Feb 2025 · 15-minute mFRR energy market 4 Mar 2025 · 15-minute cross-border intraday 18 Mar 2025 · 15-minute imbalance price 19 Mar 2025 · Finland joins PICASSO 26 Mar 2025 · independent aggregation in aFRR 5 Jun 2025.',
    url: 'https://www.fingrid.fi/en/electricity-market/reserves/reserve-market-development/' },
  fcrHourly2027: { ...OFFICIAL, ...READ, format: 'HTML release (Finnish)', forecast: 'Applies to delivery year 2027',
    file: 'Fingrid — frequency containment reserve procurement moves to the hourly market in 2027',
    date: '8 Sep 2026',
    cy: 'Fingrid will not procure FCR (normal operation or disturbance) from yearly markets for 2027; the yearly-market annexes expire on 31 December 2026 and domestic FCR is procured on the hourly market only. Fingrid expects hourly volumes to rise significantly and will decide on the yearly model after reviewing 2027.',
    url: 'https://www.sttinfo.fi/tiedote/72301852/taajuusohjatun-kaytto-ja-hairioreservin-hankinta-keskitetaan-tuntimarkkinoille-2027?lang=fi' },
  mariTimeline: { ...OFFICIAL, ...READ, format: 'HTML release (Finnish)', forecast: 'Accession timing',
    file: 'Fingrid — the timetable for joining the MARI platform moves',
    date: '2 Sep 2026',
    cy: 'The Nordic TSOs now expect to join MARI, the European mFRR energy platform, after summer 2027, most likely in September–October 2027 (previously Q1 2027), because a required change request will not be delivered in time.',
    url: 'https://www.sttinfo.fi/tiedote/72285747/mari-kauppapaikan-kayttoonottoaikataulu-siirtyy?lang=fi' },

  // ---- what the main grid charges a battery ------------------------------------
  gridFees2026: { ...OFFICIAL, ...READ, format: 'PDF', historical: 'Annual fee sheets', frequency: 'Annual',
    forecast: 'A tariff-structure reform, with decisions due by the end of 2026, raises the burden on production and storage',
    file: 'Fingrid — main grid service fees 2026',
    date: '2026',
    cy: 'Energy storages: capacity fee for grid output €94.75/MW a month and for grid input €94.75/MW a month; main grid input fee €0.71/MWh; main grid output fee €1.07/MWh; excluding VAT. Energy taken to charge a storage pays no consumption fee (main grid service pricing 2026, appendix 2).',
    url: 'https://www.fingrid.fi/globalassets/dokumentit/fi/palvelut/kulutuksen-ja-tuotannon-liittaminen-kantaverkkoon/main-grid-service-fees-2026.pdf' },
  connectionFees2026: { ...OFFICIAL, ...READ, format: 'PDF', historical: 'Annual fee sheets', frequency: 'Annual',
    file: 'Fingrid — main grid connection fees 2026',
    date: '2026',
    cy: 'Connection to an existing 110 kV substation €1,000,000; to Fingrid’s 110 kV power line €1,000,000 for each started 25 MVA (ONAN) or 31.5 MVA (ONAF) of transformer rating, at most two fees per connection; 220 kV substation €1.6m; 400 kV substation €2.5m; VAT 0%.',
    url: 'https://www.fingrid.fi/globalassets/dokumentit/fi/palvelut/kulutuksen-ja-tuotannon-liittaminen-kantaverkkoon/connection-fees-2026.pdf' },
};

export default DASHBOARD_SRC;
