const express = require('express');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const db = require('../utils/db');

const router = express.Router();

function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

router.get('/generate', auth, (req, res) => {
  const userId = req.user.id;

  const resumes = db.get('resumes').filter({ userId }).value();
  const assessments = db.get('assessments').filter({ userId }).value();
  const submissions = db.get('codingSubmissions').filter({ userId }).value();
  const interviews = db.get('interviews').filter({ userId }).value();

  const latestResume = resumes[resumes.length - 1] || null;
  const atsScore = latestResume ? latestResume.atsScore : 0;
  const recruiterFit = latestResume ? latestResume.recruiterFitScore : 0;

  const assessmentScore = assessments.length ? avg(assessments.map(a => a.scorePercent)) : 0;

  const codingScore = submissions.length
    ? avg(submissions.map(s => Math.round((s.passedCount / s.totalCases) * 100)))
    : 0;
  const codeQualityScore = submissions.length ? avg(submissions.map(s => s.codeQuality)) : 0;

  const tech1 = interviews.filter(i => i.round === 'tech1');
  const tech2 = interviews.filter(i => i.round === 'tech2');
  const hr = interviews.filter(i => i.round === 'hr');

  const tech1Score = tech1.length ? avg(tech1.map(i => i.avgConfidence)) : 0;
  const tech2Score = tech2.length ? avg(tech2.map(i => i.avgConfidence)) : 0;
  const hrScore = hr.length ? avg(hr.map(i => i.avgConfidence)) : 0;

  // Weighted hiring probability across the full pipeline
  const weights = {
    ats: 0.15,
    assessment: 0.15,
    coding: 0.2,
    codeQuality: 0.05,
    tech1: 0.15,
    tech2: 0.15,
    hr: 0.15
  };

  const componentsPresent = [
    [atsScore, weights.ats, !!latestResume],
    [assessmentScore, weights.assessment, assessments.length > 0],
    [codingScore, weights.coding, submissions.length > 0],
    [codeQualityScore, weights.codeQuality, submissions.length > 0],
    [tech1Score, weights.tech1, tech1.length > 0],
    [tech2Score, weights.tech2, tech2.length > 0],
    [hrScore, weights.hr, hr.length > 0]
  ];

  const usedWeightSum = componentsPresent.filter(c => c[2]).reduce((a, c) => a + c[1], 0);
  let hiringProbability = 0;
  if (usedWeightSum > 0) {
    const weightedSum = componentsPresent.reduce((acc, c) => acc + (c[2] ? c[0] * c[1] : 0), 0);
    hiringProbability = Math.round(weightedSum / usedWeightSum);
  }

  let verdict = 'Incomplete pipeline';
  if (usedWeightSum >= 0.5) {
    if (hiringProbability >= 75) verdict = 'Strong Hire';
    else if (hiringProbability >= 55) verdict = 'Hire';
    else if (hiringProbability >= 35) verdict = 'Borderline';
    else verdict = 'Not Recommended';
  }

  const roadmap = [];
  if (atsScore < 70 && latestResume) roadmap.push('Improve resume: add quantified achievements and missing keywords.');
  if (assessmentScore < 60 && assessments.length) roadmap.push('Revise core CS fundamentals — DSA, DBMS, OS, and CN.');
  if (codingScore < 60 && submissions.length) roadmap.push('Practice more DSA coding problems, focusing on edge cases.');
  if (tech1Score < 60 && tech1.length) roadmap.push('Practice articulating project details clearly and concisely.');
  if (tech2Score < 60 && tech2.length) roadmap.push('Study system design fundamentals — scalability, caching, DB design.');
  if (hrScore < 60 && hr.length) roadmap.push('Work on structured storytelling (STAR method) for behavioral questions.');
  if (!latestResume) roadmap.push('Upload your resume to start the ATS screening module.');
  if (roadmap.length === 0) roadmap.push('Great performance across the pipeline — keep refining for top-tier companies.');

  const report = {
    id: uuidv4(),
    userId,
    atsScore,
    recruiterFit,
    assessmentScore,
    codingScore,
    codeQualityScore,
    tech1Score,
    tech2Score,
    hrScore,
    hiringProbability,
    verdict,
    roadmap,
    pipelineComplete: componentsPresent.every(c => c[2]),
    generatedAt: new Date().toISOString()
  };

  db.get('reports').push(report).write();

  res.json({ success: true, report });
});

router.get('/leaderboard', (req, res) => {
  const reports = db.get('reports').value();
  const users = db.get('users').value();
  const latestPerUser = {};
  reports.forEach(r => {
    latestPerUser[r.userId] = r; // keep last (reports pushed chronologically)
  });
  const leaderboard = Object.values(latestPerUser)
    .map(r => {
      const user = users.find(u => u.id === r.userId);
      return {
        name: user ? user.name : 'Anonymous',
        hiringProbability: r.hiringProbability,
        verdict: r.verdict
      };
    })
    .sort((a, b) => b.hiringProbability - a.hiringProbability)
    .slice(0, 20);

  res.json({ success: true, leaderboard });
});

module.exports = router;
