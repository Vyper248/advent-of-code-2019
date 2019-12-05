const readFile = require('./readFile').readFile;

const runFunctions = () => {
    let a = 138241;
    let b = 674034;
    first(a, b);
    second(a, b);
}

const first = (a, b) => {   
    let sum = 0;
    for (let i = a; i < b; i++) {
        if (testNumber(i)) sum++;
    }
    console.log('First Star: ', sum);
};

const second = (a, b) => {
    let sum = 0;
    for (let i = a; i < b; i++) {
        if (testNumber(i, true)) sum++;
    }
    console.log('Second Star: ', sum);
};

const testNumber = (number, second=false) => {
    let numberStr = number+'';
    if (numberStr.length !== 6) return false;
    
    let digits = numberStr.split('').map(Number);
    
    let adjacent = false;
    let current = digits[0];

    for (let i = 1; i < 6; i++) {
        let digit = digits[i];
        let digitStr = `${digit}${digit}${digit}`;

        if (digit < current) return false;

        if (second && digit === current && !numberStr.includes(digitStr)) adjacent = true;
        else if (!second && digit === current) adjacent = true;

        current = digit;
    }
    
    if (adjacent) return true;

    return false;
}

//====================================================== TESTING ======================================================

const test = (input, expectedValue, second=false) => {
    if (testNumber(input, second) === expectedValue) console.log(true);
    else console.log(false);
}

test(111111, true);
test(223450, false);
test(123789, false);
test(112233, true, true);
test(123444, false, true);
test(111122, true, true);

runFunctions();