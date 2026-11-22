import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chineseNewsText } from '../../src/news/localization.js';

const script = fileURLToPath(new URL('../translate-news.py', import.meta.url));

function translateBatch(texts) {
  return new Promise((resolve, reject) => {
    const worker = execFile('uv', ['run', '--no-project', '--script', script], {
      timeout: 240_000, maxBuffer: 1024 * 1024, windowsHide: true,
    }, (error, stdout) => {
      if (error) {
        const reason = error.code === 'ENOENT' ? 'uv is not installed' : String(error.signal || error.code);
        return reject(new Error(`translation worker failed (${reason})`));
      }
      try { resolve(JSON.parse(stdout)); } catch { reject(new Error('invalid translation response')); }
    });
    worker.stdin.on('error', reject);
    worker.stdin.end(JSON.stringify(texts));
  });
}

export async function localizeNews(items, previous, log, translate = translateBatch) {
  const byUrl = new Map((previous?.series ?? previous?.items ?? []).map(item => [item.url, item]));
  const pending = new Map();
  for (const item of items) {
    const prior = byUrl.get(item.url);
    const zh = {};
    for (const field of ['title', 'summary']) {
      const original = item[field];
      if (!original) continue;
      const cached = chineseNewsText(item, field)
        ?? (prior?.[field] === original ? chineseNewsText(prior, field) : null);
      if (cached) {
        zh[field] = [original, cached];
        continue;
      }
      const text = field === 'summary' ? original.replace(/\s*The post[\s\S]*$/, '').trim() : original;
      if (!text) continue;
      if (!pending.has(text)) pending.set(text, []);
      pending.get(text).push({ zh, field, original });
    }
    item.zh = zh;
  }
  if (!pending.size) return;

  const texts = [...pending.keys()];
  try {
    const results = await translate(texts);
    if (!Array.isArray(results) || results.length !== texts.length) throw new Error('incomplete translation batch');
    let missing = 0;
    for (const [index, translated] of results.entries()) {
      if (typeof translated !== 'string' || !/\p{Script=Han}/u.test(translated)) {
        missing++;
        continue;
      }
      for (const { zh, field, original } of pending.get(texts[index])) {
        zh[field] = [original, translated.trim()];
      }
    }
    if (missing) log(`  news: ${missing} fields await translation; retry on next refresh`);
  } catch (error) {
    log(`  news: ${error.message}; retry translation on next refresh`);
  }
}
