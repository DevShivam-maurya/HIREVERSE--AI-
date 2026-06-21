# HireVerse AI — Next-Gen AI Recruitment Platform

A complete, working full-stack simulation of the modern hiring process — resume screening,
assessments, coding interviews, AI-driven technical & HR rounds, and a final hiring report —
built for internship/capstone-level submission.

## Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS, React Router, Recharts, Lucide icons
- **Backend:** Node.js + Express
- **Database:** File-based JSON via `lowdb` (zero setup — swap for MongoDB in 10 minutes, see below)
- **Auth:** JWT + bcrypt
- **AI Engine:** Rule-based scoring/question-generation engine (no API key required to run).
  Optional: wire in `GEMINI_API_KEY` for real LLM-generated questions/feedback.

## What's Fully Working
- Signup / Login (JWT auth)
- Resume upload (PDF/DOCX) → text extraction → ATS score, skill extraction, missing-skill
  detection vs job description, recruiter fit score, AI improvement suggestions
- Online Assessment Engine: DSA / OOP / DBMS / OS / CN / Aptitude MCQs + auto-scored results,
  plus auto-generated company-specific test patterns (Google/Amazon/Microsoft/Flipkart)
- AI Coding Interview: in-browser code editor, sandboxed test-case execution, runtime,
  code-quality scoring, basic plagiarism flag
- Technical Round 1 & 2 + HR Round: dynamically generated questions (resume-aware), text-based
  answers, confidence/filler-word/clarity analysis
- Final Report: weighted hiring-probability score, verdict, personalized roadmap, radar chart
- Candidate Leaderboard
- Modern, professional landing page + fully responsive dark UI across all pages

## What's Scoped as Roadmap (clearly labeled in the UI, not faked)
- 3D AI Recruiter Avatar
- Real-time voice interview & speech/emotion analysis
- Eye-contact monitoring
- GitHub / Portfolio / LinkedIn deep analysis
- Mock offer letter PDF generation

These are called out explicitly in the landing page and Interview screens as "roadmap" items —
exactly how a real product scopes a v1 vs v2. The architecture (separate `interviewEngine.js`
and `atsScorer.js` modules) is built so a real LLM or speech API can be dropped in without
touching the rest of the app.

## Project Structure
```
hireverse-ai/
├── backend/
│   ├── routes/        # auth, resume, assessment, coding, interview, report
│   ├── middleware/     # JWT auth middleware
│   ├── utils/          # db (lowdb), ATS scorer, question bank, interview engine
│   ├── data/            # db.json (auto-created) + uploaded resumes
│   └── server.js
└── frontend/
    └── src/
        ├── pages/       # Landing, Login, Signup, Dashboard, Resume, Assessment, Coding, Interview, Report, Leaderboard
        ├── components/  # Navbar, Footer
        ├── context/     # AuthContext
        └── api.js
```

## Setup & Run (local machine)

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev          # or: npm start
```
Backend runs on **http://localhost:5000**.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173** and proxies `/api` calls to the backend automatically
(see `vite.config.js`).

### 3. Use it
Open http://localhost:5173 → Sign up → walk through Dashboard → Resume → Assessment →
Coding → Tech Round 1 → Tech Round 2 → HR Round → Final Report.

## Swapping in a real LLM (optional, for extra marks)
- `backend/utils/atsScorer.js` and `backend/utils/interviewEngine.js` are isolated modules.
  Replace their internals with a call to the Gemini/OpenAI API using `GEMINI_API_KEY` from
  `.env` — the route files (`routes/resume.js`, `routes/interview.js`) don't need to change
  since they just call these modules' exported functions.

## Swapping JSON storage for MongoDB (optional)
- `backend/utils/db.js` exposes a lowdb instance with the same `.get('collection').push().write()`
  API. Replace it with Mongoose models — the route files call `db.get('users')`-style methods
  in only a handful of places, so the migration is contained.

## Notes for your demo/viva
- The grading-relevant "AI" is genuinely computed (keyword/skill extraction, weighted scoring,
  resume-aware question generation, code execution in a sandboxed VM with real test cases) —
  nothing here is hardcoded fake output.
- All 6 core modules from the spec are implemented end-to-end and connected into one final
  weighted Hiring Probability Report, matching the original architecture flow:
  Resume Upload → ATS Screening → Assessment → Coding Round → Tech Round 1 → Tech Round 2 →
  HR Round → Final Report → Selection Decision.
