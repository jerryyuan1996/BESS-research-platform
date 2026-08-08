/* ---------------------------------------------------------------------------
   PROJECT CLUSTERING FOR THE GRID MAP.

   A market map with every battery drawn individually is unreadable in the places
   that matter most — the ones where projects cluster are exactly the constrained
   nodes a reader is looking for. So overlapping projects collapse into one
   marker carrying the count and the summed capacity, and resolve into individual
   projects as the reader zooms in.

   Four rules, and each exists because breaking it would publish a wrong number:

   1. CLUSTER BY DISTANCE IN PROJECTED SPACE, MEASURED IN SCREEN PIXELS.
      Not in degrees: a degree of longitude is 111 km at the equator and 57 km in
      Hokkaido, so a degree-based radius would cluster Japan twice as hard as
      Texas for no reason a reader could see. Screen-space means one rule for
      every market and no per-market tuning.

      And by distance rather than by a fixed grid. A grid is cheaper, but its
      cell boundaries fall in arbitrary places: two projects three pixels apart
      land in different cells whenever a boundary happens to run between them,
      which is precisely the dense case clustering exists to handle. Greedy
      radius absorption has no boundaries to fall foul of. The fleets here are
      hundreds of projects, not millions, so the cost of doing it properly is
      nothing.

   2. NEVER MERGE ACROSS STATUS.
      Operating and under-construction cluster separately. A cluster reading
      "940 MW" that silently mixes what exists with what is being built would
      overstate every market's operating fleet.

   3. NEVER SUM A PARTIAL ENERGY SET.
      GB publishes no MWh at all — the TEC register has no duration field. A
      cluster of ten GB projects must report power and say the energy is
      unpublished, not sum the two projects that happen to have a duration and
      present it as the cluster's energy. `energyMWh` is null unless EVERY member
      has one, and `energyKnown` says how many did.

   4. A CLUSTER OF ONE IS NOT A CLUSTER.
      It renders as the project itself, so a reader never sees "1 project" on a
      map that could simply have shown the project.
   --------------------------------------------------------------------------- */
import { energyMWh, isPlottable, MAPPED_STAGES } from './schema.js';

/** Merge radius in screen pixels. Roughly two marker widths — close enough to
    overlap is close enough to merge. */
export const CLUSTER_RADIUS_PX = 26;

/** Below this zoom nothing is drawn individually; above it, nothing is merged. */
export const CLUSTER_MAX_ZOOM = 8;

const sum = (values) => values.reduce((total, value) => total + value, 0);

/**
 * Group projects into map markers for the current zoom.
 *
 * @param {object[]} projects  canonical project records (src/projects/schema.js)
 * @param {(project:object)=>[number,number]|null} project2d  lon/lat → screen xy
 * @param {object} [options]
 * @param {number} [options.zoom]      current zoom factor, 1 = fitted extent
 * @param {number} [options.radiusPx]  merge radius in screen pixels
 * @returns {object[]} markers, each either {kind:'project'} or {kind:'cluster'}
 */
export function clusterProjects(projects, project2d, options = {}){
  const zoom = Number.isFinite(options.zoom) ? options.zoom : 1;
  const radius = (Number.isFinite(options.radiusPx) ? options.radiusPx : CLUSTER_RADIUS_PX)
    / Math.max(zoom, 0.01);

  /* Only what the map is allowed to draw: a plottable position and a stage that
     has actually been built or is being built. Everything else stays in the
     pipeline table, which is the honest place for a project with no location. */
  const placed = [];
  for (const project of projects){
    if (!isPlottable(project) || !MAPPED_STAGES.includes(project.stage)) continue;
    const xy = project2d(project);
    if (!xy || !Number.isFinite(xy[0]) || !Number.isFinite(xy[1])) continue;
    placed.push({ project, xy });
  }

  const markers = [];
  // Rule 2: each stage is clustered on its own, so the two never share a marker.
  for (const stage of MAPPED_STAGES){
    const inStage = placed.filter(m => m.project.stage === stage);
    if (zoom >= CLUSTER_MAX_ZOOM){
      for (const { project, xy } of inStage){
        markers.push({ kind:'project', project, x:xy[0], y:xy[1], stage });
      }
      continue;
    }
    for (const group of absorb(inStage, radius)){
      // Rule 4.
      if (group.length === 1){
        const { project, xy } = group[0];
        markers.push({ kind:'project', project, x:xy[0], y:xy[1], stage });
      } else {
        markers.push(clusterOf(group));
      }
    }
  }

  /* Larger clusters drawn first so a single project is never hidden behind the
     group it sits next to — the same ordering rule the certainty frontier uses
     for hollow points. */
  return markers.sort((a, b) => (b.count || 1) - (a.count || 1));
}

/**
 * Greedy radius clustering.
 *
 * The largest project seeds each group and absorbs every unassigned project
 * within the radius. Seeding by capacity rather than by input order makes the
 * result deterministic and puts the cluster where the megawatts are — a 500 MW
 * asset with three 10 MW neighbours should anchor the marker, not drift to the
 * midpoint of four dots.
 */
function absorb(members, radius){
  const remaining = [...members].sort((a, b) =>
    (b.project.capacityMW - a.project.capacityMW) || a.project.id.localeCompare(b.project.id));
  const r2 = radius * radius;
  const groups = [];

  while (remaining.length){
    const seed = remaining.shift();
    const group = [seed];
    for (let i = remaining.length - 1; i >= 0; i--){
      const dx = remaining[i].xy[0] - seed.xy[0];
      const dy = remaining[i].xy[1] - seed.xy[1];
      if (dx * dx + dy * dy <= r2) group.push(...remaining.splice(i, 1));
    }
    groups.push(group);
  }
  return groups;
}

function clusterOf(members){
  const projects = members.map(m => m.project);
  const powers = projects.map(p => p.capacityMW);
  const energies = projects.map(energyMWh);
  const known = energies.filter(v => v != null);

  return {
    kind: 'cluster',
    stage: projects[0].stage,
    count: projects.length,
    powerMW: sum(powers),
    /* Rule 3: all or nothing. A partial sum is a smaller number that looks like
       a complete one, which is the worst of both. */
    energyMWh: known.length === projects.length ? sum(known) : null,
    energyKnown: known.length,
    // Centroid of the members, so the marker sits on the fleet rather than on a cell corner.
    x: sum(members.map(m => m.xy[0])) / members.length,
    y: sum(members.map(m => m.xy[1])) / members.length,
    projects,
  };
}

/**
 * The label a cluster carries: count, power, and energy where every member
 * publishes one.
 *
 * @returns {[string,string]} bilingual
 */
export function clusterLabel(cluster){
  const mw = Math.round(cluster.powerMW).toLocaleString('en-US');
  const n = cluster.count;
  if (cluster.energyMWh != null){
    const mwh = Math.round(cluster.energyMWh).toLocaleString('en-US');
    return [
      `${n} projects · ${mw} MW / ${mwh} MWh`,
      `${n}个项目 · ${mw} MW / ${mwh} MWh`,
    ];
  }
  /* Said plainly rather than left blank: a reader who sees no MWh should know
     the source does not publish it, not wonder whether the batteries have no
     energy rating. */
  const missing = cluster.count - cluster.energyKnown;
  return [
    `${n} projects · ${mw} MW · energy not published for ${missing} of ${n}`,
    `${n}个项目 · ${mw} MW · 其中${missing}/${n}未公布能量容量`,
  ];
}

/** Totals for a market's drawable fleet, split by stage. Feeds the map caption
    and the pipeline section header from one calculation. */
export function fleetTotals(projects){
  const out = {};
  for (const stage of MAPPED_STAGES){
    const inStage = projects.filter(p => p.stage === stage);
    const energies = inStage.map(energyMWh);
    const known = energies.filter(v => v != null);
    out[stage] = {
      count: inStage.length,
      powerMW: sum(inStage.map(p => p.capacityMW)),
      energyMWh: inStage.length && known.length === inStage.length ? sum(known) : null,
      energyKnown: known.length,
      plottable: inStage.filter(isPlottable).length,
    };
  }
  return out;
}
