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
  const mazeArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,29,30,39,40,42,43,44,45,46,47,49,50,52,53,54,55,56,57,59,60,62,63,64,65,66,67,69,70,72,73,74,75,76,77,79,80,89,90,99,100,102,103,104,105,106,113,114,115,116,117,119,120,122,123,124,125,126,128,131,133,134,135,136,137,139,140,148,151,159,160,161,162,163,164,165,166,168,169,170,171,173,174,175,176,177,178,179,200,201,202,203,204,206,208,209,210,211,213,215,216,217,218,219,220,226,233,239,240,242,243,244,246,247,248,249,250,251, 252,253,255,256,257,259,260,262,263,264,268,269,270,271,275,276,277,279,280,282,283,284,286,288,289,290,291,293,295,296,277,279,299,300,302,303,304,306,313,315,316,317,319,320,326,327,328,329,330,331,332,333,339,340,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,359,360,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399]


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