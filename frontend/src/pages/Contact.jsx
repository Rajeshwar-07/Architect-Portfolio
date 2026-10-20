import React, { useState } from 'react';
import styles from './Contact.module.css';

/**
 * Contact page.
 * Simple contact form (frontend-only for now) + contact details.
 */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    // TODO: Wire to a backend email endpoint or a service like EmailJS.
    // For now, simulate success.
    setSent(true);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.layout}>

          {/* Left: contact details */}
          <div className={styles.infoCol}>
            <p className={styles.eyebrow}>Contact</p>
            <h1 className={styles.heading}>Let's talk.</h1>
            <p className={styles.intro}>
              Have a project in mind, a question, or just want to say hello?
              Reach out — I'd love to hear from you.
            </p>

            <dl className={styles.details}>
              <div className={styles.detailRow}>
                <dt>Studio</dt>
                <dd>Mumbai, Maharashtra, India</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:hello@arjunmehta.in">hello@arjunmehta.in</a>
                </dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Instagram</dt>
                <dd>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    @arjunmehta.arch
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Right: form */}
          <div className={styles.formCol}>
            {sent ? (
              <div className={styles.successMsg}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="11" stroke="#1a1a1a" strokeWidth="1.5"/>
                  <path d="M7 12.5l3.5 3.5L17 9" stroke="#1a1a1a" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Your message has been sent. I'll be in touch soon.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.fieldGroup}>
                  <label htmlFor="name" className={styles.label}>Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={styles.input}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.input}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="message" className={styles.label}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className={`${styles.input} ${styles.textarea}`}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project…"
                    rows={6}
                  />
                </div>

                {error && (
                  <p className={styles.errorMsg} role="alert">{error}</p>
                )}

                <button type="submit" className={styles.submitBtn}>
                  Send message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
