import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} HireVerse AI. Built for learning real-world hiring simulation.</p>
        <div className="flex gap-6 text-white/40 text-sm">
          <span>Full Stack</span>
          <span>·</span>
          <span>AI Integration</span>
          <span>·</span>
          <span>System Design</span>
        </div>
      </div>
    </footer>
  );
}
