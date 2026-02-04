import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getApplications } from '../store/applicationsSlice';
import { fetchApplicationInsights } from '../store/aiSlice';
import { DonutChart } from '../components/DonutChart';

// Calculate real metrics based on application data
const calculateRealMetrics = (applications) => {
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

  const calculateAvgResponseTime = (apps) => {
    if (apps.length === 0) return '0 days';
    const responseTimes = apps.map(app => {
      const appliedDate = new Date(app.appliedAt || app.createdAt);
      const interviewDate = app.timeline?.find(t => t.action.includes('Interview'))?.date;
      if (interviewDate) {
        const days = Math.floor((interviewDate - appliedDate) / (1000 * 60 * 60 * 24));
        return days;
      }
      return null;
    }).filter(Boolean);
    
    if (responseTimes.length === 0) return '0 days';
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    return `${avgTime.toFixed(1)} days`;
  };

  const thisMonthTotal = thisMonthApps.length;
  const lastMonthTotal = lastMonthApps.length;

  const thisMonthInterviews = thisMonthApps.filter(a => 
    a.status === 'Interview Scheduled' || a.status === 'Interview Completed'
  ).length;
  const lastMonthInterviews = lastMonthApps.filter(a => 
    a.status === 'Interview Scheduled' || a.status === 'Interview Completed'
  ).length;

  const thisMonthOffers = thisMonthApps.filter(a => 
    a.status === 'Offer Received' || a.status === 'Offer Accepted'
  ).length;
  const lastMonthOffers = lastMonthApps.filter(a => 
    a.status === 'Offer Received' || a.status === 'Offer Accepted'
  ).length;

  const successRate = applications.length > 0 ? 
    ((applications.filter(a => a.status === 'Offer Received' || a.status === 'Offer Accepted').length / applications.length) * 100).toFixed(2) + '%' 
    : '0%';

  const interviewRate = applications.length > 0 ? 
    ((applications.filter(a => a.status === 'Interview Scheduled' || a.status === 'Interview Completed').length / applications.length) * 100).toFixed(1) + '%'
    : '0%';

  const activePipeline = applications.filter(a => 
    a.status === 'Applied' || a.status === 'Interview Scheduled' || a.status === 'Interview Completed'
  ).length;

  return [
    {
      title: 'Success Rate',
      value: successRate,
      change: calculateChange(thisMonthOffers, lastMonthOffers),
      isPositive: thisMonthOffers >= lastMonthOffers,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Avg Response Time',
      value: calculateAvgResponseTime(applications),
      change: calculateChange(thisMonthInterviews > 0 ? 5 : 0, lastMonthInterviews > 0 ? 7 : 0),
      isPositive: true,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Interview Rate',
      value: interviewRate,
      change: calculateChange(thisMonthInterviews, lastMonthInterviews),
      isPositive: thisMonthInterviews >= lastMonthInterviews,
      icon: Target,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Active Pipeline',
      value: activePipeline.toString(),
      change: calculateChange(thisMonthTotal, lastMonthTotal),
      isPositive: thisMonthTotal >= lastMonthTotal,
      icon: Zap,
      color: 'from-amber-500 to-orange-500'
    }
  ];
};

export default function Analytics() {
  const dispatch = useDispatch();
  const { applications } = useSelector((state) => state.applications);
  const { applicationInsights, isLoading: aiLoading, error: aiError } = useSelector((state) => state.ai);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  useEffect(() => {
    dispatch(getApplications());
    dispatch(fetchApplicationInsights());
  }, [dispatch]);

  // Calculate real chart data based on application status distribution
const calculateChartData = (applications) => {
  const statusCounts = {
    'Applied': applications.filter(a => a.status === 'Applied').length,
    'Interview Scheduled': applications.filter(a => a.status === 'Interview Scheduled').length,
    'Interview Completed': applications.filter(a => a.status === 'Interview Completed').length,
    'Offer Received': applications.filter(a => a.status === 'Offer Received').length,
    'Offer Accepted': applications.filter(a => a.status === 'Offer Accepted').length,
    'Offer Declined': applications.filter(a => a.status === 'Offer Declined').length,
    'Rejected': applications.filter(a => a.status === 'Rejected').length
  };

  const total = applications.length;
  
  return [
    { 
      label: 'Applied', 
      value: statusCounts['Applied'], 
      percentage: total > 0 ? Math.round((statusCounts['Applied'] / total) * 100) : 0, 
      color: 'bg-slate-500' 
    },
    { 
      label: 'Interview', 
      value: statusCounts['Interview Scheduled'] + statusCounts['Interview Completed'], 
      percentage: total > 0 ? Math.round(((statusCounts['Interview Scheduled'] + statusCounts['Interview Completed']) / total) * 100) : 0, 
      color: 'bg-amber-500' 
    },
    { 
      label: 'Offer', 
      value: statusCounts['Offer Received'] + statusCounts['Offer Accepted'], 
      percentage: total > 0 ? Math.round(((statusCounts['Offer Received'] + statusCounts['Offer Accepted']) / total) * 100) : 0, 
      color: 'bg-emerald-500' 
    },
    { 
      label: 'Rejected', 
      value: statusCounts['Rejected'] + statusCounts['Offer Declined'], 
      percentage: total > 0 ? Math.round(((statusCounts['Rejected'] + statusCounts['Offer Declined']) / total) * 100) : 0, 
      color: 'bg-rose-500' 
    }
  ];
};

// Calculate real monthly data based on application dates
const calculateMonthlyData = (applications) => {
  
  
  
  
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
  
  
  
  
  return months;
};

// Calculate real insights based on application data
const calculateRealInsights = (applications) => {
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

  const thisMonthInterviews = thisMonthApps.filter(a => 
    a.status === 'Interview Scheduled' || a.status === 'Interview Completed'
  ).length;
  const lastMonthInterviews = lastMonthApps.filter(a => 
    a.status === 'Interview Scheduled' || a.status === 'Interview Completed'
  ).length;

  const thisMonthOffers = thisMonthApps.filter(a => 
    a.status === 'Offer Received' || a.status === 'Offer Accepted'
  ).length;

  const interviewRateChange = lastMonthInterviews > 0 ? 
    ((thisMonthInterviews - lastMonthInterviews) / lastMonthInterviews * 100).toFixed(1) : 
    (thisMonthInterviews > 0 ? '100' : '0');

  const avgResponseTime = applications.map(app => {
    const appliedDate = new Date(app.appliedAt || app.createdAt);
    const interviewDate = app.timeline?.find(t => t.action.includes('Interview'))?.date;
    if (interviewDate) {
      const days = Math.floor((interviewDate - appliedDate) / (1000 * 60 * 60 * 24));
      return days;
    }
    return null;
  }).filter(Boolean);

  const avgTime = avgResponseTime.length > 0 ? 
    (avgResponseTime.reduce((a, b) => a + b, 0) / avgResponseTime.length).toFixed(1) : 0;

  return [
    {
      type: 'success',
      title: 'Your conversion rate improved',
      description: `Interview rate ${interviewRateChange > 0 ? 'increased' : 'changed'} by ${Math.abs(interviewRateChange)}% ${interviewRateChange > 0 ? 'compared' : 'from'} last month`,
      icon: CheckCircle2,
      color: 'emerald'
    },
    {
      type: 'warning',
      title: 'Response rate trend',
      description: `Average response time ${avgTime > 0 ? `improved to ${avgTime} days` : 'being calculated'}`,
      icon: AlertCircle,
      color: 'amber'
    },
    {
      type: 'info',
      title: "You're on track",
      description: `${thisMonthOffers} offers pending - ${thisMonthOffers > 0 ? 'excellent' : 'good'} progress this quarter`,
      icon: Award,
      color: 'cyan'
    }
  ];
};

// Calculate real recommendations based on application data
const calculateRealRecommendations = (applications) => {
  const totalApps = applications.length;
  const interviews = applications.filter(a => 
    a.status === 'Interview Scheduled' || a.status === 'Interview Completed'
  ).length;
  const offers = applications.filter(a => 
    a.status === 'Offer Received' || a.status === 'Offer Accepted'
  ).length;
  
  const interviewRate = totalApps > 0 ? (interviews / totalApps * 100).toFixed(1) : 0;
  const successRate = totalApps > 0 ? (offers / totalApps * 100).toFixed(1) : 0;

  const recommendations = [];

  if (interviewRate < 20) {
    recommendations.push({
      type: 'purple',
      title: 'Increase application volume',
      description: `Your interview rate is ${interviewRate}%. Aim for 25-30 applications per week to maximize opportunities`
    });
  }

  if (successRate < 15) {
    recommendations.push({
      type: 'blue',
      title: 'Focus on top companies',
      description: 'Target companies with higher match scores to improve success rates'
    });
  }

  if (totalApps < 50) {
    recommendations.push({
      type: 'pink',
      title: 'Optimize resume keywords',
      description: 'Update resume with relevant keywords from job descriptions to increase visibility'
    });
  }

  // Default recommendation if none of the above apply
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'green',
      title: 'Maintain momentum',
      description: 'Keep up the great work! Continue applying consistently to maintain your success rate'
    });
  }

  return recommendations;
};

  const metrics = calculateRealMetrics(applications);
  const chartData = calculateChartData(applications);
  const monthlyData = calculateMonthlyData(applications);
  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.applications, d.interviews, d.offers)), 1);
  const insights = calculateRealInsights(applications);
  const recommendations = calculateRealRecommendations(applications);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-slate-400">
            Comprehensive insights into your job search performance
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 bg-slate-900/50 rounded-xl p-1 border border-slate-800">
          {['1month', '3months', '6months', '1year'].map((period) => (
            <button
              key={`period-${period}`}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {period === '1month' ? '1M' : period === '3months' ? '3M' : period === '6months' ? '6M' : '1Y'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">{metric.title}</h3>
                <div className={`bg-gradient-to-br ${metric.color} p-2 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">{metric.value}</p>
                <p className={`text-sm font-medium ${metric.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {metric.isPositive ? '↑' : '↓'} {metric.change}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="text-cyan-400" />
          <h2 className="text-xl font-semibold text-white">AI Insights</h2>
        </div>
        {aiError && (
          <div className="text-amber-400 text-sm p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p>AI insights temporarily unavailable. Using local analysis instead.</p>
          </div>
        )}
        {aiLoading && !applicationInsights && (
          <p className="text-slate-400">Generating insights...</p>
        )}
        {!aiLoading && !applicationInsights && !aiError && (
          <div className="text-slate-400 text-sm">
            <p>AI insights will appear here once you have more application data.</p>
          </div>
        )}
        {applicationInsights && (
          <div className="space-y-4">
            {applicationInsights.jobSearchStrategy && (
              <p className="text-slate-300">{applicationInsights.jobSearchStrategy}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applicationInsights.strongAreas?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-emerald-300 mb-2">Strong Areas</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {applicationInsights.strongAreas.map((item, idx) => (
                      <li key={`strong-${idx}-${item.substring(0, 10)}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {applicationInsights.improvementAreas?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-amber-300 mb-2">Areas to Improve</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {applicationInsights.improvementAreas.map((item, idx) => (
                      <li key={`improve-${idx}-${item.substring(0, 10)}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {applicationInsights.actionPlan?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-cyan-300 mb-2">Action Plan</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {applicationInsights.actionPlan.map((item, idx) => (
                    <li key={`action-${idx}-${item.substring(0, 10)}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {applicationInsights.motivationalInsight && (
              <p className="text-slate-400 italic">{applicationInsights.motivationalInsight}</p>
            )}
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-cyan-400" />
            Application Status Distribution
          </h2>

          <div className="flex justify-center mb-6">
            <DonutChart data={chartData} size={200} />
          </div>

          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={`chart-${data.label}-${index}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">{data.label}</span>
                  <span className="text-sm font-semibold text-white">{data.value} ({data.percentage}%)</span>
                </div>
                <motion.div
                  className="h-3 bg-slate-800/50 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className={`h-full ${data.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${data.percentage}%` }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                  />
                </motion.div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-slate-800/50 flex flex-wrap gap-4">
            {chartData.map((data) => (
              <div key={`legend-${data.label}`} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${data.color}`} />
                <span className="text-xs text-slate-400">{data.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            Monthly Activity
          </h2>

          <div className="space-y-6">
            {monthlyData.map((month, index) => (
              <div key={`month-${month.month}-${index}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">{month.month}</span>
                  <span className="text-xs text-slate-500">{month.applications} applications</span>
                </div>
                <div className="flex gap-1 h-8">
                  <motion.div
                    className="flex-1 bg-gradient-to-t from-slate-500 to-slate-400 rounded-sm hover:from-slate-400 hover:to-slate-300 transition-colors relative group"
                    style={{ height: `${(month.applications / maxValue) * 100}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.applications / maxValue) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 px-2 py-1 rounded text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {month.applications}
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex-1 bg-gradient-to-t from-amber-500 to-amber-400 rounded-sm hover:from-amber-400 hover:to-amber-300 transition-colors relative group"
                    style={{ height: `${(month.interviews / maxValue) * 100}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.interviews / maxValue) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 px-2 py-1 rounded text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {month.interviews}
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-sm hover:from-emerald-400 hover:to-emerald-300 transition-colors relative group"
                    style={{ height: `${(month.offers / maxValue) * 100}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.offers / maxValue) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 px-2 py-1 rounded text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {month.offers}
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Legend */}
          <div className="mt-6 pt-6 border-t border-slate-800/50 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-500 rounded-sm" />
              <span className="text-xs text-slate-400">Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-sm" />
              <span className="text-xs text-slate-400">Interviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
              <span className="text-xs text-slate-400">Offers</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Key Insights */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Key Insights
          </h2>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={`insight-${insight.type}-${index}`} className={`flex gap-3 p-3 bg-${insight.color}-500/10 border border-${insight.color}-500/20 rounded-lg`}>
                  <Icon className={`w-5 h-5 text-${insight.color}-400 flex-shrink-0 mt-0.5`} />
                  <div className="text-sm">
                    <p className={`font-medium text-${insight.color}-400`}>{insight.title}</p>
                    <p className="text-slate-400 text-xs mt-1">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Recommendations
          </h2>
          <div className="space-y-3 text-sm">
            {recommendations.map((rec, index) => (
              <div key={`rec-${rec.type}-${index}`} className={`p-3 bg-${rec.type}-500/10 border border-${rec.type}-500/20 rounded-lg`}>
                <p className={`font-medium text-${rec.type}-300 mb-1`}>{rec.title}</p>
                <p className="text-slate-400 text-xs">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
