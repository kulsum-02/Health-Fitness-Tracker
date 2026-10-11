import React from 'react';
import { ProgressBar } from './ProgressBar';
import { Target } from 'lucide-react';

export const GoalCard = ({
  title,
  current,
  target,
  unit = '',
  percentage = 0,
  status,
  icon: Icon = Target,
  color = 'teal',
  sublabel,
  onEdit
}) => {
  const colorMap = {
    teal: { iconBg: 'bg-teal-50 text-teal-600', bar: 'teal' },
    emerald: { iconBg: 'bg-emerald-50 text-emerald-600', bar: 'emerald' },
    blue: { iconBg: 'bg-blue-50 text-blue-600', bar: 'blue' },
    amber: { iconBg: 'bg-amber-50 text-amber-600', bar: 'amber' },
    purple: { iconBg: 'bg-purple-50 text-purple-600', bar: 'purple' },
    rose: { iconBg: 'bg-rose-50 text-rose-600', bar: 'rose' }
  };

  const currentTheme = colorMap[color] || colorMap.teal;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${currentTheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">{title}</h4>
            <p className="text-xs text-slate-400">{sublabel || 'Daily Target'}</p>
          </div>
        </div>

        {status && (
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${status.badge}`}>
            {status.status}
          </span>
        )}
      </div>

      {/* Progress Value Metrics */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-extrabold text-slate-900">
            {typeof current === 'number' ? current.toLocaleString() : current}
          </span>
          <span className="text-xs text-slate-400 font-medium">/</span>
          <span className="text-sm font-semibold text-slate-500">
            {typeof target === 'number' ? target.toLocaleString() : target} {unit}
          </span>
        </div>
        <span className="text-sm font-extrabold text-slate-700">
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress Bar */}
      <ProgressBar percentage={percentage} color={currentTheme.bar} height="h-2.5" />

      {/* Dynamic Status Message */}
      <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
        <span className="text-slate-500 font-medium italic">
          "{status?.message || 'Track daily to hit target'}"
        </span>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-teal-600 hover:text-teal-700 font-semibold hover:underline"
          >
            Adjust
          </button>
        )}
      </div>
    </div>
  );
};
