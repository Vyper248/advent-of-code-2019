function *intcodeProgram(arr) {
    let length = 4;
    let relativeBase = 0;

    let i = 0;
    while (true) {                
        let [opcode, paramA, paramB, paramC] = getParams(arr[i]);

        if (opcode === 99) break;

        length = 4;
        let inputA = arr[i+1];
        let inputB = arr[i+2];
        let output = arr[i+3];  

        //check if output and input need to be adjusted for relative base
        if (paramC === 2) output = output + relativeBase;  
        if (paramA === 2 && opcode === 3) inputA = inputA + relativeBase;    

        let inputAVal = getValue(paramA, arr, inputA, relativeBase);
        let inputBVal = getValue(paramB, arr, inputB, relativeBase);

        let error = false;
             
        switch (opcode) {
            case 1: arr[output] = inputAVal + inputBVal; break; //add
            case 2: arr[output] = inputAVal * inputBVal; break; //multiply
            case 3: arr[inputA] = yield; length = 2; break; //input
            case 4: yield inputAVal; length = 2; break; //output
            case 5: inputAVal !== 0 ? [i, length] = [inputBVal, 0] : length = 3; break; //jump-if-true
            case 6: inputAVal === 0 ? [i, length] = [inputBVal, 0] : length = 3; break; //jump-if-false
            case 7: inputAVal < inputBVal ? arr[output] = 1 : arr[output] = 0; break; //less than
            case 8: inputAVal === inputBVal ? arr[output] = 1 : arr[output] = 0; break; //equal
            case 9: relativeBase += inputAVal; length = 2; break; //adjust relative base
            default: error = true; break;
        }

        if (error) {
            console.log('Error, opcode was: ', opcode);
            break;
        }     

        i+=length;   
    }
}

const getValue = (param, arr, input, relativeBase) => {    
    if (param === 0) return arr[input] !== undefined ? arr[input] : 0;
    if (param === 1) return input != undefined ? input : 0;
    if (param === 2) return arr[relativeBase+input] !== undefined ? arr[relativeBase+input] : 0;
    else console.log('Error, wrong param');
}

const getParams = (num) => {    
    if (num < 100) return [num, 0, 0];

    let parts = (num+'').split('').map(Number);
    
    let opCode = Number(`${parts[parts.length-2]}${parts[parts.length-1]}`);
    let paramA = parts[parts.length-3] === undefined ? 0 : parts[parts.length-3];
    let paramB = parts[parts.length-4] === undefined ? 0 : parts[parts.length-4];
    let paramC = parts[parts.length-5] === undefined ? 0 : parts[parts.length-5];

    return [opCode, paramA, paramB, paramC];
}


module.exports = {
    intcodeProgram
}