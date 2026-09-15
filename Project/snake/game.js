const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const mapSizeSelect = document.getElementById('mapSize');
const gameContainer = document.getElementById('gameContainer');
const mainMenu = document.getElementById('mainMenu');
const gameOverScreen = document.getElementById('gameOverScreen');
let tileCount = 20, snake = [], food, dx = 1, dy = 0;
let timer = null, countdown = null, isStarting = false, running = false, turnQueued = false, score = 0;

function stopTimers() { clearInterval(timer); clearInterval(countdown); timer = countdown = null; }
function randomFood() {
    const empty = [];
    for (let y = 0; y < tileCount; y++) for (let x = 0; x < tileCount; x++) {
        if (!snake.some(p => p.x === x && p.y === y)) empty.push({ x, y });
    }
    return empty[Math.floor(Math.random() * empty.length)] || null;
}
function draw() {
    const size = canvas.width / tileCount;
    ctx.fillStyle = '#10251c'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ffffff0d';
    for (let i = 0; i < tileCount; i++) for (let j = 0; j < tileCount; j++) ctx.strokeRect(i * size, j * size, size, size);
    if (food) { ctx.fillStyle = '#ff6b6b'; ctx.fillRect(food.x * size + 2, food.y * size + 2, size - 4, size - 4); }
    snake.forEach((p, i) => { ctx.fillStyle = i ? '#44d17c' : '#b9ffce'; ctx.fillRect(p.x * size + 1, p.y * size + 1, size - 2, size - 2); });
}
function endGame(won = false) {
    stopTimers(); running = false; isStarting = false;
    document.getElementById('gameOverTitle').textContent = won ? 'You Win!' : 'Game Over';
    document.getElementById('gameOverMessage').textContent = won ? 'You filled the board.' : 'You hit the wall or your own tail.';
    gameOverScreen.hidden = false;
    document.getElementById('playAgainButton').focus({ preventScroll: true });
}
function tick() {
    turnQueued = false;
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    const eats = head.x === food.x && head.y === food.y;
    // The tail moves away on non-eating steps, so that cell is legal.
    const body = eats ? snake : snake.slice(0, -1);
    if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount || body.some(p => p.x === head.x && p.y === head.y)) return endGame();
    snake.unshift(head);
    if (eats) { score++; document.getElementById('score').textContent = `Score: ${score}`; food = randomFood(); }
    else snake.pop();
    draw();
    if (!food) endGame(true);
}
function drawCountdown(n) {
    draw(); ctx.fillStyle = '#07110dcc'; ctx.fillRect(0, 0, 520, 520);
    ctx.fillStyle = '#e9f3ff'; ctx.textAlign = 'center'; ctx.font = '700 36px system-ui'; ctx.fillText('Get Ready', 260, 235);
    ctx.fillStyle = '#82e8ad'; ctx.font = '800 64px system-ui'; ctx.fillText(n, 260, 315);
}
function startGame() {
    stopTimers(); mainMenu.hidden = true; gameContainer.hidden = false; gameOverScreen.hidden = true;
    tileCount = Number(mapSizeSelect.value); snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
    dx = 1; dy = 0; score = 0; turnQueued = false; running = false; isStarting = true;
    food = randomFood(); document.getElementById('score').textContent = 'Score: 0';
    canvas.focus({ preventScroll: true });
    let left = 3; drawCountdown(left);
    countdown = setInterval(() => {
        if (--left > 0) drawCountdown(left);
        else { clearInterval(countdown); countdown = null; isStarting = false; running = true; draw(); timer = setInterval(tick, 130); }
    }, 1000);
}
const directions = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] };
function turn(direction) {
    if (!running || isStarting || turnQueued) return;
    const [x,y] = directions[direction];
    if (x === -dx && y === -dy) return;
    dx = x; dy = y; turnQueued = true;
}
const keys = { ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right' };
document.addEventListener('keydown', event => {
    if (event.target.tagName === 'SELECT') return;
    const direction = keys[event.key] || keys[event.key.toLowerCase()];
    if (direction && !gameContainer.hidden) { event.preventDefault(); turn(direction); }
});
canvas.addEventListener('pointerdown', () => canvas.focus({ preventScroll: true }));
document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => turn(button.dataset.direction)));
document.getElementById('startGameButton').addEventListener('click', startGame);
document.getElementById('playAgainButton').addEventListener('click', startGame);
document.getElementById('Playbutton').addEventListener('click', startGame);
mapSizeSelect.addEventListener('change', startGame);
window.addEventListener('pagehide', stopTimers);
