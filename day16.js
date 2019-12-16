const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let arr = input.split('').map(Number);
    arr = calculate(arr);

    console.log('First Star: ', arr.slice(0,8).join(''));
};

const second = (input) => {
    let arr = input.split('').map(Number);
    let skip = Number(arr.slice(0,7).join(''));

    let totalLength = arr.length*10000;
    let startingPoint = skip % arr.length;

    let newArr = [];
    for (let i = 0; i < totalLength-skip; i++) {
        let index = (startingPoint+i) % arr.length;
        newArr[i] = arr[index];
    }

    newArr = calculateSecond(newArr);

    console.log('Second Star: ', newArr.slice(0,8).join(''));
};  

const calculateSecond = (arr) => {
    let newArr = [...arr];
    let last = newArr[newArr.length-1];

    for (let i = 0; i < 100; i++) {
        let tempArr = [];
        tempArr[newArr.length-1] = last;
        for (let j = newArr.length-2; j >=0; j--) {
            tempArr[j] = (tempArr[j+1] + newArr[j])%10;
        }
        newArr = tempArr;
    }

    return newArr;
}

const calculate = (arr) => {
    arr = [...arr];

    for (let phase = 0; phase < 100; phase++){
        arr = arr.map((val, pos) => {
            let sum = 0;
            for (let i = 0; i < arr.length; i++) {
                let patternVal = getPattern(pos+1, i);
                sum += arr[i] * patternVal;
            }
            return getOnes(sum);
        });
    }

    return arr;
}

const getPattern = (loop, index) => {
    let pattern = [0,1,0,-1];
    let i = Math.floor(((index+1) % (4*loop)) / loop);
    return pattern[i];
}

const getOnes = (val) => {
    let result = val % 10;
    return Math.abs(result);
}

// first('12345678');
// first('80871224585914546619083218645595');
// first('19617804207202209144916044189917');
// first('69317163492948606335995924319873');

// second('03036732577212944063491565474664');
// second('02935109699940807407585447034323');

readFile('day16Input.txt', runFunctions);