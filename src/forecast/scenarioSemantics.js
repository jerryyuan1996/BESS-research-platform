export const SCENARIO_CASE = Object.freeze({
  BEAR: 'bear',
  BASE: 'base',
  BULL: 'bull',
});

export const SCENARIO_LENS = Object.freeze({
  BESS_OWNER: 'bess-owner',
  SYSTEM: 'system',
});

export const SCENARIO_LENS_LABEL = Object.freeze({
  [SCENARIO_LENS.BESS_OWNER]: ['BESS-owner return lens', '储能业主回报视角'],
  [SCENARIO_LENS.SYSTEM]: ['Power-system outcome lens', '电力系统结果视角'],
});

export const SCENARIO_SEMANTICS = Object.freeze({
  [SCENARIO_LENS.BESS_OWNER + ':' + SCENARIO_CASE.BEAR]: {
    lens: SCENARIO_LENS.BESS_OWNER,
    caseId: SCENARIO_CASE.BEAR,
    label: ['BESS-owner Bear', '储能业主悲观情景'],
    objective: ['Lower project cash flow and return than Base', '项目现金流及回报低于基准情景'],
  },
  [SCENARIO_LENS.BESS_OWNER + ':' + SCENARIO_CASE.BASE]: {
    lens: SCENARIO_LENS.BESS_OWNER,
    caseId: SCENARIO_CASE.BASE,
    label: ['BESS-owner Base', '储能业主基准情景'],
    objective: ['Approved central underwriting case', '经批准的中央承销情景'],
  },
  [SCENARIO_LENS.BESS_OWNER + ':' + SCENARIO_CASE.BULL]: {
    lens: SCENARIO_LENS.BESS_OWNER,
    caseId: SCENARIO_CASE.BULL,
    label: ['BESS-owner Bull', '储能业主乐观情景'],
    objective: ['Higher project cash flow and return than Base', '项目现金流及回报高于基准情景'],
  },
  [SCENARIO_LENS.SYSTEM + ':' + SCENARIO_CASE.BEAR]: {
    lens: SCENARIO_LENS.SYSTEM,
    caseId: SCENARIO_CASE.BEAR,
    label: ['System Bear', '系统悲观情景'],
    objective: ['Higher reliability risk, constraints or consumer cost', '可靠性风险、系统约束或消费者成本上升'],
  },
  [SCENARIO_LENS.SYSTEM + ':' + SCENARIO_CASE.BASE]: {
    lens: SCENARIO_LENS.SYSTEM,
    caseId: SCENARIO_CASE.BASE,
    label: ['System Base', '系统基准情景'],
    objective: ['Official central plan or approved system baseline', '官方中央规划或经批准的系统基准'],
  },
  [SCENARIO_LENS.SYSTEM + ':' + SCENARIO_CASE.BULL]: {
    lens: SCENARIO_LENS.SYSTEM,
    caseId: SCENARIO_CASE.BULL,
    label: ['System Bull', '系统乐观情景'],
    objective: ['Lower reliability risk, constraints and consumer cost', '可靠性风险、系统约束及消费者成本下降'],
  },
});

export function scenarioSemantics(lens, caseId){
  return SCENARIO_SEMANTICS[lens + ':' + caseId] || null;
}

export function validateScenarioDefinition(definition){
  const problems = [];
  if (!Object.values(SCENARIO_LENS).includes(definition?.lens)) problems.push('unknown scenario lens');
  if (!Object.values(SCENARIO_CASE).includes(definition?.caseId)) problems.push('unknown scenario case');
  if (!Array.isArray(definition?.label) || definition.label.length !== 2 || definition.label.some(v => !v)){
    problems.push('label must be [en, zh]');
  }
  if (!Array.isArray(definition?.objective) || definition.objective.length !== 2 || definition.objective.some(v => !v)){
    problems.push('objective must be [en, zh]');
  }
  return problems;
}

