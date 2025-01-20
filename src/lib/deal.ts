import { Card } from "./deck";

export function dealTableau(deck: Card[]): Card[][] {
  const tableau: Card[][] = [[], [], [], [], [], [], []];
  let index = 0;

  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck[index];
      if (row === col) {
        // The top card (last in each column) is face up
        card.faceUp = true;
      }
      tableau[col].push(card);
      index++;
    }
  }
  return tableau;
}
