const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let moons = getMoons(input);
    
    for (let i = 0; i < 1000; i++) {
        moons.forEach(moon => applyGravity(moon, moons));
        moons.forEach(moon => applyVelocity(moon));
    }

    let totalEnergy = getTotalEnergy(moons);

    console.log('First Star: ', totalEnergy);
};

const second = (input) => {
    let moons = getMoons(input);
    let set = new Set();

    let dimensions = [['x', 'velX'], ['y', 'velY'], ['z', 'velZ']];
    let repeats = [];

    dimensions.forEach((d,pos) => {
        let i = 0;

        while (set.has(getSnapshot(moons, d[0], d[1])) === false) {
            set.add(getSnapshot(moons, d[0], d[1]));
            moons.forEach(moon => applyGravity(moon, moons));
            moons.forEach(moon => applyVelocity(moon));
            i++
        }
        
        repeats[pos] = i;
    });

    console.log('Second Star: ', lowestMultiple(repeats));
};

const lowestMultiple = ([x,y,z]) => {
    let a = (x*y) / greatestDivisor(x,y);
    return (a*z) / greatestDivisor(a,z);
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

const getSnapshot = (moons, pos, vel) => {
    let string = '';
    moons.forEach(moon => {
        string += `${moon[pos]},${moon[vel]}`;
    });
    return string;
}

const applyGravity = (moon, moons) => {
    let dimensions = [['x', 'velX'], ['y', 'velY'], ['z', 'velZ']];
    moons.forEach(moonB => {
        if (moonB === moon) return;
        dimensions.forEach(([a,b]) => {
            if (moon[a] < moonB[a]) moon[b]++;
            else if (moon[a] > moonB[a]) moon[b]--;
        });
    });
}

const applyVelocity = (moon) => {
    moon.x += moon.velX;
    moon.y += moon.velY;
    moon.z += moon.velZ;
}

const getTotalEnergy = (moons) => {
    let sum = 0;
    moons.forEach(moon => {
        let potential = Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z);
        let kinetic = Math.abs(moon.velX) + Math.abs(moon.velY) + Math.abs(moon.velZ);
        sum += potential * kinetic;
    });
    return sum;
}

const getMoons = (input) => {
    return input.split('\n').map(line => {
        let [,x,y,z] = /x=([-0-9]+), y=([-0-9]+), z=([-0-9]+)/.exec(line).map(Number);
        return {x,y,z, velX:0, velY: 0, velZ: 0};
    });
}

// second(`<x=-1, y=0, z=2>
// <x=2, y=-10, z=-7>
// <x=4, y=-8, z=8>
// <x=3, y=5, z=-1>`);

// second(`<x=-8, y=-10, z=0>
// <x=5, y=5, z=10>
// <x=2, y=-7, z=3>
// <x=9, y=-8, z=-3>`);

readFile('day12Input.txt', runFunctions);