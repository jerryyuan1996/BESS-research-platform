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
                    posture, and marked. A bare copyright line or "all rights
                    reserved" with no terms page behind it counts as this:
                    the analyst's ruling of 2026-10-11
          refused   reuse is prohibited; never admitted, and not listed
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

   THE LIST AS APPROVED ON 2026-10-11. The analyst approved sixteen more pages
   that day, every one an official body's. Fifteen are below. The sixteenth,
   the Saudi Ministry of Investment's questions page, is not: its terms, read
   afterwards, prohibit copying or reproducing its content to the public
   without written approval, which is `refused`, and a card is public. TenneT's
   and the Coordinador's home pages were dropped, having refused every fetch.
   Saudi Arabia therefore still has no admitted page.

   A page with `opened: null` was found by search and has not been read by a
   person. Its publisher's terms are known, so it is admitted, and the first
   dry pass over it is where its content is first seen.

   Keys are what a grade's `evidence` and a trigger's `source` name.
   --------------------------------------------------------------------------- */

const OPENED = '2026-10-11';

const page = (authority) => (publisher, url, opened, terms) => ({ publisher, url, authority, opened, terms });
const official = page('official');

const unread = { url: null, readOn: null, status: 'unread' };

/* What each publisher's terms were found to say, once per publisher. The
   address is the page that was read; where a site states no terms at all it
   is the page whose footer was checked. */
const TERMS = {
  svk:        { url: 'https://www.svk.se/en/about-the-website/', readOn: OPENED, status: 'silent' },
  isp:        { url: 'https://www.isp.se/eng/foreign-direct-investment/description-of-the-act', readOn: OPENED, status: 'silent' },
  elering:    { url: 'https://www.elering.ee/en/connecting-electricity-network', readOn: OPENED, status: 'silent' },
  ttja:       { url: 'https://ttja.ee/en/business-client/entrepreneurship/foreign-direct-investment-screening', readOn: OPENED, status: 'silent' },
  litgrid:    { url: 'https://www.litgrid.eu/en/power-system/eu-network-codes/connection-codes-and-requirements', readOn: OPENED, status: 'silent' },
  ree:        { url: 'https://www.ree.es/en/legal-notice-privacy-policy', readOn: OPENED, status: 'permits' },
  comercio:   { url: 'https://comercio.gob.es/es-es/Paginas/Aviso_Legal.aspx', readOn: OPENED, status: 'permits' },
  acm:        { url: 'https://www.acm.nl/en/about-site', readOn: OPENED, status: 'permits' },
  bti:        { url: 'https://www.bureautoetsinginvesteringen.nl/service/copyright', readOn: OPENED, status: 'permits' },
  eso:        { url: 'https://www.eso.bg/?en', readOn: OPENED, status: 'silent' },
  investbg:   { url: 'https://investbg.government.bg/fdi-screening/', readOn: OPENED, status: 'silent' },
  cne:        { url: 'https://www.cne.cl/', readOn: OPENED, status: 'silent' },
  investchile: { url: 'https://www.investchile.gob.cl/legal-notice/', readOn: OPENED, status: 'silent' },
  ieso:       { url: 'https://www.ieso.ca/en/Terms-of-Use', readOn: OPENED, status: 'permits' },
  canada:     { url: 'https://www.canada.ca/en/transparency/terms.html', readOn: OPENED, status: 'permits' },
};

export const SCOUT_SOURCES = {
  se: {
    'svk-ancillary': official('Svenska kraftnät', 'https://www.svk.se/en/stakeholders-portal/electricity-market/provision-of-ancillary-services/', OPENED, TERMS.svk),
    'svk-connecting': official('Svenska kraftnät', 'https://www.svk.se/en/stakeholders-portal/electricity-market/connecting-to-the-grid/', OPENED, TERMS.svk),
    'isp-fdi-act': official('Inspectorate of Strategic Products', 'https://www.isp.se/eng/foreign-direct-investment/description-of-the-act', OPENED, TERMS.isp),
    'isp-fdi-process': official('Inspectorate of Strategic Products', 'https://www.isp.se/eng/foreign-direct-investment/the-case-management-process', null, TERMS.isp),
  },
  ee: {
    'elering-connecting': official('Elering', 'https://www.elering.ee/en/connecting-electricity-network', OPENED, TERMS.elering),
    'ttja-fdi': official('Consumer Protection and Technical Regulatory Authority', 'https://ttja.ee/en/business-client/entrepreneurship/foreign-direct-investment-screening', OPENED, TERMS.ttja),
  },
  lt: {
    'litgrid-connection-codes': official('Litgrid', 'https://www.litgrid.eu/en/power-system/eu-network-codes/connection-codes-and-requirements', OPENED, TERMS.litgrid),
    'litgrid-storage-connection': official('Litgrid', 'https://www.litgrid.eu/paslaugos/prijungimo-paslaugos/elektriniu-ir-energijos-kaupimo-irenginiu-vystytojams', null, TERMS.litgrid),
    'litgrid-balancing': official('Litgrid', 'https://www.litgrid.eu/paslaugos/sistemos-paslaugos/balansavimo-paslaugos', null, TERMS.litgrid),
  },
  es: {
    'ree-storage': official('Red Eléctrica', 'https://www.ree.es/en/ecological-transition/storage', OPENED, TERMS.ree),
    'ree-access': official('Red Eléctrica', 'https://www.ree.es/en/operation/system-development/access-conection-grid', null, TERMS.ree),
    'ree-demand-capacity': official('Red Eléctrica', 'https://www.ree.es/en/press-office/news/press-release/2026/02/red-elctrica-publishes-demand-access-capacities-for-the-transmission-grid', null, TERMS.ree),
    'comercio-fdi': official('Ministerio de Economía, Comercio y Empresa', 'https://comercio.gob.es/es-es/inversiones_exteriores/paginas/control-inversiones.aspx', OPENED, TERMS.comercio),
  },
  nl: {
    'acm-flexible-contracts': official('Authority for Consumers and Markets', 'https://www.acm.nl/en/publications/acm-and-system-operators-make-binding-arrangements-offering-flexible-contracts-use-congestion-management-and-increased-insight-grid-utilization', OPENED, TERMS.acm),
    'bti-energy': official('Bureau Toetsing Investeringen', 'https://www.bureautoetsinginvesteringen.nl/het-stelsel-van-toetsen/energie', OPENED, TERMS.bti),
  },
  bg: {
    'eso-home': official('Electricity System Operator (ESO EAD)', 'https://www.eso.bg/?en', OPENED, TERMS.eso),
    'investbg-fdi': official('InvestBulgaria Agency', 'https://investbg.government.bg/fdi-screening/', OPENED, TERMS.investbg),
  },
  cl: {
    'cne-home': official('Comisión Nacional de Energía', 'https://www.cne.cl/', OPENED, TERMS.cne),
    'investchile-storage': official('InvestChile', 'https://blog.investchile.gob.cl/en/chile-energy-storage-approved-projects', OPENED, TERMS.investchile),
  },
  ca_on: {
    'ieso-lt2': official('Independent Electricity System Operator', 'https://www.ieso.ca/en/Sector-Participants/Resource-Acquisition-and-Contracts/Long-Term-2-RFP', OPENED, TERMS.ieso),
    'ieso-connection-faq': official('Independent Electricity System Operator', 'https://www.ieso.ca/Sector-Participants/Connection-Process/Frequently-Asked-Questions', null, TERMS.ieso),
    'ised-investment-canada': official('Innovation, Science and Economic Development Canada', 'https://ised-isde.canada.ca/site/investment-canada-act/en/what-investment-canada-act', OPENED, TERMS.canada),
  },
  sa: {
    'sppc-home': official('Saudi Power Procurement Company', 'https://www.sppc.com.sa/', null, unread),
    'spa-storage-group-2': official('Saudi Press Agency', 'https://www.spa.gov.sa/en/N2568317', null, unread),
  },
};

/** One market's source list, keyed. An empty object when it has none. */
export const scoutSources = (id) => SCOUT_SOURCES[id] || {};
