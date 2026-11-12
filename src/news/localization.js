import { NEWS_ZH } from './translations.zh.js';

export function newsTextPair(item,field='title'){
  const original=typeof item?.[field]==='string'?item[field]:'';
  const pair=NEWS_ZH[item?.url]?.[field];
  return [original,pair?.[0]===original?pair[1]:original];
}
export function hasNewsTranslation(item,field='title'){
  return NEWS_ZH[item?.url]?.[field]?.[0]===item?.[field];
}
export const newsSearchText=item=>['title','summary'].flatMap(field=>newsTextPair(item,field)).join(' ');
