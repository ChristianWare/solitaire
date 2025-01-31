"use client";

import React from "react";
import { useDrag } from "react-dnd";
import CardView from "@/components/CardView/CardView";
import { Card } from "@/lib/deck";
import styles from "./DraggableCard.module.css"; // Create this CSS module

interface DraggableCardProps {
  card: Card;
  columnIndex: number;
  cardIndex: number;
}

export default function DraggableCard({
  card,
  columnIndex,
  cardIndex,
}: DraggableCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: {
      fromCol: columnIndex,
      fromIndex: cardIndex,
      card,
      type: "CARD",
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    options: {
      dropEffect: "move",
    },
  }));

  // Use a callback ref to connect the drag source
  const dragRef = (node: HTMLDivElement | null) => {
    drag(node);
  };

  return (
    <div
      ref={dragRef} // Use the callback ref here
      className={styles.draggableContainer}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? "none" : "translate(0, 0)",
        cursor: card.faceUp ? "grab" : "default",
      }}
    >
      <CardView card={card} />
    </div>
  );
}