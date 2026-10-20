import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './WorkSlider.module.css';

const SLIDES = [
  {
    src: '/images/project-farmhouse-day.jpg',
    title: 'Farmhouse Residence',
    subtitle: 'Exterior · Day View',
    tag: 'Residential',
  },
  {
    src: '/images/project-farmhouse-night.jpg',
    title: 'Farmhouse Residence',
    subtitle: 'Exterior · Night View',
    tag: 'Residential',
  },
  {
    src: '/images/project-floorplan-1.jpg',
    title: 'First Floor Plan',
    subtitle: 'Architectural Drawing',
    tag: 'Technical',
  },
  {
    src: '/images/project-floorplan-2.jpg',
    title: 'Ground Floor Plan',
    subtitle: 'Architectural Drawing',
    tag: 'Technical',
  },
  {
    src: '/images/project-construction.jpg',
    title: 'Under Construction',
    subtitle: 'Site Progress',
    tag: 'Construction',
  },
];

export default function WorkSlider() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 320);
  }, [transitioning]);

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  /* Auto-advance */
  useEffect(() => {
    timerRef.current = setInterval(next, 4500);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4500);
  };

  return (
    <div className={styles.slider}>
      {/* Main image */}
      <div className={styles.imageWrap}>
        <img
          key={current}
          src={SLIDES[current].src}
          alt={SLIDES[current].title}
          className={`${styles.image} ${transitioning ? styles.fadeOut : styles.fadeIn}`}
        />

        {/* Caption overlay */}
        <div className={styles.caption}>
          <span className={styles.captionTag}>{SLIDES[current].tag}</span>
          <div className={styles.captionText}>
            <h3 className={styles.captionTitle}>{SLIDES[current].title}</h3>
            <p className={styles.captionSub}>{SLIDES[current].subtitle}</p>
          </div>
        </div>

        {/* Arrow controls */}
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => { prev(); resetTimer(); }}
          aria-label="Previous slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => { next(); resetTimer(); }}
          aria-label="Next slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className={styles.dots}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => { goTo(i); resetTimer(); }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className={styles.thumbs}>
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`}
            onClick={() => { goTo(i); resetTimer(); }}
          >
            <img src={slide.src} alt={slide.title} />
          </button>
        ))}
      </div>
    </div>
  );
}
