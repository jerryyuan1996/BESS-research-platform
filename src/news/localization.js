import { NEWS_ZH } from './translations.zh.js';

export function chineseNewsText(item, field = 'title') {
  const original = item?.[field];
  if (typeof original !== 'string' || !original) return null;
  for (const pair of [NEWS_ZH[item.url]?.[field], item.zh?.[field]]) {
    if (pair?.[0] === original && typeof pair[1] === 'string' && /\p{Script=Han}/u.test(pair[1])) {
      return pair[1];
    }
  }
  return null;
}
export function newsTextPair(item, field = 'title') {
  const original = typeof item?.[field] === 'string' ? item[field] : '';
  return [original, chineseNewsText(item, field) ?? original];
}
export function hasNewsTranslation(item, field = 'title') {
  return item?.[field] === '' || chineseNewsText(item, field) !== null;
}
export const newsSearchText=item=>['title','summary'].flatMap(field=>newsTextPair(item,field)).join(' ');
