/* ---------------------------------------------------------------------------
   WHERE THE STEP TIMINGS LIVE.

   One resolver, because two scripts and three workflow files have to agree on a
   path, and a mismatch is silent: the summary would print an empty table and
   nobody would know whether the steps were fast or the file was wrong.

   CI_TIMINGS_FILE wins when it is set. Otherwise the runner's own temporary
   directory — `RUNNER_TEMP`, which GitHub sets for every step — is used.

   That fallback is not a convenience. `runner` is NOT an available context in a
   job-level `env:` block (it is available on steps), so a workflow cannot set
   `CI_TIMINGS_FILE: ${{ runner.temp }}/ci-timings.tsv` once per job. Setting it
   that way makes the whole workflow invalid, which GitHub reports as a run that
   fails in zero seconds with the workflow file as its name — the least useful
   error message in the system. Reading RUNNER_TEMP here keeps the workflow
   clean and the file in the same place.

   Null on a developer's machine: no runner, no file, and every caller treats
   that as "record nothing" rather than an error.
   --------------------------------------------------------------------------- */
import path from 'node:path';

export function timingsFile(){
  if (process.env.CI_TIMINGS_FILE) return process.env.CI_TIMINGS_FILE;
  if (process.env.RUNNER_TEMP) return path.join(process.env.RUNNER_TEMP, 'ci-timings.tsv');
  return null;
}
