import { Operator } from './operators.js';
import { ButtonAction } from './actions.js';
class Calculator {
    constructor(displayElement) {
        this.maxDisplayLength = 11;
        this.display = displayElement;
        this.state = {
            stack: [],
            operand1: undefined,
            operand2: undefined,
            operator: undefined
        };
    }
    handleInput(input) {
        if (input === ButtonAction.Delete) {
            this.backspace();
        }
        else if (this.isOperator(input)) {
            this.operate(input);
        }
        else if (input === ButtonAction.Reset) {
            this.reset();
        }
        else if (input === ButtonAction.Clear) {
            this.clear();
        }
        else if (input === ButtonAction.Equals) {
            this.equals();
        }
        else if (input === '.') {
            this.addDecimal();
        }
        else if (this.isDigit(input)) {
            this.addDigit(input);
        }
    }
    isOperator(input) {
        return Object.values(Operator).includes(input);
    }
    isDigit(input) {
        return /^[0-9]$/.test(input);
    }
    addDigit(digit) {
        this.state.stack.push(digit);
        this.updateDisplay();
    }
    addDecimal() {
        if (!this.state.stack.includes('.')) {
            this.state.stack.push('.');
            this.updateDisplay();
        }
    }
    operate(operator) {
        if (this.state.stack.length === 0) {
            this.state.operator = operator;
            return;
        }
        if (this.state.operand1 === undefined) {
            this.state.operand1 = this.parseNumber(this.state.stack);
            this.state.stack = [];
        }
        else {
            this.state.operand2 = this.parseNumber(this.state.stack);
            this.state.operand1 = this.calculate(this.state.operand1, this.state.operator, this.state.operand2);
            this.state.stack = [String(this.state.operand1)];
            this.updateDisplay();
            this.state.stack = [];
        }
        this.state.operator = operator;
    }
    equals() {
        if (this.state.stack.length !== 0 &&
            this.state.operand1 !== undefined &&
            this.state.operator !== undefined) {
            this.state.operand2 = this.parseNumber(this.state.stack);
            this.state.operand1 = this.calculate(this.state.operand1, this.state.operator, this.state.operand2);
            this.state.stack = [String(this.state.operand1)];
            this.updateDisplay();
            this.state.stack = [];
        }
    }
    calculate(a, operator, b) {
        const operations = {
            [Operator.Add]: (x, y) => x + y,
            [Operator.Subtract]: (x, y) => x - y,
            [Operator.Multiply]: (x, y) => x * y,
            [Operator.Divide]: (x, y) => {
                if (y === 0)
                    return 0; // Handle division by zero
                return x / y;
            }
        };
        const result = operations[operator](a, b);
        return Number.isInteger(result)
            ? result
            : parseFloat(result.toFixed(2));
    }
    parseNumber(stack) {
        const joined = stack.join('');
        return stack.includes('.')
            ? parseFloat(joined)
            : parseInt(joined);
    }
    reset() {
        this.state = {
            stack: [],
            operand1: undefined,
            operand2: undefined,
            operator: undefined
        };
        this.updateDisplay();
    }
    backspace() {
        this.state.stack.pop();
        this.updateDisplay();
    }
    clear() {
        this.state.stack = [];
        this.updateDisplay();
    }
    updateDisplay() {
        let value = this.state.stack.join('');
        if (value.length > this.maxDisplayLength) {
            value = value.slice(0, this.maxDisplayLength);
        }
        this.display.textContent = value;
    }
}
// Initialize the calculator
const buttonsElement = document.querySelector('#buttons');
const displayElement = document.querySelector('#display');
if (!buttonsElement || !displayElement) {
    throw new Error('Required DOM elements not found');
}
const calculator = new Calculator(displayElement);
buttonsElement.addEventListener('click', (e) => {
    const target = e.target;
    const button = target.textContent;
    if (button) {
        calculator.handleInput(button);
    }
});
