import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentMobileApp } from './components/student/StudentMobileApp';
import { store } from './services/store';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'admin' | 'student'>('admin');
  const [, setTick] = useState(0);

  // Subscribe to store updates to trigger re-renders reactively
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      <div>
        {/* Persistent Top Navigation Bar */}
        <Header currentView={currentView} onToggleView={setCurrentView} />

        {/* Main Workspace Area */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {currentView === 'admin' ? (
            <AdminDashboard />
          ) : (
            <StudentMobileApp />
          )}
        </main>
      </div>

      {/* Footer Info */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            🚀 <strong>App Học Bài Đổi Điểm</strong> - Đã sẵn sàng chạy offline LocalStorage & tích hợp Supabase backend (<code className="text-indigo-400">schema.sql</code>).
          </p>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">Giao diện đôi: Web Admin & Mobile App</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
