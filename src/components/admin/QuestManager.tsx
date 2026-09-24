import React, { useState } from 'react';
import { QuestCategory, RecurringOption } from '../../types';
import { store } from '../../services/store';
import { Plus, Trash2, Coins, Award, CheckCircle, Camera, Repeat, BookOpen } from 'lucide-react';

export const QuestManager: React.FC = () => {
  const quests = store.getQuests();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rewardCoins, setRewardCoins] = useState(25);
  const [rewardXP, setRewardXP] = useState(40);
  const [category, setCategory] = useState<QuestCategory>('toan');
  const [requireProof, setRequireProof] = useState(true);
  const [isRecurring, setIsRecurring] = useState<RecurringOption>('daily');

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    store.addQuest({
      title,
      description,
      reward_coins: Number(rewardCoins),
      reward_xp: Number(rewardXP),
      category,
      require_proof: requireProof,
      is_recurring: isRecurring,
      due_date: new Date(Date.now() + 86400000).toISOString(),
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setRewardCoins(25);
    setRewardXP(40);
    setShowAddModal(false);
  };

  const getCategoryBadge = (cat: QuestCategory) => {
    switch (cat) {
      case 'toan':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">📐 Toán</span>;
      case 'van':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">📚 Ngữ Văn</span>;
      case 'anh':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">🔤 Tiếng Anh</span>;
      case 'viec_nha':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">🧹 Việc Nhà</span>;
      default:
        return <span className="bg-slate-500/20 text-slate-400 border border-slate-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">✨ Khác</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Quản Lý Nhiệm Vụ Học Tập (Quests)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tạo task nhanh cho em út, giao số coin thưởng và chọn có yêu cầu chụp ảnh làm chứng hay không.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo Nhiệm Vụ Mới</span>
        </button>
      </div>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="bg-slate-800/60 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700/80 transition-all hover:border-indigo-500/50 flex flex-col justify-between gap-4 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                {getCategoryBadge(quest.category)}
                <div className="flex items-center gap-2">
                  {quest.require_proof ? (
                    <span className="flex items-center gap-1 text-[11px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20 font-medium">
                      <Camera className="w-3 h-3" /> Chụp ảnh proof
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-medium">
                      <CheckCircle className="w-3 h-3" /> Tự động xong
                    </span>
                  )}
                  {quest.is_recurring !== 'none' && (
                    <span className="flex items-center gap-1 text-[11px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20 font-medium">
                      <Repeat className="w-3 h-3" /> Lặp {quest.is_recurring === 'daily' ? 'mỗi ngày' : 'hàng tuần'}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                {quest.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {quest.description || 'Không có mô tả chi tiết'}
              </p>
            </div>

            {/* Bottom Rewards & Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  <Coins className="w-4 h-4 text-amber-400" />
                  +{quest.reward_coins} Coin
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">
                  <Award className="w-3.5 h-3.5" />
                  +{quest.reward_xp} XP
                </span>
              </div>

              <button
                onClick={() => {
                  if (confirm(`Bạn có chắc muốn xóa nhiệm vụ "${quest.title}"?`)) {
                    store.deleteQuest(quest.id);
                  }
                }}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Xóa nhiệm vụ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Creating Quest */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Tạo Nhiệm Vụ Mới Cho Em Út
            </h3>

            <form onSubmit={handleCreateQuest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên nhiệm vụ / Tên bài tập <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Vd: Giải 5 bài Toán SGK Trang 45..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mô tả / Hướng dẫn cách làm
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú thêm cho em về trang sách, yêu cầu làm cẩn thận..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> Coin Thưởng
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    value={rewardCoins}
                    onChange={(e) => setRewardCoins(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-indigo-400 mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Điểm Kinh Nghiệm (XP)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={rewardXP}
                    onChange={(e) => setRewardXP(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Môn học / Phân loại</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as QuestCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="toan">📐 Toán học</option>
                    <option value="van">📚 Ngữ Văn</option>
                    <option value="anh">🔤 Tiếng Anh</option>
                    <option value="viec_nha">🧹 Việc nhà</option>
                    <option value="khac">✨ Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tần suất lặp lại</label>
                  <select
                    value={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.value as RecurringOption)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="none">Không lặp lại</option>
                    <option value="daily">Lặp lại mỗi ngày</option>
                    <option value="weekly">Lặp lại hàng tuần</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-700/80">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-pink-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">Bắt buộc chụp ảnh xác nhận (Proof)</p>
                    <p className="text-[10px] text-slate-400">Em phải chụp hình vở bài tập để bạn duyệt mới nhận điểm</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={requireProof}
                  onChange={(e) => setRequireProof(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Tạo Nhiệm Vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
