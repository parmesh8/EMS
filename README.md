# Employee Management System

A full-stack MERN application for managing employees, departments, salaries, leaves, and attendance with role-based access (Admin and Employee).

## Folder Structure
- `backend/`: Node.js/Express backend with MongoDB.
- `frontend/`: React frontend with Tailwind CSS.

## Prerequisites
- Node.js
- MongoDB
- Vercel CLI (for deployment)

## Backend Setup
1. Navigate to `backend/`
2. Install dependencies: `npm install`
3. Create a `.env` file with:

MONGODB_URI=mongodb://localhost:27017/employee-management
JWT_SECRET=your_jwt_secret_key
PORT=5000

4. Run the server: `npm start`
5. For development: `npm run dev`

## Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Create a `.env` file with:

REACT_APP_API_URL=http://localhost:5000

4. Run the app: `npm start`

## Deployment
- **Backend**: Deploy to Vercel using `vercel.json`. Set environment variables in Vercel dashboard.
- **Frontend**: Deploy to Vercel. Set `REACT_APP_API_URL` to backend URL.
- Ensure CORS is configured correctly in the backend.

## Features
- Role-based authentication (Admin/Employee)
- CRUD for departments, employees, salaries, leaves, attendance
- Pagination, sorting, filtering
- Responsive UI with Tailwind CSS
- Toast notifications for user feedback
- Cascade deletions (e.g., deleting department updates employees)

## Notes
- Replace `MONGODB_URI` with your MongoDB Atlas or local MongoDB connection string.
- Use a strong `JWT_SECRET` for security.
- Test thoroughly before deployment.