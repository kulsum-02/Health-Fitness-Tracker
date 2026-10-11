import React from 'react';

export const ProgressBar = ({
  percentage = 0,
  color = 'teal',
  height = 'h-2.5',
  showPercentage = false,
  animated = true
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));

  const colorMap = {
    teal: 'bg-teal-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    purple: 'bg-purple-500'
  };

  const bgBarColor = colorMap[color] || 'bg-teal-500';

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} rounded-full ${bgBarColor} ${
            animated ? 'transition-all duration-700 ease-out' : ''
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-end mt-1 text-xs font-semibold text-slate-500">
          {clamped}%
        </div>
      )}
    </div>
  );
};
