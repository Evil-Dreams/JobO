const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const {
  analyzeResumeWithPDF,
  analyzeResumeText,
  generateCoverLetterHandler,
  generateCoverLetterPDF,
  predictSuccess,
  getApplicationInsightsHandler,
  getInterviewGuidance
} = require('../controllers/aiController');

const router = express.Router();

// Multer configuration for PDF uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Analyze resume PDF against job description
router.post('/analyze-resume/pdf', auth, upload.single('resume'), analyzeResumeWithPDF);

// Analyze resume text directly
router.post('/analyze-resume/text', auth, analyzeResumeText);

// Generate AI cover letter
router.post('/generate-cover-letter', auth, generateCoverLetterHandler);

// Generate AI cover letter with PDF (FormData version)
router.post('/generate-cover-letter/pdf', auth, upload.single('resume'), generateCoverLetterPDF);

// Predict success probability
router.post('/predict-success', auth, predictSuccess);

// Get application insights
router.get('/application-insights', auth, getApplicationInsightsHandler);

// Get interview preparation guidance
router.post('/interview-prep', auth, getInterviewGuidance);

module.exports = router;
