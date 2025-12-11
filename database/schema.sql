-- MC App Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create entries table for MC carrier data
CREATE TABLE IF NOT EXISTS entries (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  mc VARCHAR(255) NOT NULL,
  carrier_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) DEFAULT 0,
  approved VARCHAR(3) NOT NULL CHECK (approved IN ('YES', 'NO')),
  checked_by VARCHAR(255) NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on MC for faster searches
CREATE INDEX IF NOT EXISTS idx_entries_mc ON entries(mc);

-- Create index on carrier_name for faster searches
CREATE INDEX IF NOT EXISTS idx_entries_carrier_name ON entries(carrier_name);

-- Create index on date for faster sorting
CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
-- Allow anyone to read users (for login check)
CREATE POLICY "Allow public read access to users" ON users
  FOR SELECT
  USING (true);

-- Only authenticated users can insert/update users (for admin panel)
CREATE POLICY "Allow authenticated users to manage users" ON users
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create policies for entries table
-- Allow authenticated users to read all entries
CREATE POLICY "Allow authenticated users to read entries" ON entries
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert entries
CREATE POLICY "Allow authenticated users to insert entries" ON entries
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update entries
CREATE POLICY "Allow authenticated users to update entries" ON entries
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete entries
CREATE POLICY "Allow authenticated users to delete entries" ON entries
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Optional: Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entries_updated_at
  BEFORE UPDATE ON entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

