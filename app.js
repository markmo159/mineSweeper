// Easy (9x9 -10), Medium (16x16 -40), Expert (30x16 -99)


if (!localStorage.getItem('playerName')) {
  let playerName = prompt("Please enter your name");
  while (!playerName) {
    playerName = prompt("Please enter your name")
  };
  localStorage.setItem('playerName',playerName)
}

const player = document.getElementById('playername');
const board = document.getElementById('board');
const timer = document.getElementById('timer');
const easyBetter = document.getElementById('easyscore');
const mediumBetter = document.getElementById('mediumscore');
const hardBetter = document.getElementById('hardscore');

player.innerText = `Welcome ${localStorage.getItem('playerName')}`;

localStorage.getItem('easyscore') ? easyBetter.innerText = `Your easy level high score : ${localStorage.getItem('easyscore')}` : easyBetter.innerText = 'Your easy level high score : none';
localStorage.getItem('mediumscore') ? mediumBetter.innerText = `Your medium level high score : ${localStorage.getItem('mediumscore')}` : mediumBetter.innerText = 'Your medium level high score : none';
localStorage.getItem('hardscore') ? hardBetter.innerText = `Your hard level high score : ${localStorage.getItem('hardscore')}` : hardBetter.innerText = 'Your hard level high score : none';


// buttons
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');

easyButton.addEventListener('click', function () {
  if(board.firstChild) {
    while (board.firstChild) {
      board.removeChild(board.firstChild)
    }
  }
  board.style.gridTemplateColumns = 'repeat(9, 40px)';
    board.style.gridTemplateRows = 'repeat(9, 40px)';
    let rows = 9;
    let collons = 9;
    let howManyBombs = 10;
    let gameLevel = 'easyscore';
    start (rows,collons,howManyBombs,gameLevel);
});
mediumButton.addEventListener('click', function () {
  if(board.firstChild) {
    while (board.firstChild) {
      board.removeChild(board.firstChild)
    }
  }
    board.style.gridTemplateColumns = 'repeat(16, 40px)';
    board.style.gridTemplateRows = 'repeat(16, 40px)';
    let rows = 16;
    let collons = 16;
    let howManyBombs = 40;
    let gameLevel = 'mediumscore';
    start (rows,collons,howManyBombs);
});
hardButton.addEventListener('click', function () {
  if(board.firstChild) {
    while (board.firstChild) {
      board.removeChild(board.firstChild)
    }
  }
    board.style.gridTemplateColumns = 'repeat(30, 40px)';
    board.style.gridTemplateRows = 'repeat(16, 40px)';
    let rows = 16;
    let collons = 30;
    let howManyBombs = 99;
    let gameLevel = 'hardscore';
    start (rows,collons,howManyBombs);
});


// 1. building new board
function newBoard (rows,collons) {
  let count = 1;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < collons; col++) {
      boardBuild(count);
      count += 1;
    }
  }
}

// 1.1.adding a div to grid block
function boardBuild (num) {
  const newDiv = document.createElement('div');
  newDiv.setAttribute ('id',`brick${num}`);
  newDiv.setAttribute ('class','brick covered');
  board.append(newDiv);
}

// 2. generating bombs randomaly to the board
function bomb (howManyBombs,rows,collons) {
  let bombLocation = [];
  for (let bombNumber = 0; bombNumber < howManyBombs; bombNumber++) {
    let blockNum = bombGenerator(rows*collons);
    while (bombLocation.includes(blockNum)) {
      blockNum = bombGenerator(rows*collons);
    };
    bombLocation.push(blockNum);
    document.getElementById(`brick${blockNum}`).innerText = 'B';
  }
  return bombLocation.sort();
}


// 2.1. random bomb
function bombGenerator (boardSize) {
  return Math.floor(Math.random()*boardSize) + 1;
}

// 3. numbers around bomb
function numbersAroundBomb(bombLocation,collons,rows) {
  for (let location of bombLocation) {
    // top left -9-1
    if (!(location % collons === 1) && !(location > 0 && location < collons + 1)) {
      implementingNumbers (location,-collons-1)
    }
    // top -9
    if (!(location > 0 && location < collons + 1)){
      implementingNumbers (location,-collons)
    }
    // top right -9+1
    if (!(location % collons === 0) && !(location > 0 && location < collons + 1)){
      implementingNumbers (location,-collons+1)
    }
    // left -1
    if (!(location % collons === 1)) {
      implementingNumbers (location,-1)
    }
    // right +1
    if (!(location % collons === 0)){
      implementingNumbers (location,1)
    }
    // bottom left +9-1
    if (!(location % collons === 1) && !(location > collons*rows-collons && location < collons*rows)) {
      implementingNumbers (location,collons-1)
    }
    // bottom +9
    if ( !(location > collons*rows-collons && location < collons*rows)){
      implementingNumbers (location,collons)
    }
    // bottom right +9+1
    if (!(location % collons === 0) && !(location > collons*rows-collons && location < collons*rows)){
      implementingNumbers (location,collons+1)
    }
  }
}

// 3.1. numbers around bomb
function implementingNumbers (location, movement ) {
  const positionAroundBomb = document.getElementById(`brick${location + movement}`)
  if (positionAroundBomb){
    if (!positionAroundBomb.innerText){
      positionAroundBomb.innerText = '1'
    }
    else if (positionAroundBomb.innerText!=='B'){
      positionAroundBomb.innerText = `${parseInt(positionAroundBomb.innerText) + 1}`
    }
  }
}

// 4. revealing bricks around
function revealAround (location, uncovered,collons,rows) {
  // top left -9-1
  if (!(location % collons === 1) && !(location > 0 && location < collons + 1)) {
    uncovered = reveal (location, -collons-1, uncovered,collons,rows)
  }
  // top -9
  if (!(location > 0 && location < collons + 1)){
    uncovered = reveal (location, -collons, uncovered,collons,rows)
  }
  // top right -9+1
  if (!(location % collons === 0) && !(location > 0 && location < collons + 1)){
    uncovered = reveal (location, -collons+1, uncovered,collons,rows)
  }
  // left -1
  if (!(location % collons === 1)) {
    uncovered = reveal (location, -1, uncovered,collons,rows)
  }
  // right +1
  if (!(location % collons === 0)){
    uncovered = reveal (location, 1, uncovered,collons,rows)
  }
  // bottom left +9-1
  if (!(location % collons === 1) && !(location > collons*rows-collons && location < collons*rows)) {
    uncovered = reveal (location, collons-1, uncovered,collons,rows)
  }
  // bottom +9
  if ( !(location > collons*rows-collons && location < collons*rows)){
    uncovered = reveal (location, collons, uncovered,collons,rows)
  }
  // bottom right +9+1
  if (!(location % collons === 0) && !(location > collons*rows-collons && location < collons*rows)){
    uncovered = reveal (location, collons+1, uncovered,collons,rows)
  }
  return uncovered;
 }

// 4.1. revealing a brick
function reveal (location, movement, uncovered,collons,rows) {
  const selectedBrick = document.getElementById(`brick${location + movement}`);
  if (selectedBrick && selectedBrick.className.includes('covered')) {
    if (selectedBrick.className.includes("flag")) {
      selectedBrick.classList.remove("flag");
    }
    if(selectedBrick.innerText) {
      selectedBrick.classList.remove("covered");
      uncovered += 1
    } else {
      selectedBrick.classList.remove("covered");
      uncovered += 1
      uncovered = revealAround(location + movement, uncovered,collons,rows)
    }
  }
  return uncovered;
}

// 5. start playing
function startClicking(runnigTime, bombLoction,collons,rows,howManyBombs,gameLevel) {
  flagedNums = [];
  const bricks = document.getElementsByClassName("brick");
  let uncovered = 0;
  for (let brick of bricks) {
    brick.addEventListener('click', function() {
      if (!runnigTime){
        runnigTime = setInterval(gameTimer,1000)
      };
      if (!brick.className.includes('flag')){
        if (brick.className.includes('covered') && brick.innerText !== 'B') {
          brick.classList.remove('covered');
          uncovered += 1;
          if (uncovered === collons*rows-howManyBombs) {
            clearInterval(runnigTime);
            const score = timer.innerText;
            setTimeout(function(){alert('You won')}, 10);
            setTimeout(function(){winner(score,gameLevel)}, 1000);
          }
        }
        // empty brick
        if (!brick.innerText) {
          uncovered = revealAround(parseInt(brick.id.slice(5)), uncovered,collons,rows);
          if (uncovered === collons*rows-howManyBombs) {
            clearInterval(runnigTime);
            const score = timer.innerText;
            setTimeout(function(){alert('You won')}, 10);
            setTimeout(function(){winner(score,gameLevel)}, 1000);
          }
        };
        // bomb
        if (brick.innerText === 'B') {
          clearInterval(runnigTime);
          for (let eachBomb of bombLoction) {
            document.getElementById(`brick${eachBomb}`).classList.remove("covered")
            if (eachBomb === bombLoction[howManyBombs-1]) {
              setTimeout(function(){alert('Game Over')}, 10);
              setTimeout(function(){gameOver()}, 1000);
            }
          }
        };
      }
    });
    brick.addEventListener('contextmenu', function(e) {
      if (!runnigTime){
        runnigTime = setInterval(gameTimer,1000)
      };
      e.preventDefault();
      if (brick.className.includes('covered')){
        if (brick.className.includes("flag")) {
          brick.classList.remove("flag") && flagedNums.slice(brick.id.slice(5))
        } else {
          flagedNums.push(parseInt(brick.id.slice(5)));
          brick.classList.add("flag");
          if (flagedNums.length === howManyBombs) {
            flagedNums.sort();
            if (JSON.stringify(flagedNums) === JSON.stringify(bombLoction)) {
              clearInterval(runnigTime);
              const score = timer.innerText;
              setTimeout(function(){alert('You won')}, 10);
              setTimeout(function(){winner(score,gameLevel)}, 1000);
            }
          }
        }
      }
    });
  }
}


// 5.1 timer setup
function gameTimer () {
  timer.innerText = `${parseInt(timer.innerText)+1}`
}


function start (rows,collons,howManyBombs,gameLevel) {
  let runnigTime;
  newBoard(rows,collons);
  const bombLoction = bomb(howManyBombs,rows,collons);
  numbersAroundBomb(bombLoction,collons,rows);
  startClicking(runnigTime,bombLoction,collons,rows,howManyBombs,gameLevel)
}

function gameOver () {
  // remove
  timer.innerText = '0';
  while (board.firstChild) {
    board.removeChild(board.firstChild)
  }
  // runnigTime = null;
  // newBoard(rows,collons);
  // const bombLoction = bomb(howManyBombs,rows,collons);
  // numbersAroundBomb(bombLoction,collons,rows);
  // startClicking(runnigTime,bombLoction,collons,rows,howManyBombs)
}

//sahar
function winner (score,gameLevel) {
  if (!localStorage.getItem(gameLevel) || localStorage.getItem(gameLevel) > score) {
    console.log('jkhkn')
    localStorage.setItem(gameLevel,score);
    document.getElementById(gameLevel) = `Your easy level high score : ${score}`
  }
  gameOver()
  // runnigTime = null;
  
}
