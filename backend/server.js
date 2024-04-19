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
const io = socketio(server, {
  autoConnect: false
}); //old

dotenv.config(); //old
const port = process.env.PORT || 5001; //was 5001 
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
// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


io.on('connection', (socket) =>{
socket.on('gameState', (fullDeck) =>{
  console.log(fullDeck);
  Initialshuffle(fullDeck);
  console.log(shuffledArray);
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



app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
   });
  console.log(`Server is running on port: ${port}`);
});

app.use(require("./routes/speed"));