import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import io from 'socket.io-client';

const socket = io('http://localhost:5001', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
  transports: ["websocket"]
});


function App() {

  const [name, setName] = useState();

  useEffect(() => {
    socket.on('id', (id) => {
      setName(id);
      console.log(id);
    });
  }, []);

  
  // Define initial state for player's hand, central piles, and remaining cards
  const [playerHand, setPlayerHand] = useState([
    { rank: 'A', suit: '♠' },
    { rank: '2', suit: '♦' },
    { rank: 'K', suit: '♣' },
    //'♥'
    // Add more cards as needed
  ]);

  const [fullDeck, setFullDeck] = useState([
    { rank: '2', suit: '♠' },
    { rank: '3', suit: '♠' },
    { rank: '4', suit: '♠' },
    { rank: '5', suit: '♠' },
    { rank: '6', suit: '♠' },
    { rank: '7', suit: '♠' },
    { rank: '8', suit: '♠' },
    { rank: '9', suit: '♠' },
    { rank: '10', suit: '♠' },
    { rank: 'J', suit: '♠' },
    { rank: 'Q', suit: '♠' },
    { rank: 'K', suit: '♠' },
    { rank: 'A', suit: '♠' },

    { rank: '2', suit: '♦' },
    { rank: '3', suit: '♦' },
    { rank: '4', suit: '♦' },
    { rank: '5', suit: '♦' },
    { rank: '6', suit: '♦' },
    { rank: '7', suit: '♦' },
    { rank: '8', suit: '♦' },
    { rank: '9', suit: '♦' },
    { rank: '10', suit: '♦' },
    { rank: 'J', suit: '♦' },
    { rank: 'Q', suit: '♦' },
    { rank: 'K', suit: '♦' },
    { rank: 'A', suit: '♦' },

    { rank: '2', suit: '♣' },
    { rank: '3', suit: '♣' },
    { rank: '4', suit: '♣' },
    { rank: '5', suit: '♣' },
    { rank: '6', suit: '♣' },
    { rank: '7', suit: '♣' },
    { rank: '8', suit: '♣' },
    { rank: '9', suit: '♣' },
    { rank: '10', suit: '♣' },
    { rank: 'J', suit: '♣' },
    { rank: 'Q', suit: '♣' },
    { rank: 'K', suit: '♣' },
    { rank: 'A', suit: '♣' },

    { rank: '2', suit: '♥' },
    { rank: '3', suit: '♥' },
    { rank: '4', suit: '♥' },
    { rank: '5', suit: '♥' },
    { rank: '6', suit: '♥' },
    { rank: '7', suit: '♥' },
    { rank: '8', suit: '♥' },
    { rank: '9', suit: '♥' },
    { rank: '10', suit: '♥' },
    { rank: 'J', suit: '♥' },
    { rank: 'Q', suit: '♥' },
    { rank: 'K', suit: '♥' },
    { rank: 'A', suit: '♥' },
    // Add more cards as needed
  ]);


  const [centralPiles, setCentralPiles] = useState([
    [
      { rank: '5', suit: '♠' },
      { rank: '6', suit: '♠' },
      // Add more cards as needed
    ],
    [
      { rank: 'Q', suit: '♦' },
      { rank: 'K', suit: '♦' },
      // Add more cards as needed
    ],
    // Add more piles as needed
  ]);

  const [remainingCards, setRemainingCards] = useState(52 - playerHand.length - centralPiles.flat().length);

  // Function to handle playing a card
  const handlePlayCard = () => {
    // Implement logic to play a card
  };

  // Function to handle drawing a card
  const handleDrawCard = () => {
    // Implement logic to draw a card
  };

  // Function to handle declaring SPEED
  const handleDeclareSpeed = () => {
    // Implement logic to declare SPEED
  };

  return (
    <div className="app-container">
      <h1>SPEED Game</h1>
      <div className="game-container">
        <GameBoard
          playerHand={playerHand}
          centralPiles={centralPiles}
          remainingCards={remainingCards}
          onPlayCard={handlePlayCard}
          onDrawCard={handleDrawCard}
          onDeclareSpeed={handleDeclareSpeed}
        />
        {/* Other components can be added here */}
      </div>
    </div>
  );
}

export default App;
