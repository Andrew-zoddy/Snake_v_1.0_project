
//variables

const gameFieldSize = 20 * 20;
let speed = 300;
let direction;
let rnd;   
let snakeHead;
let snakeFood;
let startGame;

let inputVal = document.getElementById('players_Name');
let playerName = document.getElementById('gamer_name');


let bestScore = document.getElementById('best_player_score');
let bestPlayer = document.getElementById('best_player');

const gameScores = [];


const snakeBody = [];
const gameField = document.querySelector('#game_field');
const startPage = document.getElementById('snake_start_page');
const mainPage = document.getElementById('main_game_page');
const startBtn = document.getElementById('start_btn');
const pauseBtn = document.getElementById('pause_btn');
const resumeBtn = document.getElementById('resume_button');
const gameOverPage = document.getElementById('game_over_message');
const newGameBtn = document.getElementById('new_game_btn');

bestScore.innerHTML = localStorage.getItem('best score') // putting best value from local storage


// initilisation function
const initGameParts = () => {
    //creating game field adding id
    for (let i = 1; i <= gameFieldSize; i++) {
        const cell = document.createElement('div');
        cell.id = i;
        cell.className = 'cell';
        gameField.append(cell);  
    }
    //randomizing snake place on field
    rnd = Math.floor(Math.random() * gameFieldSize +1); 
    snakeHead = document.getElementById(rnd);
    snakeHead.classList.add('snake_head'); 
    // random food placement
    rnd = Math.floor(Math.random() * gameFieldSize +1); 
    snakeFood = document.getElementById(rnd);
    snakeFood.classList.add('snake_food');
    // creating head item in array               ??????????????????
    snakeBody.push(+snakeHead.id)
    // force direction setting
    direction = 'right';
    // sets snake direction depending on pressed key
    document.addEventListener('keydown', setDirection);

}
// setting the direction function
function setDirection (e) {

    const keyCode = e.keyCode;
   
    switch (keyCode) {
        case 37 : 
        if (direction !== 'right') direction = 'left'; //if is used for blocking backwards directions
        break;

        case 38 : 
        if (direction !== 'down') direction = 'up';
        break;

        case 39 : 
        if (direction !== 'left') direction = 'right';
        break;

        case 40 : 
        if (direction !== 'up')  direction = 'down';
        break;
        default:
            break;
    }

}

//Snake drawing function

function snakeDrawing(direction) {

    //deleting old body  -              ??????????????

    snakeBody.forEach((item, i) => {
        document.getElementById(item).classList.remove('snake_head');
        if ( i > 0 ){
            document.getElementById(item).classList.remove('snake_body');
        }
        
    })

    //defining new body by direction
    
    if (direction === 'left'){snakeBody.unshift(snakeBody[0] - 1)}
    if (direction === 'up'){snakeBody.unshift(snakeBody[0] - Math.sqrt(gameFieldSize))}
    if (direction === 'right'){snakeBody.unshift(snakeBody[0] + 1)}
    if (direction === 'down'){snakeBody.unshift(snakeBody[0] + Math.sqrt(gameFieldSize))}

    //up - down borders check
    if (snakeBody[0] <= 0 && direction !== 'left') {snakeBody[0] = snakeBody[0] + gameFieldSize} // up
    if (snakeBody[0] > gameFieldSize && direction !== 'right') {snakeBody[0] = snakeBody[0] - gameFieldSize}  // down

    // left - right borders checker

    const borders = {left : [], right : [],}
    for (let i = 0; i < Math.sqrt(gameFieldSize); i++) {
        borders.left.push(+(i * Math.sqrt(gameFieldSize) / 10 + '1'))
        borders.right.push((i + 1 ) * Math.sqrt(gameFieldSize))     
    }
// checking first cell / last cell
    if (borders.left.includes(snakeBody[0] + 1) && direction === 'left') snakeBody[0] = snakeBody[0] + Math.sqrt(gameFieldSize);
    if (borders.right.includes(snakeBody[0] - 1) && direction === 'right') snakeBody[0] = snakeBody[0] - Math.sqrt(gameFieldSize);

    // killing last id for moving effect

    snakeBody.pop()

    // eating self - Game over event

    if(snakeBody.includes(snakeBody[0], 1)) {
        clearInterval(startGame)
        mainPage.style.display = 'none';
        startPage.style.display = 'none';
        gameOverPage.style.display = 'block'
       
    } 
  

    // Eating food
    if (snakeBody[0] === +snakeFood.id) {

        snakeFood.classList.remove('snake_food')
        snakeBody.unshift(+snakeFood.id)     
        rnd = Math.floor(Math.random() * gameFieldSize +1);  
        snakeFood = document.getElementById(rnd);
        snakeFood.classList.add('snake_food');
        
    }

    //        adding score
       
    const gameScore = snakeBody.length-1;
    const playerScore = document.getElementById('player_score')
    playerScore.innerHTML = `Score : ${gameScore}`;

    // adding best score

    
    if (gameScore > +localStorage.getItem('best score')) {
        bestScore.innerHTML = gameScore
        bestPlayer.innerHTML = playerName.innerHTML
        localStorage.setItem('best score', bestScore.innerHTML)
    }
    

    // creationg new body
     
    snakeBody.forEach((item, i) => {
        document.getElementById(item).classList.add('snake_head')
        if ( i > 0 ){
            document.getElementById(item).classList.add('snake_body');
        }
    });
}

// Start, game button, start page, listener on clicking button 

initGameParts()  // initilising game

//adding players name from input function
function getPlayerName (){
    let inputVal = document.getElementById('players_Name').value;
    let playerName = document.getElementById('gamer_name');
    playerName.innerHTML = inputVal
}

// transfering to game field on click  and starting game 
startBtn.addEventListener('click', ()=>{
    
    // enter name before start 
    if(inputVal.value){
    mainPage.style.display = 'flex';
    startPage.style.display = 'none';
    startGame = setInterval(()=>{
        snakeDrawing(direction)
    }, speed);
    getPlayerName()
    document.querySelector('.footer').style.visibility = 'visible';
    }else{
        alert('Enter your name please!')
    }
    
})
//pause button
pauseBtn.addEventListener('click', ()=> {
    clearInterval(startGame)
    pauseBtn.classList.add('pause_btn_active')
    resumeBtn.style.visibility = 'visible'
    pauseBtn.style.visibility = 'hidden'
    
})
//resume button
resumeBtn.addEventListener('click',()=>{
    startGame = setInterval(()=>{
        snakeDrawing(direction)
    }, speed)
    pauseBtn.classList.remove('pause_btn_active')
    resumeBtn.style.visibility = 'hidden'
    pauseBtn.style.visibility = 'visible'
} )


// new game button
newGameBtn.addEventListener('click', ()=>{
    gameOverPage.style.display = 'none';
    startPage.style.display = 'flex';
    document.querySelector('.footer').style.visibility = 'hidden';
    document.location.reload(true)
    
})

//================================================



