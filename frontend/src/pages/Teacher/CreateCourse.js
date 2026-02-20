import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../../utils/api';
import { toast } from 'react-toastify';

const CATEGORIES = ['Web Development', 'Data Science', 'Design', 'Business', 'Marketing', 'Mobile Development', 'Other'];

const CreateCourse = () => {
  const [form, setForm] = useState({
    C_title: '', C_description: '', C_categories: 'Web Development', C_price: 0, thumbnail: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await createCourse(form);
      toast.success('Course created successfully!');
      navigate(`/teacher/course/${data._id}/manage`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="mb-4">
              <button className="btn btn-link p-0 text-muted" onClick={() => navigate('/teacher/dashboard')}>
                ← Back to Dashboard
              </button>
            </div>
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 16 }}>
              <h3 className="fw-bold mb-4">Create New Course</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Course Title *</label>
                  <input type="text" className="form-control" required
                    value={form.C_title} onChange={e => setForm({ ...form, C_title: e.target.value })}
                    placeholder="e.g. Web Development Fundamentals" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description *</label>
                  <textarea className="form-control" rows={4} required
                    value={form.C_description}
                    onChange={e => setForm({ ...form, C_description: e.target.value })}
                    placeholder="Describe what students will learn..." />
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Category *</label>
                    <select className="form-select" value={form.C_categories}
                      onChange={e => setForm({ ...form, C_categories: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Price (USD)</label>
                    <input type="number" className="form-control" min={0}
                      value={form.C_price} onChange={e => setForm({ ...form, C_price: Number(e.target.value) })}
                      placeholder="0 for free" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Thumbnail URL (optional)</label>
                  <input type="url" className="form-control"
                    value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })}
                    placeholder="https://example.com/image.jpg" />
                </div>
                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-primary fw-bold px-5" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Course'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary"
                    onClick={() => navigate('/teacher/dashboard')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
