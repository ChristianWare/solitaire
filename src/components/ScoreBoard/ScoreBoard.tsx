import styles from "./ScoreBoard.module.css";

interface ScoreBoardProps {
  score: number;
  moves: number;
  time: number;
  onNewGame: () => void;
  onUndo: () => void;
}

export default function ScoreBoard({
  score,
  moves,
  time,
  onNewGame,
  onUndo,
}: ScoreBoardProps) {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        Score: {score} | Moves: {moves} | Time: {time}s
        <button onClick={onNewGame}>New Game</button>
        <button onClick={onUndo} disabled={history.length === 0}>
          Undo
        </button>
      </div>
    </section>
  );
}
