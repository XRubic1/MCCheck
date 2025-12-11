-- SQL Script to Delete All MC Check Entries
-- WARNING: This will permanently delete ALL entries from the entries table
-- Run this in your Supabase SQL Editor

-- Delete all entries
DELETE FROM entries;

-- Optional: Reset the sequence (if you want to start ID from 1 again)
-- ALTER SEQUENCE entries_id_seq RESTART WITH 1;

-- Verify deletion (should return 0 rows)
SELECT COUNT(*) as remaining_entries FROM entries;

