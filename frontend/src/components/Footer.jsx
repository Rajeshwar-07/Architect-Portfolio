import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.brandName}>Anand Sherkar</Link>
          <p className={styles.brandTagline}>Architect · Pune, Maharashtra</p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <Link to="/portfolio" className={styles.link}>Work</Link>
          <Link to="/about"     className={styles.link}>About</Link>
          <Link to="/contact"   className={styles.link}>Contact</Link>
        </nav>

        <div className={styles.social}>
          <a href="https://www.instagram.com/rachnaangan_studio"
             target="_blank" rel="noopener noreferrer"
             className={styles.socialLink} aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
          </a>
          <a href="tel:+917397815054" className={styles.socialLink} aria-label="Phone">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </a>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className="container">
          <p>© {year} Anand Sherkar · Rachnaangan Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
