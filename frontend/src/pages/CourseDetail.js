import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, enrollCourse } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { PlayCircle, Person, Category, MenuBook } from '@mui/icons-material';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getCourseById(id).then(({ data }) => setCourse(data)).finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    if (user.type !== 'student') return toast.error('Only students can enroll');

    if (course.C_price > 0) {
      return toast.info(`This course costs $${course.C_price}. Please contact support to complete payment and enrollment.`);
    }

    setEnrolling(true);
    try {
      await enrollCourse(id);
      toast.success('Enrolled successfully!');
      navigate(`/student/course/${id}/learn`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (!course) return <div className="text-center py-5">Course not found</div>;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="text-white py-5" style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <span className="badge bg-light text-primary mb-2">{course.C_categories}</span>
              <h1 className="fw-bold mb-3">{course.C_title}</h1>
              <p className="opacity-90 mb-3">{course.C_description}</p>
              <div className="d-flex align-items-center gap-4 opacity-75">
                <span><Person fontSize="small" /> {course.C_educator}</span>
                <span><MenuBook fontSize="small" /> {course.sections?.length || 0} sections</span>
              </div>
            </div>
            <div className="col-lg-4 mt-4 mt-lg-0">
              <div className="card border-0 shadow-lg p-4">
                <div className="text-dark mb-3">
                  <span className="fs-2 fw-bold" style={{ color: course.C_price === 0 ? '#16a34a' : '#2563eb' }}>
                    {course.C_price === 0 ? 'Free' : `$${course.C_price}`}
                  </span>
                </div>
                <button className="btn btn-primary btn-lg w-100 mb-2 fw-bold" onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? 'Enrolling...' : course.C_price > 0 ? `Enroll for $${course.C_price}` : 'Enroll for Free'}
                </button>
                <p className="text-muted small text-center mb-0">30-Day Money Back Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="container py-5">
        <h3 className="fw-bold mb-4">Course Content</h3>
        {course.sections?.length === 0 ? (
          <p className="text-muted">No sections added yet.</p>
        ) : (
          <div className="accordion" id="sectionsAccordion">
            {course.sections?.map((section, idx) => (
              <div key={section._id} className="accordion-item mb-2 border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed fw-semibold" type="button"
                    data-bs-toggle="collapse" data-bs-target={`#section${idx}`}>
                    <PlayCircle className="me-2 text-primary" />
                    {section.title}
                    {section.duration > 0 && <span className="ms-auto text-muted small me-2">{section.duration} min</span>}
                  </button>
                </h2>
                <div id={`section${idx}`} className="accordion-collapse collapse" data-bs-parent="#sectionsAccordion">
                  <div className="accordion-body text-muted">
                    {section.content}
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

export default CourseDetail;
