import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsApi } from '../services/api';
import styles from './ProjectDetail.module.css';

/**
 * Project detail page.
 * Shows full image gallery (click to enlarge) + project metadata.
 */
export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // index of open image

  useEffect(() => {
    projectsApi.getById(id)
      .then((res) => setProject(res.data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null || !project) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setLightbox((i) => Math.min(i + 1, project.images.length - 1));
      if (e.key === 'ArrowLeft')  setLightbox((i) => Math.max(i - 1, 0));
      if (e.key === 'Escape')     setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, project]);

  if (loading) return <div className={styles.loadingState}>Loading…</div>;
  if (!project) return (
    <div className={styles.errorState}>
      <p>Project not found.</p>
      <Link to="/portfolio" className={styles.backLink}>← Back to portfolio</Link>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className="container">

        {/* Back link */}
        <Link to="/portfolio" className={styles.backLink}>← Work</Link>

        {/* Project header */}
        <header className={styles.header}>
          <div className={styles.meta}>
            {project.category && <span className={styles.category}>{project.category}</span>}
            {project.year     && <span className={styles.year}>{project.year}</span>}
          </div>
          <h1 className={styles.title}>{project.title}</h1>
          {project.location && (
            <p className={styles.location}>{project.location}</p>
          )}
        </header>

        {/* Description */}
        {project.description && (
          <p className={styles.description}>{project.description}</p>
        )}

        {/* Image Gallery */}
        {project.images?.length > 0 && (
          <div className={styles.gallery}>
            {project.images.map((img, idx) => (
              <button
                key={img.id}
                className={styles.galleryItem}
                onClick={() => setLightbox(idx)}
                aria-label={`View ${img.altText || project.title} — image ${idx + 1}`}
              >
                <img
                  src={img.filePath}
                  alt={img.altText || project.title}
                  className={styles.galleryImg}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            className={`${styles.lbNav} ${styles.lbPrev}`}
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => Math.max(i - 1, 0)); }}
            disabled={lightbox === 0}
            aria-label="Previous image"
          >
            ←
          </button>

          <img
            src={project.images[lightbox].filePath}
            alt={project.images[lightbox].altText || project.title}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className={`${styles.lbNav} ${styles.lbNext}`}
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => Math.min(i + 1, project.images.length - 1)); }}
            disabled={lightbox === project.images.length - 1}
            aria-label="Next image"
          >
            →
          </button>

          <span className={styles.lbCounter}>
            {lightbox + 1} / {project.images.length}
          </span>

          <button
            className={styles.lbClose}
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
