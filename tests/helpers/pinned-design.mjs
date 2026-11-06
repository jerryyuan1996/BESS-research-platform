/* Stands in for src/briefing/designData.js under tests/helpers/pin-design.mjs. */
import { readFileSync } from 'node:fs';

const PIN = JSON.parse(readFileSync(new URL('../fixtures/sections-design-vintage.json', import.meta.url), 'utf8'));

export const DESIGN = PIN.design;
export const PINNED_VINTAGE = { dataCommit: PIN.dataCommit, now: PIN.now };
