// DraggableCard.tsx

import React from "react";
import { useDrag } from "react-dnd";
import CardView from "@/components/CardView/CardView"; // example import
import { Card } from "../../lib/deck";

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
  // Here we specify our item type and the data we'll pass when dragging
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD", // must match "accept" in your drop target
    item: {
      fromCol: columnIndex,
      fromIndex: cardIndex,
      card,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      // Type assertion: tell TypeScript that "drag" can be used as a ref
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: card.faceUp ? "grab" : "default",
      }}
    >
      <CardView card={card} width={80} height={120} />
    </div>
  );
}
