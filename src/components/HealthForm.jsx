import React, { useState } from 'react';
import { validateHealthRecord } from '../utils/validationUtils';
import { calculateBMI, getBMICategory } from '../utils/bmiCalculator';
import { getTodayString } from '../utils/dateUtils';
import { useGoals } from '../context/GoalContext';
import { Scale, Droplets, Moon, Footprints, Flame, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

export const HealthForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }) => {
  const { userProfile } = useGoals();
  const todayStr = getTodayString();

  const [formData, setFormData] = useState({
    date: initialData?.date || todayStr,
    weight: initialData?.weight !== undefined ? initialData.weight : '',
    waterIntake: initialData?.waterIntake !== undefined ? initialData.waterIntake : '',
    sleepDuration: initialData?.sleepDuration !== undefined ? initialData.sleepDuration : '',
    steps: initialData?.steps !== undefined ? initialData.steps : '',
    calories: initialData?.calories !== undefined ? initialData.calories : ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Dynamic preview of BMI while typing weight
  const userHeight = userProfile?.height || 170;
  const currentBMI = calculateBMI(formData.weight, userHeight);
  const bmiInfo = getBMICategory(currentBMI);

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
    const result = validateHealthRecord(formData);
    if (result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateHealthRecord(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      setTouched({
        date: true,
        weight: true,
        waterIntake: true,
        sleepDuration: true,
        steps: true,
        calories: true
      });
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleFillDemo = () => {
    setFormData({
      date: todayStr,
      weight: 68.2,
      waterIntake: 2.6,
      sleepDuration: 7.8,
      steps: 10450,
      calories: 2150
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {initialData ? 'Edit Health Entry' : 'Log Daily Health Metrics'}
          </h3>
          <p className="text-xs text-slate-500">Record accurate daily biometric and physical activity markers</p>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-xs font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition"
        >
          Quick Fill Sample Values
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Date Field */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Date of Record <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            max={todayStr}
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
              errors.date && touched.date
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
            }`}
          />
          {errors.date && touched.date && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.date}
            </p>
          )}
        </div>

        {/* Weight Field */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Scale className="w-3.5 h-3.5 text-teal-600" />
            Weight (kg) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 68.4"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              onBlur={() => handleBlur('weight')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm pr-12 focus:outline-none transition ${
                errors.weight && touched.weight
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">kg</span>
          </div>
          {errors.weight && touched.weight && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.weight}
            </p>
          )}
        </div>

        {/* Water Intake Field */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            Water Intake (Litres) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 2.5"
              value={formData.waterIntake}
              onChange={(e) => handleChange('waterIntake', e.target.value)}
              onBlur={() => handleBlur('waterIntake')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm pr-12 focus:outline-none transition ${
                errors.waterIntake && touched.waterIntake
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">L</span>
          </div>
          {errors.waterIntake && touched.waterIntake && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.waterIntake}
            </p>
          )}
        </div>

        {/* Sleep Duration Field */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            Sleep Duration (Hours) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 7.5"
              value={formData.sleepDuration}
              onChange={(e) => handleChange('sleepDuration', e.target.value)}
              onBlur={() => handleBlur('sleepDuration')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm pr-12 focus:outline-none transition ${
                errors.sleepDuration && touched.sleepDuration
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">hrs</span>
          </div>
          {errors.sleepDuration && touched.sleepDuration && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.sleepDuration}
            </p>
          )}
        </div>

        {/* Steps Field */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Footprints className="w-3.5 h-3.5 text-teal-600" />
            Steps Completed <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="1"
              placeholder="e.g. 10000"
              value={formData.steps}
              onChange={(e) => handleChange('steps', e.target.value)}
              onBlur={() => handleBlur('steps')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm pr-14 focus:outline-none transition ${
                errors.steps && touched.steps
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">steps</span>
          </div>
          {errors.steps && touched.steps && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.steps}
            </p>
          )}
        </div>

        {/* Calories Field */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            Calories Consumed <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="1"
              placeholder="e.g. 2100"
              value={formData.calories}
              onChange={(e) => handleChange('calories', e.target.value)}
              onBlur={() => handleBlur('calories')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm pr-14 focus:outline-none transition ${
                errors.calories && touched.calories
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">kcal</span>
          </div>
          {errors.calories && touched.calories && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.calories}
            </p>
          )}
        </div>
      </div>

      {/* Dynamic Live BMI Calculation Preview Banner */}
      {currentBMI && (
        <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Live Calculated BMI:</span>
            <span className="text-sm font-bold text-slate-800">{currentBMI}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${bmiInfo.bgClass}`}>
              {bmiInfo.category}
            </span>
          </div>
          <span className="text-xs text-slate-400">Height: {userHeight} cm</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm transition disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save Health Record'}
        </button>
      </div>
    </form>
  );
};
