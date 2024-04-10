import React, { useEffect, useState, useRef } from 'react';
import './App.css';

function DraggableBox({card_id, onDrop}) {
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

function App() {
  const [cards, setCards] = useState([])
  const [cardData, setCardData] = useState();

  // https://react.dev/reference/react/useRef
  const cardPileRef = useRef(); // Reference to the drop target
  
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


  const handleOnDrop = (e, card_id) => {
    // Calculate if the drop is within the CardPile
    const cardPileBounds = cardPileRef.current.getBoundingClientRect();
    if (e.clientX >= cardPileBounds.left && e.clientX <= cardPileBounds.right &&
        e.clientY >= cardPileBounds.top && e.clientY <= cardPileBounds.bottom) {
      setCards([...cards, card_id]);
      return "dropped";
    }
  };

  return (  
    
    <div className="App"> 
      <div className="Hand">
        <DraggableBox card_id="aa" onDrop={handleOnDrop}/>
      </div>

      <div className='CardPile' ref={cardPileRef}>
        {cards.map((card, index) => (
          <div className='dropped-card' key={index}>
              {card}
          </div>
        ))}
      </div>

      <div className="Hand">
        <DraggableBox card_id="aa" onDrop={handleOnDrop}/>
        <DraggableBox card_id="b" onDrop={handleOnDrop}/>
        <DraggableBox card_id="c" onDrop={handleOnDrop}/>
        <DraggableBox card_id="d" onDrop={handleOnDrop}/>
      </div>
    </div>
  );
}

export default App;
