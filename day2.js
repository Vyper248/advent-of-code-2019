const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let arr = input.split(',').map(Number);
    arr[1] = 12;
    arr[2] = 2;

    let result = runProgram(arr);
    console.log('First Star: ', result);
};

const second = (input) => {
    let arr = input.split(',').map(Number);
    let desiredResult = 19690720;

    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            let copy = [...arr];
            copy[1] = i;
            copy[2] = j;
            let result = runProgram(copy);
            if (result === desiredResult) {
                console.log('Second Star: ', 100 * i + j);
                return;
            }        
        }
    }
    
};

const runProgram = (arr) => {
    for (let i = 0; i < arr.length-4; i+=4) {
        let opcode = arr[i];
        if (opcode === 99) break;

        let inputA = arr[i+1];
        let inputB = arr[i+2];
        let output = arr[i+3];

        let inputAVal = arr[inputA];
        let inputBVal = arr[inputB];

        let error = false;
        switch (opcode) {
            case 1: arr[output] = inputAVal + inputBVal; break;
            case 2: arr[output] = inputAVal * inputBVal; break;
            default: error = true; break;
        }

        if (error) {
            console.log('Error');
            break;
        }
    }

    return arr[0];
}

//====================================================== TESTING ======================================================

const test = (input, expectedValue) => {
    if (runProgram(input) === expectedValue) console.log(true);
    else console.log(false);
}

test([1,0,0,0,99], 2);
test([2,3,0,3,99], 2);
test([2,4,4,5,99,0], 2);
test([1,1,1,4,99,5,6,0,99], 30);

//==================================================== READ FILE =====================================================

readFile('day2Input.txt', runFunctions);