import React, { useState } from 'react';

function Card({card_id, onDrop, hand}) {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
  
    const startDrag = (e) => {
      // set the position to the mouse
      setPosition({
        x: e.clientX - 50, // Adjust based on element size to center
        y: e.clientY - 50, // Adjust based on element size to center
      });
      // make the movement smooth
      e.target.style.position = 'absolute';
      setIsDragging(true);
    };
  
    const onDragging = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - 50, // Adjust based on element size to center
        y: e.clientY - 50, // Adjust based on element size to center
      });
    };
  
    const endDrag = (e) => {
      setIsDragging(false);
      if(onDrop(e, card_id) === "dropped") {
        e.target.style.display = 'none';
      } else {
  
      };
    };
  
    return (
      <div
        className="Card"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={startDrag}
        onMouseMove={onDragging}
        onMouseUp={endDrag}
      >{card_id}</div>
    );
  }

  export default Card;