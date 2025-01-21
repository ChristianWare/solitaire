"use client";

import styles from "./Tableau.module.css";
import DropColumn from "@/components/DropColumn/DropColumn";
import { Card } from "@/lib/deck";

interface TableauProps {
  tableau: Card[][];
  moveStack: (fromCol: number, fromCardIdx: number, toCol: number) => boolean;
  canPlaceOnTop: (destColumn: Card[], card: Card) => boolean;
  onDoubleClickCard: (fromCol: number, fromCardIdx: number) => void;
}

export default function Tableau({
  tableau,
  moveStack,
  canPlaceOnTop,
  onDoubleClickCard,
}: TableauProps) {
  return (
    <section className={styles.container}>
      {tableau.map((column, colIdx) => (
        <DropColumn
          key={colIdx}
          colIndex={colIdx}
          columnCards={column}
          moveStack={moveStack}
          canPlaceOnTop={canPlaceOnTop}
          tableau={tableau}
          onDoubleClickCard={onDoubleClickCard}
        />
      ))}
    </section>
  );
}
