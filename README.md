# LearnHub - Online Learning Platform

## Project Structure

```
olp/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, Profile
│   │   ├── courseController.js      # CRUD courses, enroll, progress
│   │   ├── adminController.js       # Admin: users, enrollments, stats
│   │   ├── paymentController.js     # Stripe payment intent & confirm
│   │   └── certificateController.js # PDF certificate generation
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT protect, isTeacher, isAdmin, isStudent
│   ├── models/
│   │   ├── User.js                  # name, email, password, type
│   │   └── Course.js                # title, sections, enrolled[], price, etc.
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── certificateRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   └── Common/
        │       ├── Navbar.js         # Responsive navbar
        │       └── CourseCard.js     # Reusable course card
        ├── context/
        │   └── AuthContext.js        # Global auth state
        ├── pages/
        │   ├── Home.js               # Landing page
        │   ├── Login.js
        │   ├── Register.js
        │   ├── CourseList.js         # Browse + filter courses
        │   ├── CourseDetail.js       # Course info + enroll
        │   ├── CoursePlayer.js       # Section-by-section learning
        │   ├── Student/
        │   │   └── StudentDashboard.js
        │   ├── Teacher/
        │   │   ├── TeacherDashboard.js
        │   │   ├── CreateCourse.js
        │   │   └── ManageCourse.js   # Add sections, view enrollments
        │   └── Admin/
        │       ├── AdminDashboard.js # Stats overview
        │       ├── AdminUsers.js     # View/delete users
        │       └── AdminEnrollments.js
        ├── utils/
        │   └── api.js                # Axios + all API calls
        ├── App.js                    # Routes + PrivateRoute guard
        └── index.js
```

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/profile | Any | Get own profile |
| GET | /api/courses | Public | List/filter courses |
| GET | /api/courses/:id | Public | Course detail |
| POST | /api/courses | Teacher | Create course |
| PUT | /api/courses/:id | Teacher/Admin | Update course |
| DELETE | /api/courses/:id | Teacher/Admin | Delete course |
| POST | /api/courses/:id/sections | Teacher | Add section |
| POST | /api/courses/:id/enroll | Student | Enroll (free) |
| PUT | /api/courses/:id/progress | Student | Update section progress |
| GET | /api/courses/enrolled/me | Student | My enrolled courses |
| GET | /api/courses/teacher/me | Teacher | My created courses |
| POST | /api/payment/create-payment-intent | Student | Stripe payment init |
| POST | /api/payment/confirm | Student | Confirm & enroll |
| GET | /api/certificate/:courseId | Student | Download PDF cert |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | All users |
| DELETE | /api/admin/users/:id | Admin | Delete user |
| GET | /api/admin/enrollments | Admin | All enrollments |
| GET | /api/admin/courses | Admin | All courses |

## Tech Stack
- **Frontend:** React, React Router, Axios, Bootstrap 5, Material UI, React Toastify
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Stripe, PDFKit
