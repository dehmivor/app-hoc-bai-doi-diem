export type UserRole = 'parent_admin' | 'student';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  balance_coins: number;
  total_xp: number;
  current_streak: number;
  avatar_url?: string;
}

export type QuestCategory = 'toan' | 'van' | 'anh' | 'viec_nha' | 'khac';
export type RecurringOption = 'none' | 'daily' | 'weekly';

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward_coins: number;
  reward_xp: number;
  category: QuestCategory;
  due_date?: string;
  require_proof: boolean;
  is_recurring: RecurringOption;
  created_at: string;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface QuestSubmission {
  id: string;
  quest_id: string;
  student_id: string;
  proof_image_url?: string;
  note?: string;
  status: SubmissionStatus;
  submitted_at: string;
  admin_note?: string;
  reviewed_at?: string;
  // Joined fields for display
  quest?: Quest;
}

export type RewardCategory = 'entertainment' | 'food' | 'activity' | 'special';

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost_coins: number;
  icon: string;
  category: RewardCategory;
  is_active: boolean;
}

export type RedemptionStatus = 'requested' | 'completed' | 'cancelled';

export interface Redemption {
  id: string;
  reward_id: string;
  student_id: string;
  status: RedemptionStatus;
  created_at: string;
  processed_at?: string;
  // Joined fields for display
  reward?: Reward;
}

// Gamification Level Helper
export interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  nextLevelXP: number;
  progressPercent: number;
  badgeEmoji: string;
}

export function getLevelInfo(totalXP: number): LevelInfo {
  const levels = [
    { level: 1, title: 'Tập sự Siêu Cấp', xp: 0, badge: '🌱' },
    { level: 2, title: 'Thám Hiểm Gia', xp: 100, badge: '🧭' },
    { level: 3, title: 'Dũng Sĩ Học Tập', xp: 300, badge: '⚔️' },
    { level: 4, title: 'Bậc Thầy Tri Thức', xp: 600, badge: '👑' },
    { level: 5, title: 'Huyền Thoại Toàn Năng', xp: 1000, badge: '🌟' },
  ];

  let currentLevel = levels[0];
  let nextLevel = levels[1];

  for (let i = 0; i < levels.length; i++) {
    if (totalXP >= levels[i].xp) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || { ...levels[i], xp: levels[i].xp + 500 };
    }
  }

  const xpInCurrentLevel = Math.max(0, totalXP - currentLevel.xp);
  const xpNeededForNext = nextLevel.xp - currentLevel.xp;
  const progressPercent = Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNext) * 100));

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentXP: totalXP,
    nextLevelXP: nextLevel.xp,
    progressPercent,
    badgeEmoji: currentLevel.badge,
  };
}
