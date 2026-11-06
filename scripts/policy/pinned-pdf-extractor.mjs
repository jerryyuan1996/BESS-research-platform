import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

export const PDF_REVIEW_ENGINE='pypdf';
export const PDF_REVIEW_VERSION='6.21.4';
const HELPER=fileURLToPath(new URL('./extract-review-pdf.py',import.meta.url));
const MAX_PDF_BYTES=10_000_000;
const MAX_TEXT_BYTES=1_000_000;

/** Manual, offline extraction only. Configuration is supplied by trusted code,
 * never candidate JSON. No source fetching, provider, approval or writer. */
export function createPinnedPDFExtractor({python='python',moduleRoot=null,timeoutMs=20_000,spawnProcess=spawn}={}){
  if(typeof python!=='string'||!python||!Number.isSafeInteger(timeoutMs)||timeoutMs<1||timeoutMs>30_000||
    (moduleRoot!==null&&(typeof moduleRoot!=='string'||!path.isAbsolute(moduleRoot))))throw Error('Invalid trusted PDF extractor configuration');
  const args=['-I',HELPER,...(moduleRoot===null?[]:['--module-root',moduleRoot])];
  const env=Object.fromEntries(['PATH','Path','SystemRoot','SYSTEMROOT','WINDIR','TEMP','TMP','LANG'].filter(k=>process.env[k]!==undefined).map(k=>[k,process.env[k]]));
  return Object.freeze({engine:PDF_REVIEW_ENGINE,version:PDF_REVIEW_VERSION,extract:async({bytes,pages})=>{
    if(!(bytes instanceof Uint8Array)||!bytes.byteLength||bytes.byteLength>MAX_PDF_BYTES||
      Buffer.from(bytes.subarray(0,5)).toString('ascii')!=='%PDF-'||!Array.isArray(pages)||!pages.length||pages.length>12||
      pages.some((p,i)=>!Number.isSafeInteger(p)||p<1||(i>0&&p<=pages[i-1])))throw Error('Bounded PDF bytes and ordered page selection required');
    return new Promise((resolve,reject)=>{
      let child,settled=false,size=0,errorSize=0;const chunks=[],diagnostics=[];
      const finish=(error,result)=>{if(settled)return;settled=true;clearTimeout(timer);error?reject(error):resolve(result);};
      const stop=message=>{try{child?.kill();}catch{/* Only this owned helper may be stopped. */}finish(Error(message));};
      const timer=setTimeout(()=>stop('Pinned PDF extraction timed out'),timeoutMs);
      try{child=spawnProcess(python,args,{stdio:['pipe','pipe','pipe'],windowsHide:true,env});}
      catch{finish(Error('Pinned PDF extraction could not start'));return;}
      child.once('error',()=>finish(Error('Pinned PDF extraction could not start')));
      child.stdout.on('data',chunk=>{size+=Buffer.byteLength(chunk);if(size>MAX_TEXT_BYTES){stop('Pinned PDF extraction output exceeds bound');return;}chunks.push(Buffer.from(chunk));});
      child.stderr.on('data',chunk=>{errorSize+=Buffer.byteLength(chunk);if(errorSize>65_536){stop('Pinned PDF extraction diagnostics exceed bound');return;}diagnostics.push(Buffer.from(chunk));});
      child.stdin.on('error',()=>finish(Error('Pinned PDF extraction input failed')));
      child.once('close',code=>{
        if(settled)return;
        if(code!==0){const phase=/PDF_REVIEW_REJECTED:(setup|package_version|request_decode|pdf_parse|public_copy_permission|page_extract|output_bound)\b/.exec(Buffer.concat(diagnostics).toString('utf8'))?.[1];finish(Error(`Pinned PDF extraction failed${phase?' at '+phase:''}; source remains unadmitted`));return;}
        let result;try{result=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{finish(Error('Pinned PDF extraction returned invalid JSON'));return;}
        if(!result||Object.keys(result).sort().join(',')!=='engine,pages,version'||result.engine!==PDF_REVIEW_ENGINE||result.version!==PDF_REVIEW_VERSION||
          !Array.isArray(result.pages)||result.pages.length!==pages.length||result.pages.some((p,i)=>!p||Object.keys(p).sort().join(',')!=='page,text'||p.page!==pages[i]||typeof p.text!=='string')){
          finish(Error('Pinned PDF extraction engine, version or pages differ'));return;
        }
        finish(null,result.pages);
      });
      try{child.stdin.end(JSON.stringify({bytes:Buffer.from(bytes).toString('base64'),pages}));}
      catch{stop('Pinned PDF extraction input failed');}
    });
  }});
}
