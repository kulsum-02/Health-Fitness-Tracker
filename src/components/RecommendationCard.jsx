import React, { useState } from 'react';
import { Footprints, Dumbbell, Flame, Heart, Smile, Sparkles, TrendingDown, TrendingUp, Droplets, Moon, CheckCircle2, ChevronRight, Check } from 'lucide-react';

const iconMap = {
  Footprints,
  Dumbbell,
  Flame,
  Heart,
  Smile,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Droplets,
  Moon
};

export const RecommendationCard = ({
  recommendation,
  onAction
}) => {
  const [completed, setCompleted] = useState(false);
  const { title, category, description, advice, tips, focus, badge, icon, actionText } = recommendation;
  const Icon = iconMap[icon] || Sparkles;

  const handleComplete = () => {
    setCompleted(!completed);
    if (onAction) onAction(recommendation);
  };

  return (
    <div className={`bg-white rounded-2xl p-5 border transition-card ${
      completed ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200/80 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
              {category}
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">{title}</h4>
          </div>
        </div>

        {badge && (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {badge}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mt-2">
        {description || advice}
      </p>

      {focus && (
        <div className="mt-2 text-xs font-semibold text-teal-800">
          Primary Focus: <span className="font-normal text-slate-600">{focus}</span>
        </div>
      )}

      {tips && tips.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={handleComplete}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
            completed
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          {completed ? (
            <>
              <Check className="w-3.5 h-3.5" /> Scheduled / Completed
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> {actionText || 'Mark as Goal'}
            </>
          )}
        </button>

        <span className="text-[11px] text-slate-400 font-medium">AI Personalized</span>
      </div>
    </div>
  );
};
