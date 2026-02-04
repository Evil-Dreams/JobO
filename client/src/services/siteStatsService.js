import api from './api';

export const siteStatsService = {
  // Get current site statistics
  getSiteStats: async () => {
    const response = await api.get('/site-stats/stats');
    return response.data;
  },

  // Increment user count (called when landing page loads)
  incrementUserCount: async () => {
    const response = await api.post('/site-stats/increment-users');
    return response.data;
  },

  // Update jobs tracked count
  updateJobsTracked: async () => {
    const response = await api.post('/site-stats/update-jobs');
    return response.data;
  },

  // Update success rate
  updateSuccessRate: async () => {
    const response = await api.post('/site-stats/update-success-rate');
    return response.data;
  }
};
