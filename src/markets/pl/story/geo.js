/* Poland's schematic geography for the story drawings.

   ONE source, one convention. The outline is the Eurostat GISCO country
   boundary this market already ships (pl-boundary-2024.json, CNTR_RG_10M_2024),
   projected once with d3-geo's Mercator into a 600 x 420 drawing box and
   reduced to 78 vertices. It is a country outline at drawing resolution, not a
   survey: no plant, connection point, city or site is placed anywhere, and no
   coordinate below is a location. Every mark the scenes put on it is abstract
   and sits at a drawing position, never at a geographic one.

   Regenerating it: read the boundary file, geoMercator().fitExtent([[10,10],
   [590,410]], collection), keep every third vertex of the largest ring and
   round to one decimal. Nothing here is hand-drawn. */
export const FRAME = [600, 420];

/** The country outline, as one closed path in drawing units. */
export const POLAND = 'M305.8,50.3 L328.9,38.4 L350.4,41.4 L455.1,44.2 L466.7,48.1 L484.3,59.6 '
  + 'L485.6,73.5 L498.2,123.5 L503.5,142.8 L502.6,161.9 L482.1,174.8 L482.2,198.3 L492.4,211.4 '
  + 'L490.6,224.9 L490,244.3 L493.8,260 L502.9,276.1 L505.6,292.4 L506.4,317.2 L487,328.5 '
  + 'L457.5,363.8 L451.2,379.1 L458.7,404.1 L439.8,403.5 L415.2,385.4 L405.9,381.8 '
  + 'L391.6,380.7 L382,383.6 L371.9,387.9 L361,385.4 L350.4,387.2 L340.5,398.1 L327.4,396.3 '
  + 'L322.2,383.6 L305.6,376.4 L293.2,377.5 L279.1,362.7 L269.5,349.1 L258.1,345.3 '
  + 'L254.1,344.5 L241,338.7 L242.4,330.6 L236.6,327.2 L206.5,315.4 L211.1,329.9 L192.7,335.7 '
  + 'L177.1,316.9 L182.4,302 L172.7,301.3 L162.6,300.3 L145.2,292 L137.5,280.9 L125.2,279.1 '
  + 'L118.4,287.4 L127.1,259.8 L114.9,242.8 L115.3,233.6 L113.9,210.8 L113.3,194.1 '
  + 'L106.2,183.6 L107.5,167.7 L89.7,153.2 L98.1,137.6 L101.1,118.2 L97,89.7 L109.3,95.8 '
  + 'L107.1,81 L100.1,81.8 L92.7,80 L114,69.5 L115.7,76.3 L142.3,59 L190.1,31.9 L221,17.4 '
  + 'L266.2,10 L272.3,20.5 L276.8,37.2 L292.8,44.5 Z';

/**
 * Drawing positions for the schematic marks, in the same box. These are
 * layout slots inside the outline, chosen so the drawing reads at both widths;
 * they do not name or locate anything.
 */
export const SLOTS = {
  units: [[196, 150], [238, 196], [286, 150], [332, 208], [378, 154], [420, 220], [258, 268], [344, 286]],
  loads: [[430, 120], [462, 176], [404, 254]],
  wires: [
    [[150, 210], [250, 168], [352, 200], [452, 150]],
    [[205, 300], [280, 244], [352, 262], [430, 214]],
    [[300, 120], [330, 178], [372, 232], [416, 290]],
  ],
  hub: [300, 214],
  future: [[300, 300], [352, 320], [404, 300]],
};
