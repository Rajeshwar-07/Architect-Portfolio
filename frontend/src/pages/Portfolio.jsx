import React, { useEffect, useState } from 'react';
import { projectsApi } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import ProjectGrid from '../components/ProjectGrid';
import styles from './Portfolio.module.css';

const ALL = 'All';

export default function Portfolio() {
  const [projects,   setProjects]   = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [categories, setCategories] = useState([ALL]);
  const [active,     setActive]     = useState(ALL);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    projectsApi.getAll()
      .then((res) => {
        const data = res.data || [];
        setProjects(data);
        setFiltered(data);
        const cats = [ALL, ...new Set(data.map((p) => p.category).filter(Boolean))];
        setCategories(cats);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filterByCategory = (cat) => {
    setActive(cat);
    setFiltered(cat === ALL ? projects : projects.filter((p) => p.category === cat));
  };

  return (
    <div className={styles.page}>

      {/* ── Dark page header ── */}
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.eyebrow}>Portfolio</p>
          <h1 className={styles.pageTitle}>Selected Work</h1>
          <p className={styles.pageDesc}>
            Residential, farmhouse and commercial projects — from drawing to built form.
          </p>
        </div>
      </div>

      {/* ── Featured project grid (2 images per card, auto-slides every 5s) ── */}
      <div className={styles.gridSection}>
        <div className="container">
          <p className={styles.sectionLabel}>Recent Projects</p>
          <ProjectGrid />
        </div>
      </div>

      {/* ── Backend project grid ── */}
      <div className="container">
        {categories.length > 1 && (
          <div className={styles.filterBar} role="tablist" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={active === cat}
                className={`${styles.filterBtn} ${active === cat ? styles.filterActive : ''}`}
                onClick={() => filterByCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className={styles.skeleton} aria-hidden="true" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No projects found in this category.</p>
        )}
      </div>
    </div>
  );
}
