const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🖼️ Load your photo
const photo = new Image();
photo.src = "friend.png";

// 🎵 Load sounds
const flapSound = new Audio("flap.mp3");
const hitSound = new Audio("hit.mp3");

// 🧩 Very Slow, Beginner-Friendly Settings
const GRAVITY = 0.25;       // Bird falls very slowly
const LIFT = -5.5;          // Soft upward jump
const FLAP_DAMPING = 0.94;  // Smooth motion
const MAX_FALL_SPEED = 5;   // Cap downward speed
const PIPE_SPEED = 1.2;     // Pipes move slowly
const PIPE_SPAWN_FRAMES = 130; // Pipes appear slowly
const SCORE_INTERVAL = 130; // Slower scoring (matches pipe spawn rate)

let bird = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  gravity: GRAVITY,
  lift: LIFT,
  velocity: 0
};

let pipes = [];
let score = 0;
let frames = 0;
let gameStarted = false;

// 🐦 Draw the player's photo instead of bird
function drawBird() {
  ctx.drawImage(photo, bird.x, bird.y, bird.width, bird.height);
}

// 🌳 Draw pipes
function drawPipes() {
  ctx.fillStyle = "green";
  for (let pipe of pipes) {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  }
}

// 🔄 Update pipes
function updatePipes() {
  if (frames % PIPE_SPAWN_FRAMES === 0) {
    let top = Math.random() * 180 + 60;
    let gap = 150; // Wider gap for beginners
    pipes.push({
      x: canvas.width,
      width: 55,
      top: top,
      bottom: canvas.height - top - gap
    });
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= PIPE_SPEED;
    if (pipes[i].x + pipes[i].width < 0) pipes.splice(i, 1);
  }
}

// 💥 Collision detection
function checkCollision() {
  for (let pipe of pipes) {
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipe.width &&
      (bird.y < pipe.top ||
        bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      hitSound.play();
      resetGame();
    }
  }

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    hitSound.play();
    resetGame();
  }
}

function resetGame() {
  alert("Game Over 😭 Score: " + score);
  document.location.reload();
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// 🌀 Main loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.velocity *= FLAP_DAMPING;
  if (bird.velocity > MAX_FALL_SPEED) bird.velocity = MAX_FALL_SPEED;
  bird.y += bird.velocity;

  updatePipes();
  drawPipes();
  drawBird();
  drawScore();
  checkCollision();

  frames++;
  if (frames % SCORE_INTERVAL === 0) score++;

  requestAnimationFrame(gameLoop);
}

// 🕹️ Controls
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameLoop();
  }
  bird.velocity = bird.lift;
  flapSound.currentTime = 0;
  flapSound.play();
}

document.addEventListener("keydown", startGame);
document.addEventListener("touchstart", startGame);

// 🖼️ Show message before start
photo.onload = () => {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Press any key or tap to start!", 60, 300);
};
