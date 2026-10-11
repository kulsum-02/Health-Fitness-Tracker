import React from 'react';
import { Menu, PlusCircle, Bell, Sparkles, User, Calendar } from 'lucide-react';
import { useGoals } from '../context/GoalContext';
import { useHealth } from '../context/HealthContext';
import { formatDisplayDate, getTodayString } from '../utils/dateUtils';

export const Navbar = ({ onOpenSidebar, onOpenLogModal }) => {
  const { userProfile, goals } = useGoals();
  const { todayRecord } = useHealth();
  const todayStr = getTodayString();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>{formatDisplayDate(todayStr)}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-700">{todayStr}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Log Action */}
        <button
          onClick={onOpenLogModal}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm shadow-teal-600/20 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Health</span>
        </button>

        {/* User Profile Chip */}
        <div className="flex items-center gap-3 pl-2 sm:border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-teal-500/20 shadow-sm flex-shrink-0">
            <img
              src={userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
              alt={userProfile?.name || 'User'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:block text-left">
            <h4 className="text-xs font-bold text-slate-900 leading-tight">
              {userProfile?.name || 'Alex Morgan'}
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">
              {todayRecord?.weight || userProfile?.currentWeight || 68.4} kg • {userProfile?.height || 170} cm
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
