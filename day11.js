const readFile = require('./readFile').readFile;
const { intcodeProgram } = require('./intcode');

const runFunctions = (input) => {
    let firstStar = first(input);
    console.log('First Star: ', firstStar);

    console.log('Second Star: ');
    second(input);
}

const first = (input) => {   
    let map = paintPanels(input, 0);
    return Object.keys(map).length;
};

const second = (input) => {
    let map = paintPanels(input, 1);
    displayPanels(map); 
};

const displayPanels = (map) => {
    //get x and y start and end points
    let lowestX = 1000;
    let highestX = 0;
    let lowestY = 1000;
    let highestY = 0;
    Object.keys(map).forEach(key => {
        let [x,y] = key.split(',').map(Number);
        if (x < lowestX) lowestX = x;
        if (x > highestX) highestX = x;
        if (y < lowestY) lowestY = y;
        if (y > highestY) highestY = y;
    });
    
    //display
    for (let y = highestY; y >= lowestY; y--) {
        let arr = [];
        for (let x = lowestX; x <= highestX; x++) {
            let color = map[`${x},${y}`];
            if (color === undefined) color = 0;
            color = color === 0 ? ' ' : '#';
            arr.push(color);
        }
        console.log(arr.join(''));
    }    
}

const paintPanels = (input, startingColor) => {
    let arr = input.split(',').map(Number);
    let program = intcodeProgram(arr);

    const map = {
        '0,0': startingColor
    };
    
    let x = 0;
    let y = 0;
    let direction = 0;

    while (program.next().done === false) {
        const key = `${x},${y}`;
        //provide current input and get outputs
        let color = map[key] === undefined ? 0 : map[key];
        let newColor = program.next(color).value;
        let newDirection = program.next().value;

        //set new color
        map[key] = newColor;

        //turn
        newDirection === 0 ? direction -= 90 : direction += 90;
        if (direction < 0) direction = 270;
        if (direction >= 360) direction = 0;

        //move
        switch (direction) {
            case 0: y++; break;
            case 90: x++; break;
            case 180: y--; break;
            case 270: x--; break;
        }
    }

    return map;
}

readFile('day11Input.txt', runFunctions);