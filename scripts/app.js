function init() {
  // * Global Variables
  const grid = document.querySelector('.grid')
  const scoreDisplay = document.querySelector('.score')
  
  // * Grid variables
  const width = 20
  const cellCount = width * width
  const cells = []
  let cell 
  const mazeClass = 'maze-wall'
  const mazeArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,29,30,39,40,42,43,45,46,47,49,50,52,53,54,56,57,59,60,62,63,65,66,67,69,70,72,73,74,76,77,79,80,87,89,90,92,99,100,102,103,105,114,116,117,119,120,122,123,125,126,128,131,133,134,136,137,139,140,148,151,159,160,161,162,163,164,165,166,168,169,170,171,173,174,175,176,177,178,179,200,201,202,203,204,206,208,209,210,211,213,215,216,217,218,219,220,226,233,239,240,242,243,244,246,247,248,249,250,251,252,253,255,256,257,259,260,262,277,279,280,284,286,288,289,290,291,293,295,279,299,300,302,303,304,306,313,315,316,317,319,320,326,327,328,329,330,331,332,333,339,340,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,359,360,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399] 
  const ghostHomeArray = [129,130,149,150]
  const ghostHomeClass = 'ghost-home'
  const portalLocations = [180,199]
  const superPelletLocations = [84,95,276,263]
  const playerTrack = mazeArray.concat(ghostHomeArray)
  const pelletTrack = mazeArray.concat(ghostHomeArray, portalLocations, superPelletLocations)

  const pelletClass = 'pellet'
  const superPelletClass = 'super-pellet'
  const pelletEatenClass = 'pellet-eaten'
  const superPelletEatenClass = 'super-pellet-eaten'
  const pellets = []
  const superPellets = []
  
  // * Player Variables
  const playerClass = 'player'
  const playerStartPosition = 369
  let playerCurrentPosition = 369
  let playerDirection = 'right'

  // * Game state/logic variables
  let score = 0
  const pelletScoreValue = 10
  const superPelletScoreValue = 50
  // let lives = 3

  
  // ! Do I make a ghost class or individual objects for each ghost?
  // * Ghosts
  // ? four ghosts as individual objects, each with uniq behaviours stored as methods that can be called back with conditoinal logic based on player movement.
  const char = {
    name: 'Char',
    className: 'char',
    startingPosition: 130,
    currentPosition: 130,
    targetPosition: 229,
    chase() {
      // targets a target tile is clculated everytime before a decsiion to move is made
      // each ghost has uniqe behaviour/target tile based on player position
    },
    scatter() {
      // targets specific tile in the corner of maze, never changes
    }, 
    frightned() {
      // instead fo minimising ditance they will pick an eldigible direction at random using output from a random number generator

      // if player eats frightened ghost, they will endter eaten mode
    }, 
    eaten() {
      // ghost targets ghost home/starting position
      // once home they revert to scatter or chase mode
    },
    add(position) {
      console.log('char added')
      console.log(position)
      cells[position].classList.add(char.className)
    },
    remove() {

    },
    move() {
      // determine direction options with random? (nahh too easy)
      // use some sort of method to find shortest possible route to target
 

    }
  }

  // * Make Grid
  function createGrid(playerStartPosition) {
    for (let i = 0; i < cellCount; i++) {
      cell = document.createElement('div')
      //cell.textContent = i
      grid.appendChild(cell)
      cell.id = i
      cells.push(cell)
      
      addMaze(cell)
      addGhostHome(cell)
      createPellets(cell)
      createSuperPellets(cell)
    }

    // * initiate player and ghosts here
    addPlayer(playerStartPosition)
    char.add(char.startingPosition)
    
  }
  
  function addMaze(gridIndex) {
    if (mazeArray.includes(Number(gridIndex.id))) {
      gridIndex.classList.add(mazeClass)
    }
  }

  function addGhostHome(gridIndex) {
    if (ghostHomeArray.includes(Number(gridIndex.id))) {
      gridIndex.classList.add(ghostHomeClass)
    }
  }

  function createPellets(gridIndex) {
    if (!pelletTrack.includes(Number(gridIndex.id))) {
      pellets.push(gridIndex)
      addPellets()
    }
  }

  function createSuperPellets(gridIndex) {
    if (superPelletLocations.includes(Number(gridIndex.id))) {
      superPellets.push(gridIndex)
      addSuperPellets()
    }
  }
  
  // * add pellets to grid
  function addPellets() {
    pellets.forEach(pellet => {
      pellet.classList.add(pelletClass)
    })
  }

  // * add super pellets to grid
  function addSuperPellets() {
    superPellets.forEach(superPellet => {
      superPellet.classList.add(superPelletClass)
    })
  }

  // * Add player to grid on move
  function addPlayer(position) {
    cells[position].classList.add(playerClass)
  }
  
  // * Remove player from grid on move
  function removePlayer(position) {
    cells[position].classList.remove(playerClass)
  }

  // * Remove pellet on player movement
  function removePellet(playerPosition) {
    pellets.forEach(pellet => {
      if (playerPosition === Number(pellet.id)) {
        pellet.classList.remove(pelletClass)
        pellet.classList.add(pelletEatenClass)
        //pellet.setAttribute('data-score', pelletScoreValue)
      }
    })
  }

  // * Remove super pellet on player movement
  function removeSuperPellet(playerPosition) {
    superPellets.forEach(superPellet => {
      if (playerPosition === Number(superPellet.id)) {
        superPellet.classList.remove(superPelletClass)
        superPellet.classList.add(superPelletEatenClass)
        //superPellet.setAttribute('data-score', superPelletScoreValue)
      }
    })
  }

  // * Handle Score (workaround to account for playermovement behavour related to set interval, works really well for both pellet and superpellets now)
  function handleScore() {
    const eatenPellets = document.getElementsByClassName(pelletEatenClass)
    const numberOfPelletsEaten = eatenPellets.length

    const eatenSuperPellets = document.getElementsByClassName(superPelletEatenClass)
    const numberOfSuperPelletsEaten = eatenSuperPellets.length

    console.log('pellets eaten ->', numberOfPelletsEaten)
    score = (numberOfPelletsEaten * pelletScoreValue) + (numberOfSuperPelletsEaten * superPelletScoreValue)
    console.log('score', score)
    scoreDisplay.innerText = score
  }

  function handleKeyUp(event) {
    const key = event.keyCode

    // * player direction logic
    if (key === 39) {
      playerDirection = 'right'
      console.log('player pressed right')
    } else if (key === 37) {
      playerDirection = 'left'
      console.log('player pressed left')
    } else if (key === 38) {
      playerDirection = 'up'
      console.log('player pressed up')
    } else if (key === 40) {
      playerDirection = 'down'
      console.log('player pressed down')
    } else {
      console.log('invalid key')
    }
  }

  function movePlayer() {
    const playerRelativePositionLeft = playerCurrentPosition - 1
    const playerRelativePositionRight = playerCurrentPosition + 1
    const playerRelativePositionUp = playerCurrentPosition - width
    const playerRelativePositionDown = playerCurrentPosition + width

    removePlayer(playerCurrentPosition)
    //char.remove(char.currentPosition)

    if (playerDirection === 'right' && playerCurrentPosition % width !== width - 1 && !playerTrack.includes(playerRelativePositionRight)) {
      playerCurrentPosition++
      console.log('Moving right')
    } else if (playerDirection === 'left' && playerCurrentPosition % width !== 0 && !playerTrack.includes(playerRelativePositionLeft)) {
      playerCurrentPosition--
      console.log('Moving left')
    } else if (playerDirection === 'up' && playerCurrentPosition >= width && !playerTrack.includes(playerRelativePositionUp)) {
      playerCurrentPosition -= width
      console.log('Moving up')
    } else if (playerDirection === 'down' && playerCurrentPosition + width <= width * width - 1 && !playerTrack.includes(playerRelativePositionDown)) {
      playerCurrentPosition += width
      console.log('Moving down')
    } else {
      console.log('Ouch! Wall!')
    }

    // * Gateway logic 
    // ? BONUS: Add two more gateways and have player come out of random one?
    if (playerCurrentPosition === portalLocations[1]) {
      playerCurrentPosition = portalLocations[0]
      console.log('Player traveled through portal')
    } else if (playerCurrentPosition === portalLocations[0]) {
      playerCurrentPosition = portalLocations[1]
      console.log('Player traveled through portal')
    }

    console.log('playerPosition ->', playerCurrentPosition)

    // * WHERE MOST FUNCTIONs WILL BE CALLED


    //char.add(char.currentPosition)
    addPlayer(playerCurrentPosition)
    removePellet(playerCurrentPosition)
    removeSuperPellet(playerCurrentPosition)
    handleScore() 
    gridCoordinates(playerCurrentPosition) 
  }
  
  function gridCoordinates(position) {
    const positionX = position % width
    //console.log('positionX ->', positionX)
    const positionY = position / width
    //console.log('positionY ->', positionY)
    let positionCoordinates = []
    positionCoordinates = positionCoordinates.concat(positionX, positionY)
    console.log('positionCoordinates(x,y) ->', positionCoordinates)

  }

  // * Call functions
  createGrid(playerStartPosition) 

  // * Event listeners
  document.addEventListener('keyup', handleKeyUp)

  // * Start timers
  const playerDirectionState = setInterval(movePlayer, 300)
}

window.addEventListener('DOMContentLoaded', init)


//NEED TO ADD SUPERPELLETS AND GHOSTS