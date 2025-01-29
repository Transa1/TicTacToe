var nextPlayer = false;
var board = ["", "", "", "", "", "", "", "", ""];

function turn(cell, index) {
    if (board[index] !== "") return;

    cell.value = 'X';
    board[index] = 'X';
    cell.disabled = true;

    disableAll();

    if (verify('X')) return;

    nextPlayer = true;
    setTimeout(aiTurn, 500);
}

function verify(player) {
    if (checkWin(board, player)) {
        document.getElementById('CurrentTurn').innerHTML = `${player} Wins!`;
        highlightWinningCells(player);
        disableAll();
        return true;
    }

    if (checkTie(board)) {
        document.getElementById('CurrentTurn').innerHTML = "It's a Tie!";
        disableAll();
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
            let cells = document.querySelectorAll('input[type="button"]');
            cells[a].style.backgroundColor = 'green';
            cells[b].style.backgroundColor = 'green';
            cells[c].style.backgroundColor = 'green';
            break;
        }
    }
}

function disableAll() {
    document.querySelectorAll('input[type="button"]').forEach(cell => cell.disabled = true);
}

function enableAll() {
    document.querySelectorAll('input[type="button"]').forEach(cell => {
        if (cell.value === "") cell.disabled = false;
    });
}

function aiTurn() {
    let bestMove = minimax(board, 'O').index;
    if (bestMove === -1) return;

    let cells = document.querySelectorAll('input[type="button"]');
    cells[bestMove].value = 'O';
    cells[bestMove].disabled = true;
    board[bestMove] = 'O';

    if (verify('O')) return;

    nextPlayer = false;
    document.getElementById('CurrentTurn').innerHTML = 'Current Turn: X';

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
    document.querySelectorAll('input[type="button"]').forEach(cell => {
        cell.value = "";
        cell.disabled = false;
        cell.style.backgroundColor = 'white'; // Reset the background color
    });
    document.getElementById('CurrentTurn').innerHTML = 'Current Turn: X';
    nextPlayer = false;
}