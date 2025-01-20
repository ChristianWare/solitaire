"use client";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, createDeck, shuffleDeck } from "../lib/deck";
import { dealTableau } from "../lib/deal";
import CardView from "@/components/CardView/CardView";
import DropColumn from "@/components/DropColumn/DropColumn";

interface Foundations {
  hearts: Card[];
  diamonds: Card[];
  clubs: Card[];
  spades: Card[];
}

export default function SolitairePage() {
  // ---------------------------
  // 1) STATE
  // ---------------------------
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
  const [waste, setWaste] = useState<Card[]>([]); // we'll track all waste, but only show top 3
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  // For "two-click" moves in tableau
  // const [selected, setSelected] = useState<{
  //   columnIndex: number;
  //   cardIndex: number;
  // } | null>(null);

  // ---------------------------
  // 2) ON MOUNT: NEW GAME, TIMER
  // ---------------------------
  useEffect(() => {
    startNewGame();
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // ---------------------------
  // 3) START NEW GAME
  // ---------------------------
  function startNewGame() {
    setTime(0);
    setScore(0);
    setMoves(0);

    const freshDeck = shuffleDeck(createDeck());
    const newTableau = dealTableau(freshDeck);
    const dealtCardsCount = newTableau.reduce(
      (acc, col) => acc + col.length,
      0
    );

    setTableau(newTableau);
    // The remainder of the deck is the stock (facedown)
    setStock(freshDeck.slice(dealtCardsCount));
    setWaste([]);
    setFoundations({ hearts: [], diamonds: [], clubs: [], spades: [] });
  }

  // ---------------------------
  // 4) FLIP STOCK
  //    One card per click. Show top 3 in waste.
  // ---------------------------
  function flipStockCard() {
    if (stock.length > 0) {
      // Take only 1 card from stock
      const [nextCard, ...rest] = stock;
      nextCard.faceUp = true;

      // Put it on top of waste
      const newWaste = [nextCard, ...waste];

      setStock(rest);
      setWaste(newWaste);

      setMoves((m) => m + 1);
      setScore((s) => s - 5); // optional scoring
    } else {
      // If stock is empty, recycle waste -> stock (face down)
      if (waste.length > 0) {
        const recycled = waste.map((card) => {
          card.faceUp = false;
          return card;
        });
        setStock(recycled);
        setWaste([]);
        // Possibly track a pass or do a penalty
        // setScore((s) => s - 20);
      }
    }
  }

  // ---------------------------
  // 5) AUTO-MOVE TO FOUNDATIONS
  // ---------------------------
  function autoMoveToFoundation() {
    let moved = false;
    const newTableau = [...tableau];
    const newFoundations = { ...foundations };

    for (let colIdx = 0; colIdx < newTableau.length; colIdx++) {
      const column = newTableau[colIdx];
      if (column.length === 0) continue;
      const topCard = column[column.length - 1];
      if (canMoveToFoundation(topCard)) {
        column.pop();
        newFoundations[topCard.suit] = [
          ...newFoundations[topCard.suit],
          topCard,
        ];
        // flip next card if needed
        if (column.length > 0 && !column[column.length - 1].faceUp) {
          column[column.length - 1].faceUp = true;
        }
        moved = true;
        setScore((s) => s + 10);
        setMoves((m) => m + 1);
      }
    }

    setTableau(newTableau);
    setFoundations(newFoundations);

    // Attempt again if at least one card moved
    if (moved) {
      setTimeout(autoMoveToFoundation, 200);
    }
  }

  function canMoveToFoundation(card: Card): boolean {
    const suitStack = foundations[card.suit];
    if (suitStack.length === 0) {
      return card.rank === 1; // must be Ace if empty
    }
    const topCard = suitStack[suitStack.length - 1];
    return card.rank === topCard.rank + 1;
  }

  // ---------------------------
  // 6) TWO-CLICK METHOD: TABLEAU MOVES
  // ---------------------------
  // function handleCardClick(colIdx: number, cardIdx: number) {
  //   const column = tableau[colIdx];
  //   const clickedCard = column[cardIdx];
  //   if (!clickedCard || !clickedCard.faceUp) return;

  //   if (!selected) {
  //     setSelected({ columnIndex: colIdx, cardIndex: cardIdx });
  //   } else {
  //     if (moveStack(selected.columnIndex, selected.cardIndex, colIdx)) {
  //       setSelected(null);
  //     } else {
  //       setSelected(null);
  //     }
  //   }
  // }

  function moveStack(
    fromCol: number,
    fromCardIdx: number,
    toCol: number
  ): boolean {
    if (fromCol < 0 || fromCol >= tableau.length) return false;
    if (toCol < 0 || toCol >= tableau.length) return false;

    const sourceColumn = [...tableau[fromCol]];
    if (fromCardIdx < 0 || fromCardIdx >= sourceColumn.length) return false;

    const movingStack = sourceColumn.slice(fromCardIdx);
    if (movingStack.length === 0) return false;

    const cardToMove = movingStack[0];
    if (!cardToMove) return false;

    const destColumn = [...tableau[toCol]];
    if (!canPlaceOnTop(destColumn, cardToMove)) {
      return false;
    }

    sourceColumn.splice(fromCardIdx, movingStack.length);
    destColumn.push(...movingStack);

    // flip next card if needed
    if (
      sourceColumn.length > 0 &&
      !sourceColumn[sourceColumn.length - 1].faceUp
    ) {
      sourceColumn[sourceColumn.length - 1].faceUp = true;
    }

    const newTableau = [...tableau];
    newTableau[fromCol] = sourceColumn;
    newTableau[toCol] = destColumn;
    setTableau(newTableau);

    setMoves((m) => m + 1);
    setScore((s) => s + 1);

    return true;
  }

  function canPlaceOnTop(destColumn: Card[], card: Card) {
    if (!card) return false;
    if (destColumn.length === 0) {
      // only King if empty
      return card.rank === 13;
    }
    const topCard = destColumn[destColumn.length - 1];
    const topIsRed = topCard.suit === "hearts" || topCard.suit === "diamonds";
    const movingIsRed = card.suit === "hearts" || card.suit === "diamonds";
    const differentColor =
      (topIsRed && !movingIsRed) || (!topIsRed && movingIsRed);
    const correctRank = card.rank === topCard.rank - 1;
    return differentColor && correctRank;
  }

  // ---------------------------
  // 7) RENDER
  // ---------------------------
  return (
    <DndProvider backend={HTML5Backend}>
      <main style={{ padding: "1rem" }}>
        <h1>Klondike Solitaire (1-Card Flip, Show Top 3 in Waste)</h1>
        <div style={{ marginBottom: "0.5rem" }}>
          Score: {score} | Moves: {moves} | Time: {time}s
        </div>

        {/* TABLEAU */}
        <section style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          {tableau.map((column, colIdx) => (
            <DropColumn
              key={colIdx}
              colIndex={colIdx}
              columnCards={column}
              moveStack={moveStack}
              canPlaceOnTop={canPlaceOnTop}
              tableau={tableau}
            />
          ))}
        </section>

        {/* FOUNDATIONS */}
        <section style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
          {Object.entries(foundations).map(([suit, cards]) => {
            const topCard = cards[cards.length - 1];
            return (
              <div key={suit}>
                <h3>{suit[0].toUpperCase() + suit.slice(1)}</h3>
                {topCard ? (
                  <CardView card={topCard} width={80} height={120} />
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

        {/* STOCK & WASTE */}
        <section style={{ marginBottom: "1rem" }}>
          <button onClick={flipStockCard}>Flip Stock</button>
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            {/* STOCK */}
            <div>
              <h3>Stock ({stock.length})</h3>
              {/* purely cosmetic facedown card if stock > 0 */}
              {stock.length > 0 ? (
                <CardView
                  card={{ ...stock[0], faceUp: false }}
                  width={80}
                  height={120}
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

            {/* WASTE */}
            <div>
              <h3>Waste</h3>
              {/* Show only the top 3 cards of waste. 
                The newest card is at waste[0], the next at waste[1], etc.
                We'll slice the array to the first 3 items. 
                The user sees up to 3, the rest are "hidden." 
            */}
              {waste.slice(0, 3).map((card, i) => {
                // i=0 is the newest, i=1 is older, i=2 is oldest of the visible group
                // We'll offset them so the newest is separate, older ones behind it
                return (
                  <div
                    key={card.id}
                    style={{
                      marginLeft: i === 0 ? "0px" : "-50px",
                      display: "inline-block",
                      zIndex: 3 - i, // top card = highest zIndex
                    }}
                  >
                    <CardView card={card} width={80} height={120} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <button onClick={autoMoveToFoundation}>Auto Move to Foundation</button>
      </main>
    </DndProvider>
  );
}
