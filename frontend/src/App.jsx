import React, { useState, useEffect } from 'react';
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

  let leftDisregard = [];
  let rightDisregard = [];
  let playerOneStash = [];
  let playerTwoStash = [];
  let playerOneHand = [];
  let playerTwoHand = [];
  let leftDeck = [];
  let rightDeck = [];
  ///////////////////logic////////////////////////
  function checkIfNone(event) {
    let playerOneRank;
    let playerTwoRank;
    for (let i = 0; i < playerOneHand.length; i++)
    {
      if (playerOneHand[i].rank === 'A' || playerOneHand[i].rank === 'K' || playerOneHand[i].rank === 'Q' || playerOneHand[i].rank === 'J')
      {
        if (playerOneHand[i].rank === 'A')
        {
          playerOneRank = 14;
        }
        else if (playerOneHand[i].rank === 'K')
        {
          playerOneRank = 13;
        }
        else if (playerOneHand[i].rank === 'Q')
        {
          playerOneRank = 12;
        }
        else if (playerOneHand[i].rank === 'J')
        {
          playerOneRank = 11;
        }
      }  
      playerOneRank = parseInt(playerOneHand[i].rank);
      leftDisRank = parseInt(leftDisregard[0].rank);
      rightDisRank = parseInt(rightDisregard[0].rank);
      if ((playerOneRank === leftDisRank - 1) || (playerOneRank === leftDisRank + 1) || (playerOneRank === rightDisRank + 1) || (playerOneRank === rightDisRank - 1))
      {
        return true;
      }
      
      
      playerTwoRank = parseInt(playerTwoHand[i].rank);
    }
    //check every position in the players array
    //if none of the positions are plus one or minus 1 to either the left or right than take one card from each of the middle piles.
  }
  function popForOne(event){
    z = 0;
    for (let i = 0; i < playerOneStash.length; i++)
    {
      if (z > 4)
      {
        continue; 
      }
      else
      {
        z++;
        playerOneHand[i] = playerOneStash[i];
        playerOneStash.shift();
      }
    }
  }

  function popForTwo(event){
    z = 0;
    for (let i = 0; i < playerTwoStash.length; i++)
    {
      if (z > 4)
      {
        continue; 
      }
      else
      {
        z++;
        playerTwoHand[i] = playerTwoStash[i];
        playerOneStash.shift();
      }
    }
  }

  //check for none
  //shuffle for out of side cards
  //stalemate shuffle
  ////////////////////////////////////////////////


  //////////////////functions for seperating cards////////////////////////
  function playerOneDeck(event) {
    playerOneStash = [];
    for (let i = 0; i < 20; i++)
    {
      playerOneStash[i] = event[i];
    }
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
    console.log(rightDeck);
  }
  ///////////////////////////////////////////////////

  useEffect(() => {
    socket.on('id', (id) => {
      setName(id);
      console.log(id); 
    });
    socket.emit('gameState', fullDeck);
  }, []);

  

  
  // Define initial state for player's hand, central piles, and remaining cards
  const [playerHand, setPlayerHand] = useState([
    { rank: 'A', suit: '♠' },
    { rank: '2', suit: '♦' },
    { rank: 'K', suit: '♣' },
    
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
