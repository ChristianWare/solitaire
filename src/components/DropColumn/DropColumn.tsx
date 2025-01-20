"use client";

import React from "react";
import { useDrop } from "react-dnd";
import DraggableCard from "@/components/DraggableCard/DraggableCard";
import { Card } from "@/lib/deck";

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
  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: "CARD",
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    drop: (item) => {
      const { fromCol, fromIndex } = item;
      moveStack(fromCol, fromIndex, colIndex);
    },
    canDrop: (item) => {
      const destColumn = tableau[colIndex];
      return canPlaceOnTop(destColumn, item.card);
    },
  });

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      style={{
        border: "1px solid #ccc",
        padding: "0.5rem",
        backgroundColor: isOver ? "#afa" : "white",
        minHeight: "200px",
      }}
    >
      <h3>Column {colIndex + 1}</h3>
      {columnCards.map((card, idx) => (
        <div
          key={card.id}
          style={{ marginBottom: "-70px" }}
          onDoubleClick={() => onDoubleClickCard(colIndex, idx)}
        >
          {card.faceUp ? (
            <DraggableCard card={card} columnIndex={colIndex} cardIndex={idx} />
          ) : (
            <div
              style={{
                width: "80px",
                height: "120px",
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
              Face Down
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
