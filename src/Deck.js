import React, {useEffect, useState, useRef} from 'react';
import Card from './Card';
import axios from 'axios';


let URL = 'https://deckofcardsapi.com/api/deck/new/draw/?count=1'
//useRef for URL: if url = initial url, then switch to new url with deck id


function Deck() {
  const urlRef = useRef(URL);
  const [cards, setCards] = useState([]);
  const [drawNum, setDrawNum] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  
  console.log(cards)

  useEffect(() => {
    async function fetchCard() {
      const cardData = await axios.get(urlRef.current);
      let randomRot = Math.floor(Math.random() * 30);
      if (Math.random() > 0.5) randomRot *= -1;
      randomRot = "rotate(" + randomRot + "deg)";
      
      
      setCards(cards => [...cards, { ...cardData.data, randomRot }])
      if (urlRef.current.includes('new')) {
        urlRef.current = `https://deckofcardsapi.com/api/deck/${cardData.data.deck_id}/draw/?count=1`;
      }
    }
    if (drawNum) fetchCard();
  }, [drawNum]);

  useEffect(() => {
    async function shuffleDeck() {
      await axios.get(`https://deckofcardsapi.com/api/deck/${cards[0].deck_id}/shuffle/`);
      setCards([]);
      setDrawNum(0);
    }

    if(isShuffling) shuffleDeck();
  }, [isShuffling])


  return (
    <div className="Deck">
      <div>
        <button
          onClick={() => {
            setDrawNum(drawNum + 1);
            setIsShuffling(false);
          }}>
          Get Card
        </button>

      {(!isShuffling && drawNum > 0) && (
        <button onClick={() => setIsShuffling(true)}>Shuffle Deck</button>
        )}
      </div>

      <div className="Cards">
        {cards.length >= 52
          ? alert("no more cards left.")
          : cards.map(card => (
              <Card
                img={card.cards[0].image}
                alt={card.cards[0].code}
                key={card.cards[0].code}
                randomRot={card.randomRot}
              />
            ))}
      </div>
    </div>
  );
}

export default Deck;

