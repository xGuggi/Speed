import React from 'react';

function GameControls({ onPlayCard, onDrawCard, onDeclareSpeed }) {
  return (
    <div className="game-controls">
      <button onClick={onPlayCard}>Play Card</button>
      <button onClick={onDrawCard}>Draw Card</button>
      <button onClick={onDeclareSpeed}>Declare SPEED</button>
    </div>
  );
}

export default GameControls;
