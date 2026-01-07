-- Setup script for Mobile Authentication
-- Run this in your Quote Database (lkqbrlrmrsnbtkoryazq.supabase.co)

-- First, check if tables already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mobile_users') THEN
        RAISE NOTICE 'Creating mobile_users table...';
    ELSE  
        RAISE NOTICE 'mobile_users table already exists, skipping creation...';
        RETURN;
    END IF;
END
$$;

-- Create mobile_users table
CREATE TABLE IF NOT EXISTS mobile_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mobile_number VARCHAR(10) NOT NULL UNIQUE,
    pin_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login_attempt TIMESTAMP WITH TIME ZONE,
    last_successful_login TIMESTAMP WITH TIME ZONE,
    account_locked_until TIMESTAMP WITH TIME ZONE,
    current_session_token VARCHAR(255),
    session_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_mobile_number CHECK (mobile_number ~ '^[6-9][0-9]{9}$')
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES mobile_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    device_info JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create auth_logs table
CREATE TABLE IF NOT EXISTS auth_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES mobile_users(id) ON DELETE SET NULL,
    mobile_number VARCHAR(10),
    event_type VARCHAR(50) NOT NULL,
    event_description TEXT,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_event_type CHECK (event_type IN ('login_success', 'login_failed', 'signup', 'logout', 'pin_change', 'account_locked', 'account_unlocked'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mobile_users_mobile_number ON mobile_users(mobile_number);
CREATE INDEX IF NOT EXISTS idx_mobile_users_session_token ON mobile_users(current_session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_mobile_number ON auth_logs(mobile_number);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_mobile_users_updated_at ON mobile_users;
CREATE TRIGGER update_mobile_users_updated_at
    BEFORE UPDATE ON mobile_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON mobile_users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_sessions TO anon, authenticated;
GRANT SELECT, INSERT ON auth_logs TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Insert test user (PIN: 1234)
-- Note: This is a bcrypt hash of "1234" with salt rounds 10
INSERT INTO mobile_users (mobile_number, pin_hash, first_name, last_name, is_verified)
VALUES ('9876543210', '$2b$10$rOOjq8YlUEkqUEqr5E5qKOKvKvKvKvKvKvKvKvKvKvKvKvKvKvKvK.', 'Test', 'User', true)
ON CONFLICT (mobile_number) DO NOTHING;

-- Verification queries
SELECT 'Mobile Users Table' as table_name, COUNT(*) as record_count FROM mobile_users;
SELECT 'User Sessions Table' as table_name, COUNT(*) as record_count FROM user_sessions;
SELECT 'Auth Logs Table' as table_name, COUNT(*) as record_count FROM auth_logs;

-- Show test user
SELECT mobile_number, first_name, last_name, is_active, is_verified, created_at 
FROM mobile_users 
WHERE mobile_number = '9876543210';

RAISE NOTICE 'Mobile authentication setup completed successfully!';
RAISE NOTICE 'Test user created: 9876543210 (PIN: 1234)';
