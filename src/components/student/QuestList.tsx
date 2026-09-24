import React, { useState } from 'react';
import { store } from '../../services/store';
import { Quest } from '../../types';
import { Camera, CheckCircle2, Clock, Coins, Sparkles } from 'lucide-react';

export const QuestList: React.FC = () => {
  const quests = store.getQuests();
  const submissions = store.getSubmissions();

  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Helper to check submission status for a quest
  const getQuestStatus = (questId: string) => {
    const sub = submissions.find((s) => s.quest_id === questId);
    if (!sub) return { status: 'todo', submission: null };
    return { status: sub.status, submission: sub };
  };

  const handleOpenSubmitModal = (quest: Quest) => {
    setSelectedQuest(quest);
    // Preset demo proof image options for easy instant testing
    const demoProofs = [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80'
    ];
    setProofImageUrl(demoProofs[Math.floor(Math.random() * demoProofs.length)]);
    setNote('');
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuest) return;

    store.submitQuest(selectedQuest.id, proofImageUrl, note);
    setSelectedQuest(null);
  };

  const filteredQuests = quests.filter((q) => {
    const { status } = getQuestStatus(q.id);
    if (filter === 'pending') return status === 'pending';
    if (filter === 'completed') return status === 'approved';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-emerald-500 text-slate-900 shadow-md shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Tất Cả ({quests.length})
        </button>

        <button
          onClick={() => setFilter('pending')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filter === 'pending'
              ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Chờ Anh Duyệt
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filter === 'completed'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Đã Xong ✨
        </button>
      </div>

      {/* Quest List */}
      <div className="space-y-3">
        {filteredQuests.map((quest) => {
          const { status, submission } = getQuestStatus(quest.id);

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-2xl border transition-all ${
                status === 'approved'
                  ? 'bg-slate-800/40 border-slate-700/60 opacity-85'
                  : status === 'pending'
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-md'
                  : 'bg-slate-800 border-slate-700 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {quest.category === 'toan'
                        ? '📐 Toán'
                        : quest.category === 'van'
                        ? '📚 Văn'
                        : quest.category === 'anh'
                        ? '🔤 Anh'
                        : quest.category === 'viec_nha'
                        ? '🧹 Việc nhà'
                        : '✨ Khác'}
                    </span>

                    {status === 'approved' && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành
                      </span>
                    )}

                    {status === 'pending' && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3" /> Chờ anh duyệt
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white">{quest.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{quest.description}</p>
                </div>

                {/* Rewards Badge */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> +{quest.reward_coins}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400 mt-1">
                    +{quest.reward_xp} XP
                  </span>
                </div>
              </div>

              {/* Status Note or Action Button */}
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                {status === 'approved' ? (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Thưởng +{quest.reward_coins} Coin & +{quest.reward_xp} XP!
                  </p>
                ) : status === 'pending' ? (
                  <p className="text-xs text-amber-300 font-medium italic">
                    Đã gửi ảnh bài tập. Đang chờ anh xem bài...
                  </p>
                ) : status === 'rejected' ? (
                  <div className="w-full flex items-center justify-between gap-2">
                    <p className="text-xs text-red-400 font-medium">
                      Bị từ chối: {submission?.admin_note || 'Kiểm tra lại bài'}
                    </p>
                    <button
                      onClick={() => handleOpenSubmitModal(quest)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-all"
                    >
                      Nộp lại bài
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenSubmitModal(quest)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{quest.require_proof ? 'Mở Camera Chụp Ảnh Bài Nộp' : 'Bấm Xong Bài Tập'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Submit Proof */}
      {selectedQuest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" /> Nộp Bài Tập Làm Chứng
              </h3>
              <button onClick={() => setSelectedQuest(null)} className="text-slate-400 text-xs font-bold">
                ✕ Đóng
              </button>
            </div>

            <p className="text-xs text-slate-300 font-medium">{selectedQuest.title}</p>

            {/* Proof Image Simulation / Custom URL Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">Ảnh chụp bài làm (Proof):</label>
              <div className="relative w-full h-44 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 overflow-hidden flex flex-col items-center justify-center text-center p-2 group">
                {proofImageUrl ? (
                  <>
                    <img src={proofImageUrl} alt="Proof preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setProofImageUrl('')}
                      className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md"
                    >
                      Đổi ảnh
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                    <p className="text-xs text-slate-300 font-semibold">Chụp hình vở làm bài tập</p>
                    <p className="text-[10px] text-slate-500">Giả lập mở camera điện thoại Android</p>
                  </div>
                )}
              </div>

              {/* Sample Photo Presets for Easy Mobile Testing */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                <span className="text-[10px] text-slate-500 font-bold">Mẫu ảnh:</span>
                <button
                  type="button"
                  onClick={() => setProofImageUrl('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80')}
                  className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300"
                >
                  📷 Trang Vở
                </button>
                <button
                  type="button"
                  onClick={() => setProofImageUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80')}
                  className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300"
                >
                  📚 Sách Học
                </button>
              </div>
            </div>

            {/* Note text area */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Lời nhắn gửi anh/chị:</label>
              <input
                type="text"
                placeholder="Vd: Em đã giải xong bài 1 đến 5 rồi ạ!"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleSubmitProof}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/30 text-xs transition-all hover:scale-[1.02] active:scale-95"
            >
              Gửi Bài Cho Anh Duyệt ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
