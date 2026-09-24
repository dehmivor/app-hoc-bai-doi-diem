-- ===================================================
-- DATABASE SCHEMA: APP HỌC BÀI ĐỔI ĐIỂM (SUPABASE POSTGRES)
-- ===================================================

-- 1. BẢNG USERS (Người dùng: Admin & Em út)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent_admin', 'student')),
  balance_coins INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG QUESTS (Danh sách nhiệm vụ học tập)
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  reward_coins INTEGER NOT NULL DEFAULT 10,
  reward_xp INTEGER NOT NULL DEFAULT 20,
  category TEXT NOT NULL DEFAULT 'toan' CHECK (category IN ('toan', 'van', 'anh', 'viec_nha', 'khac')),
  due_date TIMESTAMPTZ,
  require_proof BOOLEAN NOT NULL DEFAULT true,
  is_recurring TEXT NOT NULL DEFAULT 'none' CHECK (is_recurring IN ('none', 'daily', 'weekly')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG QUEST_SUBMISSIONS (Nộp bài & Duyệt bài tập)
CREATE TABLE IF NOT EXISTS public.quest_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  proof_image_url TEXT,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  admin_note TEXT,
  reviewed_at TIMESTAMPTZ
);

-- 4. BẢNG REWARDS (Cửa hàng quà tặng)
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cost_coins INTEGER NOT NULL DEFAULT 50,
  icon TEXT NOT NULL DEFAULT '🎁',
  category TEXT NOT NULL DEFAULT 'entertainment' CHECK (category IN ('entertainment', 'food', 'activity', 'special')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG REDEMPTIONS (Yêu cầu đổi quà)
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- MẪU DỮ LIỆU BAN ĐẦU (SEED DATA)
INSERT INTO public.users (id, name, role, balance_coins, total_xp, current_streak, avatar_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Anh / Chị Admin', 'parent_admin', 0, 0, 0, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'),
  ('22222222-2222-2222-2222-222222222222', 'Em Út Chăm Học', 'student', 150, 450, 5, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quests (id, title, description, reward_coins, reward_xp, category, require_proof, is_recurring)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Giải 5 bài tập Toán SGK Trang 45', 'Chụp rõ nét trang vở giải bài 1 đến 5', 30, 50, 'toan', true, 'daily'),
  ('44444444-4444-4444-4444-444444444444', 'Học 15 từ vựng Tiếng Anh chủ đề School', 'Học thuộc lòng từ mới trên ứng dụng hoặc vở ghi', 25, 40, 'anh', false, 'daily'),
  ('55555555-5555-5555-5555-555555555555', 'Dọn dẹp bàn học và phòng riêng', 'Chụp ảnh phòng sau khi gấp chăn mền ngăn nắp', 20, 30, 'viec_nha', true, 'daily')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.rewards (id, title, description, cost_coins, icon, category)
VALUES
  ('66666666-6666-6666-6666-666666666666', '30 Phút xem YouTube / Chơi Game', 'Thư giãn thoải mái sau giờ học căng thẳng', 40, '🎮', 'entertainment'),
  ('77777777-7777-7777-7777-777777777777', '1 Ly Trà Sữa Thạch Trái Cây', 'Được gọi 1 ly trà sữa topping tùy chọn', 100, '🧋', 'food'),
  ('88888888-8888-8888-8888-888888888888', 'Cuối tuần đi xem phim Rạp', 'Xem 1 bộ phim hoạt hình/hành động chiếu rạp hot', 250, '🍿', 'activity')
ON CONFLICT (id) DO NOTHING;
