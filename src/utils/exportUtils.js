/**
 * Export and Report Download Utilities
 */

export const exportHealthToCSV = (records, filename = 'fitpulse_health_history.csv') => {
  if (!records || records.length === 0) {
    alert('No records available to export.');
    return;
  }

  const headers = ['Date', 'Weight (kg)', 'Water (L)', 'Sleep (hrs)', 'Steps', 'Calories (kcal)', 'BMI'];
  const rows = records.map(r => [
    r.date,
    r.weight,
    r.waterIntake,
    r.sleepDuration,
    r.steps,
    r.calories,
    r.bmi || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadReportText = (report, filename = 'fitpulse_health_report.txt') => {
  if (!report) return;

  const content = `
======================================================
FITPULSE PRO — ${report.type.toUpperCase()} HEALTH & PROGRESS REPORT
Generated: ${new Date().toLocaleString()}
User: ${report.user?.name || 'Member'}
======================================================

1. EXECUTIVE SUMMARY
------------------------------------------------------
Period: ${report.period}
Starting Weight: ${report.metrics.startWeight} kg
Current Weight: ${report.metrics.currentWeight} kg (Change: ${report.metrics.weightChange > 0 ? '+' : ''}${report.metrics.weightChange} kg)
Target Weight: ${report.metrics.targetWeight} kg
Current BMI: ${report.metrics.currentBMI} (${report.metrics.bmiCategory})
Overall Goal Adherence: ${report.metrics.overallAdherence}%

2. DAILY AVERAGES
------------------------------------------------------
Average Daily Steps: ${report.metrics.avgSteps.toLocaleString()} steps / day (Goal: ${report.goals?.stepGoal.toLocaleString()})
Average Water Intake: ${report.metrics.avgWater} L / day (Goal: ${report.goals?.waterGoal} L)
Average Sleep: ${report.metrics.avgSleep} hrs / night (Goal: ${report.goals?.sleepGoal} hrs)
Average Daily Calories: ${report.metrics.avgCalories} kcal / day (Goal: ${report.goals?.calorieGoal} kcal)

3. KEY ACHIEVEMENTS
------------------------------------------------------
${report.achievements.map((a, i) => `${i + 1}. [${a.unlocked ? 'COMPLETED' : 'IN PROGRESS'}] ${a.title}: ${a.description}`).join('\n')}

4. AREAS NEEDING ATTENTION
------------------------------------------------------
${report.areasForImprovement.map((area, i) => `${i + 1}. ${area}`).join('\n')}

5. ACTIONABLE RECOMMENDATIONS
------------------------------------------------------
${report.recommendations.map((rec, i) => `${i + 1}. [${rec.category}] ${rec.title}: ${rec.advice}`).join('\n')}

======================================================
FitPulse Pro Health Management System
======================================================
`;

  const blob = new Blob([content.trim()], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const triggerPrintReport = () => {
  window.print();
};
