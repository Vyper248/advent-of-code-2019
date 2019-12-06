const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    let firstStar = first(input);
    let secondStar = second(input);

    console.log('First Star: ', firstStar);
    console.log('Second Star: ', secondStar);
}

const first = (input) => {   
    const lines = input.split('\n');
    const objects = setupOrbits(lines);

    let sum = 0;
    Object.values(objects).forEach(obj => {
        sum += numberOfOrbits(obj);
    });

    return sum;
};

const second = (input) => {
    const lines = input.split('\n');
    const objects = setupOrbits(lines);

    let steps = findSAN(objects);

    return steps;
};

const findSAN = (objects) => {
    let start = objects['YOU'].orbits;    
    let end = objects['SAN'].orbits;

    let arrA = [];
    let arrB = [];

    getOrbits(start, arrA);
    getOrbits(end, arrB);  

    let common = getFirstShared(arrA, arrB);
    let distanceA = arrA.indexOf(common) + 1;
    let distanceB = arrB.indexOf(common) + 1;
    
    return distanceA+distanceB;
}

const getFirstShared = (arrA, setB) => {
    let common;

    for (let i = arrA.length-1; i >= 0; i--) {
        let name = arrA[i];
        if (!setB.includes(name)) {
            common = arrA[i+1];
            break;
        }
    }

    return common;
}

const getOrbits = (obj, arr) => {
    if (obj.orbits !== null) {
        arr.push(obj.orbits.name);
        getOrbits(obj.orbits, arr);
    }
}

const setupOrbits = (lines) => {
    const objects = {};

    lines.forEach(orbit => {
        const [objA, objB] = orbit.split(')');

        if (objects[objA] === undefined) objects[objA] = createObj(objA, null);
        if (objects[objB] === undefined) objects[objB] = createObj(objB, objects[objA]);

        objects[objA].orbitting.push(objects[objB]);
        objects[objB].orbits = objects[objA];
    });

    return objects;
}

const numberOfOrbits = (obj) => {
    let orbits = 0;
    let currentObj = obj;
    while (currentObj.orbits !== null) {
        currentObj = currentObj.orbits;
        orbits++;
    }
    return orbits;
}

const createObj = (name, orbits) => {
    return {
        name: name,
        orbitting: [],
        orbits: orbits
    };
}

//====================================================== TESTING ======================================================

const testFirst = (input, expectedValue) => {
    let answer = first(input);
    if (answer === expectedValue) console.log(true);
    else console.log(false);
}

const testSecond = (input, expectedValue) => {
    let answer = second(input);
    if (answer === expectedValue) console.log(true);
    else console.log(false);
}

testFirst(`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`, 42);

testSecond(`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`, 4);

testSecond(`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
H)YOU
I)SAN`, 5);

readFile('day6Input.txt', runFunctions);