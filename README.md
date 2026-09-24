# Smart Study Planner

Smart Study Planner is an intelligent full-stack web application designed to help students organize their academic subjects, syllabus topics, and exam deadlines while automatically generating an adaptive, prioritized daily study schedule.

---

## 🌟 Key Features

1. **Subject & Syllabus Management**
   - Create and manage subjects with exam dates and custom color tags.
   - Break down subjects into detailed topics with difficulty levels (Easy, Medium, Hard) and estimated study times.

2. **Smart Deterministic Study Plan Generation**
   - Calculates priority based on:
     - **Difficulty Weight:** Hard topics are scheduled with higher urgency.
     - **Exam Urgency:** Topics with upcoming exams get prioritized.
     - **Estimated Topic Duration.**
   - Multi-phase learning sessions: Automatically splits topics into **LEARN**, **PRACTICE**, and **REVISION** tasks.
   - Enforces daily study hour limits without overloading the student.

3. **Intelligent Missed-Task Rescheduling**
   - Preserves original task records as `MISSED`.
   - Identifies remaining uncompleted hours.
   - Reallocates study time into future available slots without exceeding the student's daily capacity.

4. **Progress Analytics & Calendar View**
   - Real-time overall and subject-wise completion statistics.
   - Interactive calendar to view, complete, or reschedule tasks by date.
   - Exam countdown cards and urgency badges.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Tailwind CSS, React Router v6, Lucide Icons, Axios, Vite
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas (or local MongoDB)

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance

---

### 1. Backend Setup

1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `server` directory (or edit `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   NODE_ENV=development
   ```
4. Start the backend server:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Or standard production mode
   npm start
   ```
   *The server will run on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will run on `http://localhost:5173`.*

---

## 📡 API Endpoints Summary

### Subjects
- `GET /api/subjects` — Get all subjects
- `POST /api/subjects` — Create a new subject
- `GET /api/subjects/:id` — Get subject by ID with its syllabus topics
- `PUT /api/subjects/:id` — Update subject details
- `DELETE /api/subjects/:id` — Delete subject and cascade delete topics & plans

### Topics
- `GET /api/subjects/:subjectId/topics` — Get all topics for a subject
- `POST /api/subjects/:subjectId/topics` — Add a new topic
- `PUT /api/topics/:id` — Update topic (name, difficulty, status, duration)
- `DELETE /api/topics/:id` — Delete a topic

### Study Planner & Schedule
- `POST /api/planner/generate` — Generate study plan based on daily hours & topic priorities
- `GET /api/planner` — Get study plans (supports status and subject filtering)
- `GET /api/planner/date/:date` — Get all tasks for a specific date (`YYYY-MM-DD`)
- `PUT /api/planner/:id/status` — Mark task as `PENDING`, `COMPLETED`, or `MISSED`
- `POST /api/planner/reschedule` — Auto-reschedule a missed task into future available slots
- `GET /api/planner/progress` — Get aggregated progress and readiness metrics

---

## 🧪 Testing Checklist

- [x] Create subjects with custom colors and exam dates.
- [x] Add topics under a subject with Easy, Medium, and Hard difficulties.
- [x] Trigger the Study Plan Generator with custom daily hour limits (e.g., 4 hrs).
- [x] Verify tasks are prioritized by difficulty and exam urgency.
- [x] Verify tasks are distributed into LEARN, PRACTICE, and REVISION sessions.
- [x] Mark a task as COMPLETED and check progress bar updates.
- [x] Mark a task as MISSED and click "Auto-Reschedule" to verify future reallocation.
- [x] Navigate between Dashboard, Subjects, Planner, Calendar, and Progress pages.
