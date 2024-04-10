// GameBoard.js
import React from 'react';
import GameControls from './GameControls';
import CardSVG from './CardSVG';

function GameBoard({ playerHand, centralPiles, remainingCards, onPlayCard, onDrawCard, onDeclareSpeed }) {
  return (
    <div className="game-board">
      <div className="player-hand">
        <h2>Your Hand</h2>
        <div className="cards">
          {/* Display player's hand of cards */}
          {playerHand.map((card, index) => (
            <CardSVG key={index} rank={card.rank} suit={card.suit} />
          ))}
        </div>
      </div>
      <div className="central-piles">
        <h2>Central Piles</h2>
        <div className="piles">
          {/* Display central piles */}
          {centralPiles.map((pile, index) => (
            <div key={index} className="pile">
              {pile.map((card, idx) => (
                <CardSVG key={idx} rank={card.rank} suit={card.suit} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="remaining-cards">
        <h2>Remaining Cards</h2>
        <p>{remainingCards} cards remaining</p>
      </div>
      <GameControls
        onPlayCard={onPlayCard}
        onDrawCard={onDrawCard}
        onDeclareSpeed={onDeclareSpeed}
      />
    </div>
  );
}

export default GameBoard;
