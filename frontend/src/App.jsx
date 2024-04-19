import React, {useState, useEffect} from 'react';
import {DndContext} from '@dnd-kit/core';

import {Droppable} from './Droppable';
import {Draggable} from './Draggable';
import CardSVG from './CardSVG';
import './App.css'

import io from 'socket.io-client';

const socket = io('http://localhost:5001', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
  transports: ["websocket"]
});

export default function App() {
  const [player1Hand, setPlayer1Hand] = useState([]);
  const [player2Hand, setPlayer2Hand] = useState([]);
  const [leftPile, setLeftPile] = useState("l-1-♠");
  const [rightPile, setRightPile] = useState("r-1-♥");
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

  const handleDraw = (player) => {
    const drawnCard = fullDeck[0];
    setFullDeck(fullDeck.slice(1, fullDeck.length));

    if (player === 1) {
      setPlayer1Hand([...player1Hand, `h-${drawnCard.rank}-${drawnCard.suit}`]);
    } else {
      setPlayer2Hand([...player2Hand, `h-${drawnCard.rank}-${drawnCard.suit}`]);
    }
  };

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
    socket.on('id', (id) => {
      //setName(id);
      console.log(id); 
    });
    socket.emit('gameState', fullDeck);
    console.log("insideUseEffect");
  }, []);

  socket.on('cards', (shuffledDeck) => {
    setFullDeck(shuffledDeck);
  })


    function handleDragEnd(event) {
    const { active, over } = event;
    const cardID = active.id;
    const [_, rank, suit] = cardID.split('-');
  
    // Remove the card from the appropriate player's hand
    let updatedPlayer1Hand = [...player1Hand];
    let updatedPlayer2Hand = [...player2Hand];
  
    if (event.over.id.split('-')[0] === "l" || event.over.id.split('-')[0] === "r" ||
        event.over.id.split('-')[0] === "p2l" || event.over.id.split('-')[0] === "p2r") {
      updatedPlayer1Hand = updatedPlayer1Hand.filter(cardid => cardid !== cardID);
      updatedPlayer2Hand = updatedPlayer2Hand.filter(cardid => cardid !== cardID);
    } else if (event.over.id.split('-')[0] === "p1") {
      updatedPlayer1Hand = updatedPlayer1Hand.filter(cardid => cardid !== cardID);
    } else if (event.over.id.split('-')[0] === "p2") {
      updatedPlayer2Hand = updatedPlayer2Hand.filter(cardid => cardid !== cardID);
    }

    if (over.id.split('-')[0] === "l") {
      console.log(over.id.split('-')[1]);
      console.log(rank);
      if (parseInt(over.id.split('-')[1])-1 == parseInt(rank) || parseInt(over.id.split('-')[1])+1 == parseInt(rank)) {
        setLeftPile("l-" + rank + "-" + suit);
        console.log(over.id);
      }
      else {
        return;
      }

    }
    // HANDLE OVER RIGHT PILE
    else if (over.id.split('-')[0] === "r") {
      if (parseInt(over.id.split('-')[1])-1 == parseInt(rank) || parseInt(over.id.split('-')[1])+1 == parseInt(rank)) {
        setRightPile("r-" + rank + "-" + suit);
      }
      else {
        return;
      }
    }
  
    // Handle drop zones for piles
    if (over.id.split('-')[0] === "l") {
      setLeftPile("l-" + rank + "-" + suit);
    } else if (over.id.split('-')[0] === "r") {
      setRightPile("r-" + rank + "-" + suit);
    } else if (over.id.split('-')[0] === "p2l") {
      setLeftPile("p2l-" + rank + "-" + suit);
    } else if (over.id.split('-')[0] === "p2r") {
      setRightPile("p2r-" + rank + "-" + suit);
    }
  
    // Update the state
    setPlayer1Hand(updatedPlayer1Hand);
    setPlayer2Hand(updatedPlayer2Hand);
  
    // Emit socket events if needed
    // Modify according to your Socket.io implementation
    socket.emit('updateGameState', { leftPile, rightPile, player1Hand: updatedPlayer1Hand, player2Hand: updatedPlayer2Hand });
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
              return  <CardSVG rank={rank} suit={suit}/>
            }
          )()}
        </Droppable>

        <Droppable key={rightPile} id={rightPile}>
          {(
            () => {
              const [_, rank, suit] = rightPile.split('-');
              return  <CardSVG rank={rank} suit={suit}/>
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
    </DndContext>
  );
};