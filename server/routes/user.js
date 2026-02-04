const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getProfile, 
  updateProfile,
  uploadResume,
  getResumes,
  deleteResume,
  addCoverLetter,
  getCoverLetters,
  deleteCoverLetter,
  setGoals
} = require('../controllers/userController');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/resumes'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = {
      resume: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };
    const fieldAllowed = allowedMimes[file.fieldname] || [];
    if (fieldAllowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}`));
    }
  }
});

// Profile management
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Resume management
router.post('/resumes', auth, upload.single('resume'), uploadResume);
router.get('/resumes', auth, getResumes);
router.delete('/resumes/:id', auth, deleteResume);

// Cover letter management
router.post('/cover-letters', auth, addCoverLetter);
router.get('/cover-letters', auth, getCoverLetters);
router.delete('/cover-letters/:id', auth, deleteCoverLetter);

// Goals
router.post('/goals', auth, setGoals);

module.exports = router;
