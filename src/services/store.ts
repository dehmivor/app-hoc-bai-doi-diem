import { Quest, QuestSubmission, Reward, Redemption, User } from '../types';

const STORAGE_KEYS = {
  USER: 'app_hoc_bai_user',
  QUESTS: 'app_hoc_bai_quests',
  SUBMISSIONS: 'app_hoc_bai_submissions',
  REWARDS: 'app_hoc_bai_rewards',
  REDEMPTIONS: 'app_hoc_bai_redemptions',
};

// Initial Seed Data for immediate instant testing
const INITIAL_STUDENT: User = {
  id: 'student-1',
  name: 'Em Út Chăm Học',
  role: 'student',
  balance_coins: 140,
  total_xp: 380,
  current_streak: 4,
  avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
};

const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: 'Giải 5 bài tập Toán SGK Trang 45',
    description: 'Chụp hình vở làm bài tập Toán 5 câu đại số chương 2 rõ nét',
    reward_coins: 30,
    reward_xp: 50,
    category: 'toan',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    require_proof: true,
    is_recurring: 'daily',
    created_at: new Date().toISOString(),
  },
  {
    id: 'quest-2',
    title: 'Học 15 từ vựng Tiếng Anh Unit 4',
    description: 'Viết từ mới ra sổ tay và quay clip hoặc chụp ảnh ghi nhớ',
    reward_coins: 25,
    reward_xp: 40,
    category: 'anh',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    require_proof: true,
    is_recurring: 'daily',
    created_at: new Date().toISOString(),
  },
  {
    id: 'quest-3',
    title: 'Đọc 3 trang sách Văn mẫu cảm nghĩ',
    description: 'Đọc kỹ bài văn biểu cảm và gạch chân các câu văn hay',
    reward_coins: 20,
    reward_xp: 30,
    category: 'van',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    require_proof: false,
    is_recurring: 'none',
    created_at: new Date().toISOString(),
  },
  {
    id: 'quest-4',
    title: 'Dọn dẹp phòng riêng ngăn nắp',
    description: 'Gấp chăn mền, sắp xếp lại góc học tập sạch sẽ',
    reward_coins: 20,
    reward_xp: 25,
    category: 'viec_nha',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    require_proof: true,
    is_recurring: 'daily',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_SUBMISSIONS: QuestSubmission[] = [
  {
    id: 'sub-1',
    quest_id: 'quest-1',
    student_id: 'student-1',
    proof_image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    note: 'Em đã hoàn thành bài 1 đến bài 5 trang 45 rồi ạ!',
    status: 'pending',
    submitted_at: new Date(Date.now() - 3600000).toISOString(),
  }
];

const INITIAL_REWARDS: Reward[] = [
  {
    id: 'reward-1',
    title: '30 Phút xem YouTube / Chơi Game',
    description: 'Đổi lấy 30 phút giải trí máy tính/điện thoại',
    cost_coins: 40,
    icon: '🎮',
    category: 'entertainment',
    is_active: true,
  },
  {
    id: 'reward-2',
    title: '1 Ly Trà Sữa Thạch Trái Cây',
    description: 'Được gọi 1 ly trà sữa size L tùy chọn topping',
    cost_coins: 100,
    icon: '🧋',
    category: 'food',
    is_active: true,
  },
  {
    id: 'reward-3',
    title: 'Vé đi xem phim Rạp cuối tuần',
    description: 'Xem 1 bộ phim hoạt hình hot cùng gia đình',
    cost_coins: 250,
    icon: '🍿',
    category: 'activity',
    is_active: true,
  },
  {
    id: 'reward-4',
    title: 'Mua 1 cuốn truyện tranh mớii',
    description: 'Tự chọn 1 cuốn truyện Doraemon / Conan mới xuất bản',
    cost_coins: 80,
    icon: '📚',
    category: 'special',
    is_active: true,
  }
];

const INITIAL_REDEMPTIONS: Redemption[] = [];

type Listener = () => void;

class AppStore {
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_STUDENT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUESTS)) {
      localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(INITIAL_QUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REWARDS)) {
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(INITIAL_REWARDS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REDEMPTIONS)) {
      localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(INITIAL_REDEMPTIONS));
    }
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Student Profile
  public getStudent(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : INITIAL_STUDENT;
  }

  public updateStudent(updater: (prev: User) => User) {
    const current = this.getStudent();
    const updated = updater(current);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    this.notify();
  }

  // Quests
  public getQuests(): Quest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTS);
    return raw ? JSON.parse(raw) : [];
  }

  public addQuest(quest: Omit<Quest, 'id' | 'created_at'>) {
    const quests = this.getQuests();
    const newQuest: Quest = {
      ...quest,
      id: 'quest-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    quests.unshift(newQuest);
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    this.notify();
    return newQuest;
  }

  public deleteQuest(id: string) {
    const quests = this.getQuests().filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    this.notify();
  }

  // Submissions
  public getSubmissions(): QuestSubmission[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    const submissions: QuestSubmission[] = raw ? JSON.parse(raw) : [];
    const quests = this.getQuests();

    return submissions.map((sub) => ({
      ...sub,
      quest: quests.find((q) => q.id === sub.quest_id),
    }));
  }

  public submitQuest(questId: string, proofImageUrl?: string, note?: string) {
    const student = this.getStudent();
    const submissions = this.getSubmissions();

    // Check if quest needs proof or auto-completes
    const quest = this.getQuests().find((q) => q.id === questId);
    if (!quest) return;

    if (!quest.require_proof) {
      // Auto approve if no proof is required
      const newSubmission: QuestSubmission = {
        id: 'sub-' + Date.now(),
        quest_id: questId,
        student_id: student.id,
        note: note || 'Đã hoàn thành',
        status: 'approved',
        submitted_at: new Date().toISOString(),
        reviewed_at: new Date().toISOString(),
        admin_note: 'Tự động duyệt (Không yêu cầu ảnh proof)',
      };
      submissions.unshift(newSubmission);
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

      // Award coins and XP immediately
      this.updateStudent((prev) => ({
        ...prev,
        balance_coins: prev.balance_coins + quest.reward_coins,
        total_xp: prev.total_xp + quest.reward_xp,
        current_streak: prev.current_streak + 1,
      }));
    } else {
      const newSubmission: QuestSubmission = {
        id: 'sub-' + Date.now(),
        quest_id: questId,
        student_id: student.id,
        proof_image_url: proofImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        note,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      };
      submissions.unshift(newSubmission);
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
      this.notify();
    }
  }

  public reviewSubmission(submissionId: string, status: 'approved' | 'rejected', adminNote?: string) {
    const rawSubs = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    const submissions: QuestSubmission[] = rawSubs ? JSON.parse(rawSubs) : [];
    const index = submissions.findIndex((s) => s.id === submissionId);

    if (index !== -1) {
      const targetSub = submissions[index];
      const quest = this.getQuests().find((q) => q.id === targetSub.quest_id);

      submissions[index] = {
        ...targetSub,
        status,
        admin_note: adminNote,
        reviewed_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

      // If approved, reward student
      if (status === 'approved' && quest) {
        this.updateStudent((prev) => ({
          ...prev,
          balance_coins: prev.balance_coins + quest.reward_coins,
          total_xp: prev.total_xp + quest.reward_xp,
          current_streak: prev.current_streak + 1,
        }));
      } else {
        this.notify();
      }
    }
  }

  // Rewards & Redemptions
  public getRewards(): Reward[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REWARDS);
    return raw ? JSON.parse(raw) : [];
  }

  public addReward(reward: Omit<Reward, 'id'>) {
    const rewards = this.getRewards();
    const newReward: Reward = {
      ...reward,
      id: 'reward-' + Date.now(),
    };
    rewards.unshift(newReward);
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
    this.notify();
    return newReward;
  }

  public deleteReward(id: string) {
    const rewards = this.getRewards().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
    this.notify();
  }

  public getRedemptions(): Redemption[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
    const redemptions: Redemption[] = raw ? JSON.parse(raw) : [];
    const rewards = this.getRewards();

    return redemptions.map((red) => ({
      ...red,
      reward: rewards.find((r) => r.id === red.reward_id),
    }));
  }

  public requestRedemption(rewardId: string): { success: boolean; message: string } {
    const student = this.getStudent();
    const reward = this.getRewards().find((r) => r.id === rewardId);

    if (!reward) return { success: false, message: 'Phần thưởng không tồn tại!' };
    if (student.balance_coins < reward.cost_coins) {
      return { success: false, message: `Bạn chưa đủ Coin! Cần thêm ${reward.cost_coins - student.balance_coins} coin nữa.` };
    }

    // Deduct coins immediately
    this.updateStudent((prev) => ({
      ...prev,
      balance_coins: prev.balance_coins - reward.cost_coins,
    }));

    const raw = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
    const redemptions: Redemption[] = raw ? JSON.parse(raw) : [];

    const newRedemption: Redemption = {
      id: 'red-' + Date.now(),
      reward_id: rewardId,
      student_id: student.id,
      status: 'requested',
      created_at: new Date().toISOString(),
    };

    redemptions.unshift(newRedemption);
    localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(redemptions));
    this.notify();

    return { success: true, message: `Đã gửi yêu cầu đổi "${reward.title}"! Anh/Chị sẽ sớm trao quà cho em.` };
  }

  public completeRedemption(redemptionId: string) {
    const raw = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
    const redemptions: Redemption[] = raw ? JSON.parse(raw) : [];
    const index = redemptions.findIndex((r) => r.id === redemptionId);

    if (index !== -1) {
      redemptions[index] = {
        ...redemptions[index],
        status: 'completed',
        processed_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(redemptions));
      this.notify();
    }
  }

  public resetToDemoData() {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_STUDENT));
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(INITIAL_QUESTS));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(INITIAL_REWARDS));
    localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify([]));
    this.notify();
  }
}

export const store = new AppStore();
