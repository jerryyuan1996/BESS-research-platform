/** Month-end is only a sorting bound. It never creates a deadline. */
export function eventDue(expected) {
  if (!expected) return null;
  if (/^\d{4}-\d{2}$/.test(expected)) {
    const [y,m]=expected.split('-').map(Number);
    return new Date(Date.UTC(y,m,0)).toISOString().slice(0,10);
  }
  return expected;
}
export function eventCountdown(e) {
  if (!e.expected || e.days == null) return ['Date to be announced','日期待公布'];
  if (e.expected.length === 7) return e.days < 0
    ? ['Expected month passed — outcome to confirm','预计月份已过，结果待核实']
    : ['Expected month; exact date unconfirmed','预计月份，具体日期待确认'];
  if (e.days < 0) return ['Date passed '+(-e.days)+' days ago — outcome to confirm','已过'+(-e.days)+'天，结果待确认'];
  if (!e.days) return ['Today','今天'];
  if (e.days === 1) return ['Tomorrow','明天'];
  return ['In '+e.days+' days',e.days+'天后'];
}
