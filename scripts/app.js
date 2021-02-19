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

  // const terrainClass = 'terrain'
  // const terrainArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,29,30,39]


  // * Make Grid
  function createGrid(playerStartPosition) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      cell.textContent = i
      grid.appendChild(cell)
      cells.push(cell)
    }
    addPlayer(playerStartPosition)
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
  // function handleObstacles() {

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