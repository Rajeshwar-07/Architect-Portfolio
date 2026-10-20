import React, { useState, useEffect } from 'react';
import { visitorsApi } from '../services/api';
import styles from './EmailGate.module.css';

const STORAGE_KEY = 'portfolio_visitor_email';

/**
 * EmailGate component.
 *
 * Shows a subtle modal/overlay asking the visitor for their email
 * the FIRST time they visit the portfolio.
 * Once submitted (or dismissed), the email is saved to localStorage
 * so the prompt does not appear again on return visits.
 *
 * The email is sent to the backend for storage.
 */
export default function EmailGate() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  useEffect(() => {
    // Check if visitor already provided email
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Delay prompt slightly so the page renders first
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const validateEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await visitorsApi.track(email);
      localStorage.setItem(STORAGE_KEY, email);
      setDone(true);
      setTimeout(() => setVisible(false), 1200);
    } catch (err) {
      // Still dismiss gracefully — don't block the visitor
      localStorage.setItem(STORAGE_KEY, email);
      setDone(true);
      setTimeout(() => setVisible(false), 1200);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Mark as seen even if skipped (don't ask again)
    localStorage.setItem(STORAGE_KEY, 'skipped');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Stay in touch">
      <div className={styles.card}>
        {done ? (
          <div className={styles.successState}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="11" stroke="#1a1a1a" strokeWidth="1.5"/>
              <path d="M7 12.5l3.5 3.5L17 9" stroke="#1a1a1a" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>Thank you!</p>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>Stay connected</h2>
              <p className={styles.subtitle}>
                Leave your email to receive updates on new projects and design work.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.inputRow}>
                <input
                  type="email"
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                  autoFocus
                  aria-label="Email address"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'email-error' : undefined}
                />
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? '…' : 'Submit'}
                </button>
              </div>
              {error && (
                <p id="email-error" className={styles.errorMsg} role="alert">
                  {error}
                </p>
              )}
            </form>

            <button className={styles.skipBtn} onClick={handleSkip} type="button">
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
