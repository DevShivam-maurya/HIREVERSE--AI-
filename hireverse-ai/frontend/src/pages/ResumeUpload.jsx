import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import api from '../api.js';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a PDF or DOCX file.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data.resume);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="section-label mb-2">Module 1</p>
        <h1 className="text-3xl font-display font-bold mb-2">ATS Resume Screening</h1>
        <p className="text-white/50 mb-10">Upload your resume to get an instant ATS score, extracted skills, and improvement suggestions.</p>

        <div className="grid lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="card space-y-5">
            <label className="block">
              <span className="text-sm text-white/70 mb-2 block">Resume file (PDF or DOCX)</span>
              <div className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center hover:border-accent/50 transition cursor-pointer">
                <input
                  type="file" accept=".pdf,.docx" className="hidden" id="resumeFile"
                  onChange={e => setFile(e.target.files[0])}
                />
                <label htmlFor="resumeFile" className="cursor-pointer flex flex-col items-center gap-3">
                  <UploadCloud size={32} className="text-accent2" />
                  <span className="text-sm text-white/60">{file ? file.name : 'Click to upload your resume'}</span>
                </label>
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-white/70 mb-2 block">Job description (optional, improves match scoring)</span>
              <textarea
                className="input-field min-h-[120px]" placeholder="Paste a job description here..."
                value={jobDescription} onChange={e => setJobDescription(e.target.value)}
              />
            </label>

            {error && <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-lg px-4 py-3">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing resume...</> : <><FileText size={18} /> Analyze Resume</>}
            </button>
          </form>

          <div className="card">
            {!result && (
              <div className="h-full flex flex-col items-center justify-center text-center text-white/30 py-20">
                <FileText size={40} className="mb-4" />
                <p>Your ATS results will appear here.</p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <ScoreCard label="ATS Score" value={result.atsScore} />
                  <ScoreCard label="Recruiter Fit" value={result.recruiterFitScore} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white/70 mb-2">Extracted Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.extractedSkills.length === 0 && <span className="text-white/30 text-sm">No skills detected</span>}
                    {result.extractedSkills.map(s => (
                      <span key={s} className="bg-accent/15 text-accent2 text-xs px-3 py-1 rounded-full capitalize">{s}</span>
                    ))}
                  </div>
                </div>

                {result.missingSkills?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white/70 mb-2 flex items-center gap-1">
                      <AlertTriangle size={14} className="text-warn" /> Missing Skills (vs Job Description)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.map(s => (
                        <span key={s} className="bg-warn/10 text-warn text-xs px-3 py-1 rounded-full capitalize">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-white/70 mb-2">AI Improvement Suggestions</h3>
                  <ul className="space-y-2">
                    {result.suggestions.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                        <CheckCircle2 size={15} className="text-accent2 mt-0.5 shrink-0" /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ScoreCard({ label, value }) {
  const color = value >= 75 ? 'text-accent2' : value >= 50 ? 'text-warn' : 'text-danger';
  return (
    <div className="bg-surface2 rounded-xl p-4 text-center">
      <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
      <p className="text-xs text-white/50 mt-1">{label}</p>
    </div>
  );
}
