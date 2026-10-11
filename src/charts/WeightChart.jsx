import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { formatChartDate } from '../utils/dateUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-teal-600 font-semibold">
          Weight: <span className="text-slate-900">{payload[0].value} kg</span>
        </p>
      </div>
    );
  }
  return null;
};

export const WeightChart = ({ records = [], targetWeight = 65.0, startWeight = 72.0 }) => {
  const chartData = [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: formatChartDate(r.date),
      weight: parseFloat(r.weight)
    }));

  const weights = chartData.map((d) => d.weight).filter(Boolean);
  const minVal = Math.floor(Math.min(...weights, targetWeight, startWeight) - 1);
  const maxVal = Math.ceil(Math.max(...weights, targetWeight, startWeight) + 1);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            domain={[minVal, maxVal]}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            unit="kg"
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Reference Lines for Target and Start Weight */}
          <ReferenceLine
            y={targetWeight}
            stroke="#10b981"
            strokeDasharray="5 5"
            strokeWidth={1.5}
            label={{
              value: `Goal ${targetWeight}kg`,
              position: 'insideBottomRight',
              fill: '#059669',
              fontSize: 10,
              fontWeight: 600
            }}
          />
          <ReferenceLine
            y={startWeight}
            stroke="#94a3b8"
            strokeDasharray="3 3"
            strokeWidth={1}
            label={{
              value: `Start ${startWeight}kg`,
              position: 'insideTopRight',
              fill: '#64748b',
              fontSize: 10
            }}
          />

          <Line
            type="monotone"
            dataKey="weight"
            stroke="#0d9488"
            strokeWidth={3}
            dot={{ r: 4, fill: '#0d9488', stroke: '#ffffff', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#0f766e', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
