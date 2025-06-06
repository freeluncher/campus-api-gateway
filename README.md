# Campus API Gateway

A robust, secure, and scalable RESTful API backend for campus management, built with Node.js, Express, and MongoDB. This project implements best practices for authentication, role-based access, data validation, and modular architecture, supporting workflows for students, lecturers, and administrators.

## Features

- **User Management**: Admin can manage students, lecturers, and other admins.
- **Authentication & Authorization**: JWT-based authentication, role-based access control (admin, lecturer, student), and **granular custom permission** via `permissions` array and `permit(permission)` middleware for fine-grained endpoint protection.
- **Course Management**: CRUD operations for courses, with multi-lecturer assignment and academic year/semester support.
- **Parallel Class (Kelas Paralel)**: Manage parallel classes for a course, each with its own lecturers, code, and schedule.
- **Enrollment System**: Students can enroll/drop courses; admin can manage all enrollments. Enrollment status (`active`/`dropped`) is tracked.
- **Task Management**: Lecturers can create assignments automatically distributed to enrolled students. **Automatic email notification** (Ethereal) sent to all enrolled students when a new task is created.
- **Attendance Tracking**: Students can submit attendance (with proof upload for permission/sick); admin and lecturers can monitor records. Attendance is validated against schedule, holidays, and time window (10 min before–15 min after start).
- **Holiday Management**: Manage national/campus holidays to prevent attendance on those days.
- **Schedule Management**: Manage and view class schedules.
- **Validation & Security**: Input validation (express-validator), security headers (helmet), body size limiting, error handling, and file upload validation (multer).
- **API Documentation & Testing**: Designed for easy integration with Postman for automated end-to-end workflow testing.

## Tech Stack
- **Node.js** & **Express**
- **MongoDB** (Mongoose ODM)
- **JWT** for authentication
- **express-validator**, **helmet**, **cors**, **multer**, **moment-timezone**, **nodemailer** (Ethereal)

## Project Structure
```
src/
  controllers/      # Business logic for each resource
  models/           # Mongoose schemas and models
  routes/           # Express route definitions
  utils/            # Utility functions (email, etc)
  index.js          # App entry point and route mounting
uploads/
  attendance/       # Uploaded proof files for attendance
```

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```powershell
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your MongoDB URI, JWT secret, and Ethereal email credentials.
4. **Run the server**
   ```powershell
   npm run dev
   ```
   or
   ```powershell
   npm start
   ```
5. **Seed initial data (optional but recommended):**
   - Seed holidays: `node seedHolidays.js`
   - Create first admin: `node seedAdmin.js`

## API Endpoints (Summary)
- `/api/auth` — Register & login (register always creates student role)
- `/api/user` — User management (admin only, supports granular permission)
- `/api/course` — Course management (admin only, multi-lecturer)
- `/api/parallel-class` — Parallel class management (admin only)
- `/api/enrollment` — Student enroll/drop course, view enrollments
- `/api/enrollment/admin` — Admin enrollment management
- `/api/task` — Task/assignment management (lecturer/admin, with email notification)
- `/api/attendance` — Attendance management (student submit, with proof upload)
- `/api/schedule` — Schedule management
- `/api/holiday` — Holiday management (admin only)

## Key Features & Security Updates (2025-06-06)

### Parallel Class (Kelas Paralel)
- Support for managing parallel classes per course, each with its own lecturers, code, and schedule.

### Granular Custom Permission
- Each user has a `permissions` array (e.g. `attendance:create`, `user:update`).
- Middleware `permit(permission)` enforces fine-grained access control on sensitive endpoints.
- Admin always has all permissions by default.

### Attendance Validation & Proof Upload
- Attendance can only be submitted by students with active enrollment.
- Attendance is only allowed on scheduled days, within a 10-min-before to 15-min-after window (Asia/Jakarta timezone).
- Attendance is blocked on holidays (see `/api/holiday`).
- Duplicate attendance for the same course and day is prevented.
- If status is `permission` or `sick`, a proof file (image/pdf) must be uploaded (form-data, field `proof`).

### Holiday Management
- Holidays are managed via `/api/holiday` and seeded with `seedHolidays.js`.
- Attendance is automatically blocked on holidays.

### Email Notification (Ethereal)
- When a new task is created, all enrolled students receive an automatic email notification (using free Ethereal SMTP, see `.env`).
- Email utility is in `src/utils/email.js`.

### Security & Registration
- Public registration always creates users with role `student` (role input is ignored).
- Only admin can create admin/lecturer accounts via `/api/user`.
- Use `seedAdmin.js` to create the first admin safely.
- All sensitive endpoints protected by both role and granular permission middleware.
- All error responses include a code for easier debugging.

### File Upload & Validation
- Attendance proof files are uploaded using `multer` and stored in `uploads/attendance/`.
- (Recommended) Add further validation for file type/size in production.

### Testing & Workflow
- All new features are tested and documented for Postman workflow.
- See API usage section for request/response examples.

## Changelog (2025-06-06)
- Refactor all naming to English (model, controller, route, field)
- Add: ParallelClass model, controller, route
- Add: `permissions` field to User, granular permission middleware
- Add: Holiday model, controller, route, and seed script
- Add: Attendance proof upload, validation, and time window logic
- Add: Automatic email notification (Ethereal) for new tasks
- Add: Enrollment status (`active`/`dropped`), drop course endpoint
- Add: Security best practices, error code in all responses
- Add: Seed scripts for admin and holidays
- Update: All endpoints to use English naming and consistent error handling

## Contribution
Pull requests are welcome! Please follow the existing code style and best practices.

## License
MIT
