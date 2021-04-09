import React, {useEffect, useState, useRef} from 'react';
import Card from './Card';
import axios from 'axios';


let URL = 'https://deckofcardsapi.com/api/deck/new/draw/?count=1'
//useRef for URL: if url = initial url, then switch to new url with deck id

function Deck() {
  const urlRef = useRef(URL);
  const [cards, setCards] = useState([]);
  const [drawNum, setDrawNum] = useState(0)
  useEffect(() => {
    async function fetchCard() {
      const cardData = await axios.get(urlRef.current);
      setCards(cards => [...cards, cardData.data])
      if (urlRef.current.includes('new')) {
        urlRef.current = `https://deckofcardsapi.com/api/deck/${cardData.data.deck_id}/draw/?count=1`;
      }
    }
    if (drawNum) fetchCard();
  }, [drawNum]);

  return (
    <div>
    <button onClick={() => setDrawNum(drawNum + 1)}>Get Card</button>
    {cards.length >= 52 ?
      alert("no more cards left.")
      : cards.map(card => 
        <Card 
          img ={card.cards[0].image}
          alt={card.cards[0].code}
          key={card.cards[0].code}
        />)}
    </div>
  )
}

export default Deck;

