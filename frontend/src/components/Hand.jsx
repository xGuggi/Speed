import React from 'react';
import Card from './Card'; 

function Hand({ handRef, card_ids, onDropFunc }) {
  return (
    <div className="Hand" ref={handRef}>
      {card_ids.map((card_id, index) => (
        <Card card_id={card_id} onDrop={onDropFunc} key={index}/>
      ))}
    </div>
  );
}

export default Hand;
