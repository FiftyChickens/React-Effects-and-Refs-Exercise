import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/DrawCard.css";
import DisplayCard from "./DisplayCard";
import Message from "./Message";

const baseUrl = "https://deckofcardsapi.com/api/deck";
/** DrawCard: uses deck API, allows drawing card at a time. */

const DrawCard = () => {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [display, setDisplay] = useState(false);
  const [error, setError] = useState(false);
  const [numDrawn, setNumDrawn] = useState(0);

  useEffect(() => {
    async function loadDeck() {
      try {
        const res = await axios.get(`${baseUrl}/new/shuffle/`);
        setDeck(res.data);
      } catch (error) {
        setError(true);
      }
    }
    loadDeck();
  }, []);

  async function drawFromDeck() {
    try {
      const resDraw = await axios.get(`${baseUrl}/${deck.deck_id}/draw/`);
      console.log(resDraw.data.remaining);
      if (resDraw.data.remaining > 0) {
        const card = resDraw.data.cards[0];

        setDrawn((deck) => [
          ...deck,
          {
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image,
          },
        ]);
        setNumDrawn((prev) => prev + 1);
      } else {
        setNumDrawn(52);
        console.error("No cards left in deck");
        setDisplay(true);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function shuffleDeck() {
    setIsShuffling(true);
    setDisplay(true);
    try {
      await axios.get(`${baseUrl}/${deck.deck_id}/shuffle/`);
      setDrawn([]);
    } catch (error) {
      alert(error);
    } finally {
      setTimeout(() => {
        setDisplay(false);
        setIsShuffling(false);
      }, 500);
      setNumDrawn(0);
    }
  }

  return (
    <main>
      {!display && (
        <button onClick={drawFromDeck} className="drawButton">
          Draw a card!
        </button>
      )}

      {!isShuffling && (
        <button className="drawButton" onClick={shuffleDeck}>
          Shuffle
        </button>
      )}

      <p className="counter">Cards Drawn: {numDrawn}</p>

      {drawn.map((card) => (
        <DisplayCard key={card.id} name={card.name} image={card.image} />
      ))}

      {display && !isShuffling && (
        <Message title={"Warning!"} content={"Out of cards"} />
      )}
      {isShuffling && <Message title={"Shuffling"} content={"Please wait"} />}
      {error && (
        <Message title={"ERROR"} content={"Connection to host lost!"} />
      )}
    </main>
  );
};
export default DrawCard;
