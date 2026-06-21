import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import api from '../api.js';

const SECTION_LABELS = {
  dsa: 'Data Structures & Algorithms',
  oop: 'Object-Oriented Programming',
  dbms: 'Database Management Systems',
  os: 'Operating Systems',
  cn: 'Computer Networks',
  aptitude: 'Aptitude'
};

export default function Assessment() {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get('/assessment/test').then(({ data }) => {
      setTest(data.test);
      setLoading(false);
    });
  }, []);

  const selectAnswer = (qid, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qid]: optionIdx }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/assessment/submit', { answers });
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="section-label mb-2">Module 2</p>
        <h1 className="text-3xl font-display font-bold mb-2">Online Assessment Engine</h1>
        <p className="text-white/50 mb-10">Answer questions across all core CS sections, then submit for instant scoring.</p>

        {result ? (
          <div className="card text-center py-12">
            <CheckCircle2 size={40} className="mx-auto text-accent2 mb-4" />
            <p className="text-4xl font-display font-bold gradient-text mb-2">{result.scorePercent}%</p>
            <p className="text-white/50 mb-6">{result.correct} / {result.total} correct</p>
            <div className="grid sm:grid-cols-3 gap-3 max-w-xl mx-auto">
              {Object.entries(result.sectionResults).map(([sec, r]) => (
                <div key={sec} className="bg-surface2 rounded-lg p-3">
                  <p className="text-xs text-white/40 uppercase">{sec}</p>
                  <p className="text-lg font-semibold">{r.correct}/{r.total}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(test).map(([section, questions]) => (
              <div key={section}>
                <h2 className="text-lg font-display font-semibold mb-4 text-accent2">{SECTION_LABELS[section] || section}</h2>
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="card !p-5">
                      <p className="font-medium mb-3">{idx + 1}. {q.q}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => selectAnswer(q.id, oIdx)}
                            className={`text-left text-sm px-4 py-2.5 rounded-lg border transition ${
                              answers[q.id] === oIdx
                                ? 'bg-accent/20 border-accent text-white'
                                : 'bg-surface2 border-white/10 text-white/70 hover:border-white/30'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Send size={18} /> Submit Assessment</>}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
