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

 if(!playerTurn)
   runAI();
}

//Función para determinar si el tablero está en estado terminal
function gameEnded(p_turn){
 var char = '';
 if (p_turn) {
   char = 'X';
 }
 else {
   char = 'O';
 }
 return (tablero[0][0]==char&&tablero[0][1]==char&&tablero[0][2]==char) ||
         (tablero[1][0]==char&&tablero[1][1]==char&&tablero[1][2]==char) ||
         (tablero[2][0]==char&&tablero[2][1]==char&&tablero[2][2]==char )||
         (tablero[0][0]==char&&tablero[1][0]==char&&tablero[2][0]==char) ||
         (tablero[0][1]==char&&tablero[1][1]==char&&tablero[2][1]==char) ||
         (tablero[0][2]==char&&tablero[1][2]==char&&tablero[2][2]==char) ||
         (tablero[0][0]==char&&tablero[1][1]==char&&tablero[2][2]==char) ||
         (tablero[0][2]==char&&tablero[1][1]==char&&tablero[2][0]==char);
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
  if(playerTurn&&!gameEnd){
    var rowIndex = x.parentNode.rowIndex;
    var cellIndex = x.cellIndex;

    var table = getTds();
    table[rowIndex][cellIndex].innerHTML = 'X';
    tablero[rowIndex][cellIndex] = 'X';

    console.log(tablero);
    playerTurn = false;
    setTurnText(playerTurn);

    gameEnd = gameEnded(!playerTurn);
    if(gameEnd){
      setWinText(!playerTurn);
    }

    runAI();
  }
}

//Fución principal de la IA
function runAI(){
  if(!gameEnd){
    var done = false;
    for (var i = 0; i < tablero.length; i++) {
      for (var j = 0; j < tablero[i].length; j++) {
        if(tablero[i][j]=='-'&&!done){
          var table = getTds();
          table[i][j].innerHTML = 'O';
          tablero[i][j] = 'O';
          done = true;
        }
      }
    }

    playerTurn=true;
    gameEnd = gameEnded(!playerTurn);
    if(gameEnd){
      setWinText(!playerTurn);
    }
  }
}
