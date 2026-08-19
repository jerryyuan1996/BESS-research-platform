/* ---------------------------------------------------------------------------
   PJM SECTION CLAIMS.

   One section reviewed so far: capacity. The rest are not drafted.

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
};
