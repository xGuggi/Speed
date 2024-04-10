import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import CardPile from './components/CardPile.jsx'; // Make sure the path is correct
import Hand from './components/Hand.jsx';

function App() {
  const [cards, setCards] = useState([]);

 
  const cardPileRef = useRef(); 

  const handleOnDrop = (e, card_id) => {
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
