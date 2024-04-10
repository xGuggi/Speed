const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const socketio = require('socket.io');

const app = express();
const server = require('http').Server(app);
const io = socketio(server);

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
let usedIndexes = [];
let rando;
let playerOne = '';
let playerTwo = '';


function shuffle(event){
  
  rando = Math.floor(Math.random() * (14 - 0 + 1)) + 0;
  usedIndexes.push(rando);
  for (let i = 0; i < usedIndexes; i++)
  {
    if (usedIndexes[i] === rando)
    {
      continue;
    }
    else 
    {
      playerOneStash[rando] = event.card_id;
    }
  }
}

function Initialshuffle(event){
  
  rando = Math.floor(Math.random() * (52 - 1 + 1)) + 0;
  usedIndexes.push(rando);
  for (let i = 0; i < usedIndexes; i++)
  {
    if (usedIndexes[i] === rando)
    {
      continue;
    }
    else 
    {
      playerOneStash[rando] = event.card_id;
    }
  }
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

// Socket.IO
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);
  if (playerOne = '')
  {
    playerOne = socket.id; 
    io.emit('id', playerOne);
  }
  else 
  {
    playerTwo = socket.id;
    io.emit('id', playerTwo); 
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
  });
});