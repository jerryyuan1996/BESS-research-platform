/** Annual periods from investment. Operating year 1 follows codOffset. */
export function investmentFlows(capitalFlows, codOffset, operations, tail = null){
  const flows = capitalFlows.slice();
  const add = (at, value) => {
    while (flows.length <= at) flows.push(0);
    flows[at] += value;
  };
  operations.forEach((value, i) => add(codOffset + i + 1, value));
  if (tail) add(codOffset + tail.at, tail.value);
  return flows;
}
