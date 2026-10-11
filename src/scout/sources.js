/* ---------------------------------------------------------------------------
   THE PAGES THE AGENT MAY READ, for each scout market.

   The scout pass has no search and follows no links. It fetches the pages
   listed here and nothing else, so this list is what a card can know, and it
   is the analyst's: it lives in src/, which no machine author can write, and
   it is named in METHODOLOGY_SURFACES.

   A PAGE IS ADMITTED WHEN FOUR THINGS HOLD (phase 4 plan §4.2):

     1. it is public, with no login and no paywall;
     2. the site's robots.txt does not disallow the path — checked by the
        fetcher at run time, not recorded here;
     3. a person has read the publisher's terms page. `terms` records its
        address, the date it was read and what it was found to say:
          permits   reuse with attribution is allowed
          silent    no terms are stated; admitted on the personal-study
                    posture, and marked
          refused   reuse is prohibited; never admitted
          unread    a candidate nobody has checked yet; not admitted
     4. what is kept from it is a quotation of at most 300 characters, the
        publisher, the link and a hash. Never the page.

   The pass still PROBES an unread candidate — a fetch and a status, no text
   handed to the model — so the report says which pages CI can reach before
   anybody spends time on their terms.

   Each entry was opened on the date in `opened`, or carries null there and is
   a publisher's address nobody has confirmed. Licences are re-checked per
   source as each card is written (revision plan §9 row 12), and the whole
   list holds only while the purpose is personal study.

   WHAT THE FIRST DRY RUNS FOUND, 2026-10-11. Ten of the twelve pages below
   were fetched from CI. TenneT's and the Coordinador's refused with HTTP 403,
   as they had refused a fetch from a desk; each needs a different page or a
   different publisher before its terms are worth reading. And the pages that
   were read are mostly home pages and section indexes: across five markets
   they supported one grade. A card is only as good as this list, and the
   list wants pages that state a process, a figure or a date.

   Keys are what a grade's `evidence` and a trigger's `source` name.
   --------------------------------------------------------------------------- */

const OPENED = '2026-10-11';

const official = (publisher, url, opened, terms) => ({ publisher, url, authority: 'official', opened, terms });

const unread = { url: null, readOn: null, status: 'unread' };

export const SCOUT_SOURCES = {
  se: {
    'svk-ancillary': official('Svenska kraftnät', 'https://www.svk.se/en/stakeholders-portal/electricity-market/provision-of-ancillary-services/', OPENED,
      { url: 'https://www.svk.se/en/about-the-website/', readOn: OPENED, status: 'silent' }),
  },
  ee: {
    'elering-home': official('Elering', 'https://elering.ee/en', null, unread),
  },
  lt: {
    'litgrid-storage-connection': official('Litgrid', 'https://www.litgrid.eu/paslaugos/prijungimo-paslaugos/elektriniu-ir-energijos-kaupimo-irenginiu-vystytojams', null, unread),
    'litgrid-balancing': official('Litgrid', 'https://www.litgrid.eu/paslaugos/sistemos-paslaugos/balansavimo-paslaugos', null, unread),
  },
  es: {
    'ree-storage': official('Red Eléctrica', 'https://www.ree.es/en/ecological-transition/storage', OPENED,
      { url: 'https://www.ree.es/en/legal-notice-privacy-policy', readOn: OPENED, status: 'permits' }),
    'ree-access': official('Red Eléctrica', 'https://www.ree.es/en/operation/system-development/access-conection-grid', null,
      { url: 'https://www.ree.es/en/legal-notice-privacy-policy', readOn: OPENED, status: 'permits' }),
  },
  nl: {
    'tennet-home': official('TenneT', 'https://www.tennet.eu/', null, unread),
  },
  bg: {
    'eso-home': official('Electricity System Operator (ESO EAD)', 'https://www.eso.bg/?en', OPENED,
      { url: 'https://www.eso.bg/?en', readOn: OPENED, status: 'silent' }),
  },
  cl: {
    'cne-home': official('Comisión Nacional de Energía', 'https://www.cne.cl/', OPENED,
      { url: 'https://www.cne.cl/', readOn: OPENED, status: 'silent' }),
    'coordinador-home': official('Coordinador Eléctrico Nacional', 'https://www.coordinador.cl/', null, unread),
  },
  ca_on: {
    'ieso-lt2': official('Independent Electricity System Operator', 'https://www.ieso.ca/en/Sector-Participants/Resource-Acquisition-and-Contracts/Long-Term-2-RFP', OPENED,
      { url: 'https://www.ieso.ca/en/Terms-of-Use', readOn: OPENED, status: 'permits' }),
  },
  sa: {
    'sppc-home': official('Saudi Power Procurement Company', 'https://www.sppc.com.sa/', null, unread),
  },
};

/** One market's source list, keyed. An empty object when it has none. */
export const scoutSources = (id) => SCOUT_SOURCES[id] || {};
