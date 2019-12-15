const readFile = require('./readFile').readFile;
const {intcodeProgram} = require('./intcode');

const runFunctions = (input) => {
    both(input);
}

const both = (input) => {   
    let arr = input.split(',').map(Number);
    let program = intcodeProgram(arr);

    let finalNode = pathFind(0, 0, program)[0];
    let steps = finalNode.steps;
    console.log('First Star: ', steps);

    let minutes = pathFind(finalNode.x, finalNode.y, program)[1];
    console.log('Second Star: ', minutes);
};

const pathFind = (startX, startY, program) => {
    let done = new Set();
    done.add(`${startX},${startY}`);

    let currentOutput = program.next();
    let currentNode = createNode(0, undefined, startX, startY);
    let furthestSteps = 0;

    while(currentOutput.value !== 2) {        
        if (currentOutput.value === undefined) {
            //get list of potential movements
            let {x, y} = currentNode;
            let validDirection = checkValidDirections(done, x, y);

            //if there are any valid directions
            if (validDirection > 0) {
                //try a movement
                let direction = validDirection;
                currentOutput = program.next(direction);
                currentNode = moveNode(currentNode, x, y, direction);
                done.add(`${currentNode.x},${currentNode.y}`);
            } else {
                //If not, backtrack so it can try a new direction
                if (currentNode.previousNode === undefined) break;
                let direction = getBacktrackDirection(currentNode);
                currentNode = currentNode.previousNode;
                currentOutput = program.next(direction);
            }
        } else {
            if (currentOutput.value === 0) currentNode = currentNode.previousNode; //hit a wall, so move back again
            else if (currentNode.steps > furthestSteps) furthestSteps = currentNode.steps; //check for furthest position
            currentOutput = program.next(); //move back to input stage
        }
    }    

    return [currentNode, furthestSteps];
}

const getBacktrackDirection = (currentNode) => {
    let previousNode = currentNode.previousNode;
    if (previousNode.x < currentNode.x) return 3;
    if (previousNode.x > currentNode.x) return 4;
    if (previousNode.y < currentNode.y) return 2;
    if (previousNode.y > currentNode.y) return 1;
}

const moveNode = (currentNode, x, y, direction) => {
    switch(direction) {
        case 1: y++; break;
        case 2: y--; break;
        case 3: x--; break;
        case 4: x++; break;
    }
    return createNode(currentNode.steps+1, currentNode, x, y);
}

const checkValidDirections = (done, x, y) => {    
    if (!done.has(`${x},${y+1}`)) return 1;
    if (!done.has(`${x},${y-1}`)) return 2;
    if (!done.has(`${x-1},${y}`)) return 3;
    if (!done.has(`${x+1},${y}`)) return 4;
    return 0;
}

const createNode = (steps, previousNode, x, y) => {
    return {steps, previousNode, x, y};
}

readFile('day15Input.txt', runFunctions);