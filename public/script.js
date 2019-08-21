// Create the Calculator class
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        // Clear all the inputs when a new instance of Calculator is created
        this.clear();
    }
    
// the Calculator class performs the following tasks:

    // Clear everything
    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    appendNumber(number) {
        // If I have just typed a '.' and currentOperand already includes a '.', return
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand.length > 8) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        // If the current operand is empty, don't allow the choose operation (hence return)
        if (this.currentOperand === '') return;
        // If both current and previous operands are not empty strings, let's calculate the result
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        // The computation runs if prev and current are two valid numbers
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                result = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = result;
        this.previousOperand = '';
        this.operation = undefined;
    }

    percentage() {
        // The variables here are completely unrelated to the ones in compute(), because they have different function scopes
        let result;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        result = current * 0.01;
        this.currentOperand = result;
        this.operation = undefined;
        this.previousOperand = '';
    }

    // getDisplayNumber() formats the numbers with thousands separators and introduces rules to the '.' decimal point symbol
    getDisplayNumber(number) {
        // Make sure number is a string, in order to apply the split() method to it
        const stringNumber = number.toString();
        // integerDigits must be converted into a number in order to do the test with the isNan function below
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        // decimalDigits doesn't need to be tested with isNan (as integerDigits does). Therefore there is no need to parse it into a float
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if(isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            // Add the thousand separator
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            })
        }
        if(decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            // Show the previousOperand on the upper part of the screen and append the operation's symbol to it
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            // When the users clicks '=', clear the upper part of the screen
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// Variables linked to data-attributes
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const allClearButton = document.querySelector('[data-all-clear]');
const percentageButton = document.querySelector('[data-percentage]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

// Allowed keys
const keyPressedNumbersAllowed = ['0','1','2','3','4','5','6','7','8','9', '.'];
const keyPressedOperatorsAllowed = ['+', '-', '*', '/'];

// Create a new calculator instance of the Calculator class
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// 'click' event listeners
numberButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // console.log(e.target.innerText);
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
})

equalsButton.addEventListener('click', () => {
    calculator.compute(); 
    calculator.updateDisplay();
})

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
})

percentageButton.addEventListener('click', () => {
    calculator.percentage();
    calculator.updateDisplay();
})

// 'keyup' eventlisteners
document.addEventListener('keyup', (e) => {
    if(keyPressedNumbersAllowed.includes(e.key)) {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    }
    if(keyPressedOperatorsAllowed.includes(e.key)) {
        calculator.chooseOperation(e.key);
        calculator.updateDisplay();
    }
    
    if(e.key == 'Enter') {
        calculator.compute(); 
        calculator.updateDisplay();
    }

    if(e.key == 'Escape') {
        calculator.clear(); 
        calculator.updateDisplay();
    }

    if(e.key == '%') {
        calculator.percentage(); 
        calculator.updateDisplay();
    }
});


