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
  let shuffledDeck = [];
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
    let playable = false; 
    leftDisRank = parseInt(leftDisregard[0].rank);
    rightDisRank = parseInt(rightDisregard[0].rank);
    for (let i = 0; i < playerOneHand.length; i++)
    {
      switch(playerOneHand[i].rank) 
      {
        case 'A':
          playerOneRank = 14;
          break;
        case 'K':
          playerOneRank = 13;
          break;
        case 'Q':
          playerOneRank = 12;
          break;
        case 'J':
          playerOneRank = 11;
          break;
        default:
          playerOneRank = parseInt(playerOneHand[i].rank);
          break;
      }
      if ((playerOneRank === 14 && leftDisRank === 2) ||(playerOneRank === 14 && rightDisRank === 2))
      {
        playable = true;
      }
      else if ((playerOneRank === leftDisRank - 1) || (playerOneRank === leftDisRank + 1) || (playerOneRank === rightDisRank + 1) || (playerOneRank === rightDisRank - 1))
      {
        playable = true;
      }
    }
    for (let i = 0; i < playerTwoHand.length; i++)
    {
      switch(playerTwoHand[i].rank) 
      {
        case 'A':
          playerTwoRank = 14;
          break;
        case 'K':
          playerTwoRank = 13;
          break;
        case 'Q':
          playerTwoRank = 12;
          break;
        case 'J':
          playerTwoRank = 11;
          break;
        default:
          playerTwoRank = parseInt(playerTwoHand[i].rank);
          break;
      }
      if ((playerTwoRank === 14 && leftDisRank === 2) ||(playerTwoRank === 14 && rightDisRank === 2))
      {
        playable = true;
      }
      else if ((playerTwoRank === leftDisRank - 1) || (playerTwoRank === leftDisRank + 1) || (playerTwoRank === rightDisRank + 1) || (playerTwoRank === rightDisRank - 1))
      {
        playable = true;
      }
    }
    return playable; 
  }



  function popForOne(event){
    if (!playerOneStash.length)
    {
      return;
    }
    else if (playerOneHand.length < 4)
    {
      playerOneHand.push(playerOneStash[0]);
      playerOneStash.shift();
    }
  }

  function popForTwo(event){
    if (!playerTwoStash.length)
    {
      return;
    }
    else if (playerTwoHand.length < 4)
    {
      playerTwoHand.push(playerTwoStash[0]);
      playerTwoStash.shift();
    }
  }

  function populateOneHand(event){
    z = 0;
    for (let i = 0; i < playerOneStash.length; i++)
    {
      if (z > 4)
      {
        continue;
      }
      playerOneHand[i] = playerOneStash[i];
      playerOneStash.shift();
    }
  }

  function populateTwoHand(event){
    z = 0;
    for (let i = 0; i < playerTwoStash.length; i++)
    {
      if (z > 4)
      {
        continue;
      }
      playerTwoHand[i] = playerTwoStash[i];
      playerTwoStash.shift();
    }
  }

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

  socket.on('cards', (shuffledArray) =>{
    //set shuffled arrray
    shuffledDeck = shuffledArray;
  });
  

  
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
