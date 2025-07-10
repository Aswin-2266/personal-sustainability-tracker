-- Drop for development/testing only
-- DROP TABLE IF EXISTS user_activities CASCADE;
-- DROP TABLE IF EXISTS sustainability_data CASCADE;
-- DROP TABLE IF EXISTS leaderboard CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sustainability Data
CREATE TABLE IF NOT EXISTS sustainability_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    commute_type VARCHAR(50),
    commute_distance FLOAT,
    diet_type VARCHAR(50),
    food_weight FLOAT,
    electricity_used FLOAT,
    water_consumption FLOAT,
    plastic_items_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    username VARCHAR(100) NOT NULL,
    points INTEGER DEFAULT 0
);

-- User Activities
CREATE TABLE IF NOT EXISTS user_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sustainability_user_id ON sustainability_data(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON user_activities(user_id);
