import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./e2e',timeout:60000,expect:{timeout:15000},workers:2,retries:process.env.CI?1:0,
  use:{baseURL:'http://127.0.0.1:4175',channel:'chromium',screenshot:'only-on-failure',trace:'retain-on-failure'},
  projects:[
    {name:'desktop',use:{viewport:{width:1440,height:1000}}},
    {name:'mobile',use:{viewport:{width:390,height:844}}},
  ],
  webServer:{command:'npm run preview -- --host 127.0.0.1 --port 4175 --strictPort',url:'http://127.0.0.1:4175',timeout:120000,reuseExistingServer:!process.env.CI},
});
