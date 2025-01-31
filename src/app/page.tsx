"use client";

import styles from "./HomePage.module.css";
import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Card, createDeck, shuffleDeck } from "@/lib/deck";
import { dealTableau } from "@/lib/deal";

import Tableau from "@/components/Tableau/Tableau";
import ScoreBoard from "@/components/ScoreBoard/ScoreBoard";
import Foundations from "@/components/Foundations/Foundations";
import Waste from "@/components/Waste/Waste";
import Stock from "@/components/Stock/Stock";
import Hero from "@/components/Hero/Hero";
import LayoutWrapper from "@/components/LayoutWrapper";
import Marquee from "@/components/Marquee/Marquee";
import HowToPlay from "@/components/HowToPlay/HowToPlay";
import Footer from "@/components/Footer/Footer";
import { ReactLenis } from "@studio-freight/react-lenis";

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
  const [waste, setWaste] = useState<Card[]>([]);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

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
    setStock(freshDeck.slice(dealtCardsCount));
    setWaste([]);
    setFoundations({ hearts: [], diamonds: [], clubs: [], spades: [] });
  }

  // ---------------------------
  // 4) FLIP STOCK
  // ---------------------------
  function flipStockCard() {
    if (stock.length > 0) {
      const [nextCard, ...rest] = stock;
      nextCard.faceUp = true;
      const newWaste = [nextCard, ...waste];
      setStock(rest);
      setWaste(newWaste);
      setMoves((m) => m + 1);
      setScore((s) => s - 5);
    } else {
      if (waste.length > 0) {
        const recycled = waste.map((card) => {
          card.faceUp = false;
          return card;
        });
        setStock(recycled);
        setWaste([]);
      }
    }
  }

  // ---------------------------
  // 5) AUTO-MOVE TO FOUNDATIONS
  // ---------------------------
  // function autoMoveToFoundation() {
  //   let moved = false;
  //   const newTableau = [...tableau];
  //   const newFoundations = { ...foundations };

  //   for (let colIdx = 0; colIdx < newTableau.length; colIdx++) {
  //     const column = newTableau[colIdx];
  //     if (column.length === 0) continue;
  //     const topCard = column[column.length - 1];
  //     if (canMoveToFoundation(topCard)) {
  //       column.pop();
  //       newFoundations[topCard.suit] = [
  //         ...newFoundations[topCard.suit],
  //         topCard,
  //       ];
  //       if (column.length > 0 && !column[column.length - 1].faceUp) {
  //         column[column.length - 1].faceUp = true;
  //       }
  //       moved = true;
  //       setScore((s) => s + 10);
  //       setMoves((m) => m + 1);
  //     }
  //   }

  //   setTableau(newTableau);
  //   setFoundations(newFoundations);

  //   if (moved) {
  //     setTimeout(autoMoveToFoundation, 200);
  //   }
  //   checkWinCondition();
  // }

  // function canMoveToFoundation(card: Card): boolean {
  //   const suitStack = foundations[card.suit];
  //   if (suitStack.length === 0) {
  //     return card.rank === 1;
  //   }
  //   const topCard = suitStack[suitStack.length - 1];
  //   return card.rank === topCard.rank + 1;
  // }

  // ---------------------------
  // 6) MOVING CARDS => TABLEAU
  // ---------------------------
function moveStack(
  fromCol: number,
  fromCardIdx: number,
  toCol: number
): boolean {
  // Save current state to history
  setHistory((prev) => [
    ...prev,
    {
      tableau: JSON.parse(JSON.stringify(tableau)), // Deep copy
      foundations: JSON.parse(JSON.stringify(foundations)),
      stock: JSON.parse(JSON.stringify(stock)),
      waste: JSON.parse(JSON.stringify(waste)),
      score,
      moves,
    },
  ]);

  // Existing logic for moving cards
  if (fromCol === toCol) return false;

  if (fromCol >= 0) {
    const sourceColumn = [...tableau[fromCol]];
    if (fromCardIdx < 0 || fromCardIdx >= sourceColumn.length) return false;
    const movingStack = sourceColumn.slice(fromCardIdx);
    if (movingStack.length === 0) return false;
    const cardToMove = movingStack[0];
    if (!cardToMove) return false;
    const destColumn = [...tableau[toCol]];
    if (!canPlaceOnTop(destColumn, cardToMove)) return false;

    sourceColumn.splice(fromCardIdx, movingStack.length);
    destColumn.push(...movingStack);
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
  } else if (fromCol === -1) {
    const wasteCopy = [...waste];
    if (wasteCopy.length === 0) return false;
    const cardToMove = wasteCopy[0];
    wasteCopy.shift();
    setWaste(wasteCopy);
    const newTableau = [...tableau];
    if (toCol < 0 || toCol >= newTableau.length) return false;
    const destColumn = [...newTableau[toCol]];
    if (!canPlaceOnTop(destColumn, cardToMove)) return false;
    destColumn.push(cardToMove);
    newTableau[toCol] = destColumn;
    setTableau(newTableau);
    setMoves((m) => m + 1);
    setScore((s) => s + 1);
    return true;
  }
  return false;
}

function canPlaceOnTop(destColumn: Card[], card: Card) {
  if (destColumn.length === 0) {
    return card.rank === 13; // Only Kings can be placed on empty columns
  }

  const topCard = destColumn[destColumn.length - 1];
  const differentColor =
    (topCard.suit === "hearts" || topCard.suit === "diamonds") !==
    (card.suit === "hearts" || card.suit === "diamonds");

  return differentColor && card.rank === topCard.rank - 1;
}

  // ---------------------------
  // 7) MOVING CARDS => FOUNDATIONS
  // ---------------------------
  function moveToFoundation(
    fromCol: number,
    fromCardIdx: number,
    suit: keyof Foundations
  ): boolean {
    let cardToMove: Card | undefined;

    if (fromCol >= 0) {
      const sourceColumn = [...tableau[fromCol]];
      if (fromCardIdx < 0 || fromCardIdx >= sourceColumn.length) return false;
      const movingStack = sourceColumn.slice(fromCardIdx);
      if (movingStack.length === 0) return false;
      cardToMove = movingStack[0];
      sourceColumn.splice(fromCardIdx, movingStack.length);
      if (
        sourceColumn.length > 0 &&
        !sourceColumn[sourceColumn.length - 1].faceUp
      ) {
        sourceColumn[sourceColumn.length - 1].faceUp = true;
      }
      const newTableau = [...tableau];
      newTableau[fromCol] = sourceColumn;
      setTableau(newTableau);
    } else if (fromCol === -1) {
      const wasteCopy = [...waste];
      if (wasteCopy.length === 0) return false;
      cardToMove = wasteCopy[0];
      wasteCopy.shift();
      setWaste(wasteCopy);
    }

    if (!cardToMove) return false;
    if (!canPlaceOnFoundationSuit(suit, cardToMove)) return false;

    const newFoundations = { ...foundations };
    newFoundations[suit] = [...newFoundations[suit], cardToMove];
    setFoundations(newFoundations);

    setMoves((m) => m + 1);
    setScore((s) => s + 10);

    checkWinCondition();
    return true;
  }

  function canPlaceOnFoundationSuit(
    suit: keyof Foundations,
    card: Card
  ): boolean {
    if (card.suit !== suit) return false;
    const pile = foundations[suit];
    if (pile.length === 0) {
      return card.rank === 1;
    }
    const topCard = pile[pile.length - 1];
    return card.rank === topCard.rank + 1;
  }

  // ---------------------------
  // 8) CHECK WIN CONDITION
  // ---------------------------
  function checkWinCondition() {
    const totalInFoundations =
      foundations.hearts.length +
      foundations.diamonds.length +
      foundations.clubs.length +
      foundations.spades.length;

    if (totalInFoundations === 52) {
      alert("Congratulations! You've completed the game!");
      startNewGame();
    }
  }

  // ---------------------------
  // 9) DOUBLE-CLICK FUNCTIONALITY
  // ---------------------------
  function handleDoubleClickCard(fromCol: number, fromCardIdx: number) {
    let card: Card | undefined;

    // Check if clicking from tableau and card is topmost
    if (fromCol >= 0) {
      const column = tableau[fromCol];
      if (fromCardIdx !== column.length - 1) return; // Only top card can move
      card = column[fromCardIdx];
    }
    // Check if clicking from waste (only top card exists)
    else if (fromCol === -1) {
      if (fromCardIdx !== 0) return; // Waste only has one visible card
      card = waste[0];
    }

    if (!card || !card.faceUp) return;

    // Check foundation placement and move
    const targetSuit = card.suit as keyof Foundations;
    if (canPlaceOnFoundationSuit(targetSuit, card)) {
      moveToFoundation(fromCol, fromCardIdx, targetSuit);
    }
  }

  const [history, setHistory] = useState<
    {
      tableau: Card[][];
      foundations: Foundations;
      stock: Card[];
      waste: Card[];
      score: number;
      moves: number;
    }[]
  >([]);

  function undoMove() {
    if (history.length === 0) return; // No moves to undo

    // Get the previous state
    const previousState = history[history.length - 1];

    // Revert to the previous state
    setTableau(previousState.tableau);
    setFoundations(previousState.foundations);
    setStock(previousState.stock);
    setWaste(previousState.waste);
    setScore(previousState.score);
    setMoves(previousState.moves);

    // Remove the last state from history
    setHistory((prev) => prev.slice(0, -1));
  }

  return (
    <ReactLenis root>
      <DndProvider backend={HTML5Backend}>
        <main>
          <Hero />
          <Marquee />
          <HowToPlay />
          <Marquee />
          <section className={styles.gameBoard}>
            <LayoutWrapper>
              <ScoreBoard
                score={score}
                moves={moves}
                time={time}
                onNewGame={startNewGame}
                onUndo={undoMove}
              />{" "}
              <div className={styles.top}>
                <div className={styles.foundationsArea}>
                  <Foundations
                    foundations={foundations}
                    canPlaceOnFoundation={canPlaceOnFoundationSuit}
                    moveToFoundation={moveToFoundation}
                  />
                </div>
                <div className={styles.wasteArea}>
                  <Waste
                    waste={waste}
                    onDoubleClickCard={handleDoubleClickCard}
                  />
                </div>
                <div className={styles.stockArea}>
                  <Stock flipStockCard={flipStockCard} />
                </div>
              </div>
              <Tableau
                tableau={tableau}
                moveStack={moveStack}
                canPlaceOnTop={canPlaceOnTop}
                onDoubleClickCard={handleDoubleClickCard}
              />
              {/* <button onClick={autoMoveToFoundation}>
            Auto Move to Foundation
          </button> */}
            </LayoutWrapper>
          </section>
          <Footer />
        </main>
      </DndProvider>
    </ReactLenis>
  );
}
