import React from 'react';
import GameControls from './GameControls';
import CardSVG from './CardSVG';
import { DndContext, closestCenter, MouseSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';

function GameBoard({ playerHand, setPlayerHand, centralPiles, setCentralPiles, remainingCards, onPlayCard, onDrawCard, onDeclareSpeed }) {
  const sensors = useSensors(
    useSensor(MouseSensor),
  );

  const handleDrop = (event) => {
    // THINGS THAT MUST HAPPEN IN THIS FUNCTION:
    // 1. determin the value of the pile the "active" card is over
    // 2. validate
    //    - either back end tells front end if it is valid
    //    - or front end tells backend what happend
    // 3. update react state
    //    - player hand
    //    - piles




    console.log("in handle drop");
    const { active, over } = event;
    // TODO: FIGURE OUT HOW TO GET ACCESS TO THE ELEMENT IT IS OVER

    console.log("over: ", over);
    console.log("active: ", active);
    

    // ALL THE CARD INFO IS STORED IN THE CARDID FOR EASY ACCESS
    // THIS LINE UNPACKS THE VALUES FOR EASY ACCESS
    const cardID = active.id;
    const [, cardIndex, cardRank, cardSuit] = cardID.split('-');




    if (true) { // Implement game rules validation here

      // update pile - this is debug, none of it has worked yet
      const newPiles = [...centralPiles];
      newPiles[toPileIndex].push(fromCard);
      setCentralPiles(newPiles);


      // update player hand
      // filter out the placed card, I think the line below works, but i cant tell
      // const newHand = prevHand.filter(card => card.rank !== cardRank || card.suit !== cardSuit);

      // for debug, just trying to set the hand 
      const newHand = [
        { rank: '2', suit: '♣' },
        { rank: '2', suit: '♣' },
        { rank: '2', suit: '♣' },
        { rank: '2', suit: '♣' },
        { rank: '2', suit: '♣' },
      ];
      setPlayerHand(newHand);
    }
  };
  

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDrop}>
      <div className="game-board">
        {centralPiles.map((pile, index) => {
          const { setNodeRef } = useDroppable({
            id: `pile-${index}`
          });

          return (
            <div ref={setNodeRef} key={index} id={`pile-${index}`} className="pile">
              {pile.map((card, idx) => (
                <CardSVG key={idx} id={`pile-${index}-${card.rank}-${card.suit}`} rank={card.rank} suit={card.suit} drop={false} />
              ))}
            </div>
          );
        })}
        <h2>Your Hand</h2>
        <div className="player-hand">
          {playerHand.map((card, index) => (
            <CardSVG key={index} id={`card-${index}-${card.rank}-${card.suit}`} rank={card.rank} suit={card.suit} drop={true} />
          ))}
        </div>
      </div>
      <GameControls onPlayCard={onPlayCard} onDrawCard={onDrawCard} onDeclareSpeed={onDeclareSpeed} />
    </DndContext>
  );
}

export default GameBoard;
