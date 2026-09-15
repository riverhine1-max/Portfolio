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
    startCountdown(); // restart with delay
});

let tileCount = 20;
let gridSize = canvas.width / tileCount;
let gamerunning = true;

let snake;
let dx;
let dy;
let food;
let gameInterval = null;

// NEW countdown variables
let startDelay = 3;
let countdownInterval = null;
let isStarting = false;

function setMapSize(size) {
    tileCount = size;
    gridSize = canvas.width / tileCount;
    resetGame();
}

setMapSize(Number(mapSizeSelect.value));

mapSizeSelect.addEventListener("change", function () {
    setMapSize(Number(this.value));
});

playButton.addEventListener("click", () => {
    if (gameInterval || isStarting) return;
    startCountdown();
});

function gameLoop() {
    update();
    draw();
}

function update() {
    if (!gamerunning) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    // Self collision
    for (let part of snake) {
        if (part.x === head.x && part.y === head.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = randomFood();
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = "#888";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    for (let i = 0; i < tileCount; i++) {
        for (let j = 0; j < tileCount; j++) {
            ctx.strokeRect(i * gridSize, j * gridSize, gridSize, gridSize);
        }
    }

    // Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Snake
    snake.forEach((part, i) => {
        ctx.fillStyle = i === 0 ? "#0f0" : "#070";
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });
}

// PREVENT movement during countdown
document.addEventListener("keydown", e => {
    if (isStarting) return;

    if (e.key === "ArrowUp" && dy !== 1) { dx = 0; dy = -1; }
    if (e.key === "ArrowDown" && dy !== -1) { dx = 0; dy = 1; }
    if (e.key === "ArrowLeft" && dx !== 1) { dx = -1; dy = 0; }
    if (e.key === "ArrowRight" && dx !== -1) { dx = 1; dy = 0; }
});

function randomFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function resetGame() {
    snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
    dx = 1;
    dy = 0;
    food = randomFood();

    canvas.style.display = "block";
    playButton.style.display = "block";
    mapSizeSelect.style.display = "block";
    label.style.display = "block";

    ctx.reset();
}

// COUNTDOWN SYSTEM
function startCountdown() {
    isStarting = true;
    let timeLeft = startDelay;

    drawStartScreen(timeLeft);

    countdownInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            isStarting = false;

            if (!gameInterval) {
                gameInterval = setInterval(gameLoop, 130);
                gamerunning = true;
            }
        } else {
            drawStartScreen(timeLeft);
        }
    }, 1000);
}

// DRAW COUNTDOWN SCREEN
function drawStartScreen(timeLeft) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";

    ctx.fillText("Get Ready", canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText(timeLeft, canvas.width / 2, canvas.height / 2 + 40);
}

function endGame() {
    gamerunning = false;
    gameOverScreen.style.display = "block";

    clearInterval(gameInterval);
    gameInterval = null;

    canvas.style.display = "none";
    playButton.style.display = "none";
    mapSizeSelect.style.display = "none";
    label.style.display = "none";
}

function playgame() {
    mainMenu.style.display = "none";
    gameContainer.style.display = "block";
    startCountdown();
}