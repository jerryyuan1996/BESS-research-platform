// Lightweight shared chapter labels; no content or approval graph.
export const CHAPTERS = [
  ['history',['Historical background','历史背景']],
  ['overview',['Market Overview','市场概览']],
  ['system',['System tensions','系统矛盾']],
  ['mechanism',['Market mechanism','市场机制']],
  ['storage',['Storage value','储能价值']],
  ['research',['Sources & further research','深入研究与来源']],
];
export function publicChapters(id, historyOnly = false) {
  return CHAPTERS.filter(([chapter]) => !historyOnly || ['history','overview','research'].includes(chapter));
}
