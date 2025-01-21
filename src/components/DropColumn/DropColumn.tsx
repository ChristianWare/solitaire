"use client";

import styles from "./DropColumn.module.css";
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
      className={styles.container}
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      style={{
        // border: "1px solid #ccc",
        // padding: "0.5rem",
        backgroundColor: isOver ? "#afa" : "white",
        // minHeight: "200px",
      }}
    >
      {columnCards.map((card, idx) => (
        <div
          key={card.id}
          style={{ marginBottom: "-205px" }}
          onDoubleClick={() => onDoubleClickCard(colIndex, idx)}
        >
          {card.faceUp ? (
            <DraggableCard card={card} columnIndex={colIndex} cardIndex={idx} />
          ) : (
            <div
            className={styles.faceDownCard}
              style={{
                height: "260px",
                // backgroundColor: "#444",
                // border: "1px solid #999",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              <div className={styles.pattern}></div>
              
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
