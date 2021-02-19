function init() {
  // * Global Variables
  const grid = document.querySelector('.grid')

  //Grid width
  const width = 20
  const cellCount = width * width
  const cells = []
  

  const playerClass = 'player'
  const playerStartPosition = 369
  let playerCurrentPosition = 369

  const mazeClass = 'maze'
  const mazeArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,29,30,39,40,42,43,44,45,46,47,49,50,52,53,54,55,56,57,59,60,62,63,64,65,66,67,69,70,72,73,74,75,76,77,79,80,89,90,99,100,102,103,104,105,106,113,114,115,116,117,119,120,122,123,124,125,126,128,131,133,134,135,136,137,139,140,148,151,159]


  //console.log('mazeArray ->', mazeArray)


  // * Make Grid
  function createGrid(playerStartPosition) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      cell.textContent = i
      grid.appendChild(cell)
      cell.id = i
      cells.push(cell)
      //need to compare cell.id to mazeArray values and add the maze class when true.
      console.log('cell.id ->', parseFloat(cell.id))

      if (mazeArray.includes(Number(cell.id))) {
        console.log('match')
        cell.classList.add(mazeClass)
      }
    }
    



    addPlayer(playerStartPosition)
    //createMaze()
  }
  // * Add player to grid
  function addPlayer(position) {
    cells[position].classList.add(playerClass)
  }

  // * Remove player from grid
  function removePlayer(position) {
    cells[position].classList.remove(playerClass)
  }

  // * Obstacles, assign by class 1) grid out grid items to be 'obstacles' and assign a class to those.
  // function createMaze(cells) { 
  //   mazeArray.forEach(block => {
  //     if ()
  //   })
  // }


  function handleKeyUp(event) {
    const key = event.keyCode

    removePlayer(playerCurrentPosition)
    
    if (key === 39 && playerCurrentPosition % width !== width - 1) {
      playerCurrentPosition++
    } else if (key === 37 && playerCurrentPosition % width !== 0) {
      playerCurrentPosition--
    } else if (key === 38 && playerCurrentPosition >= width) {
      playerCurrentPosition -= width
    } else if (key === 40 && playerCurrentPosition + width <= width * width - 1) {
      playerCurrentPosition += width
    } else {
      console.log('INVALID KEY')
    }
    
    addPlayer(playerCurrentPosition)
  }

  // * Event listeners
  document.addEventListener('keydown', handleKeyUp)

  createGrid(playerStartPosition) 

}

window.addEventListener('DOMContentLoaded', init)