import React, { useState, useMemo } from 'react';
import { useHealth } from '../context/HealthContext';
import { useGoals } from '../context/GoalContext';
import { reportService } from '../services/reportService';
import { exportHealthToCSV, downloadReportText, triggerPrintReport } from '../utils/exportUtils';
import { WeeklyPerformanceChart } from '../charts/WeeklyPerformanceChart';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Award,
  Zap,
  Calendar
} from 'lucide-react';

export const ReportsPage = () => {
  const { healthRecords, todayRecord } = useHealth();
  const { goals, userProfile } = useGoals();
  const [reportType, setReportType] = useState('weekly'); // 'weekly' or 'monthly'
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportTimestamp, setReportTimestamp] = useState(new Date().toLocaleTimeString());

  // Generate the active report
  const report = useMemo(() => {
    return reportService.generateReport({
      type: reportType,
      healthRecords,
      goals,
      user: userProfile
    });
  }, [reportType, healthRecords, goals, userProfile, reportTimestamp]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setReportTimestamp(new Date().toLocaleTimeString());
      setIsGenerating(false);
    }, 400);
  };

  const handleDownloadText = () => {
    downloadReportText(report, `fitpulse_${reportType}_report_${Date.now()}.txt`);
  };

  const handleDownloadCSV = () => {
    exportHealthToCSV(report.records, `fitpulse_${reportType}_data.csv`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-teal-600" /> Clinical & Performance Reports
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated health data analysis, progress audits, and clinical action plans.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setReportType('weekly')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition ${
                reportType === 'weekly' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Weekly Report
            </button>
            <button
              onClick={() => setReportType('monthly')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition ${
                reportType === 'monthly' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Monthly Report
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate Report</span>
          </button>

          {/* Download Text Report */}
          <button
            onClick={handleDownloadText}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>

          {/* Print / Save PDF */}
          <button
            onClick={triggerPrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Report Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                FitPulse Pro Certified Audit
              </span>
              <span className="text-xs text-slate-400">Ref: #{reportType.toUpperCase()}-{Date.now().toString().slice(-6)}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {reportType === 'weekly' ? 'Weekly Biometric & Goal Progress Report' : 'Monthly Performance & Trend Report'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>{report.period}</span>
              <span>• Generated at {reportTimestamp}</span>
            </p>
          </div>

          <div className="sm:text-right">
            <h4 className="text-sm font-bold text-slate-800">{report.user.name}</h4>
            <p className="text-xs text-slate-500">Height: {report.user.height} cm</p>
            <span className="inline-block mt-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded capitalize">
              Target: {report.user.goalType.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* 1. Executive Summary Metrics */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            1. Executive Key Performance Indicators
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Weight Delta</span>
              <div className="text-lg font-extrabold text-slate-900 mt-1">
                {report.metrics.weightChange > 0 ? `+${report.metrics.weightChange}` : report.metrics.weightChange} kg
              </div>
              <span className="text-[10px] text-slate-400">{report.metrics.startWeight}kg → {report.metrics.currentWeight}kg</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Clinical BMI</span>
              <div className="text-lg font-extrabold text-slate-900 mt-1">
                {report.metrics.currentBMI}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">{report.metrics.bmiCategory}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Average Steps</span>
              <div className="text-lg font-extrabold text-slate-900 mt-1">
                {report.metrics.avgSteps.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">{report.metrics.stepAdherence}% adherence</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Average Water</span>
              <div className="text-lg font-extrabold text-slate-900 mt-1">
                {report.metrics.avgWater} L
              </div>
              <span className="text-[10px] text-slate-400">{report.metrics.waterAdherence}% adherence</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Average Sleep</span>
              <div className="text-lg font-extrabold text-slate-900 mt-1">
                {report.metrics.avgSleep} hrs
              </div>
              <span className="text-[10px] text-slate-400">{report.metrics.sleepAdherence}% adherence</span>
            </div>

            <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-100">
              <span className="text-[11px] text-teal-800 font-bold">Goal Completion</span>
              <div className="text-lg font-extrabold text-teal-800 mt-1">
                {report.metrics.overallAdherence}%
              </div>
              <span className="text-[10px] text-teal-600 font-semibold">Composite score</span>
            </div>
          </div>
        </div>

        {/* 2. Embedded Trend Chart */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            2. Trajectory Visual Analysis
          </h4>
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <WeeklyPerformanceChart records={report.records} />
          </div>
        </div>

        {/* 3. Achievements & Areas For Improvement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Achievements */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-500" /> 3. Key Achievements & Milestones
            </h4>
            <div className="space-y-2.5">
              {report.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <CheckCircle className={`w-4 h-4 mt-0.5 ${ach.unlocked ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <div>
                    <span className="font-bold text-slate-800">{ach.title}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Areas Needing Improvement */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> 4. Areas Needing Attention
            </h4>
            <div className="space-y-2.5">
              {report.areasForImprovement.map((area, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <p className="leading-relaxed">{area}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Actionable Next Steps & Recommendations */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            5. Recommended Clinical & Behavioral Adjustments
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-teal-50/30 border border-teal-100 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">
                    {rec.category}
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 mt-0.5">{rec.title}</h5>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rec.advice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>FitPulse Pro Health Management System — Person 3 Module</span>
          <span>Validated for Node.js + Express.js + MongoDB API integration</span>
        </div>
      </div>
    </div>
  );
};
