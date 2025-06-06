# Campus API Gateway

A robust, secure, and scalable RESTful API backend for campus management, built with Node.js, Express, and MongoDB. This project implements best practices for authentication, role-based access, data validation, and modular architecture, supporting workflows for students, lecturers, and administrators.

## Features

- **User Management**: Admin can manage students, lecturers, and other admins.
- **Authentication & Authorization**: JWT-based authentication, role-based access control (admin, lecturer, student), and **granular custom permission** via the `permissions` array and `permit(permission)` middleware for fine-grained endpoint protection.
- **Course Management**: CRUD operations for courses, with multi-lecturer assignment and academic year/semester support.
- **Parallel Class**: Manage parallel classes for a course, each with its own lecturers, code, and schedule.
- **Enrollment System**: Students can enroll/drop courses; admin can manage all enrollments. Enrollment status (`active`/`dropped`) is tracked.
- **Task Management**: Lecturers can create assignments automatically distributed to enrolled students. **Automatic email notification** (Ethereal) is sent to all enrolled students when a new task is created.
- **Attendance Tracking**: Students can submit attendance (with proof upload: upload file → get path → submit attendance with proof path); admin and lecturers can monitor. Attendance is validated against schedule, holidays, time window, and duplicate entries.
- **Holiday Management**: Admin can manage holidays via `/api/holiday`.
- **Schedule Management**: Manage and view class schedules.
- **Validation & Security**: Input validation (express-validator), security headers (helmet), body size limiting, error handling, and file upload validation (multer, type/size).
- **API Documentation & Testing**: Postman collection is available for end-to-end testing.

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
  attendance/       # Uploaded proof files for attendance (should NOT be committed to git)
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
- `/api/attendance` — Attendance management (student submit, with proof path)
- `/api/schedule` — Schedule management
- `/api/holiday` — Holiday management (admin only)
- `/api/upload/proof` — Upload attendance proof file (returns path)

## Attendance Proof Upload Flow (Best Practice)
1. **Upload proof file** to endpoint `/api/upload/proof` (form-data, field: `proof`). Response: `{ path: "/uploads/attendance/xxx.png" }`
2. **Submit attendance** to `/api/attendance` with the `proof` field containing the uploaded file path (not the file itself).
3. For status `present`/`absent`, the `proof` field can be omitted.

## File Upload & Validation
- Attendance proof files are uploaded using `multer` and stored in `uploads/attendance/`.
- Only image (jpg/png/gif) and PDF files are allowed, max 2MB.
- (Recommended) Add further validation for file type/size in production.

## How to Remove uploads/ from GitHub and Prevent Future Uploads
1. **Add to `.gitignore`** (already present, ensure the line `uploads/` is not commented):
   ```
   uploads/
   ```
2. **Remove the folder from git history and remote:**
   Run in terminal:
   ```powershell
   git rm -r --cached uploads
   git commit -m "Remove uploads folder from repository"
   git push origin <branch>
   ```
   After this, the `uploads/` folder will only exist locally and will not be pushed to GitHub again.

## Testing & Workflow
- All features are tested and documented in the Postman collection.
- See the example requests for proof upload and attendance submission above.

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
