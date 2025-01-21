import styles from "./Stock.module.css";

interface StockProps {
  // stock: Card[];
  flipStockCard: () => void;
}

export default function Stock({ flipStockCard }: StockProps) {
  return (
    <section className={styles.container} onClick={flipStockCard}>
    </section>
  );
}
