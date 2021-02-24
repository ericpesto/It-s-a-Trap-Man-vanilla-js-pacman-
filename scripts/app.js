function init() {
  // * HTML variables
  const grid = document.querySelector('.grid')
  const scoreDisplay = document.querySelector('.score')
  const livesDisplay = document.querySelector('.lives')
  const startGameButton = document.querySelector('.start-game')
  const introPage = document.querySelector('.intro-page')
  const livesDisplayHeader = document.querySelector('.lives-header')
  const scoreDisplayHeader = document.querySelector('.score-header')
  const gridWrapper = document.querySelector('.grid-wrapper')

  // * Audio

  const soundTrack = document.querySelector('.soundtrack')
  const playerEatenFx = document.querySelector('.player-eaten-fx')
  const scaredGhostFx = document.querySelector('.ghost-eaten-fx')

  // * Timers
  let playerMovement = null
  let charMovement = null
  let noaMovement = null
  let josMovement = null
  let guyMovement = null

  
  // * Grid variables
  const width = 20
  const cellCount = width * width
  const cells = []
  let cell 
  const mazeClass = 'maze-wall'
  const mazeArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,29,30,39,40,42,43,45,46,47,49,50,52,53,54,56,57,59,60,62,63,65,66,67,69,70,72,73,74,76,77,79,80,87,89,90,92,99,100,102,103,105,114,116,117,119,120,122,123,125,126,127,128,131,132,133,134,136,137,139,140,159,160,161,162,163,165,166,167,172,173,174,176,177,178,179,200,201,202,203,205,206,207,212,213,214,216,218,217,219,220,226,233,239,240,242,243,244,246,248,249,250,251,253,255,256,257,259,260,262,277,279,280,284,286,288,289,290,291,293,295,279,299,300,302,303,304,306,313,315,316,317,319,320,326,328,329,330,331,333,339,340,342,343,344,345,346,353,354,355,356,357,359,360,368,369,370,371,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399] 
  const ghostHomeArray = [169,170,189,190,209,210]
  const ghostHomeClass = 'ghost-home'
  const portalLocations = [180,199]
  const portalClass = 'portal'
  const superPelletLocations = [84,95,276,263]
  const playerTrack = mazeArray.concat(ghostHomeArray)
  const pelletTrack = mazeArray.concat(ghostHomeArray, portalLocations, superPelletLocations)

  const pelletClass = 'pellet'
  const superPelletClass = 'super-pellet'
  const pelletEatenClass = 'pellet-eaten'
  const superPelletEatenClass = 'super-pellet-eaten'
  const pellets = []
  const superPellets = []
  const ghostsEaten = []
  const scaredClass = 'scared'

  // * Game state/logic variables
  let score = 0
  //let pelletsLeft = cells.length - (mazeArray.length + ghostHomeArray.length + portalLocations.length)
  let pelletsLeft = []
  const pelletScoreValue = 10
  const superPelletScoreValue = 50
  const eatenGhostValue = 200


  // * Player object
  const player = {
    name: 'Dave', // ! make it so user can add name to personalise experience
    startPosition: 361,
    currentPosition: 361,
    direction: 'left',
    class: 'player',
    lives: 3,
    huntClass: 'player-hunt',
    speed: 250,
    positionX: function() {
      return Math.floor(player.currentPosition % width)
    },
    positionY: function() {
      return player.currentPosition / width
    },
    add(position) {
      cells[position].classList.add(player.class)
    },
    remove(position){
      cells[position].classList.remove(player.class)
    },
    move() {
      const playerRelativePositionLeft = player.currentPosition - 1
      const playerRelativePositionRight = player.currentPosition + 1
      const playerRelativePositionUp = player.currentPosition - width
      const playerRelativePositionDown = player.currentPosition + width

      player.remove(player.currentPosition)

      if (player.direction === 'right' && player.currentPosition % width !== width - 1 && !playerTrack.includes(playerRelativePositionRight)) {
        player.currentPosition++
      //console.log('Moving right')
      } else if (player.direction === 'left' && player.currentPosition % width !== 0 && !playerTrack.includes(playerRelativePositionLeft)) {
        player.currentPosition--
      //console.log('Moving left')
      } else if (player.direction === 'up' && player.currentPosition >= width && !playerTrack.includes(playerRelativePositionUp)) {
        player.currentPosition -= width
      //console.log('Moving up')
      } else if (player.direction === 'down' && player.currentPosition + width <= width * width - 1 && !playerTrack.includes(playerRelativePositionDown)) {
        player.currentPosition += width
      //console.log('Moving down')
      } else {
      //console.log('Ouch! Wall!')
      }
      //console.log('playerPosition ->', playerCurrentPosition)

      // * inititalize functions dependent on player movement here
      player.add(player.currentPosition)
      removePellet(player.currentPosition)
      removeSuperPellet(player.currentPosition)
      handleTeleport(player.currentPosition, player)
      handleScore() 
      handleGameState()
    }
    // work on turning ghosts back to normal after sent home and the superpellet bug
    
  }

  // * Ghosts
  const char = {
    name: 'Char',
    className: 'char',
    startingPosition: ghostHomeArray[0],
    currentPosition: ghostHomeArray[0],
    speed: 300,
    targetCoordinates: [player.positionX(), player.positionY()],
    positionX: function() {
      return Math.floor(char.currentPosition % width)
    },
    positionY: function() {
      return char.currentPosition / width
    },
    add(position) {
      //console.log('char added')
      //console.log(position)
      cells[position].classList.add(char.className)
    },
    remove(position) {
      //console.log('char removed')
      cells[position].classList.remove(char.className)
    },
    move() {
      const directions = [-1, +1, -width, +width]
      let direction = directions[Math.floor(Math.random() * directions.length)]
      
      // if (!mazeArray.includes(char.currentPosition + direction)) {
      //   cells[char.currentPosition].classList.remove(char.className)
      //   char.currentPosition += direction
      //   cells[char.currentPosition].classList.add(char.className)
      // } else {
      //   direction = directions[Math.floor(Math.random() * directions.length)]
      // }

      function getNextMoveCoordinates(nextCell) {
        return [Math.floor(nextCell % width), nextCell / width]
      }

      if (!mazeArray.includes(char.currentPosition + direction)) {
        cells[char.currentPosition].classList.remove(char.className)
        char.currentPosition += direction

        const charCoordinates = [char.positionX(), char.positionY()]
        const charNextMoveCoordinates =  getNextMoveCoordinates(char.currentPosition + direction)
  
        const closerX = function() {
          if ((charNextMoveCoordinates[0] - char.targetCoordinates[0]) > (charCoordinates[0] - char.targetCoordinates[0])) {
            return true
          } else {
            return false
          }
        }

        const closerY = function() {
          if ((charNextMoveCoordinates[1] - char.targetCoordinates[1]) > (charCoordinates[1] - char.targetCoordinates[1])) {
            return true
          } else {
            return false
          }
        }

        if ((closerY() || closerX()) && !mazeArray.includes(char.currentPosition + direction)) {
          char.currentPosition += direction
          char.add(char.currentPosition)
        } else {
          char.add(char.currentPosition)
          direction = directions[Math.floor(Math.random() * directions.length)]
          //direction = 0
        }
        char.add(char.currentPosition)
        //char.currentPosition += direction
      } else {
        direction = directions[Math.floor(Math.random() * directions.length)]
        //direction = 0
        char.add(char.currentPosition)
        
      }
      handleGhostCollision(char.currentPosition)
      handleTeleport(char.currentPosition, char)
    }
  }
  
  const noa = {
    name: 'Noa',
    className: 'noa',
    startingPosition: ghostHomeArray[1],
    currentPosition: ghostHomeArray[1],
    speed: 300,
    targetCoordinates: [player.positionX(), player.positionY()],
    positionX: function() {
      return Math.floor(noa.currentPosition % width)
    },
    positionY: function() {
      return noa.currentPosition / width
    },
    add(position) {
      //console.log('noa added')
      cells[position].classList.add(noa.className)
    },
    remove(position) {
      //console.log('noa removed')
      cells[position].classList.remove(noa.className)
    },
    move() {
      const directions = [-1, +1, -width, +width]
      let direction = directions[Math.floor(Math.random() * directions.length)]
      
      // if (!mazeArray.includes(noa.currentPosition + direction) ) {
      //   cells[noa.currentPosition].classList.remove(noa.className)
      //   noa.currentPosition += direction
      //   cells[noa.currentPosition].classList.add(noa.className)
      // } else {
      //   direction = directions[Math.floor(Math.random() * directions.length)]
      // }

      function getNextMoveCoordinates(nextCell) {
        return [Math.floor(nextCell % width), nextCell / width]
      }

      if (!mazeArray.includes(noa.currentPosition + direction)) {
        cells[noa.currentPosition].classList.remove(noa.className)
        noa.currentPosition += direction

        const noaCoordinates = [noa.positionX(), noa.positionY()]
        const noaNextMoveCoordinates =  getNextMoveCoordinates(noa.currentPosition + direction)

        const closerX = function() {
          if ((noaNextMoveCoordinates[0] - noa.targetCoordinates[0]) > (noaCoordinates[0] - noa.targetCoordinates[0])) {
            return true
          } else {
            return false
          }
        }

        const closerY = function() {
          if ((noaNextMoveCoordinates[1] - noa.targetCoordinates[1]) > (noaCoordinates[1] - noa.targetCoordinates[1])) {
            return true
          } else {
            return false
          }
        }

        if ((closerY() || closerX()) && !mazeArray.includes(noa.currentPosition + direction)) {
          noa.currentPosition += direction
          noa.add(noa.currentPosition)
        } else {
          noa.add(noa.currentPosition)
          direction = directions[Math.floor(Math.random() * directions.length)]
          //direction = 0
        }
        noa.add(noa.currentPosition)
        //noa.currentPosition += direction
      } else {
        direction = directions[Math.floor(Math.random() * directions.length)]
        //direction = 0
        noa.add(noa.currentPosition)
        
      }

      handleGhostCollision(noa.currentPosition)
      handleTeleport(noa.currentPosition, noa)
    }
  }
  //const josCoordinates = [jos.positionX(), jos.positionY()]
  const jos = {
    name: 'Jos',
    className: 'jos',
    startingPosition: ghostHomeArray[4],
    currentPosition: ghostHomeArray[4],
    speed: 200,
    positionX: function() {
      return Math.floor(jos.currentPosition % width)
    },
    positionY: function() {
      return jos.currentPosition / width
    },
    targetCoordinates: [player.positionX(), player.positionY()],
    add(position) {
      //console.log('jos added')
      cells[position].classList.add(jos.className)
    },
    remove(position) {
      //console.log('jos removed')
      cells[position].classList.remove(jos.className)
    },
    move() {
      const directions = [-1, +1, -width, +width]
      let direction = directions[Math.floor(Math.random() * directions.length)]
      
      // if (!mazeArray.includes(jos.currentPosition + direction)) {
      //   cells[jos.currentPosition].classList.remove(jos.className)
      //   jos.currentPosition += direction
      //   cells[jos.currentPosition].classList.add(jos.className)
      // } else {
      //   direction = directions[Math.floor(Math.random() * directions.length)]
      // }

      function getNextMoveCoordinates(nextCell) {
        return [Math.floor(nextCell % width), nextCell / width]
      }

      if (!mazeArray.includes(jos.currentPosition + direction)) {
        cells[jos.currentPosition].classList.remove(jos.className)
        jos.currentPosition += direction

        const josCoordinates = [jos.positionX(), jos.positionY()]
        const josNextMoveCoordinates =  getNextMoveCoordinates(jos.currentPosition + direction)

        const closerX = function() {
          if ((josNextMoveCoordinates[0] - jos.targetCoordinates[0]) > (josCoordinates[0] - jos.targetCoordinates[0])) {
            return true
          } else {
            return false
          }
        }

        const closerY = function() {
          if ((josNextMoveCoordinates[1] - jos.targetCoordinates[1]) > (josCoordinates[1] - jos.targetCoordinates[1])) {
            return true
          } else {
            return false
          }
        }

        if ((closerY() || closerX()) && !mazeArray.includes(jos.currentPosition + direction)) {
          jos.currentPosition += direction
          jos.add(jos.currentPosition)
        } else {
          jos.add(jos.currentPosition)
          direction = directions[Math.floor(Math.random() * directions.length)]
          //direction = 0
        }
        jos.add(jos.currentPosition)
        //char.currentPosition += direction
      } else {
        direction = directions[Math.floor(Math.random() * directions.length)]
        //direction = 0
        jos.add(jos.currentPosition)
        
      }

      handleGhostCollision(jos.currentPosition)
      handleTeleport(jos.currentPosition, jos)
    }
  }

  const guy = {
    name: 'Guy',
    className: 'guy',
    startingPosition: ghostHomeArray[5],
    currentPosition: ghostHomeArray[5],
    speed: 300,
    add(position) {
      //console.log('guy added')
      cells[position].classList.add(guy.className)
    },
    remove(position) {
      //console.log('guy removed')
      cells[position].classList.remove(guy.className)
    },
    move() {
      const directions = [-1, +1, -width, +width]
      let direction = directions[Math.floor(Math.random() * directions.length)]
  
      if (!mazeArray.includes(guy.currentPosition + direction)) {
        cells[guy.currentPosition].classList.remove(guy.className)
        guy.currentPosition += direction
        cells[guy.currentPosition].classList.add(guy.className)
      } else {
        direction = directions[Math.floor(Math.random() * directions.length)]
      }

      handleGhostCollision(guy.currentPosition)
      handleTeleport(guy.currentPosition, guy)
    }
  }

  function handleGameState() {
    if (player.lives <= 0) {
      //alert('Game Over')
      // show game over page plus score, and a replay button
      player.lives = 0
      livesDisplayHeader.style.color = 'red'
      cells[char.currentPosition].classList.add('laughing')
      cells[noa.currentPosition].classList.add('laughing')
      cells[jos.currentPosition].classList.add('laughing')
      cells[guy.currentPosition].classList.add('laughing')
      clearInterval(playerMovement)
      clearInterval(charMovement)
      clearInterval(noaMovement)
      clearInterval(josMovement)
      clearInterval(guyMovement)

      // setTimeout(() => {
      //   //hide game grid and show score page, with celebration emoji have a custom reload page button to play game again
      // }, 1000)
    }

    if (pelletsLeft <= 0) {
      scoreDisplayHeader.style.color = 'green'
      cells[player.currentPosition].classList.add('celebration')
      cells[char.currentPosition].classList.add(scaredClass)
      cells[noa.currentPosition].classList.add(scaredClass)
      cells[jos.currentPosition].classList.add(scaredClass)
      cells[guy.currentPosition].classList.add(scaredClass)
      clearInterval(playerMovement)
      clearInterval(charMovement)
      clearInterval(noaMovement)
      clearInterval(josMovement)
      clearInterval(guyMovement)
      // ! if you win, reset the game and increase ghost speed, might have to store ghost speed as variable yu can then add to
    }
  }
  
  function startGame() {
    createGrid(player.startPosition) 
    introPage.style.display = 'none'
    gridWrapper.style.display = 'flex'
    soundTrack.play()

    // * Start timers
    setTimeout(() => {
      // start noise ( 3 second counter noise)
      playerMovement = setInterval(player.move, player.speed)
      charMovement = setInterval(char.move, char.speed)
      noaMovement = setInterval(noa.move, noa.speed)
      josMovement = setInterval(jos.move, jos.speed)
      guyMovement = setInterval(guy.move, guy.speed)
    }, 1000)
  }

  // * Handle Score (workaround to account for playermovement behavour related to set interval, works really well for both pellet and superpellets now)
  function handleScore() {
    const eatenPellets = document.getElementsByClassName(pelletEatenClass)
    const numberOfPelletsEaten = eatenPellets.length

    const eatenSuperPellets = document.getElementsByClassName(superPelletEatenClass)
    const numberOfSuperPelletsEaten = eatenSuperPellets.length

    const numberOfSuperGhostsEaten = ghostsEaten.length

    //console.log('pellets eaten ->', numberOfPelletsEaten)
    score = (numberOfPelletsEaten * pelletScoreValue) + (numberOfSuperPelletsEaten * superPelletScoreValue) + (numberOfSuperGhostsEaten * eatenGhostValue)
    //console.log('score', score)
    scoreDisplay.innerText = score


    pelletsLeft = ((cells.length - (mazeArray.length + ghostHomeArray.length + portalLocations.length)) - (numberOfPelletsEaten + numberOfSuperPelletsEaten)) + 1
    //console.log(pelletsLeft)
  }

  function handleKeyUp(event) {
    const key = event.keyCode

    // * player direction logic
    if (key === 39) {
      player.direction = 'right'
      //console.log('player pressed right')
    } else if (key === 37) {
      player.direction = 'left'
      //console.log('player pressed left')
    } else if (key === 38) {
      player.direction = 'up'
      //console.log('player pressed up')
    } else if (key === 40) {
      player.direction = 'down'
      //console.log('player pressed down')
    } else {
      //console.log('invalid key')
    }
  }

  // * Make Grid
  function createGrid() {
    for (let i = 0; i < cellCount; i++) {
      cell = document.createElement('div')
      //cell.textContent = i
      grid.appendChild(cell)
      cell.id = i
      cells.push(cell)
    
      addMaze(cell)
      addGhostHome(cell)
      addPortalGateway(cell)
      createPellets(cell)
      createSuperPellets(cell)
    }

    // * initiate player and ghosts here
    player.add(player.startPosition)
    char.add(char.startingPosition)
    noa.add(noa.startingPosition)
    jos.add(jos.startingPosition)
    guy.add(guy.startingPosition)
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

  function addPortalGateway(gridIndex) {
    if (portalLocations.includes(Number(gridIndex.id))) {
      gridIndex.classList.add(portalClass)
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
      //! fix superpellet bug here, need to remove location from superpellet location once player vistits it or change how i assign the sueprpellat, using classes rather than indexes.
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
        handleScaredGhosts()
        scaredGhostFx.play() 
      }
    })
  }
  // ! BUG: super pellet scared ghost triggered when empty

  function handleScaredGhosts() {
    cells[char.currentPosition].classList.remove(char.className)
    char.className = scaredClass
    cells[noa.currentPosition].classList.remove(noa.className)
    noa.className = scaredClass
    cells[jos.currentPosition].classList.remove(jos.className)
    jos.className = scaredClass
    cells[guy.currentPosition].classList.remove(guy.className)
    guy.className = scaredClass
    //game sound fex src equals right sound
    
    setTimeout(() => {
      cells[char.currentPosition].classList.remove(scaredClass)
      char.className = 'char'
      cells[noa.currentPosition].classList.remove(scaredClass)
      noa.className = 'noa'
      cells[jos.currentPosition].classList.remove(scaredClass)
      jos.className = 'jos'
      cells[guy.currentPosition].classList.remove(scaredClass)
      guy.className = 'guy'

    }, 17000)

    // if (player.currentPosition === char.currentPosition) {
    //   char.currentPosition = char.startingPosition
    // }

    // if (player.currentPosition === noa.currentPosition) {
    //   noa.currentPosition = noa.startingPosition
    // }

    // if (player.currentPosition === jos.currentPosition) {
    //   jos.currentPosition = jos.startingPosition
    // }

    // if (player.currentPosition === guy.currentPosition) {
    //   guy.currentPosition = guy.startingPosition
    // }
    //if player eats ghost while fridghtened

    // + send ghost back home
  }

  function handleGhostCollision(position) {
    // for normal collision
    if (cells[position].classList.contains(player.class) && !cells[position].classList.contains(scaredClass)) {
      player.lives --
      livesDisplay.innerText = player.lives
      player.remove(player.currentPosition)
      player.currentPosition = player.startPosition
      //game sound fex src equals right sound
      playerEatenFx.play() 
    } 
    // for scared ghosts collision
    if (cells[position].classList.contains(player.class) && cells[position].classList.contains(scaredClass)) {
      //alert('scared ghost hit')
      ghostsEaten.push('super ghost eaten')

      if (player.currentPosition === char.currentPosition) {
        char.remove(char.currentPosition)
        char.currentPosition = char.startingPosition
        //char.add(char.currentPosition)
      }

      if (player.currentPosition === noa.currentPosition) {
        noa.remove(noa.currentPosition)
        noa.currentPosition = noa.startingPosition
        //noa.add(noa.currentPosition)
      }

      if (player.currentPosition === jos.currentPosition) {
        jos.remove(jos.currentPosition)
        jos.currentPosition = jos.startingPosition
        //jos.add(jos.currentPosition)
      }

      if (player.currentPosition === guy.currentPosition) {
        guy.remove(guy.currentPosition)
        guy.currentPosition = guy.startingPosition
        //guy.add(guy.currentPosition)
      }

    }

    // ! need to send eaten ghost back home
    // have an if for each ghost?

  }

  function handleTeleport(position, object) {
    if (position === portalLocations[1]) {
      object.remove(position)
      object.currentPosition = portalLocations[0]
      //console.log('portal used')
    } else if (position === portalLocations[0]) {
      object.remove(position)
      object.currentPosition = portalLocations[1]
      //console.log('portal used')
    }
  }

  // * Event listeners
  document.addEventListener('keyup', handleKeyUp)

  startGameButton.addEventListener('click', startGame)
}

window.addEventListener('DOMContentLoaded', init)
