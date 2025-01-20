"use client";

import styles from "./CardView.module.css";
import { Card } from "@/lib/deck";

function rankToString(rank: number): string {
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
      return rank.toString(); // 2..10
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

interface CardProps {
  card: Card;
  width?: number; // optional width, default 80
  height?: number; // optional height, default 120
}

export default function CardView({
  card,
  width = 80,
  height = 120,
}: CardProps) {
  // If card is face-down, show a distinct design (e.g., a colored back)
  if (!card.faceUp) {
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: "#444", // or any color/pattern
          border: "1px solid #999",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {/* Face Down */}
      </div>
    );
  }

  // Face-up styling
  const rankStr = rankToString(card.rank);
  const suitSymbol = getSuitSymbol(card.suit);
  const suitColor = getSuitColor(card.suit);

  return (
    <div
      className={`${styles.cardContainer} ${styles.faceUp}`}
      style={{ color: suitColor }}
    >
      <div className={styles.topLeft}>
        {rankStr}
        <br />
        {suitSymbol}
      </div>

      {/* Center suit symbol */}
      <div className={styles.center}>{suitSymbol}</div>

      {/* Bottom-right corner */}
      <div className={styles.bottomRight}>
        {rankStr}
        <br />
        {suitSymbol}
      </div>
    </div>
  );
}
