import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';

export function ApplicationCharts({ data, applications }) {
  // Calculate status distribution for donut chart
  const statusDistribution = {
    Applied: applications.filter(a => a.status === 'Applied').length,
    'Interview Scheduled': applications.filter(a => a.status === 'Interview Scheduled').length,
    'Interview Completed': applications.filter(a => a.status === 'Interview Completed').length,
    'Offer Received': applications.filter(a => a.status === 'Offer Received').length,
    'Offer Accepted': applications.filter(a => a.status === 'Offer Accepted').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  const totalStatus = Object.values(statusDistribution).reduce((sum, count) => sum + count, 0);

  // Donut chart data
  const donutData = Object.entries(statusDistribution).map(([status, count]) => ({
    label: status,
    value: count,
    percentage: totalStatus > 0 ? Math.round((count / totalStatus) * 100) : 0,
    color: getStatusColor(status)
  }));

  function getStatusColor(status) {
    const colors = {
      'Applied': 'rgb(148, 163, 184)',
      'Interview Scheduled': 'rgb(251, 191, 36)',
      'Interview Completed': 'rgb(251, 146, 60)',
      'Offer Received': 'rgb(74, 222, 128)',
      'Offer Accepted': 'rgb(34, 197, 94)',
      'Rejected': 'rgb(239, 68, 68)'
    };
    return colors[status] || 'rgb(148, 163, 184)';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Donut Chart - Status Distribution */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-cyan-400" />
          Application Status Distribution
        </h3>
        
        <div className="flex items-center justify-center h-64">
          <div className="relative w-48 h-48">
            {/* Donut chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {donutData.map((item, index) => {
                const startAngle = donutData.slice(0, index).reduce((sum, d) => sum + d.percentage, 0) * 3.6;
                const endAngle = startAngle + item.percentage * 3.6;
                const largeArcFlag = item.percentage > 50 ? 1 : 0;
                
                const startAngleRad = (startAngle - 90) * Math.PI / 180;
                const endAngleRad = (endAngle - 90) * Math.PI / 180;
                
                const x1 = 50 + 40 * Math.cos(startAngleRad);
                const y1 = 50 + 40 * Math.sin(startAngleRad);
                const x2 = 50 + 40 * Math.cos(endAngleRad);
                const y2 = 50 + 40 * Math.sin(endAngleRad);
                
                return (
                  <motion.path
                    key={item.label}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={item.color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                );
              })}
              {/* Center circle */}
              <circle cx="50" cy="50" r="25" fill="rgb(15, 23, 42)" />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-white">{totalStatus}</div>
              <div className="text-xs text-slate-400">Total</div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 space-y-2">
          {donutData.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-300">{item.label}</span>
              </div>
              <div className="text-sm text-white font-medium">
                {item.value} ({item.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart - Monthly Applications */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          Monthly Applications
        </h3>
        
        <div className="h-64">
          <div className="flex items-end justify-around h-full px-4">
            {data.map((month, index) => {
              const maxValue = Math.max(...data.map(d => d.applications), 1);
              const height = (month.applications / maxValue) * 100;
              
              return (
                <div key={month.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full max-w-12 flex flex-col items-center">
                    <motion.div
                      className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg hover:from-cyan-500 hover:to-cyan-300 transition-colors relative group"
                      style={{ height: `${height}%`, minHeight: '4px' }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 px-2 py-1 rounded text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {month.applications}
                      </div>
                    </motion.div>
                    <div className="text-xs text-slate-400 mt-2">{month.month}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Trend Analysis */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {data[data.length - 1].applications > data[0].applications ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
            <span className={data[data.length - 1].applications > data[0].applications ? 'text-emerald-400' : 'text-rose-400'}>
              {data[data.length - 1].applications > data[0].applications ? '↑' : '↓'} {Math.abs(data[data.length - 1].applications - data[0].applications)} applications
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Last 6 months
          </div>
        </div>
      </div>
    </div>
  );
}
