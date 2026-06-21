// utils/interviewEngine.js
// Generates dynamic, resume-aware interview questions without requiring
// an external LLM key. If GEMINI_API_KEY is set, routes can optionally
// call out to a real model instead (see README for the swap point).

const TECH1_BANK = [
  "Walk me through the most challenging project on your resume — what was your specific contribution?",
  "What data structure would you use to implement an LRU cache, and why?",
  "Explain the difference between a process and a thread.",
  "How would you optimize a slow SQL query in one of your projects?",
  "Tell me about a bug you struggled to fix. How did you debug it?",
  "What's the time complexity of the core algorithm in your project, and could it be improved?"
];

const TECH2_BANK = [
  "Design a URL shortener like bit.ly — what are the key components?",
  "How would you scale your project's backend to handle 1 million users?",
  "Explain database normalization and when you'd intentionally denormalize.",
  "How would you design the schema for a multi-tenant SaaS application?",
  "What caching strategy would you use to reduce database load?",
  "Walk me through how you'd design a rate limiter for an API."
];

const HR_BANK = [
  "Tell me about a time you disagreed with a teammate. How did you resolve it?",
  "Why do you want to work at this company?",
  "Describe a situation where you had to learn something new quickly under pressure.",
  "How do you handle tight deadlines and competing priorities?",
  "Tell me about a time you took initiative without being asked.",
  "Where do you see yourself in 3 years?"
];

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function generateResumeFollowUp(resumeSkills = []) {
  if (!resumeSkills.length) return "Tell me more about a recent project you're proud of.";
  const skill = resumeSkills[Math.floor(Math.random() * resumeSkills.length)];
  return `I see ${skill} on your resume — can you explain a real scenario where you used it to solve a problem?`;
}

function generateTech1Questions(resumeSkills = []) {
  const base = pickN(TECH1_BANK, 4);
  return [generateResumeFollowUp(resumeSkills), ...base];
}

function generateTech2Questions() {
  return pickN(TECH2_BANK, 5);
}

function generateHRQuestions() {
  return pickN(HR_BANK, 5);
}

// Lightweight heuristic "speech/text" analysis for the HR round answers
function analyzeAnswer(answerText = '') {
  const text = answerText.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const fillerWords = ["um", "uh", "like", "you know", "basically", "actually", "sort of"];
  const lower = text.toLowerCase();
  const fillerCount = fillerWords.reduce((acc, w) => acc + (lower.split(w).length - 1), 0);

  let confidence = 70;
  if (wordCount > 40) confidence += 10;
  if (wordCount < 15) confidence -= 20;
  confidence -= fillerCount * 5;
  confidence = Math.max(10, Math.min(100, confidence));

  let clarity = wordCount > 20 && fillerCount <= 2 ? 'Clear and structured' : 'Could be more structured';

  return {
    wordCount,
    fillerWordCount: fillerCount,
    confidenceScore: Math.round(confidence),
    clarity
  };
}

module.exports = {
  generateTech1Questions,
  generateTech2Questions,
  generateHRQuestions,
  analyzeAnswer
};
