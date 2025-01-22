/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "./CardView.module.css";
import { Card } from "@/lib/deck";
import Heart from "../../../public/icons/heart.svg";
import Diamond from "../../../public/icons/diamond.svg";
import Spade from "../../../public/icons/spade.svg";
import Club from "../../../public/icons/club.svg";

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

function getSuitSymbol(suit: any): any {
  switch (suit) {
    case "hearts":
      return <Heart className={styles.icon} />;
    case "diamonds":
      return <Diamond className={styles.icon} />;
    case "clubs":
      return <Club className={styles.icon} />;
    case "spades":
      return <Spade className={styles.icon} />;
    default:
      return "";
  }
}

function getSuitSymbol2(suit: any): any {
  switch (suit) {
    case "hearts":
      return <Heart className={styles.iconLarge} width={100} height={100} />;
    case "diamonds":
      return <Diamond className={styles.iconLarge} width={100} height={100} />;
    case "clubs":
      return <Club className={styles.iconLarge} width={100} height={100} />;
    case "spades":
      return <Spade className={styles.iconLarge} width={100} height={100} />;
    default:
      return "";
  }
}

function getSuitColor(suit: string): string {
  return suit === "hearts" || suit === "diamonds" ? "#BE3144" : "#257180";
}

interface CardViewProps {
  card: Card;
}

export default function CardView({ card }: CardViewProps) {
  if (!card.faceUp) {
    return <div className={styles.faceDownCardContainer}></div>;
  }

  const rankStr = rankToShortString(card.rank);
  const suitSym = getSuitSymbol(card.suit);
  const suitSym2 = getSuitSymbol2(card.suit);
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
      <div className={styles.suitSymLargeContainer}>
        <div className={styles.suitSymLarge}>{suitSym2}</div>
      </div>
    </div>
  );
}
