/* eslint-disable react/jsx-key */
import styles from "./Marquee.module.css";
import Heart from "../../../public/icons/heart.svg";
import Diamond from "../../../public/icons/diamond.svg";
import Spade from "../../../public/icons/spade.svg";
import Club from "../../../public/icons/club.svg";

const icons = [
  <Heart width={30} height={30} />,
  <Diamond width={30} height={30} />,
  <Spade width={30} height={30} />,
  <Club width={30} height={30} />,
];

export default function Marquee() {
  return (
    <div className={styles.container}>
      <h2>Marquee</h2>
    </div>
  );
}
