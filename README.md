# Campus API Gateway

A robust, secure, and scalable RESTful API backend for campus management, built with Node.js, Express, and MongoDB. This project implements best practices for authentication, role-based access, data validation, and modular architecture, supporting workflows for students, lecturers, and administrators.

## Features

- **User Management**: Admin can manage students, lecturers, and other admins.
- **Authentication & Authorization**: JWT-based authentication and role-based access control (admin, lecturer, student).
- **Course Management**: CRUD operations for courses, with lecturer assignment and academic year/semester support.
- **Enrollment System**: Students can enroll in available courses; admin can manage all enrollments.
- **Task Management**: Lecturers can create assignments automatically distributed to enrolled students.
- **Attendance Tracking**: Students can submit attendance; admin and lecturers can monitor records.
- **Schedule Management**: Manage and view class schedules.
- **Validation & Security**: Input validation (express-validator), security headers (helmet), body size limiting, and error handling.
- **API Documentation & Testing**: Designed for easy integration with Postman for automated end-to-end workflow testing.

## Tech Stack
- **Node.js** & **Express**
- **MongoDB** (Mongoose ODM)
- **JWT** for authentication
- **express-validator**, **helmet**, **cors**

## Project Structure
```
src/
  controllers/      # Business logic for each resource
  models/           # Mongoose schemas and models
  routes/           # Express route definitions
  index.js          # App entry point and route mounting
```

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```powershell
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret.
4. **Run the server**
   ```powershell
   npm run dev
   ```
   or
   ```powershell
   npm start
   ```

## API Endpoints (Summary)
- `/api/auth` — Register & login
- `/api/user` — User management (admin only)
- `/api/course` — Course management (admin only)
- `/api/enrollment` — Student enrolls course, view enrollments
- `/api/enrollment/admin` — Admin enrollment management
- `/api/task` — Task/assignment management
- `/api/attendance` — Attendance management
- `/api/schedule` — Schedule management

## Best Practices Implemented
- **Environment Variables**: All secrets and DB URIs are managed via `.env`.
- **Modular Codebase**: Separation of concerns for controllers, models, and routes.
- **Validation & Error Handling**: All input is validated and errors are handled gracefully.
- **Security**: Helmet, CORS, and body size limits are enforced.
- **Role-based Access**: Middleware ensures only authorized users can access sensitive endpoints.
- **Consistent Naming**: All code, endpoints, and fields use English and follow naming conventions.
- **Automated Testing Ready**: Designed for easy integration with Postman Collection Runner for workflow testing.

## Contribution
Pull requests are welcome! Please follow the existing code style and best practices.

## License
MIT
