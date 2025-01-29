var nextPlayer = false;
var board = ["", "", "", "", "", "", "", "", ""];
var timerInterval;
var timeLeft = 180;
var currentTheme = 'xo';

startTimer();

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `Time Left: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        declareAIWinner();
    } else {
        timeLeft--;
    }
}

function declareAIWinner() {
    document.getElementById('CurrentTurn').innerHTML = "Time's up! AI Wins!";
    disableAll();
}

function turn(cell, index) {
    if (board[index] !== "") return;

    if (currentTheme === 'xo') {
        cell.textContent = 'X';
    } else {
        cell.innerHTML = `<img src="./img/${currentTheme === 'spies' ? 'good_spy' : 'tom'}.png" alt="X" class="w-8 h-8 mx-auto block">`;
    }
    board[index] = 'X';
    cell.disabled = true;

    disableAll();

    if (verify('X')) {
        clearInterval(timerInterval);
        return;
    }

    nextPlayer = true;
    document.getElementById('CurrentTurn').innerHTML = 'Current Turn: AI';
    setTimeout(aiTurn, 500);
}

function verify(player) {
    if (checkWin(board, player)) {
        document.getElementById('CurrentTurn').innerHTML = player === 'O' ? 'AI Wins!' : 'You Won!';
        highlightWinningCells(player);
        disableAll();
        clearInterval(timerInterval);
        return true;
    }

    if (checkTie(board)) {
        document.getElementById('CurrentTurn').innerHTML = "It's a Tie!";
        disableAll();
        clearInterval(timerInterval);
        return true;
    }

    return false;
}

function highlightWinningCells(player) {
    let winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] === player && board[b] === player && board[c] === player) {
            let cells = document.querySelectorAll('button');
            cells[a].style.backgroundColor = 'green';
            cells[b].style.backgroundColor = 'green';
            cells[c].style.backgroundColor = 'green';
            break;
        }
    }
}

function disableAll() {
    document.querySelectorAll('button').forEach(cell => cell.disabled = true);
}

function enableAll() {
    document.querySelectorAll('button').forEach(cell => {
        if (cell.textContent === "") cell.disabled = false;
    });
}

function aiTurn() {
    let bestMove = minimax(board, 'O').index;
    if (bestMove === -1) return;

    let cells = document.querySelectorAll('button');
    if (currentTheme === 'xo') {
        cells[bestMove].textContent = 'O';
    } else {
        cells[bestMove].innerHTML = `<img src="./img/${currentTheme === 'spies' ? 'evil_spy' : 'jerry'}.png" alt="O" class="w-8 h-8 mx-auto block">`;
    }
    cells[bestMove].disabled = true;
    board[bestMove] = 'O';

    if (verify('O')) {
        clearInterval(timerInterval);
        return;
    }

    nextPlayer = false;
    document.getElementById('CurrentTurn').innerHTML = 'Current Turn: You';

    enableAll();
}

function minimax(newBoard, player) {
    let emptySpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    if (checkWin(newBoard, 'X')) return { score: -10 };
    if (checkWin(newBoard, 'O')) return { score: 10 };
    if (checkTie(newBoard)) return { score: 0 };

    let moves = [];

    for (let i of emptySpots) {
        let move = { index: i };
        newBoard[i] = player;

        if (player === 'O') {
            let result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            let result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[i] = "";
        moves.push(move);
    }

    let bestMove = 0;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(board, player) {
    let winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }

    return false;
}

function checkTie(board) {
    return !board.includes("");
}

function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll('button').forEach(cell => {
        cell.textContent = "";
        cell.innerHTML = "";
        cell.disabled = false;
        cell.style.backgroundColor = 'white';
    });
    document.getElementById('CurrentTurn').innerHTML = 'Current Turn: You';
    nextPlayer = false;

    clearInterval(timerInterval);
    timeLeft = 180;
    startTimer();
}

function changeTheme() {
    currentTheme = document.getElementById('theme-select').value;
    updateButtonContent();
}

function updateButtonContent() {
    const cells = document.querySelectorAll('button');
    cells.forEach((cell, index) => {
        if (board[index] === 'X') {
            if (currentTheme === 'xo') {
                cell.textContent = 'X';
                cell.innerHTML = 'X';
            } else {
                cell.textContent = '';
                cell.innerHTML = `<img src="./img/${currentTheme === 'spies' ? 'good_spy' : 'tom'}.png" alt="X" class="w-8 h-8 mx-auto block">`;
            }
        } else if (board[index] === 'O') {
            if (currentTheme === 'xo') {
                cell.textContent = 'O';
                cell.innerHTML = 'O';
            } else {
                cell.textContent = '';
                cell.innerHTML = `<img src="./img/${currentTheme === 'spies' ? 'evil_spy' : 'jerry'}.png" alt="O" class="w-8 h-8 mx-auto block">`;
            }
        } else {
            cell.textContent = '';
            cell.innerHTML = '';
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    changeGridColor();
});

function changeGridColor() {
    const colorPicker = document.getElementById("color-picker");
    const cells = document.querySelectorAll("td");

    cells.forEach(cell => {
        if (cell.classList.contains("border-black")) {
            cell.style.borderColor = colorPicker.value;
        }
    });
}