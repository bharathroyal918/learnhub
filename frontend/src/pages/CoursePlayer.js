import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, updateProgress, downloadCertificate } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { CheckCircle, Download, PlayCircleOutline } from '@mui/icons-material';

const CoursePlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCourse = useCallback(async () => {
    try {
      const { data } = await getCourseById(id);
      setCourse(data);
    } catch (err) {
      console.error('Failed to load course:', err);
      navigate('/student/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const [completedSections, setCompletedSections] = useState([]);

  const handleMarkComplete = async (sectionId) => {
    try {
      const { data } = await updateProgress(id, sectionId);
      setCompletedSections(prev => [...prev, sectionId]);
      if (data.completed) {
        toast.success('🎉 Congratulations! You completed the course! Download your certificate.');
      } else {
        toast.success('Section marked as complete!');
      }
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const { data } = await downloadCertificate(id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${course.C_title}.pdf`;
      a.click();
    } catch (err) {
      toast.error('Course not completed yet or error generating certificate');
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (!course) return null;

  const section = course.sections[activeSection];
  const allCompleted = course.sections.length > 0 && course.sections.every(s => completedSections.includes(s._id));

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: 300, minWidth: 300, overflowY: 'auto' }}>
        <div className="p-3 border-bottom border-secondary">
          <h6 className="fw-bold mb-0">{course.C_title}</h6>
          <small className="text-muted">{completedSections.length}/{course.sections.length} completed</small>
          <div className="progress mt-2" style={{ height: 4 }}>
            <div className="progress-bar bg-primary" style={{ width: `${(completedSections.length / course.sections.length) * 100}%` }} />
          </div>
        </div>
        {course.sections.map((s, idx) => (
          <div key={s._id}
            className={`p-3 border-bottom border-secondary d-flex align-items-center gap-2 cursor-pointer ${activeSection === idx ? 'bg-primary' : 'hover'}`}
            onClick={() => setActiveSection(idx)}
            style={{ cursor: 'pointer' }}>
            {completedSections.includes(s._id)
              ? <CheckCircle className="text-success" fontSize="small" />
              : <PlayCircleOutline fontSize="small" className="opacity-50" />}
            <span className="small">{s.title}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-5" style={{ background: '#f8fafc' }}>
        {section ? (
          <>
            <h3 className="fw-bold mb-2">{section.title}</h3>
            {section.duration > 0 && <small className="text-muted">Duration: {section.duration} min</small>}
            {section.videoUrl && (
              <div className="mb-4 mt-3">
                <video controls width="100%" style={{ borderRadius: 12, maxHeight: 400 }}>
                  <source src={section.videoUrl} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <p className="mb-0">{section.content}</p>
            </div>
            {!completedSections.includes(section._id) ? (
              <button className="btn btn-success fw-bold px-4" onClick={() => handleMarkComplete(section._id)}>
                <CheckCircle className="me-2" /> Mark as Complete
              </button>
            ) : (
              <span className="text-success fw-semibold"><CheckCircle /> Section Completed</span>
            )}
          </>
        ) : (
          <p>No sections available</p>
        )}

        {allCompleted && (
          <div className="mt-4 p-4 bg-success bg-opacity-10 border border-success rounded" style={{ borderRadius: 12 }}>
            <h5 className="text-success fw-bold">🎉 Course Completed!</h5>
            <p className="mb-3">Congratulations! Download your certificate of completion.</p>
            <button className="btn btn-success fw-bold" onClick={handleDownloadCertificate}>
              <Download className="me-2" /> Download Certificate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
