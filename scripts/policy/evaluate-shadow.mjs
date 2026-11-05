// Default entry is deliberately disconnected from credentials and transport.
// An analyst-reviewed corpus, explicit cost authorization and a separately
// reviewed runner/ledger are prerequisites to enabling a real invocation.
import {evaluationCorpusProblems} from '../../policy/manual-evaluation.mjs';
const cases=[];
console.log(JSON.stringify({status:'disabled',mode:'manual-shadow',canPublish:false,paidCalls:0,blockers:evaluationCorpusProblems(cases)}));
