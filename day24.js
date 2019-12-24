const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let grid = input.split('\n').map(a => a.split(''));
    let cache = new Set();
    let width = grid[0].length;
    let height = grid.length;
    let counts = new Array(height).fill(null).map(a => []);
    
    while (true) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                counts[y][x] = getSurrounding(grid, x, y);
            }
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (grid[y][x] === '#' && counts[y][x] !== 1) grid[y][x] = '.';
                else if (grid[y][x] === '.' && (counts[y][x] === 1 || counts[y][x] === 2)) grid[y][x] = '#';
            }
        }

        if (cache.has(JSON.stringify(grid))) break;
        else cache.add(JSON.stringify(grid));
    }

    let biodiversity = 0;
    let gen = pointGen();
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let points = gen.next().value;
            if (grid[y][x] === '#') biodiversity += points;
        }
    }

    console.log('First Star: ', biodiversity);
};

function *pointGen(start=1) {
    yield start;
    while (true) yield start *= 2;
}

const getSurrounding = (grid, x, y) => {
    let sum = 0;
    sum += checkPosition(grid, x, y-1);
    sum += checkPosition(grid, x, y+1);
    sum += checkPosition(grid, x-1, y);
    sum += checkPosition(grid, x+1, y);
    return sum;
}

const checkPosition = (grid, x, y) => {
    if (grid[y] && grid[y][x] === '#') return 1;
    return 0;
}

const second = (input) => {
    let grid = {};

    input.split('\n').forEach((line, y) => {
        let arr = line.split('').forEach((val, x) => {
            if (val === '#') grid[`${x},${y},0`] = true;
        });
    });
    
    for (let i = 0; i < 200; i++) {
        let bugsToRemove = [];
        let emptySpaces = {};

        Object.keys(grid).forEach(pos => {
            let bugs = checkSurrounding(grid, emptySpaces, pos);
            if (bugs !== 1) bugsToRemove.push(pos);
        });

        Object.keys(emptySpaces).forEach(pos => {
            if (emptySpaces[pos] === 1 || emptySpaces[pos] === 2) {
                grid[pos] = true;
            }
        });

        bugsToRemove.forEach(pos => {
            delete grid[pos];
        });
    }

    console.log('Second Star: ', Object.keys(grid).length);
};

const checkSurrounding = (grid, temp, pos) => {
    let [x,y,level] = pos.split(',').map(Number);
    let adjacent = getAdjacent(grid, x, y, level);
    let bugs = 0;

    adjacent.forEach(key => {
        if (grid[key]) bugs++;
        else temp[key] === undefined ? temp[key] = 1 : temp[key]++;
    });

    return bugs;
}

const getAdjacent = (grid, x, y, level) => {
    let adjacent = [];

    if (x === 2 && y == 1) {
        adjacent.push(...innerX(0, level));

        adjacent.push(`${1},${1},${level}`);
        adjacent.push(`${3},${1},${level}`);
        adjacent.push(`${2},${0},${level}`);

        return adjacent;
    }

    if (x === 2 && y == 3) {
        adjacent.push(...innerX(4, level));

        adjacent.push(`${1},${3},${level}`);
        adjacent.push(`${3},${3},${level}`);
        adjacent.push(`${2},${4},${level}`);

        return adjacent;
    }

    if (x === 1 && y == 2) {
        adjacent.push(...innerY(0, level));

        adjacent.push(`${0},${2},${level}`);
        adjacent.push(`${1},${1},${level}`);
        adjacent.push(`${1},${3},${level}`);

        return adjacent;
    }

    if (x === 3 && y == 2) {
        adjacent.push(...innerY(4, level));

        adjacent.push(`${4},${2},${level}`);
        adjacent.push(`${3},${1},${level}`);
        adjacent.push(`${3},${3},${level}`);

        return adjacent;
    }

    //check above
    if (y === 0) adjacent.push(`${2},${1},${level+1}`);
    else adjacent.push(`${x},${y-1},${level}`);

    //check below
    if (y === 4) adjacent.push(`${2},${3},${level+1}`);
    else adjacent.push(`${x},${y+1},${level}`);

    //check left
    if (x === 0) adjacent.push(`${1},${2},${level+1}`);
    else adjacent.push(`${x-1},${y},${level}`);

    //check right
    if (x === 4) adjacent.push(`${3},${2},${level+1}`);
    else adjacent.push(`${x+1},${y},${level}`);

    return adjacent;
}

const innerY = (x, level) => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
        arr.push(`${x},${i},${level-1}`)
    }
    return arr;
}

const innerX = (y, level) => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
        arr.push(`${i},${y},${level-1}`)
    }
    return arr;
}

readFile('day24Input.txt', runFunctions);