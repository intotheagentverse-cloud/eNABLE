-- Run this SQL in Supabase SQL Editor to manually confirm both test users
-- This bypasses the email confirmation requirement

UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email IN ('james.tendulkar@gmail.com', 'maxine.mustermann@gmail.com');
