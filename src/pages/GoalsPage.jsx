import React, { useState } from 'react';
import { useGoals } from '../context/GoalContext';
import { useHealth } from '../context/HealthContext';
import { GoalCard } from '../components/GoalCard';
import { GoalForm } from '../components/GoalForm';
import { Target, Footprints, Flame, Scale, Droplets, Moon, Activity, Award, CheckCircle2 } from 'lucide-react';

export const GoalsPage = () => {
  const { goals, userProfile, updateGoals, getProgressSnapshot } = useGoals();
  const { todayRecord } = useHealth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const snapshot = getProgressSnapshot(todayRecord);

  const handleSaveGoals = async (formData) => {
    setIsSubmitting(true);
    await updateGoals(formData);
    setIsSubmitting(false);
  };

  const handleResetDefaults = async () => {
    await updateGoals({
      stepGoal: 10000,
      calorieGoal: 2200,
      weightGoal: 65.0,
      waterGoal: 2.5,
      sleepGoal: 8.0,
      goalType: 'weight_loss',
      workoutDaysGoal: 5,
      activeMinutesGoal: 45
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Target className="w-7 h-7 text-teal-600" /> Fitness Goal Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure target milestones. All progress calculations, chart bounds, and recommendations update in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Active Strategy: <strong className="capitalize">{goals?.goalType?.replace('_', ' ') || 'Fat Loss'}</strong></span>
        </div>
      </div>

      {/* Active Goal Cards Grid (Section 7) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Step Goal Card */}
        <GoalCard
          title="Daily Steps"
          current={snapshot.steps.current}
          target={goals?.stepGoal || 10000}
          unit="steps"
          percentage={snapshot.steps.percentage}
          status={snapshot.steps.status}
          icon={Footprints}
          color="teal"
          sublabel="Base Aerobic Output"
        />

        {/* Calorie Goal Card */}
        <GoalCard
          title="Daily Calorie Budget"
          current={snapshot.calories.current}
          target={goals?.calorieGoal || 2200}
          unit="kcal"
          percentage={snapshot.calories.percentage}
          status={snapshot.calories.status}
          icon={Flame}
          color="rose"
          sublabel="Nutritional Energy"
        />

        {/* Target Weight Card */}
        <GoalCard
          title="Target Weight"
          current={snapshot.weight.current}
          target={goals?.weightGoal || 65.0}
          unit="kg"
          percentage={snapshot.weight.percentage}
          status={snapshot.weight.status}
          icon={Scale}
          color="emerald"
          sublabel={`From ${userProfile?.startingWeight || 72} kg starting weight`}
        />

        {/* Water Goal Card */}
        <GoalCard
          title="Daily Hydration"
          current={snapshot.water.current}
          target={goals?.waterGoal || 2.5}
          unit="L"
          percentage={snapshot.water.percentage}
          status={snapshot.water.status}
          icon={Droplets}
          color="blue"
          sublabel="Cellular Hydration"
        />

        {/* Sleep Goal Card */}
        <GoalCard
          title="Target Sleep"
          current={snapshot.sleep.current}
          target={goals?.sleepGoal || 8.0}
          unit="hrs"
          percentage={snapshot.sleep.percentage}
          status={snapshot.sleep.status}
          icon={Moon}
          color="purple"
          sublabel="Rest & Hormonal Balance"
        />

        {/* Workout Days Card */}
        <GoalCard
          title="Weekly Exercise"
          current={4}
          target={goals?.workoutDaysGoal || 5}
          unit="days/wk"
          percentage={80}
          status={{ status: 'Almost Achieved', badge: 'bg-amber-50 text-amber-700 border-amber-200', message: '1 session remaining' }}
          icon={Activity}
          color="amber"
          sublabel="Structured Workouts"
        />
      </div>

      {/* Goal Configuration Form (Section 6) */}
      <GoalForm
        initialGoals={goals}
        onSubmit={handleSaveGoals}
        onReset={handleResetDefaults}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
