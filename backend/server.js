const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const socketio = require('socket.io');

const app = express();
const server = require('http').Server(app);
const io = socketio(server);

dotenv.config();
const port = process.env.PORT || 5001;

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

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });
//   socket.on('differentMessage', (message) => {
//     io.emit('differentResponse', 'Whats up');
//   });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});