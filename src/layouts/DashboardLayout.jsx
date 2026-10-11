import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { ToastContainer } from '../components/ToastContainer';
import { Modal } from '../components/Modal';
import { HealthForm } from '../components/HealthForm';
import { useHealth } from '../context/HealthContext';
import { X } from 'lucide-react';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const { saveRecord } = useHealth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveHealth = async (formData) => {
    setIsSubmitting(true);
    const res = await saveRecord(formData);
    setIsSubmitting(false);
    if (res.success) {
      setLogModalOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-50 animate-in slide-in-from-left">
            <div className="absolute top-2 right-2 p-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenLogModal={() => setLogModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Quick Log Modal */}
      <Modal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        title="Quick Log Daily Health Metrics"
      >
        <HealthForm
          onSubmit={handleSaveHealth}
          onCancel={() => setLogModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Floating Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
