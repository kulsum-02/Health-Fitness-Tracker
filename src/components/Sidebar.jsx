
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Activity,
  TrendingUp,
  FileText,
  Sparkles,
  Zap,
  HeartPulse,
  Dumbbell
} from 'lucide-react';

import { useHealth } from '../context/HealthContext';
import { useGoals } from '../context/GoalContext';

export const Sidebar = ({ onClose }) => {
  const { todayRecord } = useHealth();
  const { goals, getProgressSnapshot } = useGoals();

  const snapshot = getProgressSnapshot(todayRecord);

  

const navLinks = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    to: '/goals',
    label: 'Goals',
    icon: Target
  },
  {
    to: '/health',
    label: 'Health Tracking',
    icon: Activity
  },
  {
    to: '/workout-activity',
    label: 'Workout & Activity',
    icon: Dumbbell
  },
  {
    to: '/progress',
    label: 'Progress & Trends',
    icon: TrendingUp
  },
  {
    to: '/reports',
    label: 'Reports',
    icon: FileText
  },
  {
    to: '/recommendations',
    label: 'Recommendations',
    icon: Sparkles
  },
  {
    to: '/login',
    label: 'Login',
    icon: LayoutDashboard
  },
  {
    to: '/register',
    label: 'Register',
    icon: Target
  },
  {
    to: '/profile',
    label: 'My Profile',
    icon: HeartPulse
  }
];



  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200/80 flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              FitPulse
              <span className="text-teal-600 text-xs px-1.5 py-0.5 rounded bg-teal-50 font-bold uppercase">
                Pro
              </span>
            </h1>

            <p className="text-[10px] text-slate-400 font-medium">
              Health & Goals Engine
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Goal Summary */}
      <div className="p-4 space-y-3 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Daily Target
            </span>

            <span className="font-bold text-teal-600">
              {snapshot?.overall ?? 0}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, snapshot?.overall ?? 0)
                )}%`
              }}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            Target Weight:{' '}
            <strong className="text-slate-700">
              {goals?.weightGoal || 65} kg
            </strong>
          </p>
        </div>
      </div>
    </aside>
  );
};
