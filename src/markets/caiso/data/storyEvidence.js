/* Fixed-vintage manual records. Authority: caiso-build-evidence.md §§3–5.
   No financial-model input and no scheduled feed. Unregistered profiles stay null. */
export const CAISO_EVIDENCE = {
  "fleet2020MW": 500,
  "fleetDec2024MW": 13000,
  "fleetEnd2025LowerBoundMW": 17000,
  "fleet2020Qualifier": "about",
  "fleetDec2024Qualifier": "about",
  "fleetEnd2025Qualifier": "over",
  "fleet2020AsOf": "2020",
  "fleetDec2024AsOf": "2024-12",
  "fleetEnd2025AsOf": "2025-12",
  "mtrNqcMW": 11500,
  "mtrMinContractYears": 10,
  "qcBasisHours": 4,
  "sodHours": 24,
  "ldesThresholdHours": 8,
  "foldbackCutMW": null,
  "foldbackCutFraction": null,
  "postFoldbackQualifyingMW": null,
  "assetContractPricePerKWMonth": null,
  "assetContractMW": null,
  "assetContractYears": null,
  "observedRaPricePerKWMonth": null,
  "fleetAverageDurationHours": null,
  "researchCheckedOn": "2026-10-31",
  "verifiedOn": "2026-11-02"
};
export const CAISO_RECORDS = {
  "fleet2020MW": {
    "value": 500,
    "sourceIds": [
      "SRC-CAISO-11"
    ],
    "primaryUrl": "https://www.caiso.com/documents/2024-special-report-on-battery-storage-may-29-2025.pdf",
    "locator": "2024 battery report, p. 4, §1.2, first bullet",
    "unit": "MW",
    "scope": "CAISO balancing area",
    "publishedOn": "2025-05-29",
    "asOf": "2020",
    "checkedOn": "2026-11-02",
    "qualifier": "about",
    "status": "observation",
    "arithmetic": "Direct approximate MW transcription"
  },
  "fleetDec2024MW": {
    "value": 13000,
    "sourceIds": [
      "SRC-CAISO-11"
    ],
    "primaryUrl": "https://www.caiso.com/documents/2024-special-report-on-battery-storage-may-29-2025.pdf",
    "locator": "2024 battery report, p. 4, §1.2, first bullet",
    "unit": "MW",
    "scope": "CAISO balancing area",
    "publishedOn": "2025-05-29",
    "asOf": "2024-12",
    "checkedOn": "2026-11-02",
    "qualifier": "about",
    "status": "observation",
    "arithmetic": "Direct MW transcription"
  },
  "fleetEnd2025LowerBoundMW": {
    "value": 17000,
    "sourceIds": [
      "SRC-CAISO-12"
    ],
    "primaryUrl": "https://www.caiso.com/documents/2025-annual-report-on-market-issues-and-performance.pdf",
    "locator": "2025 annual report, printed p. 23 / PDF page 35, Battery resources, opening paragraph",
    "unit": "MW",
    "scope": "CAISO balancing area",
    "publishedOn": "2026-06",
    "asOf": "2025-12",
    "checkedOn": "2026-11-02",
    "qualifier": "over",
    "status": "observation",
    "arithmetic": "17 GW × 1000; strict lower bound"
  },
  "mtrNqcMW": {
    "value": 11500,
    "sourceIds": [
      "SRC-CAISO-08"
    ],
    "primaryUrl": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M389/K603/389603637.PDF",
    "locator": "D.21-06-035, Summary p. 2; Table 5 p. 48, Total annual capacity requirements, Total column",
    "unit": "September NQC MW",
    "scope": "2023–2026 incremental procurement requirement",
    "publishedOn": "2021-06-30",
    "asOf": "2021-06-24",
    "checkedOn": "2026-11-02",
    "qualifier": "minimum",
    "status": "rule",
    "arithmetic": "2000 + 6000 + 1500 + 2000 = 11500; not battery nameplate"
  },
  "mtrMinContractYears": {
    "value": 10,
    "sourceIds": [
      "SRC-CAISO-08"
    ],
    "primaryUrl": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M389/K603/389603637.PDF",
    "locator": "D.21-06-035 §9.2, printed p. 70 / PDF page 72, long-term contract definition",
    "unit": "years",
    "scope": "Procurement contract period",
    "publishedOn": "2021-06-30",
    "asOf": "2021-06-24",
    "checkedOn": "2026-11-02",
    "qualifier": "minimum",
    "status": "rule",
    "arithmetic": "Direct minimum term; distinct from model tenor"
  },
  "qcBasisHours": {
    "value": 4,
    "sourceIds": [
      "SRC-CAISO-07"
    ],
    "primaryUrl": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M097/K619/97619935.PDF",
    "locator": "D.14-06-050 Appendix B §13.1 p. B-9; D.26-07-008 §4.4.1 p. 19 and OP 6 p. 197",
    "unit": "continuous hours",
    "scope": "Storage qualifying-capacity basis",
    "publishedOn": "2014-07-01",
    "asOf": "2015",
    "checkedOn": "2026-11-02",
    "qualifier": "exact",
    "status": "rule",
    "arithmetic": "Direct duration; not a dispatch schedule"
  },
  "sodHours": {
    "value": 24,
    "sourceIds": [
      "SRC-CAISO-09"
    ],
    "primaryUrl": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M488/K540/488540634.PDF",
    "locator": "D.22-06-050 Appendix A, sections A and B.2, 24-Hour Slice Framework",
    "unit": "hours",
    "scope": "Daily RA showing",
    "publishedOn": "2022-06",
    "asOf": "2025",
    "checkedOn": "2026-11-02",
    "qualifier": "exact",
    "status": "rule",
    "arithmetic": "Direct daily showing length; not discharge duration"
  },
  "ldesThresholdHours": {
    "value": 8,
    "sourceIds": [
      "SRC-CAISO-10"
    ],
    "primaryUrl": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M610/K575/610575803.PDF",
    "locator": "D.26-07-008 §4.4.3.3, printed p. 49 / PDF page 52, definition paragraph",
    "unit": "continuous hours at maximum power",
    "scope": "LDES treatment threshold",
    "publishedOn": "2026-07-10",
    "asOf": "2027",
    "checkedOn": "2026-11-02",
    "qualifier": "minimum",
    "status": "rule",
    "arithmetic": "Direct threshold; adopted future effect"
  },
  "foldbackCutMW": {
    "value": null,
    "sourceIds": [
      "GAP-CAISO-FOLDBACK"
    ],
    "primaryUrl": null,
    "locator": "caiso-build-evidence.md §3, foldbackCutMW",
    "unit": "MW",
    "scope": "Unverified asset or observed series",
    "publishedOn": null,
    "asOf": null,
    "checkedOn": "2026-11-02",
    "qualifier": "missing",
    "status": "missing",
    "arithmetic": "Unavailable; never substitute zero"
  },
  "foldbackCutFraction": {
    "value": null,
    "sourceIds": [
      "GAP-CAISO-FOLDBACK"
    ],
    "primaryUrl": null,
    "locator": "caiso-build-evidence.md §3, foldbackCutFraction",
    "unit": "fraction",
    "scope": "Unverified asset or observed series",
    "publishedOn": null,
    "asOf": null,
    "checkedOn": "2026-11-02",
    "qualifier": "missing",
    "status": "missing",
    "arithmetic": "Unavailable; never substitute zero"
  },
  "postFoldbackQualifyingMW": {
    "value": null,
    "sourceIds": [
      "GAP-CAISO-FOLDBACK"
    ],
    "primaryUrl": null,
    "locator": "caiso-build-evidence.md §3, postFoldbackQualifyingMW",
    "unit": "MW",
    "scope": "Unverified asset or observed series",
    "publishedOn": null,
    "asOf": null,
    "checkedOn": "2026-11-02",
    "qualifier": "missing",
    "status": "missing",
    "arithmetic": "Unavailable; never substitute zero"
  },
  "assetContractPricePerKWMonth": {
    "value": null,
    "sourceIds": [
      "GAP-CAISO-CONTRACT"
    ],
    "primaryUrl": null,
    "locator": "caiso-build-evidence.md §3, assetContractPricePerKWMonth",
    "unit": "USD/kW/month",
    "scope": "Unverified asset or observed series",
    "publishedOn": null,
    "asOf": null,
    "checkedOn": "2026-11-02",
    "qualifier": "missing",
    "status": "missing",
    "arithmetic": "Unavailable; never substitute zero"
  },
  "assetContractMW": {
    "value": null,
    "sourceIds": [
      "GAP-CAISO-CONTRACT"
    ],
    "primaryUrl": null,
    "locator": "caiso-build-evidence.md §3, assetContractMW",
    "unit": "MW",
    "scope": "Unverified asset or observed series",
    "publishedOn": null,
    "asOf": null,
    "checkedOn": "2026-11-02",
    "qualifier": "missing",
    "status": "missing",
    "arithmetic": "Unavailable; never substitute zero"
  },
  "assetContractYears": {
    "value": null,
    "sourceIds": [
      "GAP-CAISO-CONTRACT"
    ],
    "primaryUrl": null,
    "locator": "caiso-build-evidence.md §3, assetContractYears",
    "unit": "years",
    "scope": "Unverified asset or observed series",
    "publishedOn": null,
    "asOf": null,
    "checkedOn": "2026-11-02",
    "qualifier": "missing",
    "status": "missing",
    "arithmetic": "Unavailable; never substitute zero"
  },
  "observedRaPricePerKWMonth": {
    "value": null,
    "sourceIds": [
      "GAP-CAISO-RAPRICE"
    ],
    "primaryUrl": null,
    "locator": "caiso-build-evidence.md §3, observedRaPricePerKWMonth",
    "unit": "USD/kW/month",
    "scope": "Unverified asset or observed series",
    "publishedOn": null,
    "asOf": null,
    "checkedOn": "2026-11-02",
    "qualifier": "missing",
    "status": "missing",
    "arithmetic": "Unavailable; never substitute zero"
  },
  "fleetAverageDurationHours": {
    "value": null,
    "sourceIds": [
      "REPO-CAISO-DG2"
    ],
    "primaryUrl": null,
    "locator": "caiso-build-evidence.md §3, fleetAverageDurationHours",
    "unit": "hours",
    "scope": "Unverified asset or observed series",
    "publishedOn": null,
    "asOf": null,
    "checkedOn": "2026-11-02",
    "qualifier": "missing",
    "status": "missing",
    "arithmetic": "Unavailable; never substitute zero"
  }
};
export const CAISO_HISTORY = {
  "H-CAISO-01": {
    "framework": "2004",
    "actYear": "2005",
    "actEffective": "2006-01-01",
    "systemEffective": "2006-06-01",
    "sourceIds": [
      "SRC-CAISO-01",
      "SRC-CAISO-02",
      "SRC-CAISO-03"
    ],
    "locator": "SRC-CAISO-01 §2.1; SRC-CAISO-02 §1; SRC-CAISO-03 System RA requirements",
    "status": "historical-fact",
    "checkedOn": "2026-10-31",
    "arithmetic": "Direct date transcription; preserve precision; adoption and effect are separate"
  },
  "H-CAISO-02": {
    "storageOrder": "2013-10-17",
    "qcDecision": "2014-06-26",
    "qcEffectiveRaYear": "2015",
    "sourceIds": [
      "SRC-CAISO-06",
      "SRC-CAISO-07"
    ],
    "locator": "D.13-10-040 Summary p. 2 and heading; D.14-06-050 heading and Appendix B",
    "status": "historical-fact",
    "checkedOn": "2026-10-31",
    "arithmetic": "Direct date transcription; preserve precision; adoption and effect are separate"
  },
  "H-CAISO-03": {
    "outages": [
      "2020-08-14",
      "2020-08-15"
    ],
    "rootCausePublished": "2021-01-13",
    "mtrDecision": "2021-06-24",
    "sourceIds": [
      "SRC-CAISO-05",
      "SRC-CAISO-08"
    ],
    "locator": "Final Root Cause Analysis cover and Executive Summary p. 4; D.21-06-035 heading",
    "status": "historical-fact",
    "checkedOn": "2026-10-31",
    "arithmetic": "Direct date transcription; preserve precision; adoption and effect are separate"
  },
  "H-CAISO-04": {
    "adopted": "2022-06",
    "implementationDecision": "2023-04-07",
    "effectiveYear": "2025",
    "sourceIds": [
      "SRC-CAISO-09",
      "SRC-CAISO-11"
    ],
    "locator": "D.22-06-050 Appendix A; 2024 battery report §2.10.1 p. 28",
    "status": "historical-fact",
    "checkedOn": "2026-10-31",
    "arithmetic": "Direct date transcription; preserve precision; adoption and effect are separate"
  },
  "H-CAISO-05": {
    "adopted": "2026-07-02",
    "foldbackRaYear": "2027",
    "ucapRaYear": "2028",
    "sourceIds": [
      "SRC-CAISO-10"
    ],
    "locator": "D.26-07-008 heading, p. 177 and OP 6 p. 197; fact sheet pp. 1–2",
    "status": "adopted-future-effect",
    "checkedOn": "2026-10-31",
    "arithmetic": "Direct date transcription; preserve precision; adoption and effect are separate"
  },
  "H-CAISO-06": {
    "adopted": "2026-07-02",
    "effectiveYear": "2027",
    "sourceIds": [
      "SRC-CAISO-10"
    ],
    "locator": "D.26-07-008 pp. 48–51",
    "status": "adopted-future-effect",
    "checkedOn": "2026-10-31",
    "arithmetic": "Direct date transcription; preserve precision; adoption and effect are separate"
  }
};
export const CAISO_DAY = {
  "calculationId": "CALC-CAISO-DAY",
  "publicationStatus": "blocked",
  "sourceRoute": "CAISO public website CSV",
  "profiles": {
    "2020": {
      "hourBeginning": null,
      "demandMW": null,
      "netLoadMW": null,
      "solarMW": null,
      "batteryMW": null,
      "sampleDaysByHour": null,
      "troughMW": null,
      "troughHour": null,
      "peakMW": null,
      "peakHour": null
    },
    "2025": {
      "hourBeginning": null,
      "demandMW": null,
      "netLoadMW": null,
      "solarMW": null,
      "batteryMW": null,
      "sampleDaysByHour": null,
      "troughMW": null,
      "troughHour": null,
      "peakMW": null,
      "peakHour": null
    }
  },
  "highest2025NetLoadHours": null,
  "calculationReviewedOn": null,
  "sourceFiles": [],
  "actualIntervals": null,
  "missingIntervals": null,
  "duplicateIntervals": null,
  "droppedDates": null,
  "clockAudit": null,
  "rights": {
    "termsUrl": "https://www.caiso.com/privacy-terms-of-use",
    "termsVersion": "2018-10-02",
    "checkedOn": "2026-11-02",
    "scope": "Website daily CSV only; actual-file notices unverified",
    "decision": "Selected arm A; remain on unscaled Example",
    "attribution": "Source: California ISO, Today's Outlook data",
    "retainedNotices": null
  },
  "timeZone": "America/Los_Angeles",
  "intervalConvention": "hour beginning",
  "units": "MW",
  "methodVersion": "caiso-build-evidence-2026-11-02",
  "seasons": {
    "2020": [
      "2020-07-01",
      "2020-09-30"
    ],
    "2025": [
      "2025-07-01",
      "2025-09-30"
    ]
  },
  "includedDates": null,
  "excludedDates": [
    "2020-07-03",
    "2020-09-07",
    "2025-07-04",
    "2025-09-01"
  ],
  "expectedIntervals": 18432
};
export const CAISO_SOURCES = {
  "SRC-CAISO-01": {
    "title": "CPUC, [D.04-10-035, Interim Opinion Regarding Resource Adequacy, R.04-04-003](https://docs.cpuc.ca.gov/published/Final_decision/41416.htm); [§2.1 \"The RAR Framework\"](https://docs.cpuc.ca.gov/published/Final_decision/41416-01.htm)",
    "primaryUrl": "https://docs.cpuc.ca.gov/published/Final_decision/41416.htm",
    "publicationRecord": "Decision 28 Oct 2004, mailed 4 Nov 2004",
    "scopeRecord": "\"Since 2002, in the aftermath of the electricity crisis of 2000-2001, California has wrestled with the creation of resource adequacy requirements.\" It summarises D.04-01-050: each load-serving entity must hold reserves for its own load, a 15–17% planning reserve margin, and forward contracting of most summer peaking needs a year ahead. The CPUC's framing of the origin; not a full history of the crisis",
    "rightsRecord": "`public-link-only`; historical; no refresh needed"
  },
  "SRC-CAISO-02": {
    "title": "CPUC, [D.06-04-040, §1 \"Compliance With Section 380\"](https://docs.cpuc.ca.gov/published/Final_decision/55661-02.htm)",
    "primaryUrl": "https://docs.cpuc.ca.gov/published/Final_decision/55661-02.htm",
    "publicationRecord": "Decision 13 Apr 2006",
    "scopeRecord": "Public Utilities Code §380 was added by AB 380 (Stats. 2005, ch. 367), which confirms the CPUC's authority to set RA requirements; effective 1 January 2006. The statute's own text was not opened (the legislature's site refused automated reads)",
    "rightsRecord": "`public-link-only`; historical"
  },
  "SRC-CAISO-03": {
    "title": "CPUC, [Resource Adequacy Homepage](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-power-procurement/resource-adequacy-homepage)",
    "primaryUrl": "https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-power-procurement/resource-adequacy-homepage",
    "publicationRecord": "Undated page, read 31 Oct 2026",
    "scopeRecord": "The RA framework (PU Code §380) applies to all load-serving entities in CPUC jurisdiction, utilities, energy service providers and community choice aggregators; \"System RA requirements (effective June 1, 2006)\"",
    "rightsRecord": "`public-link-only`; recheck on page change"
  },
  "SRC-CAISO-04": {
    "title": "CAISO, [*What the duck curve tells us about managing a green grid*, Fast Facts, CommPR/2016](https://www.caiso.com/Documents/FlexibleResourcesHelpRenewables_FastFacts.pdf), p. 1",
    "primaryUrl": "https://www.caiso.com/Documents/FlexibleResourcesHelpRenewables_FastFacts.pdf",
    "publicationRecord": "PDF created 28 Apr 2016",
    "scopeRecord": "Net load is load minus variable wind and solar; its \"belly\" and \"arch\" give the duck chart; CAISO studied every day from 2012 to 2020. Scenarios, not observed data",
    "rightsRecord": "© 2016 California ISO; link only, nothing copied"
  },
  "SRC-CAISO-05": {
    "title": "CAISO, CPUC and CEC, [*Final Root Cause Analysis: Mid-August 2020 Extreme Heat Wave*](https://www.caiso.com/Documents/Final-Root-Cause-Analysis-Mid-August-2020-Extreme-Heat-Wave.pdf), Executive Summary, p. 4",
    "primaryUrl": "https://www.caiso.com/Documents/Final-Root-Cause-Analysis-Mid-August-2020-Extreme-Heat-Wave.pdf",
    "publicationRecord": "13 Jan 2021",
    "scopeRecord": "Both rotating outages (14 and 15 August 2020) came after the gross peak, during the net demand peak; planning targets \"have not kept pace to ensure sufficient resources that can be relied upon to meet demand in the early evening hours\". Three causes in all; the story uses only this one",
    "rightsRecord": "`public-link-only`; historical"
  },
  "SRC-CAISO-06": {
    "title": "CPUC, [D.13-10-040, R.10-12-007](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M079/K533/79533378.PDF), Summary, p. 2",
    "primaryUrl": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M079/K533/79533378.PDF",
    "publicationRecord": "Decision 17 Oct 2013, issued 21 Oct 2013",
    "scopeRecord": "A storage target for the three large investor-owned utilities, to be procured by 2020 and installed by the end of 2024",
    "rightsRecord": "`public-link-only`; historical"
  },
  "SRC-CAISO-07": {
    "title": "CPUC, [D.14-06-050](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M097/K619/97619935.PDF), Appendix B, §13.1, p. B-9",
    "primaryUrl": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M097/K619/97619935.PDF",
    "publicationRecord": "Decision 26 Jun 2014, issued 1 Jul 2014; for the 2015 RA year",
    "scopeRecord": "\"Because all RA resources must be able to operate for four or more consecutive hours\", storage QC is PmaxRA, the output it can discharge for four or more uninterrupted hours; net qualifying capacity is limited to deliverable output",
    "rightsRecord": "`public-link-only`; superseded in method from 2027 by SRC-CAISO-10, which keeps the four-hour basis"
  },
  "SRC-CAISO-08": {
    "title": "CPUC, [D.21-06-035, Decision Requiring Procurement to Address Mid-Term Reliability (2023-2026), R.20-05-003](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M389/K603/389603637.PDF), Summary p. 2; p. 70",
    "primaryUrl": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M389/K603/389603637.PDF",
    "publicationRecord": "Decision 24 Jun 2021, issued 30 Jun 2021",
    "scopeRecord": "At least 11,500 MW of additional net qualifying capacity in tranches for 2023 to 2026 (p. 2); procurement under the order must use long-term contracts, \"defined as at least ten years\" (p. 70). Its procurement by technology is not reported here (GAP-CAISO-MTR)",
    "rightsRecord": "`public-link-only`; historical"
  },
  "SRC-CAISO-09": {
    "title": "CPUC, [D.22-06-050, Appendix A, \"24-Hour Slice Framework\", R.21-10-002](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M488/K540/488540634.PDF), sections A and B.2",
    "primaryUrl": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M488/K540/488540634.PDF",
    "publicationRecord": "June 2022 (appendix PDF created 24 Jun 2022); implementation in D.23-04-010 of 7 Apr 2023, cited through SRC-CAISO-10 and SRC-CAISO-11, not opened",
    "scopeRecord": "Each LSE shows enough capacity for all 24 hours of CAISO's worst day of each month; storage is valued on Pmax within its daily capabilities; excess capacity must cover battery charging and losses; the minimum four-hour availability stays. Adopted for the 2025 RA year",
    "rightsRecord": "`public-link-only`; refresh on a new slice-of-day decision"
  },
  "SRC-CAISO-10": {
    "title": "CPUC, [D.26-07-008, Decision Adopting Local Capacity Obligations for 2027-2029, Flexible Capacity Obligations for 2027, and Program Refinements, R.25-10-003](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M610/K575/610575803.PDF): §4.4.1 pp. 19–21; §4.4.1.3 pp. 26–28; §4.4.3.3 pp. 48–51; §4.6.3 pp. 84–86; p. 177; Ordering Paragraph 6, p. 197. [Fact sheet](https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/resource-adequacy-homepage/oga-fact-sheet-on-track-1-final-decision-v2.pdf), pp. 1–2",
    "primaryUrl": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M610/K575/610575803.PDF",
    "publicationRecord": "Adopted 2 Jul 2026, issued 10 Jul 2026",
    "scopeRecord": "Foldback defined (pp. 19–20). From the 2027 RA year, storage QC is the maximum less the minimum continuous energy, divided by four and capped at the connection, and is the output held \"for four or more continuous hours without being affected by nonlinearity (or foldback)\" (OP 6); the default value is still to be discussed (p. 27); QC changes are not expected in 2026 and may first appear in 2027, then UCAP replaces QC for batteries from 2028 (p. 177); the four-hour eligibility requirement goes to the next track (p. 177); storage of at least eight hours may count across the 24-hour day with a charging multiplier (pp. 48–51). Fact sheet: unit-specific UCAP for gas and storage from 2028",
    "rightsRecord": "`public-link-only`; `current-at-check`; refresh on the Track 2 decision and the 2027 QC values"
  },
  "SRC-CAISO-11": {
    "title": "CAISO Department of Market Monitoring, [*2024 Special Report on Battery Storage*](https://www.caiso.com/documents/2024-special-report-on-battery-storage-may-29-2025.pdf): key findings p. 4; §2.10.1 pp. 28–29",
    "primaryUrl": "https://www.caiso.com/documents/2024-special-report-on-battery-storage-may-29-2025.pdf",
    "publicationRecord": "29 May 2025",
    "scopeRecord": "Battery capacity grew from about 500 MW in 2020 to 13,000 MW in December 2024 in the CAISO balancing area; batteries supplied about 8.6% of energy in hours 17 to 21 and 84% of regulation in 2024 (p. 4). Slice of day from 2025; the CPUC sets battery NQC from four-hour sustained output, and longer batteries receive no different credit (p. 28)",
    "rightsRecord": "`public-link-only`; refresh on the next DMM battery report"
  },
  "SRC-CAISO-12": {
    "title": "CAISO Department of Market Monitoring, [*2025 Annual Report on Market Issues and Performance*](https://www.caiso.com/documents/2025-annual-report-on-market-issues-and-performance.pdf): pp. 2–3, 13–14, 23, 82 and 316 (Table 16.7)",
    "primaryUrl": "https://www.caiso.com/documents/2025-annual-report-on-market-issues-and-performance.pdf",
    "publicationRecord": "June 2026",
    "scopeRecord": "Average battery discharge peaked near 9,100 MW in the evening in 2025, against 5,700 MW in 2024, across the WEIM (pp. 2 and 82). CAISO-area batteries earned about USD 35/kW-yr in energy and 9 in regulation in 2025 (p. 3). RA capacity covered the 2025 peak with a wide margin, and RA was scarcest in spring 2025 (pp. 13–14). Over 17 GW of installed batteries in the CAISO area by the end of 2025 (p. 23). Storage was about a fifth of system RA capacity in the analysis hours (p. 316)",
    "rightsRecord": "`public-link-only`; scopes differ by page (CF-CAISO-04)"
  },
  "SRC-CAISO-13": {
    "title": "CAISO, [*2026 Summer Loads and Resources Assessment*](https://www.caiso.com/documents/2026-summer-loads-and-resources-assessment.pdf), Executive Summary p. 1; §1.1",
    "primaryUrl": "https://www.caiso.com/documents/2026-summer-loads-and-resources-assessment.pdf",
    "publicationRecord": "May 2026",
    "scopeRecord": "Sufficient resources for a wide range of conditions; a surplus above the one-day-in-ten-years loss-of-load standard for summer 2026; net peak hours 17 to 23 PDT, June to September",
    "rightsRecord": "`public-link-only`; refresh with the 2027 assessment"
  },
  "SRC-CAISO-14": {
    "title": "California Energy Commission, [news release, 4 May 2026](https://www.energy.ca.gov/news/2026-05/california-energy-leaders-report-progress-grid-reliability-ahead-summer-2026)",
    "primaryUrl": "https://www.energy.ca.gov/news/2026-05/california-energy-leaders-report-progress-grid-reliability-ahead-summer-2026",
    "publicationRecord": "4 May 2026",
    "scopeRecord": "Over 17,000 MW of battery storage installed cumulatively after 2025's additions; no Flex Alert in 2023, 2024 or 2025",
    "rightsRecord": "`public-link-only`; a statewide figure, not the CAISO area"
  },
  "SRC-CAISO-17": {
    "title": "CAISO Tariff, [Appendix KK, Resource Interconnection Standards](https://www.caiso.com/documents/appendix-kk-resource-interconnection-standards-as-of-jun-25-2025.pdf), §8.9",
    "primaryUrl": "https://www.caiso.com/documents/appendix-kk-resource-interconnection-standards-as-of-jun-25-2025.pdf",
    "publicationRecord": "As of 25 Jun 2025",
    "scopeRecord": "Transmission Plan Deliverability is allocated after the Interconnection Facilities Study reports, from what the latest transmission plan makes available, with retention criteria; an allocation gives no right to specific MW",
    "rightsRecord": "`public-link-only`; whether a later version is in force was not checked"
  },
  "SRC-CAISO-18": {
    "title": "CAISO, Today's Outlook history: daily `netdemand.csv` and `fuelsource.csv`, e.g. [`/outlook/history/20250715/netdemand.csv`](https://www.caiso.com/outlook/history/20250715/netdemand.csv)",
    "primaryUrl": "https://www.caiso.com/outlook/history/20250715/netdemand.csv",
    "publicationRecord": "128 business days, July–September 2020 and 2025; fetched 31 Oct 2026",
    "scopeRecord": "Five-minute demand, net demand (demand minus wind and solar), solar and battery output on CAISO's clock. Basis of CALC-CAISO-DAY",
    "rightsRecord": "Operational data CAISO may revise; terms in SRC-CAISO-19; not registered (GAP-CAISO-DAY)"
  },
  "SRC-CAISO-19": {
    "title": "CAISO, [Privacy Notice and Terms of Use](https://www.caiso.com/privacy-terms-of-use), \"Restrictions on Use of Materials\" and \"API Terms of Use\"",
    "primaryUrl": "https://www.caiso.com/privacy-terms-of-use",
    "publicationRecord": "Terms of Use updated 2 Oct 2018; API terms 22 Aug 2019",
    "scopeRecord": "Most website materials \"may be used by you provided that you keep intact all copyright, trademark and other proprietary notices and that you credit the California ISO\"; the API terms claim ownership of CAISO data",
    "rightsRecord": "Rights decision for the analyst (GAP-CAISO-DAY)"
  },
  "SRC-CAISO-20": {
    "title": "U.S. EIA, Form EIA-930 six-month balance files, CAISO rows: [`EIA930_BALANCE_2025_Jul_Dec.csv`](https://www.eia.gov/electricity/gridmonitor/sixMonthFiles/EIA930_BALANCE_2025_Jul_Dec.csv) and the 2020 file. Also EIA-860M, the monthly generator inventory, through REPO-CAISO-DG2",
    "primaryUrl": "https://www.eia.gov/electricity/gridmonitor/sixMonthFiles/EIA930_BALANCE_2025_Jul_Dec.csv",
    "publicationRecord": "Files last modified 30 Oct 2026, read 31 Oct 2026",
    "scopeRecord": "Hourly demand and generation by source for the CAISO balancing area; battery output for CAISO appears under \"Other\". Its clock disagrees with CAISO's by about an hour, in opposite directions in the two files (CF-CAISO-06)",
    "rightsRecord": "Public domain (SRC-CAISO-21); fallback feed only"
  },
  "SRC-CAISO-21": {
    "title": "U.S. EIA, [Copyrights and Reuse](https://www.eia.gov/about/copyrights_reuse.php)",
    "primaryUrl": "https://www.eia.gov/about/copyrights_reuse.php",
    "publicationRecord": "Read 31 Oct 2026",
    "scopeRecord": "\"U.S. government publications are in the public domain and are not subject to copyright protection.\" The repository already treats EIA-860M this way (`etl/sources/eia-860m.mjs`)",
    "rightsRecord": "Attribute EIA"
  },
  "SRC-CAISO-22": {
    "title": "A utility's 2027 ERRA Fall Update testimony, [A.26-05-007](https://docs.cpuc.ca.gov/PublishedDocs/SupDoc/A2605007/9872/623865860.pdf), p. 12",
    "primaryUrl": "https://docs.cpuc.ca.gov/PublishedDocs/SupDoc/A2605007/9872/623865860.pdf",
    "publicationRecord": "16 Oct 2026",
    "scopeRecord": "The update does not reflect the storage foldback revisions of D.26-07-008 \"because the Master Resource Database modifications necessary to support those calculations have not yet been implemented\". A party's filing, not a CPUC finding",
    "rightsRecord": "`public-link-only`; refresh when the CPUC publishes the 2027 QC values"
  }
};
