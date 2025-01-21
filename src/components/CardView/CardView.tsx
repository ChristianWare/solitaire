"use client";

import styles from "./CardView.module.css";
import React from "react";
import { Card } from "@/lib/deck";

function rankToShortString(rank: number): string {
  switch (rank) {
    case 1:
      return "A";
    case 11:
      return "J";
    case 12:
      return "Q";
    case 13:
      return "K";
    default:
      return rank.toString();
  }
}
function getSuitSymbol(suit: string): string {
  switch (suit) {
    case "hearts":
      return "♥";
    case "diamonds":
      return "♦";
    case "clubs":
      return "♣";
    case "spades":
      return "♠";
    default:
      return "";
  }
}
function getSuitColor(suit: string): string {
  return suit === "hearts" || suit === "diamonds" ? "red" : "black";
}

interface CardViewProps {
  card: Card;
  // width?: number;
  // height?: number;
}

export default function CardView({ card }: CardViewProps) {
  if (!card.faceUp) {
    return (
      <div
        className={styles.faceDownCardContainer}
        // style={{
        //   backgroundColor: "#444",
        //   border: "1px solid #999",
        //   borderRadius: "6px",
        //   display: "flex",
        //   alignItems: "center",
        //   justifyContent: "center",
        //   color: "white",
        //   fontWeight: "bold",
        // }}
      >
        {/* Face Down */}
      </div>
    );
  }

  const rankStr = rankToShortString(card.rank);
  const suitSym = getSuitSymbol(card.suit);
  const suitColor = getSuitColor(card.suit);

  return (
    <div
      className={styles.faceUpCardContainer}
      style={{
        color: suitColor,
      }}
    >
      <div className={styles.rankStrSuitSymContainer}>
        <span
          className={styles.rankStr}
          style={{
            color: suitColor,
          }}
        >
          {rankStr}
        </span>
        <span
          className={styles.suitSymSmall}
          style={{
            color: suitColor,
          }}
        >
          {suitSym}
        </span>
      </div>

      {/* Center suit symbol */}
      <div className={styles.suitSymLarge}>{suitSym}</div>

      <div className={styles.rankStrSuitSymContainer2}>
        <span
          className={styles.rankStr2}
          style={{
            color: suitColor,
          }}
        >
          {rankStr}
        </span>
        <span
          className={styles.suitSymSmall2}
          style={{
            color: suitColor,
          }}
        >
          {suitSym}
        </span>
      </div>
    </div>
  );
}
