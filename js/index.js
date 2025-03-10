import { board } from "./variables.js"


export function creatBoard() {

  let width = 10
  let height = 20


  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let cel = document.createElement('div')
      cel.dataset.x = j
      cel.dataset.y = i
      cel.classList.add("cell")
      board.appendChild(cel)

    }

  }
}



