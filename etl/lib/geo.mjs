/* ---------------------------------------------------------------------------
   Clip fetched geography to the market it is supposed to describe.

   Overpass takes a bounding box, and a bounding box is a rectangle on a planet
   whose markets are not rectangles. Poland's box reaches west to 14.1°E, which
   is Brandenburg: an unclipped query for Polish batteries returns BigBattery
   Lausitz, the Neuhardenberg solar-park BESS and a handful of EnBW units, all of
   them German, and Poland's map would show 599 MW of storage that is not in
   Poland. Great Britain's box contains Ireland and northern France; Germany's
   contains Czechia.

   So every fetched feature is tested against the market's OWN boundary — the
   same GeoJSON the map draws — and anything outside is dropped at ingest. A
   snapshot then contains only what belongs to the market, and no renderer has to
   know that the fetch was rectangular.

   Clipping here rather than in the app is deliberate: a wrong project in a
   published file is a wrong number in the git history, which is this platform's
   audit trail.
   --------------------------------------------------------------------------- */
import { geoContains } from 'd3-geo';

/** Features of a boundary, whether it arrives as a Feature or a collection. */
function featuresOf(boundary){
  if (!boundary) return [];
  if (boundary.type === 'FeatureCollection') return boundary.features || [];
  if (boundary.type === 'Feature') return [boundary];
  // A bare geometry — wrap it so geoContains sees something it understands.
  return [{ type: 'Feature', properties: {}, geometry: boundary }];
}

/**
 * A predicate testing whether a [lon, lat] point falls inside a market.
 *
 * `geoContains` is spherical, so it is correct across the antimeridian and at
 * high latitude — which a planar point-in-polygon would not be for Hokkaido.
 */
export function insideBoundary(boundary){
  const features = featuresOf(boundary);
  if (!features.length){
    throw new Error('insideBoundary: market boundary is empty — refusing to accept every point');
  }
  return (point) => features.some(feature => geoContains(feature, point));
}

/**
 * Drop everything outside the boundary.
 *
 * Lines are kept when ANY vertex is inside: a transmission line that crosses the
 * border is part of both networks it connects, and truncating it at the frontier
 * would draw a line that stops in a field. Points must be strictly inside.
 *
 * @returns {{lines:object[], substations:object[], dropped:{lines:number, substations:number}}}
 */
export function clipGridToMarket({ lines = [], substations = [] }, boundary){
  const inside = insideBoundary(boundary);

  const keptLines = lines.filter(line => line.path?.some(inside));
  const keptSubstations = substations.filter(s => inside(s.coord));

  return {
    lines: keptLines,
    substations: keptSubstations,
    dropped: {
      lines: lines.length - keptLines.length,
      substations: substations.length - keptSubstations.length,
    },
  };
}

/** Drop projects outside the market. A project has one position and must be in. */
export function clipProjectsToMarket(projects, boundary){
  const inside = insideBoundary(boundary);
  const kept = projects.filter(p => Number.isFinite(p.lon) && Number.isFinite(p.lat)
    && inside([p.lon, p.lat]));
  return { projects: kept, dropped: projects.length - kept.length };
}
