// CardSVG.js
import React from 'react';

const CardSVG = ({ rank, suit }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150 200"
      width="60"
      height="90"
      className="card"
    >
      {/* Card background */}
      <rect x="0" y="0" width="150" height="200" fill="#fff" />
      {/* Suit symbol */}
      <text x="10" y="30" fontSize="30" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>
        {suit}
      </text>
      {/* Rank */}
      <text x="70" y="110" fontSize="50" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>
        {rank}
      </text>
      {/* Bottom right */}
      <text x="120" y="180" fontSize="30" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>
        {rank}
      </text>
    </svg>
  );
};

export default CardSVG;
