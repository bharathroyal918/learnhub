import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats } from '../../utils/api';
import { People, School, Book, Assignment } from '@mui/icons-material';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminStats()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: <People />, color: '#2563eb' },
    { label: 'Students', value: stats.totalStudents, icon: <School />, color: '#16a34a' },
    { label: 'Teachers', value: stats.totalTeachers, icon: <People />, color: '#d97706' },
    { label: 'Total Courses', value: stats.totalCourses, icon: <Book />, color: '#9333ea' },
    { label: 'Total Enrollments', value: stats.totalEnrollments, icon: <Assignment />, color: '#dc2626' },
  ] : [];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container py-5">
        <h2 className="fw-bold mb-1">Admin Dashboard</h2>
        <p className="text-muted mb-5">Platform overview and management</p>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <>
            <div className="row g-4 mb-5">
              {statCards.map((s, i) => (
                <div key={i} className="col-6 col-lg-4">
                  <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12, borderLeft: `4px solid ${s.color}` }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ color: s.color }}>{s.icon}</div>
                      <div>
                        <div className="fs-3 fw-bold">{s.value}</div>
                        <div className="text-muted small">{s.label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <div className="d-flex gap-3 flex-wrap">
              <button className="btn btn-primary px-4" onClick={() => navigate('/admin/users')}>
                Manage Users
              </button>
              <button className="btn btn-outline-primary px-4" onClick={() => navigate('/admin/enrollments')}>
                View Enrollments
              </button>
              <button className="btn btn-outline-secondary px-4" onClick={() => navigate('/courses')}>
                Browse All Courses
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
