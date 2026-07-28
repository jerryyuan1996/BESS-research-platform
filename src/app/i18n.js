/* ---------------------------------------------------------------------------
   Bilingual accessor.

   The prototype's convention is a two-element array: ['English', '中文']. Every
   one of the six programs declared its own identical `L()`. This is the single
   copy; nothing else in the codebase may redeclare it.

   L() is intentionally tolerant of a plain string so that call sites which pass
   an already-resolved value (or a value that is language-neutral, like a number
   or a market flag) do not need a branch. This is the prototype's behaviour.

   Forward path (not needed now, per brief section 14): L() also accepts an
   { en, zh } object, so content can migrate to the object form file by file
   without a coordinated rewrite. Array form stays valid indefinitely.
   --------------------------------------------------------------------------- */
import { app } from './state.js';

export function L(pair){
  if (Array.isArray(pair)) return pair[app.lang === 'zh' ? 1 : 0];
  if (pair && typeof pair === 'object' && ('en' in pair || 'zh' in pair)){
    return app.lang === 'zh' ? (pair.zh ?? pair.en) : (pair.en ?? pair.zh);
  }
  return pair;
}

/** Current language code — 'en' | 'zh'. */
export const lang = () => app.lang;

/** BCP-47 tag for <html lang>. */
export const htmlLang = () => (app.lang === 'zh' ? 'zh-CN' : 'en');
