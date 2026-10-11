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

const CustomTooltip = ({ active, payload, label, waterGoal }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-sky-600 font-semibold">
          Intake: <span className="text-slate-900">{val} Litres</span>
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {val >= waterGoal ? '💧 Target met!' : `💧 ${(waterGoal - val).toFixed(1)}L remaining`}
        </p>
      </div>
    );
  }
  return null;
};

export const WaterChart = ({ records = [], waterGoal = 2.5 }) => {
  const chartData = [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: formatChartDate(r.date),
      water: parseFloat(r.waterIntake) || 0
    }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 15, right: 20, left: -15, bottom: 5 }}>
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
            unit="L"
          />
          <Tooltip content={<CustomTooltip waterGoal={waterGoal} />} />

          <ReferenceLine
            y={waterGoal}
            stroke="#0284c7"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `Goal ${waterGoal}L`,
              position: 'insideTopRight',
              fill: '#0369a1',
              fontSize: 10,
              fontWeight: 600
            }}
          />

          <Bar dataKey="water" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {chartData.map((entry, index) => (
              <Cell
                key={`water-cell-${index}`}
                fill={entry.water >= waterGoal ? '#38bdf8' : '#7dd3fc'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
