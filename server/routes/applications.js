const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  updateApplication,
  getApplication,
  deleteApplication,
  addCommunication,
  addNote,
  getApplicationsByStatus,
  getStatistics,
  setReminder,
  getUpcomingReminders
} = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// Main CRUD operations
router.post('/', auth, createApplication);
router.get('/', auth, getApplications);
router.get('/status/:status', auth, getApplicationsByStatus);
router.get('/stats/all', auth, getStatistics);
router.get('/reminders/upcoming', auth, getUpcomingReminders);
router.get('/:id', auth, getApplication);
router.put('/:id', auth, updateApplication);
router.delete('/:id', auth, deleteApplication);

// Additional operations
router.post('/:id/communication', auth, addCommunication);
router.post('/:id/notes', auth, addNote);
router.post('/:id/reminder', auth, setReminder);

module.exports = router;
