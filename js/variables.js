export let colors = [
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "yellow",
    "darkblue",
  ];
  export let board = document.querySelector(".tetris-board");
  export let startPosition = [0, 3];
  export let currentPosition = [0, 3];
  
  export const variables = {
    startTime: 0,
    paused: false,
    lastTime: 0,
    elapsedTime: 0,
    move: true,
  };
  