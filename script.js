// adding logic for the calculator

const operators = ['+', '-', 'x', '/', '='];
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
let stack = [];
let op1, op2, op;

const buttons = document.querySelector('#buttons');
const display = document.querySelector('#display');

buttons.addEventListener('click', (e) => 
    {
        const button = e.target.textContent;
        
        if (button === 'DEL')
            backspace();
        else if (operators.includes(button))
            calculate(stack, button);
        else if (button === 'AC')
            reset();
        else if (button === 'CE')
            clear();
        else
            store(button);
    });    

function store(input)
{
    stack.push(input);
    display.textContent = stack.join('');
}

function calculate(input, operator)
{
    if (stack.length != 0)
    {
        if (op1 == undefined)
        {
            if (operator != '=')
            {
                op1 = parseInt(input.join(''));
                op = operator;
                stack = [];
            }
        }
        else
        {
            op2 = parseInt(input.join(''));
            const result = equate(op1, op, op2);
            stack = [result];
            display.textContent = stack;
            op1 = result;
            console.log(result);
            if (operator != '=')
            {
                op = operator;
                stack = [];
            }
        }
    }
}

function equate(a, operator, b)
{
    switch (operator)
    {
        case '+': return a + b;
        case '-': return a - b;
        case 'x': return a * b;
        case '/': return a / b;
    }

}

function reset()
{
    op1 = op2 = op = undefined;
    stack = [];
    display.textContent = stack.join('');
}

function backspace()
{
    stack.pop();
    display.textContent = stack.join('');
}

function clear()
{
    stack = [];
    display.textContent = stack.join('');
}