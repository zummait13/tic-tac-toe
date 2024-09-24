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

    const getBoard = () => board;

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

    return {
        getBoard,
        printBoard,
        makeMove,
        checkWinStatus,
        clearBoard
    };
}

function player(token) {
    let counter = 0;

    const getToken = () => token;
    const getCounter = () => counter;
    const addCounter = () => counter++;
    const setToNull = () => {
        counter = 0;
        return counter;
    }

    return {getToken, getCounter, addCounter, setToNull};
}

function GameController() {

    const board = Gameboard();

    const player1 = player("O");
    const player2 = player("X");
    let activePlayer = player1;
    let winner = {};

    let numbOfRoundsToWin = 2;
    let gameEndStatus = 0;

    function playRound(row, col) {

        let winStatus = '';

        let currentMove = {
            row: row,
            col: col,
            token: activePlayer.getToken()
        }

        do {
            // check availability
            let moveResult = board.makeMove(currentMove);
            if (moveResult == "it's already taken") {
                console.log(moveResult);
                return;
            }
            
            winStatus = board.checkWinStatus(currentMove); // result is "it's tie", "wins" or "continue round"
            console.log(winStatus);
            if (winStatus == "continue round") switchPlayerTurn();
        } while (winStatus == "continue round");

        // check win status
        if (winStatus == "wins") {
            activePlayer.addCounter();
            console.log(activePlayer.getToken() + " " + winStatus);
        }
        else if (winStatus == "it's tie") alert(winStatus);

        if (player1.getCounter() == numbOfRoundsToWin || player2.getCounter() == numbOfRoundsToWin) {
            gameEndStatus = 1;
            winner = (player1.getCounter > player2.getCounter) ? player2 : player1;

            player1.setToNull();
            player2.setToNull();
            activePlayer = player1;
            board.clearBoard();
            console.log(winner, player1.getCounter());
        }
        
        console.log(`Player ${player1.getToken()}: ${player1.getCounter()} scores`);
        console.log(`Player ${player2.getToken()}: ${player2.getCounter()} scores`);

        board.clearBoard();

        function switchPlayerTurn() {
            activePlayer = activePlayer === player1 ? player2 : player1;
            console.log(`${activePlayer.getToken()} your turn`);
        }
    }

    let resetGameEndStatus = () => {
        gameEndStatus = 0;
    }

    let getActivePlayer = () => activePlayer;
    let getPlayer1 = () => player1;
    let getPlayer2 = () => player2;
    let getGameEndStatus = () => gameEndStatus;
    let getWinner = () => winner;

    return {
        getActivePlayer,
        getPlayer1,
        getPlayer2,
        playRound,
        getGameEndStatus,
        getWinner,
        resetGameEndStatus,
        getBoard: board.getBoard
    };
};

const startGame = (function screenController() {
    
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const player1ScoreDiv = document.querySelector(".player1-score");
    const player2ScoreDiv = document.querySelector(".player2-score");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";

        let activePlayer = game.getActivePlayer();
        playerTurnDiv.textContent = `Turn ${activePlayer.getToken()}`;

        let player1 = game.getPlayer1();
        player1ScoreDiv.textContent = `Player ${player1.getToken()}: ${player1.getCounter()} scores`;
        let player2 = game.getPlayer2();
        player2ScoreDiv.textContent = `Player ${player2.getToken()}: ${player2.getCounter()} scores`;

        const board = game.getBoard();

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                // this needs to identify row and column in playWholeGame()
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;

                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        // Make sure I've clicked a column and not the gaps in between
        if (!selectedColumn && !selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        
        checkGameEndStatus();
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    function checkGameEndStatus() {
        const gameEndStatus = game.getGameEndStatus();
        if (gameEndStatus == 1) {
            dialogWindow.show();
            boardDiv.textContent = '';
            player1ScoreDiv.textContent = '';
            player2ScoreDiv.textContent = '';

            winnerTextDiv.textContent = `${game.getWinner().getToken()} WINS THE WHOLE GAME`;
        }
    }

    const dialogWindow = document.querySelector("dialog");
    const winnerTextDiv = document.querySelector(".player-win");
    const newGameBtn = document.querySelector(".new-game");
    newGameBtn.addEventListener("click", () => {
        dialogWindow.close();
        game.resetGameEndStatus();
    });

    updateScreen();
})();

