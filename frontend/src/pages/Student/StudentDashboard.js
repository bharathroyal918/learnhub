import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEnrolledCourses } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { PlayArrow, School } from '@mui/icons-material';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getMyEnrolledCourses()
      .then(({ data }) => setCourses(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container py-5">
        <h2 className="fw-bold mb-1">Welcome back, {user?.name}!</h2>
        <p className="text-muted mb-5">Continue where you left off</p>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-5">
            <School style={{ fontSize: 80, color: '#cbd5e1' }} />
            <h5 className="mt-3 text-muted">No courses yet</h5>
            <p className="text-muted">Start your learning journey today!</p>
            <button className="btn btn-primary px-4" onClick={() => navigate('/courses')}>
              Browse Courses
            </button>
          </div>
        ) : (
          <>
            <h5 className="fw-bold mb-3">My Courses ({courses.length})</h5>
            <div className="row g-4">
              {courses.map(course => (
                <div key={course._id} className="col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                    <div style={{
                      height: 140,
                      background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                      borderRadius: '12px 12px 0 0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span className="text-white fw-bold fs-4">{course.C_title.charAt(0)}</span>
                    </div>
                    <div className="card-body">
                      <h6 className="fw-bold">{course.C_title}</h6>
                      <p className="text-muted small">{course.C_educator}</p>
                      <span className="badge bg-primary bg-opacity-10 text-primary">{course.C_categories}</span>
                    </div>
                    <div className="card-footer bg-transparent border-0 pb-3">
                      <button className="btn btn-primary w-100 fw-semibold"
                        onClick={() => navigate(`/student/course/${course._id}/learn`)}>
                        <PlayArrow /> Continue Learning
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
