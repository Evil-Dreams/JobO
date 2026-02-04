const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const {
  uploadResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  uploadCoverLetter,
  getCoverLetters,
  getCoverLetter,
  deleteCoverLetter
} = require('../controllers/documentController');

const router = express.Router();

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, '../uploads/resumes');
const coverLettersDir = path.join(__dirname, '../uploads/cover-letters');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(coverLettersDir)) {
  fs.mkdirSync(coverLettersDir, { recursive: true });
}

// Multer configuration for resume uploads
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + '.pdf');
  }
});

const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Multer configuration for cover letter uploads
const coverLetterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, coverLettersDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cover-letter-' + uniqueSuffix + '.pdf');
  }
});

const coverLetterUpload = multer({
  storage: coverLetterStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Resume routes
router.post('/resumes', auth, resumeUpload.single('resume'), uploadResume);
router.get('/resumes', auth, getResumes);
router.get('/resumes/:id', auth, getResume);
router.put('/resumes/:id', auth, updateResume);
router.delete('/resumes/:id', auth, deleteResume);

// Cover letter routes
router.post('/cover-letters', auth, coverLetterUpload.single('coverLetter'), uploadCoverLetter);
router.get('/cover-letters', auth, getCoverLetters);
router.get('/cover-letters/:id', auth, getCoverLetter);
router.delete('/cover-letters/:id', auth, deleteCoverLetter);

module.exports = router;
