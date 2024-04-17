import React, {useState, useEffect} from 'react';
import {DndContext} from '@dnd-kit/core';

import {Droppable} from './Droppable';
import {Draggable} from './Draggable';
import CardSVG from './CardSVG';

import io from 'socket.io-client';

const socket = io('http://localhost:5001', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
  transports: ["websocket"]
});

export default function App() {
  const [hand, setHand] = useState(["h-1-♠","h-2-♦","h-3-♣","h-4-♥"]);
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

  const handleDraw = ()=> {
    setHand([...hand, "h-" + fullDeck[15].rank + "-" + fullDeck[15].suit]);
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
    const {active, over} = event;

    const cardID = active.id;
    const [_, rank, suit] = cardID.split('-');

    // HANDLE OVER LEFT PILE
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

    // HANDLE UPDATE HAND
    const newHand = hand.filter(cardid => cardid !== cardID);
    setHand(newHand);


  }


  return (
    <>
    <DndContext onDragEnd={handleDragEnd}>
      <h2>Board</h2>

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


      <h2>Your Hand</h2>
      {hand.map((cardid, index) => {
        const [_, rank, suit] = cardid.split('-'); // Correctly destructuring the card ID
        return (
          <Draggable key={index} id={cardid}>
            <CardSVG rank={rank} suit={suit} />
          </Draggable>
        );
      })}



    </DndContext>
    
    <hr/>
    
    <button onClick={handleDraw}>
      DRAW
    </button>
    </>
  );  
};