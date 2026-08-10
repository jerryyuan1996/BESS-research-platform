/* ---------------------------------------------------------------------------
   THE DATASET CATALOGUE — what is fetched, from where, how often, and what
   approved assumption it bears on.

   This is the registry's counterpart for live data: the only place the platform
   learns that a dataset exists. The ETL iterates it, the runtime loads from it,
   the drift detector reads `bearsOn` to know which assumption an observation
   speaks to, and the freshness badge reads `staleAfterHours`.

   `bearsOn` is the load-bearing field and deserves its scepticism. It asserts
   that an observation is *evidence about* an assumption — not that it replaces
   it. GB day-ahead prices bear on `economics.merchGross`, but they are not
   merchant revenue: turning a price series into an achieved annual figure needs
   a dispatch assumption, a cycling assumption and a fee. The pipeline therefore
   computes a comparable estimate, shows its working, and asks a human. It never
   assigns.

   `republishable` reflects licence, not preference. Where it is false the raw
   series must not be written into public/data/ — only whatever derived statistic
   the licence permits, or nothing. See docs/data-policy.md.
   --------------------------------------------------------------------------- */

/** How stale a snapshot may be before the UI stops presenting it as current. */
const HOURS = 1;
const DAYS = 24 * HOURS;

/**
 * What shape a dataset's `series` carries, and therefore which validation runs
 * against it.
 *
 * This is declared per dataset rather than inferred, because inferring it is how
 * `industry-news` came to be published for weeks as an orphan: it sat in
 * public/data/public/ in a shape nothing in the catalogue described, and
 * `npm run etl:verify` reported it as an unexplained file on every run. A
 * dataset whose kind is not stated is a dataset nothing can check.
 *
 *   timeseries  observations of a number through time. `series` is
 *               `{ t: ISO instant, v: finite number }`, chronologically
 *               ascending. Gets the price bounds, the ordering check and the
 *               unit-shift guard.
 *
 *   feed        dated records with no measured quantity — today, published
 *               article metadata. `series` is `{ t, id, source, title, url, … }`,
 *               chronologically ascending. Gets identity, link and ordering
 *               checks instead. Carries no `bearsOn`: a headline is context for
 *               a reader, never evidence about an approved assumption, and the
 *               empty array is what stops the drift detector treating it as one.
 *
 * @typedef {'timeseries'|'feed'} DatasetKind
 */

/**
 * @typedef {object} Dataset
 * @property {string}   id             stable key; also the snapshot filename
 * @property {DatasetKind} kind        payload shape; selects the validator
 * @property {string?}  marketId       registry market id, or null for global
 * @property {string?}  sourceId       governed source-registry id when registered
 * @property {string[]} title          [en, zh]
 * @property {string}   connector      etl/sources/<connector>.mjs
 * @property {object}   source         provenance shown to the reader
 * @property {number}   refreshHours   intended cadence
 * @property {number}   staleAfterHours  past this, the UI marks it stale
 * @property {string[]} bearsOn        approved assumption paths this informs
 * @property {boolean}  republishable  may the raw series be published?
 * @property {boolean}  requiresKey    needs a CI secret to fetch
 */

/** Every value `Dataset.kind` may take. */
export const DATASET_KINDS = ['timeseries', 'feed'];

/** @type {Dataset[]} */
export const DATASETS = [
  // ---- global --------------------------------------------------------------
  {
    id: 'fx-ecb',
    kind: 'timeseries',
    marketId: null,
    title: ['ECB euro foreign-exchange reference rates', '欧洲央行欧元外汇参考汇率'],
    connector: 'ecb',
    source: {
      name: 'European Central Bank',
      url: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
      licence: 'ECB — free reuse with attribution',
      attribution: 'Source: European Central Bank',
    },
    refreshHours: 24 * HOURS,
    staleAfterHours: 4 * DAYS,        // published on TARGET business days only
    bearsOn: ['FX.AUD', 'FX.GBP', 'FX.EUR', 'FX.JPY'],
    republishable: true,
    requiresKey: false,
  },

  // ---- Great Britain -------------------------------------------------------
  /* Served by ENTSO-E rather than Elexon. Elexon BMRS is the richer GB source —
     it carries imbalance and Balancing Mechanism data that ENTSO-E does not, and
     those are a large part of a GB battery's revenue. It is not used here
     because its gateway returned 403 to every request from the development
     environment, and a connector that cannot be verified against the live
     service is a connector that will fail its first cron run unattended.

     ENTSO-E carries GB day-ahead, is already wired for three other markets, and
     is proven to respond. Adding Elexon later is additive: a second dataset for
     the same market, not a replacement. See docs/live-data.md. */
  {
    id: 'gb-day-ahead',
    kind: 'timeseries',
    marketId: 'gb',
    sourceId: 'gb-entsoe-transparency',
    title: ['GB day-ahead wholesale prices', '英国日前批发电价'],
    connector: 'entsoe',
    source: {
      name: 'ENTSO-E Transparency Platform',
      url: 'https://transparency.entsoe.eu/',
      licence: 'ENTSO-E — reuse permitted with attribution',
      attribution: 'Source: ENTSO-E Transparency Platform',
    },
    refreshHours: 12 * HOURS,
    staleAfterHours: 3 * DAYS,
    bearsOn: ['economics.merchGross'],
    republishable: true,
    requiresKey: true,
  },

  // ---- Ireland · Romania · Poland — one connector, one token ---------------
  {
    id: 'ie-day-ahead',
    kind: 'timeseries',
    marketId: 'ie',
    title: ['SEM day-ahead prices', '爱尔兰单一电力市场日前电价'],
    connector: 'entsoe',
    source: {
      name: 'ENTSO-E Transparency Platform',
      url: 'https://transparency.entsoe.eu/',
      licence: 'ENTSO-E — reuse permitted with attribution',
      attribution: 'Source: ENTSO-E Transparency Platform',
    },
    refreshHours: 12 * HOURS,
    staleAfterHours: 3 * DAYS,
    bearsOn: ['economics.merchGross'],
    republishable: true,
    requiresKey: true,
  },
  {
    id: 'ro-day-ahead',
    kind: 'timeseries',
    marketId: 'ro',
    title: ['Romania day-ahead prices', '罗马尼亚日前电价'],
    connector: 'entsoe',
    source: {
      name: 'ENTSO-E Transparency Platform',
      url: 'https://transparency.entsoe.eu/',
      licence: 'ENTSO-E — reuse permitted with attribution',
      attribution: 'Source: ENTSO-E Transparency Platform',
    },
    refreshHours: 12 * HOURS,
    staleAfterHours: 3 * DAYS,
    bearsOn: ['economics.merchGross'],
    republishable: true,
    requiresKey: true,
  },
  {
    id: 'pl-day-ahead',
    kind: 'timeseries',
    marketId: 'pl',
    title: ['Poland day-ahead prices', '波兰日前电价'],
    connector: 'entsoe',
    source: {
      name: 'ENTSO-E Transparency Platform',
      url: 'https://transparency.entsoe.eu/',
      licence: 'ENTSO-E — reuse permitted with attribution',
      attribution: 'Source: ENTSO-E Transparency Platform',
    },
    refreshHours: 12 * HOURS,
    staleAfterHours: 3 * DAYS,
    bearsOn: ['economics.merchGross'],
    republishable: true,
    requiresKey: true,
  },

  // ---- Western Australia ---------------------------------------------------
  {
    id: 'wa-wem-prices',
    kind: 'timeseries',
    marketId: 'wa',
    title: ['WEM energy reference prices', '西澳电力市场能量参考价格'],
    connector: 'aemo-wem',
    source: {
      name: 'AEMO WEM Data',
      url: 'https://data.wa.aemo.com.au/',
      licence: 'AEMO — free reuse with attribution',
      attribution: 'Source: AEMO WEM data',
    },
    refreshHours: 24 * HOURS,
    staleAfterHours: 4 * DAYS,
    bearsOn: ['economics.merchGross'],
    republishable: true,
    requiresKey: false,
  },

  // ---- Japan — three areas, one connector ---------------------------------
  {
    id: 'jp-tokyo-jepx',
    kind: 'timeseries',
    marketId: 'jp_tokyo',
    title: ['JEPX day-ahead — Tokyo area', 'JEPX日前 — 东京地区'],
    connector: 'jepx',
    source: {
      name: 'Japan Electric Power Exchange (JEPX)',
      url: 'https://www.jepx.jp/en/electricpower/market-data/spot/',
      licence: 'JEPX published market data — attribution required',
      attribution: 'Source: JEPX spot market data',
    },
    refreshHours: 24 * HOURS,
    staleAfterHours: 4 * DAYS,
    bearsOn: ['economics.merchGross'],
    republishable: true,
    requiresKey: false,
  },
  {
    id: 'jp-kyushu-jepx',
    kind: 'timeseries',
    marketId: 'jp_kyushu',
    title: ['JEPX day-ahead — Kyushu area', 'JEPX日前 — 九州地区'],
    connector: 'jepx',
    source: {
      name: 'Japan Electric Power Exchange (JEPX)',
      url: 'https://www.jepx.jp/en/electricpower/market-data/spot/',
      licence: 'JEPX published market data — attribution required',
      attribution: 'Source: JEPX spot market data',
    },
    refreshHours: 24 * HOURS,
    staleAfterHours: 4 * DAYS,
    bearsOn: ['economics.merchGross'],
    republishable: true,
    requiresKey: false,
  },
  {
    id: 'jp-hokkaido-jepx',
    kind: 'timeseries',
    marketId: 'jp_hokkaido',
    title: ['JEPX day-ahead — Hokkaido area', 'JEPX日前 — 北海道地区'],
    connector: 'jepx',
    source: {
      name: 'Japan Electric Power Exchange (JEPX)',
      url: 'https://www.jepx.jp/en/electricpower/market-data/spot/',
      licence: 'JEPX published market data — attribution required',
      attribution: 'Source: JEPX spot market data',
    },
    refreshHours: 24 * HOURS,
    staleAfterHours: 4 * DAYS,
    bearsOn: ['economics.merchGross'],
    republishable: true,
    requiresKey: false,
  },

  // ---- global, non-numeric -------------------------------------------------
  /* The only `feed` dataset. It is in this catalogue rather than beside it
     because being outside the catalogue is precisely what went wrong: the news
     connector wrote a bespoke shape into the governed directory, no entry
     described it, and etl:verify called it an orphaned snapshot on every run.
     A file nothing can explain is the thing the verifier exists to surface, so
     the fix is to explain it, not to exempt it.

     `bearsOn: []` is load-bearing and not an oversight. Headlines are reader
     context. They are not evidence about an approved assumption, they must
     never open a drift proposal, and the governance test that walks every
     bearsOn path would have to classify a headline as proposable for them to
     try. Empty is the assertion that this dataset informs no model input.

     What is republished is metadata only — headline, publisher, timestamp,
     link, and a short excerpt the publisher already syndicates in the feed. No
     article body. That is the licence position recorded in `source.licence`,
     and it is why `republishable` can be true for content this platform does
     not own. */
  {
    id: 'industry-news',
    kind: 'feed',
    marketId: null,
    title: ['Industry news', '行业新闻'],
    connector: 'news',
    source: {
      name: 'Publisher RSS feeds — Modo Energy, Energy-Storage.news, Utility Dive, pv magazine',
      url: 'https://www.energy-storage.news/feed/',
      licence: 'Publisher RSS — headline metadata and syndicated excerpt only, linked to the source',
      attribution: 'Headlines and excerpts remain the property of their publishers',
    },
    refreshHours: 24 * HOURS,
    /* Wider than the price feeds. A quiet week in trade press is normal and is
       not a pipeline fault; flagging it stale after four days would train an
       operator to ignore the badge that matters on the price datasets. */
    staleAfterHours: 7 * DAYS,
    bearsOn: [],
    republishable: true,
    requiresKey: false,
  },
];

/* ---------------------------------------------------------------------------
   Deliberately NOT in this catalogue, and why.

   Capacity-market results (NESO CM Register, OCCTO, SEMO, PSE, Transelectrica)
     Published as periodic auction outcomes rather than a feed, and each needs a
     de-rating factor applied before it becomes `contracted`. Adding them is
     worthwhile; doing it as an unattended parse of a results PDF is how a wrong
     clearing price reaches a published IRR. They stay analyst-entered until a
     connector exists that can assert the vintage it read.

   Japan EPRX balancing products
     No open programmatic endpoint. See docs/japan-etl-gates.md.

   Licensed third-party BESS revenue indices
     Present in several source registers and NOT republishable. A connector may
     read one to compute drift privately, but its values must never be written
     into public/data/. That is a licence constraint, not a preference.
   --------------------------------------------------------------------------- */

const byIdMap = new Map(DATASETS.map(d => [d.id, d]));

export const datasetById = (id) => byIdMap.get(id) || null;

/** Datasets belonging to one market. */
export const datasetsForMarket = (marketId) => DATASETS.filter(d => d.marketId === marketId);

/** Datasets bearing on a given approved-assumption path. */
export const datasetsBearingOn = (path) => DATASETS.filter(d => d.bearsOn.includes(path));

/** Global (non-market) datasets. */
export const globalDatasets = () => DATASETS.filter(d => d.marketId === null);

/* Each dataset is published as two files. The site loads only the summary; the
   full series is the audit artefact. See etl/lib/summarize.mjs for why. */

/** Public URL of the full observed series. Audit and download. */
export const snapshotPath = (id) => `/data/public/${id}.json`;

/** Public URL of the summary — metrics plus daily rollup. What the app fetches. */
export const summaryPath = (id) => `/data/public/${id}.summary.json`;

/** Paths on disk, relative to the repository root. */
export const snapshotFile = (id) => `public/data/public/${id}.json`;
export const summaryFile = (id) => `public/data/public/${id}.summary.json`;
