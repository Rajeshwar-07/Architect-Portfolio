import React, { useEffect, useState, useRef } from 'react';
import { projectsApi, visitorsApi, contactApi } from '../services/api';
import styles from './Admin.module.css';

/* ─── Simple password gate ─────────────────────────────────────────────── */
const ADMIN_PASSWORD = 'rachnaangan2024'; // change this

function PasswordGate({ onUnlock }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) { onUnlock(); }
    else { setErr(true); setTimeout(() => setErr(false), 1800); }
  };
  return (
    <div className={styles.gateWrap}>
      <div className={styles.gateBox}>
        <div className={styles.gateLogo}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#c9a96e" strokeWidth="1.5"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className={styles.gateTitle}>Admin Access</h2>
        <p className={styles.gateSub}>Rachnaangan Studio · Portfolio CMS</p>
        <form onSubmit={submit} className={styles.gateForm}>
          <input
            type="password"
            placeholder="Enter password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className={`${styles.gateInput} ${err ? styles.gateInputErr : ''}`}
            autoFocus
          />
          {err && <p className={styles.gateErr}>Incorrect password</p>}
          <button type="submit" className={styles.gateBtn}>Unlock Panel</button>
        </form>
      </div>
    </div>
  );
}

/* ─── Tabs config ──────────────────────────────────────────────────────── */
const TABS = [
  { key: 'projects',   label: 'All Projects',  icon: '🗂️' },
  { key: 'add',        label: 'Add Project',   icon: '➕' },
  { key: 'inquiries',  label: 'Inquiries',     icon: '✉️' },
  { key: 'visitors',   label: 'Visitors',      icon: '👥' },
];

const CATEGORIES = ['Residential', 'Commercial', 'Interior', 'Farmhouse', 'Construction', 'Other'];

/* ─── Main Admin Component ─────────────────────────────────────────────── */
export default function Admin() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('adminUnlocked') === '1');
  const unlock = () => { sessionStorage.setItem('adminUnlocked', '1'); setUnlocked(true); };
  if (!unlocked) return <PasswordGate onUnlock={unlock} />;
  return <AdminPanel />;
}

function AdminPanel() {
  const [tab, setTab] = useState('projects');

  // ── Projects list state ──
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // ── Add project state ──
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', year: '', isFeatured: false });
  const [images, setImages]     = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [addMsg, setAddMsg]     = useState({ text: '', ok: false });
  const fileRef = useRef(null);

  // ── Edit state ──
  const [editing, setEditing]   = useState(null); // project object being edited
  const [editForm, setEditForm] = useState({});
  const [editMsg, setEditMsg]   = useState({ text: '', ok: false });

  // ── Inquiries state ──
  const [inquiries, setInquiries]         = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // ── Visitors state ──
  const [visitors, setVisitors] = useState([]);
  const [visitorCount, setVisitorCount] = useState(null);
  const [loadingVisitors, setLoadingVisitors] = useState(false);

  // ── Load ──
  useEffect(() => { loadProjects(); }, []);
  useEffect(() => { if (tab === 'inquiries') loadInquiries(); }, [tab]);
  useEffect(() => { if (tab === 'visitors')  loadVisitors();  }, [tab]);

  const loadProjects = () => {
    setLoadingProjects(true);
    projectsApi.getAll()
      .then((res) => setProjects(Array.isArray(res) ? res : (res.data || [])))
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  };

  const loadInquiries = () => {
    setLoadingInquiries(true);
    contactApi.getInquiries()
      .then((res) => setInquiries(Array.isArray(res) ? res : (res.data || [])))
      .catch(() => setInquiries([]))
      .finally(() => setLoadingInquiries(false));
  };

  const markRead = async (id) => {
    await contactApi.markRead(id).catch(() => {});
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, isRead: true } : i));
  };

  const loadVisitors = () => {
    setLoadingVisitors(true);
    Promise.all([visitorsApi.getEmails(), visitorsApi.getStats()])
      .then(([emailsRes, statsRes]) => {
        setVisitors(Array.isArray(emailsRes) ? emailsRes : (emailsRes.data || []));
        setVisitorCount(statsRes?.uniqueVisitors ?? statsRes?.data?.uniqueVisitors ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoadingVisitors(false));
  };

  // ── Add project handlers ──
  const handleField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (i) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setAddMsg({ text: 'Title is required.', ok: false }); return; }
    setSubmitting(true); setAddMsg({ text: '', ok: false });
    try {
      await projectsApi.create({ ...form, year: form.year ? parseInt(form.year) : null }, images);
      setAddMsg({ text: '✓ Project added!', ok: true });
      setForm({ title: '', description: '', category: '', location: '', year: '', isFeatured: false });
      setImages([]); setPreviews([]);
      if (fileRef.current) fileRef.current.value = '';
      loadProjects();
      setTimeout(() => setTab('projects'), 1200);
    } catch (err) {
      setAddMsg({ text: 'Error: ' + err.message, ok: false });
    } finally { setSubmitting(false); }
  };

  // ── Delete project ──
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?\nThis cannot be undone.`)) return;
    try {
      await projectsApi.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) { alert('Delete failed: ' + err.message); }
  };

  // ── Edit project ──
  const openEdit = (project) => {
    setEditing(project);
    setEditForm({
      title: project.title || '',
      description: project.description || '',
      category: project.category || '',
      location: project.location || '',
      year: project.year || '',
      isFeatured: project.isFeatured || false,
    });
    setEditMsg({ text: '', ok: false });
  };

  const handleEditField = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;
    try {
      // Use create with PUT semantics — update endpoint
      await projectsApi.update(editing.id, { ...editForm, year: editForm.year ? parseInt(editForm.year) : null });
      setEditMsg({ text: '✓ Saved!', ok: true });
      loadProjects();
      setTimeout(() => setEditing(null), 900);
    } catch (err) {
      setEditMsg({ text: 'Error: ' + err.message, ok: false });
    }
  };

  /* ═══════════════════════════════════════════════════════════════════ */
  return (
    <div className={styles.page}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.sidebarLogo}>RS</span>
          <div>
            <p className={styles.sidebarName}>Rachnaangan</p>
            <p className={styles.sidebarRole}>Studio Admin</p>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`${styles.sidebarBtn} ${tab === key ? styles.sidebarBtnActive : ''}`}
              onClick={() => setTab(key)}
            >
              <span className={styles.sidebarIcon}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <p className={styles.sidebarStat}>{projects.length} projects</p>
          <button className={styles.logoutBtn} onClick={() => { sessionStorage.removeItem('adminUnlocked'); window.location.reload(); }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className={styles.main}>

        {/* ════════════ ALL PROJECTS ════════════ */}
        {tab === 'projects' && (
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>All Projects</h2>
              <button className={styles.addBtn} onClick={() => setTab('add')}>+ Add New</button>
            </div>

            {loadingProjects ? (
              <div className={styles.loadingGrid}>
                {[1,2,3,4].map(n => <div key={n} className={styles.skelCard} />)}
              </div>
            ) : projects.length === 0 ? (
              <div className={styles.empty}>
                <p>No projects yet.</p>
                <button className={styles.addBtn} onClick={() => setTab('add')}>Add your first project →</button>
              </div>
            ) : (
              <div className={styles.projectGrid}>
                {projects.map((p) => (
                  <div key={p.id} className={styles.projectCard}>
                    {/* Cover image */}
                    <div className={styles.cardImg}>
                      {p.images?.[0]?.filePath ? (
                        <img src={p.images[0].filePath} alt={p.title} />
                      ) : (
                        <div className={styles.cardImgPlaceholder}>No Image</div>
                      )}
                      {p.isFeatured && <span className={styles.featuredBadge}>Featured</span>}
                      <div className={styles.cardImgCount}>{p.images?.length ?? 0} img</div>
                    </div>
                    {/* Info */}
                    <div className={styles.cardInfo}>
                      <h3 className={styles.cardTitle}>{p.title}</h3>
                      <div className={styles.cardMeta}>
                        {p.category && <span className={styles.cardTag}>{p.category}</span>}
                        {p.year     && <span className={styles.cardYear}>{p.year}</span>}
                        {p.location && <span className={styles.cardLoc}>📍 {p.location}</span>}
                      </div>
                      {p.description && (
                        <p className={styles.cardDesc}>{p.description.slice(0, 80)}{p.description.length > 80 ? '…' : ''}</p>
                      )}
                    </div>
                    {/* Actions */}
                    <div className={styles.cardActions}>
                      <button className={styles.editBtn} onClick={() => openEdit(p)}>✏️ Edit</button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(p.id, p.title)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════ ADD PROJECT ════════════ */}
        {tab === 'add' && (
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Add New Project</h2>
            </div>

            <form onSubmit={handleAdd} className={styles.form} noValidate>
              <div className={styles.formGrid}>

                {/* Title */}
                <div className={`${styles.field} ${styles.spanFull}`}>
                  <label className={styles.label}>Project Title *</label>
                  <input name="title" className={styles.input} value={form.title}
                         onChange={handleField} placeholder="e.g. Lakeside Residence, Pune" />
                </div>

                {/* Category */}
                <div className={styles.field}>
                  <label className={styles.label}>Category</label>
                  <select name="category" className={styles.input} value={form.category} onChange={handleField}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Year */}
                <div className={styles.field}>
                  <label className={styles.label}>Year</label>
                  <input name="year" type="number" className={styles.input}
                         value={form.year} onChange={handleField}
                         placeholder="2024" min="2000" max="2100" />
                </div>

                {/* Location */}
                <div className={`${styles.field} ${styles.spanFull}`}>
                  <label className={styles.label}>Location</label>
                  <input name="location" className={styles.input} value={form.location}
                         onChange={handleField} placeholder="e.g. Pune, Maharashtra" />
                </div>

                {/* Description */}
                <div className={`${styles.field} ${styles.spanFull}`}>
                  <label className={styles.label}>Description</label>
                  <textarea name="description" className={`${styles.input} ${styles.textarea}`}
                            value={form.description} onChange={handleField} rows={4}
                            placeholder="Brief description of the project…" />
                </div>

                {/* Featured */}
                <div className={`${styles.field} ${styles.spanFull}`}>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleField} />
                    <span>Feature this project on the home page</span>
                  </label>
                </div>

                {/* Image upload */}
                <div className={`${styles.field} ${styles.spanFull}`}>
                  <label className={styles.label}>Upload Images</label>
                  <div
                    className={styles.dropZone}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                      setImages(files);
                      setPreviews(files.map(f => URL.createObjectURL(f)));
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#9c8b78" strokeWidth="1.5" strokeLinecap="round"/>
                      <polyline points="17 8 12 3 7 8" stroke="#9c8b78" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="3" x2="12" y2="15" stroke="#9c8b78" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <p>Click to browse or drag & drop images here</p>
                    <span>JPEG, PNG, WEBP — multiple allowed</span>
                    <input ref={fileRef} type="file" multiple accept="image/*"
                           style={{ display: 'none' }} onChange={handleFiles} />
                  </div>

                  {/* Image previews */}
                  {previews.length > 0 && (
                    <div className={styles.previewGrid}>
                      {previews.map((src, i) => (
                        <div key={i} className={styles.previewItem}>
                          <img src={src} alt={`preview ${i+1}`} />
                          <button type="button" className={styles.previewRemove}
                                  onClick={() => removePreview(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {addMsg.text && (
                <p className={`${styles.msg} ${addMsg.ok ? styles.msgOk : styles.msgErr}`}>
                  {addMsg.text}
                </p>
              )}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setTab('projects')}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Saving…' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ════════════ INQUIRIES ════════════ */}
        {tab === 'inquiries' && (
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Contact Inquiries</h2>
              <button className={styles.refreshBtn} onClick={loadInquiries}>↻ Refresh</button>
            </div>

            {loadingInquiries ? (
              <p className={styles.loadMsg}>Loading…</p>
            ) : inquiries.length === 0 ? (
              <p className={styles.emptyMsg}>No inquiries yet. When someone fills the contact form, it will appear here.</p>
            ) : (
              <div className={styles.inquiryList}>
                {inquiries.map((inq) => (
                  <div key={inq.id} className={`${styles.inquiryCard} ${!inq.isRead ? styles.inquiryUnread : ''}`}>
                    <div className={styles.inquiryHead}>
                      <div>
                        <span className={styles.inquiryName}>{inq.name}</span>
                        {!inq.isRead && <span className={styles.newBadge}>NEW</span>}
                      </div>
                      <span className={styles.inquiryDate}>
                        {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className={styles.inquiryContact}>
                      <a href={`mailto:${inq.email}`} className={styles.inquiryEmail}>{inq.email}</a>
                      {inq.phone && <span className={styles.inquiryPhone}>· {inq.phone}</span>}
                    </div>
                    <p className={styles.inquiryMsg}>{inq.message}</p>
                    <div className={styles.inquiryActions}>
                      <a href={`mailto:${inq.email}?subject=Re: Your project inquiry`} className={styles.replyBtn}>
                        ✉️ Reply
                      </a>
                      {!inq.isRead && (
                        <button className={styles.readBtn} onClick={() => markRead(inq.id)}>
                          ✓ Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════ VISITORS ════════════ */}
        {tab === 'visitors' && (
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Visitor Emails</h2>
              <button className={styles.refreshBtn} onClick={loadVisitors}>↻ Refresh</button>
            </div>

            {loadingVisitors ? (
              <p className={styles.loadMsg}>Loading…</p>
            ) : (
              <>
                <div className={styles.statCards}>
                  <div className={styles.statCard}>
                    <span className={styles.statNum}>{visitorCount ?? '—'}</span>
                    <span className={styles.statLbl}>Unique Visitors</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statNum}>{visitors.length}</span>
                    <span className={styles.statLbl}>Emails Collected</span>
                  </div>
                </div>

                {visitors.length === 0 ? (
                  <p className={styles.emptyMsg}>No visitor emails collected yet.</p>
                ) : (
                  <div className={styles.emailTable}>
                    <div className={styles.emailHeader}>
                      <span>#</span><span>Email Address</span>
                    </div>
                    {visitors.map((email, i) => (
                      <div key={email} className={styles.emailRow}>
                        <span className={styles.emailIdx}>{i + 1}</span>
                        <span className={styles.emailVal}>{email}</span>
                        <a href={`mailto:${email}`} className={styles.emailContact}>Contact</a>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </main>

      {/* ════════════ EDIT MODAL ════════════ */}
      {editing && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className={styles.modal}>
            <div className={styles.modalHead}>
              <h3 className={styles.modalTitle}>Edit Project</h3>
              <button className={styles.modalClose} onClick={() => setEditing(null)}>✕</button>
            </div>

            <form onSubmit={saveEdit} className={styles.form}>
              <div className={styles.formGrid}>

                <div className={`${styles.field} ${styles.spanFull}`}>
                  <label className={styles.label}>Title *</label>
                  <input name="title" className={styles.input} value={editForm.title} onChange={handleEditField} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Category</label>
                  <select name="category" className={styles.input} value={editForm.category} onChange={handleEditField}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Year</label>
                  <input name="year" type="number" className={styles.input}
                         value={editForm.year} onChange={handleEditField} min="2000" max="2100" />
                </div>

                <div className={`${styles.field} ${styles.spanFull}`}>
                  <label className={styles.label}>Location</label>
                  <input name="location" className={styles.input} value={editForm.location} onChange={handleEditField} />
                </div>

                <div className={`${styles.field} ${styles.spanFull}`}>
                  <label className={styles.label}>Description</label>
                  <textarea name="description" className={`${styles.input} ${styles.textarea}`}
                            value={editForm.description} onChange={handleEditField} rows={3} />
                </div>

                <div className={`${styles.field} ${styles.spanFull}`}>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" name="isFeatured" checked={editForm.isFeatured} onChange={handleEditField} />
                    <span>Feature on home page</span>
                  </label>
                </div>

                {/* Existing images */}
                {editing.images?.length > 0 && (
                  <div className={`${styles.field} ${styles.spanFull}`}>
                    <label className={styles.label}>Current Images</label>
                    <div className={styles.previewGrid}>
                      {editing.images.map((img, i) => (
                        <div key={img.id || i} className={styles.previewItem}>
                          <img src={img.filePath} alt={img.altText || `img ${i+1}`} />
                          <span className={styles.previewLabel}>#{i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {editMsg.text && (
                <p className={`${styles.msg} ${editMsg.ok ? styles.msgOk : styles.msgErr}`}>
                  {editMsg.text}
                </p>
              )}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setEditing(null)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
