import React from 'react';
import { motion } from 'framer-motion';

export function PieChartComponent({ data, size = 200 }) {
  const radius = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  const colors = {
    'Applied': '#64748b',
    'Interview': '#f59e0b', 
    'Offer': '#10b981',
    'Rejected': '#ef4444'
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((segment, index) => {
          const percentage = segment.percentage / 100;
          const angle = (percentage * circumference) / 100;
          
          return (
            <motion.circle
              key={segment.label}
              cx={radius}
              cy={radius}
              r={radius}
              fill="none"
              stroke={colors[segment.label] || '#64748b'}
              strokeWidth={radius}
              strokeDasharray={angle}
              strokeDashoffset={0}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          );
        })}
      </svg>
      
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center text-white">
        <span className="text-2xl font-bold">{data.reduce((sum, item) => sum + item.value, 0)}</span>
        <span className="text-xs text-slate-400">Total</span>
      </div>
      
      {/* Legend */}
      <div className="absolute top-full mt-4 flex flex-wrap gap-2 justify-center">
        {data.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors[segment.label] || '#64748b' }}
            />
            <span className="text-xs text-slate-400">{segment.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
