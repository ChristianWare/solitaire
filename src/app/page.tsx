"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

/** Example SUITS and RANKS arrays to build a deck **/
const SUITS = ["hearts", "diamonds", "clubs", "spades"] as const;
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;

export interface Card {
  suit: (typeof SUITS)[number];
  rank: (typeof RANKS)[number];
  faceUp: boolean;
  id: string; // unique identifier
}

// Foundations can be mapped by suit:
interface Foundations {
  hearts: Card[];
  diamonds: Card[];
  clubs: Card[];
  spades: Card[];
}

export default function SolitairePage() {
  const [tableau, setTableau] = useState<Card[][]>([
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]);
  const [foundations, setFoundations] = useState<Foundations>({
    hearts: [],
    diamonds: [],
    clubs: [],
    spades: [],
  });
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  // On component mount, start a new game and initiate a timer
  useEffect(() => {
    startNewGame();
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  /***************************************************
   * 1) CREATE AND DEAL A NEW GAME
   ***************************************************/
  function startNewGame() {
    setTime(0);
    setScore(0);
    setMoves(0);

    // Create deck, shuffle, deal to tableau
    const freshDeck = shuffleDeck(createDeck());
    const newTableau = dealTableau(freshDeck);
    const dealtCardsCount = newTableau.reduce(
      (acc, col) => acc + col.length,
      0
    );

    // Remainder of deck is stock
    const newStock = freshDeck.slice(dealtCardsCount);

    setTableau(newTableau);
    setStock(newStock);
    setWaste([]);
    setFoundations({ hearts: [], diamonds: [], clubs: [], spades: [] });
  }

  /***************************************************
   * 2) HELPER FUNCTIONS FOR CREATING/SHUFFLING/DEALING
   ***************************************************/
  function createDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({
          suit,
          rank,
          faceUp: false,
          id: `${suit}-${rank}-${Math.random().toString(36).substring(2, 9)}`,
        });
      }
    }
    return deck;
  }

  function shuffleDeck(deck: Card[]): Card[] {
    // Simple Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function dealTableau(deck: Card[]): Card[][] {
    const columns: Card[][] = [[], [], [], [], [], [], []];
    let index = 0;
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = deck[index];
        if (row === col) {
          card.faceUp = true; // top card face up
        }
        columns[col].push(card);
        index++;
      }
    }
    return columns;
  }

  /***************************************************
   * 3) STOCK AND WASTE
   ***************************************************/
  function flipStockCard() {
    if (stock.length > 0) {
      const nextCard = stock[0];
      nextCard.faceUp = true;
      setWaste([nextCard, ...waste]);
      setStock(stock.slice(1));

      // update moves/score if you want
      setMoves((m) => m + 1);
      setScore((s) => s - 5); // example scoring
    } else {
      // If stock is empty, you might move waste cards back to stock face-down (depends on your rules)
      // ...
    }
  }

  /***************************************************
   * 4) AUTO MOVE TO FOUNDATIONS
   ***************************************************/
  function autoMoveToFoundation() {
    // Attempt to move a face-up card from each tableau column (or waste if you want) to the foundations
    let moved = false;
    const newTableau = [...tableau];
    const newFoundations = { ...foundations };

    for (let colIdx = 0; colIdx < newTableau.length; colIdx++) {
      const column = newTableau[colIdx];
      if (column.length === 0) continue;
      const topCard = column[column.length - 1];
      // if it can move to foundation
      if (canMoveToFoundation(topCard)) {
        // remove from tableau
        column.pop();
        // place in foundation
        newFoundations[topCard.suit] = [
          ...newFoundations[topCard.suit],
          topCard,
        ];
        // flip next card if face down
        if (column.length > 0 && !column[column.length - 1].faceUp) {
          column[column.length - 1].faceUp = true;
        }

        moved = true;
        // update scoring or moves if you want
        setScore((s) => s + 10);
        setMoves((m) => m + 1);
      }
    }

    setTableau(newTableau);
    setFoundations(newFoundations);

    // If at least one card moved, try again to see if more can move
    if (moved) {
      // This recursion ensures you keep moving cards until you can't anymore
      setTimeout(autoMoveToFoundation, 200);
    }
  }

  function canMoveToFoundation(card: Card): boolean {
    const suitStack = foundations[card.suit];
    if (suitStack.length === 0) {
      // Must be an Ace if empty
      return card.rank === 1;
    }
    const topCard = suitStack[suitStack.length - 1];
    return card.rank === topCard.rank + 1;
  }

  /***************************************************
   * 5) MOVING CARDS IN THE TABLEAU (handleCardClick)
   ***************************************************/
  // For simplicity, a "two-click" method:
  //   1) Select the bottom-most card you want to move
  //   2) Click on the column you want to move it to
  // We'll store a 'selected' state to track the source col/card index.
  const [selected, setSelected] = useState<{
    columnIndex: number;
    cardIndex: number;
  } | null>(null);

  function handleCardClick(colIdx: number, cardIdx: number) {
    // If nothing is selected yet, pick up that card (if it's face up)
    const clickedCard = tableau[colIdx][cardIdx];
    if (!clickedCard.faceUp) return;

    if (!selected) {
      // select this stack
      setSelected({ columnIndex: colIdx, cardIndex: cardIdx });
    } else {
      // try to move from 'selected' to 'colIdx'
      if (moveStack(selected.columnIndex, selected.cardIndex, colIdx)) {
        setSelected(null);
      } else {
        // invalid move
        setSelected(null);
      }
    }
  }

  function moveStack(
    fromCol: number,
    fromCardIdx: number,
    toCol: number
  ): boolean {
    if (fromCol === toCol) return false; // same column => no-op

    const sourceColumn = [...tableau[fromCol]];
    const destColumn = [...tableau[toCol]];

    // stack to move:
    const movingStack = sourceColumn.slice(fromCardIdx);
    // validate
    if (!canPlaceOnTop(destColumn, movingStack[0])) {
      return false;
    }

    // remove from source
    sourceColumn.splice(fromCardIdx, movingStack.length);
    // add to destination
    destColumn.push(...movingStack);

    // flip next card if needed
    if (
      sourceColumn.length > 0 &&
      !sourceColumn[sourceColumn.length - 1].faceUp
    ) {
      sourceColumn[sourceColumn.length - 1].faceUp = true;
    }

    // update state
    const newTableau = [...tableau];
    newTableau[fromCol] = sourceColumn;
    newTableau[toCol] = destColumn;
    setTableau(newTableau);

    // increment moves, maybe adjust score
    setMoves((m) => m + 1);
    setScore((s) => s + 1);

    return true;
  }

  function canPlaceOnTop(destColumn: Card[], card: Card) {
    if (destColumn.length === 0) {
      // only allow King if empty
      return card.rank === 13; // 13 = King
    }
    const topCard = destColumn[destColumn.length - 1];

    // suits: hearts/diamonds = red, clubs/spades = black
    const topIsRed = topCard.suit === "hearts" || topCard.suit === "diamonds";
    const movingIsRed = card.suit === "hearts" || card.suit === "diamonds";
    const differentColor =
      (topIsRed && !movingIsRed) || (!topIsRed && movingIsRed);

    // must be exactly one rank lower
    const correctRank = card.rank === topCard.rank - 1;

    return differentColor && correctRank;
  }

  /***************************************************
   * 6) RENDERING THE CARDS: getCardImageSrc
   ***************************************************/
  function getCardImageSrc(card: Card): string {
    // Example: if you have images named "AC.svg", "2C.svg", "JD.svg", etc.
    // Construct the rank letter
    let rankChar = "";
    switch (card.rank) {
      case 1:
        rankChar = "A";
        break;
      case 11:
        rankChar = "J";
        break;
      case 12:
        rankChar = "Q";
        break;
      case 13:
        rankChar = "K";
        break;
      default:
        rankChar = card.rank.toString();
    }

    // Suit letter
    let suitChar = "";
    switch (card.suit) {
      case "hearts":
        suitChar = "H";
        break;
      case "diamonds":
        suitChar = "D";
        break;
      case "clubs":
        suitChar = "C";
        break;
      case "spades":
        suitChar = "S";
        break;
    }

    // The final filename. Make sure you have these assets in /public/cards/
    return `/cards/${rankChar}${suitChar}.svg`;
  }

  /***************************************************
   * 7) MAIN RENDER
   ***************************************************/
  return (
    <main style={{ padding: "1rem" }}>
      <h1>Klondike Solitaire</h1>
      <div style={{ marginBottom: "0.5rem" }}>
        Score: {score} | Moves: {moves} | Time: {time}s
      </div>

      {/* Render the tableau columns */}
      <section style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {tableau.map((column, colIdx) => (
          <div
            key={colIdx}
            style={{ border: "1px solid #ccc", padding: "0.5rem" }}
          >
            <h3>Column {colIdx + 1}</h3>
            {column.map((card, cardIdx) => (
              <div
                key={card.id}
                style={{ marginBottom: "-70px" /* stack overlap example */ }}
                onClick={() => handleCardClick(colIdx, cardIdx)}
              >
                {card.faceUp ? (
                  <Image
                    src={getCardImageSrc(card)}
                    alt={`${card.rank} of ${card.suit}`}
                    style={{ width: "80px", height: "auto" }}
                    width={80}
                    height={150}
                  />
                ) : (
                  <Image
                    src='/images/pattern.jpg'
                    alt='Face Down'
                    style={{ width: "80px", height: "auto" }}
                    width={80}
                    height={150}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* Foundations */}
      <section style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
        {Object.entries(foundations).map(([suit, cards]) => {
          const topCard = cards[cards.length - 1];
          return (
            <div key={suit}>
              <h3>{suit[0].toUpperCase() + suit.slice(1)}</h3>
              {topCard ? (
                <Image
                  src={getCardImageSrc(topCard)}
                  alt={`${topCard.rank} of ${topCard.suit}`}
                  style={{ width: "80px" }}
                  width={80}
                  height={150}
                />
              ) : (
                <div
                  style={{
                    width: "80px",
                    height: "120px",
                    border: "1px dashed #999",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Empty
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Stock & Waste */}
      <section style={{ marginBottom: "1rem" }}>
        <button onClick={flipStockCard} disabled={stock.length === 0}>
          Flip Stock
        </button>
        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <div>
            <h3>Stock ({stock.length})</h3>
            {/* top of stock face down */}
            {stock.length > 0 ? (
              <Image
                src='/cards/back.svg'
                alt='Stock'
                style={{ width: "80px", height: "auto" }}
                width={80}
                height={150}
              />
            ) : (
              <div
                style={{
                  width: "80px",
                  height: "120px",
                  border: "1px dashed #999",
                }}
              />
            )}
          </div>
          <div>
            <h3>Waste</h3>
            {waste.map((card) => (
              <Image
                key={card.id}
                src={getCardImageSrc(card)}
                alt={`${card.rank} of ${card.suit}`}
                style={{
                  width: "80px",
                  marginLeft: "-50px" /* overlap example */,
                }}
                width={80}
                height={150}
              />
            ))}
          </div>
        </div>
      </section>

      <button onClick={autoMoveToFoundation}>Auto Move to Foundation</button>
    </main>
  );
}
