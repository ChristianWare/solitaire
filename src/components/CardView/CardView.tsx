"use client";

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
  width?: number;
  height?: number;
}

export default function CardView({
  card,
  width = 80,
  height = 120,
}: CardViewProps) {
  if (!card.faceUp) {
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: "#444",
          border: "1px solid #999",
          borderRadius: "6px",
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

  const rankStr = rankToShortString(card.rank);
  const suitSym = getSuitSymbol(card.suit);
  const suitColor = getSuitColor(card.suit);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "white",
        border: "1px solid #999",
        borderRadius: "6px",
        position: "relative",
        color: suitColor,
        fontFamily: "sans-serif",
      }}
    >
      {/* Top-left corner */}
      <div
        style={{
          position: "absolute",
          top: "4px",
          left: "4px",
          fontSize: "0.8rem",
          lineHeight: "1.1rem",
        }}
      >
        {rankStr}
        <br />
        {suitSym}
      </div>

      {/* Center suit symbol */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "1.4rem",
        }}
      >
        {suitSym}
      </div>

      {/* Bottom-right corner (rotated 180°) */}
      <div
        style={{
          position: "absolute",
          bottom: "4px",
          right: "4px",
          fontSize: "0.8rem",
          lineHeight: "1.1rem",
          transform: "rotate(180deg)",
        }}
      >
        {rankStr}
        <br />
        {suitSym}
      </div>
    </div>
  );
}
