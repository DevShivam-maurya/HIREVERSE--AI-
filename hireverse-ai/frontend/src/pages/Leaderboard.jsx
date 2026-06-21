import React, { useEffect, useState } from 'react';
import { Loader2, Trophy, Medal } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import api from '../api.js';

const MEDAL_COLORS = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];

export default function Leaderboard() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/report/leaderboard').then(({ data }) => {
      setList(data.leaderboard);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="section-label mb-2">Module 7</p>
        <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
          <Trophy className="text-warn" /> Candidate Leaderboard
        </h1>
        <p className="text-white/50 mb-10">Ranked by hiring probability across all candidates who completed a report.</p>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent2" size={32} /></div>
        ) : list.length === 0 ? (
          <div className="card text-center py-16 text-white/40">No candidates have generated a report yet. Be the first!</div>
        ) : (
          <div className="card divide-y divide-white/5">
            {list.map((c, i) => (
              <div key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <span className={`w-8 text-center font-display font-bold ${MEDAL_COLORS[i] || 'text-white/30'}`}>
                    {i < 3 ? <Medal size={20} /> : i + 1}
                  </span>
                  <span className="font-medium">{c.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-white/40">{c.verdict}</span>
                  <span className="font-display font-bold text-accent2">{c.hiringProbability}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
