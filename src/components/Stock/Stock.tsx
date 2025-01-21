import { Card } from "@/lib/deck";
import styles from "./Stock.module.css";
import CardView from "../CardView/CardView";

interface StockProps {
  stock: Card[];
  flipStockCard: () => void;
}

export default function Stock({ stock, flipStockCard }: StockProps) {
  return (
    <section className={styles.container}>
      <button onClick={flipStockCard}>Flip Stock</button>
      <div style={{ marginTop: "1rem" }}>
        <h3>Stock ({stock.length})</h3>
        {stock.length > 0 ? (
          <CardView card={{ ...stock[0], faceUp: false }} />
        ) : (
          <div
            style={{
              width: "80px",
              height: "120px",
              border: "1px dashed #999",
            }}
          />
        )}
      </div>
    </section>
  );
}
