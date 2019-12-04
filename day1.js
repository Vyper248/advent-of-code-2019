const readFile = require('./readFile').readFile;

const first = (input) => {
    let fuel = 0;
    input.split('\n').map(Number).forEach(mass => {
        fuel += calculateFuel(mass);
    });
    console.log('First Star: ', fuel);
};

const second = (input) => {
    let fuel = 0;
    input.split('\n').map(Number).forEach(mass => {
        fuel += calculateFuelRecursive(mass);
    });
    console.log('Second Star: ', fuel);
};

const calculateFuel = (mass) => {
    return Math.floor(mass/3) - 2;
}

const calculateFuelRecursive = (mass) => {
    let fuel = calculateFuel(mass);
    if (fuel <= 0) return 0;

    fuel += calculateFuelRecursive(fuel);

    return fuel;
}

//====================================================== TESTING ======================================================

const testFirst = (input, expectedValue) => {
    if (calculateFuel(input) === expectedValue) console.log(true);
    else console.log(false);
}

testFirst(1969, 654);
testFirst(100756, 33583);

const testSecond = (input, expectedValue) => {
    if (calculateFuelRecursive(input) === expectedValue) console.log(true);
    else console.log(false);
}

testSecond(1969, 966);
testSecond(100756, 50346);

//==================================================== READ FILE =====================================================

readFile('day1Input.txt', first);
readFile('day1Input.txt', second);