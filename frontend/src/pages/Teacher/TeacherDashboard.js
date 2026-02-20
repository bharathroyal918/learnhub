import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeacherCourses, deleteCourse } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Add, Delete, Settings, Group } from '@mui/icons-material';

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCourses = () => {
    getTeacherCourses()
      .then(({ data }) => setCourses(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id, enrolledCount) => {
    if (enrolledCount > 0) {
      return toast.error('Cannot delete course with enrolled students');
    }
    if (!window.confirm('Delete this course?')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted');
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold mb-1">Teacher Dashboard</h2>
            <p className="text-muted mb-0">Welcome, {user?.name}</p>
          </div>
          <button className="btn btn-primary fw-semibold px-4" onClick={() => navigate('/teacher/create-course')}>
            <Add /> Create Course
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">No courses yet. Create your first course!</h5>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/teacher/create-course')}>
              Create Course
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {courses.map(course => (
              <div key={course._id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                  <div style={{
                    height: 100, background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                    borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span className="text-white fw-bold">{course.C_title.charAt(0)}</span>
                  </div>
                  <div className="card-body">
                    <h6 className="fw-bold">{course.C_title}</h6>
                    <p className="text-muted small mb-2">{course.C_categories}</p>
                    <div className="d-flex gap-3 text-muted small mb-2">
                      <span>{course.sections?.length || 0} sections</span>
                      <span><Group fontSize="small" /> {course.enrolled?.length || 0} enrolled</span>
                    </div>
                    <span className={`badge ${course.C_price === 0 ? 'bg-success' : 'bg-primary'}`}>
                      {course.C_price === 0 ? 'Free' : `$${course.C_price}`}
                    </span>
                  </div>
                  <div className="card-footer bg-transparent border-0 pb-3 d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm flex-grow-1"
                      onClick={() => navigate(`/teacher/course/${course._id}/manage`)}>
                      <Settings fontSize="small" /> Manage
                    </button>
                    <button className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(course._id, course.enrolled?.length)}>
                      <Delete fontSize="small" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
