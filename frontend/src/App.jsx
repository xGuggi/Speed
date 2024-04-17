import React, {useState, useEffect} from 'react';
import {DndContext} from '@dnd-kit/core';

import {Droppable} from './Droppable';
import {Draggable} from './Draggable';
import CardSVG from './CardSVG';

import io from 'socket.io-client';

const socket = io('http://localhost:5001', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
  transports: ["websocket"]
});

export default function App() {
  const [hand, setHand] = useState(["h-1-♠","h-2-♦","h-3-♣","h-4-♥"]);
  const [leftPile, setLeftPile] = useState("l-1-♠");
  const [rightPile, setRightPile] = useState("r-1-♥");
  const [fullDeck, setFullDeck] = useState([
    { rank: '2', suit: '♠' },
    { rank: '3', suit: '♠' },
    { rank: '4', suit: '♠' },
    { rank: '5', suit: '♠' },
    { rank: '6', suit: '♠' },
    { rank: '7', suit: '♠' },
    { rank: '8', suit: '♠' },
    { rank: '9', suit: '♠' },
    { rank: '10', suit: '♠' },
    { rank: 'J', suit: '♠' },
    { rank: 'Q', suit: '♠' },
    { rank: 'K', suit: '♠' },
    { rank: 'A', suit: '♠' },

    { rank: '2', suit: '♦' },
    { rank: '3', suit: '♦' },
    { rank: '4', suit: '♦' },
    { rank: '5', suit: '♦' },
    { rank: '6', suit: '♦' },
    { rank: '7', suit: '♦' },
    { rank: '8', suit: '♦' },
    { rank: '9', suit: '♦' },
    { rank: '10', suit: '♦' },
    { rank: 'J', suit: '♦' },
    { rank: 'Q', suit: '♦' },
    { rank: 'K', suit: '♦' },
    { rank: 'A', suit: '♦' },

    { rank: '2', suit: '♣' },
    { rank: '3', suit: '♣' },
    { rank: '4', suit: '♣' },
    { rank: '5', suit: '♣' },
    { rank: '6', suit: '♣' },
    { rank: '7', suit: '♣' },
    { rank: '8', suit: '♣' },
    { rank: '9', suit: '♣' },
    { rank: '10', suit: '♣' },
    { rank: 'J', suit: '♣' },
    { rank: 'Q', suit: '♣' },
    { rank: 'K', suit: '♣' },
    { rank: 'A', suit: '♣' },

    { rank: '2', suit: '♥' },
    { rank: '3', suit: '♥' },
    { rank: '4', suit: '♥' },
    { rank: '5', suit: '♥' },
    { rank: '6', suit: '♥' },
    { rank: '7', suit: '♥' },
    { rank: '8', suit: '♥' },
    { rank: '9', suit: '♥' },
    { rank: '10', suit: '♥' },
    { rank: 'J', suit: '♥' },
    { rank: 'Q', suit: '♥' },
    { rank: 'K', suit: '♥' },
    { rank: 'A', suit: '♥' },
  ]);

  let shuffledDeck = [];
  let leftDisregard = [];
  let rightDisregard = [];
  let playerOneStash = [];
  let playerTwoStash = [];
  let playerOneHand = [];
  let playerTwoHand = [];
  let leftDeck = [];
  let rightDeck = [];
  ///////////////////logic////////////////////////
  function checkIfNone(event) {
    let playerOneRank;
    let playerTwoRank;
    let playable = false; 
    leftDisRank = parseInt(leftDisregard[0].rank);
    rightDisRank = parseInt(rightDisregard[0].rank);
    for (let i = 0; i < playerOneHand.length; i++)
    {
      switch(playerOneHand[i].rank) 
      {
        case 'A':
          playerOneRank = 14;
          break;
        case 'K':
          playerOneRank = 13;
          break;
        case 'Q':
          playerOneRank = 12;
          break;
        case 'J':
          playerOneRank = 11;
          break;
        default:
          playerOneRank = parseInt(playerOneHand[i].rank);
          break;
      }
      if ((playerOneRank === 14 && leftDisRank === 2) ||(playerOneRank === 14 && rightDisRank === 2))
      {
        playable = true;
      }
      else if ((playerOneRank === leftDisRank - 1) || (playerOneRank === leftDisRank + 1) || (playerOneRank === rightDisRank + 1) || (playerOneRank === rightDisRank - 1))
      {
        playable = true;
      }
    }
    for (let i = 0; i < playerTwoHand.length; i++)
    {
      switch(playerTwoHand[i].rank) 
      {
        case 'A':
          playerTwoRank = 14;
          break;
        case 'K':
          playerTwoRank = 13;
          break;
        case 'Q':
          playerTwoRank = 12;
          break;
        case 'J':
          playerTwoRank = 11;
          break;
        default:
          playerTwoRank = parseInt(playerTwoHand[i].rank);
          break;
      }
      if ((playerTwoRank === 14 && leftDisRank === 2) ||(playerTwoRank === 14 && rightDisRank === 2))
      {
        playable = true;
      }
      else if ((playerTwoRank === leftDisRank - 1) || (playerTwoRank === leftDisRank + 1) || (playerTwoRank === rightDisRank + 1) || (playerTwoRank === rightDisRank - 1))
      {
        playable = true;
      }
    }
    return playable; 
  }



  function popForOne(event){
    if (!playerOneStash.length)
    {
      return;
    }
    else if (playerOneHand.length < 4)
    {
      playerOneHand.push(playerOneStash[0]);
      playerOneStash.shift();
    }
  }

  function popForTwo(event){
    if (!playerTwoStash.length)
    {
      return;
    }
    else if (playerTwoHand.length < 4)
    {
      playerTwoHand.push(playerTwoStash[0]);
      playerTwoStash.shift();
    }
  }

  function populateOneHand(event){
    z = 0;
    for (let i = 0; i < playerOneStash.length; i++)
    {
      if (z > 4)
      {
        continue;
      }
      playerOneHand[i] = playerOneStash[i];
      playerOneStash.shift();
    }
  }

  function populateTwoHand(event){
    z = 0;
    for (let i = 0; i < playerTwoStash.length; i++)
    {
      if (z > 4)
      {
        continue;
      }
      playerTwoHand[i] = playerTwoStash[i];
      playerTwoStash.shift();
    }
  }

  ////////////////////////////////////////////////


  //////////////////functions for seperating cards////////////////////////
  function playerOneDeck(event) {
    playerOneStash = [];
    for (let i = 0; i < 20; i++)
    {
      playerOneStash[i] = event[i];
    }
    console.log(playerOneStash);
  }
  
  function playerTwoDeck(event) {
    playerOneStash = [];
    let z = 0;
    for (let i = 20; i < 40; i++)
    {
      if (i > 19)
      {
        playerTwoStash[z] = event[i];
        z++;
      }
    }
    console.log(playerTwoStash);
  }
  
  function leftCards(event) {
    leftDeck = [];
    let z = 0;
    for (let i = 40; i < 46; i++)
    {
      if (i > 39)
      {
        leftDeck[z] = event[i];
        z++;
      }
    }
    console.log(leftDeck);
  }
  
  function rightCards(event) {
    leftDeck = [];
    let z = 0; 
    for (let i = 46; i < 52; i++)
    {
      if (i > 45) 
      {
        rightDeck[z] = event[i];
        z++;
      }
    }
    console.log(rightDeck);
  }
  ///////////////////////////////////////////////////





  const handleDraw = ()=> {
    setHand([...hand, "h-" + fullDeck[15].rank + "-" + fullDeck[15].suit]);
  }

  useEffect(() => {
    socket.on('id', (id) => {
      //setName(id);
      console.log(id); 
    });
    socket.emit('gameState', fullDeck);
    console.log("insideUseEffect");
  }, []);

  socket.on('cards', (shuffledDeck) => {
    setFullDeck(shuffledDeck);
  })


  function handleDragEnd(event) {
    const {active, over} = event;

    const cardID = active.id;
    const [_, rank, suit] = cardID.split('-');

    // HANDLE OVER LEFT PILE
    if (over.id.split('-')[0] === "l") {
      console.log(over.id.split('-')[1]);
      console.log(rank);
      if (parseInt(over.id.split('-')[1])-1 == parseInt(rank) || parseInt(over.id.split('-')[1])+1 == parseInt(rank)) {
        setLeftPile("l-" + rank + "-" + suit);
        console.log(over.id);
      }
      else {
        return;
      }

    }
    // HANDLE OVER RIGHT PILE
    else if (over.id.split('-')[0] === "r") {
      if (parseInt(over.id.split('-')[1])-1 == parseInt(rank) || parseInt(over.id.split('-')[1])+1 == parseInt(rank)) {
        setRightPile("r-" + rank + "-" + suit);
      }
      else {
        return;
      }
      
    }

    // HANDLE UPDATE HAND
    const newHand = hand.filter(cardid => cardid !== cardID);
    setHand(newHand);


  }


  return (
    <>
    <DndContext onDragEnd={handleDragEnd}>
      <h2>Board</h2>

      <Droppable key={leftPile} id={leftPile}>
        {(
          () => {
            const [_, rank, suit] = leftPile.split('-');
            return  <CardSVG rank={rank} suit={suit}/>
          }
        )()}
      </Droppable>

      <Droppable key={rightPile} id={rightPile}>
        {(
          () => {
            const [_, rank, suit] = rightPile.split('-');
            return  <CardSVG rank={rank} suit={suit}/>
          }
        )()}        
      </Droppable>


      <h2>Your Hand</h2>
      {hand.map((cardid, index) => {
        const [_, rank, suit] = cardid.split('-'); // Correctly destructuring the card ID
        return (
          <Draggable key={index} id={cardid}>
            <CardSVG rank={rank} suit={suit} />
          </Draggable>
        );
      })}



    </DndContext>
    
    <hr/>
    
    <button onClick={handleDraw}>
      DRAW
    </button>
    </>
  );  
};