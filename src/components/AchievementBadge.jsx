import React from 'react';
import { Trophy, Droplets, Moon, Scale, Flame, Zap, Award, CheckCircle, Lock } from 'lucide-react';

const iconComponents = {
  Trophy,
  Droplets,
  Moon,
  Scale,
  Flame,
  Zap,
  Award
};

export const AchievementBadge = ({ achievement }) => {
  const { title, category, icon, description, unlocked, progress, badgeColor = 'amber' } = achievement;
  const Icon = iconComponents[icon] || Award;

  const colorStyles = {
    amber: { bg: 'bg-amber-50 text-amber-600 border-amber-200', glow: 'shadow-amber-100' },
    sky: { bg: 'bg-sky-50 text-sky-600 border-sky-200', glow: 'shadow-sky-100' },
    indigo: { bg: 'bg-indigo-50 text-indigo-600 border-indigo-200', glow: 'shadow-indigo-100' },
    emerald: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', glow: 'shadow-emerald-100' },
    rose: { bg: 'bg-rose-50 text-rose-600 border-rose-200', glow: 'shadow-rose-100' },
    teal: { bg: 'bg-teal-50 text-teal-600 border-teal-200', glow: 'shadow-teal-100' }
  }[badgeColor] || { bg: 'bg-teal-50 text-teal-600 border-teal-200', glow: 'shadow-teal-100' };

  return (
    <div
      className={`rounded-2xl p-4 border transition-all ${
        unlocked
          ? `bg-white border-slate-200 shadow-sm hover:shadow-md ${colorStyles.glow}`
          : 'bg-slate-50/70 border-slate-200/60 opacity-75'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${
            unlocked ? colorStyles.bg : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {category}
            </span>
            {unlocked ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-3 h-3" /> Unlocked
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                <Lock className="w-3 h-3" /> {progress}%
              </span>
            )}
          </div>

          <h4 className="text-sm font-bold text-slate-800 leading-snug">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>

          {!unlocked && progress !== undefined && (
            <div className="mt-2.5">
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
