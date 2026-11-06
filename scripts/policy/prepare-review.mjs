import {readFile,lstat,realpath,mkdir,open} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createPinnedPDFExtractor} from './pinned-pdf-extractor.mjs';
import {verifyPDFExtraction,verifyPDFSectionExtraction,hasVerifiedExtraction} from '../../policy/extracted-evidence.mjs';
import {digest,sourceDigest} from '../../policy/integrity.mjs';
import {originalHash,literalReviewChecks,requireUnapprovedProposal,proposedMateriality,buildPilotDraft,combinePilotDrafts,proposePDFRanges} from '../../policy/review-bundle.mjs';
import {policyModelRequest} from '../../policy/model-contract.mjs';
import {POLICY_SYSTEM} from '../../policy/shadow.mjs';
import {priorPolicySummary} from '../../policy/merge.mjs';
import {independentlyValidate} from '../../policy/validation.mjs';
import {TRUSTED_POLICY_PROFILES} from '../../policy/validation-profiles.mjs';
import {scanManualEvidence} from './manual-evaluation-guards.mjs';
import {publicInvestmentReferences} from './public-references.mjs';
import {proposedReviewProfiles} from './proposed-review-profiles.mjs';

const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const PROPOSAL=path.join(REPO,'policy','review-proposals.json');
const OUTPUT_PARTS=['etl','out','policy-review','offline-preparation'];
const args=process.argv.slice(2);const options={};
for(let i=0;i<args.length;i+=2){if(!['--source-root','--pypdf-root'].includes(args[i])||!args[i+1]||options[args[i]])throw Error('Usage: prepare-review.mjs --source-root <public-originals> [--pypdf-root <trusted-package-directory>]');options[args[i]]=args[i+1];}
if(!options['--source-root'])throw Error('An explicit public-originals directory is required');

async function nonSymbolic(target){
  const absolute=path.resolve(target),parsed=path.parse(absolute);let current=parsed.root;
  for(const part of absolute.slice(parsed.root.length).split(path.sep).filter(Boolean)){current=path.join(current,part);const st=await lstat(current);if(st.isSymbolicLink())throw Error('Symbolic review path rejected');}
  return absolute;
}
const sourceRoot=await realpath(await nonSymbolic(options['--source-root']));
if(sourceRoot.split(/[\\/]/).some(part=>part.toLowerCase()==='local-data')||sourceRoot===REPO||sourceRoot.startsWith(path.join(REPO,'public')+path.sep)||sourceRoot.startsWith(path.join(REPO,'dist')+path.sep))throw Error('Private or public build paths cannot be source intake directories');
const rawProposal=await readFile(PROPOSAL,'utf8');const proposal=JSON.parse(rawProposal);requireUnapprovedProposal(proposal);
const now=new Date().toISOString();const bytes=new Map(),units=new Map(),proofs=new Map();
const documents=new Map(proposal.documents.map(d=>[d.id,d]));
const baseExtractor=createPinnedPDFExtractor({moduleRoot:options['--pypdf-root']?await nonSymbolic(options['--pypdf-root']):null});
const pageCache=new Map();
const extractor={engine:baseExtractor.engine,version:baseExtractor.version,extract:async({bytes,pages})=>{
  const key=originalHash(bytes)+':'+pages.join(',');if(!pageCache.has(key))pageCache.set(key,baseExtractor.extract({bytes,pages}));return structuredClone(await pageCache.get(key));
}};
for(const d of proposal.documents){
  const file=await nonSymbolic(path.join(sourceRoot,d.file));
  if(path.dirname(file)!==sourceRoot)throw Error('Source path escaped the explicit intake directory');
  const stat=await lstat(file);if(!stat.isFile()||stat.size!==d.originalBytes||stat.size>10_000_000)throw Error(`${d.id}: original byte bound differs`);
  const data=await readFile(file);if(originalHash(data)!==d.originalByteHash)throw Error(`${d.id}: original byte hash differs`);bytes.set(d.id,data);
}
async function evidenceUnit(id,documentId,pages,locator){
  const d=documents.get(documentId),data=bytes.get(documentId);if(!d||!data)throw Error('Unreviewed source identity');
  let body;
  if(d.mediaType==='application/pdf'){
    try{body=(await extractor.extract({bytes:data,pages})).map(p=>p.text).join('\n\f\n');}catch(error){throw Error(`${id}: ${error.message}`);}
  }
  else body=new TextDecoder(d.charset,{fatal:true}).decode(data);
  const unit={id,documentId,locator,body,pages,originalByteHash:d.originalByteHash,textHash:sourceDigest(body),utf8Identity:Buffer.from(body,'utf8').equals(data)};
  units.set(id,unit);return unit;
}
const corpus=[];const diagnostics=[];
function prospectiveInputBound(row){
  const evidence=JSON.stringify([{sourceId:row.source.id,source:row.source,evidence:row.body}]);
  const request=policyModelRequest({system:POLICY_SYSTEM,evidence,previousPolicy:priorPolicySummary(null),model:'claude-haiku-4-5-20251001',maxOutputTokens:3000});
  return Buffer.byteLength(JSON.stringify(request),'utf8')+1024;
}
for(const c of proposal.cases){
  const d=documents.get(c.sourceId),unit=await evidenceUnit(c.id,c.sourceId,c.pages,c.locator);
  const source={id:'src-'+c.id,url:d.url,publisher:d.publisher,title:d.title,language:d.language,authority:'official',locator:c.locator,contentHash:unit.textHash,issuedAt:null,checkedAt:new Date(d.retrievedAt).toISOString(),rights:{metadata:true,termsURL:d.rightsEvidence.termsURL,reviewed:false}};
  const row={id:c.id,market:c.market,mediaType:d.mediaType,locator:c.locator,originalByteHash:unit.originalByteHash,body:unit.body,source,expectedReview:null,actualReview:null,reviewer:null,sourceReviewed:false,rightsReviewed:false,translationReviewed:false};
  let processLocalPDFProof=false,bodyPolicy=d.mediaType==='application/pdf'?'full_selected_pages':'unmodified_html';
  if(d.mediaType==='application/pdf'){
    row.extraction={engine:extractor.engine,version:extractor.version,pages:[...c.pages],textHash:unit.textHash};
    const receipt=await verifyPDFExtraction(row,{bytes:bytes.get(c.sourceId),extractor});proofs.set(c.id,receipt);processLocalPDFProof=hasVerifiedExtraction(row,receipt);
    if(prospectiveInputBound(row)>12000){
      const pages=await extractor.extract({bytes:bytes.get(c.sourceId),pages:c.pages});
      const ranges=proposePDFRanges(pages,c.literalChecks,{rules:c.excerptRules??null});
      if(ranges.length){
        const byPage=new Map(pages.map(p=>[p.page,p.text]));
        row.body=ranges.map(r=>byPage.get(r.page).slice(r.start,r.end)).join('\n\f\n');row.source.contentHash=sourceDigest(row.body);
        row.extraction={...row.extraction,ranges,textHash:row.source.contentHash};
        const proof=await verifyPDFSectionExtraction(row,{bytes:bytes.get(c.sourceId),extractor,selection:ranges});
        proofs.set(c.id,proof);processLocalPDFProof=hasVerifiedExtraction(row,proof);bodyPolicy='verified_page_ranges';
      }
    }
  }
  const clean=await scanManualEvidence({body:unit.body,source});if(!clean)throw Error(`${c.id}: original confidentiality guard rejected selected evidence; values withheld`);
  const checks=literalReviewChecks(unit.body,c.literalChecks),materiality=proposedMateriality(c);
  const inputBound=prospectiveInputBound(row),excerptChecks=literalReviewChecks(row.body,c.literalChecks);
  diagnostics.push({id:c.id,market:c.market,originalByteHash:unit.originalByteHash,textHash:unit.textHash,modelTextHash:row.source.contentHash,pages:c.pages,literalChecks:checks,literalChecksPassed:checks.every(x=>x.found),processLocalPDFProof,utf8Identity:unit.utf8Identity,
    proposedExpectedReview:c.proposedExpectedReview,labelFollowsExistingMechanismRule:(materiality.outcome==='material_investment_review')===c.proposedExpectedReview,proposedMateriality:materiality.outcome,
    bodyPolicy,excerptLiteralChecks:excerptChecks,excerptLiteralChecksPassed:excerptChecks.every(x=>x.found),excerptSelectionReviewed:false,prospectiveInputByteBound:inputBound,fits12000InputBound:inputBound<=12000,readyForPaidEvaluation:false,independentSemanticAcceptance:false});
  corpus.push(row);
}
for(const pilot of proposal.pilots)await evidenceUnit('core-'+pilot.market,pilot.lifecycle.sourceId,pilot.lifecycle.pages,pilot.lifecycle.locator);
const drafts=proposal.pilots.map(p=>buildPilotDraft(p,proposal,units,now));
const combined=combinePilotDrafts(drafts,now);
const profileDrafts=proposedReviewProfiles({proposal,drafts:[...drafts,combined],corpus,sourceRoot,extractor});
for(const draft of [...drafts,combined]){
  const validation=independentlyValidate({snapshot:draft.snapshot,bodies:draft.bodies,profiles:TRUSTED_POLICY_PROFILES,marketIds:['de','gb','nem','wa']});
  draft.manifest.independentValidationPassed=validation.valid;draft.manifest.independentValidationErrors=validation.errors;
  if(validation.valid)throw Error('Review preparation unexpectedly obtained publication validation');
}
const publicReferences=await publicInvestmentReferences(['de','gb','nem','wa']);
const dependencyReasons={de:'Draft tariffs and capacity eligibility are triggers to examine the existing fee-risk and technology assumptions, not observed income for the reference battery.',gb:'Connection timetables and Capacity Market rules must be checked against the existing separation of connection, derating and realized revenue.',nem:'Registration, market-cost and tender eligibility facts must be checked against the existing distinction between framework, project award and observed floor.',wa:'Commencement, capacity pricing and essential-service accreditation must be checked separately against the existing capacity-led thesis.'};
const dependencies=proposal.cases.filter(c=>c.mechanism!=='context').map(c=>{const target=`view/markets/${c.market}.json#thesis`,record=publicReferences[target];return {caseId:c.id,claimId:'cl-'+c.id,market:c.market,mechanism:c.mechanism,target,exists:!!record,publicRecordHash:record?digest(record):null,state:'unmapped',approved:false,baselineApprovedAt:null,reason:dependencyReasons[c.market],blocker:'The public record has no approvedAt metadata. Analyst confirmation of the exact baseline and claim-to-judgment mapping is required; no date is inferred from Git or retrieval time.'};});
const failures=diagnostics.filter(d=>!d.literalChecksPassed||!d.labelFollowsExistingMechanismRule).map(d=>d.id);
const snapshotProblems=[...drafts,combined].flatMap(d=>d.manifest.structuralProblems.map(problem=>({market:d.manifest.market,problem})));
const head=execFileSync('git',['rev-parse','HEAD'],{cwd:REPO,encoding:'utf8'}).trim();
const implementationFiles=['policy/review-bundle.mjs','policy/extracted-evidence.mjs','policy/evidence-values.mjs','scripts/policy/prepare-review.mjs','scripts/policy/proposed-review-profiles.mjs','scripts/policy/review-evidence-io.mjs','scripts/policy/pinned-pdf-extractor.mjs','scripts/policy/extract-review-pdf.py','scripts/policy/requirements-review.txt'];
const implementationHashes=Object.fromEntries(await Promise.all(implementationFiles.map(async file=>[file,originalHash(await readFile(path.join(REPO,file)))])));
const manifest={schemaVersion:1,createdAt:now,worktreeHead:head,preparationImplementationHash:digest(implementationHashes),implementationHashes,proposalHash:sourceDigest(rawProposal),public:false,publicationApproved:false,activationChanged:false,acceptedGoldCases:0,providerRequests:0,empiricalModelPrecision:null,falsePositive:null,falseNegative:null,
  sourceDocuments:proposal.documents.length,cases:diagnostics,caseCount:corpus.length,caseFailures:failures,pilots:drafts.map(d=>d.manifest),combinedCandidate:combined.manifest,proposedProfileCount:profileDrafts.length,structuralProblems:snapshotProblems,dependencyCandidates:dependencies,
  evaluationMeaning:'Original-byte and pinned-text checks plus literal replay. Proposed labels are not independently accepted. No paid model was invoked; no empirical model measurement or approved corpus is produced.'};
const runId=digest(manifest);let directory=REPO;
for(const part of [...OUTPUT_PARTS,runId]){directory=path.join(directory,part);try{if((await lstat(directory)).isSymbolicLink())throw Error('Symbolic output path rejected');}catch(error){if(error.code!=='ENOENT')throw error;await mkdir(directory);}}
if(execFileSync('git',['check-ignore',path.relative(REPO,directory).replaceAll('\\','/')+'/manifest.json'],{cwd:REPO,encoding:'utf8'}).trim()==='')throw Error('Private output is not ignored');
async function write(name,value){const file=path.join(directory,name);const handle=await open(file,'wx');try{await handle.writeFile(JSON.stringify(value,null,2)+'\n');await handle.sync();}finally{await handle.close();}}
await write('manifest.json',manifest);await write('candidate-corpus.json',{schemaVersion:1,approvalState:'unapproved',acceptedGoldCases:0,cases:corpus});
await write('source-profile-drafts.json',{approvalState:'unapproved',profiles:profileDrafts.map(p=>p.manifest)});
for(const draft of drafts)await write(draft.manifest.market+'-snapshot-candidate.json',draft.snapshot);
await write('four-market-snapshot-candidate.json',combined.snapshot);
let markdown='# Policy pilot review packet / 政策试点审阅包\n\nPrivate unapproved drafts. Accepted gold cases: 0. No model request or publication. / 私有未批准草稿；正式金标准案例为零，未调用模型或发布。\n\n';
for(const draft of drafts){const story=draft.snapshot.stories[0];markdown+=`## ${story.title[0]} / ${story.title[1]}\n\nSnapshot SHA-256: ${draft.manifest.candidateHash}\n\n${story.answer.join('\n\n')}\n\n`;for(const chapter of story.chapters)markdown+=`### ${chapter.title.join(' / ')}\n\n${chapter.text.join('\n\n')}\n\nClaims: ${chapter.claimIds.join(', ')}\n\n`;markdown+=`What changes this / 何种证据会改变判断：\n\n${story.changesIf.join('\n\n')}\n\n`;}
markdown+='## Proposed labels / 建议标签\n\nExpected and actual accepted labels remain null. / 获批预期标签和实际输出均为空。\n\n';
for(const c of proposal.cases){const d=documents.get(c.sourceId);markdown+=`- ${c.id}: proposed review=${c.proposedExpectedReview}; ${d.url}; ${c.locator}\n  - ${c.referenceFact[0]}\n  - ${c.referenceFact[1]}\n`;}
if(await scanManualEvidence({body:markdown,source:{title:'Private policy review packet'}})!==true)throw Error('Review prose confidentiality guard rejected');
const prose=await open(path.join(directory,'review.md'),'wx');try{await prose.writeFile(markdown);await prose.sync();}finally{await prose.close();}
console.log(JSON.stringify({outputDirectory:directory,runId,sourceDocuments:proposal.documents.length,cases:corpus.length,literalFailures:failures,structuralProblems:snapshotProblems,pilots:drafts.length,acceptedGoldCases:0,providerRequests:0,publicationApproved:false}));
if(failures.length||snapshotProblems.length)process.exitCode=1;
