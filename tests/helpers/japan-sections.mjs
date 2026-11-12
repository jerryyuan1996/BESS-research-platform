/* Stateful test lens, just like the engine's region() and global L(). The lazy
   factories keep their API, so tests change its current reading, not its identity. */
import { marketApi, buildAllMarketSections, digests } from './market-sections.mjs';
import { activeRegion } from '../../src/markets/jp/data.js';
import { GLOSS_CORE } from '../../src/markets/_shared/glossary.js';
let currentRegion = 'tokyo', currentLanguage = 'en', api;
export async function japanSections(region, language){
  currentRegion = region;
  currentLanguage = language;
  activeRegion.id = region === 'compare' ? 'tokyo' : region;
  if (!api){
    api = { ...await marketApi('jp'), GLOSS_CORE,
      L: pair => Array.isArray(pair) ? pair[currentLanguage === 'zh' ? 1 : 0] : pair,
      region: () => currentRegion,
      isCompare: () => currentRegion === 'compare',
      lensRegions: () => currentRegion === 'compare' ? ['tokyo','kyushu','hokkaido'] : [currentRegion],
    };
  }
  return buildAllMarketSections('jp', api);
}
export async function japanDigests(region, language){
  return digests(await japanSections(region, language));
}
