import React, { useState } from 'react';
import { contactApi } from '../services/api';
import styles from './Contact.module.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contactApi.sendMessage(form);
      setStatus('ok');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.eyebrow}>Contact</p>
          <h1 className={styles.pageTitle}>Let&apos;s Work Together</h1>
          <p className={styles.pageSubtitle}>
            Have a project in mind? Reach out — I&apos;d love to hear about it.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>

          {/* Left: contact info */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Get in Touch</h3>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className={styles.infoLabel}>Phone</p>
                  <a href="tel:+917397815054" className={styles.infoValue}>+91 73978 15054</a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                          stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <p className={styles.infoLabel}>Location</p>
                  <p className={styles.infoValue}>Pune, Maharashtra, India</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <p className={styles.infoLabel}>Instagram</p>
                  <a href="https://www.instagram.com/rachnaangan_studio" target="_blank"
                     rel="noopener noreferrer" className={styles.infoValue}>@rachnaangan_studio</a>
                </div>
              </div>

              <div className={styles.availBadge}>
                <span className={styles.availDot} />
                Available for new projects
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className={styles.formCol}>
            <form onSubmit={submit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="name">Name *</label>
                  <input id="name" name="name" type="text" required
                         placeholder="Your full name"
                         className={styles.input}
                         value={form.name} onChange={handle} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" required
                         placeholder="you@example.com"
                         className={styles.input}
                         value={form.email} onChange={handle} />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="phone">Phone (optional)</label>
                <input id="phone" name="phone" type="tel"
                       placeholder="+91 XXXXX XXXXX"
                       className={styles.input}
                       value={form.phone} onChange={handle} />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="message">Message *</label>
                <textarea id="message" name="message" required rows={6}
                          placeholder="Tell me about your project — type, location, approximate size…"
                          className={styles.textarea}
                          value={form.message} onChange={handle} />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className={styles.submitBtn}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
                {status !== 'sending' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor"
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {status === 'ok' && (
                <p className={styles.successMsg}>
                  ✓ Message sent! I&apos;ll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className={styles.errorMsg}>
                  Something went wrong. Please try calling directly.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
