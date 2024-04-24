const express = require('express'); //old
const app = express(); //old

const cors = require('cors'); //old


require("dotenv").config({ path: "./config.env" });
app.use(cors({origin: 'http://localhost:5173', credentials: true, }));
app.use(express.json());

const dbo = require("./db/conn");



const dotenv = require('dotenv'); //old
const socketio = require('socket.io'); //old

const server = require('http').Server(app); //old
const io = socketio(server, { //this was server
  autoConnect: false
}); //old

dotenv.config(); //old
const port = process.env.PORT || 5001; 
const portTwo =  5002; 
let playerOneStash = [];
let playerTwoStash = [];
let playerOneHand = [];
let playerTwoHand = [];
let leftDeck = [];
let rightDeck = [];
let leftDisregard = [];
let rightDisregard = [];
let playerOne = '';
let playerTwo = '';
let shuffledArray = [];
let staleMateShuffled = [];
let usedIndexes = [];


function Initialshuffle(event){
  shuffledArray = [];
  usedIndexes = [];
  let i = 0; 
  while (i < event.length) {
      let rando = Math.floor(Math.random() * event.length);
      if (!usedIndexes.includes(rando))
      {
        shuffledArray.push(event[rando]);
        usedIndexes.push(rando);
        i++;
      }
  }
  return shuffledArray;  
}

function stalemateShuffle(event){
  arrayToShuffle = event;
  staleMateShuffled = Initialshuffle(arrayToShuffle);
  //console.log("-----------StaleMate Shuffled------------");
  //console.log(staleMateShuffled);
}


// Middleware
app.use(cors());
app.use(express.json());

// API Routes
 //const messagesRouter = require('./routes/messages'); //changeing
 //app.use('/messages', messagesRouter); //changeing
app.get('/', (req, res) => {
    res.send('hello world')
});

//Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

io.on('connection', (socket) => {
  socket.on('test', (deck) => {
    console.log('Deck');
    console.log(deck);
    io.emit('test', deck);
  })
});

io.on('connection', (socket) => {
  socket.on('initialState', (fullDeck, player1Hand, player2Hand, leftPile, rightPile) => {
    io.emit('initialState', fullDeck, player1Hand, player2Hand, leftPile, rightPile);
  });
});


io.on('connection', (socket) =>{
  socket.on('gameState', (fullDeck) =>{
  //console.log(fullDeck);
  Initialshuffle(fullDeck);
  //console.log(shuffledArray);
  io.emit('cards', shuffledArray);
});
});


io.on('connection', (socket) =>{
  socket.on('updateGame', (leftPile, rightPile, player1Hand, player2Hand, p1DrawPileSize, p2DrawPileSize) =>{
  
    //console.log('inside new cards connection');
    console.log(leftPile + " " + rightPile);
  io.emit('newCards', player1Hand, player2Hand, leftPile, rightPile, p1DrawPileSize, p2DrawPileSize);
});

io.sockets.on('connection', function (socket) {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
});

socket.on('updateHands', (player1Hand, player2Hand) => {
  console.log("inside updatehands socket" + player1Hand);
  //console.log(windows.location.host);
  io.emit('newHands', player1Hand, player2Hand);
})
});

io.on('connection', (socket) => {
  socket.on('staleMate', (staleMateCards) => {
    //console.log(staleMateCards);
    stalemateShuffle(staleMateCards);

    // Send shuffled cards to frontend

    //leftCards(staleMateCards);
    //rightCards(staleMateCards);
    //console.log(staleMateCards);
    socket.emit('receiveStalemate', staleMateCards);
  })
})




io.on('connection', (socket) => {
  socket.on('gameWinCollect', async (cardSend, loser) => {

    const newUser = await fetch("http://localhost:5001/gather", {
           credentials: "include",
           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify({cards: cardSend, loser: loser}),
       });   
  const data = await response.json();

    //io.emit('resData', data);
  })
});




io.on('connection', (socket) => {
  socket.on('gameWin', async (userName) => {

    const newUser = await fetch("http://localhost:5001/setScore", {
      credentials: "include",
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({userName: userName}),
  });
  const data = await response.json();

    io.emit('dataRes', data);
  })
});

io.on('connection', (socket) => {
  socket.on('historyRes', async () => {

    const historyResponse = await fetch("http://localhost:5001/prev", { method: 'GET', credentials: 'include'});
    const data = await historyResponse.json();

    io.emit('hisRes', data);
  })
});



// Socket.IO
io.on('connection', (socket) => {

  console.log(`Socket ${socket.id} connected`);

  if (playerOne === '')
  {
    playerOne = 'playerOne'; //setting player one
    io.to(socket.id).emit('id', playerOne); 
  }
  else 
  {
    playerTwo = 'playerTwo'; //setting player two
    io.to(socket.id).emit('id', playerTwo); 
  }
  socket.on('sendMessage', (message) => {
    //console.log(message);
    io.emit('message', message);
  });

  // socket.on('updateGameState', (leftPile, rightPile, player1Hand, player2Hand) => {
  //   socket.emit(leftPile, rightPile, player1Hand, player2Hand);
  // });

//   socket.on('differentMessage', (message) => {
//     io.emit('differentResponse', 'Whats up');
//   });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
    playerOne = '';
    playerTwo = '';
  });
});



app.listen(portTwo, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
   });
  console.log(`Server is running on port: ${portTwo}`);
});


app.use(require("./routes/speed"));

