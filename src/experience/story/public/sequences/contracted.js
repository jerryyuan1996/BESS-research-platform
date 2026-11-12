/* ---------------------------------------------------------------------------
   THE SHARED TEMPLATE for capacity and contracted revenue.

   Every route that pays a battery for being available, or under a long-term
   award, passes the same six stages, whatever the market calls them:

     1  physical availability   the plant can do what is asked
     2  accreditation           what it can do is accepted as eligible
     3  award                   an offer clears, or a contract is signed
     4  obligation              what the holder has promised
     5  performance             whether it delivered
     6  payment or penalty      what is settled, and what is taken back

   The drawing for each stage is fixed here, so every market shows the same
   picture for the same stage and a reader who has seen one can read another.
   The payment rail is what the six stages are about: the claim stops at the
   first of its three gates that is shut, so the picture says, at stage 1,
   that being able to deliver earns nothing, and at stage 3, that an award
   pays nothing until the obligation is met.

   A market supplies only words and sources: its own name for each stage, a
   title, a caption and the source ids already in its public content.
   --------------------------------------------------------------------------- */

/** The six stages, in order. */
export const STAGES = ['availability', 'accreditation', 'award', 'obligation', 'performance', 'settlement'];

const waiting = { flow: 'idle', signal: null, soc: 0.8 };
const SHAPE = {
  availability:  { asks: 'response', view: 'storage',   state: { ...waiting, qualified: false, awarded: false, delivers: true } },
  accreditation: { asks: 'value',    view: 'mechanism', state: { ...waiting, qualified: true,  awarded: false, delivers: true } },
  award:         { asks: 'payer',    view: 'mechanism', state: { ...waiting, qualified: true,  awarded: true,  delivers: false } },
  obligation:    { asks: 'payer',    view: 'storage',   state: { ...waiting, qualified: true,  awarded: true,  delivers: false } },
  performance:   { asks: 'limit',    view: 'storage',   state: { flow: 'discharge', signal: 'dispatch', soc: 0.5, qualified: true, awarded: true, delivers: true } },
  settlement:    { asks: 'limit',    view: 'mechanism', state: { flow: 'discharge', signal: null, soc: 0.4, qualified: true, awarded: true, delivers: true } },
};

/**
 * A contracted-revenue sequence in a market's own words.
 *
 * @param {object} spec
 * @param {string} spec.id
 * @param {string[]} spec.home    the chapters it leads: system | storage | mechanism
 * @param {string[]} spec.title   [en, zh]
 * @param {string[][]} spec.gates the market's names for qualified, awarded, performed
 * @param {object} [spec.base]    scenario facts that hold through the sequence
 * @param {object} spec.stages    for each of STAGES: { name, title, text, sources }
 */
export function contracted({ id, home, title, gates, base = {}, stages }){
  return {
    id, home, title, gates, base, family: 'contracted',
    stages: STAGES.map(key => stages[key].name),
    steps: STAGES.map((key, stage) => ({
      id: key, stage, ...SHAPE[key],
      title: stages[key].title, text: stages[key].text, sources: stages[key].sources,
    })),
  };
}
