import React from 'react';

function CardPile({ cards }) {
  return (
    <div className='CardPile'>
      {cards.map((card, index) => (
        <div className='dropped-card' key={index}>
            {card}
        </div>
      ))}
    </div>
  );
}

export default CardPile;
