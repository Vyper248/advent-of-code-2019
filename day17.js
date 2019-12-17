const readFile = require('./readFile').readFile;
const {intcodeProgram, runProgram} = require('./intcode');

const runFunctions = (input) => {
    both(input);
}

const both = (input) => {   
    let arr = input.split(',').map(Number);
    let output = runOutputProgram([...arr]);
    // display(output);
    let firstStar = calculateIntersections(output);
    console.log('First Star: ', firstStar);

    let path = calculatePath(output);    
    let parts = findPatterns(path);
    let order = getOrder(path, parts);        
    let secondStar = runRescueProgram([...arr], parts, order);
    console.log('Second Star: ', secondStar);
};

const runRescueProgram = (arr, parts, order) => {
    arr[0] = 2;
    let program = intcodeProgram(arr);

    //skip to input instructions
    cycleToInput(program);
    
    //provide movement routine
    order = order.join(',').split('');
    order.forEach(char => program.next(char.charCodeAt(0)));
    cycleToInput(program, 10); //new line

    //provide movement functions
    parts.forEach(part => {
        let sequence = part.split(' ').join(',').split('');
        sequence.forEach(char => program.next(char.charCodeAt(0)));
        cycleToInput(program, 10); //new line
    });

    let output = program.next('n'.charCodeAt(0)); //no to video feed    
    let finalOutput = cycleToInput(program, 10);
    return finalOutput;
}

const cycleToInput = (program, val) => {
    let outputArr = [];
    let output = program.next(val);
    while (output.value !== undefined && output.done === false) {
        outputArr.push(output.value);
        output = program.next();                
    }    
    
    return outputArr[outputArr.length-1];
}

const getOrder = (path, parts) => {    
    let string = path.join(' ');
    
    let order = [];    
    let letters = ['A','B','C'];

    while (string.length > 0) {
        for (let [i, part] of parts.entries()) {            
            if (string.indexOf(part) === 0) {
                string = string.replace(part, '').trim();
                order.push(letters[i]);
                break;
            }
        }
    }

    return order;
}

const findPatterns = (path) => {   
    let groups = [];

    let string = path.join(' ');
    for (let i = 0; i < path.length-6; i++) {
        if (path[i] === '#') continue;
        let greatest = 0;
        let chosen = [];
        for (let j = 6; j < 10; j+=2) {
            let pattern = path.slice(i,i+j);
            let matches = getMatches(string, pattern);            
            if (matches.length >= greatest) {
                greatest = matches.length;
                chosen = pattern;
            }
        }
        [string, path] = removeFromPath(chosen, string, path);
        groups.push(chosen.join(' '));
    }

    return groups;
}

const removeFromPath = (chosen, string, path) => {
    let regEx = new RegExp(chosen.join(' '), 'g');
    string = string.replace(regEx, '#');
    path = string.split(' ');
    return [string, path];
}

const getMatches = (string, pattern) => {
    let regEx = new RegExp(pattern.join(' '), 'g');
    let matches = string.match(regEx);
    return matches;
}

const calculatePath = (arr) => {
    let [x,y,dir] = getStartLocation(arr);  
      
    let path = [];
    let count = 0;
    while (true) {
        if (checkPosition(arr, x+dir[0], y+dir[1])) {
            count++;
            x += dir[0];
            y += dir[1];
        } else {
            if (count > 0) path.push(count);
            count = 0;
            let nextDir = getNextDirection(arr,x,y,dir);
            if (nextDir === false) break;
            path.push(getTurn(dir,nextDir));
            dir = nextDir;
        }
    }

    return path;
}

const getTurn = (dir, nextDir) => {
    if (dir[0] === 1 && nextDir[1] === -1) return 'L';
    if (dir[0] === 1 && nextDir[1] === 1) return 'R';

    if (dir[0] === -1 && nextDir[1] === -1) return 'R';
    if (dir[0] === -1 && nextDir[1] === 1) return 'L';

    if (dir[1] === 1 && nextDir[0] === -1) return 'R';
    if (dir[1] === 1 && nextDir[0] === 1) return 'L';

    if (dir[1] === -1 && nextDir[0] === -1) return 'L';
    if (dir[1] === -1 && nextDir[0] === 1) return 'R';
}

const getNextDirection = (arr, x, y, dir) => {
    let from = [dir[0]*-1, dir[1]*-1];

    if (arr[y-1] !== undefined && arr[y-1][x] === '#' && from[1] !== -1) return [0,-1];
    if (arr[y+1] !== undefined && arr[y+1][x] === '#' && from[1] !== 1) return [0,1];
    if (arr[y][x-1] === '#' && from[0] !== -1) return [-1,0];
    if (arr[y][x+1] === '#' && from[0] !== 1) return [1,0];

    return false;
}

const checkPosition = (arr,x,y) => {
    if (arr[y] !== undefined && arr[y][x] === '#') return true;
    return false;
}

const getStartLocation = (arr) => {
    let x = 0;
    let y = 0;
    let dir = [0,-1];
    for (let yArr of arr) {
        x = yArr.findIndex(a => {
            return a === '^' || a === 'v' || a === '>' || a === '<';
        });

        if (x !== -1){
            y = arr.indexOf(yArr);
            switch (yArr[x]) {
                case '^': dir = [0,-1]; break;
                case 'v': dir = [0,1]; break;
                case '<': dir = [-1,0]; break;
                case '>': dir = [1,0]; break;
            }
            break;
        }
    }

    return [x,y,dir];
}

const runOutputProgram = (arr) => {
    let program = intcodeProgram(arr);

    let output = [];
    let tempArr = [];
    let currentOutput = program.next();
    while (currentOutput.done === false) {
        if (currentOutput.value !== undefined) {
            let value = String.fromCharCode(currentOutput.value);
            if (value === '\n') {
                if (tempArr.length > 0) output.push(tempArr);
                tempArr = [];
            } else {
                tempArr.push(value);
            }
        }
        currentOutput = program.next();
    }

    return output;
}

const calculateIntersections = (arr) => {
    let sum = 0;
    for (let [y, yArr] of arr.entries()) {
        for (let [x, val] of yArr.entries()) {
            if (val === '#') {
                let intersection = true;
                if (arr[y-1] !== undefined && arr[y-1][x] !== '#') intersection = false;
                if (arr[y+1] !== undefined && arr[y+1][x] !== '#') intersection = false;
                if (arr[y] !== undefined && arr[y][x-1] !== '#') intersection = false;
                if (arr[y] !== undefined && arr[y][x+1] !== '#') intersection = false;
                if (intersection) {
                    sum += x * y;
                }
            }
        }
    }
    return sum;
}

const display = (arr) => {
    for (let y of arr) {
        let string = y.join('');
        console.log(string);
    }
}

readFile('day17Input.txt', runFunctions);