import React, { useState, useEffect } from 'react';
import { calculateBMI, getBMICategory, getBMIPosition, getHealthyWeightRange } from '../utils/bmiCalculator';
import { Activity, Info } from 'lucide-react';

export const BMIWidget = ({ initialWeight = 68.4, initialHeight = 170, onUpdate }) => {
  const [weight, setWeight] = useState(initialWeight);
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    if (initialWeight) setWeight(initialWeight);
  }, [initialWeight]);

  useEffect(() => {
    if (initialHeight) setHeight(initialHeight);
  }, [initialHeight]);

  const bmi = calculateBMI(weight, height);
  const categoryInfo = getBMICategory(bmi);
  const pointerPosition = getBMIPosition(bmi);
  const healthyRange = getHealthyWeightRange(height);

  const handleWeightChange = (val) => {
    const num = parseFloat(val) || 0;
    setWeight(num);
    if (onUpdate) onUpdate(num, height);
  };

  const handleHeightChange = (val) => {
    const num = parseFloat(val) || 0;
    setHeight(num);
    if (onUpdate) onUpdate(weight, num);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Dynamic BMI Calculator</h3>
            <p className="text-xs text-slate-500">Body Mass Index & Clinical Categories</p>
          </div>
        </div>

        {bmi && (
          <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${categoryInfo.bgClass}`}>
            {categoryInfo.category}
          </span>
        )}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-600">Height (cm)</label>
            <span className="text-sm font-bold text-teal-700">{height} cm</span>
          </div>
          <input
            type="range"
            min="120"
            max="220"
            step="1"
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>120 cm</span>
            <span>170 cm</span>
            <span>220 cm</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-600">Weight (kg)</label>
            <span className="text-sm font-bold text-teal-700">{weight} kg</span>
          </div>
          <input
            type="range"
            min="35"
            max="160"
            step="0.5"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>35 kg</span>
            <span>70 kg</span>
            <span>160 kg</span>
          </div>
        </div>
      </div>

      {/* Main Calculated Score & Visual Scale */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/70 p-5 rounded-xl border border-slate-200/60 mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Calculated BMI</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold text-slate-900">{bmi || '--'}</span>
              <span className="text-xs font-medium text-slate-500">kg/m²</span>
            </div>
          </div>

          <div className="text-right sm:text-right text-center">
            <span className="text-xs font-semibold text-slate-500">Healthy Weight for {height}cm:</span>
            <p className="text-xs font-bold text-teal-700 mt-0.5">
              {healthyRange ? `${healthyRange.minWeight} kg — ${healthyRange.maxWeight} kg` : '--'}
            </p>
          </div>
        </div>

        {/* Visual Scale Bar with Moving Needle Indicator */}
        <div className="relative pt-6 pb-2">
          {/* Indicator Needle */}
          <div
            className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
            style={{ left: `${Math.min(98, Math.max(2, pointerPosition))}%` }}
          >
            <span className="text-[11px] font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">
              {bmi}
            </span>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-slate-800" />
          </div>

          {/* Segmented Color Track */}
          <div className="h-3 w-full rounded-full flex overflow-hidden shadow-inner">
            <div className="w-1/4 bg-blue-400" title="Underweight (< 18.5)" />
            <div className="w-1/4 bg-emerald-500" title="Normal (18.5 - 24.9)" />
            <div className="w-1/4 bg-amber-400" title="Overweight (25.0 - 29.9)" />
            <div className="w-1/4 bg-rose-500" title="Obese (>= 30.0)" />
          </div>

          {/* Scale Labels */}
          <div className="grid grid-cols-4 text-[11px] font-semibold text-slate-500 mt-2 text-center">
            <span>Underweight<br /><span className="text-[9px] font-normal text-slate-400">&lt; 18.5</span></span>
            <span className="text-emerald-700">Normal<br /><span className="text-[9px] font-normal text-slate-400">18.5 - 24.9</span></span>
            <span className="text-amber-700">Overweight<br /><span className="text-[9px] font-normal text-slate-400">25 - 29.9</span></span>
            <span className="text-rose-700">Obese<br /><span className="text-[9px] font-normal text-slate-400">&ge; 30.0</span></span>
          </div>
        </div>
      </div>

      {/* Clinical Guidance Advice */}
      <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">{categoryInfo.advice}</p>
      </div>
    </div>
  );
};
