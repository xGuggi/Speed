import React from 'react';
import GameControls from './GameControls';
import CardSVG from './CardSVG';
import { DndContext, closestCenter, MouseSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';

function GameBoard({ playerHand, setPlayerHand, centralPiles, setCentralPiles, remainingCards, onPlayCard, onDrawCard, onDeclareSpeed }) {
  const sensors = useSensors(
    useSensor(MouseSensor),
  );

  const handleDrop = (event) => {
    console.log("in handle drop");
    const { active, over } = event;
    console.log("over: ", over);
    console.log("active: ", active);
    const cardID = active.id;

    const [, cardIndex, cardRank, cardSuit] = cardID.split('-');


    // ask backend if card works on a pile


    if (true) { // Implement game rules validation here
      const newPiles = [...centralPiles];
      newPiles[toPileIndex].push(fromCard);
      setCentralPiles(newPiles);
      // filter out the placed card
      // const newHand = prevHand.filter(card => card.rank !== cardRank || card.suit !== cardSuit);
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
