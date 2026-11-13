// The same published narrative serves the research overview and the market entrance.
export const CORE_STORYLINE = {
  revenue: [
    'Romania is an energy-only market with no capacity mechanism, so storage earns from wholesale spreads and balancing services and is capitalised — not remunerated — by state aid.',
    '罗马尼亚是没有容量机制的单一电能量市场，因此储能收入来自批发价差与平衡服务，而国家援助提供的是资本化支持而非收入报酬。',
  ],
  opportunity: [
    'Solar build-out has created a deep midday trough and a steep evening ramp, which is a genuine arbitrage opportunity.',
    '光伏扩张形成了深度午间低谷与陡峭晚间爬坡，构成真实的套利机会。',
  ],
  execution: [
    'But the binding constraints are administrative: an ATR and executed connection agreement, balancing prequalification, and a formal grant award rather than a scheme budget.',
    '但关键约束是行政性的：ATR与已签并网合同、平衡市场预认证、以及正式补贴授予（而非计划预算）。',
  ],
  conclusion: [
    'Value is created by clearing those gates, not by forecasting prices.',
    '价值来自跨越这些门槛，而非来自预测价格。',
  ],
};

export const CORE_STORYLINE_TEXT = [0, 1].map(language =>
  Object.values(CORE_STORYLINE).map(pair => pair[language]).join(language === 0 ? ' ' : ''));
