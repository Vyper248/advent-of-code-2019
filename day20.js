const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let [available, posLinks, start, end] = setup(input);
    let steps = pathFind(start, end, available, posLinks);
    console.log('First Star: ', steps);
};

const second = (input) => {
    let [available, posLinks, start, end] = setup(input);    
    let steps = pathFind(start, end, available, posLinks, 1);
    console.log('Second Star: ', steps);
};

const setup = (input) => {
    let available = new Set();
    let links = {};
    let map = input.split('\n').map(line => line.split(''));

    for (let y = 0; y < map.length; y++) {
        let xArr = map[y];
        for (let x = 0; x < xArr.length; x++) {
            let val = xArr[x];
            if (val === '.') available.add(`${x},${y}`);
            if (/[A-Z]/.test(val)) {
                let [portalPos, portalName] = checkForPortal(map, x, y);
                
                if (portalPos) {
                    if (links[portalName] === undefined) links[portalName] = [];
                    links[portalName].push(portalPos);
                }
            }
        }
    }

    let posLinks = {};
    Object.values(links).forEach(link => {
        if (link.length === 2) {
            posLinks[link[0]] = link[1];
            posLinks[link[1]] = link[0];
        }
    });

    let start = links['AA'][0]+',0';
    let end = links['ZZ'][0]+',0';  

    return [available, posLinks, start, end];
}

const pathFind = (start, end, available, links, type=0) => {
    let [startX, startY, startLevel] = start.split(',').map(Number);

    let visited = new Set();
    let queue = [];
    let currentNode = {x: startX, y: startY, level: 0, steps: 0, prevNode: null};    

    while (true) {
        let {x, y, level, steps} = currentNode;
        
        if (`${x},${y},${level}` === end) return currentNode.steps

        if (visited.has(`${x},${y},${level}`)) {            
            let nextNode = queue.shift();
            currentNode = nextNode;
            continue;
        }

        visited.add(`${x},${y},${level}`);
        
        let possible = getPossible(x, y, level, available, links, visited, type);  
        addToQueue(queue, possible, steps);              

        if (queue.length === 0) break;

        currentNode = queue.shift();
    }

    return false;    
}

const addToQueue = (queue, possible, steps) => {
    possible.forEach(pos => {
        let [newX, newY, newLevel] = pos.split(',').map(Number);
        queue.push({x: newX, y: newY, level: newLevel, steps: steps+1});
    });
}

const getPossible = (x, y, level, available, links, visited, type=0) => {
    let possible = [];

    [[0,-1], [0,1], [-1,0], [1,0]].forEach(offset => {
        let pos = `${x+offset[0]},${y+offset[1]}`;
        if (available.has(pos) && !visited.has(pos+','+level)) possible.push(pos+','+level);
    });

    let pos = links[`${x},${y}`];

    //first star
    if (links[`${x},${y}`] !== undefined && type === 0 && !visited.has(pos+',0')) possible.push(pos+',0');  

    //second star
    if (links[`${x},${y}`] !== undefined && type === 1) {
        if (checkOuter(x,y,126,129) && level > 0 && !visited.has(pos+','+(level-1))) possible.push(pos+','+(level-1));    
        else if (!checkOuter(x,y,126,129) && level < 30 && !visited.has(pos+','+(level+1))) possible.push(pos+','+(level+1));    
    }

    return possible;
}

const checkForPortal = (map, x, y) => {
    let dirs = [[0,-1], [0,1], [-1,0], [1,0]];

    let adjacentLetter = '';
    let adjacentPos = '';
    let offset = 0;
    dirs.forEach(([xPos,yPos]) => {
        if (map[y+yPos] === undefined) return;
        if (map[y+yPos][x+xPos] === undefined) return;
        
        let val = map[y+yPos][x+xPos];
        
        if (/[A-Z]/.test(val)) adjacentLetter = val;
        if (val === '.') {
            adjacentPos = `${x+xPos},${y+yPos}`;
            offset = yPos === 0 ? xPos : yPos;
        }
    });    

    if (offset === 0) return [false, false];

    let portalName = '';
    if (offset > 0) portalName = `${adjacentLetter}${map[y][x]}`;
    else portalName = `${map[y][x]}${adjacentLetter}`;
    
    return [adjacentPos, portalName];
}

const checkOuter = (x, y, width, height) => {
    let xOuter = x < 5 || x > width-5 ? true : false;
    let yOuter = y < 5 || y > height-5 ? true : false;
    return xOuter || yOuter ? 1 : 0;
}

readFile('day20Input.txt', runFunctions);
