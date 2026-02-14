-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Project > SQL Editor > New Query

CREATE TABLE leaderboard (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  name TEXT,
  rank TEXT,
  total_power INTEGER,
  attack INTEGER,
  defense INTEGER,
  magic INTEGER,
  speed INTEGER,
  luck INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Public read" ON leaderboard FOR SELECT USING (true);

-- Allow anyone to insert
CREATE POLICY "Public insert" ON leaderboard FOR INSERT WITH CHECK (true);

-- Allow anyone to update
CREATE POLICY "Public update" ON leaderboard FOR UPDATE USING (true);
