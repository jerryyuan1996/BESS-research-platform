/* ---------------------------------------------------------------------------
   Entry point.

   Style import order matters — it is the cascade order of the prototype's single
   <style> block, preserved:
     tokens  →  global  →  layout  →  components  →  charts  →  market  →  cockpit
   Responsive and print media queries live in the file that owns the majority of
   their selectors, always after those selectors' base rules.

   live.css is appended after that sequence rather than inserted into it. It is
   the one stylesheet the prototype had no counterpart for, and everything in it
   is additive, so putting it last keeps the original cascade provably unchanged.
   --------------------------------------------------------------------------- */
import './styles/tokens.css';
import './styles/flags.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/charts.css';
import './styles/market.css';
import './styles/cockpit.css';
import './styles/live.css';

import { inject } from '@vercel/analytics';
import { boot } from './app/app.js';

// Initialize Vercel Web Analytics
inject();

boot();
