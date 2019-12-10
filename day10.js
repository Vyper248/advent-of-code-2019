const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    let [firstStar, laserPos] = first(input);
    let secondStar = second(input, laserPos);

    console.log('First Star: ', firstStar);
    console.log('Second Star: ', secondStar);
}

const first = (input) => {   
    let grid = input.split('\n').map(line => line.split(''));
    
    let map = getCoordinates(grid);

    let maxCoords;
    let maxCounter = 0;

    Object.keys(map).forEach(coordinates => {
        let [x, y] = coordinates.split(',').map(Number);

        let counter = getVisibleAsteroids(x,y,map)[0];

        if (counter > maxCounter) {
            maxCounter = counter;
            maxCoords = [x,y];
        }
    });

    return [maxCounter, maxCoords];
};

const second = (input, laserPos) => {
    let grid = input.split('\n').map(line => line.split(''));
    
    let map = getCoordinates(grid);
    let [x,y] = laserPos;    

    let asteroids = getVisibleAsteroids(x,y,map)[1];    

    let sorted = asteroids.sort((a,b) => {
        return getAngle(a, x, y) - getAngle(b, x, y);
    });  

    let desiredAsteroid = sorted[199];
    let [finalX, finalY] = desiredAsteroid.split(',').map(Number);
    let result = (finalX*100) + finalY;

    return result;
};

const getAngle = (coordinate, x, y) => {    
    let [x2,y2] = coordinate.split(',').map(Number);                  
    
    let radians = Math.atan2(y2-y, x2-x);
    let degrees = (radians * (180/Math.PI)) + 90;    

    if (degrees < 0) degrees = 360+degrees;

    return degrees;
}

const getVisibleAsteroids = (x,y,map) => {
    let counter = 0;
    let asteroids = [];

    Object.keys(map).forEach(coordinatesB => {
        let [x2, y2] = coordinatesB.split(',').map(Number);

        if (x2 === x && y2 === y) return;

        let offsetX = x2-x;
        let offsetY = y2-y;

        let blockedByArr = getBlockedBy(offsetX, offsetY); //get all coordinates that could block this asteroid

        for (let blocking of blockedByArr) {
            let [x3, y3] = blocking;
            let properX = x2 - x3;
            let properY = y2 - y3;
            
            if (map[`${properX},${properY}`]) return; //blocking asteroid exists, so don't increment counter
        }

        counter++;
        asteroids.push(coordinatesB);
    });

    return [counter, asteroids];
}

const getBlockedBy = (x,y) => {
    let arr = [];

    if (x < 2 && x > -2 && y < 2 && y > -2) return [];
    
    let lowest = greatestDivisor(x,y);

    let stepX = x/lowest;
    let stepY = y/lowest;

    let tempX = stepX;
    let tempY = stepY;    
        
    while (tempX != x || tempY != y) {        
        arr.push([tempX, tempY]);
        tempX += stepX;
        tempY += stepY;           
    }

    return arr;    
}

const greatestDivisor = (x,y) => {
    x = Math.abs(x);
    y = Math.abs(y);

    while (y !== 0) {
        let t = y;
        y = x % y;
        x = t;
    }
    
    return x;
}

const getCoordinates = (grid) => {
    let map = {};
    for (let y = 0; y < grid.length; y++){
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] !== '.') map[`${x},${y}`] = true;
        }
    }
    return map;
}

//test
// console.log(first(`.#..#
// .....
// #####
// ....#
// ...##`));

//test2
// console.log(second(`.#..##.###...#######
// ##.############..##.
// .#.######.########.#
// .###.#######.####.#.
// #####.##.#.##.###.##
// ..#####..#.#########
// ####################
// #.####....###.#.#.##
// ##.#################
// #####.##.###..####..
// ..######..##.#######
// ####.##.####...##..#
// .#####..#.######.###
// ##...#.##########...
// #.##########.#######
// .####.#.###.###.#.##
// ....##.##.###..#####
// .#.#.###########.###
// #.#.#.#####.####.###
// ###.##.####.##.#..##`, [11,13]));

readFile('day10Input.txt', runFunctions);