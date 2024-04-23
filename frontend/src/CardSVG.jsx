import React from 'react';

const CardSVG = ({ rank, suit }) => {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox= "0 0 100 150"
      width= "60"
      height= "90"
      className= "Card"
    >
      <rect x="0" y="0" width="100" height="150" fill="none" stroke="black" strokeWidth="2" />
      <text x="25" y="25" fontSize="30" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>{suit}</text>
      <text x="50" y="80" fontSize="50" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>{rank}</text>
      <text x="75" y="145" fontSize="30" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>{suit}</text>
    </svg>
  );
};

export default CardSVG;
