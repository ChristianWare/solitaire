import styles from "./HowToPlay.module.css";
import LayoutWrapper from "../LayoutWrapper";
import Spade from "../../../public/icons/spade.svg";
import Diamond from "../../../public/icons/diamond.svg";
import Club from "../../../public/icons/club.svg";
import Heart from "../../../public/icons/heart.svg";

const instructions = [
  {
    icon: <Spade width={25} height={25} />,
    feature: "Setup the Game",
    desc: "Shuffle the deck thoroughly. Deal seven columns of cards, placing one card face-up at the bottom of each column and filling remaining spots with face-down cards as needed, following the standard Solitaire layout.",
  },
  {
    icon: <Diamond width={25} height={25} />,
    feature: "Reveal and Organize",
    desc: "Begin uncovering face-down cards by moving available face-up cards. Build descending sequences in alternating colors within the tableau columns, moving entire sequences or single cards as the rules allow.",
  },
  {
    icon: <Club width={25} height={25} />,
    feature: "Use Foundations and Free Cells",
    desc: "Move cards to the foundation piles starting with Aces, building up in suit from Ace to King. If no moves are possible within the tableau, draw from the stock or use free cells (if playing a FreeCell variant) to reorganize cards.",
  },
  {
    icon: <Heart width={25} height={25} />,
    feature: "Complete the Game",
    desc: "Continue playing by uncovering new cards, organizing tableau columns, and moving cards to foundations. The game is won when all cards are successfully moved to the four foundation piles in ascending order from Ace to King.",
  },
];

export default function HowToPlay() {
  return (
    <div className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <h2 className={styles.topHeading}>How To Play</h2>
          <div className={styles.top}>
            <div className={styles.topLeft}>
              <h3 className={styles.heading}>
                Solitaire is a classic card game where the primary goal is to
                organize a shuffled deck into four foundation piles, one for
                each suit, building each from Ace through King. Players achieve
                this by strategically moving cards between the tableau columns
                and drawing from the stockpile, following the rules of
                descending order and alternating colors.
                <br />
                <br />
                
                 The challenge lies in
                uncovering hidden cards, planning moves ahead, and using limited
                free spaces effectively to reveal and reposition cards. Success
                is reached when all cards are correctly placed onto the
                foundation piles, reflecting both a strategic approach and
                careful planning.
              </h3>
            </div>
            <div className={styles.topRight}></div>
          </div>
          <div className={styles.bottom}>
            {instructions.map((x, index) => (
              <div key={index} className={styles.box}>
                <span className={styles.index}>{x.icon}</span>
                <h4 className={styles.feature}>{x.feature}</h4>
                <p className={styles.desc}>{x.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
