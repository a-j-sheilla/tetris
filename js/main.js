import { creatBoard } from "./index.js";
import { addScore, draw, move, restartGame, rotate } from "./move.js";
import { variables } from "./variables.js";
export let animationFrameId;
let dropInterval = 1000;
export let dropCounter = 0;
let timeDisplay = document.querySelector(".time-diff");


creatBoard();

document.addEventListener("DOMContentLoaded", () => {
  if (!animationFrameId) {
    draw();
    variables.lastTime = performance.now();
    update();
  }
});

export function update(time = 0) {
  if (variables.paused) return;
  const deltaTime = time - variables.lastTime;
  variables.lastTime = time;
  dropCounter += deltaTime;
  variables.elapsedTime += deltaTime; // Track elapsed time only when running
  if (dropCounter > dropInterval) {
    move("down");
    dropCounter = 0;
    addScore(0);
    
  }


  // Convert elapsedTime to minutes and seconds
  let totalSeconds = Math.floor(variables.elapsedTime / 1000);
  let minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  let seconds = (totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  timeDisplay.textContent = `${minutes}:${seconds}`;
  animationFrameId = requestAnimationFrame(update);
}

export function showGameOver() {
  console.log("Game Over triggered");
  document.getElementById('gameOverModal').style.display = 'flex';
}

export function showGamePaused() {
  console.log("Game Paused triggered");
  document.getElementById('gamePausedModal').style.display = 'flex';
}

export function hideGamePaused() {
  document.getElementById('gamePausedModal').style.display = 'none';

}
window.showGameOver = showGameOver;
window.showGamePaused =showGamePaused;
window.hideGamePaused = hideGamePaused;



