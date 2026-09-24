import React from 'react';
import { store } from '../../services/store';
import { getLevelInfo } from '../../types';
import { Flame, Trophy, CheckCircle2, History } from 'lucide-react';

export const GamificationProfile: React.FC = () => {
  const student = store.getStudent();
  const levelInfo = getLevelInfo(student.total_xp);
  const submissions = store.getSubmissions();
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved');

  return (
    <div className="space-y-4">
      {/* Flame Streak Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 p-5 rounded-3xl text-white shadow-xl">
        <div className="absolute -right-4 -bottom-4 opacity-20 text-8xl pointer-events-none">🔥</div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-200">
              Giữ Lửa Chuỗi Học Tập
            </span>
            <h3 className="text-3xl font-black mt-0.5 flex items-center gap-2">
              {student.current_streak} Ngày Streak
              <Flame className="w-8 h-8 fill-amber-300 text-amber-300 animate-bounce" />
            </h3>
            <p className="text-xs text-orange-100 mt-1 font-medium">
              Hoàn thành bài tập mỗi ngày để không bị tắt lửa giống Duolingo!
            </p>
          </div>
        </div>
      </div>

      {/* Level & XP Progression Card */}
      <div className="bg-slate-800 p-5 rounded-3xl border border-indigo-500/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{levelInfo.badgeEmoji}</span>
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Cấp Độ Hiện Tại</span>
              <h4 className="text-base font-extrabold text-white">
                Cấp {levelInfo.level}: {levelInfo.title}
              </h4>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
            {student.total_xp} / {levelInfo.nextLevelXP} XP
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
            <span>Tiến độ lên Cấp {levelInfo.level + 1}</span>
            <span>{levelInfo.progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Badges Overview Grid */}
      <div className="bg-slate-800 p-4 rounded-3xl border border-slate-700 space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" /> Huy Hiệu Danh Dự
        </h4>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-700/80 flex flex-col items-center">
            <span className="text-2xl mb-1">🌱</span>
            <span className="text-xs font-bold text-white">Tập Sự</span>
            <span className="text-[10px] text-emerald-400 mt-0.5">Đã đạt</span>
          </div>

          <div className={`bg-slate-900/80 p-3 rounded-2xl border flex flex-col items-center ${student.total_xp >= 100 ? 'border-indigo-500/50' : 'border-slate-800 opacity-50'}`}>
            <span className="text-2xl mb-1">🧭</span>
            <span className="text-xs font-bold text-white">Thám Hiểm</span>
            <span className="text-[10px] text-indigo-400 mt-0.5">
              {student.total_xp >= 100 ? 'Đã đạt' : 'Khóa'}
            </span>
          </div>

          <div className={`bg-slate-900/80 p-3 rounded-2xl border flex flex-col items-center ${student.total_xp >= 300 ? 'border-purple-500/50' : 'border-slate-800 opacity-50'}`}>
            <span className="text-2xl mb-1">⚔️</span>
            <span className="text-xs font-bold text-white">Dũng Sĩ</span>
            <span className="text-[10px] text-purple-400 mt-0.5">
              {student.total_xp >= 300 ? 'Đã đạt' : 'Khóa'}
            </span>
          </div>
        </div>
      </div>

      {/* Approved Quests History */}
      <div className="bg-slate-800/50 p-4 rounded-3xl border border-slate-700/60 space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <History className="w-4 h-4" /> Lịch Sử Bài Tập Đã Hoàn Thành ({approvedSubmissions.length})
        </h4>

        {approvedSubmissions.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-3">Chưa có bài tập nào được duyệt hoàn thành.</p>
        ) : (
          <div className="space-y-2">
            {approvedSubmissions.map((sub) => (
              <div key={sub.id} className="bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-bold text-white truncate">{sub.quest?.title}</span>
                </div>
                <span className="text-amber-400 font-bold flex-shrink-0">+{sub.quest?.reward_coins} Coin</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
