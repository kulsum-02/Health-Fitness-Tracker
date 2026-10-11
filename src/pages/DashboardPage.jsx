import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';
import { useGoals } from '../context/GoalContext';
import { HealthCard } from '../components/HealthCard';
import { BMIWidget } from '../components/BMIWidget';
import { StepsChart } from '../charts/StepsChart';
import { WeightChart } from '../charts/WeightChart';
import { generateSmartRecommendations } from '../utils/recommendationEngine';
import { RecommendationCard } from '../components/RecommendationCard';
import {
  Scale,
  Droplets,
  Moon,
  Footprints,
  Flame,
  Activity,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  Zap
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { healthRecords, todayRecord } = useHealth();
  const { goals, userProfile, getProgressSnapshot } = useGoals();

  const snapshot = getProgressSnapshot(todayRecord);

  // Recommendations preview
  const smartRecs = useMemo(() => {
    return generateSmartRecommendations({
      user: userProfile,
      goals,
      healthRecords
    });
  }, [userProfile, goals, healthRecords]);

  const topRecs = [
    ...(smartRecs?.workoutRecommendations?.slice(0, 1) || []),
    ...(smartRecs?.progressInsights?.slice(0, 1) || [])
  ];

  const safeStepGoal = goals?.stepGoal || 10000;
  const safeCalorieGoal = goals?.calorieGoal || 2200;
  const safeWeightGoal = goals?.weightGoal || 65.0;
  const safeStartWeight = userProfile?.startingWeight || 72.0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-600/40 text-teal-200 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-teal-500/30">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Daily Target Adherence: {snapshot?.overall || 80}%
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
  Welcome to Your Fitness Dashboard! 👋
</h2>
          <p className="text-sm text-teal-100 max-w-xl">
            You are actively progressing towards your <strong className="text-white underline decoration-teal-400">{safeWeightGoal} kg</strong> target. Your daily metrics are dynamically tracked below.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/health')}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center gap-2"
          >
            <Activity className="w-4 h-4" /> Log Health Today
          </button>
          <button
            onClick={() => navigate('/goals')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-sm border border-white/20 transition flex items-center gap-2"
          >
            <Target className="w-4 h-4" /> Manage Goals
          </button>
        </div>
      </div>

      {/* 6 Key Health Summary Cards (Section 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Weight */}
        <HealthCard
          title="Current Weight"
          value={snapshot?.weight?.current ?? 68.4}
          unit="kg"
          target={`${snapshot?.weight?.target ?? 65} kg`}
          targetLabel="Goal"
          percentage={snapshot?.weight?.percentage ?? 72}
          status={snapshot?.weight?.status}
          icon={Scale}
          color="teal"
          subtext={`${snapshot?.weight?.remaining ?? 3.4} kg remaining to reach target`}
          onClick={() => navigate('/progress')}
        />

        {/* 2. BMI */}
        <HealthCard
          title="Body Mass Index"
          value={todayRecord?.bmi || 23.7}
          unit="kg/m²"
          target="18.5 - 24.9"
          targetLabel="Normal"
          status={{ status: 'Normal', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' }}
          icon={Activity}
          color="emerald"
          subtext="Healthy clinical weight range maintained"
          onClick={() => navigate('/health')}
        />

        {/* 3. Water Intake */}
        <HealthCard
          title="Water Intake"
          value={snapshot?.water?.current ?? 1.8}
          unit="L"
          target={`${snapshot?.water?.target ?? 2.5} L`}
          targetLabel="Goal"
          percentage={snapshot?.water?.percentage ?? 72}
          status={snapshot?.water?.status}
          icon={Droplets}
          color="blue"
          subtext={`${snapshot?.water?.remaining ?? 0.7} L to hit daily hydration target`}
          onClick={() => navigate('/health')}
        />

        {/* 4. Sleep Duration */}
        <HealthCard
          title="Sleep Duration"
          value={snapshot?.sleep?.current ?? 7.1}
          unit="hrs"
          target={`${snapshot?.sleep?.target ?? 8.0} hrs`}
          targetLabel="Goal"
          percentage={snapshot?.sleep?.percentage ?? 89}
          status={snapshot?.sleep?.status}
          icon={Moon}
          color="purple"
          subtext={`${(snapshot?.sleep?.current ?? 7.1) >= 7 ? 'Optimal deep restoration achieved' : 'Slight sleep deficit'}`}
          onClick={() => navigate('/health')}
        />

        {/* 5. Daily Steps */}
        <HealthCard
          title="Daily Steps"
          value={Number(snapshot?.steps?.current ?? 7842).toLocaleString()}
          unit="steps"
          target={Number(snapshot?.steps?.target ?? 10000).toLocaleString()}
          targetLabel="Goal"
          percentage={snapshot?.steps?.percentage ?? 78}
          status={snapshot?.steps?.status}
          icon={Footprints}
          color="emerald"
          subtext={`${Number(snapshot?.steps?.remaining ?? 2158).toLocaleString()} steps left for today`}
          onClick={() => navigate('/progress')}
        />

        {/* 6. Calories */}
        <HealthCard
          title="Calories Consumed"
          value={Number(snapshot?.calories?.current ?? 1950).toLocaleString()}
          unit="kcal"
          target={`${Number(snapshot?.calories?.target ?? 2200).toLocaleString()} kcal`}
          targetLabel="Budget"
          percentage={snapshot?.calories?.percentage ?? 88}
          status={snapshot?.calories?.status}
          icon={Flame}
          color="rose"
          subtext={`${Math.abs((snapshot?.calories?.target ?? 2200) - (snapshot?.calories?.current ?? 1950)).toLocaleString()} kcal remaining in budget`}
          onClick={() => navigate('/progress')}
        />
      </div>

      {/* Interactive Charts Section: Steps & Weight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step Consistency</h3>
              <p className="text-xs text-slate-500">Daily steps vs {Number(safeStepGoal).toLocaleString()} target</p>
            </div>
            <button
              onClick={() => navigate('/progress')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Detailed Analytics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <StepsChart records={healthRecords} stepGoal={safeStepGoal} />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weight Trajectory</h3>
              <p className="text-xs text-slate-500">From {safeStartWeight}kg to {safeWeightGoal}kg target</p>
            </div>
            <button
              onClick={() => navigate('/progress')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Weight History <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <WeightChart
            records={healthRecords}
            targetWeight={safeWeightGoal}
            startWeight={safeStartWeight}
          />
        </div>
      </div>

      {/* Dynamic Recommendation Previews */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Intelligent Insights For Today</h3>
              <p className="text-xs text-slate-500">Real-time analysis computed from your latest health metrics</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/recommendations')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            All Recommendations <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topRecs.length > 0 ? (
            topRecs.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onAction={() => navigate('/recommendations')}
              />
            ))
          ) : (
            <p className="text-xs text-slate-400">Loading personalized insights...</p>
          )}
        </div>
      </div>
    </div>
  );
};
