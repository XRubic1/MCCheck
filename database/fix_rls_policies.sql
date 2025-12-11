-- Fix RLS Policies for MC App
-- The current policies require Supabase Auth, but we're using username-only authentication
-- Run this SQL in your Supabase SQL Editor to fix the policies

-- Drop existing policies for entries table
DROP POLICY IF EXISTS "Allow authenticated users to read entries" ON entries;
DROP POLICY IF EXISTS "Allow authenticated users to insert entries" ON entries;
DROP POLICY IF EXISTS "Allow authenticated users to update entries" ON entries;
DROP POLICY IF EXISTS "Allow authenticated users to delete entries" ON entries;

-- Create new policies that allow public access (using anon key)
-- This works because we're using the anon key and validating users in the application

-- Allow public read access to entries
CREATE POLICY "Allow public read access to entries" ON entries
  FOR SELECT
  USING (true);

-- Allow public insert access to entries
CREATE POLICY "Allow public insert access to entries" ON entries
  FOR INSERT
  WITH CHECK (true);

-- Allow public update access to entries
CREATE POLICY "Allow public update access to entries" ON entries
  FOR UPDATE
  USING (true);

-- Allow public delete access to entries
CREATE POLICY "Allow public delete access to entries" ON entries
  FOR DELETE
  USING (true);

-- Verify policies are created
SELECT * FROM pg_policies WHERE tablename = 'entries';

