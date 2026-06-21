import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileSearch, Brain, Code2, Users, Mic, BarChart3, ArrowRight, Trophy
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const steps = [
  { to: '/resume', icon: FileSearch, title: 'Resume & ATS Screening', desc: 'Upload your resume for AI scoring and feedback.' },
  { to: '/assessment', icon: Brain, title: 'Online Assessment', desc: 'DSA, OOP, DBMS, OS, CN & Aptitude test.' },
  { to: '/coding', icon: Code2, title: 'AI Coding Interview', desc: 'Solve problems with live test validation.' },
  { to: '/interview/tech1', icon: Users, title: 'Technical Round 1', desc: 'Resume-based & DSA discussion.' },
  { to: '/interview/tech2', icon: Users, title: 'Technical Round 2', desc: 'System design & database architecture.' },
  { to: '/interview/hr', icon: Mic, title: 'HR Round', desc: 'Behavioral & leadership questions.' },
  { to: '/report', icon: BarChart3, title: 'Final Hiring Report', desc: 'Your hiring probability & roadmap.' }
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="section-label mb-2">Candidate Dashboard</p>
            <h1 className="text-3xl font-display font-bold">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-white/50 mt-1">Move through each module to build your final hiring report.</p>
          </div>
          <Link to="/leaderboard" className="btn-secondary flex items-center gap-2">
            <Trophy size={16} /> View Leaderboard
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map(({ to, icon: Icon, title, desc }, idx) => (
            <Link key={to} to={to} className="card hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/20 to-accent2/20 flex items-center justify-center">
                  <Icon size={20} className="text-accent2" />
                </div>
                <span className="text-xs text-white/30">Step {idx + 1}</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">{title}</h3>
              <p className="text-white/50 text-sm mb-4">{desc}</p>
              <span className="text-accent2 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Start <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
