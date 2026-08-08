/* ---------------------------------------------------------------------------
   Ring winding for spherical projection.

   d3-geo reads a spherical polygon with its interior to the RIGHT of the ring —
   the opposite of the RFC 7946 winding that most published GeoJSON uses. A ring
   pointing the wrong way is not drawn wrongly, it is drawn as its own
   complement: the polygon becomes everything except itself and floods the globe.

   The boundary files on this platform do not agree on a convention. ABS ships
   RFC 7946; the generated market boundaries and the Japan zone file already ship
   d3 winding. So each ring is MEASURED and reversed only when it needs to be.
   Reversing unconditionally fixes one file and breaks the other, which is
   exactly what happened when the US and Japan market sectors were added.

   Lives in its own module, free of any DOM import, so the invariant it exists to
   protect can be asserted in a test — see tests/home-globe.test.js.
   --------------------------------------------------------------------------- */

/** Shoelace sum. Positive when the ring runs clockwise in lon/lat. */
export function ringArea(ring){
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++){
    sum += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
  }
  return sum;
}

function orient(ring, clockwise){
  return (ringArea(ring) > 0) === clockwise ? ring : [...ring].reverse();
}

/**
 * A feature wound the way d3-geo expects: outer rings clockwise, holes
 * counter-clockwise. Already-correct rings are returned untouched.
 *
 * Anything that is not a Polygon or MultiPolygon passes through unchanged.
 */
export function d3Winding(feature){
  const geometry = feature?.geometry;
  if (!geometry || (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon')) return feature;
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  // The first ring of each polygon is its outer boundary; the rest are holes.
  const wound = polygons.map(rings => rings.map((ring, index) => orient(ring, index === 0)));
  return {
    ...feature,
    geometry:{
      ...geometry,
      coordinates:geometry.type === 'Polygon' ? wound[0] : wound,
    },
  };
}
