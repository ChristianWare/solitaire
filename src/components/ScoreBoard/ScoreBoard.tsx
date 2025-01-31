import styles from "./ScoreBoard.module.css";

interface ScoreBoardProps {
  score: number;
  moves: number;
  time: number;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean; // Add this prop
}

export default function ScoreBoard({
  score,
  moves,
  time,
  onNewGame,
  onUndo,
  canUndo,
}: ScoreBoardProps) {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        Score: {score} | Moves: {moves} | Time: {time}s
        <button onClick={onNewGame}>New Game</button>
        <button onClick={onUndo} disabled={!canUndo}>
          Undo
        </button>
      </div>
    </section>
  );
}
