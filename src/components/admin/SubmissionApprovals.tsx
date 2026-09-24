import React, { useState } from 'react';
import { store } from '../../services/store';
import { QuestSubmission } from '../../types';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Eye, Camera, Clock, Coins, Award, AlertCircle } from 'lucide-react';

export const SubmissionApprovals: React.FC = () => {
  const submissions = store.getSubmissions();
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const reviewedSubmissions = submissions.filter((s) => s.status !== 'pending');

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [rejectModalSubId, setRejectModalSubId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const handleApprove = (sub: QuestSubmission) => {
    store.reviewSubmission(sub.id, 'approved', 'Đã duyệt! Bài làm rất tốt 🌟');

    // Trigger Gamification Confetti Explosion
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#eab308', '#6366f1', '#ec4899', '#10b981'],
    });
  };

  const handleRejectConfirm = () => {
    if (!rejectModalSubId) return;
    store.reviewSubmission(rejectModalSubId, 'rejected', rejectNote || 'Bài làm chưa đạt yêu cầu, em kiểm tra và nộp lại nhé.');
    setRejectModalSubId(null);
    setRejectNote('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-pink-400" />
          Duyệt Bài Tập Nộp Về (Approvals)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Xem lại ảnh chụp bài làm của em út. Bấm <strong className="text-emerald-400">Duyệt</strong> để tự động cộng Coin và giữ Streak!
        </p>
      </div>

      {/* Pending Submissions Section */}
      <div>
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Chờ Duyệt ({pendingSubmissions.length})
        </h3>

        {pendingSubmissions.length === 0 ? (
          <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700/60 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/50 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Không có bài tập nào đang chờ duyệt!</p>
            <p className="text-xs text-slate-500 mt-1">Khi em út nộp bài chụp ảnh, thông báo duyệt sẽ xuất hiện ở đây.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-slate-800 p-5 rounded-2xl border border-amber-500/30 shadow-lg flex flex-col justify-between gap-4"
              >
                <div className="flex gap-4">
                  {/* Photo Thumbnail */}
                  {sub.proof_image_url ? (
                    <div
                      onClick={() => setPreviewImage(sub.proof_image_url!)}
                      className="relative w-28 h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 group cursor-pointer flex-shrink-0"
                    >
                      <img
                        src={sub.proof_image_url}
                        alt="Proof"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Eye className="w-6 h-6" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 text-xs text-center p-2 flex-shrink-0">
                      Không có ảnh proof
                    </div>
                  )}

                  {/* Submission Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      Chờ Anh Duyệt
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5 truncate">
                      {sub.quest?.title || 'Bài tập'}
                    </h4>

                    {sub.note && (
                      <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg mt-2 italic border border-slate-700/60">
                        "{sub.note}"
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> +{sub.quest?.reward_coins || 0} Coin
                      </span>
                      <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> +{sub.quest?.reward_xp || 0} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-700">
                  <button
                    onClick={() => setRejectModalSubId(sub.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-slate-600 hover:border-red-500/50 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    <XCircle className="w-4 h-4" /> Từ Chối
                  </button>

                  <button
                    onClick={() => handleApprove(sub)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Duyệt & Cộng Coin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Reviewed Submissions */}
      {reviewedSubmissions.length > 0 && (
        <div className="pt-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Lịch Sử Bài Đã Duyệt ({reviewedSubmissions.length})
          </h3>
          <div className="space-y-3">
            {reviewedSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {sub.status === 'approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{sub.quest?.title}</p>
                    <p className="text-xs text-slate-400">
                      {sub.admin_note ? `Ghi chú: ${sub.admin_note}` : sub.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${
                    sub.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {sub.status === 'approved' ? 'Đã duyệt (+Coin)' : 'Đã từ chối'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Zoom Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl max-h-[90vh] relative">
            <img src={previewImage} alt="Zoom Proof" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain" />
            <p className="text-center text-xs text-slate-400 mt-2">Nhấn bất kỳ đâu để đóng</p>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalSubId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" /> Từ Chối Bài Tập
            </h3>
            <p className="text-xs text-slate-300">
              Nhập lời nhắn nhắc nhở để em biết lý do và nộp lại bài đúng chuẩn nhé:
            </p>
            <textarea
              rows={3}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Vd: Bài 3 em tính bị nhầm nét, em kiểm tra lại trang 45 rồi chụp lại nhé..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setRejectModalSubId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
