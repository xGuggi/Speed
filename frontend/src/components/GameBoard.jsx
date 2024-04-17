import React from 'react';
import GameControls from './GameControls';
import CardSVG from './CardSVG';
import { DndContext, closestCenter, MouseSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';

function GameBoard({ playerHand, setPlayerHand, centralPiles, setCentralPiles, remainingCards, onPlayCard, onDrawCard, onDeclareSpeed }) {
  const sensors = useSensors(
    useSensor(MouseSensor),
  );

  const handleDrop = (event) => {
    const { active, over } = event;
  
    // Extract the card data from the active draggable
    const cardData = active.data.current;
  
    // Extract pile ID from the drop target
    const [, pileIndex] = over.id.split('-');
    const toPileIndex = parseInt(pileIndex);
  
    // Determine source pile ID (if dropped from a pile)
    const [, fromPileIndex] = active.id.split('-');
    const fromPile = fromPileIndex ? parseInt(fromPileIndex) : null;
  
    // Determine the card being moved
    const fromCardIndex = parseInt(cardData.index);
    const fromCard = fromPile !== null ? centralPiles[fromPile][fromCardIndex] : playerHand[fromCardIndex];
  
    // Implement game rules validation here
    let isValidMove = true; // Placeholder for your validation logic
  
    if (isValidMove) {
      // Update the React state
      if (fromPile === null) {
        // If the card is dropped from the player's hand
        const newHand = playerHand.filter((_, index) => index !== fromCardIndex);
        setPlayerHand(newHand);
      } else {
        // If the card is dropped from a central pile
        const newPiles = [...centralPiles];
        newPiles[fromPile] = newPiles[fromPile].filter((_, index) => index !== fromCardIndex);
        setCentralPiles(newPiles);
      }
  
      // Update the destination pile
      const newPiles = [...centralPiles];
      newPiles[toPileIndex].push(fromCard);
      setCentralPiles(newPiles);
    } else {
      // Handle invalid move
      console.log('Invalid move');
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
