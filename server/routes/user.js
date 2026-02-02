const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile,
  addResume,
  updateResume,
  deleteResume,
  addCoverLetter,
  deleteCoverLetter,
  addSkill,
  endorseSkill,
  deleteSkill,
  setGoals
} = require('../controllers/userController');
const auth = require('../middleware/auth');

// Profile management
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Resume management
router.post('/resumes', auth, addResume);
router.put('/resumes/:id', auth, updateResume);
router.delete('/resumes/:id', auth, deleteResume);

// Cover letter management
router.post('/cover-letters', auth, addCoverLetter);
router.delete('/cover-letters/:id', auth, deleteCoverLetter);

// Skills management
router.post('/skills', auth, addSkill);
router.post('/skills/:id/endorse', auth, endorseSkill);
router.delete('/skills/:id', auth, deleteSkill);

// Goals
router.post('/goals', auth, setGoals);

module.exports = router;
