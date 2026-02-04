import React from 'react';
import { motion } from 'framer-motion';

export function StatsCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  color,
  delay = 0
}) {
  const colorStyles = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div
          className={`p-3 rounded-xl ${colorStyles[color]} transition-transform group-hover:scale-110 duration-300`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {change && (
        <div className="flex items-center gap-2 text-sm">
          <span className={`font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? '+' : ''}
            {change}
          </span>
          <span className="text-slate-500">vs last month</span>
        </div>
      )}

      {/* Decorative gradient glow */}
      <div
        className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${
          color === 'cyan'
            ? 'bg-cyan-500'
            : color === 'emerald'
            ? 'bg-emerald-500'
            : color === 'purple'
            ? 'bg-purple-500'
            : 'bg-amber-500'
        }`}
      />
    </motion.div>
  );
}
