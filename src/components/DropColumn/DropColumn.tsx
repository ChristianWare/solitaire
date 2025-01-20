// DropColumn.tsx (or .gtsx)
import React from "react";
import { useDrop } from "react-dnd";
import DraggableCard from "../DraggableCard/DraggableCard";
import { Card } from "../../lib/deck";

interface DropColumnProps {
  colIndex: number;
  columnCards: Card[];
  moveStack: (fromCol: number, fromCardIdx: number, toCol: number) => boolean;
  canPlaceOnTop: (destColumn: Card[], card: Card) => boolean;
  tableau: Card[][];
}

export default function DropColumn({
  colIndex,
  columnCards,
  moveStack,
  canPlaceOnTop,
  tableau,
}: DropColumnProps) {
  const [{ isOver }, drop] = useDrop<
    // item type
    { fromCol: number; fromIndex: number; card: Card },
    void, // drop result
    { isOver: boolean }
  >({
    accept: "CARD",
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    drop: (item) => {
      const { fromCol, fromIndex } = item;
      moveStack(fromCol, fromIndex, colIndex);
    },
    canDrop: (item) => {
      const { card } = item;
      const destColumn = tableau[colIndex];
      return canPlaceOnTop(destColumn, card);
    },
  });

  return (
    <div
      // Type assertion: tell TS that `drop` can be used as a ref
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      style={{
        border: "1px solid #ccc",
        padding: "0.5rem",
        backgroundColor: isOver ? "#afa" : "white",
        minHeight: "200px",
      }}
    >
      <h3>Column {colIndex + 1}</h3>
      {columnCards.map((card, idx) => (
        <div key={card.id} style={{ marginBottom: "-70px" }}>
          <DraggableCard card={card} columnIndex={colIndex} cardIndex={idx} />
        </div>
      ))}
    </div>
  );
}
