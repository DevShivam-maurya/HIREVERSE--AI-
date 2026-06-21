import React, { useEffect, useState } from 'react';
import { Loader2, Award, TrendingUp, Map } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import api from '../api.js';

const VERDICT_COLOR = {
  'Strong Hire': 'text-accent2',
  'Hire': 'text-accent2',
  'Borderline': 'text-warn',
  'Not Recommended': 'text-danger',
  'Incomplete pipeline': 'text-white/50'
};

export default function Report() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/report/generate').then(({ data }) => {
      setReport(data.report);
      setLoading(false);
    });
  }, []);

  if (loading || !report) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <Loader2 className="animate-spin text-accent2" size={32} />
      </div>
    );
  }

  const chartData = [
    { metric: 'ATS', value: report.atsScore },
    { metric: 'Assessment', value: report.assessmentScore },
    { metric: 'Coding', value: report.codingScore },
    { metric: 'Tech R1', value: report.tech1Score },
    { metric: 'Tech R2', value: report.tech2Score },
    { metric: 'HR', value: report.hrScore }
  ];

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="section-label mb-2">Final Step</p>
        <h1 className="text-3xl font-display font-bold mb-2">Your Hiring Report</h1>
        <p className="text-white/50 mb-10">A unified, AI-weighted view of your performance across the entire pipeline.</p>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="card text-center flex flex-col items-center justify-center">
            <Award size={32} className="text-accent2 mb-3" />
            <p className="text-6xl font-display font-bold gradient-text mb-2">{report.hiringProbability}%</p>
            <p className="text-white/50 mb-3">Hiring Probability</p>
            <span className={`text-sm font-semibold px-4 py-1.5 rounded-full bg-white/5 ${VERDICT_COLOR[report.verdict]}`}>
              {report.verdict}
            </span>
            {!report.pipelineComplete && (
              <p className="text-white/30 text-xs mt-4">Complete all modules for the most accurate prediction.</p>
            )}
          </div>

          <div className="card">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={chartData}>
                <PolarGrid stroke="#2A3358" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#9aa3c0', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="#00D9C0" fill="#6C5CE7" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {chartData.map(({ metric, value }) => (
            <div key={metric} className="card !p-4 text-center">
              <p className="text-2xl font-display font-bold text-accent2">{value}</p>
              <p className="text-xs text-white/40 mt-1">{metric}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Map size={18} className="text-accent2" />
            <h3 className="font-semibold">Personalized Improvement Roadmap</h3>
          </div>
          <ul className="space-y-3">
            {report.roadmap.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                <TrendingUp size={15} className="text-accent2 mt-0.5 shrink-0" /> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
