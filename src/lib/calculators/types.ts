export interface PumpInput {
  flow_m3_per_h: number;
  head_m: number;
  velocity_m_s: number;
}

export interface PumpCalculated extends PumpInput {
  flow_m3_per_s: number;
}

export interface ValveResult {
  diameter_mm: number;
  pressure_m: number;
}

export interface CalculatorInputs {
  pump1: PumpInput;
  pump2: PumpInput;
  manifold_velocity_m_s: number;
}

export interface CalculatorResults {
  pump1: PumpCalculated;
  pump2: PumpCalculated;
  check_valve_k1: ValveResult;
  check_valve_k2: ValveResult;
  gate_valve_z1: ValveResult;
  gate_valve_z2: ValveResult;
  gate_valve_z3: ValveResult;
  gate_valve_z4: ValveResult;
  gate_valve_z5: ValveResult;
  length1: number;
  length2: number;
  length3: number;
}

export type CalculatorSchema = 
  | 'schema-01' | 'schema-02' | 'schema-03' | 'schema-04' 
  | 'schema-05' | 'schema-06' | 'schema-07' | 'schema-08'
  | 'schema-09' | 'schema-10' | 'schema-11' | 'schema-12'
  | 'schema-13' | 'schema-14' | 'schema-15' | 'schema-16'
  | 'schema-17';
