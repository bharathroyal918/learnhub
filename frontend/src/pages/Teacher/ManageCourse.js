import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, addSection, updateCourse } from '../../utils/api';
import { toast } from 'react-toastify';
import { Add, Group } from '@mui/icons-material';

const ManageCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [section, setSection] = useState({ title: '', content: '', videoUrl: '', duration: 0 });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchCourse = useCallback(async () => {
    try {
      const { data } = await getCourseById(id);
      setCourse(data);
    } catch (err) {
      console.error('Failed to load course:', err);
      navigate('/teacher/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchCourse(); }, [fetchCourse]);

  const handleAddSection = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addSection(id, section);
      toast.success('Section added!');
      setSection({ title: '', content: '', videoUrl: '', duration: 0 });
      setShowSectionForm(false);
      fetchCourse();
    } catch (err) {
      toast.error('Failed to add section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (!course) return null;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="mb-4">
          <button className="btn btn-link p-0 text-muted" onClick={() => navigate('/teacher/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
        <div className="row g-4">
          {/* Course Info */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h5 className="fw-bold mb-1">{course.C_title}</h5>
              <p className="text-muted small mb-3">{course.C_categories}</p>
              <div className="d-flex gap-3 text-muted small">
                <span>Sections: {course.sections?.length || 0}</span>
                <span><Group fontSize="small" /> Enrolled: {course.enrolled?.length || 0}</span>
              </div>
              <hr />
              <p className="text-muted small">{course.C_description}</p>
              <div className="d-flex gap-2 mt-2">
                <span className={`badge ${course.C_price === 0 ? 'bg-success' : 'bg-primary'}`}>
                  {course.C_price === 0 ? 'Free' : `$${course.C_price}`}
                </span>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Course Sections</h5>
              <button className="btn btn-primary btn-sm fw-semibold"
                onClick={() => setShowSectionForm(!showSectionForm)}>
                <Add /> Add Section
              </button>
            </div>

            {showSectionForm && (
              <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12, borderLeft: '4px solid #2563eb' }}>
                <h6 className="fw-bold mb-3">New Section</h6>
                <form onSubmit={handleAddSection}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Section Title *</label>
                    <input type="text" className="form-control form-control-sm" required
                      value={section.title} onChange={e => setSection({ ...section, title: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Content *</label>
                    <textarea className="form-control form-control-sm" rows={3} required
                      value={section.content} onChange={e => setSection({ ...section, content: e.target.value })} />
                  </div>
                  <div className="row mb-3">
                    <div className="col-8">
                      <label className="form-label fw-semibold small">Video URL (optional)</label>
                      <input type="url" className="form-control form-control-sm"
                        value={section.videoUrl} onChange={e => setSection({ ...section, videoUrl: e.target.value })} />
                    </div>
                    <div className="col-4">
                      <label className="form-label fw-semibold small">Duration (min)</label>
                      <input type="number" className="form-control form-control-sm" min={0}
                        value={section.duration} onChange={e => setSection({ ...section, duration: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                      {saving ? 'Saving...' : 'Add Section'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary btn-sm"
                      onClick={() => setShowSectionForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {course.sections?.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p>No sections yet. Add your first section!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {course.sections.map((s, idx) => (
                  <div key={s._id} className="card border-0 shadow-sm p-3" style={{ borderRadius: 12 }}>
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-primary rounded-circle p-2" style={{ width: 32, height: 32 }}>{idx + 1}</span>
                      <div className="flex-grow-1">
                        <h6 className="fw-semibold mb-0">{s.title}</h6>
                        <p className="text-muted small mb-0">{s.content && s.content.length > 80 ? s.content.substring(0, 80) + '...' : s.content}</p>
                      </div>
                      {s.duration > 0 && <span className="text-muted small">{s.duration} min</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;
