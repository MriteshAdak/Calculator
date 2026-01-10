import { Operator } from './operators.js';

export interface CalculatorState {
    stack: string[];
    operand1: number | undefined;
    operand2: number | undefined;
    operator: Operator | undefined;
}
