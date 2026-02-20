import React from 'react';
import { Link } from 'react-router-dom';
import { School, TrendingUp, EmojiEvents, DevicesOther } from '@mui/icons-material';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="text-white text-center py-5" style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <School style={{ fontSize: 80 }} className="mb-3" />
          <h1 className="display-3 fw-bold mb-3">LearnHub</h1>
          <p className="lead mb-4 fs-4">Your Center for Skill Enhancement</p>
          <p className="mb-5 opacity-75 fs-5">Explore thousands of courses taught by industry experts.<br />Learn at your own pace, anywhere, anytime.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/courses" className="btn btn-light btn-lg px-4 fw-bold">Browse Courses</Link>
            <Link to="/register" className="btn btn-outline-light btn-lg px-4">Get Started Free</Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Why Choose LearnHub?</h2>
          <div className="row g-4">
            {[
              { icon: <TrendingUp fontSize="large" />, title: 'Self-Paced Learning', desc: 'Learn at your own speed. Pick up where you left off, anytime.' },
              { icon: <EmojiEvents fontSize="large" />, title: 'Earn Certificates', desc: 'Get verified certificates upon completing courses to boost your career.' },
              { icon: <DevicesOther fontSize="large" />, title: 'Any Device', desc: 'Access courses from desktop, tablet, or mobile seamlessly.' },
              { icon: <School fontSize="large" />, title: 'Expert Educators', desc: 'Learn from industry professionals with real-world experience.' },
            ].map((f, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100 text-center p-4">
                  <div className="mb-3" style={{ color: '#2563eb' }}>{f.icon}</div>
                  <h5 className="fw-bold">{f.title}</h5>
                  <p className="text-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-5 text-center">
        <div className="container">
          <h2 className="fw-bold mb-3">Ready to start learning?</h2>
          <p className="text-muted mb-4">Join thousands of learners growing their skills every day.</p>
          <Link to="/register" className="btn btn-primary btn-lg px-5">Join Now — It's Free</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
