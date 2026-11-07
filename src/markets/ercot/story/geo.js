/* ASSET-TX-OUTLINE for the ERCOT story (ercot-00, ercot-01, ercot-12).

   Outline: the platform's existing Texas feature, src/markets/ercot/tx-boundary.json
   (Natural Earth 1:50m admin-1, public domain), sha256
   a30315c0c0b2e2ac3299c91a90e94a2ccd1c785ed8dab27f7b7da731ec7995e9.
   Treatment: every ring above eight square units; equirectangular projection
   x = (lon + 107.2) x 46 x cos(31.2 deg), y = (37 - lat) x 46; each ring split
   in two and Douglas-Peucker simplified to 1.2 units; whole units.

   GAP-ERCOT-MAP, approved treatment (analyst, 1 November 2026): the outline
   is Texas, not ERCOT. No ERCOT footprint line and no whole-state ERCOT fill
   is drawn. The network inside is an original schematic: its nodes are not
   sites, its lines are not routes and it carries no flow. The four tie
   symbols stand for the two Southwest Power Pool and two Mexico DC ties in
   the market monitor's 2025 report (§II.H); their positions are schematic. */
export const TX = {
  viewBox: [560, 530],
  outline: 'M500,154L505,158L512,157L518,159L518,230L525,240L527,250L537,268L538,274L536,284L530,296L529,306L531,317L522,331L524,336L515,337L489,350L499,343L489,343L491,338L490,334L487,333L484,337L479,336L480,344L484,351L475,360L474,364L469,370L446,385L431,392L440,385L426,384L423,387L418,381L416,381L420,392L424,393L414,398L410,395L408,405L406,407L404,404L401,407L395,407L396,411L400,410L398,415L395,420L384,421L390,429L384,445L381,446L371,439L374,447L382,449L383,455L379,462L384,484L393,503L395,503L396,508L390,509L387,512L370,504L351,501L332,490L318,485L314,471L305,457L303,435L293,426L279,406L272,399L270,391L254,360L227,332L222,331L205,331L191,328L186,333L180,333L176,338L170,358L159,368L155,368L126,353L106,337L99,322L99,316L87,292L76,285L46,258L41,255L30,241L25,238L21,230L163,230L164,23L283,23L283,111L298,120L307,120L308,117L313,120L315,127L331,131L338,131L344,134L348,131L358,131L359,136L364,139L365,144L368,144L376,138L386,146L394,143L393,147L396,150L404,140L411,145L417,142L417,145L428,151L430,149L443,143L449,144L457,141L459,143L465,144L472,140L491,152L500,154ZM478,361L487,352L489,352L478,361ZM411,407L409,407L411,405L423,398L411,407ZM401,419L405,409L407,408L408,410L401,419ZM387,446L390,436L396,424L399,422L387,446ZM395,499L394,501L391,491L386,468L385,455L386,451L388,469L395,499Z',
  /* Schematic hubs and links (no names, no sites). */
  nodes: { a: [401, 193], b: [464, 331], c: [374, 308], d: [342, 350], e: [201, 235], f: [287, 207], g: [382, 419], h: [370, 492], i: [468, 216] },
  links: [['e', 'f'], ['f', 'a'], ['a', 'i'], ['a', 'c'], ['a', 'b'], ['i', 'b'], ['c', 'd'], ['c', 'b'], ['d', 'g'], ['b', 'g'], ['g', 'h'], ['e', 'd']],
  /* Each tie: [inside end, outside end, the hub it joins, neighbour group]. */
  ties: [
    { at: [315, 133], out: [315, 92], hub: 'f', group: 'spp' },
    { at: [496, 179], out: [531, 152], hub: 'i', group: 'spp' },
    { at: [264, 382], out: [232, 409], hub: 'd', group: 'mexico' },
    { at: [303, 437], out: [271, 465], hub: 'g', group: 'mexico' },
  ],
  labels: { texas: [70, 300], spp: [386, 60], mexico: [130, 440], grid: [250, 335], puct: [280, 515] },
};
