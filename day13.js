const readFile = require('./readFile').readFile;
const {intcodeProgram} = require('./intcode');

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let arr = input.split(',').map(Number);

    let program = intcodeProgram(arr);
    
    let blocks = 0;
    let currentOutput = program.next();
    while (currentOutput.done === false) {
        program.next();
        let id = program.next().value;
        currentOutput = program.next();
        if (id === 2) blocks++;
    }
    
    console.log('First Star: ', blocks);
};

const second = (input) => {
    let arr = input.split(',').map(Number);
    arr[0] = 2;

    let program = intcodeProgram(arr);

    let map = {};
    let score = 0;

    let currentOutput = program.next();
    while (currentOutput.done === false) {
        if (currentOutput.value === undefined) {
            let joystickDirection = getJoystickDirection(map);
            currentOutput = program.next(joystickDirection);//provide joystick input here
        } else {
            let x = currentOutput.value;
            let y = program.next().value;
            let id = program.next().value;
            currentOutput = program.next();

            if (x === -1 && y === 0) score = id;
            else {
                map[`${x},${y}`] = id;
            }
        }
    }

    console.log('Second Star: ', score);    
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

readFile('day13Input.txt', runFunctions);