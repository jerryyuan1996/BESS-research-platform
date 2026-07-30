#!/usr/bin/env node
/* Read-only drift check for the governed GB FES and TEC snapshots.

   This command never writes to src/ or public/data/. It refetches the official
   tables, reruns the tested transforms and fails if the checked-in governed
   snapshot no longer matches. An analyst can then review and update the
   snapshot and metric vintage in one controlled change. */
import { fetchFes2025 } from './sources/neso-fes.mjs';
import { fetchTecRegister } from './sources/neso-tec-register.mjs';
import {
  GB_SYSTEM_EVOLUTION, GB_TEC_PIPELINE,
} from '../src/markets/gb/officialData.js';

const log = message => process.stdout.write(message + '\n');
const failures = [];

function close(actual, expected, tolerance = 1e-6){
  return Number.isFinite(actual) && Number.isFinite(expected) &&
    Math.abs(actual - expected) <= tolerance;
}

function sameSeries(name, actual, expected, tolerance = 1e-6){
  if (actual.length !== expected.length){
    failures.push(`${name}: length ${actual.length} != ${expected.length}`);
    return;
  }
  actual.forEach((value, index) => {
    if (!close(value, expected[index], tolerance)){
      failures.push(`${name}[${index}]: ${value} != ${expected[index]}`);
    }
  });
}

async function main(){
  log('GB official-source verification — read only');
  const [fes, tec] = await Promise.all([
    fetchFes2025({ log }),
    fetchTecRegister({ log }),
  ]);

  sameSeries('FES years', fes.years, GB_SYSTEM_EVOLUTION.years, 0);
  sameSeries('FES total demand', fes.demand.totalGWh, GB_SYSTEM_EVOLUTION.demand.totalGWh.values);
  sameSeries('FES peak demand', fes.demand.peakGW, GB_SYSTEM_EVOLUTION.demand.peakGW.values);
  sameSeries('FES data-centre demand', fes.demand.dataCentreGWh, GB_SYSTEM_EVOLUTION.demand.dataCentreGWh.values);
  sameSeries('FES batteries', fes.capacity.batteryNetworkGW, GB_SYSTEM_EVOLUTION.capacity.batteryGW.values);
  sameSeries('FES wind', fes.capacity.windGW, GB_SYSTEM_EVOLUTION.capacity.windGW.values);
  sameSeries('FES solar', fes.capacity.solarGW, GB_SYSTEM_EVOLUTION.capacity.solarGW.values);
  sameSeries('FES gas', fes.capacity.gasGW, GB_SYSTEM_EVOLUTION.capacity.gasGW.values);
  sameSeries('FES nuclear', fes.capacity.nuclearGW, GB_SYSTEM_EVOLUTION.capacity.nuclearGW.values);
  sameSeries('FES interconnectors', fes.capacity.interconnectorGW, GB_SYSTEM_EVOLUTION.capacity.interconnectorGW.values);
  sameSeries('FES LDES', fes.capacity.ldesGW, GB_SYSTEM_EVOLUTION.capacity.ldesGW.values);

  for (const [field, actual, expected] of [
    ['TEC source records', tec.sourceRecords, GB_TEC_PIPELINE.sourceRecords],
    ['TEC exact ESS rows', tec.exactEssRows, GB_TEC_PIPELINE.exactEssRows],
    ['TEC unique projects', tec.uniqueProjects, GB_TEC_PIPELINE.uniqueProjects],
    ['TEC built MW', tec.builtMW, GB_TEC_PIPELINE.builtMW],
    ['TEC forward MW', tec.forwardMW, GB_TEC_PIPELINE.forwardMW],
  ]){
    if (!close(actual, expected, 0)) failures.push(`${field}: ${actual} != ${expected}`);
  }
  sameSeries('TEC years', tec.years, GB_TEC_PIPELINE.years, 0);
  sameSeries('TEC raw MW', tec.rawMW, GB_TEC_PIPELINE.rawMW, 0);
  sameSeries('TEC Gate 2 MW', tec.gate2MW, GB_TEC_PIPELINE.gate2MW, 0);
  sameSeries('TEC Gate 1 MW', tec.gate1MW, GB_TEC_PIPELINE.gate1MW, 0);
  sameSeries('TEC Gate unpopulated MW', tec.gateUnpopulatedMW, GB_TEC_PIPELINE.gateUnpopulatedMW, 0);
  sameSeries('TEC analyst-weighted MW', tec.analystWeightedMW, GB_TEC_PIPELINE.analystWeightedMW, 0);

  if (failures.length){
    log('');
    for (const failure of failures) log(`DRIFT: ${failure}`);
    process.exitCode = 1;
    return;
  }

  log(`FES matched ${fes.years.join('/')}; TEC matched ${tec.uniqueProjects} normalized exact-ESS projects.`);
}

main().catch(error => {
  process.stderr.write(`GB official-source verification failed: ${error.stack || error.message}\n`);
  process.exitCode = 1;
});

