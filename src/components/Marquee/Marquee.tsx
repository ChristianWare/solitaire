import styles from "./Marquee.module.css";
import Heart from "../../../public/icons/heart.svg";
import Diamond from "../../../public/icons/diamond.svg";
import Spade from "../../../public/icons/spade.svg";
import Club from "../../../public/icons/club.svg";

export default function Marquee() {
  const icons = (
    <div className={styles.iconContainer}>
      <Heart width={25} height={25} />
      <Diamond width={25} height={25} />
      <Spade width={25} height={25} />
      <Club width={25} height={25} />
    </div>
  );

  return (
    <div className={styles.slider}>
      <div className={styles.track}>
        {[...Array(10)].map((_, index) => (
          <div key={index} className={styles.arrayItems}>
            {icons}
            {icons}
            {icons}
            {icons}
          </div>
        ))}
      </div>
    </div>
  );
}
