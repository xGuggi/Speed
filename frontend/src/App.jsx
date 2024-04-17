import React, {useState} from 'react';
import {DndContext} from '@dnd-kit/core';

import {Droppable} from './Droppable';
import {Draggable} from './Draggable';
import CardSVG from './CardSVG';

export default function App() {
  const [hand, setHand] = useState(["h-1-♠","h-2-♦","h-3-♣","h-4-♥"]);
  const [leftPile, setLeftPile] = useState("l-1-♠");
  const [rightPile, setRightPile] = useState("r-1-♥");


  function handleDragEnd(event) {
    const {active, over} = event;

    const cardID = active.id;
    const [_, rank, suit] = cardID.split('-');

    // HANDLE OVER LEFT PILE
    if (over.id.split('-')[0] === "l") {
      setLeftPile("l-" + rank + "-" + suit)
    }
    // HANDLE OVER RIGHT PILE
    else if (over.id.split('-')[0] === "r") {
      setRightPile("r-" + rank + "-" + suit)
    }

    // HANDLE UPDATE HAND
    const newHand = hand.filter(cardid => cardid !== cardID);
    setHand(newHand);
  }

  return (

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
  );  
};