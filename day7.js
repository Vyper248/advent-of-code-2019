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
    let combinations = getCombinations([0,1,2,3,4]);
    let max = 0;

    combinations.forEach(sequence => {
        let currentResult = 0;
        for (let i = 0; i < 5; i++) currentResult = runProgram([...arr], sequence[i], currentResult);
        if (currentResult > max) max = currentResult;
    });

    return max;
};

const second = (input) => {
    let arr = input.split(',').map(Number);
    let combinations = getCombinations([5,6,7,8,9]);
    let max = 0;

    combinations.forEach(sequence => {
        let programs = getPrograms(arr, sequence);

        let finished = false;
        let first = true;
        let currentOutput = null;
        let finalOutput = 0;

        while (finished === false) {
            finished = true;
            
            for (let i = 0; i < programs.length; i++) {
                let program = programs[i];

                if (first) {
                    currentOutput = program.next(0); //start first program with 0 input and move to output
                    program.next(); //move to next input request
                    first = false;
                } else {
                    currentOutput = program.next(currentOutput.value); //input value from previous output
                    program.next(); //move to next input request
                }

                if (currentOutput.done === false) finished = false; //if all programs aren't finished, keep going
                if (i === programs.length-1 && currentOutput.value !== undefined) finalOutput = currentOutput.value;
            }
        }

        if (finalOutput > max) max = finalOutput;      
    });

    return max;
};

//get programs and start with phase settings input
const getPrograms = (arr, sequence) => {
    let programs = [];
    for (let i = 0; i < sequence.length; i++) {
        let program = intcodeProgram([...arr]);
        program.next(); //move to first input
        program.next(sequence[i]); //input phase setting and move to next input
        programs.push(program);
    }
    return programs;
}

const getCombinations = (input) => {
    let arr = [];

    const func = (possibleValues, currentValues) => {
        for (let i = 0; i < possibleValues.length; i++) {
            let values = [...currentValues, possibleValues[i]];
            let newArr = possibleValues.filter((a) => a !== possibleValues[i]);
            if (newArr.length > 0) func(newArr, values);
            if (possibleValues.length === 1) arr.push(values);
        }
    }

    func(input, []);
    
    return arr;
}

const runProgram = (arr, firstInput, secondInput) => {
    const program = intcodeProgram(arr);
    program.next();
    program.next(firstInput);
    let output = program.next(secondInput);
    return output.value;
}

//====================================================== TESTING ======================================================

const test = (input, expectedValue) => {
    if (first(input) === expectedValue) console.log(true);
    else console.log(false);
}

const testSecond = (input, expectedValue) => {
    if (second(input) === expectedValue) console.log(true);
    else console.log(false);
}

// test('3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0', 43210);
// testSecond('3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5', 139629729);

//==================================================== READ FILE =====================================================

readFile('day7Input.txt', runFunctions);