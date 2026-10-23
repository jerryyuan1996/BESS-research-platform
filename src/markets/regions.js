/* ---------------------------------------------------------------------------
   REGION — ORIENTATION ONLY.

   Fifteen markets is more than a reader holds in their head, and the tab strip
   gives no clue that Kyushu and Hokkaido are neighbours while Ireland and
   Poland are not. Region answers "roughly where am I", and nothing else.

   ---------------------------------------------------------------------------
   WHAT REGIONAL COLOUR IS NOT ALLOWED TO DO

   It never carries a fact. The series ramp (--s1..--s14), the status ramp
   (good / warn / serious / critical) and the methodology colours are untouched
   and keep their meanings everywhere, including on a page tinted by region. A
   reader who learns that amber means caution must not have to unlearn it
   because the page is Asian.

   It is never the only channel. Every place an accent appears, the region is
   also named in text, and every navigation state — active, hover, focus —
   remains distinguishable by border, weight and background with the hue
   removed entirely. The colour is a convenience for someone scanning; it is
   never the thing being said.

   ---------------------------------------------------------------------------
   WHY THE HUES ARE ALSO SEPARATED BY LIGHTNESS

   Four hues that differ only in hue collapse into one grey when printed, and
   two of them collapse for a reader with deuteranopia. These four are chosen so
   that their relative luminances are distinct: the ordering survives grayscale
   and the pairs stay separable under the common colour-vision deficiencies.
   The separation is asserted in tests/regions.test.js rather than trusted.

   Deliberately drawn from outside the series ramp so a regional accent can
   never be mistaken for a data series.

   ---------------------------------------------------------------------------
   DOSSIERS DO NOT INHERIT THE ACCENT

   A project dossier knows its market, but that association is confidential
   until the deal is public. Tinting a dossier page by region would leak "this
   project is in Western Australia" into any screenshot, from the chrome, with
   no text saying so. Dossier pages therefore carry no regional accent — see
   src/projects/dossier/page.js.
   --------------------------------------------------------------------------- */

/** The four regions, in the order they read on a globe going east. */
export const REGIONS = {
  americas: { id: 'americas', label: ['Americas', '美洲'] },
  europe:   { id: 'europe',   label: ['Europe', '欧洲'] },
  asia:     { id: 'asia',     label: ['Asia-Pacific', '亚太'] },
  oceania:  { id: 'oceania',  label: ['Oceania', '大洋洲'] },
};

/**
 * Market id to region.
 *
 * A map rather than a manifest field, so adding a region is one edit in one
 * file and a market cannot half-declare one. `regionOf` fails closed: an
 * unmapped market gets no accent rather than an arbitrary one, and the test
 * suite refuses a registered market that is missing from here.
 */
const BY_MARKET = {
  wa: 'oceania', nem: 'oceania',
  gb: 'europe', de: 'europe', it: 'europe', ie: 'europe',
  ro: 'europe', pl: 'europe', fi: 'europe',
  jp_tokyo: 'asia', jp_kyushu: 'asia', jp_hokkaido: 'asia',
  pjm: 'americas', ercot: 'americas', caiso: 'americas', ca_on: 'americas',
};

/** Region id for a market id, or null. Null means "no accent", never a guess. */
export const regionOf = (marketId) => BY_MARKET[marketId] ?? null;

/** Every market id this module knows, for the completeness test. */
export const mappedMarkets = () => Object.keys(BY_MARKET);

/** The region record for a market, or null. */
export function regionFor(marketId){
  const id = regionOf(marketId);
  return id ? REGIONS[id] : null;
}
