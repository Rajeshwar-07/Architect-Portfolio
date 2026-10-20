import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css';

/**
 * Single project card for grid/list views.
 * Shows cover image, title, category, and year.
 */
export default function ProjectCard({ project }) {
  const coverImage = project.images?.[0];
  const imageUrl = coverImage
    ? coverImage.filePath
    : null;

  return (
    <Link to={`/portfolio/${project.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={coverImage.altText || project.title}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="1"
                    stroke="#a09b95" strokeWidth="1.2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="#a09b95"/>
              <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#a09b95"
                    strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      <div className={styles.info}>
        <div className={styles.meta}>
          {project.category && (
            <span className={styles.category}>{project.category}</span>
          )}
          {project.year && (
            <span className={styles.year}>{project.year}</span>
          )}
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        {project.location && (
          <p className={styles.location}>{project.location}</p>
        )}
      </div>
    </Link>
  );
}
