/* Page-language formatting. Keep each caller's English convention, including
   date order and precision; resolve the language when formatting, not on import. */
import { lang } from '../app/i18n.js';

const cache = new Map();
function formatter(kind, options, englishLocale){
  const locale = lang() === 'zh' ? 'zh-CN' : englishLocale;
  const key = JSON.stringify([kind, locale, options]);
  if (!cache.has(key)) cache.set(key, new Intl[kind](locale, options));
  return cache.get(key);
}
export const formatNumber = (value, options = {}, englishLocale = 'en-US') =>
  formatter('NumberFormat', options, englishLocale).format(value);
export const formatDate = (value, options = {}, englishLocale = 'en-GB') =>
  formatter('DateTimeFormat', options, englishLocale).format(value instanceof Date ? value : new Date(value));
export const pageNumberFormat = (englishLocale, options = {}) => ({
  format: value => formatNumber(value, options, englishLocale),
});

/** Preserve the dataset's precision: a month vintage never acquires a day. */
export function formatVintage(raw){
  const day = /^\d{4}-\d{2}-\d{2}$/.test(raw) || /^\d{1,2} [A-Za-z]+ \d{4}$/.test(raw);
  const month = /^\d{4}-\d{2}$/.test(raw) || /^[A-Za-z]+ \d{4}$/.test(raw);
  if (!day && !month) return raw;
  const date = /^\d{4}-/.test(raw) ? raw : (day ? raw : '1 ' + raw) + ' 00:00:00 GMT';
  if (!Number.isFinite(Date.parse(date))) return raw;
  return formatDate(date, { ...(day ? { day: 'numeric' } : {}), month: 'short', year: 'numeric', timeZone: 'UTC' });
}
