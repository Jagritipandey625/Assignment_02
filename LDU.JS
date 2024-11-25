function generateMatrix() {
    const size = parseInt(document.getElementById('matrix-size').value);
    if (isNaN(size) || size < 2) {
        alert("Please enter a valid matrix size (n ≥ 2).");
        return;
    }

    const matrixInput = document.getElementById('matrix-input');
    matrixInput.innerHTML = '';
    for (let i = 0; i < size; i++) {
        let row = '<tr>';
        for (let j = 0; j < size; j++) {
            row += `<td><input type="number" id="cell-${i}-${j}" /></td>`;
        }
        row += '</tr>';
        matrixInput.innerHTML += row;
    }
    document.getElementById('matrix-container').style.display = 'block';
}

function calculateLDU() {
    const size = parseInt(document.getElementById('matrix-size').value);
    let matrix = [];

    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            let value = parseFloat(document.getElementById(`cell-${i}-${j}`).value);
            if (isNaN(value)) {
                alert("Please fill in all matrix values.");
                return;
            }
            row.push(value);
        }
        matrix.push(row);
    }

    let L = Array.from({ length: size }, () => Array(size).fill(0));
    let D = Array.from({ length: size }, () => Array(size).fill(0));
    let U = Array.from({ length: size }, () => Array(size).fill(0));
    const stepsContainer = document.getElementById('steps');
    stepsContainer.innerHTML = "";

    for (let i = 0; i < size; i++) {
        L[i][i] = 1; // Diagonal elements of L are 1
        for (let j = i; j < size; j++) {
            let sum = 0;
            for (let k = 0; k < i; k++) {
                sum += L[i][k] * D[k][k] * U[k][j];
            }
            U[i][j] = matrix[i][j] - sum;
        }
        for (let j = i + 1; j < size; j++) {
            let sum = 0;
            for (let k = 0; k < i; k++) {
                sum += L[j][k] * D[k][k] * U[k][i];
            }
            L[j][i] = (matrix[j][i] - sum) / U[i][i];
        }
        D[i][i] = U[i][i];
        U[i][i] = 1; // Normalize U diagonal to 1

        // Log steps for better visualization
        appendStep(i, L, U, D, stepsContainer);
    }

    displayResults(L, U, D);
}

function appendStep(step, L, U, D, container) {
    const stepBox = document.createElement('div');
    stepBox.className = 'box';
    stepBox.innerHTML = `
        <h4>Step ${step + 1}: Update L, U, D</h4>
        <strong>L:</strong><br>${L.map(row => row.map(val => val.toFixed(2)).join(' ')).join('<br>')}
        <br><strong>U:</strong><br>${U.map(row => row.map(val => val.toFixed(2)).join(' ')).join('<br>')}
        <br><strong>D:</strong><br>${D.map(row => row.map(val => val.toFixed(2)).join(' ')).join('<br>')}
    `;
    container.appendChild(stepBox);
}

function displayResults(L, U, D) {
    document.getElementById('lower-matrix').textContent = L.map(row => row.join(' ')).join('\n');
    document.getElementById('upper-matrix').textContent = U.map(row => row.join(' ')).join('\n');
    document.getElementById('diagonal-matrix').textContent = D.map(row => row.join(' ')).join('\n');
    document.getElementById('steps-container').style.display = 'block';
    document.getElementById('results-container').style.display = 'block';
}
