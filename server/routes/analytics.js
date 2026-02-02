const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getDashboardOverview,
  getTrends,
  getSuccessAnalysis
} = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.get('/', auth, getAnalytics);
router.get('/dashboard/overview', auth, getDashboardOverview);
router.get('/trends/data', auth, getTrends);
router.get('/success/analysis', auth, getSuccessAnalysis);

module.exports = router;
