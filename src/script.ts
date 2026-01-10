import { Operator } from './operators.js';
import { ButtonAction } from './actions.js';
import { CalculatorState } from './caclulationService.js';

class Calculator {
    private state: CalculatorState;
    private display: HTMLElement;
    private readonly maxDisplayLength = 11;

    constructor(displayElement: HTMLElement) {
        this.display = displayElement;
        this.state = {
            stack: [],
            operand1: undefined,
            operand2: undefined,
            operator: undefined
        };
    }

    handleInput(input: string): void {
        if (input === ButtonAction.Delete) {
            this.backspace();
        } else if (this.isOperator(input)) {
            this.operate(input as Operator);
        } else if (input === ButtonAction.Reset) {
            this.reset();
        } else if (input === ButtonAction.Clear) {
            this.clear();
        } else if (input === ButtonAction.Equals) {
            this.equals();
        } else if (input === '.') {
            this.addDecimal();
        } else if (this.isDigit(input)) {
            this.addDigit(input);
        }
    }

    private isOperator(input: string): boolean {
        return Object.values(Operator).includes(input as Operator);
    }

    private isDigit(input: string): boolean {
        return /^[0-9]$/.test(input);
    }

    private addDigit(digit: string): void {
        this.state.stack.push(digit);
        this.updateDisplay();
    }

    private addDecimal(): void {
        if (!this.state.stack.includes('.')) {
            this.state.stack.push('.');
            this.updateDisplay();
        }
    }

    private operate(operator: Operator): void {
        if (this.state.stack.length === 0) {
            this.state.operator = operator;
            return;
        }

        if (this.state.operand1 === undefined) {
            this.state.operand1 = this.parseNumber(this.state.stack);
            this.state.stack = [];
        } else {
            this.state.operand2 = this.parseNumber(this.state.stack);
            this.state.operand1 = this.calculate(
                this.state.operand1,
                this.state.operator!,
                this.state.operand2
            );
            this.state.stack = [String(this.state.operand1)];
            this.updateDisplay();
            this.state.stack = [];
        }
        
        this.state.operator = operator;
    }

    private equals(): void {
        if (
            this.state.stack.length !== 0 &&
            this.state.operand1 !== undefined &&
            this.state.operator !== undefined
        ) {
            this.state.operand2 = this.parseNumber(this.state.stack);
            this.state.operand1 = this.calculate(
                this.state.operand1,
                this.state.operator,
                this.state.operand2
            );
            this.state.stack = [String(this.state.operand1)];
            this.updateDisplay();
            this.state.stack = [];
        }
    }

    private calculate(a: number, operator: Operator, b: number): number {
        const operations: Record<Operator, (x: number, y: number) => number> = {
            [Operator.Add]: (x, y) => x + y,
            [Operator.Subtract]: (x, y) => x - y,
            [Operator.Multiply]: (x, y) => x * y,
            [Operator.Divide]: (x, y) => {
                if (y === 0) return 0; // Handle division by zero
                return x / y;
            }
        };

        const result = operations[operator](a, b);
        
        return Number.isInteger(result) 
            ? result 
            : parseFloat(result.toFixed(2));
    }

    private parseNumber(stack: string[]): number {
        const joined = stack.join('');
        return stack.includes('.') 
            ? parseFloat(joined) 
            : parseInt(joined);
    }

    private reset(): void {
        this.state = {
            stack: [],
            operand1: undefined,
            operand2: undefined,
            operator: undefined
        };
        this.updateDisplay();
    }

    private backspace(): void {
        this.state.stack.pop();
        this.updateDisplay();
    }

    private clear(): void {
        this.state.stack = [];
        this.updateDisplay();
    }

    private updateDisplay(): void {
        let value = this.state.stack.join('');
        
        if (value.length > this.maxDisplayLength) {
            value = value.slice(0, this.maxDisplayLength);
        }

        this.display.textContent = value;
    }
}

// Initialize the calculator
const buttonsElement = document.querySelector<HTMLElement>('#buttons');
const displayElement = document.querySelector<HTMLElement>('#display');

if (!buttonsElement || !displayElement) {
    throw new Error('Required DOM elements not found');
}

const calculator = new Calculator(displayElement as HTMLElement);

buttonsElement.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.textContent;
    
    if (button) {
        calculator.handleInput(button);
    }
});