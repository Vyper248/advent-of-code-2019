const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    const arr = input.split('').map(Number);

    const width = 25;
    const height = 6;
    const totalPerLayer = width * height;

    let chosenArr;
    let fewestZeros = 150;

    for (let i = 0; i < arr.length; i+=totalPerLayer) {
        let subArr = arr.slice(i, i+totalPerLayer);        
        let zeros = subArr.filter(a => a === 0);
        if (zeros.length < fewestZeros) {
            chosenArr = subArr;
            fewestZeros = zeros.length;
        }
    }

    const ones = chosenArr.filter(a => a === 1);
    const twos = chosenArr.filter(a => a === 2);
    const result = ones.length * twos.length;

    console.log('First Star: ', result);
};

const second = (input) => {
    const arr = input.split('').map(Number);

    const width = 25;
    const height = 6;
    const totalPerLayer = width * height;

    const layers = getLayers(arr, totalPerLayer);
    const finalImage = getFinalImage(layers, totalPerLayer);
    viewImage(finalImage, width);
};

const getLayers = (arr, totalPerLayer) => {
    let layers = [];

    for (let i = 0; i < arr.length; i+=totalPerLayer) {
        let subArr = arr.slice(i, i+totalPerLayer);   
        layers.push(subArr);
    }  

    return layers;
}

const getFinalImage = (layers, totalPerLayer) => {
    const finalImage = []; 

    for (let i = 0; i < totalPerLayer; i++) {
        for (let layer of layers) {
            if (layer[i] !== 2) {
                finalImage[i] = layer[i] === 1 ? '#' : ' ';
                break;
            }
        }
    }

    return finalImage;
}

const viewImage = (image, width) => {
    console.log('Second Star: ');
    for (let i = 0; i < image.length; i+=width) {
        let subArr = image.slice(i,i+width);
        console.log(subArr.join(''));
    }
}

readFile('day8Input.txt', runFunctions);