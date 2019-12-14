const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    both(input);
}

const both = (input) => {
    let [recipes, wasted] = getRecipesAndWasted(input);

    let fuel = 1;
    let oreCost = findOreCost(recipes, {...wasted}, 'FUEL', fuel);
    console.log('First Star: ', oreCost);

    //quick check to get close to 1 trillion
    while (oreCost < 1000000000000) {
        fuel+=10000;
        oreCost = findOreCost(recipes, {...wasted}, 'FUEL', fuel);
    }

    //reduce until just under
    while (oreCost > 1000000000000) {
        fuel--;
        oreCost = findOreCost(recipes, {...wasted}, 'FUEL', fuel);        
    }    

    console.log('Second Star: ', fuel);
};

const createRecipe = (name, qty, inputs) => {
    inputs.forEach(arr => arr[0] = Number(arr[0]));
    return {
        qty: qty,
        inputs: inputs,
    };
}

const getRecipesAndWasted = (input) => {
    let wasted = {};
    let recipes = {};

    input.split('\n').forEach(line => {
        let parts = line.split(' => ');
        let inputs = parts[0].split(', ').map(a => a.split(' '));
        let output = parts[1].split(' ');

        let name = output[1];
        let qty = Number(output[0]);
        let recipe = recipes[name];

        recipes[name] = createRecipe(name, qty, inputs);
        wasted[name] = 0;
    });   

    return [recipes, wasted];
}

const findOreCost = (recipes, wasted, name, qtyWanted) => {
    let recipe = recipes[name];
    let qty = recipe.qty;
    let inputs = recipe.inputs;

    let qtyNeeded = checkWasted(qtyWanted, wasted, name);   

    if (qtyNeeded === 0) return 0;
    
    let multiple = Math.ceil(qtyNeeded / qty);
    let leftover = (multiple * qty) - qtyNeeded;
    wasted[name] += leftover;

    let ore = 0;
    inputs.forEach(([inputQty,inputName]) => {
        if (inputName === 'ORE') {
            ore += inputQty * multiple;
        } else {
            ore += findOreCost(recipes, wasted, inputName, inputQty*multiple);
        }
    });

    return ore;
}

const checkWasted = (qtyWanted, wasted, name) => {
    let qtyNeeded = qtyWanted;
    if (wasted[name] > 0 && wasted[name] <= qtyNeeded) {
        qtyNeeded -= wasted[name];
        wasted[name] = 0;
    } else if (wasted[name] > qtyNeeded) {
        qtyNeeded = 0;
        wasted[name] -= qtyWanted;
    }
    return qtyNeeded;
}

readFile('day14Input.txt', runFunctions);