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

const CustomTooltip = ({ active, payload, label, stepGoal = 10000 }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value || 0;
    const hit = val >= stepGoal;
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-teal-600 font-semibold">
          Steps: <span className="text-slate-900">{Number(val).toLocaleString()}</span>
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {hit ? '🎯 Goal achieved!' : `🏃 ${Number(Math.max(0, stepGoal - val)).toLocaleString()} to goal`}
        </p>
      </div>
    );
  }
  return null;
};

export const StepsChart = ({ records = [], stepGoal = 10000 }) => {
  const chartData = [...(records || [])]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: formatChartDate(r.date),
      steps: Number(r.steps) || 0
    }));

  const safeGoal = Number(stepGoal || 10000);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
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
            tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip stepGoal={safeGoal} />} />

          <ReferenceLine
            y={safeGoal}
            stroke="#0d9488"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `Goal ${safeGoal.toLocaleString()}`,
              position: 'insideTopRight',
              fill: '#0f766e',
              fontSize: 10,
              fontWeight: 600
            }}
          />

          <Bar dataKey="steps" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.steps >= safeGoal ? '#10b981' : '#14b8a6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
