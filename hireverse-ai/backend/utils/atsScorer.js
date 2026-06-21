// utils/atsScorer.js
// Rule-based ATS engine: keyword/skill extraction, scoring, gap analysis,
// and improvement suggestions. Designed to be swapped for a real LLM call
// (see utils/aiClient.js) without changing the API contract.

const SKILL_LIBRARY = {
  "Programming Languages": ["javascript", "python", "java", "c++", "c", "typescript", "go", "rust", "php", "kotlin", "swift"],
  "Frontend": ["react", "redux", "next.js", "vue", "angular", "tailwind", "html", "css", "bootstrap", "sass"],
  "Backend": ["node.js", "express", "django", "flask", "spring boot", "fastapi", "rest api", "graphql", "microservices"],
  "Database": ["mongodb", "mysql", "postgresql", "sql", "redis", "firebase", "dynamodb", "sqlite"],
  "DevOps/Cloud": ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "jenkins", "github actions", "linux", "nginx"],
  "AI/ML": ["machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "opencv", "scikit-learn", "gemini api", "openai api", "llm"],
  "CS Fundamentals": ["data structures", "algorithms", "oop", "dbms", "operating systems", "computer networks", "system design"],
  "Tools": ["git", "github", "jira", "postman", "figma", "vs code", "webpack"],
  "Soft Skills": ["leadership", "communication", "teamwork", "problem solving", "time management"]
};

const ALL_SKILLS = Object.values(SKILL_LIBRARY).flat();

const SECTION_HEADERS = ["experience", "education", "projects", "skills", "certifications", "summary", "objective"];

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, ' ');
}

function extractSkills(text) {
  const norm = normalize(text);
  const found = [];
  ALL_SKILLS.forEach(skill => {
    const pattern = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${pattern}\\b`, 'i');
    if (regex.test(norm)) found.push(skill);
  });
  return [...new Set(found)];
}

function detectMissingSkills(resumeSkills, jobSkills) {
  const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
  return jobSkills.filter(s => !resumeSet.has(s.toLowerCase()));
}

function detectSections(text) {
  const norm = normalize(text);
  const present = SECTION_HEADERS.filter(h => norm.includes(h));
  return present;
}

function scoreResume(text, jobDescription = '') {
  const norm = normalize(text);
  const wordCount = norm.split(' ').filter(Boolean).length;
  const resumeSkills = extractSkills(text);
  const sections = detectSections(text);

  let score = 0;
  const breakdown = {};

  // 1. Skill richness (max 35)
  const skillScore = Math.min(35, resumeSkills.length * 2.5);
  score += skillScore;
  breakdown.skillsScore = Math.round(skillScore);

  // 2. Section completeness (max 20)
  const sectionScore = Math.min(20, sections.length * (20 / SECTION_HEADERS.length));
  score += sectionScore;
  breakdown.sectionsScore = Math.round(sectionScore);

  // 3. Length / depth (max 15)
  let lengthScore = 0;
  if (wordCount > 150 && wordCount < 1200) lengthScore = 15;
  else if (wordCount >= 1200) lengthScore = 10;
  else lengthScore = Math.round((wordCount / 150) * 15);
  score += lengthScore;
  breakdown.lengthScore = Math.round(lengthScore);

  // 4. Action verbs / quantified impact (max 15)
  const actionVerbs = ["built", "developed", "designed", "led", "improved", "implemented", "optimized", "created", "launched", "managed", "automated", "reduced", "increased"];
  const verbHits = actionVerbs.filter(v => norm.includes(v)).length;
  const hasNumbers = /\d+%|\d+\s?(users|projects|years|x\b)/.test(norm);
  let impactScore = Math.min(10, verbHits * 1.5) + (hasNumbers ? 5 : 0);
  impactScore = Math.min(15, impactScore);
  score += impactScore;
  breakdown.impactScore = Math.round(impactScore);

  // 5. Job description match (max 15) - only if JD provided, else redistribute
  let jdScore = 0;
  let missingSkills = [];
  if (jobDescription && jobDescription.trim().length > 0) {
    const jdSkills = extractSkills(jobDescription);
    missingSkills = detectMissingSkills(resumeSkills, jdSkills);
    const matched = jdSkills.length - missingSkills.length;
    jdScore = jdSkills.length > 0 ? Math.min(15, (matched / jdSkills.length) * 15) : 7.5;
  } else {
    jdScore = 7.5; // neutral baseline when no JD given
  }
  score += jdScore;
  breakdown.jobMatchScore = Math.round(jdScore);

  const finalScore = Math.min(100, Math.round(score));

  // Recruiter fit score - weighted differently (favors fundamentals + impact)
  const recruiterFit = Math.min(
    100,
    Math.round(skillScore * 0.9 + impactScore * 1.6 + sectionScore * 0.8 + jdScore * 1.1)
  );

  const suggestions = generateSuggestions({ resumeSkills, sections, wordCount, verbHits, hasNumbers, missingSkills });

  return {
    atsScore: finalScore,
    recruiterFitScore: recruiterFit,
    breakdown,
    extractedSkills: resumeSkills,
    skillsByCategory: categorize(resumeSkills),
    missingSkills,
    detectedSections: sections,
    wordCount,
    suggestions
  };
}

function categorize(skills) {
  const result = {};
  Object.entries(SKILL_LIBRARY).forEach(([cat, list]) => {
    const matched = skills.filter(s => list.includes(s.toLowerCase()));
    if (matched.length) result[cat] = matched;
  });
  return result;
}

function generateSuggestions({ resumeSkills, sections, wordCount, verbHits, hasNumbers, missingSkills }) {
  const tips = [];

  if (resumeSkills.length < 8) {
    tips.push("Add a dedicated 'Skills' section listing your technical stack explicitly (languages, frameworks, tools) — ATS bots scan for exact keyword matches.");
  }
  if (!sections.includes('projects')) {
    tips.push("Add a 'Projects' section with 2-3 projects, each with a one-line outcome (e.g. 'Reduced load time by 40%').");
  }
  if (!sections.includes('summary') && !sections.includes('objective')) {
    tips.push("Add a 2-3 line professional summary at the top highlighting your role, top skills, and key achievement.");
  }
  if (verbHits < 4) {
    tips.push("Use more strong action verbs (Built, Led, Optimized, Designed) at the start of each bullet point instead of passive phrasing.");
  }
  if (!hasNumbers) {
    tips.push("Quantify your impact wherever possible — numbers (%, users, time saved) make achievements concrete and recruiter-friendly.");
  }
  if (wordCount < 150) {
    tips.push("Your resume looks thin — expand on project details, tech stack used, and measurable outcomes.");
  }
  if (wordCount > 1200) {
    tips.push("Your resume is quite long — trim to the most relevant 1-2 pages of content for better recruiter readability.");
  }
  if (missingSkills.length > 0) {
    tips.push(`Consider highlighting or learning: ${missingSkills.slice(0, 5).join(', ')} — these appear in the job description but not in your resume.`);
  }
  if (tips.length === 0) {
    tips.push("Strong resume! Consider tailoring keywords per job description for an even higher match score.");
  }
  return tips;
}

module.exports = { scoreResume, extractSkills, SKILL_LIBRARY };
