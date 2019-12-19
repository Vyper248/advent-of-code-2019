const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let [objMap, keys] = getMapAndKeys(input);
    let [startX, startY] = Object.keys(objMap).find(pos => objMap[pos] === '@').split(',').map(Number);
    
    let distanceMap = mapAllDistances(objMap, keys, startX, startY);    
    let steps = findShortestPath(distanceMap, '@', new Set(), keys.size, 0);
    console.log('First Star: ', steps);
};

const second = (input) => {
    let [objMap, keys] = getMapAndKeys(input);
    let startPositions = updateMapForSecond(objMap);        

    let total = 0;
    startPositions.forEach(pos => {
        let distanceMap = mapAllDistances(objMap, keys, pos[0], pos[1]);         
        filterDistanceMap(distanceMap);      
        let numberKeys = Object.keys(distanceMap['@']).length;
        let steps = findShortestPath(distanceMap, '@', new Set(), numberKeys, 0);
        total += steps;
    });

    console.log('Second Star: ', total);
};

const updateMapForSecond = (objMap) => {
    let [startX, startY] = Object.keys(objMap).find(pos => objMap[pos] === '@').split(',').map(Number);
    delete objMap[`${startX},${startY-1}`]
    delete objMap[`${startX},${startY+1}`]
    delete objMap[`${startX+1},${startY}`]
    delete objMap[`${startX-1},${startY}`]

    delete objMap[`${startX},${startY}`]

    objMap[`${startX-1},${startY-1}`] = '@';
    objMap[`${startX-1},${startY+1}`] = '@';
    objMap[`${startX+1},${startY-1}`] = '@';
    objMap[`${startX+1},${startY+1}`] = '@';

    return [
        [startX-1, startY-1],
        [startX-1, startY+1],
        [startX+1, startY-1],
        [startX+1, startY+1],
    ]
}

const filterDistanceMap = (distanceMap) => {
    let start = distanceMap['@'];
    let keysInRegion = Object.keys(start);    

    Object.keys(distanceMap).forEach(key => {
        if (keysInRegion.includes(key)) return;
        if (key === '@') return;        
        delete distanceMap[key];
    });

    Object.values(distanceMap).forEach(location => {
        Object.values(location).forEach(obj => {
            obj.doors = obj.doors.filter(door => {
                if (keysInRegion.includes(door.toLowerCase())) return true;
                return false;
            });
        });
    });    
}

const getMapAndKeys = (input) => {
    let map = input.split('\n').map(line => line.split(''));
    let objMap = {};

    let keys = new Set();
    let startX = 0;
    let startY = 0;

    for (let y = 0; y < map.length; y++) {
        let arr = map[y];
        for (let x = 0; x < arr.length; x++) {
            let value = arr[x];
            let pos = `${x},${y}`;
            if (/[a-zA-Z.@]/.test(value)) objMap[pos] = value;
            if (/[a-z]/.test(value)) keys.add(pos+`,${value}`);
            if (value === '@') [startX, startY] = [x,y];
        }
    }

    return [objMap, keys];
}

const findShortestPath = (distanceMap, start, keysFound, numberKeys, steps=0, cache={}) => {    
    if (keysFound.size === numberKeys) {        
        return steps;
    }

    //cache previous results to improve performance
    let cacheKey = `${Array.from(keysFound).sort().join(',')},${start}`;
    if (cache[cacheKey] !== undefined) return steps+cache[cacheKey];

    let possibleDestinations = getPossibleDestinations(distanceMap, start, keysFound);    

    let lowestSteps = Infinity;
    possibleDestinations.forEach(destination => {
        let newKeys = new Set(keysFound);
        newKeys.add(destination.destination);
        
        let currentSteps = findShortestPath(distanceMap, destination.destination, newKeys, numberKeys, steps+destination.steps, cache);        
        if (currentSteps < lowestSteps) lowestSteps = currentSteps;
    });

    cache[cacheKey] = lowestSteps - steps;
    return lowestSteps;
}

const getPossibleDestinations = (distanceMap, start, keysFound) => {    
    let destinations = [];    
    
    let possible = distanceMap[start];
    Object.keys(possible).forEach(key => {
        if (key === '@') return;
        if (keysFound.has(key)) return;

        let obj = possible[key];
        let canGetHere = true;

        obj.keys.forEach(passedKey => {
            if (!keysFound.has(passedKey.toLowerCase())) canGetHere = false;
        });

        obj.doors.forEach(door => {
            if (!keysFound.has(door.toLowerCase())) canGetHere = false;
        });

        if (canGetHere) destinations.push({destination: key, steps: obj.steps, keys: obj.keys});
    });

    destinations = destinations.sort((a,b) => a.steps - b.steps);

    return destinations;
}

const mapAllDistances = (objMap, posArr, startX, startY) => {
    let distanceMap = {};
    posArr = Array.from(posArr);    
    posArr.push(`${startX},${startY},@`)

    for (let i = 0; i < posArr.length; i++) {
        for (let j = 0; j < posArr.length; j++) {
            let posA = posArr[i];
            let posB = posArr[j];
            if (posA === posB) continue;

            let obj = pathFromAtoB(objMap, posA, posB);            
            if (!obj) continue; //no path found, skip

            let a = posA.split(',')[2];
            let b = posB.split(',')[2];
            let key = [a, b].sort().join('-');

            if (distanceMap[a] === undefined) distanceMap[a] = {};
            distanceMap[a][b] = obj;
        }
    }

    return distanceMap;
}

const pathFromAtoB = (objMap, a, b) => {    
    a = a.split(',');
    b = b.split(',');

    let visited = new Set();
    let queue = [];
    let currentNode = {x: Number(a[0]), y: Number(a[1]), steps: 0, doors: [], keys: []};

    while (true) {
        let {x, y, steps} = currentNode;
        let posKey = `${x},${y}`;
        visited.add(posKey);

        let possible = getPossible(x, y, objMap, visited);

        possible.forEach(pos => {
            let newNode = {x: pos[0], y: pos[1], steps: steps+1, doors: [...currentNode.doors], keys: [...currentNode.keys]};
            queue.push(newNode);
        });

        if (queue.length === 0) break;

        let next = queue.shift();
        currentNode = next;

        //check if found destination
        let value = objMap[`${currentNode.x},${currentNode.y}`];
        if (value === b[2]) return {steps: currentNode.steps, doors: currentNode.doors, keys: currentNode.keys};

        if (/[A-Z]/.test(value)) {
            currentNode.doors.push(value);
        }
        if (/[a-z]/.test(value)) {
            currentNode.keys.push(value);
        }
    }

    return false;
}

const getPossible = (x, y, objMap, visited, keysFound) => {
    let possible = [];

    if (checkPosition(`${x},${y-1}`, objMap, keysFound, visited)) possible.push([x,y-1]); //up
    if (checkPosition(`${x},${y+1}`, objMap, keysFound, visited)) possible.push([x,y+1]); //down
    if (checkPosition(`${x+1},${y}`, objMap, keysFound, visited)) possible.push([x+1,y]); //left
    if (checkPosition(`${x-1},${y}`, objMap, keysFound, visited)) possible.push([x-1,y]); //right

    return possible;
}

const checkPosition = (pos, objMap, keysFound, visited) => {
    let value = objMap[pos];
    if (value == undefined) return false;
    if (visited.has(pos)) return false;
    return true;
}

// Testing examples

// // 132
// first(
// `########################
// #...............b.C.D.f#
// #.######################
// #.....@.a.B.c.d.A.e.F.g#
// ########################`
// );

// // 86
// first(
// `########################
// #f.D.E.e.C.b.A.@.a.B.c.#
// ######################.#
// #d.....................#
// ########################`
// );

//136
// first(
// `#################
// #i.G..c...e..H.p#
// ########.########
// #j.A..b...f..D.o#
// ########@########
// #k.E..a...g..B.n#
// ########.########
// #l.F..d...h..C.m#
// #################`
// );

//81
// first(
// `########################
// #@..............ac.GI.b#
// ###d#e#f################
// ###A#B#C################
// ###g#h#i################
// ########################`
// );

// second(
// `#############
// #DcBa.#.GhKl#
// #.###...#I###
// #e#d#.@.#j#k#
// ###C#...###J#
// #fEbA.#.FgHi#
// #############`
// );

/*
  0123456789012
0 #############
1 #DcBa.#.GhKl#
2 #.###@#@#I###
3 #e#d#####j#k#
4 ###C#@#@###J#
5 #fEbA.#.FgHi#
6 #############
*/

readFile('day18Input.txt', runFunctions);