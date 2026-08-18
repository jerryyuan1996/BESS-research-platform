/* ---------------------------------------------------------------------------
   Portfolio / Fund View — public shim.

   The real section is confidential in its entirety, not merely in its data. Its
   prose carries the project name, the site address, the capital structure and the
   financial model's audit exception as string literals, so gating the render was
   not enough: a bundler ships a function's strings whether or not the function is
   ever called, and a `dist/` scan found every one of them still present.

   So the section itself lives in `local-data/wa-portfolio-section.js`, outside
   the public tree. The import below points at a real public stub whose null
   export Node and the bundler both resolve; in development the Vite plugin
   redirects that same path to the confidential module when it is present.

   This is the pattern to reuse whenever a whole section is confidential rather
   than a value inside it. Externalising values is right when the surrounding
   analysis is publishable; moving the module is right when the analysis itself
   is the confidential thing.
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge } from '../../../components/badge.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { dossierList } from '../../../projects/dossier/portfolioList.js';
import { renderPortfolio as renderLocalPortfolio } from '../../../local/portfolioSection.js';

function renderWithheld(main){
  sectionHead(main, ['Portfolio / Fund View', '组合与基金视图'],
    ['This tab holds the project-level underwriting case for a screened opportunity. Project-specific content is confidential and is not published.',
     '本页为所筛选机会的项目层面承销分析。项目层面内容属保密信息，未予发布。']);

  /* The section-level refusal. The dossier list below adds the project-file
     layer, and in a published build both say the same thing. */
}

export function renderPortfolio(main){
  /* The legacy confidential section, where one exists, then the dossier list.

     Two layers rather than one, because they answer different questions. The
     section is this market's own portfolio analysis; the list is the set of
     project files, each of which has its own page. A market with no legacy
     section gets the list alone, and a build with neither gets the withheld
     card — which is the state every published build is in. */
  if (typeof renderLocalPortfolio === 'function') renderLocalPortfolio(main);
  else renderWithheld(main);

  const list = dossierList('wa', typeof renderLocalPortfolio === 'function' ? null : [
    'Every other tab in this dashboard is market-level by design, so the WA investment thesis, the RCM analysis, the merchant and FCESS work and the grid analysis are all complete without this tab. That separation was deliberate from the start: the framework applies to the next opportunity without rework.',
    '本看板其余各页均按市场层面设计，因此西澳投资逻辑、RCM分析、市场化与FCESS研究及电网分析在缺少本页的情况下仍然完整。该分离自始即为有意设计：同一框架可直接应用于下一个机会而无需重做。',
  ]);
  list.style.marginTop = '14px';
  main.append(list);
}
