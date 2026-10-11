import React, { useState, useEffect } from 'react';
import { validateGoals } from '../utils/validationUtils';
import { Target, Footprints, Flame, Scale, Droplets, Moon, Activity, AlertCircle, Save, RotateCcw } from 'lucide-react';

export const GoalForm = ({ initialGoals, onSubmit, onReset, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    stepGoal: 10000,
    calorieGoal: 2200,
    weightGoal: 65.0,
    waterGoal: 2.5,
    sleepGoal: 8.0,
    goalType: 'weight_loss',
    workoutDaysGoal: 5,
    activeMinutesGoal: 45
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialGoals) {
      setFormData({
        stepGoal: initialGoals.stepGoal || 10000,
        calorieGoal: initialGoals.calorieGoal || 2200,
        weightGoal: initialGoals.weightGoal || 65.0,
        waterGoal: initialGoals.waterGoal || 2.5,
        sleepGoal: initialGoals.sleepGoal || 8.0,
        goalType: initialGoals.goalType || 'weight_loss',
        workoutDaysGoal: initialGoals.workoutDaysGoal || 5,
        activeMinutesGoal: initialGoals.activeMinutesGoal || 45
      });
    }
  }, [initialGoals]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = validateGoals(formData);
    if (result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateGoals(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      setTouched({
        stepGoal: true,
        calorieGoal: true,
        weightGoal: true,
        waterGoal: true,
        sleepGoal: true
      });
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const applyPreset = (preset) => {
    if (preset === 'weight_loss') {
      setFormData((prev) => ({
        ...prev,
        goalType: 'weight_loss',
        calorieGoal: 2000,
        stepGoal: 11000,
        waterGoal: 2.8
      }));
    } else if (preset === 'muscle_gain') {
      setFormData((prev) => ({
        ...prev,
        goalType: 'muscle_gain',
        calorieGoal: 2600,
        stepGoal: 8500,
        waterGoal: 3.0
      }));
    } else if (preset === 'general_fitness') {
      setFormData((prev) => ({
        ...prev,
        goalType: 'general_fitness',
        calorieGoal: 2200,
        stepGoal: 10000,
        waterGoal: 2.5
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Configure Fitness Targets</h3>
          <p className="text-xs text-slate-500">Set daily milestones that drive progress tracking and smart recommendations</p>
        </div>

        {/* Quick Goal Presets */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => applyPreset('weight_loss')}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
              formData.goalType === 'weight_loss' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fat Loss
          </button>
          <button
            type="button"
            onClick={() => applyPreset('muscle_gain')}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
              formData.goalType === 'muscle_gain' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Muscle Gain
          </button>
          <button
            type="button"
            onClick={() => applyPreset('general_fitness')}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
              formData.goalType === 'general_fitness' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maintenance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Step Goal */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Footprints className="w-3.5 h-3.5 text-teal-600" />
            Daily Step Target <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="500"
              value={formData.stepGoal}
              onChange={(e) => handleChange('stepGoal', e.target.value)}
              onBlur={() => handleBlur('stepGoal')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm pr-16 focus:outline-none transition ${
                errors.stepGoal && touched.stepGoal
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">steps/day</span>
          </div>
          {errors.stepGoal && touched.stepGoal && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.stepGoal}
            </p>
          )}
        </div>

        {/* Calorie Goal */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            Daily Calorie Budget <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="50"
              value={formData.calorieGoal}
              onChange={(e) => handleChange('calorieGoal', e.target.value)}
              onBlur={() => handleBlur('calorieGoal')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm pr-16 focus:outline-none transition ${
                errors.calorieGoal && touched.calorieGoal
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">kcal/day</span>
          </div>
          {errors.calorieGoal && touched.calorieGoal && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.calorieGoal}
            </p>
          )}
        </div>

        {/* Target Weight */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Scale className="w-3.5 h-3.5 text-teal-600" />
            Target Weight <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.5"
              value={formData.weightGoal}
              onChange={(e) => handleChange('weightGoal', e.target.value)}
              onBlur={() => handleBlur('weightGoal')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm pr-12 focus:outline-none transition ${
                errors.weightGoal && touched.weightGoal
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">kg</span>
          </div>
          {errors.weightGoal && touched.weightGoal && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.weightGoal}
            </p>
          )}
        </div>

        {/* Water Goal */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            Daily Hydration Target
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={formData.waterGoal}
              onChange={(e) => handleChange('waterGoal', e.target.value)}
              onBlur={() => handleBlur('waterGoal')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm pr-12 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none transition"
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">L/day</span>
          </div>
          {errors.waterGoal && touched.waterGoal && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.waterGoal}
            </p>
          )}
        </div>

        {/* Sleep Goal */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            Target Sleep Duration
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.5"
              value={formData.sleepGoal}
              onChange={(e) => handleChange('sleepGoal', e.target.value)}
              onBlur={() => handleBlur('sleepGoal')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm pr-14 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none transition"
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">hrs/night</span>
          </div>
          {errors.sleepGoal && touched.sleepGoal && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.sleepGoal}
            </p>
          )}
        </div>

        {/* Workout Frequency */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            Workout Frequency
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="7"
              value={formData.workoutDaysGoal}
              onChange={(e) => handleChange('workoutDaysGoal', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm pr-16 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none transition"
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">days/week</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving Goals...' : 'Save Goals & Update Dashboard'}
        </button>
      </div>
    </form>
  );
};
