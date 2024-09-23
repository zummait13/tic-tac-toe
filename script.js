function Gameboard() {
    const gridLength = 3;
    const board = [];
    let numbOfMoves = 0;
    const maxOfMoves = 9;

    for (let i = 0; i < gridLength; i++) {
        board[i] = [];
        for (let j = 0; j < gridLength; j++) {
            board[i].push(Cell());
        }
    }

    function Cell() {
        let value = '_';

        const addToken = (player) => {
            value = player;
        }

        const getValue = () => value;

        return {addToken, getValue};
    }

    const printBoard = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
    }

    function clearBoard() {
        for (let i = 0; i < gridLength; i++) {
            for (let j = 0; j < gridLength; j++) {
                board[i][j].addToken('_');
            }
        }
        numbOfMoves = 0;
    }

    function makeMove(currentMove) {
        if (board[currentMove.row][currentMove.col].getValue() != '_') return "it's already taken";

        board[currentMove.row][currentMove.col].addToken(currentMove.token);
        numbOfMoves++;
        return `It is put a ${currentMove.token} in ${currentMove.row+1} row and ${currentMove.col+1} column`;
    } 

    function checkWinStatus(currentMove) {
        if (numbOfMoves == maxOfMoves) return "it's tie";

        // check win pos in curr row
        for (let i = 0; i < gridLength; i++) {
            if (board[currentMove.row][i].getValue() != currentMove.token) break;
            if (i == gridLength-1) return "wins";
        }

        // check win pos in curr col
        for (let i = 0; i < gridLength; i++) {
            if (board[i][currentMove.col].getValue() != currentMove.token) break;
            if (i == gridLength-1) return "wins";
        }

        // check win pos in curr direct diag
        if (currentMove.row == currentMove.col) {
            for (let i = 0; i < gridLength; i++) {
                if (board[i][i].getValue() != currentMove.token) break;
                if (i == gridLength-1) return "wins";
            }
        }

        // check win pos in curr reverse diag
        if (currentMove.row + currentMove.col == gridLength - 1) {
            for (let i = 0; i < gridLength; i++) {
                if (board[i][(gridLength-1)-i].getValue() != currentMove.token) break;
                if (i == gridLength-1) return "wins";
            }
        }

        return "continue round";
    }

    return {printBoard, makeMove, checkWinStatus, clearBoard};
}

function player(token) {
    let counter = 0;

    const getToken = () => token;
    const getCounter = () => counter;
    const addCounter = () => counter++;

    return {getToken, getCounter, addCounter};
}

const startGame = (function GameController() {
    let numbOfRoundsToWin = 2;

    const board = Gameboard();

    const player1 = player("O");
    const player2 = player("X");
    let activePlayer = player1;

    let currentMove = {
        row: 1,
        col: 1,
        token: "_"
    }

    const playWholeGame = (function playWholeGame() {
        let numbOfRound = 0;
        do {
            numbOfRound++;
            console.log(`Round ${numbOfRound}`);
            playRound();
            // console.log(player1.getCounter(), player2.getCounter());
        } while(player1.getCounter() < numbOfRoundsToWin && player2.getCounter() < numbOfRoundsToWin);

        console.log(`${activePlayer.getToken()} WINS IN WHOLE GAME`);
    })();

    function playRound() {

        let winStatus = '';

        board.printBoard();

        do {
            makeMove();
            winStatus = board.checkWinStatus(currentMove);
            board.printBoard();
            console.log(winStatus);
            if (winStatus == "continue round") switchPlayerTurn();
        } while (winStatus == "continue round");

        if (winStatus == "wins") {
            activePlayer.addCounter();
            console.log(activePlayer.getToken() + " " + winStatus);
        }
        else if (winStatus == "it's tie") console.log(winStatus);

        console.log(`Player ${player1.getToken()}: ${player1.getCounter()} scores`);
        console.log(`Player ${player2.getToken()}: ${player2.getCounter()} scores`);

        board.clearBoard();
    }

    function makeMove() {
        do {
            [currentMove.row, currentMove.col] = getMoveFromUser();
            currentMove.token = activePlayer.getToken();

            resOfMove = board.makeMove(currentMove);
            console.log(resOfMove);
        } while (resOfMove == "it's already taken");
        
    }

    function getMoveFromUser() {
        do {
            const row = prompt("Choose row");
            if (row < 1 || row > 3) alert("Row should be between 1 and 3");
        } while (row < 1 || row > 3);

        do {
            const col = prompt("Choose column");
            if (col < 1 || col > 3) alert("Column should be between 1 and 3");
        } while (col < 1 || col > 3);
        
        return [+row-1, +col-1];
    }

    function switchPlayerTurn() {
        activePlayer = activePlayer === player1 ? player2 : player1;
        console.log(`${activePlayer.getToken()} your turn`);
    }
})();

