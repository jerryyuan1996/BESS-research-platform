// Italy-only editorial pilot. Schematic states explain existing research; no
// dispatch, price, contract award or investor result is inferred from a drawing.
export const SYSTEM_STEPS=[
 {label:['01 · The mismatch','01 · 时段错配'],title:['Electricity can be abundant at the wrong hour.','电量充足的时刻，不一定是最需要电的时刻。'],
  body:['When solar output is strong and local export capacity is tight, extra electricity may have little local value. A battery needs a permitted place to charge.','当光伏出力充足、当地外送空间有限时，新增电量在当地的价值可能走低。电池首先要有合法、可用的充电接入。'],
  takeaway:['Check the local hourly price and charging access. Annual renewable share alone cannot price this opportunity.','先查当地小时电价与充电准入；全年可再生能源占比无法给这个机会定价。']},
 {label:['02 · Store locally','02 · 就地充电'],title:['The battery carries energy into a later hour.','电池把当前电量，留到之后使用。'],
  body:['With charging access and spare energy capacity, the battery absorbs electricity locally. Conversion losses and cycling consume part of the value.','在允许充电且有剩余容量时，电池吸收当地电量。转换损耗和循环衰减会消耗部分价值。'],
  takeaway:['Check import power, usable MWh, efficiency and cycling cost together.','把充电功率、可用电量、效率和循环成本放在一起核验。']},
 {label:['03 · Deliver later','03 · 择时交付'],title:['A later sale only works if the project can deliver.','晚些时候有需求，还要能把电送出去。'],
  body:['When demand rises and export access is available, the battery discharges. Its location and connection limit the power it can sell; storage does not remove a transmission bottleneck.','需求上升且允许送出时，电池才可放电。选址和并网条件限制了可售功率，储能本身不会消除输电瓶颈。'],
  takeaway:['Advance only with evidence for both a local spread and a usable charge/discharge connection.','本地价差与可用的双向并网条件，两项都要有证据，才值得推进。']},
];
export const REVENUE_ROUTES={
 capacity:{label:['Capacity market','容量市场'],unit:'MW',counterparty:['Terna','Terna'],
  promise:['Qualified available power','经认定的可用功率'],right:['Operate within availability and offer obligations','在可用性与报价义务内运营'],
  pay:['Contract premium for available capacity','为可用容量支付合同费用'],
  net:['Capacity premium + permitted trading income − clawbacks, penalties and costs','容量费 + 允许保留的交易收入 − 回拨、考核与成本'],
  check:['Confirm credited MW, delivery year, availability duties and revenue clawbacks in the actual contract.','核对实际合同的认定 MW、交付年份、可用性义务及收入回拨条款。'],sources:['SRC-IT-07','SRC-IT-09','SRC-IT-11']},
 macse:{label:['MACSE storage contract','MACSE 储能合同'],unit:'MWh',counterparty:['Terna / time-shifting users','Terna／时移使用者'],
  promise:['Contracted stored-energy capacity','签约储存电量'],right:['Contracted time-shifting use is allocated through the mechanism','签约电量的时移使用权按机制分配'],
  pay:['Fixed premium for contracted storage service','为约定储能服务支付固定溢价'],
  net:['Contract premium + allowed retained income − revenue returns, penalties and costs','合同溢价 + 允许保留的收入 − 收益返还、考核与成本'],
  check:['Establish who schedules the contracted capacity and which revenues the owner may retain. Full merchant upside cannot simply be added.','先确定签约容量由谁安排调度、业主可保留哪些收益；不能再简单叠加全部市场化套利收益。'],sources:['SRC-IT-14','SRC-IT-16','SRC-IT-19','SRC-IT-20']},
 merchant:{label:['Merchant trading','市场化交易'],unit:'MWh',counterparty:['Market counterparties','市场交易对手'],
  promise:['Energy sold and services actually delivered','实际成交电量与交付服务'],right:['Owner / optimiser chooses dispatch within grid and market rules','业主／优化商在电网与市场规则内安排调度'],
  pay:['Settlement for executed trades and services','按成交与交付结果结算'],
  net:['Settled sales − charging energy, fees, degradation and operating costs','已结算售电收入 − 充电电费、交易费、衰减与运营成本'],
  check:['Test realised local spreads after losses and fees, dispatch capability, and downside periods.','核验损耗和费用后的当地实际价差、调度能力与不利时段表现。'],sources:['SRC-IT-05','SRC-IT-06','SRC-IT-21']},
};
export const PAYMENT_STEPS=[['01 · What is sold','01 · 卖什么'],['02 · Who controls it','02 · 谁能使用'],['03 · What remains','03 · 留下什么']];
export function deliveryState(step,blocked){return step===0?'surplus':step===1?'charging':blocked?'constrained':'discharging';}
