import React, {useEffect, useState, useRef} from 'react';
import Card from './Card';
import axios from 'axios';

function Deck() {
  const deckId = useRef();
  const [cards, setCards] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [numCards, setNumCards] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const timerId = useRef();

  async function fetchCard() {
    
    if (cards.length >= 52) {
      setIsFetching(false);
      console.log("no more cards left");
      clearInterval(timerId.current);
    }
    else {
      const cardData = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=1`
      );

      let randomRot = Math.floor(Math.random() * 30);
      if (Math.random() > 0.5) randomRot *= -1;
      randomRot = "rotate(" + randomRot + "deg)";

      setCards(cards => [...cards, { ...cardData.data, randomRot }]);
    }
  }

  // Used to grab deckId on initial load
  useEffect(() => {
    async function getNewDeck() {
      const resp = await axios.get("https://deckofcardsapi.com/api/deck/new/");
      deckId.current = resp.data.deck_id;
    }
    getNewDeck();
  }, [])

  useEffect(() => {
    if (isFetching) {
      // Need to setNumCards in order for cards to be updated after each fetchCard invocation
      timerId.current = setInterval(() => setNumCards(n => n + 1), 200);
    }

    return () => clearInterval(timerId.current);
  }, [isFetching]);

  useEffect(() => {
    if (numCards > 0) fetchCard();
  }, [numCards])

  useEffect(() => {
    async function shuffleDeck() {
      await axios.get(`https://deckofcardsapi.com/api/deck/${cards[0].deck_id}/shuffle/`);
      setCards([]);
    }

    if(isShuffling) shuffleDeck();
  }, [isShuffling])


  return (
    <div className="Deck">
      <div>
        <button
          onClick={() => {
            setIsFetching(!isFetching);
            setIsShuffling(false);
          }}>
          Get Card
        </button>

      {(!isShuffling) && (
        <button onClick={() => setIsShuffling(true)}>Shuffle Deck</button>
        )}
      </div>

      <div className="Cards">
        {cards.length > 0 && cards.map(card => (
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

