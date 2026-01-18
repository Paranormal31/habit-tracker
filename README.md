# Habit Tracker

A full-stack habit tracking web application where users can create habits, track daily progress on a monthly calendar, and view completion statistics — with secure user authentication.

---

## 🚀 Features

- User registration and login with JWT-based authentication
- Create, delete, and manage personal habits
- Monthly calendar view for tracking daily habit completion
- Toggle habit completion per day
- Completion percentage dashboard
- Secure, user-specific data (each user sees only their own habits)
- Persistent login with logout functionality
- Fully deployed frontend and backend

---

## 🛠️ Tech Stack

### Frontend
- React
- Axios
- Vite
- Deployed on **Vercel**

### Backend
- Node.js
- Express
- MongoDB Atlas
- JWT Authentication
- Deployed on **Render**

---

## ⚙️ Running the Project Locally

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account (or local MongoDB)
- Git

---

### 1️ Clone the repository
```
git clone https://github.com/<your-username>/habit-tracker.git
cd habit-tracker
```

### 2 Backend Setup
```
cd backend
npm install
```

2.1 Create a .env file inside backend
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

2.2 Start Backend
```
npm start
```

### 3 Frontend Start
```
cd frontend
npm install
npm run dev
```
Frontend will run on:
```
http://localhost:5173
```

