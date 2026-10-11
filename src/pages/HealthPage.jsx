import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { useGoals } from '../context/GoalContext';
import { HealthForm } from '../components/HealthForm';
import { HealthHistoryTable } from '../components/HealthHistoryTable';
import { BMIWidget } from '../components/BMIWidget';
import { Activity, Plus, History } from 'lucide-react';

export const HealthPage = () => {
  const { healthRecords, todayRecord, saveRecord, deleteRecord } = useHealth();
  const { userProfile, updateUserProfile } = useGoals();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveHealth = async (formData) => {
    setIsSubmitting(true);
    await saveRecord(formData);
    setIsSubmitting(false);
  };

  const handleBMIWidgetChange = (newWeight, newHeight) => {
    if (newHeight && newHeight !== userProfile?.height) {
      updateUserProfile({ height: newHeight });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Activity className="w-7 h-7 text-teal-600" /> Daily Health Tracking
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Log daily weight, hydration, sleep, steps, and calories. Keep accurate records to power intelligent fitness recommendations.
        </p>
      </div>

      {/* Main Grid: Data Entry Form + BMI Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <HealthForm
            onSubmit={handleSaveHealth}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="lg:col-span-5">
          <BMIWidget
            initialWeight={todayRecord?.weight || userProfile?.currentWeight || 68.4}
            initialHeight={userProfile?.height || 170}
            onUpdate={handleBMIWidgetChange}
          />
        </div>
      </div>

      {/* Health History Table Section (Section 9) */}
      <div>
        <HealthHistoryTable
          records={healthRecords}
          onDeleteRecord={deleteRecord}
        />
      </div>
    </div>
  );
};
