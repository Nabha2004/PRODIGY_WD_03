const gameBoard = document.getElementById('game-board');
const gameStatus = document.getElementById('game-status');
const restartButton = document.getElementById('restart-button');
const gameModeSelect = document.getElementById('game-mode-select');

const cells = [];
let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function initializeGameBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-cell-index', i);
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
        cells.push(cell);
    }
    updateGameStatus(`Player ${currentPlayer}'s turn`);
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[cellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    if (checkWin() || checkDraw()) {
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateGameStatus(`Player ${currentPlayer}'s turn`);

        if (gameModeSelect.value === 'ai' && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }
}

function updateGameStatus(message) {
    gameStatus.textContent = message;
}

function checkWin() {
    for (let i = 0; i < winCombinations.length; i++) {
        const [a, b, c] = winCombinations[i];
        if (gameState[a] === gameState[b] && gameState[a] === gameState[c] && gameState[a] !== '') {
            updateGameStatus(`Player ${currentPlayer} wins!`);
            highlightWinningCells(winCombinations[i]);
            return true;
        }
    }
    return false;
}

function checkDraw() {
    if (!gameState.includes('')) {
        updateGameStatus(`It's a draw!`);
        return true;
    }
    return false;
}

function highlightWinningCells(winningCells) {
    winningCells.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

function makeAIMove() {
    let availableCells = gameState
        .map((value, index) => value === '' ? index : null)
        .filter(value => value !== null);

    if (availableCells.length > 0) {
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        gameState[randomIndex] = currentPlayer;
        cells[randomIndex].textContent = currentPlayer;
        cells[randomIndex].classList.add(currentPlayer.toLowerCase());

        if (checkWin() || checkDraw()) {
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateGameStatus(`Player ${currentPlayer}'s turn`);
        }
    }
}

restartButton.addEventListener('click', () => {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell', 'x', 'o');
    });
    updateGameStatus(`Player ${currentPlayer}'s turn`);
});

gameModeSelect.addEventListener('change', () => {
    if (gameModeSelect.value === 'ai' && currentPlayer === 'O') {
        makeAIMove();
    }
});

initializeGameBoard();
