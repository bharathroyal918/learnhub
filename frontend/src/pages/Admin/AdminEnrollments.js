import React, { useState, useEffect } from 'react';
import { getAdminEnrollments } from '../../utils/api';
import { CheckCircle, AccessTime } from '@mui/icons-material';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminEnrollments()
      .then(({ data }) => setEnrollments(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container py-5">
        <h3 className="fw-bold mb-2">All Enrollments</h3>
        <p className="text-muted mb-4">Track all student enrollments across courses</p>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : enrollments.length === 0 ? (
          <p className="text-muted">No enrollments found.</p>
        ) : (
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Enrolled Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e, idx) => (
                    <tr key={idx}>
                      <td className="fw-semibold">{e.student?.name || 'N/A'}</td>
                      <td className="text-muted">{e.student?.email || 'N/A'}</td>
                      <td>{e.courseTitle}</td>
                      <td className="text-muted">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                      <td>
                        {e.completed
                          ? <span className="text-success"><CheckCircle fontSize="small" /> Completed</span>
                          : <span className="text-warning"><AccessTime fontSize="small" /> In Progress</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnrollments;
