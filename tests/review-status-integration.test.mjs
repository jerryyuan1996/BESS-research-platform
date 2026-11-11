import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { briefingFromDisk } from '../src/briefing/disk.js';
import { homeProjection } from '../src/briefing/model.js';
import { renderDigest } from '../src/briefing/markdown.js';
import { statusForMarket } from '../src/governance/review.js';

test('observations advance independently of the approved view and analysed snapshot', () => {
  const changelog = [{market:'wa',id:'approval-one',at:'2026-11-01T00:00:00Z',author:{kind:'analyst'}}];
  const reviews = [{markets:['wa'],asOf:'2026-11-02T00:00:00Z',checked:{at:'2026-11-02T00:00:00Z'},dataCommit:'a'.repeat(40),status:'deferred'}];
  const before = statusForMarket({market:'wa',changelog,reviews,summaries:{prices:{marketId:'wa',fetchedAt:'2026-11-02T01:00:00Z'}}});
  const after = statusForMarket({market:'wa',changelog,reviews,summaries:{prices:{marketId:'wa',fetchedAt:'2026-11-03T01:00:00Z'}}});
  assert.notEqual(before.latestObservation,after.latestObservation);
  assert.equal(after.approvedStrategyVersion,'approval-one');
  assert.equal(after.lastAnalysedSnapshot,before.lastAnalysedSnapshot);
  assert.equal(after.lastApprovedChange,before.lastApprovedChange);
  assert.equal(after.status,'deferred');
});

test('desk and weekly brief share status, home carries only the approved date', async () => {
  const b = await briefingFromDisk({now:new Date('2026-11-11T00:00:00Z')});
  assert.ok(b.reviewStatus.length);
  const home = homeProjection(b);
  assert.equal(home.reviewStatus,undefined);
  for (const r of b.reviewStatus) assert.equal(home.lastApproved[r.market],r.lastApprovedChange);
  const digest = renderDigest(b);
  assert.match(digest,/Observation and strategy review/);
  assert.match(digest,/数据观察与策略复核/);
  const market = await readFile(new URL('../src/experience/marketPage.js',import.meta.url),'utf8');
  assert.match(market,/View last approved/);
  assert.match(market,/HOME_BRIEFING\.lastApproved/);
  const desk = await readFile(new URL('../src/desk/deskPage.js',import.meta.url),'utf8');
  assert.match(desk,/b\.reviewStatus/);
  assert.doesNotMatch(desk,/A rule fires on the next refresh/);
});
