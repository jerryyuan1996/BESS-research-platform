import { defineConfig } from '@playwright/test';
/* Two workers, and that is a measured choice rather than a default. On the
   analyst's laptop the slowest file (e2e/story.spec.js, 58 tests) took 456 s at
   two workers and 544 s at four: the suite is render-bound, so the extra workers
   compete for the same cores. E2E_WORKERS exists so the comparison can be
   repeated on a runner, where the answer may differ, without editing this file. */
const WORKERS = Number(process.env.E2E_WORKERS) || 2;
export default defineConfig({
  testDir:'./e2e',timeout:60000,expect:{timeout:15000},workers:WORKERS,retries:process.env.CI?1:0,
  use:{baseURL:process.env.PLATFORM_TEST_BASE_URL || 'http://127.0.0.1:4175',channel:'chromium',screenshot:'only-on-failure',trace:'retain-on-failure'},
  projects:[
    {name:'desktop',use:{viewport:{width:1440,height:1000}}},
    {name:'mobile',use:{viewport:{width:390,height:844}}},
  ],
  webServer:process.env.PLATFORM_TEST_BASE_URL ? undefined : {command:'npm run preview -- --host 127.0.0.1 --port 4175 --strictPort',url:'http://127.0.0.1:4175',timeout:120000,reuseExistingServer:!process.env.CI},
});
