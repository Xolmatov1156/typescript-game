type Player = {
  score: number;
  name: string;
  buttonDisabled: boolean;
};

const player1: Player = { score: 0, name: "Player 1", buttonDisabled: false };
const player2: Player = { score: 0, name: "Player 2", buttonDisabled: true };

let currentPlayer: Player = player1;
const winningScore = 50;

const player1ScoreEl = document.querySelector("#player1Score") as HTMLElement;
const player2ScoreEl = document.querySelector("#player2Score") as HTMLElement;
const player1Button = document.querySelector("#player1Button") as HTMLButtonElement;
const player2Button = document.querySelector("#player2Button") as HTMLButtonElement;
const modal = document.querySelector("#modal") as HTMLElement;
const winnerText = document.querySelector("#winnerText") as HTMLElement;
const restartButton = document.querySelector("#restartButton") as HTMLButtonElement;

const player1RandomNumberEl = document.querySelector("#player1RandomNumber") as HTMLElement;
const player2RandomNumberEl = document.querySelector("#player2RandomNumber") as HTMLElement;

function generateRandomScore(): number {
  return Math.floor(Math.random() * 10);
}

function updateScore(player: Player): void {
  const randomScore = generateRandomScore();
  player.score += randomScore;

  if (player === player1) {
    player1RandomNumberEl.innerText = `${randomScore}`;
  } else {
    player2RandomNumberEl.innerText = `${randomScore}`;
  }

  updateUI();

  if (player.score >= winningScore) {
    endGame(player);
  } else {
    toggleTurn();
  }

  saveGameState();
}

function toggleTurn(): void {
  player1.buttonDisabled = !player1.buttonDisabled;
  player2.buttonDisabled = !player2.buttonDisabled;

  player1Button.disabled = player1.buttonDisabled;
  player2Button.disabled = player2.buttonDisabled;

  if (!player1.buttonDisabled) {
    player1Button.classList.add("shadoww");
    player2Button.classList.remove("shadoww");
  } else {
    player2Button.classList.add("shadoww");
    player1Button.classList.remove("shadoww");
  }

  currentPlayer = currentPlayer === player1 ? player2 : player1;

  saveGameState();
}

function endGame(winner: Player): void {
  modal.classList.remove("hidden");
  winnerText.innerText = `${winner.name} wins!`;
  player1Button.disabled = true;
  player2Button.disabled = true;

  saveGameState();
}

function resetGame(): void {
  player1.score = 0;
  player2.score = 0;
  player1.buttonDisabled = false;
  player2.buttonDisabled = true;
  player1Button.disabled = false;
  player2Button.disabled = true;

  modal.classList.add("hidden");

  player1RandomNumberEl.innerText = '0';
  player2RandomNumberEl.innerText = '0';

  updateUI();

  player1Button.classList.add("shadoww");
  player2Button.classList.remove("shadoww");

  saveGameState();
}

function updateUI(): void {
  player1ScoreEl.innerText = `Score ${player1.score}`;
  player2ScoreEl.innerText = `Score ${player2.score}`;
}

function saveGameState(): void {
  const gameState = {
    player1: { ...player1 },
    player2: { ...player2 },
    currentPlayer: currentPlayer.name,
  };
  localStorage.setItem("gameState", JSON.stringify(gameState));
}

function loadGameState(): void {
  const savedState = localStorage.getItem("gameState");
  if (savedState) {
    const { player1: savedPlayer1, player2: savedPlayer2, currentPlayer: savedCurrentPlayer } = JSON.parse(savedState);

    player1.score = savedPlayer1.score;
    player1.buttonDisabled = savedPlayer1.buttonDisabled;

    player2.score = savedPlayer2.score;
    player2.buttonDisabled = savedPlayer2.buttonDisabled;

    currentPlayer = savedCurrentPlayer === player1.name ? player1 : player2;

    updateUI();

    player1Button.disabled = player1.buttonDisabled;
    player2Button.disabled = player2.buttonDisabled;

    if (!player1.buttonDisabled) {
      player1Button.classList.add("shadoww");
      player2Button.classList.remove("shadoww");
    } else {
      player2Button.classList.add("shadoww");
      player1Button.classList.remove("shadoww");
    }

    if (player1.score >= winningScore || player2.score >= winningScore) {
      endGame(currentPlayer);
    }
  }
}

window.addEventListener("load", loadGameState);

player1Button.addEventListener("click", () => updateScore(player1));
player2Button.addEventListener("click", () => updateScore(player2));
restartButton.addEventListener("click", resetGame);

player1Button.classList.add("shadoww");