import React, { useState } from 'react';
import { store } from '../../services/store';
import { QuestManager } from './QuestManager';
import { SubmissionApprovals } from './SubmissionApprovals';
import { RewardManager } from './RewardManager';
import { Camera, BookOpen, Gift, Flame, Coins } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'quests' | 'rewards'>('approvals');

  const submissions = store.getSubmissions();
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const redemptions = store.getRedemptions();
  const pendingRedemptions = redemptions.filter((r) => r.status === 'requested');
  const quests = store.getQuests();
  const student = store.getStudent();

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Approvals */}
        <div
          onClick={() => setActiveTab('approvals')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'approvals'
              ? 'bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border-indigo-500 shadow-xl ring-2 ring-indigo-500/30'
              : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Chờ Duyệt Bài</span>
            <Camera className="w-5 h-5 text-pink-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{pendingSubmissions.length}</span>
            {pendingSubmissions.length > 0 && (
              <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full animate-bounce">
                Cần duyệt ngay!
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ảnh bài tập em nộp cần duyệt</p>
        </div>

        {/* Card 2: Pending Redemptions */}
        <div
          onClick={() => setActiveTab('rewards')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'rewards'
              ? 'bg-gradient-to-br from-purple-900/60 to-pink-900/40 border-purple-500 shadow-xl ring-2 ring-purple-500/30'
              : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Chờ Trao Quà</span>
            <Gift className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{pendingRedemptions.length}</span>
            {pendingRedemptions.length > 0 && (
              <span className="text-xs font-bold text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-full">
                Em vừa đổi quà
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Quà em đổi cần trao ngoài đời</p>
        </div>

        {/* Card 3: Active Quests */}
        <div
          onClick={() => setActiveTab('quests')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'quests'
              ? 'bg-gradient-to-br from-blue-900/60 to-cyan-900/40 border-blue-500 shadow-xl ring-2 ring-blue-500/30'
              : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Nhiệm Vụ Active</span>
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{quests.length}</span>
            <span className="text-xs text-slate-400">Tạo mới dễ dàng</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Danh sách bài tập cho em</p>
        </div>

        {/* Card 4: Student Balance Summary */}
        <div className="p-5 rounded-2xl border bg-slate-800/80 border-slate-700/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Tài Khoản Em Út</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-amber-400">{student.balance_coins}</span>
              <span className="text-xs font-bold text-amber-300">Coin</span>
            </div>
            <div className="flex items-center gap-1 text-orange-400 font-bold text-xs bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>{student.current_streak} Ngày</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tổng điểm tích lũy: {student.total_xp} XP</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex-shrink-0 ${
            activeTab === 'approvals'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>1. Duyệt Bài Tập (Proof)</span>
          {pendingSubmissions.length > 0 && (
            <span className="ml-1 bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {pendingSubmissions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('quests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex-shrink-0 ${
            activeTab === 'quests'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Quản Lý Nhiệm Vụ</span>
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex-shrink-0 ${
            activeTab === 'rewards'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>3. Duyệt Trao Quà & Shop</span>
          {pendingRedemptions.length > 0 && (
            <span className="ml-1 bg-pink-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {pendingRedemptions.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="mt-4">
        {activeTab === 'approvals' && <SubmissionApprovals />}
        {activeTab === 'quests' && <QuestManager />}
        {activeTab === 'rewards' && <RewardManager />}
      </div>
    </div>
  );
};
