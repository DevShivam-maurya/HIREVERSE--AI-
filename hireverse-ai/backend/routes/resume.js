const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const auth = require('../middleware/auth');
const db = require('../utils/db');
const { scoreResume } = require('../utils/atsScorer');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'data', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF and DOCX files are allowed'));
  }
});

async function extractText(filePath, ext) {
  if (ext === '.pdf') {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  throw new Error('Unsupported file type');
}

router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const ext = path.extname(req.file.originalname).toLowerCase();
    const text = await extractText(req.file.path, ext);

    if (!text || text.trim().length < 30) {
      return res.status(400).json({ success: false, message: 'Could not extract readable text from this file. Try a different file.' });
    }

    const jobDescription = req.body.jobDescription || '';
    const result = scoreResume(text, jobDescription);

    const record = {
      id: uuidv4(),
      userId: req.user.id,
      fileName: req.file.originalname,
      jobDescription,
      ...result,
      createdAt: new Date().toISOString()
    };
    db.get('resumes').push(record).write();

    res.json({ success: true, resume: record });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to process resume', error: err.message });
  }
});

router.get('/history', auth, (req, res) => {
  const list = db.get('resumes').filter({ userId: req.user.id }).value().reverse();
  res.json({ success: true, resumes: list });
});

router.get('/latest', auth, (req, res) => {
  const list = db.get('resumes').filter({ userId: req.user.id }).value();
  const latest = list[list.length - 1] || null;
  res.json({ success: true, resume: latest });
});

module.exports = router;
