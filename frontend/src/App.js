import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Common/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer';

// Student pages
import StudentDashboard from './pages/Student/StudentDashboard';

// Teacher pages
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import CreateCourse from './pages/Teacher/CreateCourse';
import ManageCourse from './pages/Teacher/ManageCourse';

// Admin pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminEnrollments from './pages/Admin/AdminEnrollments';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.type)) return <Navigate to="/" />;
  return children;
};

const AppContent = () => {
  return (
    <Router>
      <Navbar />
      <div className="container-fluid p-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />
          <Route path="/student/course/:id/learn" element={
            <PrivateRoute allowedRoles={['student']}>
              <CoursePlayer />
            </PrivateRoute>
          } />

          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </PrivateRoute>
          } />
          <Route path="/teacher/create-course" element={
            <PrivateRoute allowedRoles={['teacher']}>
              <CreateCourse />
            </PrivateRoute>
          } />
          <Route path="/teacher/course/:id/manage" element={
            <PrivateRoute allowedRoles={['teacher']}>
              <ManageCourse />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminUsers />
            </PrivateRoute>
          } />
          <Route path="/admin/enrollments" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminEnrollments />
            </PrivateRoute>
          } />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
