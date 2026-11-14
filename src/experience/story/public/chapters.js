// Lightweight shared chapter labels; no content or approval graph.
export const CHAPTERS = [
  ['history',['Historical background','历史背景']],
  ['overview',['Market Overview','市场概览']],
  ['system',['System tensions','系统矛盾']],
  ['mechanism',['Market mechanism','市场机制']],
  ['storage',['Storage value','储能价值']],
  ['investment',['Investment decision','回到投资决策']],
  ['research',['Sources & further research','深入研究与来源']],
];
export function publicChapters(id, historyOnly = false) {
  return [CHAPTERS[0],CHAPTERS[1],
    ['system',['How storage creates value','储能如何创造价值']],
    ['mechanism',['How revenue becomes cash','收入如何兑现']],CHAPTERS[5],CHAPTERS[6]];
}
// Old storage links remain readable after the duplicated equipment chapter retires.
export const resolvePublicChapter=(market,chapter)=>chapter==='storage'?'system':chapter;
