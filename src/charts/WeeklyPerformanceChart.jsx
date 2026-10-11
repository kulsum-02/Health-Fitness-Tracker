import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatChartDate } from '../utils/dateUtils';

export const WeeklyPerformanceChart = ({ records = [] }) => {
  const chartData = [...records]
    .slice(-7)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: formatChartDate(r.date),
      steps: Number(r.steps) || 0,
      weight: parseFloat(r.weight) || 0,
      water: parseFloat(r.waterIntake) || 0
    }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={['dataMin - 1', 'dataMax + 1']}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            unit="kg"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

          <Bar
            yAxisId="left"
            dataKey="steps"
            name="Steps"
            fill="#14b8a6"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="weight"
            name="Weight (kg)"
            stroke="#0f766e"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#0f766e' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
