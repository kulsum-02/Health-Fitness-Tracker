import React, { useState, useMemo } from 'react';
import { formatDisplayDate, formatFullDate, getTodayString, getNDaysAgoString } from '../utils/dateUtils';
import { getBMICategory } from '../utils/bmiCalculator';
import { exportHealthToCSV } from '../utils/exportUtils';
import { Filter, Download, Trash2, Calendar, Scale, Droplets, Moon, Footprints, Flame } from 'lucide-react';

export const HealthHistoryTable = ({ records = [], onDeleteRecord }) => {
  const [filter, setFilter] = useState('all'); // 'today', 'week', 'month', 'all'
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredRecords = useMemo(() => {
    let result = [...records];
    const today = getTodayString();

    if (filter === 'today') {
      result = result.filter((r) => r.date === today);
    } else if (filter === 'week') {
      const sevenDaysAgo = getNDaysAgoString(7);
      result = result.filter((r) => r.date >= sevenDaysAgo);
    } else if (filter === 'month') {
      const thirtyDaysAgo = getNDaysAgoString(30);
      result = result.filter((r) => r.date >= thirtyDaysAgo);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = (parseFloat(a[sortBy]) || 0) - (parseFloat(b[sortBy]) || 0);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [records, filter, sortBy, sortOrder]);

  const handleExport = () => {
    exportHealthToCSV(filteredRecords, `health_history_${filter}.csv`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header and Filter Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Health History Log</h3>
          <p className="text-xs text-slate-500">
            Showing {filteredRecords.length} recorded entries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('today')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                filter === 'today' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                filter === 'week' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                filter === 'month' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                filter === 'all' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records
            </button>
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Table Content */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          No health records found matching this timeframe filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Weight</th>
                <th className="py-3.5 px-4">Water</th>
                <th className="py-3.5 px-4">Sleep</th>
                <th className="py-3.5 px-4">Steps</th>
                <th className="py-3.5 px-4">Calories</th>
                <th className="py-3.5 px-4">BMI</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRecords.map((r) => {
                const bmiCategory = getBMICategory(r.bmi);
                return (
                  <tr key={r.healthId || r.date} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{formatDisplayDate(r.date)}</div>
                      <span className="text-[10px] text-slate-400">{r.date}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{r.weight}</span>{' '}
                      <span className="text-slate-400">kg</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{r.waterIntake}</span>{' '}
                      <span className="text-slate-400">L</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{r.sleepDuration}</span>{' '}
                      <span className="text-slate-400">hrs</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-800">
                      {Number(r.steps).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-800">
                      {Number(r.calories).toLocaleString()} <span className="text-slate-400 font-normal">kcal</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{r.bmi || '--'}</span>
                        {r.bmi && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${bmiCategory.bgClass}`}
                          >
                            {bmiCategory.category}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      {onDeleteRecord && (
                        <button
                          onClick={() => onDeleteRecord(r.healthId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
