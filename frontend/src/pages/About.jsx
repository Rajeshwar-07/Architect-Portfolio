import React, { useEffect, useRef } from 'react';
import styles from './About.module.css';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const SERVICES = [
  'Residential Design',
  'Commercial & Mixed-Use',
  'Interior Architecture',
  'Architectural Drawings & Plans',
  '3D Visualization',
  'Site Supervision',
];

export default function About() {
  const bioRef = useReveal();
  const imgRef = useReveal();

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.eyebrow}>About</p>
          <h1 className={styles.pageTitle}>Anand Sherkar</h1>
          <p className={styles.pageSubtitle}>Architect · Pune, Maharashtra</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>

          {/* Left: bio */}
          <div className={`${styles.textCol} reveal`} ref={bioRef}>
            <div className={styles.bio}>
              <p>
                I am Anand Sherkar, an architect based in Pune with <strong>3 years of experience</strong> designing
                homes, farmhouses, and thoughtful living spaces across Maharashtra. My practice —
                <strong> Rachnaangan Studio</strong> — is rooted in a careful understanding of how
                people actually live: the warmth of a morning kitchen, the quiet of a reading corner,
                the pride of a home that feels truly yours.
              </p>
              <p>
                I believe architecture should be honest — about its materials, its context, and the
                people it serves. Every project begins with listening, and ends only when the space
                feels inevitable, as if it could not have been any other way.
              </p>
              <p>
                From detailed floor plans to final construction supervision, I am involved at every
                stage to ensure that the designed intent translates fully into built reality.
              </p>
            </div>

            <div className={styles.services}>
              <h3 className={styles.servicesTitle}>Services</h3>
              <ul className={styles.servicesList}>
                {SERVICES.map((s) => (
                  <li key={s}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor"
                            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.contactStrip}>
              <a href="tel:+917397815054" className={styles.contactLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                +91 73978 15054
              </a>
              <a href="https://www.instagram.com/rachnaangan_studio" target="_blank"
                 rel="noopener noreferrer" className={styles.contactLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
                @rachnaangan_studio
              </a>
            </div>
          </div>

          {/* Right: portrait */}
          <div className={`${styles.imageCol} reveal`} ref={imgRef}>
            <div className={styles.portraitFrame}>
              <img
                src="/anand-portrait.jpg"
                alt="Anand Sherkar, Architect"
                className={styles.portrait}
                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
              />
              <div className={styles.portraitPlaceholder} style={{display:'none'}}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#c9a96e" strokeWidth="1.2"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#c9a96e" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <p>Anand Sherkar</p>
              </div>
            </div>
            <div className={styles.portraitCaption}>
              <span className={styles.studioName}>Rachnaangan Studio</span>
              <span className={styles.studioPune}>Pune, Maharashtra</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
