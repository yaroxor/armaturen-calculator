import type { CalculatorSchema, CalculatorInputs, CalculatorResults } from './types';
import * as schema01 from './schema-01';

/**
 * Calculator function type
 */
export type CalculatorFunction = (inputs: CalculatorInputs) => CalculatorResults;

/**
 * Calculator metadata
 */
export interface CalculatorInfo {
  id: CalculatorSchema;
  name: string;
  description: string;
  calculate: CalculatorFunction;
  // Optional: diagram component path or type
  diagramComponent?: string;
}

/**
 * Registry of all calculator schemas
 */
export const calculatorRegistry: Record<CalculatorSchema, CalculatorInfo> = {
  'schema-01': {
    id: 'schema-01',
    name: 'Схема 01 - Двухнасосная система',
    description: 'Расчет для двухнасосной системы с гребенкой',
    calculate: schema01.calculate,
    diagramComponent: 'Schema01Diagram'
  }
};

/**
 * Get calculator by schema ID
 */
export function getCalculator(schemaId: CalculatorSchema): CalculatorInfo {
  const calculator = calculatorRegistry[schemaId];
  if (!calculator) {
    throw new Error(`Calculator not found for schema: ${schemaId}`);
  }
  return calculator;
}

/**
 * Get all available calculators
 */
export function getAllCalculators(): CalculatorInfo[] {
  return Object.values(calculatorRegistry);
}
