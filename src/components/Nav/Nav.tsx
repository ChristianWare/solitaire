"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import styles from "./Nav.module.css";
import Logo from "../Logo/Logo";

const navItems = [
  { text: "How to play", href: "/#about" },
  { text: "Play Now", href: "/#resume" },
];

const navItemsii = [
  {
    text: "Github",
    href: "https://github.com/ChristianWare",
    target: "_blank",
  },
  { text: "Contact", href: "/#contact" },
];

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  const openMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={styles.header} ref={navRef}>
      <div className={styles.logoContainerMobile}>
        <Logo />
      </div>
      <nav className={styles.navbar}>
        <div
          className={
            isOpen === false
              ? styles.navMenu
              : `${styles.navMenu} ${styles.active}`
          }
          onClick={openMenu}
        >
          <div className={styles.logoContainer}>
            <Logo />
          </div>
          <ul className={styles.navItems}>
            {navItems.map((navItem, index) => (
              <li
                key={index}
                className={styles.navItem}
                onClick={() => setIsOpen(false)}
              >
                <Link href={navItem.href}>{navItem.text}</Link>
              </li>
            ))}
          </ul>
          <ul className={styles.navItemsii}>
            {navItemsii.map((navItem, index) => (
              <li
                key={index}
                className={styles.navItem}
                onClick={() => setIsOpen(false)}
              >
                <Link href={navItem.href} target={navItem.target}>
                  {navItem.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.hamburgerParent}>
          <div
            className={
              isOpen === false
                ? styles.hamburger
                : `${styles.hamburger} ${styles.active}`
            }
            onClick={openMenu}
          >
            <span className={styles.whiteBar}></span>
            <span className={styles.whiteBar}></span>
            <span className={styles.whiteBar}></span>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
