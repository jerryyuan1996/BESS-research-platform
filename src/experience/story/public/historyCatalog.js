/* This flag preserves original history provenance and the absence of a legacy
   investor Story. The 14 Nov public value/revenue reading covers all 18 markets. */
import {PUBLIC_CATALOG,PUBLIC_VERSION} from './catalog.js';
const only=(history)=>({version:PUBLIC_VERSION,historyOnly:true,status:'existing-research-history',history});
export const HISTORY_ONLY_CATALOG={
  ca_on:only(['2023 · The first storage procurements','2023年 · 首批储能采购']),
  sa:only(['November 2024 · SPPC opens Group 1','2024年11月 · SPPC启动第一组']),
  es:only(['2023 · Spreads before batteries','2023年 · 储能出现前的价差']),
};
export const PUBLIC_READING_CATALOG={...PUBLIC_CATALOG,...HISTORY_ONLY_CATALOG};
