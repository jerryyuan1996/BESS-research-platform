/* ---------------------------------------------------------------------------
   FINLAND SECTION CLAIMS.

   One of eight sections publishes: `duration`. One is blocked, six are
   incomplete, and each records why. Coverage 7/150.

   ---------------------------------------------------------------------------
   WHAT THE FINLAND PASS FOUND

   One supported claim out of eight sections, and that is the honest result
   rather than a failure of effort. Nine of fourteen records were reached. The
   three Fingrid pages that opened are excellent and establish a great deal
   about market STRUCTURE. Almost none of it is what the dashboard actually
   displays.

   The displayed figures — 1,050 MW connected, 0 MW procured, dormant since July
   2022, the LOLE standard, the southern restriction and its extension, the
   -500 EUR/MWh floor, the 15-minute market time unit — trace to three dead news
   URLs, a regulator homepage, a 403 and a portal root. Not one was verified.

   THE SHARPEST FINDING IS THE ONE NO LINK CHECK COULD MAKE. `adequacyStandard`
   is recorded as a national market report and points at the Energy Authority
   homepage; `tradePress` is cited for two projects and points at a tag index
   carrying neither. Both return HTTP 200. Both have been supporting displayed
   figures. A citation can be perfectly healthy and still not reach its
   evidence, and only opening it finds that.

   ---------------------------------------------------------------------------
   WHY SO MANY SECTIONS ARE INCOMPLETE RATHER THAN SUPPORTED

   In six sections a genuinely verified structural fact sits next to unverified
   headline figures — SJV2024 beside an unverified connection restriction, act
   117/2011 beside an unverified 0 MW. Publishing the verified half as a claim
   would put a "supported by section evidence" badge directly above numbers
   nobody has checked, and the badge would be read as covering the section. That
   is borrowed credibility, and it is worse than an empty slot.

   THIS IS AN EDITORIAL JUDGEMENT PER SECTION, NOT A RULE, AND IS DELIBERATELY
   NOT VALIDATED. "A supported claim cannot coexist with any unverified figure"
   would be wrong as a global gate: a section may well support a narrowly scoped
   claim while unrelated gaps sit elsewhere on the page, provided the scope is
   explicit and the separation is visible to a reader. What makes Finland
   different is that in each of these six the unverified figures ARE the
   section's headline argument — the restriction IS the grid case, the 0 MW IS
   the capacity case — so no honest scoping separates them. Encoding it would
   forbid the good case along with the bad one.

   ---------------------------------------------------------------------------
   ONLY THE PUBLISHED CLAIM SHIPS

   This file holds the one supported claim. The other seven dispositions — one
   blocked, six incomplete — live in dispositions.js, which no shipped module
   imports.

   That split is not tidiness. Registering all eight put the Finland chunk at
   20.89 kB gzipped against an 18 kB budget, because seven sections that render
   NOTHING were each carrying a bilingual paragraph explaining why. WA gets away
   with the same shape only because it has headroom. A reader downloading prose
   for seven claims they will never see is the plainest form of a draft leaking
   into the build, and the budget is what made it visible.
   --------------------------------------------------------------------------- */
import { READINESS, CLAIM_BASIS } from '../../governance/claims.js';

export const CLAIMS = {
  /* ---- the one that survived -------------------------------------------- */

  /* The only section whose argument and whose evidence are the same thing.
     Duration makes no numeric display claim of its own — no KPI row, no chart —
     so a claim here is not lending cover to anything unverified.

     SCOPED TO THE TWO VERIFIED SITES. The section names four projects; the
     other two rest on a tag index that does not carry them. Two hours is stated
     for Kannisto and Korkeamaa and nowhere else, so the claim says Kannisto and
     Korkeamaa.

     BASIS IS REPORTED. It was drafted as `measured`, and that was wrong. The
     arithmetic is exact — 220/110 and 250/125 — but exact arithmetic on a
     disclosed design is not a measurement, and these facilities are under
     construction, so there is no operating asset to have measured. `measured`
     would have told a reader the fleet was metered.

     Basis, provenance and attribution stay three separate things: `reported`
     is what kind of assertion this is, `authority: counterparty-reported` on
     the record is who stands behind it, and `attribution` puts Statkraft's name
     on the page where a reader sees it.

     THE PUBLISHER IS NOT THE DEVELOPER. Statkraft contracted to optimise these
     batteries; OX2 builds and owns them. The record said developer-reported,
     which named the wrong party and implied a closeness to the asset Statkraft
     does not have. The evidence memo names OX2 as developer; the page attributes
     Statkraft, because Statkraft is who said it. */
  duration: {
    readiness: READINESS.SUPPORTED,
    basis: CLAIM_BASIS.REPORTED,
    evidence: ['statkraftOx2'],
    attribution: ['Statkraft, announcing its own agreement with OX2', 'Statkraft就其与OX2协议所作公告'],
    text: [
      'Statkraft reports that the two Finnish BESS facilities covered by its OX2 agreement are under construction at 110 MW / 220 MWh and 125 MW / 250 MWh, giving each a stated two-hour configuration.',
      'Statkraft公告称，其与OX2协议所涵盖的两座芬兰BESS正在建设中，规模分别为110MW/220MWh和125MW/250MWh，即两者披露的配置均为两小时。',
    ],
    caveat: [
      'Statkraft is a contractual counterparty describing its own agreement, and the statement covers two facilities rather than Finland’s fleet. The release discloses no revenue, price or return: it names a revenue floor structure with no amount, which is not an earnings figure. It does not validate the Nivala or Uusikaupunki figures shown elsewhere in this section, whose cited source is a tag index carrying neither project.',
      'Statkraft为合同交易对手方，所述为其自身协议，且该表述仅涵盖两座设施而非芬兰全部机组。该公告未披露任何收入、价格或回报：其提及的收入保底结构未列明金额，不构成收益数据。该公告亦不能佐证本节其他部分所示Nivala与Uusikaupunki的数据 — 后者引用的来源为一个并未收录该两个项目的标签索引页。',
    ],
  },
};
