import React, { useState } from 'react';
import { store } from '../../services/store';
import { Reward } from '../../types';
import confetti from 'canvas-confetti';
import { Coins, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export const StudentShop: React.FC = () => {
  const student = store.getStudent();
  const rewards = store.getRewards();
  const redemptions = store.getRedemptions();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRedeem = (reward: Reward) => {
    const res = store.requestRedemption(reward.id);
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      // Confetti celebration!
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ec4899', '#a855f7', '#eab308'],
      });
    } else {
      setMessage({ type: 'error', text: res.message });
    }

    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Coin Balance Banner */}
      <div className="bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-slate-900 p-4 rounded-2xl border border-purple-500/30 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Cửa Hàng Đổi Quà</span>
          <h3 className="text-lg font-extrabold text-white">Đổi Coin Lấy Quà Thật! 🎁</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/40 text-amber-300 font-extrabold text-sm">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{student.balance_coins} Coin</span>
        </div>
      </div>

      {/* Alert Message Toast */}
      {message && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            message.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rewards.map((reward) => {
          const canAfford = student.balance_coins >= reward.cost_coins;

          return (
            <div
              key={reward.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                canAfford
                  ? 'bg-slate-800 border-purple-500/30 hover:border-purple-500'
                  : 'bg-slate-800/40 border-slate-700/60 opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                  {reward.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white truncate">{reward.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{reward.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  <Coins className="w-3.5 h-3.5" /> {reward.cost_coins} Coin
                </span>

                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    canAfford
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-600/20 hover:scale-[1.03] active:scale-95'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Đổi Quà
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Chưa đủ coin
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Requested Redemptions List */}
      {redemptions.length > 0 && (
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Phần Quà Đã Yêu Cầu Đổi ({redemptions.length})
          </h4>
          <div className="space-y-2">
            {redemptions.map((red) => (
              <div
                key={red.id}
                className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span>{red.reward?.icon || '🎁'}</span>
                  <span className="font-bold text-white">{red.reward?.title}</span>
                </div>

                {red.status === 'requested' ? (
                  <span className="text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    Chờ anh trao quà
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Đã nhận quà
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
