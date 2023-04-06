class Player {
    constructor(name) {
        this.name = name;
        this.selectedItem = undefined;
        this.roundsWon = 0;
    }
}

const body = document.getElementById("body");
const btnStart = document.querySelector("#start");
const inputPlayerOneName = document.querySelector("#player-one-name");
const inputPlayerTwoName = document.querySelector("#player-two-name");
const inputNumberOfRounds = document.querySelector("#number-of-rounds");
const initialForm = document.querySelector("#initial-form");

const gamePage = document.querySelector(".game-page");
const gamePageText = document.querySelector(".game-page__text");
const gamePageElementsButtons = document.querySelector(
    ".game-page__elements-buttons"
);

const rockButton = document.getElementById("rock-button");
const paperButton = document.getElementById("paper-button");
const scissorsButton = document.getElementById("scissor-button");
const continueButton = document.getElementById("continue-button");

const gamePages = ["playerOneChoose", "playerTwoChoose", "seeRoundResults"];

body.removeChild(gamePage);

let gameFinished = false;
let playerOne;
let playerTwo;
let currentPlayer;
let rounds = 3;
let currentRound = 1;
const items = ["piedra", "papel", "tijera"];
const winConditions = { piedra: "tijera", papel: "piedra", tijera: "papel" };

btnStart.addEventListener("click", (e) => {
    e.preventDefault();
    startGame();
});

rockButton.addEventListener("click", () => {
    asignItemToPlayer(currentPlayer, "piedra");
    rockButton.setAttribute("selected", "true");
    paperButton.setAttribute("selected", "false");
    scissorsButton.setAttribute("selected", "false");
});

paperButton.addEventListener("click", () => {
    asignItemToPlayer(currentPlayer, "papel");
    paperButton.setAttribute("selected", "true");
    rockButton.setAttribute("selected", "false");
    scissorsButton.setAttribute("selected", "false");
});

scissorsButton.addEventListener("click", () => {
    asignItemToPlayer(currentPlayer, "tijera");
    scissorsButton.setAttribute("selected", "true");
    rockButton.setAttribute("selected", "false");
    paperButton.setAttribute("selected", "false");
});

function asignItemToPlayer(player, item) {
    player.selectedItem = item;
}

function determinateRoundResult() {
    return playerOne.selectedItem === playerTwo.selectedItem
        ? "draw"
        : winConditions[playerOne.selectedItem] === playerTwo.selectedItem
        ? "player one won"
        : "player two won";
}

// Function that initializes the class Player and the nomber of rounds, then starts the game
function startGame() {
    if (!isNaN(inputPlayerOneName.value) || !isNaN(inputPlayerOneName.value))
        return alert("Ingresa nombres válidos");
    if (inputPlayerOneName.value === "" || inputPlayerTwoName.value === "")
        return alert("Se necesita el nombre de los dos jugadores");

    playerOne = new Player(inputPlayerOneName.value);
    playerTwo = new Player(inputPlayerTwoName.value);
    currentPlayer = playerOne;
    initialForm.remove();
    body.appendChild(gamePage);
    play();
}

// Function to navegate trough the pages
function* goToNextPage() {
    let i = 0;
    while (true) {
        yield gamePages[i];
        i++;
        if (i === 3) i = 0;
    }
}

const toNextPage = goToNextPage();
let currentPage;

function play() {
    if (
        currentRound > rounds ||
        playerOne.roundsWon > rounds / 2 ||
        playerTwo.roundsWon > rounds / 2
    )
        return showResults();

    if (!document.querySelector(".game-page__elements-buttons")) {
        gamePage.insertBefore(gamePageElementsButtons, gamePage.children[1]);
    }

    scissorsButton.setAttribute("selected", "false");
    rockButton.setAttribute("selected", "false");
    paperButton.setAttribute("selected", "false");

    continueButton.addEventListener("click", continueButtonHandle);

    const announcements = {
        playerOneChoose: `Round ${currentRound}/${rounds}<br><br>${playerOne.name} elige:`,
        playerTwoChoose: `Round ${currentRound}/${rounds} <br><br>${playerTwo.name} elige:`,
        showItemsSelected: `${playerOne.name} eligió ${playerOne.selectedItem}<br>${playerTwo.name} eligió ${playerTwo.selectedItem}`,
        playerOneWon: `<br><br>El ganador de este round es ${playerOne.name}`,
        playerTwoWon: `<br><br>El ganador de este round es ${playerTwo.name}`,
        draw: `<br><br>Este round terminó en empate por lo tanto debe repetirse.<br><br>`,
    };

    currentPage = toNextPage.next().value;

    if (currentPage === "playerOneChoose") {
        currentPlayer = playerOne;
        gamePageText.innerHTML = announcements.playerOneChoose;
    } else if (currentPage === "playerTwoChoose") {
        currentPlayer = playerTwo;
        gamePageText.innerHTML = announcements.playerTwoChoose;
    } else {
        gamePageText.innerHTML = announcements.showItemsSelected;

        const roundResult = determinateRoundResult();
        gamePageElementsButtons.remove();

        if (roundResult === "player one won") {
            playerOne.roundsWon++;
            gamePageText.innerHTML += announcements.playerOneWon;
            currentRound++;
        } else if (roundResult === "player two won") {
            playerTwo.roundsWon++;
            gamePageText.innerHTML += announcements.playerTwoWon;
            currentRound++;
        } else {
            gamePageText.innerHTML += announcements.draw;
        }
    }
}

function showResults() {
    playerOne.roundsWon > playerTwo.roundsWon
        ? (gamePageText.innerHTML = `${playerOne.name} ganó ${playerOne.roundsWon} a ${playerTwo.roundsWon}`)
        : (gamePageText.innerHTML = `${playerTwo.name} ganó ${playerTwo.roundsWon} a ${playerOne.roundsWon}`);

    gameFinished = true;
    continueButton.innerHTML = "Reset";
}

function reset() {
    gameFinished = false;
    playerOne = undefined;
    playerTwo = undefined;
    currentPlayer = undefined;
    currentRound = 1;
    inputPlayerOneName.value = "";
    inputPlayerTwoName.value = "";
    gamePage.remove();
    body.insertBefore(initialForm, body.children[1]);
    continueButton.innerHTML = "Continue";
}

function continueButtonHandle() {
    if (gameFinished) return reset();

    if (
        currentPage !== "seeRoundResults" &&
        scissorsButton.getAttribute("selected") === "false" &&
        paperButton.getAttribute("selected") === "false" &&
        rockButton.getAttribute("selected") === "false"
    ) {
        return alert("Debes elegir un item");
    }

    return play();
}
