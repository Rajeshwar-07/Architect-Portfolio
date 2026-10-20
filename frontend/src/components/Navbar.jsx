import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Work',    to: '/portfolio' },
  { label: 'About',   to: '/about' },
  { label: 'Contact', to: '/contact' },
];

/**
 * Top navigation bar.
 * Minimal — logo left, nav links right, solid on scroll.
 */
export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Brand */}
        <Link to="/" className={styles.brand}>
          <span className={styles.brandName}>Arjun Mehta</span>
          <span className={styles.brandTitle}>Architect</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.navLink} ${location.pathname.startsWith(to) ? styles.active : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barTopOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barMidOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barBotOpen : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.mobileLink} ${location.pathname.startsWith(to) ? styles.active : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
