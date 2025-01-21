import styles from "./ScoreBoard.module.css";

interface ScoreBoardProps {
  score: number;
  moves: number;
  time: number;
}

export default function ScoreBoard({ score, moves, time }: ScoreBoardProps) {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        Score: {score} | Moves: {moves} | Time: {time}s
      </div>
    </section>
  );
}
