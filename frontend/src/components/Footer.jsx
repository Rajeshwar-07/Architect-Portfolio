import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.name}>Arjun Mehta</span>
          <span className={styles.tagline}>Architecture &amp; Design</span>
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          <Link to="/portfolio">Work</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <span className={styles.copy}>
          &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
