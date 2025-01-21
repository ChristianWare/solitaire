"use client";

import React from "react";
import { useDrag } from "react-dnd";
import CardView from "@/components/CardView/CardView";
import { Card } from "@/lib/deck";

interface DraggableCardProps {
  card: Card;
  columnIndex: number; // if -1 => from waste, else from a tableau col
  cardIndex: number; // index in that column or waste
}

export default function DraggableCard({
  card,
  columnIndex,
  cardIndex,
}: DraggableCardProps) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
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
  }));

  return (
    <div
      ref={dragRef as unknown as React.Ref<HTMLDivElement>}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: card.faceUp ? "grab" : "default",
      }}
    >
      <CardView card={card} />
    </div>
  );
}
