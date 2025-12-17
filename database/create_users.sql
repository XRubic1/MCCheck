-- SQL Script to Create Users for MC App
-- Run this in your Supabase SQL Editor

-- Insert single user
INSERT INTO users (username) VALUES ('admin');

-- Insert multiple users at once
INSERT INTO users (username) VALUES 
  ('admin'),
  ('user1'),
  ('user2'),
  ('operator'),
  ('checker');

-- Insert user with explicit timestamp (optional)
INSERT INTO users (username, created_at) 
VALUES ('manager', NOW());

-- Bulk insert from a list (example with 10 users)
INSERT INTO users (username) VALUES 
  ('admin'),
  ('user1'),
  ('user2'),
  ('user3'),
  ('user4'),
  ('user5'),
  ('operator1'),
  ('operator2'),
  ('checker1'),
  ('checker2');

-- View all users
SELECT * FROM users ORDER BY created_at DESC;

-- Delete a user (if needed)
-- DELETE FROM users WHERE username = 'username_to_delete';

-- Update a username (if needed)
-- UPDATE users SET username = 'new_username' WHERE username = 'old_username';




