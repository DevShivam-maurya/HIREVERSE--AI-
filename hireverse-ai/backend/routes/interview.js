const express = require('express');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const db = require('../utils/db');
const {
  generateTech1Questions,
  generateTech2Questions,
  generateHRQuestions,
  analyzeAnswer
} = require('../utils/interviewEngine');

const router = express.Router();

router.get('/tech1/questions', auth, (req, res) => {
  const resumes = db.get('resumes').filter({ userId: req.user.id }).value();
  const latest = resumes[resumes.length - 1];
  const skills = latest ? latest.extractedSkills : [];
  const questions = generateTech1Questions(skills);
  res.json({ success: true, round: 'Technical Round 1', questions });
});

router.get('/tech2/questions', auth, (req, res) => {
  const questions = generateTech2Questions();
  res.json({ success: true, round: 'Technical Round 2', questions });
});

router.get('/hr/questions', auth, (req, res) => {
  const questions = generateHRQuestions();
  res.json({ success: true, round: 'HR Round', questions });
});

// Submit answers for any round: { round: 'tech1'|'tech2'|'hr', answers: [{question, answer}] }
router.post('/submit', auth, (req, res) => {
  const { round, answers = [] } = req.body;
  if (!round || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: 'round and answers[] required' });
  }

  const analyzed = answers.map(a => ({
    question: a.question,
    answer: a.answer,
    analysis: analyzeAnswer(a.answer || '')
  }));

  const avgConfidence = analyzed.length
    ? Math.round(analyzed.reduce((acc, a) => acc + a.analysis.confidenceScore, 0) / analyzed.length)
    : 0;
  const totalFillers = analyzed.reduce((acc, a) => acc + a.analysis.fillerWordCount, 0);

  const record = {
    id: uuidv4(),
    userId: req.user.id,
    round,
    analyzed,
    avgConfidence,
    totalFillers,
    createdAt: new Date().toISOString()
  };
  db.get('interviews').push(record).write();

  res.json({ success: true, result: record });
});

router.get('/history', auth, (req, res) => {
  const list = db.get('interviews').filter({ userId: req.user.id }).value().reverse();
  res.json({ success: true, interviews: list });
});

module.exports = router;
