const readFile = require('./readFile').readFile;
const {intcodeProgram} = require('./intcode');

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let arr = input.split(',').map(Number);
    let [map, sum] = getMapFor(0,0,50,50,arr);
    console.log('First Star: ', sum);
};

const second = (input) => {
    let arr = input.split(',').map(Number);

    let nextX = 0;
    let nextY = 0;
    while (true) {
        let [foundShip, x, y] = checkForShipAt(nextX,nextY,100,100,arr);        

        nextY += y;
        nextX = x === -1 ? nextX+100 : nextX+x;        

        if (foundShip) {
            break;
        }
    }

    console.log(`Second Star: ${nextX}${nextY}`);
};

const checkForShipAt = (xStart,yStart,width,height,arr) => {
    let topLeft = getOutputAt(xStart, yStart, arr);
    let topRight = getOutputAt(xStart+width-1, yStart, arr);
    let bottomLeft = getOutputAt(xStart, yStart+height-1, arr);

    let nextX = -1;
    for (let x = 0; x < width; x++) {
        if (getOutputAt(x+xStart, yStart+height-1, arr) === 1) {
            nextX = x;
            break;
        }
    }

    let nextY = 0;
    for (let y = 0; y < height; y++) {
        if (getOutputAt(xStart+width-1, yStart+y, arr) === 1) {
            nextY = y;
            break;
        }
    }

    let foundShip = topLeft && topRight && bottomLeft;
    return [foundShip, nextX, nextY];
}

const getMapFor = (xStart,yStart,width,height,arr) => {
    let map = new Array(height).fill(0);
    map = map.map(a => {
        return new Array(width);
    });  

    let sum = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let output = getOutputAt(x+xStart,y+yStart,arr);
            map[y][x] = output;
            sum += output;
        }
    }

    return [map, sum];
}

const getOutputAt = (x,y,arr) => {
    let program = intcodeProgram([...arr]);
    program.next();
    program.next(x);
    let output = program.next(y);
    return output.value;
}

readFile('day19Input.txt', runFunctions);