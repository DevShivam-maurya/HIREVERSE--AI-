const express = require('express');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const db = require('../utils/db');
const questionBank = require('../utils/questionBank');

const router = express.Router();

const SECTIONS = ['dsa', 'oop', 'dbms', 'os', 'cn', 'aptitude'];

// GET full test (questions without revealing answers)
router.get('/test', auth, (req, res) => {
  const test = {};
  SECTIONS.forEach(sec => {
    test[sec] = questionBank[sec].map(({ id, q, options }) => ({ id, q, options }));
  });
  res.json({ success: true, test });
});

// Auto-generated company-specific test (weights sections differently)
router.get('/test/:company', auth, (req, res) => {
  const company = req.params.company.toLowerCase();
  const weightMap = {
    google: ['dsa', 'dsa', 'oop', 'os', 'aptitude'],
    amazon: ['dsa', 'dsa', 'dbms', 'aptitude', 'oop'],
    microsoft: ['dsa', 'oop', 'os', 'cn', 'aptitude'],
    flipkart: ['dsa', 'dbms', 'dsa', 'aptitude', 'oop']
  };
  const sectionsForCompany = weightMap[company] || SECTIONS;
  const test = {};
  sectionsForCompany.forEach(sec => {
    test[sec] = questionBank[sec].map(({ id, q, options }) => ({ id, q, options }));
  });
  res.json({ success: true, company, test });
});

// Submit answers: { answers: { dsa1: 1, oop2: 0, ... } }
router.post('/submit', auth, (req, res) => {
  const { answers = {} } = req.body;
  let correct = 0;
  let total = 0;
  const sectionResults = {};

  SECTIONS.forEach(sec => {
    let secCorrect = 0;
    questionBank[sec].forEach(qObj => {
      total++;
      if (Object.prototype.hasOwnProperty.call(answers, qObj.id)) {
        if (answers[qObj.id] === qObj.answer) {
          correct++;
          secCorrect++;
        }
      }
    });
    sectionResults[sec] = { correct: secCorrect, total: questionBank[sec].length };
  });

  const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;

  const record = {
    id: uuidv4(),
    userId: req.user.id,
    correct,
    total,
    scorePercent,
    sectionResults,
    createdAt: new Date().toISOString()
  };
  db.get('assessments').push(record).write();

  res.json({ success: true, result: record });
});

router.get('/history', auth, (req, res) => {
  const list = db.get('assessments').filter({ userId: req.user.id }).value().reverse();
  res.json({ success: true, assessments: list });
});

module.exports = router;
