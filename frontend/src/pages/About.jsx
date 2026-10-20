import React from 'react';
import styles from './About.module.css';

/**
 * About page — architect bio and philosophy.
 * Content here is placeholder — easily editable.
 */
export default function About() {
  return (
    <div className={styles.page}>
      <div className="container">

        <div className={styles.layout}>

          {/* Left: bio text */}
          <div className={styles.textCol}>
            <p className={styles.eyebrow}>About</p>
            <h1 className={styles.name}>Arjun Mehta</h1>
            <p className={styles.role}>Architect, Mumbai</p>

            <div className={styles.bio}>
              <p>
                I am an architect based in Mumbai with over twelve years of experience
                designing homes, cultural institutions, and public spaces. My practice is
                rooted in a careful reading of place — the climate, the community, the
                history of a site — and a belief that architecture should serve people
                with humility and quiet confidence.
              </p>
              <p>
                Before founding my own practice, I worked with firms in Ahmedabad,
                Rotterdam, and New York. Those years sharpened my understanding of
                materials, light, and the choreography of movement through space.
              </p>
              <p>
                I believe the best buildings disappear into the lives of those who inhabit
                them — they become background to memory, not monuments to the designer.
              </p>
            </div>

            {/* Services list */}
            <div className={styles.services}>
              <h3 className={styles.servicesTitle}>Services</h3>
              <ul className={styles.servicesList}>
                <li>Residential Design</li>
                <li>Commercial &amp; Mixed-Use</li>
                <li>Interior Architecture</li>
                <li>Urban Consultation</li>
                <li>Heritage Restoration</li>
              </ul>
            </div>
          </div>

          {/* Right: portrait placeholder */}
          <div className={styles.imageCol}>
            <div className={styles.portraitFrame} aria-hidden="true">
              <div className={styles.portraitPlaceholder}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#a09b95" strokeWidth="1.2"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                        stroke="#a09b95" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <p>Portrait photo</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
