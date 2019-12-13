let c = document.getElementById("board");
let ctx = c.getContext("2d");
let scoreDiv = document.getElementById('score');

const second = (input) => {
    let arr = input.split(',').map(Number);
    arr[0] = 2;

    let program = intcodeProgram(arr);

    let map = {};
    let score = 0;

    let currentOutput = program.next();
    let interval = setInterval(() => {
        if (currentOutput.value === undefined) {
            let joystickDirection = getJoystickDirection(map);
            currentOutput = program.next(joystickDirection);//provide joystick input here
        } else {
            let x = currentOutput.value;
            let y = program.next().value;
            let id = program.next().value;
            currentOutput = program.next();

            if (x === -1 && y === 0) {
                score = id;
                scoreDiv.innerText = score;                
            } else {
                map[`${x},${y}`] = id;
            }
        }

        if (currentOutput.done) {
            clearInterval(interval);
        }

        displayBoard(map);
    }, 0);
};

const getJoystickDirection = (map) => {
    let paddle = Object.keys(map).find(key => map[key] === 3);
    let ball = Object.keys(map).find(key => map[key] === 4);
    
    let pX = paddle.split(',').map(Number)[0];
    let bX = ball.split(',').map(Number)[0];

    if (bX > pX) return 1;
    if (bX < pX) return -1;
    return 0;
}

const displayBoard = (map) => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,900,500);
    let blockSize = 20;

    for (let y = 0; y < 25; y++) {
        for (let x = 0; x < 50; x++) {
            let value = map[`${x},${y}`];
            let xPos = x*blockSize;
            let yPos = y*blockSize;
            switch(value) {
                case 0:
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(xPos, yPos, blockSize, blockSize);
                    break;
                case 1:
                    ctx.fillStyle = '#00FF00';
                    ctx.fillRect(xPos, yPos, blockSize, blockSize);
                    break;
                case 2:
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(xPos+1, yPos+1, blockSize-2, blockSize-2);
                    break;
                case 3: 
                    ctx.fillStyle = '#00FF00';
                    ctx.fillRect(xPos, yPos, blockSize, blockSize/2);
                    break;
                case 4:
                    ctx.fillStyle = '#FF0000';
                    // ctx.fillRect(xPos, yPos, blockSize, blockSize);
                    ctx.beginPath();
                    ctx.arc(xPos+blockSize/2, yPos+blockSize/2, blockSize/2, 0, 2*Math.PI);
                    ctx.fill();
                    break;
                default: 
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(xPos, yPos, blockSize, blockSize);
                    break;
            }
        }
    }
}

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
    if (param === 0) return arr[input];
    if (param === 1) return input;
    if (param === 2) return arr[relativeBase+input];
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

fetch('../day13Input.txt').then(resp => resp.text()).then(data => {
    second(data);
});