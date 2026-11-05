import { appendFile } from 'node:fs/promises';
import { dailyModelSlot } from '../../policy/daily-slot.mjs';
const slot=await dailyModelSlot({repository:process.env.GITHUB_REPOSITORY,runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT,token:process.env.GH_READ_TOKEN});
if(process.env.GITHUB_OUTPUT)await appendFile(process.env.GITHUB_OUTPUT,`allowed=${slot.allowed}\n`);
console.log(JSON.stringify(slot));
if(!slot.allowed)process.exitCode=1;
