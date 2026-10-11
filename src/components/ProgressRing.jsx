import React from 'react';

export const ProgressRing = ({
  percentage = 0,
  size = 64,
  strokeWidth = 6,
  color = 'teal',
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const offset = circumference - (clamped / 100) * circumference;

  const strokeColors = {
    teal: 'stroke-teal-500',
    emerald: 'stroke-emerald-500',
    blue: 'stroke-blue-500',
    amber: 'stroke-amber-500',
    rose: 'stroke-rose-500',
    purple: 'stroke-purple-500'
  };

  const ringStroke = strokeColors[color] || 'stroke-teal-500';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-slate-100 fill-none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${ringStroke} fill-none transition-all duration-700 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        {children || <span className="text-xs font-bold text-slate-700">{clamped}%</span>}
      </div>
    </div>
  );
};
