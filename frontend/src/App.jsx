import React, {useState, useEffect} from 'react';
import {DndContext} from '@dnd-kit/core';

import {Droppable} from './Droppable';
import {Draggable} from './Draggable';
import CardSVG from './CardSVG';
import './App.css'

import io from 'socket.io-client';

import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import CardSVG from './CardSVG';

const socket = io('http://localhost:5001', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
  transports: ["websocket"]
});

export default function App() {
  const [player1Hand, setPlayer1Hand] = useState(["h-1-♠","h-2-♦","h-3-♣","h-4-♥"]);
  const [player2Hand, setPlayer2Hand] = useState(["h-5-♠","h-6-♦","h-7-♣","h-8-♥"]);
  const [leftPile, setLeftPile] = useState("l-1-♠");
  const [rightPile, setRightPile] = useState("r-1-♥");

   
  const handleDraw = (player) => {
    if (player === 1) {
      setPlayer1Hand([...player1Hand, "h-1-♠"]);
    } else {
      setPlayer2Hand([...player2Hand, "h-1-♠"]);
    }
  }

  const handleStalemate = ()=> {
    // GET NEW CARDS BEFORE SETTING
    setLeftPile("l-" + "F" + "-" + "F");
    setRightPile("r-" + "F" + "-" + "F");
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
