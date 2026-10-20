import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import EmailGate from '../components/EmailGate';
import styles from './Home.module.css';

/**
 * Home / landing page.
 * Hero section + featured work grid + email capture gate.
 */
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    projectsApi.getFeatured()
      .then((res) => setFeatured(res.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Email capture gate — shown on first visit */}
      <EmailGate />

      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Architecture &amp; Design</p>
          <h1 className={styles.heroHeading}>
            Spaces that speak<br />with intention.
          </h1>
          <p className={styles.heroSub}>
            A curated portfolio of residential, commercial, and cultural projects
            rooted in context, material, and light.
          </p>
          <Link to="/portfolio" className={styles.heroCta}>
            View all work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ---- Featured Work ---- */}
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Selected Work</h2>
            <Link to="/portfolio" className={styles.sectionLink}>
              All projects →
            </Link>
          </div>

          {loading ? (
            <div className={styles.skeletonGrid}>
              {[1, 2, 3].map((n) => (
                <div key={n} className={styles.skeleton} aria-hidden="true" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className={styles.grid}>
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className={styles.emptyNote}>Projects coming soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
