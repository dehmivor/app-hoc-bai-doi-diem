import React from 'react';
import { getLevelInfo } from '../../types';
import { store } from '../../services/store';
import { Flame, Coins, Smartphone, Monitor, RotateCcw, Award } from 'lucide-react';

interface HeaderProps {
  currentView: 'admin' | 'student';
  onToggleView: (view: 'admin' | 'student') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onToggleView }) => {
  const student = store.getStudent();
  const levelInfo = getLevelInfo(student.total_xp);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-500/20">
            🎓
          </div>
          <div>
            <h1 className="text-lg font-extrabold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Học Bài Đổi Điểm
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Web Admin cho Anh/Chị & Mobile App cho Em
            </p>
          </div>
        </div>

        {/* Gamification Stats Quick Bar */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60 shadow-inner">
          {/* Coins */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-sm border border-amber-500/20">
            <Coins className="w-4 h-4 text-amber-400 animate-pulse-glow" />
            <span>{student.balance_coins}</span>
            <span className="text-[10px] uppercase tracking-wider text-amber-300 font-extrabold">Coin</span>
          </div>

          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-bold text-sm border border-orange-500/20">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce-short" />
            <span>{student.current_streak}</span>
            <span className="text-[10px] text-orange-300">Ngày</span>
          </div>

          {/* Level Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold text-xs border border-indigo-500/20">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Lv.{levelInfo.level} {levelInfo.badgeEmoji}</span>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700">
            <button
              onClick={() => onToggleView('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Web Admin (Anh/Chị)</span>
            </button>

            <button
              onClick={() => onToggleView('student')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'student'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>App Em Út</span>
            </button>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (confirm('Bạn có muốn khôi phục dữ liệu mẫu ban đầu?')) {
                store.resetToDemoData();
              }
            }}
            title="Khôi phục dữ liệu mẫu ban đầu"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
