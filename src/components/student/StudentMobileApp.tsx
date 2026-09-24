import React, { useState } from 'react';
import { store } from '../../services/store';
import { QuestList } from './QuestList';
import { StudentShop } from './StudentShop';
import { GamificationProfile } from './GamificationProfile';
import { getLevelInfo } from '../../types';
import { BookOpen, Gift, Trophy, Flame, Coins } from 'lucide-react';

export const StudentMobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quests' | 'shop' | 'profile'>('quests');

  const student = store.getStudent();
  const levelInfo = getLevelInfo(student.total_xp);
  const submissions = store.getSubmissions();
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="flex items-center justify-center min-h-[85vh] py-2">
      {/* Mobile Phone Mockup Frame Container */}
      <div className="w-full max-w-md bg-slate-950 rounded-[40px] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[750px] relative">
        {/* Smartphone Camera Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-b-xl z-50 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800" />
        </div>

        {/* Mobile Header Bar */}
        <div className="bg-slate-900 pt-7 pb-4 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar_url}
              alt="Student Avatar"
              className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white">{student.name}</span>
                <span className="text-[10px]">{levelInfo.badgeEmoji}</span>
              </div>
              <p className="text-[11px] text-indigo-400 font-semibold">
                Lv.{levelInfo.level} - {levelInfo.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak */}
            <div className="flex items-center gap-1 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 text-orange-400 font-bold text-xs">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>{student.current_streak}</span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 text-amber-400 font-bold text-xs">
              <Coins className="w-3.5 h-3.5" />
              <span>{student.balance_coins}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {activeTab === 'quests' && <QuestList />}
          {activeTab === 'shop' && <StudentShop />}
          {activeTab === 'profile' && <GamificationProfile />}
        </div>

        {/* Smartphone Bottom Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-6 py-2.5 flex items-center justify-around z-40">
          <button
            onClick={() => setActiveTab('quests')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'quests' ? 'text-emerald-400 scale-105 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <BookOpen className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <span className="text-[10px]">Nhiệm Vụ</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'shop' ? 'text-purple-400 scale-105 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span className="text-[10px]">Cửa Hàng</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'profile' ? 'text-amber-400 scale-105 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px]">Thành Tích</span>
          </button>
        </div>
      </div>
    </div>
  );
};
