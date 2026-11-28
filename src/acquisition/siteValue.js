/* ---------------------------------------------------------------------------
   END-OF-LIFE SITE VALUE.

   When the first battery retires, the site still holds its land, consent and
   connection. A buyer would pay for that as a brownfield ready-to-build site.
   The analyst signed off this treatment on 27 November 2026
   (docs/site-value-plan-2026-11-27.md, D1–D6):

     credit = signed pre-construction site benchmark per MW (2026 money)
              × 50% survival weight, indexed with the model's inflation to the
              last operating year, after the sale fee and the sale-gain tax.

   The existing retirement allowance stays as the cost of removal (D3). The
   five-year sale buyer prices the credit too (D4). PJM gets no credit until a
   rights price is public (D5). Life stays at 20 years (D6).

   Only markets with an adopted public benchmark carry a value. This is an
   analyst assumption: automation may propose a refreshed price, never apply
   one. It is shown BESIDE the headline return. Moving it into the headline
   needs its own sign-off on the before/after table.
   --------------------------------------------------------------------------- */

export const SITE_VALUE_WEIGHT = 0.5;
export const SITE_VALUE_AS_OF = '2026-11-27';

/** Published project valuation or transaction benchmark per MW in cash-flow currency. */
export const SITE_VALUE = {
	gb: {
		currency: 'GBP',
		perMW: 84000,
		date: '2025-03-31',
		basis: ['Gore Street pre-construction portfolio NAV, GB/Ireland/Texas, March 2025', 'Gore Street英国、爱尔兰和得州施工前项目组合净资产估值，2025年3月'],
		arithmetic: '8% × £519.3m NAV ÷ 495 MW of pre-construction sites (GB, Ireland, Texas)',
		url: 'https://www.lse.co.uk/rns/strategy-and-capital-allocation-plan-56rlzoqduhfxjip.html',
	},
	it: {
		currency: 'EUR',
		perMW: 37500,
		date: '2026-03-31',
		basis: ['nTeaser ready-to-build median, Q1 2026', 'nTeaser可开工项目中位价，2026年第一季度'],
		arithmetic: 'Median of Q1 2026 ready-to-build transactions',
		url: 'https://www.ess-news.com/2026/04/14/italian-ready-to-build-bess-market-prices-slide-amid-regulatory-uncertainty-macse-misfire/',
	},
	es: {
		currency: 'EUR',
		perMW: 71500,
		date: '2026-03-31',
		basis: ['nTeaser ready-to-build average, Q1 2026', 'nTeaser可开工项目均价，2026年第一季度'],
		arithmetic: 'Average ready-to-build price in the quarter reported in June 2026',
		url: 'https://ionanalytics.com/insights/uncategory/spanish-solar-project-prices-plummet-as-bess-values-soar-2/',
	},
	ercot: {
		currency: 'USD',
		perMW: 51500,
		date: '2026-09-24',
		basis: ['Midpoint of ERCOT development-stage deals, 2024–2026', 'ERCOT开发阶段交易区间中点，2024–2026年'],
		arithmetic: '($29k + $74k) ÷ 2 over five development-stage deals',
		url: 'https://www.enerdatics.com/insights/why-two-projects-carry-the-economics-of-a-2-3-gw-battery-deal',
	},
};

/** The credit in 2026 money, per MW, in the given cash-flow currency; null when none applies. */
export function siteValueCredit(marketId, currency) {
	const sv = SITE_VALUE[marketId];
	if (!sv || sv.currency !== currency) return null;
	return sv.perMW * SITE_VALUE_WEIGHT;
}
