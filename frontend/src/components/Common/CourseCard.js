import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, Person, AttachMoney } from '@mui/icons-material';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        height: '160px',
        background: course.thumbnail ? `url(${course.thumbnail}) center/cover` : 'linear-gradient(135deg, #1e3a5f, #2563eb)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {!course.thumbnail && (
          <span className="text-white fw-bold fs-4">{course.C_title?.charAt(0)}</span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold mb-1">{course.C_title}</h5>
        <p className="text-muted small mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.C_description}
        </p>
        <div className="d-flex align-items-center gap-3 text-muted small mb-2">
          <span><Person fontSize="small" /> {course.C_educator}</span>
          <span><Category fontSize="small" /> {course.C_categories}</span>
        </div>
        <div className="mt-auto d-flex align-items-center justify-content-between">
          <span className="fw-bold" style={{ color: course.C_price === 0 ? '#16a34a' : '#2563eb' }}>
            {course.C_price === 0 ? 'Free' : `$${course.C_price}`}
          </span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/courses/${course._id}`)}
          >
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
