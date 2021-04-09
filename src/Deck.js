import React, {useEffect, useState} from 'react';
import Card from './Card';
import axios from 'axios';
import { cleanup } from '@testing-library/react';


let URL = 'https://deckofcardsapi.com/api/deck/new/draw/?count=1'

function Deck() {
  const [cards, setCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(0)
  useEffect(() => {
    if (!isDrawing) {
      return;
    }
    async function fetchCard() {
      const cardData = await axios.get(URL);
      setCards(cards => [...cards, cardData.data])
      URL = `https://deckofcardsapi.com/api/deck/${cardData.data.deck_id}/draw/?count=1`;
    }
    fetchCard();
  }, [isDrawing]);

  return (
    <div>
    {cards.map(card => <Card img ={card.cards[0].image} />)}
    <button onClick={() => setIsDrawing(isDrawing + 1)}>Get Card</button>
    </div>
  )
}

export default Deck;

