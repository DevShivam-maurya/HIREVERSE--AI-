# 🚀 HireVerse AI

HireVerse AI is a full-stack AI-powered hiring simulation platform designed to help students and job seekers prepare for real-world recruitment processes. The platform provides resume analysis, aptitude assessments, coding challenges, AI-generated interview questions, and detailed performance reports in a modern and interactive environment.

---

## 🌐 Live Demo

**Frontend:**
https://hireverse-3q1d4lbwj-devshivam-mauryas-projects.vercel.app

**Backend API:**
https://hireverse-ai.onrender.com

---

## ✨ Features

### 🔐 Authentication

* User Registration
* Secure Login System
* JWT-based Authentication
* Protected Routes

### 📄 Resume Analyzer

* Resume Upload
* ATS-style Resume Evaluation
* Resume Feedback & Scoring

### 🤖 AI Interview Simulator

* AI-generated Interview Questions
* Technical Interview Practice
* Behavioral Interview Questions
* Realistic Interview Experience

### 💻 Coding Round

* Coding Challenges
* Code Submission
* Performance Evaluation

### 🧠 Assessment Module

* Aptitude Questions
* Multiple Choice Assessments
* Score Calculation

### 📊 Reports & Analytics

* Candidate Performance Reports
* Interview Analysis
* Assessment Scores
* Progress Tracking

### 🏆 Leaderboard

* Ranking System
* Performance Comparison

### 🎨 Modern UI

* Responsive Design
* Mobile-Friendly Interface
* Clean and Professional User Experience

---

## 🏗️ Project Structure

```bash
hireverse-ai/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── data/
│   └── server.js
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* Tailwind CSS
* Lucide React

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* LowDB

### AI Integration

* Google Gemini API

### Deployment

* Vercel (Frontend)
* Render (Backend)
* GitHub (Version Control)

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/DevShivam-maurya/HIREVERSE--AI-.git
cd HIREVERSE--AI-
```

---

### Backend Setup

```bash
cd hireverse-ai/backend
npm install
```

Create a `.env` file:

```env
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
```

Run Backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd hireverse-ai/frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/signup
POST /api/auth/login
```

### Resume

```http
POST /api/resume/upload
```

### Assessment

```http
POST /api/assessment/start
POST /api/assessment/submit
```

### Coding

```http
POST /api/coding/start
POST /api/coding/submit
```

### Interview

```http
POST /api/interview/start
POST /api/interview/answer
```

### Reports

```http
GET /api/report/:id
```

---

## 🚀 Deployment

### Frontend

Hosted on Vercel:
https://hireverse-3q1d4lbwj-devshivam-mauryas-projects.vercel.app

### Backend

Hosted on Render:
https://hireverse-ai.onrender.com

---

## 🎯 Future Improvements

* Company-specific interview preparation
* Voice-based AI interviews
* Video interview analysis
* Advanced ATS Resume Scanner
* Real-time coding editor
* AI Career Guidance

---

## 👨‍💻 Author

**Shivam Maurya**

GitHub:
https://github.com/DevShivam-maurya

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
It helps others discover the project and supports future development.
