# 🌸 CA Tracker – CA Inter Group 1 Study Progress App

A full-stack real-time shared task tracker for 2 CA students to track study progress across all 4 Group 1 subjects.

---

## 📂 Project Structure

```
caproject/
├── server/           ← Node.js + Express backend
│   ├── index.js      ← Entry point
│   ├── .env          ← Environment variables
│   ├── models/       ← MongoDB models (User, Subject, Task)
│   ├── routes/       ← API routes (auth, subjects, tasks)
│   ├── middleware/   ← JWT auth middleware
│   └── utils/        ← Seed script
└── client/           ← React + Vite frontend
    └── src/
        ├── pages/    ← LoginPage, DashboardPage, SubjectPage
        ├── context/  ← AuthContext, ToastContext
        ├── components/ ← Navbar, ProtectedRoute
        └── utils/    ← API client (axios)
```

---

## 🚀 Getting Started

### Step 1: Set Up MongoDB

You have two options:

#### Option A: MongoDB Atlas (Free Cloud – Recommended)
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign up for a free account
3. Create a **Free Cluster** (M0)
4. Under **Database Access**, create a user with username/password
5. Under **Network Access**, add `0.0.0.0/0` to allow all IPs
6. Click **Connect** → **Connect your application** → copy the connection string
7. Replace the `MONGODB_URI` in `server/.env` with your Atlas URI:
   ```
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/caproject?retryWrites=true&w=majority
   ```

#### Option B: Install MongoDB Locally
1. Download MongoDB Community Server from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install and start the MongoDB service
3. Leave `MONGODB_URI=mongodb://localhost:27017/caproject` in `server/.env`

---

### Step 2: Configure Environment Variables

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=<your MongoDB URI from Step 1>
JWT_SECRET=supersecretkey_change_me_later
NODE_ENV=development
```

---

### Step 3: Seed the Database

This creates 2 student accounts + 4 CA subjects:

```bash
cd server
npm run seed
```

You should see:
```
✅ Users seeded
✅ CA Group 1 Subjects seeded

Login credentials:
  Student 1: user1@example.com  | password123
  Student 2: user2@example.com  | password123
```

---

### Step 4: Start the Backend Server

```bash
cd server
npm run dev
```

Server starts at: `http://localhost:5000`

---

### Step 5: Start the Frontend

Open a **new terminal window**:

```bash
cd client
npm run dev
```

Frontend starts at: `http://localhost:5173`

---

## 🔑 Login Credentials

| Student | Email | Password |
|---------|-------|----------|
| Student 1 | user1@example.com | password123 |
| Student 2 | user2@example.com | password123 |

---

## 📚 CA Group 1 Subjects Covered

| Paper | Subject |
|-------|---------|
| Paper 1 | **Accounting** – Financial accounting, AS, IFRS, Company accounts |
| Paper 2 | **Corporate & Other Laws** – Company Law, LLP, IBC |
| Paper 3 | **Cost & Management Accounting** – Costing, Budgeting, Standard Costing |
| Paper 4 | **Taxation** – Income Tax (60%) + GST & Customs (40%) |

---

## ✨ Features

- 🔐 JWT authentication with bcrypt password hashing
- 📋 Shared checklists per subject visible to both students
- ✅ Real-time task updates via **Socket.io** (no refresh needed!)
- 👤 Tracks **which student** completed each task
- 🌸 Beautiful **Pink + Brown** aesthetic design
- 📱 Fully responsive (mobile + desktop)
- 🔔 Toast notifications for all actions
- 📊 Progress bar per subject

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |
| GET | `/api/subjects` | Get all 4 CA subjects |
| GET | `/api/subjects/:id` | Get a specific subject |
| GET | `/api/tasks/:subjectId` | Get tasks for a subject |
| POST | `/api/tasks` | Add a new task |
| PUT | `/api/tasks/:id/toggle` | Toggle task completion |
| DELETE | `/api/tasks/:id` | Delete a task |
