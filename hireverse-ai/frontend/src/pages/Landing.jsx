import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, FileSearch, Brain, Code2, Mic, Users, BarChart3,
  CheckCircle2, Briefcase, Trophy, Gauge
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const modules = [
  { icon: FileSearch, title: 'ATS Resume Screening', desc: 'Upload your resume and get an instant ATS score, skill extraction, missing-skill detection, and AI improvement tips.' },
  { icon: Brain, title: 'Online Assessment Engine', desc: 'DSA, OOP, DBMS, OS, Computer Networks & Aptitude — auto-generated, company-specific test patterns.' },
  { icon: Code2, title: 'AI Coding Interview', desc: 'Solve problems in an integrated editor with live test validation, runtime analysis, and code-quality scoring.' },
  { icon: Users, title: 'Technical Interviews', desc: 'Two AI-driven technical rounds covering your resume, DSA, system design, and database architecture.' },
  { icon: Mic, title: 'HR Round', desc: 'Behavioral and leadership questions with confidence scoring and communication feedback.' },
  { icon: BarChart3, title: 'Final Hiring Report', desc: 'A weighted hiring-probability score across the entire pipeline, plus a personalized improvement roadmap.' }
];

const wow = [
  'AI Recruiter Avatar (3D interviewer) — roadmap',
  'Voice-based interview & real-time speech analysis — roadmap',
  'Filler-word & emotion detection — roadmap',
  'Company-specific modes: Google, Amazon, Microsoft, Flipkart',
  'Candidate leaderboard & recruiter dashboard',
  'GitHub, Portfolio & LinkedIn profile analysis — roadmap'
];

const flow = [
  'Resume Upload', 'ATS Screening', 'Assessment', 'Coding Round',
  'Tech Round 1', 'Tech Round 2', 'HR Round', 'Final Report'
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <Navbar />

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />
          <span className="text-sm text-white/70">Simulate the entire hiring journey, end to end</span>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
          The hiring process,<br /><span className="gradient-text">finally demystified.</span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
          HireVerse AI is a complete AI-driven recruitment platform — from resume upload to final
          hiring decision — so students can practice the exact process real companies use.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/signup" className="btn-primary flex items-center gap-2">
            Start Free Simulation <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary">I already have an account</Link>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            ['6', 'Hiring Modules'],
            ['7+', 'Question Categories'],
            ['100%', 'Free to practice'],
            ['1', 'Unified Report']
          ].map(([num, label]) => (
            <div key={label} className="card !p-4">
              <p className="text-2xl font-display font-bold gradient-text">{num}</p>
              <p className="text-xs text-white/50 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PIPELINE FLOW */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <p className="section-label text-center mb-3">The Pipeline</p>
        <h2 className="text-3xl font-display font-bold text-center mb-12">One platform, the full hiring journey</h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {flow.map((step, i) => (
            <React.Fragment key={step}>
              <div className="card !p-4 !rounded-xl flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent2 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm font-medium">{step}</span>
              </div>
              {i < flow.length - 1 && <ArrowRight size={16} className="text-white/20" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <p className="section-label text-center mb-3">Core Modules</p>
        <h2 className="text-3xl font-display font-bold text-center mb-12">Everything a real hiring process tests</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:border-accent/40 hover:-translate-y-1 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/20 to-accent2/20 flex items-center justify-center mb-4">
                <Icon size={20} className="text-accent2" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WOW FEATURES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="card !p-10 bg-gradient-to-br from-surface to-surface2 border-accent/20">
          <div className="flex items-center gap-2 mb-6">
            <Trophy size={20} className="text-warn" />
            <p className="section-label !text-warn">WOW Features</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {wow.map(item => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-accent2 mt-0.5 shrink-0" />
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-6">
            Items marked "roadmap" are scoped in the architecture and ready to plug in once a multimedia/voice provider is connected.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-28 text-center">
        <div className="card !p-12 bg-gradient-to-br from-accent/10 to-accent2/10 border-accent/30">
          <Gauge size={32} className="mx-auto text-accent2 mb-4" />
          <h2 className="text-3xl font-display font-bold mb-3">Know exactly where you stand</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Get a single hiring-probability score and a personalized roadmap after completing the full simulation.
          </p>
          <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
            <Briefcase size={18} /> Begin Your Mock Hiring Journey
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
