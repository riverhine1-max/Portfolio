const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const playButton = document.getElementById("Playbutton");
const mapSizeSelect = document.getElementById("mapSize");
const gameOverScreen = document.getElementById("gameOverScreen");
const label = document.querySelector("label[for='mapSize']");
const gameContainer = document.getElementById("gameContainer");
const mainMenu = document.getElementById("mainMenu");
const startGameButton = document.getElementById("startGameButton");
const playAgainBtn = document.getElementById("playAgainButton");

startGameButton.addEventListener("click", playgame);
playAgainBtn.addEventListener("click", () => {
    resetGame();
    gameOverScreen.style.display = "none";
    startCountdown();
});

let tileCount = 20;
let gridSize = canvas.width / tileCount;
let gamerunning = true;
let snake;
let dx;
let dy;
let food;
let gameInterval = null;
let startDelay = 3;
let countdownInterval = null;
let isStarting = false;

function setMapSize(size) {
    tileCount = size;
    gridSize = canvas.width / tileCount;
    resetGame();
}

setMapSize(Number(mapSizeSelect.value));
mapSizeSelect.addEventListener("change", function () { setMapSize(Number(this.value)); });
playButton.addEventListener("click", () => {
    if (gameInterval || isStarting) return;
    startCountdown();
});

function gameLoop() { update(); draw(); }

function update() {
    if (!gamerunning) return;
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return endGame();
    for (let part of snake) if (part.x === head.x && part.y === head.y) return endGame();
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) food = randomFood();
    else snake.pop();
}

function draw() {
    ctx.fillStyle = "#10251c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,.055)";
    ctx.lineWidth = 1;
    for (let i = 0; i < tileCount; i++) {
        for (let j = 0; j < tileCount; j++) ctx.strokeRect(i * gridSize, j * gridSize, gridSize, gridSize);
    }
    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);
    snake.forEach((part, i) => {
        ctx.fillStyle = i === 0 ? "#b9ffce" : "#44d17c";
        ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });
}

document.addEventListener("keydown", e => {
    if (isStarting) return;
    if (e.key === "ArrowUp" && dy !== 1) { dx = 0; dy = -1; }
    if (e.key === "ArrowDown" && dy !== -1) { dx = 0; dy = 1; }
    if (e.key === "ArrowLeft" && dx !== 1) { dx = -1; dy = 0; }
    if (e.key === "ArrowRight" && dx !== -1) { dx = 1; dy = 0; }
});

function randomFood() {
    let next;
    do {
        next = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    } while (snake?.some(part => part.x === next.x && part.y === next.y));
    return next;
}

function resetGame() {
    snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
    dx = 1;
    dy = 0;
    food = randomFood();
    gamerunning = true;
    canvas.style.display = "block";
    playButton.style.display = "block";
    mapSizeSelect.style.display = "block";
    label.style.display = "block";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

function startCountdown() {
    clearInterval(countdownInterval);
    isStarting = true;
    let timeLeft = startDelay;
    drawStartScreen(timeLeft);
    countdownInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            isStarting = false;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, 130);
            gamerunning = true;
        } else drawStartScreen(timeLeft);
    }, 1000);
}

function drawStartScreen(timeLeft) {
    ctx.fillStyle = "#07110d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e9f3ff";
    ctx.font = "700 44px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Get Ready", canvas.width / 2, canvas.height / 2 - 26);
    ctx.fillStyle = "#82e8ad";
    ctx.font = "800 60px system-ui";
    ctx.fillText(timeLeft, canvas.width / 2, canvas.height / 2 + 46);
}

function endGame() {
    gamerunning = false;
    gameOverScreen.style.display = "grid";
    clearInterval(gameInterval);
    gameInterval = null;
}

function playgame() {
    mainMenu.style.display = "none";
    gameContainer.style.display = "block";
    resetGame();
    startCountdown();
}
