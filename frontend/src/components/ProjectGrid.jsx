import React, { useState, useEffect } from 'react';
import styles from './ProjectGrid.module.css';

/**
 * Each card holds 2 images that auto-slide every 5 seconds.
 */
const CARDS = [
  {
    id: 1,
    label: 'Residential Villa',
    tag: 'Exterior',
    images: [
      { src: '/images/project-villa-night.jpg', caption: 'Night View' },
      { src: '/images/project-villa-day.jpg',   caption: 'Day View'   },
    ],
  },
  {
    id: 2,
    label: 'Ground Floor Plan',
    tag: 'Technical Drawing',
    images: [
      { src: '/images/project-floorplan-1.jpg', caption: 'Ground Floor' },
      { src: '/images/project-floorplan-2.jpg', caption: 'First Floor'  },
    ],
  },
  {
    id: 3,
    label: 'Site Supervision',
    tag: 'Construction',
    images: [
      { src: '/images/project-construction.jpg', caption: 'Site Progress'   },
      { src: '/images/project-villa-day.jpg',    caption: 'Completed Villa'  },
    ],
  },
];

function ProjectCard({ card }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % card.images.length);
        setFading(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, [card.images.length]);

  const current = card.images[idx];

  return (
    <div className={styles.card}>
      {/* Image area */}
      <div className={styles.imgWrap}>
        <img
          src={current.src}
          alt={current.caption}
          className={`${styles.img} ${fading ? styles.fadeOut : styles.fadeIn}`}
        />

        {/* Slide indicators */}
        <div className={styles.dots}>
          {card.images.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
            />
          ))}
        </div>

        {/* Caption overlay */}
        <div className={styles.overlay}>
          <span className={styles.tag}>{card.tag}</span>
          <p className={styles.caption}>{current.caption}</p>
        </div>
      </div>

      {/* Card footer */}
      <div className={styles.footer}>
        <h3 className={styles.title}>{card.label}</h3>
        <span className={styles.counter}>{idx + 1} / {card.images.length}</span>
      </div>
    </div>
  );
}

export default function ProjectGrid() {
  return (
    <div className={styles.grid}>
      {CARDS.map((card) => (
        <ProjectCard key={card.id} card={card} />
      ))}
    </div>
  );
}
