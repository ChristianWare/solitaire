import styles from "./Foundations.module.css";
import FoundationPile from "@/components/FoundationPile/FoundationPile";
import { Card } from "@/lib/deck";

interface FoundationsProps {
  foundations: {
    hearts: Card[];
    diamonds: Card[];
    clubs: Card[];
    spades: Card[];
  };
  canPlaceOnFoundation: (
    suit: keyof FoundationsProps["foundations"],
    card: Card
  ) => boolean;
  moveToFoundation: (
    fromCol: number,
    fromCardIdx: number,
    suit: keyof FoundationsProps["foundations"]
  ) => boolean;
}

export default function Foundations({
  foundations,
  canPlaceOnFoundation,
  moveToFoundation,
}: FoundationsProps) {
  const isOverGlobal = () => false;

  return (
    <section className={styles.container}>
      {Object.entries(foundations).map(([foundationSuit, cards]) => (
        <FoundationPile
          key={foundationSuit}
          suit={foundationSuit as keyof FoundationsProps["foundations"]}
          cards={cards}
          isOverGlobal={isOverGlobal}
          canPlaceOnFoundation={canPlaceOnFoundation}
          moveToFoundation={moveToFoundation}
        />
      ))}
    </section>
  );
}
