import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getUserProfile = () => API.get('/auth/profile');

// Courses
export const getCourses = (params) => API.get('/courses', { params });
export const getCourseById = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);
export const addSection = (id, data) => API.post(`/courses/${id}/sections`, data);
export const enrollCourse = (id) => API.post(`/courses/${id}/enroll`);
export const updateProgress = (id, sectionId) => API.put(`/courses/${id}/progress`, { sectionId });
export const getMyEnrolledCourses = () => API.get('/courses/enrolled/me');
export const getTeacherCourses = () => API.get('/courses/teacher/me');

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
export const getAdminEnrollments = () => API.get('/admin/enrollments');
export const getAdminCourses = () => API.get('/admin/courses');

// Payment
export const createPaymentIntent = (courseId) => API.post('/payment/create-payment-intent', { courseId });
export const confirmPayment = (courseId) => API.post('/payment/confirm', { courseId });

// Certificate
export const downloadCertificate = (courseId) => API.get(`/certificate/${courseId}`, { responseType: 'blob' });

export default API;
