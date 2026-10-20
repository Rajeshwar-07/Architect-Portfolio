import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import EmailGate from '../components/EmailGate';
import styles from './Home.module.css';

/* Reveal-on-scroll hook */
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

/* Stats data */
const STATS = [
  { value: '3+', label: 'Years Experience' },
  { value: '20+', label: 'Projects Completed' },
  { value: '100%', label: 'Client Satisfaction' },
];

/* Services */
const SERVICES = [
  { icon: '🏠', title: 'Residential Design', desc: 'Custom homes and villas crafted for comfort and elegance.' },
  { icon: '🏢', title: 'Commercial Spaces', desc: 'Offices, showrooms, and mixed-use developments.' },
  { icon: '✏️', title: 'Interior Architecture', desc: 'Spaces designed from inside-out with material precision.' },
  { icon: '📐', title: 'Architectural Drawing', desc: 'Detailed floor plans, elevations and 3D visualizations.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  const statsRef    = useReveal();
  const servicesRef = useReveal();
  const workRef     = useReveal();

  useEffect(() => {
    projectsApi.getFeatured()
      .then((res) => setFeatured(res.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <EmailGate />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <p className={`${styles.heroEyebrow} animate-fadeIn delay-1`}>
            Architecture &amp; Design · Pune, Maharashtra
          </p>
          <h1 className={`${styles.heroHeading} animate-fadeUp delay-2`}>
            Spaces that speak<br />with intention.
          </h1>
          <p className={`${styles.heroSub} animate-fadeUp delay-3`}>
            Crafting thoughtful residential and commercial spaces rooted in context,
            warmth, and material honesty — by Anand Sherkar, Architect.
          </p>
          <div className={`${styles.heroBtns} animate-fadeUp delay-4`}>
            <Link to="/portfolio" className={styles.heroCta}>
              View Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/contact" className={styles.heroCtaOutline}>Get in Touch</Link>
          </div>
        </div>
        <div className={styles.heroScroll}>
          <span>Scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className={styles.statsSection}>
        <div className={`container ${styles.statsGrid} reveal`} ref={statsRef}>
          {STATS.map(({ value, label }) => (
            <div key={label} className={styles.statItem}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section className={styles.servicesSection}>
        <div className="container">
          <div className={`${styles.sectionHeader} reveal`} ref={servicesRef}>
            <p className={styles.eyebrow}>What I Do</p>
            <h2 className={styles.sectionTitle}>Services</h2>
          </div>
          <div className={styles.servicesGrid}>
            {SERVICES.map(({ icon, title, desc }, i) => (
              <div key={title} className={`${styles.serviceCard} reveal`}
                   style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className={styles.serviceIcon}>{icon}</span>
                <h3 className={styles.serviceTitle}>{title}</h3>
                <p className={styles.serviceDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Work ── */}
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={`${styles.sectionHeader} reveal`} ref={workRef}>
            <div>
              <p className={styles.eyebrow}>Portfolio</p>
              <h2 className={styles.sectionTitle}>Selected Work</h2>
            </div>
            <Link to="/portfolio" className={styles.sectionLink}>All projects →</Link>
          </div>

          {loading ? (
            <div className={styles.skeletonGrid}>
              {[1, 2, 3].map((n) => <div key={n} className={styles.skeleton} />)}
            </div>
          ) : featured.length > 0 ? (
            <div className={styles.grid}>
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyNote}>
                Projects will appear here once added via the admin panel.
              </p>
              <Link to="/portfolio" className={styles.heroCta} style={{marginTop:'1.5rem'}}>
                Go to Portfolio
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <h2 className={styles.ctaHeading}>Have a project in mind?</h2>
          <p className={styles.ctaSub}>Let's design something beautiful together.</p>
          <Link to="/contact" className={styles.ctaBtn}>
            Start a Conversation
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
