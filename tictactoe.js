var origBoard; //an array that keeps track of what's in each square: X, O or nothing
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [  //array thats gonna show winning combinations
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]; 

const cells = document.querySelectorAll('.cell'); 
startGame(); // calling function to start the game


//defining the function to start the game (it will also run when clicking on the "Replay" button)
function startGame() {  document.querySelector(".endgame").style.display = "none"
 origBoard = Array.from(Array(9).keys()) //make the array every number from 0-9
 for (var i=0; i< cells.length; i++) {
  cells[i].innerText = '';     
  cells[i].style.removeProperty('background-color'); 
  cells[i].addEventListener('click', turnClick, false); 
    }
} 


//defining turnClick function
function turnClick (square) {
  if (typeof origBoard[square.target.id] === 'number') 
    turn(square.target.id, humanPlayer) //human player taking a turn
    if (!checkTie()) turn(bestSpot(), aiPlayer); //checking if there's a tie, if not, then the Ai Player will take a turn
    }   



//defining turn function
function turn(squareId, player) {
  origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player; // updating the display so we can see where player clicked
 let gameWon = checkWin(origBoard, player)
 if (gameWon) gameOver(gameWon) // whenever the turn has been taken we're going to check if the game has been won
} 


// defining checkWin function
function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => 
  (e === player) ? a.concat(i) : a, []); //finding every index that the player has played
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) { //checking if the game has been won by looping through every winCombos
    if (win.every(elem => plays.indexOf(elem) > -1)) { //has the player played in every spot that counts as a win for that win
      gameWon = {index: index, player: player};  //which win combo the player won at & which player had won
      break;
    } 
} 
return gameWon;
} 


//defining gameOver function
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) { //going through every index of the WinCombos
    document.getElementById(index).style.backgroundColor = 
    gameWon.player === humanPlayer ? "#4da6ff" : "#ff0000"; //if the human won-set background color to blue, if AI won-set background color to red
}
  for (var i= 0; i < cells.length; i++ ) { 
    cells[i].removeEventListener('click', turnClick, false);
}
  declareWinner(gameWon.player === humanPlayer ? "Arlight You win!" : "haha you looser"); //if human Player won show "Alright You win!", otherwise show "haha you looser."
} 


//defining declareWinner function
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

//defining emptySuares function
function emptySquares() {
    return origBoard.filter(s => typeof s === 'number'); //filter every element in the origBoard to see if the type of element equals number. If yes, we are gonna return it (all the squares that are numbers are empty, the squares with X and O are not empty)
}


//defining bestSpot function
function bestSpot() {
    return minimax(origBoard, aiPlayer).index; //will always play in the first empty squre
}


//defining checkTie function
function checkTie() {
    if (emptySquares().length === 0) { 
        for (var i = 0; i < cells.length; i++) { 
            cells[i].style.backgroundColor = "#66ff66"; //setting the background color to green
            cells[i].removeEventListener('click', turnClick, false); //making sure user cannot click anywhere as the game is over
        }
        declareWinner("Tie Game!")
        return true; //returning true as it's a tie
    }
    return false;
}


//defining minimax function
function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard); 

    if(checkWin(newBoard, player)) { //checking who wins
        return {score: -10}; //if O wins we return -10
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10} // if X wins we return 10
    } else if (availSpots.length === 0) {
        return {score: 0} //tie, we return 0
    }
    var moves = []; //collect the scores from each of the empty spots to evaluate them later
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]]; 
        newBoard[availSpots[i]] = player; 

        if (player === aiPlayer) { 
            var result = minimax(newBoard, humanPlayer);
            move.score = result.score; 
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score; 
        }

        newBoard[availSpots[i]] = move.index; 
        
        moves.push(move);
        }

        var bestMove; 
        if(player === aiPlayer) {  //choosing the highest score when AI is playing and the lowest score when the human is playing            
            var bestScore = -10000; 
            for (var i = 0; i < moves.length; i++) { 
                if (moves[i].score > bestScore) { 
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else { 
            var bestScore = 10000;
            for(var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) { 
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove]; //returning object stored in bestMove
    }

// pizza loader code 

var loader;

function loadNow(opacity){
    if(opacity <=0){
        displayContent();
    }
    else{
        loader.style.opacity=opacity;
        window.setTimeout(function(){
            loadNow(opacity-0.05)
        },100);
    }
}

function displayContent(){
    loader.style.display='none';
    document.getElementById('content').style.display='block';
}

document.addEventListener("DOMContentLoaded", function(){
    loader=document.getElementById('loader');
    loadNow(1);
});
