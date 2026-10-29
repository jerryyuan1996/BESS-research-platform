/* ---------------------------------------------------------------------------
   Saudi Arabia — SPPC. Identity and freshness metadata.

   Registered on the analyst's sign-off of 2026-10-29
   (docs/saudi-registration-plan.md), engine-withheld until SPPC's storage
   price is known. A reused hue with a second channel, as Finland, Ontario and
   Spain carry.
   --------------------------------------------------------------------------- */

export const manifest = {
  id: 'sa',
  slug: 'saudi-arabia',
  flag: '🇸🇦',

  shortName: ['SA', '沙特'],
  name: ['Saudi Arabia — SPPC', '沙特阿拉伯 — SPPC'],

  currency: 'SAR',
  currencySymbol: 'SAR ',
  locale: 'en-SA',
  timezone: 'Asia/Riyadh',

  color: 'var(--s14)',
  pattern: 'dots',

  asOf: '2026-10-29',
  dataDate: 'SPPC Group 1 award, 20–21 Aug 2026; Group 2 bid deadline 12 Nov 2026',
  modelVersion: 'sa-1.0-sppc-ssa',
  lastVerified: '2026-10-29',
  sourceHealth: [
    'Contract structure and investment values from SPPC\'s Group 1 announcement and the consortia\'s disclosures, as reported; SPPC\'s own site refused connections on 2026-10-29. The SSA price is unpublished. Verified 2026-10-29.',
    '合同结构与投资额取自SPPC第一组公告及联合体披露（经媒体报道）；SPPC官网于2026年10月29日无法连接。储能服务协议价格未公布。核验于2026年10月29日。',
  ],
};

export default manifest;
