import { Card } from "@/lib/deck";
import DraggableCard from "../DraggableCard/DraggableCard";
import styles from "./Waste.module.css";

interface WasteProps {
  waste: Card[];
  onDoubleClickCard: (fromCol: number, fromCardIdx: number) => void;
}

export default function Waste({ waste, onDoubleClickCard }: WasteProps) {
  return (
    <section className={styles.container}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div>
        {waste.slice(0, 1).map((card, index) => (
          <div key={card.id} onDoubleClick={() => onDoubleClickCard(-1, index)}>
            <DraggableCard card={card} columnIndex={-1} cardIndex={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
