import React, { useEffect, useState, useRef } from 'react';
import { projectsApi, visitorsApi } from '../services/api';
import styles from './Admin.module.css';

/**
 * Admin panel for the portfolio owner.
 *
 * Features:
 *  - Add new projects with image uploads
 *  - View all projects
 *  - Delete projects
 *  - View visitor emails
 *
 * NOTE: In production, protect this route with Spring Security or a
 * simple password check.  Do NOT expose it publicly.
 *
 * Access via: http://localhost:5173/admin
 */
export default function Admin() {
  // ---- Tabs ----
  const [tab, setTab] = useState('projects'); // 'projects' | 'add' | 'visitors'

  // ---- Projects list ----
  const [projects,  setProjects]  = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // ---- Add project form ----
  const [form, setForm] = useState({
    title: '', description: '', category: '', location: '', year: '', isFeatured: false,
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [addMsg,     setAddMsg]     = useState('');
  const fileInputRef = useRef(null);

  // ---- Visitors ----
  const [visitors,      setVisitors]      = useState([]);
  const [visitorCount,  setVisitorCount]  = useState(null);
  const [loadingVisitors, setLoadingVisitors] = useState(false);

  // -----------------------------------------------------------------------

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    setLoadingProjects(true);
    projectsApi.getAll()
      .then((res) => setProjects(res.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  };

  const loadVisitors = () => {
    setLoadingVisitors(true);
    Promise.all([visitorsApi.getEmails(), visitorsApi.getStats()])
      .then(([emailsRes, statsRes]) => {
        setVisitors(emailsRes.data || []);
        setVisitorCount(statsRes.data?.uniqueVisitors ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoadingVisitors(false));
  };

  useEffect(() => {
    if (tab === 'visitors') loadVisitors();
  }, [tab]);

  // ---- Form handlers ----
  const handleField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFiles = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setAddMsg('Title is required.'); return; }
    setSubmitting(true);
    setAddMsg('');
    try {
      await projectsApi.create(
        { ...form, year: form.year ? parseInt(form.year) : null },
        images
      );
      setAddMsg('✓ Project added successfully!');
      setForm({ title: '', description: '', category: '', location: '', year: '', isFeatured: false });
      setImages([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadProjects();
    } catch (err) {
      setAddMsg('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await projectsApi.delete(id);
      loadProjects();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // -----------------------------------------------------------------------

  return (
    <div className={styles.page}>
      <div className="container">

        <header className={styles.header}>
          <h1 className={styles.heading}>Admin Panel</h1>
          <p className={styles.sub}>Manage portfolio content and view visitors.</p>
        </header>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { key: 'projects', label: 'Projects' },
            { key: 'add',      label: 'Add Project' },
            { key: 'visitors', label: 'Visitors' },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.tab} ${tab === key ? styles.tabActive : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ======================== Projects List ======================== */}
        {tab === 'projects' && (
          <div className={styles.panel}>
            {loadingProjects ? (
              <p className={styles.loadMsg}>Loading…</p>
            ) : projects.length === 0 ? (
              <p className={styles.emptyMsg}>No projects yet. Add one →</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th>Images</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.title}</td>
                      <td>{p.category || '—'}</td>
                      <td>{p.year     || '—'}</td>
                      <td>{p.images?.length ?? 0}</td>
                      <td>{p.isFeatured ? '✓' : '—'}</td>
                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(p.id, p.title)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ======================== Add Project ======================== */}
        {tab === 'add' && (
          <div className={styles.panel}>
            <form className={styles.addForm} onSubmit={handleAddProject} noValidate>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Title *</label>
                  <input name="title" className={styles.fieldInput}
                         value={form.title} onChange={handleField}
                         placeholder="e.g. House on the Hill" />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Category</label>
                  <input name="category" className={styles.fieldInput}
                         value={form.category} onChange={handleField}
                         placeholder="e.g. Residential" />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Location</label>
                  <input name="location" className={styles.fieldInput}
                         value={form.location} onChange={handleField}
                         placeholder="e.g. Pune, India" />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Year</label>
                  <input name="year" type="number" className={styles.fieldInput}
                         value={form.year} onChange={handleField}
                         placeholder="e.g. 2023" min="1900" max="2100" />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Description</label>
                <textarea name="description" className={`${styles.fieldInput} ${styles.textarea}`}
                          value={form.description} onChange={handleField}
                          rows={4} placeholder="Brief project description…" />
              </div>

              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="isFeatured"
                       checked={form.isFeatured} onChange={handleField} />
                Feature on home page
              </label>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Images (JPEG / PNG / WEBP)</label>
                <input type="file" ref={fileInputRef} multiple accept="image/*"
                       className={styles.fileInput} onChange={handleFiles} />
                {images.length > 0 && (
                  <p className={styles.fileCount}>{images.length} file(s) selected</p>
                )}
              </div>

              {addMsg && (
                <p className={`${styles.msg} ${addMsg.startsWith('✓') ? styles.msgOk : styles.msgErr}`}>
                  {addMsg}
                </p>
              )}

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Saving…' : 'Add Project'}
              </button>
            </form>
          </div>
        )}

        {/* ======================== Visitors ======================== */}
        {tab === 'visitors' && (
          <div className={styles.panel}>
            {loadingVisitors ? (
              <p className={styles.loadMsg}>Loading…</p>
            ) : (
              <>
                <p className={styles.visitorStat}>
                  <strong>{visitorCount}</strong> unique visitor{visitorCount !== 1 ? 's' : ''} recorded
                </p>
                {visitors.length === 0 ? (
                  <p className={styles.emptyMsg}>No visitor emails yet.</p>
                ) : (
                  <ul className={styles.emailList}>
                    {visitors.map((email) => (
                      <li key={email} className={styles.emailItem}>{email}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
