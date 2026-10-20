import React, { useEffect, useState } from 'react';
import { projectsApi } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import styles from './Portfolio.module.css';

const ALL = 'All';

/**
 * Portfolio page — full grid with category filter tabs.
 */
export default function Portfolio() {
  const [projects,  setProjects]  = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [categories, setCategories] = useState([ALL]);
  const [active,    setActive]    = useState(ALL);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    projectsApi.getAll()
      .then((res) => {
        const data = res.data || [];
        setProjects(data);
        setFiltered(data);

        // Extract unique categories
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
      <div className="container">

        {/* Page header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Work</h1>
          <p className={styles.pageDesc}>
            A collection of architectural projects across scales and typologies.
          </p>
        </header>

        {/* Category filter */}
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

        {/* Grid */}
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
