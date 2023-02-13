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
const items = ["rock", "paper", "scissors"];
const winConditions = { rock: "scissors", paper: "rock", scissors: "paper" };

btnStart.addEventListener("click", (e) => {
    e.preventDefault();
    startGame();
});

rockButton.addEventListener("click", () => {
    asignItemToPlayer(currentPlayer, "rock");
    rockButton.setAttribute("selected", "true");
    paperButton.setAttribute("selected", "false");
    scissorsButton.setAttribute("selected", "false");
});

paperButton.addEventListener("click", () => {
    asignItemToPlayer(currentPlayer, "paper");
    paperButton.setAttribute("selected", "true");
    rockButton.setAttribute("selected", "false");
    scissorsButton.setAttribute("selected", "false");
});

scissorsButton.addEventListener("click", () => {
    asignItemToPlayer(currentPlayer, "scissors");
    scissorsButton.setAttribute("selected", "true");
    rockButton.setAttribute("selected", "false");
    paperButton.setAttribute("selected", "false");
});

const asignItemToPlayer = (player, item) => (player.selectedItem = item);

const determinateRoundResult = () => {
    return playerOne.selectedItem === playerTwo.selectedItem
        ? "draw"
        : winConditions[playerOne.selectedItem] === playerTwo.selectedItem
        ? "player one won"
        : "player two won";
};

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
let page;

// Function that initializes the class Player and the nomber of rounds, then starts the game
function startGame() {
    if (!isNaN(inputPlayerOneName.value) || !isNaN(inputPlayerOneName.value))
        return alert("Enter valid names.");
    if (inputPlayerOneName.value === "" || inputPlayerTwoName.value === "")
        return alert("The name of both players is required.");

    playerOne = new Player(inputPlayerOneName.value);
    playerTwo = new Player(inputPlayerTwoName.value);
    currentPlayer = playerOne;
    initialForm.remove();
    body.appendChild(gamePage);
    play();
}

function play() {
    if (
        currentRound > rounds ||
        playerOne.roundsWon > rounds / 2 ||
        playerTwo.roundsWon > rounds / 2
    ) {
        return showResults();
    }

    if (!document.querySelector(".game-page__elements-buttons")) {
        gamePage.insertBefore(gamePageElementsButtons, gamePage.children[1]);
    }

    scissorsButton.setAttribute("selected", "false");
    rockButton.setAttribute("selected", "false");
    paperButton.setAttribute("selected", "false");

    continueButton.addEventListener("click", continueButtonHandle);
    page = toNextPage.next().value;

    if (page === "playerOneChoose") {
        currentPlayer = playerOne;
        gamePageText.innerHTML = `Round ${currentRound}/${rounds}<br><br>${playerOne.name} choose:`;
    } else if (page === "playerTwoChoose") {
        currentPlayer = playerTwo;
        gamePageText.innerHTML = `Round ${currentRound}/${rounds} <br><br>${playerTwo.name} choose:`;
    } else {
        gamePageText.innerHTML = `${playerOne.name} chose ${playerOne.selectedItem}<br>${playerTwo.name} chose ${playerTwo.selectedItem}`;

        const roundResult = determinateRoundResult();
        gamePageElementsButtons.remove();

        if (roundResult === "player one won") {
            playerOne.roundsWon++;
            gamePageText.innerHTML += `<br><br>The winner of the round is ${playerOne.name}`;
            currentRound++;
        } else if (roundResult === "player two won") {
            playerTwo.roundsWon++;
            gamePageText.innerHTML += `<br><br>The winner of the round is ${playerTwo.name}`;
            currentRound++;
        } else {
            gamePageText.innerHTML +=
                "<br><br>There was a draw im this round.<br>>br>Repeat it";
        }
    }
}

function showResults() {
    playerOne.roundsWon > playerTwo.roundsWon
        ? (gamePageText.innerHTML = `${playerOne.name} won ${playerOne.roundsWon} to ${playerTwo.roundsWon}`)
        : (gamePageText.innerHTML = `${playerTwo.name} won ${playerTwo.roundsWon} to ${playerOne.roundsWon}`);

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
    if (gameFinished) {
        return reset();
    }

    if (
        page !== "seeRoundResults" &&
        scissorsButton.getAttribute("selected") === "false" &&
        paperButton.getAttribute("selected") === "false" &&
        rockButton.getAttribute("selected") === "false"
    ) {
        return alert("You must choose one item");
    }

    return play();
}
