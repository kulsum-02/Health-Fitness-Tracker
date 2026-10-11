import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell
} from 'recharts';
import { formatChartDate } from '../utils/dateUtils';

const CustomTooltip = ({ active, payload, label, calorieGoal }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const diff = val - calorieGoal;
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-rose-600 font-semibold">
          Intake: <span className="text-slate-900">{val.toLocaleString()} kcal</span>
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {diff <= 0 ? `🥗 ${Math.abs(diff)} kcal under budget` : `⚠️ ${diff} kcal over budget`}
        </p>
      </div>
    );
  }
  return null;
};

export const CalorieChart = ({ records = [], calorieGoal = 2200 }) => {
  const chartData = [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: formatChartDate(r.date),
      calories: Number(r.calories) || 0
    }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 15, right: 20, left: -5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip calorieGoal={calorieGoal} />} />

          <ReferenceLine
            y={calorieGoal}
            stroke="#f43f5e"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `Budget ${calorieGoal} kcal`,
              position: 'insideTopRight',
              fill: '#e11d48',
              fontSize: 10,
              fontWeight: 600
            }}
          />

          <Bar dataKey="calories" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {chartData.map((entry, index) => {
              const diffRatio = Math.abs(entry.calories - calorieGoal) / calorieGoal;
              const isGood = diffRatio <= 0.15;
              return (
                <Cell
                  key={`cal-cell-${index}`}
                  fill={isGood ? '#f43f5e' : '#fb7185'}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
