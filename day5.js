const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let arr = input.split(',').map(Number);
    let result = runProgram(arr, 1);
    console.log('First Star: ', result);
};

const second = (input) => {
    let arr = input.split(',').map(Number);
    let result = runProgram(arr, 5);
    console.log('Second Star: ', result);
};

const runProgram = (arr, input) => {
    let length = 4;
    let finalOutput = 0;
    for (let i = 0; i < arr.length; i+=length) {        
        let [opcode, paramA, paramB] = getParams(arr[i]);

        if (opcode === 99) break;

        length = 4;
        let inputA = arr[i+1];
        let inputB = arr[i+2];
        let output = arr[i+3];

        let inputAVal = paramA === 0 ? arr[inputA] : inputA;
        let inputBVal = paramB === 0 ? arr[inputB] : inputB;

        let error = false;        
        switch (opcode) {
            case 1: arr[output] = inputAVal + inputBVal; break; //add
            case 2: arr[output] = inputAVal * inputBVal; break; //multiply
            case 3: arr[arr[i+1]] = input; length = 2; break; //input
            case 4: finalOutput = inputAVal; length = 2; break; //output
            case 5: inputAVal !== 0 ? [i, length] = [inputBVal, 0] : length = 3; break; //jump-if-true
            case 6: inputAVal === 0 ? [i, length] = [inputBVal, 0] : length = 3; break; //jump-if-false
            case 7: inputAVal < inputBVal ? arr[output] = 1 : arr[output] = 0; break; //less than
            case 8: inputAVal === inputBVal ? arr[output] = 1 : arr[output] = 0; break; //equal
            default: error = true; break;
        }

        if (error) {
            console.log('Error, opcode was: ', opcode);
            break;
        }        
    }

    return finalOutput;
}

const getParams = (num) => {
    if (num < 100) return [num, 0, 0];

    let parts = (num+'').split('').map(Number);
    
    let opCode = Number(`${parts[parts.length-2]}${parts[parts.length-1]}`);
    let paramA = parts[parts.length-3] === undefined ? 0 : parts[parts.length-3];
    let paramB = parts[parts.length-4] === undefined ? 0 : parts[parts.length-4];

    return [opCode, paramA, paramB];
}

//====================================================== TESTING ======================================================

// const test = (input, expectedValue) => {
//     if (runProgram(input) === expectedValue) console.log(true);
//     else console.log(false);
// }

// test([1,0,0,0,99], 2);
// test([2,3,0,3,99], 2);
// test([2,4,4,5,99,0], 2);
// test([1,1,1,4,99,5,6,0,99], 30);

// console.log(runProgram([3,9,8,9,10,9,4,9,99,-1,8], 5));
// console.log(runProgram([3,9,7,9,10,9,4,9,99,-1,8], 5));
// console.log(runProgram([3,3,1108,-1,8,3,4,3,99], 5));
// console.log(runProgram([3,3,1107,-1,8,3,4,3,99], 5));

// console.log(runProgram([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9], 6));
// console.log(runProgram([3,3,1105,-1,9,1101,0,0,12,4,12,99,1], 4));
// console.log(runProgram([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99], 9));


//==================================================== READ FILE =====================================================

readFile('day5Input.txt', runFunctions);