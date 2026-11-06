/** The durable run/job audit closes the cache-eviction/rerun hole. A prior
 * started policy job consumes the day's slot even if its API outcome is unknown.
 * This is conservative: automatic retries never make a second paid request. */
export async function dailyModelSlot({repository,runId,attempt,token,now=new Date(),fetcher=fetch}){
  if(!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repository||'')||!/^\d+$/.test(String(runId)))return {allowed:false,reason:'Invalid workflow identity'};
  if(Number(attempt)!==1)return {allowed:false,reason:'Rerun requires an independent next-day budget slot'};
  const day=new Date(now).toISOString().slice(0,10);const headers={accept:'application/vnd.github+json',authorization:`Bearer ${token}`};
  try{
    for(let page=1;page<=5;page++){
      const response=await fetcher(`https://api.github.com/repos/${repository}/actions/workflows/etl.yml/runs?created=${day}&per_page=100&page=${page}`,{headers});if(!response.ok)throw new Error('Run audit unavailable');const data=await response.json();if(!Array.isArray(data.workflow_runs))throw new Error('Malformed run audit');
      for(const run of data.workflow_runs||[]){
        if(String(run.id)===String(runId))continue;
        const jobs=await fetcher(`https://api.github.com/repos/${repository}/actions/runs/${run.id}/jobs?filter=all&per_page=100`,{headers});if(!jobs.ok)throw new Error('Job audit unavailable');const result=await jobs.json();
        if(!Array.isArray(result.jobs)||!Number.isInteger(result.total_count)||result.total_count>100||result.jobs.length!==result.total_count)throw new Error('Incomplete job audit');
        if((result.jobs||[]).some(job=>job.name==='Policy research, gated shadow'&&job.conclusion!=='skipped'&&String(job.started_at||'').startsWith(day)&&job.runner_id))return {allowed:false,reason:'A policy research job already started in this UTC day'};
      }
      if((data.workflow_runs||[]).length<100)return {allowed:true,day};
    }
    return {allowed:false,reason:'Incomplete daily run audit'};
  }catch{return {allowed:false,reason:'Daily run/job audit unavailable; no model call permitted'};}
}
