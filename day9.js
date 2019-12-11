const readFile = require('./readFile').readFile;
const { intcodeProgram } = require('./intcode');

const runFunctions = (input) => {
    let firstStar = first(input);
    let secondStar = second(input);

    console.log('First Star: ', firstStar);
    console.log('Second Star: ', secondStar);
}

const first = (input) => {   
    let arr = input.split(',').map(Number);
    let output = runProgram(arr, 1);

    return output;
};

const second = (input) => {
    let arr = input.split(',').map(Number);
    let output = runProgram(arr, 2);

    return output;
};

const runProgram = (arr, input) => {
    const program = intcodeProgram(arr);
    let output = program.next();
    let outputArray = [];

    while(output.done === false) {
        if (output.value === undefined) {
            output = program.next(input);            
        } else {
            outputArray.push(output.value);
            output = program.next();
        }
    }

    return outputArray.join('');
}

//====================================================== TESTING ======================================================

const test = (input, expectedValue) => {
    if (first(input) === expectedValue) console.log(true);
    else console.log(false);
}

// test('109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99', '1091204-1100110011001008100161011006101099');
// test('1102,34915192,34915192,7,4,7,99,0', '1219070632396864');
// test('104,1125899906842624,99', '1125899906842624');

//==================================================== READ FILE =====================================================

readFile('day9Input.txt', runFunctions);