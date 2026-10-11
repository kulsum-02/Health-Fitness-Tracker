import React, { useState, useMemo } from 'react';
import { useHealth } from '../context/HealthContext';
import { useGoals } from '../context/GoalContext';
import { WeightChart } from '../charts/WeightChart';
import { StepsChart } from '../charts/StepsChart';
import { WaterChart } from '../charts/WaterChart';
import { SleepChart } from '../charts/SleepChart';
import { CalorieChart } from '../charts/CalorieChart';
import { WeeklyPerformanceChart } from '../charts/WeeklyPerformanceChart';
import { AchievementBadge } from '../components/AchievementBadge';
import { calculateAverages, calculateWeightProgress, evaluateAchievements } from '../utils/progressCalculators';
import {
  TrendingUp,
  Award,
  Calendar,
  ArrowDown,
  ArrowUp,
  Activity,
  Droplets,
  Moon,
  Footprints,
  Flame,
  Scale
} from 'lucide-react';

export const ProgressPage = () => {
  const { healthRecords, todayRecord } = useHealth();
  const { goals, userProfile } = useGoals();
  const [activeTab, setActiveTab] = useState('weekly'); // 'weekly' or 'monthly'
  const [monthSelection, setMonthSelection] = useState('current');

  // Sorted records
  const sortedAsc = useMemo(() => {
    return [...(healthRecords || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [healthRecords]);

  // Weekly data slice (last 7 days)
  const last7Days = useMemo(() => sortedAsc.slice(-7), [sortedAsc]);
  const weeklyAverages = useMemo(() => calculateAverages(last7Days), [last7Days]);

  // Monthly data slice (last 30 days)
  const last30Days = useMemo(() => sortedAsc.slice(-30), [sortedAsc]);
  const monthlyAverages = useMemo(() => calculateAverages(last30Days), [last30Days]);

  // Weight delta calculation for this week
  const weekStartWeight = last7Days[0]?.weight || userProfile?.startingWeight || 72;
  const weekCurrentWeight = last7Days[last7Days.length - 1]?.weight || userProfile?.currentWeight || 68.4;
  const weeklyWeightDiff = Number((weekCurrentWeight - weekStartWeight).toFixed(1));

  // Dynamic Achievements
  const achievements = useMemo(() => {
    return evaluateAchievements(healthRecords, goals, userProfile);
  }, [healthRecords, goals, userProfile]);

  const safeStepGoal = goals?.stepGoal || 10000;
  const safeWaterGoal = goals?.waterGoal || 2.5;
  const safeSleepGoal = goals?.sleepGoal || 8.0;
  const safeCalorieGoal = goals?.calorieGoal || 2200;
  const safeWeightGoal = goals?.weightGoal || 65.0;
  const safeStartWeight = userProfile?.startingWeight || 72.0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-teal-600" /> Progress Analytics & Trends
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time biometric trends, goal comparisons, and dynamically unlocked achievements.
          </p>
        </div>

        {/* View Switcher: Weekly vs Monthly */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'weekly'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly Breakdown
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'monthly'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Analytics
          </button>
        </div>
      </div>

      {/* SECTION 1: WEEKLY OR MONTHLY SUMMARY CARD (Sections 12 & 13) */}
      {activeTab === 'weekly' ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                This Week's Performance
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              Last 7 Days Rolling Average
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Weight change */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Weight Change
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                {weeklyWeightDiff < 0 ? (
                  <span className="text-xl font-extrabold text-emerald-600 flex items-center">
                    <ArrowDown className="w-4 h-4 mr-0.5" /> {Math.abs(weeklyWeightDiff)} kg
                  </span>
                ) : weeklyWeightDiff > 0 ? (
                  <span className="text-xl font-extrabold text-amber-600 flex items-center">
                    <ArrowUp className="w-4 h-4 mr-0.5" /> +{weeklyWeightDiff} kg
                  </span>
                ) : (
                  <span className="text-xl font-extrabold text-slate-700">0.0 kg</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">From week start</p>
            </div>

            {/* Average Steps */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Avg Steps
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {Number(weeklyAverages?.avgSteps || 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Goal: {Number(safeStepGoal).toLocaleString()}/day</p>
            </div>

            {/* Average Water */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Avg Water
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {weeklyAverages?.avgWater ?? 2.2} L
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Goal: {safeWaterGoal} L/day</p>
            </div>

            {/* Average Sleep */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Avg Sleep
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {weeklyAverages?.avgSleep ?? 7.4} hrs
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Goal: {safeSleepGoal} hrs/night</p>
            </div>

            {/* Average Calories */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Avg Calories
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {Number(weeklyAverages?.avgCalories || 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Goal: {safeCalorieGoal} kcal</p>
            </div>

            {/* Goal Completion */}
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                Goal Adherence
              </span>
              <div className="text-xl font-extrabold text-teal-800 mt-1">
                {Math.round(
                  ((((weeklyAverages?.avgSteps || 8000) / safeStepGoal) +
                    ((weeklyAverages?.avgWater || 2.2) / safeWaterGoal) +
                    ((weeklyAverages?.avgSleep || 7.4) / safeSleepGoal)) / 3) * 100
                )}%
              </div>
              <p className="text-[10px] text-teal-600 mt-1">Aggregated vector score</p>
            </div>
          </div>

          {/* Weekly Performance Combined Chart */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 mb-2">Weekly Composite Trajectory (Steps & Weight)</h4>
            <WeeklyPerformanceChart records={last7Days} />
          </div>
        </div>
      ) : (
        /* Monthly Analytics Section (Section 13) */
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Monthly Performance & Consistency
              </h3>
              <p className="text-xs text-slate-500">Longitudinal analytics over the 30-day tracking window</p>
            </div>

            {/* Month Select Controls */}
            <div className="flex items-center gap-2">
              <select
                value={monthSelection}
                onChange={(e) => setMonthSelection(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
              >
                <option value="current">Current Month (October)</option>
                <option value="previous">Previous Month (September)</option>
                <option value="custom">Custom 30-Day Window</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Weight Change
              </span>
              <div className="text-xl font-extrabold text-emerald-600 mt-1">
                ↓ 3.6 kg
              </div>
              <p className="text-[10px] text-slate-400 mt-1">From 72.0 kg start</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Avg Daily Steps
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {Number(monthlyAverages?.avgSteps || 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">94% of monthly target</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Avg Water Intake
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {monthlyAverages?.avgWater ?? 2.3} L
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Consistent hydration</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Avg Sleep
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {monthlyAverages?.avgSleep ?? 7.5} hrs
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Healthy circadian cycle</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Goals Achieved
              </span>
              <div className="text-xl font-extrabold text-teal-700 mt-1">
                {achievements.filter((a) => a.unlocked).length} / {achievements.length}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Milestones unlocked</p>
            </div>

            <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                Consistency Score
              </span>
              <div className="text-xl font-extrabold text-teal-800 mt-1">
                92%
              </div>
              <p className="text-[10px] text-teal-600 mt-1">Active logging record</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FIVE DEDICATED PROGRESS CHARTS (Section 11) */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Core Biometric Progress Charts</h3>

        {/* 1. Weight Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Weight Progression (kg)</h4>
              <p className="text-xs text-slate-500">Historical trend towards target weight</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-slate-500">Start: <strong className="text-slate-700">{safeStartWeight} kg</strong></span>
              <span className="text-teal-600">Current: <strong className="text-slate-900">{todayRecord?.weight || 68.4} kg</strong></span>
              <span className="text-emerald-600">Target: <strong className="text-emerald-700">{safeWeightGoal} kg</strong></span>
            </div>
          </div>
          <WeightChart
            records={healthRecords}
            targetWeight={safeWeightGoal}
            startWeight={safeStartWeight}
          />
        </div>

        {/* 2-Column: Steps & Calories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-1">Daily Steps vs Target</h4>
            <p className="text-xs text-slate-500 mb-4">Goal: {Number(safeStepGoal).toLocaleString()} steps/day</p>
            <StepsChart records={healthRecords} stepGoal={safeStepGoal} />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-1">Daily Calorie Consumption vs Budget</h4>
            <p className="text-xs text-slate-500 mb-4">Budget: {Number(safeCalorieGoal).toLocaleString()} kcal/day</p>
            <CalorieChart records={healthRecords} calorieGoal={safeCalorieGoal} />
          </div>
        </div>

        {/* 2-Column: Water & Sleep */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-1">Hydration Progress (Litres)</h4>
            <p className="text-xs text-slate-500 mb-4">Goal: {safeWaterGoal} L/day</p>
            <WaterChart records={healthRecords} waterGoal={safeWaterGoal} />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-1">Sleep Duration (Hours)</h4>
            <p className="text-xs text-slate-500 mb-4">Goal: {safeSleepGoal} hrs/night (Optimal zone 7-9h)</p>
            <SleepChart records={healthRecords} sleepGoal={safeSleepGoal} />
          </div>
        </div>
      </div>

      {/* SECTION 3: DYNAMIC ACHIEVEMENT SYSTEM (Section 14) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dynamic Achievement Badges</h3>
              <p className="text-xs text-slate-500">
                Unlocked automatically when your recorded metrics satisfy target criteria
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {achievements.filter((a) => a.unlocked).length} of {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <AchievementBadge key={ach.id} achievement={ach} />
          ))}
        </div>
      </div>
    </div>
  );
};
