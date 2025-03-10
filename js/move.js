import { animationFrameId, update } from "./main.js";
import { shapes } from "./shapes.js";
import { colors, variables } from "./variables.js";

// Import popup functions
import { showGameOver, showGamePaused, hideGamePaused } from "./main.js";

let lives = 3;
const startX = 3;
const startY = 0;
document.querySelector(".live-count").textContent = lives;

let random = Math.floor(Math.random() * shapes.length);
let current = shapes[random].map((block) => [
  block[0] + startX,
  block[1] + startY,
]);
let color = colors[random];

export function move(direction) {
  if (!variables.move) return;

  if (direction === "down") {
    if (
      current.some(
        (element) =>
          element[1] + 1 > 19 || isTaken([element[0], element[1] + 1])
      )
    ) {
      freeze();
      return;
    }

    undraw();
    current.forEach((element, index) => {
      current[index] = [element[0], element[1] + 1];
    });
    draw();
  }

  if (direction === "left") {
    if (
      !current.some(
        (element) => element[0] - 1 < 0 || isTaken([element[0] - 1, element[1]])
      )
    ) {
      undraw();
      current.forEach((element, index) => {
        current[index] = [element[0] - 1, element[1]];
      });
      draw();
    }
  }

  if (direction === "right") {
    if (
      !current.some(
        (element) => element[0] + 1 > 9 || isTaken([element[0] + 1, element[1]])
      )
    ) {
      undraw();
      current.forEach((element, index) => {
        current[index] = [element[0] + 1, element[1]];
      });
      draw();
      addScore(0);
    }
  }
}

export function draw() {
  current.forEach((element) => {
    const x = element[0];
    const y = element[1];

    const cel = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (cel) {
      cel.style.backgroundColor = color;
    }
  });
}

export function undraw() {
  current.forEach((element) => {
    const x = element[0];
    const y = element[1];

    const cel = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (cel) {
      cel.style.backgroundColor = "";
    }
  });
}

export function freeze() {
  current.forEach((element) => {
    const x = element[0];
    const y = element[1];

    if (y > 19) return;

    const cel = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (cel) {
      cel.classList.add("taken");
    }
  });
  checkLines();
  spawnNewTetro();
}

function isTaken(element) {
  const x = element[0];
  const y = element[1];

  const cel = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
  return cel && cel.classList.contains("taken");
}

let gameOver = false;

function spawnNewTetro() {
  if (gameOver) return;

  let random = Math.floor(Math.random() * shapes.length);
  let newShape = shapes[random].map((block) => [
    block[0] + startX,
    block[1] + startY,
  ]);
  let newColor = colors[random];

  // Check if the new shape overlaps with existing frozen blocks
  if (newShape.some((element) => isTaken(element))) {
    if (!gameOver) {
      gameOver = true;
      lives--;

      document.querySelector(".live-count").textContent = lives;

      if (lives === 0) {
        cancelAnimationFrame(animationFrameId);
        showGameOver(); // Show game over modal
        return;
      } else {
        restartGame();
      }
    }
  }

  current = newShape;
  color = newColor;
  draw();
}

export function restartGame() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.style.backgroundColor = "";
    cell.classList.remove("taken");
  });

  gameOver = false;
  variables.paused = false;
  variables.elapsedTime = 0;
  variables.lastTime = performance.now();

  spawnNewTetro();
  undraw();

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  update();
}

export function rotate() {
  if (!variables.move) return;

  const originalPosition = current.map((element) => [...element]);

  undraw();

  const centerX = current[0][0];
  const centerY = current[0][1];

  current.forEach((element, index) => {
    const x = element[0] - centerX;
    const y = element[1] - centerY;

    current[index] = [centerX + y, centerY - x];
  });

  if (
    current.some(
      (element) =>
        element[0] < 0 ||
        element[0] > 9 ||
        element[1] > 19 ||
        element[1] < 0 ||
        isTaken(element)
    )
  ) {
    current = originalPosition;
  }

  draw();
}

document.addEventListener("keydown", (e) => {
  if (e.key == "ArrowLeft") {
    move("left");
  } else if (e.key == "ArrowDown") {
    move("down");
  } else if (e.key == "ArrowRight") {
    move("right");
  } else if (e.key == "ArrowUp") {
    rotate();
  } else if (e.key == "r" || e.key == "R") {
    lives = 3;
    document.querySelector(".live-count").textContent = lives;
    score = 0;
    scoreDisplay.textContent = score;
    variables.startTime = Date.now();

    restartGame();
  } else if (e.key == "p" || e.key == "P") {
    pause();
  } else if (e.key == "c" || e.key == "C") {
    continueGame();
  }
});

export function pause() {
  if (!variables.paused) {
    variables.paused = true;
    variables.move = false;
    cancelAnimationFrame(animationFrameId);
    showGamePaused(); // Show pause modal
  }
}

export function continueGame() {
  if (variables.paused) {
    variables.paused = false;
    variables.move = true;
    variables.lastTime = performance.now();
    update();
    hideGamePaused(); // Hide pause modal
  }
}

let score = 0;
const scoreDisplay = document.querySelector(".score-count");

export function addScore(linesCleared) {
  const points = [0, 10, 20, 30, 40];
  score += points[linesCleared];
  scoreDisplay.textContent = score;
}

export function checkLines() {
  let linesCleared = 0;
  for (let y = 19; y >= 0; y--) {
    let isLineFull = true;
    for (let x = 0; x < 10; x++) {
      const cel = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
      if (!cel || !cel.classList.contains("taken")) {
        isLineFull = false;
        break;
      }
    }
    if (isLineFull) {
      linesCleared++;
      for (let x = 0; x < 10; x++) {
        const cel = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        cel.style.backgroundColor = "";
        cel.classList.remove("taken");
      }
      y++;
    }
  }
  if (linesCleared > 0) {
    addScore(linesCleared);
  }
}
