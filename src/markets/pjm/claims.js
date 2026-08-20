/* ---------------------------------------------------------------------------
   PJM SECTION CLAIMS.

   Three sections publish: capacity, duration and story.

   ---------------------------------------------------------------------------
   ONLY THE PUBLISHED CLAIMS SHIP

   The five sections that publish nothing live in dispositions.js, which no
   runtime module imports. The boundary is the same in every claim-enabled
   market — see the note in the Finland module for the budget failure that
   forced it. PJM had the same defect and merely enough headroom to hide it.

   THE CAPACITY CLAIM CHANGED WHEN THE DOCUMENT WAS OPENED. Two wordings were
   prepared in advance — one for a collar that bound and one for a collar that
   did not — and the report settled it in a single sentence: every price cleared
   AT the cap. The "cleared within its bounds" version would have been wrong in
   the most flattering possible direction, describing an administered ceiling as
   a market outcome.

   BASIS IS MEASURED, not policy. The principal assertion is an observed auction
   result. The collar is an administered instrument and its policy character is
   recorded in the evidence review, not smuggled into the basis field — those
   are the two dimensions this schema keeps apart.
   --------------------------------------------------------------------------- */
import { READINESS, CLAIM_BASIS } from '../../governance/claims.js';

export const CLAIMS = {

  capacity: {
    readiness: READINESS.SUPPORTED,
    basis: CLAIM_BASIS.MEASURED,
    /* The auction report alone. The collar record's URL is dead, and the report
       states the collar parameters itself, so nothing is lost by not citing it
       and a broken reference is avoided. */
    evidence: ['bra2829'],
    text: [
      'Every price in PJM’s 2028/2029 Base Residual Auction cleared at the VRR Curve cap of $325.00 per MW-day UCAP, making the ceiling binding on the clearing price in all sixteen modelled locational deliverability areas.',
      'PJM 2028/2029年度基本剩余容量拍卖的所有价格均以VRR曲线上限每MW·日325.00美元（UCAP口径）出清，因此该价格上限在全部十六个建模区域可交付区（LDA）均对出清价格形成实际约束。',
    ],
    caveat: [
      'The claim is about the clearing PRICE only. The auction report does not establish who originally imposed or approved the collar, whether further regulatory approval was required, that the cap caused the capacity shortfall against the reliability requirement, or what prices and procured volumes would have been without it. None of those is claimed here.',
      '本结论仅涉及出清价格。该拍卖报告并未确立：该价格区间最初由何方设定或批准、是否需要额外的监管批准、该上限是否导致了相对可靠性需求的容量缺口，以及若无该上限时的出清价格与采购量将会如何。以上均不作主张。',
    ],
  },

  /* Reviewed 2026-08-19 against the ELCC class ratings document.

     MODELLED, not measured. An ELCC rating is the output of a reliability model
     — what a class of resource is calculated to contribute — not an observation
     of how a battery performed. Calling it measured would dress a model result
     as operating history, which is the specific confusion this basis field
     exists to prevent. */
  duration: {
    readiness: READINESS.SUPPORTED,
    basis: CLAIM_BASIS.MODELLED,
    evidence: ['elcc2829'],
    text: [
      'PJM’s modelled storage class ratings for the 2028/2029 Base Residual Auction rise from 59% for four-hour systems to 78% for ten-hour systems.',
      'PJM针对2028/2029年度基本剩余容量拍卖测算的储能ELCC类别核定值，由四小时系统的59%升至十小时系统的78%。',
    ],
    caveat: [
      'These percentages are accreditation multipliers, not prices: they set how much capacity a resource is credited with, not what that capacity earns. Hybrid and combination resources receive no storage class rating at all and are assessed by resource-specific analysis instead.',
      '上述百分比为核定折算系数而非价格：它们决定资源获得多少容量认定，而非该容量能获得多少收入。混合式与组合式资源不适用储能类别核定值，须另行按具体项目分析。',
    ],
  },

  /* Both years come from the 2028/2029 report, which states the prior year for
     comparison. The geography differs between them and the claim says so: an
     RTO price one year, all modelled LDA prices the next. Collapsing that into
     "cleared at the cap twice" would quietly equate two different scopes. */
  story: {
    readiness: READINESS.SUPPORTED,
    basis: CLAIM_BASIS.MEASURED,
    evidence: ['bra2829'],
    text: [
      'Across two consecutive PJM Base Residual Auctions, the RTO price cleared at its $333.44 per MW-day UCAP cap for 2027/2028, while all modelled LDA prices cleared at the $325.00 cap for 2028/2029.',
      '在连续两次PJM基本剩余容量拍卖中，2027/2028年度RTO价格以每MW·日333.44美元（UCAP口径）的上限出清，而2028/2029年度全部建模LDA价格均以325.00美元的上限出清。',
    ],
    caveat: [
      'The report does not establish why the prices reached their caps, nor that the caps caused the procurement shortfalls recorded in the same auctions. Both years cleared below the reliability requirement; the report asserts no link between that and the ceiling.',
      '该报告并未说明价格为何触及上限，亦未确立上限导致了同期拍卖中的采购缺口。两个年度均低于可靠性需求出清，但报告未就此与价格上限之间建立任何因果关系。',
    ],
  },
};
