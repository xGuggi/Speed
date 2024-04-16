const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const socketio = require('socket.io');

const app = express();
const server = require('http').Server(app);
const io = socketio(server, {
  autoConnect: false
});

dotenv.config();
const port = process.env.PORT || 5001;
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
  console.log("-----------StaleMate Shuffled------------");
  console.log(staleMateShuffled);
}

function playerOneDeck(event) {
  playerOneStash = [];
  for (let i = 0; i < 20; i++)
  {
    playerOneStash[i] = event[i];
  }
  console.log("------PlayerOneStash--------");
  console.log(playerOneStash);
}

function playerTwoDeck(event) {
  playerOneStash = [];
  let z = 0;
  for (let i = 20; i < 40; i++)
  {
    if (i > 19)
    {
      playerTwoStash[z] = event[i];
      z++;
    }
  }
  console.log("----------PlayerTwoStash---------");
  console.log(playerTwoStash);
}

function leftCards(event) {
  leftDeck = [];
  let z = 0;
  for (let i = 40; i < 46; i++)
  {
    if (i > 39)
    {
      leftDeck[z] = event[i];
      z++;
    }
  }
  console.log("--------LeftDeck---------");
  console.log(leftDeck);
}

function rightCards(event) {
  leftDeck = [];
  let z = 0; 
  for (let i = 46; i < 52; i++)
  {
    if (i > 45) 
    {
      rightDeck[z] = event[i];
      z++;
    }
  }
  console.log("-----------RightDeck---------");
  console.log(rightDeck);
}
// Middleware
app.use(cors());
app.use(express.json());

// API Routes
// const messagesRouter = require('./routes/messages');
// app.use('/messages', messagesRouter);
app.get('/', (req, res) => {
    res.send('hello world')
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


io.on('connection', (socket) =>{
socket.on('gameState', (fullDeck) =>{
  console.log(fullDeck);
  Initialshuffle(fullDeck);
  playerOneDeck(shuffledArray);
  playerTwoDeck(shuffledArray);
  leftCards(shuffledArray);
  rightCards(shuffledArray);
  console.log(shuffledArray);
  //let test = parseInt(shuffledArray[4].rank);
  //console.log(test);
  //console.log(test + 1);
  socket.emit('cards', shuffledArray);
  
});
});

io.on('connection', (socket) => {
  socket.on('staleMate', (staleMateCards) => {
    console.log(staleMateCards);
    stalemateShuffle(staleMateCards);

    // Send shuffled cards to frontend

    //leftCards(staleMateCards);
    //rightCards(staleMateCards);
    console.log(staleMateCards);
    socket.emit('receiveStalemate', staleMateCards);
  })
})



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
    console.log(message);
    io.emit('message', message);
  });
//   socket.on('differentMessage', (message) => {
//     io.emit('differentResponse', 'Whats up');
//   });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
    playerOne = '';
    playerTwo = '';
  });
});