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
  let playerDirection = 'right'


  const score = 0
  

  const mazeClass = 'maze-wall'
  const mazeArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,29,30,39,40,42,43,45,46,47,49,50,52,53,54,56,57,59,60,62,63,65,66,67,69,70,72,73,74,76,77,79,80,87,89,90,92,99,100,102,103,105,114,116,117,119,120,122,123,125,126,128,131,133,134,136,137,139,140,148,151,159,160,161,162,163,164,165,166,168,169,170,171,173,174,175,176,177,178,179,200,201,202,203,204,206,208,209,210,211,213,215,216,217,218,219,220,226,233,239,240,242,243,244,246,247,248,249,250,251,252,253,255,256,257,259,260,262,277,279,280,284,286,288,289,290,291,293,295,279,299,300,302,303,304,306,313,315,316,317,319,320,326,327,328,329,330,331,332,333,339,340,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,359,360,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399]

  // ? const ghostHome = [129,130,149,150]

  const pelletClass = 'pellet'
  const pelletArray = []


  // * Make Grid
  function createGrid(playerStartPosition) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      cell.textContent = i
      grid.appendChild(cell)
      cell.id = i
      cells.push(cell)
      
      // * render maze with css
      if (mazeArray.includes(Number(cell.id))) {
        cell.classList.add(mazeClass)
      }

      // * render pellets with css 
      if (!mazeArray.includes(Number(cell.id))) {
        // ? do i create HTML element I inject or do I just assign with reference to a css class on the cell itself. child vs sibling approach
        // cell.classList.add(pelletClass)
        pelletArray.push(cell)
        createPellets(pelletArray)
      }
    }
    
    addPlayer(playerStartPosition)
  }

  // * Add player to grid on move
  function addPlayer(position) {
    cells[position].classList.add(playerClass)
  }

  // * Remove player from grid on move
  function removePlayer(position) {
    cells[position].classList.remove(playerClass)
  }

  // * Create pellets
  function createPellets(pelletArray) {
    pelletArray.forEach(pellet => {
      pellet.classList.add(pelletClass)
    })
  }
 
  // // * Remove pellets
  // function removePellet(playerCurrentPosition, pelletArray) {
  //   if (playerCurrentPosition === Number(pelletArray.indexOf())) {
  //     console.log('eaten')
  //     pelletArray.indexOf().classList.remove(pelletClass)
  //   }
  // }

  function handleKeyUp(event) {
    const key = event.keyCode

    // * player movement logic
    if (key === 39) {
      playerDirection = 'right'
    } else if (key === 37) {
      playerDirection = 'left'
    } else if (key === 38) {
      playerDirection = 'up'
    } else if (key === 40) {
      playerDirection = 'down'
    } else {
      console.log('invalid key')
    }
  }

  function movePlayer() {
    const playerRelativePositionLeft = playerCurrentPosition - 1
    const playerRelativePositionRight = playerCurrentPosition + 1
    const playerRelativePositionUp = playerCurrentPosition - width
    const playerRelativePositionDown = playerCurrentPosition + width

    const portalLeft = 180
    const portalRight = 199

    removePlayer(playerCurrentPosition)

    if (playerDirection === 'right' && playerCurrentPosition % width !== width - 1 && !mazeArray.includes(playerRelativePositionRight)) {
      playerCurrentPosition++
    } else if (playerDirection === 'left' && playerCurrentPosition % width !== 0 && !mazeArray.includes(playerRelativePositionLeft)) {
      playerCurrentPosition--
    } else if (playerDirection === 'up' && playerCurrentPosition >= width && !mazeArray.includes(playerRelativePositionUp)) {
      playerCurrentPosition -= width
    } else if (playerDirection === 'down' && playerCurrentPosition + width <= width * width - 1 && !mazeArray.includes(playerRelativePositionDown)) {
      playerCurrentPosition += width
    } else {
      console.log('wall!')
    }

    // * gateway logic
    if (playerCurrentPosition === portalRight) {
      playerCurrentPosition = portalLeft
      console.log('Player traveled through portal')
    } else if (playerCurrentPosition === portalLeft) {
      playerCurrentPosition = portalRight
      console.log('Player traveled through portal')
    }

    addPlayer(playerCurrentPosition)
  }

  // * Event listeners
  document.addEventListener('keyup', handleKeyUp)

  // * Call functions
  createGrid(playerStartPosition) 

  // * Start timers
  const playerDirectionState = setInterval(movePlayer, 200)

}

window.addEventListener('DOMContentLoaded', init)