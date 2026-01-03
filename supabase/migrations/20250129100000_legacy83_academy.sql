-- Legacy 83 Academy LMS Schema
-- Supports: Courses, Lessons, Enrollments, Assessments, Workshops, Subscriptions, Performance Tracking

-- ============================================================================
-- SUBSCRIPTION TIERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.subscription_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_annual DECIMAL(10,2),
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO legacy83.subscription_tiers (name, slug, description, price_monthly, price_annual, features, sort_order) VALUES
('Legacy Starter', 'legacy-starter', 'Essential resources for business owners beginning their legacy journey', 49.00, 470.00, '["Access to Legacy Journal articles", "Monthly newsletter", "Community forum access", "1 free workshop per quarter"]'::jsonb, 1),
('Legacy Builder', 'legacy-builder', 'Comprehensive tools and training for growing business leaders', 149.00, 1430.00, '["All Starter features", "Full course library access", "Weekly group coaching calls", "Pre/Post assessments", "Certificate programs", "Priority workshop registration"]'::jsonb, 2),
('Legacy Master', 'legacy-master', 'Premium access with personalized coaching and exclusive resources', 349.00, 3350.00, '["All Builder features", "Monthly 1-on-1 coaching session", "Custom learning paths", "Executive peer group access", "Annual strategy retreat invitation", "White-glove onboarding"]'::jsonb, 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- USER SUBSCRIPTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES legacy83.subscription_tiers(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'paused', 'expired', 'trial')),
    billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_subscriptions_user ON legacy83.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON legacy83.user_subscriptions(status);

-- ============================================================================
-- COURSE CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.course_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories aligned with G.R.O.W.S.
INSERT INTO legacy83.course_categories (name, slug, description, icon, color, sort_order) VALUES
('Goals & Vision', 'goals-vision', 'Strategic planning and vision development', 'Target', 'amber', 1),
('Revenue & Growth', 'revenue-growth', 'Sales, marketing, and business development', 'TrendingUp', 'green', 2),
('Operations', 'operations', 'Systems, processes, and efficiency', 'Settings', 'blue', 3),
('Workforce & Leadership', 'workforce-leadership', 'Team building and leadership development', 'Users', 'purple', 4),
('Succession & Legacy', 'succession-legacy', 'Exit planning and legacy building', 'ArrowRightLeft', 'orange', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- COURSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    thumbnail_url VARCHAR(500),
    preview_video_url VARCHAR(500),
    category_id UUID REFERENCES legacy83.course_categories(id),
    instructor_name VARCHAR(255) DEFAULT 'Icy Williams',
    instructor_bio TEXT,
    instructor_image_url VARCHAR(500),
    difficulty_level VARCHAR(50) DEFAULT 'intermediate' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_duration_minutes INTEGER,
    min_subscription_tier UUID REFERENCES legacy83.subscription_tiers(id),
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    tags JSONB DEFAULT '[]'::jsonb,
    learning_outcomes JSONB DEFAULT '[]'::jsonb,
    prerequisites JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_courses_category ON legacy83.courses(category_id);
CREATE INDEX idx_courses_published ON legacy83.courses(is_published);
CREATE INDEX idx_courses_featured ON legacy83.courses(is_featured);

-- ============================================================================
-- COURSE MODULES (Sections within a course)
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES legacy83.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_course_modules_course ON legacy83.course_modules(course_id);

-- ============================================================================
-- LESSONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES legacy83.course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) DEFAULT 'video' CHECK (content_type IN ('video', 'text', 'quiz', 'assignment', 'download', 'live')),
    video_url VARCHAR(500),
    video_duration_seconds INTEGER,
    text_content TEXT,
    download_url VARCHAR(500),
    is_preview BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, slug)
);

CREATE INDEX idx_lessons_module ON legacy83.lessons(module_id);

-- ============================================================================
-- COURSE ENROLLMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES legacy83.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    certificate_issued_at TIMESTAMPTZ,
    certificate_url VARCHAR(500),
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON legacy83.course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON legacy83.course_enrollments(course_id);

-- ============================================================================
-- LESSON PROGRESS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES legacy83.lessons(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    progress_seconds INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    notes TEXT,
    UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON legacy83.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON legacy83.lesson_progress(lesson_id);

-- ============================================================================
-- ASSESSMENTS (Pre/Post and Quiz)
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    assessment_type VARCHAR(50) DEFAULT 'quiz' CHECK (assessment_type IN ('pre', 'post', 'quiz', 'certification', 'diagnostic')),
    course_id UUID REFERENCES legacy83.courses(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES legacy83.lessons(id) ON DELETE SET NULL,
    passing_score_percentage DECIMAL(5,2) DEFAULT 70,
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 3,
    shuffle_questions BOOLEAN DEFAULT true,
    show_correct_answers BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assessments_course ON legacy83.assessments(course_id);
CREATE INDEX idx_assessments_type ON legacy83.assessments(assessment_type);

-- ============================================================================
-- ASSESSMENT QUESTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES legacy83.assessments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'rating_scale', 'open_ended')),
    options JSONB DEFAULT '[]'::jsonb,
    correct_answer JSONB,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_assessment ON legacy83.assessment_questions(assessment_id);

-- ============================================================================
-- ASSESSMENT ATTEMPTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES legacy83.assessments(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score_percentage DECIMAL(5,2),
    passed BOOLEAN,
    answers JSONB DEFAULT '{}'::jsonb,
    time_taken_seconds INTEGER,
    attempt_number INTEGER DEFAULT 1
);

CREATE INDEX idx_attempts_user ON legacy83.assessment_attempts(user_id);
CREATE INDEX idx_attempts_assessment ON legacy83.assessment_attempts(assessment_id);

-- ============================================================================
-- WORKSHOPS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.workshops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    thumbnail_url VARCHAR(500),
    workshop_type VARCHAR(50) DEFAULT 'live' CHECK (workshop_type IN ('live', 'recorded', 'hybrid')),
    category_id UUID REFERENCES legacy83.course_categories(id),
    instructor_name VARCHAR(255) DEFAULT 'Icy Williams',
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    max_participants INTEGER,
    min_subscription_tier UUID REFERENCES legacy83.subscription_tiers(id),
    meeting_url VARCHAR(500),
    recording_url VARCHAR(500),
    materials_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    registration_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workshops_scheduled ON legacy83.workshops(scheduled_start);
CREATE INDEX idx_workshops_type ON legacy83.workshops(workshop_type);

-- ============================================================================
-- WORKSHOP REGISTRATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.workshop_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workshop_id UUID NOT NULL REFERENCES legacy83.workshops(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    attended BOOLEAN DEFAULT false,
    attendance_duration_minutes INTEGER,
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_text TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    UNIQUE(user_id, workshop_id)
);

CREATE INDEX idx_registrations_user ON legacy83.workshop_registrations(user_id);
CREATE INDEX idx_registrations_workshop ON legacy83.workshop_registrations(workshop_id);

-- ============================================================================
-- LEARNING PATHS (Curated course sequences)
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    thumbnail_url VARCHAR(500),
    estimated_duration_weeks INTEGER,
    min_subscription_tier UUID REFERENCES legacy83.subscription_tiers(id),
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LEARNING PATH ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.learning_path_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES legacy83.learning_paths(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('course', 'workshop', 'assessment')),
    course_id UUID REFERENCES legacy83.courses(id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES legacy83.workshops(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES legacy83.assessments(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_path_items_path ON legacy83.learning_path_items(learning_path_id);

-- ============================================================================
-- USER LEARNING PATH PROGRESS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.user_learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    learning_path_id UUID NOT NULL REFERENCES legacy83.learning_paths(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    UNIQUE(user_id, learning_path_id)
);

-- ============================================================================
-- PERFORMANCE TRACKING / ANALYTICS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.user_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    courses_completed INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    assessments_passed INTEGER DEFAULT 0,
    workshops_attended INTEGER DEFAULT 0,
    total_learning_minutes INTEGER DEFAULT 0,
    average_assessment_score DECIMAL(5,2),
    streak_days INTEGER DEFAULT 0,
    UNIQUE(user_id, metric_date)
);

CREATE INDEX idx_performance_user ON legacy83.user_performance_metrics(user_id);
CREATE INDEX idx_performance_date ON legacy83.user_performance_metrics(metric_date);

-- ============================================================================
-- CERTIFICATES
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    certificate_type VARCHAR(50) NOT NULL CHECK (certificate_type IN ('course', 'learning_path', 'workshop', 'assessment')),
    course_id UUID REFERENCES legacy83.courses(id) ON DELETE SET NULL,
    learning_path_id UUID REFERENCES legacy83.learning_paths(id) ON DELETE SET NULL,
    workshop_id UUID REFERENCES legacy83.workshops(id) ON DELETE SET NULL,
    assessment_id UUID REFERENCES legacy83.assessments(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    certificate_number VARCHAR(100) UNIQUE,
    pdf_url VARCHAR(500),
    verification_url VARCHAR(500)
);

CREATE INDEX idx_certificates_user ON legacy83.certificates(user_id);

-- ============================================================================
-- DISCUSSION FORUMS (per course)
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy83.discussion_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES legacy83.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES legacy83.lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legacy83.discussion_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES legacy83.discussion_threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_instructor_reply BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE legacy83.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy83.certificates ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view subscription tiers" ON legacy83.subscription_tiers FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published courses" ON legacy83.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view course modules" ON legacy83.course_modules FOR SELECT USING (true);
CREATE POLICY "Public can view lessons" ON legacy83.lessons FOR SELECT USING (true);
CREATE POLICY "Public can view published assessments" ON legacy83.assessments FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published workshops" ON legacy83.workshops FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published learning paths" ON legacy83.learning_paths FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view categories" ON legacy83.course_categories FOR SELECT USING (true);

-- User-specific access
CREATE POLICY "Users can view own subscriptions" ON legacy83.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own enrollments" ON legacy83.course_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own enrollments" ON legacy83.course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments" ON legacy83.course_enrollments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own lesson progress" ON legacy83.lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own assessment attempts" ON legacy83.assessment_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own workshop registrations" ON legacy83.workshop_registrations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own certificates" ON legacy83.certificates FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION legacy83.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON legacy83.courses FOR EACH ROW EXECUTE FUNCTION legacy83.update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON legacy83.lessons FOR EACH ROW EXECUTE FUNCTION legacy83.update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON legacy83.assessments FOR EACH ROW EXECUTE FUNCTION legacy83.update_updated_at_column();
CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON legacy83.workshops FOR EACH ROW EXECUTE FUNCTION legacy83.update_updated_at_column();
CREATE TRIGGER update_subscription_tiers_updated_at BEFORE UPDATE ON legacy83.subscription_tiers FOR EACH ROW EXECUTE FUNCTION legacy83.update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON legacy83.user_subscriptions FOR EACH ROW EXECUTE FUNCTION legacy83.update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON legacy83.learning_paths FOR EACH ROW EXECUTE FUNCTION legacy83.update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Course with enrollment count
CREATE OR REPLACE VIEW legacy83.courses_with_stats AS
SELECT 
    c.*,
    cc.name as category_name,
    cc.slug as category_slug,
    COUNT(DISTINCT ce.id) as enrollment_count,
    COUNT(DISTINCT cm.id) as module_count,
    COUNT(DISTINCT l.id) as lesson_count
FROM legacy83.courses c
LEFT JOIN legacy83.course_categories cc ON c.category_id = cc.id
LEFT JOIN legacy83.course_enrollments ce ON c.id = ce.course_id
LEFT JOIN legacy83.course_modules cm ON c.id = cm.course_id
LEFT JOIN legacy83.lessons l ON cm.id = l.module_id
GROUP BY c.id, cc.name, cc.slug;

-- User dashboard stats
CREATE OR REPLACE VIEW legacy83.user_dashboard_stats AS
SELECT 
    u.id as user_id,
    COUNT(DISTINCT ce.id) as enrolled_courses,
    COUNT(DISTINCT CASE WHEN ce.completed_at IS NOT NULL THEN ce.id END) as completed_courses,
    COUNT(DISTINCT wr.id) as registered_workshops,
    COUNT(DISTINCT CASE WHEN wr.attended = true THEN wr.id END) as attended_workshops,
    COUNT(DISTINCT cert.id) as certificates_earned,
    COALESCE(SUM(lp.progress_seconds) / 60, 0) as total_learning_minutes
FROM auth.users u
LEFT JOIN legacy83.course_enrollments ce ON u.id = ce.user_id
LEFT JOIN legacy83.workshop_registrations wr ON u.id = wr.user_id
LEFT JOIN legacy83.certificates cert ON u.id = cert.user_id
LEFT JOIN legacy83.lesson_progress lp ON u.id = lp.user_id
GROUP BY u.id;
