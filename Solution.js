const fs = require('fs');

function decodeValue(base, value) {
    return parseInt(value, base);
}

function parseInput(data) {
    const points = [];
    const keys = data["keys"];
    const n = keys["n"];
    const k = keys["k"];
    
    for (let key in data) {
        if (key === "keys") continue; 
        const x = parseInt(key);
        const base = parseInt(data[key]["base"]);
        const value = data[key]["value"];
        const y = decodeValue(base, value);
        points.push({ x: x, y: y });
    }
    return { n, k, points };
}

function lagrangeInterpolation(points) {
    const xValues = points.map(point => point.x);
    const yValues = points.map(point => point.y);

    return function(x) {
        let result = 0;
        for (let i = 0; i < yValues.length; i++) {
            let term = yValues[i];
            for (let j = 0; j < xValues.length; j++) {
                if (i !== j) {
                    term *= (x - xValues[j]) / (xValues[i] - xValues[j]);
                }
            }
            result += term;
        }
        return result;
    };
}

function findWrongPoints(data) {
    const { n, k, points } = parseInput(data);

    const validPoints = points.slice(0, k);

    const polynomial = lagrangeInterpolation(validPoints);

    const wrongPoints = [];
    for (let i = k; i < points.length; i++) {
        const point = points[i];
        const expectedY = polynomial(point.x);
        if (Math.round(expectedY) !== point.y) { 
            wrongPoints.push(point);
        }
    }

    return wrongPoints;
}

function solveSecret(data) {
    const { n, k, points } = parseInput(data);
    const polynomial = lagrangeInterpolation(points);
    const constantTerm = polynomial(0);
    
    return constantTerm;
}

function solveAndFindWrongPoints(data1, data2) {
    const constantTerm1 = solveSecret(data1);
    console.log(`Secret (Constant term) for Test Case 1:`, constantTerm1);

    const constantTerm2 = solveSecret(data2);
    console.log(`Secret (Constant term) for Test Case 2:`, constantTerm2);

    const wrongPoints1 = findWrongPoints(data1);
    if (wrongPoints1.length === 0) {
        console.log('No wrong points found in Test Case 1');
    } else {
        console.log('Wrong points in Test Case 1:', wrongPoints1);
    }

    const wrongPoints2 = findWrongPoints(data2);
    if (wrongPoints2.length === 0) {
        console.log('No wrong points found in Test Case 2');
    } else {
        console.log('Wrong points in Test Case 2:', wrongPoints2);
    }
}

fs.readFile('Input1.json', 'utf8', (err, data1) => {
    if (err) {
        console.error('Error reading Input1 file:', err);
        return;
    }
    
    fs.readFile('Input2.json', 'utf8', (err, data2) => {
        if (err) {
            console.error('Error reading Input2 file:', err);
            return;
        }

        const jsonData1 = JSON.parse(data1);
        const jsonData2 = JSON.parse(data2);
        solveAndFindWrongPoints(jsonData1, jsonData2);
    });
});