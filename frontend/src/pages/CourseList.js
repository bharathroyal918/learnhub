import React, { useState, useEffect, useCallback } from 'react';
import { getCourses } from '../utils/api';
import CourseCard from '../components/Common/CourseCard';
import { Search } from '@mui/icons-material';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Design', 'Business', 'Marketing', 'Mobile Development'];

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchCourses = useCallback(async () => {
    try {
      const params = {};
      if (search) params.name = search;
      if (category !== 'All') params.category = category;
      const { data } = await getCourses(params);
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="py-5" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container">
        <h2 className="fw-bold mb-2">Browse Courses</h2>
        <p className="text-muted mb-4">Explore our wide range of courses</p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="input-group" style={{ maxWidth: 500 }}>
            <input type="text" className="form-control" placeholder="Search courses by name..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="btn btn-primary">
              <Search />
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {CATEGORIES.map(cat => (
            <button key={cat}
              className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h5>No courses found</h5>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="row g-4">
            {courses.map(course => (
              <div key={course._id} className="col-sm-6 col-lg-4">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
