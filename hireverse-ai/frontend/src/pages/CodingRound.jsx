import React, { useEffect, useState } from 'react';
import { Play, Loader2, CheckCircle2, XCircle, Gauge, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import api from '../api.js';

export default function CodingRound() {
  const [problems, setProblems] = useState([]);
  const [active, setActive] = useState(null);
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    api.get('/coding/problems').then(({ data }) => {
      setProblems(data.problems);
      setActive(data.problems[0]);
      setCode(data.problems[0]?.starterCode || '');
    });
  }, []);

  const selectProblem = (p) => {
    setActive(p);
    setCode(p.starterCode);
    setOutput(null);
  };

  const runCode = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const { data } = await api.post('/coding/run', { problemId: active.id, code });
      setOutput(data);
    } finally {
      setRunning(false);
    }
  };

  if (!active) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <Loader2 className="animate-spin text-accent2" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="section-label mb-2">Module 3</p>
        <h1 className="text-3xl font-display font-bold mb-2">AI Coding Interview</h1>
        <p className="text-white/50 mb-8">Solve the problem in JavaScript. Your code is run against hidden test cases with runtime & quality scoring.</p>

        <div className="grid lg:grid-cols-[220px_1fr_1fr] gap-6">
          {/* Problem list */}
          <div className="space-y-2">
            {problems.map(p => (
              <button
                key={p.id}
                onClick={() => selectProblem(p)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition ${
                  active.id === p.id ? 'bg-accent/20 border-accent text-white' : 'bg-surface2 border-white/10 text-white/60 hover:border-white/30'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="card flex flex-col">
            <h3 className="font-semibold mb-2">{active.title}</h3>
            <p className="text-white/50 text-sm mb-4">{active.description}</p>
            <textarea
              className="flex-1 min-h-[300px] w-full bg-[#0d1326] border border-white/10 rounded-xl p-4 font-mono text-sm text-accent2 focus:outline-none focus:ring-2 focus:ring-accent/60"
              spellCheck={false}
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <button onClick={runCode} disabled={running} className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
              {running ? <><Loader2 size={18} className="animate-spin" /> Running...</> : <><Play size={18} /> Run & Submit</>}
            </button>
          </div>

          {/* Output */}
          <div className="card">
            <h3 className="font-semibold mb-4">Results</h3>
            {!output && <p className="text-white/30 text-sm">Run your code to see test results, runtime, and quality score.</p>}
            {output && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <Stat label="Passed" value={`${output.passedCount}/${output.totalCases}`} icon={CheckCircle2} good={output.passedCount === output.totalCases} />
                  <Stat label="Quality" value={`${output.codeQuality}`} icon={Gauge} good={output.codeQuality >= 70} />
                  <Stat label="Runtime" value={`${output.avgRuntime}ms`} icon={ShieldCheck} good={output.avgRuntime < 50} />
                </div>

                <div className="space-y-2">
                  {output.results.map(r => (
                    <div key={r.testCase} className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg ${r.passed ? 'bg-accent2/10 text-accent2' : 'bg-danger/10 text-danger'}`}>
                      <span className="flex items-center gap-2">
                        {r.passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        Test case {r.testCase}
                      </span>
                      {!r.passed && <span className="text-xs text-white/40">{r.error ? 'Error' : 'Wrong output'}</span>}
                    </div>
                  ))}
                </div>

                {output.plagiarism?.flagged && (
                  <div className="bg-warn/10 text-warn text-sm rounded-lg px-3 py-2">⚠️ Submission matches the starter template — no original logic detected.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Stat({ label, value, icon: Icon, good }) {
  return (
    <div className="bg-surface2 rounded-xl p-3 text-center">
      <Icon size={16} className={`mx-auto mb-1 ${good ? 'text-accent2' : 'text-warn'}`} />
      <p className="font-semibold">{value}</p>
      <p className="text-[10px] text-white/40 uppercase">{label}</p>
    </div>
  );
}
