"use client";

import styles from "./DropColumn.module.css";
import { useDrop } from "react-dnd";
import DraggableCard from "@/components/DraggableCard/DraggableCard";
import { Card } from "@/lib/deck";
import { useEffect, useRef } from "react";

interface DropColumnProps {
  colIndex: number;
  columnCards: Card[];
  moveStack: (fromCol: number, fromCardIdx: number, toCol: number) => boolean;
  canPlaceOnTop: (destColumn: Card[], card: Card) => boolean;
  tableau: Card[][];
  onDoubleClickCard: (fromCol: number, fromCardIdx: number) => void;
}

interface DragItem {
  fromCol: number;
  fromIndex: number;
  card: Card;
  type: string;
}

export default function DropColumn({
  colIndex,
  columnCards,
  moveStack,
  canPlaceOnTop,
  tableau,
  onDoubleClickCard,
}: DropColumnProps) {
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: "CARD",
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    drop: (item) => {
      const { fromCol, fromIndex } = item;
      if (fromCol !== colIndex) {
        // Prevent self-drops
        moveStack(fromCol, fromIndex, colIndex);
      }
    },
    canDrop: (item) => {
      const destColumn = tableau[colIndex];
      return canPlaceOnTop(destColumn, item.card);
    },
  });

  useEffect(() => {
    drop(dropRef);
  }, [drop]);

  return (
    <div
      className={styles.container}
      ref={dropRef}
      style={{
        backgroundColor: isOver ? "rgba(175, 255, 175, 0.3)" : "",
        minHeight: "775px",
      }}
    >
      {columnCards.map((card, idx) => (
        <div
          key={card.id}
          className={styles.cardWrapper}
          style={{ marginBottom: card.faceUp ? "-205px" : "-240px" }} // Conditional margin
          onDoubleClick={() => onDoubleClickCard(colIndex, idx)}
        >
          {card.faceUp ? (
            <DraggableCard card={card} columnIndex={colIndex} cardIndex={idx} />
          ) : (
            <div className={styles.faceDownCard}></div>
          )}
        </div>
      ))}
    </div>
  );
}
