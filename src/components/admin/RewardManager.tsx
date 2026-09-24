import React, { useState } from 'react';
import { store } from '../../services/store';
import { RewardCategory } from '../../types';
import { ShoppingBag, Plus, Gift, CheckCircle, Trash2, Coins, Sparkles } from 'lucide-react';

export const RewardManager: React.FC = () => {
  const rewards = store.getRewards();
  const redemptions = store.getRedemptions();
  const pendingRedemptions = redemptions.filter((r) => r.status === 'requested');
  const completedRedemptions = redemptions.filter((r) => r.status === 'completed');

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [costCoins, setCostCoins] = useState(50);
  const [icon, setIcon] = useState('🎁');
  const [category, setCategory] = useState<RewardCategory>('entertainment');

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    store.addReward({
      title,
      description,
      cost_coins: Number(costCoins),
      icon: icon || '🎁',
      category,
      is_active: true,
    });

    setTitle('');
    setDescription('');
    setCostCoins(50);
    setIcon('🎁');
    setShowAddModal(false);
  };

  const handleCompleteTraoQua = (redemptionId: string) => {
    store.completeRedemption(redemptionId);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            Cửa Hàng Quà & Duyệt Đổi Quà (Rewards Shop)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tạo quà tặng thực tế ngoài đời và duyệt khi trao quà thành công cho em.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm Phụ Thưởng Mới</span>
        </button>
      </div>

      {/* Pending Redemptions Section */}
      <div>
        <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Gift className="w-4 h-4" />
          Yêu Cầu Đổi Quà Đang Chờ Trao ({pendingRedemptions.length})
        </h3>

        {pendingRedemptions.length === 0 ? (
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60 text-center">
            <Sparkles className="w-10 h-10 text-purple-400/50 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Chưa có yêu cầu đổi quà nào cần xử lý!</p>
            <p className="text-xs text-slate-500 mt-1">Khi em đổi quà bằng Coin tích lũy, thông báo trao quà sẽ hiện ở đây.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRedemptions.map((red) => (
              <div
                key={red.id}
                className="bg-slate-800 p-5 rounded-2xl border border-pink-500/40 shadow-lg flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-3xl shadow-inner">
                    {red.reward?.icon || '🎁'}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                      Em vừa bấm Đổi Quà
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{red.reward?.title || 'Phần quà'}</h4>
                    <p className="text-xs text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Coins className="w-3.5 h-3.5" /> Đã trừ {red.reward?.cost_coins} Coin
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCompleteTraoQua(red.id)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 flex-shrink-0"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Xác Nhận Đã Trao Quà</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reward Catalog Management Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          Danh Sách Món Quà Trong Shop ({rewards.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 hover:border-purple-500/50 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {reward.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                    {reward.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{reward.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <span className="text-sm font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {reward.cost_coins} Coin
                </span>

                <button
                  onClick={() => {
                    if (confirm(`Bạn có chắc muốn xóa quà "${reward.title}"?`)) {
                      store.deleteReward(reward.id);
                    }
                  }}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Redemptions History */}
      {completedRedemptions.length > 0 && (
        <div className="pt-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Lịch Sử Quà Đã Trao ({completedRedemptions.length})
          </h3>
          <div className="space-y-2">
            {completedRedemptions.map((red) => (
              <div
                key={red.id}
                className="bg-slate-800/30 px-4 py-3 rounded-xl border border-slate-700/40 flex items-center justify-between text-xs text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <span>{red.reward?.icon || '🎁'}</span>
                  <span className="font-bold text-white">{red.reward?.title}</span>
                  <span className="text-slate-500">({red.reward?.cost_coins} coin)</span>
                </div>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Đã trao quà
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Reward */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 relative space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              Thêm Quà Tặng Mới Vào Shop
            </h3>

            <form onSubmit={handleCreateReward} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên món quà</label>
                <input
                  type="text"
                  required
                  placeholder="Vd: 30 Phút chơi Game, 1 Ly Trà Sữa..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô tả ngắn</label>
                <input
                  type="text"
                  placeholder="Vd: Thư giãn thoải mái sau giờ học..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">Giá Coin quy đổi</label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={costCoins}
                    onChange={(e) => setCostCoins(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Emoji Biểu Tượng</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="🎮, 🧋, 🍿, 📚..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Loại phần quà</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RewardCategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="entertainment">🎮 Giải trí / Game</option>
                  <option value="food">🧋 Đồ ăn / Thức uống</option>
                  <option value="activity">🍿 Hoạt động vui chơi</option>
                  <option value="special">✨ Quà đặc biệt</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
                >
                  Thêm Quà Vào Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
