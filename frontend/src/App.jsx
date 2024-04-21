import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';

import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import CardSVG from './CardSVG';
import './App.css'

import io from 'socket.io-client';
import Modal from './history';


const socket = io('http://localhost:5001', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
  transports: ["websocket"]
});

export default function App() {
  const [stateCheck, SetStateCheck] = useState('true');
  const [gameOver, setGameOver] = useState(false);
  const [player1Hand, setPlayer1Hand] = useState([]);
  const [player2Hand, setPlayer2Hand] = useState([]);
  const [leftPile, setLeftPile] = useState("l-1-♠");
  const [rightPile, setRightPile] = useState("r-1-♥");
  const [open, setOpen] = useState(false); //this is used for the modal 
  const [winner, setWinner] = useState(0); //this is used for the winner
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
  ]);

  // Function to check if a player's hand is empty
  const isHandEmpty = (player) => {
    if (player === 1) {
      if (!player1Hand.length){
        setWinner(1);
        return true; 
      }
    } else {
        if (!player2Hand.length){
          setWinner(2);
          return true;
        }
    }
  };

  useEffect(() => {
    const endGame = () =>{
      setTimeout(() => {
      }, popUpModal, 5000);
    };
    endGame();
  }, [winner]);

  const popUpModal = async () =>
  {
    setOpen(true);
  }


  // Function to handle win condition
  const checkWinCondition = () => {
    if (isHandEmpty(1)) {
      console.log("Player wins");
      setGameOver(true); // Player 1 wins
    } else if (isHandEmpty(2)) {
      setGameOver(true); // Player 2 wins
      console.log("Player wins");
    }
  };

  const handleDraw = (player) => {
    const drawnCard = fullDeck[0];

    if (player === 1) {
      if (player1Hand.length >= 5) {
        return;
      }
      setPlayer1Hand([...player1Hand, `h-${drawnCard.rank}-${drawnCard.suit}`]);
      console.log(player1Hand);
    } else {
      if (player2Hand.length >= 5) {
        return;
      }
      setPlayer2Hand([...player2Hand, `h-${drawnCard.rank}-${drawnCard.suit}`]);
    }
    setFullDeck(fullDeck.slice(1, fullDeck.length));
    checkWinCondition();
    console.log("player1Hand in handle draw" + player1Hand);
    //socket.emit('updateGame', leftPile, rightPile, player1Hand, player2Hand);
  };



  
  useEffect(() => {
    const shuffleDeck = (deck) => {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      return deck;
    };

    



    // Shuffle the full deck
    let localFullDeck = shuffleDeck([...fullDeck]);

    // Draw initial hands for both players
    let localPlayer1Hand = [...player1Hand];
    let localPlayer2Hand = [...player2Hand];

    const handleDraw = (player) => {
      const drawnCard = localFullDeck.shift();  // This mutates localFullDeck by removing the first element

      if (player === 1) {
        localPlayer1Hand.push(`h-${drawnCard.rank}-${drawnCard.suit}`);
      } else {
        localPlayer2Hand.push(`h-${drawnCard.rank}-${drawnCard.suit}`);
      }
    };

    for (let i = 0; i < 5; i++) {
      handleDraw(1);
      handleDraw(2);
    }


    // Central piles
    const centerL = localFullDeck.shift();  
    const centerR = localFullDeck.shift();  

    // Set the state at the end of all operations
    setFullDeck(localFullDeck);
    setPlayer1Hand(localPlayer1Hand);
    setPlayer2Hand(localPlayer2Hand);
    setLeftPile(`l-${centerL.rank}-${centerL.suit}`);
    setRightPile(`r-${centerR.rank}-${centerR.suit}`);
    //socket.emit('initialState', fullDeck, player1Hand, player2Hand, leftPile, rightPile);
  }, []);  // Dependencies array is empty, so this runs only once
  
  const handleStalemate = ()=> {
    const drawnCard = fullDeck[0];
    const drawnCard2 = fullDeck[1];
    setFullDeck(fullDeck.slice(2, fullDeck.length));
    // GET NEW CARDS BEFORE SETTING
    //[...player1Hand, `h-${drawnCard.rank}-${drawnCard.suit}`]
    setLeftPile(`l-${drawnCard.rank}-${drawnCard.suit}`);
    setRightPile(`r-${drawnCard2.rank}-${drawnCard2.suit}`);
  }

  useEffect(() => {
    checkWinCondition();
    socket.on('id', (id) => {
      //setName(id);
      console.log(id);
    });
    socket.emit('gameState', fullDeck);
    console.log("insideUseEffect");
  }, []);

  //function press button or when we detect a drop event 

    socket.on('newCards', (player1Hand, player2Hand, leftPile, rightPile) => {
      console.log("Inside socket new cards");
      setPlayer1Hand(player1Hand);
      console.log(player1Hand);
      setPlayer2Hand(player2Hand);
      console.log("leftpile" + leftPile);
      setLeftPile(leftPile);
      console.log("rightPile" + rightPile);
      setRightPile(rightPile);
      SetStateCheck(!stateCheck);
    });

    // useEffect(() => {
    //   console.log('Inisde state check useEffect');
    // })

  socket.on('cards', (shuffledDeck) => {
    setFullDeck(shuffledDeck);

  });

  socket.on('test', (deck) => {
    console.log(deck);
  })

  socket.on('initialState', (fullDeck, player1Hand, player2Hand, leftPile, rightPile) => {
    setFullDeck(fullDeck);
    setPlayer1Hand(player1Hand);
    setPlayer2Hand(player2Hand);
    setLeftPile(leftPile);
    setRightPile(rightPile);
  })

  socket.on('updateGameState', (leftPile, rightPile, player1Hand, player2Hand) => {
    setLeftPile(leftPile);
    setRightPile(rightPile);
    setPlayer1Hand(player1Hand);
    setPlayer2Hand(player2Hand);
  });


  function handleDragEnd(event) {
    const { active, over } = event;
    const cardID = active.id;
    const [_, rank, suit] = cardID.split('-');

    // Remove the card from the appropriate player's hand
    let updatedPlayer1Hand = [...player1Hand];
    let updatedPlayer2Hand = [...player2Hand];
    let updatedLeftPile = leftPile;
    let updatedRightPile = rightPile;

    if (event.over.id.split('-')[0] === "l" || event.over.id.split('-')[0] === "r" ||
      event.over.id.split('-')[0] === "p2l" || event.over.id.split('-')[0] === "p2r") {
      updatedPlayer1Hand = updatedPlayer1Hand.filter(cardid => cardid !== cardID);
      updatedPlayer2Hand = updatedPlayer2Hand.filter(cardid => cardid !== cardID);
    } else if (event.over.id.split('-')[0] === "p1") {
      updatedPlayer1Hand = updatedPlayer1Hand.filter(cardid => cardid !== cardID);
    } else if (event.over.id.split('-')[0] === "p2") {
      updatedPlayer2Hand = updatedPlayer2Hand.filter(cardid => cardid !== cardID);
    }

    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    // Find the index of the rank in the ranks array
    const rankIndex = ranks.indexOf(rank);

    if (over.id.split('-')[0] === "l" || over.id.split('-')[0] === "r" ||
      event.over.id.split('-')[0] === "p2l" || event.over.id.split('-')[0] === "p2r") {
      if (['A', 'K'].includes(rank) || Math.abs(rankIndex - ranks.indexOf(over.id.split('-')[1])) === 1) {
      } else {
        return;
      }
    } else if (event.over.id.split('-')[0] === "p1") {
      if (['A', 'K'].includes(rank) || Math.abs(rankIndex - ranks.indexOf(over.id.split('-')[1])) === 1) {
      } else {
        return;
      }
    } else if (event.over.id.split('-')[0] === "p2") {
      if (['A', 'K'].includes(rank) || Math.abs(rankIndex - ranks.indexOf(over.id.split('-')[1])) === 1) {
      } else {
        return;
      }
    }

    // Handle drop zones for piles
    if (over.id.split('-')[0] === "l") {
      console.log(over.id.split('-')[0]);
      console.log("rank" + rank);
      setLeftPile("l-" + rank + "-" + suit);
      updatedLeftPile = ("l-" + rank + "-" + suit);
    } else if (over.id.split('-')[0] === "r") {
      console.log(over.id.split('-')[0]);
      console.log("rank" + rank);
      setRightPile("r-" + rank + "-" + suit);
      updatedRightPile = ("r-" + rank + "-" + suit);
    } else if (over.id.split('-')[0] === "p2l") {
      console.log(over.id.split('-')[0]);
      console.log("rank" + rank);
      setLeftPile("p2l-" + rank + "-" + suit);
      updatedLeftPile = ("p2l-" + rank + "-" + suit);
    } else if (over.id.split('-')[0] === "p2r") {
      console.log(over.id.split('-')[0]);
      console.log("rank" + rank);
      setRightPile("p2r-" + rank + "-" + suit);
      updatedRightPile = ("p2r-" + rank + "-" + suit);
    }

    console.log("updatedleftPIle" + updatedLeftPile);
    console.log("updateRightPiple" + updatedRightPile);
    // Update the state
    setPlayer1Hand(updatedPlayer1Hand);
    setPlayer2Hand(updatedPlayer2Hand);

    // Emit socket events if needed
    // Modify according to your Socket.io implementation
    //socket.emit('updateGameState', { leftPile, rightPile, player1Hand: updatedPlayer1Hand, player2Hand: updatedPlayer2Hand });
    console.log("player1Hand" + player1Hand);
    socket.emit('updateGame', updatedLeftPile, updatedRightPile, updatedPlayer1Hand, updatedPlayer2Hand );
    }

const handleClose = async () =>
{
    setOpen(false);
    if (test === true)
    {
        setTest(false);
    }
    else if (test === false)
    {
        setTest(true);
    }
}



  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <button onClick={() => handleDraw(1)}>Player 1 DRAW</button>
        <h2>Player 1 Hand</h2>
        {player1Hand.map((cardid, index) => {
          const [_, rank, suit] = cardid.split('-');
          return (
            <Draggable key={index} id={cardid}>
              <CardSVG rank={rank} suit={suit} />
            </Draggable>
          );
        })}
      </div>
      <div className='CenterPiles'>
        <button onClick={handleStalemate}>
          <CardSVG rank="" suit="" />
        </button>
        <Droppable key={leftPile} id={leftPile}>
          {(
            () => {
              const [_, rank, suit] = leftPile.split('-');
              return <CardSVG rank={rank} suit={suit} />
            }
          )()}
        </Droppable>

        <Droppable key={rightPile} id={rightPile}>
          {(
            () => {
              const [_, rank, suit] = rightPile.split('-');
              return <CardSVG rank={rank} suit={suit} />
            }
          )()}
        </Droppable>
        <button onClick={handleStalemate}>
          <CardSVG rank="" suit="" />
        </button>
      </div>

      <div>
        <h2>Player 2 Hand</h2>
        {player2Hand.map((cardid, index) => {
          const [_, rank, suit] = cardid.split('-');
          return (
            <Draggable key={index} id={cardid}>
              <CardSVG rank={rank} suit={suit} />
            </Draggable>
          );
        })}
        
      </div>
      <button onClick={() => handleDraw(2)}>Player 2 DRAW</button>
      <button onClick={() => setOpen(true)}>History</button>
      <Modal open = {open} onClose={handleClose} />

      {gameOver && (
      <div className="win-message">
        {isHandEmpty(1) ? "" : "Player " + winner + "wins!"} 
      </div>
      )}
    </DndContext>
  );
  
};