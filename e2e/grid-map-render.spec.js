import { test, expect } from '@playwright/test';

/* ---------------------------------------------------------------------------
   THE TRANSMISSION LAYER, AS A READER ACTUALLY MEETS IT.

   Phase A2 stopped emptying the layer and re-projecting every line whenever a
   voltage band arrived, and joined the segments into one path per band class.
   Both changes are invisible when they work and invisible when they fail: a
   merged path that lost a segment draws a network with a gap in it, and a layer
   that rebuilds itself draws the right picture while blocking the main thread.

   So these assertions are about counts and mutations rather than about pixels.
   The counts come from each market's own manifest — the file declares how many
   lines a band holds, and the drawing must contain exactly that many subpaths —
   which means a refreshed dataset is still checked, without this file hard-coding
   a number that a data run would invalidate.
   --------------------------------------------------------------------------- */

// A joined path can stay unchanged while an entire voltage band is in flight.
// Observe completion from before navigation; path-node stability alone cannot
// establish that every requested response has reached the renderer.
const pendingGridRequests = new WeakMap();
test.beforeEach(async ({ page }) => {
  const pending = new Set(); pendingGridRequests.set(page, pending);
  page.on('request', request => {
    if (new URL(request.url()).pathname.startsWith('/data/grid/')) pending.add(request);
  });
  page.on('requestfinished', request => pending.delete(request));
  page.on('requestfailed', request => pending.delete(request));
});

const MARKETS = [
  { slug:'great-britain', id:'gb', manifest:'gb-transmission.manifest.json' },
  { slug:'germany', id:'de', manifest:'de-transmission.manifest.json' },
  { slug:'italy', id:'it', manifest:'it-transmission.manifest.json' },
  { slug:'western-australia', id:'wa', manifest:'wa-transmission.manifest.json' },
  /* Romania is the limited-data market: 220 kV and up only, a tenth of Italy's
     payload. It is here so the delivery path is exercised on a map small enough
     that a bug cannot hide behind volume. */
  { slug:'romania', id:'ro', manifest:'ro-transmission.manifest.json' },
];

const mapPath = (slug) => `/markets/${slug}/grid`;

/** What the layer currently holds, per band group. */
const readLayer = () => {
  const groups = [...document.querySelectorAll('.geo-band')];
  return {
    groups: groups.map(group => ({
      band: group.dataset.bandGroup,
      paths: group.querySelectorAll('.geo-transmission-line').length,
      subpaths: [...group.querySelectorAll('.geo-transmission-line')]
        .reduce((total, path) => total + (path.getAttribute('d').match(/M/g) || []).length, 0),
      substations: [...group.querySelectorAll('.geo-substation')]
        .reduce((total, path) => total + (path.getAttribute('d').match(/M/g) || []).length, 0),
    })),
    totalNodes: document.querySelectorAll('.geo-transmission-layer *').length,
    svgNodes: document.querySelectorAll('.geo-grid-map svg *').length,
    zoom: Number(document.querySelector('.geo-grid-map svg').getAttribute('data-zoom')),
  };
};

/** Wait until the layer stops changing: no band is mid-arrival. */
async function settleLayer(page){
  let previous = -1;
  await expect.poll(async () => {
    const now = await page.evaluate(
      () => document.querySelectorAll('.geo-transmission-layer [d]').length);
    const stable = now === previous && pendingGridRequests.get(page).size === 0;
    previous = now;
    return stable;
  }, { timeout:25000, intervals:[350] }).toBe(true);
}

/** Zoom past the detail threshold and let the bands that follows land. */
async function zoomIntoDetail(page){
  const zoomIn = page.locator('.geo-zoom-btn').nth(1);
  for (let i = 0; i < 3; i += 1) await zoomIn.click();
  await expect.poll(async () => (await page.evaluate(readLayer)).zoom, { timeout:15000 })
    .toBeGreaterThan(2);
  await settleLayer(page);
}

test('every market draws exactly the segments its manifest declares', async ({ page, request }) => {
  for (const market of MARKETS){
    const manifest = await (await request.get(`/data/grid/${market.manifest}`)).json();
    await page.goto(mapPath(market.slug));
    await expect(page.locator('.geo-grid-map svg')).toBeVisible();
    await expect(page.locator('.geo-band').first()).toBeAttached();
    await expect.poll(async () => (await page.evaluate(readLayer)).groups
      .some(group => group.subpaths > 0), { timeout:20000 }).toBe(true);

    const backboneOnly = await page.evaluate(readLayer);
    for (const band of manifest.bands){
      const drawn = backboneOnly.groups.find(group => group.band === band.band);
      expect(drawn, `${market.id}: band ${band.band} must have a group`).toBeTruthy();
      if (!band.backbone){
        expect(drawn.subpaths, `${market.id}/${band.band}: not requested until the reader zooms`).toBe(0);
        continue;
      }
      expect(drawn.subpaths, `${market.id}/${band.band}: every declared line must reach the map`)
        .toBe(band.lines);
      /* The reason this work exists: thousands of segments, a handful of nodes. */
      expect(drawn.paths, `${market.id}/${band.band}: segments must be joined`).toBeLessThanOrEqual(4);
    }
    /* Band groups are declared in manifest order, never in arrival order. */
    expect(backboneOnly.groups.map(group => group.band))
      .toEqual(manifest.bands.map(band => band.band));

    await zoomIntoDetail(page);
    const detailed = await page.evaluate(readLayer);
    const declared = manifest.bands.reduce((total, band) => total + band.lines, 0);
    const drawnSubpaths = detailed.groups.reduce((total, group) => total + group.subpaths, 0);
    expect(drawnSubpaths, `${market.id}: the full network after zooming`).toBe(declared);
    /* Still a handful of nodes for the whole national network. */
    expect(detailed.totalNodes, `${market.id}: node count after the detail band`).toBeLessThan(40);
  }
});

test('a band is fetched when it is wanted and never before', async ({ page }) => {
  const requested = [];
  page.on('request', request => {
    const match = /\/data\/grid\/(.+\.json)$/.exec(request.url());
    if (match) requested.push(match[1]);
  });
  await page.goto(mapPath('great-britain'));
  await expect(page.locator('.geo-band').first()).toBeAttached();
  await expect.poll(async () => (await page.evaluate(readLayer)).groups
    .some(group => group.subpaths > 0), { timeout:20000 }).toBe(true);

  expect(requested, 'the manifest and the backbone, nothing else').toEqual([
    'gb-transmission.manifest.json',
    'gb-transmission-275plus.json',
  ]);

  await zoomIntoDetail(page);
  expect(requested).toContain('gb-transmission-132-274.json');

  /* And it is on screen once it has been asked for: the stylesheet hides the
     detail class only at the fitted extent. Polled, because the request is
     recorded when it is sent and the band is drawn after its response: read
     once, the check raced the draw and failed now and then on a slow host. */
  await expect.poll(() => page.evaluate(() => {
    const path = document.querySelector('.geo-transmission-line[data-band="detail"]');
    return path ? getComputedStyle(path).display !== 'none' : false;
  }), { message: 'the detail band is shown above the zoom threshold', timeout: 10000 }).toBe(true);
});

test('repeated zooming never duplicates or rebuilding the layer', async ({ page }) => {
  await page.goto(mapPath('great-britain'));
  await expect(page.locator('.geo-transmission-line').first()).toBeVisible();
  await zoomIntoDetail(page);

  /* Count what leaves the layer from here on. A rebuild shows up here as a
     non-zero number long before it shows up as a duplicated picture. */
  await page.evaluate(() => {
    window.__removed = 0;
    window.__added = 0;
    const layer = document.querySelector('.geo-transmission-layer');
    new MutationObserver((records) => {
      for (const record of records){
        window.__removed += record.removedNodes.length;
        window.__added += record.addedNodes.length;
      }
    }).observe(layer, { childList:true, subtree:true });
  });

  const before = await page.evaluate(readLayer);
  const zoomIn = page.locator('.geo-zoom-btn').nth(1);
  const zoomOut = page.locator('.geo-zoom-btn').nth(0);
  /* Out and back, three times. The map returns to the zoom it started at, and
     the layer must come back unchanged rather than redrawn. */
  for (let round = 0; round < 3; round += 1){
    await zoomIn.click(); await zoomIn.click();
    await zoomOut.click(); await zoomOut.click();
  }
  await expect.poll(async () => (await page.evaluate(readLayer)).zoom).toBe(before.zoom);

  const after = await page.evaluate(readLayer);
  expect(after.groups.reduce((total, group) => total + group.subpaths, 0))
    .toBe(before.groups.reduce((total, group) => total + group.subpaths, 0));
  expect(after.groups.map(group => group.band)).toEqual(before.groups.map(group => group.band));
  const mutations = await page.evaluate(() => ({ removed:window.__removed, added:window.__added }));
  expect(mutations.removed, 'nothing may be removed from a drawn layer').toBe(0);
  expect(mutations.added, 'and nothing added a second time').toBe(0);
});

test('selecting a marker does not rebuild the geometry it sits on', async ({ page }) => {
  await page.goto(mapPath('western-australia'));
  const marker = page.locator('.geo-point-layer .geo-marker').first();
  await expect(marker).toBeVisible();
  /* The page scrolls its own section into view shortly after it renders, which
     moves the map. A click during that is a click on a moving target. */
  await page.waitForTimeout(1200);
  /* The page scrolls its own section into view shortly after it renders, which
     moves the map. A click during that is a click on a moving target. */
  await page.waitForTimeout(1200);

  await page.evaluate(() => {
    window.__pointRemovals = 0;
    window.__transmissionRemovals = 0;
    const watch = (selector, key) => {
      const node = document.querySelector(selector);
      new MutationObserver((records) => {
        for (const record of records) window[key] += record.removedNodes.length;
      }).observe(node, { childList:true });
    };
    watch('.geo-point-layer', '__pointRemovals');
    watch('.geo-transmission-layer', '__transmissionRemovals');
  });

  await marker.click({ force:true });
  await expect(page.locator('.geo-map-detail h4')).toBeVisible();
  /* Every selectable carries the class; the one chosen is the one that has it. */
  await expect.poll(async () => page.locator('.geo-marker.selected').count()).toBe(1);

  const counts = await page.evaluate(() => ({
    points:window.__pointRemovals, transmission:window.__transmissionRemovals,
    markers:document.querySelectorAll('.geo-point-layer .geo-marker').length,
  }));
  expect(counts.points, 'a selection moves a class, it does not redraw the layer').toBe(0);
  expect(counts.transmission).toBe(0);
});

test('the map keeps its box while a band arrives', async ({ page }) => {
  await page.goto(mapPath('great-britain'));
  await expect(page.locator('.geo-transmission-line').first()).toBeVisible();
  const before = await page.locator('.geo-map-pane').boundingBox();
  await zoomIntoDetail(page);
  const after = await page.locator('.geo-map-pane').boundingBox();
  /* 7,771 subpaths landing inside the pane must not resize the pane: the SVG
     fills a box whose height the layout already decided. */
  expect(Math.abs(after.height - before.height)).toBeLessThanOrEqual(1);
  expect(after.height).toBeGreaterThan(300);
});

test('a map whose network data fails still draws, and says nothing it cannot back', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/data/grid/**', route => route.abort());
  await page.goto(mapPath('great-britain'));

  await expect(page.locator('.geo-grid-map svg')).toBeVisible();
  await expect(page.locator('.geo-country').first()).toBeVisible();
  await expect(page.locator('.geo-point-layer .geo-marker').first()).toBeVisible();
  /* No partial network and no toggle offering a download that failed. */
  await expect(page.locator('.geo-transmission-line')).toHaveCount(0);
  await expect(page.locator('.geo-detail-toggle')).toHaveCount(0);
  expect(errors, 'a missing grid layer is a degraded map, not a broken page').toEqual([]);
});

test('a band that arrives in parts is drawn whole or not at all', async ({ page }) => {
  /* Italy's 132–219 kV class ships as two files. Dropping one must not paint a
     network with half of northern Italy missing: the band is all or nothing. */
  await page.route('**/it-transmission-132-219.part2.json', route => route.abort());
  await page.goto(mapPath('italy'));
  await expect(page.locator('.geo-transmission-line').first()).toBeVisible();
  await zoomIntoDetail(page);

  const layer = await page.evaluate(readLayer);
  const detail = layer.groups.find(group => group.band === '132-219');
  expect(detail, 'the group exists — the band was declared').toBeTruthy();
  expect(detail.subpaths, 'half a band is not drawn').toBe(0);
  /* Everything that did arrive is still there. */
  const backbone = layer.groups.find(group => group.band === '380plus');
  expect(backbone.subpaths).toBeGreaterThan(0);
});

test('the map is usable at 390 px as well as 1440 px', async ({ page }) => {
  await page.goto(mapPath('germany'));
  await expect(page.locator('.geo-grid-map svg')).toBeVisible();
  await expect(page.locator('.geo-zoom-controls')).toBeVisible();
  await zoomIntoDetail(page);
  const overflow = await page.evaluate(() => {
    const shell = document.querySelector('.geo-map-shell');
    return shell.scrollWidth - shell.clientWidth;
  });
  expect(overflow, 'the map must not widen the page').toBeLessThanOrEqual(1);
});

test('a pending detail band cannot be mistaken for a settled drawing', async ({ page, request }) => {
  const manifest = await (await request.get('/data/grid/gb-transmission.manifest.json')).json();
  let release, requested = false, settled = false;
  const held = new Promise(resolve => { release = resolve; });
  await page.route('**/gb-transmission-132-274.json', async route => {
    requested = true; await held; await route.continue();
  });
  try {
    await page.goto(mapPath('great-britain'));
    await expect(page.locator('.geo-transmission-line').first()).toBeVisible();
    const reading = zoomIntoDetail(page).then(() => { settled = true; });
    await expect.poll(() => requested).toBe(true);
    // Several original 350ms stability probes fit while this response is held.
    await page.waitForTimeout(1800);
    expect(settled, 'unchanging path-node counts do not finish an active band request').toBe(false);
    release(); await reading;
    const layer = await page.evaluate(readLayer);
    expect(layer.groups.reduce((n, group) => n + group.subpaths, 0))
      .toBe(manifest.bands.reduce((n, band) => n + band.lines, 0));
  } finally { release(); }
});
