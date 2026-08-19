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
      'Every price in PJM’s 2028/2029 Base Residual Auction cleared at the VRR Curve cap of $325.00 per MW-day UCAP, so the cap bound the result across all sixteen modelled locational deliverability areas.',
      'PJM 2028/2029年度基本剩余容量拍卖的所有价格均以VRR曲线上限每MW·日325.00美元（UCAP口径）出清，故该上限对全部十六个已建模区域可交付区的结果均构成实际约束。',
    ],
    caveat: [
      'The same cap and floor applied to the 2026/2027 and 2027/2028 auctions, and offers above the cap were not cleared. The report does not say who imposed the collar or whether any approval beyond PJM was required, and it does not attribute the auction’s shortfall against the reliability requirement to the cap — neither is claimed here.',
      '同一上下限亦适用于2026/2027与2027/2028年度拍卖，且高于上限的报价未获出清。该报告未说明该价格区间由何方设定、是否需PJM以外的批准，亦未将本次拍卖低于可靠性需求的缺口归因于该上限 — 此处均不作主张。',
    ],
  },
};
