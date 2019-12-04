const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    let [firstStar, secondStar] = first(input);
    console.log('First Star: ', firstStar);
    console.log('Second Star: ', secondStar);
}

const first = (input) => {   
    let lines = input.split('\n').map(line => line.split(','));

    let map = {};

    createLine(lines[0], map, false);
    let [distance, steps] = createLine(lines[1], map, true);        
    
    return [distance, steps];
};

const createLine = (line, map, test) => {
    let x = 0;
    let y = 0;
    let mDist = 100000;
    let steps = 1;
    let minSteps = 1000000000;

    let values = {
        x: 0,
        y: 0,
        mDist: 1000000,
        steps: 1,
        minSteps: 100000000
    }

    line.forEach(op => {
        let dir = op[0];
        let dist = Number(op.replace(dir, ''));

        switch (dir) {
            case 'U': move(values, dist, 0, 1, map, test); break;
            case 'D': move(values, dist, 0, -1, map, test); break;
            case 'L': move(values, dist, -1, 0, map, test); break;
            case 'R': move(values, dist, 1, 0, map, test); break;
        }
    });

    if (test) return [values.mDist, values.minSteps];
}

const move = (values, distance, xOffset, yOffset, map, test) => {

    for (let i = 0; i < distance; i++) {
        values.x += xOffset;
        values.y += yOffset;
        let mapKey = `${values.x}-${values.y}-${test}`;
        let mapKeyOther = `${values.x}-${values.y}-${!test}`;

        //if testing, check if other line has been here (intersection)
        if (test && map[mapKeyOther]) {
            //if there's an intersection, check the combined steps
            let combinedSteps = values.steps + map[mapKeyOther];
            if (combinedSteps < values.minSteps) values.minSteps = combinedSteps;
            
            //check if manhattan distance is smaller than known value
            let mDistance = Math.abs(values.x) + Math.abs(values.y);
            if (mDistance < values.mDist) values.mDist = mDistance;
            values.steps++;
        } else {
            //if no intersection, then if line hasn't been here, add steps to map, otherwise leave as existing steps
            if (!map[mapKey]) map[mapKey] = values.steps;
            values.steps++;
        }
    }
}

//====================================================== TESTING ======================================================

const test = (input, expectedValueA, expectedValueB) => {
    let answer = first(input);
    if (answer[0] === expectedValueA && answer[1] === expectedValueB) console.log(true);
    else console.log(false);
}

test(`R8,U5,L5,D3
U7,R6,D4,L4`, 6, 30); //Pass

test(`R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`, 159, 610); //Pass

test(`R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`, 135, 410); //Pass

readFile('day3Input.txt', runFunctions);