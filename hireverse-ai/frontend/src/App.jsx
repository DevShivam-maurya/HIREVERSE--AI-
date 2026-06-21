import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ResumeUpload from './pages/ResumeUpload.jsx';
import Assessment from './pages/Assessment.jsx';
import CodingRound from './pages/CodingRound.jsx';
import Interview from './pages/Interview.jsx';
import Report from './pages/Report.jsx';
import Leaderboard from './pages/Leaderboard.jsx';

function Protected({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/resume" element={<Protected><ResumeUpload /></Protected>} />
      <Route path="/assessment" element={<Protected><Assessment /></Protected>} />
      <Route path="/coding" element={<Protected><CodingRound /></Protected>} />
      <Route path="/interview/:round" element={<Protected><Interview /></Protected>} />
      <Route path="/report" element={<Protected><Report /></Protected>} />
      <Route path="/leaderboard" element={<Protected><Leaderboard /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
