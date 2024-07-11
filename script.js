// adding logic for the calculator

const operators = ['+', '-', 'x', '/'];
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
let stack = [];
let op1, op2, op; //operand 1, operand 2, operator

const buttons = document.querySelector('#buttons');
const display = document.querySelector('#display');

buttons.addEventListener('click', (e) => 
    {
        const button = e.target.textContent;
        
        if (button === 'DEL')
            backspace();
        else if (operators.includes(button))
            operate(button);
        else if (button === 'AC')
            reset();
        else if (button === 'CE')
            clear();
        else if (button === '=')
            equals();
        else
            store(button);
    });    

function store(input)
{
    stack.push(input);
    show();
}

function operate(operator)
{
    if (stack.length != 0)
    {
        if (op1 == undefined)
        {
            op1 = parseInt(stack.join(''));
            stack = [];
        }
        else
        {
            op2 = parseInt(stack.join(''));
            op1 = equate(op1, op, op2);
            stack = [op1];
            show();
            stack = [];
        }
    }
    op = operator;
}

function equals()
{
    if (stack.length != 0 && op1 != undefined && op != undefined)
    {
        op2 = parseInt(stack.join(''));
        op1 = equate(op1, op, op2);
        stack = [op1];
        show();
        stack = [];
    }
}

function equate(a, operator, b)
{
    let result;
    switch (operator)
    {
        case '+':
            result = a + b;
            break;
        case '-': 
            result = a - b;
            break;
        case 'x': 
            result = a * b;
            break;
        case '/': 
            result = a / b;
            break;
        default: break;
    }
    
    if (!Number.isInteger(result))
        result = result.toFixed(2);

    return result;
}

function reset()
{
    op1 = op2 = op = undefined;
    stack = [];
    show();
}

function backspace()
{
    stack.pop();
    show();
}

function clear()
{
    stack = [];
    show();
}

function show()
{
    let value = stack.join('');
    
    if (value.length > 11)
        value = value.slice(0, 11);

    display.textContent = value;
}