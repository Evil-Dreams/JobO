import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Zap, TrendingUp, Users, Target, Clock, Award } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { StatsCard } from '../components/StatsCard';
import { AddJobModal } from '../components/AddJobModal';
import { ApplicationCharts } from '../components/ApplicationCharts';
import { getApplications, createApplication, updateApplication, deleteApplication, reset } from '../store/applicationsSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const applications = useSelector(state => state.applications.applications);
  const loading = useSelector(state => state.applications.isLoading);
  const [showModal, setShowModal] = useState(false);
  const [activeModalId, setActiveModalId] = useState(null);

  useEffect(() => {
    if (!auth.token) {
      navigate('/login');
      return;
    }
    dispatch(getApplications());
  }, [auth.token, dispatch, navigate]);

  // Refresh applications when CRUD operations complete
  const { createSuccess, updateSuccess, deleteSuccess } = useSelector(state => state.applications);
  useEffect(() => {
    console.log('Dashboard: Success states changed', { createSuccess, updateSuccess, deleteSuccess });
    if (createSuccess || updateSuccess || deleteSuccess) {
      console.log('Dashboard: Refreshing applications...');
      dispatch(getApplications());
      // Reset success flags to prevent infinite loops
      dispatch(reset());
    }
  }, [createSuccess, updateSuccess, deleteSuccess, dispatch]);

  // Debug recent applications
  useEffect(() => {
    console.log('Dashboard: Applications updated', applications.length);
  }, [applications]);

  // Calculate real statistics with month-over-month changes
  const calculateStats = () => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthApps = applications.filter(app => {
      const appDate = new Date(app.appliedAt || app.createdAt);
      return appDate >= thisMonth;
    });

    const lastMonthApps = applications.filter(app => {
      const appDate = new Date(app.appliedAt || app.createdAt);
      return appDate >= lastMonth && appDate < thisMonth;
    });

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    const thisMonthTotal = thisMonthApps.length;
    const lastMonthTotal = lastMonthApps.length;

    const thisMonthApplied = thisMonthApps.filter(a => a.status === 'Applied').length;
    const lastMonthApplied = lastMonthApps.filter(a => a.status === 'Applied').length;

    const thisMonthInterviews = thisMonthApps.filter(a => 
      a.status === 'Interview Scheduled' || a.status === 'Interview Completed'
    ).length;
    const lastMonthInterviews = lastMonthApps.filter(a => 
      a.status === 'Interview Scheduled' || a.status === 'Interview Completed'
    ).length;

    return [
      {
        title: 'Total Applications',
        value: applications.length,
        change: calculateChange(thisMonthTotal, lastMonthTotal),
        isPositive: thisMonthTotal >= lastMonthTotal,
        icon: Zap,
        color: 'cyan',
        delay: 0
      },
      {
        title: 'In Progress',
        value: applications.filter(a => a.status === 'Applied').length,
        change: calculateChange(thisMonthApplied, lastMonthApplied),
        isPositive: thisMonthApplied >= lastMonthApplied,
        icon: TrendingUp,
        color: 'emerald',
        delay: 0.1
      },
      {
        title: 'Interviews',
        value: applications.filter(a => a.status === 'Interview Scheduled' || a.status === 'Interview Completed').length,
        change: calculateChange(thisMonthInterviews, lastMonthInterviews),
        isPositive: thisMonthInterviews >= lastMonthInterviews,
        icon: Users,
        color: 'purple',
        delay: 0.2
      }
    ];
  };

  const stats = calculateStats();

  // Calculate additional analytics
  const calculateAnalytics = () => {
    const totalApps = applications.length;
    const activeApps = applications.filter(a => 
      ['Applied', 'Interview Scheduled', 'Interview Completed'].includes(a.status)
    ).length;
    const completedApps = applications.filter(a => 
      ['Offer Received', 'Offer Accepted', 'Rejected'].includes(a.status)
    ).length;
    
    // Success rate
    const successRate = totalApps > 0 ? 
      Math.round((applications.filter(a => ['Offer Received', 'Offer Accepted'].includes(a.status)).length / totalApps) * 100) : 0;
    
    // Average time to interview
    const interviewApps = applications.filter(a => 
      a.status === 'Interview Scheduled' || a.status === 'Interview Completed'
    );
    const avgTimeToInterview = interviewApps.length > 0 ? 
      Math.round(interviewApps.reduce((acc, app) => {
        const appliedDate = new Date(app.appliedAt || app.createdAt);
        const interviewDate = app.timeline?.find(t => t.action.includes('Interview'))?.date;
        if (interviewDate) {
          return acc + (interviewDate - appliedDate) / (1000 * 60 * 60 * 24); // days
        }
        return acc;
      }, 0) / interviewApps.length) : 0;
    
    // Top companies
    const companyStats = {};
    applications.forEach(app => {
      const company = app.jobId?.company || 'Unknown';
      companyStats[company] = (companyStats[company] || 0) + 1;
    });
    
    const topCompanies = Object.entries(companyStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([company, count]) => ({ company, count }));
    
    // Status distribution
    const statusDistribution = {
      Applied: applications.filter(a => a.status === 'Applied').length,
      'Interview Scheduled': applications.filter(a => a.status === 'Interview Scheduled').length,
      'Interview Completed': applications.filter(a => a.status === 'Interview Completed').length,
      'Offer Received': applications.filter(a => a.status === 'Offer Received').length,
      'Offer Accepted': applications.filter(a => a.status === 'Offer Accepted').length,
      Rejected: applications.filter(a => a.status === 'Rejected').length,
    };
    
    return {
      successRate,
      avgTimeToInterview,
      topCompanies,
      statusDistribution,
      activeApps,
      completedApps,
      totalApps
    };
  };

  // Calculate monthly data for timeline graph
  const calculateMonthlyData = () => {
    const now = new Date();
    const months = [];
    
    // Generate last 6 months of data
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthApps = applications.filter(app => {
        const appDate = new Date(app.appliedAt || app.createdAt);
        return appDate >= monthDate && appDate < nextMonthDate;
      });
      
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
      
      months.push({
        month: monthName,
        applications: monthApps.length,
        interviews: monthApps.filter(a => a.status === 'Interview Scheduled' || a.status === 'Interview Completed').length,
        offers: monthApps.filter(a => a.status === 'Offer Received' || a.status === 'Offer Accepted').length
      });
    }
    
    // If no real data, add sample data for demonstration
    if (months.every(m => m.applications === 0 && m.interviews === 0 && m.offers === 0)) {
      return [
        { month: 'Sep', applications: 2, interviews: 1, offers: 0 },
        { month: 'Oct', applications: 3, interviews: 2, offers: 1 },
        { month: 'Nov', applications: 4, interviews: 2, offers: 1 },
        { month: 'Dec', applications: 5, interviews: 3, offers: 2 },
        { month: 'Jan', applications: 3, interviews: 2, offers: 1 },
        { month: 'Feb', applications: 4, interviews: 2, offers: 1 }
      ];
    }
    
    return months;
  };

  const analytics = calculateAnalytics();
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt))
    .slice(0, 5);

  const handleAddJob = async (jobData) => {
    try {
      await dispatch(createApplication(jobData));
      setShowModal(false);
    } catch (error) {
      console.error('Error adding application:', error);
    }
  };

  const handleUpdateApplication = async (id, updateData) => {
    try {
      await dispatch(updateApplication({ id, applicationData: updateData }));
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await dispatch(deleteApplication(id));
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Application
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Analytics Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Analytics Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Success Rate Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Success Rate</h3>
                  <p className="text-sm text-slate-400">Overall performance</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">{analytics.successRate}%</div>
              <p className="text-sm text-slate-400">
                {analytics.successRate >= 50 ? 'Excellent performance!' : 'Keep improving!'}
              </p>
            </div>

            {/* Average Time to Interview */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Avg. Time to Interview</h3>
                  <p className="text-sm text-slate-400">Response time</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-amber-400 mb-2">{analytics.avgTimeToInterview} days</div>
              <p className="text-sm text-slate-400">
                {analytics.avgTimeToInterview <= 7 ? 'Great response time!' : 'Consider optimizing your applications'}
              </p>
            </div>

            {/* Top Companies */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 lg:col-span-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Top Companies</h3>
                  <p className="text-sm text-slate-400">Where you applied most</p>
                </div>
              </div>
              <div className="space-y-2">
                {analytics.topCompanies.map((company, index) => (
                  <div key={company.company} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                    <span className="text-sm font-medium text-white">{company.company}</span>
                    <span className="text-sm text-cyan-400 font-semibold">{company.count} applications</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Application Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <ApplicationCharts data={calculateMonthlyData()} applications={applications} />
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Applications</h2>
          {recentApplications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentApplications.map((app, index) => (
                <JobCard 
                  key={app._id} 
                  job={app} 
                  index={index} 
                  onUpdate={handleUpdateApplication}
                  onDelete={handleDeleteApplication}
                  activeModalId={activeModalId}
                  setActiveModalId={setActiveModalId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Zap size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg">No applications yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                Add Your First Application
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Job Modal */}
      <AddJobModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={handleAddJob} />
    </div>
  );
};

export default Dashboard;
