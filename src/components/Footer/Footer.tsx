import LayoutWrapper from "../LayoutWrapper";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.parent}>
      <LayoutWrapper>
        <footer className={styles.container}>
          <div className={styles.bottom}>
            <div className={styles.logoii}>klondike solitaire 2025</div>
            <ul className={styles.disclosures}>
              <li className={styles.disc}>
                Designed & Developed by Chris Ware
              </li>
            </ul>
          </div>
        </footer>
      </LayoutWrapper>
    </div>
  );
};
export default Footer;
