import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';

import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import CardSVG from './CardSVG';
import './App.css'

import io from 'socket.io-client';
import Modal from './history';


const socket = io(`http://${window.location.hostname}:5001`, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
  transports: ["websocket"]
});

export default function App() {
  const [stateCheck, SetStateCheck] = useState('true');
  const [gameOver, setGameOver] = useState(false);
  const [player1Hand, setPlayer1Hand] = useState([]);
  const [p1Draws, setP1DrawPileSize] = useState(20);
  const [p2Draws, setP2DrawPileSize] = useState(20);
  const [player2Hand, setPlayer2Hand] = useState([]);
  const [leftPile, setLeftPile] = useState("l-1-♠");
  const [rightPile, setRightPile] = useState("r-1-♥");
  const [open, setOpen] = useState(false); //this is used for the modal 
  const [winner, setWinner] = useState(0); //this is used for the winner
  const [empty, setEmpty] = useState(false); //this is used for the winner
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

  /////////////// Function to handle the win ///////////////
  const isHandEmpty = () => {
    console.log("at the function");
    console.log(p1Draws);
    console.log(p2Draws);
    if (p1Draws === 0){
      setWinner(1);
      setEmpty(true);
      setTimeout(() => {
        setOpen(true);
        console.log(open);
      }, 5000);
      console.log("at player one");
    } 
    if (p2Draws === 0){
      setWinner(2);
      setEmpty(true);
      setTimeout(() => {
        setOpen(true);
        console.log(open);
      }, 5000);
      console.log("at player two");
    }
  };
  useEffect(() => {
    const checkForWin = () =>{
      isHandEmpty();
    };
    checkForWin();
  });

  // useEffect(() => {
  //   const endGame = () =>{
    // setTimeout(() => {
    // }, popUpModal, 5000);
  //   };
  //   endGame();
  // }, [winner]);

  const popUpModal = async () =>
  {
    let cardSend;
    let loser; 
    if (p1Draws > p2Draws)
    {
      let cardSend = p1Draws;
      loser = 1;
    }
    else 
    {
      let cardSend = p2Draws; 
      loser = 2; 
    }
      const newUser = await fetch("http://localhost:5001/gather", {
           credentials: "include",
           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify({cards: cardSend, loser: loser}),
       });    
    setOpen(true);
    //needs more work to send to specific winning player
  }
/////////////////////////////////////////////////////////

  // Function to handle win condition : don't use this from Joel!!!!
  const checkWinCondition = () => {
    if (isHandEmpty(1)) {
      console.log("Player wins");
      setGameOver(true); // Player 1 wins
    } else if (isHandEmpty(2)) {
      setGameOver(true); // Player 2 wins
      console.log("Player wins");
    }
  };

  const handleDraw = (player) => {
    const drawnCard = fullDeck[0];
    let updatedPlayer1Hand = [...player1Hand];
    let updatedPlayer2Hand = [...player2Hand];
    if (player === 1) {
      if (player1Hand.length >= 5 || p1Draws == 0) {
        return;
      }
      //setPlayer1Hand([...player1Hand, `h-${drawnCard.rank}-${drawnCard.suit}`]);
      updatedPlayer1Hand.push(`h-${drawnCard.rank}-${drawnCard.suit}`);
      console.log(player1Hand);
    } else {
      if (player2Hand.length >= 5 || p2Draws == 0) {
        return;
      }
      //setPlayer2Hand([...player2Hand, `h-${drawnCard.rank}-${drawnCard.suit}`]);
      updatedPlayer2Hand.push(`h-${drawnCard.rank}-${drawnCard.suit}`);
    }
    setFullDeck(fullDeck.slice(1, fullDeck.length));
    checkWinCondition();
    console.log("player1Hand in handle draw" + player1Hand);
    socket.emit('updateHands', updatedPlayer1Hand, updatedPlayer2Hand);
  };

  useEffect(() => {
    const shuffleDeck = (deck) => {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      return deck;
    };
  
    // Shuffle the full deck
    let localFullDeck = shuffleDeck([...fullDeck]);
  
    // Divide the deck into two equal halves
    const halfDeckSize = Math.ceil(localFullDeck.length / 2);
    const deck1 = localFullDeck.slice(0, halfDeckSize);
    const deck2 = localFullDeck.slice(halfDeckSize);
  
    // Draw initial hands for both players alternately, limiting each player to 5 cards
    let localPlayer1Hand = [];
    let localPlayer2Hand = [];
    for (let i = 0; i < 5; i++) {
      const drawnCard1 = deck1.shift();
      const drawnCard2 = deck2.shift();
      localPlayer1Hand.push(`h-${drawnCard1.rank}-${drawnCard1.suit}`);
      localPlayer2Hand.push(`h-${drawnCard2.rank}-${drawnCard2.suit}`);
    }
  
    // Central piles
    let centerL, centerR;
    do {
      centerL = localFullDeck.shift();
    } while (localPlayer1Hand.includes(`h-${centerL.rank}-${centerL.suit}`) || localPlayer2Hand.includes(`h-${centerL.rank}-${centerL.suit}`));
  
    do {
      centerR = localFullDeck.shift();
    } while (localPlayer1Hand.includes(`h-${centerR.rank}-${centerR.suit}`) || localPlayer2Hand.includes(`h-${centerR.rank}-${centerR.suit}`));
  
    // Set the state at the end of all operations
    setFullDeck(localFullDeck);
    setPlayer1Hand(localPlayer1Hand);
    setPlayer2Hand(localPlayer2Hand);
    setLeftPile(`l-${centerL.rank}-${centerL.suit}`);
    setRightPile(`r-${centerR.rank}-${centerR.suit}`);
    socket.emit('initialState', localFullDeck, localPlayer1Hand, localPlayer2Hand, `l-${centerL.rank}-${centerL.suit}`, `r-${centerR.rank}-${centerR.suit}`);
  }, []);
  
  const handleStalemate = ()=> {
    const drawnCard = fullDeck[0];
    const drawnCard2 = fullDeck[1];
    setFullDeck(fullDeck.slice(2, fullDeck.length));
    // GET NEW CARDS BEFORE SETTING
    //[...player1Hand, `h-${drawnCard.rank}-${drawnCard.suit}`]
    setLeftPile(`l-${drawnCard.rank}-${drawnCard.suit}`);
    setRightPile(`r-${drawnCard2.rank}-${drawnCard2.suit}`);
  }

  const handleFinalStalemate = () => {
    
  }

  useEffect(() => {
    checkWinCondition(); //this is problem from Joel
    socket.on('id', (id) => {
      //setName(id);
      console.log(id);
    });
    socket.emit('gameState', fullDeck);
    console.log("insideUseEffect");
  }, []);

  //function press button or when we detect a drop event 

    socket.on('newCards', (player1Hand, player2Hand, leftPile, rightPile, p1DrawPileSize, p2DrawPileSize) => {
      console.log("Inside socket new cards");
      setPlayer1Hand(player1Hand);
      console.log(player1Hand);
      setPlayer2Hand(player2Hand);
      console.log("leftpile" + leftPile);
      setLeftPile(leftPile);
      console.log("rightPile" + rightPile);
      setRightPile(rightPile);
      setP1DrawPileSize(p1DrawPileSize);
      setP2DrawPileSize(p2DrawPileSize);
      SetStateCheck(!stateCheck);
    });

    socket.on('newHands', (player1Hand, player2Hand) => {
      setPlayer1Hand(player1Hand);
      setPlayer2Hand(player2Hand);
      SetStateCheck(!stateCheck);
    });

    // useEffect(() => {
    //   console.log('Inisde state check useEffect');
    // })

  socket.on('cards', (shuffledDeck) => {
    setFullDeck(shuffledDeck);

  });

  socket.on('test', (deck) => {
    console.log(deck);
  })

  socket.on('initialState', (fullDeck, player1Hand, player2Hand, leftPile, rightPile) => {
    setFullDeck(fullDeck);
    setPlayer1Hand(player1Hand);
    setPlayer2Hand(player2Hand);
    setLeftPile(leftPile);
    setRightPile(rightPile);
  });

  function handleDragEnd(event) {

    const { active, over } = event;
    const cardID = active.id;
    const [_, rank, suit] = cardID.split('-');

    // Remove the card from the appropriate player's hand
    let updatedPlayer1Hand = [...player1Hand];
    let updatedPlayer2Hand = [...player2Hand];
    let updatedLeftPile = leftPile;
    let updatedRightPile = rightPile;
    let updatedP1DrawPileSize = p1Draws;
    let updatedP2DrawPileSize = p2Draws;

    let startP1Handsize = updatedPlayer1Hand.length;
    let startP2Handsize = updatedPlayer2Hand.length;

    if (event.over.id.split('-')[0] === "l" || event.over.id.split('-')[0] === "r" ||
      event.over.id.split('-')[0] === "p2l" || event.over.id.split('-')[0] === "p2r") {
      updatedPlayer1Hand = updatedPlayer1Hand.filter(cardid => cardid !== cardID);
      updatedPlayer2Hand = updatedPlayer2Hand.filter(cardid => cardid !== cardID);
    } 
    
    if (startP1Handsize > updatedPlayer1Hand.length) {
      updatedP1DrawPileSize = p1Draws-1;
    } else if (startP2Handsize > updatedPlayer2Hand.length) {
      updatedP2DrawPileSize = p2Draws-1;
    }

    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    // Find the index of the rank in the ranks array
    const rankIndex = ranks.indexOf(rank);

    if (over.id.split('-')[0] === "l" || over.id.split('-')[0] === "r" ||
      event.over.id.split('-')[0] === "p2l" || event.over.id.split('-')[0] === "p2r") {
      if (['A', 'K'].includes(rank) || Math.abs(rankIndex - ranks.indexOf(over.id.split('-')[1])) === 1) {
      } else {
        return;
      }
    } else if (event.over.id.split('-')[0] === "p1") {
      if (['A', 'K'].includes(rank) || Math.abs(rankIndex - ranks.indexOf(over.id.split('-')[1])) === 1) {
      } else {
        return;
      }
    } else if (event.over.id.split('-')[0] === "p2") {
      if (['A', 'K'].includes(rank) || Math.abs(rankIndex - ranks.indexOf(over.id.split('-')[1])) === 1) {
      } else {
        return;
      }
    }

    // Handle drop zones for piles
    if (over.id.split('-')[0] === "l") {
      updatedLeftPile = ("l-" + rank + "-" + suit);
    } else if (over.id.split('-')[0] === "r") {
      updatedRightPile = ("r-" + rank + "-" + suit);
    } else if (over.id.split('-')[0] === "p2l") {
      updatedLeftPile = ("p2l-" + rank + "-" + suit);
    } else if (over.id.split('-')[0] === "p2r") {
      updatedRightPile = ("p2r-" + rank + "-" + suit);
    }

    console.log("updatedleftPIle" + updatedLeftPile);
    console.log("updateRightPiple" + updatedRightPile);
    // Update the state

    // Emit socket events if needed
    // Modify according to your Socket.io implementation
    //socket.emit('updateGameState', { leftPile, rightPile, player1Hand: updatedPlayer1Hand, player2Hand: updatedPlayer2Hand });
    console.log("player1Hand" + player1Hand);
    console.log("p1Draws" + p1Draws);
    socket.emit('updateGame', updatedLeftPile, updatedRightPile, updatedPlayer1Hand, updatedPlayer2Hand, updatedP1DrawPileSize, updatedP2DrawPileSize );
    }

const handleClose = async () =>
{
    setOpen(false);
    if (test === true)
    {
        setTest(false);
    }
    else if (test === false)
    {
        setTest(true);
    }
}



  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className='Player'>
        <div className='PlayerDetails'>
          <h2>Player 1 Hand</h2>
          <p>cards left: {p1Draws}</p>
          <button onClick={() => handleDraw(1)}>Player 1 DRAW</button>
        </div>
        <div className='PlayerHand'>
          {player1Hand.map((cardid, index) => {
            const [_, rank, suit] = cardid.split('-');
            return (
              <Draggable key={index} id={cardid}>
                <CardSVG rank={rank} suit={suit} />
              </Draggable>
            );
          })}
        </div>
      </div>
      <div className='CenterPiles'>
        <button onClick={handleStalemate}>
          <CardSVG rank="" suit="" />
        </button>
        <Droppable key={leftPile} id={leftPile}>
          {(
            () => {
              const [_, rank, suit] = leftPile.split('-');
              return <CardSVG rank={rank} suit={suit} />
            }
          )()}
        </Droppable>

        <Droppable key={rightPile} id={rightPile}>
          {(
            () => {
              const [_, rank, suit] = rightPile.split('-');
              return <CardSVG rank={rank} suit={suit} />
            }
          )()}
        </Droppable>
        <button onClick={handleStalemate}>
          <CardSVG rank="" suit="" />
        </button>
      </div>

      <div className='Player'>
        <div className='PlayerHand'>
          {player2Hand.map((cardid, index) => {
            const [_, rank, suit] = cardid.split('-');
            return (
              <Draggable key={index} id={cardid}>
                <CardSVG rank={rank} suit={suit} />
              </Draggable>
            );
          })}
        </div>
        <div className='PlayerDetails'>
          <button onClick={() => handleDraw(2)}>Player 2 DRAW</button>
          <p>cards left: {p2Draws}</p>
          <h2>Player 2 Hand</h2>
        </div>
      </div>

      <hr/>
      <button onClick={() => setOpen(true)}>History</button>
      <Modal open = {open} onClose={handleClose} />
        <div className="win-message">
          {empty ? "Player " + winner + " wins!" : ""}
        </div>
      
    </DndContext>
  );
  
};

