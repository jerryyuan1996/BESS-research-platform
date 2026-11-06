/* Original research events, never approval of the new public edition.
   Line references are audited against the immutable pre-patch source tree. */
export const APPROVAL_RECORD_COMMIT='966ce1af673590620518bfae5ee163621eab3369';
const ref=(path,line)=>({path,line});
const board=slug=>ref(`docs/immersive-experience-plan/${slug}-storyboard.md`,4);
const registry=ref('src/experience/story/registry.js',1);
const record=(slug,previousDisplayOn,{supplements=[],g2On=null,g2Record=registry,configured=true}={})=>({
  g1Record:board(slug),previousDisplayOn,supplements,
  originalG2:{configured,on:g2On,record:g2Record},
});
const japan=()=>record('japan','2026-11-05',{g2On:'2026-11-06',g2Record:ref('docs/immersive-experience-plan/jp-g2-reuse-report.md',184)});
export const SCRIPT_APPROVAL_RECORDS={
  wa:record('western-australia','2026-10-30'),
  nem:record('nem','2026-11-05',{g2On:'2026-11-06',g2Record:ref('docs/immersive-experience-plan/nem-g2-release.md',3)}),
  gb:record('great-britain','2026-11-01'),
  de:record('germany','2026-10-31'),
  it:record('italy','2026-11-01'),
  ie:record('ireland','2026-11-02'),
  ro:record('romania','2026-11-02'),
  pl:record('poland','2026-11-01'),
  jp_tokyo:japan(),jp_kyushu:japan(),jp_hokkaido:japan(),
  pjm:record('pjm','2026-11-03',{g2On:'2026-11-04',g2Record:ref('docs/immersive-experience-plan/pjm-g2-release.md',3)}),
  ercot:record('ercot','2026-11-02',{configured:false}),
  caiso:record('caiso','2026-11-03',{
    supplements:[{on:'2026-11-03',record:ref('src/markets/caiso/story.js',1),scope:['caiso-03 timing amendment only; original scoped story.','仅 caiso-03 时间修订；适用原 Story 范围。']}],
    g2On:'2026-11-03',g2Record:ref('docs/immersive-experience-plan/caiso-g2-release.md',3),
  }),
  fi:record('finland','2026-11-01',{
    supplements:[{on:'2026-11-01',record:ref('docs/immersive-experience-plan/finland-storyboard.md',385),scope:['The six fi-03 nodes: four explanation fields in EN/ZH and supplementary source locators.','fi-03 六个节点的四项中英文解释字段及补充来源定位。']}],
  }),
};
export const approvalRecordUrl=record=>`https://github.com/jerryyuan1996/BESS-research-platform/blob/${APPROVAL_RECORD_COMMIT}/${record.path}#L${record.line}`;
