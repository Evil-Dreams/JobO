const express = require('express');
const router = express.Router();
const {
  analyzeResume,
  optimizeResume,
  generateCoverLetter,
  predictInterviewQuestions,
  analyzeSuccessProbability,
  getInterviewFeedback,
} = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/analyze-resume', auth, analyzeResume);
router.post('/resume', auth, optimizeResume);
router.post('/cover-letter', auth, generateCoverLetter);
router.post('/interview', auth, predictInterviewQuestions);
router.post('/success', auth, analyzeSuccessProbability);
router.post('/feedback', auth, getInterviewFeedback);

module.exports = router;
