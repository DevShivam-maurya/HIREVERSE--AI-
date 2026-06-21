const express = require('express');
const vm = require('vm');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const db = require('../utils/db');
const questionBank = require('../utils/questionBank');

const router = express.Router();

router.get('/problems', auth, (req, res) => {
  const problems = questionBank.coding.map(({ id, title, description, starterCode }) => ({
    id, title, description, starterCode
  }));
  res.json({ success: true, problems });
});

router.get('/problems/:id', auth, (req, res) => {
  const problem = questionBank.coding.find(p => p.id === req.params.id);
  if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
  const { testCases, ...safe } = problem;
  res.json({ success: true, problem: safe, visibleTestCount: testCases.length });
});

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function runUserCode(code, functionName, input) {
  const sandbox = {};
  vm.createContext(sandbox);
  const script = new vm.Script(`${code}\n;__result = ${functionName}(...__args);`);
  sandbox.__args = input;
  const start = Date.now();
  try {
    script.runInContext(sandbox, { timeout: 2000 });
    const runtimeMs = Date.now() - start;
    return { output: sandbox.__result, runtimeMs, error: null };
  } catch (err) {
    return { output: null, runtimeMs: Date.now() - start, error: err.message };
  }
}

function scoreCodeQuality(code) {
  let score = 100;
  if (code.length < 20) score -= 30;
  if (!/\/\//.test(code) && !/\/\*/.test(code)) score -= 5; // no comments, minor
  if (/var\s/.test(code)) score -= 5; // discourage var
  const lines = code.split('\n').filter(l => l.trim().length > 0);
  const avgLineLen = lines.reduce((a, l) => a + l.length, 0) / Math.max(1, lines.length);
  if (avgLineLen > 120) score -= 10; // long unreadable lines
  return Math.max(40, Math.min(100, score));
}

function detectPlagiarismStub(code, starterCode) {
  const normalize = s => s.replace(/\s+/g, '').toLowerCase();
  const similarity = normalize(code) === normalize(starterCode) ? 100 : 0;
  // Lightweight stub: flags only if it's literally just the starter code untouched.
  return { flagged: similarity === 100, similarityToStarter: similarity };
}

function functionNameFor(problemId) {
  const map = { code1: 'twoSum', code2: 'reverseString', code3: 'isPrime' };
  return map[problemId];
}

router.post('/run', auth, (req, res) => {
  const { problemId, code } = req.body;
  const problem = questionBank.coding.find(p => p.id === problemId);
  if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

  const fnName = functionNameFor(problemId);
  const results = problem.testCases.map((tc, idx) => {
    const { output, runtimeMs, error } = runUserCode(code, fnName, tc.input);
    const passed = !error && deepEqual(output, tc.expected);
    return { testCase: idx + 1, passed, runtimeMs, error, expected: tc.expected, got: output };
  });

  const passedCount = results.filter(r => r.passed).length;
  const codeQuality = scoreCodeQuality(code);
  const plagiarism = detectPlagiarismStub(code, problem.starterCode);
  const avgRuntime = Math.round(results.reduce((a, r) => a + r.runtimeMs, 0) / results.length);

  const submission = {
    id: uuidv4(),
    userId: req.user.id,
    problemId,
    code,
    passedCount,
    totalCases: results.length,
    codeQuality,
    plagiarism,
    avgRuntime,
    createdAt: new Date().toISOString()
  };
  db.get('codingSubmissions').push(submission).write();

  res.json({
    success: true,
    results,
    passedCount,
    totalCases: results.length,
    codeQuality,
    plagiarism,
    avgRuntime
  });
});

router.get('/history', auth, (req, res) => {
  const list = db.get('codingSubmissions').filter({ userId: req.user.id }).value().reverse();
  res.json({ success: true, submissions: list });
});

module.exports = router;
