import React from 'react';
import { motion } from 'framer-motion';

export const DonutChart = ({ data, size = 200, innerRadius = 0.6 }) => {
  const radius = size / 2;
  const innerRadiusPx = radius * innerRadius;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate angles for each segment
  let currentAngle = -90; // Start from top
  const segments = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      angle
    };
  });

  // Create SVG path for donut segment
  const createDonutPath = (startAngle, endAngle) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = radius + radius * Math.cos(startAngleRad);
    const y1 = radius + radius * Math.sin(startAngleRad);
    const x2 = radius + radius * Math.cos(endAngleRad);
    const y2 = radius + radius * Math.sin(endAngleRad);
    
    const x3 = radius + innerRadiusPx * Math.cos(startAngleRad);
    const y3 = radius + innerRadiusPx * Math.sin(startAngleRad);
    const x4 = radius + innerRadiusPx * Math.cos(endAngleRad);
    const y4 = radius + innerRadiusPx * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${x3} ${y3}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x4} ${y4}
      A ${innerRadiusPx} ${innerRadiusPx} 0 ${largeArcFlag} 0 ${x3} ${y3}
      Z
    `;
  };

  const colors = {
    'bg-slate-500': '#64748b',
    'bg-amber-500': '#f59e0b', 
    'bg-emerald-500': '#10b981',
    'bg-rose-500': '#ef4444',
    'bg-blue-500': '#3b82f6',
    'bg-purple-500': '#a855f7',
    'bg-cyan-500': '#06b6d4'
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((segment, index) => (
          <motion.path
            key={segment.label}
            d={createDonutPath(segment.startAngle, segment.endAngle)}
            fill={colors[segment.color] || '#64748b'}
            stroke="none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.6,
              ease: "easeOut"
            }}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          />
        ))}
      </svg>
      
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center text-white">
        <span className="text-2xl font-bold">{total}</span>
        <span className="text-xs text-slate-400">Total</span>
      </div>
      
      {/* Hover tooltips */}
      <div className="absolute top-full mt-4 flex flex-wrap gap-2 justify-center max-w-xs">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2 bg-slate-800/80 px-2 py-1 rounded-full">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: colors[segment.color] || '#64748b' }}
            />
            <span className="text-xs text-slate-300 whitespace-nowrap">
              {segment.label}: {segment.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
