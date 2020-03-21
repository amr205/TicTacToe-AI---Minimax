//inicializando valores
var playerTurn = true;
var gameEnd = false
var tablero = [['-','-','-'],
               ['-','-','-'],
               ['-','-','-']];

//Función para reiniciar el tablero, usada por los dos botones del html
function restart(playerStart){
 var t = document.getElementById("tablero");
 var trs = t.getElementsByTagName("tr");
 var tds = new Array(trs.length);

 for (var i=0; i<trs.length; i++)
 {
     tds[i] = trs[i].getElementsByTagName("td");
     for (var j = 0; j < tds[i].length; j++) {
       tds[i][j].innerHTML = '&nbsp;';
     }
 }
 tablero = [['-','-','-'],
            ['-','-','-'],
            ['-','-','-']];

 playerTurn=playerStart;
 gameEnd=false;
 setTurnText(playerTurn);
 if(!playerTurn){
   let y = Math.floor(Math.random() * 3);
   let x = Math.floor(Math.random() * 3);

   var table = getTds();
   table[y][x].innerHTML = 'O';
   tablero[y][x] = 'O';

   playerTurn=true;
   setTurnText(playerTurn);
 }
}

//Función para determinar si el tablero está en estado terminal
function gameEnded(board,p_turn){
 var char = '';
 if (p_turn) {
   char = 'X';
 }
 else {
   char = 'O';
 }
 return (board[0][0]==char&&board[0][1]==char&&board[0][2]==char) ||
         (board[1][0]==char&&board[1][1]==char&&board[1][2]==char) ||
         (board[2][0]==char&&board[2][1]==char&&board[2][2]==char )||
         (board[0][0]==char&&board[1][0]==char&&board[2][0]==char) ||
         (board[0][1]==char&&board[1][1]==char&&board[2][1]==char) ||
         (board[0][2]==char&&board[1][2]==char&&board[2][2]==char) ||
         (board[0][0]==char&&board[1][1]==char&&board[2][2]==char) ||
         (board[0][2]==char&&board[1][1]==char&&board[2][0]==char);
}

//Función para indicar el turno
function setTurnText(playerTurn){
  var t = document.getElementById("turn");
  if(playerTurn)
    t.innerHTML = 'Current turn: You';
  else
    t.innerHTML = 'Current turn: AI';
}

//Función para mostrar el texto de que el juego termino
function setWinText(playerTurn){
  var t = document.getElementById("turn");
  if(!playerTurn)
    t.innerHTML = 'AI Won';
  else
    t.innerHTML = 'You Won';
}

//Función para obtener los elementos td del DOM
function getTds(){
  var t = document.getElementById("tablero");
  var trs = t.getElementsByTagName("tr");
  var tds = new Array(trs.length);

  for (var i=0; i<trs.length; i++)
  {
      tds[i] = trs[i].getElementsByTagName("td");
  }
  return tds;
}

//Función para el turno del jugador
function tdClick(x){
  if(playerTurn&&!gameEnd&&getAvailableIndexes(tablero).length>0){
    var rowIndex = x.parentNode.rowIndex;
    var cellIndex = x.cellIndex;

    if(tablero[rowIndex][cellIndex]=='-'){
      var table = getTds();
      table[rowIndex][cellIndex].innerHTML = 'X';
      tablero[rowIndex][cellIndex] = 'X';

      playerTurn = false;
      setTurnText(playerTurn);

      gameEnd = gameEnded(tablero,!playerTurn);
      if(gameEnd){
        setWinText(!playerTurn);
      }
      else if(getAvailableIndexes(tablero).length==0){
        var t = document.getElementById("turn");
        t.innerHTML='Tie!';
      }
      console.log("----PLAYER MOVE---");
      console.log(tablero);


      runAI();
    }

  }
}

//Fución principal de la IA
function runAI(){
  if(!gameEnd&&getAvailableIndexes(tablero).length>0){
    deep=0;
    var move = minimax(tablero,true);
    let y = move.indexes.y;
    let x = move.indexes.x;

    var table = getTds();
    table[y][x].innerHTML = 'O';
    tablero[y][x] = 'O';

    console.log("----AI MOVE---");
    console.log(tablero);

    playerTurn=true;
    setTurnText(playerTurn);
    gameEnd = gameEnded(tablero,false);
    if(gameEnd){
      setWinText(!playerTurn);
    }
    else if(getAvailableIndexes(tablero).length==0){
      var t = document.getElementById("turn");
      t.innerHTML='Tie!';
    }
  }
}

//minimax function
function minimax(board, lastMovePlayer){
  //get available spots
  var availSpots = getAvailableIndexes(board);

  //evaluate terminal states
  if(gameEnded(board,true))
    return {score: -10};
  else if(gameEnded(board,false))
    return {score: 10};
  else if(availSpots.length==0)
    return {score: 0};

  //evaluate posible moves
  var moves = new Array();
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    let y = availSpots[i].y;
    let x = availSpots[i].x;
    if(lastMovePlayer)
      board[y][x]='O';
    else
      board[y][x]='X';

    move.indexes = availSpots[i];
    move.score = minimax(board, !lastMovePlayer).score;

    board[y][x]='-';
    moves.push(move);
  }

  //chose best move acording to MAX or MIN
  if (lastMovePlayer)
    best=-100;
  else
    best=100;

  var bestMove = moves[i];
  for (var i = 0; i < moves.length; i++) {
    if (lastMovePlayer) {
      if(moves[i].score>best){
        best=moves[i].score;
        bestMove=moves[i];
      }
    }
    else{
      if(moves[i].score<best){
        best=moves[i].score;
        bestMove=moves[i];
      }
    }
  }

  return bestMove;

}

function getAvailableIndexes(board){
  var available = new Array();

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
        if(board[i][j]=='-'){
          var indexes = {};
          indexes.y = i;
          indexes.x = j;

          available.push(indexes);
        }
    }
  }
  return available;
}
