import LayoutWrapper from "../LayoutWrapper";
import Nav from "../Nav/Nav";
import styles from "./Hero.module.css";
// import Heart from "../../../public/icons/heart.svg";
// import Diamond from "../../../public/icons/diamond.svg";
// import Spade from "../../../public/icons/spade.svg";
// import Club from "../../../public/icons/club.svg";

const Hero = () => {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <div className={styles.navContainer}>
          <Nav />
        </div>
      </LayoutWrapper>
      <LayoutWrapper>
        <div className={styles.copy}>Chris Ware&apos;s</div>
        <h1 className={styles.heading}>solitaire</h1>
        {/* <div className={styles.iconContainer}>
          <Heart width={100} height={100} />
          <Spade width={100} height={100} />
          <Diamond width={100} height={100} />
          <Club width={100} height={100} />
        </div> */}
      </LayoutWrapper>
    </section>
  );
};
export default Hero;
