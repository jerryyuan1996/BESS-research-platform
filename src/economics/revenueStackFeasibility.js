/* Project-level physical constraints for a stacked BESS revenue case.

   Market screening usually does not have these inputs. Absence is therefore
   UNKNOWN, never PASS. When a project supplies the record, simultaneous MW and
   reserved-energy obligations are checked against one battery and one grid
   connection. */

const finiteNonNegative = value => Number.isFinite(value) && value >= 0;

export function validateRevenueStackConstraints(record){
  const problems = [];
  for (const field of ['connectionMW', 'usableMWh', 'availabilityPct']){
    if (!finiteNonNegative(record?.[field])) problems.push(field + ' must be a non-negative number');
  }
  if (finiteNonNegative(record?.availabilityPct) && record.availabilityPct > 100){
    problems.push('availabilityPct must not exceed 100');
  }
  if (!Array.isArray(record?.commitments)) problems.push('commitments must be an array');
  for (const [index, item] of (record?.commitments || []).entries()){
    if (!item?.id) problems.push('commitments[' + index + '].id is required');
    if (!finiteNonNegative(item?.simultaneousMW)) problems.push('commitments[' + index + '].simultaneousMW must be non-negative');
    if (!finiteNonNegative(item?.reservedMWh)) problems.push('commitments[' + index + '].reservedMWh must be non-negative');
  }
  return problems;
}

export function evaluateRevenueStackFeasibility(record){
  if (!record){
    return {
      status: 'unknown',
      allocationReady: false,
      problems: ['Project state-of-charge, connection and availability constraints are not supplied.'],
      simultaneousMW: null,
      reservedMWh: null,
    };
  }

  const problems = validateRevenueStackConstraints(record);
  if (problems.length){
    return { status: 'invalid', allocationReady: false, problems, simultaneousMW: null, reservedMWh: null };
  }

  const simultaneousMW = record.commitments.reduce((sum, item) => sum + item.simultaneousMW, 0);
  const reservedMWh = record.commitments.reduce((sum, item) => sum + item.reservedMWh, 0);
  const availableMW = record.connectionMW * record.availabilityPct / 100;
  if (simultaneousMW > availableMW + 1e-9){
    problems.push('simultaneous commitments exceed the availability-adjusted grid connection');
  }
  if (reservedMWh > record.usableMWh + 1e-9){
    problems.push('reserved state of charge exceeds usable energy');
  }

  return {
    status: problems.length ? 'fail' : 'pass',
    allocationReady: problems.length === 0,
    problems,
    simultaneousMW,
    reservedMWh,
    availableMW,
  };
}

