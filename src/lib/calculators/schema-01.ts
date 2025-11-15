import type { CalculatorInputs, CalculatorResults, PumpCalculated, ValveResult } from './types';

/**
 * Framework-agnostic calculation functions for Schema 01
 */

export function m3h_to_m3s(flow_m3_per_h: number): number {
  return flow_m3_per_h / 3600;
}

export function calculateDiameter(Q_m3s: number, V_m_s: number): number {
  if (!Number.isFinite(Q_m3s) || !Number.isFinite(V_m_s) || V_m_s === 0 || Q_m3s === 0) {
    return NaN;
  }
  return Math.sqrt((4 * Q_m3s) / (Math.PI * V_m_s)) * 1000;
}

export function calculatePressure(head_m: number): number {
  if (!Number.isFinite(head_m)) {
    return NaN;
  }
  return head_m * 0.1 * 1.1;
}

export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const pump1: PumpCalculated = {
    ...inputs.pump1,
    flow_m3_per_s: m3h_to_m3s(inputs.pump1.flow_m3_per_h)
  };

  const pump2: PumpCalculated = {
    ...inputs.pump2,
    flow_m3_per_s: m3h_to_m3s(inputs.pump2.flow_m3_per_h)
  };

  const check_valve_k1: ValveResult = {
    diameter_mm: calculateDiameter(pump1.flow_m3_per_s, pump1.velocity_m_s),
    pressure_m: calculatePressure(pump1.head_m)
  };

  const check_valve_k2: ValveResult = {
    diameter_mm: calculateDiameter(pump2.flow_m3_per_s, pump2.velocity_m_s),
    pressure_m: calculatePressure(pump2.head_m)
  };

  const gate_valve_z1: ValveResult = {
    diameter_mm: calculateDiameter(pump1.flow_m3_per_s, pump1.velocity_m_s),
    pressure_m: calculatePressure(pump1.head_m)
  };

  const gate_valve_z2: ValveResult = {
    diameter_mm: calculateDiameter(pump2.flow_m3_per_s, pump2.velocity_m_s),
    pressure_m: calculatePressure(pump2.head_m)
  };

  const combined_flow_m3s = (pump1.flow_m3_per_s + pump2.flow_m3_per_s) / 2;
  
  const max_head_m = Math.max(pump1.head_m, pump2.head_m);

  const gate_valve_z3: ValveResult = {
    diameter_mm: calculateDiameter(combined_flow_m3s, inputs.manifold_velocity_m_s),
    pressure_m: calculatePressure(max_head_m)
  };

  const gate_valve_z4: ValveResult = {
    diameter_mm: calculateDiameter(combined_flow_m3s, inputs.manifold_velocity_m_s),
    pressure_m: calculatePressure(max_head_m)
  };

  const gate_valve_z5: ValveResult = {
    diameter_mm: calculateDiameter(combined_flow_m3s, inputs.manifold_velocity_m_s),
    pressure_m: calculatePressure(max_head_m)
  };

  const length1: number = check_valve_k1.diameter_mm * 5;
  const length2: number = check_valve_k1.diameter_mm * 3;
  const length3: number = gate_valve_z3.diameter_mm * 3;

  return {
    pump1,
    pump2,
    check_valve_k1,
    check_valve_k2,
    gate_valve_z1,
    gate_valve_z2,
    gate_valve_z3,
    gate_valve_z4,
    gate_valve_z5,
    length1,
    length2,
    length3
  };
}
