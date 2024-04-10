import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import CardPile from './components/CardPile.jsx'; // Make sure the path is correct
import Hand from './components/Hand.jsx';
import io from 'socket.io-client';

const socket = io('http://localhost:5001', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
  transports: ["websocket"]
});


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
  const [cards, setCards] = useState([]);
  const [id, setId] = useState();

  useEffect(() => {
    socket.on('id', (id) => {
      setId(id);
      console.log(id);
    });
  }, []);
  
  const cardPileRef = useRef(); 

  const handleOnDrop = (e, card_id) => {
    e.preventDefault;
    socket.emit('sendMessage', {cards});
    setCards([...cards, card_id]);
  };

  return (
    <div className="App">
      <Hand card_ids={['a', 'b', 'c']} onDropFunc={handleOnDrop} />
      <CardPile cards={cards} />
      <Hand card_ids={['a', 'b', 'c']} onDropFunc={handleOnDrop} />
    </div>
  );
}

export default App;
