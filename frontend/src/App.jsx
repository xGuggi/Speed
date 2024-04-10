import React, { useEffect, useState } from 'react';
import './App.css';

function DraggableBox({card_id}) {
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

  const endDrag = () => {
    setIsDragging(false);
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

function App() {
  const [cards, setCards] = useState([])
  const [cardData, setCardData] = useState();
  
  let playerOneStash = [];
  let playerTwoStash = [];
  let playerOneHand = [];
  let playerTwoHand = [];
  let leftDeck = [];
  let rightDeck = [];
  let left = [];
  let right = [];



  function shuffle(event){
    rando = Math.floor(Math.random() * (14 - 0 + 1)) + 0;
    
  }







  useEffect(() => {
    // Update stickman or handle game over logic here
  }, []);

  function HandleOnDrop(event) {
    setCards([...cards, card_id]);
  }

  return (  
    
    <div className="App"> 
      <div className="Hand">
        <DraggableBox card_id="aa"/>
      </div>

      <div className='CardPile' onMouseUp={HandleOnDrop}>
        {cards.map((card, index) => (
          <div className='dropped-card' key={index}>
              {card}
          </div>
        ))}
      </div>

      <div className="Hand">
        <DraggableBox card_id="aa"/>
      </div>
    </div>
  );
}

export default App;
