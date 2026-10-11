import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { formatChartDate } from '../utils/dateUtils';

const CustomTooltip = ({ active, payload, label, sleepGoal }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-indigo-600 font-semibold">
          Sleep: <span className="text-slate-900">{val} Hours</span>
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {val >= 7 ? '🌙 Restorative Sleep' : '⚠️ Sub-optimal sleep'}
        </p>
      </div>
    );
  }
  return null;
};

export const SleepChart = ({ records = [], sleepGoal = 8.0 }) => {
  const chartData = [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: formatChartDate(r.date),
      sleep: parseFloat(r.sleepDuration) || 0
    }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 15, right: 20, left: -15, bottom: 5 }}>
          <defs>
            <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            domain={[4, 11]}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            unit="h"
          />
          <Tooltip content={<CustomTooltip sleepGoal={sleepGoal} />} />

          <ReferenceLine
            y={sleepGoal}
            stroke="#6366f1"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `Goal ${sleepGoal}h`,
              position: 'insideTopRight',
              fill: '#4f46e5',
              fontSize: 10,
              fontWeight: 600
            }}
          />

          <Area
            type="monotone"
            dataKey="sleep"
            stroke="#6366f1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#sleepGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
