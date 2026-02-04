const express = require('express');
const router = express.Router();
const SiteStats = require('../models/SiteStats');
const Application = require('../models/Application');

// Get current site statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await SiteStats.getSiteStats();
    
    // Update jobs tracked and success rate in real-time
    await stats.updateJobsTracked();
    await stats.calculateSuccessRate();
    
    res.json({
      userCount: stats.userCount,
      jobsTracked: stats.jobsTracked,
      successRate: stats.successRate,
      lastUpdated: stats.lastUpdated
    });
  } catch (error) {
    console.error('Error fetching site stats:', error);
    res.status(500).json({ message: 'Error fetching site statistics' });
  }
});

// Increment user count (called when landing page loads)
router.post('/increment-users', async (req, res) => {
  try {
    const stats = await SiteStats.getSiteStats();
    await stats.incrementUserCount();
    
    res.json({
      userCount: stats.userCount,
      message: 'User count incremented successfully'
    });
  } catch (error) {
    console.error('Error incrementing user count:', error);
    res.status(500).json({ message: 'Error incrementing user count' });
  }
});

// Update jobs tracked (called when applications are added/updated)
router.post('/update-jobs', async (req, res) => {
  try {
    const stats = await SiteStats.getSiteStats();
    await stats.updateJobsTracked();
    
    res.json({
      jobsTracked: stats.jobsTracked,
      message: 'Jobs tracked updated successfully'
    });
  } catch (error) {
    console.error('Error updating jobs tracked:', error);
    res.status(500).json({ message: 'Error updating jobs tracked' });
  }
});

// Update success rate (called when application status changes)
router.post('/update-success-rate', async (req, res) => {
  try {
    const stats = await SiteStats.getSiteStats();
    await stats.calculateSuccessRate();
    
    res.json({
      successRate: stats.successRate,
      message: 'Success rate updated successfully'
    });
  } catch (error) {
    console.error('Error updating success rate:', error);
    res.status(500).json({ message: 'Error updating success rate' });
  }
});

module.exports = router;
