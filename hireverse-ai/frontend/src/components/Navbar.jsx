import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-ink/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg">HireVerse <span className="gradient-text">AI</span></span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm text-white/70 hover:text-white transition">Dashboard</Link>
            <Link to="/leaderboard" className="text-sm text-white/70 hover:text-white transition">Leaderboard</Link>
            <span className="text-sm text-white/50 hidden sm:block">Hi, {user?.name?.split(' ')[0]}</span>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-1 text-sm bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/70 hover:text-white transition">Log in</Link>
            <Link to="/signup" className="btn-primary !px-5 !py-2 text-sm">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
