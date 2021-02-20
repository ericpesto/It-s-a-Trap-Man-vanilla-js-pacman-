function init() {
  // * Global Variables
  const grid = document.querySelector('.grid')
  

  // * Grid variables
  const width = 20
  const cellCount = width * width
  const cells = []
  const mazeClass = 'maze-wall'
  const mazeArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,29,30,39,40,42,43,45,46,47,49,50,52,53,54,56,57,59,60,62,63,65,66,67,69,70,72,73,74,76,77,79,80,87,89,90,92,99,100,102,103,105,114,116,117,119,120,122,123,125,126,128,131,133,134,136,137,139,140,148,151,159,160,161,162,163,164,165,166,168,169,170,171,173,174,175,176,177,178,179,200,201,202,203,204,206,208,209,210,211,213,215,216,217,218,219,220,226,233,239,240,242,243,244,246,247,248,249,250,251,252,253,255,256,257,259,260,262,277,279,280,284,286,288,289,290,291,293,295,279,299,300,302,303,304,306,313,315,316,317,319,320,326,327,328,329,330,331,332,333,339,340,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,359,360,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399] 
  const ghostHomeArray = [129,130,149,150]
  const ghostHomeClass = 'ghost-home'
  const mergedMazeAndGhostHomeArray = mazeArray.concat(ghostHomeArray)

  const pelletClass = 'pellet'
  const superPelletClass = 'super-pellet'
  const pelletEatenClass = 'pellet-eaten'
  const pelletArray = []
  const pelletsEatenArray = []


  // * Player Variables
  const playerClass = 'player'
  const playerStartPosition = 369
  let playerCurrentPosition = 369
  let playerDirection = 'right'

  // * Game state/logic variables
  let score = 0
  // let lives = 3
  


  // * Make Grid
  function createGrid(playerStartPosition) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      //cell.textContent = i
      grid.appendChild(cell)
      cell.id = i
      //cell.classList.add('grid-item')
      cells.push(cell)
      
      // * Render maze with css
      if (mazeArray.includes(Number(cell.id))) {
        cell.classList.add(mazeClass)
      }

      // * Render ghostHome with css
      if (ghostHomeArray.includes(Number(cell.id))) {
        cell.classList.add(ghostHomeClass)
      }

      // * Render pellets with css 
      if (!mergedMazeAndGhostHomeArray.includes(Number(cell.id))) {
        pelletArray.push(cell)
        createPellets(pelletArray)
      }
    }
    
    addPlayer(playerStartPosition)
    //will add ghosts here too
    
  }

  // * Add player to grid on move
  function addPlayer(position) {
    cells[position].classList.add(playerClass)
  }

  // * Remove player from grid on move
  function removePlayer(position) {
    cells[position].classList.remove(playerClass)
  }

  // * Create pellets and super pellets
  // ! CSS APPROACH NOT WORKING FOR SCORE, but html approach fucked up the grid
  function createPellets() {
    pelletArray.forEach(pellet => {
      if (pellet.id % 28 === 0) {
        pellet.classList.add(superPelletClass)
        pellet.setAttribute('data-score', 100)
      } else {
        pellet.classList.add(pelletClass)
        pellet.setAttribute('data-score', 20)
      }
    })
  }
 
  // ! Remove pellets WIP, pellets are removed visually atm
  function removePellet(position) {
    pelletArray.forEach(pellet => {
      if (position === Number(pellet.id)) {
        //console.log('Nom')
        
        if (pellet.id % 28 === 0) {
          pellet.classList.remove(superPelletClass)
          pellet.classList.add(pelletEatenClass)
        } else {
          pellet.classList.remove(pelletClass)
          pellet.classList.add(pelletEatenClass)
        }
        // * create array for pelets eaten and contain score in attrbute
        pelletsEatenArray.push(pellet)
        // ! BUG: score adds every time the setInterval timer runs, and add to itself even when player is 'stuck' against wall. Need a way to evluate score sepetate from the movement timer. i just wanna count the amoung if items that contain the class 'pellet eaten'
      }
    })
  }


  // * Pellet eaten function
  function handleScore() {
    //const numberOfPelletsEaten = pelletsEatenArray.length
    //console.log(numberOfPelletsEaten)
    pelletsEatenArray.forEach(pellet => {
      if (pellet.classList.contains('pellet-eaten')) {
        console.log('pellet value ->', Number(pellet.getAttribute('data-score'))) 
        score += Number(pellet.getAttribute('data-score'))
        console.log('Score ->', score) 
      }
    })   
  }

  
  function handleKeyUp(event) {
    const key = event.keyCode

    // * player movement logic
    if (key === 39) {
      playerDirection = 'right'
      // console.log('player pressed right')
    } else if (key === 37) {
      playerDirection = 'left'
      // console.log('player pressed left')
    } else if (key === 38) {
      playerDirection = 'up'
      // console.log('player pressed up')
    } else if (key === 40) {
      playerDirection = 'down'
      // console.log('player pressed down')
    } else {
      // console.log('invalid key')
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

    if (playerDirection === 'right' && playerCurrentPosition % width !== width - 1 && !mergedMazeAndGhostHomeArray.includes(playerRelativePositionRight)) {
      playerCurrentPosition++
      // console.log('Moved right')
    } else if (playerDirection === 'left' && playerCurrentPosition % width !== 0 && !mergedMazeAndGhostHomeArray.includes(playerRelativePositionLeft)) {
      playerCurrentPosition--
      // console.log('Moved left')
    } else if (playerDirection === 'up' && playerCurrentPosition >= width && !mergedMazeAndGhostHomeArray.includes(playerRelativePositionUp)) {
      playerCurrentPosition -= width
      // console.log('Moved up')
    } else if (playerDirection === 'down' && playerCurrentPosition + width <= width * width - 1 && !mergedMazeAndGhostHomeArray.includes(playerRelativePositionDown)) {
      playerCurrentPosition += width
      // console.log('Moved down')
    } else {
      // console.log('Ouch! Wall!')
    }

    // * Gateway logic
    if (playerCurrentPosition === portalRight) {
      playerCurrentPosition = portalLeft
      // console.log('Player traveled through portal')
    } else if (playerCurrentPosition === portalLeft) {
      playerCurrentPosition = portalRight
      // console.log('Player traveled through portal')
    }

    handleScore()
    removePellet(playerCurrentPosition)
    addPlayer(playerCurrentPosition)
  }
  

  // * Call functions
  createGrid(playerStartPosition) 

  // * Event listeners
  document.addEventListener('keyup', handleKeyUp)

  // * Start timers
  const playerDirectionState = setInterval(movePlayer, 300)
}

window.addEventListener('DOMContentLoaded', init)