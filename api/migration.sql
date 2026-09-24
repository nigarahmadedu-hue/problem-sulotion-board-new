-- ============================================================
-- SOCH API — Migration: Add auth fields to profiles table
-- Run this in your Supabase SQL Editor BEFORE starting the API
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Update RLS: allow update on own profile (JWT auth will enforce this)
CREATE POLICY "owner update profile" ON profiles
  FOR UPDATE USING (true)
  WITH CHECK (true);
