/* ---------------------------------------------------------------------------
   Entry point.

   Style import order matters — it is the cascade order of the prototype's single
   <style> block, preserved:
     tokens  →  global  →  layout  →  components  →  charts  →  market  →  cockpit
   Responsive and print media queries live in the file that owns the majority of
   their selectors, always after those selectors' base rules.
   --------------------------------------------------------------------------- */
import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/charts.css';
import './styles/market.css';
import './styles/cockpit.css';

import { boot } from './app/app.js';

boot();
