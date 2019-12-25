const readFile = require('./readFile').readFile;
const {intcodeProgram} = require('./intcode');

const runFunctions = (input) => {
    first(input);
}

//Solved Manually using Visualisation - check http://vyper248.github.io/advent-of-code-2019/visuals/day25Visual.html
const first = (input) => {   
    let arr = input.split(',').map(Number);
    let program = intcodeProgram(arr);

    let output = cycleToInput(program, 0, true);    
    let commands = ['south', 'take mutex', 'south', 'west', 'west', 'take klein bottle', 'east', 'east', 'north', 'east', 'take mug', 'east', 'north', 'north', 'take hypercube', 'south', 'south', 'east', 'east', 'east', 'south', 'west', 'west'];

    commands.forEach(command => {
        inputStr(command, program);
        output = cycleToInput(program, 10, true);
    });

    console.log('First Star: ', output.match(/typing ([0-9]+) /)[1]);
};

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

readFile('day25Input.txt', runFunctions);