function calc(num1, num2, operation) {
  switch (operation) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      if (num2 !== 0) {
        return num1 / num2;
      } else {
        throw new Error('TypeError: Division by zero.');
      }
    default:
      return 0;
  }
}

function expressionCalculator(expr) {
  const leftBr = expr.match(/[(]/g);
  const rightBr = expr.match(/[)]/g);

  if (leftBr && rightBr) {
    if (leftBr.length !== rightBr.length) {
      throw new Error('ExpressionError: Brackets must be paired');
    }
  } else if ((leftBr && !rightBr) || (!leftBr && rightBr)) {
    throw new Error('ExpressionError: Brackets must be paired');
  }

  const expression = expr.match(/[\+\-*/()]|\d+/g);
  const stackNum = [];
  const stackOperation = [];
  const priority = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  for (let item = 0; item < expression.length; item++) {
    if (isFinite(expression[item])) {
      stackNum.push(Number(expression[item]));
    } else {
      if (expression[item] === ')') {
          while (stackOperation[stackOperation.length - 1] !== '(') {
            const num2 = stackNum.pop();
            const num1 = stackNum.pop();
            const operator = stackOperation.pop();
            stackNum.push(calc(num1, num2, operator));
          }
          stackOperation.pop();
      } else if (expression[item] === '(') {
          stackOperation.push(expression[item]);
      } else {
        if (stackOperation.length === 0 || stackOperation[stackOperation.length - 1] === '(') {
            stackOperation.push(expression[item]);
        } else if (priority[stackOperation[stackOperation.length - 1]] < priority[expression[item]]) {
            stackOperation.push(expression[item]);
        } else if (priority[stackOperation[stackOperation.length - 1]] > priority[expression[item]] ||
          priority[stackOperation[stackOperation.length - 1]] === priority[expression[item]]) {
            const num2 = stackNum.pop();
            const num1 = stackNum.pop();
            const operator = stackOperation.pop();
            stackNum.push(calc(num1, num2, operator));
            item--;
        }
      }
    }
  }

  if (stackNum.length === 3) {
    const num2 = stackNum.pop();
    const num1 = stackNum.pop();
    const operator = stackOperation.pop();
    stackNum.push(calc(num1, num2, operator));
  }

  const num2 = stackNum.pop();
  const num1 = stackNum.pop();
  const operator = stackOperation.pop();
  stackNum.push(calc(num1, num2, operator));

  return parseFloat(stackNum.pop().toFixed(4));
}

module.exports = {
  expressionCalculator
};
