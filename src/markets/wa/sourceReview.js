/* ---------------------------------------------------------------------------
   WA SOURCE REVIEW — what was opened on 2026-08-19, and what it showed.

   One pass over the URLs already in the register. Opening an already-cited
   source is editorial evidence review; finding a replacement source is not, and
   nothing here does that.

   THE HEADLINE RESULT: the two regulator sites answered and the market operator
   did not. Every AEMO URL returns 403 to an automated fetch, and the archive
   fallback is unavailable from this environment, so the ESOO, the quarterly
   dynamics report and the reserve-capacity timetable were NOT read. The
   sections resting on them stay incomplete for an access reason, which is
   different from a research gap and is recorded as such.

   What did open changed two dispositions and turned up two stale register
   dates, which is a better return than the pass looked like it would give.
   --------------------------------------------------------------------------- */
import { ACCESS } from '../../governance/sourceReview.js';

export const REVIEW = {

  /* ---- opened, and decisive ---------------------------------------------- */

  brcp: {
    reviewedAt: '2026-08-19',
    access: ACCESS.LANDING_PAGE,
    confirmedTitle: '2026 Benchmark Reserve Capacity Prices for the 2028/29 capacity year — Final determination',
    confirmedPublisher: 'Economic Regulation Authority, Western Australia',
    confirmedDate: '13 March 2026',
    locator: 'ERA price-setting index, "Benchmark Reserve Capacity Price Determination"; and the 2028/29 determination page, which lists the final determination PDF dated 13 Mar 2026',
    establishes: [
      'A final determination of the Benchmark Reserve Capacity Price for the 2028/29 capacity year exists, is published by the ERA, and is dated 13 March 2026.',
      'The BRCP is set for each capacity year from the expected cost of a NEW ENTRANT BUILDING AND CONNECTING A BATTERY to the South West Interconnected System — the benchmark technology is a battery, stated by the price-setting regulator itself.',
      'The BRCP is described as a benchmark from which the reserve capacity price is set, not as an amount paid to a project.',
    ],
    doesNotEstablish: [
      'The BRCP value. It is in the determination PDF, which was not opened; no dollar figure here is verified.',
      'The benchmark battery size in MW or MWh. The index page names the technology, not its dimensions.',
      'The payment chain. That capacity revenue equals assigned Capacity Credits multiplied by the applicable reserve capacity price is a RULES proposition, and the rules text was not opened.',
      'Anything about whether a given project receives capacity revenue at all.',
    ],
    excerpt: 'Benchmark Reserve Capacity Prices are set for each Capacity Year based on the expected cost of a new entrant building and connecting a battery to the South West Interconnected System.',
  },

  rules: {
    reviewedAt: '2026-08-19',
    access: ACCESS.LANDING_PAGE,
    confirmedTitle: 'Electricity System and Market Rules',
    confirmedPublisher: 'Department of Energy and Economic Diversification — Energy Policy WA',
    confirmedDate: '1 July 2026 (current consolidated version)',
    locator: 'wa.gov.au document collection page; current rules listed as "Electricity System and Market Rules – 1 July 2026", plus amending rules awaiting commencement (Tranches 8 and 9, RCM Reviews Sequencing, Reserve Capacity Reform 2023)',
    registerDateDiffers: true,
    registerDateNote: 'The register records 2023–2025. The current consolidated rules are dated 1 July 2026, and there are amending rules awaiting commencement, so the register understates the vintage and hides that the framework is still moving.',
    establishes: [
      'A consolidated Electricity System and Market Rules instrument current at 1 July 2026 exists, published by Energy Policy WA.',
      'Amending rules are awaiting commencement, including Reserve Capacity Reform 2023 and RCM Reviews Sequencing 2025, so the capacity framework is mid-transition.',
    ],
    doesNotEstablish: [
      'How Capacity Credits are assigned.',
      'How the reserve capacity price relates to the BRCP.',
      'The Energy Storage Resource Duration Requirement, in trading intervals or otherwise.',
      'All three sit inside the rules PDFs, which were not opened. The collection page carries none of them.',
    ],
  },

  swisPlan: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: 'The South West Interconnected System Transmission Plan: A Future-Ready Transmission Network for WA’s Main Electricity System',
    confirmedPublisher: 'Energy Policy WA, supported by Western Power',
    confirmedDate: 'page last updated 4 March 2026',
    locator: 'Energy Policy WA plan page; headings "The South West Interconnected System Transmission Plan", Phase One / Phase Two / Phase Three',
    registerDateDiffers: true,
    registerDateNote: 'The register records 18 Sep 2025. The page reports last updated 4 March 2026. These are not necessarily in conflict — one may be publication and the other a page edit — and the distinction was NOT resolved, so both are recorded rather than one overwriting the other.',
    establishes: [
      'The plan is structured in three phases, the first being the Clean Energy Link projects connecting new generation as coal retires.',
      'The plan sets out the State Government vision for the transmission network ALONG WITH THE INVESTMENT NEEDED to deliver it — that is, it identifies required investment.',
    ],
    doesNotEstablish: [
      'Any megawatt figure or target year. The page states phase objectives and no quantities.',
      'That funding is committed. The plan expresses a vision and the investment needed for it, which is not an appropriation and must not be read as one.',
      'Anything about network access quantity or deliverability for a particular connection.',
    ],
  },

  /* ---- could not be opened ----------------------------------------------- */

  esoo: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'aemo.com.au returns HTTP 403 to an automated fetch. The archive fallback (web.archive.org) is not reachable from this environment. Neither the ESOO landing page nor the publication was read.',
    establishes: [],
    doesNotEstablish: [
      'The four elements the duration claim needs — fourteen trading intervals, the 2028-29 effective period, the grandfathering boundary and the full-credit consequence — are all unverified.',
    ],
  },

  qed: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'aemo.com.au returns HTTP 403 to an automated fetch; archive fallback unreachable. The quarterly dynamics report was not read.',
    establishes: [],
    doesNotEstablish: [
      'The discharge-spread figures and the fleet-growth figures, and crucially whether the two are measured over comparable periods, are all unverified.',
    ],
  },

  crc: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'aemo.com.au returns HTTP 403 to an automated fetch; archive fallback unreachable.',
    establishes: [],
    doesNotEstablish: [
      'The scope of "certified reserve capacity" and whether the term applies to storage as used in the earlier draft claim.',
    ],
  },

  consent: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The recorded URL is the EPA WA homepage, which the fetch layer could not verify as safe to retrieve. Separately, a bare organisation homepage cannot be a locator for a specific approval requirement even if it were readable.',
    establishes: [],
    doesNotEstablish: [
      'Any specific approval requirement or timeframe for grid-scale storage.',
      'The record own authority. It describes observed approvals across WA and federal processes, which reads as an internal compilation rather than a single regulator publication, but that was NOT confirmed and the record stays unclassified rather than being assigned an author from its description.',
    ],
  },

  mkt: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The record carries NO url and names no author. There is nothing to open. Identifying the underlying study is new sourcing, which is outside an editorial review pass, so it goes to the research backlog rather than being guessed at from the description.',
    establishes: [],
    doesNotEstablish: [
      'The ownership-concentration and exit-channel findings the pipeline section rests on.',
      'Its own authorship, which its third-party classification requires before it can support any published claim.',
    ],
  },
};
