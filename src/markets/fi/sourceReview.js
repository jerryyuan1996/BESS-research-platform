/* ---------------------------------------------------------------------------
   FINLAND SOURCE REVIEW — opened 2026-08-19.

   Finland is the pilot's deliberate hard case: economics withheld, engine not
   ready, and a thesis that depends on a revenue line nobody publishes. The
   question it was chosen to answer is whether the editorial system can publish
   what IS established without inventing what is not.

   Three of Fingrid's own pages opened and answered well. Three news-item URLs
   returned 404 — the same link rot found in WA and PJM, in a third register.
   --------------------------------------------------------------------------- */
import { ACCESS } from '../../governance/sourceReview.js';

export const REVIEW = {

  /* ---- opened ------------------------------------------------------------ */

  reserveObligations: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: 'Power system reserves',
    confirmedPublisher: 'Fingrid Oyj',
    confirmedDate: 'obligations stated for 2026',
    locator: 'Reserve product table (FFR, FCR-D, FCR-N, aFRR, mFRR) with purpose and procurement timeframe; national reserve obligations for 2026; participation paragraph',
    establishes: [
      'Fingrid procures five reserve products: FFR, FCR-D, FCR-N, aFRR and mFRR, each with a stated purpose.',
      'Procurement timeframe by product — FCR-D, FCR-N, aFRR and mFRR every hour of the year; FFR only in certain hours, based on inertia forecasts.',
      'National reserve obligations for 2026: FFR 0-60 MW, FCR-D up 309 MW, FCR-D down 298 MW, FCR-N 128 MW, aFRR about 50 MW, mFRR up 880-1,300 MW, mFRR down 575 MW.',
      'The fast-product obligations sum to about 795 MW, which is the figure the platform already cites — now confirmed against the source rather than carried.',
      'Eligibility — "Any electricity production unit, consumption site, energy storage system, or hybrid system that meets the technical and market requirements can participate in the reserve markets."',
    ],
    doesNotEstablish: [
      'Any clearing price, for any product, in any timeframe.',
      'Any awarded volume by technology, and specifically nothing about how much of any product a battery wins.',
      'Any revenue figure. The obligations are a REQUIREMENT in MW; they are not a market size, a price, or an earnings basis, and treating them as one is the substitution this record exists to prevent.',
      'The technical requirements a storage system must meet to prequalify — the page states eligibility in principle and refers the reader elsewhere for the requirements.',
      'That the obligation volumes and the connected fleet are comparable populations. They are not: the obligation sums separately procured products, and the fleet includes capacity not prequalified for all of them.',
    ],
    excerpt: 'Any electricity production unit, consumption site, energy storage system, or hybrid system that meets the technical and market requirements can participate in the reserve markets.',
  },

  connectionPhases: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: 'Grid connection agreement phases',
    confirmedPublisher: 'Fingrid Oyj',
    confirmedDate: 'current at review',
    locator: 'Phase sequence — planning, detailed planning, agreement, implementation; permit prerequisites listed under the agreement phase; contract term paragraph',
    establishes: [
      'Connection runs in four phases: planning, detailed planning, agreement, and implementation.',
      'Before the connection agreement is signed, "the land-use plan (or decision on the need for planning) and building permit required by the project are legally valid" — consent precedes the agreement rather than running beside it.',
      'Expropriation permits, where needed, must also be legally valid before signature.',
      'An Environmental Impact Assessment conclusion is required for large industrial projects at the detailed planning phase.',
      'The connection agreement carries a fifteen-year minimum term from signature and a three-year termination period.',
      'Connection need must be reported no later than 21 days before the proposed connection date.',
    ],
    doesNotEstablish: [
      'Any duration or lead time for the phases themselves. The page says planning should begin well in advance and gives no timeframe, so no queue length or delay may be inferred from it.',
      'Any restriction or moratorium on new storage connections. The page mentions none; the record that describes the southern restriction is separate and its URL is dead.',
      'Anything about available network capacity, or which areas can accept a connection.',
      'Whether the distribution-connected route differs. This page is about the main grid, and distribution-connected assets do not necessarily face the same sequence.',
    ],
    excerpt: 'the land-use plan (or decision on the need for planning) and building permit required by the project are legally valid',
  },

  peakLoadCapacity: {
    reviewedAt: '2026-08-19',
    access: ACCESS.LANDING_PAGE,
    confirmedTitle: 'Peak load capacity',
    confirmedPublisher: 'Fingrid Oyj',
    confirmedDate: 'links periods to 11/2026-10/2027',
    locator: 'Mechanism definition paragraph; statutory basis; composition sentence; period and fee navigation',
    establishes: [
      'The mechanism secures supply "in situations of the Finnish power system where the planned electricity procurement is not sufficient to cover the anticipated electricity consumption".',
      'Its statutory basis is Finnish act 117/2011.',
      'It "can include both power plants and facilities capable of demand response of electricity" — the composition named by Fingrid does NOT include energy storage.',
      'Periods run to 11/2026-10/2027, with annual fee schedules published per period.',
    ],
    doesNotEstablish: [
      'That storage is eligible. Storage is not mentioned at all, and absence of mention is not exclusion — but it is certainly not evidence of eligibility, and no adequacy revenue may be claimed for a battery on this page.',
      'The procured volume, the composition of the current period, or the fee level. All sit on linked subpages that were not opened.',
      'Whether the mechanism has ever been activated. Nothing on the page addresses use.',
      'That a dormant reserve is a revenue opportunity. It is a standby arrangement held outside the market, and the platform records it as dormant for that reason.',
    ],
  },

  /* ---- could not be opened ----------------------------------------------- */

  storageFleet: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The recorded Fingrid news URL returns HTTP 404. Fingrid news addresses appear to have been restructured; the item was not reached and no archive fallback is available from this environment.',
    establishes: [],
    doesNotEstablish: [
      'The 1,050 MW connected-storage figure, its date, and — most importantly — the population it counts. Whether it is transmission-only or includes distribution-connected, and whether it is battery-only, is exactly what a saturation argument turns on, and none of it is verified.',
    ],
  },

  fcrYearly2026: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The recorded Fingrid news URL returns HTTP 404.',
    establishes: [],
    doesNotEstablish: [
      'The yearly-market volumes and prices for delivery year 2026. This is the nearest thing Finland has to a published price, and it could not be read, so the reserve revenue line stays withheld on evidence as well as on policy.',
    ],
  },

  connectionRestriction: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The recorded Fingrid news URL returns HTTP 404. The connection-phases page, which was read, mentions no storage restriction at all.',
    establishes: [],
    doesNotEstablish: [
      'The southern connection restriction, its geography, its end date, or that it was extended — which together are the leading argument of the grid section.',
    ],
  },

  marketStructure: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'nordpoolgroup.com returns HTTP 403 to an automated fetch. Unlike a 404 this is very likely fine for a human, so the record must NOT be replaced — but it was not read here, and the wholesale section figures therefore remain unverified.',
    establishes: [],
    doesNotEstablish: [
      'The 15-minute market time unit, its 1 October 2025 go-live, the single Finnish bidding zone, and the -500 EUR/MWh observed floor — every displayed figure in the wholesale section.',
    ],
  },

  dayAhead: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The ENTSO-E Transparency Platform is a client-rendered application; the recorded URL returns an application error shell to a fetcher rather than data. Not a dead link and not a paywall — the address is a portal root, and the Finnish day-ahead series sits behind in-app query state the register does not record.',
    establishes: [],
    doesNotEstablish: [
      'Any Finnish day-ahead price, and so the observed floor the wholesale section displays.',
      'A followable locator. The register records the portal root rather than the specific query, so no reader can reach the series this record is cited for.',
    ],
  },

  /* ---- opened for the batch ---------------------------------------------- */

  reserveForecast: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: 'Power system reserves — forecasts for average reserve capacity procurement 2026-2036',
    confirmedPublisher: 'Fingrid Oyj',
    confirmedDate: 'forecast horizon 2026-2036, shown against 2019-2025 history',
    locator: 'Forecast tables for average reserve capacity procurement 2026-2036, by product and year, with the non-binding note beneath',
    establishes: [
      'The forecast states its own standing — "Please note that these forecasts are non-binding and they are updated annually."',
      'Slower products grow steeply: mFRR down 567 MW (2026) to 1,100 MW (2036), mFRR up 290 MW to 530 MW, aFRR up 44 MW to 110 MW, aFRR down 59 MW to 110 MW.',
      'FCR-N declines, 128 MW to 105 MW, by way of a trough near 93 MW around 2031.',
      'FCR-D up RISES, 307 MW to 379 MW. FCR-D down RISES, 296 MW to 366 MW. FFR is flat at 3 MW.',
      'Summed on one basis, the fast products go from about 734 MW in 2026 to about 853 MW in 2036 — growth of roughly 16 per cent, not decline.',
    ],
    doesNotEstablish: [
      'That fast-reserve demand is static or shrinking. It is not. The services section note names FCR-N and omits both FCR-D series, and the omitted pair is larger and rising — recorded under DEFECTS below rather than quietly used.',
      'Any price, and so any revenue trajectory. A forecast of procured MW is a volume forecast.',
      'That the forecast and the 2026 obligation are the same measure. They are not — this is AVERAGE PROCUREMENT and that is a requirement, which is why forecast FFR reads 3 MW against a stated obligation of 0-60 MW. The two must never be differenced.',
      'Anything about a single project. A national requirement is not an award.',
    ],
    excerpt: 'Please note that these forecasts are non-binding and they are updated annually.',
  },

  reserveParticipation: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: 'How to participate in the reserve markets',
    confirmedPublisher: 'Fingrid Oyj',
    confirmedDate: 'current at review',
    locator: 'Reserve Provider requirements; Reserve Unit requirements; prequalification testing paragraph',
    establishes: [
      'A reserve provider must own a controllable resource or hold a position in the electricity supply chain, sign an agreement with Fingrid, and depending on the product a settlement agreement with eSett.',
      'A reserve unit must meet the technical specifications for the specific product, be located in Finland or directly connected to the Finnish grid, and fulfil the grid code specifications.',
      'Prequalification is PER PRODUCT and not universal — FFR, FCR and aFRR require prequalification tests, and "mFRR reserve assets are not subject to these tests."',
      'For aFRR the provider "must establish real-time telemetry connections with Fingrid before performing the prequalification tests."',
      'Fingrid lists a named battery contact, so storage participation is contemplated operationally.',
    ],
    doesNotEstablish: [
      'That energy storage is eligible in those words. This page does not say so; the power-system-reserves page does, and that is the record to cite for eligibility.',
      'Any technical threshold — no minimum bid size, response time or endurance requirement appears here. Those sit on per-product pages that were not opened.',
      'How much of the connected fleet has prequalified for which product. This establishes that prequalification is per-product, which is what makes a fleet-versus-obligation subtraction invalid; it says nothing about the outcome.',
      'Any price, awarded volume or revenue. The page links a reserve income calculator and carries no figures.',
    ],
    excerpt: 'mFRR reserve assets are not subject to these tests.',
  },

  gridCode: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: 'Grid code specifications',
    confirmedPublisher: 'Fingrid Oyj',
    confirmedDate: 'VJV2024 and SJV2024 confirmed by the Energy Authority 20 March 2025',
    locator: 'Specification list — VJV2024, KJV, HVDC2018, SJV2024; confirmation and entry-into-force sentence; scope threshold',
    establishes: [
      'Grid energy storage systems have their OWN grid code specification, SJV2024, separate from the power-generation specification VJV2024 and the demand-connection specification KJV.',
      'VJV2024 and SJV2024 were confirmed by the Energy Authority on 20 March 2025 and "come into effect immediately."',
      'The requirements reach facilities of at least 0.8 kW rated power connected to the Finnish electricity system.',
      'Transition provisions turn on connection-agreement and procurement-agreement dates.',
    ],
    doesNotEstablish: [
      'Any connection restriction, moratorium or geographic limitation. None appears — which matters, because two Fingrid grid pages have now been read and neither mentions one.',
      'Any queue volume, contracted capacity or available headroom.',
      'What SJV2024 requires of a battery. This page names and dates the document; the requirements are inside it and it was not opened.',
    ],
    excerpt: 'The grid code specifications for power plants, VJV2024, and the grid code specifications for grid energy storage systems, SJV2024, come into effect immediately.',
  },

  statkraftOx2: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: 'Statkraft signs contract with OX2 to optimize large-scale batteries in Finland',
    /* Publisher and developer are different parties and the memo names both.
       Statkraft published it; OX2 develops and owns the sites. */
    confirmedPublisher: 'Statkraft AS — offtaker and optimiser, publishing its own transaction (counterparty-reported, not a regulator and not independent research)',
    projectDeveloper: 'OX2 — developer and owner of the Kannisto and Korkeamaa sites',
    confirmedDate: '2026',
    locator: 'Site paragraphs naming Kannisto and Korkeamaa with capacities; agreement term and commencement; financing sentence',
    establishes: [
      'Two named sites under construction: Kannisto in Halsua, 110 MW / 220 MWh, and Korkeamaa in Soini, 125 MW / 250 MWh.',
      'Both are exactly two-hour systems — 220/110 and 250/125 — so duration here is arithmetic from the release rather than an assumption.',
      'A seven-year optimisation contract with Statkraft, with optimisation commencing in 2028.',
      'Statkraft describes it as its largest BESS PPA in the Nordics to date.',
      'The structure includes a revenue floor to support project financing — the floor is contract-level and stated only as a structure.',
    ],
    doesNotEstablish: [
      'Any revenue, price or return. The release names a floor STRUCTURE and no amount, which is the opposite of a revenue figure and must not be shown as one.',
      'That two hours is the Finnish norm. Two sites under one agreement are two sites; a fleet-wide duration claim rests on records that are dead or unopened.',
      'Commissioning dates. Optimisation begins in 2028 and no operational date is given.',
      'Anything independently. This is a counterparty announcing its own deal, so any claim resting on it must attribute it.',
    ],
    excerpt: 'Kannisto (Halsua) 110 MW / 220 MWh; Korkeamaa (Soini) 125 MW / 250 MWh; a seven-year optimisation agreement commencing 2028.',
  },

  adequacyStandard: {
    reviewedAt: '2026-08-19',
    access: ACCESS.LANDING_PAGE,
    confirmedTitle: 'Energiavirasto (Energy Authority) — homepage',
    confirmedPublisher: 'Energiavirasto',
    confirmedDate: 'not applicable — a navigational homepage',
    locator: 'Homepage masthead and navigation only; no document reached',
    establishes: [
      'The Energy Authority "regulates and promotes operation of the electricity and gas markets, emission reductions, energy efficiency and the use of renewable energy."',
    ],
    doesNotEstablish: [
      'The reliability standard in LOLE hours per year, which the capacity section displays as a headline figure.',
      'The peak load capacity procurement decision for any period, including the 0 MW figure and the July 2022 dormancy date.',
      'Anything about resource adequacy whatsoever. It is a navigational homepage.',
      'REGISTER DEFECT: the record is titled as a national market report but its URL is the regulator homepage. The named document was never reachable from the register, so the story and capacity sections have been citing a masthead — a failure no link check would ever catch, because the homepage returns 200.',
    ],
  },

  tradePress: {
    reviewedAt: '2026-08-19',
    access: ACCESS.LANDING_PAGE,
    confirmedTitle: 'energy-storage.news — Finland tag index',
    confirmedPublisher: 'trade press',
    confirmedDate: 'index current at review; listed entries dated to 2026',
    locator: 'Tag index listing; entries dated 3 March, 12 March and 16 April 2026',
    establishes: [
      'The address is a tag index rather than an article, listing Finland-related coverage.',
    ],
    doesNotEstablish: [
      'The Nivala and Uusikaupunki capacities that the duration and pipeline sections attribute to it. Neither project appears on the index at all, with figures or without.',
      'REGISTER DEFECT: this citation does not reach its evidence, and a tag index reorders with every new article, so it could not be a stable locator even if the projects were on it. The underlying articles need identifying individually, with author and date.',
      'Anything publishable in any case — the record is unclassified and flagged for re-verification, so the schema already refuses it as affirmative support.',
    ],
  },
};

/* ---------------------------------------------------------------------------
   DEFECTS FOUND IN EXISTING PROSE AND IN THE REGISTER.

   Kept here rather than in claims.js because this file is imported only by
   tests, so none of it reaches a bundle. One has been fixed — it was an
   assertion the source contradicts, and leaving it would have meant publishing
   a corrected claim on a page that still said the opposite. The other three are
   register repairs that need new sourcing and are on the backlog.
   --------------------------------------------------------------------------- */
export const DEFECTS = [
  {
    where: 'sections.js — services forecast note; comparison.js — the same framing, twice',
    what: 'The note read "The growth is in the slower products" and supported it by naming mFRR up, mFRR down and a declining FCR-N. The forecast on the same Fingrid page also shows FCR-D up rising 307 to 379 MW and FCR-D down rising 296 to 366 MW — the two largest fast products, both growing. Summed on one basis the fast block grows from about 734 to about 853 MW, roughly 16 per cent, against about 960 to 1,850 MW for the slower block, roughly 93 per cent.',
    severity: 'The framing "the forecast does not rescue it" was materially stronger than the forecast supports. The relative point — slower procurement grows far faster — is true and survives; the implication that fast procurement declines was false.',
    status: 'CORRECTED 2026-08-19 in all three places, with the non-binding average-procurement basis stated and an explicit instruction not to difference it against the obligation table.',
  },
  {
    where: 'sources.js — adequacyStandard',
    what: 'Titled as the Energy Authority national market report; the URL is the regulator homepage. The named document is not reachable from the register and never was.',
    severity: 'The story and capacity sections cite it for figures it does not contain. It returns 200, so no link audit will ever flag it.',
    status: 'OPEN — needs the actual report identified by title and year.',
  },
  {
    where: 'sources.js — tradePress',
    what: 'Cited by duration and pipeline for the Nivala and Uusikaupunki capacities; the URL is a Finland tag index listing neither project. A tag index also reorders continuously, so it could not be a stable locator even if they appeared on it.',
    severity: 'Same shape as adequacyStandard — healthy link, no evidence behind it.',
    status: 'OPEN — needs the individual articles, each with author and date.',
  },
  {
    where: 'sources.js — dayAhead',
    what: 'Records the ENTSO-E portal root. The Finnish day-ahead series sits behind in-app query state, so following the citation reaches no data.',
    severity: 'Lower — the platform is correct and the address is merely too coarse to follow.',
    status: 'OPEN — needs the specific query recorded.',
  },
];
