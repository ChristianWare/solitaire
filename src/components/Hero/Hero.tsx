import LayoutWrapper from "../LayoutWrapper";
import Nav from "../Nav/Nav";
import styles from "./Hero.module.css";

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
      </LayoutWrapper>
    </section>
  );
};
export default Hero;
