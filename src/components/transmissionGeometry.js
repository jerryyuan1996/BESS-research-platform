/* ---------------------------------------------------------------------------
   TRANSMISSION GEOMETRY, JOINED.

   A market's network arrives as thousands of short polylines. Drawn one <path>
   each — which is what the grid map used to do — Great Britain's backbone band
   alone put 7,771 nodes into every style pass, and its detail band added another
   6,272. None of those nodes carries a handler, a label or a hover: the
   stylesheet sets `pointer-events:none` on the whole class. Their only product
   is cost.

   So segments are joined here, off the DOM, into one path per band class and
   overhead/underground pair, plus one more for the substation squares. The
   geometry is unchanged — a path data string is a sequence of subpaths and their
   union is the same drawing — and the subpath count is returned, so a test can
   hold it against the number of lines in the source file.

   Pure by design: `project` is injected, nothing here reads the DOM, and the
   cache is a WeakMap keyed by the line object. That is what makes the merge
   testable in node (tests/grid-map-rendering.test.js) and what lets the
   component reuse projected geometry across bands and re-renders.
   --------------------------------------------------------------------------- */

/** Project one line to path data, remembering the answer. An empty string
 *  means "cannot be drawn": a missing point, a non-finite projection, or fewer
 *  than two points. */
export function linePathData(line, project, cache){
  const cached = cache.get(line);
  if (cached !== undefined) return cached;
  const points = Array.isArray(line.path) ? line.path : null;
  let d = '';
  if (points && points.length > 1){
    const parts = new Array(points.length);
    let complete = true;
    for (let index = 0; index < points.length; index += 1){
      const xy = project(points[index]);
      if (!xy || !Number.isFinite(xy[0]) || !Number.isFinite(xy[1])){ complete = false; break; }
      parts[index] = (index ? 'L' : 'M') + xy[0] + ' ' + xy[1];
    }
    if (complete) d = parts.join(' ');
  }
  cache.set(line, d);
  return d;
}

/**
 * Join one band's segments and substations into the smallest set of paths that
 * draws the same thing.
 *
 * @param {object[]} lines        transmission segments, each { path, kv, underground }
 * @param {object[]} substations  each { coord, kv }
 * @param {number} backboneFloor  the kV at and above which a segment is backbone
 * @param {(p:number[])=>number[]|null} project  lon/lat → map coordinates
 * @param {WeakMap} [cache]       projected path data, reused across bands
 * @returns {{segments:object[], substations:object[], subpaths:number}}
 */
export function transmissionSegments({
  lines = [], substations = [], backboneFloor = 0, project, cache = new WeakMap(),
}){
  const segments = new Map();
  for (const line of lines){
    const d = linePathData(line, project, cache);
    if (!d) continue;
    const bandClass = line.kv >= backboneFloor ? 'bulk' : 'detail';
    const style = `${bandClass}:${line.underground ? 'underground' : 'overhead'}`;
    let entry = segments.get(style);
    if (!entry){
      entry = { bandClass, underground:Boolean(line.underground), parts:[] };
      segments.set(style, entry);
    }
    entry.parts.push(d);
  }

  /* 763 separate <rect>s in Great Britain for a symbol that never moves and
     never reacts. One path of squares costs one node. */
  const squares = new Map();
  for (const substation of substations){
    const point = project(substation.coord);
    if (!point) continue;
    const bandClass = substation.kv >= backboneFloor ? 'bulk' : 'detail';
    const square = `M${point[0] - 2.6} ${point[1] - 2.6}h5.2v5.2h-5.2z`;
    squares.set(bandClass, (squares.get(bandClass) || '') + square);
  }

  return {
    segments:[...segments.values()].map(entry => ({
      bandClass:entry.bandClass,
      underground:entry.underground,
      d:entry.parts.join(' '),
      subpaths:entry.parts.length,
    })),
    substations:[...squares.entries()].map(([bandClass, d]) => ({ bandClass, d })),
    subpaths:[...segments.values()].reduce((total, entry) => total + entry.parts.length, 0),
  };
}
