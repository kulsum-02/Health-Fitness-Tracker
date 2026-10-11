import React from 'react';
import { ProgressBar } from './ProgressBar';

export const HealthCard = ({
  title,
  value,
  unit,
  target,
  targetLabel = 'Goal',
  percentage,
  status,
  icon: Icon,
  color = 'teal',
  subtext,
  onClick
}) => {
  const colorSchemes = {
    teal: {
      iconBg: 'bg-teal-50 text-teal-600',
      progress: 'teal'
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600',
      progress: 'emerald'
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600',
      progress: 'blue'
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600',
      progress: 'amber'
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600',
      progress: 'rose'
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600',
      progress: 'purple'
    }
  };

  const currentTheme = colorSchemes[color] || colorSchemes.teal;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-card ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentTheme.iconBg}`}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">{value}</span>
              {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
            </div>
          </div>
        </div>

        {status && (
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
              status.badge || 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {status.status || status}
          </span>
        )}
      </div>

      {percentage !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-slate-500">
              {targetLabel}: <strong className="text-slate-700">{target}</strong>
            </span>
            <span className="font-semibold text-slate-700">{Math.round(percentage)}%</span>
          </div>
          <ProgressBar percentage={percentage} color={currentTheme.progress} height="h-2" />
        </div>
      )}

      {subtext && (
        <p className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2">{subtext}</p>
      )}
    </div>
  );
};
