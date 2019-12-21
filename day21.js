const readFile = require('./readFile').readFile;
const {intcodeProgram} = require('./intcode');

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let arr = input.split(',').map(Number);
    let program = intcodeProgram(arr);

    //walkthrough (how it was solved manually)
    /*
        if no space in A, and space at D, jump - jump any gap where hole directly in front and space where it would land
        if no space in B, and space at D, jump - jump a 1/2 wide hole 1 space before the hole
        if no space in C, but space in D, jump - jump a 1 wide hole, landing directly after

        if ((!A || !B || !C)) && D) J = true

        if (!A) J = true;
        if (!B) T = true;
        if (T || J) J = true;
        if (!C) T = true;
        if (T || J) J = true;
        if (D && J) J = true;
    */

    let instructions = ['NOT A J', 'NOT B T', 'OR T J', 'NOT C T', 'OR T J', 'AND D J'];
    let output = getOutput(program, instructions, 'WALK');
    console.log('First Star: ', output);
};

const second = (input) => {
    let arr = input.split(',').map(Number);
    let program = intcodeProgram(arr);

    //walkthrough (how it was solved manually)
    /*
        Like before, but with added end: if no space in A,B,C, but space in D, and if space in H Or space in E, can jump

        //new formula
        if ((!A || !B || !C)) && D && (H || E)) J = true

        //old section doesn't need to change
        if (!A) J = true;
        if (!B) T = true;
        if (T || J) J = true;
        if (!C) T = true;
        if (T || J) J = true;
        if (D && J) J = true;

        //set T to true if can jump at this point
        if (!J) T = true; - if can jump, T = false
        if (!T) T = true; if can jump, T = true (invert previous)

        if (H && T) T = true; //if space in H and can jump, can still jump. If not space, T = false
        if (E || T) T = true; //if space in E or H was true before, can jump
        if (T && J) J = true; //So if can previously jump and space in either H or E, can still jump
    */

    let instructions = ['NOT A J', 'NOT B T', 'OR T J', 'NOT C T', 'OR T J', 'AND D J', 'NOT J T', 'NOT T T', 'AND H T', 'OR E T', 'AND T J'];
    let output = getOutput(program, instructions, 'RUN');
    console.log('Second Star: ', output);
};

const getOutput = (program, instructions, type, test=false) => {
    cycleToInput(program);
    
    instructions.forEach(instruction => {
        input(instruction, program);
        program.next(10);
    });

    input(type, program);

    return cycleToInput(program, 10, test);
}

const input = (string, program) => {
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

readFile('day21Input.txt', runFunctions);