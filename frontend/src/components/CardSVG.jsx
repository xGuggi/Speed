import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const CardSVG = ({ rank, suit, id, drop }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const draggableStyle = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : {};

  // Common properties for both draggable and static SVGs
  const commonProps = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 100 150",
    width: "60",
    height: "90",
    className: "card"
  };

  return (
    drop ? (
      <svg
        {...commonProps}
        ref={setNodeRef}
        style={draggableStyle}
        {...listeners}
        {...attributes}
      >
        <rect x="0" y="0" width="100" height="150" fill="none" stroke="black" strokeWidth="2" />
        <text x="25" y="25" fontSize="30" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>{suit}</text>
        <text x="50" y="80" fontSize="50" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>{rank}</text>
        <text x="75" y="145" fontSize="30" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>{suit}</text>
      </svg>
    ) : (
      <svg {...commonProps}>
        <rect x="0" y="0" width="100" height="150" fill="none" stroke="black" strokeWidth="2" />
        <text x="25" y="25" fontSize="30" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>{suit}</text>
        <text x="50" y="80" fontSize="50" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>{rank}</text>
        <text x="75" y="145" fontSize="30" fill={suit === '♠' || suit === '♣' ? 'black' : 'red'}>{suit}</text>
      </svg>
    )
  );
};


export default CardSVG;