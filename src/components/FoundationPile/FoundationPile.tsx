"use client";

import styles from './FoundationPile.module.css'
import { useDrop } from "react-dnd";
import CardView from "@/components/CardView/CardView";
import { Card } from "@/lib/deck";
import { useEffect } from 'react';

interface DragItem {
  fromCol: number;
  fromIndex: number;
  card: Card;
  type: string;
}

interface Foundations {
  hearts: Card[];
  diamonds: Card[];
  clubs: Card[];
  spades: Card[];
}

interface FoundationPileProps {
  suit: keyof Foundations;
  cards: Card[];
  isOverGlobal: (val: boolean) => void;
  canPlaceOnFoundation: (suit: keyof Foundations, card: Card) => boolean;
  moveToFoundation: (
    fromCol: number,
    fromIdx: number,
    suit: keyof Foundations
  ) => boolean;
}

export default function FoundationPile({
  suit,
  cards,
  isOverGlobal,
  canPlaceOnFoundation,
  moveToFoundation,
}: FoundationPileProps) {
  const topCard = cards[cards.length - 1];

  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: "CARD",
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    canDrop: (item) => {
      return canPlaceOnFoundation(suit, item.card);
    },
    drop: (item) => {
      moveToFoundation(item.fromCol, item.fromIndex, suit);
    },
  });

  useEffect(() => {
    isOverGlobal(isOver);
  }, [isOver, isOverGlobal]);

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>} // <--- Type assertion here
      style={{
        width: "100%",
        height: "260px",
        border: isOver ? "2px solid green" : "",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      
      {topCard ? (
        <CardView card={topCard} />
      ) : (
        <div className={styles.empty}>
          A
        </div>
      )}
    </div>
  );
}
