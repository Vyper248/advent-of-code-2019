let c = document.getElementById("board");
let ctx = c.getContext("2d");

let program;
let input = document.getElementById('input');
let text = document.getElementById('text');
let inv = document.getElementById('inv');
let inventory = [];

let x = 2;
let y = 1;
let width = 8;
let height = 5;
let map = {
    '2,1': {
        name: 'Hull Breach',
        directions: ['north', 'south', 'west'],
        items: []
    }
};

function keypress(e) {
    if (e.key === 'Enter') {
        let val = input.value;
        input.value = '';
        runCommand(val);
    }
}

const first = (input) => {   
    let arr = input.split(',').map(Number);
    program = intcodeProgram(arr);

    let output = cycleToInput(program, 0, true);
    text.innerText += output;   

    createMap();
};

const runCommand = (command) => {
    if (command.includes('take infinite')) {
        let obj = map[`${x},${y}`];
        if (obj.items.includes('infinite loop')){
            text.innerText += '\n\nYou can\'t take this, it would cause an infinite loop!\n\nCommand?';
            text.scrollTop = 50000000;
        }
        return;
    }

    inputStr(command, program);
    output = cycleToInput(program, 10, true);

    if (output.includes('typing')) {
        text.innerText += output;
        text.scrollTop = 50000000;
        [xOff, yOff] = getXY(command);
        x += xOff;
        y += yOff;
        map[`${x},${y}`] = {
            directions: ['east'],
            items: [],
        }
        createMap();
        return;
    }

    let obj = parseOutput(output);
    
    if (/(south|north|west|east)/.test(command) && !output.includes('You can\'t go that way') && !output.includes('Alert')) {
        [xOff, yOff] = getXY(command);
        x += xOff;
        y += yOff;
    }    

    if (map[`${x},${y}`] === undefined) {
        map[`${x},${y}`] = obj;
        console.log(obj);
        
    }

    if (output.includes('You take the')) {
        let item = output.match(/You take the ([a-zA-Z ]+)/)[1];
        inventory.push(item);
        map[`${x},${y}`].items = map[`${x},${y}`].items.filter(a => a !== item);
    } else if (output.includes('You drop the')) {
        let item = output.match(/You drop the ([a-zA-Z ]+)/)[1];
        inventory = inventory.filter(a => a !== item);
        map[`${x},${y}`].items.push(item);
    }

    createMap();

    inv.innerHTML = '<h2>Inventory</h2> <br/>';
    inventory.forEach(item => {
        inv.innerHTML += item + '<br/>';
    });

    text.innerText += output;
    text.scrollTop = 50000000;

    if (output.includes('cockpit')) {
        text.innerText += '\n\nYou\'re finished now, if you want to play again please refresh the page!';
        text.scrollTop = 50000000;
    } else if (!output.includes('Command?')) {
        text.innerText += '\n\nYou\'re dead now, please refresh the page and try again!';
        text.scrollTop = 50000000;
    }
}

const createMap = () => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,900,500);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let key = `${x},${y}`;
            let obj = map[key];
            if (obj) {
                createRoom(x*150, y*150);
                obj.directions.forEach(dir => {
                    createHall(x*150, y*150, dir);
                });
                obj.items.forEach((item, i) => {
                    ctx.fillStyle = '#00FF00';
                    let [xPos, yPos] = getItemPos(x,y,i);                    
                    ctx.fillRect(xPos,yPos,20,20);
                });
            }
        }
    }

    ctx.fillStyle = '#FF0000';
    ctx.fillRect((x*150)+65,(y*150)+65,20,20);
}

const createRoom = (x,y) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x+25, y+25, 100, 100);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x+30, y+30, 90, 90);
}

const createHall = (x,y,dir) => {
    if (dir === 'north') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x+50, y, 50, 25);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x+55, y, 40, 35);
    }
    if (dir === 'east') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x+125, y+50, 25, 50);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x+115, y+55, 35, 40);
    }
    if (dir === 'south') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x+50, y+125, 50, 25);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x+55, y+115, 40, 35);
    }
    if (dir === 'west') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y+50, 25, 50);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y+55, 35, 40);
    }
}

const getItemPos = (x,y,i) => {
    x *= 150;
    y *= 150;

    if (i === 0) return [x+40, y+40];
    if (i === 1) return [x+65, y+40];
    if (i === 2) return [x+90, y+40];

    if (i === 3) return [x+40, y+65];
    if (i === 4) return [x+90, y+65];

    if (i === 5) return [x+40, y+90];
    if (i === 6) return [x+65, y+90];
    if (i === 7) return [x+90, y+90];
}

const parseOutput = (output) => {    
    let name = output.match(/\=\= ([a-zA-Z ]+) \=\=/);
    if (name === null) return output;

    name = name[1];
    let directions = output.match(/(south|north|west|east)/g);
    let items = output.match(/- (?!south|east|north|west)[a-zA-Z ]+/g);
    let text = output.match(/==\n([a-zA-Z .;'-]+)/)[1];

    if (items) {
        items = items.map(item => item.replace('- ', ''));
    } else {
        items = [];
    }
    
    let obj = {
        name,
        text,
        directions,
        items
    }

    return obj;
}

const getXY = (direction) => {
    if (direction === 'north') return [0,-1];
    if (direction === 'south') return [0,1];
    if (direction === 'east') return [1,0];
    if (direction === 'west') return [-1,0];
}

const inputStr = (string, program) => {
    string.split('').forEach(char => {
        program.next(char.charCodeAt(0));
    });
}

const cycleToInput = (program, val, test=false) => {
    let outputArr = [];
    let output = program.next(val);
    
    while (output.value !== undefined && output.done === false) {
        outputArr.push(output.value);
        output = program.next();                
    }    
        
    if (test) return outputArr.map(val => String.fromCharCode(val)).join('');
    else return outputArr[outputArr.length-1]
}

function *intcodeProgram(arr) {
    let length = 4;
    let relativeBase = 0;

    let i = 0;
    while (true) {                
        let [opcode, paramA, paramB, paramC] = getParams(arr[i]);

        if (opcode === 99) break;

        length = 4;
        let inputA = arr[i+1];
        let inputB = arr[i+2];
        let output = arr[i+3];  

        //check if output and input need to be adjusted for relative base
        if (paramC === 2) output = output + relativeBase;  
        if (paramA === 2 && opcode === 3) inputA = inputA + relativeBase;    

        let inputAVal = getValue(paramA, arr, inputA, relativeBase);
        let inputBVal = getValue(paramB, arr, inputB, relativeBase);

        let error = false;
             
        switch (opcode) {
            case 1: arr[output] = inputAVal + inputBVal; break; //add
            case 2: arr[output] = inputAVal * inputBVal; break; //multiply
            case 3: arr[inputA] = yield; length = 2; break; //input
            case 4: yield inputAVal; length = 2; break; //output
            case 5: inputAVal !== 0 ? [i, length] = [inputBVal, 0] : length = 3; break; //jump-if-true
            case 6: inputAVal === 0 ? [i, length] = [inputBVal, 0] : length = 3; break; //jump-if-false
            case 7: inputAVal < inputBVal ? arr[output] = 1 : arr[output] = 0; break; //less than
            case 8: inputAVal === inputBVal ? arr[output] = 1 : arr[output] = 0; break; //equal
            case 9: relativeBase += inputAVal; length = 2; break; //adjust relative base
            default: error = true; break;
        }

        if (error) {
            console.log('Error, opcode was: ', opcode);
            break;
        }     

        i+=length;   
    }
}

const getValue = (param, arr, input, relativeBase) => {    
    if (param === 0) return arr[input] !== undefined ? arr[input] : 0;
    if (param === 1) return input != undefined ? input : 0;
    if (param === 2) return arr[relativeBase+input] !== undefined ? arr[relativeBase+input] : 0;
    else console.log('Error, wrong param');
}

const getParams = (num) => {    
    if (num < 100) return [num, 0, 0];

    let parts = (num+'').split('').map(Number);
    
    let opCode = Number(`${parts[parts.length-2]}${parts[parts.length-1]}`);
    let paramA = parts[parts.length-3] === undefined ? 0 : parts[parts.length-3];
    let paramB = parts[parts.length-4] === undefined ? 0 : parts[parts.length-4];
    let paramC = parts[parts.length-5] === undefined ? 0 : parts[parts.length-5];

    return [opCode, paramA, paramB, paramC];
}

fetch('../day25Input.txt').then(resp => resp.text()).then(data => {
    first(data);
});