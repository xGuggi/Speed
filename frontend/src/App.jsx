import React, { useState } from 'react';
import GameBoard from './components/CardPile';

function App() {
  // Example initial state for player's hand, central piles, and remaining cards
  const [playerHand, setPlayerHand] = useState(['A', '2', '3', '4', '5']);
  const [centralPiles, setCentralPiles] = useState([
    ['6', '7', '8'],
    ['9', '10', 'J'],
  ]);
  const [remainingCards, setRemainingCards] = useState(42);

  return (
    <div className="app-container">
      <h1>SPEED Game</h1>
      <div className="game-container">
        <GameBoard
          playerHand={playerHand}
          centralPiles={centralPiles}
          remainingCards={remainingCards}
        />
        {/* Other components can be added here */}
      </div>
    </div>
  );
}

export default App;
