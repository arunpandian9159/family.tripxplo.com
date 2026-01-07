-- Mobile Authentication Schema for TripXplo Family EMI
-- This schema creates tables for mobile number and PIN-based authentication

-- =============================================================================
-- MOBILE USERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS mobile_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Authentication Details
    mobile_number VARCHAR(10) NOT NULL UNIQUE,
    pin_hash VARCHAR(255) NOT NULL, -- Hashed 4-digit PIN
    
    -- User Profile (Optional)
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    
    -- Account Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Security & Tracking
    failed_login_attempts INTEGER DEFAULT 0,
    last_login_attempt TIMESTAMP WITH TIME ZONE,
    last_successful_login TIMESTAMP WITH TIME ZONE,
    account_locked_until TIMESTAMP WITH TIME ZONE,
    
    -- Session Management
    current_session_token VARCHAR(255),
    session_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_mobile_number CHECK (mobile_number ~ '^[6-9][0-9]{9}$'),
    CONSTRAINT valid_email CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =============================================================================
-- LOGIN SESSIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES mobile_users(id) ON DELETE CASCADE,
    
    -- Session Details
    session_token VARCHAR(255) NOT NULL UNIQUE,
    device_info JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    
    -- Session Status
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- AUTHENTICATION LOGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS auth_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- User Reference (nullable for failed attempts)
    user_id UUID REFERENCES mobile_users(id) ON DELETE SET NULL,
    mobile_number VARCHAR(10),
    
    -- Event Details
    event_type VARCHAR(50) NOT NULL, -- 'login_success', 'login_failed', 'signup', 'logout', 'pin_change'
    event_description TEXT,
    
    -- Request Details
    ip_address INET,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_event_type CHECK (event_type IN ('login_success', 'login_failed', 'signup', 'logout', 'pin_change', 'account_locked', 'account_unlocked'))
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Primary lookup indexes
CREATE INDEX IF NOT EXISTS idx_mobile_users_mobile_number ON mobile_users(mobile_number);
CREATE INDEX IF NOT EXISTS idx_mobile_users_session_token ON mobile_users(current_session_token);
CREATE INDEX IF NOT EXISTS idx_mobile_users_created_at ON mobile_users(created_at);

-- Session management indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active, expires_at);

-- Logging and security indexes
CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_mobile_number ON auth_logs(mobile_number);
CREATE INDEX IF NOT EXISTS idx_auth_logs_event_type ON auth_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON auth_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_logs_ip_address ON auth_logs(ip_address);

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for mobile_users table
CREATE TRIGGER update_mobile_users_updated_at
    BEFORE UPDATE ON mobile_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() OR is_active = false;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Also clear session tokens from mobile_users table
    UPDATE mobile_users 
    SET current_session_token = NULL, 
        session_expires_at = NULL
    WHERE session_expires_at < NOW();
    
    RETURN deleted_count;
END;
$$ language 'plpgsql';

-- =============================================================================
-- SECURITY POLICIES (RLS)
-- =============================================================================

-- Enable Row Level Security
ALTER TABLE mobile_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_logs ENABLE ROW LEVEL SECURITY;

-- Policies for mobile_users (users can only access their own data)
CREATE POLICY "Users can view own profile" ON mobile_users
    FOR SELECT USING (id = auth.uid()::uuid);

CREATE POLICY "Users can update own profile" ON mobile_users
    FOR UPDATE USING (id = auth.uid()::uuid);

-- Policies for user_sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (user_id = auth.uid()::uuid);

-- Policies for auth_logs (users can view their own logs)
CREATE POLICY "Users can view own auth logs" ON auth_logs
    FOR SELECT USING (user_id = auth.uid()::uuid);

-- =============================================================================
-- GRANTS AND PERMISSIONS
-- =============================================================================

-- Grant permissions to anon and authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON mobile_users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_sessions TO anon, authenticated;
GRANT SELECT, INSERT ON auth_logs TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =============================================================================
-- SAMPLE DATA (FOR TESTING)
-- =============================================================================

-- Insert a test user (PIN: 1234, hashed)
-- Note: In production, use proper password hashing like bcrypt
INSERT INTO mobile_users (mobile_number, pin_hash, first_name, last_name, is_verified)
VALUES ('9876543210', '$2b$10$example.hash.for.pin.1234', 'Test', 'User', true)
ON CONFLICT (mobile_number) DO NOTHING;

-- =============================================================================
-- COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE mobile_users IS 'Stores user authentication data with mobile number and PIN';
COMMENT ON TABLE user_sessions IS 'Manages active user sessions and tokens';
COMMENT ON TABLE auth_logs IS 'Logs all authentication events for security monitoring';

COMMENT ON COLUMN mobile_users.pin_hash IS 'Bcrypt hashed 4-digit PIN';
COMMENT ON COLUMN mobile_users.failed_login_attempts IS 'Counter for failed login attempts (for account locking)';
COMMENT ON COLUMN mobile_users.account_locked_until IS 'Account lock expiry timestamp';
COMMENT ON COLUMN user_sessions.device_info IS 'JSON object containing device/browser information';
COMMENT ON COLUMN auth_logs.event_type IS 'Type of authentication event (login_success, login_failed, etc.)';
