import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import './helpers/pin-design.mjs';
const { japanDigests, japanSections } = await import('./helpers/japan-sections.mjs');
const fixture = JSON.parse(await readFile(new URL('./fixtures/jp-sections-content.json', import.meta.url)));

test('Japan lazy sections preserve every pre-split value, sentence, source and block in both languages and every lens', async () => {
  assert.match(fixture.sourceSha256, /^[0-9a-f]{64}$/);
  for (const language of ['en','zh']) for (const region of ['tokyo','kyushu','hokkaido','compare']){
    const key = language + '/' + region;
    assert.deepEqual(await japanDigests(region, language), fixture.readings[key], key);
    assert.equal(Object.keys(fixture.readings[key]).length, 13, 'twelve routed sections plus the preserved unrouted benchmark');
    assert.ok(Object.values(fixture.readings[key]).reduce((n,s) => n+s.bytes,0) > 120000, 'substantial research is fingerprinted');
  }
  /* A late return to Tokyo must not retain the last language or compare lens. */
  assert.deepEqual(await japanDigests('tokyo','en'), fixture.readings['en/tokyo']);
});

test('Japan regional lazy sections still build distinct region readings', async () => {
  const tokyo = await japanDigests('tokyo','en');
  const kyushu = await japanDigests('kyushu','en');
  const hokkaido = await japanDigests('hokkaido','en');
  for (const section of ['energy','grid','duration']){
    assert.notEqual(tokyo[section].sha, kyushu[section].sha, section + ' Tokyo/Kyushu');
    assert.notEqual(kyushu[section].sha, hokkaido[section].sha, section + ' Kyushu/Hokkaido');
  }
  const chinese = JSON.stringify(await japanSections('compare','zh'));
  assert.match(chinese, /东京/); assert.match(chinese, /九州/); assert.match(chinese, /北海道/);
});
