const readFile = require('./readFile').readFile;
const { modInv, modPow } = require('bigint-crypto-utils');

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let instructions = input.split('\n');

    let cards = new Array(10007).fill(0);    
    cards = cards.map((a,i) => i);    
    cards = runInstructions(cards, instructions);

    console.log('First Star: ', cards.indexOf(2019));
};

const runInstructions = (cards, instructions) => {
    instructions.forEach(inst => {
        if (inst.includes('stack')) cards = cards.reverse();

        if (inst.includes('cut')) {
            let matches = inst.match(/[0-9-]+/g);
            let val = Number(matches[0]);

            let first = cards.slice(val);
            let second = cards.slice(0,val);
            cards = [...first, ...second];
        }

        if (inst.includes('increment')) {
            let matches = inst.match(/[0-9]+/g);
            let val = Number(matches[0]);   

            let temp = new Array(cards.length);
            for (let i = 0; i < cards.length; i++) {
                let newPos = (val*i)%cards.length;                
                temp[newPos] = cards[i];
            }
            cards = [...temp];
        }
    });
    return cards;
}

const second = (input) => {
    //had to read through the explanation here before I could do this: https://www.reddit.com/r/adventofcode/comments/ee0rqi/2019_day_22_solutions/fbnkaju/
    
    let instructions = input.split('\n');
    let numberCards = 119315717514047n;
    let repetitions = 101741582076661n;  

    let [offset,increment] = [0n,1n];
    instructions.forEach(inst => {
        if (inst.includes('stack')) {
            increment *= -1n;
            offset += increment;
        }

        if (inst.includes('cut')) {
            let matches = inst.match(/[0-9-]+/g);
            let val = BigInt(matches[0]);
            offset += increment * val;
        }

        if (inst.includes('increment')) {
            let matches = inst.match(/[0-9]+/g);
            let val = BigInt(matches[0]);            
            increment *= modInv(val, numberCards);
        }
    });
    
    const inc = modPow(increment, repetitions, numberCards);
    const off = offset * (1n - inc) * modInv((1n - increment), numberCards);

    console.log('Second Star: ', Number((off + inc * 2020n) % numberCards));
};

readFile('day22Input.txt', runFunctions);