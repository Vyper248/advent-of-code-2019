const readFile = require('./readFile').readFile;
const {intcodeProgram} = require('./intcode');

const runFunctions = (input) => {
    both(input);
}

const both = (input) => {   
    let arr = input.split(',').map(Number);
    let queues = new Array(50).fill(null).map(()=>([]));
    let [computers, state] = setupComputers(arr);
    let NAT = [];
    let firstStar = undefined;
    let secondStar = new Set();

    while (true) {
        let allWaiting = true;
        for (let i = 0; i < 50; i++) {
            let comp = computers[i];
            let output = state[i];
            let queue = queues[i];

            //waiting for input
            if (state[i].value === undefined) {

                //NAT function testing (for second star)
                if (i === 49 && allWaiting && NAT[0] > 0) {
                    computers[0].next(NAT[0])
                    state[0] = computers[0].next(NAT[1]);
                    if (secondStar.has(NAT[1])) {
                        console.log('Second Star: ', NAT[1]);
                        return;
                    } else {
                        secondStar.add(NAT[1]);
                    }
                    break;
                }

                if (queue.length > 0) {
                    let inputs = queue.shift();
                    comp.next(inputs[0]);
                    state[i] = comp.next(inputs[1]);
                } else {
                    state[i] = comp.next(-1);
                }

            } else {
                allWaiting = false;
                
                let address = state[i].value;
                let x = comp.next().value;
                let y = comp.next().value;
                state[i] = comp.next();

                if (address === 255 && firstStar === undefined) {
                    firstStar = y;
                    console.log('First Star: ', y);
                }                

                if (address === 255) NAT = [x,y];
                else queues[address].push([x,y]);
            }
        }
    }        
};

const setupComputers = (arr) => {
    let computers = [];
    let state = [];

    for (let i = 0; i < 50; i++) {
        let newComputer = intcodeProgram([...arr]);
        newComputer.next();//move to input instruction
        let output = newComputer.next(i);//pass in address
        computers[i] = newComputer;
        state[i] = output;
    }

    return [computers, state];
}

readFile('day23Input.txt', runFunctions);