import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Mic, Send, CheckCircle2, Bot } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import api from '../api.js';

const ROUND_META = {
  tech1: { label: 'Technical Round 1', desc: 'Resume-based & DSA discussion', endpoint: '/interview/tech1/questions' },
  tech2: { label: 'Technical Round 2', desc: 'System design & database architecture', endpoint: '/interview/tech2/questions' },
  hr: { label: 'HR Round', desc: 'Behavioral & leadership questions', endpoint: '/interview/hr/questions' }
};

export default function Interview() {
  const { round } = useParams();
  const meta = ROUND_META[round] || ROUND_META.tech1;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    api.get(meta.endpoint).then(({ data }) => {
      setQuestions(data.questions);
      setLoading(false);
    });
  }, [round]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        round,
        answers: questions.map(q => ({ question: q, answer: answers[q] || '' }))
      };
      const { data } = await api.post('/interview/submit', payload);
      setResult(data.result);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <Loader2 className="animate-spin text-accent2" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="section-label mb-2">AI Interviewer</p>
        <h1 className="text-3xl font-display font-bold mb-2">{meta.label}</h1>
        <p className="text-white/50 mb-10">{meta.desc}</p>

        {result ? (
          <div className="card text-center py-12">
            <CheckCircle2 size={40} className="mx-auto text-accent2 mb-4" />
            <p className="text-4xl font-display font-bold gradient-text mb-2">{result.avgConfidence}</p>
            <p className="text-white/50 mb-6">Average Confidence Score · {result.totalFillers} filler words detected</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
              <Link to="/report" className="btn-primary">View Final Report</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="card">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-accent2" />
                  </div>
                  <p className="font-medium pt-1">{q}</p>
                </div>
                <textarea
                  className="input-field min-h-[100px]"
                  placeholder="Type your answer here..."
                  value={answers[q] || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q]: e.target.value }))}
                />
              </div>
            ))}

            <div className="card !p-4 bg-surface2 flex items-center gap-3 text-white/40 text-sm">
              <Mic size={16} /> Voice-based answering & real-time speech analysis is on the roadmap — text mode is fully functional for now.
            </div>

            <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting ? <><Loader2 size={18} className="animate-spin" /> Analyzing answers...</> : <><Send size={18} /> Submit Round</>}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
