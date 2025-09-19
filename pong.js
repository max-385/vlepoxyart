// Simple Pong Game (Player vs Computer, Circular Ball, Mouse Control, Score, Start Button)
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('pong-start');

// Game settings
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 12;
const PLAYER_X = 20;
const AI_X = WIDTH - 20 - PADDLE_WIDTH;

// Game state
let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = WIDTH / 2;
let ballY = HEIGHT / 2;
let ballSpeedX = 0;
let ballSpeedY = 0;
let running = false;
let playerScore = 0;
let aiScore = 0;

// Mouse control
canvas.addEventListener('mousemove', function (e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
});

// Draw functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  for (let i = 0; i < HEIGHT; i += 24) {
    ctx.moveTo(WIDTH / 2, i);
    ctx.lineTo(WIDTH / 2, i + 12);
  }
  ctx.stroke();
}

function drawScore() {
  ctx.font = "bold 32px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(`${playerScore} : ${aiScore}`, WIDTH / 2, 40);
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Background
  drawRect(0, 0, WIDTH, HEIGHT, "rgba(0,0,0,0.25)");

  // Net
  drawNet();

  // Score
  drawScore();

  // Paddles
  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
  drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");

  // Ball (circle)
  drawCircle(ballX, ballY, BALL_RADIUS, "#fff");
}

function moveAI() {
  // Simple AI: follow the ball with some delay
  let target = ballY - PADDLE_HEIGHT / 2;
  aiY += (target - aiY) * 0.08;
  aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top/bottom collision
  if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > HEIGHT) {
    ballSpeedY = -ballSpeedY;
  }

  // Player paddle collision
  if (
    ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
    ballY > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballSpeedX = -ballSpeedX;
    // Add some "spin"
    let collidePoint = ballY - (playerY + PADDLE_HEIGHT / 2);
    ballSpeedY = collidePoint * 0.25;
    ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
  }

  // AI paddle collision
  if (
    ballX + BALL_RADIUS > AI_X &&
    ballY > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballSpeedX = -ballSpeedX;
    let collidePoint = ballY - (aiY + PADDLE_HEIGHT / 2);
    ballSpeedY = collidePoint * 0.25;
    ballX = AI_X - BALL_RADIUS;
  }

  // Left/right out of bounds (score)
  if (ballX - BALL_RADIUS < 0) {
    aiScore++;
    if (aiScore >= 10) {
      endGame();
    } else {
      resetBall();
    }
  }
  if (ballX + BALL_RADIUS > WIDTH) {
    playerScore++;
    if (playerScore >= 10) {
      endGame();
    } else {
      resetBall();
    }
  }
}

function resetBall() {
  ballX = WIDTH / 2;
  ballY = HEIGHT / 2;
  ballSpeedX = running ? 4 * (Math.random() > 0.5 ? 1 : -1) : 0;
  ballSpeedY = running ? 3 * (Math.random() * 2 - 1) : 0;
}

function resetGame() {
  playerScore = 0;
  aiScore = 0;
  playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
  aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
  resetBall();
}

function gameLoop() {
  if (running) {
    moveAI();
    moveBall();
  }
  draw();
  requestAnimationFrame(gameLoop);
}

// Start button
startBtn.addEventListener('click', function () {
  resetGame();
  running = true;
  startBtn.style.visibility = 'hidden';
  resetBall();
});

// Show start button and pause game on load
function showStart(playAgain = false) {
  running = false;
  startBtn.textContent = playAgain ? "Play Again" : "Start Game";
  startBtn.style.visibility = 'visible';
  draw();
}

function endGame() {
  running = false;
  startBtn.textContent = "Play Again";
  startBtn.style.visibility = 'visible';
}
showStart();
gameLoop();
