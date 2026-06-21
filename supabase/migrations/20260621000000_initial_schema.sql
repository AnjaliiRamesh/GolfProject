-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'expired', 'past_due', 'trialing');
CREATE TYPE plan_type AS ENUM ('monthly', 'yearly');
CREATE TYPE draw_type AS ENUM ('5_match', '4_match', '3_match');
CREATE TYPE draw_mode AS ENUM ('random', 'algorithmic');
CREATE TYPE draw_status AS ENUM ('draft', 'simulated', 'running', 'completed', 'published');
CREATE TYPE winner_status AS ENUM ('pending', 'proof_uploaded', 'approved', 'rejected', 'paid');
CREATE TYPE payment_status AS ENUM ('succeeded', 'failed', 'refunded');
CREATE TYPE algo_strategy AS ENUM ('most_frequent', 'least_frequent');

-- ============================================
-- TABLES
-- ============================================

-- System Settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    onboarded BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    plan_type plan_type NOT NULL,
    status subscription_status DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    stripe_payment_intent_id TEXT,
    amount INTEGER NOT NULL,  -- in cents
    currency TEXT DEFAULT 'gbp',
    status payment_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Charities
CREATE TABLE charities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,
    category TEXT,
    logo_url TEXT,
    banner_url TEXT,
    website_url TEXT,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    total_raised INTEGER DEFAULT 0,  -- in cents
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Charity Selections
CREATE TABLE user_charities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    charity_id UUID NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
    contribution_percentage INTEGER NOT NULL DEFAULT 10
        CHECK (contribution_percentage IN (10, 15, 20, 25, 30)),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, charity_id)
);

-- Scores (Stableford format, 1-45)
CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
    played_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, played_date)  -- One score per date
);

-- Draws
CREATE TABLE draws (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_date DATE NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    draw_mode draw_mode NOT NULL DEFAULT 'random',
    algo_strategy algo_strategy,
    status draw_status DEFAULT 'draft',
    winning_numbers INTEGER[] NOT NULL DEFAULT '{}',
    total_prize_pool INTEGER DEFAULT 0,  -- in cents
    jackpot_rollover INTEGER DEFAULT 0,  -- in cents
    five_match_pool INTEGER DEFAULT 0,
    four_match_pool INTEGER DEFAULT 0,
    three_match_pool INTEGER DEFAULT 0,
    total_entries INTEGER DEFAULT 0,
    is_simulation BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(month, year, is_simulation)
);

-- Draw Entries (snapshot of user's scores at draw time)
CREATE TABLE draw_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scores INTEGER[] NOT NULL,  -- snapshot of user's 5 scores
    matched_count INTEGER DEFAULT 0,
    is_winner BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(draw_id, user_id)
);

-- Winners
CREATE TABLE winners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
    draw_entry_id UUID NOT NULL REFERENCES draw_entries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    draw_type draw_type NOT NULL,
    prize_amount INTEGER NOT NULL,  -- in cents
    status winner_status DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Winner Proofs
CREATE TABLE winner_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    winner_id UUID NOT NULL REFERENCES winners(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_type TEXT,
    notes TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Donations (independent + subscription-based)
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    charity_id UUID NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,  -- in cents
    source TEXT NOT NULL DEFAULT 'subscription',  -- 'subscription' | 'independent'
    stripe_payment_id TEXT,
    month INTEGER,
    year INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_scores_user ON scores(user_id);
CREATE INDEX idx_scores_user_date ON scores(user_id, played_date DESC);
CREATE INDEX idx_draws_status ON draws(status);
CREATE INDEX idx_draws_month_year ON draws(month, year);
CREATE INDEX idx_draw_entries_draw ON draw_entries(draw_id);
CREATE INDEX idx_draw_entries_user ON draw_entries(user_id);
CREATE INDEX idx_winners_user ON winners(user_id);
CREATE INDEX idx_winners_draw ON winners(draw_id);
CREATE INDEX idx_winners_status ON winners(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_user_charities_user ON user_charities(user_id);
CREATE INDEX idx_donations_user ON donations(user_id);
CREATE INDEX idx_donations_charity ON donations(charity_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE winner_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- System Settings: admins only
CREATE POLICY "Admins can view system settings"
    ON system_settings FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
CREATE POLICY "Admins can manage system settings"
    ON system_settings FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Profiles: users see own, admins see all
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
CREATE POLICY "Admins can update all profiles"
    ON profiles FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Subscriptions: users see own, admins see all
CREATE POLICY "Users can view own subscription"
    ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all subscriptions"
    ON subscriptions FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Scores: users manage own, admins see all
CREATE POLICY "Users can manage own scores"
    ON scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all scores"
    ON scores FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Charities: public read, admin write
CREATE POLICY "Anyone can view active charities"
    ON charities FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage charities"
    ON charities FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- User Charities: users manage own, admins see all
CREATE POLICY "Users can manage own charities"
    ON user_charities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all user charities"
    ON user_charities FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Draws: public read published, admin full access
CREATE POLICY "Anyone can view published draws"
    ON draws FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage draws"
    ON draws FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Draw Entries: users see own, admins see all
CREATE POLICY "Users can view own entries"
    ON draw_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage entries"
    ON draw_entries FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Winners: users see own, admins manage all
CREATE POLICY "Users can view own winnings"
    ON winners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage winners"
    ON winners FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Winner Proofs: users manage own, admins view all
CREATE POLICY "Users can manage own proofs"
    ON winner_proofs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all proofs"
    ON winner_proofs FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Notifications: users see own
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Donations: users see own, admins see all
CREATE POLICY "Users can view own donations"
    ON donations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage donations"
    ON donations FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Audit Logs: admins only
CREATE POLICY "Admins can view audit logs"
    ON audit_logs FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON charities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_charities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON winners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON draws
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enforce max 5 scores per user
CREATE OR REPLACE FUNCTION enforce_max_scores()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM scores
    WHERE id IN (
        SELECT id FROM scores
        WHERE user_id = NEW.user_id
        ORDER BY played_date DESC
        OFFSET 5
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_score_limit
    AFTER INSERT ON scores
    FOR EACH ROW EXECUTE FUNCTION enforce_max_scores();

-- ============================================
-- DEFAULT SETTINGS
-- ============================================
INSERT INTO system_settings (key, value) VALUES ('jackpot_cap', '5000000'); -- 50,000 GBP in cents
