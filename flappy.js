//Updated version
"use stict";

// Canvas Setup
const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 800;


// Global Variables
let ball = {
  x: 200,
  y: 500,
  radius: 17.5,
  color: 'yellow',
  gravity: 0
};

let obstacles = [
  { x: canvas.width, y: getRandomY(), width: 60, height: 400, scored: false, speed: 0, ySpeed: 1.5 },
  { x: canvas.width + 275, y: getRandomY(), width: 60, height: 400, scored: false, speed: 0, ySpeed: -1.5 }
];

let gameState = {
  start: false,
  isRunning: false,
  isColliding: false,
  score: 0,
  colors: {
      sky: "rgb(46, 151, 221)",
      obstacle: 'green',
      ground: 'green',
  },
  ground: 650,
  hard: false,
  bottomScaler: 550,
};

// Event Listeners
document.addEventListener("keydown", fly);
document.getElementById('hard').addEventListener('click', setHardMode);
document.getElementById('regular').addEventListener('click', setRegualarMode);
document.getElementById('colorpicker').addEventListener('change', changeBallColor);
document.getElementById('reset').addEventListener('click', resetColor);
document.getElementById('resetScore').addEventListener('click', resetHs);
document.getElementById("play-btn").addEventListener('click', startGame)

// Main Game Loop
function gameLoop() {
  updateHighScore();

  drawGame();
  if (gameState.isRunning) {
      ball.y += ball.gravity;
      ball.gravity += 0.65;

      document.querySelector('.space-start').innerHTML = "";

      moveObstacles();
      detectCollision();
      updateScore();
  }

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

function startGame() {
  // Hide start screen
  document.getElementById('intro').classList.add('hide');
  
  // Start game loop
  start = true
  document.querySelector('.space-start').innerHTML = "PRESS SPACE TO START";
  
}

function getRandomY() {
  console.log(-100 + Math.random() * 200 - 100);
  return -100 + Math.random() * 200 - 100;
}

function moveObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.x -= obstacle.speed;
    
    if (obstacle.x < -obstacle.width) {
      obstacle.x = canvas.width;
      obstacle.y = getRandomY();
      obstacle.scored = false;
    }

    if (gameState.hard) {
      obstacle.y -= obstacle.ySpeed;
      if (obstacle.y < -200 || obstacle.y > 0) {
        obstacle.ySpeed *= -1;
      }  
    }
  });
  
}


function detectCollision() {
  if (isCollidingWithGround() || isCollidingWithObstacles()) {
      endGame();
  }
}

function isCollidingWithGround() {
  return ball.y + ball.radius > gameState.ground || ball.y < -300;
}

//Checking all obstacles for condition
function isCollidingWithObstacles() {
  return obstacles.some(obstacle => {
      return (
          (ball.x + ball.radius >= obstacle.x && ball.y - ball.radius <= obstacle.y + obstacle.height && ball.x - ball.radius < obstacle.x + obstacle.width) ||
          (ball.x + ball.radius >= obstacle.x && ball.y + ball.radius >= obstacle.y + gameState.bottomScaler && ball.x - ball.radius < obstacle.x + obstacle.width)
      );
  });
}

function endGame() {
  gameState.isColliding = true;
  gameState.isRunning = false;
  obstacles.forEach(obstacle => obstacle.speed = 0);
  document.getElementById('flappyhide').classList.remove('hide');
  updateScores();
}

function drawGame() {
  // Sky
  ctx.fillStyle = gameState.colors.sky;
  ctx.fillRect(0, 0, canvas.width, gameState.ground);

  // Obstacles
  ctx.fillStyle = gameState.colors.obstacle;
  obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      ctx.fillRect(obstacle.x, obstacle.y + gameState.bottomScaler, obstacle.width, obstacle.height);
  });

  // Ball
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  ctx.fill();

  // Ground
  ctx.fillStyle = gameState.colors.ground;
  ctx.fillRect(0, gameState.ground, canvas.width, 150);

}

function updateScore() {
  obstacles.forEach(obstacle => {
      if (ball.x > obstacle.x + obstacle.width && !obstacle.scored) {
          gameState.score++;
          document.getElementById('score').innerHTML = gameState.score;
          obstacle.scored = true;
      }
  });
  updateScores();
}

function fly(event) {
  if (start && !gameState.isColliding && event.code === "Space") {
      event.preventDefault(); // Prevent page scroll
      gameState.isRunning = true;
      ball.gravity = -10.5;
      obstacles.forEach(obstacle => obstacle.speed = 4);
  }
}

function setHardMode() {
  gameState.hard = true;
}

function setRegualarMode() {
  gameState.hard = false;
}

function changeBallColor() {
  ball.color = document.getElementById('colorpicker').value;
}

function resetColor() {
  ball.color = 'yellow';
}

function resetHs() {
  localStorage.clear();
}

//Seperate Scores for regular and hard

function getRegHighScore() {
  return localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
}

function getHardHighScore() {
  return localStorage.getItem('highScoreHard') ? parseInt(localStorage.getItem('highScoreHard')) : 0;
}

function setRegHighScore(score) {
  localStorage.setItem('highScore', score);
}

function setHardHighScore(score) {
  localStorage.setItem('highScoreHard', score);
}

function updateHighScore() {
  if (gameState.hard) {
    document.getElementById('highscore').innerText = getHardHighScore();
  } else {
    document.getElementById('highscore').innerText = getRegHighScore();
  }
  
}

function updateScores() {
  if (!gameState.hard) {

    if (gameState.score > getRegHighScore()) {
      setRegHighScore(gameState.score);
    }
    document.getElementById('highscore').innerText = getRegHighScore();

  } else {

    if (gameState.score > getHardHighScore()) {
      setHardHighScore(gameState.score);
    }
    document.getElementById('highscore').innerText = getHardHighScore();

  }
}