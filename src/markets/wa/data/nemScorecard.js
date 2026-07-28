/* ---------------------------------------------------------------------------
   NEM connection scorecard, verbatim from the prototype (lines 783-810).
   Separate namespace: used ONLY in the WEM vs NEM comparison, never scored into WA.
   --------------------------------------------------------------------------- */


// ============================================================================
//  NEM CONNECTION SCORECARD — June 2026 (FY2026 full year). Used ONLY in the
//  WEM vs NEM comparison section: separate namespace, never scored into WA.
// ============================================================================
const NEM_SC = {
  fy: 'FY2025-26', asOf: 'Jun 2026',
  pipelineGW: 75, pipelineMix: [
    { n:['Battery (standalone)','独立电池'], pct:53, c:'var(--s1)' },
    { n:['Solar + battery hybrid','光储混合'], pct:18, c:'var(--s3)' },
    { n:['Onshore wind','陆上风电'], pct:15, c:'var(--s2)' },
    { n:['Other (solar, hydro, gas)','其他（光伏、水电、燃气）'], pct:14, c:'var(--muted)' },
  ],
  enquiryGW: 196, enquiryProjects: 128, enquiryConvLo: 20, enquiryConvHi: 30,
  // in-progress capacity by stage, and the historical conversion rate out of that stage
  stages: [
    { n:['Application','申请'],                    gw:35, pct:46.9, conv:'~90%',  projects:142, dur:8.6, over12mPct:53 },
    { n:['Proponent implementation','业主实施'],    gw:30, pct:40.1, conv:'~99%',  projects:128, dur:null, over12mPct:10 },
    { n:['Registration','注册'],                   gw:5,  pct:7.2,  conv:'~100%', projects:15,  dur:5.4, over12mPct:7 },
    { n:['Commissioning to full output','调试至满出力'], gw:5, pct:5.8, conv:'~100%', projects:63, dur:4.5, over12mPct:0 },
  ],
  fyApproved: { appGW:14.2, appGWh:31.1, appProjects:67, regGW:7.4, regGWh:14.0, regProjects:37 },
  fyOutput:   { incrementalGW:10.5, partialGW:1.4, fullGW:9.1, fullGWh:12.9, fullProjects:34, fullYoYPct:109 },
  fyTrend:    { appVsLastFYPct:-10, regVsLastFYPct:-18 },
  quarter:    { appProjects:32, appGW:6.9, appBatteryGW:3.6, appSolarBGW:1.8, appWindGW:1.3, appSolarGW:0.2,
                fullProjects:14, fullBatteryGW:2.7, regProjects:8, regBatteryGW:0.9, cancelled:0 },
  sysStrength:{ inScope:65, noImpactPct:78, payPct:17, remediatePct:5 },
  underwayGW: 11, totalProjects: 492,
};

export { NEM_SC };
