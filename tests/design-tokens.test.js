/* ---------------------------------------------------------------------------
   THE TYPE, WEIGHT AND RADIUS SCALES ARE ENFORCED, NOT SUGGESTED.

   Before round 6 the stylesheets carried 161 font-size declarations across
   twenty-one distinct values between 9px and 22px. Nothing had gone wrong in
   any single commit; each one added a plausible size next to an existing one,
   and after enough of them the page had no hierarchy left to read.

   A scale that lives only in a document decays the same way. So the rule is a
   test: a raw px font-size, font-weight or single-value border-radius anywhere
   under src/ fails, and the fix is to use a token or to argue for a new one.

   WHAT IS DELIBERATELY ALLOWED:
     · tokens.css itself, which is where the scale is defined
     · `border-radius:0` and `50%`, which are shapes rather than sizes
     · multi-value radii like `0 10px 10px 0`, which describe one corner set
     · numeric sizes passed to a chart helper, which take a token string now but
       still accept a number for a caller that genuinely needs one
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
const TOKENS = path.join(SRC, 'styles', 'tokens.css');

function walk(dir){
  return readdirSync(dir).flatMap(name => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(SRC).filter(f => /\.(css|js)$/.test(f) && f !== TOKENS);
const read = (f) => readFileSync(f, 'utf8');
const rel = (f) => path.relative(SRC, f).replace(/\\/g, '/');

/** Offending lines for a pattern, as "path:line  text" for a legible failure. */
function offenders(re){
  const out = [];
  for (const f of files){
    read(f).split(/\r?\n/).forEach((line, i) => {
      if (re.test(line)) out.push(`${rel(f)}:${i + 1}  ${line.trim().slice(0, 90)}`);
    });
  }
  return out;
}

test('no raw px font-size outside the scale', () => {
  const bad = offenders(/font-size:\s*[0-9.]+px/);
  assert.deepEqual(bad, [],
    'use var(--fs-*); the scale is in src/styles/tokens.css\n' + bad.join('\n'));
});

test('no raw numeric font-weight outside the scale', () => {
  /* 650 was in use in 33 places and is not a step. System fonts round it to
     600 or 700 anyway, so it bought inconsistency and no visual difference. */
  const bad = offenders(/font-weight:\s*[0-9]+/);
  assert.deepEqual(bad, [],
    'use var(--fw-normal|medium|bold)\n' + bad.join('\n'));
});

test('no raw single-value px border-radius outside the scale', () => {
  /* Only single-value radii are caught. `0 10px 10px 0` describes which corners
     are round, which is a shape decision the scale has no opinion about. */
  const bad = offenders(/border-radius:\s*[0-9.]+px\s*[;}]/);
  assert.deepEqual(bad, [],
    'use var(--r-xs|sm|md|lg|pill)\n' + bad.join('\n'));
});

test('the scale itself is complete and ordered', () => {
  const css = readFileSync(TOKENS, 'utf8');
  const steps = ['--fs-micro', '--fs-2xs', '--fs-xs', '--fs-sm',
                 '--fs-md', '--fs-lg', '--fs-xl', '--fs-2xl'];
  const sizes = steps.map(name => {
    const m = css.match(new RegExp(name + ':\\s*([0-9.]+)px'));
    assert.ok(m, `${name} is missing from tokens.css`);
    return Number(m[1]);
  });

  /* Strictly ascending. A scale with two steps at the same size is two names
     for one decision, which is how the twenty-one values started. */
  for (let k = 1; k < sizes.length; k++){
    assert.ok(sizes[k] > sizes[k - 1],
      `${steps[k]} (${sizes[k]}px) must be larger than ${steps[k - 1]} (${sizes[k - 1]}px)`);
  }

  for (const name of ['--r-xs', '--r-sm', '--r-md', '--r-lg', '--r-pill',
                      '--fw-normal', '--fw-medium', '--fw-bold', '--font-sans',
                      '--lh-tight', '--lh-body']){
    assert.match(css, new RegExp(name + ':'), `${name} is missing from tokens.css`);
  }
});

test('an SVG font-size is set through style, never as a presentation attribute', () => {
  /* An SVG presentation attribute cannot resolve var(), so
     `font-size="var(--fs-micro)"` is silently ignored and the browser falls
     back. That is exactly how the chart axes stayed at 10.5px while every other
     size on the page moved onto the scale — invisible unless measured. */
  const bad = offenders(/'font-size':\s*(?!.*style)/);
  assert.deepEqual(bad, [],
    'set element.style.fontSize instead, so the custom property resolves\n' + bad.join('\n'));
});
