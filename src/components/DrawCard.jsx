import React, { useEffect, useState } from "react";
import DisplayCard from "./DisplayCard";
import axios from "axios";
import "../assets/DrawCard.css";

const baseUrl = "https://deckofcardsapi.com/api/deck";
/** DrawCard: uses deck API, allows drawing card at a time. */

const DrawCard = () => {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    async function loadDeck() {
      const res = await axios.get(`${baseUrl}/new/shuffle/`);
      setDeck(res.data);
    }

    loadDeck();
  }, []);

  async function drawFromDeck() {
    try {
      const resDraw = await axios.get(`${baseUrl}/${deck.deck_id}/draw/`);
      const card = resDraw.data.cards[0];

      setDrawn((deck) => [
        ...deck,
        {
          id: card.code,
          name: card.suit + " " + card.value,
          image: card.image,
        },
      ]);
      console.log(card);
    } catch (error) {
      console.log(error);
    }
  }

  console.log("card", drawn);
  return (
    <main>
      <button onClick={drawFromDeck} className="drawButton">
        draw
      </button>
      {drawn.map((card) => (
        <DisplayCard key={card.id} name={card.name} image={card.image} />
      ))}
    </main>
  );
};
export default DrawCard;
